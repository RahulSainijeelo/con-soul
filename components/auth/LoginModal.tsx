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
    accent: "hover:border-orange-500/50",
    iconBg: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "ambassador",
    role: "Campus Ambassador (IB)",
    badge: "Partner",
    description: "Referral ledger, campus marketing kit & UPI commission payouts",
    href: "/auth/ambassador-login",
    icon: Award,
    accent: "hover:border-orange-500/50",
    iconBg: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "team",
    role: "Team & Captains",
    badge: "Operations",
    description: "Expedition manifests, driver allocation & member approvals",
    href: "/sign-in",
    icon: ShieldCheck,
    accent: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
];

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-[var(--color-canvas-raised)] text-[var(--color-ink)] border-[var(--color-border-subtle)] p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        <DialogHeader className="text-left pb-4 border-b border-[var(--color-border-subtle)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500 mb-1">
            Access Portal
          </p>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-[var(--color-ink)]">
            Choose Your Destination
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--color-ink-muted)] leading-relaxed pt-1">
            Sign in to your dedicated CONSOUL workspace.
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
                className={`group flex items-center justify-between p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)] transition-all duration-200 ${item.accent} hover:bg-[var(--color-border-subtle)]/40`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink)] group-hover:text-orange-500 transition-colors">
                        {item.role}
                      </span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-ink-muted)]">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-ink-muted)] truncate max-w-[240px] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[var(--color-ink-faint)] group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            );
          })}
        </div>

        <div className="pt-4 mt-2 border-t border-[var(--color-border-subtle)] text-center">
          <p className="text-xs text-[var(--color-ink-muted)]">
            First time with CONSOUL?{" "}
            <Link
              href="/auth/register"
              onClick={() => onOpenChange(false)}
              className="text-orange-500 font-bold hover:underline"
            >
              Create traveler account
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
