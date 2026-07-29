'use client';

import { useState, useRef } from 'react';
import { Star, Upload, X, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const VIBE_TAGS = [
    '#WildNights', '#ChillBrewed', '#FriendshipLocked', '#FoodComa',
    '#CultureDive', '#ViewsOnViews', '#OffScript', '#RandomAdventure',
    '#InstaMoments', '#SoulRecharge', '#ChaosTherapy', '#BrokeButHappy'
];

const PERSONALITIES = [
    { id: 'social', label: '🎉 Social Butterfly — You\'re there for the squad, the chaos, the nights' },
    { id: 'thrill', label: '🏔️ Thrill Seeker — You want to do things that make your heart race' },
    { id: 'culture', label: '🎭 Culture Kid — You\'re here for the history, food, and local depth' },
    { id: 'content', label: '📸 Content Creator — Your camera roll is your reason for living' },
    { id: 'foodie', label: '🍜 Foodie — You plan your day around the next meal' },
    { id: 'vibes', label: '😴 Vibes-Only — You don\'t need an itinerary, just good energy' },
];

const FOMO_SCORES = [
    'Mildly Sad — It was good, but life goes on',
    'Truly Devastated — They\'d regret it for weeks',
    'Completely Destroyed — They would never emotionally recover'
];

const BANNED_WORDS = ['great', 'amazing', 'awesome', 'fun time', 'nice', 'good time', 'had a blast', 'beautiful', 'wonderful'];

interface ReviewFormProps {
    tripId: string;
    isGuest: boolean;
    onSuccess?: () => void;
}

export function ReviewForm({ tripId, isGuest, onSuccess }: ReviewFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Guest Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Dimensions
    const [rating, setRating] = useState(0);
    const [vibeTags, setVibeTags] = useState<string[]>([]);
    const [squadChem, setSquadChem] = useState(0);
    const [consoulHost, setConsoulHost] = useState(0);
    const [tripVibe, setTripVibe] = useState(0);
    const [highlight, setHighlight] = useState('');
    const [personality, setPersonality] = useState('');
    const [fomo, setFomo] = useState('');
    const [honestTake, setHonestTake] = useState('');
    
    // Images
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    // Validation States
    const [highlightError, setHighlightError] = useState('');
    const [honestTakeError, setHonestTakeError] = useState('');

    const toggleTag = (tag: string) => {
        if (vibeTags.includes(tag)) {
            setVibeTags(vibeTags.filter(t => t !== tag));
        } else if (vibeTags.length < 4) {
            setVibeTags([...vibeTags, tag]);
        }
    };

    const validateHighlight = () => {
        if (!highlight.trim()) return;
        const words = highlight.trim().split(/\s+/);
        const hasBanned = BANNED_WORDS.some(word => highlight.toLowerCase().includes(word));
        
        if (words.length < 6 || hasBanned) {
            setHighlightError("Too vague. What actually happened? Name the place, the moment, the people.");
        } else {
            setHighlightError('');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        
        setUploadingImages(true);
        const newUrls = [...imageUrls];
        
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            const formData = new FormData();
            formData.append("image", file);
            
            try {
                // Assuming standard ImgBB upload path based on codebase context
                const res = await fetch(`https://api.imgbb.com/1/upload?key=67fbb2ecb62d8479e0f2f3dae5dcb17a`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    newUrls.push(data.data.url);
                }
            } catch (error) {
                console.error("Image upload failed", error);
            }
        }
        
        setImageUrls(newUrls);
        setUploadingImages(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final Validations
        if (!rating) return toast({ title: "Please leave a star rating", variant: "destructive" });
        if (isGuest && (!name || !email || !phone)) return toast({ title: "Please fill in all contact details", variant: "destructive" });
        if (!honestTake.trim()) {
            setHonestTakeError("Can't skip this one. What would make the next trip better?");
            return;
        }
        validateHighlight();
        if (highlightError) return;

        setSubmitting(true);

        const payload = {
            tripId,
            ...(isGuest && { name, email, phone }),
            rating,
            comment: highlight || honestTake, // Fallback for schema requirement
            vibeTags,
            squadChemistry: squadChem,
            consoulHost,
            tripVibe,
            certifiedHighlight: highlight,
            personalityBadge: personality,
            fomoScore: fomo,
            honestTake,
            images: imageUrls
        };

        const endpoint = isGuest ? '/api/reviews/invite' : '/api/reviews';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSubmitted(true);
                if (onSuccess) onSuccess();
            } else {
                const data = await res.json();
                toast({ title: "Error", description: data.message || "Failed to submit review", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-[#A855F7]/10 border border-[#A855F7] rounded-2xl p-8 text-center max-w-xl mx-auto my-8">
                <CheckCircle2 className="w-16 h-16 text-[#A855F7] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Your review is live 🔥</h2>
                <p className="text-[#D8D8EE] mb-6">You just made the next squad's decision easier.</p>
                <button 
                    onClick={() => router.push(`/past-trips/${tripId}`)}
                    className="text-[#A855F7] font-semibold hover:underline"
                >
                    See your card →
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-12 pb-20 font-sans" style={{ color: '#F0F0FA' }}>
            
            {isGuest && (
                <div className="space-y-4 bg-[#12121E] p-6 rounded-xl border border-white/10">
                    <h3 className="font-display font-bold text-xl mb-4 text-white">Your Details</h3>
                    <div>
                        <label className="block text-sm text-[#D8D8EE] mb-1">Full Name</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0C0C1A] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#D8D8EE] mb-1">Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0C0C1A] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#D8D8EE] mb-1">Phone</label>
                        <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0C0C1A] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" />
                    </div>
                </div>
            )}

            {/* Step 1: 5-Star Rating */}
            <div className="space-y-4">
                <label className="block font-display font-bold text-xl text-white">Overall Experience</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`w-10 h-10 cursor-pointer transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`} 
                        />
                    ))}
                </div>
            </div>

            {/* Step 2: Vibe Tags */}
            <div className="space-y-4">
                <div>
                    <label className="block font-display font-bold text-xl text-white">Vibe Tags</label>
                    <p className="text-sm text-[#7878A0]">Pick the tags that actually describe this trip (max 4)</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {VIBE_TAGS.map(tag => {
                        const isSelected = vibeTags.includes(tag);
                        const isDisabled = !isSelected && vibeTags.length >= 4;
                        return (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-full border transition-all ${
                                    isSelected 
                                        ? 'bg-gold/20 border-gold text-gold' 
                                        : isDisabled 
                                            ? 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed opacity-40' 
                                            : 'bg-[#12121E] border-white/20 text-[#D8D8EE] hover:border-gold/50'
                                }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step 3: Sliders */}
            <div className="space-y-8 bg-[#12121E] p-6 rounded-xl border border-white/10">
                {[
                    { label: 'Squad Chemistry', prompt: 'How fast did strangers become your people?', val: squadChem, set: setSquadChem },
                    { label: 'Consoul Host', prompt: 'How did your Consoul host show up for the squad?', val: consoulHost, set: setConsoulHost },
                    { label: 'Trip Vibe', prompt: 'How was the overall energy from day 1 to last night?', val: tripVibe, set: setTripVibe },
                ].map((slider, idx) => (
                    <div key={idx} className="space-y-3">
                        <div>
                            <label className="block font-bold text-white">{slider.label}</label>
                            <p className="text-sm text-[#7878A0]">{slider.prompt}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="0" max="5" step="0.5" 
                                value={slider.val} 
                                onChange={e => slider.set(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-[#0C0C1A] rounded-lg appearance-none cursor-pointer accent-gold"
                            />
                            <span className="font-display font-bold text-xl text-gold w-12 text-right">{slider.val.toFixed(1)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Step 4: Certified Highlight */}
            <div className="space-y-4">
                <div>
                    <label className="block font-display font-bold text-xl text-white">Certified Highlight</label>
                    <p className="text-sm text-[#7878A0]">One thing from this trip you'll never forget. Be specific — no 'it was amazing'.</p>
                </div>
                <div className="relative">
                    <textarea 
                        maxLength={100}
                        value={highlight}
                        onChange={e => setHighlight(e.target.value)}
                        onBlur={validateHighlight}
                        placeholder="e.g. 3AM maggi at the pass with the whole crew freezing but laughing..."
                        className={`w-full bg-[#12121E] border ${highlightError ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:border-gold resize-none`}
                    />
                    {100 - highlight.length <= 60 && (
                        <div className={`absolute bottom-3 right-3 text-xs ${100 - highlight.length <= 15 ? 'text-red-500' : 'text-[#7878A0]'}`}>
                            {100 - highlight.length} left
                        </div>
                    )}
                </div>
                {highlightError && <p className="text-red-500 text-sm mt-1">{highlightError}</p>}
            </div>

            {/* Step 5: Personality */}
            <div className="space-y-4">
                <div>
                    <label className="block font-display font-bold text-xl text-white">Who's This Trip For</label>
                    <p className="text-sm text-[#7878A0]">Which one are you? (Be honest — your friends already know)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PERSONALITIES.map(p => (
                        <div 
                            key={p.id}
                            onClick={() => setPersonality(personality === p.label ? '' : p.label)}
                            className={`cursor-pointer p-4 rounded-lg border transition-all ${
                                personality === p.label 
                                    ? 'bg-gold/20 border-gold text-white' 
                                    : 'bg-[#12121E] border-white/10 text-[#7878A0] hover:bg-white/5 opacity-50 hover:opacity-100'
                            }`}
                        >
                            {p.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 6: FOMO */}
            <div className="space-y-4">
                <div>
                    <label className="block font-display font-bold text-xl text-white">If Your Friend Skipped This Trip, They'd Be:</label>
                </div>
                <div className="flex flex-col gap-3">
                    {FOMO_SCORES.map(score => (
                        <div 
                            key={score}
                            onClick={() => setFomo(score)}
                            className={`cursor-pointer p-4 rounded-lg border transition-all ${
                                fomo === score 
                                    ? 'bg-[#FACC15]/20 border-[#FACC15] text-white' 
                                    : 'bg-[#12121E] border-white/10 text-[#7878A0] hover:bg-white/5'
                            }`}
                        >
                            {score}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 7: Honest Take */}
            <div className="space-y-4">
                <div>
                    <label className="block font-display font-bold text-xl text-white">Honest Take <span className="text-red-500">*</span></label>
                    <p className="text-sm text-[#7878A0]">What needs a glow-up? (Required — this is what actually helps us improve)</p>
                </div>
                <div className="relative">
                    <textarea 
                        maxLength={120}
                        required
                        value={honestTake}
                        onChange={e => {
                            setHonestTake(e.target.value);
                            setHonestTakeError('');
                        }}
                        className={`w-full bg-[#12121E] border ${honestTakeError ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:border-gold resize-none`}
                    />
                    {120 - honestTake.length <= 80 && (
                        <div className={`absolute bottom-3 right-3 text-xs ${120 - honestTake.length <= 20 ? 'text-red-500' : 'text-[#7878A0]'}`}>
                            {120 - honestTake.length} left
                        </div>
                    )}
                </div>
                {honestTakeError && <p className="text-red-500 text-sm mt-1">{honestTakeError}</p>}
            </div>

            {/* Step 8: Photos */}
            <div className="space-y-4">
                <label className="block font-display font-bold text-xl text-white">Drop some memories (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/20">
                            <img src={url} alt="upload" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/80"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-gold flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#12121E]">
                        {uploadingImages ? (
                            <span className="text-gold text-sm font-semibold animate-pulse">Uploading...</span>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-[#7878A0] mb-2" />
                                <span className="text-sm text-[#7878A0]">Add Photo</span>
                            </>
                        )}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                    </label>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={submitting || uploadingImages}
                className="w-full py-4 mt-8 bg-gold hover:bg-yellow-600 text-black font-display font-bold text-xl rounded-xl transition-all disabled:opacity-50"
            >
                {submitting ? 'Posting...' : 'Submit Review'}
            </button>
        </form>
    );
}
