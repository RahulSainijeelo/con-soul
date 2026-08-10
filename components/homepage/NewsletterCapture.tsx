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
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1000);
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#12100a] to-[#0e0c08] relative z-[60] overflow-hidden" style={{ borderRadius: "40px 40px 0 0", marginTop: "-30px", borderTop: "1px solid rgba(255, 215, 0, 0.08)", boxShadow: "0 -8px 30px rgba(0,0,0,0.6)" }}>
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-brand/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg" style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}>
          Never Miss an Adventure
        </h2>
        <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
          Get notified about upcoming trips, exclusive deals, and travel stories
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-8 rounded-2xl bg-brand/10 border border-brand/30 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                <Check size={24} strokeWidth={3} />
              </div>
              <p className="text-white font-medium text-lg">
                You're in! We'll keep you posted.
              </p>
            </div>
          ) : (
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-white/10 rounded-xl md:rounded-l-xl md:rounded-r-none text-white placeholder:text-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand focus:bg-zinc-900 transition-all backdrop-blur-sm"
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="py-4 px-8 bg-brand hover:bg-orange-500 text-white font-bold rounded-xl md:rounded-l-none md:rounded-r-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
              >
                {status === 'submitting' ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Join the Tribe'
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
