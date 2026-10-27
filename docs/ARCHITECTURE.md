# Technical Architecture

**Current status (2026-10-27):** Astro 7 with a TypeScript living grid, physical bloom reservations, preview/detail navigation and repository-backed documentation is implemented. Device, performance and release acceptance remain open. Historical proposals and implementation entries below preserve the development record.

## Responsibilities

- **Astro:** routing, layout shell, static content generation, HTML metadata, deployable build.
- **TypeScript interactive engine:** grid coordinates, viewport sizing, drag, shifting, wrap/recycling, selection, cell reservation, and preload scheduling.
- **UI rendering:** Native DOM controllers render the grid and blooms; Svelte was an early candidate and is not used.
- **Content:** JSON module/repository definitions and raw Markdown documents. MDX is not implemented.
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

## Shift clock and transition ownership — 2026-10-26

`SHIFT_DURATION_MS=4400` in `grid-shifts.ts` supplies the fixed renderer clock. `Moving` has no duration override. Selecting any tile during a shift queues the semantic source; switching an open bloom queues close until the event completes. `resumeMovement` only compensates for existing pauses and never accelerates the event.

`.is-bloom-opening` exclusively enables the opening transform transition; `.is-bloom-closing` enables the return. `.is-blooming` alone does not animate slot transform changes. This matters because shift completion synchronously reassigns source identities to resting DOM slots: CSS must not interpolate those slot resets. Pure geometry alone did not expose this CSS lifecycle defect.

`syncProjects` maps cells through the active vacancies before checking visibility/retention, matching visual occupancy used by rendering and entrance staging. Visual-to-resting inversion and source history remain the coordinate model; no diagonal path correction or fade replacement is added.

## Waiting presentation and portal artwork — 2026-10-26

`highlightSelection` assigns `.grid-tile--waiting` only to the highlighted semantic source while an active shift blocks a pending selection or queued close. It also sets `aria-busy` on that tile’s select button. The pulse animates only opacity on `.tile-select::after`; the grid tile transform remains owned by the motion renderer. Existing reduced-motion CSS disables the animation. Completing or cancelling the queue clears the class and busy indication.

`populate` creates an empty-alt, non-draggable, lazy/async image only for project ID `babuni-dev`; it clears portal children and the artwork class when reassigning a recycled slot. The image is served from `public/portal-content/PortalContentBabuniDev.png`. The button keeps its topic accessibility label and pointer handling. CSS clips image overflow at the 50% rounded aperture, uses centered `object-fit:cover`, and layers an inset rim above the image. The original PNG is 1254×1254, 1,868,243 bytes; no derivative or image optimization pipeline is introduced. Cache reuse avoids a separate source file per repeated tile; performance on slow devices remains unmeasured.

## One interactive control per tile — 2026-10-26

The full-face `.tile-select` button sits above the decorative portal cluster. `.tile-portal` is now an aria-hidden div, retaining artwork/rim styles and children. Only the select button receives visibility tab-index handling; its accessible name combines project title and topic labels. `selectFrom` also resolves the enclosing tile for border/padding hits.

Pointer/focus topic delegation uses that same tile button; related-target checks distinguish leaving a tile from internal movement. Pointer release still requires matching down/up controls and a non-drag gesture, and native keyboard click delegates to the same selection routine. Portal-specific pointer bookkeeping and pinned touch-topic state are removed. The portal remains non-interactive with pointer events disabled; topic wings remain passive overlays. No coordinate, timing or shift-history changes.

## Persistent bloom anchor and mobile topic ownership — 2026-10-26

`bloomAnchor` stores the selected resting cell when opening, independently of recycled DOM slots. Rendering, shift eligibility, entrance staging, and ambient exclusion use this anchor while the bloom exists; they no longer depend on locating an onscreen selected slot. `ProjectPlacement.sync` retains the pinned semantic source even beyond its ordinary retention band, so returning restores the selected identity. The extra retained entry is released normally when unpinned. Module elements remain in the translated world.

