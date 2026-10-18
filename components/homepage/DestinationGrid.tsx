'use client';

import React, { useState } from 'react';
import { MapPin, Mountain, Compass, TreePalm, CloudRain, Anchor, Landmark, Loader2, CheckCircle2, Flame, Waves, Sun, Leaf, Snowflake, Star, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DestinationStatus = 'upcoming' | 'completed' | 'explore';

interface DestinationBase {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  imageUrl: string;
}

interface Destination extends DestinationBase {
  trips: number;
  status: DestinationStatus;
}

interface DestinationGridProps {
  tripData?: { destination: string; startDate: string; endDate: string; status: string }[];
}

// Base destination data with images
const destinationData: DestinationBase[] = [
  {
    id: 'goa',
    name: 'Goa',
    subtitle: 'Beach & Nightlife',
    icon: MapPin,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'amarkantak',
    name: 'Amarkantak',
    subtitle: 'Narmada Origin',
    icon: Mountain,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'mussoorie',
    name: 'Mussoorie',
    subtitle: 'Queen of Hills',
    icon: Mountain,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'haridwar',
    name: 'Haridwar',
    subtitle: 'Holy Ganges',
    icon: Flame,
    imageUrl: 'https://images.unsplash.com/photo-1591018653367-4e4f1a4c3b4f?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'mainpat',
    name: 'Mainpat',
    subtitle: 'Shimla of Chhattisgarh',
    icon: TreePalm,
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'vizag',
    name: 'Vizag',
    subtitle: 'City of Destiny',
    icon: Anchor,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'himalayas',
    name: 'Himalayas',
    subtitle: 'Mountains & Treks',
    icon: Mountain,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    subtitle: 'Desert & Heritage',
    icon: Compass,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    subtitle: 'Backwaters & Nature',
    icon: TreePalm,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    subtitle: 'High Altitude Desert',
    icon: Mountain,
    imageUrl: 'https://images.unsplash.com/photo-1626714100232-dee900af4f48?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'andaman',
    name: 'Andaman',
    subtitle: 'Islands & Scuba',
    icon: Anchor,
    imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'hampi',
    name: 'Hampi',
    subtitle: 'Ruins & Hippie Vibe',
    icon: Landmark,
    imageUrl: 'https://images.unsplash.com/photo-1590050751624-509b8f3e9ee2?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    subtitle: 'Yoga & Adventure',
    icon: Waves,
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    subtitle: 'Paradise on Earth',
    icon: Snowflake,
    imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150a42?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    subtitle: 'Waterfalls & Clouds',
    icon: CloudRain,
    imageUrl: 'https://images.unsplash.com/photo-1600298882525-1ac42413b969?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    subtitle: 'Spiritual Capital',
    icon: Flame,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    subtitle: 'Valleys & Monasteries',
    icon: Mountain,
    imageUrl: 'https://images.unsplash.com/photo-1626686007698-3b453040d092?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'coorg',
    name: 'Coorg',
    subtitle: 'Coffee & Hills',
    icon: Leaf,
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=600&fit=crop&q=80',
  },
  {
    id: 'kutch',
    name: 'Rann of Kutch',
    subtitle: 'White Desert',
    icon: Sun,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=600&fit=crop&q=80',
  },
];

/**
 * Compute destination status dynamically from trip data.
 * - If a destination has an upcoming (future) trip → "upcoming"
 * - If a destination has past (completed) trips → "completed" with count
 * - Otherwise → "explore"
 */
function computeDestinations(tripData?: DestinationGridProps['tripData']): Destination[] {
  const now = new Date();

  return destinationData.map((dest) => {
    if (!tripData || tripData.length === 0) {
      // No trip data — mark known completed destinations
      const knownCompleted: Record<string, number> = {
        amarkantak: 2, mussoorie: 1, haridwar: 1, mainpat: 1, vizag: 1, goa: 1,
      };
      if (knownCompleted[dest.id]) {
        return { ...dest, trips: knownCompleted[dest.id], status: 'completed' as DestinationStatus };
      }
      return { ...dest, trips: 0, status: 'explore' as DestinationStatus };
    }

    // Match trips by destination name (case-insensitive partial match)
    const matchingTrips = tripData.filter(
      (t) => t.destination.toLowerCase().includes(dest.name.toLowerCase()) || dest.name.toLowerCase().includes(t.destination.toLowerCase())
    );

    const upcomingTrips = matchingTrips.filter((t) => new Date(t.startDate) > now && t.status === 'published');
    const pastTrips = matchingTrips.filter((t) => new Date(t.endDate) < now);

    if (upcomingTrips.length > 0) {
      return { ...dest, trips: upcomingTrips.length, status: 'upcoming' as DestinationStatus };
    }
    if (pastTrips.length > 0) {
      return { ...dest, trips: pastTrips.length, status: 'completed' as DestinationStatus };
    }
    return { ...dest, trips: 0, status: 'explore' as DestinationStatus };
  });
}

export function DestinationGrid({ tripData }: DestinationGridProps) {
  const [selectedDest, setSelectedDest] = useState<{name: string, id: string} | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const destinations = computeDestinations(tripData);

  // Sort: upcoming first, then completed, then explore
  const sortedDestinations = [...destinations].sort((a, b) => {
    const order: Record<DestinationStatus, number> = { upcoming: 0, completed: 1, explore: 2 };
    return order[a.status] - order[b.status];
  });

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
      }, 300);
    }
  };

  const handleCardClick = (dest: Destination) => {
    if (dest.status === 'upcoming') {
      document.getElementById("upcoming-trips")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setSelectedDest({ name: dest.name, id: dest.id });
    }
  };

  return (
    <section className="py-16 md:py-28 -mt-[30px] md:mt-0 bg-[var(--color-canvas)] relative z-20 overflow-hidden" style={{ borderRadius: "40px 40px 0 0", borderTop: "1px solid var(--color-border-subtle)", boxShadow: "0 -8px 40px rgba(0,0,0,0.1)" }}>
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="px-3 md:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 md:mb-4 tracking-tight">
          Explore India
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Click on a destination to get notified about our upcoming expeditions.
        </p>
      </div>

      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 gap-3 md:gap-4 snap-x snap-mandatory">
        {sortedDestinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <button
              key={dest.id}
              onClick={() => handleCardClick(dest)}
              className="text-left group relative rounded-xl overflow-hidden border border-border hover:border-foreground/40 transition-all duration-300 hover:-translate-y-1 block active:scale-[0.97] flex-none w-[160px] md:w-[200px] aspect-[3/4] snap-start"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Dark scrim gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/15">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  {/* Status Badges */}
                  {dest.status === 'upcoming' && (
                    <span className="text-[10px] font-bold bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-black shadow-lg border border-white/20 animate-pulse">
                      Upcoming
                    </span>
                  )}
                  {dest.status === 'completed' && dest.trips > 0 && (
                    <span className="text-[10px] font-medium bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-white border border-white/15 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      {dest.trips} Trip{dest.trips > 1 ? 's' : ''}
                    </span>
                  )}
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
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Explore <span className="text-foreground/70">{selectedDest?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Join the exclusive waitlist for {selectedDest?.name}. We&apos;ll email you before we launch new trips here so you can grab early-bird spots!
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">You&apos;re on the list!</h4>
                <p className="text-muted-foreground text-sm mt-1">Keep an eye on your inbox.</p>
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
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
                />
                {status === "error" && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
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
