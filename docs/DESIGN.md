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
- Three small glowing square points (above, left, right of portal) with outward-spreading translucent topic snippets; the four-point sketch was superseded on 2026-10-26. Angular connector strokes remain a possible future visual refinement.
- Panels are temporary *information snippets*: purpose, behavior, audience, interesting characteristics.
- Direct portal hover/focus/tap reveals all three tiny snippets; occasional ambient teasers reveal one random point at a time, including on unaffected surrounding tiles during small bloom. Linger timing remains optional/unimplemented.
- Info overlays may extend across neighboring tiles; do not reserve adjacent cells. This differs from bloom modules.

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
3. A light-point bubble may overlay neighboring tiles, remains anchored to its glowing square, and is not a navigation button.
4. Small bloom frees actual neighboring cell space.
5. Full bloom removes other projects.
6. Module detail reads/browses normally.

## Free manual pan — milestone 1 prototype (2026-10-26)

Babuni.dev described interaction as Google Maps-style dragging: hold the primary mouse button or touch with a finger and pull the entire grid in any direction. Drag follows the pointer with no snapping or mandatory return to the starting center. Releasing currently stops movement; kinetic inertia has not been requested or implemented. A keyboard-accessible alternative uses arrow keys and Home or the reset button.

Reuse the existing visual tile elements when they travel wholly offscreen. A moving tile reappears in the offscreen buffer on the opposite side and later becomes visible again. Maintain two extra tile-wide buffer bands initially; the DOM pool should not grow indefinitely as a visitor travels. The prototype uses decorative sample projects; real project records and future bloom interactions remain separate.

## Autonomous row and column shifts — experimental implementation (2026-10-26)

The first implementation uses Babuni.dev's previously discussed dice idea: a random round selects rows or columns, visible lines are randomly ordered by initiative, every line rolls d20 and a provisional bonus (+4, +3, +2, +1, then zero), and adjusted results above ten shift by one full tile. Each successful line independently chooses a direction. Several lines may move in a single round, always sharing the selected axis.

Prototype values (AI-chosen, not locked by Babuni.dev): about 6.5 seconds before the first round, 4.4 seconds of smoothstep easing for a move, and an 8-second rest between rounds. While holding and dragging, an ongoing shift freezes and resumes at the same progress on release, while upcoming rounds wait. The grid camera's approved manual-drag behavior is unchanged. The application also suspends ongoing movement when the page is hidden and disables automatic movement for users requesting reduced motion. Status text in the header is temporary visual feedback.

The probabilities, pace, simultaneous movements, and direction rules still require Babuni.dev testing. Bloom interactions will need a later policy for suspending nearby line movement.

## Refined movement feel — 2026-10-26 prototype

**Babuni.dev direction.** The original arrow-key jumps were too abrupt and fast. Key navigation should instead have continuous, slower, smooth movement. Dragging with the mouse may briefly accelerate before reaching its normal cruising speed, which should have an adjustable ceiling and should not attempt to match arbitrarily fast pointer travel. During autonomous shifting, Babuni.dev observed unattractive large blocks when two or more rows moved in the same direction simultaneously and explicitly disallowed that pattern.

**Prototype parameters (AI-selected, pending hands-on adjustment):** Arrow keys ramp to at most **130 CSS px/s** with **520 px/s²** acceleration and **700 px/s²** deceleration. Mouse/touch follow ramps to at most **440 CSS px/s** with **1800 px/s²** acceleration. Pointer lag is capped at **180 CSS px**; any unfinished lag is discarded when the visitor releases the pointer. These values are all defined in `src/lib/grid-controls.ts`, not spread across event handlers. Arrow-key repeats never generate additional jumps; the animation clock determines movement. Diagonal arrow input is normalized so it is not faster.

