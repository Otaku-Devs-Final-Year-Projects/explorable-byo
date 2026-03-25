# Phase 1: Authentication & Guest Profiles

## Overview
Replace the current `localStorage` mock session with a robust Supabase Authentication system for both Guests and Partners. Build out the Guest Profile so users can save favorite venues and track their inquiries.

## Tasks
- [ ] **Setup Supabase Auth**
  - Implement Email/Password login and signup forms (`app/login/page.tsx`, `app/signup/page.tsx`).
  - Configure Supabase Auth in the Next.js App Router (Middleware for route protection).
- [ ] **Database Schema Updates**
  - Ensure the `profiles` table is correctly linked to `auth.users` via trigger.
  - Create a `user_roles` enum (guest, partner, admin).
- [ ] **Guest Dashboard (`app/profile/page.tsx`)**
  - Create the UI for the Guest Profile.
  - Fetch and display the user's booking inquiries from the `bookings` table.
  - Implement "Saved/Favorite Venues" functionality (requires a new `saved_venues` table).
- [ ] **Partner Redirection**
  - Ensure Partners are properly redirected to `app/dashboard/page.tsx` upon login instead of the guest profile.
- [ ] **Session Management**
  - Update Header (`app/explore/page.tsx`, `app/page.tsx`) to show correct state ("Logout" instead of "Partner Login") based on real active session.

## Notes & Resources
- Check `docs/schema.sql` (if available) for existing profile structures.
- Use Supabase SSR package (`@supabase/ssr`) for Next.js 14+ App Router compatibility.
