# Changelog

All notable **verified repository changes** are recorded here. Human–AI reasoning and proposals belong in docs/DEVLOG.md, not here.

Follow the spirit of Keep a Changelog: Added, Changed, Fixed, Removed, Security. Do not claim work is finished because it was discussed, illustrated, or started locally.

## [Unreleased]

### Changed — WebP portal paths and BuxbrewResist artwork (2026-10-27)
- Replaced eleven existing `portalArtwork` URL extensions from PNG to **WebP** and assigned `/portal-content/BuxbrewResist.webp` to the previously unillustrated BuxbrewResist project.
- Added an opt-in local helper `npm run artwork:import -- "/path/to/folder"` to normalize source WebP filenames (including spaces and casing), check container signatures, and copy or rename the **already-converted original files** into `public/portal-content/` without recompression.
- Added mapping/import tests. No original WebP file bytes were uploaded in the AI commit: the source images exist on Babuni.dev's local machine, outside this cloud chat's file access.
- **Temporary integration requirement:** content validation and GitHub CI cannot pass on the code-only commit until Babuni.dev stages and pushes all twelve original WebPs. Legacy PNGs may then be deleted and their deletions included in the artwork commit.

### Fixed — reuse living-grid tile elements at shift settlement (2026-10-27)
- Addressed a reported momentary **portal artwork flicker** immediately after autonomous rows/columns finish shifting.
- The shift-finish handoff previously updated logical history and repopulated stationary DOM cells, recreating affected portal image elements after arrival. It now rotates the *already-rendered tile DOM elements and their project-index identities* into the corresponding destination slots, then commits the shift history. Logos and their decoded image elements travel with the tiles and need no reattachment on visible settlement.
- The wrapping element moves only to the opposite offscreen buffer edge, where normal identity recycling is still allowed; spatial shifting, the 4.4-second tempo, bloom vacancy mapping, subject bubbles, manual dragging and project selection remain unchanged.
- Added tests for rows and columns in both directions, simultaneous independent lines, bloom-displaced visual columns, and settle-before-sync ordering.
- Root cause is supported by source inspection but real desktop/phone flicker resolution still requires Babuni.dev's eyes and browser checks.

## 2026-10-27 — Lazy project documents and automated verification

### Changed
- Replaced the interactive bundle's monolithic repository-document and raw-local-Markdown imports with a compact, build-generated index of module previews and up-to-1,600-character intros. The full original Markdown is emitted as separate same-origin static assets, and loaded only when a reader is opened.
- The small and big blooms still select modules synchronously, preserving established camera, movement, reveal and selection timing. Document detail displays loading/retry states, and cancels pending network work when closed.
- Added deterministic offline document-asset preparation before development, grid tests and production builds. Generated files are ignored in Git; reviewed snapshots and original Markdown remain the single source of truth.
- Added GitHub Actions on main pushes, pull requests and manual dispatch, running a locked install, tests and content-validated Astro build with Node 24.
- Added tests for source parity, public-only export, initial-bundle separation, intro fidelity, local asset existence and reader errors. This commit does not change project content, portal artwork, animation timing or user-approved bloom design.

### Verification
- Prior local result supplied by Babuni.dev: 92 grid tests passed, production build succeeded and npm audit found zero vulnerabilities, with a large JavaScript chunk warning. Post-change CI and browser performance measurements are pending; no speedup is claimed without evidence.

## 2026-10-26 — Uniform portal and symmetric indicator geometry

### Changed
- Standardized every project portal at a 56%-wide circular size (between the former 59% normal and 53% long-name sizes), independent of project-title length.
- Anchored the portal to a fixed 45%-height center within the square tile, with titles positioned separately beneath it; only title typography adapts to longer project names.
- Wrapped the portal, all three glowing square markers, and their topic wings in a shared local coordinate system. Marker centers now sit at equal radial distances above, left, and right of the portal, outside its rim and near the inner tile frame.
- Reanchored the existing top/left/right topic wings to their corresponding relocated squares, preserving bottom-corner origins and the current sequential reveal behavior.
- Added a focused structural and responsive geometry regression test for uniform diameter, equal marker radius and bubble attachment. Build/browser verification still pending for this particular adjustment.
### Added — three portal topic points and ambient hints during small bloom (2026-10-26)
- Extended the previous single glowing top square into **three** portal markers (above, left, right), each with one short provisional snippet for all 53 candidate projects. Direct portal hover/focus/tap reveals all three; this remains a temporary texture/functionality prototype.
- Manual inspection retains the portal-only activation region; the surrounding stone still selects and centers the project. No navigational links or sales language were added to the bubbles.
- Spontaneous hints now randomly activate only one of the three points per appearance, preferring a different point from the last hint.
- Hints continue on safe surrounding tiles while a small bloom is open; the centered/selected tile, displaced bloom row and tiles currently shifting are excluded. Opening/closing transitions, active user interaction, invisible/edge tiles, page-hidden and reduced-motion continue to suppress the effects.
- Retained the approximately five-second cadence and 1.7-second brief display, existing row/column shift logic, and project centering/bloom timings.
- Added tests for complete three-point labels, concise/unique snippets and nonrepeating ambient point selection. Local test suite, production build and visual/mobile checks are still outstanding.

### Changed — visitor-controlled blooms with independent living-grid shifts (2026-10-26)
- During an open small bloom, permit autonomous shifts of other rows and all nonprotected columns under the existing dice/timing rules. Protect only the selected row, selected column and immediate right-side bloom column.
- A right-side column that moves vertically through the displaced selected row interpolates horizontally at the same time, avoiding a sudden visual project-position jump when the shift commits.
- Clicking a tile already moving in a protected line immediately highlights it gold and queues recentering until the current shift finishes. Unrelated shifts instead pause for centering and resume after the bloom's entrance animation.
- Selecting another project closes the old bloom first, returns its neighbors over the existing 520 ms duration, and only then centers and opens the next; the queued destination turns gold immediately.
- Bloom transform transitions now apply only to displaced/returning tiles rather than delaying unrelated line shifts. The 53 project records, normal shift dice/timings, portal topic bubbles and initial spiral entrance remain unchanged.
- Added focused tests for shift/selection arbitration and continuous vertical crossing geometry. Full local tests and browser interaction checks are pending.

