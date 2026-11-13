-- Drop the product_reviews_public view completely
-- All review access now goes through secure SECURITY DEFINER RPC functions:
-- - get_public_reviews(p_product_id): Returns approved reviews without email
-- - get_review_stats(p_product_id): Returns aggregate stats (avg rating, count)
-- The view is no longer needed and causes false-positive security warnings

DROP VIEW IF EXISTS public.product_reviews_public;