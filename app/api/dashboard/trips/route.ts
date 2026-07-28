import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";

// GET /api/dashboard/trips - Get trips for dashboard (with auth check)
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");

        // Build Firestore query
        let query = db.collection("trips").orderBy("createdAt", "desc");

        // Apply filters if provided
        if (category && category !== "all") {
            query = query.where("category", "==", category) as any;
        }
        if (status && status !== "all") {
            query = query.where("status", "==", status) as any;
        }

        // Execute query
        const snapshot = await query.get();

        // Map documents to array
        const trips = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({
            data: trips,
            total: trips.length,
        });
    } catch (error) {
        console.error("Error fetching dashboard trips:", error);
        return NextResponse.json(
            { error: "Failed to fetch trips" },
            { status: 500 }
        );
    }
}
