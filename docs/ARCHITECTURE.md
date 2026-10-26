# Technical Architecture — Proposed

**Status:** Astro 7 + TypeScript foundation committed to GitHub `main` (`5902121`); interactive grid architecture remains proposed. The creator previously reported Astro 7.4.2 running locally.

## Responsibilities

- **Astro:** routing, layout shell, static content generation, HTML metadata, deployable build.
- **TypeScript interactive engine:** grid coordinates, viewport sizing, drag, shifting, wrap/recycling, selection, cell reservation, and preload scheduling.
- **Svelte (candidate):** UI rendering for the grid island and blooms; select only after a small prototype.
- **Structured Markdown/MDX content:** per-project narratives, modules, metadata and dev logs.
- **GitHub:** source of truth on `main`; automated CI and deployments are future work.
- **VPS:** eventual static deployment with HTTPS; deployment not configured.

## Data identity vs render identity

A project has one immutable content ID. A rendered tile is one *instance* pointing at that ID. Instance position, wrapping and entrance animation must not modify project data. This avoids duplicate projects, broken selection or content fetches when copies appear.

Suggested abstractions (not implemented):
- ProjectRecord { id, title, portalAsset, tags, infoPoints, modules }
- TileInstance { instanceId, projectId, gridX, gridY, renderX, renderY }
- GridState { cameraOffset, shiftPhase, activeInstanceId, interactionMode }
- BloomReservation { anchorInstanceId, occupiedCells, displacedInstances }
- AssetScheduler { visibleCells, nearBufferCells, queuedAssets, inFlightAssets }

## Center-first geometry and reusable tile pool — initial implementation

The mechanical grid is now represented in `src/lib/grid-math.ts`, `src/scripts/grid.ts`, and `src/pages/index.astro`. Initial isolated Chromium previews and geometry tests have been run; autonomous row/column movement, blooms, and real content have not been implemented.

For viewport width W, height H and tile size T, use origin `(W/2-T/2, H/2-T/2)`. Add free pointer-pan offset `(dx,dy)`; logical cell `(c,r)` has top-left pixel position `(originX+c*T, originY+r*T)`. Thus logical cell (0,0) is initially perfectly centered in the full viewport (including the area behind the overlaid header), then moves freely with dragging.

For buffer b=2 cells, compute `firstColumn=floor((-b*T-originX)/T)` and `firstRow=floor((-b*T-originY)/T)`. Pool dimensions use `ceil(W/T)+2*b+2` columns and the equivalent row formula. Track the first visible logical coordinates and circular slot heads; reuse tile DOM instances that leave the buffer by moving them to the entering edge and repopulating only those slots. The whole layer is translated with `translate3d` during pointer movement. Pool dimensions are rebuilt on viewport resize. Placeholder project assignment is a deterministic demo mapping, not a permanent project content identity.

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

GitHub `main` now contains the Astro starter (`package.json`, `src/pages/index.astro` and related files) and project documentation, integrated in merge commit `5902121`. The creator reported Node.js 24.18.0, npm 11.16.0 and the Astro 7.4.2 local dev server working. The starter displays an Astro heading; no grid implementation exists. An independent source-snapshot build against `ea90117` passed on 2026-10-26 using Node.js 24.22.1 and npm 11.9.0. Dependencies were installed with lifecycle scripts disabled. Browser behavior and dedicated type checking were not verified; see [foundation review](REVIEW-2026-10-26.md).

## Autonomous line-shift prototype

`src/lib/grid-shifts.ts` implements pure, seed-testable dice and initiative planning plus `sourceCell`, a reverse-history resolver. Each completed shift is recorded by axis, infinite logical line coordinate, and ±1 direction. Resolving events in reverse order identifies a tile's original project so alternating horizontal and vertical shifts preserve content identity.

`src/scripts/grid.ts` uses CSS transforms to move an entire row or column of rendered tile elements by exactly one tile width over a provisional 4.4 seconds. At completion the grid history is updated and the finite rendering pool is repopulated at its resting coordinates. The renderer suspends animation progress during active dragging or when the browser tab is hidden, and skips automatic shifts under the reduced-motion preference.

**Known prototype limitation:** The event history grows over time and `sourceCell` scans it linearly. This is a readable first implementation, not yet bounded for very long sessions. Future optimization should retain stable project locations and correct ordering across perpendicular shifts. Collision/deferral for selected project blooms remains unimplemented because blooms do not yet exist.

## Manual motion controller and shift concurrency refinement — 2026-10-26

