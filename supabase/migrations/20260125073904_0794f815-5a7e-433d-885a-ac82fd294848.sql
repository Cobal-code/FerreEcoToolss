-- ============================================
-- FIX: Allow SELECT on product_reviews for returning inserted rows
-- The issue: INSERT with .select() requires SELECT permission
-- Current SELECT policy blocks all access with USING (false)
-- Solution: Change approach - use a function to insert reviews
-- ============================================

-- First, drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Block direct read access - use view instead" ON public.product_reviews;

-- Create a more nuanced SELECT policy:
-- 1. Allow reading approved reviews (for public view)
-- 2. Allow reading the row you just inserted (by matching id in subquery)
-- We'll use a session variable approach or just allow approved reviews

-- Actually, the simpler fix is to allow SELECT only for approved reviews
-- AND allow the INSERT to return the inserted row by using AFTER INSERT
-- But the cleanest approach is to not use .select() after insert

-- Let's create a policy that allows:
-- - SELECT on approved reviews only (for the public view)
-- - No direct access to unapproved reviews (protects pending reviews)
CREATE POLICY "Allow SELECT on approved reviews only"
ON public.product_reviews
FOR SELECT
USING (is_approved = true);

-- Note: The INSERT policy already exists and allows anyone to insert
-- The issue was that .insert().select() tries to SELECT the inserted row
-- but the row has is_approved = false, so it's blocked

-- Alternative: Create a separate policy for the inserting user to read their own review
-- But since we don't have authentication, we'll modify the frontend to not use .select()