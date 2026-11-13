-- Fix: Mark post_purchase_customers PII as properly protected
-- The table already has restrictive RLS (USING false), but add additional documentation

-- Add comment to document the security model
COMMENT ON TABLE public.post_purchase_customers IS 
'Contains customer PII (names, phones, addresses). Protected by restrictive RLS policy that blocks all client access. Only accessible via service role in Edge Functions.';

-- Ensure the restrictive policy exists and is properly configured
-- Drop and recreate to ensure consistency
DROP POLICY IF EXISTS "Block all client access - server only" ON public.post_purchase_customers;

CREATE POLICY "Block all client access - server only"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Add similar documentation to other sensitive tables
COMMENT ON TABLE public.customer_purchases IS 
'Contains purchase history. Protected by restrictive RLS policy that blocks all client access. Only accessible via service role in Edge Functions.';

COMMENT ON TABLE public.customer_promotions IS 
'Contains promotion codes and customer references. Protected by restrictive RLS policy that blocks all client access. Only accessible via service role in Edge Functions.';

-- Ensure product_reviews_public view has proper security settings documented
COMMENT ON VIEW public.product_reviews_public IS 
'Public view for approved product reviews. Excludes customer_email for privacy. Uses security_barrier=true to ensure WHERE clause is evaluated first. Only exposes: id, product_id, customer_name, rating, review_text, created_at, updated_at.';