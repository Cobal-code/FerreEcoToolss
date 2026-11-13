-- Fix: Ensure review_images SELECT policy is PERMISSIVE (not RESTRICTIVE)
-- This allows fetching images for approved reviews

-- First, drop the existing RESTRICTIVE policy
DROP POLICY IF EXISTS "Anyone can view images of approved reviews" ON public.review_images;

-- Create as PERMISSIVE to ALLOW access (RESTRICTIVE blocks access)
CREATE POLICY "Anyone can view images of approved reviews"
ON public.review_images
AS PERMISSIVE
FOR SELECT
TO anon, authenticated
USING (is_review_approved(review_id));