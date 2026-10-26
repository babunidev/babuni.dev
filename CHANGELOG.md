# Changelog

All notable **verified repository changes** are recorded here. Human–AI reasoning and proposals belong in docs/DEVLOG.md, not here.

Follow the spirit of Keep a Changelog: Added, Changed, Fixed, Removed, Security. Do not claim work is finished because it was discussed, illustrated, or started locally.

## [Unreleased]

### Added — spiral entrance animation (2026-10-26)
- On initial page load, grow the initially visible demo tiles into place one by one in center-out clockwise spiral order, beginning with BABUNI.DEV. Each tile animation lasts 373 ms; 68 ms stagger makes a 45-tile view complete in approximately 3.4 seconds.
- Animate the stone face independently of the grid-tile transforms used for row and column motion. The scene itself does not wait for a simulated network load.
- Run the sequence only once per page load, not on recycled tiles or resize. Cancel unfinished entrances when navigation or autonomous shifting starts; bypass the effect for reduced-motion users.
- Added pure ordering and timing regression tests. Browser appearance and full local suite still require creator verification.

### Fixed — project identity swapping at the end of an autonomous shift (2026-10-26)
- Before moving a row or column, reserve project identities for the incoming offscreen tiles. Previously, a tile could slide into view as one numbered/color-coded project and abruptly turn into another when the shift completed.
- Prefer an already safe offscreen identity, or reuse the identity of the tile departing at the opposite edge. Keep existing visible tile identities unchanged. The ordinary spiral placement, manual speeds and shift timing are not changed.
- Added regression tests for row shifts in both directions, column shifts in both directions, and opposite-moving simultaneous lines. Full local tests and creator visual confirmation remain pending.

### Changed — 45-project demo and stale test correction (2026-10-26)
- Added 45 distinct demo identities: BABUNI.DEV and PROJECT 02–45, so the centered 1920×1080 viewport can initially display 45 unique project tiles. Repeats remain necessary if panning exposes more than 45 partially visible tiles.
- Moved demo content into a small independent module and added catalog/desktop spiral coverage tests. The spiral allocator and movement controls were not changed.
- Updated two stale movement tests found in the creator's 28/30 run: assertions expecting prior (half-speed) settings, and an unrealistic speed-peak requirement with a 180px cursor-lead brake. The new test explicitly exercises maximum speed with sufficient lead.

### Verification
- Creator's previous local suite: 28 passing, 2 outdated movement-test failures. Fresh full tests and real desktop inspection remain pending for the new revision.

### Added — spiral-first project recycling (2026-10-26)
- Switched placeholder assignment from an indefinitely repeated coordinate hash to a clockwise center-out spiral, starting with BABUNI.DEV and then PROJECT 02 above, PROJECT 03 upper-right, through PROJECT 09 upper-left, and PROJECT 10 above the next ring.
- Added visibility-aware project residency: keep content identifiers while visible or in a two-tile offscreen band, release older offscreen positions, and prioritize distinct projects in the current viewport before repeating.
- Preserve a completely filled grid, even with fewer distinct project records than visible cells: repeat the real project list rather than rendering empty or neutral filler.
- Keep the existing finite DOM tile pool, manual movement controller, and autonomous row/column movement intact.
- Ten new placement tests cover spiral order, repeats with five projects, uniqueness during scrolling and responsive viewport simulations, offscreen retention, both-edge entrance detection, and line-shift identity mapping.

### Verification — spiral-first project recycling
- Ten focused pure-placement Node tests passed in an isolated local run. A full Astro build, local integration suite and creator's desktop/mobile visual review are still pending.

### Changed — manual movement tuning (2026-10-26)
- Doubled mouse/touch maximum pan speed (440 to 880 CSS px/s) and arrow-key speed (130 to 260 CSS px/s), with correspondingly doubled acceleration and deceleration settings.
- Kept the 180 CSS px cursor-lag cap and autonomous shifting cadence unchanged.
- Added a test asserting the requested tuning values. Full post-change local test and browser review pending.

### Fixed — seeded shift test coverage, 2026-10-26
- Corrected a false-negative assertion in the no-same-direction shift test. Consecutive small seeds (0–399) all selected the row axis on the first output of the test RNG, so the test failed its expectation that columns were also covered.
- Explicitly exercise 200 reproducible rounds for each axis, including the same-direction restriction and earliest-successful-initiative priority. No application or movement algorithm was changed.

