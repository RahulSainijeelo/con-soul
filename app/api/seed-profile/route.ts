import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { auth } from "@clerk/nextjs/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET() {
    try {
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const profileData = {
            name: "CONSOUL Admin",
            bio: "Expeditions for the Soul",
            photo: "",
            phoneNumbers: ["+91-9876543210"],
            email: "contact@con-soul.in",
            address: "New Delhi, India",
            whatsapp: "+91-9876543210",
            experience: "5+ Years",
            workingHours: "Mon - Sat: 10:00 AM - 7:00 PM",
            description: "Curating immersive travel experiences designed for the soul.",
            bankName: "",
            accountNo: "",
            ifscCode: "",
            upiId: "",
            upiQrCode: ""
        };

        await db.collection("profile").doc("main").set(profileData, { merge: true });

        return NextResponse.json({ message: "Profile seeded successfully", data: profileData });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed profile" }, { status: 500 });
    }
}
