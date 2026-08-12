/**
 * The byline card under every post.
 *
 * The text is the APPROVED bio in references/author.md ("Bio, byline") and
 * nothing else. That file's other bios are still marked TODO(trent: confirm),
 * and an author bio is the single worst place on a site to publish an
 * unapproved sentence: E-E-A-T is exactly where an invented credential is the
 * signal quality raters look for.
 *
 * It must stay byte-identical to `authorPerson.description` in lib/schema.ts,
 * which serializes the same sentence into the Person node on every post.
 *
 * There is no link to an author page because /about does not exist yet, and no
 * headshot because there is no photo. Both are listed in author.md as the next
 * things to add here.
 */
export default function AuthorCard() {
  return (
    <aside className="rounded-2xl border border-pw-border-soft bg-pw-bg-card/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-pw-text-muted mb-2">
        Written by
      </p>
      <p className="text-pw-text font-semibold mb-1">Trent Gavron</p>
      <p className="text-pw-text-subtle text-sm leading-relaxed">
        Founder of PrepWise LLC, the team bringing you the PrepWise App.
      </p>
    </aside>
  );
}
