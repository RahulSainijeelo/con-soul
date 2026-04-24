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
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

                <div className="w-full max-w-md relative z-10">
                    {/* Step: Email */}
                    {step === "email" && (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <KeyRound className="w-8 h-8 text-gold" />
                                </div>
                                <h1 className="text-4xl font-display font-bold text-gold mb-2">Forgot Password</h1>
                                <p className="text-gray-400">Enter your email and we'll send you a reset code</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-gold/5">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSendCode} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-gold focus:ring-1 focus:ring-gold transition-all outline-none"
                                                placeholder="name@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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

                                <p className="mt-8 text-center text-gray-400 text-sm">
                                    Remember your password?{" "}
                                    <Link href="/auth/login" className="text-gold hover:text-white font-semibold transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}

                    {/* Step: Enter Code */}
                    {step === "code" && (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8 text-gold" />
                                </div>
                                <h1 className="text-4xl font-display font-bold text-gold mb-2">Enter Code</h1>
                                <p className="text-gray-400">
                                    We've sent a 6-digit code to <span className="text-white font-medium">{email}</span>
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-gold/5">
                                {devCode && (
                                    <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg text-gold text-sm text-center">
                                        <span className="text-gray-400 text-xs block mb-1">Dev Mode — Your code:</span>
                                        <span className="text-2xl font-mono font-bold tracking-widest">{devCode}</span>
                                    </div>
                                )}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleVerifyCode} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Reset Code</label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:text-gray-600 placeholder:tracking-normal placeholder:text-base focus:border-gold focus:ring-1 focus:ring-gold transition-all outline-none"
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        Verify Code <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>

                                <div className="mt-6 flex items-center justify-between text-sm">
                                    <button
                                        onClick={() => { setStep("email"); setError(""); setCode(""); setDevCode(""); }}
                                        className="text-gray-400 hover:text-gold transition-colors flex items-center gap-1"
                                    >
                                        <ArrowLeft className="w-3 h-3" /> Change email
                                    </button>
                                    <button
                                        onClick={handleSendCode}
                                        className="text-gold hover:text-white transition-colors"
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
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-gold" />
                                </div>
                                <h1 className="text-4xl font-display font-bold text-gold mb-2">New Password</h1>
                                <p className="text-gray-400">Create a strong new password for your account</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-gold/5">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-gold focus:ring-1 focus:ring-gold transition-all outline-none"
                                                placeholder="Create a strong password"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-gold focus:ring-1 focus:ring-gold transition-all outline-none"
                                                placeholder="Confirm your password"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h1 className="text-4xl font-display font-bold text-gold mb-2">Password Reset!</h1>
                                <p className="text-gray-400">Your password has been changed successfully</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-gold/5 text-center">
                                <p className="text-gray-300 mb-6">
                                    You can now sign in with your new password.
                                </p>
                                <button
                                    onClick={() => router.push("/auth/login")}
                                    className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
