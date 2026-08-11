import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import AppStoreCta from "@/components/AppStoreCta";
import HeroCta from "@/components/usecase/HeroCta";
import Paragraph from "@/components/RichText";
import { getAllUseCases, getUseCaseBySlug } from "@/lib/usecase";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbList,
  jsonLdForUseCase,
  siteGraph,
  type Crumb,
} from "@/lib/schema";
import { OG_IMAGE } from "@/lib/constants";

// This is a ROOT-level dynamic segment, so it shares the top-level namespace
// with /faq, /blog, /privacy and /terms. Static routes win over a dynamic one
// in Next's matcher, and `dynamicParams = false` plus the generateStaticParams
// below means the export contains exactly the slugs in the registry and
// nothing else. The URLs have to be top-level: `/meal-prep-app` is the slug
// that ranks, `/solutions/meal-prep-app` buries the keyword a level down.
type Params = { useCase: string };

export function generateStaticParams(): Params[] {
  return getAllUseCases().map((page) => ({ useCase: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { useCase } = await params;
  const page = getUseCaseBySlug(useCase);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    // Next REPLACES the root layout's openGraph rather than merging into it, so
    // the image and the twitter card are restated here. Not doing that is why
    // /privacy and /terms shipped with no og:image at all until 2026-07-26.
    openGraph: {
      title: page.title,
      description: page.ogDescription,
      type: "website",
      url: `/${page.slug}`,
      siteName: "PrepWise",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.ogDescription,
      images: [OG_IMAGE],
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { useCase } = await params;
  const page = getUseCaseBySlug(useCase);
  if (!page) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: page.navLabel, path: `/${page.slug}` },
  ];

  // The sitewide nodes + WebPage + BreadcrumbList, in one graph. `page.ct` is
  // passed so the app node's installUrl/downloadUrl carry the SAME token as the
  // three rendered Download links; before 2026-07-27 they advertised the
  // sitewide default and this page's schema contradicted its own anchors. There
  // is no FAQPage node: /faq owns the site's single one and this page links to it.
  const jsonLd = siteGraph(page.ct, [jsonLdForUseCase(page), breadcrumbList(crumbs)]);

  const siblings = getAllUseCases().filter((other) => other.slug !== page.slug);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar pageCt={page.ct} />
      <main className="relative pt-28 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-pw-brand/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <Breadcrumbs crumbs={crumbs} />

          {/* Hero. Text and the download button only: the primary keyword and
              the answer both sit above the fold, and a 1320x2868 phone
              screenshot up here would be the LCP element. The screenshot is
              below, lazily loaded. */}
          <header className="mb-14">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
              {page.h1}
            </h1>
            <div className="space-y-4 text-pw-text-subtle leading-relaxed text-lg mb-8">
              {page.lede.map((text, index) => (
                <Paragraph key={`lede-${index}`} id={`lede-${index}`} text={text} />
              ))}
            </div>
            <HeroCta
              pageCt={page.ct}
              placement={`${page.slug}_hero`}
              label={page.heroCta.label}
              note={page.heroCta.note}
            />
          </header>

          <img
            src={page.screenshot.src}
            alt={page.screenshot.alt}
            width={page.screenshot.width}
            height={page.screenshot.height}
            loading="lazy"
            className="w-full max-w-xs mx-auto rounded-2xl border border-pw-border-soft mb-16"
          />

          <div className="space-y-14">
            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl font-semibold text-pw-text mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-pw-text-subtle leading-relaxed">
                  {section.body.map((text, index) => (
                    <Paragraph
                      key={`${section.id}-${index}`}
                      id={`${section.id}-${index}`}
                      text={text}
                    />
                  ))}
                  {section.list && (
                    <>
                      {section.list.ordered ? (
                        <ol className="list-decimal pl-5 space-y-2 marker:text-pw-text-muted">
                          {section.list.items.map((item, index) => (
                            <li key={`${section.id}-li-${index}`}>{item}</li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="list-disc pl-5 space-y-2 marker:text-pw-text-muted">
                          {section.list.items.map((item, index) => (
                            <li key={`${section.id}-li-${index}`}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </section>
            ))}

            {/* Required on every use-case page, not optional. Telling someone
                the app is wrong for them is the strongest signal a person wrote
                the page (references/voice.md). */}
            <section id="not-for" className="scroll-mt-28">
              <h2 className="text-2xl font-semibold text-pw-text mb-4">
                {page.notFor.heading}
              </h2>
              <div className="space-y-4 text-pw-text-subtle leading-relaxed">
                {page.notFor.body.map((text, index) => (
                  <Paragraph key={`not-for-${index}`} id={`not-for-${index}`} text={text} />
                ))}
              </div>
            </section>
          </div>

          {/* Carries NO FAQPage schema on purpose: /faq owns the site's single
              FAQPage node and this section links to it. verify-seo.mjs enforces
              both halves of that rule. */}
          <section id="faq" className="mt-16 scroll-mt-28">
            <h2 className="text-2xl font-semibold text-pw-text mb-6">
              Frequently asked questions
            </h2>
            <FaqList items={page.faqs} headingLevel={3} idPrefix="page-faq-" />
            <p className="text-pw-text-muted text-sm mt-6">
              More answers on the{" "}
              <a href="/faq" className="text-pw-link underline underline-offset-2">
                PrepWise FAQ
              </a>
              .
            </p>
          </section>

          <div className="mt-16">
            <AppStoreCta
              pageCt={page.ct}
              placement={`${page.slug}_footer`}
              heading={page.footerCta.heading}
              body={page.footerCta.body}
            />
          </div>

          <section aria-labelledby="related" className="mt-16">
            <h2
              id="related"
              className="text-sm font-semibold uppercase tracking-wide text-pw-text-muted mb-4"
            >
              Also on PrepWise
            </h2>
            <ul className="space-y-4">
              {siblings.map((other) => (
                <li key={other.slug}>
                  <a
                    href={`/${other.slug}`}
                    className="text-pw-link underline underline-offset-2 hover:text-pw-accent transition-colors"
                  >
                    {other.navLabel}
                  </a>
                  <p className="text-pw-text-muted text-sm mt-1">
                    {other.ogDescription}
                  </p>
                </li>
              ))}
              {page.internalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-pw-link underline underline-offset-2 hover:text-pw-accent transition-colors"
                  >
                    {link.label}
                  </a>
                  <p className="text-pw-text-muted text-sm mt-1">{link.note}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

// A slug that is not in the registry does not exist. Under `output: "export"`
// nothing is generated on demand anyway; saying so keeps the intent explicit.
export const dynamicParams = false;
