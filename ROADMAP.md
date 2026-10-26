# Development Roadmap

This is a plan, not a claim that features already exist. Move tasks only when supported by code, tests, or observed behavior.

## Milestone 0 — Repository and documentation
- [x] Create public GitHub repository babunidev/babuni.dev.
- [x] Clone repository locally.
- [x] Install Node.js and npm locally; Astro starter runs at localhost:4321 (reported by creator).
- [x] Commit and push Astro foundation to main (merge commit `5902121`, verified on GitHub).
- [x] Prepare initial project documentation baseline and publish it to main.
- [x] Reconcile and retain project agent rules and Astro guidance in AGENTS.md.
- [x] Record the creator's preference to work directly on main.
- [x] Activate babuni.dev ChatGPT project instructions (confirmed available in this ChatGPT project).

**Milestone 0 status:** Complete. Astro foundation, documentation, main-only workflow, and active ChatGPT project instructions are established.

## Milestone 1 — Mechanically correct grid
- [x] Decide initial tile sizing and center-first responsive visible-cell formula (creator-approved approximate scale; unit-tested).
- [x] Implement temporary representative tiles (not final stone assets or real projects).
- [x] Implement pointer-event mouse/touch dragging, keyboard pan, and reset (desktop pointer tested, real touch pending).
- [x] Implement bounded DOM tile recycling, keeping stable logical coordinates (unit tested and browser preview checked).
- [x] Prototype clockwise spiral-first project assignment with visibility-aware source identity recycling; fill the viewport by repeating the original project library when necessary. Ten pure-placement tests passed in isolation.
- [ ] Creator review of spiral order and project identity uniqueness while panning and during autonomous line shifts. The full Astro build and physical device checks remain outstanding.

**Creator's first desktop acceptance test (2026-10-26):** Local Astro 7.4.2 server returned the page successfully. On the creator's desktop, the centered BABUNI.DEV tile appeared correctly, mouse dragging felt smooth and appropriately paced, and the grid could be dragged indefinitely without encountering an edge. This verifies the manual desktop experience by user observation; physical phone/tablet, resizing, automated shift mechanics, and reduced-motion tests remain open.
- [ ] Prove responsive coverage on phone, laptop, and wide desktop.
- [x] Prototype slow one-cell row/column shifts with testable seeded dice rounds (timing and initiative mechanics provisional; creator review outstanding).
- [x] Pause an active autonomous shift while dragging, resume afterward and defer new rounds while dragging. Bloom-specific conflict handling awaits bloom implementation.
- [ ] Validate keyboard and reduced-motion alternatives. Frame-driven, slower keyboard movement and reduced-motion support are implemented, but await creator/device acceptance.

**Movement refinement (2026-10-26):** Creator requested smooth, slower arrow-key navigation; brief acceleration and an adjustable speed ceiling for mouse/touch dragging; and no two simultaneously shifting rows moving in the same direction. A matching restriction on columns is an AI-proposed extension, awaiting creator review. Initial controller and directional shift cap are implemented and tested in an isolated preview. New creator feedback is needed before locking speeds or declaring Milestone 1 complete.

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

Update CHANGELOG for implemented changes; DEVLOG for context and experiments; DECISIONS for durable choices; DESIGN/ARCHITECTURE/CONTENT as applicable; and ROADMAP as work changes. Distinguish creator requests, agent proposals, completed work, and evidence.

**Manual-speed iteration (2026-10-26):** The creator requested twice the current mouse/touch and arrow-key movement speed. Updated control limits are implemented (880 and 260 CSS px/s, with proportionally faster acceleration and deceleration). Actual browser feel and acceptance are pending.

**Speed tuning (2026-10-26):** The creator requested doubling the mouse/touch and arrow-key movement speeds. The new tuning is implemented (880 and 260 CSS px/s maximum respectively) with proportionally doubled acceleration/deceleration. Hands-on approval and fresh local tests remain pending.

**45-identity visual check (2026-10-26):** Added demo projects through PROJECT 45 and tests for uniqueness across all 45 cells initially visible at 1920×1080. Updated two stale control tests from the creator's preceding 28/30 run. Full post-change suite and visual inspection are pending.
