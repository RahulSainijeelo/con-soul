import { EditTrip } from "@/types/Trip";
import { TripRowItem } from "@/components/trips/TripRowItem";

interface UpcomingTripsProps {
    trips: EditTrip[];
}

export function UpcomingTrips({ trips }: UpcomingTripsProps) {
    if (!trips || trips.length === 0) {
        return null;
    }

    return (
        <section id="upcoming-trips" className="py-12 md:py-8 bg-[#0a0a0a] relative z-10 min-h-[100svh] md:min-h-[95vh] flex flex-col justify-center" style={{ borderRadius: "20px 20px 0 0" }}>
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
            <div className="mb-6 text-center">
                    <h2
                        className="mb-4 text-4xl md:text-5xl font-black text-white tracking-tight"
                        style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif", fontWeight: 900 }}
                    >
                        Upcoming <span className="text-brand">Expeditions</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-400 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Immerse yourself in journeys designed for the soul. Each trip is a chapter in your life&apos;s story.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {trips.map((trip, index) => (
                        <TripRowItem key={trip.id} trip={trip} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
