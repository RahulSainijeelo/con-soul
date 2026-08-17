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
  title: "CONSOUL | Youth Group Travel India — Himalayas, Goa, Rajasthan & More",
  description: "CONSOUL is India's #1 youth group travel platform. Join 300+ young travelers on curated group trips to Himalayas, Goa, Rajasthan, Kerala & more. Book your next adventure at con-soul.in",
  keywords: 'consoul, con-soul, youth group travel india, group trips india, adventure travel, himalayas trip, goa group trip, rajasthan travel, kerala backpacking, budget travel india, young travelers india',
  openGraph: {
    title: "CONSOUL | Youth Group Travel India",
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

    return { upcomingTrips, pastTrips, reviews };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return { upcomingTrips: [], pastTrips: [], reviews: [] };
  }
}

export default async function HomePage() {
  const { upcomingTrips, pastTrips, reviews } = await getHomepageData();

  return (
    <main className="relative min-h-screen bg-black">

      <Header />

      {/* Fixed Hero Section — CONSOUL branding animation */}
      <div className="fixed inset-0 z-0">
        <StaticHero />
      </div>

      {/* Scrollable Content — overlays the fixed hero */}
      <div className="relative z-10" style={{ marginTop: '100vh' }}>
        <div
          id="trip-cards"
          className="bg-black"
          style={{
            borderRadius: "40px 40px 0 0",
            boxShadow: "0px -6px 18px 2px rgba(255,255,255,0.62)",
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
          <DestinationGrid />

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
              <button className="bg-transparent hover:bg-white/5 text-gold font-semibold py-4 px-10 rounded-xl border-2 border-gold transition-colors text-base md:text-lg active:scale-95">
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
