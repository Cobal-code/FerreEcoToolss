import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limiter.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateCartItems, calculateTotal } from "../_shared/products.ts";
import { encryptPII } from "../_shared/encryption.ts";

// Input validation schemas
const cartItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  price: z.number().min(0),
  quantity: z.number().int().positive().max(100),
  category: z.string().trim().min(1).max(100),
});

const customerDataSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20).regex(/^[\d+\-\s()]+$/, "Teléfono inválido"),
  address: z.string().trim().min(5).max(500),
  city: z.string().trim().min(2).max(100),
  acceptsPromotions: z.boolean(),
});

const relatedProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(100),
});

const requestBodySchema = z.object({
  customerData: customerDataSchema,
  cart: z.array(cartItemSchema).min(1).max(50),
  relatedProducts: z.array(relatedProductSchema).max(20),
});

// HTML encode to prevent XSS in any data that might be used in HTML contexts
const htmlEncode = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const generatePromoCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FERRE';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  // Rate limiting check - 10 requests per minute for customer save
  const rateLimit = await checkRateLimit(req, 'save_customer', 10);
  if (!rateLimit.allowed) {
    console.warn("Rate limit exceeded for save-cod-customer");
    return createRateLimitResponse(corsHeaders);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const encryptionKey = Deno.env.get("PII_ENCRYPTION_KEY")!;
    
    if (!encryptionKey) {
      console.error("PII_ENCRYPTION_KEY not configured");
      throw new Error("Encryption configuration error");
    }

    // Parse and validate input
    const rawData = await req.json();
    const validationResult = requestBodySchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Datos inválidos. Por favor verifica la información e intenta de nuevo." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { customerData, cart, relatedProducts } = validationResult.data;

    // Validate cart items with server-side prices (prevents price manipulation)
    const validatedCart = validateCartItems(cart.map(item => ({ 
      id: item.id,
      quantity: item.quantity 
    })));
    
    if (!validatedCart) {
      console.error("Invalid product IDs in cart");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Algunos productos no son válidos. Por favor actualiza tu carrito." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize string inputs for database storage
    const sanitizedCustomerData = {
      fullName: htmlEncode(customerData.fullName),
      phone: customerData.phone, // Already validated by regex in schema
      address: htmlEncode(customerData.address),
      city: htmlEncode(customerData.city),
      acceptsPromotions: customerData.acceptsPromotions,
    };
    
    // Encrypt sensitive PII data before storage
    const encryptedPhone = await encryptPII(supabase, sanitizedCustomerData.phone, encryptionKey);
    const encryptedAddress = await encryptPII(supabase, sanitizedCustomerData.address, encryptionKey);

    // Always create a new customer record per checkout.
    // Previously we deduplicated by full_name + city, which allowed anyone
    // who guessed another customer's name+city to overwrite their stored
    // phone/address and hijack promotional WhatsApp messages. Since we
    // cannot verify identity without auth, each submission is treated as
    // a distinct record. Deduplication for analytics can be done offline.
    const { data: newCustomer, error: customerError } = await supabase
      .from("post_purchase_customers")
      .insert({
        full_name: sanitizedCustomerData.fullName,
        city: sanitizedCustomerData.city,
        accepts_promotions: sanitizedCustomerData.acceptsPromotions,
        phone_encrypted: encryptedPhone,
        address_encrypted: encryptedAddress,
      })
      .select("id")
      .single();

    if (customerError) {
      console.error("Error creating customer:", customerError);
      throw new Error("Failed to create customer record");
    }
    const customerId: string = newCustomer.id;
    const acceptsPromotions = sanitizedCustomerData.acceptsPromotions;


    // 2. Guardar las compras using validated server-side data
    const purchaseRecords = validatedCart.map((item) => ({
      customer_id: customerId,
      product_id: item.id,
      product_name: item.name, // Already validated from server catalog
      product_category: item.category, // Already validated from server catalog
      quantity: item.quantity,
      price: item.price, // Server-side price, not client-provided
    }));

    const { data: purchases, error: purchaseError } = await supabase
      .from("customer_purchases")
      .insert(purchaseRecords)
      .select("id, product_category");

    if (purchaseError) {
      console.error("Error saving purchases:", purchaseError);
      throw new Error("Failed to save purchase records");
    }

    // 3. Generar promociones solo si acepta promociones y hay productos relacionados
    const promotions: { code: string; product: string; discount: number }[] = [];

    if (acceptsPromotions && relatedProducts.length > 0 && purchases.length > 0) {
      // Tomar el primer producto relacionado para la promoción
      const relatedProduct = relatedProducts[0];
      const purchaseId = purchases[0].id;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 días de validez

      const promoCode = generatePromoCode();

      const { error: promoError } = await supabase
        .from("customer_promotions")
        .insert({
          customer_id: customerId,
          purchase_id: purchaseId,
          related_product_id: relatedProduct.id,
          related_product_name: htmlEncode(relatedProduct.name),
          discount_percentage: 10,
          promo_code: promoCode,
          expires_at: expiresAt.toISOString(),
        });

      if (!promoError) {
        promotions.push({
          code: promoCode,
          product: relatedProduct.name,
          discount: 10,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        customerId,
        promotions,
        message: acceptsPromotions
          ? "Cliente guardado con promoción generada"
          : "Cliente guardado sin promociones",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in save-cod-customer:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "No se pudo procesar la solicitud. Por favor intenta de nuevo." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
