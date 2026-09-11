'use client';

import React from 'react';
import { ArrowRight, Heart, Laugh, Camera } from 'lucide-react';

const stories = [
  {
    quote: "We were 15 strangers at the airport. By day 3, we were a family. That's the CONSOUL INDIA magic.",
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
    <section className="relative overflow-hidden px-5 py-24 md:px-9 md:py-28 bg-[var(--color-canvas)] border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-[1440px]">
        {/* Header — Femur editorial */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-center lg:gap-16 mb-14">
          <div className="max-w-[920px]">
            <p className="mb-5 text-[11px] font-normal uppercase tracking-[0.32em] text-[var(--color-ink-faint)]">
              Strangers → Friends → Family
            </p>
            <h2 className="max-w-[12ch] text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)]">
              We Start As
              <br />
              Strangers
            </h2>
          </div>
          <p className="max-w-[400px] text-[16px] font-normal leading-[1.6] text-[var(--color-ink-muted)] lg:justify-self-end">
            Every CONSOUL INDIA trip begins with unfamiliar faces and ends with unbreakable bonds. Solo traveler? You won&apos;t be solo for long.
          </p>
        </div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stories.map((story, i) => (
            <div
              key={i}
              className="flex min-h-[260px] flex-col rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] p-8 transition duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--color-border-hover)]"
            >
              <span className="text-[11px] font-normal uppercase tracking-[0.32em] text-[var(--color-ink-faint)]">
                0{i + 1}
              </span>

              <p className="mt-8 text-[15px] font-normal leading-[1.7] text-[var(--color-ink-muted)] flex-1">
                &ldquo;{story.quote}&rdquo;
              </p>

              <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
                <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                  {story.name}
                </p>
                <p className="text-[12px] text-[var(--color-ink-faint)] mt-1 uppercase tracking-[0.1em]">
                  {story.trip}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-[13px] text-[var(--color-ink-faint)] mb-5 uppercase tracking-[0.15em]">
            300+ solo travelers have found their tribe
          </p>
          <a
            href="/past-trips"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-[11px] font-normal uppercase tracking-[0.15em] text-[var(--color-canvas)] transition-transform duration-300 hover:scale-[1.03]"
          >
            Join the next trip
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
