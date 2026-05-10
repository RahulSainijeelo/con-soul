import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NEXT_EMAIL_ADD,
        pass: process.env.NEXT_EMAIL_SMTP,
    },
});

// POST /api/auth/forgot-password — Send reset code to user
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", email).get();

        if (snapshot.empty) {
            // Return success even if user not found (security best practice - don't reveal if email exists)
            return NextResponse.json({
                message: "If this email is registered, a reset code has been generated.",
            });
        }

        const userDoc = snapshot.docs[0];

        // Generate a 6-digit reset code
        const resetCode = crypto.randomInt(100000, 999999).toString();
        const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

        // Store reset code in Firestore
        await userDoc.ref.update({
            resetCode,
            resetCodeExpiry,
        });

        // Send email via Nodemailer
        await transporter.sendMail({
            from: `"Con-Soul Travel" <${process.env.NEXT_EMAIL_ADD}>`,
            to: email,
            subject: "Con-Soul - Password Reset Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
                    <h2 style="color: #FFD700; text-align: center; background-color: #000; padding: 15px; border-radius: 5px;">Password Reset Request</h2>
                    <p style="color: #333; font-size: 16px;">Hello,</p>
                    <p style="color: #333; font-size: 16px;">We received a request to reset your password. Here is your 6-digit reset code:</p>
                    <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0a0a0a;">${resetCode}</span>
                    </div>
                    <p style="color: #333; font-size: 14px;">This code will expire in 15 minutes.</p>
                    <p style="color: #71717a; font-size: 12px; margin-top: 30px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });

        console.log(`[Password Reset] Code for ${email} sent via Nodemailer.`);

        return NextResponse.json({
            message: "If this email is registered, a reset code has been generated.",
            // Remove this in production — only for development/testing
            ...(process.env.NODE_ENV === "development" && { devCode: resetCode }),
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

// PUT /api/auth/forgot-password — Verify code and reset password
export async function PUT(request: NextRequest) {
    try {
        const { email, code, newPassword } = await request.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json(
                { error: "Email, code, and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Find user
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", email).get();

        if (snapshot.empty) {
            return NextResponse.json(
                { error: "Invalid or expired reset code" },
                { status: 400 }
            );
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Validate reset code
        if (!userData.resetCode || userData.resetCode !== code) {
            return NextResponse.json(
                { error: "Invalid reset code" },
                { status: 400 }
            );
        }

        // Check if code has expired
        if (!userData.resetCodeExpiry || new Date(userData.resetCodeExpiry) < new Date()) {
            return NextResponse.json(
                { error: "Reset code has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userDoc.ref.update({
            password: hashedPassword,
            resetCode: null,
            resetCodeExpiry: null,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            message: "Password has been reset successfully",
        });
    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
