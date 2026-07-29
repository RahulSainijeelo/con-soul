import { ReviewForm } from "@/components/reviews/v2/ReviewForm";
import { db } from "@/config/firebase";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function GuestReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Verify trip exists server-side before rendering
    const tripSnapshot = await db.collection("trips").doc(id).get();
    
    if (!tripSnapshot.exists) {
        notFound();
    }
    
    const trip = tripSnapshot.data();

    return (
        <div className="min-h-screen bg-[#09090F] pt-24 pb-12">
            <div className="container mx-auto px-4">
                
                {/* Trip Banner */}
                <div className="max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden relative h-48 border border-white/10 bg-[#12121E]">
                    {trip?.images?.[0]?.url && (
                        <Image 
                            src={trip.images[0].url}
                            alt={trip.title || "Trip Image"}
                            fill
                            className="object-cover opacity-60"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full text-center">
                        <span className="text-gold text-sm font-semibold uppercase tracking-wider block mb-1">
                            Write a Review
                        </span>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                            {trip?.title}
                        </h1>
                    </div>
                </div>

                {/* Form Component */}
                <ReviewForm tripId={id} isGuest={true} />
            </div>
        </div>
    );
}
