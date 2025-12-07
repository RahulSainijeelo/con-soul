"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Check, X, Download, ExternalLink, Edit } from "lucide-react";
import Image from "next/image";

interface BookingDetail {
    id: string;
    tripId: string;
    fullName: string;
    email: string;
    mobileNo: string;
    aadhaarNo: string;
    aadhaarImage?: string;
    paymentrefno: string;
    paymentScreenshot?: string;
    status: 'pending' | 'confirmed' | 'rejected';
    seatNumber?: string;
    createdAt: string;
    amount?: number;
    transportMode?: string;
}

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [editing, setEditing] = useState(false);
    const [seatNumber, setSeatNumber] = useState("");
    const [processing, setProcessing] = useState(false);
    const [newStatus, setNewStatus] = useState<'pending' | 'confirmed' | 'rejected'>('confirmed');

    useEffect(() => {
        fetchBooking();
    }, [params.bookingId]);

    const fetchBooking = async () => {
        try {
            const res = await fetch(`/api/bookings/${params.bookingId}`);
            if (res.ok) {
                const data = await res.json();
                setBooking(data);
                if (data.seatNumber) setSeatNumber(data.seatNumber);
                if (data.status) setNewStatus(data.status);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch booking details",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: 'confirmed' | 'rejected') => {
        if (status === 'confirmed' && !seatNumber) {
            setConfirming(true);
            return;
        }

        if (status === 'rejected' && !confirm("Are you sure you want to reject this booking?")) return;

        setProcessing(true);
        try {
            const body: any = { status };
            if (status === 'confirmed') body.seatNumber = seatNumber;

            const res = await fetch(`/api/bookings/${params.bookingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                toast({
                    title: "Success",
                    description: `Booking ${status} successfully`
                });
                setBooking(prev => prev ? { ...prev, status, seatNumber: status === 'confirmed' ? seatNumber : undefined } : null);
                setConfirming(false);
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update booking status",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleEditBooking = async () => {
        setProcessing(true);
        try {
            const body: any = { status: newStatus };
            if (newStatus === 'confirmed') body.seatNumber = seatNumber;

            const res = await fetch(`/api/bookings/${params.bookingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                toast({
                    title: "Success",
                    description: "Booking updated successfully"
                });
                setBooking(prev => prev ? { ...prev, status: newStatus, seatNumber: newStatus === 'confirmed' ? seatNumber : undefined } : null);
                setEditing(false);
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update booking",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
                <p>Booking not found</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-gold">Booking Details</h1>
                    </div>
                    <div className="flex gap-2">
                        {booking.status === 'pending' && (
                            <>
                                <Button
                                    onClick={() => setConfirming(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirm
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    variant="destructive"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </>
                        )}
                        {booking.status !== 'pending' && (
                            <div className="flex items-center gap-2">
                                {booking.status === 'confirmed' && (
                                    <div className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-md font-medium flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Confirmed (Seat: {booking.seatNumber})
                                    </div>
                                )}
                                {booking.status === 'rejected' && (
                                    <div className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md font-medium flex items-center gap-2">
                                        <X className="w-4 h-4" /> Rejected
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        setNewStatus(booking.status);
                                        setSeatNumber(booking.seatNumber || "");
                                        setEditing(true);
                                    }}
                                    className="border-white/10 hover:bg-white/10 hover:text-white"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-400">Full Name</Label>
                                    <p className="text-white font-medium mt-1">{booking.fullName}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-400">Mobile Number</Label>
                                    <p className="text-white font-medium mt-1">{booking.mobileNo}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-gray-400">Email Address</Label>
                                    <p className="text-white font-medium mt-1">{booking.email}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-gray-400">Aadhaar Number</Label>
                                    <p className="text-white font-medium mt-1">{booking.aadhaarNo}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-gray-400">Payment Reference Number</Label>
                                <p className="text-white font-mono mt-1 bg-black/30 p-2 rounded border border-white/5">
                                    {booking.paymentrefno}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-400">Amount Paid</Label>
                                    <p className="text-white font-medium mt-1 text-lg text-gold">
                                        ₹{booking.amount?.toLocaleString() || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-400">Transportation</Label>
                                    <p className="text-white font-medium mt-1 capitalize">
                                        {booking.transportMode || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-400">Booking Date</Label>
                                <p className="text-white font-medium mt-1">
                                    {new Date(booking.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aadhaar Image */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Aadhaar Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {booking.aadhaarImage ? (
                                <div className="relative aspect-video w-full bg-black/50 rounded-lg overflow-hidden border border-white/10 group">
                                    <Image
                                        src={booking.aadhaarImage}
                                        alt="Aadhaar Card"
                                        fill
                                        className="object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a
                                            href={booking.aadhaarImage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-white hover:text-gold"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            View Full Size
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No image uploaded</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Screenshot */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Payment Screenshot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {booking.paymentScreenshot ? (
                                <div className="relative aspect-video w-full bg-black/50 rounded-lg overflow-hidden border border-white/10 group">
                                    <Image
                                        src={booking.paymentScreenshot}
                                        alt="Payment Screenshot"
                                        fill
                                        className="object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a
                                            href={booking.paymentScreenshot}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-white hover:text-gold"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            View Full Size
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No screenshot uploaded</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Confirm Dialog */}
            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-gray-300">Assign a seat number to confirm this booking.</p>
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
                        <Button variant="ghost" onClick={() => setConfirming(false)} className="text-gray-400">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleUpdateStatus('confirmed')}
                            disabled={!seatNumber || processing}
                            className="bg-gold text-black hover:bg-yellow-600"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editing} onOpenChange={setEditing}>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={newStatus}
                                onValueChange={(val: 'pending' | 'confirmed' | 'rejected') => setNewStatus(val)}
                            >
                                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-white/10 text-white">
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {newStatus === 'confirmed' && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-seat">Seat Number</Label>
                                <Input
                                    id="edit-seat"
                                    value={seatNumber}
                                    onChange={(e) => setSeatNumber(e.target.value)}
                                    placeholder="e.g. A1, 12, etc."
                                    className="bg-black/50 border-white/10 text-white"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditing(false)} className="text-gray-400">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditBooking}
                            disabled={(newStatus === 'confirmed' && !seatNumber) || processing}
                            className="bg-gold text-black hover:bg-yellow-600"
                        >
                            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
