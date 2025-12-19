# ExplorAble Collection: Bulawayo 🇿🇼

> **A premium, accessibility-first hospitality platform connecting guests with inclusive luxury venues in Zimbabwe.**

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_|_Supabase_|_Tailwind-black)
![Accessibility](https://img.shields.io/badge/Accessibility-Voice_Control_Enabled-blue)

## 📖 Overview

**ExplorAble Collection** is a specialized booking and discovery platform designed to solve a critical gap in Zimbabwe's tourism sector: the lack of reliable accessibility information. 

Unlike standard booking sites, ExplorAble treats accessibility features (ramps, sensory quiet zones, braille signage) as first-class citizens, not footnotes. The system combines a "Cinematic Luxury" aesthetic with rigorous technical specifications to serve guests with diverse mobility and sensory needs.

## ✨ Key Features

### 🏨 For Guests
- **Accessibility-First Filtering:** Instantly filter venues by specific needs (Wheelchair Access, Sensory Quiet, Braille Support).
- **Interactive Map Engine:** Visual discovery of Bulawayo's top venues using **Leaflet & CartoDB** high-definition tiles.
- **Voice Command Navigation:** Fully functional voice control (e.g., *"Scroll Down"*, *"Go Home"*) for hands-free browsing.
- **Detailed Technical Specs:** View exact door widths (cm), ramp gradients, and flooring types before booking.
- **Real-Time Booking Requests:** Direct inquiry system connected to venue owners.

### 💼 For Partners (Venues)
- **Secure Dashboard:** Authenticated portal for venue managers to track profile views and enquiries.
- **Real-Time Analytics:** Live tracking of booking requests and guest demographics.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Row Level Security)
- **Maps:** Leaflet.js, React-Leaflet, OpenStreetMap
- **Icons:** Lucide React
- **Design:** Custom Glassmorphism UI with "Unoptimized" image handling for low-bandwidth environments.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
- Node.js 18+ installed.
- A Supabase account (Free tier is sufficient).

### 2. Installation

```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/explorable-byo.git](https://github.com/YOUR_USERNAME/explorable-byo.git)

# Navigate to the project folder
cd explorable-byo

# Install dependencies
npm install

```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```

### 4. Database Setup

This project requires a specific PostgreSQL schema. Run the SQL scripts provided in `docs/schema.sql` (or request the setup script) in your Supabase SQL Editor to generate:

* `venues` (with Lat/Lng coordinates)
* `venue_features`
* `venue_specs`
* `bookings`
* `profiles` (for Role-Based Access Control)

### 5. Run the Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser.

---

## 🗺️ Roadmap & Future Phases

* [x] **Phase 1 (MVP):** Public exploration, Map View, Booking Inquiries.
* [ ] **Phase 2 (Admin):** Dedicated Admin Portal for verifying new venues.
* [ ] **Phase 3 (User Accounts):** Guest profiles to save favorite venues.
* [ ] **Phase 4 (Payments):** Integration with Paynow/EcoCash for deposits.

## 🤝 Contribution

This is a final year project. Contributions, suggestions, and feedback on accessibility standards are welcome.

---

*Built with ❤️ in Bulawayo, Zimbabwe.*

```

```