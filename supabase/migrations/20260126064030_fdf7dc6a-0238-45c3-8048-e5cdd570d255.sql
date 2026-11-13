-- =====================================================
-- PERMANENT SECURITY FIX FOR PRODUCT REVIEWS
-- =====================================================

-- 1. Drop existing view to recreate with proper security
DROP VIEW IF EXISTS public.product_reviews_public;

-- 2. Recreate the secure public view with explicit column selection
-- Using security_invoker=on so RLS of base table applies
CREATE VIEW public.product_reviews_public
WITH (security_invoker = on, security_barrier = true) AS
SELECT 
    pr.id,
    pr.product_id,
    pr.customer_name,
    pr.rating,
    pr.review_text,
    pr.created_at,
    pr.updated_at
FROM public.product_reviews pr
WHERE pr.is_approved = true;

-- Add comment documenting security purpose
COMMENT ON VIEW public.product_reviews_public IS 
'Secure public view for approved reviews. Excludes customer_email and is_approved columns. 
Uses security_invoker=on to inherit RLS from base table.';

-- 3. Update base table RLS policies for proper security

-- Drop existing policies on product_reviews to recreate correctly
DROP POLICY IF EXISTS "Block direct SELECT - use public view" ON public.product_reviews;
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Deny direct table access" ON public.product_reviews;

-- Policy 1: Allow public SELECT only for approved reviews (for the view to work)
CREATE POLICY "Allow SELECT only approved reviews"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (is_approved = true);

-- Policy 2: Allow INSERT for review submission (rate limited at edge function)
CREATE POLICY "Allow public review submission"
ON public.product_reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
    -- New reviews must start as unapproved
    is_approved = false
    -- Cannot set customer_email via direct insert (must be null or service role sets it)
    AND (customer_email IS NULL OR customer_email = '')
);

-- Policy 3: Block UPDATE from public users
CREATE POLICY "Block public UPDATE"
ON public.product_reviews
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Policy 4: Block DELETE from public users  
CREATE POLICY "Block public DELETE"
ON public.product_reviews
FOR DELETE
TO anon, authenticated
USING (false);

-- 4. Grant proper permissions on the view
GRANT SELECT ON public.product_reviews_public TO anon, authenticated;

-- 5. Revoke direct table access except through policies
REVOKE ALL ON public.product_reviews FROM anon, authenticated;
GRANT SELECT, INSERT ON public.product_reviews TO anon, authenticated;