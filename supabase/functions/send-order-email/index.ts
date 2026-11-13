import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limiter.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { validateCartItems, calculateTotal } from "../_shared/products.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Input validation schemas
const orderItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().trim().min(1).max(200),
  price: z.number().min(0),
  quantity: z.number().int().positive().max(100),
});

const customerInfoSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(100),
  notes: z.string().trim().max(500).optional(),
});

const orderEmailRequestSchema = z.object({
  customerInfo: customerInfoSchema,
  cart: z.array(orderItemSchema).min(1).max(50),
  total: z.number().min(0),
});

// HTML encode to prevent XSS in email content
const htmlEncode = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  // Rate limiting check - 10 requests per minute for order emails
  const rateLimit = await checkRateLimit(req, 'order_email', 10);
  if (!rateLimit.allowed) {
    console.warn("Rate limit exceeded for order email");
    return createRateLimitResponse(corsHeaders);
  }

  try {
    // Parse and validate input
    const rawData = await req.json();
    const validationResult = orderEmailRequestSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Datos del pedido inválidos. Por favor verifica la información." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { customerInfo, cart } = validationResult.data;

    // Validate cart items with server-side prices (prevents price manipulation)
    const validatedCart = validateCartItems(cart.map(item => ({ 
      id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
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

    // Calculate total from validated server-side prices
    const serverTotal = calculateTotal(validatedCart);

    // Sanitize all user inputs
    const safeCustomerInfo = {
      fullName: htmlEncode(customerInfo.fullName),
      phone: htmlEncode(customerInfo.phone),
      address: htmlEncode(customerInfo.address),
      city: htmlEncode(customerInfo.city),
      notes: customerInfo.notes ? htmlEncode(customerInfo.notes) : undefined,
    };

    console.log("Processing order email for:", safeCustomerInfo.fullName, "Total:", serverTotal);

    // Formatear precio en pesos colombianos
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(price);
    };

    // Construir lista de productos using validated cart with server prices
    const productsList = validatedCart
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${htmlEncode(item.name)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #4CAF50; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; background-color: white; }
            th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
            .total-row { background-color: #f0f0f0; font-weight: bold; font-size: 18px; }
            .info-item { padding: 8px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 Nuevo Pedido - Pago Contra Entrega</h1>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="section-title">📋 Información del Cliente</div>
                <div class="info-item">
                  <span class="info-label">Nombre:</span> ${safeCustomerInfo.fullName}
                </div>
                <div class="info-item">
                  <span class="info-label">Teléfono:</span> ${safeCustomerInfo.phone}
                </div>
                <div class="info-item">
                  <span class="info-label">Dirección:</span> ${safeCustomerInfo.address}
                </div>
                <div class="info-item">
                  <span class="info-label">Ciudad:</span> ${safeCustomerInfo.city}
                </div>
                ${
                  safeCustomerInfo.notes
                    ? `
                <div class="info-item">
                  <span class="info-label">Notas adicionales:</span> ${safeCustomerInfo.notes}
                </div>
                `
                    : ""
                }
              </div>

              <div class="section">
                <div class="section-title">🛍️ Detalles del Pedido</div>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th style="text-align: center;">Cantidad</th>
                      <th style="text-align: right;">Precio Unit.</th>
                      <th style="text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productsList}
                    <tr class="total-row">
                      <td colspan="3" style="padding: 15px; text-align: right;">TOTAL A PAGAR:</td>
                      <td style="padding: 15px; text-align: right; color: #4CAF50;">${formatPrice(serverTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="section" style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
                <strong>💰 Método de Pago:</strong> Contra Entrega (COD)
                <br>
                <small>El cliente pagará ${formatPrice(serverTotal)} al momento de recibir el pedido.</small>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>Este es un correo automático generado por FerreEcoTools</p>
              <p>Fecha: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar correo a la tienda usando la API de Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FerreEcoTools Pedidos <onboarding@resend.dev>",
        to: ["ferreecotools@gmail.com"],
        subject: `Nuevo Pedido COD - ${safeCustomerInfo.fullName} - ${formatPrice(serverTotal)}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error("Email service error");
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "No se pudo enviar el correo. Por favor intenta de nuevo." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
