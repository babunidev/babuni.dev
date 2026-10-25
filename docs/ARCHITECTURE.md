# Technical Architecture — Proposed

**Status:** Planning. Astro 7.4.2 was reported running locally; remote source may not yet include it.

## Responsibilities

- **Astro:** routing, layout shell, static content generation, HTML metadata, deployable build.
- **TypeScript interactive engine:** grid coordinates, viewport sizing, drag, shifting, wrap/recycling, selection, cell reservation, and preload scheduling.
- **Svelte (candidate):** UI rendering for the grid island and blooms; select only after a small prototype.
- **Structured Markdown/MDX content:** per-project narratives, modules, metadata and dev logs.
- **GitHub:** source and review; automated CI builds after Astro is pushed.
- **VPS:** eventual static deployment with HTTPS; deployment not configured.

## Data identity vs render identity

A project has one immutable content ID. A rendered tile is one *instance* pointing at that ID. Instance position, wrapping and entrance animation must not modify project data. This avoids duplicate projects, broken selection or content fetches when copies appear.

Suggested abstractions (not implemented):
- ProjectRecord { id, title, portalAsset, tags, infoPoints, modules }
- TileInstance { instanceId, projectId, gridX, gridY, renderX, renderY }
- GridState { cameraOffset, shiftPhase, activeInstanceId, interactionMode }
- BloomReservation { anchorInstanceId, occupiedCells, displacedInstances }
- AssetScheduler { visibleCells, nearBufferCells, queuedAssets, inFlightAssets }

## Infinite grid and shifts

Use logical, potentially unbounded 2D coordinates; calculate the visible window with extra rows and columns. Use modulo arithmetic to map repeating logical positions to a finite source arrangement. Reuse rendered instances when they are fully outside the overscan window.

A naive repeated fixed matrix can put duplicates beside one another. A stable seeded distribution or permutation can space repeated projects more organically while preserving consistent locations during a visit.

Line shifts are distinct from camera movement. Test how row/column translations interact with modulo wrapping, identity, ongoing animations, and reserved bloom cells. Avoid reparenting DOM nodes or rebinding project IDs mid-interaction.

## Progressive loading

Initial order: shell and central project metadata → central portal image → neighboring visible tiles outward → 1–2 offscreen buffer bands → large project media on demand. Fetch/cache small metadata separately from heavyweight images and video. Prioritize anticipated motion direction while avoiding network floods.

Preload only assets needed for a shift before beginning that shift, where reasonable. Use image placeholders when a network failure would otherwise stall motion.

Buffer size and tiling dimensions are **performance hypotheses**, not measured values. Benchmark under representative screens and mobile constraints.

## State boundaries

A simple explicit state machine should govern Grid, SmallBloom, FullBloom, and ModuleDetail. Maintain selected project ID and instance identity distinctly. Detail reading must not also trigger grid drag, global wheel input, or unintended collapse.

Make transitions interruptible and recoverable. Persist optional viewing preferences without treating local state as personal analytics.

## Quality gates

- Unit tests for modular wrap, viewport coverage, line shift eligibility, tile identity, repeat spacing, and bloom cell reservation.
- Browser tests for pointer drag, mobile touch, keyboard, back/escape, media viewers, resizing and reduced motion.
- Build checks, content schema validation, broken-link checking.
- Performance: avoid layout thrash by using transforms; throttle preloading; test cache and network slowdowns.

## Operational security

Never commit private keys, environment secrets, tokens or VPS credentials. Keep deployment credentials in protected CI secrets and use least-privilege actions. No production publishing by an AI agent without a specifically authorized workflow.

## Current known baseline

GitHub main originally contained README and .gitignore only. The creator reported Node.js 24.18.0, npm 11.16.0, and local Astro 7.4.2 running; local changes were staged, with the first commit initially requiring a Git author identity. Do not assert those files are on main until verified.
