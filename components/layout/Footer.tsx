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
      <div className="flex flex-1 flex-col items-center justify-center text-center px-5 py-24 md:py-32">
        <div className="text-[clamp(2.5rem,8vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
          <div>YOUR NEXT</div>
          <div className="text-transparent" style={{ WebkitTextStroke: '1.5px currentColor', opacity: 0.65 }}>
            ADVENTURE AWAITS
          </div>
        </div>
        <Link
          href="/past-trips"
          className="mt-10 rounded-full bg-foreground px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-background transition-all duration-300 hover:scale-[1.03] shadow-md"
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