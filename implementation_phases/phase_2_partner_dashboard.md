# Phase 2: Partner Dashboard Data Entry

## Overview
Transform the Partner Dashboard from a read-only display shell into a fully functional data entry portal where venue owners can update their listings, upload images, and edit specific accessibility metrics.

## Tasks
- [ ] **Link Partners to Venues**
  - Ensure Row Level Security (RLS) restricts venue editing so partners can only edit venues they own (`owner_id` in `venues` table).
- [ ] **Venue Editing Form**
  - Create a new sub-route (e.g., `app/dashboard/edit/[id]/page.tsx`).
  - Build a comprehensive form to edit venue details (Name, Description, basic info).
- [ ] **Accessibility Features Form**
  - Build specific toggle/input sections to update the `venue_features` and `venue_specs` tables (e.g., ramp gradients, door widths).
- [ ] **Image Uploading**
  - Implement Supabase Storage integration so partners can upload venue images.
  - Update the `image_url` on the UI instantly after upload.
- [ ] **Booking Inquiry Management**
  - Allow partners to change the status of booking inquiries in the dashboard (from "Pending" to "Approved" or "Declined").

## Notes & Resources
- Ensure `venue_specs` and `venue_features` tables are structured to accept easy boolean toggles and numeric measurements from the form.
