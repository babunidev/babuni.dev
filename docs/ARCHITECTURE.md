# Technical Architecture — Proposed

**Status:** Astro 7 + TypeScript foundation committed to GitHub `main` (`5902121`); interactive grid architecture remains proposed. Babuni.dev previously reported Astro 7.4.2 running locally.

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

GitHub `main` now contains the Astro starter (`package.json`, `src/pages/index.astro` and related files) and project documentation, integrated in merge commit `5902121`. Babuni.dev reported Node.js 24.18.0, npm 11.16.0 and the Astro 7.4.2 local dev server working. The starter displays an Astro heading; no grid implementation exists. An independent source-snapshot build against `ea90117` passed on 2026-10-26 using Node.js 24.22.1 and npm 11.9.0. Dependencies were installed with lifecycle scripts disabled. Browser behavior and dedicated type checking were not verified; see [foundation review](REVIEW-2026-10-26.md).

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

## One-time spiral reveal of the initially visible tile faces — 2026-10-26

`src/lib/grid-intro.ts` exports the 373 ms duration, 68 ms stagger and `introSequence`, a pure order function that sorts the initial viewport's logical source coordinates by the project's established center-out clockwise spiral index. `src/scripts/grid.ts` applies numbered CSS delays after its initial `rebuildPool` has populated real project identities; only the tiles intersecting the initial viewport are animated. The animation targets `.tile-face` within the parent `.grid-tile` and uses `@keyframes tile-spawn` in `src/pages/index.astro`. That split prevents overwriting the parent's separate translate3d transform used for manual panning and row/column shifts.

The renderer keeps an `introPlayed` flag and checks actual viewport width/height to ignore redundant initial ResizeObserver notifications. Recycling changes tile positions and data but never reapplies the intro class. The transition is canceled on manual/keyboard movement, reset, actual resize or autonomous line shifts. `animationend` removes the introductory class for completed tiles. JavaScript skips intro when `prefers-reduced-motion` is active; a media change clears any in-flight sequence. There is no fake asynchronous loading and no dependency or media-download precondition.

**Still to test in a real browser:** CSS animations cascade correctly after the initial DOM commit; mobile viewport ordering; interruption without label/color flicker; and the standalone latest shift-entry identity fix.

## Provisional named inventory snapshot in the demo catalog — 2026-10-26

`src/lib/demo-projects.ts` now holds 53 provisional `DemoProject` records from `docs/PROJECT_INVENTORY.md`: stable candidate `id`, `name`, `shortSummary`, inventory `evidence` and temporary `tint`. This is a checked-in data snapshot rather than a live Markdown runtime parser: changing the source inventory later requires reviewing/updating the prototype catalog. Index 0 stays BABUNI.DEV; the other 52 entries follow the inventory's approximate recency order. The existing `ProjectPlacement` algorithm consumes the new `demoProjects.length` and otherwise remains unchanged. No separate production content schema or verified publication state is implied. The renderer attaches candidate ID and summary as DOM data attributes for later interactions and uses a long-title class for wrapping; the temporary grid art is otherwise intact.

The inventory's evidence categories carry differing levels of confidence and must not be converted into claims of release/technical completeness without separately confirming each project. This temporary catalog can later be migrated into the structured records defined in `docs/CONTENT.md`, with provenance, rights and Babuni.dev approval tracked per project. No new assets or external dependencies were introduced.

## One visible portal topic bubble — 2026-10-26

`src/lib/project-topics.ts` carries an explicit, editable lookup of 53 provisional candidate slugs to single short topics, curated from `docs/PROJECT_INVENTORY.md`. The topics are intentionally distinct from the existing `shortSummary` fields in `src/lib/demo-projects.ts` and do not claim verification, release, or promotion. Future text-based keyword extraction should be a curation pipeline that produces reviewed metadata, not uncontrolled text generated live on hover.

The DOM pool renderer (`src/scripts/grid.ts`) now creates a button-shaped `.tile-portal` within each tile face, a separate top `.tile-mark`, and a `.tile-topic` label. `.tile-portal` overrides the parent visual layer's `pointer-events:none`, enabling portal-only hit-testing without making the entire stone intercept input. Hover/focus delegates at the viewport level to show one active label; stationary touch taps use `document.elementFromPoint` after pointer capture has retargeted pointerup to the viewport. The existing pan controls still own primary pointer capture, and movement over a 9px tap threshold is treated as a drag rather than a bubble tap. The presentation targets a `.grid-tile--topic-open` class rather than changing project identity or transforms.

Offscreen buffered `.grid-tile` elements retain `aria-hidden=true` and portal `tabIndex=-1`; visible tiles expose their project button with an accessible name including the topic. Recycling/project reassignment clears the active topic to prevent displaying outdated text. The compact bubble is absolutely positioned inside each tile and has no pointer hit area of its own; CSS transitions are bypassed under the existing reduced-motion rule. The implementation makes no attempt yet at four independent points, automatic teaser cycles, dynamic keyword generation or bloom reservations.

**Pending:** local Node/Astro checks, mouse and real touchscreen integration, focus traversal under shifting/panning, and Babuni.dev judgment of the precise glow and information density.

