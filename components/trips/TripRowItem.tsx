"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { EditTrip } from "@/types/Trip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShineBorder } from "../ui/shine-border";
interface TripRowItemProps {
    trip: EditTrip;
    index: number;
}

export function TripRowItem({ trip, index }: TripRowItemProps) {
    return (
        <Link href={`/trip/${trip.id}`} className="group block w-full">
            <div className="flex flex-col md:flex-row gap-8 items-center py-12 border-b border-white/10 last:border-0 group-hover:bg-white/5 transition-colors duration-500 rounded-3xl px-4 md:px-8 relative overflow-hidden">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={4} borderWidth={3} />

                <div className={cn(
                    "w-full md:w-5/12 overflow-hidden rounded-2xl relative aspect-[4/3] md:aspect-[16/10]",
                    index % 2 === 1 ? "md:order-2" : "md:order-1"
                )}>
                    <img
                        src={trip.images?.[0]?.url || "/placeholder-trip.jpg"}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Floating Category Tag */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-[green] hover:bg-black/80">
                            {"Upcoming"}
                        </Badge>
                    </div>
                </div>
                {/* Content Section */}
                <div className={cn(
                    "w-full md:w-7/12 space-y-6",
                    index % 2 === 1 ? "md:order-1 md:pr-12" : "md:order-2 md:pl-12"
                )}>
                    <div className="space-y-2">
                        <div style={{ fontFamily: 'var(--heart)' }} className="flex items-center gap-2 text-gold text-sm font-medium tracking-wider uppercase">
                            <MapPin className="h-4 w-4" />
                            <span>{trip.destination}</span>
                        </div>

                        <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight group-hover:text-gold transition-colors duration-300">
                            {trip.title}
                        </h3>
                    </div>

                    <p className="text-gray-400 text-lg leading-relaxed line-clamp-3">
                        {trip.description}
                    </p>

                    <div style={{ fontFamily: 'var(--heart)' }} className="flex flex-wrap gap-6 text-sm text-gray-300 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gold/70" />
                            <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gold/70" />
                            <span>{trip.duration}</span>
                        </div>
                    </div>

                    <div style={{ fontFamily: 'var(--heart)' }} className="pt-4 flex items-center gap-2 text-gold font-medium group/btn">
                        <span className="group-hover/btn:mr-2 transition-all duration-300">Explore Itinerary</span>
                        <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
