// ─────────────────────────────────────────────────────────────
// All portfolio content. One file to swap.
//
// EDITORIAL RULE: no achievement metrics in this file. A résumé is
// written for one moment; this site has to read correctly years from
// now, with nobody remembering whether the number still holds. So the
// copy names the MECHANISM, not the delta:
//
//   yes — "Improved editor load time through paginated retrieval,
//          caching, and optimized state lookups."
//   no  — "Cut editor load from 10s to 2s."
//
// Percentages, before → after pairs, incident counts, feature counts
// and revenue shares all live in the résumé PDF, which is dated and
// handed to people directly. They do not belong here.
//
// The few figures that remain are structural, not achievements: they
// describe what the systems are, and they stay true as time passes.
// ─────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  /**
   * The row's hook, read before anything else. A short category or
   * capability — never a performance delta, which would date the row.
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
  /** Structural facts only — what a thing IS, never what it improved by. */
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

/**
 * A bare string is something used in production. The object form marks
 * depth honestly — "learning" means side-project hands-on, not shipped
 * work. Claiming five years of something you touched twice is the fastest
 * way to lose an interview; saying so first costs nothing and reads as
 * someone still growing.
 */
export type StackItem = string | { name: string; note: string };

export type StackGroup = {
  label: string;
  items: StackItem[];
};

