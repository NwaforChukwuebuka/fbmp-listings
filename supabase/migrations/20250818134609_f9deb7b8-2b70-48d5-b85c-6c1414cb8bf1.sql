-- Add unique constraint to prevent duplicate listings
ALTER TABLE public.listings ADD CONSTRAINT unique_listing_link UNIQUE (link);