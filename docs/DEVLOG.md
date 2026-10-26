# Development Journal — babuni.dev

This is an edited account of the development process, not a verbatim transcript or a record of completed software unless explicitly stated. Each entry should show **Babuni.dev intention → AI proposal → Babuni.dev response/decision → implementation and evidence**.

## 2026-10-24 — Retrospective: From portfolio to toy box

**Type:** Concept conversation reconstructed from the Babuni.dev project discussion.  
**Implementation:** None claimed.

**Babuni.dev direction.** Babuni.dev wanted a website for projects, images, files, concepts, embedded video, and development logs, hosted on a VPS using babuni.dev. A conventional blog felt too rigid. The preferred metaphor became a box of toys: visitors should feel free to pick things up, inspect them, set them aside, and discover unfinished as well as completed work.

**AI contribution.** The assistant initially recommended a project-oriented content architecture and later explored staged disclosure and navigational gestures.

**Iteration and Babuni.dev decisions.** Babuni.dev preferred non-linear, initially busy discovery that became clearer through attention. Hovering a toy should give a clue; clicking it should open a first preview; selecting again should move deeper. Scroll-wheel-as-navigation was explored but rejected because it conflicted with ordinary reading. A conventional back route was kept for detailed content.

**Outcome.** A four-depth model emerged: grid, small bloom, full bloom, expanded content. This was an interaction specification, not an implementation.

## 2026-10-24 — Retrospective: Living rows and columns

**Babuni.dev direction.** Instead of arbitrary floating objects, Babuni.dev proposed a roughly 6 × 4 grid of squares, where entire rows or columns shift by one cell. The pace should be slow and smooth, like drifting stone plates.

**AI contribution.** The assistant clarified moving-line rules and asked about simultaneous moves and low-power alternatives.

**Babuni.dev decisions.** A round randomly chooses horizontal or vertical. Each eligible line rolls d20; a roll greater than ten succeeds. Initiative can bias earlier lines with +4, +3, +2, +1. Fading to a relocated position was suggested as a possible cheaper low-power presentation, to be tested rather than assumed faster.

**Outcome.** A rules-driven grid, with the detailed generalized algorithm left open.

## 2026-10-24–25 — Retrospective: Stone portal identity and bloom geometry

**Babuni.dev direction.** Each project should occupy a stylized stone tile with an engraved title and a recessed, colorful portal at its center. Babuni.dev moved away from detailed Aztec-inspired textures toward original, cleaner project-specific engravings. The four lights on the portal frame should spawn *informational* holographic bubbles, not buttons or shortcuts. Bubbles occasionally pop up independently, show individually on point hover, and collectively after lingering on the tile.

**AI contribution.** A sequence of visual concepts explored portal treatments, callouts, dense grids, and expanded projects. Some generated images mistakenly used bubbles as navigation or let the bloom float above tiles.

**Babuni.dev corrections and decisions.** A small bloom must **occupy actual neighboring tile cells** and cause those tiles to move; it is not merely an overlapping dashboard. The full bloom hides all other project tiles. The chosen tile remains as the center anchor; its portal can close the project. Media and text previews surround it in simpler frames.

**Outcome.** Stronger specification for cell-reserving bloom and contextual portal callouts. Visual mockups remain exploratory assets, not implementation references guaranteed pixel-perfect.

## 2026-10-25 — Retrospective: Deep viewing and image interaction

**Babuni.dev direction.** Small bloom should be a brief preview; full bloom a larger project-specific preview; individual modules lead to complete content. Long descriptions and dev logs use normal scrollable readers. Galleries should have a fixed-size prominent center image and freely moving neighbors; images exchange places smoothly. A separate control enables art-only fullscreen. Hovering among multiple videos could show a short video preview.

**AI contribution.** The assistant summarized four interaction depths and tested options for gallery movement.

**Outcome.** Media and document viewer requirements captured for prototyping. Video-preview specifics are not yet finalized.

## 2026-10-25 — Retrospective: No edges, no loading wall

**Babuni.dev direction.** Babuni.dev observed that a finite portfolio cannot infinitely fill a draggable screen. Tiles that exit one side should re-enter as buffer tiles on the opposite side. The visible field must always be covered, even on unusual screen sizes; repetition is permissible. The site should begin with one central tile and progressively materialize adjacent tiles. Offscreen cells should be ready for shifts, without loading every project body immediately.

**AI contribution.** The assistant identified a toroidal or recyclable grid model, recommended decoupling unique projects from rendered instances, and sketched progressive preloading.

**Outcome.** Infinite recycling and central-out loading became foundational prototype requirements, not later visual polish.

## 2026-10-25 — Retrospective: Development environment and source of truth

**Babuni.dev direction.** Development should be possible through cloud agents connected to GitHub, then pulled to Nobara Linux for local testing; local Ollama agents may be used later. Babuni.dev wants project history itself to become portfolio content.

**Actions reported by Babuni.dev.** Public GitHub repository babunidev/babuni.dev was created and cloned. Node.js 24 and npm were installed; Astro 7.4.2 was initialized locally and served successfully at localhost:4321. New Astro files were staged, but the first local commit was initially blocked by missing Git author identity.

**Repository verification when preparing this journal.** The GitHub default branch contained the initial README and .gitignore; the local Astro files had not yet appeared remotely.

**Outcome.** Documentation-first workflow established, with cloud development and local test/pull as the intended model.

## 2026-10-25 — Documentation as the work, not paperwork

**Babuni.dev direction.** Babuni.dev requested high-quality concept, journal, changelog, decisions, design, architecture, and content documentation. Crucially, they required the journal to record *their involvement*: what they were trying to communicate to AI, what AI did with it, which decisions they made, and how that shaped the feature. Project-related conversations should inform the narrative, without requiring a verbatim transcript.

**AI contribution.** The assistant proposed separate documents and an attribution model: Babuni.dev direction, agent proposal, decision, implementation, and verification.

**Action.** An initial public documentation baseline and copyable ChatGPT project instruction file were prepared on a separate GitHub branch so Babuni.dev's local Astro work would not be overwritten.

**Open.** Project-specific ChatGPT settings must be updated by the user in the ChatGPT UI; the Markdown file itself cannot enforce those settings. Future agents must use available conversations and explicitly provided sources, not pretend to possess a complete conversation archive.

## 2026-10-26 — Integrating local development and the public project record

**Babuni.dev direction.** After creating a repository and initializing Astro locally, Babuni.dev established a simple Git workflow: all active development belongs on `main`. They also insisted that the project documentation and Astro implementation coexist without discarding either set of agent rules.

