"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Menu,
  Briefcase,
  Award,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_LINKS = [
  { label: "Trips", href: "/trips" },
  { label: "Past Trips", href: "/past-trips" },
  { label: "Captains", href: "/captains" },
] as const;

const ADMIN_ROLES = ["super_admin", "trip_manager", "ambassador_coordinator", "support"];
const AMBASSADOR_ROLES = ["ambassador", "super_admin"];

export default function Header() {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data?.role) setUserRole(data.role);
        })
        .catch(() => {});
    }
  }, [session.status]);

  const isAuthenticated = session.status === "authenticated";
  const userName = session.data?.user?.name;
  const userInitial = userName?.charAt(0)?.toUpperCase() ?? "U";
  const showAmbassador = userRole ? AMBASSADOR_ROLES.includes(userRole) : false;
  const showAdmin = userRole ? ADMIN_ROLES.includes(userRole) : false;

  const linkClass =
    "text-[11px] font-semibold uppercase tracking-[0.15em] bg-white dark:bg-black text-black dark:text-white rounded-full px-4 py-2 hover:opacity-90 transition-all shadow-sm";

  return (
    <header className="fixed top-0 px-3 py-3 md:px-4 md:py-6 flex justify-end left-0 right-0 z-50 w-full pointer-events-none">
      <div className="container mx-auto flex items-start justify-between pointer-events-auto">
        {/* Left — Logo */}
        <Link href="/" className="flex-shrink-0 transition-opacity duration-700 opacity-100">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/95 dark:bg-white/95 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center transition-all duration-300 shadow-lg">
            <Image src={logo} alt="CONSOUL INDIA logo" />
          </div>
        </Link>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="w-11 h-11 rounded-full bg-black dark:bg-white border border-black/20 dark:border-white/20 flex items-center justify-center shadow-xl">
                <Menu className="h-5 w-5 text-white dark:text-black" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <SheetTitle className="text-left text-sm font-bold uppercase tracking-[0.1em]">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/ambassadors"
                    className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    Campus Ambassador
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                    </span>
                  </Link>
                </SheetClose>

                <div className="px-6 py-3 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>

                <div className="mx-6 my-2 h-px bg-border" />

                {isAuthenticated ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/my-trips"
                        className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <Briefcase className="h-4 w-4" />
                        My Trips & Bookings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </SheetClose>

                    {showAmbassador && (
                      <SheetClose asChild>
                        <Link
                          href="/ambassador"
                          className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors flex items-center gap-3"
                        >
                          <Award className="h-4 w-4" />
                          Ambassador Portal
                        </Link>
                      </SheetClose>
                    )}

                    {showAdmin && (
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors flex items-center gap-3"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </SheetClose>
                    )}

                    <div className="mx-6 my-2 h-px bg-border" />

                    <button
                      onClick={() => signOut()}
                      className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-accent transition-colors flex items-center gap-3 text-left w-full text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="px-6 py-3">
                    <SheetClose asChild>
                      <Link href="/auth/login">
                        <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-bold text-xs uppercase tracking-[0.1em] rounded-full">
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 bg-black dark:bg-white border border-black/20 dark:border-white/20 rounded-full px-3 py-1.5 shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}

          <Link
            href="/ambassadors"
            className={`${linkClass} flex items-center gap-1.5`}
          >
            Campus Ambassador
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
          </Link>

          <ThemeToggle />

          <span className="h-4 w-[1px] bg-white/30 dark:bg-black/30 mx-1" />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white rounded-full px-3 py-1.5 shadow-sm hover:opacity-90 transition-all outline-none">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] font-bold bg-black/10 dark:bg-white/10 text-black dark:text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
                    {userName?.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem asChild>
                  <Link href="/my-trips" className="flex items-center gap-2 cursor-pointer">
                    <Briefcase className="h-4 w-4" />
                    My Trips & Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                {(showAmbassador || showAdmin) && <DropdownMenuSeparator />}

                {showAmbassador && (
                  <DropdownMenuItem asChild>
                    <Link href="/ambassador" className="flex items-center gap-2 cursor-pointer">
                      <Award className="h-4 w-4" />
                      Ambassador Portal
                    </Link>
                  </DropdownMenuItem>
                )}

                {showAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-white dark:bg-black text-black dark:text-white hover:opacity-90 font-bold text-[10px] uppercase tracking-[0.1em] px-6 py-2 h-auto rounded-full shadow-sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
