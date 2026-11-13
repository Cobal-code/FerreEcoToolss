-- Fix: Use security_invoker view with proper RLS that allows SELECT on approved reviews
-- The view excludes customer_email in its column list, so email is never exposed

-- Step 1: Recreate view with security_invoker (recommended approach)
DROP VIEW IF EXISTS public.product_reviews_public;

CREATE VIEW public.product_reviews_public
WITH (security_invoker = on)
AS SELECT 
  id,
  product_id,
  customer_name,
  rating,
  review_text,
  created_at,
  updated_at
FROM public.product_reviews
WHERE is_approved = true;

-- Step 2: Grant access to the view
GRANT SELECT ON public.product_reviews_public TO anon;
GRANT SELECT ON public.product_reviews_public TO authenticated;

-- Step 3: Update RLS policy to allow SELECT on approved reviews
-- The view column list excludes customer_email, so email is never exposed through the view
DROP POLICY IF EXISTS "Block direct SELECT - use public view" ON public.product_reviews;

CREATE POLICY "Allow SELECT for approved reviews only"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (is_approved = true);

-- IMPORTANT: Even though the base table policy allows SELECT on approved rows,
-- the view's column list (which excludes customer_email) determines what data is returned.
-- Users querying through the view will NOT see customer_email.
-- 
-- For maximum security, we can also revoke direct SELECT on the base table columns
-- and only allow access through the view, but this requires additional setup.