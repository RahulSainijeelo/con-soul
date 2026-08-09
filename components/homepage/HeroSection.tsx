"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Calendar, Clock, IndianRupee, Users, MapPin, ArrowRight, Loader2, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { TrustStrip } from "./TrustStrip";

// ---------- Types ----------

interface TripImage {
    url: string;
    deleteUrl?: string;
}

interface Trip {
    id: string;
    title: string;
    destination: string;
    category: string;
    description: string;
    images: TripImage[];
    status: string;
    startDate: string;
    endDate: string;
    price: number;
    maxParticipants: number;
    currentParticipants?: number;
    duration?: string;
}

// ---------- Helpers ----------

function formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const sMonth = s.toLocaleDateString("en-IN", { month: "short" });
    const eMonth = e.toLocaleDateString("en-IN", { month: "short" });
    const sDay = s.getDate();
    const eDay = e.getDate();

    if (sMonth === eMonth) {
        return `${sDay}–${eDay} ${sMonth}`;
    }
    return `${sDay} ${sMonth} – ${eDay} ${eMonth}`;
}

function getSpotsLeft(trip: Trip): number {
    return Math.max(0, trip.maxParticipants - (trip.currentParticipants || 0));
}

function isFuture(dateStr: string): boolean {
    return new Date(dateStr) > new Date();
}

/**
 * Group trips that start within 30 days of the earliest upcoming trip.
 * Returns up to 3 trips sorted by soonest first.
 */
function getHeroTrips(trips: Trip[]): Trip[] {
    const upcoming = trips
        .filter((t) => isFuture(t.startDate))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    if (upcoming.length === 0) return [];

    const earliest = new Date(upcoming[0].startDate).getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return upcoming
        .filter((t) => new Date(t.startDate).getTime() - earliest <= thirtyDays)
        .slice(0, 3);
}

// ---------- Sub-components ----------

