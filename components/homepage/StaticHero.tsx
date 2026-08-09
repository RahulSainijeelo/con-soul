"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TrustStrip } from "./TrustStrip";
import Image from "next/image";

const CONSOUL_LETTERS = ["C", "O", "N", "S", "O", "U", "L"];
const TAGLINE = "EVERY JOURNEY NEEDS DIRECTION";
const DISCOVER_TEXT = "Discover Your Next Adventure";

/**
 * Cinematic intro hero.
 *
 * Sequence:
 *   Phase 0  (0ms)     – dark, background fades in
 *   Phase 1  (300ms)   – CONSOUL letters reveal staggered (centered)
 *   Phase 2  (2200ms)  – orange line + tagline starts typing
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
    const t3 = setTimeout(() => setPhase(3), 4500);   // tagline done, pause
    const t4 = setTimeout(() => setPhase(4), 5500);   // CONSOUL + tagline fade out
    const t5 = setTimeout(() => setPhase(5), 7000);   // discover starts typing
    const t6 = setTimeout(() => setPhase(6), 9500);   // scroll indicator

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

  // CONSOUL + tagline visible in phases 1–3, fading out in phase 4+
  const brandVisible = phase >= 1 && phase < 4;
  const brandFading = phase >= 4;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none">
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
          alt="Mountain landscape at sunset"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      </div>

      {/* ── CONSOUL + Tagline block (fades away after tagline completes) ── */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pb-[15vh] md:pb-0"
        style={{
          opacity: brandFading ? 0 : brandVisible ? 1 : 0,
          transition: "opacity 1500ms ease-out",
        }}
      >
        {/* Orange accent line */}
        <div
          className="h-[3px] bg-brand rounded-full mb-6 transition-all ease-out"
          style={{
            width: phase >= 2 ? "96px" : "0",
            opacity: phase >= 2 ? 1 : 0,
            transitionDuration: "900ms",
          }}
        />

        {/* CONSOUL letters */}
        <h1 className="flex overflow-hidden" aria-label="CONSOUL">
          {CONSOUL_LETTERS.map((letter, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(4.5rem, 13vw, 11rem)",
                lineHeight: 0.9,
                fontWeight: 400,
                color: "#ffffff",
                letterSpacing: "0.08em",
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? "translateY(0)" : "translateY(80px) scaleY(0.7)",
                transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${400 + i * 200}ms`,
                textShadow: "0 0 80px rgba(234,88,12,0.15), 0 4px 30px rgba(0,0,0,0.8)",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Tagline — types fully, stays until fade */}
        <p
          className="mt-4 font-medium uppercase text-brand"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.95rem)",
            letterSpacing: "0.18em",
            minHeight: "1.5em",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
        >
          {TAGLINE.slice(0, taglineChars)}
          {phase >= 2 && taglineChars < TAGLINE.length && (
            <span className="inline-block w-[2px] h-[1em] bg-brand ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>

      {/* ── "Discover Your Next Adventure" — appears AFTER CONSOUL vanishes ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 pb-[15vh] md:pb-0"
        style={{
          opacity: phase >= 5 ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      >
        <p
          style={{
            fontFamily: "dirham-symbol-font, Arial, sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            textShadow: "0 0 100px rgba(234,88,12,0.12), 0 4px 30px rgba(0,0,0,0.6)",
          }}
        >
          {DISCOVER_TEXT.slice(0, discoverChars)}
          {phase >= 5 && discoverChars < DISCOVER_TEXT.length && (
            <span
              className="inline-block align-middle animate-pulse"
              style={{
                width: "4px",
                height: "0.85em",
                backgroundColor: "#ea580c",
                marginLeft: "4px",
                borderRadius: "2px",
              }}
            />
          )}
        </p>
      </div>

      {/* ── Scroll Indicator ── */}
      <button
        onClick={scrollToTrips}
        className={`absolute bottom-10 sm:bottom-14 z-20 text-white/50 hover:text-brand transition-all duration-700 focus:outline-none ${
          phase >= 6 ? "opacity-100 animate-bounce" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to trips"
      >
        <ChevronDown className="w-8 h-8 md:w-10 md:h-10" />
      </button>
    </section>
  );
}
