import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrepWise — AI-Powered Meal Planning",
  description:
    "Plan meals based on what's in your pantry. AI-powered recipes, smart shopping lists, and macro tracking.",
  openGraph: {
    title: "PrepWise — AI-Powered Meal Planning",
    description:
      "Plan meals based on what's in your pantry. AI-powered recipes, smart shopping lists, and macro tracking.",
    type: "website",
    locale: "en_US",
    // TODO: Add siteName and url once domain is finalized
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepWise — AI-Powered Meal Planning",
    description:
      "Plan meals based on what's in your pantry. AI-powered recipes, smart shopping lists, and macro tracking.",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-pw-bg text-pw-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
