// Server only. This module reads the content directory, so importing it from a client
// component drags node:fs into the browser bundle — which fails the build
// with an unhelpful chunking error. This import makes it fail clearly.
import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Frontmatter = Record<string, unknown>;

export type RawEntry = {
  slug: string;
  data: Frontmatter;
  content: string;
};

/**
 * Reads one MDX collection off disk. Both collections (posts, projects)
 * share the read; each supplies its own parser for its own frontmatter.
 */
export function readCollection(dir: string): RawEntry[] {
  const abs = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(abs)) return [];

  return fs
    .readdirSync(abs)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(abs, file), "utf8"));
      return { slug: file.replace(/\.mdx?$/, ""), data, content };
    });
}

export const isDev = process.env.NODE_ENV === "development";

/** 200wpm. Good enough until posts start carrying heavy code blocks. */
export function readingMinutes(content: string): number {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

export function str(v: unknown, fallback = ""): string {
  return v == null ? fallback : String(v);
}

export function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}