**AI contribution.** The assistant originally prepared documentation in a separate branch and then moved it directly onto `main` at Babuni.dev's request. When Babuni.dev fetched remote changes and merged locally, Git reported an add/add conflict in `AGENTS.md`. The assistant proposed retaining the custom project rules from the remote version, appending the Astro starter's local development guidance, and revising the workflow rule to use `main`.

**Babuni.dev action and feedback.** Babuni.dev followed that reconciliation, staged `AGENTS.md`, committed the merge, and pushed it to GitHub. Their terminal reported commit `5902121` and a successful update to `origin/main`.

**Verification.** GitHub was checked afterward: `main` contains both `package.json` and `src/pages/index.astro`, plus the complete merged `AGENTS.md` and project documentation. The local Astro starter had previously started successfully according to Babuni.dev; no new post-merge build or browser verification was performed.

**Outcome.** The foundation is integrated and the next development target is the grid mechanics, not a finished visual site. A subsequent documentation-only update corrected stale instructions claiming that Astro was still local-only. Remaining independent setup: confirm ChatGPT project instructions in its user interface.

## 2026-10-26 — Reviewing the foundation before the grid

**Babuni.dev direction and source.** In the current review session, Babuni.dev asked the assistant to take a critical reviewer role, become familiar with the repository's structure and text, and record its contribution in the development documentation. The request was to examine the work already present, not to begin implementing the interactive portfolio.

**AI contribution.** The assistant reviewed `main` at `ea90117`, including the starter, dependency lockfile, creative specification, and collaboration rules. It found a consistent separation between intended behavior and implemented software. The actual site remained a single Astro starter page. The review identified missing README setup instructions, stale framework status in D-011, and two open verification gaps: no CI workflow and no dedicated Astro type-checking tool.

**Execution and evidence.** The assistant added a [dated review report](REVIEW-2026-10-26.md), documented local setup, and corrected current status in the decision register and architecture baseline. A text-source snapshot installed with lifecycle scripts disabled and built successfully with `npm run build`, producing one static page. Manifest/lockfile consistency and relative Markdown links passed inspection. Astro's CLI help confirmed the existing background-server guidance. The checker command requested missing dependencies, so no semantic type-check result is claimed. Browser and production verification were not performed.

**Historical clarification.** The earlier journal entry left ChatGPT project-instruction activation open. Milestone 0 and commit `ea90117` subsequently recorded it as confirmed; that earlier open item is resolved.

**Outcome and open proposals.** The starter has an independently observed build result, while its creative behavior remains unimplemented. The assistant recommended earlier CI and a dedicated checking command, and flagged the boundary between initial center-out appearance and interactive viewport coverage for future specification. These are AI recommendations, not newly approved Babuni.dev decisions. No application code or creative direction changed.

---

## Future journal entry template

### YYYY-MM-DD — Descriptive heading

- **Scope / source:** Session, issue, conversation, PR or file reference; retrospective if reconstructed.
- **Babuni.dev direction:** What the human asked, the motivation, constraints, corrections.
- **AI proposal:** Options or interpretation introduced by an agent, clearly labeled.
- **Decision:** What Babuni.dev accepted, rejected, postponed; unresolved points.
- **Development activity:** Changed files, experiment details, obstacles.
- **Verification:** Test commands and observed results, or state **not tested**.
- **Outcome / next hypothesis:** What exists now and what remains.

Write in readable narrative prose, with evidence links where available. Do not invent exchanges, quotes, tests, or conclusions.

## 2026-10-26 — A centered anchor that can drift away

**Babuni.dev direction and correction.** Babuni.dev rejected a proposal that prioritized fitting rows and columns into the screen: the crucial visual requirement is one full tile exactly at the center, even on desktop and tablet. They approved the approximate density of a straight-down mosaic of stone tiles with no perspective. In the subsequent discussion, Babuni.dev asked for familiar map-like interaction: hold the mouse and pull, or move the grid with a thumb on mobile. When tiles leave the viewport, reuse those same loaded visual instances beyond the opposite edge to keep the field filled continuously.

**AI interpretation.** The assistant separated the initial screen-centered tile from a permanent fixed center. It proposed calculating neighboring cells from an integer coordinate system and translating the entire field with the pointer. A finite ring buffer reuses offscreen DOM tile elements; source project identities remain conceptually separate from those visual slots. The assistant supplied provisional 240/200/phone-relative CSS-pixel tile sizes and proposed two offscreen buffer bands.

**Development.** A first Astro/TypeScript prototype implements centered tiles, free pointer/touch dragging, bounded recycling, keyboard navigation, a reset control and temporary simple tile visuals. The prototype is intentionally not the final stone-tile art; row/column dice shifts and blooms have not been attempted.

**Verification.** Five unit tests for grid math passed locally, as did isolated Chromium checks for initial centering and pointer-drag coverage at 1920×1080, 768×1024 and 390×844. These tests used a compiled standalone preview, not a complete Astro production build. Physical mobile testing, actual production build verification and performance measurement remain open.

**Result.** The geometry and movement contract is represented in source, with Babuni.dev's initial-center correction preserved as a design decision rather than silently buried in code.

## 2026-10-26 — First hands-on desktop test: the movement feels right

**Babuni.dev's verification.** After pulling the first grid implementation and running `npm ci`, Babuni.dev reported zero dependency vulnerabilities and all five grid-math tests passing. An old Astro development server was already running, so they stopped it and restarted Astro 7.4.2. The server reported readiness and a successful HTTP 200 response for the homepage.

**Experience and feedback.** Babuni.dev tested the new grid personally on their 1920×1080 desktop. They confirmed that the BABUNI.DEV tile starts at the exact center, that holding and dragging with the mouse moves the field smoothly in a map-like way, and that the field remains endlessly draggable. They briefly wondered whether movement might be too fast, then concluded it felt right, calling the experience “perfect” and “cool.” This is approval of the present manual-drag feel, not a request to change the speed.

**Potential refinement, not a final decision.** Babuni.dev observed that the temporary “Return to center” button could probably be removed later. Keep it for testing for now; its fate is not yet decided and no change to the interface was requested.

**Implementation and evidence.** No application code was altered in this feedback session. The assistant recorded Babuni.dev's first desktop acceptance results in the roadmap and decision history. Physical touch interaction, multi-device coverage, browser resizing, and autonomous row/column shifting still need separate verification.

**Outcome.** Basic desktop panning, initial centering, and visible endlessness have passed Babuni.dev review. This provides a usable interaction baseline for subsequent shifting-grid experiments.

