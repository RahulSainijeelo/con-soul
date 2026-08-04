"use client";
import { useSignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import Google from "@/public/icons/Google.png";
import Image from "next/image";

export default function CustomSignInForm() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingOtp, setPendingOtp] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show toast if redirected back with google_error param
  useEffect(() => {
    if (searchParams.get("google_error")) {
      toast({
        title: "Google sign in failed",
        description: "No account found for this Google user.",
        variant: "destructive",
      });
      // Remove the param from the URL for future attempts
      const params = new URLSearchParams(window.location.search);
      params.delete("google_error");
      const newUrl =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  // Start email OTP flow
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setPendingOtp(true);
    try {
      const res = await signIn.create({
        identifier: email,
        strategy: "email_code",
      });
      if (res.status === "needs_first_factor") {
        setOtpSent(true);
        setPendingVerification(res);
        toast({
          title: "OTP sent",
          description: "Check your email for the code.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err?.errors?.[0]?.message || "Could not send OTP.",
        variant: "destructive",
      });
      router.replace("/");
    } finally {
      setPendingOtp(false);
    }
  };

  // Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !pendingVerification) return;
    setPendingOtp(true);
    try {
      const res = await pendingVerification.attemptFirstFactor({
        strategy: "email_code",
        code: otp,
      });
      if (res.status === "complete") {
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid code.",
          variant: "destructive",
        });
        router.replace("/");
      }
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err?.errors?.[0]?.message || "Invalid code.",
        variant: "destructive",
      });
      router.replace("/");
    } finally {
      setPendingOtp(false);
    }
  };

  // Google OAuth
  const handleGoogle = async () => {
    if (!isLoaded) return;
    setPendingGoogle(true);
    try {
      const data = await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
        redirectUrlFailure: "/dashboard?google_error=1",
        additionalOAuthScopes: [],
        // @ts-ignore
        customOAuthParams: { prompt: "select_account" },
      } as any);
    } catch (err: any) {
      console.error("Google sign in error:", err);
      toast({
        title: "Google sign in failed",
        description:
          err?.errors?.[0]?.message || "Could not sign in with Google.",
        variant: "destructive",
      });
      router.replace("/");
    } finally {
      setPendingGoogle(false);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-primary)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          aria-label="Back to home"
          title="Back to home"
          className="hover:bg-white/10"
          style={{
            color: "#9ca3af",
            borderRadius: "8px",
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-center flex-1">
          <div
            className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(217, 119, 6, 0.1)" }}
          >
            <Shield className="h-6 w-6" style={{ color: "#d97706" }} />
          </div>
          <h2
            className="text-2xl font-bold"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-heading)",
            }}
          >
            Welcome Back
          </h2>
          <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
            Sign in to access your CONSOUL dashboard
          </p>
        </div>
      </div>

      {/* Email/OTP Form */}
      {!otpSent ? (
        <form onSubmit={handleEmailSubmit} className="mb-6">
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#d1d5db" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "#6b7280" }}
              />
              <Input
                type="email"
                placeholder="Enter your email address"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={pendingOtp || pendingGoogle}
                className="pl-10"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "#333333",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mb-4 hover:opacity-90 transition-opacity"
            disabled={pendingOtp || pendingGoogle}
            style={{
              backgroundColor: "#d97706",
              color: "#ffffff",
              fontWeight: "600",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
            }}
          >
            {pendingOtp ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending OTP...
              </div>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="mb-6">
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#d1d5db" }}
            >
              Verification Code
            </label>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={pendingOtp || pendingGoogle}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              style={{
                backgroundColor: "#111111",
                borderColor: "#333333",
                color: "#ffffff",
                fontSize: "16px",
                letterSpacing: "0.2em",
              }}
            />
            <p
              className="text-xs mt-2 text-center"
              style={{ color: "#9ca3af" }}
            >
              Check your email for the verification code
            </p>
          </div>

          <Button
            type="submit"
            className="w-full mb-4 hover:opacity-90 transition-opacity"
            disabled={pendingOtp || pendingGoogle}
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontWeight: "600",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
            }}
          >
            {pendingOtp ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify & Sign In"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm hover:bg-white/10"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setPendingVerification(null);
            }}
            style={{ color: "#9ca3af" }}
          >
            ← Back to email
          </Button>
        </form>
      )}

      {/* Divider */}
      <div className="flex items-center my-6">
        <div
          className="flex-grow border-t"
          style={{ borderColor: "#333333" }}
        />
        <span className="mx-4 text-xs font-medium" style={{ color: "#6b7280" }}>
          OR
        </span>
        <div
          className="flex-grow border-t"
          style={{ borderColor: "#333333" }}
        />
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={pendingGoogle || pendingOtp}
        className="w-full hover:bg-white/5"
        style={{
          backgroundColor: "#000000",
          borderColor: "#333333",
          color: "#ffffff",
          fontWeight: "500",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        {pendingGoogle ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Redirecting...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Image alt="Google" width={32} height={32} src={Google} />
            Continue with Google
          </div>
        )}
      </Button>

      {/* Footer */}
    </div>
  );
}
