"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/section";
import { Disclosure } from "@/components/disclosure";
import { projects, roles, type Role } from "@/config/site";

const BULLET =
  "relative pl-4 text-[0.9375rem] leading-[1.6] text-ink-2 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-3";

/**
 * The bullet says what changed; the Work row says what the thing is. An
 * unknown id renders nothing rather than a dead anchor.
 */
function ShippedAs({ ids }: { ids: string[] }) {
  const rows = ids.flatMap((id) => projects.filter((p) => p.id === id));
  if (rows.length === 0) return null;

  return (
    <p className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="label">Shipped as</span>
      {rows.map((p) => (
        <a key={p.id} href={`#${p.id}`} className="link-rule text-[0.8125rem] text-brand">
          {p.title}
        </a>
      ))}
    </p>
  );
}

/** Oldest role's start to newest role's end, for the employer header. */
function tenure(group: Role[]): string {
  const newest = group[0].when.split("—").map((s) => s.trim());
  const oldest = group[group.length - 1].when.split("—").map((s) => s.trim());
  return `${oldest[0]} — ${newest[1]}`;
}

export function Experience() {
  // The current role is open; history is one line until asked for.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([`${roles[0].org}-${roles[0].when}`]),
  );

  // Consecutive roles at the same employer form one block. Five titles
  // stacked under one name reads as a climb; six flat rows with the company
  // repeated on each does not.
  const groups = useMemo(() => {
    const out: Role[][] = [];
    for (const r of roles) {
      const last = out[out.length - 1];
      if (last && last[0].org === r.org) last.push(r);
      else out.push([r]);
    }
    return out;
  }, []);

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <Section
      id="experience"
      label="Chronology"
      title="How I got here"
      count={String(roles.length).padStart(2, "0")}
    >
      <div className="space-y-10">
        {groups.map((group) => (
          <div
            key={group[0].org}
            /* Employer in its own column — the same label-left grammar the
               rest of the page uses, and the strongest separation between the
               company and the roles held there. Stacks on small screens. */
            className="md:grid md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-7"
          >
            <div className="mb-3 md:mb-0 md:sticky md:top-[calc(var(--header-h)+1.5rem)] md:self-start">
              <span className="label block text-heading">{group[0].org}</span>
              <span className="label mt-1.5 block tracking-[0.08em] tabular-nums">
                {tenure(group)}
              </span>
            </div>

            <div className="border-t border-rule-hair">
            {group.map((r) => {
              const key = `${r.org}-${r.when}`;
              return (
                <Disclosure
                  key={key}
                  label={`${r.title} at ${r.org}`}
                  open={open.has(key)}
                  onToggle={() => toggle(key)}
                  summary={
                    <span className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-[minmax(0,1fr)_150px]">
                      <span className="block min-w-0">
                        <span className="block text-[1.0625rem] font-semibold tracking-[-0.01em] text-heading">
                          {r.title}
                        </span>
                        <span className="mt-0.5 block max-w-[68ch] text-[0.9375rem] text-ink-2">
                          {r.detail}
                        </span>
                      </span>
                      <span className="block whitespace-nowrap text-[0.75rem] tabular-nums tracking-[0.04em] text-ink-3 md:text-right">
                        {r.when}
                      </span>
                    </span>
                  }
                >
                  {/* A busy year lists its work under the product it belonged
                      to. Seven flat bullets read as one blur; the labels are
                      what show the year spanned four products and an on-prem
                      delivery. */}
                  {r.streams ? (
                    <div className="grid max-w-[76ch] gap-y-5">
                      {r.streams.map((st) => (
                        <div key={st.label}>
                          <span className="label block text-heading">
                            {st.label}
                          </span>
                          <ul className="m-0 mt-2 grid list-none gap-y-2 p-0">
                            {st.items.map((pt) => (
                              <li key={pt} className={BULLET}>
                                {pt}
                              </li>
                            ))}
                          </ul>
                          {st.see ? <ShippedAs ids={st.see} /> : null}
                        </div>
                      ))}
                    </div>
                  ) : r.points ? (
                    <div className="max-w-[76ch]">
                      <ul className="m-0 grid list-none gap-y-2 p-0">
                        {r.points.map((pt) => (
                          <li key={pt} className={BULLET}>
                            {pt}
                          </li>
                        ))}
                      </ul>
                      {r.see ? <ShippedAs ids={r.see} /> : null}
                    </div>
                  ) : null}
                </Disclosure>
              );
            })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
