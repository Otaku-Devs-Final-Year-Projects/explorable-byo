# ExplorAble BYO — Full Application Testing Guide

**Version**: Final Year Project Submission  
**Date**: May 2026  
**Live App**: *(paste your Vercel URL here)*  
**GitHub**: https://github.com/brian-mutsetsa/explorable-byo

> **Browser Note**: Use Google Chrome or Microsoft Edge for voice navigation testing. Safari has partial Web Speech API support. Firefox does not support it.

---

## Test Accounts

> These accounts were seeded directly into Supabase Auth via the project setup scripts. All passwords are `password123`. The `role` column in the `profiles` table determines access level.

| Role | Email | Password | Notes |
|---|---|---|---|
| **Admin** | admin@explorablebyo.com | Admin@1234 | Must be manually created in Supabase Auth + set `profiles.role` = `admin` |
| **Hotel Partner** | p1@demo.com | password123 | `profiles.role` = `partner` |
| **Hotel Partner** | p2@demo.com | password123 | `profiles.role` = `partner` |
| **Hotel Partner** | p3@demo.com | password123 | `profiles.role` = `partner` |
| **Hotel Partner** | p4@demo.com | password123 | `profiles.role` = `partner` |
| **Guest / Tourist** | g1@demo.com | password123 | `profiles.role` = `guest` |
| **Guest / Tourist** | g2@demo.com | password123 | `profiles.role` = `guest` |
| **Guest / Tourist** | g3@demo.com | password123 | `profiles.role` = `guest` |
| **Guest / Tourist** | g4@demo.com | password123 | `profiles.role` = `guest` |

> **How to set admin role**: Go to Supabase Dashboard → Table Editor → `profiles` table → find the user row → set `role` = `admin` and save.

---

## Section 1 — Public Pages (No Login Required)

These pages should be accessible to any visitor without an account.

---

### 1.1 Homepage (`/`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Open the live URL | Hero section loads with a photo of a hotel ramp/accessibility scene |
| 2 | Read the hero text | Should say "Bulawayo's Most Accessible Venues" or similar heading |
| 3 | Scroll down | Feature highlights section visible (accessibility icons, stats) |
| 4 | Click **Explore Venues** CTA button | Navigates to `/explore` |
| 5 | Click **Partner With Us** button (if visible) | Navigates to `/login` or `/contact` |
| 6 | Check the Navbar | Links visible: Home, Explore, Community, Training, Innovation, News, Login |
| 7 | Check bottom-right corner | Floating voice button visible (mic icon with label "Voice Off") |

---

### 1.2 Explore Venues (`/explore`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/explore` | Grid of venue cards loads from Supabase (Bulawayo venues only) |
| 2 | Check each card | Shows venue name, address, rating, price, and accessibility tag badges |
| 3 | Use the search/filter bar | Filtering by accessibility feature narrows the results |
| 4 | Click on any venue card | Navigates to `/explore/[id]` (venue detail page) |
| 5 | Check the map tab (if present) | Interactive map shows venue pins |

---

### 1.3 Venue Detail Page (`/explore/[id]`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Open a venue detail page | Full venue info loads: name, images, description, address, rating |
| 2 | Check Accessibility Features section | Badges/icons for features like ramp, accessible bathroom, wide doors, etc. |
| 3 | Check Technical Specs section | Door width, ramp gradient, flooring type displayed |
| 4 | Click the **calendar** | Interactive booking calendar loads, past dates are greyed out |
| 5 | Try to book **without being logged in** | A prompt appears: "Please log in to make a booking" |
| 6 | Click **Save Venue** without being logged in | Redirected to login page or shown a login prompt |

---

### 1.4 News (`/news`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/news` | Grid of news articles loads from Supabase |
| 2 | Check a featured article | Displayed prominently at top (if `is_featured = true`) |
| 3 | Click an article card | Navigates to `/news/[id]` with full article content |
| 4 | Navigate to `/news/[id]` directly | Article title, excerpt, category, and image render correctly |

