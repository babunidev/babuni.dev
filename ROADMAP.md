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
- [x] Implement pointer-event mouse/touch dragging, spatial keyboard highlight/activation, and reset (desktop pointer tested, real touch pending).
- [x] Implement bounded DOM tile recycling, keeping stable logical coordinates (unit tested and browser preview checked).
- [x] Prototype clockwise spiral-first project assignment with visibility-aware source identity recycling; fill the viewport by repeating the original project library when necessary. Ten pure-placement tests passed in isolation.
- [x] Babuni.dev visually approved the initial 45-project spiral on desktop, describing the result as looking fantastic (2026-10-26).
- [ ] Verify project uniqueness and stable identity during extended panning and ongoing autonomous shifts; extended physical-device checks remain outstanding; current production builds pass.

**Babuni.dev's first desktop acceptance test (2026-10-26):** Local Astro 7.4.2 server returned the page successfully. On Babuni.dev's desktop, the centered BABUNI.DEV tile appeared correctly, mouse dragging felt smooth and appropriately paced, and the grid could be dragged indefinitely without encountering an edge. This verifies the manual desktop experience by user observation; physical phone/tablet, resizing, automated shift mechanics, and reduced-motion tests remain open.
- [ ] Prove responsive coverage on phone, laptop, and wide desktop.
- [x] Prototype slow one-cell row/column shifts with testable seeded dice rounds (timing and initiative mechanics provisional; Babuni.dev review outstanding).
- [x] Pause an active autonomous shift while dragging, resume afterward and defer new rounds while dragging. Bloom-specific conflict handling awaits bloom implementation.
- [ ] Validate keyboard and reduced-motion alternatives. Frame-driven, slower keyboard movement and reduced-motion support are implemented, but await Babuni.dev/device acceptance.

**Movement refinement (2026-10-26):** Babuni.dev requested smooth, slower arrow-key navigation; brief acceleration and an adjustable speed ceiling for mouse/touch dragging; and no two simultaneously shifting rows moving in the same direction. A matching restriction on columns is an AI-proposed extension, awaiting Babuni.dev review. Initial controller and directional shift cap are implemented and tested in an isolated preview. New Babuni.dev feedback is needed before locking speeds or declaring Milestone 1 complete.

## Milestone 2 — The first portal
- [ ] Reusable, stylized stone tile component.
- [ ] Engraved, always-legible title and colored portal window.
- [x] Prototype three point-anchored topic bubbles (top, left, right; browser/device visual approval still pending).
- [ ] Complete interaction verification for hover, focus, tap and occasional ambient teasers (prototypes implemented, including during small bloom); optional linger-to-reveal remains unimplemented.
- [ ] Test against clutter on dense grids.

## Milestone 3 — Small bloom
- [x] Select and focus a tile instance (functional prototype).
- [x] Reserve adjacent grid cells for up to eight modules; move displaced neighbors.
- [x] Keep neighboring tiles visible and allow nonconflicting shifts at the approved calm tempo.
- [x] Support switching selection and graceful collapse.
- [x] Preserve selected source identity across recycled instances (tests and sampled browser checks; extended acceptance remains).

Functional prototype built; prolonged/device acceptance remains separate from implementation.

## Milestone 4 — Full bloom and viewers
- [x] Grow big bloom inside the living grid with 2×2 modules and surrounding tiles.
- [x] Retain the original-size project tile in the selected module’s lower-left quarter as a one-step return to centered small bloom.
- [x] Compose all populated intros; center the chosen module and reveal others top-first clockwise, with additional rows extending down.
- [x] Expand text into a scrollable reader with safe Markdown/GFM document formatting.
- [x] Provide a scrollable image collection and browser fullscreen control where supported.
- [x] Provide deliberate video collection playback and source/resource links.
- [ ] Complete native-phone, keyboard/reduced-motion, cross-browser/fullscreen and long-session acceptance; refine advanced document/gallery presentation.

Functional prototype built; local video remains until YouTube links are supplied. Common Markdown/GFM rendering is implemented; advanced gallery composition and broader acceptance remain open.