`paintedCell` is shared by tile transforms and center-topic hit testing, combining row vacancy insertion with the eased active line displacement. `tileAtCenter` uses half-open cell bounds for unique boundary ownership, with center world coordinates `.5 - pan / tileSize`. Refreshes occur during field/shift painting and input/visibility changes. Mobile input is detected with `(hover: none) and (pointer: coarse)`; desktop hover/focus and ambient behavior stay separate. The mobile center class prevents drag CSS from hiding its topics, while ambient timers skip generating hints in that mode. No extra animation loop or project-opening gesture is added.

## Anchor-topic exclusion and module design boundary — 2026-10-26

`showTopic` rejects the tile occupying `bloomAnchor` only while `bloomModule` exists, clearing any old topic state. Opening a bloom also clears existing topics on that element. The shared guard covers desktop exploration and mobile center ownership without disabling topics on surrounding tiles, duplicate project IDs, or merely pending selection. No selection, positioning or timing change.

**Proposed next architecture, not implemented:** A project-owned ordered module list with stable module IDs; a shared module contract for title, preview, typed content/source and attribution; family-specific preview/detail renderers; and a layout planner independent of content identity. Text, gallery, media, history and resources are draft families (CONTENT). History entries can reuse text readers. Module placement, cell spans and first-view ordering require refinement before implementing full bloom.

## Content-backed small-bloom module layer — 2026-10-26

`src/content/project-modules.json` owns per-project module identities, curated previews, body/document references, media and provenance. `project-content.ts` resolves actual local Markdown documents into text bodies and preserves a summary fallback for other provisional projects. `project-modules.ts` defines the shared model, content filtering, sampling without replacement, nine-preview cap, independent reveal scheduling and supported embed URL validation. Development history is an editorial text role at this stage, reusing the document contract.

`module-preview.ts` renders text, image collections, local video or user-activated allowlisted external players, and resources. Native videos use controls, playsinline and preload=none with no autoplay; image assets are lazy/async. Preview rendering does not imply implementation of the later expanded-page reader. The catalog has no nine-module storage limit; only the sampled view does. Selected IDs and vacancy positions stay stable until closure.

`grid.ts` reserves sampled module cells before rendering the sequential appearance and owns all reveal timers. The old summary/metadata-only construction is replaced by an array of typed panels, with one existing Close action on the first assigned preview. Closing removes every panel and timer. Switching still waits for active shifts at the original pace, closes first, then recenters.

Vacancies optionally carry `originColumn` to split expansion around the project axis. `occupiedCell` subtracts the row’s left-side vacancy count before insertion; `restingCell` adds it back during inversion. Legacy vacancies without that field retain their old mapping. Shift history captures the entire footprint including its origin metadata, so commit inversion matches rendering. Dynamic row/column protection uses every module vacancy plus the anchor. The one-through-nine tests verify fixed anchor, unique occupied cells, non-overlapping horizontal expansion and correct vertical endpoints. No diagonal motion or globally accelerated shifts are added.

Media is versioned in GitHub but served by the website host. Four selected original clips total approximately three minutes; browser-chrome-cropped 960px H.264 derivatives and posters occupy about 5.6 MiB. The original 26-minute mixed recording is excluded. Full text bodies currently ship with the client catalog (about 195 KiB client JavaScript before transfer compression at this checkpoint); deferred text loading can be revisited if actual performance warrants it.


## 2026-10-26 — Button Game portal artwork

`DemoProject.portalArtwork` is an optional public URL. Recycled tiles clear prior portal children and load the assigned project artwork; records without a URL retain the color fallback. Artwork assignment is explicit, independent of tile position.


## 2026-10-26 — Eight modules around the center

**Current rule:** `MAX_BLOOM_MODULES=8`; `MODULE_OFFSETS` contains exactly the eight immediate neighbors, excluding the center. Earlier nine-preview descriptions are historical and superseded. Generic vacancy mapping and scheduler are unchanged. Tests cover one through eight reserved cells and assert the exact square perimeter.


## 2026-10-26 — Draggable big bloom and module detail

