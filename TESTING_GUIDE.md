# ExplorAble BYO — Testing Guide

**Version**: Final Year Project Submission  
**Date**: May 2026  
**Live App**: https://explorable-byo.vercel.app  
**GitHub**: https://github.com/brian-mutsetsa/explorable-byo

> **Browser Note**: Use **Google Chrome** or **Microsoft Edge** for best results. Voice navigation requires a Chromium-based browser. Firefox does not support the Web Speech API.

---

## Quick-Start: Demo Accounts

All accounts use `password123`. The login page has **quick-fill buttons** for Guest and Partner — no typing needed.

| Role | Email | Password |
|---|---|---|
| **Guest / Tourist** | g1@demo.com | password123 |
| **Hotel Partner** | p1@demo.com | password123 |
| **Admin** | admin@explorablebyo.com | Admin@1234 |

> **If partner accounts show "Partner Access Only"**: Run the SQL in `docs/fix_demo_roles.sql` in your Supabase SQL Editor to correct the demo roles.

---

## Role Access Summary

| What you can access | Public (no login) | Guest | Partner | Admin |
|---|:---:|:---:|:---:|:---:|
| Home, Explore, News, Contact | ✅ | ✅ | ✅ | ✅ |
| Community (post & reply) | ❌ | ✅ | ✅ | ✅ |
| Dashboard & Bookings | ❌ | ✅ | ✅ | ✅ |
| Training Academy | ❌ | ❌ | ✅ | ✅ |
| Innovation Hub | ❌ | ❌ | ✅ | ✅ |
| Admin Portal (`/admin`) | ❌ | ❌ | ❌ | ✅ |

**Navbar links are filtered by role** — links you can't access are automatically hidden. They are not visible in the navigation at all until you log in with the right role.

---

## Scenario 1 — A Guest Discovers and Books a Venue

> **Setup**: One browser window or device. Log in as **g1@demo.com**.  
> **Starting URL**: https://explorable-byo.vercel.app

**1.1 — Arrive as a public visitor (no login)**

Open the live URL without logging in. You land on the homepage with a hero image and the tagline about Bulawayo's most accessible venues. The navbar only shows **Home**, **Explore**, **News**, **Contact**, and **Login** — Community, Training, and Innovation are intentionally hidden.

Scroll down to see the feature highlights. Click **Explore Venues** to go to `/explore`.

Browse the venue grid. Each card shows the venue name, accessibility features, price, and rating. Click on **The Rainbow Hotel** (or any venue). The URL changes to a human-readable slug like `/explore/the-rainbow-hotel`.

On the venue detail page, check:
- The **Accessibility Features** badges (Wheelchair Ramp, Step-Free Access, etc.)
- The **Technical Specs** section (door width, ramp gradient, flooring)
- Try clicking a date on the booking calendar — you should see a prompt to log in first

**1.2 — Log in as a Guest**

Click **Login** in the navbar. On the login page, click the **Guest** quick-fill button — it auto-fills `g1@demo.com / password123`. Click **Secure Login**.

You land on the **Guest Dashboard**. Notice the navbar now shows **Community** as well. **Home** is always the first link. Training and Innovation remain hidden — those are for partners only.

**1.3 — Make a booking enquiry**

Navigate back to `/explore` and open The Rainbow Hotel. Select a check-in date on the calendar (choose a future date). Fill in guest count and any special requests (e.g. "Need roll-in shower access"). Click **Request Booking** / **Send Enquiry**.

The booking is submitted. Go to your **Dashboard → My Bookings** tab. The booking appears with status **Pending**.

**1.4 — Save a venue**

On any venue detail page, click the **Save** (heart) button. Go to **Dashboard → Saved Venues** — the venue appears there. Click it again to unsave.

---

## Scenario 2 — The Partner Sees and Responds to the Booking

> **Setup**: Open a **second browser window** (or a different device / incognito tab). Log in as **p1@demo.com**.  
> Keep the guest window from Scenario 1 open.

**2.1 — Partner Dashboard live update**

