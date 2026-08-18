import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { auth } from "@clerk/nextjs/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const session = await getServerSession(authOptions);
    if (!userId && !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam || '100'), 500);

    const snapshot = await db.collection('loginActivity')
      .orderBy('loginAt', 'desc')
      .limit(limit)
      .get();

    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching login activity:', error);
    return NextResponse.json({ error: 'Failed to fetch login activity' }, { status: 500 });
  }
}
