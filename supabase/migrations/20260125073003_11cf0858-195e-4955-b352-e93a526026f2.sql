-- ============================================
-- SECURITY FIX 1: Block direct access to product_reviews table
-- Force use of product_reviews_public view which excludes customer_email
-- ============================================

-- Drop the existing SELECT policy that exposes customer_email
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.product_reviews;

-- Create a policy that blocks all direct SELECT access
-- Users must use the product_reviews_public view instead
CREATE POLICY "Block direct read access - use view instead"
ON public.product_reviews
FOR SELECT
USING (false);

-- ============================================
-- SECURITY FIX 2: Restrict review image uploads
-- Only allow uploads for recent pending reviews with max 5 images
-- ============================================

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert review images" ON public.review_images;

-- Create a secure INSERT policy that validates:
-- 1. The review_id must exist
-- 2. The review must be pending (not yet approved)
-- 3. The review must be recent (created within last hour)
-- 4. Maximum 5 images per review
CREATE POLICY "Can only upload images for pending reviews with limit"
ON public.review_images
FOR INSERT
WITH CHECK (
  -- Check that the review exists, is pending, and is recent
  EXISTS (
    SELECT 1 FROM public.product_reviews 
    WHERE id = review_id 
    AND is_approved = false
    AND created_at > NOW() - INTERVAL '1 hour'
  )
  AND
  -- Limit to 5 images per review
  (
    SELECT COUNT(*) FROM public.review_images ri 
    WHERE ri.review_id = review_images.review_id
  ) < 5
);