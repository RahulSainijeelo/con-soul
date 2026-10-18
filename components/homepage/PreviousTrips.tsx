'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ArrowRight, MapPin, Calendar } from "lucide-react";
import Link from 'next/link';

interface Review {
    id: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    tripId: string;
    tripName?: string;
    certifiedHighlight?: string;
    status: string;
}

interface Trip {
    id: string;
    title: string;
    destination: string;
    images: { url: string }[];
    endDate: string;
    category: string;
}

interface PreviousTripsProps {
    pastTrips: Trip[];
    reviews: Review[];
}

const getCategoryBadgeClass = (category?: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("mountain")) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    if (cat.includes("trek")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (cat.includes("beach")) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    if (cat.includes("cultur")) return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    if (cat.includes("weekend")) return "bg-violet-500/20 text-violet-300 border-violet-500/30";
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
};

export function PreviousTrips({ pastTrips, reviews }: PreviousTripsProps) {
    if (!reviews?.length && !pastTrips?.length) {
        return null;
    }

    return (
        <section className="py-24 md:py-28 -mt-[30px] md:mt-0 bg-[var(--color-canvas)] relative z-50 overflow-hidden" style={{ borderRadius: "40px 40px 0 0", borderTop: "1px solid var(--color-border-subtle)", boxShadow: "0 -8px 40px rgba(0,0,0,0.1)" }}>
            {/* Background Elements — neutral monochrome glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Section 1: Reviews */}
                {reviews.length > 0 && (
                    <div className="mb-20">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl">
                                Memories from <span className="text-foreground/85">Travelers</span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Hear from our happy travelers and their unforgettable experiences.
                            </p>
                        </div>

                        <div className="mx-auto max-w-6xl">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {reviews.map((review) => (
                                        <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1 h-full">
                                                <Card className="h-full rounded-2xl border-border bg-card hover:border-foreground/20 transition-all duration-300 group">
                                                    <CardContent className="flex !p-6 flex-col h-full">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center flex-shrink-0">
                                                                {review.userImage ? (
                                                                    <img
                                                                        src={review.userImage}
                                                                        alt={review.userName}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-lg font-bold text-foreground">{review.userName.charAt(0)}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-foreground text-sm md:text-base line-clamp-1">
                                                                    {review.userName}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground line-clamp-1 uppercase tracking-wider">
                                                                    {review.tripName}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < review.rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "fill-muted text-muted"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        <div className="relative flex-grow">
                                                            <Quote className="absolute -top-1 -left-1 w-3 h-3 text-foreground/20" />
                                                            <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4 pl-4">
                                                                &ldquo;{review.certifiedHighlight || review.comment}&rdquo;
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="hidden md:block">
                                    <CarouselPrevious className="-left-12 border-border bg-card text-foreground hover:bg-foreground hover:text-background" />
                                    <CarouselNext className="-right-12 border-border bg-card text-foreground hover:bg-foreground hover:text-background" />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                )}

                {/* Section 2: Past Trips Gallery */}
                {pastTrips.length > 0 && (
                    <div>
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-display font-bold text-foreground sm:text-4xl">
                                Our <span className="text-foreground/85">Past Expeditions</span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Explore the journeys we&apos;ve completed and the memories we&apos;ve made.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {pastTrips.map((trip) => (
                                <Link href={`/past-trips/${trip.id}`} key={trip.id} className="group">
                                    <div className="relative h-64 rounded-2xl overflow-hidden border border-border bg-muted">
                                        {trip.images && trip.images.length > 0 ? (
                                            <img
                                                src={trip.images[0].url}
                                                alt={trip.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-muted to-card" />
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 backdrop-blur-md border rounded-full text-xs font-semibold ${getCategoryBadgeClass(trip.category)}`}>
                                                {trip.category}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-300 transition-colors">
                                                {trip.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                                    <span className="line-clamp-1">{trip.destination}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>{new Date(trip.endDate).getFullYear()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link href="/past-trips">
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border hover:border-foreground text-foreground rounded-full transition-all hover:bg-foreground/5 group">
                                    View All Past Trips
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
