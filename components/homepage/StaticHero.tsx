"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TrustStrip } from "./TrustStrip";
import Image from "next/image";

const CONSOUL_LETTERS = ["C", "O", "N", "S", "O", "U", "L", " ", "I", "N", "D", "I", "A"];
const TAGLINE = "EVERY JOURNEY NEEDS DIRECTION";
const DISCOVER_TEXT = "Discover Your Next Adventure";

/**
 * Cinematic intro hero — Femur-style monochromatic.
 *
 * Sequence:
 *   Phase 0  (0ms)     – dark, background fades in
 *   Phase 1  (300ms)   – CONSOUL INDIA letters reveal staggered (centered)
 *   Phase 2  (2200ms)  – accent line + tagline starts typing
 *   Phase 3  (4500ms)  – tagline finished, brief pause
 *   Phase 4  (5500ms)  – CONSOUL + tagline slowly dim/vanish together
 *   Phase 5  (7000ms)  – "Discover Your Next Adventure" types in center
 *   Phase 6  (9500ms)  – scroll indicator + trust strip appear
 */
export function StaticHero() {
  const [phase, setPhase] = useState(0);
  const [taglineChars, setTaglineChars] = useState(0);
  const [discoverChars, setDiscoverChars] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 4500);
    const t4 = setTimeout(() => setPhase(4), 5500);
    const t5 = setTimeout(() => setPhase(5), 7000);
    const t6 = setTimeout(() => setPhase(6), 9500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
  }, []);

  // Tagline typing (phase 2 → 3)
  useEffect(() => {
    if (phase < 2) return;
    if (taglineChars >= TAGLINE.length) return;

    const interval = setInterval(() => {
      setTaglineChars((prev) => {
        if (prev >= TAGLINE.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [phase, taglineChars]);

  // "Discover Your Next Adventure" typing (phase 5)
  useEffect(() => {
    if (phase < 5) return;
    if (discoverChars >= DISCOVER_TEXT.length) return;

    const interval = setInterval(() => {
      setDiscoverChars((prev) => {
        if (prev >= DISCOVER_TEXT.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 55);

    return () => clearInterval(interval);
  }, [phase, discoverChars]);

  const scrollToTrips = () => {
    document.getElementById("trip-cards")?.scrollIntoView({ behavior: "smooth" });
  };

  const brandVisible = phase >= 1 && phase < 4;
  const brandFading = phase >= 4;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center select-none">
      {/* ── Background Image ── */}
      <div
        className="absolute inset-0 z-0 transition-opacity"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transitionDuration: "2000ms",
        }}
      >
        <Image
          src="/images/hero-bg.jpg"
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      {/* ── CONSOUL INDIA + Tagline (fades away after tagline completes) ── */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pb-[15vh] md:pb-0"
        style={{
          opacity: brandFading ? 0 : brandVisible ? 1 : 0,
          transition: "opacity 1500ms ease-out",
        }}
      >
        {/* Accent line — white, not orange */}
        <div
          className="h-[2px] bg-white/40 mb-6 transition-all ease-out"
          style={{
            width: phase >= 2 ? "80px" : "0",
            opacity: phase >= 2 ? 1 : 0,
            transitionDuration: "900ms",
          }}
        />

        {/* CONSOUL INDIA letters — Inter extrabold */}
        <h1 className="flex justify-center overflow-hidden whitespace-nowrap" aria-label="CONSOUL INDIA">
          {CONSOUL_LETTERS.map((letter, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                fontSize: "clamp(2rem, 7.5vw, 9rem)",
                lineHeight: 0.92,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                opacity: letter === " " ? 1 : (phase >= 1 ? 1 : 0),
                transform: letter === " " ? "none" : (phase >= 1 ? "translateY(0)" : "translateY(80px) scaleY(0.7)"),
                transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${400 + i * 120}ms`,
                textShadow: letter === " " ? "none" : "0 4px 30px rgba(0,0,0,0.8)",
                width: letter === " " ? "0.25em" : "auto",
                textTransform: "uppercase" as const,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>

        {/* Tagline — white muted, uppercase tracking */}
        <p
          className="mt-4 font-normal uppercase"
          style={{
            fontSize: "clamp(0.6rem, 1.1vw, 0.85rem)",
            letterSpacing: "0.24em",
            minHeight: "1.5em",
            color: "rgba(255,255,255,0.40)",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
        >
          {TAGLINE.slice(0, taglineChars)}
          {phase >= 2 && taglineChars < TAGLINE.length && (
            <span className="inline-block w-[2px] h-[1em] bg-white/40 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>

      {/* ── "YOUR NEXT ADVENTURE AWAITS" — appears AFTER CONSOUL vanishes ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 pb-[15vh] md:pb-0"
        style={{
          opacity: phase >= 5 ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      >
        <h2
          className="font-black uppercase tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)",
            lineHeight: 0.95,
            color: "#ffffff",
            textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          }}
        >
          YOUR NEXT
        </h2>
        <h2
          className="font-black uppercase tracking-tight mt-1 md:mt-2"
          style={{
            fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)",
            lineHeight: 0.95,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.9)",
            textShadow: "0 4px 30px rgba(0,0,0,0.4)",
          }}
        >
          ADVENTURE AWAITS
        </h2>

        {/* Explore Trips CTA Button */}
        <button
          onClick={scrollToTrips}
          className="mt-8 md:mt-10 px-8 py-3.5 bg-white hover:bg-white/90 text-black font-bold text-xs md:text-sm tracking-widest uppercase rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          Explore Trips &rarr;
        </button>
      </div>

      {/* ── Scroll Indicator ── */}
      <button
        onClick={scrollToTrips}
        className={`absolute bottom-10 sm:bottom-14 z-20 text-white/30 hover:text-white/60 transition-all duration-700 focus:outline-none ${
          phase >= 6 ? "opacity-100 animate-bounce" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to trips"
      >
        <ChevronDown className="w-8 h-8 md:w-10 md:h-10" />
      </button>
    </section>
  );
}
