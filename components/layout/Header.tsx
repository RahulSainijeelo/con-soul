"use client"
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import Image from "next/image";
import logo from "@/public/images/logo.png"
export default function Header() {
  const session = useSession();
  return (
    <header className="fixed top-0 px-4 py-6 flex justify-end left-0 right-0 z-50 w-full">
      <div className="container mx-auto flex items-start justify-between">
        {/* Left Part - Circular Logo (Always visible) */}
        <Link href="/" className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md border border-black/10 flex items-center justify-center hover:border-gold/50 transition-all duration-300 shadow-lg hover:shadow-gold/20">
            <span
              style={{ fontFamily: 'var(--heading-bold)' }}
              className="text-gold text-lg tracking-wider"
            >
              <Image src={logo} alt="logo"></Image>
            </span>
          </div>
        </Link>

        {/* Right Part - Navigation (Desktop only) */}
        <nav className="hidden md:flex items-center gap-6 bg-black/95 backdrop-blur-md border border-white/10 rounded-full px-8 py-3 shadow-lg">
          <Link
            href="/past-trips"
            className="text-sm font-medium text-gray-300 hover:text-gold transition-colors"
            style={{ fontFamily: 'var(--fpr1)' }}
          >
            Past Trips
          </Link>
          <Link
            href="/my-trips"
            className="text-sm font-medium text-gray-300 hover:text-gold transition-colors"
            style={{ fontFamily: 'var(--fpr1)' }}
          >
            My Trips
          </Link>

          <div className="h-4 w-[1px] bg-white/10" />

          {session.status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 border border-gold/20">
                <User className="w-4 h-4 text-gold" />
              </div>
              <span
                className="text-sm font-medium text-white"
                style={{ fontFamily: 'var(--fpr1)' }}
              >
                {session.data.user?.name?.split(" ")[0]}
              </span>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-gold hover:bg-yellow-600 text-black font-semibold text-sm px-6 py-2 h-auto rounded-full">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}