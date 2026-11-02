import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";

const ADMIN_ROLES = ["super_admin", "trip_manager", "ambassador_coordinator", "support", "ambassador"];

// GET: List all users with admin roles
export async function GET() {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("role", "in", ADMIN_ROLES).get();

    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin members:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin members" },
      { status: 500 }
    );
  }
}

// POST: Grant admin access — update a user's role by email
export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${ADMIN_ROLES.join(", ")}` },
        { status: 400 }
      );
    }

    // Find user by email
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email.toLowerCase().trim()).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No user found with that email address" },
        { status: 404 }
      );
    }

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      role,
      roleUpdatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: `Role updated to "${role}" for ${email}`,
        user: { id: userDoc.id, ...userDoc.data(), role },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error granting admin access:", error);
    return NextResponse.json(
      { error: "Failed to grant admin access" },
      { status: 500 }
    );
  }
}

// DELETE: Revoke admin access — reset user's role to "customer"
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await userRef.update({
      role: "customer",
      roleUpdatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Admin access revoked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revoking admin access:", error);
    return NextResponse.json(
      { error: "Failed to revoke admin access" },
      { status: 500 }
    );
  }
}
