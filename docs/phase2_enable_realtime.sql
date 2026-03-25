-- ===================================================================================
-- EXPLORABLE BYO - ENABLE SUPABASE REALTIME
-- ===================================================================================
-- Supabase disables real-time broadcasting for all tables by default for security.
-- This command instructs the Postgres replication engine to broadcast INSERT events 
-- on the `notifications` table so our React frontend can catch them instantly.
-- ===================================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
