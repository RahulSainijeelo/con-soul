import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AmbassadorApplication, AmbassadorApplicationStatus } from "@/types/Ambassador";

// GET /api/user/ambassador-application - Get current user's ambassador application status
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find user by email
        const usersRef = db.collection("users");
        const userSnapshot = await usersRef.where("email", "==", session.user.email).limit(1).get();

        if (userSnapshot.empty) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Check if user already has ambassador role
        const isAmbassador = userData.role === "ambassador";

        // Check for existing application by userId
        const applicationsRef = db.collection("ambassadorApplications");
        const appSnapshot = await applicationsRef.where("userId", "==", userDoc.id).limit(1).get();

        if (appSnapshot.empty) {
            return NextResponse.json({
                status: "not_applied" as AmbassadorApplicationStatus,
            });
        }

        const appDoc = appSnapshot.docs[0];
        const appData = appDoc.data() as AmbassadorApplication;

        // If user has ambassador role, status is approved regardless
        const status: AmbassadorApplicationStatus = isAmbassador ? "approved" : appData.status;

        return NextResponse.json({
            status,
            application: {
                ...appData,
                id: appDoc.id,
            },
        });
    } catch (error) {
        console.error("Error fetching ambassador application:", error);
        return NextResponse.json(
            { error: "Failed to fetch ambassador application" },
            { status: 500 }
        );
    }
}

// POST /api/user/ambassador-application - Submit a new ambassador application
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find user by email
        const usersRef = db.collection("users");
        const userSnapshot = await usersRef.where("email", "==", session.user.email).limit(1).get();

        if (userSnapshot.empty) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userDoc = userSnapshot.docs[0];

        // Check for existing application (prevent duplicates)
        const applicationsRef = db.collection("ambassadorApplications");
        const existingSnapshot = await applicationsRef.where("userId", "==", userDoc.id).limit(1).get();

        if (!existingSnapshot.empty) {
            return NextResponse.json(
                { error: "You have already submitted an ambassador application" },
                { status: 409 }
            );
        }

        const body = await request.json();
        const {
            fullName,
            phone,
            collegeName,
            degree,
            branch,
            graduationYear,
            studentIdUrl,
            socialProfileUrl,
            campusInfluence,
            preferredPromoCode,
        } = body;

        // Validate required fields
        if (
            !fullName ||
            !phone ||
            !collegeName ||
            !degree ||
            !branch ||
            !graduationYear ||
            !studentIdUrl ||
            !socialProfileUrl ||
            !campusInfluence ||
            !preferredPromoCode
        ) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const application: AmbassadorApplication = {
            userId: userDoc.id,
            email: session.user.email,
            fullName,
            phone,
            collegeName,
            degree,
            branch,
            graduationYear,
            studentIdUrl,
            socialProfileUrl,
            campusInfluence,
            preferredPromoCode,
            status: "pending",
            appliedAt: new Date().toISOString(),
        };

        const docRef = await applicationsRef.add(application);

        // Update user document with ambassador status
        await userDoc.ref.update({
            ambassadorStatus: "pending",
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            message: "Ambassador application submitted successfully",
            application: {
                ...application,
                id: docRef.id,
            },
        });
    } catch (error) {
        console.error("Error submitting ambassador application:", error);
        return NextResponse.json(
            { error: "Failed to submit ambassador application" },
            { status: 500 }
        );
    }
}
