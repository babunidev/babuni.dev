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
- Whole-tile hover/focus reveals all three tiny snippets in their existing randomized sequence; clicking/tapping anywhere selects the project. Occasional ambient teasers reveal one random point at a time, including on unaffected surrounding tiles during small bloom. Linger timing remains optional/unimplemented.
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
| Full bloom / big bloom | Activate a small-bloom module or Read more | Shared living grid with 2×2 modules; selected intro centered; original project tile in its lower-left quarter | Original project tile returns to small bloom; a module opens detail |
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

## Calm shift completion — Babuni.dev correction, 2026-10-26

**Babuni.dev decided:** Clicking anywhere to select a tile must let the current shift finish in its existing calm tempo before the opening procedure. The AI-added accelerated finish is rejected. All active lines now finish before centering, including unrelated lines; gold selection remains immediate. When switching an open bloom, finish the current shift normally, close the old bloom, then center/open the requested project.

The autonomous duration remains **4400 ms**, with the existing smoothstep easing. No per-interaction duration override remains. Existing drag/page-visibility pauses still resume at the same progress. Camera panning is available while a collapse is queued; holding a drag retains the established shift-pause policy. Centering remains 720 ms and bloom displacement/return remains 520 ms. Earlier shortened-close and unrelated-selection-pause descriptions are historical and superseded by this explicit correction.

**AI diagnosis/fix:** A steady open bloom inadvertently retained transform transitions. Slot reassignment at the end of a downward shift could therefore animate its new resting transform upward. Only bloom opening/closing may now use that transition; open-bloom autonomous motion and its committed resting layout have zero CSS transition duration. Occupied visual columns and reversible source assignment remain.

**Alternative authorized by Babuni.dev:** Fade tiles out and content in instead of displacement if needed for reliability. This fix retains the displacement Babuni.dev said was otherwise nice; no fade substitution was made. Full bloom is still unimplemented, so its future smoothness is not verified.

## Waiting acknowledgement and first portal artwork — 2026-10-26

**Babuni.dev feedback:** Right-side shifts in both directions, drag-to-close, natural surrounding motion and waiting through moving-tile selection/closing looked smooth during their desktop testing. This is human observation, not exhaustive device verification.

**Babuni.dev requested:** Pulse while a requested action waits for a shift, and replace BABUNI.DEV’s colored ball with their supplied square PNG seen through a round opening. **AI implemented:** A gold outline on the queued destination (or current project when closing) pulses in opacity while waiting. It never scales/moves the tile or alters the shift clock. AI chose a gentle 1600 ms cycle; reduced-motion mode leaves the indication steady. The pulse stops when waiting ends or selection is cancelled.

The original square logo image remains centered and fills the circular aperture; its corners are clipped, with a dark recessed rim drawn above it. Portal diameter, marker placement, topic reveal and all existing movement timings remain unchanged. Other projects keep their colored portal fallback. No source image editing, new logo generation or automatic image pan/zoom is introduced. Final pulse feel and device-level image readability remain open.

## Unified whole-tile interaction — 2026-10-26

**Babuni.dev requested/decided:** The whole tile should open its bubbles and be clickable for selection, with the portal no longer a separate interaction. **Implemented:** Hover/focus anywhere on the tile starts the existing random sequential topic reveal. Click/tap anywhere, including the portal, selects the project; native Enter/Space uses the same button. Touch no longer requires or offers a separate portal-only topic toggle before selection. Internal pointer movement does not dismiss/restart the sequence; leaving the tile or focus dismisses it. Activation follows existing centering/bloom behavior.

There is one keyboard stop and action per tile. The decorative portal and logo retain their geometry/mask. Drag intent and capture, queued gold pulse, normal shift waits, reveal timing and bloom switching remain unchanged. Older portal-only hover/touch descriptions are superseded by this explicit human direction. Physical touch acceptance remains pending.

## Center discovery on mobile; pan without closing — 2026-10-26

**Babuni.dev requested/decided:** Mobile should show bubbles for the tile occupying the center of the screen while browsing, without long press or an extra tap. Desktop hover behavior remains. Reverse drag-to-close: an open bloom stays with the project as the grid pans, for readability and control. Selecting another project closes the old one before opening the next, as already established. Babuni.dev also reported that the current mobile appearance was pretty despite not being optimized; no tile sizing changes were requested or made.

