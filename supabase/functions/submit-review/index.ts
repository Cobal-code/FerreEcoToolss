import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limiter.ts";
import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Input validation schema - NO EMAIL FIELD (security requirement)
// Supports 0.5 star increments (e.g., 3.5, 4, 4.5)
const reviewSchema = z.object({
  productId: z.number().int().positive(),
  customerName: z.string().trim().min(2).max(100),
  rating: z.number().min(0.5).max(5).refine(
    (val) => val % 0.5 === 0,
    { message: "Rating must be in 0.5 increments" }
  ),
  reviewText: z.string().trim().min(10).max(1000),
});

// Spam detection configuration
const SPAM_CONFIG = {
  minCharacters: 15,
  maxRepeatedWords: 3,
  spamKeywords: [
    // Promotional spam
    "gratis", "free", "click here", "haz clic", "gana dinero", "make money",
    "oferta especial", "special offer", "descuento increíble", "amazing discount",
    "compra ahora", "buy now", "limited time", "tiempo limitado",
    // Phishing/scam
    "bitcoin", "crypto", "criptomoneda", "inversión", "investment",
    "casino", "apuesta", "bet", "lottery", "lotería",
    // Adult content
    "viagra", "cialis", "xxx", "adult", "adulto",
    // Generic spam
    "nigerian prince", "herencia", "inheritance", "lottery winner",
    "congratulations you won", "felicidades has ganado",
    // Link spam indicators
    "visita mi", "visit my", "check out my", "mira mi web",
  ],
  // URL patterns to detect
  urlPatterns: [
    /https?:\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /[a-z0-9]+\.(com|net|org|io|xyz|tk|ml|ga|cf|gq|info|biz|co)\b/gi,
  ],
};

// HTML encode for email content
const htmlEncode = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

interface SpamCheckResult {
  isSpam: boolean;
  reasons: string[];
}

/**
 * Check if review text is spam
 */
function detectSpam(text: string, customerName: string): SpamCheckResult {
  const reasons: string[] = [];
  const lowerText = text.toLowerCase();
  const lowerName = customerName.toLowerCase();

  // 1. Check minimum length
  if (text.length < SPAM_CONFIG.minCharacters) {
    reasons.push(`Texto muy corto (${text.length} caracteres)`);
  }

  // 2. Check for external links
  for (const pattern of SPAM_CONFIG.urlPatterns) {
    if (pattern.test(text)) {
      reasons.push("Contiene enlaces externos");
      break;
    }
  }

  // 3. Check for spam keywords
  const foundKeywords: string[] = [];
  for (const keyword of SPAM_CONFIG.spamKeywords) {
    if (lowerText.includes(keyword.toLowerCase()) || lowerName.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }
  if (foundKeywords.length > 0) {
    reasons.push(`Palabras sospechosas: ${foundKeywords.slice(0, 3).join(", ")}`);
  }

  // 4. Check for repeated words (spam indicator)
  const words = lowerText.split(/\s+/).filter(w => w.length > 3);
  const wordCount: Record<string, number> = {};
  for (const word of words) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }
  const repeatedWords = Object.entries(wordCount)
    .filter(([_, count]) => count > SPAM_CONFIG.maxRepeatedWords)
    .map(([word]) => word);
  if (repeatedWords.length > 0) {
    reasons.push(`Texto repetitivo: "${repeatedWords[0]}" repetido muchas veces`);
  }

  // 5. Check for excessive caps (shouting) - only flag if VERY excessive
  // Many legitimate users write in caps, so we're lenient here
  const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (text.length > 50 && upperCaseRatio > 0.85) {
    reasons.push("Uso excesivo de mayúsculas");
  }

  // 6. Check for suspicious patterns (all same character, gibberish)
  if (/(.)\1{5,}/.test(text)) {
    reasons.push("Caracteres repetidos sospechosos");
  }

  return {
    isSpam: reasons.length > 0,
    reasons,
  };
}

/**
 * Send spam notification email to admin - NO customer email included
 */
async function sendSpamNotification(
  review: { customerName: string; rating: number; reviewText: string; productId: number },
  spamReasons: string[]
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping spam notification");
    return;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
          .review-content { background-color: white; padding: 15px; border: 1px solid #ddd; margin: 15px 0; }
          .reason { background-color: #f8d7da; padding: 8px 12px; margin: 5px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Reseña Bloqueada por Spam</h1>
          </div>
          
          <div class="content">
            <div class="warning">
              <strong>Esta reseña fue detectada como spam y NO fue publicada.</strong>
            </div>

            <h3>📋 Detalles de la Reseña</h3>
            <div class="review-content">
              <p><strong>Producto ID:</strong> ${review.productId}</p>
              <p><strong>Nombre:</strong> ${htmlEncode(review.customerName)}</p>
              <p><strong>Calificación:</strong> ${"⭐".repeat(review.rating)}</p>
              <p><strong>Texto:</strong></p>
              <blockquote style="background: #f5f5f5; padding: 10px; border-left: 3px solid #ccc;">
                ${htmlEncode(review.reviewText)}
              </blockquote>
            </div>

            <h3>🚫 Razones de Bloqueo</h3>
            ${spamReasons.map(reason => `<div class="reason">• ${htmlEncode(reason)}</div>`).join("")}

            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Si consideras que esta reseña es legítima, puedes aprobarla manualmente desde la base de datos.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Notificación automática de FerreEcoTools</p>
            <p>Fecha: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FerreEcoTools <onboarding@resend.dev>",
        to: ["ferreecotools@gmail.com"],
        subject: `⚠️ Spam Detectado - Reseña Bloqueada`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to send spam notification:", errorData);
    } else {
      console.log("Spam notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending spam notification:", error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Rate limiting - 5 reviews per minute per IP
  const rateLimit = await checkRateLimit(req, "submit_review", 5);
  if (!rateLimit.allowed) {
    console.warn("Rate limit exceeded for review submission");
    return createRateLimitResponse(corsHeaders);
  }

  try {
    // Parse and validate input
    const rawData = await req.json();
    const validationResult = reviewSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Datos de la reseña inválidos. Verifica la información.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { productId, customerName, rating, reviewText } = validationResult.data;

    // Spam detection
    const spamCheck = detectSpam(reviewText, customerName);

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Insert review - NO EMAIL STORED (security requirement)
    const { data: review, error: insertError } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        customer_name: customerName.trim(),
        // customer_email is NEVER stored - security requirement
        rating,
        review_text: reviewText.trim(),
        is_approved: !spamCheck.isSpam, // Auto-approve if not spam
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error("Failed to save review");
    }

    console.log(`Review ${review.id} saved. Spam: ${spamCheck.isSpam}, Reasons: ${spamCheck.reasons.join(", ")}`);

    // If spam detected, send notification to admin (don't await to avoid delays)
    if (spamCheck.isSpam) {
      sendSpamNotification(
        { customerName, rating, reviewText, productId },
        spamCheck.reasons
      ).catch(console.error);

      // Return success but indicate review is pending (user doesn't know it's spam)
      return new Response(
        JSON.stringify({
          success: true,
          published: false,
          message: "Tu reseña ha sido recibida y será revisada pronto.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Review is valid and published
    return new Response(
      JSON.stringify({
        success: true,
        published: true,
        message: "¡Gracias! Tu reseña ha sido publicada.",
        reviewId: review.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in submit-review function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "No se pudo enviar la reseña. Intenta de nuevo.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);
