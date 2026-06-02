-- ===================================================================================
-- EXPLORABLE BYO - PHASE 4 REAL DATA SEED
-- ===================================================================================
-- Run this script in your Supabase SQL Editor.
-- This script safely removes dummy venues and inserts the 13 researched real-world 
-- venues from docs/real-data.md along with their accessibility features and specs.
-- ===================================================================================

-- 1. DELETE EXISTING DATA
-- Bookings, reviews, saved_venues, features, and specs will cascade delete.
DELETE FROM public.venues;

-- 2. SEED REAL WORLD VENUES
DO $$
DECLARE 
  p1_id uuid := '11111111-1111-1111-1111-100000000001';
  p2_id uuid := '11111111-1111-1111-1111-100000000002';
  p3_id uuid := '11111111-1111-1111-1111-100000000003';
  p4_id uuid := '11111111-1111-1111-1111-100000000004';
  
  g1_id uuid := '22222222-2222-2222-2222-200000000001';

  v1_id uuid := '44444444-4444-4444-4444-400000000001';
  v2_id uuid := '44444444-4444-4444-4444-400000000002';
  v3_id uuid := '44444444-4444-4444-4444-400000000003';
  v4_id uuid := '44444444-4444-4444-4444-400000000004';
  v5_id uuid := '44444444-4444-4444-4444-400000000005';
  v6_id uuid := '44444444-4444-4444-4444-400000000006';
  v7_id uuid := '44444444-4444-4444-4444-400000000007';
  v8_id uuid := '44444444-4444-4444-4444-400000000008';
  v9_id uuid := '44444444-4444-4444-4444-400000000009';
  v10_id uuid := '44444444-4444-4444-4444-400000000010';
  v11_id uuid := '44444444-4444-4444-4444-400000000011';
  v12_id uuid := '44444444-4444-4444-4444-400000000012';
  v13_id uuid := '44444444-4444-4444-4444-400000000013';

BEGIN

-- Insert 13 Real Venues
INSERT INTO public.venues (id, owner_id, name, type, address, latitude, longitude, price, rating, description, image_url) VALUES 
-- Partner 1: Hotels & Lodges
(v1_id, p1_id, 'Holiday Inn Bulawayo', 'Hotel', 'Ascot Centre, Bulawayo', -20.155, 28.599, '$130 - $220 / night', 4.5, 'A well-known international brand offering reliable comfort, an outdoor pool, and a restaurant. Features 157 rooms including standard rooms and suites.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fdigital.ihg.com%2Fis%2Fimage%2Fihg%2Fholiday-inn-bulawayo-10439510464-4x3&sp=1780405942T0ab1c8d7ab47027abb52b511eddebf18ff7d86a93f9a6facfaa42f326e8cd5b8'),
(v2_id, p1_id, 'The Bulawayo Club', 'Hotel', '8th Avenue / Fort Street, Bulawayo', -20.150, 28.583, '$46 - $130 / night', 4.3, 'Historic gentlemen’s club offering a step back in time with vintage decor. Contains 15 rooms including Standard, Premium, and Executive Suites.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fdynamic-media-cdn.tripadvisor.com%2Fmedia%2Fphoto-o%2F05%2Ffa%2Fa5%2Fd9%2Ffront-club1.jpg%3Fw%3D1400%26h%3D-1%26s%3D1&sp=1780406067T91e725cf24e2220a537edcdc62c4d4cb97f056944a3eb1d727c76f9445b0e62b'),
(v3_id, p1_id, 'Hillside Manor', 'Guest House', '92A Percy Avenue, Hillside, Bulawayo', -20.178, 28.594, '$33 - $56 / night', 4.6, 'A tranquil suburban getaway where the entire unit is located on the ground floor, making it ideal for wheelchair access.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fimages.trvl-media.com%2Fhotels%2F20000000%2F19120000%2F19119600%2F19119558%2Fe2f04822_z.jpg&sp=1780406169T31d94c7f2c9108eb353ff3af9fd083d8ec8c0a80ee867d9c6d101665fb41588e'),
(v4_id, p1_id, 'Bulawayo Central Lodge', 'Lodge', 'Bulawayo CBD', -20.151, 28.585, '$28 - $180 / night', 4.1, 'Centrally located lodge with flexible room types. Offers an English breakfast and a wheelchair-accessible path of travel.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fcontent.r9cdn.net%2Frimg%2Fhimg%2Fcf%2F56%2Ff7%2Fexpedia_group-2468856-19e0f8-102116.jpg%3Fwidth%3D1366%26height%3D768%26crop%3Dtrue&sp=1780406329T2e4ebf742892da0d19a82ba517c86b54f4ea4751a389d3ecd22bd66e445d8e5d'),

