"use client";

import { useState } from "react";
import { Users, CheckCircle, Clock, IndianRupee, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ReferralStatus = "Confirmed" | "Deposit Paid" | "Completed";

interface Referral {
  id: string;
  studentName: string;
  campus: string;
  tripName: string;
  bookingDate: string;
  status: ReferralStatus;
  commissionEarned: number;
}

// TODO: Replace with actual API call to /api/ambassador/referrals
const placeholderReferrals: Referral[] = [
  {
    id: "ref-001",
    studentName: "Aditi Sharma",
    campus: "IIT Indore",
    tripName: "Rishikesh Rafting & Camping",
    bookingDate: "2026-10-15",
    status: "Confirmed",
    commissionEarned: 500,
  },
  {
    id: "ref-002",
    studentName: "Rahul Verma",
    campus: "IIM Indore",
    tripName: "Goa Beach Expedition",
    bookingDate: "2026-10-18",
    status: "Deposit Paid",
    commissionEarned: 500,
  },
  {
    id: "ref-003",
    studentName: "Priya Patel",
    campus: "DAVV Indore",
    tripName: "Manali Snowfall Trip",
    bookingDate: "2026-10-22",
    status: "Completed",
    commissionEarned: 750,
  },
  {
    id: "ref-004",
    studentName: "Karan Malhotra",
    campus: "Medicaps University",
    tripName: "Rishikesh Rafting & Camping",
    bookingDate: "2026-10-28",
    status: "Confirmed",
    commissionEarned: 500,
  },
  {
    id: "ref-005",
    studentName: "Sneha Gupta",
    campus: "IIT Indore",
    tripName: "Kasol & Kheerganga Trek",
    bookingDate: "2026-11-01",
    status: "Deposit Paid",
    commissionEarned: 750,
  },
  {
    id: "ref-006",
    studentName: "Amit Joshi",
    campus: "SGSITS Indore",
    tripName: "Goa Beach Expedition",
    bookingDate: "2026-11-02",
    status: "Completed",
    commissionEarned: 1000,
  },
];

const filterTabs: { label: string; value: ReferralStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Deposit Paid", value: "Deposit Paid" },
  { label: "Completed", value: "Completed" },
];

const statusConfig: Record<ReferralStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Confirmed: { color: "text-blue-400", bg: "bg-blue-500/10", icon: CheckCircle },
  "Deposit Paid": { color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
  Completed: { color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle },
};

export default function ReferralsPage() {
  const [activeFilter, setActiveFilter] = useState<ReferralStatus | "All">("All");

  // TODO: Fetch referrals from API: GET /api/ambassador/referrals
  const referrals = placeholderReferrals;

  const filtered =
    activeFilter === "All"
      ? referrals
      : referrals.filter((r) => r.status === activeFilter);

  const totalReferrals = referrals.length;
  const confirmedBookings = referrals.filter(
    (r) => r.status === "Confirmed" || r.status === "Completed"
  ).length;
  const totalCommission = referrals.reduce((sum, r) => sum + r.commissionEarned, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">My Referrals</h2>
        <p className="text-gray-400 mt-1">
          Track students who booked using your promo code
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/5 border border-white/10 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-xl">
              <Users className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalReferrals}</p>
              <p className="text-xs text-gray-400">Total Referrals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border border-white/10 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{confirmedBookings}</p>
              <p className="text-xs text-gray-400">Confirmed Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border border-white/10 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <IndianRupee className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Total Commission</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
        {filterTabs.map((tab) => (
          <Button
            key={tab.value}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter(tab.value)}
            className={`rounded-full px-4 text-sm whitespace-nowrap ${
              activeFilter === tab.value
                ? "bg-gold/20 text-gold border border-gold/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Desktop Table */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Student Name
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Campus
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Trip Name
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Booking Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Commission (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((referral) => {
                const cfg = statusConfig[referral.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr
                    key={referral.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {referral.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {referral.campus}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {referral.tripName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(referral.bookingDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-green-400 font-semibold text-right">
                      ₹{referral.commissionEarned.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    No referrals found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((referral) => {
          const cfg = statusConfig[referral.status];
          const StatusIcon = cfg.icon;
          return (
            <Card
              key={referral.id}
              className="bg-white/5 border border-white/10 rounded-2xl"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {referral.studentName}
                    </p>
                    <p className="text-gray-500 text-xs">{referral.campus}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {referral.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{referral.tripName}</span>
                  <span className="text-green-400 font-semibold">
                    ₹{referral.commissionEarned.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">
                  Booked:{" "}
                  {new Date(referral.bookingDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">
            No referrals found for this filter.
          </p>
        )}
      </div>
    </div>
  );
}
