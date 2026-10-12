"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Users, MapPin, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BottomTabBar from '@/components/layout/BottomTabBar';
import LoginTC from '@/components/auth/LoginTC';

interface Trip {
    id: string;
    slug?: string;
    title: string;
    destination: string;
    category: string;
    description: string;
    images: { url: string }[];
    startDate: string;
    endDate: string;
    duration?: string;
    maxParticipants: number;
    currentParticipants?: number;
    rating?: number;
    reviewCount?: number;
    status: string;
}

interface Booking {
    id: string;
    tripId: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'registrationConfirmed';
    createdAt: string;
    trip: Trip;
    seatNumber?: string;
    paymentStatus?: 'partial' | 'paid';
    amount?: number;
    amountPaid?: number;
}

export default function MyTripsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastFetch, setLastFetch] = useState<number>(0);

    // Fetch all bookings with 1-minute cache
    const fetchBookings = async () => {
        const now = Date.now();
        const cacheTime = 1 * 60 * 1000; // 1 minute in milliseconds

        if (lastFetch && (now - lastFetch) < cacheTime) {
            setLoading(false);
            return; // Use cached data
        }

        try {
            setLoading(true);
            // Fetch all bookings without type filter to get everything at once
            const response = await fetch(`/api/user/bookings`);

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const result = await response.json();
            setAllBookings(result.data || []);
            setLastFetch(now);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchBookings();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status]);

    // Filter bookings based on active tab
    const pastStatuses = ['completed', 'cancelled', 'archived'];

    const pastTrips = allBookings.filter(booking => {
        return booking.trip && pastStatuses.includes(booking.trip.status);
    });

    // Upcoming = everything that isn't past (so no booking ever falls through the cracks)
    const upcomingTrips = allBookings.filter(booking => {
        return booking.trip && !pastStatuses.includes(booking.trip.status);
    });

    const currentTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

    // Show login prompt if not authenticated
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-black pb-16 md:pb-0">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your trips...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen bg-black pb-16 md:pb-0">
                <Header />
                <LoginTC />
                <Footer />
                <BottomTabBar />
            </div>
        );
    }

    const getStatusBadge = (status: string, seatNumber?: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <div className="flex flex-col items-end gap-1">
                        <div className="px-3 py-1 bg-green-900/80 backdrop-blur-sm text-green-100 text-xs font-semibold rounded-full flex items-center gap-1 border border-green-500/30">
                            <CheckCircle className="w-3 h-3" />
                            Confirmed
                        </div>
                        {seatNumber && (
                            <div className="text-xs text-green-400 font-mono border border-green-500/30 rounded-2xl px-2 py-1 backdrop-blur-sm bg-black/50">
                                Seat: {seatNumber}
                            </div>
                        )}
                    </div>
                );
            case 'registrationConfirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <CheckCircle className="w-3 h-3" /> Registration Confirmed
                        {seatNumber && (<span className="ml-1 bg-amber-500/30 px-1.5 rounded">Seat: {seatNumber}</span>)}
                    </span>
                );
            case 'rejected':
                return (
                    <div className="px-3 py-1 bg-red-900/80 backdrop-blur-sm text-red-100 text-xs font-semibold rounded-full flex items-center gap-1 border border-red-500/30">
                        <XCircle className="w-3 h-3" />
                        Rejected
                    </div>
                );
            default:
                return (
                    <div className="px-3 py-1 bg-yellow-900/80 backdrop-blur-sm text-yellow-100 text-xs font-semibold rounded-full flex items-center gap-1 border border-yellow-500/30">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
            <Header />

            {/* Hero Section */}
            <div className="text-foreground py-6 md:py-8">
                <div className="container mx-auto px-4 pt-3 md:pt-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 pl-20 sm:pl-0">
                            My Trips
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Manage your upcoming adventures and revisit your past journeys.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-background/95 border-b border-border sticky top-7 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex gap-5 justify-end md:justify-center">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${activeTab === 'upcoming'
                                ? 'border-foreground text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Upcoming Trips
                            <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === 'upcoming' ? 'bg-foreground/15 text-foreground' : 'bg-muted text-muted-foreground'}`}>
                                {upcomingTrips.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${activeTab === 'past'
                                ? 'border-foreground text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Past Trips
                            <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === 'past' ? 'bg-foreground/15 text-foreground' : 'bg-muted text-muted-foreground'}`}>
                                {pastTrips.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {currentTrips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentTrips.map((booking) => {
                            const trip = booking.trip;
                            const spotsLeft = trip.maxParticipants - (trip.currentParticipants || 0);

                            return (
                                <Card key={booking.id} className="overflow-hidden border-border bg-card shadow-lg hover:shadow-foreground/5 transition-shadow group flex flex-col h-full">
                                    {/* Trip Image */}
                                    <div className="relative h-64 overflow-hidden shrink-0">
                                        {trip.images && trip.images.length > 0 ? (
                                            <img
                                                src={trip.images[0].url}
                                                alt={trip.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-muted to-card" />
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 z-10">
                                            {getStatusBadge(booking.status, booking.seatNumber)}
                                        </div>

                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                                            {trip.category}
                                        </div>

                                        {activeTab === 'upcoming' && spotsLeft <= 3 && spotsLeft > 0 && (
                                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">
                                                Only {spotsLeft} spots left!
                                            </div>
                                        )}

                                        {/* Payment Status Badge */}
                                        {booking.paymentStatus && (
                                            <div className="absolute bottom-4 left-4">
                                                {booking.paymentStatus === 'partial' ? (
                                                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold rounded-full border border-white/20">
                                                        Partial Payment
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 bg-emerald-900/80 backdrop-blur-sm text-emerald-100 text-xs font-semibold rounded-full border border-emerald-500/30">
                                                        Fully Paid
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
                                            {trip.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                            {trip.description}
                                        </p>
                                    </CardHeader>

                                    <CardContent className="pb-3 flex-grow">
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-foreground" />
                                                <span>{trip.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-foreground" />
                                                <span>
                                                    {activeTab === 'upcoming' ? 'Starts' : 'Completed'}: {new Date(activeTab === 'upcoming' ? trip.startDate : trip.endDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            {trip.duration && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-foreground" />
                                                    <span>{trip.duration}</span>
                                                </div>
                                            )}

                                        </div>
                                    </CardContent>

                                    <CardFooter className='flex justify-center p-[1.5rem] mt-auto'>
                                        <Link href={activeTab === 'upcoming' ? `/my-trips/${booking.id}` : `/past-trips/${trip.slug || trip.id}`} className="w-full">
                                            <button className="w-full bg-foreground hover:bg-foreground/80 text-background font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group shadow-sm">
                                                {activeTab === 'upcoming' ? 'View Details' : 'View Details & Reviews'}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                            {activeTab === 'upcoming' ? (
                                <Calendar className="w-12 h-12 text-muted-foreground" />
                            ) : (
                                <MapPin className="w-12 h-12 text-muted-foreground" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            {activeTab === 'upcoming' ? 'No Upcoming Trips' : 'No Past Trips'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {activeTab === 'upcoming' ? 'Start planning your next adventure!' : 'Your travel history will appear here.'}
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link href="/">
                                <button className="bg-foreground hover:bg-foreground/80 text-background font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm">
                                    Explore Trips
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
            <BottomTabBar />

            <Footer />
        </div>
    );
}
