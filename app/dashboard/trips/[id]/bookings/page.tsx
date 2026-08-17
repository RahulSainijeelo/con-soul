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
    status: 'pending' | 'confirmed' | 'rejected' | 'registrationConfirmed' | 'admin_registered';
    seatNumber?: string;
    createdAt: string;
    paymentScreenshot?: string; // legacy
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    paymentStatus?: string;
}

export default function TripBookingsPage() {
    const params = useParams();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingBooking, setConfirmingBooking] = useState<Booking | null>(null);
    const [seatNumber, setSeatNumber] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showAddBooking, setShowAddBooking] = useState(false);
    const [addingBooking, setAddingBooking] = useState(false);
    const [newBooking, setNewBooking] = useState({
        fullName: '',
        email: '',
        mobileNo: '',
        aadhaarNo: '',
        transportMode: '',
        amountPaid: '',
        paymentMethod: 'cash',
        note: '',
    });

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

    const handleAddBooking = async () => {
        if (!newBooking.fullName || !newBooking.email || !newBooking.mobileNo) {
            toast({ title: 'Error', description: 'Name, email, and mobile are required', variant: 'destructive' });
            return;
        }
        setAddingBooking(true);
        try {
            const res = await fetch('/api/bookings/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tripId: params.id,
                    fullName: newBooking.fullName,
                    email: newBooking.email,
                    mobileNo: newBooking.mobileNo,
                    aadhaarNo: newBooking.aadhaarNo || undefined,
                    transportMode: newBooking.transportMode || undefined,
                    amountPaid: Number(newBooking.amountPaid) || 0,
                    paymentMethod: newBooking.paymentMethod,
                    note: newBooking.note || undefined,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast({ title: 'Booking Created', description: `${newBooking.fullName} has been registered` });
                setShowAddBooking(false);
                setNewBooking({ fullName: '', email: '', mobileNo: '', aadhaarNo: '', transportMode: '', amountPaid: '', paymentMethod: 'cash', note: '' });
                fetchBookings(); // refresh list
            } else {
                toast({ title: 'Error', description: data.error || 'Failed to create booking', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create booking', variant: 'destructive' });
        } finally {
            setAddingBooking(false);
        }
    };

    const pendingBookings = bookings.filter(b => b.status === "pending");
    const confirmedBookings = bookings.filter(b => b.status === "confirmed");
    const registrationConfirmedBookings = bookings.filter(b => b.status === "registrationConfirmed");

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
                    <h1 className="text-3xl font-bold text-gold flex-1">Trip Bookings</h1>
                    <Button
                        onClick={() => setShowAddBooking(true)}
                        className="bg-gold hover:bg-yellow-600 text-black font-semibold"
                    >
                        + Add Booking
                    </Button>
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
                        <TabsTrigger value="registrationConfirmed" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                            Registration Paid ({registrationConfirmedBookings.length})
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

                    <TabsContent value="registrationConfirmed">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {registrationConfirmedBookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    type="all"
                                />
                            ))}
                            {registrationConfirmedBookings.length === 0 && (
                                <p className="text-gray-400 col-span-full text-center py-12">No registration-paid bookings.</p>
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

            <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
                <DialogContent className="bg-black border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Manual Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-400">Full Name *</Label>
                                <Input
                                    value={newBooking.fullName}
                                    onChange={(e) => setNewBooking(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-400">Mobile No *</Label>
                                <Input
                                    value={newBooking.mobileNo}
                                    onChange={(e) => setNewBooking(prev => ({ ...prev, mobileNo: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-400">Email *</Label>
                            <Input
                                value={newBooking.email}
                                onChange={(e) => setNewBooking(prev => ({ ...prev, email: e.target.value }))}
                                className="bg-white/5 border-white/10 text-white mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-400">Aadhaar No (Optional)</Label>
                                <Input
                                    value={newBooking.aadhaarNo}
                                    onChange={(e) => setNewBooking(prev => ({ ...prev, aadhaarNo: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-400">Transport Mode (Optional)</Label>
                                <select
                                    value={newBooking.transportMode}
                                    onChange={(e) => setNewBooking(prev => ({ ...prev, transportMode: e.target.value }))}
                                    className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                                >
                                    <option value="">None</option>
                                    <option value="sleeper">Sleeper</option>
                                    <option value="3ac">3AC</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-400">Initial Payment (₹)</Label>
                                <Input
                                    type="number"
                                    value={newBooking.amountPaid}
                                    onChange={(e) => setNewBooking(prev => ({ ...prev, amountPaid: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-400">Payment Method</Label>
                                <select
                                    value={newBooking.paymentMethod}
                                    onChange={(e) => setNewBooking(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                    className="w-full mt-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="upi_direct">UPI Direct</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-400">Note (Optional)</Label>
                            <Input
                                value={newBooking.note}
                                onChange={(e) => setNewBooking(prev => ({ ...prev, note: e.target.value }))}
                                className="bg-white/5 border-white/10 text-white mt-1"
                                placeholder="e.g. Paid cash at office"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowAddBooking(false)} className="text-gray-400">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddBooking}
                            disabled={addingBooking}
                            className="bg-gold hover:bg-yellow-600 text-black font-semibold"
                        >
                            {addingBooking ? 'Creating...' : 'Create Booking'}
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
            case 'registrationConfirmed':
                return (
                    <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded border border-amber-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Registration Confirmed
                    </div>
                );
            case 'admin_registered':
                return (
                    <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30 flex items-center gap-1">
                        <User className="w-3 h-3" /> Admin Registered
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
