import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/config/firebase";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

// POST /api/razorpay/order - Create a Razorpay Order
// Supports both new bookings and remaining payments (via bookingId)
export async function POST(request: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "dummy_key_id",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_key_secret",
        });

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { amount, tripId, bookingId } = body;

        if (!tripId) {
            return NextResponse.json(
                { error: "tripId is required" },
                { status: 400 }
            );
        }

        let orderAmount = amount;

        // If bookingId is provided, this is a remaining payment — calculate amount server-side
        if (bookingId) {
            const bookingDoc = await db.collection("bookings").doc(bookingId).get();
            if (!bookingDoc.exists) {
                return NextResponse.json({ error: "Booking not found" }, { status: 404 });
            }

            const booking = bookingDoc.data();

            // Verify ownership
            if (booking?.email !== session.user.email) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            if (booking?.paymentStatus !== "partial") {
                return NextResponse.json(
                    { error: "This booking is already fully paid" },
                    { status: 400 }
                );
            }

            // Calculate remaining amount server-side to prevent tampering
            orderAmount = (booking?.amount || 0) - (booking?.amountPaid || 0);
        }

        if (!orderAmount || orderAmount < 1) {
            return NextResponse.json(
                { error: "Amount must be at least ₹1" },
                { status: 400 }
            );
        }

        // Verify trip exists
        const tripRef = db.collection("trips").doc(tripId);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        // Only check capacity for new bookings (not remaining payments)
        if (!bookingId) {
            const trip = tripDoc.data();
            const currentParticipants = trip?.currentParticipants || 0;
            const maxParticipants = trip?.maxParticipants || 0;

            if (maxParticipants > 0 && currentParticipants >= maxParticipants) {
                return NextResponse.json({ error: "Trip is fully booked" }, { status: 400 });
            }
        }

        // Create Razorpay order (amount must be in paise)
        const receiptPrefix = bookingId ? `remaining_${bookingId}` : `trip_${tripId}`;
        const order = await razorpay.orders.create({
            amount: Math.round(orderAmount * 100), // Convert to paise
            currency: "INR",
            receipt: `${receiptPrefix}_${Date.now()}`,
            notes: {
                tripId,
                userEmail: session.user.email,
                ...(bookingId && { bookingId, type: "remaining_payment" }),
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create order" },
            { status: 500 }
        );
    }
}
