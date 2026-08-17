import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";

/**
 * POST /api/verify-payment
 *
 * Standalone Razorpay payment signature verification endpoint.
 * Verifies the HMAC-SHA256 signature from Razorpay to confirm
 * the payment is authentic and not tampered with.
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature",
                },
                { status: 400 }
            );
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            console.error("RAZORPAY_KEY_SECRET is not set");
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            );
        }

        if (!verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            keySecret
        )) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Payment signature verification failed. Payment may be fraudulent.",
                },
                { status: 400 }
            );
        }

        // Signature matched — payment is authentic
        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
