-- Fix INSERT policy for review_images to also bypass RLS on product_reviews
-- We'll create a helper function for this

-- Create helper function to check if review is recent (within 1 hour)
CREATE OR REPLACE FUNCTION public.is_review_recent(review_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result boolean;
BEGIN
  -- Temporarily bypass RLS
  PERFORM set_config('row_security.force', 'off', true);
  
  SELECT EXISTS (
    SELECT 1 FROM public.product_reviews pr
    WHERE pr.id = review_id 
      AND pr.created_at > (now() - interval '1 hour')
  ) INTO result;
  
  RETURN COALESCE(result, false);
END;
$$;

-- Create helper function to count images for a review
CREATE OR REPLACE FUNCTION public.count_review_images(review_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  img_count integer;
BEGIN
  -- This doesn't need RLS bypass since review_images SELECT is allowed
  SELECT count(*)::integer INTO img_count
  FROM public.review_images ri
  WHERE ri.review_id = count_review_images.review_id;
  
  RETURN COALESCE(img_count, 0);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_review_recent(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.count_review_images(uuid) TO anon, authenticated, service_role;

-- Drop and recreate the INSERT policy using the helper functions
DROP POLICY IF EXISTS "Can upload images for recent reviews with limit" ON public.review_images;

CREATE POLICY "Can upload images for recent reviews with limit"
ON public.review_images
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (
  is_review_recent(review_id) 
  AND count_review_images(review_id) < 5
);