**New shift constraint:** Per autonomous round, select at most one successful row to shift left and one to shift right. Earlier successful dice/initiative rolls get priority within each direction. The assistant extends the same constraint to columns (one up, one down maximum) to avoid equivalent vertical blocks; column-specific approval is pending Babuni.dev review. Shifts remain one full cell over the existing slow easing interval and pause during active pointer or keyboard navigation.

**Future visual evidence:** Babuni.dev intends to add images and videos to a folder named `Visual Documentation Material` for inclusion in curated development records. No such media have been received or integrated as part of this change.

## Manual navigation speed doubled — 2026-10-26

Babuni.dev asked to make movement twice as fast as the previous mouse/touch and arrow-key controls. Current prototype configuration in `src/lib/grid-controls.ts`: mouse/touch maximum **880 CSS px/s** (previously 440), acceleration **3600 CSS px/s²** (previously 1800); keyboard maximum **260 CSS px/s** (previously 130), acceleration **1040 CSS px/s²** (previously 520), deceleration **1400 CSS px/s²** (previously 700). The **180 CSS px** pointer-lag limit and autonomous row/column shift timings remain unchanged. Multiplying both speed and acceleration by two retains approximately the same ramp-up time. Final feel requires hands-on evaluation.

## Faster manual navigation — 2026-10-26

Babuni.dev requested doubling the previous navigation speed. Updated mouse/touch maximum: 880 CSS px/s (formerly 440), acceleration: 3600 CSS px/s² (formerly 1800). Keyboard maximum: 260 CSS px/s (formerly 130), acceleration: 1040 CSS px/s² (formerly 520), deceleration: 1400 CSS px/s² (formerly 700). The cursor lag limit remains at 180 CSS px, and autonomous row/column shift timings are unchanged. Values remain subject to Babuni.dev's hands-on review.

## Project placement and reuse — new Babuni.dev-confirmed rule (2026-10-26)

**Start position:** BABUNI.DEV (number 1) is centered. The next eight original projects form the first clockwise ring, beginning above the center:

```text
PROJECT 09   PROJECT 02   PROJECT 03
PROJECT 08   BABUNI.DEV   PROJECT 04
PROJECT 07   PROJECT 06   PROJECT 05
```

PROJECT 10 appears directly above the center in the second ring, at coordinate (0,-2), and the spiral continues clockwise and outward. This is a content assignment order, not a visual movement animation.

**Reuse rule:** Every visible tile displays an actual project, even when only five project records exist. Never substitute an empty stone or neutral filler. Start with each distinct project in the spiral order, then cycle/reuse records as needed to fill the screen. Once the library contains at least as many distinct projects as there are visible tiles, there must be **no repeated project identity anywhere in the visible viewport**. Preserve tiles' assignments while visible. Hold offscreen assignments for up to two tile widths/heights where practical; reclaim them beyond that border. To keep the no-duplicate promise when the library size only just covers the screen, the allocator may reuse an already-offscreen project earlier than the preferred two-tile grace period. Offscreen project instances may therefore share identities with visible instances; they must not become simultaneously visible duplicates.

**Interaction with movement:** Independent row and column shifts move project identities along with their original source tiles. Manual pan only changes the camera. A finite pool of visual DOM elements is not the same as the project identity pool; neither directly controls the other's lifetime. The twelve temporary projects are now numbered 02 through 13, with BABUNI.DEV as the first identity.

**Verification status:** The placement rules passed focused logic tests but have not yet been inspected by Babuni.dev on a physical screen in this revision. A smooth offscreen-to-onscreen content transition and identity correctness during slow line animation still require visual evaluation.

## 45 demo project identities — desktop spiral review, 2026-10-26

Babuni.dev requested 45 distinctly named placeholders (BABUNI.DEV plus PROJECT 02–45) to visually judge the spiral reuse rule. An initial centered 1920×1080 viewport with 240px tiles has 45 visible cells, including partial edge tiles, so all may have different project names. Some panned positions have more visible cells and must repeat if only 45 identities exist. These demo entries are not 45 published portfolio projects; no filler/neutral stones have been introduced and the spiral placement algorithm is unchanged.

