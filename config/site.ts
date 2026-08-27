// ─────────────────────────────────────────────────────────────
// All portfolio content. One file to swap.
//
// Sourced from the résumé, 27 Aug 2026. Every number here is one
// the résumé actually states or that follows from a named list.
// The résumé's unfilled [X] metrics are NOT invented — the bullets
// are written without them. See METRICS_TODO at the bottom.
// ─────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  /**
   * The row's hook, read before anything else. Prefer a metric over a
   * category — "75+ languages" earns a second of attention, "integrations"
   * does not. Several are still categories only because the number is
   * unfilled; see METRICS_TODO.
   */
  badge: string;
  /** Renders full width with its capability list. At most one. */
  feature?: boolean;
  /**
   * Slug of the blog post that goes deep on this — the problem, what was
   * tried, what shipped. The row links to it only when that post exists and
   * is published, so an unwritten write-up never leaves a dead link.
   */
  writeup?: string;
  /** Capability bullets. Only shown on the feature row. */
  points?: string[];
  title: string;
  blurb: string;
  tags: string[];
  stat?: { value: string; label: string };
  href?: string;
};

export type Role = {
  when: string;
  title: string;
  org: string;
  detail: string;
  points?: string[];
};

export type StackGroup = {
  label: string;
  items: string[];
};

// basePath is not applied to plain <a href> — only to next/link and assets —
// so anything served from /public has to carry it explicitly.
const basePath = (() => {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return raw === "/" ? "" : raw.replace(/\/$/, "");
})();

export const profile = {
  name: "Siddharth Rathod",
  role: "Product Lead Engineer",
  location: "Bengaluru, India",
  timezone: "IST · UTC+5:30",
  company: "Vitra.ai",
  status: "Open to interesting problems",
  deck:
    "I build products and design the systems they run on. Mostly backend and architecture \u2014 multi-tenant platforms, event-driven pipelines, and generative AI applied to real problems, built to hold up in production.",
  email: "siddhu200113@gmail.com",
  github: "https://github.com/code-zenx",
  // TODO: real profile URL — the résumé has a placeholder here too.
  linkedin: "https://www.linkedin.com/in/",
  resumeUrl: `${basePath}/resume.pdf`,
  // Set by the Pages workflow from actions/configure-pages; the fallback is
  // the eventual custom domain. Drives canonicals, OpenGraph and sitemap.xml.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://siddharthrathod.dev",
  // No phone number here on purpose: this repo is public, so anything in
  // it is scrapeable whether the page renders it or not. It belongs in the
  // résumé PDF, which you hand to people directly.
} as const;

export type Fact = {
  value: string;
  label: string;
  /** Exactly one tile gets the accent. Two would be two shouts. */
  accent?: boolean;
};

/**
 * Every figure here is one the résumé states or that follows from the role
 * list. Nothing invented — see METRICS_TODO at the bottom of this file for
 * the numbers still missing.
 */
export const facts: Fact[] = [
  { value: "5+", label: "Years shipping" },
  // Intern → SWE → Senior → Senior II → Product Lead Engineer.
  { value: "4\u00d7", label: "Promoted in five years", accent: true },
  { value: "75+", label: "Languages in production" },
  { value: "3", label: "Products consolidated" },
];

export const projects: Project[] = [
  {
    id: "universe",
    badge: "Flagship",
    feature: true,
    points: [
      "Combined RBAC and ABAC across an org / workspace / service hierarchy",
      "Usage-metered billing: plan management, top-ups, per-service consumption",
      "Structured logging and distributed tracing on OpenObserve",
      "Containerised monorepo so services deploy independently",
    ],
    title: "Universe — unified enterprise platform",
    blurb:
      "Consolidated three standalone products — dubbing, subtitling and design-file translation — into one multi-tenant system, which opened the company's first enterprise deals.",
    tags: ["NestJS", "PostgreSQL", "Multi-tenant", "RBAC + ABAC"],
    stat: { value: "3", label: "products consolidated" },
  },
  {
    id: "editor",
    badge: "75+ languages",
    title: "Long-form video editor",
    blurb:
      "Moved video, audio and background-audio processing into Web Workers and OffscreenCanvas so the dubbing editor stops freezing on 2+ hour content.",
    tags: ["Web Workers", "OffscreenCanvas", "React", "Virtualization"],
    stat: { value: "2h+", label: "video, no main-thread block" },
  },
  {
    id: "pipelines",
    badge: "Async DAGs",
    title: "AI pipeline orchestration",
    blurb:
      "Modelled transcription → translation → synthesis as Conductor OSS DAGs, so a stage fails and recovers without taking the whole job down.",
    tags: ["Conductor OSS", "DAGs", "Kafka", "BullMQ"],
    stat: { value: "3-stage", label: "DAG per job" },
  },
  {
    id: "tm",
    badge: "Cost",
    title: "Translation memory",
    blurb:
      "Segment-level reuse in the shape of Phrase's TM, so repeated content stops paying for inference twice.",
    tags: ["PostgreSQL", "LLMs", "Cost"],
  },
  {
    id: "plugins",
    badge: "Integrations",
    title: "Design-tool plugin surface",
    blurb:
      "Figma, Photoshop, Illustrator and InDesign behind one shared API, collapsing four duplicated codepaths into one.",
    tags: ["TypeScript", "Plugin APIs"],
    stat: { value: "4", label: "design tools, one API" },
  },
  {
    id: "sale-rocket",
    badge: "Internal",
    title: "Sale Rocket — call analytics",
    blurb:
      "Sales-call analytics that transcribes and analyses calls, surfacing performance metrics and actionable follow-ups for the team.",
    tags: ["Python", "NLP", "LLMs"],
  },
];

