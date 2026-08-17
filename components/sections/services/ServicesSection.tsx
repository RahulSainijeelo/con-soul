"use client";

import { useState } from "react";
import { services, type Service } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServiceCarousel } from "./useServiceCarousel";
import { ServiceCard } from "./ServiceCard";
import { ServiceDetailsDialog } from "./ServiceDetailsDialog";

interface ServicesSectionProps {
  profile: any;
  loading: boolean;
}

export function ServicesSection({ profile, loading }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const {
    scrollRef,
    scrollIndex,
    totalDots,
    showArrows,
    canScrollLeft,
    canScrollRight,
    handleScroll,
    scrollToCard,
    handleArrow,
  } = useServiceCarousel();

  return (
    <section
      id="services"
      className="py-20"
      style={{
        background: "var(--color-background-secondary)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-primary)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Our Services
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-primary)",
            }}
          >
            We craft next-generation digital experiences with cutting-edge web
            development, mobile applications, AI/ML innovation, blockchain
            solutions, and user-centric design.
          </p>
        </div>

        <div className="relative">
          {/* Arrow left - only show when can scroll left */}
          {showArrows && canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg p-2 hidden md:flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-accent)",
                transition: "var(--transition-normal)",
              }}
              onClick={() => handleArrow("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Arrow right - only show when can scroll right */}
          {showArrows && canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg p-2 hidden md:flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-accent)",
                transition: "var(--transition-normal)",
              }}
              onClick={() => handleArrow("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={cn(
              "gap-6",
              "flex",
              "overflow-x-auto",
              "pb-2",
              "scroll-smooth",
              "no-scrollbar"
            )}
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={setSelectedService}
              />
            ))}
          </div>

          {/* Dot pagination - only show if multiple dots */}
          {totalDots > 1 && (
            <div className="flex justify-center mt-6">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <button
                  key={idx}
                  className={cn("h-3 w-3 rounded-full mx-1 transition-all")}
                  style={{
                    backgroundColor:
                      scrollIndex === idx
                        ? "var(--color-accent)"
                        : "var(--color-surface-light)",
                    transform: scrollIndex === idx ? "scale(1.25)" : "scale(1)",
                    transition: "var(--transition-normal)",
                    outline: "none",
                    border: "none",
                  }}
                  aria-label={`Go to service card ${idx + 1}`}
                  onClick={() => scrollToCard(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link href="#contact">
            <Button
              size="lg"
              style={{
                background: "var(--gradient-accent)",
                color: "var(--color-text-primary)",
                border: "none",
                borderRadius: "var(--radius-lg)",
                padding: "0.75rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                transition: "var(--transition-normal)",
                boxShadow: "var(--shadow-md)",
              }}
              className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Request a Quote
            </Button>
          </Link>
        </div>
      </div>

      {/* Service Details Dialog */}
      <ServiceDetailsDialog
        service={selectedService}
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
      />
    </section>
  );
}
