-- Fix: Block direct SELECT on product_reviews to protect customer_email
-- The product_reviews_public view (which excludes customer_email) should be used instead

-- Drop the current SELECT policy that exposes all columns including customer_email
DROP POLICY IF EXISTS "Allow SELECT on approved reviews only" ON public.product_reviews;

-- Create a restrictive SELECT policy that blocks all direct table access
-- This forces frontend to use the product_reviews_public view which excludes customer_email
CREATE POLICY "Block direct SELECT - use public view"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (false);

-- Grant SELECT on the public view (which excludes customer_email)
GRANT SELECT ON public.product_reviews_public TO anon;
GRANT SELECT ON public.product_reviews_public TO authenticated;