'use client';

import { useState } from 'react';
import { Star, Heart, Eye } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ReviewProps {
    review: {
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
    };
    index: number;
}

const ACCENT_COLORS = [
    { base: '#A855F7', grad: 'from-[#1e0533] via-[#3b0764] to-[#160428]' }, // Purple
    { base: '#F472B6', grad: 'from-[#3f0618] via-[#7f1d1d] to-[#3f0618]' }, // Pink
    { base: '#34D399', grad: 'from-[#022c22] via-[#064e3b] to-[#022c22]' }, // Emerald
    { base: '#60A5FA', grad: 'from-[#0c1a3a] via-[#1e3a5f] to-[#0c1a3a]' }, // Blue
    { base: '#FB923C', grad: 'from-[#2a1200] via-[#4a2000] to-[#2a1200]' }, // Orange
];

export function ReviewCard({ review, index }: ReviewProps) {
    const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
    const [likes, setLikes] = useState(review.likes || 0);
    const [liked, setLiked] = useState(false);
    const [showHonestTake, setShowHonestTake] = useState(false);
    
    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const handleLike = () => {
        if (!liked) {
            setLikes(prev => prev + 1);
            setLiked(true);
            // Optional: call API to persist like
        } else {
            setLikes(prev => prev - 1);
            setLiked(false);
        }
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }).replace(/ /g, ' ');
    };

    const initials = review.userName
        ? review.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '??';

    const renderBar = (label: string, value?: number) => {
        if (value === undefined) return null;
        const percentage = (value / 5.0) * 100;
        
        return (
            <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#D8D8EE] w-32 shrink-0">{label}</span>
                <div className="flex-1 mx-3 h-2 bg-[#13131E] rounded-full overflow-hidden">
                    <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%`, backgroundColor: accent.base }}
                    />
                </div>
                <span className="font-bold text-[#F0F0FA] shrink-0 w-6 text-right">{value.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="w-[264px] shrink-0 snap-start flex flex-col rounded-2xl overflow-hidden bg-[#12121E] border border-white/[0.06]">
            
            {/* Header */}
            <div className={`p-4 bg-gradient-to-br ${accent.grad} relative`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center border-[2px] font-bold text-sm"
                            style={{ 
                                borderColor: accent.base, 
                                backgroundColor: `${accent.base}4D`, // 30% opacity
                                color: accent.base 
                            }}
                        >
                            {initials}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#F0F0FA] leading-tight line-clamp-1">{review.userName}</h3>
                            <p className="text-xs text-[#D8D8EE] opacity-80">{review.tripName || 'Traveler'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} 
                                />
                            ))}
                        </div>
                        <span className="text-[10px] text-[#D8D8EE] opacity-60 mt-1 block">{formatDate(review.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-4 flex-1">
                
                {/* Vibe Tags */}
                {review.vibeTags && review.vibeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {review.vibeTags.map(tag => (
                            <span 
                                key={tag} 
                                className="text-[10px] font-bold px-2 py-0.5 rounded border"
                                style={{
                                    backgroundColor: `${accent.base}1A`, // 10% opacity
                                    borderColor: `${accent.base}4D`, // 30% opacity
                                    color: accent.base
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Certified Highlight */}
                {review.certifiedHighlight && (
                    <div className="bg-[#0C0C1A] p-3 rounded-r-lg border-l-2" style={{ borderColor: accent.base }}>
                        <span className="text-[9px] uppercase font-semibold text-[#7878A0] tracking-wider block mb-1">Certified Highlight</span>
                        <p className="text-sm text-[#F0F0FA] italic leading-snug">"{review.certifiedHighlight}"</p>
                    </div>
                )}

                {/* Rating Bars */}
                {(review.squadChemistry !== undefined || review.consoulHost !== undefined || review.tripVibe !== undefined) && (
                    <div className="py-1">
                        {renderBar('Squad Chemistry', review.squadChemistry)}
                        {renderBar('Consoul Host', review.consoulHost)}
                        {renderBar('Trip Vibe', review.tripVibe)}
                    </div>
                )}

                {/* Personality & FOMO */}
                <div className="flex gap-2">
                    {review.personalityBadge && (
                        <div 
                            className="flex-1 flex items-center justify-center text-xs font-semibold rounded p-1.5 text-center leading-tight border"
                            style={{ backgroundColor: `${accent.base}1A`, borderColor: `${accent.base}4D`, color: accent.base }}
                        >
                            {review.personalityBadge.split('—')[0].trim()}
                        </div>
                    )}
                    {review.fomoScore && review.fomoScore !== 'Mildly Sad' && (
                        <div className="flex-1 flex items-center justify-center text-[10px] font-semibold rounded p-1.5 text-[#FACC15] bg-[#FACC15]/10 border border-[#FACC15]/30 text-center leading-tight">
                            FOMO: {review.fomoScore.includes('Destroyed') ? 'Destroyed' : 'Devastated'}
                        </div>
                    )}
                </div>

                {/* Photos */}
                {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {review.images.map((img, i) => (
                            <img 
                                key={i} 
                                src={img} 
                                alt={`Trip photo ${i+1}`} 
                                className="w-12 h-12 rounded object-cover shrink-0 cursor-pointer border border-white/10 hover:border-white/30"
                                onClick={() => {
                                    setLightboxIndex(i);
                                    setLightboxOpen(true);
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Honest Take */}
                {review.honestTake && (
                    <div className="mt-auto pt-2">
                        {!showHonestTake ? (
                            <button 
                                onClick={() => setShowHonestTake(true)}
                                className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-[#7878A0] bg-white/[0.03] hover:bg-white/[0.06] rounded border border-white/[0.06] transition-colors"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                Tap to unlock Honest Take
                            </button>
                        ) : (
                            <div className="bg-[#0C0C1A] p-3 rounded border border-white/[0.06]">
                                <span className="text-[9px] uppercase font-semibold text-[#7878A0] tracking-wider block mb-1">Honest Take</span>
                                <p className="text-xs text-[#D8D8EE] leading-snug">{review.honestTake}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/[0.06] flex items-center justify-between bg-[#12121E]">
                <span className="text-xs text-[#5A5A78]">Rebook?</span>
                <button 
                    onClick={handleLike}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: liked ? accent.base : '#7878A0' }}
                >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    {likes > 0 ? likes : ''}
                </button>
            </div>

            {/* Lightbox */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex flex-col items-center justify-center">
                    {review.images && review.images[lightboxIndex] && (
                        <img 
                            src={review.images[lightboxIndex]} 
                            alt="Review highlight" 
                            className="max-h-[85vh] max-w-full object-contain rounded-lg"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function CTACard({ onClick }: { onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="w-[264px] shrink-0 snap-start flex flex-col items-center justify-center rounded-2xl bg-[#12121E] border border-dashed border-white/10 cursor-pointer hover:bg-white/5 transition-colors group"
        >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
            <h3 className="text-lg font-bold text-[#F0F0FA] mb-1">Add Your Voice</h3>
            <p className="text-sm text-[#7878A0] mb-4">Review this trip.</p>
            <button className="px-5 py-2 rounded-full bg-gold hover:bg-yellow-600 text-black font-semibold text-sm transition-colors">
                Drop a Review →
            </button>
        </div>
    );
}
