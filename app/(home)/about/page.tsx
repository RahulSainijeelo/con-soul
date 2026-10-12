import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { Users, Shield, Sparkles, Heart, MapPin, Mountain, Star, Compass, Calendar, Phone, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About CONSOUL INDIA — India's Youth Group Travel Platform",
  description: "CONSOUL INDIA organises curated youth group trips across India — from Himalayas to Goa, Rajasthan to Kerala. Learn about our mission and join 300+ happy travelers.",
  openGraph: {
    title: "About CONSOUL INDIA — India's Youth Group Travel Platform",
    description: "Learn about our mission to make group travel affordable and unforgettable for young Indians.",
    url: 'https://con-soul.in/about',
  },
  alternates: {
    canonical: 'https://con-soul.in/about',
  },
};

export default function AboutPage() {
  const stats = [
    { number: "300+", label: "Happy Travelers" },
    { number: "15+", label: "Trips Completed" },
    { number: "6+", label: "Destinations" },
    { number: "4.9", label: "Avg Rating" },
  ];

  const values = [
    {
      icon: Users,
      title: "Small Groups, Big Bonds",
      description: "We keep our groups intimate — 15 to 20 travelers max. This isn't mass tourism. It's a curated circle where strangers become lifelong friends.",
      gradient: "from-foreground/15 to-foreground/10",
    },
    {
      icon: Shield,
      title: "Safety First, Always",
      description: "Professional trip leaders on every expedition, 24/7 emergency support, vetted accommodations, and comprehensive safety protocols. Your parents can relax.",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Sparkles,
      title: "No Cookie-Cutter Trips",
      description: "Forget generic tourist traps. We handpick offbeat trails, local food joints, hidden viewpoints, and authentic cultural experiences that guidebooks miss.",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      icon: Heart,
      title: "Community Over Commerce",
      description: "We're travelers first, business second. Every trip is designed around what we'd want to experience ourselves — honest pricing, no hidden costs, pure adventure.",
      gradient: "from-rose-500/20 to-pink-500/20",
    },
  ];

  const timeline = [
    { year: "2025", event: "CONSOUL INDIA was born in Bilaspur, Chhattisgarh — founded by travelers who wanted to build something real.", icon: Compass },
    { year: "2025", event: "First trip launched: Mainpat — Shimla of Chhattisgarh. 15 strangers, 2 days, lifelong memories.", icon: Mountain },
    { year: "2026", event: "Expanded to Uttarakhand, Goa, and Vizag. Crossed 100+ travelers in the community.", icon: MapPin },
    { year: "2026", event: "300+ travelers and counting. Upcoming expeditions to Spiti Valley, Andaman, and beyond.", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-foreground/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/10 border border-border text-foreground text-sm font-medium mb-6">
            <Compass className="w-4 h-4" />
            <span>Est. 2025 • Bilaspur, Chhattisgarh</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-6 tracking-tight">
            We Don&apos;t Sell Trips.
            <br />
            <span className="text-muted-foreground">We Build Tribes.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CONSOUL INDIA is India&apos;s youth group travel platform — curated expeditions where strangers become family, and every journey feeds the soul.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-foreground/[0.02]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-foreground mb-1">
                  {stat.number}
                </p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Our Story
            </h2>
            <div className="w-16 h-1 bg-foreground mx-auto mb-8 rounded-full" />
            <p className="text-muted-foreground text-lg leading-relaxed">
              We started CONSOUL because we were tired of overpriced, overcrowded, underwhelming &quot;group tours.&quot; We wanted something different — trips designed by travelers, for travelers. Small groups. Real experiences. No BS.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Born in Bilaspur, Chhattisgarh, CONSOUL is proof that you don&apos;t need to be from a metro city to build something extraordinary. We started with 15 travelers on a weekend trip to Mainpat. Today, 300+ young adventurers call this community home.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-2xl mx-auto">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-4 md:gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground/10 border border-border flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    {index < timeline.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="pt-1.5 pb-4">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">{item.year}</span>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base leading-relaxed">{item.event}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-foreground/[0.02] to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
              What We <span className="text-muted-foreground">Stand For</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These aren&apos;t just words on a page. They&apos;re promises we keep on every single trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-border bg-card p-6 md:p-8 hover:border-foreground/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-border bg-card p-8 md:p-14">
            <h2 className="text-2xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
              Ready to Find Your Tribe?
            </h2>
            <p className="text-muted-foreground mb-8 text-base md:text-lg">
              Your next adventure — and your next best friends — are one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm font-bold py-3.5 px-8 rounded-full transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md"
              >
                <Calendar className="h-4 w-4" />
                View Upcoming Trips
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 text-foreground text-sm font-semibold py-3.5 px-8 rounded-full border border-border transition-all duration-300 hover:bg-foreground/5 active:scale-95"
              >
                <Phone className="h-4 w-4" />
                Talk to Us
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Link href="https://www.instagram.com/consoul.in" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="mailto:con.sol.082025@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomTabBar />
    </div>
  );
}