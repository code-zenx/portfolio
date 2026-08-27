// Server only. This module reads content/blog, so importing it from a client
// component drags node:fs into the browser bundle — which fails the build
// with an unhelpful chunking error. This import makes it fail clearly.
import "server-only";

import { cache } from "react";
import { isDev, readCollection, readingMinutes, str, strArray } from "@/lib/content";

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readingMinutes: number;
  draft: boolean;
};

export type Post = PostMeta & { body: string };

/** Reads the directory once per render pass, not once per caller. */
export const allPosts = cache((): Post[] =>
  readCollection("blog")
    .map(({ slug, data, content }) => {
      if (!data.title || !data.date) {
        throw new Error(`content/blog/${slug}: frontmatter needs title and date`);
      }
      return {
        slug,
        title: str(data.title),
        summary: str(data.summary),
        date: new Date(str(data.date)).toISOString().slice(0, 10),
        tags: strArray(data.tags),
        readingMinutes: readingMinutes(content),
        draft: data.draft === true,
        body: content,
      };
    })
    .filter((p) => !p.draft || isDev)
    .sort((a, b) => b.date.localeCompare(a.date)),
);

/**
 * Metadata only. Client components (the palette, the home list) get this —
 * shipping every post body in the RSC payload would be paying to serialize
 * text nobody is reading yet.
 */
export const postMeta = cache((): PostMeta[] =>
  allPosts().map(({ body: _body, ...meta }) => meta),
);

export function getPost(slug: string): Post | undefined {
  return allPosts().find((p) => p.slug === slug);
}
