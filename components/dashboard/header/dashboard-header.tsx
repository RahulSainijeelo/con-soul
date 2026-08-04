"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Loader2 } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import logo from "@/public/images/logo_name.png"
import Image from "next/image";

export function DashboardHeader() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    // Clerk will remove session cookies and redirect to "/" by default
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black text-white backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link href="/dashboard" className="font-bold text-2xl ml-7 text-white hover:text-gold transition-colors">
            {/* <Image src={logo} width={70} alt="CONSOUL"/> */}
            Con-Sol
          </Link>
        </div>
        {/* Desktop navigation */}
        <nav className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-gold/20 hover:ring-gold/50 transition-all">
                <Avatar className="h-8 w-8">
                  {user?.imageUrl ? (
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "Profile"}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-800 text-gold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black border-white/10 text-white" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-gold cursor-pointer">
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-400">
                <button
                  className="flex items-center w-full"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
