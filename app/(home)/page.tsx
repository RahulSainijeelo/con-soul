import { Metadata } from 'next';
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
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://con-soul.in/#organization",
      "name": "CONSOUL",
      "url": "https://con-soul.in",
      "logo": "https://con-soul.in/images/logo.png",
      "description": "India's #1 youth group travel platform. Curated group trips to Himalayas, Goa, Rajasthan, Kerala & more.",
      "sameAs": [
        "https://www.instagram.com/consoul.in"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "300",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://con-soul.in/#website",
      "url": "https://con-soul.in",
      "name": "CONSOUL",
      "publisher": {
        "@id": "https://con-soul.in/#organization"
      }
    }
  ]
};

export default async function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <UpcomingTrips />
          </div>

          {/* 3. Destination Grid */}
          <DestinationGrid />

          {/* 5. Why CONSOUL — Brand Differentiators */}
          <WhyConsoul />

          {/* 5b. Strangers → Friends */}
          <StrangersSection />

          {/* 6. Past Trips Gallery — Social Proof */}
          <PreviousTrips />

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
