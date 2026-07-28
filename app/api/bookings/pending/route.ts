import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";

// GET /api/bookings/pending - Get all pending bookings (Admin only)
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookingsRef = db.collection("bookings");
        const snapshot = await bookingsRef.where("status", "==", "pending").orderBy("createdAt", "desc").get();

        const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fetch trip details for each booking to show trip title
        const tripIds = [...new Set(bookings.map((b: any) => b.tripId))];
        const tripsMap = new Map();

        if (tripIds.length > 0) {
            // Chunking for 'in' query limit (30)
            const chunkSize = 30;
            const chunks = [];
            for (let i = 0; i < tripIds.length; i += chunkSize) {
                chunks.push(tripIds.slice(i, i + chunkSize));
            }

            const { FieldPath } = require("firebase-admin/firestore");

            await Promise.all(chunks.map(async (chunk) => {
                const tripsSnapshot = await db.collection("trips")
                    .where(FieldPath.documentId(), "in", chunk)
                    .get();

                tripsSnapshot.forEach(doc => {
                    tripsMap.set(doc.id, doc.data());
                });
            }));
        }

        const enrichedBookings = bookings.map((booking: any) => ({
            ...booking,
            tripTitle: tripsMap.get(booking.tripId)?.title || "Unknown Trip"
        }));

        return NextResponse.json(enrichedBookings);
    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch pending bookings" },
            { status: 500 }
        );
    }
}
