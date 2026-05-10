-- ===================================================================================
-- EXPLORABLE BYO — IMAGE FIX PATCH
-- Run this in your Supabase SQL Editor to fix broken venue and news images.
-- ===================================================================================

-- Fix Natural History Museum (was set to a malformed data: URL)
UPDATE public.venues 
SET image_url = 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80'
WHERE name ILIKE '%Natural History Museum%';

-- Fix Bulawayo Rainbow Hotel (was set to a Bing CDN URL that is blocked)
UPDATE public.venues 
SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
WHERE name ILIKE '%Rainbow Hotel%';

-- Fix news article images (add width parameter for reliable loading)
UPDATE public.news_articles
SET image_url = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80'
WHERE title ILIKE '%Zimbabwe Tourism Authority%';

UPDATE public.news_articles
SET image_url = 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80'
WHERE title ILIKE '%Audio Navigation%';

UPDATE public.news_articles
SET image_url = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80'
WHERE title ILIKE '%Mapping Drive%';
