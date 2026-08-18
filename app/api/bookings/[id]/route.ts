import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FieldValue } from "firebase-admin/firestore";
import { auth } from "@clerk/nextjs/server";

// GET /api/bookings/[id] - Get single booking details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const bookingDoc = await db.collection("bookings").doc(id).get();

        if (!bookingDoc.exists) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ id: bookingDoc.id, ...bookingDoc.data() });
    } catch (error) {
        console.error("Error fetching booking:", error);
        return NextResponse.json(
            { error: "Failed to fetch booking" },
            { status: 500 }
        );
    }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status, seatNumber } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const bookingRef = db.collection("bookings").doc(id);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const bookingData = bookingDoc.data();
        const oldStatus = bookingData?.status;
        const tripId = bookingData?.tripId;

        // If status is changing to rejected, decrement participant count
        if (status === 'rejected' && oldStatus !== 'rejected') {
            const tripRef = db.collection("trips").doc(tripId);
            await tripRef.update({
                currentParticipants: FieldValue.increment(-1)
            });
        }

        // If status was rejected and changing to pending/confirmed, increment (check capacity first?)
        // For now assuming admin overrides or handles capacity manually if re-opening a rejected booking.
        if (oldStatus === 'rejected' && status !== 'rejected') {
            const tripRef = db.collection("trips").doc(tripId);
            await tripRef.update({
                currentParticipants: FieldValue.increment(1)
            });
        }

        const updates: any = {
            status,
            updatedAt: new Date().toISOString()
        };

        if (seatNumber) {
            updates.seatNumber = seatNumber;
        }

        await bookingRef.update(updates);

        return NextResponse.json({
            message: "Booking updated successfully",
            data: { id, ...updates }
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json(
            { error: "Failed to update booking" },
            { status: 500 }
        );
    }
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const bookingRef = db.collection("bookings").doc(id);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const bookingData = bookingDoc.data();
        const tripId = bookingData?.tripId;
        const status = bookingData?.status;

        // If booking was not already rejected, decrement participant count
        if (tripId && status !== 'rejected') {
            const tripRef = db.collection("trips").doc(tripId);
            await tripRef.update({
                currentParticipants: FieldValue.increment(-1)
            });
        }

        await bookingRef.delete();

        return NextResponse.json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        return NextResponse.json(
            { error: "Failed to delete booking" },
            { status: 500 }
        );
    }
}
