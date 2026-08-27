import type { MetadataRoute } from "next";

// Required by `output: export` — these are files on disk, not routes.
export const dynamic = "force-static";
import { postMeta } from "@/features/blog/posts.server";
import { projectMeta } from "@/features/projects/projects.server";
import { profile } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = postMeta().map((p) => ({
    url: `${profile.siteUrl}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const projects = projectMeta()
    .filter((p) => p.hasBody)
    .map((p) => ({
      url: `${profile.siteUrl}/projects/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [
    { url: profile.siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${profile.siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...projects,
    ...posts,
  ];
}
