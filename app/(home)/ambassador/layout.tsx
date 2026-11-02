"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Wallet,
  Trophy,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ambassadorNavItems = [
  { label: "Overview", href: "/ambassador", icon: LayoutDashboard },
  { label: "Referrals", href: "/ambassador/referrals", icon: Users },
  { label: "Marketing Kit", href: "/ambassador/toolkit", icon: Megaphone },
  { label: "Payouts", href: "/ambassador/payouts", icon: Wallet },
  { label: "Leaderboard", href: "/ambassador/leaderboard", icon: Trophy },
];

export default function AmbassadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/ambassador");
      return;
    }

    if (status === "authenticated") {
      // Check user role
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          setUserRole(data.role || "customer");
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  // Non-ambassadors get redirected to the public ambassador program page
  if (userRole && userRole !== "ambassador" && userRole !== "super_admin") {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-20 mt-16 max-w-lg text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <ShieldAlert className="w-16 h-16 text-gold mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-3">
              Ambassador Access Required
            </h1>
            <p className="text-gray-400 mb-6">
              You need to be an approved Campus Ambassador to access this portal.
              Apply from your profile or learn more about the program.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/profile">
                <Button className="bg-gold hover:bg-yellow-600 text-black font-semibold w-full sm:w-auto">
                  Apply from Profile
                </Button>
              </Link>
              <Link href="/ambassadors">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 w-full sm:w-auto"
                >
                  Learn About Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Ambassador Portal Navigation */}
      <div className="bg-black border-b border-white/10 mt-16 md:mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-lg md:text-xl font-display font-bold text-gold">
              Ambassador Portal
            </h1>
            <span className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              {session?.user?.name?.split(" ")[0] || "Ambassador"}
            </span>
          </div>

          {/* Tabs - Horizontally scrollable on mobile */}
          <div className="overflow-x-auto no-scrollbar -mb-px">
            <div className="flex gap-1 min-w-max">
              {ambassadorNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/ambassador" &&
                    pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? "border-gold text-gold"
                        : "border-transparent text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                    style={{ fontFamily: "var(--fpr1)" }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">{children}</div>

      <Footer />
    </div>
  );
}