---

### 1.5 Innovation Hub (`/innovation`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/innovation` | Cards of innovation tools/assistive tech load |
| 2 | Check card content | Each card shows title, description, and feature list |
| 3 | Check image rendering | Tool images display without broken links |

---

### 1.6 Community Forum (`/community`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/community` | Page loads with discussion posts from Supabase + sidebar with top-rated venues |
| 2 | Browse posts | Each post shows author, tag, title, like count, and reply count |
| 3 | Click a post title | Navigates to `/community/[id]` (thread detail page) |
| 4 | Try to post **without logging in** | "New Post" form is hidden or shows a "Log in to join the discussion" message |

---

### 1.7 Training Academy (`/training`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/training` | Three module cards visible: Module 1, 2, 3 |
| 2 | Check module status without login | All modules show as locked or prompt to log in |
| 3 | Click a module card without login | Redirected to `/login` or prompt shown |

---

### 1.8 Contact Page (`/contact`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/contact` | Contact form loads with fields (name, email, message) |
| 2 | Submit the form | Success message shown (or form validation errors if fields empty) |

---

### 1.9 Login / Signup (`/login`, `/signup`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/login` | Login form loads with email + password fields |
| 2 | Enter wrong credentials | Error message: "Invalid login credentials" |
| 3 | Submit empty form | Validation error shown |
| 4 | Navigate to `/signup` | Signup form loads: Full Name, Email, Password, Role selector (Guest / Partner) |
| 5 | Create a new Guest account | Redirected to `/dashboard` after email confirmation (or immediately, depending on Supabase settings) |
| 6 | Create a new Partner account | Redirected to `/dashboard` with Partner view |

---

## Section 2 — Guest / Tourist Role

**Login as**: g1@demo.com / password123  
**Starting point after login**: `/dashboard`

---

### 2.1 Guest Dashboard (`/dashboard`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Log in as Guest | Redirected to `/dashboard` with Guest view |
| 2 | Check sidebar tabs | Tabs visible: Overview, My Bookings, Saved Venues, Profile |
| 3 | **Overview tab** | Stats cards showing number of bookings and saved venues; recent bookings listed |
| 4 | **My Bookings tab** | Table of all booking requests with status (Pending / Approved / Declined) |
| 5 | **Saved Venues tab** | Grid of venues the guest has saved (heart icon) |
| 6 | **Profile tab** | Displays name, email, role (read-only) |
| 7 | Click the **bell icon** (top-right) | Notification dropdown opens showing recent booking status updates |
| 8 | Click Sign Out | Logged out, redirected to `/` |

---

### 2.2 Making a Booking (Guest)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/explore` and open any venue | Venue detail page loads |
| 2 | Click a date on the booking calendar | Date is selected / date range begins |
| 3 | Select check-in and check-out dates | Date range highlighted on calendar |
| 4 | Fill in guest count, special requests | Form fields accept input |
| 5 | Click **Request Booking** | Booking is inserted into Supabase `bookings` table; success message shown |
| 6 | Click **Send Enquiry** button in the modal | Modal closes; booking appears in Guest Dashboard → My Bookings as "Pending" |
| 7 | Try to select a fully booked date | Date is greyed out and unclickable |
| 8 | Try to select a past date | Past dates are greyed out and unclickable |

---

### 2.3 Saving Venues (Guest)

| # | Action | Expected Result |
|---|---|---|
| 1 | On any venue detail page, click the **heart / Save** button | Venue is saved; button changes state to "Saved" |
| 2 | Go to Dashboard → Saved Venues | The saved venue appears in the list |
| 3 | Click the heart/unsave button again | Venue is removed from saved list |

---

