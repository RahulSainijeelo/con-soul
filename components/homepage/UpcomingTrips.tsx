"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EditTrip } from "@/types/Trip";
import { Badge } from "@/components/ui/badge";
import { TripRowItem } from "@/components/trips/TripRowItem";

export function UpcomingTrips() {
    const [trips, setTrips] = useState<EditTrip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch("/api/trips?status=published&limit=5");
                if (!res.ok) throw new Error("Failed to fetch trips");
                const data = await res.json();
                setTrips(data.data || []);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-black" style={{ borderRadius: "10px 10px 0 0" }}>
                <div className="container mx-auto px-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
            </section>
        );
    }

    if (trips.length === 0) {
        return null; // Or show a "No upcoming trips" message
    }

    return (
        <section className="py-4 md:py-8 lg:py-10 xl:py-12 bg-black relative overflow-hidden" style={{ borderRadius: "20px 20px 0 0" }}>
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-20 text-center">
                    <h2 className="mb-6 text-4xl md:text-5xl font-display font-bold text-white">
                        Upcoming <span className="text-shadow:0 0 30px rgba(255, 215, 0, 0.5), 0 2px 20px rgba(0,0,0,0.5);filter:brightness(1.2)">Expeditions</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-400 text-lg">
                        Immerse yourself in journeys designed for the soul. Each trip is a chapter in your life's story.
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    {trips.map((trip, index) => (
                        <TripRowItem key={trip.id} trip={trip} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
