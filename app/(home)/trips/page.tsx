'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomTabBar from '@/components/layout/BottomTabBar';
import { TripRowItem } from '@/components/trips/TripRowItem';
import { DEFAULT_UPCOMING_EXPEDITIONS, combineWithBlueprintTrips } from '@/components/homepage/UpcomingTrips';
import { Sparkles, Compass, Filter } from 'lucide-react';

export default function TripsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [trips, setTrips] = useState<any[]>(DEFAULT_UPCOMING_EXPEDITIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublishedTrips() {
      try {
        const res = await fetch('/api/trips?status=published&limit=50');
        if (res.ok) {
          const json = await res.json();
          const publishedList = json.data || (Array.isArray(json) ? json : []);
          setTrips(combineWithBlueprintTrips(publishedList));
        }
      } catch (err) {
        console.error('Failed to load published trips on trips page:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPublishedTrips();
  }, []);

  const categories = [
    { id: 'all', label: 'All Expeditions' },
    { id: 'grand', label: 'Grand Expeditions' },
    { id: 'mountain', label: 'Himalayas & Mountains' },
    { id: 'beach', label: 'Coastal & Beach' },
  ];

  const filteredTrips = trips.filter((trip) => {
    if (selectedCategory === 'all') return true;
    const cat = (trip.category || '').toLowerCase();
    const title = (trip.title || '').toLowerCase();
    const dest = (trip.destination || '').toLowerCase();

    if (selectedCategory === 'grand') return cat.includes('grand') || title.includes('europe') || dest.includes('europe');
    if (selectedCategory === 'mountain') return cat.includes('mountain') || cat.includes('trek') || title.includes('himalay') || dest.includes('manali') || dest.includes('kasol');
    if (selectedCategory === 'beach') return cat.includes('beach') || cat.includes('coast') || title.includes('goa') || dest.includes('goa');
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] font-sans">
      <Header />

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em]">
              Upcoming Expeditions &bull; 85% Solo Travelers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[var(--color-ink)] leading-[0.95] mb-5">
            Curated <span className="font-serif italic font-normal text-orange-500 lowercase">expeditions</span>
          </h1>

          <p className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-2xl mx-auto leading-relaxed mb-8">
            European grand tours, Himalayan high passes, and coastal drifts with curious minds from campuses across India.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105'
                    : 'bg-foreground/[0.05] hover:bg-foreground/[0.08] text-[var(--color-ink-muted)] border border-[var(--color-border-subtle)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trips Grid / List in Contiki European Escapade Style ── */}
      <section className="container mx-auto px-4 pb-24 max-w-5xl">
        <div className="flex flex-col gap-6 md:gap-8">
          {filteredTrips.map((trip, index) => (
            <TripRowItem key={trip.id} trip={trip} index={index} />
          ))}
        </div>
      </section>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
