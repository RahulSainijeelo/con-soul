'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomTabBar from '@/components/layout/BottomTabBar';
import {
  Shield,
  Users,
  MapPin,
  Calendar,
  ClipboardList,
  Phone,
  ArrowRight,
  Star,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export default function CaptainsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-sans">
      <Header />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-emerald-500/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgxMjgsMTI4LDEyOCwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/15 border border-orange-500/30 rounded-full mb-6">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Expedition Leadership
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[var(--color-ink)] uppercase tracking-tight leading-[0.95] mb-6">
            Become a<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Trip Captain
            </span>
          </h1>

          <p className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-2xl mx-auto leading-relaxed mb-10">
            Lead expeditions across India and beyond. Manage groups of 18–24 travelers,
            curate on-ground experiences, and build your leadership legacy with CONSOUL.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-in">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-8 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]">
                Sign In as Captain
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-foreground/[0.06] hover:bg-foreground/[0.1] border border-foreground/15 text-[var(--color-ink)] font-bold py-4 px-8 rounded-xl text-sm uppercase tracking-wider transition-all">
                Apply to Lead
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── What Captains Do ───────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-4xl font-black text-[var(--color-ink)] uppercase tracking-tight text-center mb-12">
          Your Role as Captain
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <Users className="w-6 h-6 text-orange-400" />,
              title: 'Lead the Tribe',
              desc: 'Manage groups of 18–24 solo travelers, foster connections, and ensure everyone feels at home from day one.',
            },
            {
              icon: <MapPin className="w-6 h-6 text-emerald-400" />,
              title: 'Curate Experiences',
              desc: 'Coordinate with local partners, restaurants, and guides to deliver handpicked cultural and adventure experiences.',
            },
            {
              icon: <ClipboardList className="w-6 h-6 text-sky-400" />,
              title: 'Manage Logistics',
              desc: 'Oversee transport, hotel check-ins, itinerary timing, and ensure the trip runs on schedule.',
            },
            {
              icon: <Shield className="w-6 h-6 text-violet-400" />,
              title: 'Safety First',
              desc: '24/7 point of contact for travelers. Handle emergencies, medical situations, and travel disruptions.',
            },
            {
              icon: <Calendar className="w-6 h-6 text-amber-400" />,
              title: 'Pre-Trip Briefings',
              desc: 'Host virtual orientation calls, manage WhatsApp groups, and prepare travelers before departure.',
            },
            {
              icon: <Star className="w-6 h-6 text-rose-400" />,
              title: 'Build Your Legacy',
              desc: 'Earn ratings, grow your reputation, and unlock opportunities to lead international expeditions.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-foreground/[0.03] border border-foreground/[0.08] rounded-2xl p-6 hover:bg-foreground/[0.06] hover:border-foreground/15 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-foreground/[0.05] border border-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-black text-[var(--color-ink)] uppercase tracking-tight mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Requirements ───────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
        <div className="bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.01] border border-orange-500/20 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Compass className="w-7 h-7 text-orange-400" />
            <h2 className="text-2xl md:text-3xl font-black text-[var(--color-ink)] uppercase tracking-tight">
              Who We're Looking For
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Age 22–35 with proven travel experience',
              'Strong leadership & people management skills',
              'Fluent in English + Hindi (other languages a plus)',
              'First-aid certification (or willingness to get one)',
              'Available for 7–30 day trip commitments',
              'Comfortable handling budgets & vendor coordination',
              'Prior experience in hospitality, events, or tourism preferred',
              'Passionate about Indian youth travel culture',
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--color-ink-muted)] leading-snug">{req}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-foreground/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-ink-faint)]">
              Ready to lead? Applications are reviewed within 48 hours.
            </p>
            <Link href="/contact">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors">
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Contact ──────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 pb-20 text-center">
        <a
          href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20becoming%20a%20CONSOUL%20Trip%20Captain"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground/[0.05] hover:bg-foreground/[0.1] border border-foreground/10 rounded-xl text-sm font-bold text-[var(--color-ink)] transition-all"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          Chat with the Captains Team on WhatsApp
        </a>
      </section>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
