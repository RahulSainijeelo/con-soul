'use client';

import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const durationDays = trip.duration?.replace(/[^0-9]/g, '') || (trip.duration ? trip.duration : '7');
  const countriesCount = trip.countriesCount || (trip.destination?.toLowerCase().includes('europe') ? 10 : 1);
  const citiesCount = trip.citiesCount || (routeStops.length > 1 ? routeStops.length : 4);
  const registrationDeposit = trip.registrationAmount || 999;
  const tripTargetUrl = `/trip/${trip.slug || trip.id}`;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] hover:border-orange-500/40 transition-all duration-300 shadow-md hover:shadow-xl group">
      <div className="flex flex-col lg:flex-row">
        {/* ── Left Column: Photography & Highlights (45%) ────────────── */}
        <div className="relative w-full lg:w-[44%] min-h-[260px] lg:min-h-[340px] overflow-hidden bg-black/20">
          <img
            src={trip.images?.[0]?.url || '/placeholder-trip.jpg'}
            alt={trip.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Overlays */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
              {trip.category || 'Group Tour'}
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
              ₹{registrationDeposit} Deposit
            </span>
          </div>

          {/* Bottom Overlays on Image */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-bold bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {trip.rating || '4.8'}
              </span>
              <span className="text-[11px] font-semibold text-white/80">
                85% Travel Solo
              </span>
            </div>
            <span className="text-[11px] font-semibold text-white/70">
              {trip.maxParticipants || 24} spots max
            </span>
          </div>
        </div>

        {/* ── Right Column: Contiki-Style Editorial Info (56%) ────────── */}
        <div className="w-full lg:w-[56%] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Contiki Dashed Route Strip */}
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-wider mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-orange-500" />
              <span className="truncate">
                {routeStops.length > 1 ? routeStops.join(' ┄┄→ ') : routeString}
              </span>
            </div>

            {/* Trip Title */}
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-ink)] leading-tight tracking-tight uppercase group-hover:text-orange-500 transition-colors mb-3">
              {trip.title}
            </h3>

            {/* Contiki European Escapade Stats Strip */}
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-xl bg-foreground/[0.04] border border-[var(--color-border-subtle)] text-[12px] font-semibold text-[var(--color-ink-muted)] mb-4">
              <span>
                <strong className="text-[var(--color-ink)] font-bold">{durationDays}</strong> Days
              </span>
              <span className="text-[var(--color-border-subtle)]">|</span>
              <span>
                <strong className="text-[var(--color-ink)] font-bold">{countriesCount}</strong> {countriesCount > 1 ? 'Countries' : 'Region'}
              </span>
              <span className="text-[var(--color-border-subtle)]">|</span>
              <span>
                <strong className="text-[var(--color-ink)] font-bold">{citiesCount}</strong> Stops
              </span>
              <span className="text-[var(--color-border-subtle)]">|</span>
              <span className="text-orange-500 font-bold">
                Force Urbania
              </span>
            </div>

            {/* Editorial Description / Tagline */}
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed line-clamp-2 mb-5">
              {trip.description || 'Curated youth group expedition. Handpicked accommodations, dedicated captain, and a tribe of curious minds.'}
            </p>

            {/* Campus Badges Strip */}
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-faint)] mr-1">
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

          {/* Pricing & CTA Row */}
          <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--color-ink-faint)]">
                  From
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[var(--color-ink)]">
                  ₹{Number(trip.price).toLocaleString('en-IN')}
                </span>
                {trip.originalPrice && trip.originalPrice > trip.price && (
                  <span className="text-sm line-through text-[var(--color-ink-faint)]">
                    ₹{Number(trip.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-emerald-500 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Reserve seat for just ₹{registrationDeposit}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={tripTargetUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Full Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
