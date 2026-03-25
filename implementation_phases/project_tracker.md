# ExplorAble BYO - Master Project Tracker

Use this document to track your progress. When returning to work on the project, check this file to see what phase is currently active, what has been completed, and what is next in the pipeline.

---

## 🟢 Overall Progress
- **Total Phases:** 6
- **Current Active Phase:** Phase 1
- **Overall Status:** MVPs Built, Beginning Backend Integrations.

---

## 📋 Phase Checklists

### [ ] Phase 1: Authentication & Guest Profiles
*Goal: Replace mock system with robust Supabase authentication and build guest space.*
- [ ] Setup Supabase Auth Email/Password flows.
- [ ] Configure route protection middleware.
- [ ] Update Database Schema (`user_roles`).
- [ ] Build Guest Dashboard (`app/profile/page.tsx`).
- [ ] Implement "Saved Venues" feature.
- [ ] Finalize Session Management in Header.

### [ ] Phase 2: Partner Dashboard Data Entry
*Goal: Allow venue owners to control their own listings.*
- [ ] Link Partners securely to their Venue rows (RLS).
- [ ] Build Venue Details Editing Form.
- [ ] Build Accessibility Features toggle Form.
- [ ] Implement Supabase Image Uploading.
- [ ] Enable modifying booking inquiry statuses.

### [ ] Phase 3: Community & Feedback Forum
*Goal: Bring the community discussion feed to life.*
- [ ] Connect the "New Post" UI to the database.
- [ ] Implement Upvote/Like logic.
- [ ] Build the Thread Detail / Reply page.
- [ ] aggregate Real "Top Rated Venues" sidebar data.

### [ ] Phase 4: Training & Innovation Portals
*Goal: Interactive education and true file delivery.*
- [ ] Create `user_training_progress` table and logic.
- [ ] Build individual curriculum/quiz pages.
- [ ] Implement automated digital certificate generation.
- [ ] Wire up real video playback and secure PDF downloads.

### [ ] Phase 5: Central Admin Portal
*Goal: The command center for platform administrators.*
- [ ] Create protected `app/admin` route.
- [ ] Build Venue Verification workflow (Approve/Reject).
- [ ] Build News & Articles CMS.
- [ ] Build Innovation Tools CMS.

### [ ] Phase 6: Booking Payments & Voice Navigation
*Goal: The ambitious technical final touches.*
- [ ] Research and Integrate Paynow/EcoCash API.
- [ ] Update Booking logic to handle transaction IDs.
- [ ] Wire `react-speech-recognition` to global layout.
- [ ] Map voice commands to router and text-to-speech.

---
*Last Updated: 2026-03-25*
