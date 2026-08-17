import { z } from "zod";
import { db } from "@/config/firebase"; // Use your admin SDK config
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  enquiryId: z.string().optional(),
  tripId: z.string().optional(),
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");

    // Check if requester is an admin (has Clerk or NextAuth session)
    const { userId } = await auth();
    const session = await getServerSession(authOptions);
    const isAdmin = !!(userId || session);

    let query: FirebaseFirestore.Query = db.collection("reviews");

    if (tripId) {
      query = query.where("tripId", "==", tripId);
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc: any) => {
      const docData = doc.data();

      // Admin gets full data; public only gets name + review content
      if (isAdmin) {
        return { id: doc.id, ...docData };
      }

      // Public response — strip sensitive fields
      return {
        id: doc.id,
        tripId: docData.tripId,
        userName: docData.name || docData.userName || "Anonymous",
        userImage: docData.userImage || null,
        rating: docData.rating,
        comment: docData.comment,
        images: docData.images || [],
        vibeTags: docData.vibeTags || [],
        squadChemistry: docData.squadChemistry,
        consoulHost: docData.consoulHost,
        tripVibe: docData.tripVibe,
        certifiedHighlight: docData.certifiedHighlight,
        personalityBadge: docData.personalityBadge,
        fomoScore: docData.fomoScore,
        likes: docData.likes || 0,
        status: docData.status,
        createdAt: docData.createdAt,
        type: docData.type,
      };
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const data = reviewSchema.parse(body);

    // 1. Authenticated Trip Review
    if (session && session.user && data.tripId) {
      // Check if user has a confirmed booking for this trip
      const bookingsSnapshot = await db.collection("bookings")
        .where("email", "==", session.user.email)
        .where("tripId", "==", data.tripId)
        .where("status", "in", ["confirmed", "registrationConfirmed"])
        .get();

      if (bookingsSnapshot.empty) {
        return NextResponse.json(
          { message: "You can only review trips you have confirmed bookings for." },
          { status: 403 }
        );
      }

      await db.collection("reviews").add({
        tripId: data.tripId,
        email: session.user.email,
        userName: session.user.name || data.name || "Anonymous",
        userImage: session.user.image || null,
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
        type: "trip_review"
      });

      return NextResponse.json(
        { message: "Review submitted successfully and is pending approval." },
        { status: 200 }
      );

    } else if (data.tripId) {
      // 2. Trip Review (Guest/Past Trip) - Replaces Enquiry Flow
      if (!data.name || !data.email) {
        return NextResponse.json(
          { message: "Name and email are required for guest reviews." },
          { status: 400 }
        );
      }

      const tripSnapshot = await db.collection("trips").doc(data.tripId).get();

      if (!tripSnapshot.exists) {
        return NextResponse.json(
          { message: "Trip not found" },
          { status: 404 }
        );
      }

      const tripData = tripSnapshot.data();
      if (tripData?.completed !== true) {
        return NextResponse.json(
          { message: "Trip is not completed yet" },
          { status: 400 }
        );
      }

      await db.collection("reviews").add({
        tripId: data.tripId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
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
        type: "trip_review"
      });

      return NextResponse.json(
        { message: "Review submitted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid request. Provide tripId (for auth users) or enquiryId." },
      { status: 400 }
    );

  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      {
        err:
          error instanceof z.ZodError
            ? JSON.stringify(error.errors)
            : "Internal Server Error",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    const session = await getServerSession(authOptions);
    if (!userId && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );

    await db.collection("reviews").doc(id).delete();

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      {
        status: 400,
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    const session = await getServerSession(authOptions);
    if (!userId && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id, status } = await request.json();
    if (!id || !["pending", "approved", "rejected"].includes(status))
      return NextResponse.json(
        { error: "Invalid id or status" },
        { status: 400 }
      );
    const reviews = await db.collection("reviews").doc(id).get();
    if (reviews.exists === false) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Update all matching documents (should be only one)
    await db.collection("reviews").doc(id).update({ status });
    return NextResponse.json(
      { message: "Review status updated" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 400 }
    );
  }
}
