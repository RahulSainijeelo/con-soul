'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Mountain,
  Compass,
  TreePalm,
  CloudRain,
  Anchor,
  Landmark,
  Loader2,
  CheckCircle2,
  Flame,
  Waves,
  Sun,
  Leaf,
  Snowflake,
  Check,
  Send,
  ArrowRight,
} from 'lucide-react';
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

// Destination cards with verified active images (local high-res assets replace previously 404 external photos)
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
    imageUrl: '/images/destinations/haridwar.jpg',
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
    imageUrl: '/images/destinations/spiti.jpg',
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
    imageUrl: '/images/destinations/hampi.jpg',
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
    imageUrl: '/images/destinations/kashmir.jpg',
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    subtitle: 'Waterfalls & Clouds',
    icon: CloudRain,
    imageUrl: '/images/destinations/meghalaya.jpg',
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
    imageUrl: '/images/destinations/sikkim.jpg',
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
 * - If a destination has an upcoming (future) trip -> "upcoming"
 * - If a destination has past (completed) trips -> "completed" with count
 * - Otherwise -> "explore"
 */
function computeDestinations(tripData?: DestinationGridProps['tripData']): Destination[] {
  const now = new Date();

  return destinationData.map((dest) => {
    if (!tripData || tripData.length === 0) {
      const knownCompleted: Record<string, number> = {
        amarkantak: 2, mussoorie: 1, haridwar: 1, mainpat: 1, vizag: 1, goa: 1,
      };
      if (knownCompleted[dest.id]) {
        return { ...dest, trips: knownCompleted[dest.id], status: 'completed' as DestinationStatus };
      }
      return { ...dest, trips: 0, status: 'explore' as DestinationStatus };
    }

    const matchingTrips = tripData.filter((t) => {
      const d = (t.destination || '').toLowerCase();
      const name = dest.name.toLowerCase();
      if (dest.id === 'himalayas') {
        return d.includes('himalay') || d.includes('manali') || d.includes('kasol') || d.includes('sissu');
      }
      return d.includes(name) || name.includes(d);
    });

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
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const destinations = computeDestinations(tripData);

  // Sort: upcoming first, then completed, then explore
  const sortedDestinations = [...destinations].sort((a, b) => {
    const order: Record<DestinationStatus, number> = { upcoming: 0, completed: 1, explore: 2 };
    return order[a.status] - order[b.status];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !suggestion.trim() || !selectedDest) return;

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/trip-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: selectedDest.name,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          suggestion: suggestion.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to send suggestion");

      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Could not submit your suggestion. Please try again.");
      setStatus("error");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedDest(null);
      setTimeout(() => {
        setStatus("idle");
        setName("");
        setEmail("");
        setPhone("");
        setSuggestion("");
        setErrorMsg("");
      }, 300);
    }
  };

  const handleCardClick = (dest: Destination) => {
    setSelectedDest(dest);
  };

  return (
    <section
      className="py-16 md:py-28 -mt-[30px] md:mt-0 bg-[var(--color-canvas)] relative z-20 overflow-hidden"
      style={{ borderRadius: "40px 40px 0 0", borderTop: "1px solid var(--color-border-subtle)", boxShadow: "0 -8px 40px rgba(0,0,0,0.1)" }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="px-3 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 md:mb-4 tracking-tight">
            Explore India
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Click on any location to suggest a trip you&apos;d like us to curate — we plan upcoming batches around your ideas.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 gap-3 md:gap-4 snap-x snap-mandatory">
          {sortedDestinations.map((dest) => {
            const Icon = dest.icon;
            const imgBroken = failedImages[dest.id];
            return (
              <button
                key={dest.id}
                onClick={() => handleCardClick(dest)}
                className="text-left group relative rounded-xl overflow-hidden border border-border hover:border-foreground/40 transition-all duration-300 hover:-translate-y-1 block active:scale-[0.97] flex-none w-[160px] md:w-[200px] aspect-[3/4] snap-start bg-zinc-900"
              >
                {/* Background Image with graceful fallback */}
                <div className="absolute inset-0">
                  {!imgBroken ? (
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      onError={() => setFailedImages((prev) => ({ ...prev, [dest.id]: true }))}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
                      <Icon size={40} className="text-white/25" />
                    </div>
                  )}
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
                    <p className="text-xs text-zinc-100 font-medium drop-shadow-md line-clamp-1">
                      {dest.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Trip Suggestion Modal */}
        <Dialog open={!!selectedDest} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Suggest a Trip to <span className="text-orange-500">{selectedDest?.name}</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Share your trip idea for {selectedDest?.name}. Your request goes straight to our planning team so we can build the right itinerary for you!
              </DialogDescription>
            </DialogHeader>

            {selectedDest?.status === 'upcoming' && status !== 'success' && (
              <div className="rounded-xl bg-orange-500/10 border border-orange-500/25 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="text-foreground font-medium">A live trip here is open now!</span>
                <Link
                  href="#upcoming-trips"
                  onClick={() => setSelectedDest(null)}
                  className="inline-flex items-center gap-1 font-bold text-orange-500 hover:underline shrink-0"
                >
                  View Trips <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Suggestion Sent!</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Our team has received your {selectedDest?.name} trip request via email and will plan around what travelers want most.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
                <div>
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Your email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp / Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                </div>
                <div>
                  <textarea
                    placeholder={`What would you love in your ${selectedDest?.name} trip? (Preferred month, duration, budget, spots to cover...) *`}
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    required
                    minLength={5}
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                  />
                  {status === "error" && (
                    <p className="text-red-500 text-xs mt-1.5">{errorMsg}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 text-sm"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Trip Suggestion
                </button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