Log in as the partner. You land on the **Partner Dashboard** — the view is different from the guest's: tabs show **Overview**, **Bookings**, **My Venues**, **Reviews**, **Profile**.

Click the **Bookings** tab. The booking submitted by the guest in Scenario 1 should appear here as **Pending**. If you submitted it just moments ago, it may already be visible without refreshing (Supabase Realtime pushes new bookings live).

**2.2 — Approve the booking**

Click **Approve** on the guest's pending booking. The row status changes to **Approved** immediately.

**2.3 — Guest sees the update in real-time**

Switch back to the guest's browser window. Go to **Dashboard → My Bookings**. The booking status has changed from **Pending** to **Approved** — no page refresh needed. The guest also receives a notification (bell icon, top-right of the dashboard).

**2.4 — Decline a different booking**

Back in the partner window, find another pending booking and click **Decline**. The status changes to **Declined** and the guest dashboard reflects this too.

---

## Scenario 3 — Partner Edits Their Venue Listing

> **Continuing as p1@demo.com in the partner window.**

**3.1 — Find and edit a venue**

In the Partner Dashboard, click **My Venues**. You'll see venue cards for venues owned by this partner account. Click **Edit Listing** (pencil icon) on any venue.

On the edit page:
- Change the **venue name** or **description** and click **Save All Changes** — a success message appears
- Toggle the **Wheelchair Ramp** accessibility checkbox on or off and save
- Edit a **Technical Spec** (e.g. door width to "36 inches") and save

**3.2 — See the change reflected publicly**

Open a third tab (or the public/guest tab). Navigate to `/explore` and open that same venue. The updated name, description, or accessibility features should now show without needing to redeploy.

---

## Scenario 4 — Community Forum (Guest and Partner Talking)

> **Both windows still open**: guest (g1@demo.com) and partner (p1@demo.com).

**4.1 — Guest posts a question**

In the guest window, click **Community** in the navbar (visible because the guest is logged in). Click on the **New Post** form at the top. Fill in:
- Title: e.g. "Does Rainbow Hotel have accessible parking?"
- Content: "Planning a visit, just want to confirm accessible parking is available."
- Tag: select **Question**

Click **Post**. The post appears at the top of the feed immediately (optimistic update — no page refresh needed).

**4.2 — Partner sees the post and replies**

Switch to the partner window. Click **Community**. The guest's post should already be visible (Supabase Realtime delivers it live). Click the post title to open the thread.

In the reply box at the bottom, type: "Yes, we have 3 accessible parking bays right at the entrance." Click **Post Reply**. The reply appears immediately.

**4.3 — Guest sees the reply without refreshing**

Switch back to the guest window. If still on the thread page, the partner's reply appears automatically. If on the community feed page, click the speech bubble / reply count button on the post — it expands to show the inline reply beneath the card.

**4.4 — Likes**

On any post (in either window), click the **thumbs up** button. The like count increments immediately.

---

## Scenario 5 — Access Control Gates

> **You can do these tests in any window, no specific order.**

**5.1 — Public user tries to access restricted pages**

Sign out completely (or open a fresh incognito tab). Try navigating directly to:

| URL | What you should see |
|---|---|
| https://explorable-byo.vercel.app/community | **Login Required** gate — no forum content |
| https://explorable-byo.vercel.app/training | **Login Required** gate |
| https://explorable-byo.vercel.app/innovation | **Login Required** gate |

Also check the navbar — only Home, Explore, News, Contact, and Login are visible. Community, Training, and Innovation links do not appear.

**5.2 — Guest tries to access partner-only pages**

Log in as **g1@demo.com**. Try navigating directly to:

| URL | What you should see |
|---|---|
| https://explorable-byo.vercel.app/training | **Partner Access Only** gate |
| https://explorable-byo.vercel.app/training/1 | **Partner Access Only** gate |
| https://explorable-byo.vercel.app/innovation | **Partner Access Only** gate |
| https://explorable-byo.vercel.app/admin | Redirected to `/explore` |

