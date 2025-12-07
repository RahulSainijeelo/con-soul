import { Metadata } from 'next';
import { HeroSection } from "@/components/homepage/HeroSection";
import { UpcomingTrips } from "@/components/homepage/UpcomingTrips";
import { PreviousTrips } from "@/components/homepage/PreviousTrips";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Con-Soul,Find Your Next Adventure",
  keywords: 'Night Life, Travel, Adventure, Fun',
  openGraph: {
    title: "Home",
    description: "Welcome to Con-Soul,Find Your Next Adventure",
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">
      <Header />

      {/* Fixed Hero Section */}
      <div className="fixed inset-0 z-0">
        <HeroSection />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10" style={{ marginTop: '100vh' }}>
        <div className="bg-black" style={{ borderRadius: "40px 40px 0 0", boxShadow: "0px -6px 18px 2px rgba(255,255,255,0.62)" }}>
          <UpcomingTrips />
          <PreviousTrips />
          <div className="flex justify-center pb-10">
            <Link href="/contact">
              <button className="bg-transparent hover:bg-white/5 text-gold font-semibold py-3 px-8 rounded-xl border-2 border-gold transition-colors text-lg">
                Contact Us
              </button>
            </Link>
          </div>
          <Footer />
        </div>
      </div>

      <BottomTabBar />
    </main>
  );
}
