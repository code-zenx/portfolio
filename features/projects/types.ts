// Client-safe half of the projects module: types and lookup tables only.
// projects.server.ts touches node:fs, so anything a client component needs
// has to live here or the reader gets pulled into the browser bundle.

export const KINDS = ["app", "package", "extension", "desktop", "plugin"] as const;
export type Kind = (typeof KINDS)[number];

export const KIND_LABEL: Record<Kind, string> = {
  app: "Web app",
  package: "Package",
  extension: "Extension",
  desktop: "Desktop",
  plugin: "Plugin",
};

export type ProjectLink = { label: string; href: string };

export type ProjectMeta = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  kind: Kind;
  /** Free text shown as the row's eyebrow — "Live", "macOS · Windows", "4.8K downloads". */
  status: string;
  tags: string[];
  links: ProjectLink[];
  /** Sorts the index. Newest first. */
  date: string;
  featured: boolean;
  draft: boolean;
  /** True when the .mdx has a body worth a detail page. */
  hasBody: boolean;
};

export type Project = ProjectMeta & { body: string };
