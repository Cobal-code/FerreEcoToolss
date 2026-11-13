-- Fix: Ensure product_reviews_public view only shows approved reviews

-- Step 1: Drop the current SELECT policy that blocks all access
DROP POLICY IF EXISTS "Block direct SELECT - use public view" ON public.product_reviews;

-- Step 2: Create a policy that allows SELECT only for approved reviews
-- This enables the security_invoker view to access approved reviews only
CREATE POLICY "Allow SELECT for approved reviews only"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (is_approved = true);

-- Step 3: Recreate the view with proper filtering
-- This ensures only approved reviews are ever returned, even if RLS is bypassed
DROP VIEW IF EXISTS public.product_reviews_public;

CREATE VIEW public.product_reviews_public
WITH (security_invoker = on)
AS SELECT 
  id,
  product_id,
  customer_name,
  rating,
  review_text,
  created_at,
  updated_at
FROM public.product_reviews
WHERE is_approved = true;

-- Note: Removed is_approved column from SELECT since it's always true in this view
-- Note: customer_email is excluded to protect PII

-- Step 4: Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.product_reviews_public TO anon;
GRANT SELECT ON public.product_reviews_public TO authenticated;