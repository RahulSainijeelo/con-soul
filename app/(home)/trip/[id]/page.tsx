'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import BottomTabBar from '@/components/layout/BottomTabBar';
import {
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  MapPin,
  Users,
  Calendar,
  Zap,
  Check,
  X,
  UtensilsCrossed,
  Ticket,
  Bus,
  Train,
  Star,
  Share2,
  Heart,
  ArrowRight,
  Camera,
  Shield,
  Phone,
  Compass,
  Globe2,
  Coffee,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────
interface ItineraryDay {
  day: number;
  from: string;
  to?: string;
  title: string;
  description: string;
  meals: string[];
  experiencesCount: number;
  highlightExperience?: string;
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  category: string;
  description: string;
  content: string;
  images: { url: string; deleteUrl?: string }[];
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  originalPrice?: number;
  maxParticipants: number;
  currentParticipants?: number;
  difficulty?: string;
  duration?: string;
  countriesCount?: number;
  citiesCount?: number;
  included?: string[];
  notIncluded?: string[];
  itinerary?: ItineraryDay[];
  travelRoute?: {
    from: string;
    to: string;
    mode: 'train' | 'bus';
    classes: string[];
    departureTime: string;
    arrivalTime: string;
    duration?: string;
    notes?: string;
  }[];
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  registrationAmount?: number;
  mode?: 'bus' | 'train';
  price_3ac?: number;
  price_sleeper?: number;
}

interface Booking {
  id: string;
  status: string;
  tripId: string;
  paymentStatus?: string;
  amountPaid?: number;
}

// ─── Highlights Carousel Sub-Component (Contiki-style) ─────────────
function HighlightsCarousel({
  included,
  addOns,
}: {
  included: { day: number; from: string; to?: string; experience: string; image: string }[];
  addOns: { day: number; from: string; experience: string; image: string }[];
}) {
  const [activeFilter, setActiveFilter] = useState<'included' | 'addons'>('included');
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = activeFilter === 'included' ? included : addOns;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Contiki-style pill toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveFilter('included')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            activeFilter === 'included'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-[var(--color-border-subtle)] text-[var(--color-ink-muted)] hover:bg-[var(--color-border-hover)]'
          }`}
        >
          Included <span className={`text-xs px-1.5 py-0.5 rounded ${activeFilter === 'included' ? 'bg-white/20' : 'bg-[var(--color-border-subtle)]'}`}>{included.length}</span>
        </button>
        <button
          onClick={() => setActiveFilter('addons')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            activeFilter === 'addons'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-[var(--color-border-subtle)] text-[var(--color-ink-muted)] hover:bg-[var(--color-border-hover)]'
          }`}
        >
          Add-ons <span className={`text-xs px-1.5 py-0.5 rounded ${activeFilter === 'addons' ? 'bg-white/20' : 'bg-[var(--color-border-subtle)]'}`}>{addOns.length}</span>
        </button>
      </div>

      {/* Carousel with nav arrows */}
      <div className="relative group/carousel">
        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] shadow-lg flex items-center justify-center text-[var(--color-ink-muted)] opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--color-border-subtle)]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] shadow-lg flex items-center justify-center text-[var(--color-ink-muted)] opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--color-border-subtle)]">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1">
          {items.map((item, i) => (
            <div key={`${activeFilter}-${i}`} className="w-[260px] lg:w-[300px] shrink-0 snap-start group cursor-pointer">
              <div className="rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] transition-all hover:shadow-lg bg-[var(--color-canvas-raised)]">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.experience} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[var(--color-ink-faint)] font-medium">
                    Day {String(item.day).padStart(2, '0')} &middot; {item.from}{(item as any).to ? ` \u2192 ${(item as any).to}` : ''}
                  </p>
                  <p className="text-sm font-semibold text-orange-500 leading-snug group-hover:text-orange-600 transition-colors">
                    {item.experience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TripReview {
  id: string;
  userName?: string;
  name?: string;
  rating: number;
  comment: string;
  certifiedHighlight?: string;
  status?: string;
  createdAt?: string;
}

// ─── Content-to-Itinerary Parser (Blueprint Format) ─────────────────
/**
 * Automatically parses unstructured trip content into the day-by-day
 * blueprint format (day, from, to, title, description, highlightExperience, meals).
 * This ensures ANY real trip created in Firestore seamlessly adheres to the layout blueprint.
 */
function parseItineraryFromContent(raw: string, fallbackDestination = 'Expedition'): ItineraryDay[] {
  if (!raw || typeof raw !== 'string') return [];
  const dayRegex = /(?:^|\n)(?:###\s*)?Day\s*(\d+)[:\s–—-]+([^\n]+)/gi;
  const matches = [...raw.matchAll(dayRegex)];
  if (matches.length === 0) return [];

  return matches.map((m, idx) => {
    const dayNum = parseInt(m[1], 10);
    const dayTitle = m[2].trim();
    const startIndex = (m.index ?? 0) + m[0].length;
    const nextMatch = matches[idx + 1];
    const endIndex = nextMatch && nextMatch.index !== undefined ? nextMatch.index : raw.length;
    const bodyText = raw.slice(startIndex, endIndex).trim();

    // Determine from / to from title (e.g. 'Delhi to Manali' or 'Journey to Parvati Valley')
    let from = fallbackDestination;
    let to: string | undefined = undefined;
    if (dayTitle.toLowerCase().includes(' to ')) {
      const parts = dayTitle.split(/\s+to\s+/i);
      from = parts[0].replace(/^(journey|drive|transfer|trek)\s+/i, '').trim();
      to = parts[1].trim();
    } else if (dayTitle.includes('&')) {
      from = dayTitle.split('&')[0].trim();
    } else {
      from = dayTitle;
    }

    // Determine highlight experience
    const paragraphs = bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const firstSentence = (paragraphs[0] || dayTitle).split(/[.\n]/)[0].trim();
    const highlight = firstSentence.length > 10 && firstSentence.length < 90 ? firstSentence : dayTitle;

    // Determine meals
    const meals: string[] = [];
    const lowerBody = bodyText.toLowerCase();
    if (lowerBody.includes('breakfast')) meals.push('Breakfast Included');
    if (lowerBody.includes('dinner')) meals.push('Dinner Included');
    if (lowerBody.includes('lunch')) meals.push('Lunch Included');
    if (meals.length === 0) meals.push(idx === 0 ? 'Dinner Included' : 'Breakfast Included');

    return {
      day: dayNum,
      from,
      to,
      title: dayTitle,
      description: bodyText || dayTitle,
      highlightExperience: highlight,
      meals,
      experiencesCount: Math.max(1, paragraphs.length || 1),
    };
  });
}

// ─── Main Page Component ─────────────────────────────────────────────
export default function TripPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [relatedTrips, setRelatedTrips] = useState<Trip[]>([]);
  const [tripReviews, setTripReviews] = useState<TripReview[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [allExpanded, setAllExpanded] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const TAB_SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'map-itinerary', label: 'Map & Itinerary' },
    { id: 'faqs', label: 'FAQs' },
  ];

  useEffect(() => {
    const sectionIds = TAB_SECTIONS.map((t) => `tab-section-${t.id}`);
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveTab(sectionId.replace('tab-section-', '')); }); },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [trip]);

  useEffect(() => {
    const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!tripId) return;
    const fetchData = async () => {
      try {
        const [tripRes, relatedRes] = await Promise.all([
          fetch(`/api/trips/${tripId}`),
          fetch('/api/trips?status=published&limit=10'),
        ]);

        let resolvedTripId = tripId;

        if (tripRes.ok) {
          const tripData = await tripRes.json();
          resolvedTripId = tripData.id || tripId;

          // 1. Itinerary parsing from content if not structured
          if (!tripData.itinerary || tripData.itinerary.length === 0) {
            const parsed = parseItineraryFromContent(tripData.content, tripData.destination || tripData.title);
            tripData.itinerary = parsed;
          }

          // 2. Travel route derivation
          if (!tripData.travelRoute || tripData.travelRoute.length === 0) {
            if (tripData.itinerary && tripData.itinerary.length > 1) {
              tripData.travelRoute = tripData.itinerary.map((d: any, idx: number, arr: any[]) => ({
                from: d.from || tripData.destination || 'Departure Hub',
                to: d.to || arr[idx + 1]?.from || d.from,
                mode: tripData.mode || 'bus',
                classes: ['Force Urbania'],
                departureTime: '08:00',
                arrivalTime: '14:00',
                duration: '4h-6h',
                notes: d.highlightExperience || d.title,
              }));
            } else {
              tripData.travelRoute = [];
            }
          }

          // 3. Dynamic counts & metadata
          if (!tripData.countriesCount) {
            tripData.countriesCount = 1;
          }
          if (!tripData.citiesCount) {
            const stops = new Set([
              ...(tripData.travelRoute || []).flatMap((r: any) => [r.from, r.to]).filter(Boolean),
              ...(tripData.itinerary || []).map((d: any) => d.from).filter(Boolean),
            ]);
            tripData.citiesCount = stops.size > 1 ? stops.size : (tripData.itinerary?.length || 4);
          }
          if (!tripData.duration && tripData.itinerary?.length) {
            tripData.duration = `${tripData.itinerary.length} Days`;
          }
          if (!tripData.registrationAmount) {
            tripData.registrationAmount = 999;
          }

          setTrip(tripData);

          const [reviewsRes, bookingsRes] = await Promise.all([
            fetch(`/api/reviews?tripId=${encodeURIComponent(resolvedTripId)}`),
            session?.user?.email
              ? fetch(`/api/user/bookings?tripId=${encodeURIComponent(resolvedTripId)}&checkOnly=true`)
              : Promise.resolve(null),
          ]);

          if (reviewsRes.ok) {
            const reviewsJson = await reviewsRes.json();
            const approved = Array.isArray(reviewsJson)
              ? reviewsJson.filter((r: TripReview) => r.status === 'approved')
              : [];
            setTripReviews(approved);
          } else {
            setTripReviews([]);
          }

          if (bookingsRes && bookingsRes.ok) {
            const bookingData = await bookingsRes.json();
            if (bookingData.exists && bookingData.booking) setBooking(bookingData.booking);
          }
        } else {
          setTrip(null);
        }

        if (relatedRes.ok) {
          const relJson = await relatedRes.json();
          const list = relJson.data || (Array.isArray(relJson) ? relJson : []);
          const filtered = list.filter((t: any) => t.id !== resolvedTripId && t.slug !== tripId).slice(0, 3);
          setRelatedTrips(filtered);
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, session]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => { const next = new Set(prev); if (next.has(day)) next.delete(day); else next.add(day); return next; });
  };

  const toggleExpandAll = () => {
    if (allExpanded) { setExpandedDays(new Set()); setAllExpanded(false); }
    else { setExpandedDays(new Set((trip?.itinerary || []).map((d) => d.day))); setAllExpanded(true); }
  };

  const openLightbox = (index: number) => { setLightboxIndex(index); setLightboxOpen(true); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--color-ink-faint)] text-sm tracking-widest uppercase">Loading expedition...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col justify-between">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center max-w-lg my-auto">
          <Compass className="w-16 h-16 text-orange-500 mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl font-black uppercase tracking-tight mb-3">Expedition Not Found</h1>
          <p className="text-[var(--color-ink-muted)] mb-8 text-sm leading-relaxed">
            This expedition could not be found or is no longer accepting departures. Explore our latest live departures across India.
          </p>
          <Link
            href="/trips"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-full text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25"
          >
            Explore All Expeditions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  const currentTrip = trip;
  const tripImages = currentTrip.images?.map((img) => img.url) || [];
  const depositAmount = currentTrip.registrationAmount || 999;
  const spotsLeft = currentTrip.maxParticipants - (currentTrip.currentParticipants || 0);
  const startDate = new Date(currentTrip.startDate);
  const endDate = new Date(currentTrip.endDate);

  const getBookingCTA = () => {
    if (!booking) {
      return (
        <Link href={`/trip/${currentTrip.id}/join`} className="block w-full">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-full transition-all text-sm tracking-wide">
            Select Dates
          </button>
        </Link>
      );
    }
    switch (booking.status) {
      case 'confirmed':
        return (<button className="w-full bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-full cursor-default flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> Booking Confirmed</button>);
      case 'registrationConfirmed':
        return (<Link href={`/my-trips/${booking.id}`} className="block w-full"><button className="w-full bg-amber-500 text-black font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"><CheckCircle2 className="w-5 h-5" /> Registration Confirmed</button></Link>);
      case 'pending':
        return (<button className="w-full bg-yellow-600/80 text-white font-bold py-3.5 px-6 rounded-full cursor-default flex items-center justify-center gap-2"><Clock className="w-5 h-5" /> Booking Pending</button>);
      default:
        return (<Link href={`/trip/${currentTrip.id}/join`} className="block w-full"><button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-full transition-all text-sm">Select Dates</button></Link>);
    }
  };

  const routeStart = currentTrip.travelRoute?.[0]?.from || currentTrip.itinerary?.[0]?.from || currentTrip.destination?.split('→')[0]?.trim() || currentTrip.destination || 'Expedition Hub';
  const routeEnd = currentTrip.travelRoute?.[currentTrip.travelRoute.length - 1]?.to || currentTrip.itinerary?.[currentTrip.itinerary.length - 1]?.to || currentTrip.itinerary?.[currentTrip.itinerary.length - 1]?.from || currentTrip.destination?.split('→').slice(-1)[0]?.trim() || routeStart;

  // Add-on experiences dynamically derived from itinerary
  const addOnExperiences = (currentTrip.itinerary || []).slice(0, 8).map((d, i) => {
    const act = d.highlightExperience || d.title;
    return {
      day: d.day,
      from: d.from,
      experience: `Optional Activity: ${act.slice(0, 48)}`,
      image: tripImages[i % (tripImages.length || 1)] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    };
  });

  const includedHighlights = (currentTrip.itinerary || [])
    .filter((d) => d.highlightExperience)
    .map((d) => ({ day: d.day, from: d.from, to: d.to, experience: d.highlightExperience!, image: tripImages[d.day % tripImages.length] || tripImages[0] }));

  return (
    <>
      <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] pb-24 md:pb-0 font-sans selection:bg-orange-500 selection:text-white">
        <Header />

        {/* ═══════════════════════════════════════════════════════════
            1. HERO — Full-width photo (Contiki-style)
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative w-full">
          {tripImages.length > 0 && (
            <div className="relative h-[45vh] md:h-[50vh] overflow-hidden">
              <img
                src={tripImages[0]}
                alt={currentTrip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay card at bottom — Contiki-style title strip */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="mx-4 md:mx-8 mb-4 md:mb-6 max-w-xl">
                  <div className="bg-[#1a1d24]/90 backdrop-blur-sm rounded-2xl px-6 py-5 md:px-8 md:py-6">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-1">originals</p>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-[0.95]">
                      {currentTrip.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Top-right actions */}
              <div className="absolute top-4 right-4 md:right-8 flex items-center gap-2">
                <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2.5 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full border border-black/5 dark:border-white/15 transition-all hover:scale-110" aria-label="Wishlist">
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-white'}`} />
                </button>
                <button onClick={() => { if (navigator.share) navigator.share({ title: currentTrip.title, url: window.location.href }); else { navigator.clipboard.writeText(window.location.href); alert('Trip link copied!'); } }} className="p-2.5 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full border border-black/5 dark:border-white/15 transition-all hover:scale-110" aria-label="Share">
                  <Share2 className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
              </div>
            </div>
          )}

          {/* ── Contiki-style route + stats strip (dark background) ── */}
          <div className="bg-[#1a1d24] text-white">
            <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
              {/* Dynamic Route */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold">{routeStart}</span>
                </div>
                <div className="flex-1 max-w-[200px] border-t-2 border-dashed border-white/30 relative">
                  <ArrowRight className="w-4 h-4 text-white/50 absolute -right-1 -top-2" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{routeEnd}</span>
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
              </div>

              {/* Dynamic Stats */}
              <div className="flex items-center justify-center gap-6 md:gap-10">
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-black">{currentTrip.duration?.replace(/[^0-9]/g, '') || (currentTrip.itinerary?.length ? String(currentTrip.itinerary.length) : '7')}</span>
                  <p className="text-xs text-white/60 mt-0.5">Days</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-black">{currentTrip.countriesCount || 1}</span>
                  <p className="text-xs text-white/60 mt-0.5">{currentTrip.countriesCount && currentTrip.countriesCount > 1 ? 'Countries' : 'Region'}</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-black">{currentTrip.citiesCount || (currentTrip.itinerary?.length || 4)}</span>
                  <p className="text-xs text-white/60 mt-0.5">Stops</p>
                </div>
              </div>
            </div>

            {/* Description card — Contiki-style italic serif */}
            <div className="container mx-auto max-w-5xl px-4 pb-8">
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-serif italic text-white/90 leading-snug">
                  {currentTrip.description}
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  {currentTrip.content}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. CONTIKI-STYLE 3-TAB NAVIGATION (Overview | Map & Itinerary | FAQs)
        ═══════════════════════════════════════════════════════════ */}
        <div className={`sticky top-0 z-30 bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)] transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
          <div className="container mx-auto max-w-5xl px-4">
            <nav className="flex items-center gap-6 md:gap-8">
              {TAB_SECTIONS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(`tab-section-${tab.id}`);
                    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 72; window.scrollTo({ top: y, behavior: 'smooth' }); }
                  }}
                  className={`py-4 text-sm md:text-base font-bold transition-all border-b-3 ${
                    activeTab === tab.id
                      ? 'text-orange-500 border-orange-500'
                      : 'text-[var(--color-ink-faint)] border-transparent hover:text-[var(--color-ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            3. OVERVIEW TAB CONTENT
        ═══════════════════════════════════════════════════════════ */}
        <div id="tab-section-overview" className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-14">

          {/* ── "What you'll get from this trip" (Contiki exact) ── */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-[var(--color-ink)]">
              What you'll get from this trip
            </h2>

            {/* Price + Group Info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
              <div>
                <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">From</p>
                <p className="text-3xl font-black text-[var(--color-ink)]">{'\u20B9'}{currentTrip.price.toLocaleString()}<span className="text-sm font-normal text-[var(--color-ink-faint)] ml-1">pp</span></p>
              </div>
              <div className="hidden md:block w-px h-12 bg-[var(--color-border-subtle)]" />
              <div>
                <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Group Size</p>
                <p className="text-sm text-[var(--color-ink-muted)]">Maximum {currentTrip.maxParticipants} people</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-[var(--color-border-subtle)]" />
              <div>
                <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Accommodation</p>
                <p className="text-sm text-[var(--color-ink-muted)]">Twin-share boutique hotels</p>
              </div>
            </div>

            {/* What's included — Contiki-style vertical icon list */}
            <div className="max-w-lg mx-auto">
              <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-5">What's included:</h3>
              <div className="space-y-4">
                {currentTrip.included?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center text-orange-500">
                      {i === 0 && <Bus className="w-6 h-6" />}
                      {i === 1 && <MapPin className="w-6 h-6" />}
                      {i === 2 && <Compass className="w-6 h-6" />}
                      {i === 3 && <Coffee className="w-6 h-6" />}
                      {i === 4 && <UtensilsCrossed className="w-6 h-6" />}
                      {i === 5 && <UtensilsCrossed className="w-6 h-6" />}
                      {i === 6 && <Users className="w-6 h-6" />}
                    </div>
                    <span className="text-[15px] text-[var(--color-ink)] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Day Trip Highlights (Contiki exact) ── */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif italic text-[var(--color-ink)]">
                Day trip highlights
              </h2>
              <p className="text-sm text-[var(--color-ink-faint)]">
                Discover the moments that make this trip unforgettable — from must-see sights to optional adventures.
              </p>
            </div>
            <HighlightsCarousel included={includedHighlights} addOns={addOnExperiences} />
          </section>

          {/* ── Cross-Campus Synergy (ConSoul unique) ── */}
          <section className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-[var(--color-ink)]">
                Different Campuses. Distinct Minds. One Tribe.
              </h3>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] mb-4 leading-relaxed">
              85% join solo without a friend group. You are paired with curated, curious students and young graduates across top Indian and international universities.
            </p>
            <div className="flex flex-wrap gap-2">
              {['IIT Delhi', 'SRCC Delhi', 'BITS Pilani', 'St. Stephen\'s', 'IIM Bangalore', 'NIFT Mumbai', 'Christ Bangalore', 'Ashoka University'].map((col) => (
                <span key={col} className="px-3 py-1 bg-[var(--color-border-subtle)] border border-[var(--color-border-hover)] rounded-full text-xs font-semibold text-[var(--color-ink-muted)]">
                  {col}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            4. MAP & ITINERARY TAB
        ═══════════════════════════════════════════════════════════ */}
        <div id="tab-section-map-itinerary" className="bg-[var(--color-canvas)]">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-10">

            {/* Itinerary heading — Contiki exact */}
            <h2 className="text-3xl md:text-4xl font-serif italic text-[var(--color-ink)]">
              {currentTrip.itinerary?.length || 24}-Day Itinerary
            </h2>

            {/* Day-by-day accordion — Contiki exact structure */}
            {currentTrip.itinerary && currentTrip.itinerary.length > 0 && (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {currentTrip.itinerary.map((dayItem) => {
                  const isExpanded = expandedDays.has(dayItem.day);
                  return (
                    <div key={dayItem.day} className="group">
                      {/* Row Header — Contiki: Day # / City → City / meals / + button */}
                      <button
                        onClick={() => toggleDay(dayItem.day)}
                        className="w-full text-left py-5 md:py-6 flex items-start md:items-center justify-between gap-4 hover:bg-[var(--color-border-subtle)]/30 transition-colors px-2 rounded-lg"
                        aria-expanded={isExpanded}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--color-ink-faint)] uppercase tracking-wider">Day {dayItem.day}</p>
                          <h3 className="text-xl md:text-2xl font-bold text-orange-500">
                            {dayItem.from}
                            {dayItem.to && (
                              <> <span className="text-[var(--color-ink-faint)] font-normal mx-1">&rarr;</span> <span className="text-orange-500">{dayItem.to}</span></>
                            )}
                          </h3>
                          {/* Meal & experience tags */}
                          <div className="flex items-center gap-3 flex-wrap">
                            {dayItem.meals.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                                <span className="text-xs text-[var(--color-ink-muted)] font-medium">{dayItem.meals.join(', ')}</span>
                              </div>
                            )}
                            {dayItem.experiencesCount > 0 && (
                              <div className="flex items-center gap-1.5">
                                <Ticket className="w-4 h-4 text-orange-500" />
                                <span className="text-xs text-[var(--color-ink-muted)] font-medium">{dayItem.experiencesCount} Included experience{dayItem.experiencesCount > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expand/Collapse icon — Contiki uses - / + */}
                        <div className="shrink-0 mt-2 md:mt-0">
                          {isExpanded ? (
                            <Minus className="w-5 h-5 text-orange-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-[var(--color-ink-faint)] group-hover:text-orange-500 transition-colors" />
                          )}
                        </div>
                      </button>

                      {/* Expanded content — Contiki-style vertical timeline */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pb-6 pl-4 md:pl-6">
                          {/* Vertical timeline with location stops */}
                          <div className="border-l-2 border-dashed border-orange-500/40 pl-6 space-y-6 ml-2">
                            {/* Stop: From city */}
                            <div className="relative">
                              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-orange-500 bg-[var(--color-canvas)]" />
                              <h4 className="text-lg font-bold text-orange-500 mb-2">{dayItem.from}</h4>
                              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                                {dayItem.description}
                              </p>
                            </div>

                            {/* Stop: To city (if different) */}
                            {dayItem.to && (
                              <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-orange-500 bg-[var(--color-canvas)]" />
                                <h4 className="text-lg font-bold text-orange-500">{dayItem.to}</h4>
                              </div>
                            )}

                            {/* Highlight experience card */}
                            {dayItem.highlightExperience && (
                              <div className="relative">
                                <div className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-orange-500" />
                                <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                    <img src={tripImages[dayItem.day % tripImages.length] || tripImages[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-0.5">Included Experience</p>
                                    <p className="text-sm font-semibold text-orange-500">{dayItem.highlightExperience}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Meals badges */}
                            <div className="flex flex-wrap gap-2">
                              {dayItem.meals.map((m) => (
                                <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-border-subtle)] text-xs text-[var(--color-ink-muted)] font-medium">
                                  <UtensilsCrossed className="w-3 h-3 text-orange-500" />
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Expand/Collapse all */}
            <div className="text-center">
              <button onClick={toggleExpandAll} className="px-6 py-2.5 bg-[var(--color-border-subtle)] hover:bg-[var(--color-border-hover)] rounded-full text-sm font-bold text-[var(--color-ink-muted)] transition-all">
                {allExpanded ? 'Collapse All Days' : 'Expand All Days'}
              </button>
            </div>

            {/* ── What's Included / Not Included ── */}
            <section className="space-y-6 pt-8 border-t border-[var(--color-border-subtle)]">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-emerald-500/20 rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Check className="w-5 h-5 text-emerald-500" /></div>
                    <h3 className="text-lg font-bold text-[var(--color-ink)]">What's Included</h3>
                  </div>
                  <div className="space-y-3">
                    {currentTrip.included?.map((inc, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--color-ink-muted)]">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-red-500/20 rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center"><X className="w-5 h-5 text-red-500" /></div>
                    <h3 className="text-lg font-bold text-[var(--color-ink)]">Not Included</h3>
                  </div>
                  <div className="space-y-3">
                    {currentTrip.notIncluded?.map((notInc, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--color-ink-muted)]">{notInc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Booking / Deposit Info (ConSoul unique) ── */}
            <section className="border border-orange-500/20 border-dashed rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Book with confidence</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Zap className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">Only {'\u20B9'}{depositAmount} deposit to book</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">No booking fee, no change fee</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Shield className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">Pay balance 15 days before</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Phone className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">24/7 support</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            5. FAQs TAB — Cancellation & Refund Policy
        ═══════════════════════════════════════════════════════════ */}
        <div id="tab-section-faqs" className="bg-[var(--color-canvas)]">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-10">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-[var(--color-ink)]">
              Trip FAQs
            </h2>

            {/* Cancellation Policy */}
            <div className="border border-[var(--color-border-subtle)] rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
              <div className="flex items-center gap-3 mb-5">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Cancellation & Refund Policy</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">&gt; 15 Days Prior</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Full refund (minus gateway fee) or 100% transfer.</p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">15 – 10 Days Prior</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">10% registration fee refunded (90% locked).</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">&lt; 10 Days Prior</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Strictly non-refundable due to vendor commitments.</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--color-ink-faint)] pt-3 border-t border-[var(--color-border-subtle)]">
                <span>Questions on flexible booking or travel insurance?</span>
                <Link href="/refund-policy" className="text-orange-500 hover:underline font-bold">Read Complete Terms &rarr;</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            6. TRIP REVIEWS (Real Firestore reviews only)
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-[var(--color-canvas)]">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-[var(--color-ink)]">
              Trip Reviews
            </h2>

            {tripReviews.length > 0 ? (
              <>
                {(() => {
                  const avgRating = (
                    tripReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) /
                    tripReviews.length
                  ).toFixed(1);
                  return (
                    <div className="text-center space-y-3">
                      <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Overall Rating</p>
                      <p className="text-6xl font-black text-[var(--color-ink)]">{avgRating}</p>
                      <p className="text-sm font-semibold text-[var(--color-ink-muted)]">Out Of 5</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-5 h-5 ${
                              s <= Math.round(Number(avgRating))
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300 dark:text-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--color-ink-faint)]">
                        Based on {tripReviews.length} Verified Traveler Review{tripReviews.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  );
                })()}

                <div className="grid md:grid-cols-2 gap-4">
                  {tripReviews.map((review) => {
                    const reviewerName = review.userName || review.name || 'Traveler';
                    const initials = reviewerName
                      .split(' ')
                      .filter(Boolean)
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    const formattedDate = review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : '';
                    return (
                      <div key={review.id} className="border border-[var(--color-border-subtle)] rounded-xl p-5 bg-[var(--color-canvas-raised)] hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-0.5 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'text-gray-300 dark:text-white/20'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-4">
                          &ldquo;{review.certifiedHighlight || review.comment}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
                          <div className="w-8 h-8 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-bold text-orange-500">{initials || 'T'}</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[var(--color-ink)]">{reviewerName}</p>
                            {formattedDate && (
                              <p className="text-[11px] text-[var(--color-ink-faint)]">Verified Traveler &middot; {formattedDate}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="max-w-xl mx-auto text-center border border-[var(--color-border-subtle)] rounded-2xl p-8 bg-[var(--color-canvas-raised)] space-y-4">
                <p className="text-base font-bold text-[var(--color-ink)]">No reviews for this departure yet</p>
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  Verified traveler reviews appear here after the expedition completes. Explore real reviews from our past CONSOUL batches in the meantime.
                </p>
                <Link
                  href="/past-trips"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Read Real Past Trip Reviews <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            7. "TRIPS YOU MAY LIKE" (Real published trips)
        ═══════════════════════════════════════════════════════════ */}
        {relatedTrips.length > 0 && (
          <div className="bg-[#1a1d24] text-white">
            <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif italic text-center text-white">
                Trips you may like
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedTrips.map((relTrip) => (
                  <Link key={relTrip.id} href={`/trip/${relTrip.id}`} className="group">
                    <div className="rounded-2xl overflow-hidden hover:ring-2 hover:ring-orange-500/50 transition-all bg-white/5 border border-white/10">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relTrip.images?.[0]?.url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
                          alt={relTrip.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">{relTrip.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-white/70">
                            <span>{relTrip.duration || 'Curated Days'}</span>
                            <span className="text-white/30">&middot;</span>
                            <span>{relTrip.destination || 'Expedition'}</span>
                          </div>
                          <p className="text-sm font-bold text-orange-400 mt-2">
                            From ₹{Number(relTrip.price || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            8. STICKY BOTTOM BAR — Contiki-style (mobile + desktop)
        ═══════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-canvas-raised)]/95 backdrop-blur-xl border-t border-[var(--color-border-subtle)] py-3 px-4 z-40 shadow-[0_-2px_20px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
            {/* Left: Trip name + stats */}
            <div className="flex items-center gap-4 min-w-0">
              <h3 className="text-base md:text-lg font-bold text-orange-500 truncate">{currentTrip.title}</h3>
              <div className="hidden sm:flex items-center gap-3 text-xs text-[var(--color-ink-muted)] font-medium shrink-0">
                <span>{currentTrip.duration?.replace(/[^0-9]/g, '') || (currentTrip.itinerary?.length ? String(currentTrip.itinerary.length) : '7')} <span className="text-[var(--color-ink-faint)]">Days</span></span>
                <span className="text-[var(--color-border-subtle)]">|</span>
                <span>{currentTrip.countriesCount || 1} <span className="text-[var(--color-ink-faint)]">{currentTrip.countriesCount && currentTrip.countriesCount > 1 ? 'Countries' : 'Region'}</span></span>
                <span className="text-[var(--color-border-subtle)]">|</span>
                <span>{currentTrip.citiesCount || (currentTrip.itinerary?.length || 4)} <span className="text-[var(--color-ink-faint)]">Stops</span></span>
              </div>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border-hover)] rounded-full text-xs font-bold text-[var(--color-ink)] hover:bg-[var(--color-border-subtle)] transition-colors">
                Compare this trip <ChevronRight className="w-3 h-3" />
              </a>
              <Link href={`/trip/${currentTrip.id}/join`}>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-full text-xs md:text-sm transition-colors flex items-center gap-2">
                  Select Dates <Calendar className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FULLSCREEN LIGHTBOX
      ═══════════════════════════════════════════════════════════ */}
      {lightboxOpen && tripImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p - 1 + tripImages.length) % tripImages.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors">
            &#8249;
          </button>
          <img src={tripImages[lightboxIndex]} alt="Gallery preview" className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p + 1) % tripImages.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors">
            &#8250;
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {tripImages.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }} className={`h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-orange-500 w-8' : 'bg-white/30 w-2 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
      )}

      <BottomTabBar />
    </>
  );
}
