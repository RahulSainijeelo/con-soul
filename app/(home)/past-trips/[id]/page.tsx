'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle, Star, Image as ImageIcon, Upload, X, ChevronLeft, ChevronRight, UserCheck, Quote } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ReviewFeed } from '@/components/reviews/v2/ReviewFeed';
import { ReviewForm } from '@/components/reviews/v2/ReviewForm';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BottomTabBar from '@/components/layout/BottomTabBar';

interface Trip {
    id: string;
    title: string;
    destination: string;
    category: string;
    description: string;
    content: string;
    images: { url: string; deleteUrl?: string }[];
    status: string;
    startDate: string;
    endDate: string;
    price: number;
    maxParticipants: number;
    currentParticipants?: number;
    difficulty?: string;
    duration?: string;
    included?: string[];
    notIncluded?: string[];
    itinerary?: { day: number; title: string; description: string }[];
    featured?: boolean;
    rating?: number;
    reviewCount?: number;
}

interface Booking {
    id: string;
    status: string;
    tripId: string;
}

interface Review {
    id: string;
    tripId: string;
    email: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    images?: string[];
    vibeTags?: string[];
    squadChemistry?: number;
    consoulHost?: number;
    tripVibe?: number;
    certifiedHighlight?: string;
    personalityBadge?: string;
    fomoScore?: string;
    honestTake?: string;
    likes?: number;
    status: string;
    createdAt: string;
}

export default function PastTripPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
                if (!tripId) return;

                // Fetch trip data
                const tripRes = await fetch(`/api/trips/${tripId}`);
                if (!tripRes.ok) {
                    setTrip(null);
                    setLoading(false);
                    return;
                }
                const tripData = await tripRes.json();
                setTrip(tripData);

                // Fetch reviews
                const reviewsRes = await fetch(`/api/reviews?tripId=${tripId}`);
                if (reviewsRes.ok) {
                    const reviewsData: Review[] = await reviewsRes.json();
                    setReviews(reviewsData);
                }

                // Fetch user's booking if logged in
                if (session?.user?.email) {
                    const bookingsRes = await fetch(`/api/user/bookings?tripId=${tripId}&checkOnly=true`);
                    if (bookingsRes.ok) {
                        const bookingData = await bookingsRes.json();
                        if (bookingData.exists && bookingData.booking) {
                            setBooking(bookingData.booking);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, session]);

    useEffect(() => {
        if (session?.user?.email && reviews.length > 0) {
            const myReview = reviews.find(r => r.email === session.user?.email);
            if (myReview) {
                setUserReview(myReview);
                setReviewSuccess(true); // Hide form if already reviewed
            }
        }
    }, [reviews, session]);

    const fetchReviews = async () => {
        if (!trip) return;
        const reviewsRes = await fetch(`/api/reviews?tripId=${trip.id}`);
        if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData);
        }
    };


    const openLightbox = (images: string[], index: number) => {
        setLightboxImages(images);
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!trip) {
        notFound();
    }

    // Filter reviews to show: Approved reviews OR the user's own review (even if pending)
    const visibleReviews = reviews.filter(r => r.status === 'approved' || (session?.user?.email && r.email === session.user.email));

    return (
        <>
            <div className="min-h-screen bg-black pb-16 md:pb-0">
                <Header />

                {/* Hero Image Section */}
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                    {trip.images && trip.images.length > 0 ? (
                        <img
                            src={trip.images[0].url}
                            alt={trip.title}
                            className="h-full w-full object-cover grayscale"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                        <div className="container mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600">
                                    Past Trip
                                </Badge>
                                <Badge className="bg-gold text-black hover:bg-yellow-500">
                                    {trip.category}
                                </Badge>
                                {booking?.status === 'confirmed' && (
                                    <Badge className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1">
                                        <UserCheck className="w-3 h-3" />
                                        Participant
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                                {trip.title}
                            </h1>
                            {trip.description && (
                                <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                                    {trip.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Review Section for Confirmed Travelers */}
                            {booking?.status === 'confirmed' && !userReview && (
                                <div className="bg-gradient-to-br from-gold/10 to-orange-500/5 rounded-2xl border border-gold/20 p-6 md:p-8 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-white mb-2">
                                            How was your trip?
                                        </h2>
                                        <p className="text-gray-400">Share your experience with us and other travelers.</p>
                                    </div>

                                    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-gold hover:bg-yellow-600 text-black font-semibold">
                                                Write a Review
                                            </Button>
                                        </DialogTrigger>
                                            <DialogContent className="bg-[#09090F] border-white/10 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold text-white">Write a Review</DialogTitle>
                                                    <DialogDescription className="text-gray-400">
                                                        Tell us about your adventure on {trip.title}.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="mt-4">
                                                    <ReviewForm 
                                                        tripId={trip.id} 
                                                        isGuest={false} 
                                                        onSuccess={() => {
                                                            setIsReviewDialogOpen(false);
                                                            setReviewSuccess(true);
                                                            fetchReviews();
                                                        }} 
                                                    />
                                                </div>
                                            </DialogContent>
                                    </Dialog>
                                </div>
                            )}

                            {userReview && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 text-center">
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Review Submitted!</h3>
                                    <p className="text-gray-400">
                                        {userReview.status === 'pending'
                                            ? "Your review is pending approval."
                                            : "Your review has been approved and is visible below."}
                                    </p>
                                </div>
                            )}

                            {/* Trip Highlights */}
                            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                                    Trip Highlights
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 bg-black/30 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
                                        <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Scenic {trip.category} Views</h4>
                                            <p className="text-sm text-gray-400">Experience breathtaking {trip.destination}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Details/Content */}
                            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                                    About This Trip
                                </h2>
                                <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-strong:text-gold">
                                    <ul className="list-disc pl-5 space-y-2">
                                        {trip.content?.split('.').filter(s => s.trim().length > 0).map((sentence, i) => (
                                            <li key={i} className="text-gray-300">{sentence.trim()}.</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* Image Gallery */}
                            {trip.images && trip.images.length > 1 && (
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                                        Gallery
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {trip.images.slice(1).map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                                                onClick={() => openLightbox(trip.images.map(img => img.url), index + 1)}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${trip.title} - Image ${index + 2}`}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {visibleReviews.length > 0 && (
                                <ReviewFeed reviews={visibleReviews} tripId={trip.id} />
                            )}
                        </div>



                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Trip Information Card */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Trip Information
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                        <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-400">Destination</p>
                                            <p className="font-medium text-white">{trip.destination}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                        <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-400">Completed On</p>
                                            <p className="font-medium text-white">
                                                {new Date(trip.endDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

                {/* Lightbox */}
                {lightboxOpen && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <img
                            src={lightboxImages[lightboxIndex]}
                            alt="Lightbox"
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                            {lightboxIndex + 1} / {lightboxImages.length}
                        </div>
                    </div>
                )}
            </div>
            <BottomTabBar />
        </>
    );
}
