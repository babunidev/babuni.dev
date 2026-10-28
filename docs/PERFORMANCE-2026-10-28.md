# Production loading and resize verification — 28 October 2026

## Scope and method

Babuni.dev requested production size/download/loading measurements, investigation of the existing large client chunk, resize continuity and new portal artwork. This is a local static-production assessment, not the Astro dev server and not an internet/mobile benchmark.

A frozen pre-change dist was served on loopback; the updated static build was served on another loopback port. Both measurement servers sent Cache-Control: no-store and no content compression. A temporary external probe recorded Navigation/Resource/Paint entries into hidden DOM, sampled one second after load. This was necessary because read-only browser evaluation does not expose Performance APIs directly. The probe itself was excluded from resource totals; its extra HTML tag and execution still add small measurement overhead. It is not shipped in the final clean build. Screenshots and module-state checks were also made on this production build.

The updated first sample used a new origin; two reload samples also fetched uncached resources. This does not simulate cold OS disk caches, a slow CPU, throttled bandwidth, a real deployed server or the affected Chrome/Firefox profiles. No clock-based waits or rendering tempo changes were introduced into the app for measurement.

## Measured loading samples (1280×720)

| Metric | Baseline, one uncached sample | Updated, three uncached samples |
|---|---:|---:|
| First tile DOM observed | 84.4ms | 53.9–78.1ms |
| DOMContentLoaded | 106.9ms | 69.8–95.2ms |
| Window load event | 123.9ms | 86.9–117.7ms |
| First contentful paint | 160ms | 80–156ms |
| Initial observed transfer, excluding probe resource | 4,343,753 bytes | 6,643,736 bytes each |
| Initial encoded resource bodies + HTML | 4,337,753 bytes | 6,636,536 bytes each |
| Initial WebP body bytes (including two favicon requests) | 3,622,338 | 5,920,690 |
| JS body bytes | 694,906 | 695,337 |

Load event is not equivalent to all artwork being visible: lazy image requests continued afterward, ending around 153ms in the first updated sample. The intentional staggered entrance also continues beyond first tile creation. The probe's short observation window and the animated reveal make its observed LCP unsuitable as a complete final LCP result, so no LCP pass/fail is claimed. Timing variation is too small/local to conclude that this change made general page loading faster.

Raw evidence: [baseline](performance/production-baseline-2026-10-28.json), [updated samples](performance/production-samples-2026-10-28.json), [measured artifact inventory](performance/production-measured-artifact-2026-10-28.json). The measured inventory precedes this task's final documentation/screenshot additions; the separate final artifact report records their size.

## Artifact size and large-chunk cause

The measured updated build had 418 public files totaling 16,911,137 bytes (16.13MiB), including four local videos (5,722,974 bytes), 353 separately loaded Markdown documents (1,868,421 bytes), and 58 WebPs (8,603,896 bytes). Those totals describe the whole deployable directory, not the initial download.

Its one minified JS chunk was 695,337 bytes (679.04KiB), estimated at 196,482 bytes gzip (191.88KiB) or 157,507 bytes Brotli (153.82KiB). These are compression calculations, not an assertion that the future host enables either encoding. Reproduce inventories after a clean build with `npm run production:report`; `npm run bundle:report` remains the concise JS report.

The generated document index was 546,535 bytes (533.73KiB) at measurement, with 451,298 intro characters plus 41,808 preview characters. The client statically imports this index so opening any project's preview remains synchronous. Together with grid code, Markdown parsing, curated module metadata and navigation this exceeds the existing 500kB warning. Full repository bodies are still outside the initial JS; no full-document regression was found. The new four WebPs increase image traffic, not JavaScript chunk size.

The warning remains deliberately visible. Raising its threshold or moving the same eagerly loaded data to another file would not reduce initial bytes. Removing/truncating intros would change the approved content depth. On-demand per-project preview data with prefetching is an AI proposal that needs separate loading/failure behavior design; it was not slipped into this resize fix.

## Artwork dominates initial bytes

All nineteen original portal artworks were requested in the measured buffered desktop grid. The four supplied new files add 2,298,352 bytes (2.19MiB); each decodes as 1254×1254 WebP. Their source files were preserved exactly, not resized, recompressed, redrawn or renamed.

| File / matched project | Bytes | SHA-256 |
|---|---:|---|
| BattleReport.webp / battlereport | 430122 | a966ff2a0f9378d90fb23f656d10818e66ed181de77360aaf7d10f17f47a7af8 |
| Ethera.webp / ethera-the-stonewrought | 675032 | 00b73b29605154c8dde038adf2b83fe3ddcf3d4edc43fb0340b6cae7ffdf1abf |
| ROARGuild.webp / roarguild | 596092 | 556a8b533a4048b5f9f87036839a59f757e1998be55348a74f4bda5e93485af1 |
| WarriorStartAttack.webp / warriorstartattack | 597106 | 29310847748a2fd2d013fcf30adf73cd4c316f385eb6ca3c8a695a41b11030d2 |

A worthwhile next proposal is separate smaller portal-display derivatives, retaining original masters and credit. A 1254px original is much larger than its roughly 100–140px desktop display. This task does not silently replace approved original artwork. Hosting compression and cache headers also need verification when a host is selected; this localhost no-store setup is a measuring tool, not a deployment recommendation.

## Resize correction and evidence

Root cause: `rebuildPool` preserved big bloom but called `stopSelection(false)` for an ordinary small bloom. It now retains active/pending selection and existing bloom panels/reservations. `resizedPan` keeps the logical map center through 240/200/phone tile-size transitions, and rescales centering endpoints without restarting their elapsed timing.

Browser checks kept the exact same eight small-bloom module IDs through 1280→900→390→1280 widths. A subsequent check confirmed the selected portal decoded at 1254px after rebuild. Big bloom retained thirteen modules through desktop resizing; the Concept reader remained open at phone width and returned to the same big bloom. These are desktop viewport simulations, not physical-phone acceptance. Pure regressions verify map-center invariance and in-flight interpolation, and artwork tests cover all nineteen mappings/imports.

The first capture showed missing logos after the temporary measurement server ended; this was a test-harness failure. That historical capture is archived and superseded by successful loaded-artwork verification after starting a detached loopback server. No app workaround was introduced for that failure.

## Human long-session evidence and remaining checks

Babuni.dev reports the cache update no longer feels progressively slower after hours; Firefox has little or no issue, with some remaining Chrome unevenness. The mentioned long computer uptime is a hypothesis, not a diagnosed cause. No new full browser trace, heap measurement or hours-long agent run was performed here.

Remaining: human fullscreen/window resize confirmation; physical phone orientation; deployed-host compression/network tests; decide on image derivatives and preview-data loading without changing the approved feel; trace the affected Chrome profile if unevenness continues.

## Final clean artifact and checks

After adding this task's documentation and all three archived captures, a clean build contains 421 files, about 16.34MiB total. The final JS is 696,549 bytes (680.22KiB), estimated 196,692 bytes gzip (192.08KiB) / 157,616 bytes Brotli (153.92KiB). See [final inventory](performance/production-final-artifact-2026-10-28.json). Differences from the browser-measured artifact are mainly documentation/gallery metadata; the timing table is intentionally tied to the measured sample, not presented as a measurement of every later document edit. The final build contains no production probe.

Full test command plus direct resize and portal-import suites were rerun after fixing stale fifteen-artwork expectations, including the missing-file error count. Production build, content/WebP guards and whitespace checks pass. No warning threshold was raised, and the large client chunk remains an explicit follow-up.
