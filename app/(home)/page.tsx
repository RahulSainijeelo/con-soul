import { Metadata } from 'next';
import { db } from "@/config/firebase";
import { StaticHero } from "@/components/homepage/StaticHero";
import { UpcomingTrips } from "@/components/homepage/UpcomingTrips";
import { PreviousTrips } from "@/components/homepage/PreviousTrips";
import { DestinationGrid } from "@/components/homepage/DestinationGrid";
import { WhyConsoul } from "@/components/homepage/WhyConsoul";
import { StrangersSection } from "@/components/homepage/StrangersSection";
import { NewsletterCapture } from "@/components/homepage/NewsletterCapture";
import { TrustStrip } from "@/components/homepage/TrustStrip";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CONSOUL INDIA | Youth Group Travel India — Himalayas, Goa, Rajasthan & More",
  description: "CONSOUL INDIA is India's #1 youth group travel platform. Join 300+ young travelers on curated group trips to Himalayas, Goa, Rajasthan, Kerala & more. Book your next adventure at con-soul.in",
  keywords: 'CONSOUL INDIA, CONSOUL, consoul, consoulindia, consoul india, consoul india travel, consoul travel, con-soul, con-soul.in, group trip, strangers trip, strangers trip India, travel with strangers, college students trip, college trip India, college group tour, youth group travel india, youth travel platform, group trips india, adventure travel, himalayas trip, goa group trip, rajasthan travel, kerala backpacking, budget travel india, young travelers india, affordable group trips for students',
  openGraph: {
    title: "CONSOUL INDIA | Youth Group Travel India",
    description: "India's youth group travel platform. Join 300+ travelers on curated group trips across Himalayas, Goa, Rajasthan & Kerala.",
    type: 'website',
    url: "https://con-soul.in",
  },
  alternates: {
    canonical: "https://con-soul.in",
  },
};

// Render dynamically — homepage fetches live data from Firebase
export const dynamic = 'force-dynamic';

function serializeDoc(doc: any) {
  const data = doc.data();
  const sanitized: any = { id: doc.id };
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof (value as any).toDate === 'function') {
      sanitized[key] = (value as any).toDate().toISOString();
    } else {
      sanitized[key] = value;
    }
  }
  // Deep clone to ensure no class instances remain
  return JSON.parse(JSON.stringify(sanitized));
}

async function getHomepageData() {
  try {
    // Fetch all data concurrently for better performance
    const [upcomingRes, pastRes, reviewsRes] = await Promise.all([
      db.collection("trips")
        .where("status", "==", "published")
        .orderBy("createdAt", "desc")
        .limit(5)
        .get(),
      db.collection("trips")
        .where("status", "==", "completed")
        .orderBy("createdAt", "desc")
        .limit(6)
        .get(),
      db.collection("reviews")
        .where("status", "==", "approved")
        .get(),
    ]);
    const upcomingTrips = upcomingRes.docs.map(serializeDoc);
    const pastTrips = pastRes.docs.map(serializeDoc);
    
    // Create a map for trip titles just for the reviews
    const tripsMap: Record<string, string> = {};
    pastTrips.forEach((t: any) => { tripsMap[t.id] = t.title; });

    const reviews = reviewsRes.docs.map(doc => {
      const data = serializeDoc(doc);
      return {
        ...data,
        tripName: tripsMap[data.tripId] || 'A Wonderful Trip'
      };
    }) as any[];

    return { upcomingTrips, pastTrips, reviews, allTrips: [...upcomingTrips, ...pastTrips] };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return { upcomingTrips: [], pastTrips: [], reviews: [], allTrips: [] };
  }
}

export default async function HomePage() {
  const { upcomingTrips, pastTrips, reviews, allTrips } = await getHomepageData();

  return (
    <main className="relative min-h-screen bg-background">

      <Header />

      {/* Fixed Hero Section — CONSOUL branding animation */}
      <div className="fixed inset-0 z-0">
        <StaticHero />
      </div>

      {/* Scrollable Content — overlays the fixed hero */}
      <div className="relative z-10" style={{ marginTop: '100vh' }}>
        <div
          id="trip-cards"
          className="bg-background"
          style={{
            borderRadius: "40px 40px 0 0",
            borderTop: "1px solid var(--color-border-subtle)",
            boxShadow: "0 -8px 30px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* 1. Guarantee Trust Strip */}
          <div className="pt-8 pb-2">
            <TrustStrip variant="guarantees" />
          </div>

          {/* 2. Upcoming Trips List */}
          <div className="mb-12 md:mb-0">
            <UpcomingTrips trips={upcomingTrips} />
          </div>

          {/* 3. Destination Grid */}
          <DestinationGrid tripData={allTrips} />

          {/* 5. Why CONSOUL — Brand Differentiators */}
          <WhyConsoul />

          {/* 5b. Strangers → Friends */}
          <StrangersSection />

          {/* 6. Past Trips Gallery — Social Proof */}
          <PreviousTrips pastTrips={pastTrips} reviews={reviews} />

          {/* 7. Newsletter / Lead Capture */}
          <NewsletterCapture />

          {/* 8. Contact CTA */}
          <div className="flex justify-center pb-10 md:pb-10 mb-20 md:mb-0">
            <Link href="/contact">
              <button className="bg-transparent hover:bg-white/5 text-foreground font-semibold py-4 px-10 rounded-xl border-2 border-foreground transition-colors text-base md:text-lg active:scale-95">
                Contact Us
              </button>
            </Link>
          </div>

          {/* 9. SEO Footer */}
          <Footer />
        </div>
      </div>

      <BottomTabBar />
    </main>
  );
}
