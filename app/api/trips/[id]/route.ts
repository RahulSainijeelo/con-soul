import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { auth } from "@clerk/nextjs/server";

// GET /api/trips/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Trip ID is required" },
                { status: 400 }
            );
        }

        const tripRef = db.collection("trips").doc(id);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json(
                { error: "Trip not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: tripDoc.id,
            ...tripDoc.data(),
        });
    } catch (error) {
        console.error("Error fetching trip:", error);
        return NextResponse.json(
            { error: "Failed to fetch trip" },
            { status: 500 }
        );
    }
}

// PUT /api/trips/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Trip ID is required" },
                { status: 400 }
            );
        }

        const tripRef = db.collection("trips").doc(id);
        const tripDoc = await tripRef.get();

        if (!tripDoc.exists) {
            return NextResponse.json(
                { error: "Trip not found" },
                { status: 404 }
            );
        }

        const existingData = tripDoc.data() || {};

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

        const updateData: Record<string, unknown> = {
            title: title || existingData.title,
            destination: destination || existingData.destination,
            category: category || existingData.category,
            description: description !== undefined ? description : existingData.description,
            content: content !== undefined ? content : existingData.content,
            images: images !== undefined ? images : existingData.images,
            status: status || existingData.status,
            startDate: startDate
                ? new Date(startDate).toISOString()
                : existingData.startDate,
            endDate: endDate
                ? new Date(endDate).toISOString()
                : existingData.endDate,
            price: price !== undefined ? price : existingData.price,
            maxParticipants: maxParticipants !== undefined ? maxParticipants : existingData.maxParticipants,
            difficulty: difficulty || existingData.difficulty,
            duration: duration || existingData.duration,
            included: included !== undefined ? included : existingData.included,
            notIncluded: notIncluded !== undefined ? notIncluded : existingData.notIncluded,
            mode: mode || existingData.mode,
            updatedAt: new Date().toISOString(),
        };

        // Only include train pricing if mode is train
        if (mode === "train") {
            updateData.price_3ac = price_3ac !== undefined ? price_3ac : existingData.price_3ac;
            updateData.price_sleeper = price_sleeper !== undefined ? price_sleeper : existingData.price_sleeper;
        }

        await tripRef.update(updateData);

        return NextResponse.json(
            {
                message: "Trip updated successfully",
                id,
                data: { id, ...updateData },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating trip:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to update trip"
            },
            { status: 500 }
        );
    }
}
