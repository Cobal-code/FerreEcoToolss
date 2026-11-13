-- Fix security scanner warnings by adding explicit SELECT blocking policies
-- The existing "Block all client access - server only" policies use ALL command,
-- but adding explicit SELECT policies ensures complete coverage per Supabase RLS model

-- Drop existing ALL policies and replace with explicit per-command policies

-- 1. post_purchase_customers - Add explicit SELECT, INSERT, UPDATE, DELETE policies
DROP POLICY IF EXISTS "Block all client access - server only" ON public.post_purchase_customers;

CREATE POLICY "Block public SELECT - server only"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Block public INSERT - server only"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block public UPDATE - server only"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block public DELETE - server only"
ON public.post_purchase_customers
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- 2. customer_purchases - Add explicit SELECT, INSERT, UPDATE, DELETE policies
DROP POLICY IF EXISTS "Block all client access - server only" ON public.customer_purchases;

CREATE POLICY "Block public SELECT - server only"
ON public.customer_purchases
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Block public INSERT - server only"
ON public.customer_purchases
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block public UPDATE - server only"
ON public.customer_purchases
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block public DELETE - server only"
ON public.customer_purchases
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- 3. customer_promotions - Add explicit SELECT, INSERT, UPDATE, DELETE policies  
DROP POLICY IF EXISTS "Block all client access - server only" ON public.customer_promotions;

CREATE POLICY "Block public SELECT - server only"
ON public.customer_promotions
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Block public INSERT - server only"
ON public.customer_promotions
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block public UPDATE - server only"
ON public.customer_promotions
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block public DELETE - server only"
ON public.customer_promotions
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);