## Milestone 5 — Content and automation
- [x] Validate the implemented JSON module schema and repository-source mappings.
- [ ] Add MDX blocks if future authoring requirements justify them.
- [x] Populate source-backed project modules, including babuni.dev (34 tiles connected to 33 public repositories; release/editorial acceptance is separate).
- [x] Surface repository development notes as first-class modules.
- [ ] Validate AI-created entries and require accurate attribution.
- [x] Add CI build checks.
- [ ] Add preview deployments.
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

## 2026-10-26 — Two-module mechanics checkpoint

Implemented prototype: right summary and lower metadata modules with physical vacancies; occupied visual-column shifts; complete expansion-run conflict checks; immediate drag/arrow navigation while closing; unrelated hover persistence; square-top bubble anchors. Shared vacancy geometry supports and tests a future 3×3 set, but full bloom remains unimplemented.

Verified in this session: grid test command (nine passing test files), Astro production build, local 620×652 browser preview of two modules and drag/collapse. Remaining: prolonged shift/recycling and identity checks, exact bubble alignment at all responsive sizes, hover persistence during repeated unrelated shifts, real touch/keyboard/reduced-motion acceptance, final lower-module editorial approval, and full-bloom scheduling/content. Milestone 3 remains a prototype, not complete.

**2026-10-26 topic wings:** Implemented Babuni.dev’s revised outward overlay direction and left bottom-right anchor, with equal typography and source-tile stacking above neighbors. Build and nine grid test files pass; desktop 1280×720 browser preview confirms three outward bubbles and side overlap. Physical mobile and viewport-edge acceptance remain open.

**2026-10-26 sequential topics:** Implemented shuffled cumulative reveal for portal hover/focus/tap. Tests cover all six permutations, unique points and stagger bounds; grid suite and build pass. Browser timing/lifecycle and physical touch acceptance remain pending.


**Milestone 2 — portal symmetry refinement (2026-10-26):** Babuni.dev requested one portal circle size on every square tile (midpoint between 59% and 53%) and three glowing point squares with equal radial distance from the portal's center, placed farther toward the inner stone frame. A shared portal-relative layout now uses a provisional 56% circle and reanchors the previously implemented outward topic wings. Regression tests added; final visual acceptance, small-screen/long-title fit and a fresh local build remain pending. This is an aesthetic consistency update, not completion of Milestone 2 or a change to full-bloom plans.

**2026-10-26 calm-shift and renderer correction:** Removed accelerated close/switch completion; every selection waits for the established 4.4-second shift. Restricted bloom CSS transitions to opening/closing and aligned visibility reservations with visual occupancy. Nine test files and production build pass. Added repeated opposite-column trajectory/endpoint identity checks over eight rounds. Desktop browser observed queued selection (~4502 ms from observed shift start to centering), a live vertical shift with zero overlapping visible tiles, and zero tile transition duration during steady bloom and after completion. This is sampled evidence, not exhaustive animation verification. Long-run recycling, phones/tablets, reduced-motion/keyboard acceptance and future full bloom remain open.

**Integrated verification:** Preserved portal symmetry commit `fbc923d`; final suite passes ten test files and build. Fresh port-4323 browser shows both modules with zero steady/post-shift tile transition duration.

**2026-10-26 Babuni.dev desktop acceptance:** User reports smooth right-side shifts in both directions, drag closing, natural surrounding shifts, and orderly waits even when selecting a moving tile or closing. This is positive desktop feedback for the small-bloom prototype; it does not complete physical-device/full-bloom verification.

**Waiting pulse and first real portal artwork:** Implemented opacity-only pending-action feedback, steady reduced-motion indication and the supplied BABUNI.DEV PNG through the existing round aperture. Ten test files and build pass. Desktop browser verified the loaded 1254px image and circular mask; queued opening/closing each exposed one busy waiting tile; the pulse used 1.6s opacity animation with no transform and cleared after opening. Long-run recycling, physical mobile, reduced-motion visual acceptance and pulse pacing remain open.

**2026-10-26 unified tile action:** Implemented whole-tile hover/focus topic discovery and one click/tap/keyboard action for selection, including the portal region. New structural regression requires exactly one button per tile. Ten test files and build pass; desktop browser confirms one button per rendered tile, no portal buttons, focus-triggered topic reveal, portal-center selection, and portal-origin drag/pan with eventual close and no stray selection. Physical touch and final hover feel remain open.

