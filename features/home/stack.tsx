import { Section } from "@/components/section";
import { stack, stackNote, type StackItem } from "@/config/site";

const named = (i: StackItem) => (typeof i === "string" ? i : i.name);
const noteOf = (i: StackItem) => (typeof i === "string" ? null : i.note);

export function Stack() {
  const total = stack.reduce(
    (n, band) => n + band.groups.reduce((m, g) => m + g.items.length, 0),
    0,
  );

  return (
    <Section
      id="stack"
      label="Toolkit"
      title="What I reach for"
      count={String(total)}
    >
      {/* Three bands, not twelve peer rows. A flat list made "Testing" look
          as load-bearing as "Architecture"; the band heading and its one-line
          blurb tell the reader which rows are the reason to make contact. */}
      <div className="space-y-14">
        {stack.map((band) => (
          <div key={band.id}>
            <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-heading">
              {band.title}
            </h3>
            <p className="mt-1.5 max-w-[72ch] text-pretty text-[0.875rem] leading-[1.6] text-ink-3">
              {band.blurb}
            </p>

            {/* Dense rows, not cards. Volume is the argument inside a band, so
                no single group should take up a card's worth of room. */}
            <dl className="mt-5 border-t border-rule-hair">
              {band.groups.map((g) => (
                <div
                  key={g.label}
                  className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule-hair py-3 md:grid-cols-[150px_minmax(0,1fr)]"
                >
                  <dt className="label pt-1">{g.label}</dt>
                  {/* Dot separates, and the last item never gets one. The dot
                      is glued to the item before it (nowrap), so it can still
                      ride to the end of a wrapped line — the tradeoff for
                      having visible separators at all. */}
                  <dd className="m-0 flex flex-wrap gap-x-3 gap-y-1.5 text-[0.9375rem] text-ink-2">
                    {g.items.map((item, n) => {
                      const note = noteOf(item);
                      return (
                        <span key={named(item)} className="whitespace-nowrap">
                          {named(item)}
                          {note ? (
                            <span className="ml-1.5 align-[0.1em] text-[0.625rem] uppercase tracking-[0.1em] text-ink-3">
                              {note}
                            </span>
                          ) : null}
                          {n < g.items.length - 1 ? (
                            <span aria-hidden className="ml-3 text-ink-3">
                              ·
                            </span>
                          ) : null}
                        </span>
                      );
                    })}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-[68ch] text-pretty border-l-2 border-brand pl-4 text-[0.875rem] leading-[1.65] text-ink-2">
        {stackNote}
      </p>
    </Section>
  );
}
