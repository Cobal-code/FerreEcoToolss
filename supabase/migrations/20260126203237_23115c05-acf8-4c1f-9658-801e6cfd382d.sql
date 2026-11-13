-- =====================================================
-- COMPLETE SECURITY FIX: ALL REMAINING ISSUES
-- =====================================================

-- 1. Add explicit blocking policies for review_images UPDATE and DELETE
DROP POLICY IF EXISTS "Block public DELETE on review_images" ON public.review_images;
DROP POLICY IF EXISTS "Block public UPDATE on review_images" ON public.review_images;

CREATE POLICY "Block public DELETE on review_images"
ON public.review_images
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

CREATE POLICY "Block public UPDATE on review_images"
ON public.review_images
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 2. Ensure product_reviews SELECT is blocked (all access through RPC)
-- First check if policy exists and drop it
DROP POLICY IF EXISTS "Allow SELECT only approved reviews" ON public.product_reviews;

-- 3. Create a restrictive blocking policy for direct SELECT
CREATE POLICY "Block direct SELECT - use RPC only"
ON public.product_reviews
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

-- 4. Ensure product_reviews_public view access is properly revoked
-- The view should not be directly queryable - use RPC functions instead
REVOKE ALL ON public.product_reviews_public FROM anon, authenticated;