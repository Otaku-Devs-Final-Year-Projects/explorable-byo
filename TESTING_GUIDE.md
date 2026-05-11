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

## Role Access Matrix

This table defines exactly which pages each role can access. These access rules are enforced both in the navbar (links are hidden for unauthorised roles) and at the page level (blocked users see a gate screen).

| Page / Route | Public (no login) | Guest | Partner | Admin |
|---|:---:|:---:|:---:|:---:|
| `/` (Homepage) | ✅ | ✅ | ✅ | ✅ |
| `/explore` | ✅ | ✅ | ✅ | ✅ |
| `/explore/[slug]` | ✅ (view only) | ✅ | ✅ | ✅ |
| `/news` | ✅ | ✅ | ✅ | ✅ |
| `/news/[slug]` | ✅ | ✅ | ✅ | ✅ |
| `/contact` | ✅ | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ | ✅ |
| `/signup` | ✅ | ✅ | ✅ | ✅ |
| `/community` | ❌ login required | ✅ (post/reply) | ✅ | ✅ |
| `/community/[id]` | ❌ login required | ✅ (reply) | ✅ | ✅ |
| `/dashboard` | ❌ | ✅ (guest view) | ✅ (partner view) | ✅ |
| `/training` | ❌ | ❌ partner only | ✅ | ✅ |
| `/training/[id]` | ❌ | ❌ partner only | ✅ | ✅ |
| `/training/certificate` | ❌ | ❌ partner only | ✅ (all modules complete) | ✅ |
| `/innovation` | ❌ | ❌ partner only | ✅ | ✅ |
| `/innovation/*` | ❌ | ❌ partner only | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ❌ | ✅ |

**Navbar link visibility by role:**

| Nav Link | Public | Guest | Partner | Admin |
|---|:---:|:---:|:---:|:---:|
| Explore | ✅ | ✅ | ✅ | ✅ |
| Community | ❌ | ✅ | ✅ | ✅ |
| Training | ❌ | ❌ | ✅ | ✅ |
| Innovation | ❌ | ❌ | ✅ | ✅ |
| News | ✅ | ✅ | ✅ | ✅ |
| Contact | ✅ | ✅ | ✅ | ✅ |

---

## Section 1 — Public Pages (No Login Required)

These pages are accessible to any visitor without an account. The navbar shows: **Explore**, **News**, **Contact**, and **Login** only — Community, Training, and Innovation are hidden until the user logs in.

---

### 1.1 Homepage (`/`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Open the live URL | Hero section loads with a photo of a hotel ramp/accessibility scene |
| 2 | Read the hero text | Should say "Bulawayo's Most Accessible Venues" or similar heading |
| 3 | Scroll down | Feature highlights section visible (accessibility icons, stats) |
| 4 | Click **Explore Venues** CTA button | Navigates to `/explore` |
| 5 | Click **Partner With Us** button (if visible) | Navigates to `/login` or `/contact` |
| 6 | Check the Navbar | Links visible: **Explore**, **News**, **Contact**, **Login** — Community, Training, Innovation are hidden for public users |
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

### 1.3 Venue Detail Page (`/explore/[slug]`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Open a venue detail page | Full venue info loads: name, images, description, address, rating |
| 2 | Check the URL | URL uses a readable slug e.g. `/explore/bulawayo-rainbow-hotel`, not a UUID |
| 3 | Check Accessibility Features section | Badges/icons for features like ramp, accessible bathroom, wide doors, etc. |
| 4 | Check Technical Specs section | Door width, ramp gradient, flooring type displayed |
| 5 | Click the **calendar** | Interactive booking calendar loads, past dates are greyed out |
| 6 | Try to book **without being logged in** | A prompt appears: "Please log in to make a booking" |
| 7 | Click **Save Venue** without being logged in | Redirected to login page or shown a login prompt |

---

