-- Phase 2 Tables: Innovation, Training, Community, News

-- 1. Innovation Tools
CREATE TABLE IF NOT EXISTS public.innovation_tools (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  features text[] DEFAULT '{}',
  type text DEFAULT 'hardware', -- hardware, software, resource
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Training Modules
CREATE TABLE IF NOT EXISTS public.training_modules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  image_url text,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name text NOT NULL,
  author_avatar text,
  title text NOT NULL,
  content text NOT NULL,
  likes integer DEFAULT 0,
  tag text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Community Replies (Optional extension)
CREATE TABLE IF NOT EXISTS public.community_replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. News Articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text,
  category text,
  image_url text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) policies 
-- Assuming read-only access for anyone, and write access restricted for now.
ALTER TABLE public.innovation_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read-only access on innovation_tools" ON public.innovation_tools FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on training_modules" ON public.training_modules FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on community_posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on community_replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access on news_articles" ON public.news_articles FOR SELECT USING (true);

-- Allow public inserts to community posts & replies for the MVP (so users can post)
CREATE POLICY "Allow public insert on community_posts" ON public.community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on community_replies" ON public.community_replies FOR INSERT WITH CHECK (true);
