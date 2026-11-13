-- COMPREHENSIVE SECURITY FIX: Add explicit policies with correct syntax
-- Policies deny access to all roles explicitly

-- ============================================
-- CUSTOMER_PURCHASES TABLE
-- ============================================
DROP POLICY IF EXISTS "Block public SELECT - server only" ON public.customer_purchases;
DROP POLICY IF EXISTS "Block public INSERT - server only" ON public.customer_purchases;
DROP POLICY IF EXISTS "Block public UPDATE - server only" ON public.customer_purchases;
DROP POLICY IF EXISTS "Block public DELETE - server only" ON public.customer_purchases;

CREATE POLICY "Deny all SELECT on customer_purchases"
ON public.customer_purchases
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny all INSERT on customer_purchases"
ON public.customer_purchases
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny all UPDATE on customer_purchases"
ON public.customer_purchases
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all DELETE on customer_purchases"
ON public.customer_purchases
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- ============================================
-- CUSTOMER_PROMOTIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "Block public SELECT - server only" ON public.customer_promotions;
DROP POLICY IF EXISTS "Block public INSERT - server only" ON public.customer_promotions;
DROP POLICY IF EXISTS "Block public UPDATE - server only" ON public.customer_promotions;
DROP POLICY IF EXISTS "Block public DELETE - server only" ON public.customer_promotions;

CREATE POLICY "Deny all SELECT on customer_promotions"
ON public.customer_promotions
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny all INSERT on customer_promotions"
ON public.customer_promotions
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny all UPDATE on customer_promotions"
ON public.customer_promotions
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all DELETE on customer_promotions"
ON public.customer_promotions
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- ============================================
-- POST_PURCHASE_CUSTOMERS TABLE
-- ============================================
DROP POLICY IF EXISTS "Block public SELECT - server only" ON public.post_purchase_customers;
DROP POLICY IF EXISTS "Block public INSERT - server only" ON public.post_purchase_customers;
DROP POLICY IF EXISTS "Block public UPDATE - server only" ON public.post_purchase_customers;
DROP POLICY IF EXISTS "Block public DELETE - server only" ON public.post_purchase_customers;

CREATE POLICY "Deny all SELECT on post_purchase_customers"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny all INSERT on post_purchase_customers"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny all UPDATE on post_purchase_customers"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all DELETE on post_purchase_customers"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- Add comments
COMMENT ON TABLE public.customer_purchases IS 'Server-only table. All client access denied. Access only via service-role.';
COMMENT ON TABLE public.customer_promotions IS 'Server-only table. All client access denied. Access only via service-role.';
COMMENT ON TABLE public.post_purchase_customers IS 'Server-only table with encrypted PII. All client access denied. Access only via service-role.';