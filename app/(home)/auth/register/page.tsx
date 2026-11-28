"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, number }),
            });

            if (res.ok) {
                // Auto-login after registration
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.ok) {
                    router.push("/");
                } else {
                    router.push("/auth/login");
                }
            } else {
                const data = await res.json();
                console.error("Registration failed:", data.error);
                setError(data.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("An unexpected error occurred. Please try again.");
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
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
                            New Explorer
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--color-ink)] mb-2">
                            Join CONSOUL
                        </h1>
                        <p className="text-sm text-[var(--color-ink-muted)]">
                            Start your journey to exclusive group expeditions
                        </p>
                    </div>

                    <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
                        {error && (
                            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full bg-[var(--color-canvas)] hover:bg-[var(--color-border-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-ink)] font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow active:scale-[0.99] mb-6 group cursor-pointer"
                        >
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"/>
                                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                                <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7.4C.6 9.4 0 11.6 0 13.8s.6 4.4 1.6 6.4l3.7-2.9z"/>
                                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"/>
                            </svg>
                            <span className="text-sm font-bold text-[var(--color-ink)]">Continue with Google</span>
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--color-border-subtle)]"></div>
                            </div>
                            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                                <span className="bg-[var(--color-canvas-raised)] px-3 text-[var(--color-ink-faint)] font-bold">
                                    Or register with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 h-4 w-4 text-[var(--color-ink-faint)]" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[var(--color-ink-faint)]" />
                                    <input
                                        type="tel"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[var(--color-ink-faint)]" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[var(--color-canvas)] border border-[var(--color-border-subtle)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-xs text-[var(--color-ink-muted)] pt-1">
                                <input type="checkbox" className="mt-0.5 rounded border-[var(--color-border-subtle)] bg-[var(--color-canvas)] accent-orange-500" required />
                                <span>
                                    I agree to the <Link href="/terms" className="text-orange-500 hover:underline font-semibold">Terms of Service</Link> and <Link href="/privacy-policy" className="text-orange-500 hover:underline font-semibold">Privacy Policy</Link>
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Creating Account...</span>
                                ) : (
                                    <>
                                        Create Account <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-[var(--color-ink-muted)] text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-bold hover:underline transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
