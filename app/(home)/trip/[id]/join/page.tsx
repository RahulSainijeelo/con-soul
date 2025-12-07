"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import JoinTripForm from "@/components/trips/JoinTripForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginTC from "@/components/auth/LoginTC";
import BottomTabBar from "@/components/layout/BottomTabBar";

interface Trip {
    id: string;
    title: string;
    destination: string;
    duration?: string;
    price: number;
    category: string;
    description: string;
    images: { url: string }[];
    maxParticipants: number;
    currentParticipants?: number;
    mode:string,
    price_3ac?:number;
    price_sleeper?:number
}

export default function JoinTripPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const tripId = typeof params.id === 'string' ? params.id : '';
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch trip data
        const fetchTrip = async () => {
            try {
                const response = await fetch(`/api/trips/${tripId}`);

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const data = await response.json();
                setTrip(data);
            } catch (err) {
                console.error("Error fetching trip:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchTrip();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [tripId, status]);

    // Show loading state
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (status === 'unauthenticated') {
        return <LoginTC />;
    }

    // Show error if trip not found
    if (error || !trip) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gold mb-4">Trip Not Found</h1>
                        <p className="text-gray-400 mb-6">The trip you are looking for does not exist.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 mt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gold mb-2">
                            Join Trip: {trip.title}
                        </h1>
                        <p className="text-gray-400">
                            {trip.destination} • {trip.duration}
                        </p>
                    </div>

                    <JoinTripForm
                        tripId={tripId}
                        tripTitle={trip.title}
                        tripPrice={trip.price}
                        userEmail={session?.user?.email || ""}
                        mode={trip.mode}
                        price_3ac={trip.price_3ac}
                        price_sleeper={trip.price_sleeper}
                    />
                </div>
            </main>
            <Footer />
            <BottomTabBar />

        </div>
    );
}
