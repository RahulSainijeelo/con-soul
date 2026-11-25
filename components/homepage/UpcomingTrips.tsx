'use client';

import { EditTrip } from "@/types/Trip";
import { TripRowItem } from "@/components/trips/TripRowItem";
import { Sparkles, Compass } from "lucide-react";
import Link from "next/link";

interface UpcomingTripsProps {
  trips: EditTrip[];
}

export function UpcomingTrips({ trips }: UpcomingTripsProps) {
  // Only display real published trips from Firebase
  const displayTrips = trips || [];

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
        {/* Editorial Section Header in Blueprint Style */}
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

        {/* Real Trips List formatted in Blueprint Layout Style */}
        {displayTrips.length > 0 ? (
          <div className="flex flex-col gap-6 md:gap-8">
            {displayTrips.map((trip, index) => (
              <TripRowItem key={trip.id || index} trip={trip} index={index} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-14 px-6 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] shadow-sm">
            <Compass className="w-12 h-12 text-orange-500 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2 uppercase tracking-tight">New Expeditions Dropping Soon</h3>
            <p className="text-sm text-[var(--color-ink-muted)] mb-6 leading-relaxed">
              Our team is curating the next batch of youth departures across the Himalayas and coastal trails.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-foreground/10 hover:bg-foreground/15 text-[var(--color-ink)] font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all">
              Request a Custom Destination &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
