"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Star, Calendar, Users, MapPin, ArrowRight, Clock, LogIn, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BottomTabBar from '@/components/layout/BottomTabBar';
import LoginTC from '@/components/auth/LoginTC';

interface Trip {
    id: string;
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
    status: 'pending' | 'confirmed' | 'rejected';
    createdAt: string;
    trip: Trip;
    seatNumber?: string;
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
    const upcomingTrips = allBookings.filter(booking => {
        return booking.trip.status === 'published';
    });

    const pastTrips = allBookings.filter(booking => {
        return booking.trip.status === 'completed';
    });

    const currentTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

    // Show login prompt if not authenticated
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-black pb-16 md:pb-0">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your trips...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <LoginTC />;
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
        <div className="min-h-screen bg-black pb-16 md:pb-0">
            <Header />

            {/* Hero Section */}
            <div className="text-white py-6 md:py-8">
                <div className="container mx-auto px-4 pt-3 md:pt-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 pl-20 sm:pl-0">
                            My Trips
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400">
                            Manage your upcoming adventures and revisit your past journeys.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-black/95 border-b border-white/10 sticky top-7 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/60">
                <div className="container mx-auto px-4">
                    <div className="flex gap-5 justify-end md:justify-center">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${activeTab === 'upcoming'
                                ? 'border-gold text-gold'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Upcoming Trips
                            <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === 'upcoming' ? 'bg-gold/20 text-gold' : 'bg-white/10 text-gray-400'}`}>
                                {upcomingTrips.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${activeTab === 'past'
                                ? 'border-gold text-gold'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Past Trips
                            <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${activeTab === 'past' ? 'bg-gold/20 text-gold' : 'bg-white/10 text-gray-400'}`}>
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
                                <Card key={booking.id} className="overflow-hidden border-white/10 bg-white/5 shadow-lg hover:shadow-gold/20 transition-shadow group flex flex-col h-full">
                                    {/* Trip Image */}
                                    <div className="relative h-64 overflow-hidden shrink-0">
                                        {trip.images && trip.images.length > 0 ? (
                                            <img
                                                src={trip.images[0].url}
                                                alt={trip.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 z-10">
                                            {getStatusBadge(booking.status, booking.seatNumber)}
                                        </div>

                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-gold text-xs font-semibold rounded-full border border-gold/20">
                                            {trip.category}
                                        </div>

                                        {activeTab === 'upcoming' && spotsLeft <= 3 && spotsLeft > 0 && (
                                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">
                                                Only {spotsLeft} spots left!
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-gold transition-colors">
                                            {trip.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                                            {trip.description}
                                        </p>
                                    </CardHeader>

                                    <CardContent className="pb-3 flex-grow">
                                        <div className="space-y-2 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gold" />
                                                <span>{trip.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gold" />
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
                                                    <Clock className="w-4 h-4 text-gold" />
                                                    <span>{trip.duration}</span>
                                                </div>
                                            )}
                                            {activeTab === 'upcoming' && (
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gold" />
                                                    <span>{trip.currentParticipants || 0} / {trip.maxParticipants} travelers</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className='flex justify-center p-[1.5rem] mt-auto'>
                                        <Link href={activeTab === 'upcoming' ? `/trip/${trip.id}` : `/past-trips/${trip.id}`} className="w-full">
                                            <button className="w-full bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group">
                                                {activeTab === 'upcoming' ? 'View Trip Details' : 'View Details & Reviews'}
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
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            {activeTab === 'upcoming' ? (
                                <Calendar className="w-12 h-12 text-gray-600" />
                            ) : (
                                <MapPin className="w-12 h-12 text-gray-600" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {activeTab === 'upcoming' ? 'No Upcoming Trips' : 'No Past Trips'}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {activeTab === 'upcoming' ? 'Start planning your next adventure!' : 'Your travel history will appear here.'}
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link href="/">
                                <button className="bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-colors">
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
