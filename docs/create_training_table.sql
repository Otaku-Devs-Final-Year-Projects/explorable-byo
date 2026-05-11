-- ============================================================
-- ExplorAble BYO — Training Progress Table
-- Run this in your Supabase SQL Editor to enable server-side
-- progress persistence. The app works without this (uses
-- localStorage as fallback), but running this will sync
-- progress across devices for the same user.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_training_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id text NOT NULL,
  status text NOT NULL DEFAULT 'in-progress',
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;

-- Users can only read and write their own progress
CREATE POLICY "Users can read own training progress"
  ON public.user_training_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training progress"
  ON public.user_training_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training progress"
  ON public.user_training_progress FOR UPDATE
  USING (auth.uid() = user_id);