## 2026-10-26 — The first independently shifting stone lines

**Babuni.dev direction.** Following successful hands-on desktop tests of the endless draggable grid, Babuni.dev approved moving to the next part of Milestone 1. They wanted the grid to begin moving autonomously by rows and columns, but did not want to lose the map-like dragging experience they had already praised. Babuni.dev also asked whether the development website could be reached from their phone on the same Wi-Fi, suggesting practical mobile checks while continuing desktop-first development.

**AI contribution.** The assistant explained that the Astro dev server can bind to the PC's LAN interface, allowing a phone on the same Wi-Fi to visit the PC's local IP at port 4321. This is an available test workflow, not a claim that Babuni.dev has already performed it. The assistant then separated the mechanical movement rules from the visual renderer: rounds randomly select an axis; visible lines roll d20 in randomized initiative order; winning lines travel one grid cell in an independently selected direction. Timings and dice bonuses remain tunable experiments.

**Implementation.** A new TypeScript helper models ordered row/column shift events and preserves project identities even when horizontal and vertical operations alternate. The tile renderer animates those line movements in the existing finite pool, freezes them during mouse/touch dragging and inactive browser tabs, and resumes from the same animation progress afterward. Reduced-motion preference suppresses the autonomous movement. The temporary grid artwork and reset button remain unchanged.

**Verification.** The assistant passed five additional Node tests, including seeded repeatability and mixed-axis identity, alongside the original five geometry tests. A strict TypeScript check passed. Isolated Chromium previews were checked at desktop and phone-sized viewports, covering movement, frozen animation during manual dragging, no expanding DOM pool, and reduced-motion suppression. This is not yet an independently verified post-commit Astro production build or hands-on phone test.

**Outcome and open questions.** The autonomous system is ready for Babuni.dev's review of how it looks and feels. The precise animation cadence, movement directions, initiative bias and amount of simultaneous shifting must be accepted or refined after observation.

## 2026-10-26 — Restraint in movement: individual stone lines rather than marching blocks

**Babuni.dev observation and correction.** In the first hands-on experiments with autonomous shifting, Babuni.dev noticed that when several rows slid together in the same direction they visually fused into one large block. That felt wrong for the individually animated stone grid. They introduced a new constraint: no two rows should move the same direction at the same time. In a separate motion refinement, they asked for arrow keys to become dramatically slower and smooth, and suggested that dragging should briefly accelerate into a controllable cruising speed rather than following unlimited mouse speed.

**AI interpretation and experiments.** The assistant preserved the existing d20/initiative eligibility system but proposed letting the earliest successful line claim the direction for that round. It extended the rule to columns so upward/downward block formation could be avoided as well; that extrapolation was not explicitly confirmed by Babuni.dev. A separate controller was designed to replace abrupt arrow-key steps with frame-based velocity, easing toward configurable limits. Pointer-follow uses a small buffered lead, acceleration, a maximum speed and an immediate stop when the button or finger is released. Prototype values were selected for testing, not presented as locked aesthetic decisions.

**Development and verification.** The assistant prepared updates to `src/lib/grid-controls.ts`, `src/scripts/grid.ts`, `src/lib/grid-shifts.ts` and associated tests. In an isolated local test fixture, an equivalent revision passed 18 Node tests and strict TypeScript checks. Desktop and phone-sized Chromium tests exercised capped pointer speed, held-arrow velocity, autonomous shift pause/resume, finite visual pool size, and reduced-motion behavior. These isolated results do not replace a build of the newly committed Astro source or Babuni.dev's practical assessment of feel.

**Visual history as a future input.** Babuni.dev also planned to add screenshots and videos in a folder called `Visual Documentation Material` so that future documentation can show what the interface actually looked like and how it evolved. No media were provided during this implementation; the intention was recorded without inventing assets or public-use approval.

**Outcome.** The new movement limits are implemented as a testable iteration. Babuni.dev's judgment of the speed, acceleration, and whether the columns should obey the same restriction remains the next decision point.

## 2026-10-26 — A failed test reveals a blind spot in the test itself

**Babuni.dev verification.** Babuni.dev pulled commit `e569a1f` and ran `npm run test:grid` on Nobara Linux. Eighteen tests passed, while the new test claiming coverage of both row and column shifting failed. It expected the generated rounds to include both axes, but its observed set contained only `row`.

**AI diagnosis.** The new motion restriction was not shown to be broken. The test drove `planShiftRound` with the first output of a deterministic linear-congruential random generator for seeds 0 through 399. That narrow consecutive seed range always yielded a first value below 0.5, selecting the row axis. The test assumed a distribution that its chosen seeds did not provide, so it never examined column rounds.

**Correction.** The assistant amended the test to inject a controlled first random value that explicitly selects the axis. The remaining draws still come from the reproducible seeded generator, preserving real variation in initiative, die rolls and direction. The no-same-direction and earliest-successful-initiative assertions now run across both axes independently.

**Verification and outcome.** An isolated local Node test confirmed the corrected axis-selection coverage passes. Only test source and documentation were changed; no application behavior or shift rule was modified. A full test-suite run on Babuni.dev's newly pulled revision is still needed. This false alarm is recorded because it shows how inadequate test inputs can leave a critical branch untested.

## 2026-10-26 — Corrected movement test suite verified on Babuni.dev's PC

**Babuni.dev action and verification.** Babuni.dev fast-forwarded local `main` from `e569a1f` to `eef55d0` and reran `npm run test:grid` on Nobara Linux. The terminal reported **19 tests passed, 0 failed**, including separate row/column direction exclusivity and initiative priority. This confirms that the previously failing assertion has been corrected in the full local test suite.

**Implementation.** No application behavior changed in this verification session. The assistant recorded the observed result on `main` as part of the project history.

**Still open.** Automated test success does not establish whether Babuni.dev likes the revised mouse acceleration, arrow-key navigation, or line-shifting appearance. Those behaviors still require visual/hands-on review; mobile touch remains separately unverified.

## 2026-10-26 — A faster tempo for manual exploration

**Babuni.dev direction.** After exploring the configurable values in the GitHub control file, Babuni.dev requested double the current movement speed. They also established a practical handoff preference: after repository updates, always provide the commands to pull GitHub changes, stop the existing Astro server, and start a new one.

**AI contribution and implementation.** The assistant doubled mouse/touch speed from 440 to 880 CSS px/s and arrow-key speed from 130 to 260 CSS px/s. It also doubled pointer acceleration (1800 to 3600 CSS px/s²), keyboard acceleration (520 to 1040 CSS px/s²), and keyboard deceleration (700 to 1400 CSS px/s²) to maintain the previous acceleration and slowing durations. The 180 CSS px cursor-lead limit and autonomous row/column shifting were left unchanged. A regression test checks the exact new configuration.

