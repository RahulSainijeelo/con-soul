'use client';

import React from 'react';
import { ArrowRight, Sparkles, GraduationCap, Network, Users2 } from 'lucide-react';

const stories = [
  {
    quote:
      "I came from an engineering bubble where everyone thought the same way. Sharing an Urbania with designers from NID and economics grads from DU completely rewired my worldview.",
    name: "Kabir T.",
    institution: "IIT Roorkee",
    trip: "Himalayas Expedition",
  },
  {
    quote:
      "Signed up 100% solo knowing no one. I returned with co-founders for my new startup, lifelong travel buddies, and people I speak with every single week.",
    name: "Ananya D.",
    institution: "SRCC, Delhi University",
    trip: "Goa Coastal Drift",
  },
  {
    quote:
      "The sheer variety of intellect in one circle — medical students, coders, writers — debating under Kasol stars. You can never get this inside a single college campus.",
    name: "Rishabh V.",
    institution: "BITS Pilani",
    trip: "Rajasthan Heritage Trails",
  },
];

const pillars = [
  {
    icon: GraduationCap,
    label: "Cross-Campus Synergy",
    desc: "IITs, NITs, AIIMS, NIFT, DU & top state universities in one batch",
  },
  {
    icon: Network,
    label: "Diverse Mindsets",
    desc: "Tech builders, creatives, doctors & hustlers exchanging perspectives",
  },
  {
    icon: Users2,
    label: "85% Travel Solo",
    desc: "Arrive on your own without awkwardness — leave with a permanent tribe",
  },
];

export function StrangersSection() {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-9 md:py-28 bg-[var(--color-canvas)] border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-[1440px]">
        {/* Header — Editorial Vision */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,460px)] lg:items-center lg:gap-16 mb-14">
          <div className="max-w-[920px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-ink-muted)]">
                The Con-Soul Ecosystem
              </p>
            </div>
            <h2 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-[var(--color-ink)]">
              Different Campuses.
              <br />
              Distinct Minds.
              <br />
              <span className="text-[var(--color-ink-muted)]">One Lifelong Tribe.</span>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="text-[16px] font-normal leading-[1.65] text-[var(--color-ink-muted)]">
              Break out of your daily college bubble. On every CONSOUL expedition, curious minds from different institutions, diverse tiers, and contrasting disciplines collide over Himalayan campfires and coastal dawns.
            </p>
            <p className="mt-4 text-[14px] font-medium text-[var(--color-ink-muted)] leading-relaxed border-l-2 border-orange-500/70 pl-4">
              We start as unfamiliar faces from across the nation; we return as an elite network of lifelong co-travelers and friends.
            </p>
          </div>
        </div>

        {/* Cross-Institution Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] p-5"
              >
                <div className="w-11 h-11 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/10 text-orange-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--color-ink)]">
                    {item.label}
                  </h4>
                  <p className="text-[12px] text-[var(--color-ink-muted)] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stories.map((story, i) => (
            <div
              key={i}
              className="flex min-h-[280px] flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] p-8 transition duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--color-border-hover)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--color-ink-muted)]">
                  0{i + 1}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded bg-foreground/5 text-orange-400 border border-orange-500/20">
                  {story.institution}
                </span>
              </div>

              <p className="mt-6 text-[15px] font-medium leading-[1.7] text-[var(--color-ink)] flex-1">
                &ldquo;{story.quote}&rdquo;
              </p>

              <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {story.name}
                  </p>
                  <p className="text-[11px] font-medium text-[var(--color-ink-muted)] mt-0.5 uppercase tracking-[0.1em]">
                    {story.trip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-[13px] font-medium text-[var(--color-ink-muted)] mb-5 uppercase tracking-[0.15em]">
            50+ Colleges • 300+ Solo Travelers • Zero Awkwardness
          </p>
          <a
            href="/#trip-cards"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-canvas)] transition-transform duration-300 hover:scale-[1.03]"
          >
            Explore Next Batches
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
