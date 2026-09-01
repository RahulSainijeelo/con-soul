import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldAlert, Calendar, Clock, RotateCcw, HelpCircle } from 'lucide-react';
import BottomTabBar from '@/components/layout/BottomTabBar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — CONSOUL Travel",
  description: "Understand CONSOUL's booking cancellation and refund policy. Learn about the 15-day non-refundable registration timeline and refund terms.",
  alternates: {
    canonical: 'https://con-soul.in/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Booking Terms
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gold mb-6">
              Cancellation & Refund Policy
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              Clear, transparent guidelines on bookings, cancellations, and refunds.
            </p>
          </div>

          {/* Policy Overview Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-white/5 to-transparent border border-amber-500/30 rounded-2xl p-6 md:p-8 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Key Registration Refund Policy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  For cancellations made <strong className="text-gold font-semibold">between 15 days and 10 days prior to departure</strong>, only <strong className="text-gold font-semibold">10% of the registration amount is refundable</strong> (90% is retained for advance vendor commitments). For cancellations made <strong className="text-red-400 font-semibold">less than 10 days prior to departure</strong>, the registration fee is <strong className="text-red-400 font-semibold">100% strictly non-refundable</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-12">

            {/* Timeline Breakdown */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Cancellation Timeline & Refund Structure
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-5 mt-6">
                {/* Tier 1: > 15 days */}
                <div className="bg-black/40 border border-green-500/20 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-green-500/20 text-green-400 text-[11px] font-bold rounded-bl-lg">
                    Full Refund / Transfer
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      &gt; 15 Days Prior
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Cancellations made more than 15 days before the departure date:
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5">
                        <span className="text-green-400 font-bold">✓</span>
                        <span>Full registration &amp; trip balance refund (minus nominal bank fees).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-green-400 font-bold">✓</span>
                        <span>100% credit transfer to any future trip.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-green-400">
                    Refund: 100% of balance
                  </div>
                </div>

                {/* Tier 2: 15 to 10 days */}
                <div className="bg-black/40 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded-bl-lg">
                    10% Refundable
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      15 to 10 Days Prior
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Cancellations made between 15 days and 10 days before departure:
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">ℹ</span>
                        <span><strong className="text-white">Only 10% of registration fee is refunded</strong> (90% retained for vendor bookings).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-green-400 font-bold">✓</span>
                        <span>Full refund of remaining balance (if paid in full).</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-amber-400">
                    Refund: 10% Registration Fee
                  </div>
                </div>

                {/* Tier 3: < 10 days */}
                <div className="bg-black/40 border border-red-500/30 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-red-500/20 text-red-400 text-[11px] font-bold rounded-bl-lg">
                    Non-Refundable
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      &lt; 10 Days Prior
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Cancellations made less than 10 days before departure:
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold">✕</span>
                        <span><strong className="text-white">0% Registration Refund.</strong> Non-refundable and non-transferable.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-gray-400 font-bold">•</span>
                        <span>Train tickets and hotel blocks cannot be cancelled at this stage.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-red-400">
                    Refund: 0% (Non-Refundable)
                  </div>
                </div>
              </div>
            </section>

            {/* Why This Policy Exists */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Why Registration Is Locked 15 Days Prior
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-base mb-4">
                CONSOUL experiences are carefully curated boutique group tours with strictly limited seats. To maintain fair pricing and guarantee seamless journeys:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Train tickets (IRCTC 3AC / Sleeper) and private transport are booked under individual passenger names in advance.</li>
                <li>Resort rooms and boutique hotel blocks are secured with non-refundable deposits.</li>
                <li>Cruise passes, permits, and private guides are confirmed per head count.</li>
              </ul>
            </section>

            {/* Trip Cancellation by CONSOUL */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Cancellations by CONSOUL / Unforeseen Events
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                In the rare event that a trip is cancelled by CONSOUL due to severe weather, natural disasters, or unforeseen operational constraints, travelers will be offered a <strong className="text-white">100% full refund</strong> or a <strong className="text-white">100% credit transfer</strong> to any future trip of their choice.
              </p>
            </section>

            {/* Contact & Support */}
            <section className="pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-3">
                Questions or Cancellation Requests?
              </h2>
              <p className="text-gray-400 mb-6">
                To request a cancellation or discuss your booking, please reach out with your Booking ID:
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <button className="bg-gold hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors">
                    Contact Support
                  </button>
                </Link>
                <a
                  href="mailto:mail@con-soul.in"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-gold px-6 py-3 rounded-xl text-white hover:text-gold transition-colors"
                >
                  Email: mail@con-soul.in
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