-- Partner 2: Lodges & Museums
(v5_id, p2_id, 'The Musketeers Lodge', 'Lodge', '42 Annabel Drive, Eloana, Bulawayo', -20.185, 28.601, '$99 - $119 / night', 4.4, 'Features 6 en-suite rooms with modern amenities like DStv and Wi-Fi. Known for its Full English breakfast and accessible parking.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fdynamic-media-cdn.tripadvisor.com%2Fmedia%2Fphoto-o%2F08%2F91%2F62%2Fcb%2Fthe-musketeers-lodge.jpg%3Fw%3D1200%26h%3D-1%26s%3D1&sp=1780406444T9dcf0239d61a3ad5e15d8a543043108ba1f14b57ee842a6e5bfc3336a07de426'),
(v6_id, p2_id, 'Villa Thabiso', 'Guest House', '6 Warwick Road, Hillside, Bulawayo', -20.180, 28.595, '$50 - $99 / night', 4.7, 'A beautiful villa featuring standard and deluxe rooms, a swimming pool, backyard garden, and fully accessible bathrooms.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fdynamic-media-cdn.tripadvisor.com%2Fmedia%2Fphoto-o%2F26%2Fcc%2Fa4%2Fb7%2Fvilla-thabiso.jpg%3Fw%3D1200%26h%3D-1%26s%3D1&sp=1780406602Tcd8ad2589dec7d167034067f7c59bda604a381c6a74dd815339e1865c00722b1'),
(v7_id, p2_id, 'Bulawayo Railway Museum', 'Museum', 'Raylton, Bulawayo', -20.161, 28.577, '$2 Entry', 4.8, 'An extensive collection of vintage railway equipment, including steam locomotives and Cecil Rhodes’ personal coach. Very wheelchair friendly.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.AnrZ2DtYsu3U2W0IVsD7LwHaEK%3Fpid%3DApi&sp=1780406688T6cafea29a0cc04ea6b629799287b85d992d34e7a5253c339f63dcd65f53d01d6'),

