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
                  Key Policy Notice: Non-Refundable Registration
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  The trip registration fee is <strong className="text-gold font-semibold">strictly non-refundable within 15 days prior to the scheduled departure date</strong>. Because train/transport tickets, accommodation allotments, and ground logistics are pre-booked and locked with third-party vendors well in advance, we cannot issue registration refunds for cancellations made inside this 15-day window.
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
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* More than 15 days */}
                <div className="bg-black/40 border border-green-500/20 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-bl-lg">
                    Eligible
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    More than 15 Days Before Departure
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    If you notify us of cancellation more than 15 days before the trip start date:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>Full remaining balance refunded (if paid in full).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>Registration fee can be transferred to a future CONSOUL trip or refunded minus standard administrative/banking charges.</span>
                    </li>
                  </ul>
                </div>

                {/* 15 days or less */}
                <div className="bg-black/40 border border-red-500/20 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-bl-lg">
                    Non-Refundable
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    15 Days or Less Prior to Departure
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    If cancelled within 15 days of the scheduled departure date:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong className="text-white">Registration fee is 100% non-refundable.</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">ℹ</span>
                      <span>Any uncommitted non-transport portions of full payments may be evaluated on a case-by-case basis.</span>
                    </li>
                  </ul>
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