### 1.4 News (`/news`)

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/news` | Grid of news articles loads from Supabase |
| 2 | Check a featured article | Displayed prominently at top (if `is_featured = true`) |
| 3 | Click an article card | Navigates to `/news/[slug]` (readable slug URL) with full article content |
| 4 | Check the URL | URL uses a slug e.g. `/news/explorable-partners-with-zimbabwe-tourism-authority`, not a UUID |
| 5 | Navigate to `/news/[slug]` directly | Article title, excerpt, category, and image render correctly |

---

### 1.5 Innovation Hub (`/innovation`) — Partner/Admin Only

> This page is **not accessible to public or guest users**. Visiting `/innovation` without logging in — or while logged in as a guest — shows a "Partner Access Only" gate screen.

| # | Action | Expected Result |
|---|---|---|
| 1 | Visit `/innovation` while **not logged in** | "Login Required" gate screen is displayed (not the innovation content) |
| 2 | Visit `/innovation` while logged in as a **Guest** | "Partner Access Only" gate screen is displayed with a link to `/explore` and `/signup` |
| 3 | Check that the **Innovation** nav link is hidden | For public and guest users, the Innovation link does not appear in the navbar |
| 4 | *(Partner test — see Section 3.3)* Log in as a partner and navigate to `/innovation` | Innovation Hub loads with technology cards |

---

### 1.6 Community Forum (`/community`) — Login Required

> The Community section requires users to be **logged in**. Public visitors are redirected to a login gate. Guest and Partner users can both post and reply.

| # | Action | Expected Result |
|---|---|---|
| 1 | Visit `/community` while **not logged in** | Login gate is displayed — community content is not shown |
| 2 | Check the navbar as a public user | **Community** link is hidden from the navbar |
| 3 | *(Guest/Partner test — see Section 2.4)* Log in and navigate to `/community` | Page loads with discussion posts and "New Post" form |

---

### 1.7 Training Academy (`/training`) — Partner/Admin Only

> This page is **not accessible to public or guest users**. Visiting `/training` without logging in shows a "Login Required" gate; visiting as a guest shows a "Partner Access Only" gate.

| # | Action | Expected Result |
|---|---|---|
| 1 | Visit `/training` while **not logged in** | "Login Required" gate screen is displayed |
| 2 | Visit `/training` while logged in as a **Guest** | "Partner Access Only" gate screen is displayed |
| 3 | Check that the **Training** nav link is hidden | For public and guest users, the Training link does not appear in the navbar |
| 4 | *(Partner test — see Section 3.3)* Log in as a partner and navigate to `/training` | Training Academy loads with module cards |

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
| 4 | Click **Guest** quick-fill button (below the form) | Email and password fields auto-fill with `g1@demo.com / password123` |
| 5 | Click **Partner** quick-fill button | Fields auto-fill with `p1@demo.com / password123` |
| 6 | After quick-fill, click **Secure Login** | Logs in successfully and redirects to `/dashboard` |
| 7 | Navigate to `/signup` | Signup form loads: Full Name, Email, Password, Role selector (Guest / Partner) |
| 8 | Create a new Guest account | Redirected to `/dashboard` after email confirmation (or immediately, depending on Supabase settings) |
| 9 | Create a new Partner account | Redirected to `/dashboard` with Partner view |

---

## Section 2 — Guest / Tourist Role

**Login as**: g1@demo.com / password123  
**Starting point after login**: `/dashboard`

> **Guest role access**: Explore, Community (post/reply), News, Contact, Dashboard, Bookings, Saved Venues.  
> **Not accessible**: Training, Innovation (partner-only sections).  
> **Navbar links visible**: Explore, Community, News, Contact.

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

> Guests have full Community access. The **Community** nav link appears in the navbar after login.

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/community` while logged in | "New Post" form is visible at the top |
| 2 | Fill in post Title, Content, and select a Tag | Form accepts all input |
| 3 | Click **Post** | New post appears at the top of the feed immediately (optimistic update) |
| 4 | On the feed, click the **replies count button** (speech bubble icon + number) on any post | An inline replies panel expands beneath the post card showing all replies |
| 5 | If there are no replies | Panel shows "No replies yet. Be the first to reply →" link to the thread |
| 6 | Click the replies count button again | Panel collapses |
| 7 | Click the post title | Navigates to `/community/[id]` thread detail page |
| 8 | On the thread page, type a reply in the reply box | Text field accepts input |
| 9 | Click **Post Reply** | Reply appears immediately below the original post (optimistic update) |
| 10 | Navigate back to `/community` and expand replies | The new reply count is reflected on the post card |
| 11 | Click the **Helpful / Thumbs Up** button on the original post | Like count increments by 1 |
| 12 | Open the same thread in another browser tab | New replies appear in real-time without refreshing (Supabase Realtime) |