export const roles: Role[] = [
  {
    when: "Apr 2025 — now",
    title: "Product Lead Engineer",
    org: "Vitra.ai",
    detail:
      "Architecture and platform for the enterprise line, plus full ownership of video dubbing — the highest-revenue product.",
    points: [
      "Architected Universe, the multi-tenant platform that consolidated three standalone products and enabled the company's first enterprise deals.",
      "Built the authorization layer from scratch — RBAC and ABAC combined across org, workspace, and service.",
      "Designed usage-metered billing: plan management, top-ups, and per-service consumption tracking.",
      "Orchestrated the AI pipelines as Conductor OSS DAGs, with retry semantics and per-stage observability.",
      "Led a 3-month stabilization program on dubbing that cut production incidents and failed jobs.",
      "Re-engineered the client for 2+ hour videos across 75+ languages using Web Workers and OffscreenCanvas.",
      "Restructured the PostgreSQL JSONB schema for targeted partial updates instead of full-document rewrites.",
      "Built the WebSocket connection manager behind a new multi-user collaborative workspace, and the product's first observability and Slack alerting stack.",
      "Instrumented the platform with structured logging and distributed tracing on OpenObserve; containerized the monorepo so services deploy independently.",
    ],
  },
  {
    when: "Apr 2024 — Mar 2025",
    title: "Senior Software Engineer II",
    org: "Vitra.ai",
    detail: "Translate Video, end to end — web app, API server, AI pipeline.",
    points: [
      "Built an internal subtitling tool that auto-generates subtitles in 10 languages.",
      "Led Sale Rocket, a sales-call analytics platform.",
      "Cut AI inference cost by benchmarking and swapping transcription models and LLMs, then fine-tuning the survivors on domain data.",
    ],
  },
  {
    when: "Apr 2023 — Mar 2024",
    title: "Senior Software Engineer",
    org: "Vitra.ai",
    detail: "Sole owner of the flagship translation product after a team departure.",
    points: [
      "Shipped the client feature backlog without a delivery slip, and built the intake-to-release pipeline that kept it moving.",
      "Introduced backend integration test coverage where there was none.",
      "Built a multilingual chatbot POC and shipped it as a Frontdesk extension integration.",
    ],
  },
  {
    when: "Apr 2022 — Mar 2023",
    title: "Software Engineer",
    org: "Vitra.ai",
    detail: "Backend architecture for two SaaS products, schema through deploy.",
    points: [
      "Delivered video, audio, and text translation products on Next.js and NestJS.",
      "Designed the platform authorization system and an internal component library adopted across every product line.",
      "Shipped a Chrome extension for real-time chat translation; integrated Stripe for subscription billing.",
      "Instituted the team's code review process and weekly planning cadence.",
    ],
  },
  {
    when: "Jun 2021 — Mar 2022",
    title: "Software Engineer Intern",
    org: "Vitra.ai",
    detail: "Where the pager taught me everything.",
    points: [
      "Built a multilingual chatbot POC and a custom Video.js-based HTML5 player, demoed to Tata EdgeClass and Apollo Hospitals.",
    ],
  },
  {
    when: "Jan 2021 — Jun 2021",
    title: "Front-End Engineer, freelance",
    org: "HM-Infotech",
    detail: "Sole engineer across 3 client projects, Gujarat.",
    points: [
      "Owned the full cycle — requirements, deployment, post-launch maintenance.",
      "Cut page load time 20% through code splitting, asset optimization, and caching, while establishing Git-based version control and testing practice.",
    ],
  },
];

export const stack: StackGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "Bash"],
  },
  {
    label: "Backend",
    items: ["Node.js", "NestJS", "REST", "WebSockets", "Microservices"],
  },
  {
    label: "Distributed",
    items: ["Kafka", "BullMQ", "Redis Streams", "Conductor OSS", "Event-driven"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Query optimization"],
  },
  {
    label: "Cloud & DevOps",
    items: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Linux"],
  },
  {
    label: "AI / ML",
    items: ["LLMs", "RAG", "LangChain", "NLP", "Voice assistants"],
  },
  {
    label: "Observability",
    items: ["OpenTelemetry", "Prometheus", "Grafana", "OpenObserve", "Playwright"],
  },
];

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#stack", label: "Stack" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Numbers the résumé still has as [X]. Every bullet above is written
 * so it reads correctly WITHOUT them — fill these in and the copy gets
 * sharper, but nothing here is currently claiming a figure it can't back.
 *
 *  Product Lead Engineer
 *   - translation memory: % reduction in redundant LLM/API calls
 *   - billing: number of independent metered services
 *   - containerization: number of services
 *   - stabilization: % drop in production incidents / failed jobs
 *   - timeline virtualization: editor load time, before → after
 *   - JSONB partial updates: % write-latency cut
 *   - collaboration: edit propagation latency, ms
 *   - alerting: MTTD, before → after
 *  Senior Software Engineer II
 *   - subtitling: turnaround time, before → after
 *   - inference cost: % cut
 *  Senior Software Engineer
 *   - features shipped after taking sole ownership
 *   - integration test coverage, before → after %
 *  Software Engineer
 *   - Chrome extension: user count
 */