### 2.4 Community Forum — Posting & Replying (Guest)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/community` while logged in | "New Post" form is visible at the top |
| 2 | Fill in post Title, Content, and select a Tag | Form accepts all input |
| 3 | Click **Post** | New post appears at the top of the feed immediately (optimistic update) |
| 4 | Click the post title | Navigates to `/community/[id]` thread page |
| 5 | On the thread page, type a reply in the reply box | Text field accepts input |
| 6 | Click **Post Reply** | Reply appears below the original post |
| 7 | Click the **Helpful / Thumbs Up** button on the original post | Like count increments by 1 |
| 8 | Open the same thread in another browser tab | New replies appear in real-time without refreshing (Supabase Realtime) |

---

### 2.5 Training Academy (Guest, logged in)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/training` | Module 1 is **unlocked** (clickable); Modules 2 and 3 are **locked** |
| 2 | Click **Module 1: Foundations of Awareness** | Navigates to `/training/1`, full module content loads |
| 3 | Read through the module content | 5 paragraphs of educational content visible |
| 4 | Click **Mark as Complete** | Button shows loading, then changes to "Completed ✓" |
| 5 | Navigate back to `/training` | Module 1 shows as **Completed** (green badge); Module 2 is now **unlocked** |
| 6 | Complete Module 2 (`/training/2`) | Module 2 marked complete; Module 3 unlocks |
| 7 | Complete Module 3 (`/training/3`) | All modules complete; certificate banner appears |
| 8 | Click the **certificate** link | Navigates to `/training/certificate` |
| 9 | On the certificate page | Certificate renders with user name, completion date, all 3 module names, and two signature lines |
| 10 | Click **Download / Print Certificate** | Browser print dialog opens (PDF save is possible via print dialog) |
| 11 | Try visiting `/training/2` without completing Module 1 | Page shows "Module Locked" message |

---

## Section 3 — Hotel Partner / Manager Role

**Login as**: p1@demo.com / password123  
**Prerequisite**: A venue in the `venues` table must have `owner_id` set to this user's UUID.

---

### 3.1 Partner Dashboard (`/dashboard`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Log in as Partner | Redirected to `/dashboard` with Partner view |
| 2 | Check sidebar tabs | Overview, Bookings, My Venues, Reviews, Profile |
| 3 | **Overview tab** | Stats: Total Enquiries, Profile Views (mock: 124), Average Rating (mock: 4.8); recent booking requests listed |
| 4 | **Bookings tab** | Full table of all incoming booking requests for partner's venues |
| 5 | Find a **Pending** booking | Two action buttons visible: **Approve** and **Decline** |
| 6 | Click **Approve** | Booking status changes to "Approved" in the table; guest receives a notification |
| 7 | Click **Decline** on another booking | Booking status changes to "Declined"; guest receives a notification |
| 8 | Real-time update: Guest submits a booking | New row appears in Partner's booking table without page refresh |
| 9 | **My Venues tab** | Cards for all venues linked to this partner account |
| 10 | Check venue card | Shows venue image, name, address, "Verified" badge, Daily Capacity setting |
| 11 | Click **Daily Capacity** button | Browser prompt asks for new capacity number; enter a value and confirm → updates in Supabase |
| 12 | Click **✎ Edit Listing** | Navigates to `/dashboard/edit/[venue-id]` |
| 13 | **Reviews tab** | Shows "No Reviews Yet" placeholder (feature scope is phase 2+) |
| 14 | **Profile tab** | Displays name, email, role = "Partner" (read-only) |
| 15 | Click Sign Out | Logged out, redirected to `/` |

---

### 3.2 Edit Venue Listing (`/dashboard/edit/[id]`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to Edit Listing from Partner Dashboard | Full edit form loads with current venue data pre-filled |
| 2 | Verify auth guard | Navigating to another partner's venue ID redirects or shows error |
| 3 | Change the **Venue Name** field and save | Name updates in Supabase; success message shown |
| 4 | Change the **Description** | Saves correctly |
| 5 | Change the **Price per night** | Saves correctly |
| 6 | Edit **Capacity** field | Saves correctly |
| 7 | Paste a new **Image URL** | Preview updates on save |
| 8 | Toggle **Wheelchair Ramp** feature checkbox | Feature toggled; saved to `venue_features` table via upsert |
| 9 | Toggle other accessibility checkboxes | All 7 accessibility feature toggles work: Ramp, Accessible Bathroom, Wide Doorways, Elevator, Braille Signage, Hearing Loop, Accessible Parking |
| 10 | Edit **Door Width (cm)** in Technical Specs | Saves to `venue_specs` table |
| 11 | Edit **Ramp Gradient** | Saves to `venue_specs` |
| 12 | Edit **Flooring Type** | Saves to `venue_specs` |
| 13 | Click **Save All Changes** | All changes written to Supabase; toast/success message shown |
| 14 | Navigate back and open the venue on `/explore/[id]` | Updated data is reflected on the public detail page |

