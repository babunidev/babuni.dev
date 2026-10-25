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
