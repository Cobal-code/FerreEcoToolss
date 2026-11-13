-- Fix: Recreate view with security_definer to bypass RLS on base table
-- This allows the view to return approved reviews without exposing customer_email

DROP VIEW IF EXISTS public.product_reviews_public;

CREATE VIEW public.product_reviews_public
WITH (security_barrier = true)
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

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.product_reviews_public TO anon;
GRANT SELECT ON public.product_reviews_public TO authenticated;

-- Note: security_barrier = true ensures the WHERE clause is evaluated first
-- This prevents any potential leakage through user-defined functions
-- The view owner (postgres/supabase_admin) has full access to the base table