---

## Section 4 — Admin Role

**Login as**: admin@explorablebyo.com / Admin@1234  
**Prerequisite**: `profiles.role` = `admin` in Supabase for this user.

**Direct URL**: `/admin`

> Attempting to visit `/admin` while logged in as a Guest or Partner will redirect to `/explore`.

---

### 4.1 Admin Portal Overview Tab

| # | Action | Expected Result |
|---|---|---|
| 1 | Log in as Admin and navigate to `/admin` | Admin portal loads with 4 tabs: Overview, Venue Verification, News, Innovation |
| 2 | **Overview tab** | 4 stats cards visible: Total Users, Total Venues, Pending Approval, Community Posts (live counts from Supabase) |
| 3 | Quick action buttons | "Add News Article" and "Add Innovation Tool" buttons navigate to the correct tabs |
| 4 | Try visiting `/admin` as a Guest | Redirected to `/explore` |

---

### 4.2 Venue Verification Tab

| # | Action | Expected Result |
|---|---|---|
| 1 | Click **Venue Verification** tab | List of unverified venues (where `is_verified = false`) appears |
| 2 | Click **Approve** on a pending venue | `is_verified` set to `true` in Supabase; venue disappears from pending list |
| 3 | Click **Reject** on a pending venue | Venue row deleted from Supabase; removed from list |
| 4 | Check the **All Venues** table below | Full list of all venues in the system with name and verified status |
| 5 | Verify an approved venue | Badge shows "Verified" on the all-venues table |

---

### 4.3 News CMS Tab

| # | Action | Expected Result |
|---|---|---|
| 1 | Click **News** tab | Form to create a new article + list of existing articles below |
| 2 | Fill in **Title**, **Excerpt**, **Category**, **Image URL** | Form accepts all input |
| 3 | Toggle **Featured Article** checkbox | Checkbox toggles on/off |
| 4 | Click **Publish Article** | Article inserted into `news_articles` table; appears in existing articles list |
| 5 | Navigate to `/news` as a public visitor | New article appears in the news grid |
| 6 | Click **Delete** on an existing article in admin | Article removed from Supabase; disappears from list immediately |

---

### 4.4 Innovation CMS Tab

| # | Action | Expected Result |
|---|---|---|
| 1 | Click **Innovation** tab | Form to add a new tool + list of existing tools |
| 2 | Fill in **Title**, **Description**, **Image URL** | Form accepts all input |
| 3 | Fill in **Features** (comma-separated) | e.g. "Screen reader, Voice control, Haptic feedback" |
| 4 | Click **Add Tool** | Tool inserted into `innovation_tools` table; appears in list |
| 5 | Navigate to `/innovation` | New tool card appears on the page |
| 6 | Click **Delete** on an existing tool | Removed from Supabase and list |

---

## Section 5 — Voice Navigation

Voice navigation is available on **every page** via the floating button in the bottom-right corner.

> **Browser**: Must use Chrome or Edge. Microphone permission must be granted.

