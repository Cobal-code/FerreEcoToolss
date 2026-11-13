-- =====================================================
-- FIX REVIEW_IMAGES: Use function for approval check
-- =====================================================

-- 1. Create a security definer function to check if a review is approved
CREATE OR REPLACE FUNCTION public.is_review_approved(review_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.product_reviews pr
        WHERE pr.id = review_id AND pr.is_approved = true
    );
$$;

-- 2. Drop the old SELECT policy that uses subquery
DROP POLICY IF EXISTS "Anyone can view images of approved reviews" ON public.review_images;

-- 3. Create new policy using the security definer function
CREATE POLICY "Anyone can view images of approved reviews"
ON public.review_images
FOR SELECT
TO anon, authenticated
USING (public.is_review_approved(review_id));

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.is_review_approved(uuid) TO anon, authenticated;