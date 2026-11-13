-- First drop the existing function to change return type
DROP FUNCTION IF EXISTS public.get_public_reviews(integer);

-- Change rating column from INTEGER to NUMERIC to support 0.5 increments (e.g., 3.5, 4.5)
ALTER TABLE public.product_reviews 
ALTER COLUMN rating TYPE NUMERIC(2,1) USING rating::NUMERIC(2,1);

-- Add constraint to ensure rating is in 0.5 increments between 0.5 and 5
ALTER TABLE public.product_reviews 
ADD CONSTRAINT rating_valid_range CHECK (rating >= 0.5 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2));

-- Recreate the get_public_reviews function with NUMERIC rating
CREATE OR REPLACE FUNCTION public.get_public_reviews(p_product_id integer)
RETURNS TABLE(
    id uuid, 
    product_id integer, 
    customer_name text, 
    rating numeric, 
    review_text text, 
    created_at timestamp with time zone, 
    updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
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