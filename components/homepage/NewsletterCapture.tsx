'use client';

import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';

export function NewsletterCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-9 md:py-28 bg-[var(--color-canvas)] border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center lg:gap-16">
          <div className="max-w-[920px]">
            <p className="mb-5 text-[11px] font-normal uppercase tracking-[0.32em] text-[var(--color-ink-faint)]">
              Stay Updated
            </p>
            <h2 className="max-w-[10ch] text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)]">
              Never Miss
              <br />
              An Adventure
            </h2>
          </div>
          <p className="max-w-[400px] text-[16px] font-normal leading-[1.6] text-[var(--color-ink-muted)] lg:justify-self-end">
            Get notified about upcoming trips, exclusive deals, and travel stories from the CONSOUL INDIA community.
          </p>
        </div>

        <div className="mt-14 max-w-lg">
          <form onSubmit={handleSubmit}>
            {status === 'success' ? (
              <div className="flex items-center gap-4 py-6 border-t border-[var(--color-border-subtle)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-ink)] flex items-center justify-center text-[var(--color-canvas)]">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                <p className="text-[16px] font-medium text-[var(--color-ink)]">
                  You&apos;re in! We&apos;ll keep you posted.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 border-t border-[var(--color-border-subtle)] pt-8">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-0 py-3 bg-transparent border-b border-[var(--color-border-subtle)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-ink)] transition-colors text-[15px]"
                    required
                    disabled={status === 'submitting'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="py-3 px-8 bg-[var(--color-ink)] text-[var(--color-canvas)] font-normal text-[11px] uppercase tracking-[0.15em] rounded-full transition-all duration-300 hover:scale-[1.03] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  {status === 'submitting' ? (
                    <span className="w-4 h-4 border-2 border-[var(--color-canvas)]/30 border-t-[var(--color-canvas)] rounded-full animate-spin" />
                  ) : (
                    'Join the Tribe'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
