import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllPosts, formatDate } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList, siteGraph, type Crumb } from "@/lib/schema";
import { OG_IMAGE } from "@/lib/constants";

// Title 50-60 and description 150-160 characters, measured decoded.
const TITLE = "PrepWise Blog: Pantry-First Meal Planning, Explained";
const DESCRIPTION =
  "Practical writing on planning meals around the food you already own: taking stock of a pantry, building a week from it, and shopping only for the gap.";

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: "How to plan a week from the food already on your shelf.",
    type: "website",
    url: "/blog",
    siteName: "PrepWise",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "How to plan a week from the food already on your shelf.",
    images: [OG_IMAGE],
  },
};

// The index has no campaign token of its own: its Download button is the
// navbar's, which renders the sitewide default. The POSTS carry blog-<slug>.
const jsonLd = siteGraph(undefined, [breadcrumbList(CRUMBS)]);

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <main className="relative pt-28 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-pw-brand/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <Breadcrumbs crumbs={CRUMBS} />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Pantry-first meal planning, written down
          </h1>
          <p className="text-pw-text-subtle leading-relaxed mb-12 max-w-2xl">
            Methods for planning a week around the food you already own, from
            the person who built PrepWise. No listicles, no invented statistics.
          </p>

          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-pw-border-soft bg-pw-bg-card/60 p-6 transition-colors hover:border-pw-border-light"
              >
                <h2 className="text-xl font-semibold text-pw-text mb-2">
                  <a
                    href={`/blog/${post.slug}`}
                    className="hover:text-pw-link transition-colors"
                  >
                    {post.h1}
                  </a>
                </h2>
                <p className="text-pw-text-subtle text-sm leading-relaxed mb-4">
                  {post.ogDescription ?? post.description}
                </p>
                <p className="text-pw-text-muted text-xs">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  {post.updatedAt !== post.publishedAt && (
                    <>
                      {" "}
                      &middot; updated{" "}
                      <time dateTime={post.updatedAt}>
                        {formatDate(post.updatedAt)}
                      </time>
                    </>
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