Check the navbar — **Training** and **Innovation** are hidden. **Community** is visible.

**5.3 — Partner has full access**

Log in as **p1@demo.com**. The navbar now shows all seven links: Home, Explore, Community, Training, Innovation, News, Contact. Navigate to `/training` and `/innovation` — both load their full content (no gate).

---

## Scenario 6 — Training Academy (Partner)

> **Login as p1@demo.com.**

Navigate to **Training** in the navbar. Three module cards appear. Module 1 is unlocked; Modules 2 and 3 are locked (greyed out) until previous ones are completed.

**6.1 — Work through the modules**

Click **Module 1: Foundations of Awareness**. Read through the content (5 detailed paragraphs on disability types, etiquette, and why accessible hospitality matters commercially). At the bottom, click **Mark as Complete**. The button changes to "Completed ✓" and the progress bar at the top updates.

Click the **Next Module →** button to go directly to Module 2. Complete it, then complete Module 3.

**6.2 — Certificate**

Once all 3 modules are marked complete, a **View Certificate** banner appears. Click it — or navigate to `/training/certificate`. The certificate renders with:
- Your account name and completion date
- All 3 module titles listed
- Two signature lines

Click **Download / Print Certificate**. The browser print dialog opens — you can save as PDF.

**6.3 — Progress persists**

Refresh the `/training` page. All completed modules still show their green "Completed" badge — progress is saved to localStorage and synced to Supabase where available.

**6.4 — Module locking works**

Sign out and back in on a fresh browser. Navigate to `/training/2` directly (without completing Module 1). The page shows a **Module Locked** message with a link back to the training portal.

---

## Scenario 7 — Innovation Hub (Partner)

> **Login as p1@demo.com.**

Navigate to **Innovation** in the navbar. Three technology cards load: Eco-Ramps, QR Code Signage, and Sensory-Friendly Lighting.

| Action | Expected result |
|---|---|
| Click **Watch on YouTube** on the Eco-Ramps card | Opens YouTube search for wheelchair ramp installation in a new tab |
| Click **View & Download Guide** on the QR Code card | Opens `/innovation/guide` — a full printable setup guide for audio QR codes |
| On the guide page, click **Save as PDF** | Browser print dialog opens |
| Click **Learn More** on Eco-Ramps | Full detail page: materials, gradient specs, installation steps |
| Click **Learn More** on QR Code Signage | Detail page: setup instructions, use cases |
| Click **Learn More** on Sensory Lighting | Detail page: lighting specs, recommended setup |

---

## Scenario 8 — Admin Portal

> **Login as admin@explorablebyo.com / Admin@1234**  
> **Prerequisite**: This account must have `profiles.role = 'admin'` in Supabase.

Navigate to https://explorable-byo.vercel.app/admin. The portal loads with 4 tabs.

**Overview tab**: Displays live stats — Total Users, Total Venues, Pending Approval count, Community Posts count (all pulled live from Supabase).

**Venue Verification tab**: Lists unverified venues. Click **Approve** — the venue moves to verified status and disappears from the pending list. Click **Reject** — venue is deleted from the database.

**News tab**: 
1. Fill in a article title, excerpt, category, and image URL
2. Toggle **Featured** if you want it to appear at the top of `/news`
3. Click **Publish Article** — it appears in the list below and immediately on the public `/news` page
4. Click **Delete** on any article — it's removed from Supabase and the list instantly

**Innovation tab**:
1. Fill in a tool title, description, image URL, and comma-separated features
2. Click **Add Tool** — card appears on `/innovation` for partner users
3. Click **Delete** on an existing tool to remove it

**Access guard**: Sign out, log back in as g1@demo.com, then type `/admin` in the URL. You are redirected to `/explore` — the admin portal is completely locked to non-admin roles.

---

## Scenario 9 — Voice Navigation

> Works on Chrome, Edge, and other Chromium-based browsers. Does **not** work on Firefox.

The floating mic button is in the bottom-right corner of every page.

