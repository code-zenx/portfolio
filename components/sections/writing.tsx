import Link from "next/link";
import { Icon } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import type { PostMeta } from "@/lib/posts";
import { longDate } from "@/lib/format";

export function Writing({ posts, total }: { posts: PostMeta[]; total: number }) {
  return (
    <Section
      id="writing"
      label="Writing"
      title="Notes from the build"
      count={String(total).padStart(2, "0")}
    >
      <div className="border-t border-rule-hair">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-1 border-b border-rule-hair py-4 transition-colors duration-150 hover:bg-brand-wash md:grid-cols-[100px_minmax(0,1fr)_74px]"
          >
            <span className="text-[0.75rem] tabular-nums text-ink-3">
              {longDate(p.date)}
            </span>
            <span className="min-w-0">
              <span className="block text-[1.0625rem] font-semibold tracking-[-0.01em] text-heading">
                {p.title}
              </span>
              <span className="mt-0.5 block max-w-[64ch] truncate text-[0.875rem] text-ink-3">
                {p.summary}
              </span>
            </span>
            <span className="text-[0.75rem] uppercase tracking-[0.1em] text-ink-3 md:text-right">
              {p.readingMinutes} min
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/blog"
        className="link-rule mt-6 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-2"
      >
        All writing
        <Icon name="arrow-up-right" className="h-3 w-3" />
      </Link>
    </Section>
  );
}
