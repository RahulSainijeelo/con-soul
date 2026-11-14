"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Compass, Award, ShieldCheck, ArrowRight } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PORTAL_OPTIONS = [
  {
    id: "traveler",
    role: "Traveler / Customer",
    badge: "Public",
    description: "Book upcoming expeditions, view tickets & emergency passes",
    href: "/auth/login",
    icon: Compass,
    accent: "hover:border-white/40 dark:hover:border-white/40",
    iconBg: "bg-white/10 text-white",
  },
  {
    id: "ambassador",
    role: "Campus Ambassador (IB)",
    badge: "Partner",
    description: "Referral ledger, campus marketing kit & UPI commission payouts",
    href: "/auth/ambassador-login",
    icon: Award,
    accent: "hover:border-orange-500/50 dark:hover:border-orange-500/50",
    iconBg: "bg-orange-500/10 text-orange-400",
  },
  {
    id: "team",
    role: "Team & Captains",
    badge: "Operations",
    description: "Expedition manifests, driver allocation & member approvals",
    href: "/sign-in",
    icon: ShieldCheck,
    accent: "hover:border-emerald-500/50 dark:hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
];

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-[#111318] text-[#F3F0EA] border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        <DialogHeader className="text-left pb-4 border-b border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-1">
            Access Portal
          </p>
          <DialogTitle className="text-xl font-extrabold uppercase tracking-tight text-white">
            Choose Your Destination
          </DialogTitle>
          <DialogDescription className="text-xs text-white/60 leading-relaxed pt-1">
            Sign in to your dedicated workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5 pt-4">
          {PORTAL_OPTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`group flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.03] transition-all duration-200 ${item.accent} hover:bg-white/[0.07]`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-white group-hover:text-white">
                        {item.role}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 truncate max-w-[240px] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            );
          })}
        </div>

        <div className="pt-4 mt-2 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/50">
            First time with CONSOUL?{" "}
            <Link
              href="/auth/register"
              onClick={() => onOpenChange(false)}
              className="text-white font-semibold underline underline-offset-4 hover:opacity-80"
            >
              Create traveler account
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