## Project labels must remain stable during autonomous shifts — 2026-10-26

**Babuni.dev's visual correction:** An incoming project tile must not change its engraved name, project number or portal color when it finishes sliding into the view. The prototype previously sometimes showed that jump on left-to-right entries, and a vertical case was also suspected.

**Motion rule:** Determine the incoming tile's final identity in the offscreen buffer *before* the line starts translating, instead of selecting its project at the moment the one-cell motion completes. The tile's identity and color must remain constant throughout the animation. At rest, avoid repeated visible projects when the project catalog can fill the viewport without duplication. When an extra partial-edge tile appears during a moving line, a short overlap may be unavoidable; do not hide the identity switch by fading or renaming a moving project.

## Clockwise project appearance on initial page load — 2026-10-26

Babuni.dev requested a staged visual arrival rather than a technical loading screen: BABUNI.DEV appears first, then PROJECT 02, 03 and onward around the center in the already-approved clockwise spiral. An individual tile's stone face grows into its fixed tile position over **373 ms**. The assistant provisionally chose a **68 ms** gap between starts, with a gentle overshoot before settling. A 45-tile centered desktop view should finish the sequence in roughly **3.4 seconds**. Tile position, project identity and the content allocation system do not change as a result of the reveal.

The animation applies to the inner tile face, not the `.grid-tile` transform that powers autonomous line shifting. It runs only on the initially visible viewport once per page load. An offscreen buffer tile reused through manual panning must **not** reappear with a spawn animation. If a visitor begins dragging, uses the keyboard, resets the view, or a shift begins, unfinished entrances end immediately so the scene stays responsive. A real resize may end the sequence, but an identical initial ResizeObserver callback must not restart it. Reduced-motion visitors see all projects immediately. Animation easing, overshoot and staggering are prototype values awaiting Babuni.dev inspection.

## Named candidate project tiles — experimental content pass (2026-10-26)

Babuni.dev requested swapping 45 generic numbered project tiles for the **53 provisional candidate names** inventoried in `docs/PROJECT_INVENTORY.md`, as a way to judge the grid using recognizable work. BABUNI.DEV remains in the center; Button Game, SocialForever and following entries appear in the approved clockwise spiral, following the inventory's approximate recency order. This visual prototype does not imply that every candidate is a distinct finished or public portfolio project.

The tiles keep their current colors, stone-like face and circle portals. Names longer than the earlier sample labels wrap inside the tile; the renderer applies a smaller font and slightly smaller circle for particularly long titles. Existing project summaries and evidence classifications are stored as provisional metadata, not yet rendered as new hover panels. The grid retains its 373 ms spiral entrance, camera behavior and content-recycling logic. Unique finished portal textures are **not a blocker**: Babuni.dev prefers to focus on functional interactions and reevaluate artwork later.

## First small top-square information bubble — functional prototype (2026-10-26)

Babuni.dev chose to start with just **one** of the originally planned four information points. The existing tiny square/diamond above the colored portal glows when the visitor explores the **circular portal area only**. A very short, non-promotional **topic or category** appears next to the marker within the tile. An example is Button Game → "Reaction game"; Morkahja — World and Peoples → "Worldbuilding". Do not expose the full summary in this first bubble. These words are preliminary, based on current inventory descriptions, pending deeper curation from project records and development journals.

Input behavior: mouse hover inside the portal reveals the bubble, leaving the portal dismisses it; keyboard focus/activation offers the same information; touch tap without movement toggles a single bubble. Initiating a drag, recycling a tile, moving its project identity, or switching to another portal dismisses the previous bubble. The circle remains the pointer hit target; the rest of the tile is still available for normal drag/pan. The popup is contained within tile bounds and does not displace neighboring tiles. Respect reduced motion for glow and popup transitions.