## Center-first selection and ambient topic teasers — 2026-10-26

`src/lib/grid-focus.ts` holds pure recenter geometry (`panX=-column*tileSize`, `panY=-row*tileSize`), easing, a right-neighbor vacancy rule, and provisional animation/teaser timings. The renderer tracks a selection by original `sourceCell` plus `projectId`, independent of the finite recycled DOM pool. `ProjectPlacement.sync` now accepts an optional pinned source, processed first to prevent mid-pan project identity changes.

The stone face has a separate focusable select button underneath the existing portal button. Normal portal hover/tap reveals the tiny topic; an un-dragged click/tap on the stone selects its source. If a line is moving, selection waits until its event completes. Otherwise the full grid camera interpolates to the selected cell at the screen center in 720 ms. Only then is the rightward contiguous row segment shifted by one tile using transforms; a sibling `.grid-bloom-module` is inserted at the actual vacated adjacent coordinate and displays the provisional project summary. Escape/Close/reselection restores the normal field. Automatic line shifts are suspended while the bloom is active because multi-line collisions with reserved cells remain unimplemented. This bloom displacement is a temporary visual offset, not a persistent source-cell ShiftEvent.

An ambient timer reveals one existing topic marker/label for about 1.7 s at randomized 6.5–10.5 s intervals, conditioned on visibility, inactivity, no active bubble, no selection or shifting, and absence of reduced-motion preference. The UI introduces no network request or keyword generation. Full local suite, visual correctness, touch and focus behavior, and interrupt/reentry cases remain unverified.

The live focused-control check uses CSS `:focus-visible` for project buttons; ordinary pointer/touch focus left behind after a tap does not indefinitely block idle hint scheduling.


## Ambient hint reliability correction — 2026-10-26

`src/lib/grid-focus.ts` now defines a 5000 ms normal interval, 600 ms blocked retry and 1700 ms visibility duration. The renderer stores `nextAmbientAt` and only advances it after successfully displaying a hint. Misses during autonomous shifts/interaction retry shortly without resetting the deadline, eliminating the previous 6.5–10.5-second skip-and-restart behavior. There is no queue of overdue hints.

The candidate filter checks each recycled tile's actual `getBoundingClientRect()` against the viewport's bounding box, applying padding on both sides, extra top space for the site header and extra bottom space for the help panel. A tile must be fully inside these margins; `aria-hidden` alone is insufficient. The focused-control gate uses `:focus-visible` so that keyboard navigation retains precedence, but stale pointer focus and passive viewport focus do not stop ambient feedback. A previous-project-ID preference discourages immediate repetitions. Tests cover timing and full-tile geometry; integrated browser results and phone input remain to be checked.


## Shift-aware selection and live background movement during bloom (2026-10-26)

The first small bloom protects the selected `(column,row)` plus the right-adjacent module cell. New helpers in `src/lib/grid-focus.ts` provide `shiftTouchesSelection`, `shiftAvoidsBloom`, `selectionShiftAction` and `bloomShiftFraction`. `selectionShiftAction` returns **wait** only when an active move touches the selected row, selected column or immediate module column; all other clicks proceed by temporarily pausing the motion while the camera centers.

The scheduler in `src/scripts/grid.ts` no longer stops whenever `selectedChoice` exists. During an actual open bloom, it excludes only the selected row, selected column and module column from the usual `planShiftRound` inputs, leaving other lines eligible with their existing randomness, initiative rules and 4.4-second movement. When a safe previously paused shift is still in progress, it resumes after the bloom's 520 ms opening transition.

The right-hand row displacement means a moving column beyond the module crosses a region with an additional +1 horizontal cell offset. `bloomShiftFraction` supplies a smooth 0→1 offset for the incoming tile and a 1→0 offset for the departing tile while the column moves through the selected row. `paintMovement` combines this with vertical and row shift transforms, preserving both endpoints at the shift-history commit. An `is-autoshifting` CSS class disables bloom-only transform transitions during the active animated shift; otherwise the normal 520 ms bloom entrance/return transitions apply solely to tagged tiles.

The active/pending project is stored by immutable source coordinate and project ID rather than the recycled DOM element. `highlightSelection` prioritizes a queued project so feedback is immediate while an affected line finishes. A close-first selection uses a pending choice during `stopSelection(true,nextChoice)`; the old bloom's row is restored and the next centering begins only after the closing timer. The original source-history allocator and project identity pinning remain unchanged. Browser-level concurrency/transition verification is still required, including line shifts and selection during panning, autofocus and real touch.

**Close-phase refinement:** `stopSelection` captures the previous selected column, pauses any in-progress line motion during the 520 ms bloom close, and interpolates away the residual bloom x-offset while retaining the line's current y-displacement. Once the returning row finishes, a pending selection is started or compatible background motion resumes. Inline transitions are cleared afterward. This prevents an old offset from surviving into the next bloom.


## Three-point portal metadata and bloom-compatible ambient hints (2026-10-26)

