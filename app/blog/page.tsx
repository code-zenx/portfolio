import type { Metadata } from "next";
import Link from "next/link";
import { postMeta } from "@/features/blog/posts.server";
import { longDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Technical writing on distributed systems, infrastructure, and the debugging sessions worth writing down.",
};

export default function BlogIndex() {
  const posts = postMeta();

  return (
    <>
      <section>
        <div className="mx-auto max-w-[1080px] px-5 pb-12 pt-20 md:px-10">
          <p className="label mb-7 flex items-center gap-3">
            Writing
            <span className="h-px flex-1 bg-rule-hair" />
          </p>
          <h1 className="display text-balance text-[length:var(--text-h1)]">
            Notes from
            <br />
            the build<span className="italic">.</span>
          </h1>
          <p className="mt-7 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
            Longer pieces on systems that misbehave, and what fixed them. No
            tutorials, no listicles.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-10">
          {posts.length === 0 ? (
            <p className="text-ink-3">
              No posts yet. Add an .mdx file to content/blog.
            </p>
          ) : (
            <div className="border-t border-rule-hair">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-rule-hair py-7 transition-[background-color,padding] duration-200 hover:bg-brand-wash hover:pl-4 md:grid-cols-[140px_minmax(0,1fr)]"
                >
                  <div className="pt-1 text-[13px] tabular-nums tracking-[0.04em] text-ink-3">
                    {longDate(p.date)}
                    <span className="mt-1 block">{p.readingMinutes} min read</span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="h2 mb-1.5 text-[1.375rem]">
                      {p.title}
                      {p.draft ? (
                        <span className="ml-3 align-middle border border-brand px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-brand">
                          Draft
                        </span>
                      ) : null}
                    </h2>
                    <p className="max-w-[62ch] text-[15.5px] leading-[1.55] text-ink-2">
                      {p.summary}
                    </p>
                    {p.tags.length ? (
                      <div className="mt-3 flex flex-wrap gap-x-3.5 text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
