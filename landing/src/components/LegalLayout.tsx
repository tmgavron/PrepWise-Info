"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  effectiveDate,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <main className="relative pt-28 pb-24 px-6">
      {/* Background glow — matches hero section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-pw-brand/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 text-sm text-pw-text-muted hover:text-pw-link transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-pw-text to-pw-text-subtle bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-pw-chip-bg border border-pw-chip-border px-3 py-1 text-xs font-medium text-pw-accent">
              Effective {effectiveDate}
            </span>
            <span className="text-pw-text-muted text-xs">
              Last updated {lastUpdated}
            </span>
          </div>
        </motion.div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-pw-border-soft bg-pw-bg-card/60 backdrop-blur-sm p-8 sm:p-10"
        >
          <div className="legal-content space-y-8 text-pw-text-subtle leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
