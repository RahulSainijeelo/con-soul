import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  photo: z.string().url("Invalid URL format").optional().or(z.literal("")),
  phoneNumbers: z.array(z.string()).optional().default([]),
  email: z.string().email("Invalid email format"),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  experience: z.string().optional(),
  workingHours: z.string().optional(),
  description: z.string().optional(),
  bankName: z.string().optional(),
  accountNo: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
  upiQrCode: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

const PROFILE_DOC_ID = "main"; // single profile document

export async function GET() {
  try {
    const doc = await db.collection("profile").doc(PROFILE_DOC_ID).get();
    if (!doc.exists) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(doc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = profileSchema.parse(body);
    await db
      .collection("profile")
      .doc(PROFILE_DOC_ID)
      .set(data, { merge: true });
    return NextResponse.json({ message: "Profile updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 400 }
    );
  }
}
