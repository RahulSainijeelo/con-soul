import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const destinations = [
    { name: "Goa", href: "/past-trips" },
    { name: "Himalayas", href: "/past-trips" },
    { name: "Rajasthan", href: "/past-trips" },
    { name: "Kerala", href: "/past-trips" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Past Trips", href: "/past-trips" },
    { name: "Contact", href: "/contact" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/privacy-policy" },
    { name: "Refund Policy", href: "/privacy-policy" },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10">
      {/* Big Brand Name */}
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center justify-center">
          <h2
            style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif", fontWeight: 900 }}
            className="text-5xl tracking-[0.3rem] md:text-6xl lg:text-[10rem] text-white/5"
          >
            CONSOUL
          </h2>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Destinations */}
          <div>
            <h3
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}
            >
              Destinations
            </h3>
            <ul className="space-y-2.5">
              {destinations.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-brand transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}
            >
              Company
            </h3>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-brand transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}
            >
              Legal
            </h3>
            <ul className="space-y-2.5">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-brand transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-sm font-bold text-white uppercase tracking-wider mb-4"
              style={{ fontFamily: "dirham-symbol-font, Arial, sans-serif" }}
            >
              Get in Touch
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="https://www.instagram.com/consoul.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  @consoul.in
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:hello@con-soul.in"
                  className="text-sm text-gray-400 hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  hello@con-soul.in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges & Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {currentYear} CONSOUL. All rights reserved. | Made with ❤️ for adventurous souls
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Payments via</span>
              {["UPI", "Visa", "Mastercard", "Razorpay"].map((method) => (
                <span
                  key={method}
                  className="text-[10px] text-gray-400 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}