`lib/big-bloom.ts` filters content and lays out every populated module, without the small-preview cap. It fixes the selected identity at cell (0,0), shuffles the remainder and assigns unique square-ring cells. `scripts/big-bloom.ts` owns a separate camera, native project dialog and nested detail dialog. The grid/small-bloom DOM remains intact and inert beneath the modal. Reveal timers/ResizeObserver/media clean up on exit; details restore focus and retain the camera. Pointer capture begins only after 9px drag intent, suppressing activation after dragging; embedded controls are excluded. No wheel pan interception is installed.

`grid.ts` queues big-bloom entry until any active shift completes with its original duration, cancels pending entry on selection/close, and suspends further rounds while big bloom is present. Return recenters the retained anchor/sample; a viewport resize during big bloom defers the grid rebuild until return and preserves module DOM during that rebuild. Existing small-bloom pan and shift geometry remain separate.

`ModuleVideo` and `videosForModule` support a project-level `videos` array plus legacy single `video`. A preview shows the first recording and collection count; detail renders the collection with deliberate playback, no autoplay and preload none. External player frames require explicit loading and existing allowlist validation. The document reader builds text nodes/HTTP(S) links and basic blocks; raw HTML is never executed. Relative source-document routes and rich Markdown tables/inline formatting are not implemented.


## 2026-10-26 — Big bloom grows inside the living grid

`lib/big-bloom.ts` now defines a fixed top-first clockwise nine-position ring, then three-column rows extending downward. `bigModuleCell` converts module coordinates into 2×2 grid cells; `bigBloomVacancies` reserves all four cells except the selected module’s anchor cell. `occupiedCell` therefore preserves the actual project tile without a clone or an empty slot elsewhere. The tile’s z-index makes its deliberate overlay the only exception to panel/tile disjointness. Ordinary tiles still move horizontally through the shared vacancy map, and shift history captures the entire active footprint.

`grid.ts` owns both bloom depths, the same camera/manual-input controller and normal shift scheduler. Detached small panels/cells form a retained snapshot; entering mounts large panels in the same world layer. The shared camera centers the selected rectangle while the row runs clear space. Ordered reveal follows after geometry settles. Back restores the old sample and recenters the anchor. Active shifts finish normally before either depth changes; hidden/fullscreen detail alone pauses motion. Only `scripts/module-detail.ts`’s detail controller creates a modal now. It restores focus and preserves the live-grid camera.

`gridWindow` accepts an optional horizontal `columnBufferCells`, defaulting to the existing buffer. First big entry expands the bounded horizontal source pool to six cells per side (vertical buffer remains two) and rebuilds while preserving active panels. This allocation is retained for the session rather than repeatedly recreated. Resizing an open big bloom preserves its layout and cached small panels while recomputing pixel positions. Native scrolling is clipped in big bloom so the camera exclusively owns field positioning. Pointer capture resolves taps on module bodies separately from drags and excludes media/link/Read more controls.

`moduleIntro` derives a bounded longer excerpt from body text; big preview rendering adds real collection captions, titles and credit. Data definitions and the four-video collection remain unchanged. Fullscreen detail retains safe document/media rendering and deliberate playback. The former big modal, fixed top-left mini portal and separate pan state are removed.


## 2026-10-26 — Four additional portal images

Four additional project records now declare `portalArtwork` URLs. The existing recycled-tile renderer handles them without new branches or behavior changes; unassigned projects retain their color fallback.


## 2026-10-26 — Stronger action and waiting feedback

`interaction-feedback.ts` installs delegated pointer/Enter/Space acknowledgement for tile and bloom controls, including detail buttons outside the grid. A WeakMap replaces a prior press timer on repeated presses; each highlight clears after 240 ms without changing dispatch or motion. Grid selection busy state includes pending depth changes, centering and bloom preparation. `queueDepthChange` owns/clears the originating button’s waiting class and aria-busy on entry, replacement or cancellation. Existing geometry and scheduling durations are unchanged.


