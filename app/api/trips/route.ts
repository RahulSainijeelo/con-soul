import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
    createTripSchema,
    updateTripSchema,
    deleteTripSchema,
    listTripsSchema,
} from "@/lib/validations/trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth, currentUser } from '@clerk/nextjs/server';

// GET /api/trips - List all trips with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const queryResult = listTripsSchema.safeParse({
            category: searchParams.get("category") || undefined,
            status: searchParams.get("status") || undefined,
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "10",
            featured: searchParams.get("featured") || undefined,
        });

        if (!queryResult.success) {
            return NextResponse.json(
                { error: "Invalid query parameters" },
                { status: 400 }
            );
        }

        const { category, status, page, limit, featured } = queryResult.data;

        let query = db.collection("trips").orderBy("createdAt", "desc");

        // Apply category filter
        if (category) {
            query = query.where("category", "==", category);
        }

        if (status) {
            query = query.where("status", "==", status);
        }
        // Execute query
        const snapshot = await query.get();
        // Map documents to array with all fields including new ones
        const trips = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                destination: data.destination || "",
                category: data.category || "",
                description: data.description || "",
                content: data.content || "",
                images: data.images || [],
                status: data.status || "archived",
                startDate: data.startDate || "",
                endDate: data.endDate || "",
                price: data.price || 0,
                maxParticipants: data.maxParticipants || 0,
                difficulty: data.difficulty || "",
                duration: data.duration || "",
                included: data.included || [],
                notIncluded: data.notIncluded || [],
                mode: data.mode || "bus", // NEW
                price_3ac: data.price_3ac || 0, // NEW
                price_sleeper: data.price_sleeper || 0, // NEW
                featured: data.featured || false,
                rating: data.rating || 0,
                reviewCount: data.reviewCount || 0,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                currentParticipants: data.currentParticipants || 0,
            };
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTrips = trips.slice(startIndex, endIndex);

        return NextResponse.json({
            data: paginatedTrips,
            pagination: {
                page,
                limit,
                total: trips.length,
                totalPages: Math.ceil(trips.length / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json(
            { error: "Failed to fetch trips" },
            { status: 500 }
        );
    }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const {
            title,
            destination,
            category,
            description,
            content,
            images,
            status,
            startDate,
            endDate,
            price,
            maxParticipants,
            difficulty,
            duration,
            included,
            notIncluded,
            mode,
            price_3ac,
            price_sleeper,
        } = body;

        if (!title || !destination || !category) {
            return NextResponse.json(
                { error: "Title, destination, and category are required" },
                { status: 400 }
            );
        }

        const newTrip: Record<string, unknown> = {
            title,
            destination,
            category,
            description,
            content,
            images: images || [],
            status: status || "archived",
            startDate: startDate ? new Date(startDate).toISOString() : null,
            endDate: endDate ? new Date(endDate).toISOString() : null,
            price: price || 0,
            maxParticipants: maxParticipants || 0,
            difficulty: difficulty || "Moderate",
            duration: duration || "",
            included: included || [],
            notIncluded: notIncluded || [],
            mode: mode || "bus",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentParticipants: 0,
        };

        // Only add train pricing if mode is train
        if (mode === "train") {
            newTrip.price_3ac = price_3ac || 0;
            newTrip.price_sleeper = price_sleeper || 0;
        }

        const tripRef = await db.collection("trips").add(newTrip);

        return NextResponse.json(
            {
                message: "Trip created successfully",
                id: tripRef.id,
                data: { id: tripRef.id, ...newTrip },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating trip:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create trip" },
            { status: 500 }
        );
    }
}

// PUT /api/trips - Update an existing trip
export async function PUT(request: NextRequest) {
    try {
        // Check authentication
        const { isAuthenticated } = await auth();
        const user = await currentUser()
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }


        const body = await request.json();

        // Validate request body
        const validationResult = updateTripSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { id, ...updateData } = validationResult.data;

        // Check if trip exists
        const tripRef = db.collection("trips").doc(id);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json(
                { error: "Trip not found" },
                { status: 404 }
            );
        }

        // Update trip with timestamp
        const updatedTrip = {
            ...updateData,
            updatedAt: new Date().toISOString(),
        };

        await tripRef.update(updatedTrip);

        // Fetch updated document
        const updated = await tripRef.get();

        return NextResponse.json({
            message: "Trip updated successfully",
            data: { id: updated.id, ...updated.data() },
        });
    } catch (error) {
        console.error("Error updating trip:", error);
        return NextResponse.json(
            { error: "Failed to update trip" },
            { status: 500 }
        );
    }
}

// DELETE /api/trips - Delete a trip
export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate request body
        const validationResult = deleteTripSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { id } = validationResult.data;

        // Check if trip exists
        const tripRef = db.collection("trips").doc(id);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json(
                { error: "Trip not found" },
                { status: 404 }
            );
        }

        // Delete the trip
        await tripRef.delete();

        return NextResponse.json({
            message: "Trip deleted successfully",
            id,
        });
    } catch (error) {
        console.error("Error deleting trip:", error);
        return NextResponse.json(
            { error: "Failed to delete trip" },
            { status: 500 }
        );
    }
}