**Verification and open work.** This was a targeted numerical tuning change, not a redesign of grid movement. Babuni.dev has not yet tested the faster feel in the browser; the new full Node test suite and Astro build also require a local run. The startup sequence is documented for future testing handoffs.

## 2026-10-26 — Doubling the tempo of manual exploration

**Babuni.dev direction.** After reviewing the movement configuration, Babuni.dev asked for double the current speed. They also requested a repeatable testing handoff: after pulling a change from GitHub, stop the existing Astro development server and start a new one.

**AI contribution and implementation.** The assistant changed the maximum mouse/touch speed from 440 to 880 CSS px/s and the held-arrow speed from 130 to 260 CSS px/s. To preserve approximately the same ramp duration, pointer acceleration increased from 1800 to 3600 CSS px/s², keyboard acceleration from 520 to 1040 CSS px/s², and keyboard deceleration from 700 to 1400 CSS px/s². The 180 CSS px pointer-lag limit and autonomous line-shift settings were deliberately unchanged. A new test asserts those exact tuning values.

**Verification and open work.** This is an implemented numeric tuning change; Babuni.dev has not yet tried the faster version. The updated full Node test suite and Astro application still need to be run on Babuni.dev's PC. The documentation records the full pull–stop–start handoff sequence for subsequent tests.

## 2026-10-26 — From tiled wallpaper to a spiral of recognizable projects

**Babuni.dev observation.** While exploring the prototype, Babuni.dev noticed that the visual grid behaved as an endless surface but project identity did not behave as they had imagined. The BABUNI.DEV project started in the center yet did not turn up again after roaming. Multiple other project labels recurred side by side. This did not feel like exploring a collection of objects; it felt like a random repeated wallpaper.

**Babuni.dev's spatial design.** Babuni.dev specified a precise clockwise progression: BABUNI.DEV in the center, PROJECT 02 above, PROJECT 03 upper-right, PROJECT 04 right, PROJECT 05 lower-right, PROJECT 06 below, PROJECT 07 lower-left, PROJECT 08 left, PROJECT 09 upper-left. PROJECT 10 starts the outer spiral above the center. Projects should not be recycled while still on-screen, and a two-tile offscreen grace band was proposed before moving an instance to the entering edge. Babuni.dev wanted all projects treated as genuine reusable content, not duplicated arbitrarily by coordinate.

**AI diagnosis and question.** The assistant inspected `src/scripts/grid.ts` and found a finite DOM recycling ring working separately from a coordinate-hash placeholder selector; the latter caused visible duplicates even when they need not exist and privileged BABUNI.DEV only at its original source coordinate. The assistant initially offered either additional distinct placeholders or neutral stone filler when there are fewer real project identities than visible tile cells, highlighting that the strict no-duplicate constraint is mathematically impossible without at least as many projects as visible cells.

**Babuni.dev clarification, decisive for implementation.** Babuni.dev rejected filler, even with only five projects. The full screen must remain filled; project identities should be placed one by one in a center-out spiral and then repeated as necessary. Avoid duplicates in the current visible viewport **once enough originals exist to fill it**. The two-cell offscreen delay remains desirable, but may have to yield when just enough distinct projects are available to avoid visible duplicates.

**AI implementation.** A new pure `ProjectPlacement` module computes a clockwise spiral index and maintains project-to-original-cell reservations across camera panning and the existing line-shift source mapping. Incoming visible cells receive unused identities preferentially; offscreen assignments are retained within two cells and reclaimed beyond the band. Repeats continue to use real project records rather than blank or neutral filler. The renderer now synchronizes project reservations at visible-cell window changes and after completed shifts. The numbered sample list is 02–13 plus BABUNI.DEV.

**Verification and remaining uncertainty.** Ten isolated Node tests pass for spiral order, five-project repetition, uniqueness with at least as many projects as visible cells, offscreen retention, returning within the buffer, partial tile entry at either screen edge, mobile/desktop simulated viewport movement and synthetic shift-source preservation. These tests do not yet establish full browser correctness at pan speed, slow-shift transitions, resizing, or on physical phone hardware. Babuni.dev has not reviewed the new placement visually. The earlier concept of an endless tactile grid is preserved while the meaning of reuse is brought closer to Babuni.dev's intent.

## 2026-10-26 — 45 original demo identities to fill a desktop view

**Babuni.dev direction:** Expand the temporary project set to 45 so Babuni.dev can check that the spiral fills the desktop without repeating identities when there are enough available. Babuni.dev supplied a local test run reporting 28/30 passes; all spiral tests passed and only the older manual-motion tests failed.

**AI implementation:** Preserve the spiral assignment algorithm and grid controls. Split placeholder identities into a small pure catalog comprising BABUNI.DEV plus PROJECT 02–45. Preserve the original twelve demo colors and generate additional sample hues. Add tests proving the catalog contains 45 different names and that the centered 1920×1080 viewport initially shows 45 different source assignments.

**Test failure correction:** The two previously failing control tests did not reflect Babuni.dev's subsequent doubling of speed or the 180px cursor-lead braking constraint. The assertions now check the latest requested settings, acceleration under ordinary lead, and maximum reachability under deliberately sufficient lead. No application motion values were changed.

**Open:** A camera offset can show more than 45 partly visible tiles; such views must still repeat. Fresh local test results and Babuni.dev visual acceptance of the 45-project layout are outstanding.

## 2026-10-26 — The 45-project spiral looks right; choosing the next milestone

**Babuni.dev feedback.** After the 45-identity demonstration was published, Babuni.dev reported that the result looked fantastic and asked whether Milestone 1 was complete or whether important steps remained before moving to the next feature. This is an explicit positive visual response to the initial spiral presentation, not proof of an exhaustive no-duplicate guarantee during prolonged panning or autonomous shifts.

**AI review and recommendation.** The assistant checked the current GitHub roadmap against the implementation history. The grid foundation now exists and the centered 45-project layout has received Babuni.dev approval, but several verification steps remain: running the full tests and Astro build on the latest commit, examining stable identities during autonomous line shifts, checking keyboard/reduced-motion alternatives, and eventual phone, resize and long-session performance checks. The proposed sequence is a focused desktop smoke test, followed by beginning Milestone 2 with a single reusable engraved-stone portal tile. Physical mobile testing should not block desktop-first creative development; it remains an open release requirement.

