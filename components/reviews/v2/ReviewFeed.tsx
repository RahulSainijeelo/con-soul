'use client';

import { ReviewCard, CTACard } from './ReviewCard';
import { Backpack } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Review {
    id: string;
    userName: string;
    rating: number;
    createdAt: string;
    tripName?: string;
    vibeTags?: string[];
    certifiedHighlight?: string;
    squadChemistry?: number;
    consoulHost?: number;
    tripVibe?: number;
    personalityBadge?: string;
    fomoScore?: string;
    honestTake?: string;
    images?: string[];
    likes?: number;
}

interface ReviewFeedProps {
    reviews: Review[];
    tripId: string;
}

export function ReviewFeed({ reviews, tripId }: ReviewFeedProps) {
    const router = useRouter();
    const hasReviews = reviews.length > 0;

    // Calculate Stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
        : '0.0';
        
    const wouldRebookCount = reviews.filter(r => 
        r.fomoScore === 'Truly Devastated' || r.fomoScore === 'Completely Destroyed'
    ).length;
    const rebookPercentage = totalReviews > 0 
        ? Math.round((wouldRebookCount / totalReviews) * 100) 
        : 0;

    const tripsReviewed = totalReviews > 0 ? 1 : 0; // In context of a single trip page

    if (!hasReviews) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-[#09090F] rounded-2xl border border-white/10 mt-8">
                <Backpack className="w-16 h-16 text-[#7878A0] mb-4 opacity-50" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-[#F0F0FA] mb-2">No reviews yet.</h3>
                <p className="text-sm text-[#7878A0] mb-6">Be the first one back. Drop the first review.</p>
                <Link href={`/trip/${tripId}/review`}>
                    <button className="px-6 py-3 bg-gold hover:bg-yellow-600 text-black font-semibold rounded-full transition-colors">
                        Add Your Review →
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full mt-12 mb-8 bg-[#09090F]">
            
            {/* Summary Stats Bar */}
            <div className="mx-4 md:mx-auto max-w-4xl mb-8 flex items-center justify-between bg-[#12121E] rounded-full border border-white/10 divide-x divide-white/10 overflow-hidden shadow-lg shadow-black/50">
                <div className="flex-1 text-center py-3 px-2">
                    <div className="text-[10px] uppercase tracking-wider text-[#7878A0] font-semibold mb-1">Avg Rating</div>
                    <div className="text-lg md:text-xl font-bold text-[#F0F0FA] flex items-center justify-center gap-1">
                        {avgRating} <span className="text-gold text-sm">★</span>
                    </div>
                </div>
                <div className="flex-1 text-center py-3 px-2">
                    <div className="text-[10px] uppercase tracking-wider text-[#7878A0] font-semibold mb-1">Reviews</div>
                    <div className="text-lg md:text-xl font-bold text-[#F0F0FA]">{totalReviews}</div>
                </div>
                <div className="flex-1 text-center py-3 px-2">
                    <div className="text-[10px] uppercase tracking-wider text-[#7878A0] font-semibold mb-1">Would Rebook</div>
                    <div className="text-lg md:text-xl font-bold text-[#F0F0FA]">{rebookPercentage}%</div>
                </div>
            </div>

            {/* Scroll Feed */}
            <div 
                className="flex flex-row overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory scroll-smooth"
                style={{ 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <style dangerouslySetInnerHTML={{__html: `
                    ::-webkit-scrollbar { display: none; }
                `}} />
                
                {reviews.map((review, index) => (
                    <ReviewCard key={review.id} review={review} index={index} />
                ))}
                
                <CTACard onClick={() => router.push(`/trip/${tripId}/review`)} />
            </div>
            
            <div className="text-center mt-2">
                <span className="text-[11px] text-[#5A5A78] tracking-widest uppercase">swipe for more reviews →</span>
            </div>
        </div>
    );
}
