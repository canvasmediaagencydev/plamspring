# Design: llms.txt + llms-full.txt for Palm Springs

**Date:** 2026-05-22
**Status:** Approved (pending spec review)
**Site:** https://palmspringscm.com (Next.js 16 App Router + Supabase)

## Goal

Implement the [llms.txt standard](https://llmstxt.org/) so AI crawlers and tools can
understand the Palm Springs real-estate site. Produce two dynamically generated files:

- `/llms.txt` — a curated, bilingual (Thai + English) index: site summary plus
  sectioned links to key pages, published projects, and published blog/CSR posts.
- `/llms-full.txt` — the same header plus the full inline content of every project
  and post, with blog HTML converted to clean Markdown.

Both files regenerate hourly from Supabase, mirroring the existing dynamic `sitemap.ts`.

## Decisions

- **Both files** (`llms.txt` + `llms-full.txt`).
- **Bilingual** content (Thai + English) for each entry/description.
- **Full HTML→Markdown** conversion for blog post bodies (new dependency: `turndown`).
- **Approach A:** shared `lib/llms/` module + two thin route handlers (chosen over
  self-contained handlers or a build-time static file). Keeps units small, single-purpose,
  reusable, and consistent with the already-dynamic `sitemap.ts`.

## Architecture

```
lib/llms/
  site.ts        # bilingual site name + summary + curated static-page list
  data.ts        # getProjects(), getPosts() — Supabase fetch (published only)
  markdown.ts    # htmlToMarkdown() wrapper around turndown
  content.ts     # buildLlmsIndex(data), buildLlmsFull(data) — pure string builders
app/llms.txt/route.ts        # thin GET handler → buildLlmsIndex()
app/llms-full.txt/route.ts   # thin GET handler → buildLlmsFull()
```

New dependencies: `turndown`, `@types/turndown` (devDependency).

Each builder is a **pure function** (data in → string out) with no I/O, so it is testable
in isolation. Route handlers do only: fetch data → call builder → return `text/plain`.

### Module responsibilities

- **`site.ts`** — constants only. `SITE_URL`, bilingual site name (`Palm Springs (พาล์ม สปริงส์)`),
  the bilingual summary (sourced from existing metadata: *"Palm Springs — เลือกปาล์มสปริงส์
  เพื่อชีวิตที่ดีกว่า / Palm Springs — choose Palm Springs for a better life"*, refined to
  1–2 sentences), and the curated static-page list with hand-written bilingual descriptions.
  Depends on nothing.
- **`data.ts`** — `getProjects()` and `getPosts()` using `createStaticClient()` from
  `lib/supabase/server`. Same published-only filters as `sitemap.ts`
  (`is_published = true`, non-null slug). Returns plain typed objects. Each fetch is wrapped
  so a Supabase error resolves to `[]` rather than throwing.
- **`markdown.ts`** — `htmlToMarkdown(html: string): string` wrapping a configured `turndown`
  instance. Returns `""` for empty/null input.
- **`content.ts`** — `buildLlmsIndex()` and `buildLlmsFull()`. Take the site constants +
  fetched arrays, return the final file strings. No I/O.

## `/llms.txt` content (curated index)

Follows the llmstxt.org spec: H1, blockquote summary, then `##` sections of links.

```
# Palm Springs (พาล์ม สปริงส์)

> [1–2 sentence bilingual summary]

## Main Pages / หน้าหลัก
- [About / เกี่ยวกับเรา](https://palmspringscm.com/about): …
- [Projects / โครงการ](https://palmspringscm.com/projects): …
- [Blog / บทความ](https://palmspringscm.com/blog): …
- [Sell Land / ฝากขายที่ดิน](https://palmspringscm.com/sell-land): …
- [Contact / ติดต่อเรา](https://palmspringscm.com/contact): …

## Projects / โครงการ          ← dynamic from project_pages
- [{name}](https://palmspringscm.com/projects/{slug}): subtitle, else first line of description

## Blog & News / บทความและข่าวสาร   ← posts where type ≠ "csr"
- [{title}](https://palmspringscm.com/blog/{slug}): {excerpt}

## CSR                          ← posts where type = "csr"
- [{title}](https://palmspringscm.com/blog/{slug}): {excerpt}
```

Static-page descriptions are hand-written bilingual strings in `site.ts`. Project and post
entries are generated from the fetched data. Empty sections are omitted.

## `/llms-full.txt` content (full inline)

Same H1 + summary header, then the complete content of every entry:

- **Projects** — `## {name}`, URL line, `description`, `highlights` rendered as a bullet
  list, house-type names, and nearby places.
- **Blog / CSR posts** — `## {title}`, URL line, published date, excerpt, then the post's
  `content` HTML run through `htmlToMarkdown()`.

## Data, caching, error handling

- Reuse `createStaticClient()` from `lib/supabase/server`; same filters as `sitemap.ts`.
- Both routes export `revalidate = 3600` (hourly) and return
  `Content-Type: text/plain; charset=utf-8`.
- DB fetch failures resolve to empty arrays, so both files still return the static index
  (header + main pages). The files never return 500.

### Data shapes (from existing code)

- `project_pages`: `name`, `subtitle`, `description`, `slug`, `highlights` (string[]),
  `house_types` (JSON), `nearby_places` (JSON), `is_published`, `updated_at`.
- `posts`: `title`, `excerpt`, `content` (HTML), `slug`, `type` ("csr" | other),
  `published_at`, `updated_at`, `is_published`.

## Testing

The project has **no test runner** today. Choose at spec review:

- **(a)** Add `vitest` and unit-test the pure functions: `htmlToMarkdown` (HTML →
  expected Markdown), `buildLlmsIndex` and `buildLlmsFull` (sample data → expected
  structure: H1 present, blockquote present, sections in order, links well-formed).
- **(b)** No new tooling — run `next dev`, `curl http://localhost:3000/llms.txt` and
  `/llms-full.txt`, validate output against the llmstxt.org spec by inspection.

Recommendation: **(a)** — the builders are pure and the project's CLAUDE.md asks for
thorough testing; vitest is the lightest fit for a Next.js + TS project.

## Out of scope

- Linking llms.txt from `robots.ts` or page `<head>` (the standard does not require it).
- Per-locale separate files; bilingual inline covers both audiences in one file.
- Including admin/contact-form pages (excluded, same as robots disallow rules).
```
