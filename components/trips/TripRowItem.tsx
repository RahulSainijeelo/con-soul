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
  const countriesCount = trip.countriesCount || 1;
  const citiesCount = trip.citiesCount || (routeStops.length > 1 ? routeStops.length : 4);
  const transitMode = trip.mode === 'train' ? 'Train & Coach' : 'Force Urbania';
  const registrationDeposit = trip.registrationAmount || 999;
  const tripTargetUrl = `/trip/${trip.slug || trip.id}`;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] hover:border-orange-500/40 transition-all duration-300 shadow-sm hover:shadow-lg group">
      <div className="flex flex-col lg:flex-row lg:h-[200px]">
        {/* ── Left: Image — fixed narrow strip on desktop ── */}
        <div className="relative w-full h-44 lg:h-full lg:w-[260px] shrink-0 overflow-hidden bg-black/20">
          <img
            src={trip.images?.[0]?.url || '/placeholder-trip.jpg'}
            alt={trip.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Overlays */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
              {trip.category || 'Group Tour'}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500 text-white">
              ₹{registrationDeposit} Deposit
            </span>
          </div>
          <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[9px] text-white/90">
            <span className="inline-flex items-center gap-0.5 font-bold bg-white/15 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/20">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {trip.rating || '4.8'}
            </span>
            <span className="font-semibold text-white/70">{trip.maxParticipants || 24} spots</span>
          </div>
        </div>

        {/* ── Right: Info — fills remaining width ── */}
        <div className="w-full lg:flex-1 p-3.5 sm:p-4 flex flex-col justify-between gap-1.5">
          <div className="space-y-1.5">
            {/* Route + Title on one tight block */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-wider truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{routeStops.length > 1 ? routeStops.join(' → ') : routeString}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-[var(--color-ink)] leading-snug tracking-tight uppercase group-hover:text-orange-500 transition-colors">
              {trip.title}
            </h3>

            {/* Stats + Tribe inline */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-[var(--color-ink-muted)]">
              <span><strong className="text-[var(--color-ink)]">{durationDays}</strong> Days</span>
              <span className="text-[var(--color-border-subtle)]">·</span>
              <span><strong className="text-[var(--color-ink)]">{citiesCount}</strong> Stops</span>
              <span className="text-[var(--color-border-subtle)]">·</span>
              <span className="text-orange-500 font-bold">{transitMode}</span>
              <span className="text-[var(--color-border-subtle)]">·</span>
              <span className="text-[var(--color-ink-faint)]">Tribe: IITs · BITS · SRCC · DU · NIFT</span>
            </div>

            {/* Description — single line on desktop */}
            <p className="text-[11px] sm:text-xs text-[var(--color-ink-muted)] leading-relaxed line-clamp-1 lg:line-clamp-2">
              {trip.description || 'Curated youth group expedition with handpicked stays and a dedicated captain.'}
            </p>
          </div>

          {/* Price + CTA — compact single row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--color-ink-faint)]">From</span>
              <span className="text-lg sm:text-xl font-black text-[var(--color-ink)]">₹{Number(trip.price).toLocaleString('en-IN')}</span>
              {trip.originalPrice && trip.originalPrice > trip.price && (
                <span className="text-[10px] line-through text-[var(--color-ink-faint)]">₹{Number(trip.originalPrice).toLocaleString('en-IN')}</span>
              )}
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-500 ml-1">
                <ShieldCheck className="w-2.5 h-2.5" /> ₹{registrationDeposit} deposit
              </span>
            </div>
            <Link
              href={tripTargetUrl}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg text-[10px] uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              View Itinerary <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
