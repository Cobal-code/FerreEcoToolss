/**
 * Simple in-memory rate limiter for edge functions.
 * Uses an in-memory Map for rate limiting within a single function invocation.
 * Note: This is a best-effort rate limiter - in serverless environments,
 * state is not persisted between invocations.
 */

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store (resets on each cold start, but provides some protection)
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export async function checkRateLimit(
  req: Request,
  identifier: string,
  maxRequests: number = 10
): Promise<RateLimitResult> {
  try {
    // Get client IP from headers (Supabase edge functions provide this)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitKey = `${identifier}:${clientIp}`;
    const now = Date.now();
    
    // Get current rate limit data
    const entry = rateLimitStore.get(rateLimitKey);
    
    let count = 1;
    let windowStart = now;
    
    if (entry) {
      // Check if we're still in the same window
      if (now - entry.windowStart < RATE_LIMIT_WINDOW_MS) {
        count = entry.count + 1;
        windowStart = entry.windowStart;
      }
      // If window has passed, start fresh (count = 1, windowStart = now)
    }
    
    // Update the rate limit entry
    rateLimitStore.set(rateLimitKey, { count, windowStart });
    
    // Clean up old entries periodically (to prevent memory leaks)
    if (rateLimitStore.size > 1000) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
          rateLimitStore.delete(key);
        }
      }
    }
    
    const allowed = count <= maxRequests;
    const remaining = Math.max(0, maxRequests - count);
    const resetIn = Math.max(0, RATE_LIMIT_WINDOW_MS - (now - windowStart));
    
    return { allowed, remaining, resetIn };
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    console.error('Rate limiter error:', error);
    return { allowed: true, remaining: 0, resetIn: 0 };
  }
}

export function createRateLimitResponse(corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: "Demasiadas solicitudes. Por favor espera un momento e intenta de nuevo." 
    }),
    {
      status: 429,
      headers: { 
        "Content-Type": "application/json",
        "Retry-After": "60",
        ...corsHeaders 
      },
    }
  );
}
