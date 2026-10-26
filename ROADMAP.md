# Development Roadmap

This is a plan, not a claim that features already exist. Move tasks only when supported by code, tests, or observed behavior.

## Milestone 0 — Repository and documentation
- [x] Create public GitHub repository babunidev/babuni.dev.
- [x] Clone repository locally.
- [x] Install Node.js and npm locally; Astro starter runs at localhost:4321 (reported by Babuni.dev).
- [x] Commit and push Astro foundation to main (merge commit `5902121`, verified on GitHub).
- [x] Prepare initial project documentation baseline and publish it to main.
- [x] Reconcile and retain project agent rules and Astro guidance in AGENTS.md.
- [x] Record Babuni.dev's preference to work directly on main.
- [x] Activate babuni.dev ChatGPT project instructions (confirmed available in this ChatGPT project).

**Milestone 0 status:** Complete. Astro foundation, documentation, main-only workflow, and active ChatGPT project instructions are established.

## Milestone 1 — Mechanically correct grid
- [x] Decide initial tile sizing and center-first responsive visible-cell formula (Babuni.dev-approved approximate scale; unit-tested).
- [x] Implement temporary representative tiles (not final stone assets or real projects).
- [x] Implement pointer-event mouse/touch dragging, keyboard pan, and reset (desktop pointer tested, real touch pending).
- [x] Implement bounded DOM tile recycling, keeping stable logical coordinates (unit tested and browser preview checked).
- [x] Prototype clockwise spiral-first project assignment with visibility-aware source identity recycling; fill the viewport by repeating the original project library when necessary. Ten pure-placement tests passed in isolation.
- [x] Babuni.dev visually approved the initial 45-project spiral on desktop, describing the result as looking fantastic (2026-10-26).
- [ ] Verify project uniqueness and stable identity during extended panning and ongoing autonomous shifts; full Astro build and physical-device checks remain outstanding.

**Babuni.dev's first desktop acceptance test (2026-10-26):** Local Astro 7.4.2 server returned the page successfully. On Babuni.dev's desktop, the centered BABUNI.DEV tile appeared correctly, mouse dragging felt smooth and appropriately paced, and the grid could be dragged indefinitely without encountering an edge. This verifies the manual desktop experience by user observation; physical phone/tablet, resizing, automated shift mechanics, and reduced-motion tests remain open.
- [ ] Prove responsive coverage on phone, laptop, and wide desktop.
- [x] Prototype slow one-cell row/column shifts with testable seeded dice rounds (timing and initiative mechanics provisional; Babuni.dev review outstanding).
- [x] Pause an active autonomous shift while dragging, resume afterward and defer new rounds while dragging. Bloom-specific conflict handling awaits bloom implementation.
- [ ] Validate keyboard and reduced-motion alternatives. Frame-driven, slower keyboard movement and reduced-motion support are implemented, but await Babuni.dev/device acceptance.

**Movement refinement (2026-10-26):** Babuni.dev requested smooth, slower arrow-key navigation; brief acceleration and an adjustable speed ceiling for mouse/touch dragging; and no two simultaneously shifting rows moving in the same direction. A matching restriction on columns is an AI-proposed extension, awaiting Babuni.dev review. Initial controller and directional shift cap are implemented and tested in an isolated preview. New Babuni.dev feedback is needed before locking speeds or declaring Milestone 1 complete.

## Milestone 2 — The first portal
- [ ] Reusable, stylized stone tile component.
- [ ] Engraved, always-legible title and colored portal window.
- [ ] Four point-anchored holographic information bubbles.
- [ ] Hover, focus, tap, automatic occasional teaser, and linger-to-reveal behaviors.
- [ ] Test against clutter on dense grids.

## Milestone 3 — Small bloom
- [ ] Select and focus a tile instance.
- [ ] Reserve adjacent grid cell(s) for modules; move displaced neighbors.
- [ ] Keep neighboring project tiles visible while reducing shift speed.
- [ ] Support switching selection and graceful collapse.
- [ ] Preserve identity when wrapped copies exist.

## Milestone 4 — Full bloom and viewers
- [ ] Remove unrelated tiles without losing navigation context.
- [ ] Keep central portal tile as anchor and exit.
- [ ] Compose rich preview modules from project content.
- [ ] Expand text to accessible scrollable reader.
- [ ] Build scrollable image gallery with fixed-size central image and optional art-only fullscreen.
- [ ] Embed video previews and file references safely.

## Milestone 5 — Content and automation
- [ ] Define and validate project schema and MDX blocks.
- [ ] Add 2–3 real projects, including babuni.dev itself.
- [ ] Surface development notes as first-class modules.
- [ ] Validate AI-created entries and require accurate attribution.
- [ ] Add CI build checks and preview deployments.
- [ ] Set controlled publishing authorization.

## Milestone 6 — Release
- [ ] Configure VPS hosting, deployment, domain and HTTPS.
- [ ] Verify performance, responsiveness, keyboard/touch controls, security, and cross-browser behavior.
- [ ] Publish an initial release and maintain the changelog and journal.

## Documentation requirement for every milestone

Update CHANGELOG for implemented changes; DEVLOG for context and experiments; DECISIONS for durable choices; DESIGN/ARCHITECTURE/CONTENT as applicable; and ROADMAP as work changes. Distinguish Babuni.dev requests, agent proposals, completed work, and evidence.