**2026-10-26 mobile browsing checkpoint:** Babuni.dev reports liking the mobile appearance despite current sizing not being optimized. Implemented mobile center-tile topics and persistent bloom panning on all devices. Geometry tests cover center boundaries, module vacancies, displacement/mid-shift positions, and selected identity retention far beyond the DOM pool. Ten test files and build pass. Desktop preview retained an open bloom through drag, far pan beyond the selected DOM tile and return. A 390×844 static-build fixture with coarse/no-hover media detection explicitly mocked verified center-topic transfer, one topic owner, and persistent modules during mouse-driven mobile-mode panning. This is not a native touch-device test. Mobile size optimization, orientation/reset behavior and physical touch acceptance remain open.

## Current next step — Babuni.dev direction, 2026-10-26

- **Human mobile evidence:** Babuni.dev clarified that their mobile feedback is from actual phone use and that present bloom functionality/readability is satisfactory for this stage. Earlier browser mocks remain accurately labeled; they do not replace or invalidate human testing.
- **Immediate refinement implemented:** Open-bloom anchor does not show redundant topic bubbles; other tiles continue normally. Ten test files, build and desktop focus/other-tile browser check pass.
- **Next, before coding full bloom:** Refine and agree module families and shared data/view structure. CONTENT contains an AI draft for review. Full bloom and production schema remain unimplemented.
- **Defer polish:** Resize/orientation, keyboard focus continuity, dense-layout readability and visual optimization remain tracked but are not the immediate priority. No automatic timing or positioning changes are authorized by this planning discussion.

## 2026-10-26 — Content-backed small-bloom previews

Babuni.dev confirms the bubble exclusion works and phone orientation has shown no problems in their real-device testing. Prioritize content/module architecture; landscape/readability polish remains deferred.

Implemented: shared content definitions, twelve populated BABUNI.DEV modules, five populated Button Game modules and empty definitions omitted; random sampling capped at nine plus the anchor; independent sequential reveal with cleanup; real gallery/video/resource previews; dynamic physical vacancies on both sides of a fixed anchor. MODULE_AUTHORING documents media folders and source/public hosting distinctions.

Verified: eleven test files and build; seeded selection/reveal/content/asset tests and one-through-nine geometry/shift inversion checks. Browser: nine own previews, stationary centered anchor, zero measured panel/tile overlaps, deliberate native video playback, image switching, exactly five Button Game previews, varied own subsets on reopening and mid-reveal switch cleanup.

Next: refine and implement expanded full-page module presentation and navigation from these previews. A split-pane layout versus larger scrolling modules remains undecided. Native phone acceptance of this new multi-module implementation, extended mixed-shift/recycling runs, and external provider embed playback remain open. Do not confuse earlier phone acceptance with verification of this new commit.


## 2026-10-26 — Button Game portal artwork

- Built: Button Game supplied logo connected to the circular portal via explicit project artwork metadata. Expanded module/full-bloom work remains unchanged.


## 2026-10-26 — Eight modules around the center

Built: corrected the small-bloom maximum to eight surrounding previews plus the center project (3×3 total), superseding the earlier nine-preview interpretation. Larger catalogs and randomized sequential reveal remain; full-page expansion is still future work.


## 2026-10-26 — Draggable big bloom and module detail

Implemented: four-level module navigation, draggable big bloom with all populated modules and selected intro centered, progressive shuffled reveals, top-left one-step return portal, full-page text/image/video/resource detail, keyboard navigation and media cleanup. Small bloom still samples eight and returns with its same content; no center-tile full-bloom shortcut.

Content update: BABUNI.DEV has nine modules after grouping its four recordings into one Videos collection. Button Game remains five. YouTube hosting deferred by Babuni.dev until URLs are provided.

Milestone 4 is a functional prototype, not a release-complete claim: native phone/cross-browser acceptance, long-session navigation, advanced document formatting, image presentation polish and production accessibility/performance review remain. Milestones 5/6 publishing/hosting work is not implied complete.


## 2026-10-26 — Big bloom grows inside the living grid

