"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Award, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AmbassadorLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            // Redirect to ambassador portal if already logged in
            router.push("/ambassador");
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                console.error("Login failed:", result.error);
                setError("Invalid email or password");
            } else {
                // Check if user has ambassador role before redirecting
                try {
                    const profileRes = await fetch("/api/user/profile");
                    const profileData = await profileRes.json();
                    if (
                        profileData?.role === "ambassador" ||
                        profileData?.role === "super_admin"
                    ) {
                        router.push("/ambassador");
                    } else {
                        // User is authenticated but not an ambassador — send to the info page
                        router.push("/ambassadors");
                    }
                } catch {
                    router.push("/ambassador");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

                <div className="w-full max-w-md relative z-10">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="text-center mb-10">
                        {/* Ambassador badge */}
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
                            <Award className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400">
                                Campus Ambassador Portal
                            </span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                            Ambassador Login
                        </h1>
                        <p className="text-gray-400">
                            Sign in to access your referral dashboard, payouts & toolkit
                        </p>
                    </div>

                    <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-orange-500/5">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                signIn("google", {
                                    callbackUrl: "/ambassador",
                                })
                            }
                            className="w-full bg-white/10 hover:bg-white/15 border border-white/15 hover:border-orange-500/40 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] mb-6 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#EA4335"
                                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7.4C.6 9.4 0 11.6 0 13.8s.6 4.4 1.6 6.4l3.7-2.9z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"
                                />
                            </svg>
                            <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                                Continue with Google
                            </span>
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0e0e0e] px-3 text-gray-500 font-medium tracking-wider rounded">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all outline-none"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end text-sm">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-orange-400 hover:text-orange-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">
                                        Signing in...
                                    </span>
                                ) : (
                                    <>
                                        Sign In to Portal{" "}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 space-y-3">
                            <p className="text-center text-gray-400 text-sm">
                                Not an ambassador yet?{" "}
                                <Link
                                    href="/auth/register"
                                    className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                                >
                                    Create Account
                                </Link>{" "}
                                first, then apply from your profile.
                            </p>
                            <p className="text-center text-gray-500 text-xs">
                                Looking to book a trip?{" "}
                                <Link
                                    href="/auth/login"
                                    className="text-foreground hover:text-white font-semibold transition-colors"
                                >
                                    Customer Login →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
