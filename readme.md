# Portfolio + blog

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Bun.

```bash
bun install
bun dev          # http://localhost:3000
bun run build
```

## Where things live

| Path | What |
|---|---|
| `lib/site.ts` | Résumé content — profile, work, roles, stack, nav. |
| `content/blog/*.mdx` | Blog posts. Filename is the slug. |
| `content/projects/*.mdx` | Projects, packages, extensions. Filename is the slug. |
| `lib/content.ts` | Shared MDX collection reader. |
| `lib/posts.ts`, `lib/projects.ts` | Per-collection parsers. Server only — they touch `node:fs`. |
| `lib/project-kinds.ts` | Client-safe project types. Import from here in `"use client"` files. |
| `lib/icons.generated.ts` | Icon subset. Regenerate with `bun run icons`. |
| `app/globals.css` | The Broadsheet theme. shadcn token names, Broadsheet values. |
| `components/section.tsx` | The ruled section with the numbered index rail. |

## Writing a post

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

`@iconify/react/offline` plus a generated subset. Nothing is fetched from
iconify.design at runtime.

Adding an icon: add its Lucide name to `NAMES` in
`scripts/generate-icons.ts`, then `bun run icons`. `IconName` is generated
from that list, so a typo is a type error rather than a missing glyph.

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

- Fill the `METRICS_TODO` block at the bottom of `lib/site.ts` — the résumé's
  unfilled `[X]` figures. Every bullet reads correctly without them today; none
  of them claims a number it can't back.
- Set the real `linkedin` and `siteUrl` in `lib/site.ts`.
- Add `public/resume.pdf`, or drop the résumé link from the contact section.
- The two posts in `content/blog` are `draft: true` — they are sample writing,
  not yours. They render in `bun dev` and are hidden in production. Delete them
  or replace them before launch.
- `profile.phone` exists in `lib/site.ts` but is deliberately never rendered.
