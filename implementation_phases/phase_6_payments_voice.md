# Phase 6: Booking Payments & Voice Navigation

## Overview
Complete the final ambitious goals from the README: integrating a local payment gateway for deposits and finalizing the voice command navigation feature for visual-accessibility.

## Tasks
- [ ] **Payment Gateway Integration (Paynow / EcoCash)**
  - Transition the booking system from an "Inquiry" to a "Confirmed Booking with Deposit".
  - Integrate a Node.js-compatible SDK/API for Zimbabwean payments (e.g., Paynow).
  - Update `bookings` table with `payment_status` and `transaction_id`.
- [ ] **Voice Command Navigation Wiring**
  - Enable `react-speech-recognition` across the `app/layout.tsx` so it persists on all pages.
  - Map specific voice commands (`"Go Home"`, `"Search Venues"`, `"Read Features"`) to router pushes and text-to-speech output.
  - Implement a subtle UI toggle (microphone icon in the corner) to let users know voice nav is active.

## Notes & Resources
- Testing payment gateways requires sandbox accounts. Ensure you mock this properly before production.
- Voice recognition on the web requires explicit browser permissions, ensure the fallback/prompt UX is friendly.