### Verification — seeded test fix
- An isolated local Node run of the corrected axis-forcing test passed. The creator's full pre-fix `npm run test:grid` previously reported 18 passing and 1 failing tests. The creator subsequently pulled `eef55d0` and verified the complete local `npm run test:grid` suite: **19 passed, 0 failed**.

### Changed — movement refinement, 2026-10-26
- Replaced per-keypress arrow jumps with frame-driven, smoothly accelerating and decelerating held-arrow navigation (provisional 130 CSS px/s ceiling).
- Added a tunable pointer-follow speed ceiling (provisional 440 CSS px/s), short acceleration ramp, and bounded cursor lead. Movement stops on pointer release without a delayed catch-up.
- Restricted each autonomous round to at most one moving line per direction, preventing multiple same-direction row blocks; applied the analogous provisional rule to columns.
- Preserved grid recycling, initial centering, and pause/resume behavior for autonomous shifts.

### Verification — movement refinement
- The isolated equivalent TypeScript implementation passed 18 Node tests and strict TypeScript checks; an isolated Chromium preview checked mouse speed limiting, continuous arrow motion, finite tile pool, shift pause/resume and reduced motion on desktop and phone-sized viewports. The committed Astro application and the new complete test suite still require the creator's local run and visual review.

### Added
- Experimental autonomous one-cell row/column movement, including randomized direction and provisional d20/initiative rolls (+4, +3, +2, +1, then zero).
- Pausing an in-progress line shift during mouse/touch dragging; resuming after release; deferring new rounds during drag and tab invisibility; disabling automatic motion under reduced-motion preference.
- Five additional seeded shift-engine tests covering dice, line eligibility, source identity through alternating axes, and easing.

### Verification
- Ten Node tests and strict TypeScript checking passed locally. Isolated Chromium previews passed pause/resume, desktop and phone-sized layout, and reduced-motion checks. Physical mobile testing and a full post-commit Astro build remain open.

### Added
- Initial mechanical grid prototype: responsive square tiles, initially centered logical origin, unrestricted pointer dragging, fixed-size recycled DOM pool, keyboard pan and recenter controls.
- Unit test suite for sizing, exact center alignment, edge coverage, ring-buffer reassignment, and stable placeholder mapping.
- Temporary colored-circle tiles for mechanics testing; not final stone and portal designs.

### Verification
- Five grid geometry unit tests passed locally. Isolated Chromium preview checks verified initial centering and drag coverage for 1920×1080, 768×1024 and 390×844 viewports. Full Astro build and physical touch testing remain pending.

### Added
- Dated foundation review (`docs/REVIEW-2026-10-26.md`) with findings, verification scope, and human–AI attribution.
- README local development prerequisites and install/run/build commands.
- Initial Astro 7 project foundation: package scripts, lockfile, TypeScript configuration, base page, favicons, and editor configuration (creator's commit `294831c`).
- Project documentation baseline: concept, roadmap, agent guidance, design, architecture, content policy, decisions, journal, collaboration policy, and ChatGPT project instructions.
- Updated README describing the portfolio's goals and documentation.

### Changed
- Integrated local Astro foundation and documentation on `main` in merge commit `5902121`, preserving both agent instruction sets in AGENTS.md.
- Aligned documented workflow to the creator's decision to develop directly on `main` unless requested otherwise.

### Fixed
- Stale current framework status in D-011 and missing independent-build evidence in the architecture baseline.

### Verification
- On 2026-10-26, an independent text-source snapshot of `ea90117` installed with lifecycle scripts disabled and passed `npm run build` (one static page). Manifest/lockfile consistency and relative Markdown links passed inspection. Dedicated type checking, browser testing, and dependency vulnerability auditing were not performed.
- The creator reported Astro 7.4.2 starting successfully at localhost:4321 before the merge. The repository content and merge commit were verified on GitHub. At that time, no post-merge build or browser test had been independently performed.

### Added — 2026-10-26: project inventory research memory
- Added `docs/PROJECT_INVENTORY.md`, a provisional 53-entry catalog of potential portfolio works with one-line descriptions, evidence levels and project relationships.
- Linked the research inventory from README and recorded its provenance and limitations in the development journal.

### Verification
- Documentation writes confirmed by GitHub. No application code was changed and no build/browser tests were run for this documentation-only update.

## Conventions

Each future entry should include the change, its user-visible or technical effect, and optionally a PR/commit reference. Avoid duplicating brainstorm narratives from DEVLOG. Date releases when actual releases happen; do not invent version numbers.