The new pure controller in `src/lib/grid-controls.ts` maintains a bounded pointer lead and velocities for both pointer and keyboard movement. Its `stepManualPan` method consumes elapsed frame time, capped at 50 ms per frame to avoid enormous jumps after tab suspension. Keyboard arrows set a normalized direction rather than moving a fixed distance for each keydown; a single requestAnimationFrame loop applies small camera deltas, including brief key deceleration. Pointer dragging queues deltas into a capped backlog, accelerates toward a tunable maximum, and stops without chasing old cursor positions when released.

The grid renderer now defers/preserves autonomous shifts while a pointer is held or keyboard movement is active, then resumes after the manual movement settles. `planShiftRound` still rolls for every eligible line and records the full initiative/dice results, but selects only the first winning line for each direction. This limits simultaneous movement to two opposite-moving rows or columns at most.

Prototype control constants (CSS px/s, px/s², and CSS px) are located together in `PAN_TUNING`; their exact values are experimental. The performance and continuity of long sessions, the committed Astro build, and physical touch devices require further verification.

## Visibility-aware spiral project placement — implemented prototype, 2026-10-26

**Separation of concerns:** `src/lib/grid-math.ts` and the finite `TileSlot` pool recycle **DOM nodes** for performance. `src/lib/project-placement.ts` instead manages **project identity reservations** within the currently visible and near-visible logical tiles. The earlier `demoProjectIndex` coordinate hash is no longer used to assign rendered projects (the legacy helper remains for its historical geometry test).

**Clockwise spiral:** `spiralIndex(c,r)` returns a zero-based ordinal on an unbounded square spiral starting at (0,0), followed by (0,-1), (1,-1), (1,0), (1,1), (0,1), (-1,1), (-1,0), (-1,-1), then (0,-2), continuing outward. At initial load, sort visible source cells by ordinal and allocate project records in this order. The ordered placeholder list has BABUNI.DEV at index zero and numbered sample projects 02–13 thereafter.

**Assignment manager:** `ProjectPlacement.sync(visibleSources,retainedSources)` maintains a map of original source-cell keys to project indices. It removes cells beyond the two-cell overscan band, gives continuing visible cells priority, assigns newly visible cells unused project indices first, and repeats only after visible uniqueness is impossible. Where possible, offscreen-retained project identities are also kept unavailable; if only exactly enough projects exist for the visible viewport, an offscreen ID can be reused before the preferred grace period to avoid screen-visible duplicates. After visible assignments are settled, the two-cell offscreen band is provisionally assigned to prepare content before entrance. The cursor rotates through the actual project list; no empty fallback/filler records are introduced.

**Rendering integration:** `src/scripts/grid.ts` computes intersections between current logical cells and the visible viewport (or its two-tile retention rectangle). Camera pan triggers a reservation sync when the visible grid-cell window changes, rather than on every animation frame; a grid rebuild or completed autonomous shift forces a sync. Because completed shift events remap resident coordinates, calls to `sourceCell` identify the original content source for each current tile. HTML slots only update project title and portal tint when their assigned identity changes. Outer temporary buffer cells can use a provisional spiral display index until they move into the retention region.

**Risks / future work:** A visible tile may need content reassignment on the exact frame it enters view after an offscreen duplicate; test for perceptible pops at fast panning speeds. During a fractional autonomous shift, current screen-visibility calculations use resting logical positions rather than animating transformed bounds, so transitional overlaps warrant integration tests. The previously noted unbounded line-shift history is still a performance risk for long sessions. The permanent project-content schema must replace sample placeholders later.

**Both-edge visibility correction:** A separate `visibleCellBounds` calculation watches the first **and** last partially visible row/column. Watching only the ring-buffer's first coordinate can miss a newly entering right/bottom tile on viewports whose dimensions are not exact multiples of tile size. The renderer now synchronizes assignments when either edge changes. A dedicated unit test reproduces the missed-right-edge scenario, and simulated desktop/mobile panning tests cover both aspect ratios.

## Shift-entry identity reservation — 2026-10-26

The row/column renderer originally committed a `ShiftEvent` before calling `ProjectPlacement.sync` at the end of animation. An offscreen entering tile that held a provisional/duplicate identity could therefore be reassigned at the end, visibly changing its label and tint. The new `ProjectPlacement.stageEntrances` method reserves a conflict-free-at-rest identity for each entering source before the CSS transform begins, using the outgoing opposite-edge source's existing project if necessary. The renderer computes the source coordinates through `sourceCell` and updates incoming buffer nodes before they move. After the event is committed, `sync` should retain these staged identities. Tests cover row/column directions and simultaneous opposite moves. The full browser transition and accelerated camera interruption still require hands-on checks.