-- Partner 3: Restaurants & Cafes
(v8_id, p3_id, 'Mozambik Bulawayo', 'Restaurant', '26 Livingstone Rd, Bulawayo', -20.158, 28.592, '$15 - $25 Avg', 4.5, 'Afro-Portuguese cuisine known for flame-grilled chicken and seafood. Offers adapted seating and a dedicated accessible restroom.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fdynamic-media-cdn.tripadvisor.com%2Fmedia%2Fphoto-o%2F30%2F34%2Ff2%2Fbb%2Fcaption.jpg%3Fw%3D1100%26h%3D1100%26s%3D1&sp=1780406852Tbbfcec7a62b58ed200d17499ade202c1395c54588404d005e7ffb9c9179fcf75'),
(v9_id, p3_id, 'The Smokehouse Bulawayo', 'Restaurant', 'Busters Sports Club, Hillside', -20.182, 28.591, '$20 - $30 Avg', 4.6, 'A lively bar and grill offering premium cuts, craft cocktails, and live music. Features an inclusive braille menu option.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
(v10_id, p3_id, 'The Bowery Café', 'Cafe', '10 Pauling Rd, Suburbs, Bulawayo', -20.160, 28.595, '$4 - $10 Avg', 4.7, 'An all-day eatery serving artisanal coffee, light meals, and gourmet burgers. Provides ramped entrances and spacious seating.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.S84K6vgpjUezK4O6Oti_QgHaEq%3Fpid%3DApi&sp=1780406933T2343d3a67e467ab51b64ab984ee91062b41316fa05cb6bf8ea345325d07cc8c8'),

-- Partner 4: Attractions & Nature
(v11_id, p4_id, 'Hillside Dams Conservancy', 'Park', 'Hillside, Bulawayo', -20.185, 28.605, '$3 Entry', 4.8, 'A serene nature reserve offering walking trails, canoeing, and an on-site restaurant. Features flat outdoor areas and wide pathways.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fprocess.filestackapi.com%2Fresize%3Dfit%3Acrop%2Cwidth%3A1200%2Cheight%3A630%2Fquality%3Dv%3A79%2Fcompress%2Fcache%3Dexpiry%3A604800%2FP3lyT9sQ5GcfYJI7mHDH&sp=1780407013T64656e5bd5cff3c251d28d0bcf97b590261d6268fe83dbd6aaf90858f33de2df'),
(v12_id, p4_id, 'Centenary Park & Natural History Museum', 'Museum', 'Centenary Park, Bulawayo', -20.155, 28.591, '$3 Entry (Museum)', 4.6, 'The largest museum in Zimbabwe surrounded by a beautiful free public park. Level paved trails and ground-floor access to exhibits.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthfvnext.bing.com%2Fth%2Fid%2FOIP.ebK_Oxvz1MX778cqnocdTAHaE8%3Fr%3D0%26cb%3Dthfvnextfalcon%26pid%3DApi&sp=1780407098T3831ed144d887d73d24ca941c29c7d6ec6d3edcf58dce836afe17c324fb8aed2'),
(v13_id, p4_id, 'Silwane Nature Reserve', 'Nature Reserve', 'Glenville Drive, Bulawayo', -20.110, 28.550, '$2 Entry', 4.5, 'Nature reserve offering ziplining, quad bikes, and boat rides. Operates wheelchair-accessible main entrances and level parking spots.', 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FxNiYSCADRTs%2Fmaxresdefault.jpg&sp=1780407247Tff45cf4808f0dfdab79e2bc732f2dd93084a411b49905b0b5ee62208d0e3be48');


-- Insert Features (Aligning with markdown data)
INSERT INTO public.venue_features (venue_id, wheelchair_accessible, accessible_bathroom, step_free_access, braille_signage, sign_language_staff, quiet_space, parking) VALUES
(v1_id, true, true, true, false, false, false, true),  -- Holiday Inn
(v2_id, true, false, false, false, false, false, true), -- Bulawayo Club
(v3_id, true, true, true, false, false, false, true),   -- Hillside Manor
(v4_id, true, false, true, false, false, false, true),  -- Central Lodge
(v5_id, true, false, true, false, false, false, true),  -- Musketeers
(v6_id, true, true, true, false, false, false, true),   -- Villa Thabiso
(v7_id, true, true, true, false, false, false, true),   -- Railway Museum
(v8_id, true, true, true, false, false, false, true),   -- Mozambik
(v9_id, true, true, false, true, false, false, true),   -- Smokehouse (braille menu)
(v10_id, true, false, true, false, false, false, true), -- Bowery Cafe
(v11_id, true, true, true, false, false, true, true),   -- Hillside Dams
(v12_id, true, true, true, false, false, true, true),   -- Centenary Park
(v13_id, true, false, true, false, false, true, true);  -- Silwane

-- Insert Specs
INSERT INTO public.venue_specs (venue_id, door_width, ramp_gradient, flooring, bathroom_size, table_height) VALUES
(v1_id, '36 inches', '1:12', 'Carpet/Tile', '7ft x 6ft', 'Standard'),
(v2_id, '32 inches', 'Steep', 'Hardwood/Carpet', 'N/A', 'Standard'),
(v3_id, '36 inches', 'Flat', 'Tile', '8ft x 8ft', 'Standard'),
(v4_id, '34 inches', '1:10', 'Tile', 'N/A', 'Standard'),
(v5_id, '34 inches', 'Flat', 'Tile', 'N/A', 'Standard'),
(v6_id, '38 inches', '1:12', 'Smooth Stone', '10ft x 8ft', 'Standard'),
(v7_id, '40 inches', '1:10', 'Concrete/Gravel', 'N/A', 'N/A'),
(v8_id, '36 inches', '1:12', 'Tile', '7ft x 7ft', '30 inches'),
(v9_id, '34 inches', '1:10', 'Wood', '8ft x 6ft', '32 inches'),
(v10_id, '36 inches', '1:12', 'Concrete', 'N/A', '30 inches'),
(v11_id, 'N/A', '1:20', 'Dirt/Paved', 'N/A', 'N/A'),
(v12_id, '40 inches', '1:12', 'Polished Concrete', '8ft x 8ft', 'N/A'),
(v13_id, 'N/A', 'Flat', 'Dirt/Grass', 'N/A', 'N/A');

-- Seed dummy bookings for testing
INSERT INTO public.bookings (venue_id, guest_id, guest_email, check_in_date, guest_count, special_requests, status, created_at) VALUES 
(v1_id, g1_id, 'guest1@test.com', CURRENT_DATE + INTERVAL '5 days', '2 Adults', 'Accessible parking spot required', 'approved', CURRENT_DATE - INTERVAL '2 days'),
(v8_id, g1_id, 'guest1@test.com', CURRENT_DATE + INTERVAL '2 days', '4 Adults', 'Corner table for wheelchair', 'pending', CURRENT_DATE),
(v11_id, g1_id, 'guest1@test.com', CURRENT_DATE + INTERVAL '10 days', '2 Adults', 'Ground level access needed', 'declined', CURRENT_DATE - INTERVAL '1 day');

END $$;