**Decision status.** Babuni.dev has approved the look of the current 45-project spiral. They have not yet selected or approved a specific stone art implementation in this discussion. No site code, assets or acceptance tests were changed in this documentation-only entry.

## 2026-10-26 — Catching a project changing its identity mid-shift

**Babuni.dev observation.** With the 45-project arrangement visually approved, Babuni.dev spotted an intermittent problem during slow autonomous movement. A tile arriving from the left could enter as one numbered/color-coded project and then abruptly become a different project at the end of the movement. They also suspected a related bottom-to-top edge case and noted that right-to-left entry had looked stable so far. This is Babuni.dev-supplied visual evidence, not yet independently reproduced by a browser recording.

**AI investigation.** The renderer shifts a row or column using CSS transforms while project assignments stay at their pre-shift source coordinates. At the end, it commits a history entry, recomputes source positions and invokes the visibility-aware allocator. Because the offscreen entering tile may already have a placeholder or recycled project identity that conflicts with the resting visible collection, that final allocation can change the arriving tile's name and portal color in a single frame. The asymmetry is credible because the identities reserved along each viewport edge need not be identical.

**Implementation.** Added `ProjectPlacement.stageEntrances`, which reserves a final identity for each incoming offscreen tile *before* a row or column starts moving. The renderer determines the entering source at the leading edge and the departing source at the opposite edge, stages the project allocation, and updates the still-offscreen tile before its animation begins. When there is enough identity inventory, it preserves a currently safe incoming project; otherwise it uses the identity freed by the outgoing tile. Existing visible tiles are not renamed during staging. The previously implemented source-history resolver remains responsible for which physical tile occupies each logical cell at rest.

**Trade-off and verification.** With exactly as many identities as resting visible cells, the beginning/end of a slow shift may briefly expose one additional partial tile, so strictly zero transient duplicates is not always mathematically possible. The stronger rule is stable identity for every moving tile, with no duplicates at rest when inventory suffices. Regression tests were added for both directions on both axes, and for opposite-moving lines. A fresh local suite and actual desktop observation are still required. Neither manual pan speeds nor the d20/timing mechanics were changed.


## 2026-10-26 — Recovering the larger body of work for future exhibits

**Babuni.dev direction.** While collecting potential babuni.dev projects, Babuni.dev challenged the first inventory for omitting major original works including Morkahja, Ethera and Analubia, as well as small game-design experiments. They directed a much deeper investigation, asked for concise descriptions ordered roughly by recent activity, then requested that the resulting collection be placed in a suitable part of the babuni.dev GitHub repository as a *memory* that could be useful for prototypes.

**AI contribution and correction.** The AI initially over-relied on current conversational summaries and underrepresented earlier game development. A broader search of available conversation files and the connected GitHub account found 38 accessible repositories and recovered documentation for numerous small addons, creative automations, a talent-design atlas, the Button Game, and the Ethera/Morkahja relationship. It reconstructed a list of 53 **candidate** entries, some being variants, collections, or technical experiments rather than standalone releases.

**Babuni.dev decision.** Preserve the collection in the repository as a reference for future prototyping. No decision was made to publish all entries as live portfolio exhibits or to declare them fully verified.

**Implementation.** Created [PROJECT_INVENTORY.md](PROJECT_INVENTORY.md) and linked it from README.md. It records source quality, provisional ordering, relationships and verification requirements. No actual project records, portal artwork, site UI, or game code were altered.

**Verification and limitations.** GitHub accepted the documentation changes. The list was not cross-checked against every historical conversation, original project asset, release, or runnable application. Several older names and dates remain uncertain. This is a publication-safe summary, not a raw chat archive.

## 2026-10-26 — A spiral that reveals itself, rather than appearing at once

**Babuni.dev direction.** After approving the visual layout of 45 unique demo projects and while checking the movement mechanics, Babuni.dev observed that the entire website appears almost instantaneously. They proposed a deliberately theatrical entrance instead of an actual loading screen: BABUNI.DEV should materialize first, then numbered projects in clockwise spiral order, each growing into its allotted cell. They suggested **373 milliseconds** as the animation duration for each individual tile.

**AI design choice.** Implement this as a purely visual entrance. No artificial network delay, loader progress, deferred content creation or additional libraries are needed. The assistant selected a provisional **68 ms interval** between tile starts; at 45 projects the last one finishes around 3.37 seconds after the first. The first frame begins scaled down and invisible, grows slightly beyond final size, then settles. The visual treatment uses the existing temporary tile art and can later be re-tuned as the engraved stone design evolves. The duration comes from Babuni.dev; the stagger, growth curve and slight overshoot are assistant choices still subject to their visual review.

**Implementation.** A pure `introSequence` sorter uses the established clockwise spiral coordinate index, so the DOM pool's row-major arrangement does not change the reveal order. After the initial viewport is populated with its final project identities, only visible tile faces receive CSS animations and individual delays. The parent tile remains free for autonomous row/column transforms. The sequence happens once per page load and not whenever a tile's DOM instance is recycled. A same-size resize-observer callback no longer reconstructs the initial pool. Manual navigation, Home/reset, real resizing, and starting an autonomous shift clear any remaining entrance animations immediately. Users with reduced-motion preference see all tiles without animation, including if that preference is enabled mid-sequence.

**Verification and open decisions.** Tests for exact duration, stagger, clockwise ordering and 45-demo identity order were added to the repository; a full local suite and browser test are still required. Babuni.dev has not yet approved the entrance pacing, slight overshoot or the choice to cancel on interaction. The previously reported shift-boundary identity issue is a separate fix and still awaits Babuni.dev confirmation.

## 2026-10-26 — Fifty-three actual project names enter the spiral

**Babuni.dev direction.** A separate project-research session recovered a provisional list of 53 works and ideas, including small games, addons, AI tools, older fantasy projects, worldbuilding and concepts. Babuni.dev expressly approved using all 53 names **for visuals, play and evaluation of the grid**. BABUNI.DEV stays at the center, and the current spiral movement should remain untouched. They also emphasized that final portal artwork is not necessarily an imminent deliverable: changing decorative textures can wait, possibly indefinitely, while functional milestones are developed.

**Source and boundaries.** The inventory at `docs/PROJECT_INVENTORY.md` was collected by another assistant from varied evidence with differing confidence. The entries range from GitHub-described repositories to conversation-only concepts and name-only leads. Some are versions of other works, not separate finished products. Babuni.dev has approved prototype use, **not public exhibition of these as finished project pages or validation of their status**. Titles, descriptions and their initial ordering are imported provisionally, with the inventory retained as provenance rather than inventing additional facts. No private conversations, screenshots or third-party game art were imported.

