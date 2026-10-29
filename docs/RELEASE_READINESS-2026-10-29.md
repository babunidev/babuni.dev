# Release readiness — 2026-10-29

## Implementation update

Babuni.dev approved publication of all 42 current projects and existing public documentation. The discovery work previously proposed below is now implemented: 433 static home/project/module pages, real links, metadata, canonical URLs, sitemap and crawler rules. Project modules now load from per-project JSON; initial JS is approximately 118 KiB (37 KiB gzip), and the large-chunk warning is gone. See `deploy/README.md` and `deploy/nginx-babuni.dev.conf` for prepared gzip/cache/404 configuration. Deployment, DNS, HTTPS and real network measurements are deferred to the weekend. The following original audit preserves the before-state and its measurements; its unimplemented-status descriptions are historical.

## Human acceptance

Babuni.dev accepts milestones 1–4 for the current design after thorough physical-device use on two devices, responsive checks on phone/laptop/wide desktop, keyboard and reduced-motion checks, hover/tap/ambient topics, fullscreen/viewers, and many-hour sessions. Earlier Chrome/Firefox feedback remains human evidence; this update does not claim a new AI browser/device run. Neutral tile backgrounds, current titles and striking portal artwork are the accepted visual direction. Optional future performance/presentation reviews do not invalidate this acceptance.

Milestone 5's schema, repository snapshots, module composition, document presentation and CI build checks are built. Content is a living work in progress, not a requirement to finish every project before release. Owner project visibility/publishing controls and optional preview deployments remain unimplemented. The toggle must affect both the grid and every public route, menu, sitemap and generated asset; hiding a tile alone is not a publication boundary. Previously published material cannot be made private merely by hiding its menu entry.

## Production artifact audit

AI ran `npm run astro -- build` and `node scripts/report-production-size.mjs` on the current implementation before this documentation edit, using cached verified activity dates (no fresh repository imports). Build passed; the existing large-chunk warning remains.

| Artifact | Measured size |
| --- | ---: |
| Entire output | 15.20 MiB, 439 files |
| Initial JavaScript chunk | 699,389 bytes (683 KiB) |
| Same JS, locally simulated gzip | 199,545 bytes (195 KiB) |
| Same JS, locally simulated Brotli | 160,907 bytes (157 KiB) |
| CSS | 19,106 bytes |
| Initial HTML | 2,529 bytes |
| 336 on-demand Markdown documents | 1,985,610 bytes |
| All 96 WebP files, including historical assets | 7,511,636 bytes |
| Four local MP4 recordings | 5,722,974 bytes |

These are artifact sizes, not measured internet transfer or loading times. The 15.20 MiB is not downloaded on every visit. Portals, visible media, loaded YouTube players and requested reader documents add requests over time. Hosting must actually enable compression to obtain compressed transfer sizes. No deployed TTFB/LCP/INP/CLS, mobile-network or fresh animation-FPS measurement is claimed.

The generated document preview/intro index is approximately 526 KiB of JSON before bundling and is imported by the browser module catalog. It is a substantial contributor worth addressing before a future performance pass, for example by loading project content when chosen. This audit does not claim a byte-by-byte bundle attribution or implement code splitting. Do not suppress the warning as a substitute for reducing work.

## Search and AI readability

The generated initial HTML contains no project headings or hyperlinks. Projects are constructed by JavaScript; full documents require an interaction and an on-demand fetch. There is one HTML route and a generic prototype title/description, with no configured canonical domain, sitemap, structured data or social share metadata. No search ranking or indexing result has been measured.

Current internal project search works for visitors, but it does not establish external discoverability. Google can render JavaScript, but content unavailable in the rendered page cannot be indexed; other crawlers may not execute JavaScript. AI crawlers/tools also differ, so there is no universal AI readability score. Existing public repository Markdown is readable when directly fetched, but that does not make every interactive site module discoverable.

**AI proposed release work, not yet implemented:** add stable public project and document URLs with pre-rendered semantic headings, content and ordinary links; use the same content pipeline rather than a second editorial source. Keep the living grid as the primary interactive interface and provide real links into readable project pages. Add domain-specific canonical URLs, sitemap, descriptive titles, sharing previews and appropriate structured data. Verify public routes and publishing toggles together. No hidden keyword text or bot-only alternate content.

Reference: [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## What MDX means

MDX combines Markdown with components and JavaScript expressions: for example, a chart or interactive demonstration placed inside a document. Ordinary headings, bold text, links, galleries and video modules already work without MDX. It is optional future authoring capability, not missing functionality for the accepted milestones. Untrusted imported Markdown should not become executable code merely to gain styling.

Reference: [MDX introduction](https://mdxjs.com/docs/what-is-mdx/).

## Sharing a VPS with the existing site

The site builds to static files in `dist`; a production web server can serve that directory without running the Astro development server. A VPS can host multiple independent sites. With separate domains/subdomains, the web server selects a site from the requested hostname, pointing each to its own directory and HTTPS configuration. Visitors need not type a folder path, and the existing website need not move. A subdirectory deployment is another option but requires base-path work because the site currently uses root-relative assets.

Before changing the VPS, establish the intended domain, current site's domain, existing web server/proxy and directory/deployment arrangement through an authorized read-only inspection. Then prepare a separate site configuration, HTTPS, compression/cache policy and an atomic upload/rollback plan; validate it without replacing the current site. Domains/DNS must be checked against the intended destination. No VPS, DNS, certificates or existing site configuration were changed in this audit. Do not publish credentials in documentation.

Reference: [Nginx hostname-based virtual servers](https://nginx.org/en/docs/http/request_processing.html).

## Next practical work

1. Agree and implement owner-controlled publishing/visibility.
2. Add crawlable project/document pages and search/share metadata alongside the grid.
3. Inspect and prepare VPS/domain/HTTPS deployment, preserving the existing site.
4. Measure real delivery and loading on that production configuration; retain accepted interaction feel.

Editorial review and plain-language improvements can continue throughout.
