# Development Journal — babuni.dev

This is an edited account of the development process, not a verbatim transcript or a record of completed software unless explicitly stated. Each entry should show **creator intention → AI proposal → creator response/decision → implementation and evidence**.

## 2026-10-24 — Retrospective: From portfolio to toy box

**Type:** Concept conversation reconstructed from the Babuni.dev project discussion.  
**Implementation:** None claimed.

**Creator direction.** The creator wanted a website for projects, images, files, concepts, embedded video, and development logs, hosted on a VPS using babuni.dev. A conventional blog felt too rigid. The preferred metaphor became a box of toys: visitors should feel free to pick things up, inspect them, set them aside, and discover unfinished as well as completed work.

**AI contribution.** The assistant initially recommended a project-oriented content architecture and later explored staged disclosure and navigational gestures.

**Iteration and creator decisions.** The creator preferred non-linear, initially busy discovery that became clearer through attention. Hovering a toy should give a clue; clicking it should open a first preview; selecting again should move deeper. Scroll-wheel-as-navigation was explored but rejected because it conflicted with ordinary reading. A conventional back route was kept for detailed content.

**Outcome.** A four-depth model emerged: grid, small bloom, full bloom, expanded content. This was an interaction specification, not an implementation.

## 2026-10-24 — Retrospective: Living rows and columns

**Creator direction.** Instead of arbitrary floating objects, the creator proposed a roughly 6 × 4 grid of squares, where entire rows or columns shift by one cell. The pace should be slow and smooth, like drifting stone plates.

**AI contribution.** The assistant clarified moving-line rules and asked about simultaneous moves and low-power alternatives.

**Creator decisions.** A round randomly chooses horizontal or vertical. Each eligible line rolls d20; a roll greater than ten succeeds. Initiative can bias earlier lines with +4, +3, +2, +1. Fading to a relocated position was suggested as a possible cheaper low-power presentation, to be tested rather than assumed faster.

**Outcome.** A rules-driven grid, with the detailed generalized algorithm left open.

## 2026-10-24–25 — Retrospective: Stone portal identity and bloom geometry

**Creator direction.** Each project should occupy a stylized stone tile with an engraved title and a recessed, colorful portal at its center. The creator moved away from detailed Aztec-inspired textures toward original, cleaner project-specific engravings. The four lights on the portal frame should spawn *informational* holographic bubbles, not buttons or shortcuts. Bubbles occasionally pop up independently, show individually on point hover, and collectively after lingering on the tile.

**AI contribution.** A sequence of visual concepts explored portal treatments, callouts, dense grids, and expanded projects. Some generated images mistakenly used bubbles as navigation or let the bloom float above tiles.

**Creator corrections and decisions.** A small bloom must **occupy actual neighboring tile cells** and cause those tiles to move; it is not merely an overlapping dashboard. The full bloom hides all other project tiles. The chosen tile remains as the center anchor; its portal can close the project. Media and text previews surround it in simpler frames.

**Outcome.** Stronger specification for cell-reserving bloom and contextual portal callouts. Visual mockups remain exploratory assets, not implementation references guaranteed pixel-perfect.

## 2026-10-25 — Retrospective: Deep viewing and image interaction

**Creator direction.** Small bloom should be a brief preview; full bloom a larger project-specific preview; individual modules lead to complete content. Long descriptions and dev logs use normal scrollable readers. Galleries should have a fixed-size prominent center image and freely moving neighbors; images exchange places smoothly. A separate control enables art-only fullscreen. Hovering among multiple videos could show a short video preview.

**AI contribution.** The assistant summarized four interaction depths and tested options for gallery movement.

**Outcome.** Media and document viewer requirements captured for prototyping. Video-preview specifics are not yet finalized.

## 2026-10-25 — Retrospective: No edges, no loading wall

**Creator direction.** The creator observed that a finite portfolio cannot infinitely fill a draggable screen. Tiles that exit one side should re-enter as buffer tiles on the opposite side. The visible field must always be covered, even on unusual screen sizes; repetition is permissible. The site should begin with one central tile and progressively materialize adjacent tiles. Offscreen cells should be ready for shifts, without loading every project body immediately.

**AI contribution.** The assistant identified a toroidal or recyclable grid model, recommended decoupling unique projects from rendered instances, and sketched progressive preloading.

**Outcome.** Infinite recycling and central-out loading became foundational prototype requirements, not later visual polish.

## 2026-10-25 — Retrospective: Development environment and source of truth

**Creator direction.** Development should be possible through cloud agents connected to GitHub, then pulled to Nobara Linux for local testing; local Ollama agents may be used later. The creator wants project history itself to become portfolio content.

**Actions reported by creator.** Public GitHub repository babunidev/babuni.dev was created and cloned. Node.js 24 and npm were installed; Astro 7.4.2 was initialized locally and served successfully at localhost:4321. New Astro files were staged, but the first local commit was initially blocked by missing Git author identity.

**Repository verification when preparing this journal.** The GitHub default branch contained the initial README and .gitignore; the local Astro files had not yet appeared remotely.

**Outcome.** Documentation-first workflow established, with cloud development and local test/pull as the intended model.

## 2026-10-25 — Documentation as the work, not paperwork

**Creator direction.** The creator requested high-quality concept, journal, changelog, decisions, design, architecture, and content documentation. Crucially, they required the journal to record *their involvement*: what they were trying to communicate to AI, what AI did with it, which decisions they made, and how that shaped the feature. Project-related conversations should inform the narrative, without requiring a verbatim transcript.

**AI contribution.** The assistant proposed separate documents and an attribution model: creator direction, agent proposal, decision, implementation, and verification.

