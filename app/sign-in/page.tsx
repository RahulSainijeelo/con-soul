"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CustomSignInForm from "@/components/auth/CustomSignInForm";

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-black"
        style={{
          fontFamily: "var(--font-primary)",
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black"
      style={{
        fontFamily: "var(--font-primary)",
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-black to-black opacity-50" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Main Content Container */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl backdrop-blur-xl"
        style={{
          backgroundColor: "rgba(17, 17, 17, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 40px -10px rgba(217, 119, 6, 0.1)",
        }}
      >
        <CustomSignInForm />
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-sm text-gray-500">
          © 2025 Con-Soul . All rights reserved.
        </p>
      </div>
    </div>
  );
}
