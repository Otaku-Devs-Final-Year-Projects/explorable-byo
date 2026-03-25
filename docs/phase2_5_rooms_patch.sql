-- ===================================================================================
-- EXPLORABLE BYO - PHASE 2.5 HOTFIX: ROOM QUANTITIES
-- ===================================================================================
-- We cannot assume 1 booking = 1 room.
-- This structural patch adds a dedicated column to track exactly how many 
-- capacity slots (rooms, tables, etc.) a specific booking requires.
-- ===================================================================================

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_count INT DEFAULT 1;
