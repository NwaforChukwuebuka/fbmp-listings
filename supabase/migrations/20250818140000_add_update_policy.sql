-- Add UPDATE policy for listings table
CREATE POLICY "Anyone can update listings" 
ON public.listings 
FOR UPDATE 
USING (true)
WITH CHECK (true);
