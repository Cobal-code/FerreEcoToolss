-- =====================================================
-- FIX CUSTOMER TABLES: Convert to RESTRICTIVE policies
-- =====================================================

-- 1. Fix customer_purchases - convert to RESTRICTIVE
DROP POLICY IF EXISTS "Block all client access - server only" ON public.customer_purchases;
CREATE POLICY "Block all client access - server only"
ON public.customer_purchases
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 2. Fix customer_promotions - convert to RESTRICTIVE  
DROP POLICY IF EXISTS "Block all client access - server only" ON public.customer_promotions;
CREATE POLICY "Block all client access - server only"
ON public.customer_promotions
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 3. Fix product_reviews - ensure DELETE and UPDATE are RESTRICTIVE
DROP POLICY IF EXISTS "Block public DELETE" ON public.product_reviews;
DROP POLICY IF EXISTS "Block public UPDATE" ON public.product_reviews;

CREATE POLICY "Block public DELETE"
ON public.product_reviews
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

CREATE POLICY "Block public UPDATE"
ON public.product_reviews
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);