'use client';

import React from 'react';
import { Users, ArrowRight, Heart, Laugh, Camera } from 'lucide-react';

const stories = [
  {
    quote: "We were 15 strangers at the airport. By day 3, we were a family. That's the CONSOUL magic.",
    name: "Arjun M.",
    trip: "Himalayas, 2025",
    icon: Heart,
  },
  {
    quote: "I signed up solo, scared and excited. Came back with 12 new best friends and a lifetime of memories.",
    name: "Priya S.",
    trip: "Goa, 2025",
    icon: Laugh,
  },
  {
    quote: "The best part wasn't the mountains or the sunsets — it was the people I shared them with.",
    name: "Rahul K.",
    trip: "Rajasthan, 2024",
    icon: Camera,
  },
];

export function StrangersSection() {
  return (
    <section className="py-24 md:py-28 -mt-[30px] md:mt-0 bg-gradient-to-b from-[#0f0a12] to-[#0a080d] relative z-40 overflow-hidden" style={{ borderRadius: "40px 40px 0 0", borderTop: "1px solid rgba(168, 85, 247, 0.08)", boxShadow: "0 -8px 30px rgba(0,0,0,0.6)" }}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-5">
            <Users className="h-4 w-4 text-brand" />
            <span className="text-brand text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
              Strangers → Friends → Family
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight"
            style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}
          >
            We Start as <span className="text-brand">Strangers</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Every CONSOUL trip begins with unfamiliar faces and ends with unbreakable bonds. 
            Solo traveler? You won&apos;t be solo for long.
          </p>
        </div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {stories.map((story, i) => {
            const Icon = story.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl p-6 md:p-7 border border-white/5 hover:border-brand/20 transition-all duration-500 active:scale-[0.98]"
                style={{ background: "linear-gradient(145deg, #141414 0%, #0d0d0d 100%)" }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-brand" />
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                  &ldquo;{story.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {story.name}
                    </p>
                    <p className="text-gray-500 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {story.trip}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 md:mt-14">
          <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            300+ solo travelers have found their tribe with us
          </p>
          <a
            href="/trips"
            className="inline-flex items-center gap-2 text-brand hover:text-brand/80 font-semibold text-sm transition-colors active:scale-95"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Join the next trip
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
