-- Fix: Block direct SELECT on product_reviews table to protect customer_email
-- All access should go through the product_reviews_public view which excludes customer_email

-- Step 1: Drop the current permissive SELECT policy
DROP POLICY IF EXISTS "Allow SELECT for approved reviews only" ON public.product_reviews;

-- Step 2: Create a restrictive policy that blocks all direct SELECT access
-- This forces clients to use the product_reviews_public view instead
CREATE POLICY "Block direct SELECT - use public view"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (false);

-- The product_reviews_public view (security_invoker=on) needs access to the base table.
-- Since views with security_invoker run as the calling user (anon/authenticated),
-- and we're blocking SELECT for those roles, we need a different approach.

-- Step 3: Instead, we'll use a SECURITY DEFINER function approach
-- Or, we recreate the view with security_barrier and security_definer properties

-- Actually, the cleanest solution is:
-- 1. Block direct SELECT (done above)
-- 2. Recreate the view WITHOUT security_invoker so it runs as the view owner (postgres)
-- This way the view can access the base table while direct queries cannot

DROP VIEW IF EXISTS public.product_reviews_public;

CREATE VIEW public.product_reviews_public
WITH (security_barrier = true)
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

-- Grant SELECT on the view to public roles
GRANT SELECT ON public.product_reviews_public TO anon;
GRANT SELECT ON public.product_reviews_public TO authenticated;

-- IMPORTANT: The view does NOT include customer_email in the SELECT list,
-- so even though the view can access the base table, it never exposes the email.