## 2026-10-27 — Content validation and authoring

`scripts/content-tools.mjs` validates catalog data before production build via `prebuild`, reusing runtime populated-content and embed rules. It checks the stable project inventory, local public files and registered document paths. It reports precise errors and exits unsuccessfully on invalid content. `content:template` prints an empty definition without mutation. No runtime requests, dependencies or CMS were added. Document registration currently remains explicit in both the runtime provider and validator.


## 2026-10-27 — Five more project portals

Added five static PNG files under `public/portal-content` and explicit URLs on existing stable project records. The existing content validator checks their file existence; no renderer changes are needed.


## 2026-10-27 — Framed detail reader

Detail retains the existing native HTML dialog lifecycle, focus trap, Escape return and media cleanup in module-detail.ts. Global styles in index.astro now bound the panel as a centered square and animate its entrance/backdrop. No asynchronous close state or new interaction timers were added. Overflow remains inside the dialog; reduced motion uses the existing global animation override.


## 2026-10-27 — Hidden scrollbars

Global CSS uses scrollbar-width:none and a hidden ::-webkit-scrollbar fallback. Existing overflow:auto containers remain intact; detail no longer reserves scrollbar-gutter space.


## 2026-10-27 — Repository-backed project documentation

`src/content/project-repositories.json` maps every stable tile ID to a public repository/branch or explicit unresolved status. `src/lib/repository-content.ts` defines ten supported document paths and pure composition/excerpt logic. `scripts/sync-repositories.mjs` checks anonymous public metadata, resolves a branch once with git ls-remote, downloads only allowlisted files at that commit, tolerates only 404 for absent paths, bounds response size/time and writes `repository-documents.json` only after a successful complete refresh. No GitHub token reaches browser or refresh requests.

`project-content.ts` resolves BABUNI.DEV’s local raw imports and the versioned remote snapshot through the same module contract; curated assets/resources survive. `content:check` validates mappings, snapshot identities and the resulting modules before build. `content:report` regenerates REPOSITORY_CONNECTIONS.md. Ordinary builds remain offline and use committed content; fetching latest source requires `content:sync`. All imported bodies are currently bundled with the interactive client; the build emits a large-chunk warning. Per-project lazy loading remains open rather than hiding the cost or changing interaction timing in this task.


## 2026-10-27 — Split documented project content out of the initial UI bundle

**Background.** The initial browser bundle eagerly included `src/content/repository-documents.json` (about 1.34 MB) and ten `?raw` local documentation imports. This triggered a Vite large-chunk warning in Babuni.dev's successful local production build. Such data must not be included on a grid-only visit.

**Offline build pipeline.** `scripts/build-document-assets.mjs` reads the committed `src/content/project-repositories.json`, `src/content/repository-documents.json`, ten local allowlisted Markdown files, and validates mapping/snapshot provenance with existing validators. It creates a compact `src/generated/document-index.json` (brief preview plus the pre-existing 1,600-character big-bloom intro) and copies complete raw Markdown to `public/_project-docs/<public-repository-slug>/<approved-filename>`. All generated output is gitignored; originals and reviewed snapshots remain version-controlled. This operation runs via `predev`, `pretest:grid` and `prebuild`; normal builds never call GitHub. `content:sync` continues to refresh reviewed snapshots separately, followed by local prepare/check/test/build.

**Browser content path.** `src/lib/project-content.ts` statically imports the lightweight generated index, the manual module catalog and repository mappings, **not** the full snapshot or raw Markdown. It creates text modules with `intro`, `bodyUrl` and an empty `body`, while preserving curated teaser copy. `moduleHasContent` recognizes the presence of a source URL as real populated text. `big-bloom.ts` uses `intro` if present and otherwise retains its previous body/preview algorithm. Both bloom depths remain synchronous, including selection and reveal timing. `module-detail.ts` requests the one same-origin allowlisted source file when its text detail opens, aborts on close, and provides a recoverable error state and retry button. `loadIndexedBody` constrains paths to generated same-origin allowlisted repository documents; the renderer still uses text nodes and never injects source HTML.

