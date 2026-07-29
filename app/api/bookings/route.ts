import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import { z } from "zod";
import { sendBookingConfirmationEmail } from "@/lib/email";

const bookingSchema = z.object({
    tripId: z.string().min(1, "Trip ID is required"),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    mobileNo: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    aadhaarNo: z.string().regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
    aadhaarImage: z.string().url("Valid Aadhaar image URL is required"),
    amount: z.number().positive("Amount must be positive"),
    amountPaid: z.number().nonnegative("Amount paid cannot be negative"),
    transportMode: z.enum(["3ac", "sleeper"]).optional(),
    // Razorpay payment fields
    razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
    razorpayOrderId: z.string().min(1, "Razorpay Order ID is required"),
    razorpaySignature: z.string().min(1, "Razorpay Signature is required"),
});

// POST /api/bookings - Create a new booking after successful Razorpay payment
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();

        if (!session || !session.user?.email || session.user.email !== body.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Validate request body
        const validationResult = bookingSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const bookingData = validationResult.data;

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
            .update(`${bookingData.razorpayOrderId}|${bookingData.razorpayPaymentId}`)
            .digest("hex");

        if (generatedSignature !== bookingData.razorpaySignature) {
            return NextResponse.json(
                { error: "Invalid payment signature. Payment verification failed." },
                { status: 400 }
            );
        }

        // Determine payment status based on amountPaid vs total amount
        const paymentStatus = bookingData.amountPaid >= bookingData.amount ? "paid" : "partial";

        // Verify trip exists and has capacity (inside transaction)
        const tripRef = db.collection("trips").doc(bookingData.tripId);
        const bookingRef = db.collection("bookings").doc();

        // Determine booking status based on payment
        const bookingStatus = paymentStatus === "paid" ? "confirmed" : "registrationConfirmed";

        const newBooking: Record<string, unknown> = {
            ...bookingData,
            paymentStatus,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: bookingStatus,
        };

        await db.runTransaction(async (t) => {
            const currentTripDoc = await t.get(tripRef);
            if (!currentTripDoc.exists) {
                throw new Error("Trip not found");
            }

            const currentTripData = currentTripDoc.data();
            const currentParticipants = currentTripData?.currentParticipants || 0;
            const maxParticipants = currentTripData?.maxParticipants || 0;

            if (maxParticipants > 0 && currentParticipants >= maxParticipants) {
                throw new Error("Trip is fully booked");
            }

            // Auto-assign seat number inside transaction to prevent race conditions
            if (paymentStatus === "paid") {
                const confirmedBookings = await t.get(
                    db.collection("bookings")
                        .where("tripId", "==", bookingData.tripId)
                        .where("status", "==", "confirmed")
                );
                newBooking.seatNumber = String(confirmedBookings.size + 1);
            }

            t.set(bookingRef, newBooking);
            t.update(tripRef, {
                currentParticipants: FieldValue.increment(1),
            });
        });

        // Send confirmation email — awaited so Vercel lambda doesn't kill it before it sends
        const tripDoc = await tripRef.get();
        const tripData = tripDoc.data();
        const formatDate = (dateStr: string) => {
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        };

        await sendBookingConfirmationEmail({
            email: bookingData.email,
            fullName: bookingData.fullName,
            tripName: tripData?.title || tripData?.name || "Your Trip",
            tripDestination: tripData?.destination,
            tripDates: tripData?.startDate && tripData?.endDate
                ? `${formatDate(tripData.startDate)} – ${formatDate(tripData.endDate)}`
                : undefined,
            amount: bookingData.amount,
            amountPaid: bookingData.amountPaid,
            status: bookingStatus as "registrationConfirmed" | "confirmed",
            seatNumber: newBooking.seatNumber as string | undefined,
            bookingId: bookingRef.id,
        }).catch((err) => console.error("[Booking Email] Failed to send:", err));

        return NextResponse.json(
            {
                message: "Booking created successfully",
                id: bookingRef.id,
                data: { id: bookingRef.id, ...newBooking },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create booking" },
            { status: 500 }
        );
    }
}
