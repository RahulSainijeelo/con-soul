import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { auth } from "@clerk/nextjs/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTrainTicketEmail } from "@/lib/email";

interface SeatAllotment {
    bookingId: string;
    seatNumber: string;
    name: string;
    age: number;
}

// POST /api/bookings/allot-seats — Allot seats from parsed ticket and send emails
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { tripId, allotments } = body as {
            tripId: string;
            allotments: SeatAllotment[];
        };

        if (!tripId || !allotments || allotments.length === 0) {
            return NextResponse.json(
                { error: "tripId and allotments array are required" },
                { status: 400 }
            );
        }

        // Fetch trip details for email
        const tripDoc = await db.collection("trips").doc(tripId).get();
        if (!tripDoc.exists) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }
        const trip = tripDoc.data()!;
        const tripName = trip.title || "Trip";
        const tripDestination = trip.destination || "";

        const results: { bookingId: string; status: string; error?: string }[] = [];

        // Process each allotment
        for (const allotment of allotments) {
            try {
                const bookingRef = db.collection("bookings").doc(allotment.bookingId);
                const bookingDoc = await bookingRef.get();

                if (!bookingDoc.exists) {
                    results.push({
                        bookingId: allotment.bookingId,
                        status: "error",
                        error: "Booking not found",
                    });
                    continue;
                }

                const booking = bookingDoc.data()!;

                // Update seat number and confirm
                await bookingRef.update({
                    seatNumber: allotment.seatNumber,
                    status: "confirmed",
                    updatedAt: new Date().toISOString(),
                });

                // Send train ticket email
                await sendTrainTicketEmail({
                    email: booking.email,
                    tripName,
                    tripDestination,
                    passengerName: allotment.name,
                    passengerAge: allotment.age,
                    seatNumber: allotment.seatNumber,
                });

                results.push({ bookingId: allotment.bookingId, status: "success" });
            } catch (err: unknown) {
                results.push({
                    bookingId: allotment.bookingId,
                    status: "error",
                    error: err instanceof Error ? err.message : "Unknown error",
                });
            }
        }

        const successCount = results.filter((r) => r.status === "success").length;
        const errorCount = results.filter((r) => r.status === "error").length;

        return NextResponse.json({
            message: `${successCount} seats allotted, ${errorCount} errors`,
            results,
        });
    } catch (error: unknown) {
        console.error("Error allotting seats:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to allot seats" },
            { status: 500 }
        );
    }
}
