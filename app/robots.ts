import type { MetadataRoute } from "next";

// Required by `output: export` — these are files on disk, not routes.
export const dynamic = "force-static";
import { profile } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
