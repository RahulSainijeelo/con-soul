import { z } from "zod";

export const bookingSchema = z.object({
    tripId: z.string().min(1, "Trip ID is required"),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    mobileNo: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    aadhaarNo: z.string().regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
    aadhaarImage: z.string().url("Valid Aadhaar image URL is required"),
    amount: z.number().positive("Amount must be positive"), // Total trip price
    amountPaid: z.number().positive("Amount paid must be positive"), // Amount being paid now
    transportMode: z.enum(["3ac", "sleeper"]).optional(),
    // Razorpay payment fields
    razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
    razorpayOrderId: z.string().min(1, "Razorpay Order ID is required"),
    razorpaySignature: z.string().min(1, "Razorpay Signature is required"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
