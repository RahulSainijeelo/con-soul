import { z } from "zod";
import { db } from "@/config/firebase";
import { NextRequest, NextResponse } from "next/server";

const inviteReviewSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  images: z.array(z.string()).optional(),
  vibeTags: z.array(z.string()).optional(),
  squadChemistry: z.number().min(0).max(5).optional(),
  consoulHost: z.number().min(0).max(5).optional(),
  tripVibe: z.number().min(0).max(5).optional(),
  certifiedHighlight: z.string().max(100).optional(),
  personalityBadge: z.string().optional(),
  fomoScore: z.string().optional(),
  honestTake: z.string().max(120).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = inviteReviewSchema.parse(body);

    // 1. Verify trip exists
    const tripSnapshot = await db.collection("trips").doc(data.tripId).get();
    if (!tripSnapshot.exists) {
      return NextResponse.json(
        { message: "Trip not found. The invite link may be invalid." },
        { status: 404 }
      );
    }

    // 2. Prevent duplicate reviews (same email + same trip)
    const existingReview = await db.collection("reviews")
      .where("email", "==", data.email)
      .where("tripId", "==", data.tripId)
      .get();

    if (!existingReview.empty) {
      return NextResponse.json(
        { message: "You have already submitted a review for this trip." },
        { status: 400 }
      );
    }

    // 3. Save review as pending
    await db.collection("reviews").add({
      tripId: data.tripId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      rating: data.rating,
      comment: data.comment,
      images: data.images || [],
      vibeTags: data.vibeTags || [],
      squadChemistry: data.squadChemistry,
      consoulHost: data.consoulHost,
      tripVibe: data.tripVibe,
      certifiedHighlight: data.certifiedHighlight,
      personalityBadge: data.personalityBadge,
      fomoScore: data.fomoScore,
      honestTake: data.honestTake,
      likes: 0,
      status: "pending",
      createdAt: new Date().toISOString(),
      type: "invite_review"
    });

    return NextResponse.json(
      { message: "Review submitted successfully and is pending approval." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error submitting invite review:", error);
    return NextResponse.json(
      {
        message: "Failed to submit review.",
        err: error instanceof z.ZodError ? JSON.stringify(error.errors) : "Internal Server Error",
      },
      { status: 400 }
    );
  }
}
