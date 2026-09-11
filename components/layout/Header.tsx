"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import Image from "next/image";
import logo from "@/public/images/logo.png"
import { Instagram } from "lucide-react";

export default function Header() {
  const session = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme toggle
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  const insta = { icon: Instagram, href: "https://www.instagram.com/consoul.in", label: "Instagram" }
  const Icon = insta.icon;

  return (
    <header className="fixed top-0 px-3 py-3 md:px-4 md:py-6 flex justify-end left-0 right-0 z-50 w-full pointer-events-none">
      <div className="container mx-auto flex items-start justify-between pointer-events-auto">
        {/* Left — Logo */}
        <Link href="/" className="flex-shrink-0 transition-opacity duration-700 opacity-100">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/95 backdrop-blur-md border border-black/10 flex items-center justify-center transition-all duration-300 shadow-lg">
            <Image src={logo} alt="CONSOUL INDIA logo" />
          </div>
        </Link>

        {/* Mobile nav */}
        <nav className="md:hidden mt-10 sm:flex items-center gap-4 bg-[#0A0A0A]/95 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-lg">
          <Link
            href={insta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors flex gap-1 align-baseline"
            aria-label={insta.label}
          >
            <span className="self-center"><Icon className="h-5 w-5" /></span>
          </Link>
        </nav>

        {/* Desktop nav — Femur style */}
        <nav className="hidden md:flex items-center gap-5 bg-[#0A0A0A]/95 backdrop-blur-md border border-white/10 rounded-full px-7 py-2.5 shadow-lg">
          <Link
            href={insta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full"
            aria-label={insta.label}
          >
            <Icon className="h-4 w-4" />
          </Link>

          <Link
            href="/past-trips"
            className="text-[11px] font-normal uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
          >
            Past Trips
          </Link>
          <Link
            href="/my-trips"
            className="text-[11px] font-normal uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
          >
            My Trips
          </Link>

          {/* Theme toggle — Femur pill style */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all duration-300 hover:scale-[1.03]"
          >
            {isDark ? "Light" : "Dark"}
          </button>

          <span className="h-4 w-[1px] bg-white/10" />

          {session.status === "authenticated" ? (
            <Link href="/profile" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/10">
                <User className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-[11px] font-normal uppercase tracking-[0.1em] text-white">
                {session.data.user?.name?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-white hover:bg-white/90 text-[#0A0A0A] font-semibold text-[10px] uppercase tracking-[0.1em] px-5 py-2 h-auto rounded-full">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}