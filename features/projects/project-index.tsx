"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon/icon";
import { KIND_LABEL, type Kind, type ProjectMeta } from "@/features/projects/types";

export function ProjectIndex({ projects }: { projects: ProjectMeta[] }) {
  const [kind, setKind] = useState<Kind | null>(null);

  const counts = useMemo(() => {
    const map = new Map<Kind, number>();
    for (const p of projects) map.set(p.kind, (map.get(p.kind) ?? 0) + 1);
    return map;
  }, [projects]);

  const shown = kind ? projects.filter((p) => p.kind === kind) : projects;

  if (projects.length === 0) {
    return (
      <p className="border-t border-rule-hair py-8 text-ink-2">
        Nothing published here yet — the work in this section is still in
        progress. The <a href="/#work" className="link-rule text-brand">production
        work</a> is the fuller picture for now.
      </p>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={kind === null} onClick={() => setKind(null)}>
          All {projects.length}
        </Chip>
        {[...counts.entries()].map(([k, n]) => (
          <Chip
            key={k}
            active={kind === k}
            onClick={() => setKind(kind === k ? null : k)}
          >
            {KIND_LABEL[k]} {n}
          </Chip>
        ))}
      </div>

      <div className="border-t border-rule-hair">
        {shown.map((p) => (
          <ProjectRow key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}

export function ProjectRow({ project: p }: { project: ProjectMeta }) {
  // Packages are a list you scan; apps are a thing you look at.
  const dense = p.kind === "package";

  const heading = (
    <span className="inline-flex items-baseline gap-2">
      <span
        className={
          dense
            ? "text-[1.05rem] font-semibold tracking-[-0.005em] text-heading"
            : "text-[1.0625rem] font-semibold tracking-[-0.01em] text-heading"
        }
      >
        {p.title}
      </span>
      {p.hasBody ? (
        <Icon name="arrow-up-right" className="h-3.5 w-3.5 text-ink-3" />
      ) : null}
    </span>
  );

  const body = (
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-2 md:grid-cols-[minmax(0,1fr)_180px]">
      <div className="min-w-0">
        {heading}
        <p className="mt-1 max-w-[60ch] text-[15px] leading-[1.55] text-ink-2">
          {dense ? p.tagline || p.summary : p.summary || p.tagline}
        </p>

        {p.tags.length ? (
          <div className="mt-2.5 flex flex-wrap gap-x-3.5 text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
            {p.tags.map((t, i) => (
              <span key={t} className="relative">
                {i > 0 ? (
                  <span className="absolute -left-2 top-1 h-2.5 w-px bg-rule-hair" />
                ) : null}
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {p.links.length ? (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => e.stopPropagation()}
                className="link-rule inline-flex items-center gap-1 text-brand"
              >
                {l.label}
                <Icon name="arrow-up-right" className="h-3 w-3" />
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="text-left md:text-right">
        <span className="label block">{KIND_LABEL[p.kind]}</span>
        {p.status ? (
          <span className="mt-1 block text-[13px] tabular-nums text-ink-2">
            {p.status}
          </span>
        ) : null}
      </div>
    </div>
  );

  const shell =
    "block border-b border-rule-hair py-6 transition-[background-color,padding] duration-200";

  return p.hasBody ? (
    <Link href={`/projects/${p.slug}`} className={`${shell} hover:bg-brand-wash hover:pl-3`}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
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
      className={`cursor-pointer border px-2.5 py-1 text-[11px] uppercase tracking-[0.09em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        active
          ? "border-heading bg-heading text-background"
          : "border-rule-hair text-ink-3 hover:border-rule-hair hover:text-heading"
      }`}
    >
      {children}
    </button>
  );
}
