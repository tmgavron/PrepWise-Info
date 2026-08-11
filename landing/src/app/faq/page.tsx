import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import AppStoreCta from "@/components/AppStoreCta";
import { FAQ_ITEMS } from "@content/faq";
import { faqByTopic, faqPageJsonLd } from "@/lib/faq";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList, siteGraph, type Crumb } from "@/lib/schema";
import { OG_IMAGE, SITE_URL, SUPPORT_EMAIL } from "@/lib/constants";

// Primary keyword: "meal planning app faq" (claimed in
// references/used-keywords.md). Title 50-60 and description 150-160 characters,
// measured decoded - scripts/verify-seo.mjs fails the build otherwise.
const TITLE = "Meal Planning App FAQ: PrepWise Pantry, Macros, Price";
const DESCRIPTION =
  "Answers to what people ask before downloading PrepWise: how the pantry works, what it plans, which macros it counts, what it costs, and who it is not for.";

const PAGE_URL = `${SITE_URL}/faq`;

// ONE token for the whole page. Every App Store link on /faq carries it — the
// navbar button, the footer CTA, and the JSON-LD installUrl/downloadUrl — so an
// install sourced from any of them joins back to this page in App Store
// Connect. verify-seo.mjs fails the build if they ever disagree.
const PAGE_CT = "faq";

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  // Next REPLACES the root layout's openGraph rather than merging into it, so
  // the image and the twitter card have to be restated on every page that sets
  // its own. See CLAUDE.md -> "SEO content".
  openGraph: {
    title: TITLE,
    description: "How the pantry works, what PrepWise plans, and what it costs.",
    type: "website",
    url: "/faq",
    siteName: "PrepWise",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "How the pantry works, what PrepWise plans, and what it costs.",
    images: [OG_IMAGE],
  },
};

// The site's ONE FAQPage node. The home page shows a few of these questions
// with no schema and a link back here: duplicating FAQPage across surfaces is
// what makes Google pick one and ignore the other.
const jsonLd = siteGraph(PAGE_CT, [faqPageJsonLd(FAQ_ITEMS, PAGE_URL), breadcrumbList(CRUMBS)]);

export default function FaqPage() {
  const groups = faqByTopic(FAQ_ITEMS);

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* The navbar Download button is the FIRST App Store link on the page, so
          it needs the page token too. Without it, an install from the top of
          /faq reports under the sitewide default while one from the bottom of
          the same page reports as "faq". */}
      <Navbar pageCt={PAGE_CT} />
      <main className="relative pt-28 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-pw-brand/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <Breadcrumbs crumbs={CRUMBS} />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
            Meal planning app FAQ: how PrepWise works
          </h1>
          <p className="text-pw-text-subtle leading-relaxed mb-4">
            These are the questions people ask about PrepWise before they
            download it, grouped by what they are actually about. PrepWise is a
            meal planning app that starts from your pantry: it tracks what is in
            your kitchen, plans around it, and writes the shopping list for the
            gap.
          </p>
          <p className="text-pw-text-muted text-sm mb-10">
            Something not answered here? Email{" "}
            <a
              href={SUPPORT_EMAIL}
              className="text-pw-link underline underline-offset-2"
            >
              support@prepwise-app.com
            </a>{" "}
            and the answer usually ends up on this page.
          </p>

          <nav aria-label="FAQ topics" className="mb-14">
            <ul className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="inline-flex items-center rounded-full bg-pw-chip-bg border border-pw-chip-border px-3 py-1.5 text-xs font-medium text-pw-accent hover:border-pw-border-light transition-colors"
                  >
                    {group.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16">
            {groups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <h2 className="text-2xl font-semibold text-pw-text mb-6">
                  {group.label}
                </h2>
                <FaqList items={group.items} headingLevel={3} />
              </section>
            ))}
          </div>

          <div className="mt-16">
            <AppStoreCta
              pageCt={PAGE_CT}
              placement="faq_footer"
              heading="Plan tonight from what is already in your kitchen"
              body="PrepWise tracks your pantry, shows you which recipes you can cook right now, and writes the shopping list for the gap."
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