This is **not** a complete four-point system, a small bloom, a full project preview or a claim that the topics are finished editorial content. Babuni.dev's emphasis is exploration and flavor rather than selling. Remaining information points, occasional teaser, longer hover behavior and keyword-curation workflow are future design work.

## Center-first selection and spontaneous glowing topics — 2026-10-26

**Babuni.dev-established interaction:** Wherever a project tile is clicked, the entire grid moves until *that same project* is centered first. Only **after** centering should the neighboring tile(s) move to reserve a physically unoccupied neighboring cell for the partial bloom. Separately, the tiny glowing topic bubbles can occasionally appear unprompted as subtle flavor across the living grid.

**Current first prototype:** Select the stone area (outside the existing portal topic button). A 720 ms eased camera movement recenters the selected logical source. Then a contiguous run of tiles to its right translates exactly one cell for 520 ms, freeing the right-adjacent square for one module showing the provisional short summary. Re-select the centered stone, press Escape or use Close to collapse it. An already-active autonomous shift completes before selection; further auto shifting and manual panning pause until the bloom closes. These timings, rightward direction and focus behavior remain experimental. On narrow phones the module can be smaller than the vacant cell so the centered anchor is not displaced.

**Ambient hints:** Randomly every 6.5–10.5 seconds while idle, one existing top marker may glow and its short topic appear for 1.7 seconds. Never compete with explicit interaction, shifting, selection, initial entrance or reduced-motion use. No automatic long descriptions, marketing text, or multiple simultaneous bubbles.

Full four-point information design, multi-module blooms, selection switching refinements, and collision-safe grid motion during bloom are still future work. Finished portal artwork is not a prerequisite.

Keyboard-visible project focus blocks automated bubbles, but stale pointer/touch focus on a button does not suppress passive hints forever. This is distinct from an actively open project topic, which continues to take precedence.


## Reliable ambient mini-topics — 2026-10-26

After approving the centering-and-bloom transition, the creator observed long unexplained gaps between automatic bubble appearances and occasional hints near screen corners. Aim for one short, gentle topic bubble approximately every five seconds during idle viewing. The selected project's **entire tile** must be visibly within the viewport, clear of the header and bottom controls, rather than just partially intersecting the screen. If a row shifts or the visitor is interacting when a hint is due, defer briefly and show one when eligible; do not start a new multi-second wait for every miss. No simultaneous hints. Keyboard-visible project focus remains protected, but passive grid focus/touch-afterglow should not halt the effect indefinitely. Reduced-motion users still receive no automatic teaser.

The approved center-first movement and one-cell bloom retain their existing prototype timings and mechanics. New hint placement and pacing await visual acceptance.


## Selection during movement and background shifts around a bloom — 2026-10-26

**Creator interaction requirements:** Opening a project must not freeze all other tiles. The already-selected center tile and its displaced neighbor/module remain protected, but unrelated rows and columns continue their slow independent shifting. Clicking a tile that is *itself moving* gives immediate golden selection feedback and waits for its shift to finish before recentering. Clicking a tile unaffected by an existing shift pauses that shift during centering instead of delaying the visitor. Clicking another tile while a bloom is open first closes the current bloom and restores the neighboring row, then moves the camera to the new project and opens it; the new destination should already be visibly selected.

**Prototype visual mechanics:** The selected row does not autonomously shift during the bloom, and neither does the selected column or immediate right-side module column. All other rows/columns remain eligible under normal dice behavior. For columns beyond the module, a tile entering the right-shifted selected row simultaneously eases one tile to the right, and a tile leaving eases it back to its normal column, so the geometry connects cleanly across a vertical shift. Selection/bloom animation durations and the topic bubbles are unchanged.

**Open:** Test simultaneous movement from different directions, rapid switching between tiles while a bloom closes, focus after moving rows, and narrow/mobile layouts before locking the behavior. Compatible-line filtering is an initial single-module rule and must be extended for larger blooms.