Built revision of Milestone 4: big bloom integrated into the living grid with real 2×2 reservations, the original tile as lower-left Back, surrounding autonomous shifts, shared panning, top-first clockwise appearance and downward three-column overflow. Longer body excerpts and media-collection context now distinguish big previews from small teasers. Separate modal intro canvas/header are superseded; only full detail remains modal. Small-bloom sampling and full detail navigation are retained.

Validation includes arbitrary larger catalogs in geometry tests; actual BABUNI.DEV currently has nine modules, so downward overflow is not claimed as observed with a larger real project. Native-device, prolonged shift/recycling and final visual acceptance remain open. No production deployment or YouTube migration is included.


## 2026-10-26 — Four additional portal images

Built: the four newly supplied FavorCraft, FlourishForever, ResistForever and SocialForever portal identities are connected. This asset update does not change milestone scope or imply new project-module content.


## 2026-10-26 — Stronger action and waiting feedback

Built: stronger tile/preparation pulse and pointer/keyboard button acknowledgement, including a persistent queued Read more indication. Next acceptance checks: switch during a running shift; full forward/back navigation; panning beside an open big bloom; phone reading/orientation and media cleanup. After Milestone 4 acceptance, Milestone 5 focuses on content validation/authoring, another populated real project and CI build checks. Hosting/release remains later and requires its own authorization.


## 2026-10-27 — Content validation and authoring

**Babuni.dev direction:** Move forward with Content Validation and Authoring after positive interaction feedback.

Built: field-level catalog validation, build gate, blank templates and practical authoring instructions. Retained current JSON modules; MDX blocks are not implemented. Two populated projects and document-backed development modules already exist. Still open: editorial review of content/attribution, another real project if desired, CI/preview checks and controlled publishing. Device/accessibility acceptance items remain separately tracked.


## 2026-10-27 — Five more project portals

Built: five additional supplied portal images wired to their project tiles. Content editorial review and CI remain open; this asset assignment does not complete those milestones.


## 2026-10-27 — Framed detail reader

Built: user-requested framed square detail panel with visible grid surround, internal scrolling and fade/grow entrance. This replaces the opaque full-screen reader presentation. Babuni.dev visual/phone acceptance remains pending; content review and CI remain separate next work.


## 2026-10-27 — Hidden scrollbars

Built: user-requested hidden scrollbars across preview modules and detail reader; native scrolling retained. Physical-device review remains separate.


## 2026-10-27 — Repository-backed project documentation

Built: repository-backed documentation for all confirmed public matches, an explicit status for every current tile, source refresh/validation commands, and a coverage report. Public-only extraction was confirmed by Babuni.dev. Current coverage is 34 connected tiles via 33 public repositories; twelve unmatched, four private-review and three family clarifications remain. The shared journal reuses BABUNI.DEV; Rocketgame42 is reported without adding a new tile.

Milestone 5 now has real multi-project source content and validation; MDX blocks, CI/preview automation, controlled deployment, source editorial review and per-project content delivery remain open. Refresh is explicit and builds use the committed snapshot; automated upstream-triggered refresh is not implemented.


**2026-10-27 — On-demand source text and automated CI (post-build-warning refinement):** Babuni.dev supplied a successful prior local verification (92/92 tests, Astro build passed, zero npm audit vulnerabilities), with Vite warning about an initial >500 kB JavaScript chunk. Babuni.dev authorized the AI recommendation to split source documentation out of the initial bundle and add GitHub Actions. Implemented build-time per-document static Markdown files and a compact eager preview/intro index, leaving small/big bloom timing and content selection synchronous; full text loads in the reader on demand. Added offline export/content fidelity and error-path tests, and a read-only GitHub workflow for npm ci, grid tests and build. CI result, new bundle size and hands-on detail-reader behavior are still unverified at commit time; verify before marking performance work complete.


**Post-implementation CI feedback (2026-10-27):** New GitHub Actions was activated by commit `10c7249`; first run found 96 passing tests and one exact-intro-parity regression. Corrected double truncation in `moduleIntro` and updated the runner actions; await a green follow-up CI run and final static bundle-size inspection. This is an active fix, not grounds to declare the performance task complete yet.


**Post-change verification (2026-10-27):** GitHub Actions run on `3041e01` passed all **97** tests, content validation and production build. The reported Vite large-chunk warning remains; the next CI step will print detailed raw/gzip client bundle sizes before making further compression/splitting decisions. Maintain distinction between successful builds and unverified end-user load time.


