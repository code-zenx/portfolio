"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/section";
import { projects } from "@/config/site";

export function Work() {
  const [filter, setFilter] = useState<string | null>(null);

  // A chip per tag meant 17 controls filtering 6 rows. Only tags that
  // actually split the set are worth a control.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([t]) => t);
  }, []);

  const shown = filter ? projects.filter((p) => p.tags.includes(filter)) : projects;

  return (
    <Section
      id="work"
      label="Selected work"
      title="Things that run in production"
      count={String(projects.length).padStart(2, "0")}
    >
      <div className="mb-7 flex flex-wrap gap-1.5">
        <Chip active={filter === null} onClick={() => setFilter(null)}>
          All
        </Chip>
        {tags.map((t) => (
          <Chip
            key={t}
            active={filter === t}
            onClick={() => setFilter(filter === t ? null : t)}
          >
            {t}
          </Chip>
        ))}
      </div>

      <div className="border-t border-rule-hair">
        {shown.map((p) => (
          <article
            key={p.id}
            /* three populated columns — the old two-column row left ~390px
               of dead air in the middle of every entry */
            className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-rule-hair py-6 md:grid-cols-[100px_minmax(0,1fr)_158px]"
          >
            <div>
              <span className="badge">{p.badge}</span>
            </div>

            <div className="min-w-0">
              <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-heading">
                {p.title}
              </h3>
              <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] leading-[1.6] text-ink-2">
                {p.blurb}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
                {p.tags.map((t) => (
                  <span key={t} className={t === filter ? "text-brand" : undefined}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:text-right">
              {p.stat ? (
                <>
                  <span className="block text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-heading tabular-nums">
                    {p.stat.value}
                  </span>
                  <span className="mt-1.5 block text-[0.75rem] leading-snug text-ink-3">
                    {p.stat.label}
                  </span>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-6 text-ink-3">Nothing tagged {filter}.</p>
      ) : null}
    </Section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer border px-2 py-[3px] text-[0.6875rem] font-medium uppercase tracking-[0.1em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        active
          ? "border-heading bg-heading text-background"
          : "border-rule-hair text-ink-3 hover:border-rule hover:text-heading"
      }`}
    >
      {children}
    </button>
  );
}
