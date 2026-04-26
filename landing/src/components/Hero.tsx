"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-pw-brand/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-pw-brand-alt/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Stop Guessing{" "}
            <span className="bg-gradient-to-r from-pw-brand to-pw-accent bg-clip-text text-transparent">
              What to Cook
            </span>
          </h1>
          <p className="text-lg text-pw-text-subtle max-w-lg leading-relaxed">
            PrepWise sees exactly what&apos;s in your pantry and tells you
            every meal you can make right now. No more waste. No more takeout
            panic. Just smart, effortless meal planning.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-2">
            <div className="relative group">
              {/* TODO: Replace href with real App Store URL */}
              <a href="#cta" className="block">
                <img
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  className="h-12 transition-transform group-hover:scale-105"
                />
                <span className="absolute -top-2 -right-2 bg-pw-warning text-pw-bg text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Phone mockups */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center items-center"
        >
          {/* Glow behind phones */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-pw-brand/15 blur-[80px]" />

          {/* Phone 1 — iPhone 17 Pro Max (6.9") — Home dashboard.
              Bezel ratio (~3% padding) and aspect derived from
              physical 163×77.6mm / 1320×2868 display. */}
          <div className="relative z-10 -mr-8">
            <div className="relative w-[220px] sm:w-[260px] rounded-[2.6rem] p-[3%] bg-gradient-to-b from-neutral-800 via-black to-neutral-900 shadow-2xl shadow-black/50 ring-1 ring-white/10">
              {/* Action button + volume up/down (left), power (right) */}
              <span aria-hidden className="absolute left-[-2px] top-[14%] w-[2px] h-6 rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute left-[-2px] top-[24%] w-[2px] h-10 rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute left-[-2px] top-[35%] w-[2px] h-10 rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute right-[-2px] top-[22%] w-[2px] h-16 rounded-r bg-neutral-700" />
              <div className="rounded-[2.1rem] overflow-hidden bg-pw-bg-card">
                <img
                  src="/screenshots/hero-1.png"
                  alt="PrepWise home dashboard in dark mode — weekly meals, expiring ingredients, and macro tracking"
                  className="block w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Phone 2 — iPhone 17 Pro Max (6.9") — Recipes */}
          <div className="relative z-0 -ml-8 mt-12">
            <div className="relative w-[200px] sm:w-[240px] rounded-[2.6rem] p-[3%] bg-gradient-to-b from-neutral-800 via-black to-neutral-900 shadow-2xl shadow-black/50 ring-1 ring-white/10 rotate-3">
              <span aria-hidden className="absolute left-[-2px] top-[14%] w-[2px] h-6 rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute left-[-2px] top-[24%] w-[2px] h-10 rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute left-[-2px] top-[35%] w-[2px] h-10 rounded-l bg-neutral-700" />
              <span aria-hidden className="absolute right-[-2px] top-[22%] w-[2px] h-16 rounded-r bg-neutral-700" />
              <div className="rounded-[2.1rem] overflow-hidden bg-pw-bg-card">
                <img
                  src="/screenshots/hero-2.png"
                  alt="PrepWise weekly meal calendar in dark mode"
                  className="block w-full h-auto"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
