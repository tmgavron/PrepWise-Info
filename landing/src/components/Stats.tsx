"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";

export default function Stats() {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8"
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-pw-border-soft bg-pw-bg-card/40 py-8 px-6"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-pw-brand to-pw-accent bg-clip-text text-transparent">
              {stat.value}
            </span>
            <span className="text-pw-text-subtle text-sm">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
