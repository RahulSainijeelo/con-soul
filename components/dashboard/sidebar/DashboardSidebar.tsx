"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Map,
  MessageSquare,
  Star,
  User,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Loader2,
  Activity,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Trips", href: "/dashboard/trips", icon: Map },
  { label: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Login Activity", href: "/dashboard/login-activity", icon: Activity },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    window.location.href = "/";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
            <span className="text-black font-bold text-sm">CS</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">CONSOUL</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${
                active ? "text-gold" : "text-gray-500 group-hover:text-gray-300"
              }`} />
              {item.label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-white/5" />

        {/* View Website */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ExternalLink className="w-[18px] h-[18px] text-gray-500" />
          View Website
        </Link>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <Avatar className="h-9 w-9 ring-2 ring-white/10">
            {user?.imageUrl ? (
              <AvatarImage src={user.imageUrl} alt={user.fullName || "Admin"} />
            ) : (
              <AvatarFallback className="bg-gray-800 text-gold text-xs">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          {isLoggingOut ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
          ) : (
            <LogOut className="w-[18px] h-[18px]" />
          )}
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-black/80 border border-white/10 text-white backdrop-blur-md"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[260px] bg-black border-r border-white/10 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
