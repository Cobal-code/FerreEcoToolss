-- Recreate the product_reviews_public view with security_invoker = on
-- This ensures the view uses the caller's permissions when querying the underlying table
DROP VIEW IF EXISTS public.product_reviews_public;

CREATE VIEW public.product_reviews_public 
WITH (security_invoker = on)
AS SELECT 
    id,
    product_id,
    customer_name,
    rating,
    review_text,
    is_approved,
    created_at,
    updated_at
FROM public.product_reviews;

-- Grant SELECT permission to anon and authenticated roles
GRANT SELECT ON public.product_reviews_public TO anon;
GRANT SELECT ON public.product_reviews_public TO authenticated;

COMMENT ON VIEW public.product_reviews_public IS 'Public view of product reviews that excludes customer_email for privacy. Uses security_invoker=on to inherit RLS from product_reviews table.';