**AI implemented:** Primary coarse-pointer/no-hover input activates mobile center discovery (input capability, not a width-only breakpoint). Actual displaced and mid-shift positions determine the tile containing the full viewport center. Existing randomized sequential reveal applies when center ownership changes; the same tile keeps its current sequence. Hints stay visible while dragging on mobile, and ambient random hints are suppressed there. If the center is a bloom content vacancy rather than a tile, no unrelated tile is chosen. Reduced motion still permits deliberate center discovery without reveal/glow animation.

An open bloom moves with the camera on desktop and mobile, retaining both module cells and its source even offscreen. It closes through the existing explicit controls, same-tile activation, or close-first selection switch. Reset/resize continue their previous reset policy. A drag interrupting unfinished centering without an open bloom still cancels that unfinished selection. Existing shift pause/resume, calm completion, selection pulse, pan speed and tile dimensions are unchanged. Earlier drag-to-close descriptions are historical and superseded.

## Open-bloom topic suppression and architecture-first direction — 2026-10-26

**Babuni.dev requested:** Only the physical anchor tile with an open bloom should stop revealing topic bubbles; surrounding tiles continue normally. **Implemented:** The common topic entry point checks the stored bloom anchor, so desktop hover/focus and mobile center discovery share this rule. Already-visible anchor bubbles clear on opening. A queued destination or another instance of the same project is not suppressed merely because it shares a project ID.

**Babuni.dev clarified:** Their mobile comments describe testing on their actual phone. Human phone verification exists; earlier mocked browser checks are separate automated evidence. They consider current functionality and readability sufficient for this stage and want architecture/structures before visual polish. Resize/orientation polish is not the current priority. Full bloom is the intended next feature, but its module types should first be discussed and refined. The AI draft in CONTENT is a proposal, not a new agreed layout, timing or schema.

## Populated module previews — Babuni.dev direction, 2026-10-26

**Babuni.dev confirmed:** The bubble fix works, and orientation has not caused problems in their actual phone testing. Landscape is not optimized but works for the present stage; architecture remains the priority.

**Babuni.dev requested:** Populate the small bloom before finalizing a full-page viewer. Use real available images/video; make a full BABUNI.DEV content set and five populated Button Game modules, leaving unfilled modules empty. Reveal modules in random succession, cap displayed previews at nine, and randomly sample populated modules if more exist. The full-page future may feature a selected content area with other module previews, or larger scrollable modules; this discussion did not finalize that composition.

**Implemented:** Select once per opening; skip empty definitions, shuffle content, cap at nine, and shuffle the reveal order independently. Clear the entire footprint first using the existing 520 ms expansion, then reveal one preview at a time with the existing topic-style 260–420 ms intervals. Reduced motion reveals without animated stagger. Calm shifts retain their original 4400 ms clock. Reveal timers cancel with their bloom, including mid-reveal switches.

**AI layout interpretation:** Nine means nine preview modules plus the project tile. The first two slots retain right/below placement; the other six immediate neighbors fill out the surrounding ring, with the ninth at two cells right of the anchor. A project with fewer previews reserves only that many cells. Left/right row runs slide away from vacancies while the anchor stays fixed; no diagonal corrections. Mobile can pan to offscreen previews. This is not a claim that nine modules plus an anchor fit inside a 3×3 total area.

Previews support real image switching and deliberate native video playback; text displays a curated excerpt with full source content in the module data. They do not yet launch a full-page expanded reader. All module families share stable data separate from layout. See MODULE_AUTHORING for editable definitions and media paths.


## 2026-10-26 — Button Game portal artwork

Button Game now displays its supplied square PNG through the same centered circular aperture as BABUNI.DEV. Mask, portal size, placement and all interaction timings are unchanged.


## 2026-10-26 — Eight modules around the center

**Current rule, superseding earlier nine-module descriptions:** Up to eight previews occupy the immediate neighbors of the central project tile, forming a 3×3 square when full. No extra preview extends two cells right. Random sampling/order and all movement/reveal timing remain unchanged.


## 2026-10-26 — Draggable big bloom and module detail

