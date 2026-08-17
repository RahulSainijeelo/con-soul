import { z } from "zod";
import { db } from "@/config/firebase"; // Admin SDK
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
// Allowed status values
const statusEnum = z.enum(["new", "contacted", "completed", "rejected"]);

// Zod schema for validation
const enquirySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  serviceType: z.string(),
  message: z.string().min(5, "Message must be at least 5 characters"),
  time: z.string(),
  status: statusEnum,
});

// GET: Fetch all enquiries
export async function GET() {
  try {
    const { userId } = await auth();
    const session = await getServerSession(authOptions);
    if (!userId && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const snapshot = await db
      .collection("enquiries")
      .orderBy("time", "desc")
      .get();
    const data = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// POST: Add a new enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = nanoid(7);
    const data = enquirySchema.parse({
      ...body,
      id,
      time: new Date().toISOString(),
      status: "new",
    });

    await db.collection("enquiries").add(data);

    return NextResponse.json(
      { message: "Enquiry submitted successfully", requestNumber: id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? JSON.stringify(error.errors)
            : "Internal Server Error",
      },
      { status: 400 }
    );
  }
}

// PUT: Update an enquiry (expects id in body)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    const session = await getServerSession(authOptions);
    if (!userId && !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id)
      return NextResponse.json(
        { error: "Missing enquiry id" },
        { status: 400 }
      );

    if (rest.status && !statusEnum.options.includes(rest.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Find the document where the 'id' field matches
    const snapshot = await db
      .collection("enquiries")
      .where("id", "==", id)
      .get();
    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    // Update all matching documents (should be only one)
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, rest);
    });
    await batch.commit();

    return NextResponse.json(
      { message: "Enquiry updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? JSON.stringify(error.errors)
            : "Internal Server Error",
      },
      { status: 400 }
    );
  }
}
