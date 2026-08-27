import { Section } from "@/components/section";
import { stack } from "@/config/site";

export function Stack() {
  const total = stack.reduce((n, g) => n + g.items.length, 0);

  return (
    <Section
      id="stack"
      label="Toolkit"
      title="What I reach for"
      count={String(total)}
    >
      {/* Dense rows, not eight boxes. Volume is the argument here, so no
          single group should take up a card's worth of room. */}
      <dl className="border-t border-rule-hair">
        {stack.map((g) => (
          <div
            key={g.label}
            className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule-hair py-3 md:grid-cols-[132px_minmax(0,1fr)]"
          >
            <dt className="label pt-1">{g.label}</dt>
            <dd className="m-0 flex flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] text-ink-2">
              {g.items.map((i, n) => (
                <span key={i} className="whitespace-nowrap">
                  {i}
                  {n < g.items.length - 1 ? (
                    <span aria-hidden className="ml-3 text-ink-3">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