### Fixed — recurring ambient topic bubbles stay in view (2026-10-26)
- Adjusted automatic topic hints to a roughly five-second interval, with existing 1.7-second display duration.
- Busy checks (including autonomous shifts) now retry after 600 ms instead of resetting the entire wait. No queue of missed hints accumulates.
- Only choose fully onscreen project tiles with safe room around edges and the header/footer; use transformed DOM bounds.
- Passive viewport focus and stale pointer/touch focus no longer suppress hints indefinitely; active keyboard-visible project focus still has priority.
- Avoid repeating the immediately previous project when other candidates exist.
- Added tests for cadence, short retry behavior, onscreen eligibility and phone-size geometry.
- The creator visually approved the center-first small-bloom transition. New ambient behavior awaits their testing.

### Changed — project-wide author attribution (2026-10-26)
- Standardized the **Babuni.dev** author identity across accessible GitHub repositories: public README credits, World of Warcraft add-on manifests, applicable package metadata and current project documentation.
- Replaced generic author-role references in this portfolio's working documentation with the artist name while preserving distinct AI contributions and historical records.

### Added — center-first project selection, small bloom and ambient hints (2026-10-26)
- Selecting a visible stone tile centers its original source identity through a 720 ms eased camera movement. The portal still triggers its approved tiny topic bubble.
- Only after centering, the entire right-hand segment of neighboring tiles slides one cell right (520 ms), freeing a genuine adjacent cell containing the candidate's provisional short summary. Escape, Close, or selecting the centered project again restores the grid.
- Autonomous line shifts pause for the bloom; already-running shifts finish before a queued selection recenters.
- One existing glowing topic point occasionally reveals its tiny label for 1.7 s after a random 6.5–10.5 s idle interval. Teasers skip active interactions, focus/bloom, shifts, page-hidden and reduced-motion states.
- Added pure geometry/timing tests and a pinning regression test. Browser integration and the full local Node/Astro suite are still pending.

### Added — first portal-region topic bubble (2026-10-26)
- The small square above each project's colored portal glows when the portal itself is explored, revealing exactly one short topic label in a compact bubble contained within the same tile.
- Added 53 hand-selected provisional topic labels drawn conservatively from candidate summaries (e.g. "Reaction game", "Worldbuilding"), rather than placing full summaries or marketing copy in the popup. Original short descriptions remain stored separately.
- Hover activates only inside the portal, not across the tile. Keyboard focus and Enter/Space provide an accessible equivalent; a stationary touch tap toggles the bubble, whereas touch/mouse drags continue to pan the grid.
- Keep at most one topic active, clear it when tile identities/positions change, and exclude offscreen portal controls from keyboard focus. Retain the spiral, entrance animation, movement values, and temporary textures.
- Added topic coverage/length tests; full browser integration and hands-on visual review remain pending.

### Changed — use 53 real candidate names in the prototype grid (2026-10-26)
- Replaced 45 numbered demo labels with 53 distinct named candidates from `docs/PROJECT_INVENTORY.md`, preserving the inventory's provisional recent-to-old order and BABUNI.DEV at the center.
- Attached a provisional ID, one-line summary, evidence category and portal tint to each candidate so future information bubbles can reuse short descriptions. The titles and metadata are **not** verified or approved portfolio exhibits.
- Kept the original spiral assignment, offscreen recycling, manual controls, slow shifts, and the 373 ms initial reveal. No final portal textures or new navigation features were introduced.
- Allowed long authentic titles to wrap and fit more comfortably on the same tile component.
- Updated catalog and spiral/intro tests for the 53-candidate source.

### Verification
- Inventory row count, consecutive ordering, and 53 distinct generated IDs were checked against the current inventory. A fresh full Node/Astro build and visual review on Babuni.dev's PC remain pending.

### Added — spiral entrance animation (2026-10-26)
- On initial page load, grow the initially visible demo tiles into place one by one in center-out clockwise spiral order, beginning with BABUNI.DEV. Each tile animation lasts 373 ms; 68 ms stagger makes a 45-tile view complete in approximately 3.4 seconds.
- Animate the stone face independently of the grid-tile transforms used for row and column motion. The scene itself does not wait for a simulated network load.
- Run the sequence only once per page load, not on recycled tiles or resize. Cancel unfinished entrances when navigation or autonomous shifting starts; bypass the effect for reduced-motion users.
- Added pure ordering and timing regression tests. Browser appearance and full local suite still require Babuni.dev verification.

### Fixed — project identity swapping at the end of an autonomous shift (2026-10-26)
- Before moving a row or column, reserve project identities for the incoming offscreen tiles. Previously, a tile could slide into view as one numbered/color-coded project and abruptly turn into another when the shift completed.
- Prefer an already safe offscreen identity, or reuse the identity of the tile departing at the opposite edge. Keep existing visible tile identities unchanged. The ordinary spiral placement, manual speeds and shift timing are not changed.
- Added regression tests for row shifts in both directions, column shifts in both directions, and opposite-moving simultaneous lines. Full local tests and Babuni.dev visual confirmation remain pending.

### Changed — 45-project demo and stale test correction (2026-10-26)
- Added 45 distinct demo identities: BABUNI.DEV and PROJECT 02–45, so the centered 1920×1080 viewport can initially display 45 unique project tiles. Repeats remain necessary if panning exposes more than 45 partially visible tiles.
- Moved demo content into a small independent module and added catalog/desktop spiral coverage tests. The spiral allocator and movement controls were not changed.
- Updated two stale movement tests found in Babuni.dev's 28/30 run: assertions expecting prior (half-speed) settings, and an unrealistic speed-peak requirement with a 180px cursor-lead brake. The new test explicitly exercises maximum speed with sufficient lead.

### Verification
- Babuni.dev's previous local suite: 28 passing, 2 outdated movement-test failures. Fresh full tests and real desktop inspection remain pending for the new revision.

### Added — spiral-first project recycling (2026-10-26)
- Switched placeholder assignment from an indefinitely repeated coordinate hash to a clockwise center-out spiral, starting with BABUNI.DEV and then PROJECT 02 above, PROJECT 03 upper-right, through PROJECT 09 upper-left, and PROJECT 10 above the next ring.
- Added visibility-aware project residency: keep content identifiers while visible or in a two-tile offscreen band, release older offscreen positions, and prioritize distinct projects in the current viewport before repeating.
- Preserve a completely filled grid, even with fewer distinct project records than visible cells: repeat the real project list rather than rendering empty or neutral filler.
- Keep the existing finite DOM tile pool, manual movement controller, and autonomous row/column movement intact.
- Ten new placement tests cover spiral order, repeats with five projects, uniqueness during scrolling and responsive viewport simulations, offscreen retention, both-edge entrance detection, and line-shift identity mapping.

