import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Star, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BottomTabBar from '@/components/layout/BottomTabBar';

export const metadata: Metadata = {
    title: 'Past Trips - ConSoul Travel',
    description: 'Explore our completed trips and read reviews from happy travelers who have experienced amazing adventures with us.',
};

interface Trip {
    id: string;
    title: string;
    destination: string;
    category: string;
    description: string;
    images: { url: string }[];
    endDate: string;
    duration?: string;
    maxParticipants: number;
    currentParticipants?: number;
    rating?: number;
    reviewCount?: number;
}

async function getPastTrips(): Promise<Trip[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trips?status=completed&limit=50`,
            {
                next: { revalidate: 300 } // Revalidate every 5 minutes
            }
        );
        if (!response.ok) {
            console.error('Failed to fetch past trips');
            return [];
        }

        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error fetching past trips:', error);
        return [];
    }
}

export default async function PastTripsPage() {
    const pastTrips = await getPastTrips();

    return (
        <div className="min-h-screen bg-black pb-16 md:pb-0">
            <Header />

            {/* Hero Section */}
            <div className="text-white py-4">
                <div className="container mx-auto px-4 pt-3 md:pt-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl pl-20 sm:pl-0 lg:text-6xl font-display font-bold mb-6">
                            Past Trips
                        </h1>
                        <p className="text-lg text-gray-400">
                            Explore our completed journeys and read reviews from travelers who have experienced unforgettable adventures with us.
                        </p>
                    </div>
                </div>
            </div>

            {/* Trips Grid */}
            <div className="container mx-auto px-4 pb-8">
                {pastTrips.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No completed trips available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pastTrips.map((trip) => (
                            <Card key={trip.id} className="overflow-hidden border-white/10 bg-white/5 shadow-lg hover:shadow-gold/20 transition-shadow group">
                                {/* Trip Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {trip.images && trip.images.length > 0 ? (
                                        <img
                                            src={trip.images[0].url}
                                            alt={trip.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                    )}
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-900/80 backdrop-blur-sm text-green-100 text-xs font-semibold rounded-full flex items-center gap-1 border border-green-500/30">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                        Completed
                                    </div>
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-gold text-xs font-semibold rounded-full border border-gold/20">
                                        {trip.category}
                                    </div>
                                </div>

                                <CardHeader className="pb-3">
                                    <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-gold transition-colors">
                                        {trip.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                                        {trip.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="pb-3">
                                    {/* Rating */}
                                    {trip.rating !== undefined && trip.rating > 0 && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(trip.rating!)
                                                            ? 'fill-gold text-gold'
                                                            : 'fill-gray-700 text-gray-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-white">{trip.rating.toFixed(1)}</span>
                                            <span className="text-sm text-gray-500">({trip.reviewCount || 0} reviews)</span>
                                        </div>
                                    )}

                                    {/* Trip Info */}
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gold" />
                                            <span>{trip.destination}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gold" />
                                            <span>
                                                Completed: {new Date(trip.endDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        {trip.duration && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gold" />
                                                <span>{trip.duration}</span>
                                            </div>
                                        )}
                                        {trip.currentParticipants && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gold" />
                                                <span>{trip.currentParticipants} / {trip.maxParticipants} travelers</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Link href={`/past-trips/${trip.id}`} className="w-full">
                                        <button className="w-full bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group">
                                            View Details & Reviews
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <BottomTabBar />

            <Footer />
        </div>
    );
}