**AI implementation.** The renderer's existing `demoProjects` collection now contains 53 uniquely keyed candidates, with a title, one-line summary, original evidence classification and a temporary decorative tint. The BABUNI.DEV tile remains visually uppercase and first in the spiral; Button Game comes immediately above it, then SocialForever upper-right. The one-line descriptions are stored for future information bubbles but aren't yet presented as a new interface. The existing tile face receives minor title-wrapping adjustments so long real project names do not overflow like the old short labels. The 373 ms clockwise entrance, pan, recycling and moving-row/column mechanics are unchanged. Catalog tests check the count, distinctness, representative names and summaries, and initial 45-visible-tile uniqueness.

**Creative decision and open work.** The colored portals remain temporary visuals and functional development takes priority over final textures; this is not a decision to abandon all future visual design. Next evaluate how real project names affect readability and whether the existing motion and entrance sequence still feel right. The full test suite, Astro build and Babuni.dev browser inspection on this commit remain open.

## 2026-10-26 — A tiny flavored glimpse from the top portal marker

**Babuni.dev direction:** The small square already situated above the circular portal should glow and produce the first information bubble. Babuni.dev specifically rejected a sales-like or paragraph-length explanation: this first bubble should give only a **category, topic, or tiny piece of flavor** that helps an attentive visitor sense what the project might concern. The reaction should be triggered by entering the portal area **inside a tile**, not by hovering anywhere over the stone. A more considered collection of descriptive keywords might eventually be curated from full project descriptions, development journals, and other source material; Babuni.dev has not settled on a permanent extraction/filtering methodology.

**AI interpretation and prototype implementation:** Introduced a single short, static provisional topic for each of the 53 inventory candidates. The AI selected broad, non-promotional labels from their available one-line descriptions. These are assistant-authored draft topics, **not approved taxonomy or verified content**. Added a glowing state to the existing top diamond/square and a minimal translucent tooltip that stays physically inside the tile. Rather than adding a wholly new hover area, the existing circular portal is now a focusable hit target. Hovering the portal shows its associated topic; keyboard focus offers an equivalent; a tap without appreciable drag can reveal or dismiss it. A genuine drag keeps controlling the grid instead of opening a bubble. At most one tile shows a bubble; the state is cleared if its visual tile is recycled, reassigned or shifted.

**Implementation and accessibility:** The UI exposes only on-screen portal controls to tab navigation, and assigns a spoken name containing the candidate and topic. Offscreen buffered tiles remain hidden from assistive technology. The prototype bubble does not attempt to reserve neighboring cells (that belongs to later bloom mechanics), nor does it include an automatic teaser, four info points or full descriptions yet. The current stone, colored circular portal, spiral entrance, autonomous shifts, and manual speeds remain intact.

**Verification, alternatives, and openness:** All 53 draft topic labels were checked against the provisional inventory list for a one-to-one mapping and bounded length; an isolated Node test was added. Full `npm run test:grid`, a production Astro build, and hands-on hover/touch/keyboard verification are pending. The bubble's shape, glow intensity, positioning, categories and tap persistence are implementation experiments subject to Babuni.dev feedback. No claim of final taxonomy or complete Milestone 2 is made.

## 2026-10-26 — Center first, then let the grid make room

**Babuni.dev direction.** Babuni.dev corrected the proposed selection interaction: selecting a tile **anywhere** must first move the *whole grid* until that exact project is centered. **Only then** should a neighbor move to make room for a partial bloom. They also revived an earlier idea of spontaneous, subtle topic bubbles appearing occasionally at existing glowing portal markers.

**AI implementation.** A first-stage eased camera move (provisional 720 ms) targets the source cell's exact viewport center. The choice holds both original logical coordinates and project identity, not a DOM slot, and the allocator gives it priority while panning/recycling. Next, the contiguous half-row to its right is translated one cell (provisional 520 ms), creating an actually empty neighboring square rather than drawing a popover over an occupied tile. The first module displays the existing one-line project summary. The portal keeps its small topic-only interaction, separate from stone selection. Escape, a Close button, or clicking the selected stone collapses the bloom.

**Motion trade-off.** Active autonomous shifts finish before centering. New shifts and manual pan are suspended during this first bloom prototype to protect reserved cells; later collision-safe slower motion remains a design goal. The assistant chose the right-hand side, durations, one-module content and temporary focus-mode movement rules; Babuni.dev has not yet approved those details.

**Ambient flavor.** At randomized 6.5–10.5 s intervals, an idle grid can reveal one existing tiny topic bubble for 1.7 s. This is one at a time and does not interrupt active hover/focus/tap, dragging, shifting, selected projects, the entrance sequence, hidden tabs or reduced-motion use. The intervals and duration are assistant experiments, not fixed creative canon.

**Verification.** Pure helper tests for exact recentering, non-overlapping row displacement and hint cadence have been authored, along with a selected-identity regression test. Browser behavior and the full suite still need running. No new external dependencies or finished stone/portal assets were introduced.

The implementation additionally limits focus suppression to keyboard-visible focus rather than stale mouse/touch focus: clicking a portal can leave the browser's activeElement on its button even after the visitor stops interacting. This distinction is relevant to the creator's observation that tapping away and back seemed to change whether hints appeared.


## 2026-10-26 — Ambient hints that can actually be noticed

**Creator feedback.** The creator found the center-first project selection and neighboring-cell bloom smooth, pretty and deliberate. They did not reliably see the spontaneous little topic hints: sometimes nothing appeared for a long time, occasionally one was near a corner, and tapping away/back seemed to change whether hints resumed. They suggested a hint around every five seconds, on a genuinely onscreen tile.

**AI diagnosis.** The prior 6.5–10.5-second attempt was silently skipped during a 4.4-second row/column shift, followed by another full random delay. Repeated shifts could therefore create large gaps. Eligible tiles included partly visible fragments at screen edges. Passive focus on the viewport, or stale browser focus on a portal button following mouse/touch input, could also block hints without ongoing user activity.

**AI change.** The due timestamp now advances five seconds after a successful teaser; a blocked or empty-candidate attempt retries after 600 milliseconds without restarting the five-second wait. Candidate tiles must fit fully within the actual transformed viewport, with additional clearance from corners and the header and footer controls. A project-control focus blocks only when keyboard-visible; the viewport itself does not suppress passive viewing. The preceding project's identity is excluded when another suitable tile exists. One tiny topic stays visible 1.7 seconds at most; selection, bloom, manual interaction, line shifting, hidden tabs and reduced-motion settings still take priority.

