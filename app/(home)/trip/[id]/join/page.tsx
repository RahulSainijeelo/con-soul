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
    price_sleeper?:number;
    registrationAmount?:number;
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
            <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm uppercase tracking-wider text-[var(--color-ink-faint)]">Loading expedition...</p>
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
            <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="text-center max-w-md mx-auto">
                        <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-3">Expedition Not Found</h1>
                        <p className="text-sm text-[var(--color-ink-muted)] mb-6">The expedition you are looking for does not exist or has departed.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all text-sm tracking-wide"
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
        <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 mt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
                            Confirm Registration
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-2">
                            Join Trip: {trip.title}
                        </h1>
                        <p className="text-sm text-[var(--color-ink-muted)]">
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
                        registrationAmount={trip.registrationAmount}
                    />
                </div>
            </main>
            <Footer />
            <BottomTabBar />

        </div>
    );
}
