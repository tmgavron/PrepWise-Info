"use client";

import { motion } from "framer-motion";
import { Sparkles, Package, CalendarDays, ShoppingCart } from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap = {
  Sparkles,
  Package,
  CalendarDays,
  ShoppingCart,
} as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Eat Better
          </h2>
          <p className="text-pw-text-subtle max-w-2xl mx-auto">
            From pantry tracking to meal planning to grocery lists — PrepWise
            handles the hard parts so you can focus on cooking.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="group relative rounded-2xl border border-pw-border-soft bg-pw-bg-card/60 backdrop-blur-sm p-8 transition-all hover:-translate-y-1 hover:border-pw-chip-border hover:shadow-lg hover:shadow-pw-brand/5"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pw-chip-bg border border-pw-chip-border">
                  <Icon className="w-6 h-6 text-pw-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-pw-text-subtle leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