**CI.** `.github/workflows/ci.yml` triggers on pushes to main, pull requests and manual dispatch, uses a read-only token, installs locked dependencies with Node 24, runs `npm run test:grid` (which prepares content automatically) and `npm run build` (which includes content validation). No release, secret or deployment action is configured.

**Limits:** The initial compact index still grows with source-document counts and may need further splitting in a larger future portfolio. Generated documents are static and public just like their GitHub source; no private repository content is exported. All source links retain their snapshot SHA (local Babuni.dev docs link to main). Verify actual chunk sizes, MIME/CORS behavior on deployment, network errors, browser interaction and CI completion before claiming success.


**CI-driven parity correction:** The first 97-test GitHub Actions run found that applying `moduleIntro` to an already generated intro can trim its trailing ellipsis twice. `moduleIntro` now returns `intro` untouched, and only builds a new intro from `body` or `preview` when no precomputed intro is available. Source bodies and module IDs are unchanged.


**Measuring the next bottleneck:** Even after the full source Markdown moved to separate static assets, the clean CI build on `3041e01` still warned about a >500 kB JavaScript chunk. `scripts/report-bundle-size.mjs` now reports raw and gzip file sizes for emitted `dist/_astro/*.js` after builds via `npm run bundle:report`. This tool does not change bundling, request scheduling or the living grid; it provides concrete evidence for possible future per-project preview-index code splitting.


**Observed payload, 2026-10-27:** On passing GitHub Actions commit `a12fde3`, `npm run bundle:report` measured one JS chunk of **584.7 KiB raw, 174.0 KiB gzip**; Vite retained its default >500 KiB warning. These are compiled-file sizes, not transfer or first-contentful-paint metrics. The complete Markdown is not in this JS; the remaining metadata index still has intro text for synchronous big-bloom rendering. Future work can split the compact index by project if warranted by a real waterfall/UX problem, but must not make tile selection or its reveal choreography wait unexpectedly.


## 2026-10-27 — Transfer resident tiles at autonomous shift completion

`src/lib/shift-settlement.ts` builds a pure destination→source-slot permutation for each independent `ShiftEvent` of a round. It chooses shifted tiles using `occupiedCell(slot,bloomCells)` so the column index matches the *actual visual* line when the bloom has reserved neighboring cells. Rows/columns are sorted along the moving axis; a shift by one cell rotates the ordered residents by one. The one wrapping element goes to the opposite edge of the bounded DOM buffer. The round planner already chooses a single axis and distinct line indices, so these permutations are independent.

In `src/scripts/grid.ts`, `settleMovedResidents` captures an immutable snapshot of each slot's current `{element,projectIndex}` and applies the permutation to both fields. Each reassigned DOM element receives its new slot's absolute `left`/`top` and its per-tile transform is reset, which matches the position it reached at animation fraction 1. No DOM image nodes are detached, and no new `<img>` elements are created just to settle an onscreen tile. **Only then** does `frameMovement` append the completed moves to `history`, call `updateField(true)` and paint the non-moving layout. `populate` continues to legitimately rebuild artwork on true project identity changes in offscreen recycled slots.

The design avoids expensive global image preloads and leaves `SHIFT_DURATION_MS`, easing, identity assignment history, bloom vacancies and selection/depth controls unchanged. Tests cover both move directions, opposing independent lines, bloom-displaced visual coordinates and renderer call order. Actual browser compositing and identity continuity must be verified on desktop and phone before this is declared a completed visual correction.

## Portal artwork WebP handoff (2026-10-27)

`src/lib/demo-projects.ts` assigns twelve canonical `/portal-content/*.webp` URLs via the existing `portalArtwork` field; `src/scripts/grid.ts` continues reading this same field and creates the identical circular portal image element. One new mapping is BuxbrewResist, whose project ID previously had no artwork. The other eleven change only file extension.

