import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Query } from "firebase-admin/firestore";

// GET /api/user/bookings - Get user's bookings
export async function GET(request: NextRequest) {
    try {
        // Check NextAuth authentication
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // 'upcoming' or 'past'
        const tripId = searchParams.get("tripId"); // Filter by specific trip
        const status = searchParams.get("status"); // Filter by booking status
        const checkOnly = searchParams.get("checkOnly") === "true"; // Return minimal data

        // Build query
        let bookingsQuery: Query = db.collection("bookings")
            .where("email", "==", session.user.email);

        // Filter by tripId if provided
        if (tripId) {
            bookingsQuery = bookingsQuery.where("tripId", "==", tripId);
        }

        // Filter by status if provided
        if (status) {
            bookingsQuery = bookingsQuery.where("status", "==", status);
        }

        // Order by creation date
        bookingsQuery = bookingsQuery.orderBy("createdAt", "desc");

        const bookingsSnapshot = await bookingsQuery.get();

        // Get all trip IDs from bookings
        const bookings = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If checking only for existence (lightweight response)
        if (checkOnly) {
            if (bookings.length === 0) {
                return NextResponse.json({
                    exists: false,
                    booking: null
                });
            }

            // Return first booking without trip details
            return NextResponse.json({
                exists: true,
                booking: {
                    id: bookings[0].id,
                    status: (bookings[0] as any).status,
                    tripId: (bookings[0] as any).tripId,
                    createdAt: (bookings[0] as any).createdAt
                }
            });
        }

        // Full response with trip details
        if (bookings.length === 0) {
            return NextResponse.json({
                data: [],
                type: type || 'all',
                count: 0
            });
        }

        // Fetch trip details for each booking
        const tripIds = [...new Set(bookings.map((b: any) => b.tripId))];
        const tripsPromises = tripIds.map(id =>
            db.collection("trips").doc(id as string).get()
        );

        const tripsSnapshots = await Promise.all(tripsPromises);
        const tripsMap = new Map();

        tripsSnapshots.forEach((doc) => {
            if (doc.exists) {
                tripsMap.set(doc.id, { id: doc.id, ...doc.data() });
            }
        });

        // Combine bookings with trip data
        const today = new Date().toISOString().split('T')[0];
        let enrichedBookings = bookings.map((booking: any) => {
            const trip = tripsMap.get(booking.tripId);
            return {
                ...booking,
                trip: trip || null
            };
        }).filter((booking: any) => booking.trip !== null);

        // Filter by type if specified (and not already filtered by tripId)
        if (!tripId) {
            if (type === 'upcoming') {
                enrichedBookings = enrichedBookings.filter((booking: any) =>
                    booking.trip.completed === false
                );
            } else if (type === 'past') {
                enrichedBookings = enrichedBookings.filter((booking: any) =>
                    booking.trip.completed === true
                );
            }
        }

        return NextResponse.json({
            data: enrichedBookings,
            type: type || 'all',
            count: enrichedBookings.length
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
