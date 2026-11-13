-- Fix: Block direct SELECT access to product_reviews table to prevent customer_email exposure
-- All access should go through the product_reviews_public view which excludes customer_email

-- Step 1: Drop the current SELECT policy that allows reading approved reviews with all columns
DROP POLICY IF EXISTS "Allow SELECT for approved reviews only" ON public.product_reviews;

-- Step 2: Create a restrictive policy that blocks all client SELECT access
-- This forces clients to use the product_reviews_public view instead
CREATE POLICY "Block direct SELECT - use public view"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (false);

-- The product_reviews_public view (security_invoker) will still work because:
-- 1. It has its own GRANT SELECT permissions
-- 2. The service role (used internally) bypasses RLS
-- 3. Edge functions using service_role can still access the full table when needed

-- Note: The INSERT policy "Anyone can submit reviews" remains unchanged
-- to allow customers to submit reviews with their email (stored but never exposed)