-- ============================================
-- SECURITY FIX: Remove customer_email column entirely
-- This eliminates any possibility of email data exposure
-- ============================================

-- Step 1: Drop existing INSERT policy that references customer_email
DROP POLICY IF EXISTS "Allow public review submission" ON public.product_reviews;

-- Step 2: Remove the customer_email column entirely
-- This is the definitive solution - no email can ever be stored or exposed
ALTER TABLE public.product_reviews DROP COLUMN IF EXISTS customer_email;

-- Step 3: Create new INSERT policy without email reference
-- Reviews can be inserted publicly but never include email
CREATE POLICY "Allow public anonymous review submission"
ON public.product_reviews
AS RESTRICTIVE
FOR INSERT
WITH CHECK (is_approved = false);

-- Step 4: Ensure all other protective policies are in place
DROP POLICY IF EXISTS "Block direct SELECT - use RPC only" ON public.product_reviews;
CREATE POLICY "Block direct SELECT - use RPC only"
ON public.product_reviews
AS RESTRICTIVE
FOR SELECT
USING (false);

DROP POLICY IF EXISTS "Block public UPDATE" ON public.product_reviews;
CREATE POLICY "Block public UPDATE"
ON public.product_reviews
AS RESTRICTIVE
FOR UPDATE
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Block public DELETE" ON public.product_reviews;
CREATE POLICY "Block public DELETE"
ON public.product_reviews
AS RESTRICTIVE
FOR DELETE
USING (false);

-- Step 5: Update the RPC function to ensure no email is ever returned
CREATE OR REPLACE FUNCTION public.get_public_reviews(p_product_id integer)
RETURNS TABLE(
    id uuid,
    product_id integer,
    customer_name text,
    rating integer,
    review_text text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT 
        pr.id,
        pr.product_id,
        pr.customer_name,
        pr.rating,
        pr.review_text,
        pr.created_at,
        pr.updated_at
    FROM public.product_reviews pr
    WHERE pr.product_id = p_product_id
      AND pr.is_approved = true
    ORDER BY pr.created_at DESC
    LIMIT 100;
$function$;