-- Fix: Update storage policies with proper restrictions
-- First, drop the overly permissive upload policy
DROP POLICY IF EXISTS "Anyone can upload review images" ON storage.objects;

-- Create a restrictive upload policy with file type validation
CREATE POLICY "Restricted review image uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'review-images' AND
  (
    LOWER(RIGHT(name, 4)) IN ('.jpg', '.png', '.gif') OR
    LOWER(RIGHT(name, 5)) IN ('.jpeg', '.webp')
  )
);

-- Ensure public read access for review images (bucket is public)
DROP POLICY IF EXISTS "Public can view review images" ON storage.objects;
CREATE POLICY "Public can view review images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-images');