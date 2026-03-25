# Phase 4: Training & Innovation Portals

## Overview
Make the Training & Awareness portal interactive by tracking user progress and delivering real quiz/certification logic. Also, hook up the actual video/PDF assets for the Innovation tools.

## Tasks
- [ ] **Training Content & Progress Tracking**
  - Create a `user_training_progress` table linking `user_id`, `module_id`, and `status`.
  - Build individual module pages (`app/training/[id]/page.tsx`) with real text/video content and a "Mark Complete" button.
  - Implement a quiz component at the end of the final module.
- [ ] **Certification System**
  - Once all modules are marked complete, automatically generate a digital certificate for the user (using a library like `jspdf` or just a printable styled HTML page).
- [ ] **Innovation Asset Delivery**
  - Update `app/innovation/page.tsx` to include an accessible video player for the tutorials.
  - Upload PDF guides to Supabase Storage and link the "Download PDF" buttons to the secure public URL of the asset.
  
## Notes & Resources
- Ensure the training videos have closed captions/subtitles by default to align with the platform's accessibility goals.
