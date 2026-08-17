import crypto from "crypto";

/**
 * Verify a Razorpay payment signature using HMAC-SHA256.
 * Returns true if the signature is valid, false otherwise.
 */
export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
    keySecret: string
): boolean {
    const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    return generatedSignature === signature;
}
