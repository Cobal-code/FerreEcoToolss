-- Add explicit deny policies for server-only tables
-- These tables should only be accessed via service_role (edge functions)

-- Block all client access to post_purchase_customers
CREATE POLICY "Block all client access - server only"
ON public.post_purchase_customers FOR ALL
USING (false) WITH CHECK (false);

-- Block all client access to customer_purchases  
CREATE POLICY "Block all client access - server only"
ON public.customer_purchases FOR ALL
USING (false) WITH CHECK (false);

-- Block all client access to customer_promotions
CREATE POLICY "Block all client access - server only"
ON public.customer_promotions FOR ALL
USING (false) WITH CHECK (false);