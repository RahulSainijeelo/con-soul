import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/consoul29", label: "Instagram" },
  ];

  return (
    <footer className="bg-black text-white border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:py-16 py-8">
        <div className="flex items-center justify-center">
          <h2 style={{ fontFamily: 'var(--heading-bold)' }} className="text-5xl tracking-[0.5rem] md:text-6xl lg:text-[12rem] font-display font-black text-gold/20">
            CON-SOUL
          </h2>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} Consol. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold transition-colors flex gap-1 align-baseline"
                    aria-label={social.label}
                  >
                    <span className="self-center"><Icon className="h-5 w-5" /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}