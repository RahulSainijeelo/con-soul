import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { sendTripSuggestionEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import { z } from "zod";

const tripSuggestionSchema = z.object({
    destination: z.string().min(2, "Destination is required").max(100),
    name: z.string().trim().min(2, "Please enter your name").max(100),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
        .string()
        .trim()
        .max(20, "Phone number is too long")
        .optional()
        .default(""),
    suggestion: z
        .string()
        .trim()
        .min(5, "Please share a short trip suggestion (at least 5 characters)")
        .max(2000, "Suggestion is too long"),
});

// POST /api/trip-suggestions — Save a traveler's destination trip suggestion and notify CONSOUL team via email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = tripSuggestionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0]?.message || "Please fill all required fields cleanly." },
                { status: 400 }
            );
        }

        const { destination, name, phone, suggestion } = parsed.data;
        const normalizedEmail = parsed.data.email.toLowerCase();
        const now = new Date().toISOString();
        const suggestionId = nanoid(8);

        // Save in dedicated trip_suggestions collection AND mirror to admin enquiries for dashboard visibility
        await Promise.all([
            db.collection("trip_suggestions").add({
                id: suggestionId,
                destination,
                name,
                email: normalizedEmail,
                phone: phone || null,
                suggestion,
                status: "new",
                source: `explore_india_${destination.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
                createdAt: now,
            }),
            db.collection("enquiries").add({
                id: suggestionId,
                name,
                email: normalizedEmail,
                mobile: phone || "Not provided",
                serviceType: `Trip Request: ${destination}`,
                message: `Destination: ${destination}\nEmail: ${normalizedEmail}\n\nSuggestion:\n${suggestion}`,
                time: now,
                status: "new",
            }),
        ]);

        // Notify CONSOUL team inbox via Nodemailer
        let emailSent = false;
        try {
            const mailResult = await sendTripSuggestionEmail({
                destination,
                name,
                email: normalizedEmail,
                phone,
                suggestion,
                suggestionId,
            });
            emailSent = mailResult.sent;
        } catch (emailError) {
            console.error("Failed to send trip suggestion notification email:", emailError);
        }

        return NextResponse.json(
            {
                message: `Thanks ${name}! Your ${destination} trip suggestion has been sent to the CONSOUL team.`,
                suggestionId,
                emailSent,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Trip suggestion error:", error);
        return NextResponse.json(
            { error: "Something went wrong while sending your suggestion. Please try again." },
            { status: 500 }
        );
    }
}