## Two-module small bloom and straight shifts — 2026-10-26

**Babuni.dev requested:** Straight plate motion through the actual occupied columns, no zigzag/overlap across displaced rows; finish conflicting shifts before expansion; drag immediately while closing; keep unrelated hover topics; align bubble bottom-left to square top; add a module below the selected project.

**AI implemented:** Reserve right and below cells by inserting a vacancy in each affected row and sliding its contiguous right-hand run. The selected row inserts after the anchor; the next row inserts at its column. Rows containing reservations and columns through either module/anchor are protected. Other visual columns move straight, even when their occupants have different resting columns. Expansion waits for either displaced row or any column at/right of the anchor. Left columns and other rows may pause for centering and resume afterward.

Closing during an active shift shortens its remaining straight movement to approximately 520 ms, then returns displaced runs over 520 ms. Camera dragging begins at the existing 9 px intent threshold and does not wait for either stage. This close timing is AI-chosen and awaits acceptance. Ordinary taps retain selection behavior.

The lower module uses existing topic labels and inventory evidence, with an explicit provisional-content note. This is an AI content choice among concept-approved metadata/keyword candidates, not a human-approved final module specification. Future 3×3 composition remains planned; the geometry accepts arbitrary vacancy sets, but reservations, scheduling, and content for that layout still need implementation. Earlier sideways interpolation descriptions are historical and superseded.

## Outward topic wings — 2026-10-26

**Babuni.dev decided:** Bubble containment is superseded. Let topics spread over adjacent tiles like wings; left uses its bottom-right corner, right its bottom-left, top spreads upward. **AI implemented:** Top bottom-center sits above its square; side corners meet their respective square tops. All use content-sized width with a 230 px / 70vw maximum and consistent typography/padding. Source tiles rise above grid neighbors and bloom panels while topics are open. Bubbles remain passive overlays without reserved cells. The viewport still clips at screen edges; edge flipping is not implemented. Older containment descriptions are historical.

## Sequential topic wings — 2026-10-26

**Babuni.dev requested:** Randomly choose the first bubble, then show the next and the next for an organic feel. **AI implemented:** Shuffle all three once per fresh portal exploration; show the first immediately and keep it visible as the other two arrive. AI-selected intervals vary from 260 to 420 ms. Hover/focus/tap share this sequence; duplicate triggers on the same open portal do not restart it. Closing, dragging, switching or recycling cancels pending reveals. Ambient teasers remain single-point. Reduced motion disables CSS transitions but retains the ordered reveal. Final timing acceptance remains open.


## Portal symmetry and consistent project sizing — 2026-10-26

**Babuni.dev request:** The stone tiles are *squares*, and portal circles must all be the same diameter. Normal titles previously used 59% width while long titles used 53%; the current visual prototype uses **56% of the square tile's face** for every circular portal. Longer titles may change their text sizing, not the portal size. The three glowing information squares must be equidistant from the circle center, positioned farther outward near the inner frame, never obscured by the portal.

**Prototype geometry (AI-selected values):** One square `.tile-portal-cluster`, horizontally centered and at 45% of tile height. All three diamonds are positioned relative to its circular portal boundary with an equal 6%-of-tile margin beyond the rim (plus half the square width). Left and right use the portal's vertical midpoint; the top uses its horizontal midpoint. The engraved name is anchored separately near the tile bottom, allowing long-title typography to change without moving or shrinking the portal. Existing topic wings are anchored to the tops of their relocated squares, with the left bubble growing left, the right growing right and the top centered upward. This does not alter bloom behavior or the organic, sequential three-topic reveal.

**Verification needed:** Inspect tile proportions at 144–172 px mobile, 200 px tablet and 240 px desktop sizes, especially text/portal clearance on long labels, marker distances and topic overlay stacking. The earlier AI drawing with a rectangular stone was incorrect and is not part of the specification. New portal artwork remains optional and deferred.
