"use client";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/sidebar/DashboardSidebar";
import CustomSignInForm from "@/components/auth/CustomSignInForm";

export function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && !user) {
      toast({
        title: "Authentication Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-black">
          <DashboardSidebar />
          <main className="lg:ml-[260px] min-h-screen">
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <CustomSignInForm />
        </div>
      </SignedOut>
    </>
  );
}