**Current human-confirmed flow, superseding older full-bloom sections:** Small modules have bottom-right Read more. Their body also enters big bloom, except actual gallery/player/link controls. Big bloom displays a top-left project portal with a back label, an intro centered on the chosen module and all other populated intro cards around it. Positions are sampled once, revelations staggered using existing intervals. Cards never overlap. Mouse/finger drag navigates; keyboard arrows and Home provide an alternative. Another module activation/Read more opens detail. Text detail scrolls and selects normally; media controls do not pan the field. Back/Escape restores the previous level, preserving camera position. Portal return restores the same small-bloom sample and centers its project tile. Clicking that center tile closes small bloom.

**AI geometry choice:** Larger equal-size intro cards on spaced square-ring cells, selected first at center and remaining assignments shuffled. This is an initial functional composition, not final visual polish. Portal travel reuses the existing centering duration. Fullscreen image mode uses the browser control; expanded text supports basic document formatting, not every Markdown extension.


## 2026-10-26 — Big bloom grows inside the living grid

**Current human-confirmed rule, superseding the earlier modal/top-left design:** Big bloom is part of the living grid, with no header strip or persistent instructions covering content. Every module is exactly twice a normal tile’s width and height. The clicked preview transits to the selected central module. The original project tile retains its normal responsive size in that module’s lower-left quarter; Read more occupies the opposite corner. The selected intro’s text stays above the anchor area. Only this deliberate anchor/panel overlap is allowed.

All populated modules are available. The first nine positions are center, top, upper-right, right, lower-right, bottom, lower-left, left, upper-left. The selected module appears through its transit; neighbors follow the top-first clockwise path. Additional modules extend down in three columns. Module identities are shuffled into the remaining positions once per entry, not while reading. Grid tiles remain around the modules, with nonconflicting normal-tempo shifts and the established grab/pull navigation. Text-heavy full-page detail scrolls normally. Big previews expose more actual body text and collection context. The corner question mark reveals help on hover/focus; it does not reserve a bar.

Entry/return wait for current shifts, and reserve/restore space before revealing panels. The original tile backs out to the exact same small-bloom sample and recenters. Selecting a different project keeps the established close-first behavior. Existing normal-grid header/help styling is unchanged; it is hidden only while big bloom is open.


## 2026-10-26 — Four additional portal images

FavorCraft, FlourishForever, ResistForever and SocialForever use their supplied images through the same circular aperture and original tile proportions. No portal positioning, animation timing or bloom layout changes accompany this asset update.


## 2026-10-26 — Stronger action and waiting feedback

User-authorized feedback refinement: pointer/keyboard presses brighten the control immediately; tiles gain a stronger gold face glow. Waiting/preparation uses a stronger halo with a 1400 ms opacity pulse. Centering, expansion/return and queued shifts indicate preparation; settled tiles retain their calmer selected state. Queued Read more buttons stay highlighted/busy until their action starts or is cancelled. There is no scaling, layout movement or action delay in press feedback. Reduced motion makes pulses steady.


## 2026-10-27 — Content validation and authoring

Content authoring now has local validation and invisible blank templates. No timing, placement, navigation or visual behavior changed. Structural validation is separate from Babuni.dev’s hands-on acceptance and editorial review.


## 2026-10-27 — Five more project portals

Five additional projects use supplied artwork inside the existing round portal opening. Shared sizing, clipping, interaction and timing are unchanged.


## 2026-10-27 — Framed detail reader

Module detail now occupies a centered square with a thin warm frame, inset edge and soft shadow. Grid remains visible through a lightly darkened surround on all four sides. Panel uses the smaller viewport dimension with margins and a 980px cap. Its contents scroll inside; Back remains reachable. Opening fades/grows over 420ms, disabled for reduced motion. This supersedes earlier full-screen detail descriptions; explicit image fullscreen remains available.


## 2026-10-27 — Hidden scrollbars

All site scrollbars are visually hidden at Babuni.dev’s request. Long modules and reader content remain scrollable through existing wheel, touch and keyboard behavior.


## 2026-10-27 — Repository-backed project documentation

Repository connections change module content, not grid placement, motion, timing, navigation or reader styling. Matching documentation fills text modules directly; absent/empty documents do not create cards. Existing source teasers remain where curated; new previews quote a deterministic leading paragraph. Small bloom still shows at most eight random populated modules; big bloom exposes the larger complete set with its existing downward extension. Full detail shows the source text in the framed reader, and View source opens the fetched GitHub revision. Unconnected/private-review tiles retain their provisional summary.