**Verification.** Focused tests were updated for cadence, busy retries, desktop edge rejection and phone geometry. Full local suite, production build, and creator visual confirmation of the revised hints remain pending. The existing center-and-bloom animations were not changed.


## 2026-10-26 — A selected project does not stop the living world

**Babuni.dev direction.** After accepting the center-first bloom and the improved spontaneous topic hints, Babuni.dev noticed that selecting any project froze all autonomous motion. This broke the intended independence of the living grid. They also described how a selection made during a shift should behave: the click should immediately mark the tile golden, even if it must wait for its *own* moving row or column to finish. A tile unaffected by a different shifting line should instead proceed with centering immediately while that irrelevant shift pauses, just like map dragging. When switching from one open project to another, the old bloom must close and return its neighbors before the camera moves to the new project. Their central principle was visitor control without sacrificing safe movement in the rest of the grid.

**AI inspection.** The prototype's shift scheduler returned without rescheduling when a selection was active. Every click during a `moving` state was also queued indiscriminately, regardless of which line the selected tile occupied. The pending choice had no golden highlight until it became an active selection. Bloom CSS transitions were attached broadly to every tile, which could make independent shifts lag.

**Design iteration.** The assistant first considered protecting the selected row plus the entire right-hand translated run, which would have needlessly disabled most columns to the right. That conservative approach was **not adopted as the final change**. A better solution maps the vertical movement of a column through the displaced row: while entering the translated row, a tile gradually gains a one-cell sideways offset; while leaving, it sheds the offset. The endpoints match the established bloom geometry. This permits other columns on both sides to shift, excluding the selected column and its immediately adjacent module column. The selected row remains protected. These exact protected-line and interpolation rules are provisional AI implementation choices, not explicit creator specifications.

**Implementation.** A small pure selection-arbitration helper distinguishes a moving selected row/column or the right-adjacent reservation column from an unrelated shift. Affected clicks mark the original project source golden immediately and wait for that current shift's `ShiftEvent` to finish before centering. Unaffected clicks temporarily pause the ongoing motion, center the selected source, open the module, then resume the shift. Autonomous dice rounds continue scheduling around an open bloom, filtering only the protected lines. A new click during an open bloom first collapses the old neighboring row (520 ms); the new destination is already golden during that transition, and only then begins the next center-and-bloom sequence. Requests during a closing transition update the queued destination.

**Visual and safety details.** `paintMovement` composes column shifts with a reversible sideways bloom offset when traversing the displaced row, rather than letting the right side snap to a new x-coordinate on completion. Bloom-specific CSS transitions are limited to displaced or returning tiles; an active line shift does not inherit those short easing rules. Portal topic bubbles, project summaries, keyboard Escape, reduced-motion accommodations and the existing 53 source records remain in place.

**Verification and open questions.** Static tests check arbitration, protected lines, far-right column permissions and matching incoming/outgoing horizontal offsets at both motion endpoints. The current implementation has not yet been run through the full local Node/Astro suite or confirmed in a browser with simultaneous shifts, project switching or touchscreen gestures. Future collision handling for multi-module blooms and complex overlapping reservations remains open. This entry distinguishes confirmed creator direction from the assistant's implementation choices and does not claim final acceptance.

**Follow-up correction within the same implementation:** A paused vertical shift can still hold a sideways bloom offset when the visitor closes or switches projects. The close animation now pauses that background movement, returns the affected tiles to their ordinary column positions over the bloom-closing duration while keeping their vertical progress, and then either resumes the shift or starts the next requested selection. This is implemented but awaits browser verification.


## 2026-10-26 — Three small lights, and life around a bloom

**Babuni.dev's direction.** After seeing the more reliable ambient hints and the small bloom, Babuni.dev approved the experience but noticed that hints stopped once any project bloomed. They wanted the same subtle information sparks to keep appearing on the surrounding grid, even while studying an open small bloom. They also proposed placing another tiny glowing square to the *left* of the circular portal and another to its *right*, joining the original square above: **three little bubbles on each tile**. This revises the original four-point sketch. The intent remains experiential flavor rather than selling or packing paragraphs into the grid. Babuni.dev also asked to see the next roadmap entries after the change.

**AI implementation choices.** The assistant retained the existing top topic/category and hand-curated two additional, very short, provisional snippets for each of the 53 inventoried candidate projects, using their repository inventory's one-line descriptions as the available evidence. For example, Button Game has the draft labels “Reaction game”, “Android game” and “Local multiplayer”. Unknown historical or name-only projects get explicitly exploratory labels rather than invented achievements. These new labels are proposed editorial copy, **not independently verified project metadata or approved final descriptions**.

**Interaction refinement.** Hovering, focusing or tapping the **portal region** reveals all three small markers and labels inside that same tile; the rest of the stone remains the selection target. The visual layout uses the previously approved top marker plus two new square markers alongside the portal. For spontaneous hints, only *one* marker on *one* tile lights at a time, with the point changing between successive appearances to let different details emerge over time. Ambient hints no longer treat the open small bloom itself as a blocking state: after its entrance completes, the same approximate five-second scheduler may reveal a topic on another fully visible tile. The selected project, bloom's reserved row, actively moving row/column tiles, active focus/navigation, opening/closing transitions, hidden tabs and reduced-motion preferences are excluded from unsolicited activation. Autonomous shifting and centering algorithms remain unchanged.

**Concept change and provenance.** The original reference described four contextual lights. The three-point arrangement is Babuni.dev's later explicit direction. The concept, active roadmap and design specification are revised while the superseded four-point proposal remains visible in the decision record; this preserves the real history of the design rather than retroactively attributing three lights to the original concept. A fourth point is not required for the current prototype, though future exploration remains possible.

**Verification and open questions.** Pure tests were authored for the 53 three-point mappings, brevity and nonrepetition of ambient marker selection. The GitHub commit records the implementation; the complete local Node suite, Astro build, actual desktop appearance, touch layout and reduced-motion checks have **not yet been independently run**. The creator's visual approval is for the prior single-point system and recent bloom behavior, not yet the three-point arrangement.

## 2026-10-26 — Straight columns through an open bloom

**Context and source:** Current explicit implementation request and bounded retrieved babunidev1 conversation; repository main, CONCEPT, DESIGN, ARCHITECTURE, CONTENT, ROADMAP and collaboration policy. No claim to the complete private project history.

