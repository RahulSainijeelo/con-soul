"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { EditTrip } from "@/types/Trip";
import { Badge } from "@/components/ui/badge";

interface TripRowItemProps {
    trip: EditTrip;
    index: number;
}

export function TripRowItem({ trip, index }: TripRowItemProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const dateRange = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;

    return (
        <div
            className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden border border-white/15"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.22)", backdropFilter: "blur(20px)" }}
        >
            {/* Upcoming badge on wrapper */}
            <div className="px-3 pt-3 pb-1 md:px-5 md:pt-4 md:pb-2">
                <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-brand hover:bg-black/80 text-xs font-semibold">
                    Upcoming
                </Badge>
            </div>

            {/* Two equal cards */}
            <div className="flex flex-col md:flex-row pt-0 md:pt-2" style={{ gap: '12px', paddingLeft: '12px', paddingRight: '12px', paddingBottom: '12px' }}>
                {/* Image Card — 50% */}
                <div className="w-full md:w-1/2">
                    <div className="rounded-xl md:rounded-2xl overflow-hidden h-full min-h-[180px] md:min-h-[115px]">
                        <img
                            src={trip.images?.[0]?.url || "/placeholder-trip.jpg"}
                            alt={trip.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Detail Card — 50% */}
                <div className="w-full md:w-1/2">
                    <div
                        className="rounded-xl md:rounded-2xl p-4 md:p-7 h-full flex flex-col justify-between"
                        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0d0906 60%, #1c1008 100%)" }}
                    >
                        {/* Destination */}
                        <div>
                            <div className="flex items-center gap-2 text-brand text-xs font-semibold tracking-wider uppercase mb-4">
                                <MapPin className="h-3.5 w-3.5" />
                                <span style={{ fontFamily: "'Inter', sans-serif" }}>{trip.destination}</span>
                            </div>

                            {/* Title */}
                            <h3
                                className="text-2xl md:text-3xl lg:text-[2.2rem] font-black text-white leading-tight mb-5"
                                style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif", fontWeight: 900 }}
                            >
                                {trip.title}
                            </h3>

                            {/* Date · Duration · Price */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-gray-400 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-white/30" />
                                    <span>{dateRange}</span>
                                </div>
                                <span className="text-white/15">·</span>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-white/30" />
                                    <span>{trip.duration}</span>
                                </div>
                                {trip.price && (
                                    <span className="text-white font-bold text-lg ml-2">
                                        ₹ {Number(trip.price).toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3">
                            <Link
                                href={`/trip/${trip.id}`}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 text-white text-sm font-bold py-3.5 px-5 md:px-6 rounded-2xl transition-all duration-300 active:scale-95"
                                style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", boxShadow: "0 0 20px rgba(234,88,12,0.3)" }}
                            >
                                Book This Trip
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/trips"
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 text-white text-sm font-semibold py-3.5 px-5 md:px-6 rounded-2xl border border-white/15 transition-all duration-300 hover:bg-white/5 active:scale-95"
                                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#111" }}
                            >
                                See All Trips
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
