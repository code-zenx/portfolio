# Portfolio + blog

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Bun.

```bash
bun install
bun dev          # http://localhost:3000
bun run build
```

## Project structure

Organised by **what a file is for**, not what it is. A feature owns its
components, its data layer and its check, so removing one is `rm -rf` on a
single directory plus the import that referenced it.

```
app/                     routing only — thin files that delegate
  layout.tsx  page.tsx  globals.css
  robots.ts   sitemap.ts
  blog/       projects/

content/                 what you edit most — posts and projects, as MDX
config/site.ts           résumé content: profile, work, roles, stack, nav

features/                domain code, self-contained
  home/                  hero · work · experience · stack · contact
  blog/                  posts.server.ts · writing-section.tsx
  projects/              projects.server.ts · types.ts · project-index.tsx
  attractor/             parametric.ts · parametric.check.ts · canvas
  command-palette/       command-menu.tsx · cmdk.check.tsx
  theme/                 provider · toggle

components/              generic, no domain knowledge
  ui/                    shadcn — regenerated, don't hand-edit
  icon/                  icon.tsx — one wrapper over react-icons/lu
  section · disclosure · scroll-meter · site-header · site-footer

lib/                     pure helpers: content · mdx · format · utils · use-mounted
```

### Conventions

**`import "server-only"`** heads every module that touches the filesystem
(`lib/content.ts`, `posts.server.ts`, `projects.server.ts`). Import one from a
client component and you get a clear error naming the file, instead of
Turbopack failing with *"the chunking context does not support external
modules"* — which is what happens when `node:fs` reaches a browser chunk.

**`*.server.ts` and `types.ts`** make the split self-documenting. Client
components import types from `features/projects/types.ts`; only server
components touch `projects.server.ts`.

**`*.check.ts` sits beside what it guards**, so deleting a feature deletes its
test. There is no `scripts/` directory.

**No barrel files.** No `index.ts` re-exports — they defeat tree-shaking and
fight `optimizePackageImports`. Import the real path.

### Feature dependencies

Only three edges, all deliberate:

```
home             → attractor          hero renders the canvas
command-palette  → blog, projects     it lists posts and projects
```

Everything else is a leaf. Delete `features/attractor/` and only `hero.tsx`
breaks.

## Writing a post## Writing a post

Create `content/blog/my-post.mdx`:

```mdx
---
title: "Post title"
summary: "One sentence for the index page."
date: "2026-08-27"
tags: ["Postgres", "Postmortem"]
draft: false
---

Body in MDX.
```

`draft: true` hides the post in production and shows it in `bun dev`.

Code blocks are highlighted at build time by shiki — `github-light` and
`tokyo-night`, matching the site's two themes. No highlighter ships to the
browser.

## Adding a project

Copy `content/projects/_template.mdx` to a real filename. Files starting with
`_` are ignored, so the template never appears on the site.

```mdx
---
title: "AudioFrame"
tagline: "Browser-based audio visualizer"
summary: "Two sentences for the index row."
kind: "app"          # app | package | extension | desktop | plugin
status: "Live"       # free text: "Live", "macOS · Windows", "4.8K downloads"
date: "2026-08-01"
featured: true       # surfaces it on the home page
draft: false
tags: ["TypeScript", "Web Audio API"]
links:
  - label: "Live"
    href: "https://audioframe.app"
---
```

The body is optional. Write one and the project gets a page at
`/projects/<slug>`; leave it empty and the index row is the whole entry.
`kind: "package"` renders as a dense one-liner — packages are a list you scan.

## Icons

`react-icons/lu` (Lucide), imported as static named exports through one
wrapper at `components/icon/icon.tsx`.

```tsx
<Icon name="arrow-up-right" className="h-3 w-3" />
```

Adding one: import the `Lu*` export and add a kebab-case entry to the `ICONS`
map in that file. `IconName` is derived from the map with `keyof typeof`, so a
typo at a call site is a compile error.

Tree-shaking is real here and was verified rather than assumed — the built
chunks contain the path data for icons in use and none for the ~1,526 that
aren't. Measured at ~1.8 kB gzipped for the 15 icons in use, out of a 793 kB
module.

## Releasing

