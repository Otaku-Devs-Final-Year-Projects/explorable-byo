# Phase 5: Central Admin Portal

## Overview
Create a protected central hub for platform administrators to manage the integrity of the data, approve new venues, publish news articles, and add new innovation tools.

## Tasks
- [ ] **Admin Routing & Protection**
  - Create a new protected route: `app/admin/page.tsx`.
  - Ensure only users with the role `admin` in the `profiles` table can access this route (redirect others to `/explore`).
- [ ] **Venue Verification Workflow**
  - Build a dashboard view listing all "Pending" venues submitted by Partners.
  - Add "Approve" (marks `is_verified = true`) and "Reject" buttons.
- [ ] **News & Articles CMS**
  - Build a simple form in the Admin portal to insert new rows into `news_articles` (Title, Excerpt, Content, Image Upload, Category).
- [ ] **Innovation Tools CMS**
  - Form to add new low-cost technologies to the `innovation_tools` table.
- [ ] **Global Dashboard Stats**
  - Create a high-level overview showing Total Users, Total Active Venues, and Platform Visits.

## Notes & Resources
- This phase represents the operational backend of the entire platform. Without it, developers must inject data manually via SQL.