/** Single trip slide — used both in standalone and carousel mode */
function TripSlide({ trip, isActive }: { trip: Trip; isActive: boolean }) {
    const spotsLeft = getSpotsLeft(trip);
    const heroImage = trip.images?.[0]?.url;

    return (
        <div className="relative h-screen w-full flex-[0_0_100%] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {heroImage ? (
                    <img
                        src={heroImage}
                        alt={trip.title}
                        className="h-full w-full object-cover"
                        loading="eager"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-800" />
                )}
                {/* Dark gradient overlay — bottom-to-top for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
            </div>

            {/* Trip Details Card — bottom-left desktop / bottom-center mobile */}
            <div className="absolute bottom-24 sm:bottom-28 md:bottom-20 left-0 right-0 z-10 px-4 sm:px-6 md:px-12 lg:px-20">
                <div
                    className={`
                        max-w-2xl
                        backdrop-blur-xl bg-white/[0.08] border border-white/[0.12]
                        rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8
                        shadow-2xl shadow-black/40
                        transition-all duration-700
                        ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                    `}
                >
                    {/* Destination tag */}
                    <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                        <MapPin className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                        <span className="text-brand text-xs sm:text-sm font-semibold tracking-wider uppercase">
                            {trip.destination}
                        </span>
                    </div>

                    {/* Trip Name */}
                    <h1
                        className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-bold text-white leading-[1.1] mb-3 sm:mb-4"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
                    >
                        {trip.title}
                    </h1>

                    {/* Compact Details Row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5 text-white/70 text-xs sm:text-sm mb-5 sm:mb-6">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand/80" aria-hidden="true" />
                            {formatDateRange(trip.startDate, trip.endDate)}
                        </span>

                        {trip.duration && (
                            <>
                                <span className="text-white/30" aria-hidden="true">·</span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-brand/80" aria-hidden="true" />
                                    {trip.duration}
                                </span>
                            </>
                        )}

                        <span className="text-white/30" aria-hidden="true">·</span>
                        <span className="flex items-center gap-1.5 font-semibold text-white">
                            <IndianRupee className="w-3.5 h-3.5 text-brand/80" aria-hidden="true" />
                            {trip.price.toLocaleString("en-IN")}
                        </span>

                        {spotsLeft > 0 && spotsLeft <= 15 && (
                            <>
                                <span className="text-white/30" aria-hidden="true">·</span>
                                <span className="flex items-center gap-1.5 text-brand font-semibold">
                                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                                    {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                                </span>
                            </>
                        )}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link
                            href={`/trip/${trip.id}/join`}
                            className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-orange-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand/30 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black"
                        >
                            Book This Trip
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <a
                            href="#upcoming-trips"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-medium py-3 px-6 sm:px-8 rounded-xl border border-white/10 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            See All Trips
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Waitlist empty state */
function WaitlistState() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();

            if (res.status === 201) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else if (res.status === 409) {
                setStatus("duplicate");
                setMessage(data.message);
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong.");
            }
        } catch {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4">
                <div className="text-center max-w-lg animate-hero-fade-up">
                    {/* Subtle brand tag */}
                    <span className="inline-block text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                        CONSOUL
                    </span>

                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}
                    >
                        New trips dropping soon
                    </h1>
                    <p className="text-white/60 text-base sm:text-lg mb-8">
                        Be the first to know when we launch our next adventure. Join the waitlist.
                    </p>

                    {status === "success" ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 animate-hero-fade-in">
                            <p className="text-green-400 font-medium">{message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status !== "idle" && status !== "loading") setStatus("idle");
                                    }}
                                    placeholder="your@email.com"
                                    required
                                    aria-label="Email address"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="bg-brand hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center gap-2"
                            >
                                {status === "loading" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Join Waitlist"
                                )}
                            </button>
                        </form>
                    )}

                    {(status === "error" || status === "duplicate") && (
                        <p className={`mt-3 text-sm ${status === "error" ? "text-red-400" : "text-amber-400"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ---------- Main HeroSection ----------

export function HeroSection() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    // Embla carousel
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        skipSnaps: false,
    });

    // Fetch trip data
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch("/api/trips?status=published&limit=5");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                const heroTrips = getHeroTrips(data.data || []);
                setTrips(heroTrips);
            } catch (error) {
                console.error("Hero: failed to fetch trips", error);
                setTrips([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    // Sync active index with Embla
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setActiveIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Auto-advance carousel every 6s
    useEffect(() => {
        if (!emblaApi || trips.length <= 1) return;

        const startAutoplay = () => {
            stopAutoplay();
            autoplayRef.current = setInterval(() => {
                emblaApi.scrollNext();
            }, 6000);
        };

        const stopAutoplay = () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
        };

        startAutoplay();

        // Pause on pointer interaction
        const rootNode = emblaApi.rootNode();
        rootNode.addEventListener("pointerenter", stopAutoplay);
        rootNode.addEventListener("pointerleave", startAutoplay);
        rootNode.addEventListener("focusin", stopAutoplay);
        rootNode.addEventListener("focusout", startAutoplay);

        return () => {
            stopAutoplay();
            rootNode.removeEventListener("pointerenter", stopAutoplay);
            rootNode.removeEventListener("pointerleave", startAutoplay);
            rootNode.removeEventListener("focusin", stopAutoplay);
            rootNode.removeEventListener("focusout", startAutoplay);
        };
    }, [emblaApi, trips.length]);

    // ---------- Render ----------

    // Loading state
    if (loading) {
        return (
            <section className="relative h-screen w-full bg-black flex items-center justify-center" aria-label="Loading hero">
                <Loader2 className="h-10 w-10 animate-spin text-brand" />
            </section>
        );
    }

    // Empty state → hide section entirely (UpcomingTrips below will handle display)
    if (trips.length === 0) {
        return null;
    }

    // Single trip → static hero
    if (trips.length === 1) {
        return (
            <section className="relative h-screen w-full overflow-hidden bg-black" aria-label={`Next trip: ${trips[0].title}`}>
                <TripSlide trip={trips[0]} isActive={true} />
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20">
                    <TrustStrip />
                </div>
            </section>
        );
    }

    // Multiple trips → carousel
    return (
        <section className="relative h-screen w-full overflow-hidden bg-black" aria-label="Upcoming trips">
            <div className="h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {trips.map((trip, index) => (
                        <TripSlide
                            key={trip.id}
                            trip={trip}
                            isActive={index === activeIndex}
                        />
                    ))}
                </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Previous trip"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Next trip"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-20 sm:bottom-16 left-0 right-0 z-20 flex justify-center gap-2.5" role="tablist" aria-label="Trip slides">
                {trips.map((trip, index) => (
                    <button
                        key={trip.id}
                        onClick={() => emblaApi?.scrollTo(index)}
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Go to ${trip.title}`}
                        className={`
                            h-2 rounded-full transition-all duration-500
                            focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 focus:ring-offset-black
                            ${index === activeIndex
                                ? "w-8 bg-brand animate-pulse-dot"
                                : "w-2 bg-white/30 hover:bg-white/50"
                            }
                        `}
                    />
                ))}
            </div>

            {/* Trust Strip */}
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20">
                <TrustStrip />
            </div>
        </section>
    );
}