`scripts/import-portal-artwork.mjs` is an opt-in local helper for Babuni.dev's already-converted WebP files, not an image converter. It validates the expected twelve local files by normalized basename and RIFF/WEBP signature, copies bytes into `public/portal-content/` if the source is elsewhere, or renames noncanonical filenames in-place if they already reside there. It leaves conversion, quality, colors, transparency and dimensions untouched. Use `git add -A public/portal-content` to stage both new WebPs and old PNG deletions. `tests/portal-webp.test.mjs` covers catalog mapping and importer behavior.

The existing `content:check` validates that every assigned artwork path exists in `public/`. As a result, the code-only change cannot pass CI until the second, user-owned binary commit arrives. Do not disable this safety check to mask missing files.


## 2026-10-27 — Complete supplied WebP artwork and retain reader attribution

All fifteen explicitly assigned portal WebP binaries are now versioned with their metadata. The PNG variants are superseded and removed. Asset existence validation and WebP assignment tests prevent missing deployment files. Actual image decoding was checked separately from header-only import checks.

`src/scripts/document-body.ts` owns asynchronous text/loading/error/retry rendering within its own element. `module-detail.ts` mounts that element alongside source/credit footers and supplies the existing AbortSignal and current-view guard. Tests exercise success, retry and stale/cancelled responses without adding a DOM dependency. Generated document assets continue to be prepared before dev/test/build.


## 2026-10-27 — Render repository Markdown as document structure

document-reader.ts now uses Marked tokens and constructs semantic DOM directly. It never assigns untrusted HTML to an HTML parser. Text/entities are decoded only into text nodes; inline code/fenced code remain literal. Raw HTML tokens remain visible text. Link targets are checked for HTTP(S) and credentials; relative references use module.source, passed through document-body.ts and module-detail.ts. Heading links use reader-scoped targets rather than moving the grid. Markdown image syntax produces an explicit link instead of loading media. Tables use a local overflow wrapper; source/credit siblings retain their independent lifecycle. Marked is recorded in package.json/package-lock.json.


## 2026-10-27 — Dismiss the reader from its surround

reader-dismissal.ts installs backdrop gesture and native dialog cancel handlers. It checks primary pointer origin, target identity and current panel bounds before consuming an outside click and invoking the existing return path. module-detail.ts removes the old button and focuses the title on opening. Closing still aborts pending document requests, stops media, restores the trigger focus and resumes the retained big bloom.


## Shared Markdown preview rendering — 2026-10-27

`module-preview.ts` reuses `renderDocument` in noninteractive mode: no document anchors or duplicate heading IDs in cards. `markdown-excerpt.ts` retains complete Markdown blocks when they fit and closes inline wrappers when shortening paragraphs. Preparation writes Markdown previews/intros into the compact index; full document bodies still load only for the reader. DOM construction and URL/media safety policies are shared across depths.


## Persistent navigation — 2026-10-27

`site-navigation.ts` owns the searchable list and shared-header modal attachment/restoration. `grid.ts` resolves stable project IDs into current tile residents, waiting for active shifts/transitions and closing existing blooms before centering/opening; a missing project can reserve an offscreen cell through `ProjectPlacement.assign`. No grid reset or shift retiming is required. Reader modal occupies the viewport with an independently animated/scrolled square panel and fixed header. Dismissal measures the inner panel, preserving outside-click and Escape behavior. Screenshot assets are static gallery entries, with inventory in `docs/VISUAL_DOCUMENTATION.md`.


## Reader exit lifecycle and contextual header — 2026-10-27

`reader-transition.ts` owns a cancellable 420ms Web Animation completion, keeping modal and header alive until shrink finishes; reduced motion/no animation support finishes immediately. Replacement cancels stale completion. `module-detail.ts` reports document title to the grid’s activity callback and still aborts body fetches/stops media on dismissal. Responsive CSS scopes edge-to-edge rectangular geometry to phone widths, with dynamic viewport/safe-area sizing. Shared-header help supports tap state, hover/focus and outside/Escape dismissal. About Markdown is editable at `src/content/about.md`; no chat history is shipped in the client.