export type StackBand = {
  id: string;
  /** What this band of the toolkit is, in the reader's terms. */
  title: string;
  /** One line answering "what would I contact this person about?" */
  blurb: string;
  groups: StackGroup[];
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
    "I build B2B AI localization products and the platforms they run on. Translate.Video end to end — React client, NestJS APIs, PostgreSQL, and multi-stage AI pipelines for speech, translation and lip-sync orchestrated on Conductor OSS — plus the multi-tenant platform, authorization and metered billing underneath.",
  email: "siddhu200113@gmail.com",
  github: "https://github.com/code-zenx",
  linkedin: "https://www.linkedin.com/in/rathod-siddharth",
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

/** First day at Vitra.ai. Drives the years tile so it never goes stale. */
const CAREER_START = new Date("2021-06-01");

const yearsShipping = Math.floor(
  (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
);

/**
 * The hero grid is md:grid-cols-4 — keep this at exactly four tiles.
 * Every tile is either computed or structural, so none of them rot:
 * the years count itself forward, and the rest describe what exists.
 */
export const facts: Fact[] = [
  { value: `${yearsShipping}+`, label: "Years shipping" },
  // Intern → SWE → Senior → Senior II → Product Lead Engineer.
  { value: "5", label: "Titles at one company", accent: true },
  { value: "75+", label: "Languages in production" },
  { value: "4", label: "Products consolidated" },
];

export const projects: Project[] = [
  {
    id: "universe",
    badge: "Flagship",
    feature: true,
    points: [
      "Authentication and authorization from scratch — RBAC and ABAC across an org / workspace / service hierarchy",
      "Usage-metered billing: plans, add-ons, top-ups, per-service consumption",
      "Structured logging and distributed tracing on OpenObserve",
      "Docker containerisation and Slack-routed incident alerting",
    ],
    title: "Universe — unified enterprise platform",
    blurb:
      "Consolidated four standalone products — video dubbing, subtitling, playground and design-file translation — into one multi-tenant system. Enabled the company's first enterprise partnership deals.",
    tags: ["NestJS", "PostgreSQL", "Multi-tenant", "RBAC + ABAC"],
    stat: { value: "4", label: "products consolidated" },
  },
  {
    id: "editor",
    badge: "Long-form",
    title: "Long-form video editor",
    blurb:
      "Moved video, audio and background-audio processing into Web Workers with OffscreenCanvas frame rendering, and added timestamp-range timeline virtualization with paginated infinite scroll, so load time stays flat as projects grow.",
    tags: ["Web Workers", "OffscreenCanvas", "React", "Virtualization"],
  },
  {
    id: "player",
    badge: "Frame-accurate",
    title: "Video player engine",
    blurb:
      "A purpose-built engine coordinating playback, transcript sync and timeline state as one managed system, with frame-accurate rendering migrated from Remotion to Mediabunny for the frame-level seeking dubbing and subtitle alignment require.",
    tags: ["Mediabunny", "Remotion", "Video.js", "TypeScript"],
  },
  {
    id: "translation-memory",
    badge: "In-house service",
    title: "Translation memory service",
    blurb:
      "A standalone service with its own storage and matching model, not a feature living inside one product: segment-level reuse of previously translated content, consumed across the product line so repeated material stops paying for inference twice.",
    tags: ["Service design", "PostgreSQL", "Segmentation", "Inference cost"],
  },
  {
    id: "photo-agents",
    badge: "Agentic",
    title: "Translate.Photo — multi-agent image resizing",
    blurb:
      "Knowledge extraction (OCR, brand and design element detection) → layout planning per target aspect ratio → image generation → automated QA that re-runs extraction to catch hallucinations and typos before triggering targeted fixes.",
    tags: ["Multi-agent", "OCR", "LLMs", "Python"],
  },
  {
    id: "short-video",
    badge: "Generative",
    title: "Short.Video — agentic video generation",
    blurb:
      "LangChain pipelines for document ingestion, script generation and multi-scene video generation via Kling and Veo 3, holding scene and clip continuity across long-form output.",
    tags: ["LangChain", "Kling", "Veo 3", "RAG"],
  },
  {
    id: "personalized-video",
    badge: "GPU pipeline",
    title: "Short.Video — personalized video platform",
    blurb:
      "Programmatic image overlays, with voice synthesis and LatentSync lip-sync wired in through vendor APIs, optimised with FFmpeg and GPU encoding in place of OpenCV, served through FastAPI with a managed queue for bulk generation and resource control.",
    tags: ["FFmpeg", "FastAPI", "LatentSync", "GPU"],
  },
  {
    id: "pipelines",
    badge: "Async DAGs",
    title: "AI pipeline orchestration",
    blurb:
      "Transcription → translation → synthesis modelled as Conductor OSS DAGs, so a stage fails and recovers on its own retry semantics without taking the whole job down, with per-stage observability across the run.",
    tags: ["Conductor OSS", "DAGs", "Kafka", "BullMQ"],
  },
  {
    id: "export",
    badge: "Parallel",
    title: "Video export pipeline",
    blurb:
      "FFmpeg and canvas-based rendering combined with parallel processing, bringing export times down across varying video lengths.",
    tags: ["FFmpeg", "Canvas", "Node.js"],
  },
  {
    id: "psd",
    badge: "Reflow",
    title: "Photoshop file translation",
    blurb:
      "PSD translation with bulk processing and multi-language output, solving font loading and text-expansion layout with a reflow algorithm that handles translated strings of differing lengths and surfaces phrasing alternatives.",
    tags: ["Adobe UXP", "TypeScript", "Layout"],
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
      "Translate.Video end to end — the company's highest-revenue product — plus the Universe platform underneath it.",
    points: [
      "Led a team across frontend, backend and AI pipeline work, running sprint planning and code review, and mentoring junior engineers.",
      "Led a stabilization program that rewrote core frontend and backend systems after accumulated feature debt made the product unreliable at scale, bringing production incidents down.",
      "Built a purpose-built video player engine coordinating playback, transcript sync and timeline state as one managed system, migrating frame-accurate rendering from Remotion to Mediabunny.",
      "Re-engineered the web client for long-form video across the full supported language set, moving media processing into Web Workers, rendering frames via OffscreenCanvas, and adding timeline virtualization so load time stays flat as projects grow.",
      "Restructured the PostgreSQL JSONB schema for targeted partial updates instead of full-document rewrites, and built the WebSocket connection manager behind a multi-user collaborative workspace.",
      "Architected Universe, the multi-tenant platform consolidating standalone products into one system. Enabled the company's first enterprise partnership deals.",
      "Built authentication and the authorization layer from scratch, combining RBAC and ABAC across an org / workspace / service hierarchy and enforcing it at the API surface, alongside usage-metered billing with plans, add-ons, top-ups and per-service consumption tracking.",
      "Modelled transcription, translation and synthesis as Conductor OSS DAGs with retry semantics and per-stage observability.",
      "Designed the translation memory as a standalone in-house service with its own storage and matching model, consumed across the product line so repeated content avoids redundant LLM and API calls.",
      "Unified the Figma, Photoshop, Illustrator and InDesign plugins behind a shared API surface, and instrumented the platform with structured logging, distributed tracing, containerization and Slack-routed alerting.",
    ],
  },
  {
    when: "Apr 2024 — Mar 2025",
    title: "Senior Software Engineer II",
    org: "Vitra.ai",
    detail: "Agentic pipelines across Translate.Photo, Short.Video and Translate.Video.",
    points: [
      "Architected a multi-stage agentic pipeline for image adaptation: knowledge extraction, layout planning per target aspect ratio, image generation, then automated QA that re-runs extraction to catch hallucinations before triggering targeted fixes.",
      "Built LangChain pipelines for document ingestion, script generation and multi-scene video generation, holding scene and clip continuity across long-form output.",
      "Built personalized video generation with programmatic image overlays and vendor-backed voice synthesis and lip-sync, moving from OpenCV to FFmpeg with GPU encoding, served through FastAPI on a managed queue.",
      "Improved editor load time through paginated retrieval, Redux listeners, binary-search lookups, and a custom cache and asset manager.",
      "Built bulk avatar video generation on Node.js streams and child processes, driving vendor voice-cloning and lip-sync models through the pipeline alongside FFmpeg-based looping.",
      "Reduced inference cost by benchmarking and replacing transcription models and LLMs across the pipeline, then fine-tuning the survivors on domain-specific data.",
      "Led Sale Rocket, a sales-call analytics platform, and built an internal multilingual subtitling tool that shortened subtitle turnaround.",
    ],
  },
  {
    when: "Apr 2023 — Mar 2024",
    title: "Senior Software Engineer",
    org: "Vitra.ai",
    detail: "Frontend and backend delivery for the flagship dubbing product.",
    points: [
      "Owned delivery for video and audio dubbing and multilingual, multi-speaker subtitle generation, shipping client-requested features through a pipeline established from intake to release.",
      "Engineered the TTS, STT and text translation modules around ElevenLabs and Cartesia speech synthesis, and added parallel and series execution modes to the central process manager, scaling throughput across every product line.",
      "Built an export pipeline combining FFmpeg with canvas-based rendering and parallel processing, bringing export times down across varying video lengths.",
      "Shipped PSD translation with bulk processing and multi-language output, solving font loading and text expansion with a reflow algorithm that surfaces phrasing alternatives.",
      "Built the product's first observability layer — Prometheus metrics, Loki log aggregation, Grafana dashboards — with Slack alerting on job failures and queue depth.",
      "Introduced backend test coverage with Jest unit and integration tests, bringing production regressions down.",
    ],
  },
  {
    when: "Apr 2022 — Mar 2023",
    title: "Software Engineer",
    org: "Vitra.ai",
    detail: "Backend architecture for two SaaS products, schema through deploy.",
    points: [
      "Owned backend for two SaaS translation products: authentication and a combined RBAC/ABAC authorization layer from scratch, PostgreSQL for relational data and DynamoDB for high-volume non-relational workloads.",
      "Modelled flexible product configuration in PostgreSQL JSONB, avoiding schema migrations for client-specific settings while keeping the data queryable.",
      "Built an internal React and TypeScript component library adopted across every product line, including a voice-preview library and a filterable language selector.",
      "Integrated Stripe for subscription billing and payment processing across both products.",
    ],
  },
  {
    when: "Jun 2021 — Mar 2022",
    title: "Software Engineer Intern",
    org: "Vitra.ai",
    detail: "Where the pager taught me everything.",
    points: [
      "Built a custom Video.js-based HTML5 player with HLS adaptive streaming, white-labeled client theming, interactive overlays, playlist management and ad insertion — demoed to Tata EdgeClass and Apollo Hospitals, leading to a pilot engagement.",
      "Prototyped a multilingual chatbot alongside several internal frontend and backend proof-of-concept projects.",
    ],
  },
  {
    when: "Jan 2021 — Jun 2021",
    title: "Front-End Engineer, freelance",
    org: "HM-Infotech",
    detail: "Sole engineer across 3 client projects, Gujarat.",
    points: [
      "Owned the full cycle — requirements, deployment, post-launch maintenance.",
      "Improved page load times through code splitting, asset optimization and caching, while establishing Git-based version control and testing practice.",
    ],
  },
];

export const stack: StackBand[] = [
  // Three bands, ordered by what a reader should take away first. Twelve flat
  // rows gave every category the same weight, so the rare work (platform, AI
  // in production, media) read no louder than Jest. The bands fix that, and
  // each blurb answers the only question a visitor really has: what would I
  // contact this person about?
  {
    id: "design",
    title: "Systems I design",
    blurb:
      "Untangling a single-tenant product into a platform. Putting an AI pipeline in front of paying customers. Making video work in a browser. This is the work I go deep on.",
    groups: [
      {
        // Systems designed here, not tools used, and each item is a noun a
        // non-specialist can read. Two deliberate omissions:
        //
        //   Authentication — every backend engineer has built a login. It stays
        //   in the role and project copy, where it shows scope, but it does not
        //   earn a slot in a list meant to say what is UNCOMMON about the work.
        //   The rare part is the policy model, so the entry leads with the
        //   tenant hierarchy and keeps RBAC/ABAC as the qualifier.
        //
        //   DAG orchestration — DAGs are a Conductor OSS feature, and Conductor
        //   already appears under Backend & Distributed. Listing both counted
        //   one thing twice and dressed tool adoption up as architecture.
        label: "Architecture",
        items: [
          "Multi-tenant SaaS",
          "Tenant-scoped permissions (RBAC + ABAC)",
          "Usage-based metering & billing",
          "Event-driven job pipelines",
          "Internal platform services",
        ],
      },
      {
        // Ordered by scarcity, not by hype. RAG and "LLM orchestration" are
        // commodity claims on any 2026 CV — RAG stays only because keyword
        // screens look for it, and orchestration was dropped as vague and
        // already implied by multi-agent pipelines. What is actually rare is
        // evidence of running nondeterministic systems in production: evals
        // that catch hallucinations, and inference cost held down by model
        // selection and reuse. Both are backed by shipped work (the QA stage
        // in Translate.Photo, the model swaps and the translation memory).
        //
        // Speech synthesis, voice cloning and lip-sync are vendor models
        // (ElevenLabs, Cartesia, LatentSync) — the engineering is the pipeline
        // around them, so this row says "integration" and never implies the
        // models were built in-house. Vendor names live in the project copy.
        label: "AI systems",
        items: [
          "Multi-agent pipelines",
          "Evals & hallucination QA",
          "Model benchmarking & selection",
          "Fine-tuning on domain data",
          "RAG",
          "Speech & lip-sync vendor integration",
        ],
      },
      {
        // The operational layer under the pipelines, and a different competence
        // from designing them — worth its own row because most engineers who
        // "build with LLMs" have never run one in production.
        //
        // LiteLLM is named inline on purpose. It provides the fallback routing,
        // prompt management and cost accounting, so listing those bare would
        // repeat the Conductor/DAG mistake — claiming a tool's feature list as
        // personal invention. What IS the work: routing every model call
        // through one control point, and the routing and eval policy on top.
        label: "LLM platform",
        items: [
          "Model gateway & fallback routing (LiteLLM)",
          "Structured outputs & schema validation",
          "Prompt versioning",
          "Token & cost tracking per call",
          "Provider-agnostic pipelines",
        ],
      },
      {
        label: "Media pipelines",
        items: [
          "FFmpeg",
          "GPU encoding",
          "HLS streaming",
          "Frame-accurate rendering",
          "Transcript & subtitle alignment",
          "Batch render queues",
        ],
      },
    ],
  },
  {
    id: "build",
    title: "What I build with",
    blurb:
      "The tools underneath. Most are interchangeable — knowing when they aren't is the job.",
    groups: [
      {
        // Runtime / framework paired with a slash: says I know which is which,
        // keeps both keywords for automated screens, and rescues Python +
        // FastAPI, which were split across two rows and read as unrelated.
        // Row renamed from "Backend & Distributed" — it wrapped to two lines
        // in the label column, and Kafka/Conductor/BullMQ already say
        // "distributed" without the word.
        label: "Backend",
        items: [
          "Node.js / NestJS",
          "Python / FastAPI",
          "WebSockets",
          "Kafka",
          "Conductor OSS",
          "BullMQ",
        ],
      },
      {
        label: "Frontend",
        items: [
          "React / Next.js",
          "Redux Toolkit",
          "Web Workers",
          "OffscreenCanvas",
          "Virtualization",
          "Mediabunny",
        ],
      },
      {
        label: "Data",
        items: ["PostgreSQL (JSONB, partial updates)", "DynamoDB", "Redis"],
      },
      {
        label: "Integrations",
        items: ["Stripe", "Figma Plugin API", "Adobe UXP & CEP"],
      },
      {
        label: "Languages",
        items: ["TypeScript", "Python", { name: "Go", note: "learning" }],
      },
    ],
  },
  {
    id: "run",
    title: "How I keep it running",
    blurb:
      "Shipping is half the job. The other half is knowing it broke before a customer tells you.",
    groups: [
      {
        label: "Cloud & DevOps",
        items: [
          "AWS",
          "Docker",
          "GitHub Actions",
          "Independent service deploys",
          { name: "Kubernetes", note: "learning" },
        ],
      },
      {
        // Alerting lives here, not under Integrations. Wiring a Slack webhook
        // is an integration; deciding what pages a human — job failures, queue
        // depth — is an observability practice, and that is the part that counts.
        label: "Observability",
        items: [
          "OpenTelemetry",
          "Prometheus",
          "Grafana",
          "Loki",
          "OpenObserve",
          "Incident alerting",
        ],
      },
      {
        label: "Testing",
        items: [
          "Jest",
          "React Testing Library",
          "Cypress",
          "Integration & E2E suites",
        ],
      },
    ],
  },
];

/**
 * Closing line under the toolkit. The list is a snapshot; this says the
 * snapshot is not the point — which is the honest answer to "will you cope
 * with our stack?" Named migrations beat any claim of being "a fast learner".
 */
export const stackNote =
  "Half this list will be dated in three years. Remotion gave way to Mediabunny when frame-level seeking mattered, and models get swapped on measured results. What transfers is knowing which layer a problem belongs in.";

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#stack", label: "Stack" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Not represented on this site, though the résumé carries them:
 * education (GEC Patan, BE ECE 2018–2022) and the standalone
 * Leadership Experience block. Both would need their own section.
 *
 * The résumé also carries the hard numbers — incident reduction,
 * editor load before/after, inference cost, export times, test
 * coverage. Those stay there by design; see the EDITORIAL RULE at the
 * top of this file before adding one back.
 */
