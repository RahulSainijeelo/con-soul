"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Step = "email" | "code" | "newPassword" | "success";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [devCode, setDevCode] = useState("");

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            // In dev mode, the API returns the code for testing
            if (data.devCode) {
                setDevCode(data.devCode);
            }

            setStep("code");
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (code.length !== 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setStep("newPassword");
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            setStep("success");
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 py-24 md:py-28 relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    {/* Step: Email */}
                    {step === "email" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/25 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <KeyRound className="w-6 h-6 text-orange-500" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-2">
                                    Forgot Password
                                </h1>
                                <p className="text-sm text-[var(--color-ink-muted)]">
                                    Enter your registered email and we'll send a 6-digit verification code
                                </p>
                            </div>

                            <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
                                {error && (
                                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium text-center">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSendCode} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[var(--color-ink-faint)]" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                                placeholder="name@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <span className="animate-pulse">Sending Code...</span>
                                        ) : (
                                            <>
                                                Send Reset Code <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="mt-8 text-center text-[var(--color-ink-muted)] text-sm">
                                    Remember your password?{" "}
                                    <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-bold hover:underline transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}

                    {/* Step: Enter Code */}
                    {step === "code" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/25 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ShieldCheck className="w-6 h-6 text-orange-500" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-2">
                                    Enter Code
                                </h1>
                                <p className="text-sm text-[var(--color-ink-muted)]">
                                    We've sent a 6-digit code to <span className="text-[var(--color-ink)] font-semibold">{email}</span>
                                </p>
                            </div>

                            <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
                                {devCode && (
                                    <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/25 rounded-xl text-[var(--color-ink)] text-sm text-center">
                                        <span className="text-[var(--color-ink-muted)] text-xs block mb-1">Dev Mode — Your code:</span>
                                        <span className="text-2xl font-mono font-bold tracking-widest text-orange-500">{devCode}</span>
                                    </div>
                                )}
                                {error && (
                                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium text-center">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleVerifyCode} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                            Reset Code
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3.5 px-4 text-[var(--color-ink)] text-center text-2xl font-mono tracking-[0.5em] placeholder:text-[var(--color-ink-faint)] placeholder:tracking-normal placeholder:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer"
                                    >
                                        Verify Code <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>

                                <div className="mt-6 flex items-center justify-between text-xs">
                                    <button
                                        onClick={() => { setStep("email"); setError(""); setCode(""); setDevCode(""); }}
                                        className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors flex items-center gap-1 font-semibold"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" /> Change email
                                    </button>
                                    <button
                                        onClick={handleSendCode}
                                        className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                                    >
                                        Resend code
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step: New Password */}
                    {step === "newPassword" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/25 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Lock className="w-6 h-6 text-orange-500" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-2">
                                    New Password
                                </h1>
                                <p className="text-sm text-[var(--color-ink-muted)]">
                                    Create a strong new password for your account
                                </p>
                            </div>

                            <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
                                {error && (
                                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium text-center">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[var(--color-ink-faint)]" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                                placeholder="Create a strong password"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[var(--color-ink-faint)]" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                                placeholder="Confirm your password"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <span className="animate-pulse">Resetting Password...</span>
                                        ) : (
                                            <>
                                                Reset Password <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {/* Step: Success */}
                    {step === "success" && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-green-500/10 border border-green-500/25 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-7 h-7 text-green-500" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-2">
                                    Password Reset!
                                </h1>
                                <p className="text-sm text-[var(--color-ink-muted)]">
                                    Your password has been changed successfully
                                </p>
                            </div>

                            <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm text-center">
                                <p className="text-sm text-[var(--color-ink-muted)] mb-6">
                                    You can now sign in with your new password.
                                </p>
                                <button
                                    onClick={() => router.push("/auth/login")}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer"
                                >
                                    Go to Sign In <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
