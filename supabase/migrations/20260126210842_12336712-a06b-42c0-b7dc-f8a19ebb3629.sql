-- Fix: Change review_images SELECT policy from RESTRICTIVE to PERMISSIVE
-- RESTRICTIVE policies block access, we need PERMISSIVE to grant access

DROP POLICY IF EXISTS "Anyone can view images of approved reviews" ON public.review_images;

CREATE POLICY "Anyone can view images of approved reviews"
ON public.review_images
AS PERMISSIVE
FOR SELECT
USING (is_review_approved(review_id));