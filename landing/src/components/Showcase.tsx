"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SHOWCASE_SLIDES } from "@/lib/constants";

export default function Showcase() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-showcase-card]");
    const delta = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: delta * direction, behavior: "smooth" });
  };

  return (
    <section id="showcase" className="py-24 px-0 sm:px-6">
      <div className="mx-auto max-w-6xl px-6 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Take a Tour
          </h2>
          <p className="text-pw-text-subtle max-w-2xl mx-auto">
            Every screen, every interaction — designed to make meal planning
            feel effortless.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-pw-bg to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-pw-bg to-transparent z-10" />

        {/* Desktop arrows */}
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll showcase left"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full border border-pw-border-soft bg-pw-bg-card/80 backdrop-blur text-pw-text hover:border-pw-chip-border hover:text-pw-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Scroll showcase right"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-11 h-11 rounded-full border border-pw-border-soft bg-pw-bg-card/80 backdrop-blur text-pw-text hover:border-pw-chip-border hover:text-pw-accent transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 sm:px-12 pb-6 showcase-track"
        >
          {SHOWCASE_SLIDES.map((slide, i) => (
            <motion.div
              key={slide.src}
              data-showcase-card
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
              className="snap-center shrink-0 w-[260px] sm:w-[300px] md:w-[320px] rounded-[2rem] overflow-hidden border border-pw-border-soft bg-pw-bg-card shadow-2xl shadow-black/40 transition-transform hover:-translate-y-1"
            >
              <img
                src={slide.src}
                alt={slide.caption}
                loading="lazy"
                decoding="async"
                width={1320}
                height={2868}
                className="block w-full h-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .showcase-track {
          scrollbar-width: thin;
          scrollbar-color: var(--color-pw-border-soft) transparent;
        }
        .showcase-track::-webkit-scrollbar {
          height: 6px;
        }
        .showcase-track::-webkit-scrollbar-thumb {
          background: var(--color-pw-border-soft);
          border-radius: 3px;
        }
      `}</style>
    </section>
  );
}
