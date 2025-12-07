import { z } from "zod";

export const bookingSchema = z.object({
    tripId: z.string().min(1, "Trip ID is required"),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    mobileNo: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    aadhaarNo: z.string().regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
    aadhaarImage: z.string().url("Valid Aadhaar image URL is required"),
    paymentrefno: z.string().min(5, "Payment reference number must be at least 5 characters"),
    paymentScreenshot: z.string().url("Valid payment screenshot URL is required"),
    amount: z.number().positive("Amount must be positive"),
    transportMode: z.enum(["3ac", "sleeper"]).optional(), // Optional, only for train trips
});

export type BookingFormData = z.infer<typeof bookingSchema>;
