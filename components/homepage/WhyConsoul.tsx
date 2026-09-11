'use client';

import React from 'react';
import { Users, Shield, Sparkles, Heart } from 'lucide-react';

export function WhyConsoul() {
  const usps = [
    {
      id: 'small-groups',
      num: '01',
      title: 'Small Groups',
      description: 'Intimate groups of 15-20 travelers for authentic connections and real friendships.',
      icon: Users,
    },
    {
      id: 'safe-secure',
      num: '02',
      title: 'Safe & Secure',
      description: 'Professional trip leaders, 24/7 support, and comprehensive safety protocols on every trip.',
      icon: Shield,
    },
    {
      id: 'curated-experiences',
      num: '03',
      title: 'Curated Experiences',
      description: 'Handpicked stays, local food, offbeat trails — no cookie-cutter itineraries.',
      icon: Sparkles,
    },
    {
      id: 'community-first',
      num: '04',
      title: 'Community First',
      description: "Join 300+ young travelers who've found their tribe on the road with us.",
      icon: Heart,
    },
  ];

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-9 md:py-28 bg-[var(--color-canvas)]">
      <div className="mx-auto max-w-[1440px]">
        {/* Header — Femur editorial style */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-center lg:gap-16 mb-14">
          <div className="max-w-[920px]">
            <p className="mb-5 text-[11px] font-normal uppercase tracking-[0.32em] text-[var(--color-ink-faint)]">
              Why CONSOUL INDIA
            </p>
            <h2 className="max-w-[12ch] text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)]">
              What Makes
              <br />
              Us Different
            </h2>
          </div>
          <p className="max-w-[400px] text-[16px] font-normal leading-[1.6] text-[var(--color-ink-muted)] lg:justify-self-end">
            We don&apos;t just organise trips. We build communities on the road — with safety, soul, and experiences that stay with you long after you&apos;re home.
          </p>
        </div>

        {/* Cards — Femur style */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {usps.map((usp) => {
            const Icon = usp.icon;
            return (
              <article
                key={usp.id}
                className="flex min-h-[280px] flex-col rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] p-8 transition duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--color-border-hover)]"
              >
                <span className="text-[11px] font-normal uppercase tracking-[0.32em] text-[var(--color-ink-faint)]">
                  {usp.num}
                </span>
                <div className="mt-10 flex flex-1 flex-col">
                  <h3 className="max-w-[14ch] text-[20px] font-semibold uppercase leading-[1] tracking-[-0.03em] text-[var(--color-ink)]">
                    {usp.title}
                  </h3>
                  <p className="mt-5 max-w-[30ch] text-[14px] font-normal leading-[1.7] text-[var(--color-ink-muted)]">
                    {usp.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
