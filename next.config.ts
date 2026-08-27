import type { NextConfig } from "next";

/**
 * GitHub Pages serves static files only, so the site is exported rather than
 * run. Everything here is already prerendered — no route handlers, no ISR,
 * no server actions — so nothing is lost.
 *
 * On a project page the site lives at /<repo>/, which needs a basePath. The
 * Pages workflow supplies it from actions/configure-pages; it is empty for a
 * user site or a custom domain, and empty locally.
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// Next rejects a basePath of exactly "/", which is what a user site reports.
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Pages has no server, so /blog must resolve to /blog/index.html.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // No image optimiser without a server.
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["cmdk"],
  },
};

export default nextConfig;
