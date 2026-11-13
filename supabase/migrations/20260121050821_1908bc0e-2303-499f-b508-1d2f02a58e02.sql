-- Create a public view for product reviews that excludes the customer_email field
CREATE VIEW public.product_reviews_public
WITH (security_invoker = on) AS
SELECT 
  id,
  product_id,
  rating,
  is_approved,
  created_at,
  updated_at,
  customer_name,
  review_text
FROM public.product_reviews;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.product_reviews_public IS 'Public view of product reviews that excludes customer_email for privacy protection';