**Performance verification checkpoint (2026-10-27):** GitHub Actions run on `a12fde3` passed **97/97 tests** and the production build. Measured output: **584.7 KiB raw / 174.0 KiB gzip** JavaScript in one chunk. The original >500 KiB warning persists; the exact original long documents are now separate, lazily loaded static assets. Next evaluate browser request timing and whether splitting the small preview/intro index by project materially helps; do not alter approved bloom behavior merely to suppress a build warning.


**2026-10-27 — Portal artwork blink at end of shift:** Babuni.dev reported a brief logo flicker when tiles reach their settled positions. Code inspection traced a likely cause to a post-shift `populate` remounting lazy portal images into fixed DOM slots. Implemented a source-aware permutation of existing DOM tile residents (including their loaded images) at shift settlement, with normal buffer recycling only offscreen. Added row/column/bloom-aware regression tests. CI and browser confirmation of no blink, overlap or identity regression remain pending; no change to the approved shift tempo.

**2026-10-27 — Original portal art migrated to WebP paths, pending binary push:** Babuni.dev reported they had already converted eleven portal PNG assets into WebP and supplied an additional BuxbrewResist emblem. Twelve `portalArtwork` entries now point directly to expected original WebPs. A local original-byte import/rename helper and tests were added. The separate local WebP binaries still require Babuni.dev's `git add -A public/portal-content`, commit and push. Until then, GitHub CI's content asset validation is expected to fail: this milestone is **code complete but not asset complete**. Verify 12/12 paths and portal visuals after the binary commit.


## 2026-10-27 — Complete supplied WebP artwork and retain reader attribution

Built: complete fifteen-image WebP migration, three additional project assignments and source/credit preservation during asynchronous reading. This closes the missing-artwork build failure and disappearing-footer findings from the preceding review. Physical phone/long-session visual acceptance remains separate; CI confirmation follows the published commit.


## 2026-10-27 — Render repository Markdown as document structure

Built: common Markdown/GFM formatting in detail, including emphasis, code, quotes, tables, nested/ordered/task lists and source-relative/reader-heading links. This addresses the reported raw-markup display problem. No MDX, math, raw HTML execution or automatic document-image loading is introduced. Existing physical-device and full accessibility acceptance tracks remain open.


## 2026-10-27 — Dismiss the reader from its surround

Built: requested outside-reader click/tap dismissal and removal of its Back to big bloom button, with Escape retained and accidental text-drag dismissal guarded. This is a navigation-control refinement, not another bloom depth or motion change. Native-phone and extended accessibility acceptance remain open.


## 2026-10-27 — Markdown at every reading depth

Built: Markdown formatting in small and big bloom previews, with bounded excerpts and shared safe rendering. Babuni.dev clarified that content completeness is secondary and ongoing, not an acceptance gate. Remaining functional/device/accessibility checks still matter independently of WIP content.


## 2026-10-27 — Direct discovery and persistent navigation

Built: site header in all four depths, Projects dropdown with search and direct center/open behavior, About introduction, and archive of all 19 available prior saved browser screenshots in Visual documentation. Future saved verification captures belong in that archive. Content remains living/WIP; physical-device and long-session acceptance remain separate.


## 2026-10-27 — Phone reader and activity refinements

Built from Babuni.dev’s actual-phone feedback: larger full-width phone reader, shrinking dismissal, centered contextual activity, shared header help and removal of redundant small-bloom Close. About is now a source-backed WIP with public profile links; richer personal history remains ongoing content authoring. Agent browser checks are separate from the next physical-phone acceptance pass. Existing grid tempo and four depths remain unchanged.

## 2026-10-27 — #28 documentation-audit checkpoint

**Already in main:** 53 provisional candidate tiles; 34 mapped tiles/33 public repositories; 15 original WebP portal artworks; moving/dragging recycled grid; small/big blooms and reader; safe Markdown previews; searchable projects/constant header; archived visual browser evidence. These source capabilities are **not** newly implemented by this audit.

**Reported latest historical verification:** The October 27 journal records **126 passing Node tests**, successful content preparation and production build, and browser checks of direct navigation after a stale buffered-project identity was corrected. It does **not** claim every test was rerun today or that the project has native-phone acceptance.

