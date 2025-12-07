'use client';

import { useState, useEffect } from 'react';
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

export function PreviousTrips() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [pastTrips, setPastTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Reviews
                const reviewsRes = await fetch('/api/reviews');
                let approvedReviews: Review[] = [];
                if (reviewsRes.ok) {
                    const data: Review[] = await reviewsRes.json();
                    approvedReviews = data.filter(r => r.status === 'approved');
                }

                // 2. Fetch Past Trips
                const tripsRes = await fetch('/api/trips?status=completed&limit=6');
                let tripsList: Trip[] = [];
                let tripsMap: Record<string, string> = {};

                if (tripsRes.ok) {
                    const tripsData = await tripsRes.json();
                    tripsList = tripsData.data || [];

                    // Create a map of tripId -> tripTitle for reviews
                    // Note: We might need to fetch *all* trips to map names for reviews of older trips not in the top 6
                    // But for now, let's use what we have and maybe fetch specific ones if needed.
                    // A better approach for reviews is to have the API return trip details or fetch them.
                    // Let's fetch a larger list for mapping purposes if needed, or just rely on what we get.
                    // For this implementation, we'll just use the past trips we fetched.

                    // To ensure we have names for reviews, let's fetch a lightweight list of all trips if possible, 
                    // or just accept that some might be missing if not in the past trips list.
                    // Actually, let's fetch a separate list for mapping if we want to be robust.
                    const allTripsRes = await fetch('/api/trips?limit=100');
                    if (allTripsRes.ok) {
                        const allTripsData = await allTripsRes.json();
                        const allTrips = allTripsData.data || [];
                        allTrips.forEach((t: any) => {
                            tripsMap[t.id] = t.title;
                        });
                    }
                }

                // Attach trip titles to reviews
                const reviewsWithTitles = approvedReviews.map(r => ({
                    ...r,
                    tripName: tripsMap[r.tripId] || 'A Wonderful Trip'
                }));

                setReviews(reviewsWithTitles);
                setPastTrips(tripsList);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="py-20 text-center text-gray-500">Loading memories...</div>;
    }

    if (reviews.length === 0 && pastTrips.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-20 bg-black/95 relative overflow-hidden" style={{ borderRadius: "10px 10px 0 0" }}>
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Section 1: Reviews */}
                {reviews.length > 0 && (
                    <div className="mb-20">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-display font-bold text-white sm:text-4xl">
                                Memories from <span className="text-gold">Travelers</span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-gray-400">
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
                                                <Card className="h-full rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm hover:border-gold/30 transition-all duration-300 group">
                                                    <CardContent className="flex !p-6 flex-col h-full">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="h-12 w-12 overflow-hidden rounded-full border border-gold/30 bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                                {review.userImage ? (
                                                                    <img
                                                                        src={review.userImage}
                                                                        alt={review.userName}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-lg font-bold text-gold">{review.userName.charAt(0)}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-white text-sm md:text-base line-clamp-1">
                                                                    {review.userName}
                                                                </h3>
                                                                <p className="text-xs text-gold line-clamp-1">
                                                                    {review.tripName}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < review.rating
                                                                        ? "fill-gold text-gold"
                                                                        : "fill-gray-700 text-gray-700"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        <div className="relative flex-grow">
                                                            <Quote className="absolute -top-1 -left-1 w-3 h-3 text-gold/20" />
                                                            <p className="text-sm text-gray-300 italic leading-relaxed line-clamp-4 pl-4">
                                                                "{review.comment}"
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="hidden md:block">
                                    <CarouselPrevious className="-left-12 border-white/20 bg-black/50 text-gold hover:bg-gold hover:text-black" />
                                    <CarouselNext className="-right-12 border-white/20 bg-black/50 text-gold hover:bg-gold hover:text-black" />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                )}

                {/* Section 2: Past Trips Gallery */}
                {pastTrips.length > 0 && (
                    <div>
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-display font-bold text-white sm:text-4xl">
                                Our <span className="text-gold">Past Expeditions</span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-gray-400">
                                Explore the journeys we've completed and the memories we've made.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {pastTrips.map((trip) => (
                                <Link href={`/past-trips/${trip.id}`} key={trip.id} className="group">
                                    <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-gray-900">
                                        {trip.images && trip.images.length > 0 ? (
                                            <img
                                                src={trip.images[0].url}
                                                alt={trip.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-gold">
                                                {trip.category}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-gold transition-colors">
                                                {trip.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-gold" />
                                                    <span className="line-clamp-1">{trip.destination}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gold" />
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
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-gold/30 hover:border-gold text-gold rounded-full transition-all hover:bg-gold/10 group">
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
