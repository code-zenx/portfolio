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
  /**
   * One phrase, doing one job: the remit of this role. Not a joke, not a
   * location, not a list of technologies — those drifted in and made the
   * column read as four different fields.
   */
  detail: string;
  points?: string[];
  /**
   * Busy years get their bullets grouped by product. A flat list of seven
   * reads as one undifferentiated blur; the labels are what show that the
   * year spanned four products and an on-prem delivery. Quiet years just
   * use `points`.
   */
  streams?: { label: string; items: string[]; see?: string[] }[];
  /**
   * Project ids in `projects` that this work shipped as. Experience says what
   * changed; the Work row says what the thing is. Without the link the reader
   * has to find the connection themselves, and mostly won't.
   */
  see?: string[];
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
      "Roles alone could not express per-resource access, so RBAC gained an attribute layer across org / workspace / service",
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
    id: "subtitles",
    badge: "ASS format",
    title: "Animated subtitles",
    blurb:
      "ASS-format subtitle rendering with per-word karaoke timing, positioning and styling, aligned to the frame-accurate playback the dubbing editor depends on.",
    tags: ["ASS", "Canvas", "Frame timing", "Localization"],
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
  // Bullets here are about SCOPE AND OWNERSHIP — what I ran, how big it was,
  // what changed. How the systems themselves work belongs to the project
  // cards, which is where a reader who wants depth is already headed. When
  // both sections described systems, the second one read as a repeat.
  {
    when: "Apr 2025 — now",
    title: "Product Lead Engineer",
    org: "Vitra.ai",
    detail:
      "Universe, the platform the product line runs on, plus Translate.Video end to end.",
    streams: [
      {
        label: "Leading",
        items: [
          "Led backend and AI pipeline on Universe, with the rest of the team of five owning the other areas.",
          "Own Translate.Video end to end, the company's highest-revenue product.",
          "Kept core engineering — engine, pipeline, data model — and gave feature rewrites and parts of the API to juniors.",
          "Grew three juniors through the work: API design, caching and prefetch, browser storage, and the authorization layer.",
                    // Parked — the third bullet about this same lint check. The authorization
          // stream explains the mechanism better (the guard passes through, CI is what
          // closes it), and Leading reads stronger as four bullets purely about people.
          // "Turned the authorization rules into a lint check the team ships against, rather than a convention to remember.",
        ],
      },
      {
        label: "Universe — one platform from six products",
        items: [
          "Merged six products into one tenant-scoped platform so the company could sell a suite rather than separate tools.",
          "Registered galaxy contributions through the root module instead of letting products import each other, keeping them decoupled.",
          "Built Cosmos to compile visual workflows onto Conductor, each node a sub-workflow, so runs stay identical to native ones.",
                    // Parked — catalogue, not a decision. Presigned multipart uploads are table
          // stakes and branding is a feature; the only bullet in the stream that does
          // not argue anything.
          // "Shipped an assets manager on presigned multipart uploads, plus per-tenant branding resolved from the host at first paint.",
          "Folded a legacy product's tables into the platform behind compatibility views, then dropped the views once callers had moved.",
          "Ran renames as add, backfill, then drop, so a deploy landing mid-migration still found both shapes.",
        ],
        see: ["universe"],
      },
      {
        label: "Universe — authorization, entitlements and credits",
        items: [
          "Layered per-org entitlements above member RBAC, keeping what an org bought separate from what a member may do.",
          "Made one service call the only writer of audit rows, so nothing is inferred from a URL upstream.",
          "Derived permissions from one metadata source, so a new galaxy contributes its own without touching the central catalog.",
          "Left the guard pass-through when a route declares nothing, then made CI reject any route that declares nothing.",
          "Split credits into expiring plan allotment and non-expiring top-ups, spent oldest first against an append-only idempotent ledger.",
          "Kept the cost function and its pricing copy in one descriptor, so the pricing page cannot drift from the charge.",
        ],
      },
      {
        label: "Universe — pipeline and orchestration",
        items: [
          "Replaced the polling process manager with Conductor OSS, so stages retry, resume, and show their own failures in a dashboard.",
          "Defined workflows as code in a registry published by CI, rather than JSON pasted into a console.",
          "Modelled one galaxy alone as forty-odd versioned workflows over sixty task definitions, each stage independently retryable.",
          "Pinned a running flow to the definition version it started on, so a save mid-run cannot change it.",
          "Passed only an execution id between nodes, re-deriving upstream output from its own row rather than threading payloads.",
          "Budgeted each task by tier — two minutes when a person waits, hours for batch render — so stalls fail.",
          "Wired a compensating failure workflow that Conductor runs on any terminal failure, marking the job failed in the platform.",
                    // Parked — says the same thing as the execution-id bullet two above, only in
          // the abstract. Keep the mechanism, drop the restatement.
          // "Kept the orchestrator stateless about domain data, leaving the platform server the source of truth workers write back to.",
          "Made translation memory a global service behind a provider interface, so in-house and Phrase back the same calls.",
          "Resolved each org's keys self, then parent, then platform — with a flag that forbids the platform fallback entirely.",
          "Kept credentials out of workflow payloads; workers fetch them just in time behind an internal shared secret.",
        ],
        see: ["pipelines", "translation-memory"],
      },
      {
        // Orchestration is what runs; this is how it is kept honest. One
        // stream doing both ran to sixteen bullets and read as a wall.
        label: "Universe — quality, release and model selection",
        items: [
          "Sent logs straight to OpenObserve so a line carries the same trace id as its span, behind a circuit breaker.",
          "Put specs where being wrong is expensive: credit math, the rate solver, and the paths that stay audited.",
          "Made types and the authorization check blocking in CI, leaving inherited lint and test debt advisory until paid down.",
                    // Parked — table stakes. Real in the pipeline, but "we can roll back" is not
          // a claim that earns its line.
          // "Kept a production rollback job in the same pipeline as the deploy that would need it.",
          "Built a fixed evaluation set spanning category, length and format, so every model swap is judged on the same material.",
          "Ran open-source and commercial candidates through it together, so no vendor got a home advantage.",
          "Gave the final call to the operations team, who hear client work daily, rather than an engineer's ear.",
          "Traced a broken subtitle screen to one permission declared for a route whose body chose between reading and writing.",
          "Split those dispatchers so the body's action picks the permission, instead of the strictest one gating every call.",
          "Shipped a drift checker beside each backfill, so a half-applied migration showed up instead of going quiet.",
        ],
      },
      {
        label: "Translate.Video — core rewrite, four months",
        items: [
          "Raised the case that four years of patches had left the core unstable, then scoped and led the rewrite.",
          "Moved to the Next.js app router, so permission and credit checks sit at layout and template boundaries, not scattered guards.",
          "Collapsed four generations of player — raw canvas, Fabric, Konva, Remotion — into one engine coordinating playback, transcript and timeline.",
          "Migrated frame-accurate rendering to Mediabunny for the frame-level seeking that dubbing and subtitle alignment need.",
          "Moved decode and paint into a worker behind transferControlToOffscreen, so a React render can no longer stall a frame.",
          "Kept the clock on the page — Web Audio has no worker equivalent — and corrected the worker against it.",
          "Derived the timing warp on both sides from the same segments rather than shipping it, so copies cannot drift.",
          "Split timing drift like two springs in series, video eight times stiffer and softening when audio hit its bounds.",
          "Solved it in log space, where a 2x speed-up and slowdown cost the same.",
          "Carried three-hour projects with timestamp-keyed infinite scroll and virtualization across both transcript editor and timeline.",
                    // Parked — a table split with an index. Sound work, but routine beside the
          // spring model and worker-side decode in this stream.
          // "Split one voices table into standard, cloned and native, with filter metadata inline so lookups stopped scanning.",
          "Restructured the JSONB schema for targeted partial updates, and built the WebSocket manager behind concurrent editing.",
          "Cached video, dubs and background music separately — byte ranges, blob URLs, LRU chunks — matched to what each costs.",
          "Baked playback rate into audio bytes in a worker, so the player runs at 1x and never resamples the pitch.",
        ],
        see: ["editor", "player"],
      },
      {
        // Saying what is unfinished costs nothing and reads as someone running
        // a platform rather than narrating a finished one.
        label: "In flight",
        items: [
          "Universe keeps growing: partner teams drive the feature queue, and two galaxies are still to move onto Conductor.",
          "Taking the AI pipeline through CI/CD, and splitting the platform into modular services.",
        ],
      },
    ],
  },
  {
    when: "Apr 2024 — Mar 2025",
    title: "Senior Software Engineer II",
    org: "Vitra.ai",
    detail:
      "Translate.Photo spun out as its own product, agentic pipelines across the line, and the first on-prem delivery.",
    streams: [
      {
        label: "Translate.Photo",
        items: [
          "Split Translate.Photo out into its own product once it outgrew being a phase of Translate.Video.",
          "Replaced the Photopea web editor with native Photoshop and Illustrator plugins, which enterprise files and workflows required.",
          "Added Word, PowerPoint and Canva to the plugin surface as enterprise deals demanded each.",
                    // Parked — a feature list, and the next bullet breaks resizing into four
          // stages, which makes this scaffolding for a sentence that stands alone.
          // "Shipped image creation and adaptive resizing as the product's two core capabilities.",
          "Architected resizing as four stages — extraction, layout planning, generation, then QA that re-runs extraction to catch hallucinations.",
        ],
        see: ["photo-agents", "psd"],
      },
      {
        label: "Short.Video",
        items: [
          "Built document-to-video generation on LangChain: ingest a deck or PDF, draft the script, then assemble the scenes.",
          "Held scene and clip continuity across long-form output, which multi-scene generation drifts away from by default.",
          "Assembled personalized video from programmatic overlays, custom voice and lip-sync, stitched into WhatsApp-ready media.",
          "Swapped OpenCV for FFmpeg with GPU encoding, behind a queue so bulk runs could not starve the box.",
        ],
        see: ["short-video", "personalized-video"],
      },
      {
        label: "On-prem, ICICI intranet",
        items: [
          "Shipped the meeting-transcription product into ICICI's intranet, web app through AI pipeline, since the audio could not leave their network.",
          "Split nine-hour recordings into chunks sized to 16GB of VRAM, then reassembled the transcript across the boundaries.",
          "Fed Whisper clean speech — noise reduction, then Demucs splitting dialogue from effects — fine-tuned and served on their hardware.",
          "Routed HTTP through an ALB at Layer 7, and the pipeline through an NLB at Layer 4 for static IPs.",
          "Packaged the stack as Docker images so releases into an environment with no managed services stayed repeatable.",
          "Rebuilt flat roles into a scoped hierarchy: super admin across the estate, admin over a single team, editor below.",
        ],
      },
      {
        label: "Sale Rocket",
        items: [
          "Worked on Sale Rocket, a sales-call analytics platform turning transcribed calls into metrics the team acted on.",
          // The sequence is the point: a cheaper model usually costs quality,
          // so the fine-tune is what makes the saving stick. Two bullets so
          // that reads as one decision rather than two unrelated wins.
          "Benchmarked transcription models and LLMs across the pipeline, replacing the ones that lost on cost or accuracy.",
          "Fine-tuned the survivors on domain data to hold quality after the swap.",
        ],
        see: ["sale-rocket"],
      },
      {
        label: "POC — live subtitles for websites",
        items: [
          "Captured tab audio in an MV3 offscreen document, the only route to media APIs once service workers replaced background pages.",
          "Buffered chunks in IndexedDB and streamed them to a Node service that returned timed subtitles.",
          "Content-hashed each segment so repeated media was never transcribed twice.",
        ],
      },
      {
        label: "POC — real-time call translation",
        items: [
          "Built a browser softphone on Twilio Voice that translated a live call in both directions.",
          "Bridged the remote party through Twilio Media Streams into Google's streaming recognition over WebSockets.",
          "Ran the local mic through Azure's translation recognizer instead, matching each side to the path that fit.",
        ],
      },
    ],
  },
  {
    when: "Apr 2023 — Mar 2024",
    title: "Senior Software Engineer",
    org: "Vitra.ai",
    detail: "Translate.Video across frontend, backend and the core AI modules.",
    points: [
      "Picked the product up after departures and kept client features shipping on a fixed intake-to-release cadence.",
      "Moved datastore, roles, memberships and access tokens off DynamoDB onto Postgres, one table family per migration.",
      "Extended the existing pipeline into the first phase of Translate.Photo, solving text expansion with a reflow algorithm rather than truncating.",
      "Rebuilt the export pipeline on FFmpeg and canvas rendering after benchmarking open-source encoders.",
      "Implemented styled subtitles on the ASS format — positioning, styling and karaoke-timed word highlighting.",
      "Added the server's first test coverage, on the export paths and the core AI modules.",
      "Built the product's first observability layer — Prometheus, Loki, Grafana — including SQL-backed dashboards on monthly product metrics.",
    ],
    see: ["export", "subtitles"],
  },
  {
    when: "Apr 2022 — Mar 2023",
    title: "Software Engineer",
    org: "Vitra.ai",
    detail: "Started on UI libraries and dashboards, moved to backend and stayed.",
    points: [
      "Built the internal component library adopted across every product line, then moved to backend on a team of five.",
      "Built the APIs behind the dubbing editor, projects, teams and membership, and modelled the relational schema underneath them.",
      "Layered authentication and role-based access on that model, and used JSONB where per-client config would otherwise force a migration.",
      "Integrated Google and Microsoft translation, speech and transcription APIs — the first shape of today's AI pipeline.",
    ],
  },
  {
    when: "Jun 2021 — Mar 2022",
    title: "Software Engineer Intern",
    org: "Vitra.ai",
    detail: "Voco Player, plus proof-of-concept work for clients.",
    points: [
      "Built Voco Player, a white-labeled HTML5 video player with adaptive streaming, interactive overlays, playlists and ad insertion.",
      "Demoed it to Tata EdgeClass and Apollo Hospitals, which turned into a pilot engagement.",
      "Built proofs of concept for clients, including a multilingual chatbot, alongside internal frontend and backend work.",
    ],
  },
  {
    when: "Jan 2021 — Jun 2021",
    title: "Front-End Engineer, freelance",
    org: "HM-Infotech",
    detail:
      "Sole engineer on three client projects, with no team to inherit practice from.",
    points: [
      "Worked directly with non-technical clients, turning loose briefs into scoped, buildable work.",
      "Put content behind Strapi so clients could update copy and images themselves after handover.",
      "Set up version control and testing practice from scratch, and improved load times through code splitting and caching.",
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
          "ASS subtitle rendering",
          "Source separation",
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
        items: [
          "Relational schema design",
          "PostgreSQL (JSONB, partial updates)",
          "DynamoDB",
          "Redis",
        ],
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
          "On-prem deployment",
          "Load balancing (L4/L7)",
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
