"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                console.error("Login failed:", result.error);
                setError("Invalid email or password");
            } else {
                router.push("/");
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-display font-bold text-gold mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to access your exclusive journeys</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-gold/5">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] mb-6 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"/>
                                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                                <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7.4C.6 9.4 0 11.6 0 13.8s.6 4.4 1.6 6.4l3.7-2.9z"/>
                                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"/>
                            </svg>
                            <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">Continue with Google</span>
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0e0e0e] px-3 text-gray-500 font-medium tracking-wider rounded">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-gold focus:ring-1 focus:ring-gold transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="rounded border-gray-600 bg-black/50 text-gold focus:ring-gold" />
                                    <span className="text-gray-400 group-hover:text-gold transition-colors">Remember me</span>
                                </label>
                                <Link href="/auth/forgot-password" className="text-gold hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Signing in...</span>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-gold hover:text-white font-semibold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
