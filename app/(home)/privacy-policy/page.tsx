import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Lock, Eye } from 'lucide-react';
import BottomTabBar from '@/components/layout/BottomTabBar';

export const metadata: Metadata = {
  title: "Privacy Policy - ConSol Premium Travel",
  description: "Your privacy is paramount. Learn how ConSol protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-400">
              Last Updated: November 2025
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-12">

            {/* Introduction */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Our Commitment
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                At ConSol, we value your trust and are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information when you use our premium travel services. We believe in transparency and giving you full control over your data.
              </p>
            </section>

            {/* Data Collection */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  To provide you with exceptional travel experiences, we may collect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Personal Identification:</strong> Name, email address, phone number, and passport details for booking purposes.</li>
                  <li><strong className="text-white">Travel Preferences:</strong> Dietary requirements, seating preferences, and special assistance needs.</li>
                  <li><strong className="text-white">Payment Information:</strong> Securely processed transaction details (we do not store full credit card numbers).</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Data Security
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We employ state-of-the-art security measures to protect your data from unauthorized access, alteration, or disclosure. All sensitive information is encrypted using industry-standard protocols. Your privacy is our priority, and we never sell your personal data to third parties.
              </p>
            </section>

            {/* Contact */}
            <section className="pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-400 mb-4">
                If you have any questions about our privacy practices, please contact our Data Protection Officer:
              </p>
              <a href="mailto:privacy@consol.com" className="text-gold hover:text-white transition-colors font-semibold">
                privacy@consol.com
              </a>
            </section>

          </div>
        </div>
      </div>

      <Footer />
      <BottomTabBar />

    </div>
  );
}