# Interaction and Visual Design Reference

This document describes intended behavior; implementation must be separately verified.

## Overall frame
- Persistent top bar: BABUNI.DEV / Projects dropdown / Gallery / About.
- Grid fills the screen beneath the bar; never reveal scenic backgrounds or blank edges.
- The first tile starts perfectly centered in the full viewport on desktop, tablet, and phone. This is the starting anchor only: dragging can move it out of view.
- Approximate approved sizes: desktop 240 CSS px (>=1024 px viewport width), tablet 200 px (600–1023 px), phone clamp(144 px, 40vw, 172 px). These prototype values require hands-on device verification.
- No fixed number of complete rows or columns. Tiles fill outward in a seamless top-down wall; partial tiles at edges are intentional, and the navigation overlays the grid.

## Tile visual
- Stylized low-detail stone square with slight depth, readable title engraved in the stone, project-dependent minimal engravings.
- Recessed colored central portal; project logo or themed image inside it.
- Four glowing points on portal rim. Angular sci-fi connector strokes and small translucent overlays originate there.
- Panels are temporary *information snippets*: purpose, behavior, audience, interesting characteristics.
- One random teaser occasionally; point hover/focus shows one; prolonged tile hover reveals multiple. On touch use accessible tap/focus alternative.
- Info overlays remain inside the tile boundary; do not reserve adjacent cells. This differs from bloom modules.

## Movement
- Whole row or column translates exactly one cell per successful shift.
- Slow easing, uninterrupted readability, deterministic coordinate identity.
- Randomly choose axis; determine order and roll d20 per eligible line; >10 succeeds after the applicable initiative modifier. Detailed rules remain a test parameter.
- Multiple nonconflicting lines may move in the same round.
- Allow 2D drag/pan. Recycle outgoing visual tile instances to buffers on opposite edges as needed. Do not move the underlying project data or silently duplicate content files.
- On bloom, grid movement slows. Movement must not cross reserved cells or displace an active focused tile unexpectedly; suspension near blooms is acceptable pending prototype.
- Honor reduced-motion preferences; test fade-based relocation as an alternative.

## Interaction state machine
| State | Entry | What is visible | Exit |
| --- | --- | --- | --- |
| Grid | Initial page, close project | All tiles, occasional bubbles | Activate tile |
| Small bloom | Activate a tile | Portal anchor, adjacent cell-sized overview modules, other tiles displaced | Activate same tile again, switch tile, or close |
| Full bloom | Re-activate selected tile | Center portal and complete project preview modules, other project tiles gone | Activate central tile to return to grid; activate module |
| Module detail | Activate module | Full document, media gallery, video or download information | Explicit back to full bloom |

Click/tap behaviors should be discoverable; provide visible back controls and keyboard routes. Avoid hijacking regular page scroll for state navigation.

## Small bloom composition
- A module must occupy one or more actual neighbor cells, not hover over a tile without moving it.
- Selection chooses an admissible neighboring cell to reserve; the prior tile slides away in the same quiet plate-motion language.
- Module candidates: description, keywords, metadata, media thumbnails, dev-log or file availability.
- Content arrives gradually. Small random variation in direction or order is welcome if geometry remains safe and interpretable.
- Adjacent modules may expand further only in full bloom; preserve instant selection switching.

## Full bloom composition
- Fade unrelated grid tiles completely away.
- Retain the original central portal tile as spatial anchor and collapse control.
- Surrounding modules are understated, readable frames, connected conceptually to the center.
- Modules may preview text by gentle movement and media through bounded thumbnails; do not continuously scroll text that is being read.
- Full bloom is still an overview; expanded modules contain complete content.

## Detailed module presentation
- Text / README / DEVLOG: traditional scrolling, readable type, clear return path.
- Images: freely scrolling gallery; central image has a stable maximum size, others remain visible around it; switching images uses reciprocal shrink/grow movement. Separate fullscreen button shows only image.
- Video: still or bounded hover preview where multiple videos exist; full viewing requires deliberate action, with autoplay and bandwidth considerations to test.
- Files: show what is available, type, provenance, version and trustworthy download destinations. No automatic downloads.

## Responsive and accessible interaction
- Touch should not require hover. Provide tap/focus equivalents and visible controls.
- Support keyboard focus, Escape/back, landmarks, meaningful labels, and reduced-motion preferences.
- Do not override browser context menus or globally repurpose wheel scrolling.
- Dynamic tile loading must not make projects unreachable through an accessible list or Projects menu.
- Small viewports can show fewer tiles at once without shrinking tiles below an accessible minimum.