1. Click the mic button — the dot turns **green**, label says "Voice Active", and a transcript panel appears
2. Speak these commands and confirm navigation:

| Say this | Goes to |
|---|---|
| "go home" or "home page" | `/` |
| "explore" or "venues" | `/explore` |
| "community" or "forum" | `/community` |
| "training" or "academy" | `/training` |
| "innovation" or "tools" | `/innovation` |
| "news" or "updates" | `/news` |
| "login" | `/login` |
| "scroll down" | Page scrolls down smoothly |
| "scroll up" | Page scrolls up smoothly |

3. Click the mic button again — it turns **red** immediately and the label changes to "Voice Off". Voice stops responding.
4. Repeat the on/off toggle rapidly several times — the button should respond correctly every time with no stuck-on state.
5. Navigate to a different page — the mic button is present and functional on every page.

> **Toggle reliability fix**: The button now updates state immediately on click (no waiting for the browser recognition session to end), and uses `abort()` for a clean stop. If Chrome internally restarts the mic session in the background, the button stays green and continues working transparently.

---

## Scenario 10 — Edge Cases

| What to try | Where | Expected result |
|---|---|---|
| Navigate to `/admin` as a guest | Any window logged in as guest | Redirected to `/explore` |
| Navigate to `/training` while logged in as a guest | Same | "Partner Access Only" gate |
| Navigate to `/community` without logging in | Incognito tab | "Login Required" gate |
| Navigate to `/training/2` without completing Module 1 | Partner account | "Module Locked" screen |
| Navigate to `/training/certificate` before finishing all modules | Partner account | "Not Eligible" screen with link back |
| Navigate to a made-up community thread | `/community/notarealid` | Redirected back to `/community` |
| Try to book while not logged in | Any venue detail page | Login prompt shown; booking not submitted |
| Open the site in Firefox | Any page | Voice button visible but clicking it shows "Speech API Not Supported" |

---

## Page Route Reference

| Route | Who can access | Description |
|---|---|---|
| `/` | Everyone | Homepage |
| `/explore` | Everyone | Venue search and filter grid |
| `/explore/[slug]` | Everyone (booking requires login) | Venue detail + booking calendar |
| `/news` | Everyone | News articles grid |
| `/news/[slug]` | Everyone | Full article |
| `/contact` | Everyone | Contact form |
| `/login` | Everyone | Login with quick demo fill buttons |
| `/signup` | Everyone | Signup — Guest or Partner role |
| `/community` | **Login required** | Forum feed with inline reply previews |
| `/community/[id]` | **Login required** | Thread detail + replies |
| `/dashboard` | **Login required** | Role-based dashboard (Guest view or Partner view) |
| `/dashboard/edit/[id]` | **Partner only** | Edit venue listing |
| `/training` | **Partner / Admin only** | Training module list |
| `/training/[id]` | **Partner / Admin only** | Individual training module |
| `/training/certificate` | **Partner / Admin only** (all complete) | Printable completion certificate |
| `/innovation` | **Partner / Admin only** | Assistive tech showcase |
| `/innovation/eco-ramps` | **Partner / Admin only** | Eco-Ramps detail |
| `/innovation/audio-qr` | **Partner / Admin only** | Audio QR Signage detail |
| `/innovation/sensory-lighting` | **Partner / Admin only** | Sensory Lighting detail |
| `/innovation/guide` | **Partner / Admin only** | Printable QR setup guide |
| `/admin` | **Admin only** | Admin portal |

---

## Known Prototype Limitations

- **Payment**: No EcoCash/Paynow integration — intentional for the prototype. Bookings are enquiry-based only ("No payment required to enquire").
- **Profile editing**: The Update Profile button on the dashboard shows a "coming soon" state.
- **Reviews**: The Partner Dashboard Reviews tab shows a placeholder — review submission is out of scope for this phase.
- **Email confirmation**: New signups may require email confirmation before logging in. For demo testing, disable this in your Supabase project under **Authentication → Settings → Email Confirmations**.


