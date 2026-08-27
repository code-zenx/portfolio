"use client";

import { useState } from "react";
import { Section } from "@/components/section";
import { Disclosure } from "@/components/disclosure";
import { roles } from "@/config/site";

export function Experience() {
  // Six roles of bullets is a wall. Current role open, history collapsed —
  // the one place on the page where hiding detail earns its keep.
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <Section
      id="experience"
      label="Chronology"
      title="How I got here"
      count={String(roles.length).padStart(2, "0")}
    >
      <div className="border-t border-rule-hair">
        {roles.map((r, i) => (
          <Disclosure
            key={`${r.when}-${r.title}`}
            label={`${r.title} at ${r.org}`}
            open={open.has(i)}
            onToggle={() => toggle(i)}
            summary={
              <span className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-[144px_minmax(0,1fr)]">
                <span className="block whitespace-nowrap pt-0.5 text-[0.75rem] tabular-nums tracking-[0.04em] text-ink-3">
                  {r.when}
                </span>
                <span className="block min-w-0">
                  <span className="block text-[1.0625rem] font-semibold tracking-[-0.01em] text-heading">
                    {r.title} <span className="text-ink-3">·</span> {r.org}
                  </span>
                  <span className="mt-0.5 block max-w-[68ch] text-[0.9375rem] text-ink-2">
                    {r.detail}
                  </span>
                </span>
              </span>
            }
          >
            {r.points ? (
              <ul className="ml-0 list-none space-y-1.5 p-0 md:ml-[152px]">
                {r.points.map((pt) => (
                  <li
                    key={pt}
                    className="relative max-w-[64ch] pl-4 text-[0.9375rem] leading-[1.6] text-ink-2 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-3"
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            ) : null}
          </Disclosure>
        ))}
      </div>
    </Section>
  );
}
