import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { z } from "zod";

const waitlistSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

// POST /api/waitlist - Subscribe to waitlist
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = waitlistSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0]?.message || "Invalid email" },
                { status: 400 }
            );
        }

        const { email } = result.data;
        const normalizedEmail = email.toLowerCase().trim();

        // Check for duplicate
        const existing = await db
            .collection("waitlist")
            .where("email", "==", normalizedEmail)
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json(
                { message: "You're already on the waitlist!" },
                { status: 409 }
            );
        }

        // Store in Firestore
        await db.collection("waitlist").add({
            email: normalizedEmail,
            createdAt: new Date().toISOString(),
            source: "hero",
        });

        return NextResponse.json(
            { message: "You're on the list! We'll notify you when new trips drop." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Waitlist subscription error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
