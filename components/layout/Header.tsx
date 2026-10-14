"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import Image from "next/image";
import logo from "@/public/images/logo.png"
import { Instagram } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const session = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const insta = { icon: Instagram, href: "https://www.instagram.com/consoul.in", label: "Instagram" }
  const Icon = insta.icon;

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
        <nav className="md:hidden flex items-center gap-2 bg-black dark:bg-white border border-black/20 dark:border-white/20 rounded-full p-1.5 shadow-xl">
          <Link
            href={insta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
            aria-label={insta.label}
          >
            <Icon className="h-4 w-4" />
          </Link>

          {/* Mobile theme toggle */}
          <ThemeToggle />
        </nav>

        {/* Desktop nav — Femur style */}
        <nav className="hidden md:flex items-center gap-2 bg-black dark:bg-white border border-black/20 dark:border-white/20 rounded-full px-3 py-1.5 shadow-xl">
          <Link
            href={insta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
            aria-label={insta.label}
          >
            <Icon className="h-4 w-4" />
          </Link>

          <Link
            href="/past-trips"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] bg-white dark:bg-black text-black dark:text-white rounded-full px-4 py-2 hover:opacity-90 transition-all shadow-sm"
          >
            Past Trips
          </Link>
          <Link
            href="/my-trips"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] bg-white dark:bg-black text-black dark:text-white rounded-full px-4 py-2 hover:opacity-90 transition-all shadow-sm"
          >
            My Trips
          </Link>

          {/* Theme toggle — text button with border */}
          <ThemeToggle />

          <span className="h-4 w-[1px] bg-white/30 dark:bg-black/30 mx-1" />

          {session.status === "authenticated" ? (
            <Link href="/profile" className="flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white rounded-full px-3 py-1.5 shadow-sm">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10 dark:bg-white/10">
                <User className="w-3.5 h-3.5 text-black dark:text-white" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
                {session.data.user?.name?.split(" ")[0]}
              </span>
            </Link>
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