| # | Voice Command to Say | Expected Result |
|---|---|---|
| 1 | Click the mic button | Button turns green ("Voice Active"); transcript box appears |
| 2 | Say **"go home"** or **"home page"** | Visual flash: "Opening Home" → navigates to `/` |
| 3 | Say **"explore"** or **"venues"** | Navigates to `/explore` |
| 4 | Say **"community"** or **"forum"** | Navigates to `/community` |
| 5 | Say **"training"** or **"academy"** | Navigates to `/training` |
| 6 | Say **"innovation"** or **"tools"** | Navigates to `/innovation` |
| 7 | Say **"news"** or **"updates"** | Navigates to `/news` |
| 8 | Say **"login"** or **"partner"** | Navigates to `/login` |
| 9 | Say **"scroll down"** | Page scrolls down 600px smoothly |
| 10 | Say **"scroll up"** | Page scrolls up 600px smoothly |
| 11 | Click the mic button again | Returns to red dot ("Voice Off"), listening stops |
| 12 | Navigate to a new page | Voice button is present and functional on all pages (mounted in root layout) |

---

## Section 6 — Real-Time Features

These tests verify Supabase Realtime subscriptions are working.

| # | Test | How to Test | Expected Result |
|---|---|---|---|
| 1 | **Booking notification** | Guest submits a booking enquiry | Partner dashboard updates booking count in real-time without refresh |
| 2 | **Booking status push** | Partner approves a booking | Guest dashboard booking status changes from "Pending" to "Approved" in real-time |
| 3 | **Community new post** | User A posts in `/community` | User B (same page, different tab) sees the post appear without refreshing |
| 4 | **Thread new reply** | User A posts a reply on `/community/[id]` | User B on the same thread sees the reply appear without refreshing |

---

## Section 7 — Edge Cases & Error Handling

| # | Scenario | Expected Result |
|---|---|---|
| 1 | Navigate to `/admin` as Guest | Redirected to `/explore` |
| 2 | Navigate to `/dashboard/edit/[other-venue-id]` as a Partner | Access denied or redirect (auth guard checks `owner_id`) |
| 3 | Navigate to `/training/2` without completing Module 1 | "Module Locked" message displayed |
| 4 | Navigate to `/training/certificate` without completing all 3 modules | "Not Eligible" screen with link back to training |
| 5 | Navigate to `/community/invalid-uuid` | Redirected to `/community` (post not found handler) |
| 6 | Try to book more rooms than daily capacity | Fully booked dates appear greyed out in calendar |
| 7 | Submit booking enquiry while not logged in | Prompt to log in shown; booking not submitted |
| 8 | Open site in Firefox | Voice button still visible, but clicking it shows "Speech API Not Supported" in the transcript display |

---

## Section 8 — Page Route Reference

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage / hero |
| `/explore` | Public | Venue search and filter grid |
| `/explore/[id]` | Public (booking requires auth) | Venue detail + booking calendar |
| `/community` | Public (post requires auth) | Forum feed |
| `/community/[id]` | Public (reply requires auth) | Individual thread + replies |
| `/training` | Auth required | Module list with progress |
| `/training/[id]` | Auth required | Individual module content |
| `/training/certificate` | Auth required (all modules complete) | Printable certificate |
| `/innovation` | Public | Assistive tech showcase |
| `/news` | Public | News articles grid |
| `/news/[id]` | Public | Full article page |
| `/login` | Public | Login form |
| `/signup` | Public | Signup form (Guest or Partner) |
| `/dashboard` | Auth required | Guest or Partner dashboard (role-based) |
| `/dashboard/edit/[id]` | Partner only | Venue editing form |
| `/admin` | Admin only | Admin portal |
| `/contact` | Public | Contact / enquiry form |

---

## Known Prototype Limitations

- **Payment**: EcoCash/Paynow integration is not implemented — this is intentional for the prototype. The booking system operates as an *enquiry* flow. The venue detail page notes "No payment required to enquire."
- **Profile editing**: The "Update Profile" button on the dashboard is disabled with a "coming soon" label.
- **Reviews**: The Partner Dashboard Reviews tab shows a placeholder — review submission UI is not in scope for this phase.
- **Email confirmation**: Depending on Supabase settings, new signups may require email confirmation before logging in. Disable this in Supabase Auth settings for demo testing.
