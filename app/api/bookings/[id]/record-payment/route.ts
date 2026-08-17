import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import { FieldValue } from "firebase-admin/firestore";

// POST /api/bookings/[id]/record-payment — Admin records cash/bank payment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin auth check
        const { userId } = await auth();
        const session = await getServerSession(authOptions);
        if (!userId && !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { amount, method, reference, note } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Valid payment amount is required" }, { status: 400 });
        }

        if (!method || !["cash", "bank_transfer", "upi_direct"].includes(method)) {
            return NextResponse.json(
                { error: "Payment method must be: cash, bank_transfer, or upi_direct" },
                { status: 400 }
            );
        }

        const bookingRef = db.collection("bookings").doc(id);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const booking = bookingDoc.data()!;
        const currentAmountPaid = booking.amountPaid || 0;
        const totalAmount = booking.amount || 0;
        const newAmountPaid = currentAmountPaid + amount;

        // Build payment history entry
        const paymentEntry = {
            amount,
            method,
            date: new Date().toISOString(),
            recordedBy: "admin",
            ...(reference && { reference }),
            ...(note && { note }),
        };

        // Determine new status
        const isFullyPaid = newAmountPaid >= totalAmount;

        const updates: Record<string, unknown> = {
            amountPaid: newAmountPaid,
            paymentStatus: isFullyPaid ? "paid" : "partial",
            paymentHistory: FieldValue.arrayUnion(paymentEntry),
            updatedAt: new Date().toISOString(),
        };

        // Auto-confirm if fully paid
        if (isFullyPaid && booking.status !== "confirmed") {
            updates.status = "confirmed";
        }

        // If was unpaid/admin_registered, move to registrationConfirmed at minimum
        if (!isFullyPaid && (booking.status === "admin_registered" || booking.paymentStatus === "unpaid")) {
            updates.status = "registrationConfirmed";
        }

        await bookingRef.update(updates);

        return NextResponse.json({
            message: "Payment recorded successfully",
            data: {
                id,
                amountPaid: newAmountPaid,
                remaining: Math.max(0, totalAmount - newAmountPaid),
                paymentStatus: isFullyPaid ? "paid" : "partial",
                status: updates.status || booking.status,
            },
        });
    } catch (error: unknown) {
        console.error("Error recording payment:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to record payment" },
            { status: 500 }
        );
    }
}