**Action.** An initial public documentation baseline and copyable ChatGPT project instruction file were prepared on a separate GitHub branch so the creator's local Astro work would not be overwritten.

**Open.** Project-specific ChatGPT settings must be updated by the user in the ChatGPT UI; the Markdown file itself cannot enforce those settings. Future agents must use available conversations and explicitly provided sources, not pretend to possess a complete conversation archive.

## 2026-10-26 — Integrating local development and the public project record

**Creator direction.** After creating a repository and initializing Astro locally, the creator established a simple Git workflow: all active development belongs on `main`. They also insisted that the project documentation and Astro implementation coexist without discarding either set of agent rules.

**AI contribution.** The assistant originally prepared documentation in a separate branch and then moved it directly onto `main` at the creator's request. When the creator fetched remote changes and merged locally, Git reported an add/add conflict in `AGENTS.md`. The assistant proposed retaining the custom project rules from the remote version, appending the Astro starter's local development guidance, and revising the workflow rule to use `main`.

**Creator action and feedback.** The creator followed that reconciliation, staged `AGENTS.md`, committed the merge, and pushed it to GitHub. Their terminal reported commit `5902121` and a successful update to `origin/main`.

**Verification.** GitHub was checked afterward: `main` contains both `package.json` and `src/pages/index.astro`, plus the complete merged `AGENTS.md` and project documentation. The local Astro starter had previously started successfully according to the creator; no new post-merge build or browser verification was performed.

**Outcome.** The foundation is integrated and the next development target is the grid mechanics, not a finished visual site. A subsequent documentation-only update corrected stale instructions claiming that Astro was still local-only. Remaining independent setup: confirm ChatGPT project instructions in its user interface.

## 2026-10-26 — Reviewing the foundation before the grid

**Creator direction and source.** In the current review session, the creator asked the assistant to take a critical reviewer role, become familiar with the repository's structure and text, and record its contribution in the development documentation. The request was to examine the work already present, not to begin implementing the interactive portfolio.

**AI contribution.** The assistant reviewed `main` at `ea90117`, including the starter, dependency lockfile, creative specification, and collaboration rules. It found a consistent separation between intended behavior and implemented software. The actual site remained a single Astro starter page. The review identified missing README setup instructions, stale framework status in D-011, and two open verification gaps: no CI workflow and no dedicated Astro type-checking tool.

**Execution and evidence.** The assistant added a [dated review report](REVIEW-2026-10-26.md), documented local setup, and corrected current status in the decision register and architecture baseline. A text-source snapshot installed with lifecycle scripts disabled and built successfully with `npm run build`, producing one static page. Manifest/lockfile consistency and relative Markdown links passed inspection. Astro's CLI help confirmed the existing background-server guidance. The checker command requested missing dependencies, so no semantic type-check result is claimed. Browser and production verification were not performed.

**Historical clarification.** The earlier journal entry left ChatGPT project-instruction activation open. Milestone 0 and commit `ea90117` subsequently recorded it as confirmed; that earlier open item is resolved.

**Outcome and open proposals.** The starter has an independently observed build result, while its creative behavior remains unimplemented. The assistant recommended earlier CI and a dedicated checking command, and flagged the boundary between initial center-out appearance and interactive viewport coverage for future specification. These are AI recommendations, not newly approved creator decisions. No application code or creative direction changed.

---

## Future journal entry template

### YYYY-MM-DD — Descriptive heading

- **Scope / source:** Session, issue, conversation, PR or file reference; retrospective if reconstructed.
- **Creator direction:** What the human asked, the motivation, constraints, corrections.
- **AI proposal:** Options or interpretation introduced by an agent, clearly labeled.
- **Decision:** What the creator accepted, rejected, postponed; unresolved points.
- **Development activity:** Changed files, experiment details, obstacles.
- **Verification:** Test commands and observed results, or state **not tested**.
- **Outcome / next hypothesis:** What exists now and what remains.

Write in readable narrative prose, with evidence links where available. Do not invent exchanges, quotes, tests, or conclusions.

## 2026-10-26 — A centered anchor that can drift away

**Creator direction and correction.** The creator rejected a proposal that prioritized fitting rows and columns into the screen: the crucial visual requirement is one full tile exactly at the center, even on desktop and tablet. They approved the approximate density of a straight-down mosaic of stone tiles with no perspective. In the subsequent discussion, the creator asked for familiar map-like interaction: hold the mouse and pull, or move the grid with a thumb on mobile. When tiles leave the viewport, reuse those same loaded visual instances beyond the opposite edge to keep the field filled continuously.

**AI interpretation.** The assistant separated the initial screen-centered tile from a permanent fixed center. It proposed calculating neighboring cells from an integer coordinate system and translating the entire field with the pointer. A finite ring buffer reuses offscreen DOM tile elements; source project identities remain conceptually separate from those visual slots. The assistant supplied provisional 240/200/phone-relative CSS-pixel tile sizes and proposed two offscreen buffer bands.

**Development.** A first Astro/TypeScript prototype implements centered tiles, free pointer/touch dragging, bounded recycling, keyboard navigation, a reset control and temporary simple tile visuals. The prototype is intentionally not the final stone-tile art; row/column dice shifts and blooms have not been attempted.

**Verification.** Five unit tests for grid math passed locally, as did isolated Chromium checks for initial centering and pointer-drag coverage at 1920×1080, 768×1024 and 390×844. These tests used a compiled standalone preview, not a complete Astro production build. Physical mobile testing, actual production build verification and performance measurement remain open.

**Result.** The geometry and movement contract is represented in source, with the creator's initial-center correction preserved as a design decision rather than silently buried in code.
