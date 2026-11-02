"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Copy,
  Share2,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Gift,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface AmbassadorStats {
  promoCode: string;
  tier: "bronze" | "silver" | "gold";
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  seatsFilledForFreeTripGoal: number;
}

const tierConfig = {
  bronze: {
    label: "Bronze",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    commission: "₹500",
  },
  silver: {
    label: "Silver",
    color: "text-gray-300",
    bg: "bg-gray-400/10",
    border: "border-gray-400/20",
    commission: "₹750",
  },
  gold: {
    label: "Gold",
    color: "text-gold",
    bg: "bg-gold/10",
    border: "border-gold/20",
    commission: "₹1,000 + Free Trip",
  },
};

export default function AmbassadorOverviewPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // For now, use placeholder data. In production, fetch from API.
    setStats({
      promoCode: "AMBASSADOR-CODE",
      tier: "bronze",
      totalReferrals: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      seatsFilledForFreeTripGoal: 0,
    });
    setLoading(false);

    // TODO: Replace with actual API call
    // fetch("/api/ambassador/stats")
    //   .then(res => res.json())
    //   .then(data => { setStats(data); setLoading(false); })
    //   .catch(() => setLoading(false));
  }, []);

  const handleCopyCode = () => {
    if (stats?.promoCode) {
      navigator.clipboard.writeText(stats.promoCode);
      setCopied(true);
      toast({ title: "Copied!", description: "Promo code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `🎒 Hey! Book your next trip with CONSOUL and use my promo code "${stats?.promoCode}" for an exclusive discount! 🏔️\n\nBook here: https://con-soul.in`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const freeTripGoal = 10;
  const goalProgress = (stats.seatsFilledForFreeTripGoal / freeTripGoal) * 100;
  const tier = tierConfig[stats.tier];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-400">
          Here's your ambassador dashboard overview.
        </p>
      </div>

      {/* Promo Code Card */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Your Promo Code</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gold tracking-wider font-mono">
                  {stats.promoCode}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${tier.bg} ${tier.color} ${tier.border} border font-semibold`}
                >
                  {tier.label} Tier
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Commission rate: {tier.commission}/seat
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/5"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
            <p className="text-xs text-gray-400">Total Referrals</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">₹{stats.totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total Earnings</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">₹{stats.pendingEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Pending Clearance</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Gift className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {stats.seatsFilledForFreeTripGoal}/{freeTripGoal}
            </p>
            <p className="text-xs text-gray-400">Free Trip Goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Free Trip Progress */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-gold" />
              Free Trip Goal
            </h3>
            <span className="text-sm text-gray-400">
              {stats.seatsFilledForFreeTripGoal} of {freeTripGoal} seats
            </span>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <Progress value={goalProgress} className="h-3 bg-white/10" />
          <p className="text-xs text-gray-500 mt-2">
            Fill {freeTripGoal} seats to earn a 100% free expedition! 🎉
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-xl">
              <Users className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="text-white font-semibold">View Referrals</h4>
              <p className="text-xs text-gray-400">
                Track bookings using your code
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Request Payout</h4>
              <p className="text-xs text-gray-400">
                Withdraw earnings via UPI
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

