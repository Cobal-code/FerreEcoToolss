// Shared CORS configuration for edge functions
// Restricts access to known application domains for security

// Primary production domain
const PRODUCTION_DOMAIN = 'https://ferreecotools.lovable.app';

// Allowed exact origins
const ALLOWED_ORIGINS = [
  PRODUCTION_DOMAIN,
  'http://localhost:5173', // Local development
  'http://localhost:8080', // Alternative local dev port
  'http://localhost:3000', // Common dev port
];

// Allowed origin patterns (for dynamic preview URLs)
const ALLOWED_PATTERNS = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/, // All lovable.app subdomains
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/, // All lovableproject.com subdomains
];

/**
 * Check if an origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // Check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  
  // Check patterns
  return ALLOWED_PATTERNS.some(pattern => pattern.test(origin));
}

/**
 * Get CORS headers based on the request origin
 * Falls back to the primary production domain if origin not in allowed list
 */
export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin');
  
  // Use the origin if allowed, otherwise fall back to production domain
  const allowedOrigin = isOriginAllowed(origin) ? origin! : PRODUCTION_DOMAIN;
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handle CORS preflight request
 */
export function handleCorsPreflightRequest(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }
  return null;
}
