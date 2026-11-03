"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  DollarSign,
  Target,
  Trophy,
  ArrowRight,
  Users,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Cash Commission",
    description:
      "Earn ₹500–₹1,000 per seat booked with your unique referral code. Instant payouts after every trip.",
    emoji: "💰",
  },
  {
    icon: GraduationCap,
    title: "Free Expeditions",
    description:
      "Fill 10 seats using your code and earn a 100% free trip for yourself. Adventure on us!",
    emoji: "🎒",
  },
  {
    icon: Target,
    title: "Track Your Impact",
    description:
      "Real-time dashboard with referral tracking, earnings breakdown, and performance analytics.",
    emoji: "📊",
  },
  {
    icon: Trophy,
    title: "Campus Leaderboard",
    description:
      "Compete with ambassadors from colleges across Central India. Top performers get exclusive perks.",
    emoji: "🏆",
  },
];

const tiers = [
  {
    name: "Bronze",
    commission: "₹500",
    requirement: "Starting tier",
    color: "from-orange-700 to-orange-900",
    borderColor: "border-orange-700/40",
    textColor: "text-orange-400",
  },
  {
    name: "Silver",
    commission: "₹750",
    requirement: "10+ referrals",
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-400/40",
    textColor: "text-slate-300",
  },
  {
    name: "Gold",
    commission: "₹1,000 + Free Trip",
    requirement: "25+ referrals",
    color: "from-amber-400 to-amber-600",
    borderColor: "border-amber-400/40",
    textColor: "text-amber-400",
  },
];

const steps = [
  {
    step: 1,
    title: "Sign Up & Create Your Profile",
    description: "Create your CONSOUL account and complete your student profile.",
  },
  {
    step: 2,
    title: "Apply from Your Profile",
    description:
      "Head to Profile → Campus IB tab and submit your ambassador application.",
  },
  {
    step: 3,
    title: "Get Approved & Receive Your Code",
    description:
      "Once approved, you'll receive a unique promo code and access to your ambassador dashboard.",
  },
  {
    step: 4,
    title: "Share & Earn on Every Booking",
    description:
      "Share your code with friends and classmates. Earn cash for every seat they book!",
  },
];

export default function AmbassadorsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mt-16 md:mt-20 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          {/* Gradient background accents */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Campus Ambassador Program
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Become a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                CONSOUL
              </span>{" "}
              Campus Ambassador
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Earn{" "}
              <span className="text-amber-400 font-semibold">
                ₹500–₹1,000 per booking
              </span>{" "}
              + free trips. Represent your college, build your network, and turn
              your campus influence into real income.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/profile">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 gap-2"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 px-8 gap-2"
                >
                  <Users className="w-4 h-4" />
                  Login First
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Why Become an Ambassador?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              More than just a side hustle — it&apos;s your launchpad for
              leadership, networking, and adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl">
                    {benefit.emoji}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tier System */}
        <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ambassador Tier System
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The more you refer, the more you earn. Level up your tier and
              unlock bigger rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative bg-white/5 border ${tier.borderColor} rounded-2xl p-6 text-center hover:scale-[1.02] transition-transform`}
              >
                {tier.name === "Gold" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold">
                    BEST VALUE
                  </div>
                )}

                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}
                >
                  <Trophy className="w-7 h-7 text-white" />
                </div>

                <h3 className={`text-xl font-bold mb-1 ${tier.textColor}`}>
                  {tier.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {tier.requirement}
                </p>

                <div className="text-2xl font-bold text-foreground mb-1">
                  {tier.commission}
                </div>
                <p className="text-xs text-muted-foreground">per seat booked</p>

                {index < tiers.length - 1 && (
                  <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-white/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Getting started is simple. Four steps to becoming a CONSOUL campus
              ambassador.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="relative bg-white/5 border border-amber-500/20 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-amber-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative">
              <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Represent Your Campus?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join the growing network of CONSOUL ambassadors across Central
                India. Start earning today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/profile">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 gap-2"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 hover:bg-white/5 px-8 gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Login First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