---

### 2.5 Training Academy Access — Blocked for Guests

> Training is **not available** to guest accounts. This section verifies the access gate works correctly.

| # | Action | Expected Result |
|---|---|---|
| 1 | While logged in as a guest, navigate to `/training` directly (type URL) | "Partner Access Only" gate screen is displayed — not module content |
| 2 | Note the gate screen | Shows "Partner Access Only" heading, brief explanation, "Explore Venues Instead" button, and "Upgrade to Partner Account" link |
| 3 | Check the navbar | **Training** and **Innovation** links are **not visible** in the navbar for guest accounts |
| 4 | Navigate to `/training/1` directly | Same "Partner Access Only" gate screen |

---

## Section 3 — Hotel Partner / Manager Role

**Login as**: p1@demo.com / password123  
**Prerequisite**: A venue in the `venues` table must have `owner_id` set to this user's UUID.

> **Partner role access**: Everything a guest can access, plus **Training Academy** and **Innovation Hub**.  
> **Navbar links visible**: Explore, Community, Training, Innovation, News, Contact.

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

### 3.3 Training Academy (`/training`) — Partner Access

| # | Action | Expected Result |
|---|---|---|
| 1 | Log in as a partner and navigate to `/training` | Training Academy loads — no gate screen |
| 2 | Check the navbar | **Training** and **Innovation** links are now visible |
| 3 | Check module list | Module 1 is **unlocked**; Modules 2 and 3 are **locked** until previous is complete |
| 4 | Click **Module 1: Foundations of Awareness** | Navigates to `/training/1`, full module content loads |
| 5 | Click **Mark as Complete** | Button changes to "Completed ✓"; progress bar updates |
| 6 | Navigate back to `/training` | Module 1 shows as **Completed** (green badge); Module 2 unlocks |
| 7 | Refresh the page | Module 1 still shows as completed (progress saved in localStorage) |
| 8 | Complete all 3 modules | Certificate banner appears; all modules show as completed |
| 9 | Click **Next Module** button after completing a module | Navigates directly to the next module |
| 10 | Navigate to `/training/certificate` | Certificate renders with user name, date, module list, and two signature lines |
| 11 | Click **Download / Print Certificate** | Browser print dialog opens — can be saved as PDF |
| 12 | Try visiting `/training/2` without completing Module 1 | "Module Locked" message displayed |

---

