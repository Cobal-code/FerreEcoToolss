-- Step 1: Drop the policy that depends on is_review_approved
DROP POLICY IF EXISTS "Anyone can view images of approved reviews" ON public.review_images;

-- Step 2: Drop the old function
DROP FUNCTION IF EXISTS public.is_review_approved(uuid);

-- Step 3: Recreate function with RLS bypass using SET LOCAL
CREATE OR REPLACE FUNCTION public.is_review_approved(review_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result boolean;
BEGIN
  -- Temporarily bypass RLS for this query only
  -- set_config with 'true' means it only applies to current transaction
  PERFORM set_config('row_security.force', 'off', true);
  
  SELECT EXISTS (
    SELECT 1 FROM public.product_reviews pr
    WHERE pr.id = review_id AND pr.is_approved = true
  ) INTO result;
  
  RETURN COALESCE(result, false);
END;
$$;

-- Step 4: Grant execute to all necessary roles
GRANT EXECUTE ON FUNCTION public.is_review_approved(uuid) TO anon, authenticated, service_role;

-- Step 5: Recreate the SELECT policy for review_images
CREATE POLICY "Anyone can view images of approved reviews"
ON public.review_images
AS PERMISSIVE
FOR SELECT
TO anon, authenticated
USING (is_review_approved(review_id));