'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle, Star, Image as ImageIcon, Upload, X, ChevronLeft, ChevronRight, UserCheck, Quote } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
    status: string;
    createdAt: string;
}

const reviewSchema = z.object({
    rating: z.number().min(1, "Rating is required").max(5),
    comment: z.string().min(5, "Comment must be at least 5 characters"),
    images: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

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

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 5,
            images: []
        }
    });

    const watchImages = watch('images');
    const ratingValue = watch('rating');

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploadingImages(true);
        const files = Array.from(e.target.files);
        const uploadedUrls: string[] = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.success) {
                    uploadedUrls.push(data.data.url);
                }
            }

            const currentImages = watchImages || [];
            setValue('images', [...currentImages, ...uploadedUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            setUploadingImages(false);
        }
    };

    const onSubmitReview = async (data: ReviewFormData) => {
        if (!trip || !session) return;

        setSubmittingReview(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tripId: trip.id,
                    rating: data.rating,
                    comment: data.comment,
                    images: data.images,
                }),
            });

            if (response.ok) {
                setReviewSuccess(true);
                setIsReviewDialogOpen(false);
                reset();
                // Refresh reviews
                const reviewsRes = await fetch(`/api/reviews?tripId=${trip.id}`);
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData);
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to submit review");
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert("An error occurred while submitting your review");
        } finally {
            setSubmittingReview(false);
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
                                        <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-[600px]">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold text-white">Write a Review</DialogTitle>
                                                <DialogDescription className="text-gray-400">
                                                    Tell us about your adventure on {trip.title}.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6 mt-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-200">Rating</Label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setValue('rating', star)}
                                                                className="focus:outline-none transition-transform hover:scale-110"
                                                            >
                                                                <Star
                                                                    className={`w-8 h-8 ${ratingValue >= star ? 'fill-gold text-gold' : 'text-gray-600'}`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="comment" className="text-gray-200">Your Experience</Label>
                                                    <Textarea
                                                        id="comment"
                                                        {...register('comment')}
                                                        rows={5}
                                                        className="bg-black/50 border-white/10 text-white focus:border-gold"
                                                        placeholder="What did you enjoy the most? How was the guide?..."
                                                    />
                                                    {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-gray-200">Add Photos</Label>
                                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                                        {watchImages?.map((url, index) => (
                                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                                                <img src={url} alt={`Review ${index}`} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setValue('images', watchImages.filter((_, i) => i !== index))}
                                                                    className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <label className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-white/5 transition-colors">
                                                            <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                                            <span className="text-[10px] text-gray-400">Upload</span>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleImageUpload}
                                                                disabled={uploadingImages}
                                                            />
                                                        </label>
                                                    </div>
                                                    {uploadingImages && <p className="text-xs text-gold animate-pulse">Uploading images...</p>}
                                                </div>

                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={submittingReview || uploadingImages}
                                                        className="bg-gold hover:bg-yellow-600 text-black w-full sm:w-auto"
                                                    >
                                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
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
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                                            Traveler Reviews
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-6 h-6 fill-gold text-gold" />
                                            <span className="text-2xl font-bold text-white">
                                                {(visibleReviews.reduce((acc, r) => acc + r.rating, 0) / visibleReviews.length).toFixed(1)}
                                            </span>
                                            <span className="text-gray-400">/ 5.0</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {visibleReviews.map((review) => (
                                            <div key={review.id} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
                                                <div className="flex items-start gap-4">
                                                    {/* Avatar */}
                                                    <div className="flex-shrink-0">
                                                        {review.userImage ? (
                                                            <img
                                                                src={review.userImage}
                                                                alt={review.userName}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black font-bold">
                                                                {review.userName.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Review Content */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-white flex items-center gap-2">
                                                                    {review.userName}
                                                                    {review.email === session?.user?.email && (
                                                                        <Badge variant="outline" className="text-xs border-gold text-gold">You</Badge>
                                                                    )}
                                                                </h4>
                                                                <p className="text-sm text-gray-400">
                                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < review.rating
                                                                            ? 'fill-gold text-gold'
                                                                            : 'fill-gray-700 text-gray-700'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="relative">
                                                            <Quote className="absolute -left-1 -top-1 w-6 h-6 text-gold/20" />
                                                            <p className="text-gray-300 leading-relaxed pl-6">{review.comment}</p>
                                                        </div>

                                                        {/* Review Images */}
                                                        {review.images && review.images.length > 0 && (
                                                            <div className="mt-4 flex gap-2">
                                                                {review.images.map((img, idx) => (
                                                                    <img
                                                                        key={idx}
                                                                        src={img}
                                                                        alt={`Review image ${idx + 1}`}
                                                                        className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                                        onClick={() => openLightbox(review.images || [], idx)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
