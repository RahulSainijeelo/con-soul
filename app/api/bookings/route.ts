import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { bookingSchema } from "@/lib/validations/booking";
import { auth, currentUser } from '@clerk/nextjs/server';
import { FieldValue } from "firebase-admin/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();

        // Validate request body
        const validationResult = bookingSchema.safeParse(body);

        if (!session || !session.user?.email || session.user.email !== body.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
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

        // Verify trip exists and has capacity
        const tripRef = db.collection("trips").doc(bookingData.tripId);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json(
                { error: "Trip not found" },
                { status: 404 }
            );
        }

        const trip = tripDoc.data();
        const currentParticipants = trip?.currentParticipants || 0;
        const maxParticipants = trip?.maxParticipants || 0;

        if (maxParticipants > 0 && currentParticipants >= maxParticipants) {
            return NextResponse.json(
                { error: "Trip is fully booked" },
                { status: 400 }
            );
        }

        // Add metadata
        const newBooking = {
            ...bookingData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "pending", // Default status
        };

        // Save to Firestore
        // Use a transaction to ensure atomicity (booking + participant count update)
        const bookingRef = db.collection("bookings").doc();

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

            t.set(bookingRef, newBooking);
            t.update(tripRef, {
                currentParticipants: FieldValue.increment(1)
            });
        });

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
