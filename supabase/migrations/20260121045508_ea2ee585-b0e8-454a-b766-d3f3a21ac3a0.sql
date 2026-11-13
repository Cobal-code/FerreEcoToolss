-- Create product reviews table
CREATE TABLE public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create review images table
CREATE TABLE public.review_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.product_reviews(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_reviews
-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.product_reviews
FOR SELECT
USING (is_approved = true);

-- Anyone can submit a review (will be pending approval)
CREATE POLICY "Anyone can submit reviews"
ON public.product_reviews
FOR INSERT
WITH CHECK (true);

-- RLS Policies for review_images
-- Anyone can view images of approved reviews
CREATE POLICY "Anyone can view images of approved reviews"
ON public.review_images
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.product_reviews
        WHERE id = review_id AND is_approved = true
    )
);

-- Anyone can insert images for their review
CREATE POLICY "Anyone can insert review images"
ON public.review_images
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true);

-- Storage policies for review images
CREATE POLICY "Anyone can view review images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can upload review images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'review-images');

-- Create indexes for performance
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_approved ON public.product_reviews(is_approved);
CREATE INDEX idx_review_images_review_id ON public.review_images(review_id);

-- Trigger for updated_at
CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();