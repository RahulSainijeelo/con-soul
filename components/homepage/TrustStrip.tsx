import { Users, MapPin, Mountain } from "lucide-react";

interface TrustStripProps {
    className?: string;
}

const stats = [
    { icon: Users, label: "300+ Travelers", id: "travelers" },
    { icon: MapPin, label: "4 Regions", id: "regions" },
    { icon: Mountain, label: "50+ Trips", id: "trips" },
];

export function TrustStrip({ className = "" }: TrustStripProps) {
    return (
        <div
            className={`flex items-center justify-center gap-4 sm:gap-8 px-4 py-3 ${className}`}
            aria-label="Trust statistics"
        >
            {stats.map((stat, index) => (
                <div key={stat.id} className="flex items-center gap-1.5 sm:gap-2">
                    {index > 0 && (
                        <span className="text-white/30 mr-3 sm:mr-6 hidden sm:inline" aria-hidden="true">·</span>
                    )}
                    <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand flex-shrink-0" aria-hidden="true" />
                    <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">
                        {stat.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
