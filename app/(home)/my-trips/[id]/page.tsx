"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
    Calendar,
    MapPin,
    CreditCard,
    CheckCircle2,
    User,
    Phone,
    Mail,
    Shield,
    IndianRupee,
    Clock,
    AlertCircle,
    XCircle,
    ArrowLeft,
    Check,
    X,
    Loader2
} from "lucide-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Booking {
    id: string;
    tripId: string;
    fullName: string;
    email: string;
    mobileNo: string;
    aadhaarNo?: string;
    aadhaarImage?: string;
    amount: number;
    amountPaid?: number;
    paymentStatus?: "partial" | "paid" | string;
    status: "pending" | "confirmed" | "rejected" | string;
    seatNumber?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    createdAt?: string;
}

interface ItineraryItem {
    day: number;
    title: string;
    activities?: string[];
    description?: string;
}

interface Trip {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    duration?: string;
    category?: string;
    images?: (string | { url: string })[];
    description?: string;
    included?: string[];
    notIncluded?: string[];
    itinerary?: ItineraryItem[];
    registrationAmount?: number;
}

export default function MyTripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status: authStatus } = useSession();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingPayment, setLoadingPayment] = useState<boolean>(false);

    const bookingId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            setLoading(false);
            return;
        }

        if (authStatus === "authenticated" && bookingId) {
            fetchBookingAndTrip(bookingId);
        }
    }, [authStatus, bookingId]);

    const fetchBookingAndTrip = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch booking details
            const bookingRes = await fetch(`/api/bookings/${id}`);
            if (!bookingRes.ok) {
                if (bookingRes.status === 404) {
                    setError("Booking not found");
                } else {
                    setError("Failed to fetch booking details");
                }
                setLoading(false);
                return;
            }

            const bookingData: Booking = await bookingRes.json();
            setBooking(bookingData);

            // Fetch trip details using tripId from booking
            if (bookingData.tripId) {
                const tripRes = await fetch(`/api/trips/${bookingData.tripId}`);
                if (tripRes.ok) {
                    const tripData: Trip = await tripRes.json();
                    setTrip(tripData);
                } else {
                    console.error("Failed to fetch trip details");
                }
            }
        } catch (err) {
            console.error("Error fetching trip detail data:", err);
            setError("An error occurred while loading your trip details");
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (typeof window !== "undefined" && window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayRemaining = async () => {
        if (!booking || !trip) return;

        setLoadingPayment(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast({
                    title: "SDK Error",
                    description: "Failed to load Razorpay SDK. Please check your network connection.",
                    variant: "destructive",
                });
                setLoadingPayment(false);
                return;
            }

            const paidSoFar = booking.amountPaid || trip.registrationAmount || 0;
            const remainingAmount = booking.amount - paidSoFar;

            if (remainingAmount <= 0) {
                toast({
                    title: "Notice",
                    description: "This booking is already fully paid.",
                });
                setLoadingPayment(false);
                return;
            }

            // Create Razorpay order
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: remainingAmount,
                    tripId: booking.tripId,
                    bookingId: booking.id,
                }),
            });

            if (!orderRes.ok) {
                const orderError = await orderRes.json();
                throw new Error(orderError.error || "Failed to create payment order");
            }

            const orderData = await orderRes.json();

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "CON-SOUL",
                description: `Remaining Payment for ${trip.title}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch(`/api/bookings/${booking.id}/pay-remaining`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                            }),
                        });

                        if (verifyRes.ok) {
                            toast({
                                title: "Payment Successful!",
                                description: "Your trip is now fully paid.",
                            });
                            setBooking((prev) =>
                                prev
                                    ? {
                                        ...prev,
                                        paymentStatus: "paid",
                                        amountPaid: prev.amount,
                                    }
                                    : null
                            );
                        } else {
                            const errData = await verifyRes.json();
                            toast({
                                title: "Payment Verification Failed",
                                description: errData.error || "Failed to verify remaining payment",
                                variant: "destructive",
                            });
                        }
                    } catch (err: any) {
                        toast({
                            title: "Payment Error",
                            description: err.message || "An error occurred after payment",
                            variant: "destructive",
                        });
                    } finally {
                        setLoadingPayment(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPayment(false);
                    },
                },
                prefill: {
                    name: booking.fullName,
                    email: booking.email,
                    contact: booking.mobileNo,
                },
                config: {
                    display: {
                        blocks: {
                            utib: {
                                name: "UPI",
                                instruments: [
                                    // UPI Collect: pay via UPI ID or mobile number
                                    { method: "upi", flow: "collect" },
                                    // UPI Intent / QR
                                    { method: "upi", flow: "qr" },
                                    { method: "upi", flow: "intent" },
                                ],
                            },
                            other: {
                                name: "Other Payment Methods",
                                instruments: [
                                    { method: "card" },
                                    { method: "netbanking" },
                                    { method: "wallet" },
                                ],
                            },
                        },
                        sequence: ["block.utib", "block.other"],
                        preferences: {
                            show_default_blocks: false,
                        },
                    },
                },
                theme: {
                    color: "#D4AF37",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            console.error("Error in pay remaining:", err);
            toast({
                title: "Payment Failed",
                description: err.message || "Something went wrong while initializing payment",
                variant: "destructive",
            });
            setLoadingPayment(false);
        }
    };

    const getHeroImage = (): string => {
        if (!trip || !trip.images || trip.images.length === 0) {
            return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80";
        }
        const firstImg = trip.images[0];
        if (typeof firstImg === "string") return firstImg;
        if (typeof firstImg === "object" && firstImg.url) return firstImg.url;
        return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80";
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    // Render loading state
    if (authStatus === "loading" || loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-between">
                <Header />
                <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
                    <p className="text-gray-400 text-lg">Loading trip details...</p>
                </div>
                <BottomTabBar />
                <Footer />
            </div>
        );
    }

    // Render unauthenticated state
    if (authStatus === "unauthenticated") {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-between">
                <Header />
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <User className="w-8 h-8 text-gold" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                    <p className="text-gray-400 mb-6">Please log in to view your trip details.</p>
                    <Button
                        onClick={() => router.push("/login")}
                        className="bg-gold text-black hover:bg-yellow-600 font-semibold px-6"
                    >
                        Log In
                    </Button>
                </div>
                <BottomTabBar />
                <Footer />
            </div>
        );
    }

    // Render error state
    if (error || !booking) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-between">
                <Header />
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{error || "Booking Not Found"}</h2>
                    <p className="text-gray-400 mb-6">We couldn't find the requested trip booking.</p>
                    <Link href="/my-trips">
                        <Button className="bg-gold text-black hover:bg-yellow-600 font-semibold px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Trips
                        </Button>
                    </Link>
                </div>
                <BottomTabBar />
                <Footer />
            </div>
        );
    }

    // Calculations for payment
    const paidAmount = booking.amountPaid ?? (trip?.registrationAmount || 0);
    const remainingAmount = Math.max(0, booking.amount - paidAmount);

    return (
        <div className="min-h-screen bg-black text-white pb-16 md:pb-0">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
                <img
                    src={getHeroImage()}
                    alt={trip?.title || "Trip Image"}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-6 left-6 md:top-8 md:left-12 z-10">
                    <button
                        onClick={() => router.push("/my-trips")}
                        className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white text-sm font-medium rounded-full border border-white/10 backdrop-blur-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Trips
                    </button>
                </div>

                {/* Status Badges */}
                <div className="absolute top-6 right-6 md:top-8 md:right-12 z-10 flex flex-col items-end gap-2">
                    {booking.status === "confirmed" && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/90 text-white text-sm font-semibold rounded-full border border-green-400/30 backdrop-blur-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Confirmed
                        </div>
                    )}
                    {booking.status === "pending" && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600/90 text-white text-sm font-semibold rounded-full border border-yellow-400/30 backdrop-blur-sm">
                            <Clock className="w-4 h-4" />
                            Pending Confirmation
                        </div>
                    )}
                    {booking.status === "rejected" && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/90 text-white text-sm font-semibold rounded-full border border-red-400/30 backdrop-blur-sm">
                            <XCircle className="w-4 h-4" />
                            Rejected
                        </div>
                    )}

                    {booking.status === "confirmed" && booking.seatNumber && (
                        <div className="px-3 py-1 bg-black/70 text-gold text-xs font-mono rounded-full border border-gold/30 backdrop-blur-sm">
                            Seat: {booking.seatNumber}
                        </div>
                    )}
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto">
                        {trip?.category && (
                            <span className="inline-block px-3 py-1 bg-gold/20 text-gold border border-gold/30 text-xs font-semibold rounded-full mb-3">
                                {trip.category}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                            {trip?.title || "Trip Booking"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base">
                            {trip?.destination && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gold" />
                                    <span>{trip.destination}</span>
                                </div>
                            )}
                            {trip?.duration && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gold" />
                                    <span>{trip.duration}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gold" />
                                <span>Booking ID: <span className="font-mono text-white">{booking.id}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details & Itinerary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Dates & Duration Card */}
                        <Card className="bg-white/5 border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-gold" />
                                Trip Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                                    <p className="font-semibold text-lg text-white">{formatDate(trip?.startDate)}</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">End Date</p>
                                    <p className="font-semibold text-lg text-white">{formatDate(trip?.endDate)}</p>
                                </div>
                                {trip?.duration && (
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                                        <p className="font-semibold text-lg text-white">{trip.duration}</p>
                                    </div>
                                )}
                                {booking.seatNumber && (
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Assigned Seat</p>
                                        <p className="font-semibold text-lg text-gold font-mono">{booking.seatNumber}</p>
                                    </div>
                                )}
                            </div>

                            {trip?.description && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-gray-300 leading-relaxed">{trip.description}</p>
                                </div>
                            )}
                        </Card>

                        {/* Itinerary Section */}
                        {trip?.itinerary && trip.itinerary.length > 0 && (
                            <Card className="bg-white/5 border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Itinerary</h2>
                                <div className="space-y-6">
                                    {trip.itinerary.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="relative pl-8 pb-6 border-l-2 border-gold/30 last:border-0 last:pb-0"
                                        >
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gold rounded-full border-4 border-black" />
                                            <div className="mb-2">
                                                <span className="text-xs font-bold text-gold uppercase tracking-wider">
                                                    Day {item.day || idx + 1}
                                                </span>
                                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                            </div>

                                            {item.description && (
                                                <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                                            )}

                                            {item.activities && item.activities.length > 0 && (
                                                <ul className="space-y-1">
                                                    {item.activities.map((act, actIdx) => (
                                                        <li key={actIdx} className="text-sm text-gray-400 flex items-start gap-2">
                                                            <span className="text-gold mt-0.5">•</span>
                                                            <span>{act}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Included & Not Included Section */}
                        {((trip?.included && trip.included.length > 0) || (trip?.notIncluded && trip.notIncluded.length > 0)) && (
                            <Card className="bg-white/5 border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Inclusions & Exclusions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {trip?.included && trip.included.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" /> What's Included
                                            </h3>
                                            <ul className="space-y-2">
                                                {trip.included.map((inc, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                                        <span>{inc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {trip?.notIncluded && trip.notIncluded.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                                                <XCircle className="w-5 h-5" /> What's Not Included
                                            </h3>
                                            <ul className="space-y-2">
                                                {trip.notIncluded.map((exc, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                        <span>{exc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Payment & Traveler Info */}
                    <div className="space-y-6">
                        {/* Payment Section */}
                        <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gold" />
                                Payment Details
                            </h2>

                            <div className="space-y-5">
                                {/* Payment Status Banner */}
                                {booking.paymentStatus === "partial" && (
                                    <div className="p-4 bg-yellow-950/40 border border-yellow-500/30 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between text-green-400 font-semibold text-sm">
                                            <span className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4" /> Registration Paid ✓
                                            </span>
                                            <span>₹{paidAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-300 text-sm">
                                            <span>Total Amount:</span>
                                            <span>₹{booking.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gold font-bold text-base pt-2 border-t border-yellow-500/20">
                                            <span>Remaining Due:</span>
                                            <span>₹{remainingAmount.toLocaleString()}</span>
                                        </div>

                                        {/* Pay Remaining Gold Button */}
                                        <Button
                                            onClick={handlePayRemaining}
                                            disabled={loadingPayment}
                                            className="w-full mt-3 bg-gold hover:bg-yellow-600 text-black font-bold py-3 text-base rounded-xl transition-colors shadow-lg shadow-gold/10"
                                        >
                                            {loadingPayment ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <IndianRupee className="w-4 h-4" /> Pay Remaining ₹{remainingAmount.toLocaleString()}
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {booking.paymentStatus === "paid" && (
                                    <div className="p-4 bg-green-950/40 border border-green-500/30 rounded-xl space-y-2">
                                        <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Fully Paid ✓</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-300 text-sm pt-2 border-t border-green-500/20">
                                            <span>Total Amount Paid:</span>
                                            <span className="text-white font-semibold">₹{booking.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                {booking.paymentStatus !== "partial" && booking.paymentStatus !== "paid" && (
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between text-gray-300 text-sm">
                                            <span>Booking Amount:</span>
                                            <span className="text-gold font-bold text-lg">₹{booking.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Breakdown info */}
                                <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Trip Fee</span>
                                        <span className="text-white font-medium">₹{booking.amount.toLocaleString()}</span>
                                    </div>

                                    {booking.razorpayPaymentId && (
                                        <div className="pt-2 border-t border-white/5">
                                            <span className="text-xs text-gray-400 block mb-1">Razorpay Payment ID</span>
                                            <span className="font-mono text-xs text-gray-300 break-all bg-black/40 p-2 rounded block border border-white/5">
                                                {booking.razorpayPaymentId}
                                            </span>
                                        </div>
                                    )}

                                    {booking.createdAt && (
                                        <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                                            <Calendar className="w-3.5 h-3.5 text-gold" />
                                            <span>Booked on {formatDate(booking.createdAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Traveler Information */}
                        <Card className="bg-white/5 border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-gold" />
                                Traveler Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-gold mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Full Name</p>
                                        <p className="font-medium text-white">{booking.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-gold mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Email Address</p>
                                        <p className="font-medium text-white break-all">{booking.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-gold mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Mobile Number</p>
                                        <p className="font-medium text-white">{booking.mobileNo}</p>
                                    </div>
                                </div>

                                {booking.aadhaarNo && (
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-4 h-4 text-gold mt-1 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Aadhaar Number</p>
                                            <p className="font-mono text-white">XXXX-XXXX-{booking.aadhaarNo.slice(-4)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Support Card */}
                        <Card className="bg-white/5 border-white/10 rounded-2xl p-6 text-center">
                            <h3 className="text-lg font-bold text-white mb-2">Need Assistance?</h3>
                            <p className="text-xs text-gray-400 mb-4">
                                Have questions about your booking or itinerary? Contact our support team.
                            </p>
                            <Link href="/contact">
                                <Button variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10">
                                    Contact Support
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>

            <BottomTabBar />
            <Footer />
        </div>
    );
}