### Verification — spiral-first project recycling
- Ten focused pure-placement Node tests passed in an isolated local run. A full Astro build, local integration suite and Babuni.dev's desktop/mobile visual review are still pending.

### Changed — manual movement tuning (2026-10-26)
- Doubled mouse/touch maximum pan speed (440 to 880 CSS px/s) and arrow-key speed (130 to 260 CSS px/s), with correspondingly doubled acceleration and deceleration settings.
- Kept the 180 CSS px cursor-lag cap and autonomous shifting cadence unchanged.
- Added a test asserting the requested tuning values. Full post-change local test and browser review pending.

### Fixed — seeded shift test coverage, 2026-10-26
- Corrected a false-negative assertion in the no-same-direction shift test. Consecutive small seeds (0–399) all selected the row axis on the first output of the test RNG, so the test failed its expectation that columns were also covered.
- Explicitly exercise 200 reproducible rounds for each axis, including the same-direction restriction and earliest-successful-initiative priority. No application or movement algorithm was changed.

### Verification — seeded test fix
- An isolated local Node run of the corrected axis-forcing test passed. Babuni.dev's full pre-fix `npm run test:grid` previously reported 18 passing and 1 failing tests. Babuni.dev subsequently pulled `eef55d0` and verified the complete local `npm run test:grid` suite: **19 passed, 0 failed**.

### Changed — movement refinement, 2026-10-26
- Replaced per-keypress arrow jumps with frame-driven, smoothly accelerating and decelerating held-arrow navigation (provisional 130 CSS px/s ceiling).
- Added a tunable pointer-follow speed ceiling (provisional 440 CSS px/s), short acceleration ramp, and bounded cursor lead. Movement stops on pointer release without a delayed catch-up.
- Restricted each autonomous round to at most one moving line per direction, preventing multiple same-direction row blocks; applied the analogous provisional rule to columns.
- Preserved grid recycling, initial centering, and pause/resume behavior for autonomous shifts.

