import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import AppStoreCta from "@/components/AppStoreCta";
import AuthorCard from "@/components/blog/AuthorCard";
import TableOfContents from "@/components/blog/TableOfContents";
import Paragraph from "@/components/RichText";
import {
  appStoreCt,
  formatDate,
  getAllPosts,
  getPostBySlug,
  needsTableOfContents,
} from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import {
  articleJsonLd,
  authorPerson,
  breadcrumbList,
  siteGraph,
  type Crumb,
} from "@/lib/schema";
import { OG_IMAGE } from "@/lib/constants";

type Params = { slug: string };

// Every post is a route generated at build time. Under `output: "export"` this
// is what turns the content directory into HTML files; a post that is not
// returned here simply does not exist on the site.
export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogDescription = post.ogDescription ?? post.description;
  const image = {
    url: post.hero.src,
    width: post.hero.width,
    height: post.hero.height,
    alt: post.hero.alt,
  };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    // Page-level openGraph REPLACES the layout's, so the image is restated here
    // rather than inherited. Same trap that left /privacy without an og:image.
    openGraph: {
      title: post.title,
      description: ogDescription,
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: "PrepWise",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [authorPerson.name],
      images: [image.url ? image : OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: ogDescription,
      images: [image.url ? image : OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.h1, path: `/blog/${post.slug}` },
  ];

  // The sitewide nodes + Article + BreadcrumbList + Person, in one graph. The
  // post's campaign token is passed so the app node's installUrl/downloadUrl
  // carry the SAME `blog-<slug>` token as the navbar and footer Download
  // buttons, instead of the sitewide default.
  const jsonLd = siteGraph(appStoreCt(post.slug), [
    articleJsonLd(post),
    breadcrumbList(crumbs),
    authorPerson,
  ]);

  const showToc = needsTableOfContents(post);
  const related = getAllPosts().filter((other) => other.slug !== post.slug);

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Same token the footer CTA uses: the navbar Download button is the first
          App Store link on the page and would otherwise credit the sitewide
          default for an install this post earned. */}
      <Navbar pageCt={appStoreCt(post.slug)} />
      <main className="relative pt-28 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-pw-brand/8 blur-[120px]" />
        </div>

        <div id="top" className="relative mx-auto max-w-3xl scroll-mt-28">
          <Breadcrumbs crumbs={crumbs} />

          <article>
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {post.h1}
              </h1>
              <p className="text-pw-text-muted text-sm">
                By {authorPerson.name} &middot;{" "}
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {post.updatedAt !== post.publishedAt && (
                  <>
                    {" "}
                    &middot; last updated{" "}
                    <time dateTime={post.updatedAt}>
                      {formatDate(post.updatedAt)}
                    </time>
                  </>
                )}
              </p>
            </header>

            <img
              src={post.hero.src}
              alt={post.hero.alt}
              width={post.hero.width}
              height={post.hero.height}
              className="w-full rounded-2xl border border-pw-border-soft mb-10"
            />

            <div className="space-y-5 text-pw-text-subtle leading-relaxed text-lg mb-12">
              {post.intro.map((text, index) => (
                <Paragraph key={`intro-${index}`} id={`intro-${index}`} text={text} />
              ))}
            </div>

            {showToc && <TableOfContents sections={post.sections} />}

            <div className="space-y-14">
              {post.sections.map((section) => (
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
                  {showToc && (
                    <p className="mt-6">
                      <a
                        href="#top"
                        className="text-xs text-pw-text-muted hover:text-pw-link underline underline-offset-2 transition-colors"
                      >
                        Back to top
                      </a>
                    </p>
                  )}
                </section>
              ))}
            </div>

            {/* This heading is what the build gate detects as an FAQ section. It
                carries NO FAQPage schema on purpose: /faq owns the site's single
                FAQPage node, and this page links to it. verify-seo.mjs enforces
                both halves of that rule. */}
            <section id="faq" className="mt-16 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-pw-text mb-6">
                Frequently asked questions
              </h2>
              <FaqList items={post.faqs} headingLevel={3} idPrefix="post-faq-" />
              <p className="text-pw-text-muted text-sm mt-6">
                More answers on the{" "}
                <a
                  href="/faq"
                  className="text-pw-link underline underline-offset-2"
                >
                  PrepWise FAQ
                </a>
                .
              </p>
            </section>
          </article>

          <div className="mt-16">
            <AuthorCard />
          </div>

          <div className="mt-8">
            <AppStoreCta
              pageCt={appStoreCt(post.slug)}
              placement="blog_post_footer"
              heading="Let the app keep the stock-take current"
              body="PrepWise holds your pantry, shows which recipes you can cook right now, and writes the shopping list for the gap."
            />
          </div>

          <section aria-labelledby="related" className="mt-16">
            <h2
              id="related"
              className="text-sm font-semibold uppercase tracking-wide text-pw-text-muted mb-4"
            >
              Keep reading
            </h2>
            <ul className="space-y-4">
              {related.map((other) => (
                <li key={other.slug}>
                  <a
                    href={`/blog/${other.slug}`}
                    className="text-pw-link underline underline-offset-2 hover:text-pw-accent transition-colors"
                  >
                    {other.h1}
                  </a>
                  <p className="text-pw-text-muted text-sm mt-1">
                    {other.ogDescription ?? other.description}
                  </p>
                </li>
              ))}
              {post.internalLinks.map((link) => (
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

// A slug that is not in the content directory does not exist. Under
// `output: "export"` nothing is generated on demand anyway; saying so keeps the
// intent explicit rather than implied by the build mode.
export const dynamicParams = false;
