-- ===================================================================================
-- EXPLORABLE BYO - PHASE 1 SCHEMA PART 2 : Saved Venues
-- ===================================================================================

CREATE TABLE IF NOT EXISTS public.saved_venues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, venue_id)
);

ALTER TABLE public.saved_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved venues" 
ON public.saved_venues 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow public read access (optional, usually users only read their own)
-- But the ALL policy above handles select/insert/update/delete for the owner.
