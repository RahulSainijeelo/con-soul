"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, X, User, Phone, Mail, Calendar, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Booking {
    id: string;
    tripId: string;
    fullName: string;
    email: string;
    mobileNo: string;
    status: 'pending' | 'confirmed' | 'rejected';
    seatNumber?: string;
    createdAt: string;
    paymentScreenshot?: string;
}

export default function TripBookingsPage() {
    const params = useParams();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingBooking, setConfirmingBooking] = useState<Booking | null>(null);
    const [seatNumber, setSeatNumber] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [params.id]);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`/api/trips/${params.id}/bookings`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch bookings",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!confirmingBooking || !seatNumber) return;

        setProcessing(true);
        try {
            const res = await fetch(`/api/bookings/${confirmingBooking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "confirmed",
                    seatNumber
                })
            });

            if (res.ok) {
                toast({
                    title: "Success",
                    description: "Booking confirmed successfully"
                });
                setBookings(prev => prev.map(b =>
                    b.id === confirmingBooking.id
                        ? { ...b, status: "confirmed", seatNumber }
                        : b
                ));
                setConfirmingBooking(null);
                setSeatNumber("");
            } else {
                throw new Error("Failed to confirm");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to confirm booking",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (bookingId: string) => {
        if (!confirm("Are you sure you want to reject this booking?")) return;

        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "rejected" })
            });

            if (res.ok) {
                toast({
                    title: "Success",
                    description: "Booking rejected"
                });
                setBookings(prev => prev.map(b =>
                    b.id === bookingId ? { ...b, status: "rejected" } : b
                ));
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject booking",
                variant: "destructive"
            });
        }
    };

    const pendingBookings = bookings.filter(b => b.status === "pending");
    const confirmedBookings = bookings.filter(b => b.status === "confirmed");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-gold">Trip Bookings</h1>
                </div>

                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                            All ({bookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="confirmed" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                            Confirmed ({confirmedBookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                            Pending ({pendingBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    type="all"
                                />
                            ))}
                            {bookings.length === 0 && (
                                <p className="text-gray-400 col-span-full text-center py-12">No bookings found.</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="confirmed">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {confirmedBookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    type="confirmed"
                                />
                            ))}
                            {confirmedBookings.length === 0 && (
                                <p className="text-gray-400 col-span-full text-center py-12">No confirmed bookings yet.</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="pending">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingBookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    type="pending"
                                    onConfirm={() => setConfirmingBooking(booking)}
                                    onReject={() => handleReject(booking.id)}
                                />
                            ))}
                            {pendingBookings.length === 0 && (
                                <p className="text-gray-400 col-span-full text-center py-12">No pending bookings.</p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={!!confirmingBooking} onOpenChange={(open) => !open && setConfirmingBooking(null)}>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Participant Name</Label>
                            <div className="text-gray-300">{confirmingBooking?.fullName}</div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seat">Seat Number</Label>
                            <Input
                                id="seat"
                                value={seatNumber}
                                onChange={(e) => setSeatNumber(e.target.value)}
                                placeholder="e.g. A1, 12, etc."
                                className="bg-black/50 border-white/10 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setConfirmingBooking(null)} className="text-gray-400">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!seatNumber || processing}
                            className="bg-gold text-black hover:bg-yellow-600"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function BookingCard({
    booking,
    type,
    onConfirm,
    onReject
}: {
    booking: Booking;
    type: 'confirmed' | 'pending' | 'all';
    onConfirm?: () => void;
    onReject?: () => void;
}) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Confirmed
                    </div>
                );
            case 'rejected':
                return (
                    <div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/30 flex items-center gap-1">
                        <X className="w-3 h-3" /> Rejected
                    </div>
                );
            default:
                return (
                    <div className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/30 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Pending
                    </div>
                );
        }
    };

    return (
        <Card className="bg-white/5 border-white/10 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-white truncate">
                        {booking.fullName}
                    </CardTitle>
                    {type === 'all' ? (
                        getStatusBadge(booking.status)
                    ) : (
                        type === 'confirmed' && booking.seatNumber && (
                            <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30">
                                Seat: {booking.seatNumber}
                            </div>
                        )
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold" />
                    <span className="truncate">{booking.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold" />
                    <span>{booking.mobileNo}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-3 border-t border-white/10 pt-2">
                <Link href={`/dashboard/bookings/${booking.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-white/10 text-gray-300 hover:bg-white/5">
                        <User className="w-4 h-4 mr-2" />
                        View Details
                    </Button>
                </Link>

                {type === 'pending' && (
                    <>
                        <Button
                            size="sm"
                            onClick={onConfirm}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={onReject}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
