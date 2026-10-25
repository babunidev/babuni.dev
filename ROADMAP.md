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
- [ ] Decide tile sizing and responsive visible-cell formula.
- [ ] Build a modest set of representative project tiles.
- [ ] Implement pointer/touch panning across an endless wrapping field.
- [ ] Recycle offscreen render instances without breaking project identity.
- [ ] Prove responsive coverage on phone, laptop, and wide desktop.
- [ ] Implement slow horizontal and vertical row/column shifts with repeatable seeded tests.
- [ ] Pause or defer conflicting moves during drag and bloom.
- [ ] Validate keyboard and reduced-motion alternatives.

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
