import { Users, MapPin, Mountain, Star, ShieldCheck, CreditCard, Compass, UserCheck } from "lucide-react";

interface TrustStripProps {
    className?: string;
    variant?: "stats" | "guarantees" | "full";
}

const stats = [
    { icon: Users, label: "300+ Travelers", id: "travelers" },
    { icon: MapPin, label: "4 Regions", id: "regions" },
    { icon: Mountain, label: "50+ Trips", id: "trips" },
    { icon: Star, label: "4.9★ Rating", id: "rating" },
];

const guarantees = [
    { icon: ShieldCheck, label: "100% Safe & Secure", id: "safe" },
    { icon: CreditCard, label: "Low Deposit", id: "deposit" },
    { icon: Compass, label: "Curated Itineraries", id: "curated" },
    { icon: UserCheck, label: "Verified Trip Captains", id: "captains" },
];

export function TrustStrip({ className = "", variant = "full" }: TrustStripProps) {
    const items = variant === "stats" ? stats : variant === "guarantees" ? guarantees : [...stats, ...guarantees];

    return (
        <div
            className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-3 ${className}`}
            aria-label="Trust statistics"
        >
            {items.map((stat, index) => (
                <div key={stat.id} className="flex items-center gap-1.5 sm:gap-2">
                    {index > 0 && (
                        <span className="text-[var(--color-ink-faint)] mr-2 sm:mr-4 hidden sm:inline" aria-hidden="true">·</span>
                    )}
                    <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-ink-muted)] flex-shrink-0" aria-hidden="true" />
                    <span className="text-[var(--color-ink)] text-[11px] sm:text-[12px] font-medium tracking-[0.08em] uppercase">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
