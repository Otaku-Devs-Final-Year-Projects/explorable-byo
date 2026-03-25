-- ===================================================================================
-- EXPLORABLE BYO - PHASE 3 FINAL FIX SCRIPT
-- ===================================================================================
-- Run this script in your Supabase SQL Editor.
-- Since it is executed as an admin, it will bypass Row Level Security (RLS) policies 
-- that previously blocked the Node.js script.

-- -----------------------------------------------------------------------------------
-- 1. FIX VENUE IMAGES (Replacing generic placeholders with accurate representations)
-- -----------------------------------------------------------------------------------
UPDATE public.venues 
SET image_url = 'https://tse2.mm.bing.net/th/id/OIP.rquiL6RNJx6xZH-6ka0T6AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3' 
WHERE name ILIKE '%Rainbow Hotel%';

UPDATE public.venues 
SET image_url = 'data:image/webp;base64,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auto=format&fit=crop&q=80' 
WHERE name ILIKE '%Natural History Museum%';

UPDATE public.venues 
SET image_url = 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80' 
WHERE name ILIKE '%Cattleman Steakhouse%';


-- -----------------------------------------------------------------------------------
-- 2. SEED PHASE 2 DYNAMIC DATA (Innovation, Training, News)
-- -----------------------------------------------------------------------------------

-- Clear existing data if any
DELETE FROM public.innovation_tools;
DELETE FROM public.training_modules;
DELETE FROM public.news_articles;
-- Note: Community Posts were seeded successfully, but we can clear them and re-seed 
-- for consistency if needed, though we will leave them untouched here.


-- Insert Innovation Tools
INSERT INTO public.innovation_tools (title, description, image_url, features, type) VALUES
(
  'Eco-Ramps v2', 
  'Low-cost, durable ramps made from 100% recycled materials. Tested for optimal 1:12 gradients and severe weather resistance.', 
  'https://images.unsplash.com/photo-1579407364450-481fe19bcbe8?auto=format&fit=crop&q=80', 
  ARRAY['Recycled Materials', 'Weather Resistant', 'Easy Installation', 'High Weight Capacity'], 
  'hardware'
),
(
  'Audio QR Signage Hub', 
  'Generate audio-descriptive QR codes that can be placed on doors and menus to assist guests with visual impairments. Multi-language support.', 
  'https://images.unsplash.com/photo-1596526131083-e8c638c9c6c7?auto=format&fit=crop&q=80', 
  ARRAY['Audio Descriptions', 'Multi-language', 'Low Maintenance', 'Free Generation'], 
  'software'
),
(
  'Sensory-Responsive Lighting Kits', 
  'Adjustable warm lighting setups designed to reduce glare and accommodate guests with sensory sensitivities or autism. Smartphone controlled.', 
  'https://images.unsplash.com/photo-1565814329452-e1efa11c5e8d?auto=format&fit=crop&q=80', 
  ARRAY['Dimmable', 'Warm Tones', 'Anti-Glare', 'Smart App Control'], 
  'hardware'
);


-- Insert Training Modules
INSERT INTO public.training_modules (title, duration, description, image_url, order_index) VALUES
(
  'Module 1: Foundations of Awareness', 
  '45 mins', 
  'Understanding different types of disabilities (visible and hidden) and basic etiquette in hospitality.', 
  'https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&q=80', 
  1
),
(
  'Module 2: Communicating with Care', 
  '60 mins', 
  'Best practices for respectful and effective communication with diverse guests, including those with hearing or speech impairments.', 
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80', 
  2
),
(
  'Module 3: Assisting with Mobility', 
  '45 mins', 
  'Practical scenarios: guiding a guest with severe visual impairment, using mobility equipment safely, and spatial awareness.', 
  'https://images.unsplash.com/photo-1587370560942-1e5b121fb65a?auto=format&fit=crop&q=80', 
  3
);


-- Insert News Articles
INSERT INTO public.news_articles (title, excerpt, content, category, image_url, is_featured) VALUES
(
  'ExplorAble Partners with Zimbabwe Tourism Authority', 
  'A landmark agreement to integrate our verified accessibility data directly into the national tourism planning dashboard.', 
  'We are proud to announce a new strategic partnership with the ZTA to ensure venues across the nation meet modern accessibility demands...', 
  'Partnership', 
  'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80', 
  true
),
(
  'New Feature: AI-Powered Audio Navigation', 
  'Our web app now supports full voice navigation for visually impaired users. Learn how to use "Peace of Mind" mode.', 
  'Accessibility goes beyond physical spaces. Our digital platform introduces advanced spatial audio cues...', 
  'Platform Update', 
  'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&q=80', 
  false
),
(
  'Call for Volunteers: Bulawayo Mapping Drive', 
  'We are looking for local volunteers to help us verify 50 new venues in the CBD this coming weekend. Will provide training.', 
  'Community mapping is the core of our platform. Join us this Saturday at City Hall for a brief training session before we head out to audit...', 
  'Community', 
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80', 
  false
);

-- Done!
