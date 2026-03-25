# Phase 3: Community & Feedback Forum

## Overview
Connect the static UI of the Community page (`app/community/page.tsx`) to Supabase to enable real-time posting, liking, replying, and reviewing.

## Tasks
- [ ] **Create New Post Logic**
  - Wire up the "New Post/Discussion" form to insert rows into the `community_posts` table.
  - Fetch the current user's profile to populate the `author_name` and avatar automatically.
- [ ] **Interactive Thread Feeds**
  - Implement the "Like/Upvote" button logic (requires a `post_likes` table to prevent duplicate votes).
  - Implement a real-time subscription (Supabase Realtime) so the feed updates when someone posts a new discussion.
- [ ] **Thread Detail Page (`app/community/[id]/page.tsx`)**
  - Create the detail page for a specific discussion.
  - Implement the commenting/reply system (requires a `community_replies` table).
- [ ] **Top Rated Venues Sidebar**
  - Replace the hardcoded sidebar data with an aggregation query that pulls the top 3 venues ranked by `rating` or review count from the `venues` table.

## Notes & Resources
- Row Level Security (RLS) is crucial here: Any authenticated user can create a post, but users can only delete/edit their own posts.
