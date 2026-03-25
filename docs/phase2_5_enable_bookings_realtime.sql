-- ===================================================================================
-- EXPLORABLE BYO - REALTIME BOOKINGS ENABLEMENT
-- ===================================================================================
-- Supabase suppresses table broadcasts by default for security constraints.
-- This tells the Postgres replication engine to publicly broadcast changes to the 
-- `bookings` table so the Dashboards update live without a page refresh!
-- ===================================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
