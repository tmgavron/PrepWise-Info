import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves every relative canonical / OG url below against the WWW host.
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "PrepWise",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: "PrepWise",
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// NO JSON-LD HERE, deliberately.
//
// The sitewide graph (Organization + WebSite + MobileApplication) used to be
// built and emitted right here. It moved to lib/schema.ts -> siteGraph(), which
// every PAGE calls, because the app node's installUrl/downloadUrl have to carry
// that page's App Store campaign token and a root layout cannot know which page
// is rendering: it has no dynamic segment, so it receives no params. A node
// built here can only ever advertise the sitewide default, which is exactly how
// four use-case pages ended up rendering `ct=lp_*` anchors beside a JSON-LD
// download link claiming the generic token.
//
// A page that forgets to call siteGraph() ships without Organization/WebSite,
// which scripts/verify-seo.mjs fails the build on.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-pw-bg text-pw-text font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