## Full document reader loads text on demand — 2026-10-27

The small bloom keeps its immediately available module titles and curated short previews; big bloom retains its existing body-derived intro depth and physical 2×2 layout. No timing, movement, tile appearance or random module selection changes. Opening a full text detail may show a brief “Loading document…” status before rendering its complete, unmodified Markdown. If the file cannot load, an inline Retry document button is offered; Back/Escape still work and cancel the request. Manual/project-authored text not sourced from the generated documents can still open instantly. The HTML reader remains a safe text-node-based, basic-Markdown renderer.

This behavior was an AI implementation choice after Babuni.dev authorized faster loading, rather than a new artistic direction. Verify the transition feels natural on slow connections and assistive technologies.


## Preserve portal-image continuity through the final shift frame (2026-10-27)

**Bug observed by Babuni.dev:** Portal artwork momentarily blinked only after a line visually arrived. This is unwanted; a stone and its circular logo must remain a continuous object as it shifts and comes to rest. The solution must not change the grid's calm 4.4-second movement or alter existing bloom behavior.

**Implementation:** The tile that a visitor sees moving is now the DOM element that occupies the destination once the shift completes, so the same already-loaded portal image remains visible. Recycle only the fully out-of-view pool wraparound cell. Continue honoring the physical bloom-displaced layout when resolving which column/row is moved. No new crossfade, delay or portal artwork sizing is introduced.

**Review needed:** Watch several automatic row/column shifts with and without a bloom and confirm no visible image blink, identity swap, overlap or focus discontinuity at the final frame.

## Original WebP logo references (2026-10-27)

Babuni.dev already converted twelve portal images from PNG to WebP. The project now references the original **WebP files directly**, including the newly assigned BuxbrewResist emblem. Do not generate replacement logos or recompress the originals. No changes were made to the portal's existing 56%-wide circle, glow, three marker points, bubble placement, circular image crop, or bloom animation.

The file paths are published source references, not proof that the separate artwork binaries were pushed. Babuni.dev will add their local files to `public/portal-content/` and commit them; check their rendering and decoding in the actual desktop browser afterward.


## 2026-10-27 — Complete supplied WebP artwork and retain reader attribution

Fifteen supplied project logos use the existing circular portal crop; ROARR, The Great Iceflow Relay and WorkThatGodBod now have their assigned artwork. Original WebP pixels and established portal, topic, grid and bloom sizing/timing are retained. Reader View source and credit remain visible after document load or retry; the panel’s appearance and navigation remain unchanged.


## 2026-10-27 — Render repository Markdown as document structure

Detail now expresses the source Markdown structure: bold and italic emphasis, inline code, quoted blocks, ordered/nested lists, read-only task checkboxes, strikeout, hard breaks and tables. Tables can pan horizontally within the reading field, with the existing hidden-scrollbar policy. Minimal code/quote/table styling makes structure legible; panel geometry, entrance animation, grid timing, return controls and attribution placement are unchanged.


## 2026-10-27 — Dismiss the reader from its surround

Reader dismissal is now a click/tap on the visible surround outside its frame, or Escape. The Back to big bloom button is removed. Inside-panel clicks, reading scroll and text-selection drags do not dismiss. Initial keyboard focus goes to the reader heading; returning restores focus to the module that opened it. Panel dimensions, animation and hidden-scrollbar policy remain unchanged.


## Markdown in previews — 2026-10-27

Babuni.dev requested formatted text in both preview depths. Cards display emphasis, inline code and block structure with compact spacing, using existing card bounds and scrolling. Clicking preview text retains depth navigation; document links activate in the reader. Reveal timing, placement and gestures are unchanged.


## Persistent header and direct discovery — 2026-10-27

Babuni.dev requested the site header across grid, small bloom, big bloom and reader, superseding header hiding in big bloom. Projects opens a compact scrollable list with a search field, all current project names alphabetically, and an empty-result message. Search matches name/summary words without case sensitivity. Arrow Down moves from search to results; Enter selects a unique result; Escape dismisses the menu first. About opens a framed introduction. Header stays above the reader, whose square frame leaves clearance beneath it. Existing center/shift/reveal timing remains unchanged.


## Phone reading and centered activity — 2026-10-27

