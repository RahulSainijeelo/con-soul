'use client';

import { EditTrip } from "@/types/Trip";
import { TripRowItem } from "@/components/trips/TripRowItem";
import { Sparkles, Compass } from "lucide-react";
import Link from "next/link";

export const DEFAULT_UPCOMING_EXPEDITIONS: any[] = [
  {
    id: "european-escapade",
    title: "European Escapade",
    destination: "London → Paris → Rome → Venice → Berlin → Amsterdam",
    category: "Grand Expedition",
    description: "The one that ticks off all your bucket list cities in less than a month. Twin-share boutique hotels, Force Urbania & coach transit, dedicated captain, and a tribe of 85% solo travelers.",
    images: [
      { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80" },
    ],
    startDate: "2026-11-10T00:00:00.000Z",
    endDate: "2026-12-03T00:00:00.000Z",
    duration: "24 Days",
    countriesCount: 10,
    citiesCount: 23,
    price: 268500,
    originalPrice: 298000,
    registrationAmount: 999,
    status: "published",
    difficulty: "Moderate",
    maxParticipants: 24,
    currentParticipants: 18,
    rating: 4.8,
    mode: "bus",
  },
  {
    id: "himalayas-kasol",
    title: "Himalayan Kasol & Kheerganga Drift",
    destination: "Delhi → Kasol → Chalal → Kheerganga → Tosh",
    category: "Mountain Trek",
    description: "Camp under Kasol stars, soak in natural sulfur hot springs at 9,700 ft, and share deep midnight conversations with students from IITs, BITS, and DU.",
    images: [
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" },
    ],
    startDate: "2026-12-15T00:00:00.000Z",
    endDate: "2026-12-21T00:00:00.000Z",
    duration: "7 Days",
    countriesCount: 1,
    citiesCount: 4,
    price: 14500,
    originalPrice: 17999,
    registrationAmount: 999,
    status: "published",
    difficulty: "Moderate Trek",
    maxParticipants: 20,
    currentParticipants: 14,
    rating: 4.9,
    mode: "bus",
  },
  {
    id: "goa-coastal-drift",
    title: "Goa Coastal Drift & Tribe Gathering",
    destination: "Mumbai / Bilaspur → North Goa → South Goa → Palolem",
    category: "Beach & Culture",
    description: "Secret cliffside coves, sunset beach shacks, Portuguese heritage trails, and non-stop ocean vibes with youth travelers from across India.",
    images: [
      { url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" },
    ],
    startDate: "2026-12-27T00:00:00.000Z",
    endDate: "2027-01-02T00:00:00.000Z",
    duration: "6 Days",
    countriesCount: 1,
    citiesCount: 3,
    price: 18500,
    originalPrice: 21999,
    registrationAmount: 999,
    status: "published",
    difficulty: "Easy Pace",
    maxParticipants: 24,
    currentParticipants: 19,
    rating: 4.8,
    mode: "bus",
  },
];

/**
 * Combines real published expeditions from Firestore with the European Escapade
 * blueprint catalog so that the platform always showcases a robust lineup of 
 * departures in the European Escapade style. Real trips appear first.
 */
export function combineWithBlueprintTrips(realTrips: any[] = []): any[] {
  if (!realTrips || realTrips.length === 0) {
    return DEFAULT_UPCOMING_EXPEDITIONS;
  }

  const realIds = new Set(realTrips.map((t) => (t.slug || t.id || '').toLowerCase()));
  const realTitles = new Set(realTrips.map((t) => (t.title || '').toLowerCase().trim()));

  // Filter out blueprint trips that match real published trips by id, slug, or title
  const supplementalBlueprint = DEFAULT_UPCOMING_EXPEDITIONS.filter((bp) => {
    const bpId = (bp.slug || bp.id || '').toLowerCase();
    const bpTitle = (bp.title || '').toLowerCase().trim();
    return !realIds.has(bpId) && !realTitles.has(bpTitle);
  });

  return [...realTrips, ...supplementalBlueprint];
}

interface UpcomingTripsProps {
  trips: EditTrip[];
}

export function UpcomingTrips({ trips }: UpcomingTripsProps) {
  // Combine real published trips with curated European Escapade blueprint expeditions
  const displayTrips = combineWithBlueprintTrips(trips);

  return (
    <section
      id="upcoming-trips"
      className="py-16 md:py-24 bg-[var(--color-canvas)] relative z-10"
      style={{
        borderTop: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Contiki Editorial Section Header */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em]">
              Next Departures &bull; 85% Travel Solo
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--color-ink)] leading-[0.95] mb-4">
            Upcoming <span className="font-serif italic font-normal text-orange-500 lowercase">expeditions</span>
          </h2>

          <p className="text-sm md:text-base text-[var(--color-ink-muted)] max-w-2xl mx-auto leading-relaxed">
            Curated group trips designed for curious young minds. Lock your seat with just <strong className="text-[var(--color-ink)] font-bold">₹999 deposit</strong>.
          </p>
        </div>

        {/* Trips List in Contiki European Escapade Style */}
        <div className="flex flex-col gap-6 md:gap-8">
          {displayTrips.map((trip, index) => (
            <TripRowItem key={trip.id || index} trip={trip} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
