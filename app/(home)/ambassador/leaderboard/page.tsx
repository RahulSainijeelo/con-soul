"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Trophy,
  Medal,
  TrendingUp,
  Crown,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  seatsFilled: number;
  tier: "bronze" | "silver" | "gold";
  commissionEarned: number;
  isCurrentUser?: boolean;
}

const tierConfig = {
  bronze: {
    label: "Bronze",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    commission: "₹500/seat",
    minSeats: 0,
  },
  silver: {
    label: "Silver",
    color: "text-gray-300",
    bg: "bg-gray-400/10",
    border: "border-gray-400/20",
    commission: "₹750/seat",
    minSeats: 5,
  },
  gold: {
    label: "Gold",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    commission: "₹1,000/seat + Free Trip",
    minSeats: 10,
  },
};

const rankEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call — GET /api/ambassador/leaderboard
    const placeholderData: LeaderboardEntry[] = [
      { rank: 1, name: "Aryan Sharma", college: "NIT Raipur", seatsFilled: 24, tier: "gold", commissionEarned: 24000 },
      { rank: 2, name: "Sakshi Verma", college: "GGU Bilaspur", seatsFilled: 18, tier: "gold", commissionEarned: 18000 },
      { rank: 3, name: "Rohit Patel", college: "IIT Bhilai", seatsFilled: 14, tier: "gold", commissionEarned: 14000 },
      { rank: 4, name: "Priya Singh", college: "MATS University", seatsFilled: 9, tier: "silver", commissionEarned: 6750 },
      { rank: 5, name: "Aditya Kumar", college: "Kalinga University", seatsFilled: 7, tier: "silver", commissionEarned: 5250 },
      { rank: 6, name: "Neha Tiwari", college: "NIT Raipur", seatsFilled: 5, tier: "silver", commissionEarned: 3750 },
      { rank: 7, name: "Vikram Rao", college: "CSVTU Bhilai", seatsFilled: 3, tier: "bronze", commissionEarned: 1500 },
      { rank: 8, name: "Anjali Gupta", college: "Pt. RSU Raipur", seatsFilled: 2, tier: "bronze", commissionEarned: 1000 },
      { rank: 9, name: "Karan Joshi", college: "IIT Bhilai", seatsFilled: 1, tier: "bronze", commissionEarned: 500 },
      { rank: 10, name: "Simran Kaur", college: "GGU Bilaspur", seatsFilled: 0, tier: "bronze", commissionEarned: 0 },
    ];

    // TODO: Mark current user's row
    // const currentUserEmail = session?.user?.email;
    setLeaderboard(placeholderData);
    setLoading(false);
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Campus Leaderboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          See where you rank among ambassadors across Central India
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {leaderboard.slice(0, 3).map((entry) => {
          const tier = tierConfig[entry.tier];
          return (
            <Card
              key={entry.rank}
              className={`bg-white/5 border-white/10 ${
                entry.rank === 1
                  ? "ring-2 ring-amber-500/30"
                  : ""
              }`}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{rankEmoji(entry.rank)}</div>
                <h3 className="text-sm font-bold text-white truncate">{entry.name}</h3>
                <p className="text-[11px] text-gray-400 truncate">{entry.college}</p>
                <div className="mt-3">
                  <p className="text-xl font-bold text-white">{entry.seatsFilled}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">seats</p>
                </div>
                <span
                  className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}
                >
                  {tier.label}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Medal className="w-4 h-4 text-gray-400" />
            Full Rankings
          </h3>
          <span className="text-xs text-gray-500">{leaderboard.length} ambassadors</span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-[11px] text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-medium">Rank</th>
                <th className="text-left px-6 py-3 font-medium">Ambassador</th>
                <th className="text-left px-6 py-3 font-medium">College</th>
                <th className="text-center px-6 py-3 font-medium">Seats</th>
                <th className="text-center px-6 py-3 font-medium">Tier</th>
                <th className="text-right px-6 py-3 font-medium">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((entry) => {
                const tier = tierConfig[entry.tier];
                return (
                  <tr
                    key={entry.rank}
                    className={`hover:bg-white/5 transition-colors ${
                      entry.isCurrentUser
                        ? "bg-amber-500/5 border-l-2 border-l-amber-500"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <span className={`text-sm font-bold ${entry.rank <= 3 ? "text-amber-400" : "text-gray-400"}`}>
                        {rankEmoji(entry.rank)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium text-white">{entry.name}</span>
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-400">{entry.college}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="text-sm font-semibold text-white">{entry.seatsFilled}</span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}
                      >
                        {tier.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-semibold text-green-400">
                        ₹{entry.commissionEarned.toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-white/5">
          {leaderboard.map((entry) => {
            const tier = tierConfig[entry.tier];
            return (
              <div
                key={entry.rank}
                className={`px-4 py-3 flex items-center gap-3 ${
                  entry.isCurrentUser ? "bg-amber-500/5" : ""
                }`}
              >
                <span className={`text-lg font-bold w-8 ${entry.rank <= 3 ? "text-amber-400" : "text-gray-500"}`}>
                  {rankEmoji(entry.rank)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-1 text-[10px] text-amber-400">(You)</span>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">{entry.college}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">{entry.seatsFilled} seats</p>
                  <span
                    className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}
                  >
                    {tier.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Unlock Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          Commission Tier Unlocks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["bronze", "silver", "gold"] as const).map((tierKey) => {
            const tier = tierConfig[tierKey];
            return (
              <div
                key={tierKey}
                className={`rounded-xl border p-4 ${tier.bg} ${tier.border}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {tierKey === "gold" ? (
                    <Crown className={`w-5 h-5 ${tier.color}`} />
                  ) : (
                    <Medal className={`w-5 h-5 ${tier.color}`} />
                  )}
                  <h4 className={`font-bold ${tier.color}`}>{tier.label}</h4>
                </div>
                <p className="text-sm text-gray-300 font-semibold">{tier.commission}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {tier.minSeats === 0
                    ? "Start earning immediately"
                    : `Unlock at ${tier.minSeats}+ seats filled`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

