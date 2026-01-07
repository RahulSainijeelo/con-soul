# Con-Soul: Premium Adventure & Nightlife Platform

Con-Soul is a high-end travel and adventure management platform designed specifically for nightlife, exploration, and premium trip experiences. Built with modern web technologies, it offers a seamless experience for both travelers looking for their next adventure and administrators managing complex trip logistics.

## Vision
To redefine the way people discover and book premium nightlife and travel experiences, combining luxury with adventure through an intuitive digital interface.

## Key Features

### For Travelers
- **Trip Discovery:** Explore upcoming premium trips with high-quality visuals and detailed itineraries.
- **Booking System:** Multi-stage booking process for joining trips easily.
- **User Profiles:** Manage personal information, view past trips, and track upcoming bookings.
- **Responsive Experience:** Fully optimized for mobile and desktop with a native-app-like feel.

### For Administrators (Dashboard)
- **Trip Management:** Comprehensive tools to create, edit, and manage upcoming and past trips.
- **Booking Overviews:** Detailed tracking of traveler bookings and enquiries.
- **Review Management:** Moderate and showcase user reviews to build community trust.
- **Content Control:** Manage portfolio items and travel articles directly from the dashboard.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State & Logic:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Database:** [Firebase Firestore](https://firebase.google.com/)
- **Authentication:** [Clerk](https://clerk.dev/) (Primary) & [NextAuth.js](https://next-auth.js.org/)
- **Visuals:** [ImgBB API](https://api.imgbb.com/) (Image Hosting), [Lottie Animations](https://lottiefiles.com/), [Lucide Icons](https://lucide.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) & [Speed Insights](https://vercel.com/docs/speed-insights)

## Project Structure

- `app/`: Next.js 13+ App Router modules (Home, Dashboard, API routes).
- `components/`: Reusable UI components (Shadcn UI, custom forms, layout parts).
- `hooks/`: Custom React hooks for profile management and dashbaord logic.
- `lib/`: Utility functions, authentication configurations, and third-party API integrations (ImgBB).
- `types/`: TypeScript definitions for Trips, Portfolio Items, and more.
- `public/`: Assets including fonts, icons, images, and Lottie animations.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd console
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file and add the following:
   ```env
   # Firebase
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY=

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # NextAuth
   NEXTAUTH_SECRET=

   # API Keys
   IMGBB_API_KEY=
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## License
This project is private and proprietary.
