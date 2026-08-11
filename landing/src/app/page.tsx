import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import HomeFaq from "@/components/HomeFaq";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";

// No page token: the home page IS the sitewide default campaign, and its
// Download buttons render the default `ct` baked into APP_STORE_URL. Passing
// undefined keeps the schema and the anchors on the same token.
const jsonLd = siteGraph(undefined);

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <HowItWorks />
        <Stats />
        <HomeFaq />
        <EmailCapture />
      </main>
      <Footer />
    </>
  );
}