Supersedes the universal square-reader rule on phones: viewport below 600px uses full width, starts beneath the persistent header and leaves at least 64px below for outside dismissal. No phone border/inset frame. Reader opens with the accepted growth and closes with matching shrink/fade; reduced motion removes both. Desktop retains its framed square. Header center shows project-specific centering, opening, waiting for shift, small/big exploration and reading module. At compact widths the status occupies a second header row. Bottom instructions and small-bloom Close are removed; far-right question mark reveals controls by hover/focus/tap, including Return to center.

## 2026-10-27 — Four-depth consistency check (not a redesign)

**Babuni.dev's direction still governs:** the visitor encounters a continuous field of engraved stone, a colored portal window and a context-origin information cue before seeing deeper content. The small and big blooms **reserve living grid cells**, not floating cards. The visitor can interrupt exploration by selecting a project from the persistent Projects menu, but this should follow existing, calm centering/reveal behavior without accelerating an active shift.

**Implemented refinement, source/date verified:** the header persists in grid, small bloom, big bloom and reader; search supports project name/summary, and About uses the already documented workshop identity. Reader Markdown is rendered as structured, safe content, its inner panel scrolls, and clicking outside or pressing Escape dismisses without wiping the earlier bloom. Small and big previews share formatting but keep links noninteractive until full reading.

**Visual provenance and incompleteness:** fifteen supplied WebP logos are now actually in Git, including the late three assignments; the screenshot archive keeps **21 AI browser captures** separately from two supplied originals and may include superseded appearances. Native phone, keyboard/focus, reduced-motion and small-view testing remain open in places, despite browser regression evidence. This audit did **not** change tile appearance, logo bytes, typography, interaction timing, animation or screenshots.

## WebP publication — 2026-10-27

Babuni.dev requested WebP throughout the website. Preserve image dimensions, captions, alt text, round portal masks and lazy/on-demand delivery. Existing JPEG captures/posters use quality-85 WebP derivatives; existing portal WebPs retain their original bytes. This changes asset delivery, not bloom geometry or interaction tempo.


## Uninterrupted click and gradual drag braking — 2026-10-27

Babuni.dev rejected the momentary pointerdown freeze and requested organic braking during actual dragging. A press retains immediate gold feedback and lets the current shift continue normally. Drag begins only beyond 9px travel; shift playback rate then approaches zero over 280ms, resuming smoothly when manual movement ends. Camera drag follow, bloom timing, shift rest intervals and the normal 4.4-second line motion are unchanged. Hidden-page and reader pauses remain hard pauses. User clarified the perceived uneven motion is on desktop; frame smoothness remains subject to desktop acceptance.


## Highlight-first keyboard exploration — 2026-10-27

Babuni.dev distinguishes keyboard selection from opening. First Tab into the grid highlights the item nearest its visual center. Arrows choose the next spatial neighbor; Space/Enter explicitly activates the highlighted tile/module. Grid tiles enter small bloom; small modules enter big bloom; big modules enter the reader. Reader Escape restores its trigger, big-bloom Escape restores a small-module highlight, and small-bloom Escape restores the project tile. Tab from a primary grid control reaches Projects. Remove free arrow panning; adjust the camera only enough to reveal a chosen offscreen neighbor. Header/document/media controls retain native handling. Mouse/touch and calm shift timing are unchanged.

## Browser identity refinement — 2026-10-27

Babuni.dev requested a graphic-only B browser icon and removal of the Astro development menu. The transparent 64×64 WebP omits the wordmark. Header branding, portal artwork, layout and accepted interaction feel remain unchanged. Browser page verification confirms toolbar absence; tab-chrome legibility remains a human check.


### Header B mark — 2026-10-27

Babuni.dev additionally requested the B to the left of BABUNI.DEV in the persistent header, using WebP, and explicitly authorized committing, pushing, updating and restarting the local site for future changes. AI reused the transparent 64×64 favicon at 32×32 CSS pixels, with fixed dimensions and decorative empty alternative text beside the existing accessible brand name. This adds no image duplicate or interaction changes.

## Reader position handle — 2026-10-27

Babuni.dev requested a little standalone draggable reader indicator without a frame. A gold mark follows reading position at the reader’s right edge, glows on interaction and appears only when content overflows. It has no visible track. Mouse dragging, finger dragging and focused keyboard scrolling are supported; ordinary text scrolling stays native. Other exploration stages gain no scrollbar. Reader size and transition durations are preserved.

