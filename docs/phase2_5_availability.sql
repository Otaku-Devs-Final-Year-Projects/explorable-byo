-- ===================================================================================
-- EXPLORABLE BYO - PHASE 2.5: AVAILABILITY ENGINE
-- ===================================================================================

-- 1. ADD CAPACITY AND CHECK-OUT STRUCTURAL COLUMNS
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS check_out_date DATE;

-- 2. UPDATE EXISTING VENUE CAPACITIES
-- Museums and Parks get giant capacities (like 500 tickets per day)
-- Restaurants get medium capacities (like 30 tables)
-- Hotels get small tight capacities (like 3 accessible rooms)
UPDATE public.venues SET capacity = 3 WHERE type = 'Hotel';
UPDATE public.venues SET capacity = 30 WHERE type = 'Restaurant';
UPDATE public.venues SET capacity = 500 WHERE type IN ('Museum', 'Park');


-- 3. MASSIVE MOCK DATA INJECTION
-- We want to completely lock up certain specific dates so the Calendar UI has 
-- a demonstratable "Fully Booked" un-clickable state for tests.

DO $$
DECLARE 
  g1_id uuid;
  g2_id uuid;
  g3_id uuid;
  g4_id uuid;
  v1_id uuid := '33333333-3333-3333-3333-300000000001'; -- Hotel (Capacity 3)
  v4_id uuid := '33333333-3333-3333-3333-300000000004'; -- Museum (Capacity 500)
  v6_id uuid := '33333333-3333-3333-3333-300000000006'; -- Restaurant (Capacity 30)
BEGIN

-- We dynamically fetch the authorized guest IDs to attach these dummy bookings
SELECT id INTO g1_id FROM auth.users WHERE email = 'g1@demo.com' LIMIT 1;
SELECT id INTO g2_id FROM auth.users WHERE email = 'g2@demo.com' LIMIT 1;
SELECT id INTO g3_id FROM auth.users WHERE email = 'g3@demo.com' LIMIT 1;
SELECT id INTO g4_id FROM auth.users WHERE email = 'g4@demo.com' LIMIT 1;

-- If users don't exist, exit safely
IF g1_id IS NULL THEN RETURN; END IF;

-- -------------------------------------------------------------------------
-- HOTEL FULL BOOKING DEMO
-- Specifically mapping CURRENT_DATE + 3 days to CURRENT_DATE + 5 days
-- We will insert 3 approved bookings for this overlapping 3-day block,
-- guaranteeing that the Hotel (capacity=3) is 100% booked for that window.
-- -------------------------------------------------------------------------
INSERT INTO public.bookings (venue_id, guest_id, guest_email, check_in_date, check_out_date, guest_count, status, created_at) VALUES 
(v1_id, g1_id, 'g1@demo.com', CURRENT_DATE + 3, CURRENT_DATE + 5, '2 Adults', 'approved', CURRENT_DATE),
(v1_id, g2_id, 'g2@demo.com', CURRENT_DATE + 3, CURRENT_DATE + 5, '1 Adult', 'approved', CURRENT_DATE),
(v1_id, g3_id, 'g3@demo.com', CURRENT_DATE + 2, CURRENT_DATE + 6, '2 Adults', 'approved', CURRENT_DATE);

-- -------------------------------------------------------------------------
-- RESTAURANT HIGH CAPACITY BOOKING DEMO
-- Restaurant has capacity 30. We will insert 30 dummy rows for TOMORROW.
-- This explicitly blocks out TOMORROW.
-- -------------------------------------------------------------------------
FOR i IN 1..30 LOOP
    INSERT INTO public.bookings (venue_id, guest_id, guest_email, check_in_date, check_out_date, guest_count, status, created_at) 
    VALUES (v6_id, g4_id, 'g4@demo.com', CURRENT_DATE + 1, CURRENT_DATE + 1, '2 Adults', 'approved', CURRENT_DATE);
END LOOP;

-- -------------------------------------------------------------------------
-- MUSEUM MEDIUM CAPACITY BOOKING DEMO
-- Museum has capacity 500. We will randomly insert 50 tickets 
-- simulating a busy but not entirely full day next week.
-- -------------------------------------------------------------------------
FOR i IN 1..50 LOOP
    INSERT INTO public.bookings (venue_id, guest_id, guest_email, check_in_date, check_out_date, guest_count, status, created_at) 
    VALUES (v4_id, g1_id, 'g1@demo.com', CURRENT_DATE + 7, CURRENT_DATE + 7, '1 Adult', 'approved', CURRENT_DATE);
END LOOP;

END $$;
