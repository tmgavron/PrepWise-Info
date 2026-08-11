// The single JSON-LD emitter. One script tag per page, one @graph.
//
// It is a component rather than five copies of the same three lines because
// every page has to emit the sitewide nodes now that the app node carries the
// page's App Store campaign token (see lib/schema.ts -> appNode), and a
// hand-copied `dangerouslySetInnerHTML` on each page is how one of them ends up
// serialising something slightly different.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Serialized from content we control - no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