**Next integration step (not executed here):** Following the sequential documentation commits in other Babuni.dev repositories, explicitly review external source revisions, run `npm run content:sync`, `npm run content:check`, `npm run test:grid`, `npm run build` and `npm run content:report` (or inspect the resulting report) before committing revised imported document snapshots. Verify source/credit references, no invented data, and unchanged project placements. Auto-sync on page load or unreviewed network fetching is **not** approved.

**Still open:** genuine mobile and keyboard/reduced-motion acceptance, long-session behavior, initial bundle-size warning, publication-content editorial approval, hosting/deployment on the intended VPS, and license selection. Do not turn “finish all 53 portfolio articles” into a release gate: Babuni.dev specifically described content as a living/WIP project.

## 2026-10-27 — WebP publishing consistency

Built: all published images use WebP, including gallery screenshots and video posters; image format/signature checks prevent regression. Existing converted media set is 31.5% smaller before adding this session’s verification capture. Originals remain outside publication. Actual phone acceptance remains a separate track.


## 2026-10-27 — Desktop motion investigation

Built: eliminate press-induced shift freeze, gradually brake active shifts only during actual dragging, cache repeated source/vacancy mappings and avoid redundant writes. Tests preserve normal tempo and geometry. Desktop smoothness remains open: local frame samples contain occasional longer gaps and do not establish a universal FPS improvement. Continue targeted desktop acceptance; do not mask stutter by speeding up or retiming approved transitions.


## 2026-10-27 — Human desktop feedback and recommended next acceptance work

**Babuni.dev reports:** Movement feels smoother after `cfd4c25`. This is positive desktop feel feedback, not an exhaustive performance or long-session sign-off.

**AI recommendation, not yet authorized implementation:** Next verify keyboard/focus/reduced-motion navigation across all four depths, plus extended grid recycling/project identity. Keep the revised phone reader acceptance open. Then prepare controlled preview/staging deployment and release checks. Content stays ongoing secondary work; no new visual redesign or timing changes are implied.


## 2026-10-27 — Keyboard scope clarified by Babuni.dev

Built: replace free arrow panning with highlight-first spatial navigation, center entry, explicit Space/Enter activation and one-depth Escape/focus return. Header navigation remains conventional. Browser sampled the full grid → small → big → reader → big → small → grid sequence and header project search. This implements the requested model, not a claim of exhaustive keyboard/accessibility acceptance. No new pointer or motion tuning is implied.

## Browser branding refinement — 2026-10-27

Built at Babuni.dev’s request: toolbar disabled and graphic-only transparent B favicon installed. Tests/build and page DOM checks passed; human confirmation of browser-tab appearance/cache refresh remains open. This refinement does not close other milestone acceptance or content work.


### Header B mark — 2026-10-27

Babuni.dev additionally requested the B to the left of BABUNI.DEV in the persistent header, using WebP, and explicitly authorized committing, pushing, updating and restarting the local site for future changes. AI reused the transparent 64×64 favicon at 32×32 CSS pixels, with fixed dimensions and decorative empty alternative text beside the existing accessible brand name. This adds no image duplicate or interaction changes.

## Reader navigation refinement — 2026-10-27

Built: reader-only frameless position thumb with direct dragging, overflow updates and keyboard support. Desktop browser dragging and Home verified; physical-phone dragging, long-gallery edge cases and human acceptance remain open. Content remains a living work in progress; this addition does not close unrelated milestone acceptance.

## Latest acceptance and long-session follow-up — 2026-10-27

**Human accepted:** keyboard round trip for shipping; frameless reader handle; reader scrolling works well. **Human observed:** Firefox works and feels better than Chrome; general long-running dragging can become less smooth. Earlier generic keyboard-pending notes are historical; exhaustive screen-reader coverage is still separate. Do not infer new phone acceptance from unclear speech.

**Built:** retained bounded source cache, individual LRU eviction, vacancy-free history fast path, long-history/eviction tests and a calculation benchmark. All checks passed locally; user long-session acceptance remains open. Reduced-motion, long-gallery edge cases, heap/load profiling and full cross-browser/fullscreen acceptance remain checks, alongside hosting/release work. Content completion remains secondary.
