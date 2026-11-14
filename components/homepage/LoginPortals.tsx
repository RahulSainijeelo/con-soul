"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Compass,
  Award,
  Shield,
  ArrowRight,
  User,
  Briefcase,
} from "lucide-react";

const PORTALS = [
  {
    id: "customer",
    title: "Traveler",
    subtitle: "Explore & Book Trips",
    description:
      "Discover curated group trips across India. Book your next Himalayan, Goa, or Rajasthan adventure.",
    icon: Compass,
    href: "/auth/login",
    authenticatedHref: "/my-trips",
    cta: "Login as Traveler",
    authenticatedCta: "My Trips",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30 hover:border-blue-400/60",
    iconColor: "text-blue-400",
    ctaBg: "bg-blue-500 hover:bg-blue-400",
  },
  {
    id: "ambassador",
    title: "Campus Ambassador",
    subtitle: "Promote & Earn",
    description:
      "Represent your college. Earn ₹500–₹1,000 per booking, track referrals, and unlock free trips.",
    icon: Award,
    href: "/auth/ambassador-login",
    authenticatedHref: "/ambassador",
    cta: "Login as Ambassador",
    authenticatedCta: "Ambassador Portal",
    gradient: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/30 hover:border-orange-400/60",
    iconColor: "text-orange-400",
    ctaBg: "bg-orange-500 hover:bg-orange-400",
    badge: "Earn Cash",
  },
  {
    id: "member",
    title: "Team Member",
    subtitle: "Admin & Operations",
    description:
      "Manage expeditions, review bookings, approve ambassador applications, and oversee operations.",
    icon: Shield,
    href: "/sign-in",
    authenticatedHref: "/dashboard",
    cta: "Team Login",
    authenticatedCta: "Dashboard",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30 hover:border-emerald-400/60",
    iconColor: "text-emerald-400",
    ctaBg: "bg-emerald-500 hover:bg-emerald-400",
  },
];

export function LoginPortals() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className="text-center mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Choose Your Portal
          </p>
          <h2
            className="font-extrabold tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            {isAuthenticated ? "Where would you like to go?" : "How would you like to sign in?"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            {isAuthenticated
              ? "Jump straight to your dashboard."
              : "Separate logins for travelers, campus ambassadors, and team members."}
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {PORTALS.map((portal, idx) => {
            const Icon = portal.icon;
            const href = isAuthenticated
              ? portal.authenticatedHref
              : portal.href;
            const ctaLabel = isAuthenticated
              ? portal.authenticatedCta
              : portal.cta;

            return (
              <Link
                key={portal.id}
                href={href}
                className={`
                  group relative flex flex-col rounded-2xl border p-6 md:p-8
                  bg-gradient-to-br ${portal.gradient}
                  backdrop-blur-sm
                  ${portal.borderColor}
                  transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl
                  cursor-pointer
                `}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + idx * 150}ms`,
                }}
              >
                {/* Badge */}
                {portal.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full px-2.5 py-0.5">
                    {portal.badge}
                  </span>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-background/50 border border-border/50 flex items-center justify-center mb-5 ${portal.iconColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-0.5">
                  {portal.title}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                  {portal.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {portal.description}
                </p>

                {/* CTA Button */}
                <div
                  className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl
                    ${portal.ctaBg}
                    text-white font-bold text-xs uppercase tracking-[0.12em]
                    transition-all duration-300 group-hover:shadow-lg
                  `}
                >
                  {ctaLabel}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom note */}
        {!isAuthenticated && (
          <p
            className="text-center mt-8 text-xs text-muted-foreground"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 700ms ease-out 800ms",
            }}
          >
            New to CONSOUL?{" "}
            <Link
              href="/auth/register"
              className="text-foreground font-semibold hover:underline underline-offset-2"
            >
              Create a free account
            </Link>{" "}
            as a traveler, then apply as a Campus Ambassador from your profile.
          </p>
        )}
      </div>
    </section>
  );
}