## Long-session performance, unchanged interaction — 2026-10-27

Babuni.dev accepts the highlight-first keyboard round trip for shipping and reader scrolling, and reports Firefox feels better than Chrome. Long-running dragging can lose smoothness. AI optimized internal coordinate caching only: keep the calm shift tempo, existing transitions, physical vacancies and native scrolling. No new visual tuning or controls are introduced.

## Public project explanations, private implementations — 2026-10-28

Babuni.dev chose documentation-only editions for four currently private projects. Public explanations must distinguish source-reported functionality from tested behavior, reserved scope from implemented projects, and Morkahja Admin from the public game. This preparation does not redesign the site or modify its motion, artwork or interactions.

## Documentation editions available at all depths — 2026-10-28

Four existing project tiles now gain the standard text modules from their public documentation editions. Small bloom still samples up to eight populated modules; big bloom exposes all populated modules and readers show the selected source with a public revision-pinned link. Existing artwork, tile identifiers, motion and reveal geometry are unchanged. The arcanitebrothers edition explains that its application is Morkahja Admin.

## Resize continuity and supplied artwork — 2026-10-28

Babuni.dev requests the same open bloom and map location through fullscreen/window changes. Small/big blooms retain their selected modules and project identity; the reader remains open. Responsive tile sizing preserves logical position, while transition durations and reader/grid scrolling stay unchanged. Four supplied portal WebPs now illustrate BattleReport, Ethera, RoarGuild and WarriorStartAttack; they use existing circular masks and are not redrawn. Agent viewport tests are separate from physical-phone orientation acceptance.

## Curated discovery surface — 2026-10-28

Babuni.dev removes four entries that should not appear as independent projects. The grid and direct-finding menu now share 49 retained entries, preserving semantic IDs and the order of remaining projects. MorkahjaWorld carries worldbuilding/peoples/places topics; World and Peoples is no longer a separate tile. BABUNI.DEV houses the human–AI development history. Arcanitebrothers uses the supplied WebP inside the existing portal mask. No interaction timing, tile scale, bloom geometry or scrolling behavior changes.

## Retained catalog count — 2026-10-28

Babuni.dev additionally removes The Amberbrew Family and Practical Templates Creator. Grid and searchable menu now share 47 retained entries. No navigation, positioning or timing changes are introduced.

## 2026-10-28 — Warehouse Performance Model withdrawn

**Babuni.dev requested:** remove Warehouse Performance Model too. **Implemented by AI:** removed its semantic ID from the active grid/search catalog, both topic maps and unresolved repository mappings. No connected snapshot or curated module existed; no repository, document, artwork or other project was deleted. Current totals: 46 entries, 35 connected public sources, nine missing-repository entries and two family-clarification entries. Historical inventory mentions remain historical. No interaction timing or layout change.

## 2026-10-28 — GuildChatAI withdrawn

**Babuni.dev requested:** remove GuildChatAI too. **AI implementation:** removed its active catalog/topic/mapping records and the orphaned public GuildChatAI snapshot (ten documents). All other retained snapshots, projects, artwork and interaction behavior remain unchanged. No repository deletion was requested or performed. Active totals: 45 entries, 34 connected public sources, 33 external snapshots and 316 external documents. Historical research mentions remain historical. Verification is recorded in DEVLOG.

## 2026-10-28 — Dual-PC Streaming Setup withdrawn

**Babuni.dev requested:** remove Dual-PC Streaming Setup too. **AI implementation:** removed its active semantic ID, topics and unresolved repository mapping. It had no connected source snapshot or curated module content. All other sources, projects, artwork and interactions remain unchanged; historical mentions remain historical. Current totals: 44 entries, 34 connected public sources, eight missing-repository entries and two family-clarification entries. No repository deletion or new timing/layout change. Verification is recorded in DEVLOG.

## 2026-10-28 — Mech-Arena withdrawn

**Babuni.dev requested:** remove Mech-Arena too. **AI implementation:** removed its active semantic ID, topic records and unresolved repository mapping. It had no connected source snapshot or curated module content. Other projects, documents, artwork, layout and timing remain unchanged; historical research mentions remain historical. Totals: 43 entries, 34 connected public sources, seven missing-repository entries and two family-clarification entries. No repository deletion. Verification is recorded in DEVLOG.