Versioning, the changelog and the GitHub Release are driven by
[release-it](https://github.com/release-it/release-it) plus Conventional
Commits.

### One-time setup

```bash
git push -u origin main                    # release-it requires an upstream
```

Then in the repo on GitHub: **Settings → Pages → Source → GitHub Actions**.

### Cutting a release

```bash
bun run release:dry     # preview everything, change nothing
bun run release         # the real thing
```

`release` prompts you for the increment — patch, minor, major, or an exact
version — and then, in order:

| # | Step | What it does |
|---|------|--------------|
| 1 | `before:init` | runs `check:types`, `check:parametric`, `check:cmdk` |
| 2 | bump | writes the new `version` into `package.json` |
| 3 | `after:bump` | runs `bun run build` so a broken tree can't be tagged |
| 4 | changelog | prepends the new section to `CHANGELOG.md` |
| 5 | commit | `chore(release): vX.Y.Z` |
| 6 | tag | annotated tag `vX.Y.Z` |
| 7 | push | `git push --follow-tags` |

Two workflows then fire on their own:

- the **tag** triggers `release.yml`, which pulls that version's section out of
  `CHANGELOG.md` and publishes it as a GitHub Release
- the **push to `main`** triggers `deploy.yml`, which builds and ships to Pages

### Picking the version

You choose it, not the tool — `ignoreRecommendedBump` is on. Commit types still
decide which *section* an entry lands in (`feat:` → Features, `fix:` → Bug
Fixes), they just don't decide the number.

```bash
bun run release minor      # skip the prompt
bun run release 1.0.0      # exact version
```

`--ci` skips the prompt **and silently falls back to a patch**. Always name the
increment when running non-interactively:

```bash
bun run release --ci minor
```

### Releasing a tag that already exists

Actions → **Release** → *Run workflow* → enter the tag. Useful if the workflow
failed the first time; the tag is already correct, so just re-run it.

Or tag by hand, without release-it:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push --follow-tags
```

### Commit messages

commitlint validates every message on `commit-msg`, because the changelog is
generated from them — a malformed subject is a missing changelog entry. A bare
`git commit` opens the commitizen prompt instead.

```
feat: add project filter        → Features section
fix: close the disclosure rule  → Bug Fixes section
perf: cache the post reader     → Performance section
docs: / chore: / build: / ci: / refactor: / style: / test: / revert:
```

Rules that trip people up:

- a **body is required** — one-line commits are rejected
- subject **and body must be lower-case**, so `ignoreRecommendedBump` in a body
  fails; write `the recommended-bump override` instead
- no full stop at the end of the body

### Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `No upstream configured` | branch never pushed | `git push -u origin main` |
| `Working dir must be clean` | uncommitted changes | commit or stash them |
| Release is a patch when you wanted minor | `--ci` with no increment named | `bun run release --ci minor` |
| Tag pushed but no GitHub Release | `release.yml` failed | Actions → Release → Run workflow → enter the tag |
| Commit rejected, `body must be lower-case` | a capital or camelCase word in the body | reword it lower-case |
| Commit rejected, `body may not end with full stop` — but it doesn't | a paragraph starting `word:` is parsed as a footer, which ends the body early at the previous paragraph | don't begin a line with `something:` — reword to `the something is …` |

## Theme: Broadsheet

Swiss-editorial. Paper ground, full-ink rules, zero radius, one vermillion
accent. Instrument Serif for display, Inter for everything else — no mono in
the UI.

| Token | Light | Dark |
|---|---|---|
| `--background` | `#fbfbf9` | `#101010` |
| `--foreground` | `#0a0a0a` | `#f2f1ed` |
| `--rule` | `#0a0a0a` | `#f2f1ed` |
| `--rule-hair` | ink @ 16% | ink @ 18% |
| `--brand` | `#e2483d` | `#ff6b5e` |

The accent lifts in dark mode — `#e2483d` on `#101010` is 3.8:1 and fails AA
for body text; `#ff6b5e` is 6.4:1.

## Before this ships

- Fill the `METRICS_TODO` block at the bottom of `config/site.ts` — the résumé's
  unfilled `[X]` figures. Every bullet reads correctly without them today; none
  of them claims a number it can't back.
- Set the real `linkedin` and `siteUrl` in `config/site.ts`.
- Add `public/resume.pdf`, or drop the résumé link from the contact section.
- The two posts in `content/blog` are `draft: true` — they are sample writing,
  not yours. They render in `bun dev` and are hidden in production. Delete them
  or replace them before launch.

