"use client";

import Link from "next/link";
import { useDashboardStats } from "./useDashboardStats";
import { Map, MessageSquare, Star, Plus, ArrowRight, TrendingUp, Users, Eye } from "lucide-react";

export default function DashboardOverview() {
  const { stats, loading } = useDashboardStats();

  const statCards = [
    {
      label: "Total Trips",
      value: stats.totalTrips,
      sub: `${stats.activeTrips} active`,
      icon: Map,
      color: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
      href: "/dashboard/trips",
    },
    {
      label: "Enquiries",
      value: stats.totalEnquiries,
      sub: `${stats.pendingEnquiries} pending`,
      icon: MessageSquare,
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
      href: "/dashboard/enquiries",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      sub: `${stats.pendingReviews} pending`,
      icon: Star,
      color: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/20",
      iconColor: "text-purple-400",
      href: "/dashboard/reviews",
    },
  ];

  const quickActions = [
    { label: "Create New Trip", href: "/dashboard/create-trip", icon: Plus, desc: "Add a new travel package" },
    { label: "View Enquiries", href: "/dashboard/enquiries", icon: MessageSquare, desc: "Check pending messages" },
    { label: "Manage Reviews", href: "/dashboard/reviews", icon: Star, desc: "Approve or reject reviews" },
    { label: "View Website", href: "/", icon: Eye, desc: "See the live site" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
                {loading ? (
                  <div className="mt-2 h-8 w-16 rounded bg-white/10 animate-pulse" />
                ) : (
                  <p className="mt-1 text-3xl font-bold text-white">{card.value}</p>
                )}
                {!loading && (
                  <p className="mt-1 text-xs text-gray-400">{card.sub}</p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl bg-white/5 ${card.iconColor}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                <action.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-[11px] text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