## Visual acceptance tests
1. No blank viewport margins during drag, shifts, and resize.
2. A tile has an engraved title and its own colored portal.
3. A light-point bubble is an overlay contained by the tile, not a navigation button.
4. Small bloom frees actual neighboring cell space.
5. Full bloom removes other projects.
6. Module detail reads/browses normally.

## Free manual pan — milestone 1 prototype (2026-10-26)

The creator described interaction as Google Maps-style dragging: hold the primary mouse button or touch with a finger and pull the entire grid in any direction. Drag follows the pointer with no snapping or mandatory return to the starting center. Releasing currently stops movement; kinetic inertia has not been requested or implemented. A keyboard-accessible alternative uses arrow keys and Home or the reset button.

Reuse the existing visual tile elements when they travel wholly offscreen. A moving tile reappears in the offscreen buffer on the opposite side and later becomes visible again. Maintain two extra tile-wide buffer bands initially; the DOM pool should not grow indefinitely as a visitor travels. The prototype uses decorative sample projects; real project records and future bloom interactions remain separate.

## Autonomous row and column shifts — experimental implementation (2026-10-26)

The first implementation uses the creator's previously discussed dice idea: a random round selects rows or columns, visible lines are randomly ordered by initiative, every line rolls d20 and a provisional bonus (+4, +3, +2, +1, then zero), and adjusted results above ten shift by one full tile. Each successful line independently chooses a direction. Several lines may move in a single round, always sharing the selected axis.

Prototype values (AI-chosen, not locked by the creator): about 6.5 seconds before the first round, 4.4 seconds of smoothstep easing for a move, and an 8-second rest between rounds. While holding and dragging, an ongoing shift freezes and resumes at the same progress on release, while upcoming rounds wait. The grid camera's approved manual-drag behavior is unchanged. The application also suspends ongoing movement when the page is hidden and disables automatic movement for users requesting reduced motion. Status text in the header is temporary visual feedback.

The probabilities, pace, simultaneous movements, and direction rules still require creator testing. Bloom interactions will need a later policy for suspending nearby line movement.

## Refined movement feel — 2026-10-26 prototype

**Creator direction.** The original arrow-key jumps were too abrupt and fast. Key navigation should instead have continuous, slower, smooth movement. Dragging with the mouse may briefly accelerate before reaching its normal cruising speed, which should have an adjustable ceiling and should not attempt to match arbitrarily fast pointer travel. During autonomous shifting, the creator observed unattractive large blocks when two or more rows moved in the same direction simultaneously and explicitly disallowed that pattern.

**Prototype parameters (AI-selected, pending hands-on adjustment):** Arrow keys ramp to at most **130 CSS px/s** with **520 px/s²** acceleration and **700 px/s²** deceleration. Mouse/touch follow ramps to at most **440 CSS px/s** with **1800 px/s²** acceleration. Pointer lag is capped at **180 CSS px**; any unfinished lag is discarded when the visitor releases the pointer. These values are all defined in `src/lib/grid-controls.ts`, not spread across event handlers. Arrow-key repeats never generate additional jumps; the animation clock determines movement. Diagonal arrow input is normalized so it is not faster.

**New shift constraint:** Per autonomous round, select at most one successful row to shift left and one to shift right. Earlier successful dice/initiative rolls get priority within each direction. The assistant extends the same constraint to columns (one up, one down maximum) to avoid equivalent vertical blocks; column-specific approval is pending creator review. Shifts remain one full cell over the existing slow easing interval and pause during active pointer or keyboard navigation.

**Future visual evidence:** The creator intends to add images and videos to a folder named `Visual Documentation Material` for inclusion in curated development records. No such media have been received or integrated as part of this change.

## Manual navigation speed doubled — 2026-10-26

The creator asked to make movement twice as fast as the previous mouse/touch and arrow-key controls. Current prototype configuration in `src/lib/grid-controls.ts`: mouse/touch maximum **880 CSS px/s** (previously 440), acceleration **3600 CSS px/s²** (previously 1800); keyboard maximum **260 CSS px/s** (previously 130), acceleration **1040 CSS px/s²** (previously 520), deceleration **1400 CSS px/s²** (previously 700). The **180 CSS px** pointer-lag limit and autonomous row/column shift timings remain unchanged. Multiplying both speed and acceleration by two retains approximately the same ramp-up time. Final feel requires hands-on evaluation.

## Faster manual navigation — 2026-10-26

