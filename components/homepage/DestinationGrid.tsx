'use client';

import React, { useState } from 'react';
import { MapPin, Mountain, Compass, TreePalm, CloudRain, Anchor, Landmark, Loader2, CheckCircle2, Flame, Waves, Sun, Leaf, Snowflake, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DestinationStatus = 'upcoming' | 'visited' | 'explore';

interface Destination {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  gradient: string;
  trips: number;
  status: DestinationStatus;
}

// Ordered list: Upcoming -> Visited -> Explore
const destinations: Destination[] = [
  // 1. Upcoming
  {
    id: 'goa',
    name: 'Goa',
    subtitle: 'Beach & Nightlife',
    icon: MapPin,
    gradient: 'from-orange-500/80 to-amber-500/80',
    trips: 0,
    status: 'upcoming'
  },
  
  // 2. Visited (Actual Past Trips)
  {
    id: 'amarkantak',
    name: 'Amarkantak',
    subtitle: 'Narmada Origin',
    icon: Mountain,
    gradient: 'from-orange-700/80 to-red-600/80',
    trips: 2,
    status: 'visited'
  },
  {
    id: 'mussoorie',
    name: 'Mussoorie',
    subtitle: 'Queen of Hills',
    icon: Mountain,
    gradient: 'from-emerald-500/80 to-teal-600/80',
    trips: 1,
    status: 'visited'
  },
  {
    id: 'haridwar',
    name: 'Haridwar',
    subtitle: 'Holy Ganges',
    icon: Flame,
    gradient: 'from-orange-500/80 to-amber-600/80',
    trips: 1,
    status: 'visited'
  },
  {
    id: 'mainpat',
    name: 'Mainpat',
    subtitle: 'Shimla of Chhattisgarh',
    icon: TreePalm,
    gradient: 'from-green-600/80 to-emerald-500/80',
    trips: 1,
    status: 'visited'
  },
  {
    id: 'vizag',
    name: 'Vizag',
    subtitle: 'City of Destiny',
    icon: Anchor,
    gradient: 'from-blue-600/80 to-indigo-500/80',
    trips: 1,
    status: 'visited'
  },

  // 3. Explore (Yet to be visited)
  {
    id: 'himalayas',
    name: 'Himalayas',
    subtitle: 'Mountains & Treks',
    icon: Mountain,
    gradient: 'from-blue-600/80 to-cyan-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    subtitle: 'Desert & Heritage',
    icon: Compass,
    gradient: 'from-rose-500/80 to-pink-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    subtitle: 'Backwaters & Nature',
    icon: TreePalm,
    gradient: 'from-emerald-500/80 to-teal-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    subtitle: 'High Altitude Desert',
    icon: Mountain,
    gradient: 'from-slate-600/80 to-indigo-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'andaman',
    name: 'Andaman',
    subtitle: 'Islands & Scuba',
    icon: Anchor,
    gradient: 'from-cyan-600/80 to-blue-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'hampi',
    name: 'Hampi',
    subtitle: 'Ruins & Hippie Vibe',
    icon: Landmark,
    gradient: 'from-amber-600/80 to-yellow-600/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    subtitle: 'Yoga & Adventure',
    icon: Waves,
    gradient: 'from-cyan-500/80 to-teal-400/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    subtitle: 'Paradise on Earth',
    icon: Snowflake,
    gradient: 'from-sky-500/80 to-blue-400/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    subtitle: 'Waterfalls & Clouds',
    icon: CloudRain,
    gradient: 'from-teal-600/80 to-emerald-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    subtitle: 'Spiritual Capital',
    icon: Flame,
    gradient: 'from-orange-600/80 to-red-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    subtitle: 'Valleys & Monasteries',
    icon: Mountain,
    gradient: 'from-emerald-600/80 to-green-500/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'coorg',
    name: 'Coorg',
    subtitle: 'Coffee & Hills',
    icon: Leaf,
    gradient: 'from-green-700/80 to-emerald-600/80',
    trips: 0,
    status: 'explore'
  },
  {
    id: 'kutch',
    name: 'Rann of Kutch',
    subtitle: 'White Desert',
    icon: Sun,
    gradient: 'from-amber-400/80 to-orange-400/80',
    trips: 0,
    status: 'explore'
  },
];

export function DestinationGrid() {
  const [selectedDest, setSelectedDest] = useState<{name: string, id: string} | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedDest) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, destination: selectedDest.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to subscribe");

      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedDest(null);
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
        setErrorMsg("");
      }, 300); // reset after animation
    }
  };

  const handleCardClick = (dest: Destination) => {
    if (dest.status === 'upcoming') {
      // Navigate to upcoming trips section
      document.getElementById("upcoming-trips")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Open lead capture modal for visited or explore
      setSelectedDest({ name: dest.name, id: dest.id });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-zinc-900/70 backdrop-blur-xl relative z-20" style={{ borderRadius: "40px 40px 0 0", marginTop: "-30px", borderTop: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" }}>
      <div className="px-3 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 tracking-tight" style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}>
          Explore India
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          Click on a destination to get notified about our upcoming expeditions.
        </p>
      </div>

      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 gap-3 md:gap-4 snap-x snap-mandatory">
        {destinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <button 
              key={dest.id} 
              onClick={() => handleCardClick(dest)}
              className="text-left group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-brand/50 transition-all duration-300 hover:-translate-y-1 block active:scale-[0.97] flex-none w-[160px] md:w-[200px] aspect-[3/4] snap-start"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  
                  {/* Status Badges */}
                  {dest.status === 'upcoming' && (
                    <span className="text-[10px] font-bold bg-brand/90 backdrop-blur-md px-2.5 py-1 rounded-full text-white shadow-lg border border-white/20 animate-pulse">
                      Upcoming
                    </span>
                  )}
                  {dest.status === 'visited' && dest.trips > 0 && (
                    <span className="text-[10px] font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white/90 border border-white/10 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                      {dest.trips} Trip{dest.trips > 1 ? 's' : ''}
                    </span>
                  )}
                  {/* If status is 'explore', don't show any badge */}
                </div>
                
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                  <h3 className="text-xl font-bold text-white mb-0.5 drop-shadow-lg leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-gray-300 font-medium drop-shadow-md line-clamp-1">
                    {dest.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lead Capture Modal */}
      <Dialog open={!!selectedDest} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white" style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}>
              Explore <span className="text-brand">{selectedDest?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Join the exclusive waitlist for {selectedDest?.name}. We&apos;ll email you before we launch new trips here so you can grab early-bird spots!
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">You&apos;re on the list!</h4>
                <p className="text-gray-400 text-sm mt-1">Keep an eye on your inbox.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {status === "error" && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                Notify Me First
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </section>
  );
}
