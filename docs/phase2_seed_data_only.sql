-- ===================================================================================
-- EXPLORABLE BYO - SAFE DATA SEED VIA LEGAL AUTH BINDS
-- ===================================================================================
-- This script safely preserves `auth.users` hashes while clearing out old venues 
-- and re-seeding them to the legally authorized API-generated demo accounts.
-- ===================================================================================

-- 1. FORCE OBLITERATE OLD DATA (Safely leaving auth intact)
-- -----------------------------------------------------------------------------------
SET session_replication_role = replica;

DELETE FROM public.notifications CASCADE;
DELETE FROM public.reviews CASCADE;
DELETE FROM public.venue_specs CASCADE;
DELETE FROM public.venue_features CASCADE;
DELETE FROM public.saved_venues CASCADE;
DELETE FROM public.bookings CASCADE;
DELETE FROM public.venues CASCADE;
DELETE FROM public.profiles CASCADE;

-- Auto-confirm the natively generated demo users so they can instantly log in
UPDATE auth.users SET email_confirmed_at = now() WHERE email LIKE '%@demo.com';

SET session_replication_role = DEFAULT;

-- -----------------------------------------------------------------------------------
-- 2. MASSIVE SEED DATA INJECTION
-- -----------------------------------------------------------------------------------
DO $$
DECLARE 
  p1_id uuid; p2_id uuid; p3_id uuid; p4_id uuid;
  g1_id uuid; g2_id uuid; g3_id uuid; g4_id uuid;

  v1_id uuid := '33333333-3333-3333-3333-300000000001';
  v2_id uuid := '33333333-3333-3333-3333-300000000002';
  v3_id uuid := '33333333-3333-3333-3333-300000000003';
  v4_id uuid := '33333333-3333-3333-3333-300000000004';
  v5_id uuid := '33333333-3333-3333-3333-300000000005';
  v6_id uuid := '33333333-3333-3333-3333-300000000006';
  v7_id uuid := '33333333-3333-3333-3333-300000000007';
  v8_id uuid := '33333333-3333-3333-3333-300000000008';
BEGIN

-- Dynamically fetch the UUIDs of the flawless accounts the Node script generated
SELECT id INTO p1_id FROM auth.users WHERE email = 'p1@demo.com' LIMIT 1;
SELECT id INTO p2_id FROM auth.users WHERE email = 'p2@demo.com' LIMIT 1;
SELECT id INTO p3_id FROM auth.users WHERE email = 'p3@demo.com' LIMIT 1;
SELECT id INTO p4_id FROM auth.users WHERE email = 'p4@demo.com' LIMIT 1;

SELECT id INTO g1_id FROM auth.users WHERE email = 'g1@demo.com' LIMIT 1;
SELECT id INTO g2_id FROM auth.users WHERE email = 'g2@demo.com' LIMIT 1;
SELECT id INTO g3_id FROM auth.users WHERE email = 'g3@demo.com' LIMIT 1;
SELECT id INTO g4_id FROM auth.users WHERE email = 'g4@demo.com' LIMIT 1;

-- If for any reason the node script failed to make any, abort
IF p1_id IS NULL OR g1_id IS NULL THEN
    RAISE EXCEPTION 'Demo accounts p1@demo.com / g1@demo.com not found in auth.users!';
END IF;

-- Re-inject custom application profiles matching the auth IDs
INSERT INTO public.profiles (id, full_name, role, created_at) VALUES 
(p1_id, 'Rob (Partner 1)', 'partner', now()),
(p2_id, 'Sarah (Partner 2)', 'partner', now()),
(p3_id, 'David (Partner 3)', 'partner', now()),
(p4_id, 'Elena (Partner 4)', 'partner', now()),
(g1_id, 'Alice (Guest 1)', 'guest', now()),
(g2_id, 'Bob (Guest 2)', 'guest', now()),
(g3_id, 'Charlie (Guest 3)', 'guest', now()),
(g4_id, 'Diana (Guest 4)', 'guest', now());

