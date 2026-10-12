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
        <nav className="md:hidden mt-10 sm:flex items-center gap-3 bg-background/95 backdrop-blur-md border border-border rounded-full p-2 shadow-lg">
          <Link
            href={insta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/50 hover:text-foreground transition-colors flex gap-1 align-baseline"
            aria-label={insta.label}
          >
            <span className="self-center"><Icon className="h-5 w-5" /></span>
          </Link>

          {/* Mobile theme toggle */}
          <ThemeToggle />
        </nav>

        {/* Desktop nav — Femur style */}
        <nav className="hidden md:flex items-center gap-3 bg-background/95 backdrop-blur-md border border-border rounded-full px-5 py-2.5 shadow-lg">
          <Link
            href={insta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/40 hover:text-foreground transition-colors flex items-center justify-center w-8 h-8 rounded-full border border-border hover:border-foreground/30"
            aria-label={insta.label}
          >
            <Icon className="h-4 w-4" />
          </Link>

          <Link
            href="/past-trips"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground transition-colors border border-border hover:border-foreground/30 rounded-full px-4 py-1.5"
          >
            Past Trips
          </Link>
          <Link
            href="/my-trips"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground transition-colors border border-border hover:border-foreground/30 rounded-full px-4 py-1.5"
          >
            My Trips
          </Link>

          {/* Theme toggle — text button with border */}
          <ThemeToggle />

          <span className="h-4 w-[1px] bg-border" />

          {session.status === "authenticated" ? (
            <Link href="/profile" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/10 border border-border">
                <User className="w-4 h-4 text-foreground/60" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">
                {session.data.user?.name?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-foreground hover:bg-foreground/90 text-background font-semibold text-[10px] uppercase tracking-[0.1em] px-6 py-2.5 h-auto rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}