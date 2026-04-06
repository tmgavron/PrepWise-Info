"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    const apiKey = process.env.NEXT_PUBLIC_BUTTONDOWN_API_KEY;
    if (!apiKey) {
      // Gracefully handle missing API key during development
      await new Promise((r) => setTimeout(r, 1000));
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setErrorMsg(
          data?.email?.[0] || data?.detail || "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  /*
   * Alternative: Buttondown embeddable HTML form (no API key needed).
   * Uncomment and replace the form below if you prefer not to expose the API key.
   *
   * <form
   *   action="https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME"
   *   method="post"
   *   target="popupwindow"
   *   className="..."
   * >
   *   <input type="email" name="email" placeholder="you@example.com" required />
   *   <button type="submit">Subscribe</button>
   * </form>
   */

  return (
    <section id="cta" className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Meal Planning That Starts With What You Have
        </h2>
        <p className="text-pw-text-subtle mb-8">
          PrepWise is launching on the App Store soon. Join the waitlist for
          early access and launch-day pricing.
        </p>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 rounded-2xl border border-pw-success/30 bg-pw-success/10 py-6 px-8"
          >
            <CheckCircle2 className="w-6 h-6 text-pw-success" />
            <span className="text-pw-success font-medium">
              You&apos;re on the list!
            </span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="flex-1 rounded-xl border border-pw-border-soft bg-pw-bg-card px-4 py-3 text-pw-text placeholder:text-pw-text-muted focus:outline-none focus:border-pw-brand transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-xl bg-pw-brand px-6 py-3 font-semibold text-white transition-all hover:bg-pw-brand/90 hover:shadow-lg hover:shadow-pw-brand/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Join Waitlist
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="text-pw-danger text-sm">{errorMsg}</p>
            )}

            <p className="text-pw-text-muted text-xs">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </motion.div>
    </section>
  );
}
