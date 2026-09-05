"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon/icon";
import { Section } from "@/components/section";
import { projects, type Project } from "@/config/site";
import type { PostMeta } from "@/features/blog/posts.server";

/** Rows shown before "show all". Keeps the section a scan, not a scroll. */
const HOME_LIMIT = 5;

export function Work({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

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

  // Only link a write-up that actually exists and is published — a slug
  // pointing at a draft or a deleted post would otherwise 404.
  const published = useMemo(
    () => new Map(posts.map((p) => [p.slug, p])),
    [posts],
  );

  // A "Shipped as" link from Experience can target a row that the truncation
  // or an active filter has not rendered. Reveal it, then scroll — the browser
  // gave up on the anchor before React put the row in the DOM.
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || !projects.some((p) => p.id === id)) return;
      setFilter(null);
      setExpanded(true);
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "start" }),
      );
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  const matching = filter
    ? projects.filter((p) => p.tags.includes(filter))
    : projects;

  // Filtering has already narrowed the set, so don't truncate on top of it.
  const shown = filter || expanded ? matching : matching.slice(0, HOME_LIMIT);
  const hidden = matching.length - shown.length;

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
        {shown.map((p) =>
          // The feature row only makes sense unfiltered — once you have
          // narrowed the set, every remaining row is equally relevant.
          p.feature && !filter ? (
            <Row key={p.id} project={p} post={published.get(p.writeup ?? "")} feature />
          ) : (
            <Row
              key={p.id}
              project={p}
              post={published.get(p.writeup ?? "")}
              filter={filter}
            />
          ),
        )}
      </div>

      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="link-rule mt-6 inline-flex cursor-pointer items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-2"
        >
          Show {hidden} more
          <Icon name="plus" className="h-3 w-3" />
        </button>
      ) : null}

      {matching.length === 0 ? (
        <p className="py-6 text-ink-3">Nothing tagged {filter}.</p>
      ) : null}
    </Section>
  );
}

function Row({
  project: p,
  post,
  filter = null,
  feature = false,
}: {
  project: Project;
  post?: PostMeta;
  filter?: string | null;
  feature?: boolean;
}) {
  return (
    <article
      id={p.id}
      /* Two columns, not three. The badge used to own a 100px column for a
         four-character word; it reads better as an eyebrow. The stat column
         only exists when there is a stat, so a row without one no longer
         leaves a hole on the right. */
      className={`grid scroll-mt-[calc(var(--header-h)+1rem)] grid-cols-1 gap-x-10 gap-y-3 border-b border-rule-hair ${
        feature ? "py-8" : "py-6"
      } ${p.stat ? "md:grid-cols-[minmax(0,1fr)_140px]" : ""}`}
    >
      <div className="min-w-0">
        <span className="label mb-2 block text-brand">{p.badge}</span>

        <h3
          className={
            feature
              ? "text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-heading"
              : "text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-heading"
          }
        >
          {p.title}
        </h3>

        <p className="mt-1.5 max-w-[68ch] text-[0.9375rem] leading-[1.6] text-ink-2">
          {p.blurb}
        </p>

        {feature && p.points ? (
          <ul className="mt-4 grid list-none gap-x-10 gap-y-2 p-0 sm:grid-cols-2">
            {p.points.map((pt) => (
              <li
                key={pt}
                className="relative pl-4 text-[0.875rem] leading-[1.55] text-ink-2 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-brand"
              >
                {pt}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
            {p.tags.map((t) => (
              <span key={t} className={t === filter ? "text-brand" : undefined}>
                {t}
              </span>
            ))}
          </div>

          {post ? (
            <Link
              href={`/blog/${post.slug}`}
              className="link-rule inline-flex items-center gap-1 text-[0.75rem] text-brand"
            >
              How it was built
              <Icon name="arrow-up-right" className="h-3 w-3" />
            </Link>
          ) : null}
        </div>
      </div>

      {p.stat ? (
        <div className="md:text-right">
          <span className="block text-[1.5rem] font-semibold leading-none tracking-[-0.035em] text-heading tabular-nums">
            {p.stat.value}
          </span>
          <span className="mt-1.5 block text-[0.75rem] leading-snug text-ink-3">
            {p.stat.label}
          </span>
        </div>
      ) : null}
    </article>
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