### Verification — movement refinement
- The isolated equivalent TypeScript implementation passed 18 Node tests and strict TypeScript checks; an isolated Chromium preview checked mouse speed limiting, continuous arrow motion, finite tile pool, shift pause/resume and reduced motion on desktop and phone-sized viewports. The committed Astro application and the new complete test suite still require Babuni.dev's local run and visual review.

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
- Initial Astro 7 project foundation: package scripts, lockfile, TypeScript configuration, base page, favicons, and editor configuration (Babuni.dev's commit `294831c`).
- Project documentation baseline: concept, roadmap, agent guidance, design, architecture, content policy, decisions, journal, collaboration policy, and ChatGPT project instructions.
- Updated README describing the portfolio's goals and documentation.

### Changed
- Integrated local Astro foundation and documentation on `main` in merge commit `5902121`, preserving both agent instruction sets in AGENTS.md.
- Aligned documented workflow to Babuni.dev's decision to develop directly on `main` unless requested otherwise.

### Fixed
- Stale current framework status in D-011 and missing independent-build evidence in the architecture baseline.

### Verification
- On 2026-10-26, an independent text-source snapshot of `ea90117` installed with lifecycle scripts disabled and passed `npm run build` (one static page). Manifest/lockfile consistency and relative Markdown links passed inspection. Dedicated type checking, browser testing, and dependency vulnerability auditing were not performed.
- Babuni.dev reported Astro 7.4.2 starting successfully at localhost:4321 before the merge. The repository content and merge commit were verified on GitHub. At that time, no post-merge build or browser test had been independently performed.

### Added — 2026-10-26: project inventory research memory
- Added `docs/PROJECT_INVENTORY.md`, a provisional 53-entry catalog of potential portfolio works with one-line descriptions, evidence levels and project relationships.
- Linked the research inventory from README and recorded its provenance and limitations in the development journal.

### Verification
- Documentation writes confirmed by GitHub. No application code was changed and no build/browser tests were run for this documentation-only update.

## Conventions

Each future entry should include the change, its user-visible or technical effect, and optionally a PR/commit reference. Avoid duplicating brainstorm narratives from DEVLOG. Date releases when actual releases happen; do not invent version numbers.

- Distinguish keyboard-visible project focus from stale pointer/touch button focus, preventing another indefinite suppression path.

- Follow-up: close the bloom corridor smoothly even when a right-side vertical shift is paused mid-cell, preserving its vertical progress and resuming it after collapse.

## 2026-10-26 — Occupied-column shifts and two-cell small bloom

### Added
- A second small-bloom module below the selected tile: provisional topics and inventory evidence. Both modules reserve actual visual cells.
- Shared vacancy insertion/inversion geometry and regression coverage, including a future 3×3 vacancy mapping (not a full-bloom implementation).

### Fixed
- Vertical shifts select actual occupied visual columns and commit matching source identities, removing sideways interpolation across displaced rows.
- Expansion waits for shifts affecting either displaced run, including far-right columns.
- Map dragging and arrow navigation close a bloom while allowing camera movement immediately.
- Unrelated shift starts no longer dismiss portal topic bubbles. Bubble bottom-left anchors now meet the top of their rotated glowing squares.

## 2026-10-26 — Outward topic wings

### Changed
- Topic bubbles may overlay neighboring tiles. Left anchors bottom-right, right bottom-left, and top bottom-center; shared readable sizing replaces the cramped right bubble. Active topic tiles render above neighboring tiles and bloom modules.

## 2026-10-26 — Organic topic reveal

### Changed
- Portal exploration reveals the three topic wings cumulatively in a fresh random order, with 260–420 ms between successive bubbles. Ambient hints continue to reveal one point. Pending reveals cancel when topics close.

## 2026-10-26 — Preserve calm shifts and remove bloom return glitch

### Fixed
- Removed shortened shift completion when closing or switching a bloom. The fixed 4.4-second shift duration and easing remain in force; all tile selections show gold and wait for the active shift before centering/opening.
- Limited bloom transform transitions to opening/closing phases, preventing displaced tiles from animating backward after vertical shift slot reassignment.
- Project visibility reservations use occupied visual positions while bloom rows are displaced.

## 2026-10-26 — Waiting pulse and first portal artwork

### Added
- A gentle gold outline pulse on the queued project while opening, switching or closing waits for a shift. Reduced motion keeps a steady outline; the selected control exposes its busy state.
- Babuni.dev’s supplied `PortalContentBabuniDev.png` in the BABUNI.DEV portal, centered behind a circular mask and recessed rim. Artwork follows semantic identity through tile reuse.

## 2026-10-26 — One action across the whole tile

### Changed
- Each tile now has one full-face button for hover/focus topics and click/tap/keyboard project selection. Portal graphics are decorative rather than a separate button.
- Removed the portal-only touch toggle and extra keyboard stop; whole-tile topic reveal keeps its randomized sequence.

## 2026-10-26 — Mobile center topics and persistent bloom panning

### Added
- On primary coarse-pointer/no-hover devices, the tile covering the screen center reveals its topics during browsing. Center ownership follows panning and shifts; ambient hints do not compete with it.

### Changed
- An open bloom stays attached to its project during pointer/keyboard panning instead of closing on drag. Selecting another project keeps the established close-first switch and normal shift waits.

### Fixed
- Bloom geometry and selected identity survive panning beyond the bounded rendered tile pool and returning.

## 2026-10-26 — Topics defer to the open bloom

### Fixed
- Suppress topic bubbles on the physical tile whose bloom is open, for hover/focus and mobile center discovery. Other tiles and repeated project instances retain normal topic behavior. Opening clears any already-visible anchor bubbles.

## 2026-10-26 — Content-backed, sampled small-bloom modules

### Added
- A shared module catalog with text/document, image-gallery, local-video/external-embed and resource previews. BABUNI.DEV has twelve populated modules; Button Game has exactly five, with its other definitions empty.
- Up to nine populated previews sampled without replacement per opening, with shuffled sequential reveals after space is cleared. Pending reveals cancel when closing/switching.
- Two supplied screenshots and four web-ready MP4/poster derivatives from selected short visual-documentation recordings; no autoplay, on-demand native playback and gallery navigation.
- Authoring guide for project content and media folders.

### Changed
- Bloom vacancy mapping supports previews on both sides of the fixed project anchor. Every selected module reserves a real cell; shift eligibility follows the complete sampled footprint.


## 2026-10-26 — Button Game portal artwork

### Added
- Button Game portal uses the supplied PNG logo through the existing circular mask. Project catalog entries now declare optional portal artwork URLs.


## 2026-10-26 — Eight modules around the center

### Fixed
- Cap small-bloom previews at eight and remove the extra right-hand slot, forming a 3×3 square including the project tile. Larger catalogs still sample randomly; five-module projects remain five.


## 2026-10-26 — Draggable big bloom and module detail

### Added
- Bottom-right Read more controls and module-body activation in small bloom; enter a project-only draggable big bloom focused on the selected intro.
- All populated project modules in distinct surrounding slots with randomized sequential reveals; top-left project portal returns to the retained small bloom.
- A second Read more opens full-page document, image-gallery, video-collection or resource detail; Back/Escape returns one level, preserving big-bloom camera position.
- Keyboard pan/Home, native modal focus containment, reduced-motion handling and image-only browser fullscreen controls.
### Changed
- BABUNI.DEV’s four recordings now share one Videos module, leaving nine populated modules total. Small bloom still samples eight; Button Game still has five.
- Big-bloom entry waits for an active shift at its original tempo. Underlying grid motion is suspended while exploring big bloom and resumes after returning.


## 2026-10-26 — Big bloom grows inside the living grid

### Changed
- Big bloom now reserves real space in the living grid instead of opening a separate modal canvas. Surrounding project tiles stay present and nonconflicting shifts continue.
- Each large module spans exactly 2×2 tile cells. The original-size project tile occupies the selected module’s lower-left quarter as Back; Read more stays bottom right.
- Selected preview transitions into the center; remaining modules reveal top-first clockwise. Collections larger than nine extend downward in three columns.
- Large text previews expose longer source excerpts; image/video previews add collection context.
### Removed
- Big-bloom header strip, reduced top-left portal clone, separate camera and persistent instruction line. A small corner help tooltip replaces the instruction strip in big bloom.


## 2026-10-26 — Four additional portal images

### Added
- Supplied portal artwork for FavorCraft, FlourishForever, ResistForever and SocialForever, explicitly assigned through the existing project catalog.


## 2026-10-26 — Stronger action and waiting feedback

### Changed
- Stronger gold tile acknowledgement and preparation glow; waiting pulses use a slightly faster 1400 ms cycle instead of 1600 ms.
- Read more stays highlighted/busy while a bloom depth change waits for a shift. Read more, Back, Close, resource actions and project tiles acknowledge pointer/keyboard presses immediately without delaying navigation.
- Tile busy state covers centering and bloom preparation as well as queued shifts; reduced-motion feedback remains steady.


## 2026-10-27 — Content validation and authoring

### Added
- Local content validation with field-specific errors, automatic validation before production builds, and blank module templates that leave live content untouched.


## 2026-10-27 — Five more project portals

### Added
- Supplied portal artwork assigned to Anskar Grotzschnapf, Azeroth Moments, Local AI Workstation, Local Prompt Lab and RoarForever.


## 2026-10-27 — Framed detail reader

### Changed
- Module detail now opens as a centered square panel with a visible grid surround, gold frame, internal scrolling and a gentle 420 ms fade/grow entrance.


## 2026-10-27 — Hidden scrollbars

### Changed
- Hide scrollbars across the site while preserving native content scrolling.


## 2026-10-27 — Repository-backed project documentation

### Added
- Explicit repository/status mapping for all 53 project tiles, a standard ten-document extraction contract, revision-pinned public source snapshots, repository refresh/report commands and source validation.
- Connected 34 tiles to 33 public repositories, including the shared Human–AI Development Journal source. Imported 303 documents from 32 remote repositories; BABUNI.DEV documents use local source text.
- Public repository-coverage report listing missing sources, private-review tiles and unresolved project families.
### Changed
- Matching text modules now use source documentation directly; curated previews and existing media/resources are retained. Empty or missing upstream documents do not create filler modules.


### Fixed — first CI finding (2026-10-27)
- Preserve generated big-bloom intros exactly instead of re-truncating them when displayed. The first CI run passed 96/97 tests and exposed this one-character mismatch.
- Update GitHub Actions checkout/setup-node to v5 for the Node 24 runner. Post-fix CI verification is still pending.


### Added — client bundle-size report (2026-10-27)
- GitHub Actions now reports raw and gzip sizes of the largest emitted JavaScript files after a successful build, with a read-only local measurement script.
- Clean Node 24 CI verification on `3041e01`: 97 tests passed and Astro build succeeded. A >500 kB chunk warning remains, so no claim of completed bundle optimization is made.


## 2026-10-27 — Complete supplied WebP artwork and retain reader attribution

### Added
- Commit all fifteen supplied WebP portal images, including newly assigned ROARR, The Great Iceflow Relay and WorkThatGodBod artwork.
### Fixed
- Restore clean-checkout content validation/builds by including the WebP binaries referenced by project metadata.
- Preserve View source and credit footers when asynchronous document reading succeeds, fails or retries.
### Removed
- Superseded portal PNGs, matching Babuni.dev’s local WebP conversion; historical originals remain recoverable from Git.


## 2026-10-27 — Render repository Markdown as document structure

### Fixed
- Render repository Markdown emphasis, inline/fenced code, blockquotes, hard breaks, nested/ordered lists, task lists, strikeout and tables in the detail reader instead of exposing raw formatting markers.
- Resolve relative documentation links against the original source and support reader-local heading navigation.
### Added
- Maintained Markdown token parsing with explicit safe-DOM rendering and regression coverage for the reported WorkThatGodBod document plus all 303 imported documents.


## 2026-10-27 — Dismiss the reader from its surround

### Changed
- Close the detail reader by clicking/tapping its outside surround or pressing Escape. Remove the Back to big bloom button.
### Fixed
- Keep text-selection drags and inside-panel clicks from accidentally dismissing the reader.


### Fixed — Markdown in bloom previews (2026-10-27)
- Small and big bloom text now renders Markdown using the same safe DOM renderer as the reader. Generated excerpts retain formatting instead of flattening it. Preview links remain labels so card navigation stays consistent.


### Added — Persistent project navigation and visual history (2026-10-27)
- Header available across grid, small bloom, big bloom and reader, with About and a searchable list of all 53 project tiles. Selecting a project centers and opens it through the existing shift/close sequence.
- Archived all 19 available saved browser verification captures in the Visual documentation gallery with historical-context captions.


### Changed — Mobile reader, activity and contextual controls (2026-10-27)
- Phone readers use an edge-to-edge taller rectangle below the header, without the decorative frame, retaining at least 64px below for dismissal. Desktop retains the square framed reader.
- Reader dismissal shrinks/fades the panel before removal; reduced motion closes immediately. Header activity is centered and names the project, bloom depth or document being read.
- Replaced bottom instruction text and big-bloom help with a far-right header help control supporting hover, keyboard and tap. Removed the small-bloom Close button.
- Expanded About into a WIP introduction with source-backed project interests and GitHub, CurseForge, Instagram and YouTube links.

## 2026-10-27 — Documentation audit #28 (documentation-only)

### Corrected
- Refresh README's stale **11-image** description to the **15 original WebP portal artworks** already checked into the Git tree.
- Bring README test wording forward from the historically successful 97-test CI stage to also record the later **126-test** result in the development journal, without claiming another run during this audit.
- Clarify that Astro 7, TypeScript/browser DOM modules and Marked are implemented dependencies, whereas Svelte is **not installed** and remains only a possible future technology.

### Recorded
- The current four-depth interaction contract, 53 **candidate** tiles versus 34/33 repository connections, 15 supplied portals, shared header/Projects search, safe Markdown reader and archived screenshot provenance.
- External GitHub project documentation is captured in **static, revision-pinned snapshots** requiring explicit `content:sync` and subsequent checking/building; today's docs-only commit does not refresh or deploy those snapshots.
- Preserved the original extensive journals, decisions, source, media and client tests without reformatting away earlier creative corrections.

**Verification:** GitHub tree, source, docs and dated Git review; Markdown relative-path and unchanged-file checks following commit. No new Node tests, Astro build, browser session or physical phone test executed here.

### Changed — WebP for every published image (2026-10-27)
- Converted all remaining screenshot/gallery/poster images and SVG favicon to WebP, updated gallery/poster references, and removed the unused legacy ICO duplicate from publication. Existing portal WebPs remain unchanged.
- Public-image format/signature checks now run before builds; originals are preserved outside public assets.


### Fixed — Clicks no longer pause active shifts (2026-10-27)
- Pointer presses acknowledge selection without freezing an active line shift. Only actual drag movement past the existing 9px threshold brakes playback.
- Dragging gradually brakes and resumes shift playback over 280ms; the normal uninterrupted shift still takes 4.4 seconds. Hidden-page and reader pauses remain immediate.
- Cached source-coordinate and row-vacancy calculations reduce repeated rendering work without changing geometry; stable transforms and busy attributes avoid redundant writes. Added an opt-in local development frame sampler.


### Changed — Highlight-first keyboard exploration (2026-10-27)
- First Tab into the grid highlights its center item. Arrows choose spatial neighbors without opening or continuously panning; Space/Enter activates the highlighted tile or module.
- Keyboard highlight survives opening/return across small bloom, big bloom and reader; Escape returns one stage. Tab from the highlighted primary control reaches the header menu.
- Updated controls help. Pointer/touch behavior and approved motion timings remain unchanged.

### Changed — browser branding (2026-10-27)

Disabled the Astro development toolbar through project configuration. Replaced the favicon with a transparent, graphic-only B WebP (64×64, 7,926 bytes), with a versioned URL to refresh cached icons. Archived the browser verification capture.


### Header B mark — 2026-10-27

Babuni.dev additionally requested the B to the left of BABUNI.DEV in the persistent header, using WebP, and explicitly authorized committing, pushing, updating and restarting the local site for future changes. AI reused the transparent 64×64 favicon at 32×32 CSS pixels, with fixed dimensions and decorative empty alternative text beside the existing accessible brand name. This adds no image duplicate or interaction changes.

## 2026-10-27 — Reader scroll handle

### Added
- A reader-only frameless gold scroll thumb: drag to move quickly through long content and see the current position. It hides when content fits; native wheel/touch reading remains available with generic scrollbars hidden.
- Keyboard support for the focused thumb (arrows, Page Up/Down, Home/End), live overflow resizing, and geometry tests. Both browser captures are archived as WebP, including the superseded first preview.

## 2026-10-27 — Retain grid coordinates through long sessions

### Fixed
- Preserve cached source coordinates across settled shifts instead of clearing the complete cache each time. Remap cached destinations through only newly appended shifts, falling back to authoritative history for uncached residents.
- Evict individual least-recently-used entries at the 2,048-entry bound instead of flushing the viewport. Avoid vacancy allocations in historical shifts without vacancies. Add long-history/eviction regressions and a reproducible calculation benchmark. No timing, scrolling or geometry changes.

## 2026-10-28 — Documentation-only publication preparation

### Added
- Recorded the chosen public-documentation/private-implementation boundary and the four prepared editions in docs/PUBLIC_DOCUMENTATION_PLAN.md. No repository visibility or website source status has changed; remote publication and import remain pending.

## 2026-10-28 — Connect four public documentation editions

### Added
- Connected Ethera, Morkahja RPG, MorkahjaWorld and arcanitebrothers to their separate public documentation repositories. Imported exactly forty anonymously verified Markdown documents pinned to their public commits; existing snapshots remain unchanged.
- Added boundary regression coverage excluding private implementation snapshots, and updated the connection report to 38 mapped tiles / 37 public sources.

### Fixed
- Skip Edition metadata when selecting a source preview paragraph, so newly connected project cards show actual project content; preserve full document text and attribution in the reader.

## 2026-10-28 — Preserve blooms on resize; add supplied portal artwork

### Fixed
- Keep selected/pending projects and small blooms during viewport pool rebuilds instead of closing them. Retain responsive logical map position and rescale active camera endpoints without restarting or accelerating motion. Existing big-bloom and reader states remain intact.

### Added
- Original supplied WebPs for BattleReport, Ethera, RoarGuild and WarriorStartAttack, mapped to their existing semantic project IDs. Nineteen original portal artworks are now present; imported files were not edited/recompressed.
- Responsive coordinate regression coverage, production artifact-size reporting (`npm run production:report`), local uncached loading measurements and an explicit analysis of the existing large-chunk warning. The warning is not suppressed or claimed resolved.
- Archived all three browser captures, including a failed measurement-server preview, as WebP with historical context.

## 2026-10-28 — Human curation of the project catalog

### Removed
- Removed WoW Forever Talent Design Atlas, Redridge Recipe Planner, Human–AI Development Journal and Morkahja — World and Peoples as independent website projects, as directed by Babuni.dev. Removed their topic/search data and source mappings, plus the now-unconnected wowforeverstuff and Redridge cached documents. No GitHub repositories were deleted.

### Changed
- Retain 49 project entries, with 35 connected tiles / 35 public sources. BABUNI.DEV still contains its journal, decisions and human–AI collaboration modules.
- Identify retained MorkahjaWorld as the worldbuilding project in the tile summary/topics and add a human-scope clarification module. Existing public source text predates this correction and was not silently rewritten.

### Added
- Map supplied ArcaniteBrothers.webp to Arcanitebrothers, preserving its exact original bytes. Twenty portal artworks are now mapped. Added removal/coverage regressions and updated active-catalog reports.

## 2026-10-28 — Two additional project withdrawals

### Removed
- Removed The Amberbrew Family and Practical Templates Creator from the active catalog, both topic maps and unresolved repository mappings at Babuni.dev’s request. The active list now has 47 projects; no repository or source document was deleted.

## 2026-10-28 — Warehouse candidate withdrawal

### Removed
- Removed Warehouse Performance Model from the active grid/search catalog, topic maps and unresolved repository mappings at Babuni.dev’s request. The list now contains 46 projects; connected sources and documents are unchanged.

## 2026-10-28 — GuildChatAI withdrawal

### Removed
- Removed GuildChatAI from active grid/search, both topic maps and repository mapping at Babuni.dev’s request. Removed its ten now-unconnected cached documents; the GitHub repository is untouched. Active totals: 45 projects / 34 public sources.

## 2026-10-28 — Dual-PC Streaming Setup withdrawal

### Removed
- Removed Dual-PC Streaming Setup from active grid/search, both topic maps and unresolved repository mappings at Babuni.dev’s request. The active list now contains 44 projects; no imported documents or repository were deleted.

## 2026-10-28 — Mech-Arena withdrawal

### Removed
- Removed Mech-Arena from active grid/search, both topic maps and unresolved repository mappings at Babuni.dev’s request. The active catalog now has 43 entries; connected sources and imported documents are unchanged.

## 2026-10-28 — Local Prompt Lab folded into Anskar Grotzschnapf

### Removed
- Removed Local Prompt Lab as an independent grid/search project, including topics and its unresolved repository mapping, at Babuni.dev’s direction that it belongs within Anskar Grotzschnapf. Active catalog: 42 projects. Its supplied WebP remains preserved, with no standalone assignment.


## 2026-10-28 — Stable curated grid and neutral fillers

### Fixed
- Preserve continuing tile identities when shifts settle; protect departing projects until their animation finishes. Entering tiles receive their final identity before moving.
- Use five neutral filler identities instead of cloning visible projects when the catalog cannot fill all occupied positions. Fillers have no project, portal, bubbles, navigation or menu entry.

### Added
- Rocket Game 42, its public repository connection and ten reviewed source-document snapshots.
- Gray engraved-diamond filler styling and regression coverage for catalog size changes, panning and displaced bloom columns.
- Two archived WebP browser captures and a complete menu-grouping proposal for human review.

### Changed
- Display names: Morkahja, Morkahja Worldbuilding and Roar Guild; stable identifiers retained. Community Roar Guild now uses the existing guild WebP, shared with the addon entry.
- No tile sizing or animation timing changes; menu grouping remains a proposal.


## 2026-10-28 — Bound neutral tiles, grouped menu and music projects

### Fixed
- Stop neutral tiles accumulating through the offscreen retention band. Three neutral identities are unique in the viewport and shift overlap; repeated real projects fill unavoidable shortages. Continuing/staged tile identities remain stable, including intermediate camera synchronization.

### Changed
- Use three subtle neutral marks (diamond, circle and square) instead of five indefinitely repeatable fillers. Tile size and movement timing remain unchanged.
- Group only the Projects menu into World of Warcraft, Morkahja, AI, Games and Music. Search filters within the same headings and direct navigation remains unchanged.
- Rename the repository-backed addon to RoarGuild Add-on, remove its supplied logo assignment, and retain the existing guild logo only on the Roar Guild community tile.

### Removed
- Duplicate Morkahja Admin Console tile; retain Arcanitebrothers and its existing public documentation connection. No repository or document snapshot was deleted.

### Added
- Mighty Morkah and Elixior as separate music projects with author-supplied descriptions and public YouTube/SoundCloud links. The planned gaming-video migration is labeled as planned, not completed. Analubia remains after Babuni.dev withdrew the removal suggestion.


## 2026-10-28 — Buxbrew character artwork

### Changed
- Assign the supplied `BuxbrewCharacter.webp` to Buxbrew — character story, as requested by Babuni.dev. Original WebP bytes preserved.


## 2026-10-28 — Morkahja portal artwork

### Changed
- Assign Babuni.dev’s supplied `Morkahja.webp` to Morkahja (`morkahja-rpg`), preserving the original WebP bytes.


## 2026-10-28 — TotemTimers artwork

### Changed
- Assign Babuni.dev’s supplied `TotemTimers.webp` to the TotemTimers portal, preserving its original WebP bytes.


## 2026-10-28 — Babuni Gaming

### Added
- Babuni Gaming as a separate Games-menu project with Overview, Gaming and add-ons, and Watch and follow modules.
- Author-supplied YouTube, CurseForge and Instagram profile links; existing add-ons and Azeroth Moments retain their own project identities.
- Original cat supplied by Babuni.dev as `Morningex1.jpg`, converted to lossless `/portal-content/BabuniGaming.webp` at its original dimensions without cropping or image edits.

### Changed
- Catalog/search/topic/artwork coverage now includes 45 projects and 23 supplied portal-art assignments. No grid geometry or timing change.


## 2026-10-28 — EnchantVisuals artwork

### Changed
- Assign Babuni.dev’s supplied `EnchantVisuals.webp` to EnchantVisuals, preserving original WebP bytes.


## 2026-10-28 — Buxbrew display name

### Changed
- Rename Buxbrew to Buxbrew Addon at Babuni.dev’s request. Stable ID and character-story entry retained.


## 2026-10-28 — BuxbrewCharge artwork

### Changed
- Assign Babuni.dev’s supplied `BuxbrewCharge.webp` to BuxbrewCharge, preserving original WebP bytes.


## 2026-10-28 — Buxbrew Addon artwork

### Changed
- Assign Babuni.dev’s supplied `BuxbrewAddon.webp` to Buxbrew Addon, preserving original WebP bytes.


## 2026-10-29 — RoarGuild Add-on artwork

### Changed
- Assign Babuni.dev’s supplied `RoarGuildAddon.webp` to RoarGuild Add-on, preserving original bytes. Community Roar Guild retains its separate artwork.


## 2026-10-29 — MeleeStartAttack artwork

### Changed
- Assign Babuni.dev’s supplied `MeleeStartAttack.webp` to MeleeStartAttack, preserving original WebP bytes.


## 2026-10-29 — Babuni Admin rename

### Changed
- Rename Arcanitebrothers to Babuni Admin in the live catalog, menu and activity labels; retain the stable project ID and existing artwork.
- Clarify the Public documentation module: the renamed implementation remains private, so the website continues reading only the existing public documentation edition under its historical name. No private files imported.


## 2026-10-29 — Babuni Admin public repository rename

### Fixed
- Switch the public documentation connection, resource link and ten-document snapshot to `babunidev/babuni.admin-docs`. Regenerated document assets/source URLs use the new canonical repository.
- Remove the old active snapshot key; preserve historical document text, stable project ID and private-implementation exclusion.


## 2026-10-29 — BuxbrewDing artwork

### Changed
- Assign Babuni.dev’s supplied `BuxbrewDing.webp` to BuxbrewDing, preserving original WebP bytes.


## 2026-10-29 — Amazin artwork

### Changed
- Assign Babuni.dev’s supplied `Amazin.webp` to Amazin, preserving original WebP bytes.


## 2026-10-29 — Mighty Morkah artwork

### Changed
- Assign Babuni.dev’s supplied `MightyMorkah.webp` to Mighty Morkah, preserving original WebP bytes.


## 2026-10-29 — Elixior artwork

### Changed
- Assign Babuni.dev’s supplied `Elexior.webp` to the Elixior music project, preserving original WebP bytes.


## 2026-10-29 — Commit-date first spiral

### Added
- Build-time refresh of latest branch-head commit dates from connected public repositories, using public documentation editions for private projects.
- Newest-first initial grid order, with stable catalog-order ties and undated projects afterward; no visitor-time requests or live reshuffling.
- Last-verified public activity cache, explicit refresh warnings/fallback and optional reviewed baseline saving. Normal builds write only ignored generated metadata.

### Fixed
- BABUNI.DEV special tile styling follows its semantic ID rather than whichever project happens to rank first. Tile geometry and animation timings are unchanged.


## 2026-10-29 — Remove Fantasy RPG Assets; GatherMap artwork

### Removed
- Fantasy RPG Assets from the active catalog, menu group, topic data and unresolved-repository map at Babuni.dev’s direction. Historical records retained.

### Changed
- Assign supplied GatherMap.webp to GatherMap, preserving original bytes. Catalog now has 44 projects and 33 supplied portal artworks.


## 2026-10-29 — Shorter project names

### Changed
- Rename Ethera: The Stonewrought to Ethera and Local AI Workstation to Local AI at Babuni.dev’s request. Stable IDs, source connections and artwork retained.


## 2026-10-29 — Remove Fantasy Architecture

### Removed

- Babuni.dev requested removing Fantasy Architecture because it is not a project. AI removed its catalog, menu, topic and unresolved-source entries; 43 projects remain.


## 2026-10-29 — Grimnir portal artwork

### Changed

**Babuni.dev requested:** use the supplied Grimnir.webp for Grimnir. **AI execution:** map the existing stable project ID to `/portal-content/Grimnir.webp`, preserving the supplied WebP bytes and existing round portal mask. This replaces its provisional colored portal; 34 active projects now have supplied artwork. No project identity, source, timing or placement changes. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture in this pass. Original artwork is retained without re-encoding.


## 2026-10-29 — ROARSounds portal artwork

### Changed

**Babuni.dev requested:** use the supplied ROARsounds.webp for ROARSounds. **AI execution:** assign it to the existing `roarsounds` identity, replacing its provisional colored portal. Preserve supplied WebP bytes and the round mask; 35 active projects now have supplied artwork. No timing, positioning, source or identity changes. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates. No browser screenshot taken.


## 2026-10-29 — Worldbuilding and Roar Guild artwork

### Changed

**Babuni.dev supplied:** MorkahjaWorldbuilding.webp and ROAR.webp. **AI interpretation/execution:** assign the first to Morkahja Worldbuilding and replace Roar Guild’s ROARGuild.webp mapping with ROAR.webp. Preserve the former file as historical artwork and keep RoarGuild Add-on’s separate image. Both new WebPs are copied unchanged; 36 active projects now have supplied artwork. No identity, source, timing or positioning changes. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture in this pass.


## 2026-10-29 — Correct ROAR artwork assignment

### Fixed

**Babuni.dev corrected:** ROAR.webp belongs to ROAR, not Roar Guild, which already had artwork. **AI error and correction:** the previous assignment inferred the wrong project; assign ROAR.webp to stable ID `roar` and restore ROARGuild.webp to `roar-guild-and-community`. RoarGuild Add-on retains its separate artwork. Earlier entry records the superseded mistake. There are now 37 active artwork assignments. No image bytes or interaction behavior changed. **Verification:** distinct artwork regression assertions, content validation and static production build run before publication with cached activity dates; no browser screenshot taken.


## 2026-10-29 — ROARRunlimited artwork

### Changed

**Babuni.dev supplied:** RoarUnlimited.webp. **AI execution:** assign the unchanged WebP to the existing ROARRunlimited project (`roarrunlimited`), replacing its provisional colored portal and retaining the round mask. There are now 38 active artwork assignments. Other ROAR-family mappings, labels, timing and placement remain unchanged. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — ROARemoteTrigger artwork

### Changed

**Babuni.dev supplied:** ROARRemoteTrigger.webp. **AI execution:** map the unchanged supplied WebP to the existing `roaremotetrigger` project, replacing its provisional colored portal with the existing round mask. There are now 39 active artwork assignments. Existing labels, other ROAR-family artwork, source mappings, timing and placement are preserved. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser screenshot taken.


## 2026-10-29 — Remove Analubia

### Removed

**Babuni.dev decided:** remove Analubia to focus this portfolio on their own current projects; they described it as a past corporate collaboration and expressed uncertainty about present ownership. This is the human’s scope decision, not an independently verified ownership claim. **AI execution:** remove its active catalog, menu, topics and unresolved source mapping; preserve historical records and external projects. There are now 42 projects, 35 connected public sources and six needing repositories. No motion or layout changes. **Verification:** full tests, content validation and static production build run before publication using cached activity dates; no browser capture or source refresh.


## 2026-10-29 — LootFeed artwork

### Changed

**Babuni.dev supplied:** LootFeed.webp. **AI execution:** assign the unchanged supplied WebP to stable project ID `lootfeed`, replacing its provisional colored portal within the existing round mask. There are now 40 active artwork assignments. No project labels, source connections, timing or placement changed. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — Rocket Game 42 artwork

### Changed

**Babuni.dev supplied:** Rocketgame42.webp. **AI execution:** assign the unchanged supplied WebP to stable project ID `rocket-game-42`, replacing its provisional colored portal within the existing round mask. There are now 41 active artwork assignments. Project identity, source, timing and placement are unchanged. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — GroupBuffToggle artwork

### Changed

**Babuni.dev supplied:** GroupBuff.webp. **AI execution:** assign the unchanged supplied WebP to the existing GroupBuffToggle project (`groupbufftoggle`), replacing its provisional colored portal within the existing round mask. All 42 current projects now have supplied portal artwork. Project names, source mappings, timing and placement are unchanged. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — 512-pixel portal publishing assets

### Changed

**Babuni.dev requested:** make all portal images smaller, suggesting 512 × 512. **AI implementation:** resize all 42 active portal WebPs to 512 × 512 with Lanczos resampling and WebP quality 85, preserving composition and transparency; update renderer intrinsic dimensions. This supersedes earlier byte-preservation rules for these published versions. Originals remain in Git history and in the local non-public `image-originals/portal-artwork-before-512-2026-10-29/` archive with a SHA-256 manifest. No artwork redesign, crop, portal size or animation changes. **Alternatives:** 384-pixel trial was smaller, but 512 follows the human’s chosen resolution and retains more detail. Total active portal bytes: 20,404,098 → 2,843,518 (86.1% reduction); largest 113,292 bytes. Gallery/verification images and favicon are outside this portal-only change. Import tooling still copies supplied files unchanged; intentional publishing optimization is separate. **Verification:** decoded all 42 WebPs and confirmed exact 512 × 512 dimensions; visually inspected a temporary contact sheet (not a browser capture); added a 150 KiB per-portal regression budget. Full tests, content validation and static production build run before publication with cached activity dates. No browser performance measurement claimed.


## 2026-10-29 — First Babuni Gaming video embed

### Added

**Babuni.dev supplied:** YouTube video `9fnC1ZI1iSY`, described as the first published stream test/showcase (not the first recording), with quiet microphone audio. **AI execution:** add a fourth Babuni Gaming module, Videos, using the existing click-to-load `youtube-nocookie.com` embed renderer and a descriptive label, not an invented official title. Other videos can join this collection later. Playback is served by YouTube; no recording is copied into the site and existing BABUNI.DEV local clips remain unchanged. Existing renderer requires Load video before creating the external player. **Verification:** content regression coverage, full tests, content validation and static production build run before publication with cached activity dates. YouTube page retrieval failed; official title, playback and embedding permission are not verified and require a live playback check. No browser screenshot taken.


## 2026-10-29 — Second Babuni Gaming video

### Added

**Babuni.dev supplied:** YouTube video `B2pMsZPQfCc` as the second published video, with microphone audio still very quiet but acceptable to publish. **AI execution:** append it after the first recording in the existing Videos collection; update collection context to describe both videos. Labels are descriptive, not verified official titles. Existing click-to-load YouTube embeds handle playback; no local video copy or timing/layout changes. **Verification:** ordered collection regression assertions, content validation and static production build run before publication using cached activity dates. YouTube playback and embedding permission remain unverified; no browser capture taken.


## 2026-10-29 — Visible embedded video previews

### Changed

**Babuni.dev requested:** visible large video previews in modules, the big bloom and reader instead of empty Load video buttons, with the ability to play directly. **AI implementation:** replace the extra load button with a lazy embedded player using the existing approved-host validation, privacy-enhanced YouTube URL and referrer policy. Put the first player above preview text in small/big modules and remove the big-card iframe height cap; the reader shows all collection players at full content width and 16:9. Native hosted clips retain their existing behavior. **Trade-off:** embedded previews may contact the video provider when visible, before playback; this supersedes the prior click-before-player approach. AI keeps playback user initiated to avoid simultaneous audio from multiple modules; no autoplay loop is introduced. Playback controls work inside the embed without opening another bloom. **Verification:** all 32 test files, content validation and static production build passed, including lazy iframe creation and rejection of unsafe hosts. No live browser playback or YouTube availability verified, and no browser screenshot taken.
