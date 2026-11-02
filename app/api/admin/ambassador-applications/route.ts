import { NextResponse } from "next/server";
import { db } from "@/config/firebase";

// GET: List all ambassador applications sorted by appliedAt desc
export async function GET() {
  try {
    const applicationsRef = db.collection("ambassadorApplications");
    const snapshot = await applicationsRef.orderBy("appliedAt", "desc").get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ambassador applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch ambassador applications" },
      { status: 500 }
    );
  }
}
