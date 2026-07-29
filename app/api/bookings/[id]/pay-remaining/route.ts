import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import { sendBookingConfirmationEmail } from "@/lib/email";

// POST /api/bookings/[id]/pay-remaining - Process remaining payment for a partial booking
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            return NextResponse.json(
                { error: "Missing payment fields" },
                { status: 400 }
            );
        }

        // Fetch booking
        const bookingRef = db.collection("bookings").doc(id);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const booking = bookingDoc.data();

        // Verify this booking belongs to the logged-in user
        if (booking?.email !== session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify booking is in partial payment state
        if (booking?.paymentStatus !== "partial") {
            return NextResponse.json(
                { error: "This booking is already fully paid" },
                { status: 400 }
            );
        }

        // Verify Razorpay payment signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            console.error("RAZORPAY_KEY_SECRET is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const generatedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");

        if (generatedSignature !== razorpaySignature) {
            return NextResponse.json(
                { error: "Invalid payment signature. Payment verification failed." },
                { status: 400 }
            );
        }

        // Update booking to fully paid + auto-confirm + auto-assign seat (inside transaction)
        const totalAmount = booking?.amount || 0;
        const tripId = booking?.tripId;

        let seatNumber: string = "";

        await db.runTransaction(async (t) => {
            // Get next seat number inside transaction to prevent race conditions
            const confirmedBookings = await t.get(
                db.collection("bookings")
                    .where("tripId", "==", tripId)
                    .where("status", "==", "confirmed")
            );
            seatNumber = String(confirmedBookings.size + 1);

            t.update(bookingRef, {
                amountPaid: totalAmount,
                paymentStatus: "paid",
                status: "confirmed",
                seatNumber,
                remainingRazorpayPaymentId: razorpayPaymentId,
                remainingRazorpayOrderId: razorpayOrderId,
                updatedAt: new Date().toISOString(),
            });
        });

        // Send booking confirmed email — awaited so Vercel lambda doesn't kill it before it sends
        const tripRef2 = db.collection("trips").doc(tripId);
        const tripDoc = await tripRef2.get();
        const tripData = tripDoc.data();
        const formatDate = (dateStr: string) => {
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        };

        await sendBookingConfirmationEmail({
            email: booking?.email,
            fullName: booking?.fullName,
            tripName: tripData?.title || tripData?.name || "Your Trip",
            tripDestination: tripData?.destination,
            tripDates: tripData?.startDate && tripData?.endDate
                ? `${formatDate(tripData.startDate)} – ${formatDate(tripData.endDate)}`
                : undefined,
            amount: totalAmount,
            amountPaid: totalAmount,
            status: "confirmed",
            seatNumber,
            bookingId: id,
        }).catch((err) => console.error("[Pay-Remaining Email] Failed to send:", err));

        return NextResponse.json({
            success: true,
            message: "Remaining payment processed successfully",
            data: {
                id,
                amountPaid: totalAmount,
                paymentStatus: "paid",
                status: "confirmed",
                seatNumber,
            },
        });
    } catch (error) {
        console.error("Error processing remaining payment:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to process payment" },
            { status: 500 }
        );
    }
}
