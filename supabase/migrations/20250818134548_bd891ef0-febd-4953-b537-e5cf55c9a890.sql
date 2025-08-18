-- Add unique constraint to prevent duplicate listings
ALTER TABLE public.listings ADD CONSTRAINT unique_listing_link UNIQUE (link);

-- Create index for better performance on date-based queries (using immutable function)
CREATE INDEX idx_listings_created_at_date ON public.listings (created_at::date);