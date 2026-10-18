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
    <section className="relative overflow-hidden px-5 py-20 md:px-12 md:py-28 bg-[var(--color-canvas)] border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left Column: Heading */}
          <div>
            <span className="inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-ink-muted)]">
              Stay Updated
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] text-[var(--color-ink)]">
              Never Miss<br />
              <span className="opacity-80">An Adventure</span>
            </h2>
          </div>

          {/* Right Column: Text & Integrated Email Form */}
          <div className="space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Get notified about upcoming trips, exclusive early-bird discounts, and travel stories from the CONSOUL INDIA community.
            </p>

            <form onSubmit={handleSubmit} className="w-full">
              {status === 'success' ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <p className="text-sm font-semibold">
                    You&apos;re in! We&apos;ll notify you when new trips drop.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl sm:rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-raised)] shadow-sm focus-within:border-[var(--color-ink)] transition-colors">
                  <div className="relative flex-1 flex items-center pl-4 pr-2">
                    <Mail className="w-4 h-4 text-[var(--color-ink-muted)] flex-shrink-0 mr-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full py-2.5 bg-transparent text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none text-sm"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="py-3 px-7 bg-[var(--color-ink)] text-[var(--color-canvas)] font-bold text-xs uppercase tracking-wider rounded-xl sm:rounded-full transition-all duration-300 hover:opacity-90 disabled:opacity-60 flex items-center justify-center whitespace-nowrap cursor-pointer shadow-sm active:scale-95"
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

            <p className="text-xs font-medium text-[var(--color-ink-muted)]">
              No spam, ever. Unsubscribe with one click anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