**Babuni.dev requested:** Fix observed diagonal zigzag/overlaps when right-side columns crossed a displaced bloom row. Keep calm straight plate motion based on actual occupancy; finish expansion conflicts first; allow immediate dragging while gently closing; preserve hover topics through unrelated shifts; align each bubble bottom-left with its square top; add a physically reserved module below the project and preserve future 3×3 possibilities.

**AI contribution:** Found the explicit `bloomShiftFraction` sideways interpolation. Replaced it with shared reversible vacancy geometry and visual-space shift history; expanded conflicts to both entire displaced runs. Added below metadata module using existing topics/evidence after checking concept candidates. Removed global topic dismissal on shift starts and pool-window changes (actual reassignment still clears stale topics). Enabled pointer-threshold drag and arrow close/navigation. Updated source, tests, and seven development documents.

**Alternatives and decision:** Babuni.dev rejected the observed zigzag and requested actual occupied columns. AI chose row insertion for both vacancies instead of diagonal detours, globally blocking right-side columns, or combining horizontal and downward displacement. AI chose provisional metadata content, not claimed human approval. Active straight shifts finish in a shortened ~520 ms interval before collapse to avoid changing geometry mid-event; dragging proceeds immediately. Final timing/content acceptance remains open.

**Verification:** `npm run test:grid` passes all nine test files; `npm run build` passes. An initial stale assertion expected only one displaced row and failed; updated it for the requested lower vacancy and reran successfully. New geometry tests cover unique occupied cells, both-direction visual-column identity at commit, expanded conflict checks, and a 3×3 vacancy mapping. Initial sandbox background preview failed to become ready; existing port 4321 was an older preview and was not used as evidence for this change. Started this checkout on 4322 and checked a 620×652 browser: right summary and lower notes occupied cleared cells; dragging visibly panned and subsequently removed both modules.

**Open:** No exhaustive browser trajectory instrumentation, sustained recycling/uniqueness run, physical phone/tablet test, or complete keyboard/reduced-motion verification. Exact bubble typography/alignment and repeated unrelated-shift hover persistence await visual acceptance. Full 3×3 bloom remains planned; only its geometry primitive is covered here. No production deployment performed.

## 2026-10-26 — Babuni.dev releases bubbles from tile bounds

**Context/source:** Current feedback following commit `0e6b5fa`. **Babuni.dev requested/decided:** It is fine for bubbles to extend across the grid; let the right bubble overlap the next tile, anchor the left by its bottom-right corner to spread left, and let the top spread upward. This explicitly revises previous containment guidance. **AI contribution:** Updated CSS in `src/pages/index.astro`: content-sized bubbles with matching typography, left/right corner origins, centered upward top bubble, and raised topic-tile stacking. Updated CONCEPT and development documentation. **Alternatives:** Tile containment and narrower right text were discarded in response to the human correction; top centering and the 230 px / 70vw reading-width limit are AI aesthetic choices awaiting acceptance. **Tested:** `npm run build` and `npm run test:grid` pass (nine test files). Existing local preview on port 4322 at 1280×720 showed three open BABUNI.DEV topics; left/right extended across neighboring tiles and remained visible above their faces. Screenshot saved outside the repo as `topic-wings-preview.png`. No new automated tests for this CSS-only refinement. **Open:** Real phone checks, screen-edge clipping and final aesthetic approval. No deployment.

## 2026-10-26 — Organic topic reveal

**Source/Babuni.dev requested:** Current feedback: choose a random first bubble, then reveal the remaining two in succession. **AI contribution:** Added `topicRevealPlan`, cumulative token-based visibility and cancellable reveal timers in `grid.ts`; replaced simultaneous CSS selectors. Duplicate events preserve the current sequence. AI chose 260–420 ms gaps and cumulative retention; these are interpretations awaiting feel/acceptance, not quoted human requirements. **Alternatives:** Simultaneous and fixed-order reveals fail the revised request; replacing previous bubbles was considered but cumulative wings were chosen. **Changed:** `project-topics.ts`, `grid.ts`, `index.astro`, topic tests and development docs. **Tested:** `npm run test:grid` passes nine files; `npm run build` passes. New deterministic coverage exercises all six permutations, each point once, immediate first reveal and bounded increasing delays. **Open:** Browser timing and cancellation checks, touch and final pacing approval; no deployment.


## 2026-10-26 — A single portal size and three equally spaced diamonds

**Babuni.dev direction.** Babuni.dev noticed that project portals were inconsistent in diameter and occasionally touched or covered the glowing information-point squares. They specifically requested that all portals become one shared size, approximately halfway between the existing large and small examples, and that the three little indicators be moved farther toward the inner frame. The left and right markers should have **the same distance from the portal's middle as the top marker**, preserving the symmetry of a truly square stone tile. Babuni.dev also corrected an earlier AI schematic which accidentally depicted the tile as a rectangle. They explicitly asked this developer in the current cloud chat to make the GitHub change and commit it, even while another development session worked on separate bloom and shifting tasks.

**AI diagnosis.** The live CSS assigned 59% width to ordinary portals and 53% to long-title portals. Markers were positioned relative to the tile face with unrelated vertical and horizontal offsets, while title text remained in the flex layout. Consequently, marker spacing could vary with title length as well as portal size. An earlier rectangular illustration was not a reliable representation of the actual square tile.

**AI implementation choices.** Use a provisional **56%-wide circular portal** on every project, without an exception for long titles. Place the portal cluster's center at 50% horizontally and 45% vertically to leave room for the engraved title below. The title remains separately laid out at the bottom; long titles keep responsive typography rather than shrinking the portal. The top, left and right diamonds are now children of the same square portal container and share a six-percent-of-tile radial clearance beyond its circumference. Each square has a fixed seven-pixel box, and its text wing is positioned from that square's top edge. The inset and center-height measurements are AI engineering/aesthetic defaults still subject to visual review.

**Alternative considered.** Merely changing the old 59%/53% widths to 56% would have left the three markers referenced to differing tile positions and preserved unpredictable spacing. A local portal coordinate system was chosen instead. No new portal artwork, colors, textures, media, or redesign of the square tile was introduced.

**Files and verification.** Updated `src/scripts/grid.ts` only to group the existing portal/markers/wings (retaining semantic controls and event delegation), and `src/pages/index.astro` for consistent portal, marker, title and bubble geometry; added `tests/portal-layout.test.mjs` for structural and numerical width/radius checks. The layout still needs a fresh `npm run test:grid`, `npm run build`, browser screenshot and especially physical phone and long-title inspection. No deployment, interaction approval, or verified browser result is claimed.