**Manual-speed iteration (2026-10-26):** Babuni.dev requested twice the current mouse/touch and arrow-key movement speed. Updated control limits are implemented (880 and 260 CSS px/s, with proportionally faster acceleration and deceleration). Actual browser feel and acceptance are pending.

**Speed tuning (2026-10-26):** Babuni.dev requested doubling the mouse/touch and arrow-key movement speeds. The new tuning is implemented (880 and 260 CSS px/s maximum respectively) with proportionally doubled acceleration/deceleration. Hands-on approval and fresh local tests remain pending.

**45-identity visual check (2026-10-26):** Added demo projects through PROJECT 45 and tests for uniqueness across all 45 cells initially visible at 1920×1080. Updated two stale control tests from Babuni.dev's preceding 28/30 run. Full post-change suite and visual inspection are pending.

**Babuni.dev checkpoint (2026-10-26):** Initial spiral visual arrangement approved with 45 demo identities. Before the first stone portal, prioritize fresh `npm run test:grid` and `npm run build`, a short real desktop shift/recycling check, and keyboard/reduced-motion checks. Physical phone and laptop responsiveness can remain a later verification track, reflecting Babuni.dev's desktop-first preference. Current control ceilings in code were doubled again to 1760 CSS px/s pointer and 520 CSS px/s keyboard; older historical roadmap figures remain as records of previous experiments.

**Shift-entry project stability (2026-10-26):** Babuni.dev saw a tile enter as one project and change name/color as it finished an autonomous shift, especially from the left. Pre-staging an entering tile's identity is now implemented with regression cases for four directions and simultaneous shifts. The fix is awaiting a full local test and Babuni.dev visual approval; do not mark live movement identity stability complete yet.

**One-time entrance animation (2026-10-26):** Babuni.dev requested a decorative clockwise reveal with a 373 ms growing animation per project, starting at BABUNI.DEV. The prototype uses a provisional 68 ms stagger, one-time initial-visible-tile animation, immediate interruption on navigation, and reduced-motion bypass. Added regression tests for order and timing; Babuni.dev visual acceptance and full local suite remain pending. This does not complete the mechanical identity/shift tests of Milestone 1.

**Prototype content update (2026-10-26):** 53 inventory candidates are now used as tile names (BABUNI.DEV plus 52 others), with provisional IDs, one-line summaries and source evidence for later work. The 45-tile centered desktop continues to use the existing spiral and reveal. Next confirm long-title legibility, no sudden identity swaps during shifts, and correctness of 53-name recycling. Final portal art/textures are deferred and optional by Babuni.dev preference; focus on functional milestones. This does not count as 53 fully verified portfolio entries, nor as completing Milestone 5's production content schema.

**Milestone 2 — first information-point prototype (2026-10-26):** Babuni.dev approved a glowing top square, revealing only a tiny category/topic when exploring the **portal region**, not the whole tile. The implementation adds a single compact bubble, 53 provisional topic labels and mouse/keyboard/touch triggers. The first-point behavior awaits browser/device acceptance and tests; four-point layout, automatic teaser, linger behavior and final art are still open. Topic keyword extraction from descriptions/devlogs is a later curation project, not yet implemented.

**Milestone 2 ambient topic prototype (2026-10-26):** Babuni.dev requested occasional gentle, unprompted glowing topic hints alongside on-demand portal bubbles. One-at-a-time randomized idle teasers are implemented; pacing and browser/device behavior await review.

**Milestone 3 initial small-bloom prototype (2026-10-26):** Babuni.dev directed: click any project tile → move the whole grid until it is centered → only then displace neighbors to clear a real adjacent square. The prototype uses a pinned logical source, 720 ms camera movement, a one-cell shift of the entire right-hand row segment, and one provisional summary module. Automatic shifting pauses while the bloom is open. Geometry tests authored; visual/keyboard/touch checks and further design iterations pending. This is not completion of Milestone 3.

The focus gate now distinguishes keyboard-visible focus from stale mouse/touch focus to avoid unnecessary indefinite suppression.


**Creator checkpoint — ambient feedback (2026-10-26):** The creator judged the small bloom's center-first camera motion and neighbor-cell displacement smooth, visually pleasing and deliberately arranged. The automatic mini-topics, however, were often missed or appeared at viewport corners. Implemented a provisional five-second hint cadence with short 600 ms retries across shifts, full-tile safe-area selection, and avoidance of suppression caused by passive viewport/stale pointer focus. Dedicated helper tests were added, but browser verification of the new hint frequency and placement is pending. No changes to the approved bloom timings.


**Milestone 3 — movement and selection priority refinement (2026-10-26):** Babuni.dev requested the living grid to keep shifting in nonconflicting rows/columns while a bloom is open; selecting a moving tile should immediately show a golden highlight and wait for the affected shift, while selecting an unrelated tile pauses that shift and begins centering immediately. Switching from one open bloom to another must close the first bloom and only then recenter/open the second. Implemented a prototype conflict filter protecting the selected row plus selected/module columns; other columns can cross the translated right-hand run with a coordinated sideways offset. Close-first switching and queued golden selection are implemented. Focused tests added; full browser/build verification and multi-module conflict safety remain pending.
