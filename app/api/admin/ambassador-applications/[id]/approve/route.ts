import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";

// POST: Approve an ambassador application
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reviewedBy } = await req.json();

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

    // 2. Generate promo code from preferred code or auto-generate
    const preferredCode = applicationData?.preferredPromoCode;
    let promoCode = preferredCode
      ? preferredCode.toUpperCase().replace(/[^A-Z0-9]/g, "")
      : `AMB${Date.now().toString(36).toUpperCase()}`;

    // Check if promo code already exists
    const existingCode = await db
      .collection("promoCodes")
      .where("code", "==", promoCode)
      .get();

    if (!existingCode.empty) {
      // Append random suffix if code already taken
      promoCode = `${promoCode}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    }

    const now = new Date().toISOString();

    // 3. Update the application document
    await applicationRef.update({
      status: "approved",
      reviewedAt: now,
      reviewedBy: reviewedBy || "admin",
      assignedPromoCode: promoCode,
    });

    // 4. Update the user document
    const userId = applicationData?.userId;
    if (userId) {
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        role: "ambassador",
        ambassadorStatus: "approved",
        promoCode: promoCode,
        roleUpdatedAt: now,
      });
    }

    // 5. Create ambassador profile document
    await db.collection("ambassadorProfiles").doc(userId || id).set({
      userId: userId || null,
      applicationId: id,
      name: applicationData?.name || "",
      email: applicationData?.email || "",
      college: applicationData?.college || "",
      phone: applicationData?.phone || "",
      promoCode: promoCode,
      approvedAt: now,
      stats: {
        totalReferrals: 0,
        totalBookings: 0,
        totalEarnings: 0,
        activeMonth: new Date().toISOString().slice(0, 7),
      },
      status: "active",
    });

    // 6. Store promo code in promoCodes collection
    await db.collection("promoCodes").add({
      code: promoCode,
      type: "ambassador",
      ambassadorId: userId || id,
      discountPercent: 5,
      usageCount: 0,
      isActive: true,
      createdAt: now,
    });

    return NextResponse.json(
      {
        message: "Application approved successfully",
        promoCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving ambassador application:", error);
    return NextResponse.json(
      { error: "Failed to approve application" },
      { status: 500 }
    );
  }
}
