"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Past Trips", href: "/past-trips", icon: MapPin },
    { name: "My Trips", href: "/my-trips", icon: Briefcase },
    { name: "Profile", href: "/profile", icon: User },
];

export default function BottomTabBar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    let firstName = "";
    if (session && session.user && session.user.name) firstName = session?.user?.name?.split(" ")[0];
    if (firstName) {
        tabs.pop();
        tabs.push({ name: firstName, href: "/profile", icon: User })
    }
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="grid grid-cols-4 h-[68px]">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 active:opacity-70",
                                isActive
                                    ? "text-gold"
                                    : "text-gray-400 hover:text-gold/80"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[11px] font-medium">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