The creator requested doubling the previous navigation speed. Updated mouse/touch maximum: 880 CSS px/s (formerly 440), acceleration: 3600 CSS px/s² (formerly 1800). Keyboard maximum: 260 CSS px/s (formerly 130), acceleration: 1040 CSS px/s² (formerly 520), deceleration: 1400 CSS px/s² (formerly 700). The cursor lag limit remains at 180 CSS px, and autonomous row/column shift timings are unchanged. Values remain subject to the creator's hands-on review.

## Project placement and reuse — new creator-confirmed rule (2026-10-26)

**Start position:** BABUNI.DEV (number 1) is centered. The next eight original projects form the first clockwise ring, beginning above the center:

```text
PROJECT 09   PROJECT 02   PROJECT 03
PROJECT 08   BABUNI.DEV   PROJECT 04
PROJECT 07   PROJECT 06   PROJECT 05
```

PROJECT 10 appears directly above the center in the second ring, at coordinate (0,-2), and the spiral continues clockwise and outward. This is a content assignment order, not a visual movement animation.

**Reuse rule:** Every visible tile displays an actual project, even when only five project records exist. Never substitute an empty stone or neutral filler. Start with each distinct project in the spiral order, then cycle/reuse records as needed to fill the screen. Once the library contains at least as many distinct projects as there are visible tiles, there must be **no repeated project identity anywhere in the visible viewport**. Preserve tiles' assignments while visible. Hold offscreen assignments for up to two tile widths/heights where practical; reclaim them beyond that border. To keep the no-duplicate promise when the library size only just covers the screen, the allocator may reuse an already-offscreen project earlier than the preferred two-tile grace period. Offscreen project instances may therefore share identities with visible instances; they must not become simultaneously visible duplicates.

**Interaction with movement:** Independent row and column shifts move project identities along with their original source tiles. Manual pan only changes the camera. A finite pool of visual DOM elements is not the same as the project identity pool; neither directly controls the other's lifetime. The twelve temporary projects are now numbered 02 through 13, with BABUNI.DEV as the first identity.

**Verification status:** The placement rules passed focused logic tests but have not yet been inspected by the creator on a physical screen in this revision. A smooth offscreen-to-onscreen content transition and identity correctness during slow line animation still require visual evaluation.

## 45 demo project identities — desktop spiral review, 2026-10-26

The creator requested 45 distinctly named placeholders (BABUNI.DEV plus PROJECT 02–45) to visually judge the spiral reuse rule. An initial centered 1920×1080 viewport with 240px tiles has 45 visible cells, including partial edge tiles, so all may have different project names. Some panned positions have more visible cells and must repeat if only 45 identities exist. These demo entries are not 45 published portfolio projects; no filler/neutral stones have been introduced and the spiral placement algorithm is unchanged.

## Project labels must remain stable during autonomous shifts — 2026-10-26

**Creator's visual correction:** An incoming project tile must not change its engraved name, project number or portal color when it finishes sliding into the view. The prototype previously sometimes showed that jump on left-to-right entries, and a vertical case was also suspected.

**Motion rule:** Determine the incoming tile's final identity in the offscreen buffer *before* the line starts translating, instead of selecting its project at the moment the one-cell motion completes. The tile's identity and color must remain constant throughout the animation. At rest, avoid repeated visible projects when the project catalog can fill the viewport without duplication. When an extra partial-edge tile appears during a moving line, a short overlap may be unavoidable; do not hide the identity switch by fading or renaming a moving project.

## Clockwise project appearance on initial page load — 2026-10-26

The creator requested a staged visual arrival rather than a technical loading screen: BABUNI.DEV appears first, then PROJECT 02, 03 and onward around the center in the already-approved clockwise spiral. An individual tile's stone face grows into its fixed tile position over **373 ms**. The assistant provisionally chose a **68 ms** gap between starts, with a gentle overshoot before settling. A 45-tile centered desktop view should finish the sequence in roughly **3.4 seconds**. Tile position, project identity and the content allocation system do not change as a result of the reveal.

The animation applies to the inner tile face, not the `.grid-tile` transform that powers autonomous line shifting. It runs only on the initially visible viewport once per page load. An offscreen buffer tile reused through manual panning must **not** reappear with a spawn animation. If a visitor begins dragging, uses the keyboard, resets the view, or a shift begins, unfinished entrances end immediately so the scene stays responsive. A real resize may end the sequence, but an identical initial ResizeObserver callback must not restart it. Reduced-motion visitors see all projects immediately. Animation easing, overshoot and staggering are prototype values awaiting creator inspection.
