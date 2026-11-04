# Babuni.admin integration and live measurement

## Reviewed baseline — 2026-11-04

Babuni.dev requested roadmap reconciliation and assessment of website support for the separately developed local administration application. AI reviewed public Babuni.admin documents and its portfolio Overview component at [ef2d1c1](https://github.com/babunidev/babuni.admin/tree/ef2d1c1f1d27e436b0e483d618318e06fbe84fc8). The current roadmap and local connection-manager status describe a loopback-only app, implemented local profile/keyring/read-only inspection slices, and disabled outbound GitHub/SSH/publishing transports. The portfolio overview explicitly cannot edit or publish. Older embedded design notes sometimes describe already implemented local slices as proposals; current status and implementation evidence take precedence. This review did not run the admin application or test its security.

## Existing website contract

The website is static. GitHub source documents are pinned imported snapshots, not live reads. `scripts/build-document-assets.mjs` generates presented Markdown and its index; `scripts/build-project-modules.mjs` regenerates complete project collections. Astro generates readable HTML, metadata and search outputs. Browser collections are cached in memory. A repository edit, snapshot refresh, asset preparation, build and deployment are distinct operations. Existing full builds remain the supported publishing path; changing only a Markdown asset can leave previews and HTML stale.

## Proposed website work, not implemented

1. Export a versioned, non-secret manifest mapping stable project/module IDs to allowed repository/path/revision and every dependent output. Include shared local-document dependencies, summaries, intros, collection JSON, readable HTML, metadata and sitemap effects. Do not let client-supplied paths determine filesystem authority.
2. Provide a deterministic targeted build entry point. For a DEVLOG edit, regenerate all affected reader assets, module previews/intros, collections and HTML; compare with a full build in parity tests. Preserve current safe Markdown presentation, authorship, chronology and activity freshness rules.
3. Produce a complete release artifact with source/content revisions and file hashes. Babuni.admin should stage a coherent release, apply expected-revision checks, switch atomically, verify the public revision and recover on failure. Avoid independently overwriting live files. Reuse unchanged outputs only after dependency validation.
4. Design stale-client behavior: an already open tab may retain old collections. Versioned URLs or explicit release-aware invalidation must prevent mixed reader/preview revisions without disrupting the approved grid interaction.
5. Define visibility centrally across grid, menu, JSON, readable pages, sitemap and publication assets. Hiding a tile alone does not unpublish its URLs or media.

No public admin endpoint or hosted admin UI is needed for the documented outbound approach. Website runtime changes are unnecessary for an initial full static-release transport. Server authentication, key handling, approval, transfer, rollback orchestration and retention belong to Babuni.admin. A partial build is a later website capability, not something the current admin can already perform. This is an AI integration proposal for the requested roadmap, not implementation approval for every future API/schema choice.

## Repeatable live measurement plan

Record the served release, time, browser/device, viewport, network and whether the cache is cold or warm. Take at least three independent runs of each condition and report the median and range rather than one score.

- Network: DNS/connect/TLS time, time to first byte, response and transferred bytes, compression, cache headers and repeat-load behavior for home, an image, collection JSON, reader document and readable project page.
- Browser: use a production browser trace or Lighthouse for initial rendering, largest contentful paint, layout shifts, main-thread work and request waterfall. Synthetic throttling is labelled simulation, not a physical phone test. Field responsiveness/Core Web Vitals require real usage data; a single laboratory run is not field evidence.
- Interactions: trace panning, shifts, opening small/big bloom and reader, then repeat after sustained use; inspect dropped frames, long tasks and memory growth separately from network loading. Preserve accepted motion while diagnosing.
- Release/search: check the intended revision, representative media/source links, robots/sitemap and actual indexing tools. Crawler availability does not establish ranking or indexing.

No live measurements or new browser/device checks were performed for this documentation change. Prior server header checks remain attributed to the operator in deploy/README.md.
