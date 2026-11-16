-- Fotos de reseñas: deja el bucket, las funciones auxiliares y las políticas RLS en un estado
-- conocido y consistente. Es idempotente: se puede ejecutar varias veces sin efectos adicionales.
--
-- Flujo que soporta (ReviewForm.tsx, rol anon):
--   1) La Edge Function submit-review crea la reseña y devuelve su id.
--   2) El navegador sube cada foto a storage: review-images/<review_id>/<uuid>.<ext>
--   3) El navegador inserta una fila en public.review_images (review_id, image_url).
--   4) ReviewsList lee review_images; solo se ven las fotos de reseñas aprobadas.

-- 1) Bucket público con límites (la lectura por URL pública no pasa por RLS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images', 'review-images', true, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2) Funciones auxiliares (SECURITY DEFINER: leen product_reviews aunque anon no tenga SELECT)
CREATE OR REPLACE FUNCTION public.is_review_approved(review_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.product_reviews pr
    WHERE pr.id = review_id AND pr.is_approved = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_review_recent(review_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.product_reviews pr
    WHERE pr.id = review_id
      AND pr.created_at > (now() - interval '1 hour')
  );
$$;

CREATE OR REPLACE FUNCTION public.count_review_images(review_id uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::integer FROM public.review_images ri WHERE ri.review_id = count_review_images.review_id;
$$;

GRANT EXECUTE ON FUNCTION public.is_review_approved(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_review_recent(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.count_review_images(uuid) TO anon, authenticated, service_role;

-- 3) Tabla review_images: RLS activa y permisos de tabla
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.review_images TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can insert review images" ON public.review_images;
DROP POLICY IF EXISTS "Can only upload images for pending reviews with limit" ON public.review_images;
DROP POLICY IF EXISTS "Can upload images for recent reviews with limit" ON public.review_images;
CREATE POLICY "Can upload images for recent reviews with limit"
ON public.review_images
AS PERMISSIVE FOR INSERT TO anon, authenticated
WITH CHECK (
  public.is_review_recent(review_id)
  AND public.count_review_images(review_id) < 5
);

DROP POLICY IF EXISTS "Anyone can view images of approved reviews" ON public.review_images;
CREATE POLICY "Anyone can view images of approved reviews"
ON public.review_images
AS PERMISSIVE FOR SELECT TO anon, authenticated
USING (public.is_review_approved(review_id));

-- Sin políticas de UPDATE/DELETE para anon: quedan denegadas por RLS.

-- 4) storage.objects del bucket review-images
DROP POLICY IF EXISTS "Anyone can upload review images" ON storage.objects;
DROP POLICY IF EXISTS "Restricted review image uploads" ON storage.objects;
CREATE POLICY "Restricted review image uploads"
ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'review-images'
  AND (
    lower(right(name, 4)) = ANY (ARRAY['.jpg', '.png', '.gif'])
    OR lower(right(name, 5)) = ANY (ARRAY['.jpeg', '.webp'])
  )
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
  AND public.is_review_recent(
    (substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'))::uuid
  )
  AND public.count_review_images(
    (substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'))::uuid
  ) < 5
);

DROP POLICY IF EXISTS "Public can view review images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view review images" ON storage.objects;
DROP POLICY IF EXISTS "View review images of approved reviews" ON storage.objects;
CREATE POLICY "View review images of approved reviews"
ON storage.objects
FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'review-images'
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
  AND public.is_review_approved(
    (substring(name from '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'))::uuid
  )
);