-- Insert Venues (Distributed Ownership)
INSERT INTO public.venues (id, owner_id, name, type, address, latitude, longitude, price, rating, description, image_url) VALUES 
-- Partner 1: Owns 3 Hotels
(v1_id, p1_id, 'The Rainbow Hotel', 'Hotel', '124 Main Street, Bulawayo', -20.148, 28.582, '$120 / night', 4.8, 'A luxury stay located in the heart of the city with dedicated accessible rooms, step-free access, and trained staff.', 'https://tse2.mm.bing.net/th/id/OIP.rquiL6RNJx6xZH-6ka0T6AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'),
(v2_id, p1_id, 'Bulawayo Grand Hotel', 'Hotel', 'Fife Street, Bulawayo', -20.141, 28.580, '$95 / night', 4.6, 'Classic architecture meets modern accessibility. Offers wheelchair accessible suites and close proximity to the art gallery.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
(v3_id, p1_id, 'Hillside Manor Retreat', 'Hotel', 'Hillside Road, Bulawayo', -20.180, 28.590, '$80 / night', 4.3, 'A quiet suburban retreat featuring entirely flat grounds, spacious bungalows, and braille signage.', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
-- Partner 2: Owns 2 Museums/Parks
(v4_id, p2_id, 'Natural History Museum', 'Museum', 'Leopold Takawira Ave, Bulawayo', -20.155, 28.591, '$5 Entry', 4.5, 'The largest museum in Zimbabwe. Fully equipped with ramps and a newly installed quiet space for sensory breaks.', 'https://tse4.mm.bing.net/th/id/OIP._v-D-A2fL-8H4u4Z6iLxEwHaE8?rs=1&pid=ImgDetMain'),
(v5_id, p2_id, 'Mukuvisi Woodlands', 'Park', 'Hillside Rd, Harare', -17.824, 31.053, '$10 Entry', 4.9, 'Nature reserve featuring completely paved trails, wheelchair accessible viewing platforms, and accessible restrooms.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
-- Partner 3: Owns 2 Restaurants
(v6_id, p3_id, 'Cattleman Steakhouse', 'Restaurant', 'Fife Street, Bulawayo', -20.160, 28.588, '$30 Avg', 4.2, 'Famous local diner with completely flat entry, spacious table arrangements for wheelchairs, and large print menus.', 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80'),
(v7_id, p3_id, 'Harare Coffee Roasters', 'Restaurant', 'Samora Machel Ave, Harare', -17.825, 31.049, '$15 Avg', 4.7, 'Artisan coffee shop featuring low counters, accessible seating, and staff trained to assist guests with visual impairments.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
-- Partner 4: Owns 1 Venue
(v8_id, p4_id, 'Victoria Falls Luxury Lodge', 'Hotel', 'Zambezi Drive, Victoria Falls', -17.924, 25.837, '$250 / night', 4.9, 'World-class luxury right next to the falls. Offers golf cart transport, step-free access everywhere, and zero-entry pools.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');

-- Features & Specs (Applying to all 8 venues)
INSERT INTO public.venue_features (venue_id, wheelchair_accessible, accessible_bathroom, step_free_access, braille_signage, sign_language_staff, quiet_space, parking) VALUES
(v1_id, true, true, true, false, true, true, true),
(v2_id, true, true, true, false, false, false, true),
(v3_id, true, true, true, true, false, true, true),
(v4_id, true, true, true, true, false, true, true),
(v5_id, true, true, true, false, false, true, true),
(v6_id, true, false, true, false, false, false, true),
(v7_id, true, true, true, false, true, false, false),
(v8_id, true, true, true, true, true, true, true);

INSERT INTO public.venue_specs (venue_id, door_width, ramp_gradient, flooring, bathroom_size, table_height) VALUES
(v1_id, '34 inches', '1:12', 'Smooth Tile', '6ft x 6ft', 'Standard'),
(v2_id, '32 inches', '1:10', 'Carpet', '5ft x 5ft', 'Standard'),
(v3_id, '36 inches', 'Flat', 'Hardwood', '8ft x 8ft', 'Standard'),
(v4_id, '36 inches', '1:10', 'Polished Concrete', '8ft x 6ft', 'N/A'),
(v5_id, '40 inches', '1:20', 'Paved Dirt', '7ft x 7ft', 'N/A'),
(v6_id, '32 inches', 'Flat', 'Hardwood', 'N/A', '30 inches'),
(v7_id, '34 inches', '1:12', 'Polished Concrete', '6ft x 6ft', '32 inches'),
(v8_id, '38 inches', '1:15', 'Smooth Stone', '10ft x 10ft', 'Standard');

-- Seed Bookings
INSERT INTO public.bookings (venue_id, guest_id, guest_email, check_in_date, guest_count, special_requests, status, created_at) VALUES 
(v1_id, g1_id, 'g1@demo.com', CURRENT_DATE + INTERVAL '5 days', '2 Adults', 'Need roll-in shower', 'approved', CURRENT_DATE - INTERVAL '2 days'),
(v6_id, g1_id, 'g1@demo.com', CURRENT_DATE + INTERVAL '2 weeks', '4 Adults', 'Quiet corner table', 'pending', CURRENT_DATE),
(v4_id, g1_id, 'g1@demo.com', CURRENT_DATE + INTERVAL '1 month', '1 Adult', 'Sensory tour', 'declined', CURRENT_DATE - INTERVAL '10 days'),
(v8_id, g2_id, 'g2@demo.com', CURRENT_DATE + INTERVAL '30 days', '2 Adults, 1 Child', 'Lowered bed', 'approved', CURRENT_DATE - INTERVAL '5 days'),
(v7_id, g2_id, 'g2@demo.com', CURRENT_DATE + INTERVAL '2 days', '2 Adults', 'Deaf assistance', 'pending', CURRENT_DATE),
(v5_id, g3_id, 'g3@demo.com', CURRENT_DATE + INTERVAL '7 days', '3 Adults', 'Wheelchair paths check', 'approved', CURRENT_DATE - INTERVAL '1 day'),
(v2_id, g3_id, 'g3@demo.com', CURRENT_DATE + INTERVAL '14 days', '1 Adult', 'First floor room', 'pending', CURRENT_DATE - INTERVAL '2 hours'),
(v1_id, g4_id, 'g4@demo.com', CURRENT_DATE + INTERVAL '3 days', '2 Adults', 'Accessible parking spot required', 'approved', CURRENT_DATE - INTERVAL '10 days');

-- Seed Reviews
INSERT INTO public.reviews (venue_id, guest_id, rating, comment, created_at) VALUES
(v1_id, g1_id, 5.0, 'Absolutely fantastic! The staff was incredibly helpful with my luggage and the accessible bathroom was top notch.', CURRENT_DATE - INTERVAL '30 days'),
(v4_id, g2_id, 4.0, 'Great museum. The ramps are decent but some displays are a bit too high for wheelchair users.', CURRENT_DATE - INTERVAL '45 days'),
(v8_id, g3_id, 5.0, 'A dream come true. The luxury lodge truly understands accessibility without compromising on aesthetics.', CURRENT_DATE - INTERVAL '10 days'),
(v6_id, g4_id, 3.5, 'Food was great, but the bathroom was definitely not wheelchair accessible sadly.', CURRENT_DATE - INTERVAL '20 days'),
(v1_id, g2_id, 4.5, 'Loved the hotel, centrally located. Elevators are a bit small though.', CURRENT_DATE - INTERVAL '15 days'),
(v7_id, g1_id, 5.0, 'The staff here is amazing! They had braille menus and sign language capable staff. Fantastic espresso!', CURRENT_DATE - INTERVAL '5 days');

-- Seed Notifications
INSERT INTO public.notifications (user_id, title, message, read, created_at) VALUES 
(p1_id, 'New Booking Request', 'You have a new booking request for The Rainbow Hotel.', false, CURRENT_DATE),
(p1_id, 'New Review', 'Someone left a 5-star review for The Rainbow Hotel!', false, CURRENT_DATE - INTERVAL '2 hours'),
(p1_id, 'New Booking Request', 'You have a new booking request for Bulawayo Grand Hotel.', true, CURRENT_DATE - INTERVAL '2 hours'),
(p3_id, 'New Booking Request', 'You have a new reservation enquiry for Cattleman Steakhouse.', false, CURRENT_DATE),
(p3_id, 'New Booking Request', 'You have a new reservation enquiry for Harare Coffee Roasters.', true, CURRENT_DATE - INTERVAL '1 day'),
(g1_id, 'Booking Approved', 'Your booking at The Rainbow Hotel has been approved.', true, CURRENT_DATE - INTERVAL '1 day'),
(g1_id, 'Booking Declined', 'Your booking at Natural History Museum was declined.', true, CURRENT_DATE - INTERVAL '8 days'),
(g2_id, 'Booking Approved', 'Your booking at Victoria Falls Luxury Lodge is confirmed.', false, CURRENT_DATE - INTERVAL '4 days'),
(g3_id, 'Booking Approved', 'Your booking at Mukuvisi Woodlands is confirmed.', true, CURRENT_DATE - INTERVAL '12 hours'),
(g4_id, 'Booking Approved', 'Your booking at The Rainbow Hotel is confirmed.', true, CURRENT_DATE - INTERVAL '8 days');

END $$;
