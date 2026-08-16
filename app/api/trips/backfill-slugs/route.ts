import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { generateSlug } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/trips/backfill-slugs
// One-time endpoint to add slug fields to all existing trips that don't have one.
export async function POST(request: NextRequest) {
    try {
        // Only allow authenticated admin users
        const { userId } = await auth();
        const session = await getServerSession(authOptions);

        if (!userId && !session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const tripsSnapshot = await db.collection("trips").get();
        let updated = 0;
        let skipped = 0;
        const results: { id: string; title: string; slug: string }[] = [];

        for (const doc of tripsSnapshot.docs) {
            const data = doc.data();

            // Skip if slug already exists
            if (data.slug) {
                skipped++;
                continue;
            }

            if (!data.title) {
                skipped++;
                continue;
            }

            const slug = generateSlug(data.title);

            await doc.ref.update({ slug });
            updated++;
            results.push({
                id: doc.id,
                title: data.title,
                slug,
            });
        }

        return NextResponse.json({
            message: `Backfill complete. Updated: ${updated}, Skipped: ${skipped}`,
            updated,
            skipped,
            results,
        });
    } catch (error) {
        console.error("Error backfilling slugs:", error);
        return NextResponse.json(
            { error: "Failed to backfill slugs" },
            { status: 500 }
        );
    }
}
