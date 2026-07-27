import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

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

        // Update booking to fully paid
        const totalAmount = booking?.amount || 0;
        await bookingRef.update({
            amountPaid: totalAmount,
            paymentStatus: "paid",
            remainingRazorpayPaymentId: razorpayPaymentId,
            remainingRazorpayOrderId: razorpayOrderId,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: "Remaining payment processed successfully",
            data: {
                id,
                amountPaid: totalAmount,
                paymentStatus: "paid",
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
