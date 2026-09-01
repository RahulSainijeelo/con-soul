import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText, ShieldCheck, AlertCircle, Scale, Clock, Phone } from 'lucide-react';
import BottomTabBar from '@/components/layout/BottomTabBar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Terms & Conditions — CONSOUL Travel",
  description: "Read CONSOUL Travel's terms and conditions, booking agreements, participant guidelines, and travel policies.",
  alternates: {
    canonical: 'https://con-soul.in/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Legal Agreement
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gold mb-6">
              Terms & Conditions
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              Please read these terms carefully before booking any CONSOUL journey.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-12">

            {/* 1. Introduction */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Scale className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  1. Agreement to Terms
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-base">
                By accessing our website (<strong className="text-white">con-soul.in</strong>) or booking any trip, experience, or package with <strong className="text-white">CONSOUL Travel</strong>, you agree to be bound by these Terms and Conditions, our Privacy Policy, and our Cancellation & Refund Policy. If you do not agree with any part of these terms, please do not use our services or complete a booking.
              </p>
            </section>

            {/* 2. Bookings & Payments */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  2. Booking & Payment Terms
                </h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
                <p>
                  • <strong className="text-white">Registration Deposit:</strong> A spot may be reserved by paying the required advance registration fee. Your booking status will remain <span className="text-amber-400 font-semibold">Registration Confirmed</span> until full settlement.
                </p>
                <p>
                  • <strong className="text-white">Full Settlement:</strong> The remaining balance of the trip amount must be completed through the "My Trips" dashboard or official CONSOUL channels prior to the trip departure date.
                </p>
                <p>
                  • <strong className="text-white">Payment Security:</strong> Online payments are processed securely through certified payment gateways (Razorpay) with 256-bit SSL encryption. CONSOUL does not store sensitive card or banking credentials.
                </p>
              </div>
            </section>

            {/* 3. Cancellation & Refund Summary */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  3. Cancellation & Non-Refundable Policy
                </h2>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 mb-4">
                <p className="text-sm md:text-base text-gray-200">
                  ⚠️ <strong className="text-gold">Cancellation &amp; Registration Refund Tiers:</strong>
                </p>
                <ul className="text-xs md:text-sm text-gray-300 space-y-1 pl-4 list-disc">
                  <li><strong className="text-white">&gt; 15 Days Prior:</strong> Full balance refund / 100% credit transfer.</li>
                  <li><strong className="text-white">15 to 10 Days Prior:</strong> Only <strong className="text-gold">10% of the registration fee</strong> is refundable (90% retained for vendor bookings).</li>
                  <li><strong className="text-white">&lt; 10 Days Prior:</strong> Registration fee is <strong className="text-red-400">100% non-refundable</strong>.</li>
                </ul>
              </div>
              <p className="text-gray-400 text-sm">
                For complete cancellation rules, timeline details, and transfer options, please refer to our dedicated{" "}
                <Link href="/refund-policy" className="text-gold hover:underline font-semibold">
                  Cancellation & Refund Policy →
                </Link>
              </p>
            </section>

            {/* 4. Passenger Verification & Code of Conduct */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  4. Traveler Identification & Conduct
                </h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
                <p>
                  • <strong className="text-white">Government ID:</strong> A valid government-issued ID (Aadhaar Card / Voter ID / Passport) is mandatory for all travelers for train ticket verification and resort check-ins.
                </p>
                <p>
                  • <strong className="text-white">Community Code of Conduct:</strong> CONSOUL creates inclusive, safe travel communities. Any harassment, abusive behavior, illegal substance possession, or disruptive conduct may result in immediate dismissal from the tour without any refund.
                </p>
                <p>
                  • <strong className="text-white">Health & Fitness:</strong> Travelers are responsible for ensuring they are in adequate physical health for the designated trip itinerary and difficulty rating.
                </p>
              </div>
            </section>

            {/* 5. Itinerary Adjustments & Unforeseen Delays */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  5. Itinerary & Train Delays
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                While we make every effort to adhere strictly to published itineraries, travel routes may be modified by the tour coordinators due to train delays, weather conditions, local authority advisories, or road blocks to prioritize passenger safety. CONSOUL is not liable for secondary expenses resulting from train or flight schedule delays beyond our reasonable control.
              </p>
            </section>

            {/* 6. Support & Contact */}
            <section className="pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold text-white">
                  Contact & Support
                </h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                If you have questions regarding our terms, bookings, or policies, please reach out to our team:
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <button className="bg-gold hover:bg-yellow-600 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                    Contact Us
                  </button>
                </Link>
                <a
                  href="mailto:mail@con-soul.in"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-gold px-6 py-2.5 rounded-xl text-white hover:text-gold transition-colors text-sm"
                >
                  mail@con-soul.in
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
