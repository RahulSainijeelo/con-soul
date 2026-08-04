import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Award, Globe, Shield, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: "About CONSOUL — India's Youth Group Travel Platform",
  description: "CONSOUL organises curated youth group trips across India — from Himalayas to Goa, Rajasthan to Kerala. Learn about our mission and join 300+ happy travelers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gold mb-6">
            Redefining Luxury Travel
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
            We curate exclusive journeys for the discerning traveler, blending adventure with unparalleled comfort.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Our Philosophy
            </h2>
            <div className="w-24 h-1 bg-gold mb-8" />
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              At CONSOUL, we believe that travel is not just about moving from one place to another; it's about the transformation that happens along the way. Our mission is to provide experiences that touch the soul and create memories that last a lifetime.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Every trip is meticulously crafted to ensure the highest standards of luxury, safety, and authenticity. From private island retreats to guided expeditions in the world's most remote corners, we open doors to the extraordinary.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 transform translate-x-4 translate-y-4 rounded-2xl" />
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Luxury Travel Experience"
              className="relative rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                <Globe className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Reach</h3>
              <p className="text-gray-400">Access to exclusive destinations across all seven continents.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Service</h3>
              <p className="text-gray-400">Award-winning concierge service available 24/7 for your needs.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Safe & Secure</h3>
              <p className="text-gray-400">Your safety is our priority with comprehensive travel protection.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Guides</h3>
              <p className="text-gray-400">Led by local experts who bring each destination to life.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}