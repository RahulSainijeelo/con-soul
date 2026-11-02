import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";

// POST: Reject an ambassador application
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminNotes, reviewedBy } = await req.json();

    // 1. Get the application document
    const applicationRef = db.collection("ambassadorApplications").doc(id);
    const applicationDoc = await applicationRef.get();

    if (!applicationDoc.exists) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const applicationData = applicationDoc.data();
    const now = new Date().toISOString();

    // 2. Update the application document
    await applicationRef.update({
      status: "rejected",
      reviewedAt: now,
      reviewedBy: reviewedBy || "admin",
      adminNotes: adminNotes || "",
    });

    // 3. Update the user document
    const userId = applicationData?.userId;
    if (userId) {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        await userRef.update({
          ambassadorStatus: "rejected",
        });
      }
    }

    return NextResponse.json(
      { message: "Application rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting ambassador application:", error);
    return NextResponse.json(
      { error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
