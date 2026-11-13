-- Fix: Allow image uploads for reviews regardless of approval status
-- The issue is that auto-approved reviews (is_approved = true) couldn't have images uploaded
-- We only need to check that the review exists and was created within the last hour

DROP POLICY IF EXISTS "Can only upload images for pending reviews with limit" ON public.review_images;

CREATE POLICY "Can upload images for recent reviews with limit"
ON public.review_images
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Review must exist and be created within the last hour
  EXISTS (
    SELECT 1 FROM product_reviews
    WHERE product_reviews.id = review_images.review_id
      AND product_reviews.created_at > (now() - interval '1 hour')
  )
  -- Limit to 5 images per review
  AND (
    SELECT count(*) FROM review_images ri
    WHERE ri.review_id = review_images.review_id
  ) < 5
);