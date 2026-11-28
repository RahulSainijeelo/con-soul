'use client';

import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface TripRowItemProps {
  trip: any;
  index: number;
}

export function TripRowItem({ trip, index }: TripRowItemProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const startDateFormatted = formatDate(trip.startDate);
  const endDateFormatted = formatDate(trip.endDate);
  const dateRange = startDateFormatted && endDateFormatted ? `${startDateFormatted} - ${endDateFormatted}` : trip.duration || 'Flexible Dates';

  // Contiki-style Route formatting: prioritize travelRoute stops if present, otherwise parse destination
  const routeString = trip.destination || 'Expedition Route';
  const routeStops: string[] = trip.travelRoute && trip.travelRoute.length > 0
    ? Array.from(new Set(trip.travelRoute.flatMap((r: any) => [r.from, r.to]).filter(Boolean))) as string[]
    : routeString.includes('→')
    ? routeString.split('→').map((s: string) => s.trim())
    : routeString.includes(' - ')
    ? routeString.split(' - ').map((s: string) => s.trim())
    : [routeString];

  const durationDays = trip.duration?.match(/\d+/)?.[0] || (trip.duration ? trip.duration : '7');
  const countriesCount = trip.countriesCount || 1;
  const citiesCount = trip.citiesCount || (routeStops.length > 1 ? routeStops.length : 4);
  const transitMode = trip.mode === 'train' ? 'Train & Coach' : 'Force Urbania';
  const registrationDeposit = trip.registrationAmount || 999;
  const tripTargetUrl = `/trip/${trip.slug || trip.id}`;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] hover:border-orange-500/40 transition-all duration-300 shadow-sm hover:shadow-xl group">
      <div className="flex flex-col lg:flex-row lg:h-[300px]">
        {/* ── Left: Image — balanced horizontal strip on desktop ── */}
        <div className="relative w-full h-56 sm:h-60 lg:h-full lg:w-[360px] shrink-0 overflow-hidden bg-black/20">
          <img
            src={trip.images?.[0]?.url || '/placeholder-trip.jpg'}
            alt={trip.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          {/* Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
              {trip.category || 'Group Tour'}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/25">
              ₹{registrationDeposit} Deposit
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-white/90">
            <span className="inline-flex items-center gap-1 font-bold bg-white/15 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {trip.rating || '4.8'}
            </span>
            <span className="font-semibold text-white/80">{trip.maxParticipants || 24} spots</span>
          </div>
        </div>

        {/* ── Right: Info — fills remaining width cleanly ── */}
        <div className="w-full lg:flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-between gap-2.5">
          <div className="space-y-2 min-w-0">
            {/* Route + Departure Dates */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-500 uppercase tracking-wider min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{routeStops.length > 1 ? routeStops.join(' → ') : routeString}</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-ink-faint)] shrink-0">
                <Calendar className="w-3 h-3" />
                {dateRange}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-[var(--color-ink)] leading-tight tracking-tight uppercase group-hover:text-orange-500 transition-colors line-clamp-2">
              {trip.title}
            </h3>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-[var(--color-ink-muted)]">
              <span><strong className="text-[var(--color-ink)]">{durationDays}</strong> Days</span>
              <span className="text-[var(--color-border-subtle)]">·</span>
              <span><strong className="text-[var(--color-ink)]">{countriesCount}</strong> {countriesCount > 1 ? 'Countries' : 'Region'}</span>
              <span className="text-[var(--color-border-subtle)]">·</span>
              <span><strong className="text-[var(--color-ink)]">{citiesCount}</strong> Stops</span>
              <span className="text-[var(--color-border-subtle)]">·</span>
              <span className="text-orange-500 font-bold">{transitMode}</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-[var(--color-ink-muted)] leading-relaxed line-clamp-2">
              {trip.description || 'Curated youth group expedition with handpicked stays and a dedicated captain.'}
            </p>

            {/* Campus Tribe strip */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-faint)] mr-0.5">
                Tribe:
              </span>
              {['IITs', 'BITS', 'SRCC', 'DU', 'NIFT', 'AIIMS'].map((campus) => (
                <span
                  key={campus}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-foreground/[0.04] border border-[var(--color-border-subtle)] text-[var(--color-ink-muted)]"
                >
                  {campus}
                </span>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-4 pt-2.5 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-ink-faint)]">From</span>
              <span className="text-xl sm:text-2xl font-black text-[var(--color-ink)]">₹{Number(trip.price).toLocaleString('en-IN')}</span>
              {trip.originalPrice && trip.originalPrice > trip.price && (
                <span className="text-xs line-through text-[var(--color-ink-faint)]">₹{Number(trip.originalPrice).toLocaleString('en-IN')}</span>
              )}
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 ml-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Reserve for ₹{registrationDeposit}
              </span>
            </div>
            <Link
              href={tripTargetUrl}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              View Itinerary <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