### 3.4 Innovation Hub (`/innovation`) — Partner Access

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/innovation` | Innovation Hub loads with three technology cards (Eco-Ramps, QR Code Signage, Sensory Lighting) |
| 2 | Check card content | Each card shows title, description, and feature list |
| 3 | Click **Watch on YouTube** (Eco-Ramp video card) | Opens a YouTube search for wheelchair ramp installation in a new tab |
| 4 | Click **View & Download Guide** (Audio QR PDF card) | Opens `/innovation/guide` in a new tab — a full printable setup guide |
| 5 | On the guide page, click **Save as PDF** | Browser print dialog opens; guide can be saved as PDF |
| 6 | Click **Learn More** on Eco-Ramps card | Navigates to `/innovation/eco-ramps` — full detail page with specs, installation guide |
| 7 | Click **Learn More** on QR Code Signage card | Navigates to `/innovation/audio-qr` — detail page with setup steps |
| 8 | Click **Learn More** on Sensory Lighting card | Navigates to `/innovation/sensory-lighting` — detail page with lighting specs |

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

> **Browser**: Works on all Chromium-based browsers — Google Chrome, Microsoft Edge, Vivaldi, Brave, Arc. Safari has partial support. Firefox does not support the Web Speech API.
> 
> **Important**: If the microphone icon in your system taskbar flickers on/off, this is a known browser behaviour when the mic encounters a transient error. The voice system will stop automatically and show "Click mic to start" — simply click the button again to retry.

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
| 11 | Stay silent for several seconds | Voice auto-restarts silently and keeps listening |
| 12 | Click the mic button again | Returns to red dot ("Voice Off"), listening stops |
| 13 | Navigate to a new page | Voice button is present and functional on all pages (mounted in root layout) |

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
| 2 | Navigate to `/training` as Guest (logged in) | "Partner Access Only" gate displayed |
| 3 | Navigate to `/innovation` as Guest (logged in) | "Partner Access Only" gate displayed |
| 4 | Navigate to `/training` without logging in | "Login Required" gate displayed |
| 5 | Navigate to `/innovation` without logging in | "Login Required" gate displayed |
| 6 | Navigate to `/community` without logging in | Login gate displayed |
| 7 | Navigate to `/dashboard/edit/[other-venue-id]` as a Partner | Access denied or redirect (auth guard checks `owner_id`) |
| 8 | Navigate to `/training/2` without completing Module 1 | "Module Locked" message displayed |
| 9 | Navigate to `/training/certificate` without completing all 3 modules | "Not Eligible" screen with link back to training |
| 10 | Navigate to `/community/invalid-uuid` | Redirected to `/community` (post not found handler) |
| 11 | Try to book more rooms than daily capacity | Fully booked dates appear greyed out in calendar |
| 12 | Submit booking enquiry while not logged in | Prompt to log in shown; booking not submitted |
| 13 | Open site in Firefox | Voice button still visible, but clicking it shows "Speech API Not Supported" in the transcript display |

---

## Section 8 — Page Route Reference

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage / hero |
| `/explore` | Public | Venue search and filter grid |
| `/explore/[slug]` | Public (booking requires auth) | Venue detail + booking calendar |
| `/community` | **Login required** (Guest+) | Forum feed with inline reply previews |
| `/community/[id]` | **Login required** (Guest+) | Individual thread + replies |
| `/training` | **Partner/Admin only** | Module list with progress |
| `/training/[id]` | **Partner/Admin only** | Individual module content |
| `/training/certificate` | **Partner/Admin only** (all modules complete) | Printable certificate |
| `/innovation` | **Partner/Admin only** | Assistive tech showcase + resource links |
| `/innovation/eco-ramps` | **Partner/Admin only** | Eco-Ramps detail page |
| `/innovation/audio-qr` | **Partner/Admin only** | Audio QR Code Signage detail page |
| `/innovation/sensory-lighting` | **Partner/Admin only** | Sensory-Friendly Lighting detail page |
| `/innovation/guide` | **Partner/Admin only** | Printable Audio QR Code Setup Guide |
| `/news` | Public | News articles grid |
| `/news/[slug]` | Public | Full article page |
| `/contact` | Public | Contact form |
| `/login` | Public | Login form with quick demo fill buttons |
| `/signup` | Public | Signup form (Guest or Partner) |
| `/dashboard` | **Auth required** | Guest or Partner dashboard (role-based view) |
| `/dashboard/edit/[id]` | **Partner only** | Venue editing form |
| `/admin` | **Admin only** | Admin portal (redirects to `/explore` otherwise) |

---

## Known Prototype Limitations

- **Payment**: EcoCash/Paynow integration is not implemented — this is intentional for the prototype. The booking system operates as an *enquiry* flow. The venue detail page notes "No payment required to enquire."
- **Profile editing**: The "Update Profile" button on the dashboard is disabled with a "coming soon" label.
- **Reviews**: The Partner Dashboard Reviews tab shows a placeholder — review submission UI is not in scope for this phase.
- **Email confirmation**: Depending on Supabase settings, new signups may require email confirmation before logging in. Disable this in Supabase Auth settings for demo testing.
