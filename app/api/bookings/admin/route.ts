import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { FieldValue } from "firebase-admin/firestore";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { formatDateIN } from "@/lib/utils";

// POST /api/bookings/admin — Admin creates a booking without Razorpay
export async function POST(request: NextRequest) {
    try {
        // Admin auth check
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            tripId,
            fullName,
            email,
            mobileNo,
            aadhaarNo,
            aadhaarImage,
            transportMode,
            amountPaid = 0,
            paymentMethod,
            reference,
            note,
        } = body;

        // Validate required fields
        if (!tripId || !fullName || !email || !mobileNo) {
            return NextResponse.json(
                { error: "tripId, fullName, email, and mobileNo are required" },
                { status: 400 }
            );
        }

        // Fetch trip to get price and check capacity
        const tripRef = db.collection("trips").doc(tripId);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        const trip = tripDoc.data()!;
        const maxParticipants = trip.maxParticipants || 0;
        const currentParticipants = trip.currentParticipants || 0;

        if (maxParticipants > 0 && currentParticipants >= maxParticipants) {
            return NextResponse.json(
                { error: "Trip is full. No more spots available." },
                { status: 400 }
            );
        }

        // Calculate total amount based on transport mode
        let totalAmount = trip.price || 0;
        if (transportMode === "3ac" && trip.price_3ac) {
            totalAmount = trip.price_3ac;
        } else if (transportMode === "sleeper" && trip.price_sleeper) {
            totalAmount = trip.price_sleeper;
        }

        // Determine payment and booking status
        const isFullyPaid = amountPaid >= totalAmount;
        const hasPayment = amountPaid > 0;

        let paymentStatus: string;
        let bookingStatus: string;

        if (isFullyPaid) {
            paymentStatus = "paid";
            bookingStatus = "confirmed";
        } else if (hasPayment) {
            paymentStatus = "partial";
            bookingStatus = "registrationConfirmed";
        } else {
            paymentStatus = "unpaid";
            bookingStatus = "admin_registered";
        }

        // Build payment history
        const paymentHistory: Record<string, unknown>[] = [];
        if (hasPayment) {
            paymentHistory.push({
                amount: amountPaid,
                method: paymentMethod || "cash",
                date: new Date().toISOString(),
                recordedBy: "admin",
                ...(reference && { reference }),
                ...(note && { note }),
            });
        }

        const now = new Date().toISOString();
        const bookingData: Record<string, unknown> = {
            tripId,
            fullName,
            email: email.toLowerCase().trim(),
            mobileNo,
            aadhaarNo: aadhaarNo || "",
            aadhaarImage: aadhaarImage || "",
            transportMode: transportMode || "",
            amount: totalAmount,
            amountPaid,
            paymentStatus,
            status: bookingStatus,
            paymentHistory,
            createdBy: "admin",
            adminNote: note || "",
            createdAt: now,
            updatedAt: now,
        };

        // Create booking and increment participants in a transaction
        const bookingId = await db.runTransaction(async (transaction) => {
            // Re-check capacity inside transaction
            const freshTrip = await transaction.get(tripRef);
            const freshCurrent = freshTrip.data()?.currentParticipants || 0;

            if (maxParticipants > 0 && freshCurrent >= maxParticipants) {
                throw new Error("Trip is full. No more spots available.");
            }

            // Auto-assign seat number inside transaction if fully paid
            if (paymentStatus === "paid") {
                const confirmedBookings = await transaction.get(
                    db.collection("bookings")
                        .where("tripId", "==", tripId)
                        .where("status", "==", "confirmed")
                );
                bookingData.seatNumber = String(confirmedBookings.size + 1);
            }

            const newBookingRef = db.collection("bookings").doc();
            transaction.set(newBookingRef, bookingData);
            transaction.update(tripRef, {
                currentParticipants: FieldValue.increment(1),
            });

            return newBookingRef.id;
        });

        // Send confirmation email — awaited so Vercel lambda doesn't kill it before it sends
        await sendBookingConfirmationEmail({
            email: bookingData.email as string,
            fullName: bookingData.fullName as string,
            tripName: trip.title || trip.name || "Your Trip",
            tripDestination: trip.destination,
            tripDates: trip.startDate && trip.endDate
                ? `${formatDateIN(trip.startDate)} – ${formatDateIN(trip.endDate)}`
                : undefined,
            amount: totalAmount,
            amountPaid: amountPaid,
            status: (bookingStatus === "confirmed" ? "confirmed" : "registrationConfirmed"),
            seatNumber: bookingData.seatNumber as string | undefined,
            bookingId: bookingId,
        }).catch((err) => console.error("[Admin Booking Email] Failed to send:", err));

        return NextResponse.json({
            message: "Booking created successfully",
            data: {
                id: bookingId,
                ...bookingData,
            },
        }, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating admin booking:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create booking" },
            { status: 500 }
        );
    }
}
