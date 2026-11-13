
-- 1) Clean up helper functions: remove misleading set_config no-ops
CREATE OR REPLACE FUNCTION public.is_review_approved(review_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.product_reviews pr
    WHERE pr.id = review_id AND pr.is_approved = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_review_recent(review_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.product_reviews pr
    WHERE pr.id = review_id
      AND pr.created_at > (now() - interval '1 hour')
  );
$$;

-- 2) Drop duplicate SELECT policy on storage.objects for review-images
DROP POLICY IF EXISTS "Public can view review images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view review images" ON storage.objects;

-- 3) Restrict listing to images of approved reviews (public file URLs bypass RLS and still work)
CREATE POLICY "View review images of approved reviews"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'review-images'
  AND (name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/')
  AND public.is_review_approved(
    (substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'))::uuid
  )
);

-- 4) Tighten INSERT policy: require recent review id as folder prefix and enforce 5 image limit
DROP POLICY IF EXISTS "Restricted review image uploads" ON storage.objects;

CREATE POLICY "Restricted review image uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'review-images'
  AND (
    lower(right(name, 4)) = ANY (ARRAY['.jpg','.png','.gif'])
    OR lower(right(name, 5)) = ANY (ARRAY['.jpeg','.webp'])
  )
  AND (name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/')
  AND public.is_review_recent(
    (substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'))::uuid
  )
  AND public.count_review_images(
    (substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'))::uuid
  ) < 5
);
