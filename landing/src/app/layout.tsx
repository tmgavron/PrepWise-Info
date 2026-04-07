import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrepWise — Meal Planner & Pantry Tracker",
  description:
    "Stop guessing what to cook. PrepWise plans meals from your pantry, tracks macros, and writes your shopping list automatically.",
  openGraph: {
    title: "PrepWise — Meal Planner & Pantry Tracker",
    description:
      "Stop guessing what to cook. PrepWise plans meals from your pantry, tracks macros, and writes your shopping list automatically.",
    type: "website",
    locale: "en_US",
    // TODO: Add siteName and url once domain is finalized
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepWise — Meal Planner & Pantry Tracker",
    description:
      "Stop guessing what to cook. PrepWise plans meals from your pantry, tracks macros, and writes your shopping list automatically.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-pw-bg text-pw-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
