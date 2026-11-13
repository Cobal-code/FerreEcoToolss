-- =====================================================
-- DEFINITIVE SECURITY FIX: ELIMINATE EMAIL EXPOSURE
-- Uses RPC function instead of view for complete control
-- =====================================================

-- 1. Create a secure RPC function for fetching public reviews
-- This function ONLY returns safe columns, no email ever
CREATE OR REPLACE FUNCTION public.get_public_reviews(p_product_id integer)
RETURNS TABLE (
    id uuid,
    product_id integer,
    customer_name text,
    rating integer,
    review_text text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
    LIMIT 100;  -- Anti-scraping: limit results per request
$$;

-- 2. Create a function to get review stats (for rating display)
CREATE OR REPLACE FUNCTION public.get_review_stats(p_product_id integer)
RETURNS TABLE (
    average_rating numeric,
    total_reviews bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        COALESCE(ROUND(AVG(pr.rating)::numeric, 1), 0) as average_rating,
        COUNT(*) as total_reviews
    FROM public.product_reviews pr
    WHERE pr.product_id = p_product_id
      AND pr.is_approved = true;
$$;

-- 3. Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION public.get_public_reviews(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_review_stats(integer) TO anon, authenticated;

-- 4. Add comments documenting security
COMMENT ON FUNCTION public.get_public_reviews IS 
'Secure function to fetch approved reviews. Returns ONLY safe columns (no email). 
Limited to 100 results per call for anti-scraping protection.';

COMMENT ON FUNCTION public.get_review_stats IS 
'Secure function to get review statistics. Returns only aggregate data.';

-- 5. Revoke direct SELECT on product_reviews from public roles
-- Force all access through the secure RPC functions
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;

-- 6. Keep INSERT permission for review submission (controlled by RLS)
GRANT INSERT ON public.product_reviews TO anon, authenticated;