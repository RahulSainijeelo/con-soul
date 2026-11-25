import React from 'react';
import { Users, Shield, Sparkles, Network } from 'lucide-react';

export function WhyConsoul() {
  const usps = [
    {
      id: 'cross-institution',
      num: '01',
      title: 'Cross-Campus Synergy',
      description:
        'Engineers, founders, writers, and artists from top institutions across India traveling as equals.',
      icon: Users,
    },
    {
      id: 'verified-safety',
      num: '02',
      title: 'Verified Safety',
      description:
        'Dedicated student trip captains, Force Urbania transport, and 24/7 security protocols for solo travelers.',
      icon: Shield,
    },
    {
      id: 'curated-experiences',
      num: '03',
      title: 'Anti-Tourist Traps',
      description:
        'Secret mountain trails, authentic local food, and rustic stays — zero commercial sightseeing clutter.',
      icon: Sparkles,
    },
    {
      id: 'lifelong-network',
      num: '04',
      title: 'Lifelong Network',
      description:
        'Connect with ambitious peers with diverse mindsets. Return with co-founders, collaborators, and a tribe.',
      icon: Network,
    },
  ];

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-9 md:py-28 bg-[var(--color-canvas)]">
      <div className="mx-auto max-w-[1440px]">
        {/* Header — Editorial vision */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-center lg:gap-16 mb-14">
          <div className="max-w-[920px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-ink-muted)]">
              Why CONSOUL INDIA
            </p>
            <h2 className="max-w-[12ch] text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)]">
              What Sets
              <br />
              Us Apart
            </h2>
          </div>
          <p className="max-w-[400px] text-[16px] font-normal leading-[1.6] text-[var(--color-ink-muted)] lg:justify-self-end">
            We don&apos;t run tourist buses. We curate transformative expeditions where youth from diverse universities and sharp mindsets forge friendships that outlast college.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {usps.map((usp) => {
            const Icon = usp.icon;
            return (
              <article
                key={usp.id}
                className="flex min-h-[280px] flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] p-8 transition duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--color-border-hover)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--color-ink-muted)]">
                    {usp.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-orange-400 border border-foreground/10">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-8 flex flex-1 flex-col">
                  <h3 className="text-[17px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
                    {usp.title}
                  </h3>
                  <p className="mt-4 text-[13px] font-normal leading-[1.65] text-[var(--color-ink-muted)]">
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
