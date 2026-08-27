import { cache } from "react";
import { isDev, readCollection, str, strArray } from "@/lib/content";

export * from "@/lib/project-kinds";
import { KINDS, type Kind, type Project, type ProjectMeta } from "@/lib/project-kinds";

function parseLinks(v: unknown): { label: string; href: string }[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const { label, href } = entry as { label?: unknown; href?: unknown };
    return label && href ? [{ label: String(label), href: String(href) }] : [];
  });
}

export const allProjects = cache((): Project[] =>
  readCollection("projects")
    .map(({ slug, data, content }) => {
      if (!data.title || !data.kind) {
        throw new Error(`content/projects/${slug}: frontmatter needs title and kind`);
      }
      const kind = str(data.kind) as Kind;
      if (!KINDS.includes(kind)) {
        throw new Error(
          `content/projects/${slug}: kind "${kind}" is not one of ${KINDS.join(", ")}`,
        );
      }

      return {
        slug,
        title: str(data.title),
        tagline: str(data.tagline),
        summary: str(data.summary),
        kind,
        status: str(data.status),
        tags: strArray(data.tags),
        links: parseLinks(data.links),
        date: data.date
          ? new Date(str(data.date)).toISOString().slice(0, 10)
          : "1970-01-01",
        featured: data.featured === true,
        draft: data.draft === true,
        hasBody: content.trim().length > 0,
        body: content,
      };
    })
    .filter((p) => !p.draft || isDev)
    .sort((a, b) => b.date.localeCompare(a.date)),
);

export const projectMeta = cache((): ProjectMeta[] =>
  allProjects().map(({ body: _body, ...meta }) => meta),
);

export function getProject(slug: string): Project | undefined {
  return allProjects().find((p) => p.slug === slug);
}
