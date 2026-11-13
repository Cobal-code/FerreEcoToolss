import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limiter.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Input validation schema
const contactEmailSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es muy largo"),
  email: z.string().trim().email("Email inválido").max(200, "Email muy largo"),
  phone: z.string().trim().max(25, "Teléfono muy largo").optional(),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000, "El mensaje es muy largo"),
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

Deno.serve(async (req: Request): Promise<Response> => {
  console.log("Received contact email request");
  
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  // Rate limiting check - 5 requests per minute for contact form
  const rateLimit = await checkRateLimit(req, 'contact_form', 5);
  if (!rateLimit.allowed) {
    console.warn("Rate limit exceeded for contact form");
    return createRateLimitResponse(corsHeaders);
  }
  
  try {
    // Parse and validate input
    const rawData = await req.json();
    const validationResult = contactEmailSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Datos de contacto inválidos. Por favor verifica la información." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, message } = validationResult.data;
    
    // Sanitize inputs for HTML email
    const safeName = htmlEncode(name);
    const safeEmail = htmlEncode(email);
    const safePhone = phone ? htmlEncode(phone) : undefined;
    const safeMessage = htmlEncode(message);

    console.log("Processing contact form for:", safeName);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF8C00, #FFD700); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #FF8C00; }
          .field-label { font-weight: bold; color: #FF8C00; margin-bottom: 5px; }
          .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔧 Nuevo Mensaje de Contacto</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">👤 Nombre</div>
              <div>${safeName}</div>
            </div>
            <div class="field">
              <div class="field-label">📧 Email</div>
              <div><a href="mailto:${safeEmail}">${safeEmail}</a></div>
            </div>
            ${safePhone ? `
            <div class="field">
              <div class="field-label">📱 Teléfono</div>
              <div>${safePhone}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="field-label">💬 Mensaje</div>
              <div class="message-box">${safeMessage.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FerreEcoTools <onboarding@resend.dev>",
        to: ["ferreecotools@gmail.com"],
        subject: `Nuevo mensaje de contacto de ${safeName}`,
        html: emailHtml,
        reply_to: email, // Use original email for reply-to (Resend validates this)
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error("Email service error");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "No se pudo enviar el mensaje. Por favor intenta de nuevo." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
