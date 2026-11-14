import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

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
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  return (
    <footer className="bg-background text-foreground transition-colors duration-300">
      {/* Big CTA — Femur style */}
      <div className="relative overflow-hidden flex flex-1 flex-col items-center justify-center text-center px-5 py-24 md:py-32">
        {/* Large "CONSOUL INDIA" background watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-black uppercase whitespace-nowrap"
            style={{
              fontSize: "clamp(4.5rem, 16vw, 15rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "1px var(--color-border-subtle, rgba(255, 255, 255, 0.08))",
              opacity: 0.8,
            }}
          >
            CONSOUL INDIA
          </span>
        </div>

        {/* Heading */}
        <div className="relative z-10 text-[clamp(2.5rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] select-none">
          <div>YOUR NEXT</div>
          <div
            className="mt-1 md:mt-2"
            style={{
              WebkitTextStroke: "1.5px var(--color-ink, currentColor)",
              WebkitTextFillColor: "transparent",
              opacity: 0.75,
            }}
          >
            ADVENTURE AWAITS
          </div>
        </div>

        {/* Explore Trips Button */}
        <Link
          href="/#trip-cards"
          className="relative z-10 mt-9 rounded-full bg-foreground px-8 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-background transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg cursor-pointer"
        >
          EXPLORE TRIPS →
        </Link>
      </div>

      {/* Footer Grid */}
      <div className="border-t border-border px-5 md:px-9 py-16">
        <div className="mx-auto max-w-[1440px] grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Destinations */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground mb-5">
              Destinations
            </h3>
            <ul className="space-y-3">
              {destinations.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground mb-5">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.instagram.com/consoul.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram ↗
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:con.sol.082025@gmail.com"
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  info@consoul.in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border px-5 md:px-9 py-5">
        <div className="mx-auto max-w-[1440px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[12px] uppercase tracking-[0.08em] font-medium text-muted-foreground">
          <span>© {currentYear} CONSOUL INDIA</span>
          <span>con-soul.in</span>
          <div className="flex items-center gap-3">
            <span>Payments:</span>
            {["UPI", "Visa", "Mastercard", "Razorpay"].map((method) => (
              <span
                key={method}
                className="text-[11px] font-semibold text-foreground/80 border border-border rounded px-2.5 py-0.5 bg-foreground/5"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}