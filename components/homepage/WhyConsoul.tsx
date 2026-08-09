'use client';

import React from 'react';
import { Users, Shield, Sparkles, Heart } from 'lucide-react';

export function WhyConsoul() {
  const usps = [
    {
      id: 'small-groups',
      title: 'Small Groups',
      description: 'Intimate groups of 15-20 travelers for authentic connections',
      icon: Users,
    },
    {
      id: 'safe-secure',
      title: 'Safe & Secure',
      description: 'Professional trip leaders, 24/7 support, and comprehensive safety protocols',
      icon: Shield,
    },
    {
      id: 'curated-experiences',
      title: 'Curated Experiences',
      description: 'Handpicked stays, local food, offbeat trails — no cookie-cutter itineraries',
      icon: Sparkles,
    },
    {
      id: 'community-first',
      title: 'Community First',
      description: "Join 300+ young travelers who've found their tribe on the road",
      icon: Heart,
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-black relative z-30" style={{ borderRadius: "40px 40px 0 0", marginTop: "-30px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}>
            Why Travel With CONSOUL
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            What makes us different
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp) => {
            const Icon = usp.icon;
            return (
              <div 
                key={usp.id}
                className="group p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-brand/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(234,88,12,0.2)]"
              >
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 text-brand group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {usp.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