The original single-point map remains in `src/lib/project-topics.ts` as the **top** category. The module now also exports `supplementalTopics` with exactly two tentative snippets per 53 candidate IDs; `topicLabelsForProject` returns `{top,left,right}` and `TOPIC_POINTS` defines the supported point names. `chooseAmbientPoint` avoids immediately repeating the previous point and accepts an injectable fraction for pure tests. These arrays are manually curated source snapshots, not automatically verified publication facts.

Each pooled tile in `src/scripts/grid.ts` owns three noninteractive `.tile-mark--{top,left,right}` diamonds and three matching `.tile-topic--{top,left,right}` snippets. They do not introduce new navigation targets or interfere with the existing `.tile-select` stone button and `.tile-portal` button. The renderer updates labels on project reassignment and stores `data-topic-mode="all|top|left|right"` on the selected tile. `src/pages/index.astro` uses that state to either reveal all three on intentional portal discovery or just the chosen point for one ambient hint. The existing CSS no-pointer-events bubbles remain within the tile bounds. A single `activeTopic` still prevents cross-tile topic clutter.

The ambient scheduler no longer automatically blocks when `selectedChoice` and an opened `bloomModule` exist. Instead it waits until the module has `.is-open`, excludes the selected project row (containing the reserved bloom cell), the golden selected tile and slots currently moving in a row/column shift, then applies the existing transformed bounding-box viewport/safe-area test. It retains the previous ~5000 ms cadence, 600 ms blocked retry, 1700 ms display, focus precedence, reduced-motion bypass and one-topic-at-a-time state. The selection, independent shift history, source identity pinning and bloom movement code are not altered.

**Verification remaining:** run Node test suite, Astro production build and browser/device tests for all three markers, incidental hints while a bloom is open, automated shifts, focus/hover/touch, narrow tiles and reduced motion.

## Visual occupancy mapping — 2026-10-26

`src/lib/bloom-geometry.ts` inserts sorted visual vacancies per row (`occupiedCell`) and inverts occupied coordinates (`restingCell`). Small bloom reserves right and below. Rendering selects moving columns after mapping resting slots to occupied cells; x stays constant throughout vertical movement. Each committed ShiftEvent captures its vacancy geometry. `sourceCell` reverses that event in visual space and returns to resting space before reversing earlier events. This keeps semantic source identity independent of both DOM recycling and temporary bloom layout. Entrances use the same inverse mapping. No diagonal interpolation remains.

Expansion conflict checks include whole displaced runs, not just two adjacent columns. Collapse during a running bloom shift completes the event on its original geometry before removing reservations; the camera remains free. Independent shifts remain paused during centering. The scheduler protects both reservation rows and module columns. The generic mapping is tested with a 3×3 vacancy set; full 3×3 scheduling is not implemented. Shift history remains unbounded as before; long-session history compaction is still open.

## Topic overlay stacking — 2026-10-26

CSS in `src/pages/index.astro` raises `.grid-tile--topic-open` to z-index 3 (bloom modules use 2) so transformed neighboring tiles do not obscure outward bubbles. Content-sized bubbles share a bounded reading width rather than a tile-bound width. Left/right transform origins match their bottom-right/bottom-left anchors; the top translates by half its own width and grows from bottom-center. Pointer events remain disabled on bubbles; no geometry or shift scheduling changes. Viewport-edge clipping remains.

## Topic reveal lifecycle — 2026-10-26

`topicRevealPlan` in `project-topics.ts` returns a shuffled permutation with cumulative delays. `showTopic` schedules successive additions to space-separated `data-topic-mode` tokens; CSS token selectors reveal each matching marker and bubble. `hideTopic` cancels every reveal timer and clears sequence state. Repeated focus/pointer/tap triggers preserve an active exploration. Ambient mode bypasses the three-point sequence. No grid geometry changes.


## Portal-relative visual geometry — 2026-10-26

`src/scripts/grid.ts` now wraps the existing `.tile-portal`, three `.tile-mark--{top,left,right}` diamonds, and three `.tile-topic--{top,left,right}` labels inside a single `.tile-portal-cluster` within the square tile face. Queries and delegated pointer/focus events continue to use the existing portal and topic class names. The stone-select button remains an independent sibling and therefore retains its full tile hit area outside the portal.

`src/pages/index.astro` sizes the wrapper at `width:56%; aspect-ratio:1`, gives its circle `width:100%; height:100%`, and locates the wrapper at `left:50%; top:45%`. Marker centers are placed at exactly `half portal diameter + 6% tile size + half 7px marker` along the top, left and right axes. This single radial formula replaces the previous unrelated face-percentage positions and the long-title 53% portal override. The name is positioned independently at the bottom and can use its smaller font without influencing the circle geometry. All three bubble wings are anchored relative to the corresponding marker's top edge in the same wrapper. Parent `pointer-events:none` and child `pointer-events:auto` on the circle retain portal-only inspection; info panels remain passive.

`tests/portal-layout.test.mjs` checks the single width, consistent wrapper, same radial offset and attachment declarations, and evaluates clearance for representative tile sizes. These are source/geometry tests rather than actual rendered screenshot comparisons. Interaction, browser/device visuals and Astro build are pending verification for this change.
