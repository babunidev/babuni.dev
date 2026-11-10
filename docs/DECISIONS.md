# Design and Engineering Decision Register

This register records **why decisions were made**, what alternatives were considered, who directed the choice, and which questions remain open. It is not a running change log or a replacement for the development journal. Technical entries use a neutral reference voice; first-person passages preserve the human creative's perspective and distinguish AI proposals or execution.

**Decision statuses:** **Accepted** (explicit creative approval), **Proposed** (not approved), **Experimental** (being evaluated), **Superseded** (replaced by a later decision), and **Open** (unresolved). Implementation and verification are separate: an accepted decision may be unbuilt, and a committed implementation may still need browser or device testing. Retrospective entries identify reconstructed context rather than inventing missing conversations.

**Reading the history:** Numbered early decisions and later date-based entries coexist; section order is not a reliable current-priority list. Superseded designs remain as evidence of the process. Consult [Concept](../CONCEPT.md) for the lasting vision, [Design](DESIGN.md) for intended behavior, [Changelog](../CHANGELOG.md) for committed changes, and [Development journal](DEVLOG.md) for the fuller human–AI narrative.

## Adding or revising a decision

Give the decision a date or stable identifier, status, human direction, alternatives (mark AI-originated suggestions), rationale, and relevant evidence. Keep entries focused on choices rather than reproducing test logs or entire conversations. When a choice changes, identify the successor and mark the old decision **Superseded**; never silently erase its original rationale.

## D-2026-11-10 — Folder modules for any repository, with paired images
**Status:** Accepted creative direction; implemented, not yet visually accepted on the live site.
**Creative direction:** Babuni asked for every new public repository to be on the website, and for repositories with folder structures to get folder modules like Amberbrew Story's, where a folder opens and its files can be read. An image with the same name as a Markdown file is shown centered above it, with the file name centered as well, so a list reads image, document, image, document. Small icons keep their size; larger images scale to the module or reader they appear in. Images may appear in the small bloom too.
**AI implementation:** Folders are opt-in per repository (`folders` in `project-repositories.json`), so existing projects do not change. `docs` is excluded because its standard documents already have their own modules. AmberbrewStory keeps its reviewed folder list. Paired images are WebP, PNG or JPEG, are converted to WebP at pull time and stored under `public/media/repositories/`. Unpaired images are not imported. Without images, a folder keeps its earlier plain list (AI choice, so the approved look of Amberbrew Story's folders does not change).
**Babuni decided (2026-11-10):** `wowforeveraddonsbabuni` must not be published on the website; AI had held it back because it is mostly other authors' addons. Later the same day, Babuni also withdrew WoW Forever Talent Design Atlas (`wowforeverstuff`) and removed both repositories from GitHub, so that only projects meant for publication remain.
**Open:** No connected repository contained paired images at implementation time.
**Evidence:** `src/lib/repository-content.ts`, `scripts/sync-repositories.mjs`, `scripts/pull-repository.mjs`, `src/scripts/module-preview.ts`, `src/scripts/module-detail.ts`, `tests/folder-modules.test.mjs`, fixture capture in `docs/VISUAL_DOCUMENTATION.md`.

## D-2026-10-30 — Per-visit assortment and recent activity
**Status:** Accepted creative direction; highlight window and count provisional.
**Creative direction:** Always start with BABUNI.DEV first, freshly shuffle the other projects for each visit, and mark recently updated tiles with a gold top-right label and an extra gold portal ring instead of placing them first.
**AI implementation:** One shuffle per page load; stable semantic identity throughout grid shifts. Validated public commit dates determine activity markers. AI chose at most five projects committed within fourteen days; this exact definition of "recent" remains open to refinement.
**Evidence:** `src/lib/grid-projects.ts`, `src/lib/project-activity.ts`, `src/scripts/grid.ts`, `src/pages/index.astro`; browser outcome unverified.

## D-2026-10-30 — Babuni identity and centerless help language
**Status:** Accepted creative direction; later source changes are recorded, but browser acceptance of that particular update was not verified.
**Creative direction:** Babuni is the overarching person/creative identity; babuni.dev is the development portfolio, not the person's name. The endless shifting grid has no fixed conceptual center, and the help interface should not promise a return to one.
**Decision:** Use Babuni as the public-facing first-person name in About, retain babuni.dev for the site/project, structure help by task, and remove its Return to center control. Internal viewport-relative coordinates do not imply a permanent world center.
**AI contribution:** Drafted personal text based on known public creative work and changed source content and help wiring. Unverified external destinations must not be invented.
**Evidence:** `src/content/about.md`, `src/pages/index.astro`, `src/scripts/grid.ts`; connector commits dated 2026-10-30. Build and browser behavior not retested.

## D-001 — Projects over chronological blog
**Status:** Accepted · **Source:** retrospective conversation, October 2026  
**Babuni.dev direction:** A playful portfolio of works, including WIP, rather than a linear blog.  
**Decision:** Project-focused discovery is the primary navigation; the journal is part of each project's history.  
**Rationale:** Visitors discover creative objects first and read chronology where useful.

## D-002 — Shared content model, flexible modules
**Status:** Accepted  
**Babuni.dev direction:** Each project can carry very different kinds of media and descriptions.  
**Decision:** Reusable module types with conditional layout, not one fixed article template.

## D-003 — Stone tile and colored portal
**Status:** Accepted, visual details experimental  
**Babuni.dev direction:** Engraved title, central recessed portal, personal stylized stone design, project-dependent carving.  
**AI alternatives explored:** Historical-looking masonry, deeply ornamented fantasy relics, a scenic background.  
**Decision:** Minimal original stone surface and colored portal; no scenic background behind full-screen grid.

## D-004 — Point-origin information bubbles
**Status:** Superseded in point count and discovery trigger by D-026 (2026-10-26); non-navigational, bounded information intent remains accepted  
**Babuni.dev correction:** Bubbles describe the project; they are not navigational shortcuts.  
**Decision:** Four contextual lights emit bounded holographic snippets with random, point-hover, and linger behaviors.

## D-005 — Layered discovery
**Status:** Accepted  
**Babuni.dev direction:** Click to inspect; click selected tile again to commit; click modules for detail.  
**Decision:** Grid → small bloom → full bloom → expanded module.  
**Rejected:** Wheel gestures as the main method of opening because they conflict with reading.

## D-006 — Spatially honest small bloom
**Status:** Accepted  
**Babuni.dev correction:** A module claims the space of an adjacent cell; its original tile moves away.  
**Decision:** Small bloom reserves grid cells and displaces physical neighbors rather than stacking freely overlapping panels.

## D-007 — Full bloom is a focused project world
**Status:** Accepted  
**Babuni.dev direction:** Other projects should disappear while in full bloom. The originating tile remains the central anchor and exit; content uses simple frames.  
**Decision:** One project at a time, with independently expandable preview modules.

## D-008 — Grid line shifts and initiative
**Status:** Experimental  
**Babuni.dev direction:** Slow shifts of whole rows/columns, with random d20 eligibility and initiative bonuses.  
**Decision:** Prototype this system. Final bonus distribution, scheduling and conflicts remain open.

## D-009 — Endless recycling
**Status:** Accepted concept; algorithm open  
**Babuni.dev direction:** Dragging should never reveal a grid edge; offstage tiles reappear ahead, repeated projects allowed when necessary.  
**AI proposal:** Toroidal coordinates and a buffer; distinct logical project IDs and visual instance IDs.  
**Decision:** Implement recycling early and test its interaction with row/column shifts and blooms.

## D-010 — Progressive center-out appearance
**Status:** Accepted concept  
**Babuni.dev direction:** Show center immediately, materialize outward, preload only nearby buffer and relevant assets.  
**Decision:** Avoid compulsory blocking loading screen; lazy-load heavy content.  
**Open:** Buffer policy and prioritization should be performance-tested.

## D-011 — Astro foundation and interactive island
**Status:** Astro accepted and committed; interactive framework Proposed  
**Babuni.dev direction:** Cloud-first development, local testing, future local agents.  
**AI recommendation:** Astro with TypeScript and possibly Svelte for the grid.  
**Decision:** Astro is chosen; Svelte remains a candidate and is not installed or implemented in the reviewed repository.
**Verification update (2026-10-26):** Foundation integrated on `main` in `5902121`; independent starter build passed against `ea90117`. This updates implementation evidence without changing the framework decision.

## D-012 — The site documents itself
**Status:** Accepted concept  
**Babuni.dev direction:** The website must exhibit its own development history, possibly as the central initial tile.  
**Decision:** The website is eligible as its own portfolio project. Default tile placement remains experimental.

## D-013 — Human–AI provenance is core documentation
**Status:** Accepted  
**Babuni.dev direction:** The creative record must show what the human asked or corrected, and what AI did in response.  
**Decision:** Distinguish Babuni.dev requests, AI proposals, Babuni.dev decisions, executed changes, and verification; see docs/AI_COLLABORATION.md.  
**Constraint:** Never fabricate missing conversations or publish sensitive raw transcripts.

## D-014 — Main-only development workflow
**Status:** Accepted · **Date:** 2026-10-26
**Babuni.dev direction:** Development should take place directly on `main`, not through a branch-and-PR routine.
**AI contribution:** Initially prepared a separate documentation branch for safety, then honored Babuni.dev's correction and supported integrating local Astro work with repository documentation on `main`.
**Decision:** Make direct `main` updates the default. Remain careful with local uncommitted work and use explicit approval before deployment or destructive operations.
**Verification:** Merge commit `5902121` was pushed by Babuni.dev and verified on GitHub. The branch workflow was superseded for future changes.

## D-015 — Start from screen-center; free map-like dragging and recycled DOM cells
**Status:** Accepted interaction; responsive size values initial · **Date:** 2026-10-26
**Babuni.dev direction:** The initial layout must have one full tile exactly at screen center, regardless of desktop, tablet or phone size, with a perfectly top-down wall of squares. The grid should respond to holding and dragging with the mouse or swiping with the thumb, as in Google Maps. Tiles leaving an edge should be reused just beyond the opposite edge, keeping the visual field continuous without accumulating unlimited new tiles.
**AI contribution:** Suggested viewport-centered logical coordinates, a 240/200/phone-relative CSS-pixel scale based on approved mockup size, and a fixed DOM tile pool with two offscreen buffer bands. Interpreted recycling as reassigning visual element positions, not destroying project identities or keeping an infinite history of mounted nodes.
**Decision:** One centered initial tile, unbounded free pan, automatic offscreen tile reuse, no row/column fitting constraint. Motion inertia remains an open future option, not an accepted requirement.
**Implementation and verification:** First provisional Astro/TypeScript prototype; five geometry tests and isolated Chromium layout/drag checks passed. Full Astro build and real phone/tablet touch tests are not yet verified.

### D-015 verification addendum — First desktop hands-on approval (2026-10-26)
Babuni.dev ran the Astro prototype locally, confirmed all five unit tests passed, and tested dragging on their desktop. They found the starting tile centered, the mouse-following motion smooth and natural, and the grid apparently endless when pulled repeatedly in all directions. After briefly questioning its speed, they explicitly approved the current feel. The temporary recenter button was identified as something that may be removed later, not an approved removal. Desktop manual interaction is accepted; mobile touch and other outstanding tests remain open.

## D-016 — First autonomous shifting experiment

**Status:** Experimental, pending Babuni.dev review · **Date:** 2026-10-26

**Babuni.dev direction:** After confirming the map-like desktop dragging feels right, Babuni.dev asked to proceed with slow autonomous rows and columns. They preferred to prioritize desktop for now while also exploring Wi-Fi access to the local site from a phone.

**AI contribution:** Implemented a prototype of the previously discussed axis selection, d20 threshold, and initiative modifiers; chose provisional timing (6.5 seconds first delay, 4.4 seconds shifting, 8 seconds between rounds) and randomized line direction. Proposed pausing animation during manual dragging so the already-approved camera movement does not change.

**Accepted:** Existing manual drag behavior must remain intact. **Not yet approved:** exact timing, frequency, multiple simultaneous line shifts, direction distribution, and final initiative bonuses.

**Verification:** Pure shift rules passed local seeded tests, TypeScript strict checking passed, and isolated Chromium checks exercised movement, drag pause/resume, and reduced-motion preferences at desktop and phone-sized viewports. Full Astro build, extensive stress testing, and physical phone use still await verification.

## D-017 — Restrained directional shifts and velocity-controlled manual navigation

**Status:** Babuni.dev-requested refinement implemented provisionally; tuning values experimental · **Date:** 2026-10-26

**Babuni.dev direction:** After the first autonomous shift prototype, Babuni.dev reported that multiple rows moving in the same direction resembled a single large moving block and expressly required that no two rows shift in the same direction simultaneously. Separately, they described arrow-key navigation as too fast and asked for slower, smoother controls. Mouse movement should accelerate briefly but settle at an adjustable normal maximum speed, below fast mouse travel.

**AI proposal:** Give the first successful dice/initiative roll for each direction exclusive movement rights within that round. Apply the equivalent no-two-same-direction restriction to columns; the latter is a design extrapolation to be confirmed. Replace fixed arrow jumps with frame-driven velocity and add bounded, accelerating cursor following with tunable speed caps.

**Current prototype:** At most one leftward and one rightward row, or one upward and one downward column, can shift per round. Preliminary pointer cap is 440 CSS px/s, key cap 130 CSS px/s, and pointer backlog is limited to 180 CSS px. These constants are not Babuni.dev-approved final values. Existing shift timing and d20 rules remain experimental.

**Verification:** An isolated equivalent revision passed 18 local tests, a strict TypeScript check, and desktop/phone-sized Chromium previews for movement and reduced motion. A full local Astro build and Babuni.dev hands-on evaluation remain outstanding.

**Documentation material:** Babuni.dev intends to supply images and videos in `Visual Documentation Material` for visual development evidence. No assets were added or reviewed in this implementation.

### D-017 speed adjustment — 2026-10-26

**Babuni.dev direction:** Make current manual movement twice as fast. **AI implementation:** Doubled mouse/touch and keyboard maximum speeds, acceleration, and keyboard deceleration. The unchanged 180 CSS px cursor-lead limit prevents additional catch-up lag; autonomous shifts remain at their previous pace. **Status:** Committed as a tuning experiment; Babuni.dev review pending.

## D-018 — Spiral-first project residency and visibility-dependent reuse

**Status:** Babuni.dev-approved design requirement; implementation awaiting Babuni.dev acceptance · **Date:** 2026-10-26

**Babuni.dev direction:** BABUNI.DEV must be the original centered project, followed clockwise around it by PROJECT 02 above, PROJECT 03 upper right, 04 right, 05 lower right, 06 below, 07 lower left, 08 left and 09 upper left; PROJECT 10 starts the next ring above the center. Projects should retain their identities while in view, and only be reused after leaving view (ideally after a two-tile offscreen grace period). Babuni.dev observed unwanted duplicates on the same desktop screen and BABUNI.DEV never reappearing during extended exploration. When clarified that the screen can hold more tiles than available project records, Babuni.dev rejected neutral/filler tiles and expressly accepted **repetition as necessary**: fill the entire screen, place originals first in the spiral, and avoid visible duplicates as soon as enough distinct projects exist.

**AI diagnosis:** The original code recycled a finite pool of DOM tile elements but assigned placeholder content using a repeating coordinate hash. It did not manage which project identities remained visible or reclaim content from out-of-view positions.

**Implementation:** A dedicated `ProjectPlacement` manager allocates real project indices to original logical tile coordinates, prioritizing existing visible residents and unique projects, then repeating when unavoidable. Project allocations are retained in a two-cell buffer and reclaimed beyond it. When exactly enough projects are available for visible tiles, the no-visible-duplicate rule takes precedence over a strict two-cell reuse delay. Shifts continue to resolve their source identities through the ordered line-shift history. At startup, the exact clockwise spiral determines which projects are assigned first. The twelve placeholders have been renumbered PROJECT 02–13, with BABUNI.DEV treated as index zero.

**Alternatives not chosen:** Empty neutral stone placeholders; arbitrary hash-based repeated project placement; changing visual tile size to force available projects to fit.

**Verification:** Ten isolated pure TypeScript/Node placement tests passed, including five-project repetition, enough-project uniqueness under panning and a synthetic moved row. Babuni.dev browser acceptance and a full Astro build remain open.

### D-018 — Testing the spiral with 45 identities (2026-10-26)

**Babuni.dev request:** Increase the temporary project collection to 45 to verify the full desktop layout can avoid duplicates. **AI implementation:** BABUNI.DEV plus PROJECT 02–45, preserving the clockwise spiral and adding explicit initial desktop uniqueness tests. **Caveat:** Panning sometimes increases the count of partially visible cells beyond 45, so occasional repetition remains allowed. **Status:** Implemented for hands-on testing; not yet visually accepted.

## D-019 — Reserve a moving tile's project identity before its animation (2026-10-26)

**Babuni.dev direction:** Project number and color must not abruptly switch while a tile is entering the viewport during an autonomous shift. Babuni.dev observed the problem particularly for left-to-right entry, and possibly bottom-to-top entry.

**AI diagnosis and decision:** The end-of-shift visibility allocator can reassign an incoming source that was provisionally filled with another identity during movement. Stage an arrival's final project before animation, prioritizing an existing nonconflicting identity or otherwise the project's identity leaving the opposite edge. Do not change currently visible source assignments while staging. This preserves Babuni.dev's clockwise spiral and offscreen reuse goals.

**Status:** Code and regression tests committed for evaluation; local browser reproduction and Babuni.dev visual acceptance pending. Temporary duplicated partial-edge tiles during a shift may be unavoidable when all resting visible project identities are in use.

## D-020 — A staged clockwise entrance, not artificial loading (2026-10-26)

**Babuni.dev direction:** Instead of having an already-fast page simply pop up, reveal BABUNI.DEV first and then the numbered projects along the clockwise spiral. Each tile should appear at its final cell by quickly growing into position, with **373 ms** as a suggested per-tile duration.

**AI implementation choices:** Use a CSS scale/opacity introduction lasting 373 ms, with a preliminary 68 ms start-to-start stagger, slight overshoot, and no actual loading delay. Apply the effect only to initially visible tile faces, never to newly recycled offscreen tiles, so the established row/column transform animation remains independent. Cancel if the visitor navigates or the layout changes; skip it for reduced motion.

**Status:** Implemented prototype pending Babuni.dev visual approval. The stagger, easing and overshoot are experimental; the initial spiral and existing movement timings are unchanged.

## D-021 — Provisional real project names in the grid; functionality before final portal art (2026-10-26)

**Babuni.dev request and decision:** Use all 53 named candidates gathered into the repository inventory as a playful visual prototype, rather than retaining generic PROJECT NN placeholders. Keep the initial BABUNI.DEV tile, the clockwise spiral and existing movement. No artificial filler projects are needed at this count. Preserve the inventory's one-line information for future use. Prioritize implementation of functional milestones before treating unique finished portal textures as a requirement; final art remains optional/deferred, not prohibited.

**AI contribution:** Snapshot the inventory's order, candidate titles, brief descriptions and evidence classes into stable provisional project records. Keep temporary colored portals and adapt title typography only for long names. Maintain explicit separation between a mechanically represented candidate and a verified portfolio exhibit.

**Status:** Prototype content integration committed, awaiting Babuni.dev visual review. Individual project identities, relationships, assets, rights and publication claims are not yet verified or approved.

## D-022 — First portal-region information point, not a marketing tooltip (2026-10-26)

**Babuni.dev decision:** The small square above the portal should glow and reveal one tiny bubble containing a subject/category, not a longer description or promotional text. Interaction is limited to the circular **portal region** within each tile, not the whole stone. More meaningful topics may later be curated from project descriptions, development logs, and other reliable sources; the selection method is still open.

**AI prototype:** Hand-curate one tentative category for each of the 53 provisional candidates; give the portal a hover, keyboard-focus and stationary-tap trigger; reveal the bubble beside the glowing top marker and keep the contents within tile bounds. Dismiss on leaving/dragging/recycling or selecting a different portal; ensure only visible portal instances can receive keyboard focus. This builds on the existing texture/portal prototype and does not need final art.

**Alternatives not adopted now:** Displaying the entire one-line summary on hover; activating from the entire tile; four simultaneous bubbles; automatic extraction from unscreened texts; new final textures before functionality.

**Status:** Prototype implemented and ready for local tests/Babuni.dev visual review. Topic wording, UI styling, and future keyword extraction are provisional; three other points, automatic teasers and bloom selection remain unimplemented.

## D-023 — Selection centers before bloom; occasional topic teasers (2026-10-26)

**Babuni.dev direction:** Clicking a tile anywhere on screen moves the entire grid so the selected tile occupies the center. Only after arriving does a neighbor vacate a real cell for small bloom. Existing tiny information bubbles may also appear spontaneously, subtly and sporadically.

**Provisional AI solution:** Stone-select button (portal retains topic-only behavior); stable source-cell identity pin; 720 ms camera easing; translate the whole right-hand row segment by one tile over 520 ms; reveal one adjacent summary module and close on Escape/Close/selected tile. Freeze automatic shifts during the bloom; finish already-running shifts before centering. Ambient hint after randomized 6.5–10.5 s wait, visible for 1.7 s, only when idle and not under reduced motion.

**Status:** Prototype implemented for Babuni.dev testing. Directions and timing are not yet visually accepted; the center-before-bloom order and spontaneous hints are Babuni.dev-established requirements.

Accessibility refinement: keyboard-visible focus on a project control suppresses ambient hints, while stale pointer focus on that same control should not prevent them indefinitely.


## D-024 — Five-second ambient hints inside the comfortable viewport (2026-10-26)

**Creator approved:** Center-first motion and physically freed neighboring cell feel good and deliberate.

**Creator requested:** Make little unsolicited topic bubbles more noticeable, at roughly five-second intervals, and do not waste them on barely visible offscreen/corner tiles.

**AI implementation:** Preserve the next due time across busy shifts, with a 600 ms retry; require fully visible tile bounds inside edge/header/footer margins; remove suppression caused by passive grid focus or stale pointer focus; prefer a different project from the previous hint. Continue to defer hints during actual interaction, line movement, bloom, page-hidden and reduced-motion conditions. Keep 1.7-second duration and a single bubble.

**Status:** Implemented and documented; creator has not yet confirmed the revised hint frequency or placement. Values other than the approximately five-second request remain provisional.


## D-025 — Visitor priority and concurrent shifts around an open bloom (2026-10-26)

**Babuni.dev direction:** The grid continues to live while a project is bloomed. Other rows and columns can shift as long as the selected tile and reserved neighboring bloom space remain safe. Clicked moving projects become golden immediately and wait for their own shift to settle; unaffected projects center without waiting, pausing unrelated motion during the camera movement. Switching projects closes the old bloom before moving to the new one.

**AI implementation:** Queue the original source/project ID, and highlight the queued choice just like an active selection. When an active shift touches the selected row, selected column or right-neighbor bloom column, wait for that shift's completion. Otherwise pause the shift, center the camera and resume when the bloom has opened. Continue dice-selected shifts during bloom while protecting the selected row and two directly occupied columns. For further-right columns, vertically entering/leaving the translated row interpolates the bloom's horizontal offset, allowing movement on both sides of the selected project. Close the old bloom over the existing 520 ms before centering a replacement project. Scope bloom-only CSS easing to its actual displaced tiles.

**Alternatives considered:** Freezing every line during bloom (existing behavior, rejected by the creator); blocking all right-hand columns (early AI safety idea, superseded before implementation); allowing right columns to cross without a sideways interpolation (would produce abrupt x jumps); forcing all clicks to wait for any unrelated shift (rejected by the creator).

**Status:** Prototype changes and focused regression tests prepared for review. Browser/device observation of concurrent movement and complete end-to-end test verification are pending.

## 2026-10-26 — Straight visual-column shifts and second vacancy

**Status:** Implemented AI interpretation of Babuni.dev's requested mechanics; visual acceptance and final metadata choice open.

**Babuni.dev requested:** Occupied-column movement, expansion conflict serialization, immediate drag-to-close, persistent unrelated hover topics, square-top bubble alignment, and a lower small-bloom module.

**AI proposed/implemented:** Reversible row vacancy insertion with shift events recording the layout in which they occurred. Both reserved rows push contiguous runs right. Columns select actual visual occupants; protected lines cannot enter reservations.

**Alternatives:** Retain sideways offset interpolation (rejected by Babuni.dev's reported zigzag); suspend all right-side columns (simpler but prevents requested living straight-column motion); add per-tile diagonal detours (unnecessary complexity and contrary to direction); displace the lower column downward (valid alternative but requires a second displacement axis). Chosen row insertion uses one reversible geometry primitive for both vacancies and future larger sets.

**Closing alternative:** Immediately remove geometry mid-shift would invalidate visual line membership. AI instead finishes the straight event in a shortened ~520 ms interval before collapse; panning starts immediately. This timing and metadata content remain revisitable AI choices. No claim of human acceptance or production deployment.

## 2026-10-26 — Let topic bubbles spread beyond tiles

**Status: Babuni.dev decided; implemented, aesthetic acceptance pending.** Babuni.dev corrected the tile-containment assumption and requested outward wings, specifically bottom-right anchoring for the left bubble. AI chose a centered top bubble and shared content-sized typography. Alternatives were keeping tile bounds or shrinking the right bubble; both conflict with the revised direction. Bubbles overlay tiles without moving them, unlike physical bloom modules. CONCEPT and current DESIGN rules now reflect this explicit revision. Edge flipping/repositioning remains unimplemented and revisitable.

## 2026-10-26 — Random sequential topic wings

**Status:** Babuni.dev requested ordered organic appearance; implemented, pacing acceptance open. AI interpreted “next one and next one” as cumulative reveal: retain earlier bubbles instead of replacing them. A fresh shuffle avoids fixed top/left/right ordering and reveals each exactly once. AI chose 260–420 ms gaps. Alternatives: simultaneous appearance (superseded by human feedback), fixed stagger (does not meet random order), one-at-a-time replacement (not chosen; can revisit). Existing single-point ambient behavior is unchanged.


## D-027 — Unified portal size and symmetric indicator positioning (2026-10-26)

**Status:** Babuni.dev-directed visual consistency change, implemented for review; final positioning not visually accepted.

**Babuni.dev direction:** Every square project tile should show one uniform portal diameter, averaging the previous two sizes. Move the three little glowing indicators outward so no portal covers them, with identical distance to the portal center for top, left and right. A prior rectangular AI diagram should not be mistaken for the square tile design. This developer is to make and commit the change directly to GitHub while other development can continue separately.

**AI choice:** Replace the 59%/53% portal difference with one 56% square-aspect circular portal. Create a shared `.tile-portal-cluster` coordinate frame, placed at horizontal 50%, vertical 45% of the square tile to leave title room. Place the three seven-pixel rotated square indicators just beyond the portal rim with a common six-percent-of-tile clearance. Keep topic wings attached to their indicator origins and long-title typography independent of portal diameter.

**Alternatives:** Setting all circles to the same width without grouping indicators was simpler but would retain inconsistent radial alignment; varying portal size to accommodate long text was explicitly rejected. **Open:** visual fit of very long titles on phone-sized tiles and precise glow/frame clearance require real rendered checks.

## 2026-10-26 — Preserve established feel; remove accelerated shift completion

**Status: Babuni.dev decided; implemented, further visual acceptance open.** Babuni.dev rejected the AI-added accelerated finish when selecting/switching projects and explicitly asked that every active shift finish at its normal calm tempo before opening. Babuni.dev also asked agents to propose and ask before independently changing established timing, positioning or other approved behavior. This standing instruction is now in AGENTS.md.

**AI correction:** Remove duration overrides, queue all selections through normal completion, scope bloom transitions to actual opening/closing, and check visibility in occupied visual coordinates. Centering, expansion/return, manual-pan tuning, dice rules and topic timing were not retuned.

**Alternatives:** Babuni.dev explicitly permits fading occupying tiles out and content in if displacement cannot be made reliable. AI retained displacement after finding a concrete transition lifecycle defect; pure coordinate reassignment was already represented by visual occupancy/history, while CSS erroneously animated committed slot resets. No global suspension or diagonal detour is added. This preserves the currently liked spatial behavior without claiming that all future full-bloom states are tested.

## 2026-10-26 — Acknowledge queued actions without changing motion

**Status: Babuni.dev requested; implemented, final feel acceptance open.** After reporting smooth movement in both directions and natural waiting/closing, Babuni.dev requested a waiting pulse. AI implemented opacity-only gold outline feedback instead of scaling the tile or changing shift speed. A 1600 ms cadence is an AI implementation choice within the requested pulse; established movement/positioning remains intact. Reduced motion uses a steady indication.

**Portal image decision:** Babuni.dev requested the supplied square logo behind a circular opening. AI retained the PNG unchanged, used centered cover with a round clip and overlaid rim, and tied it to semantic project identity. Alternatives were JPEG conversion (unnecessary quality loss for the supplied logo) or editing the original into a circle (would discard source corners). CSS clipping preserves the source and existing portal size. No animated image motion or repositioning was added.

## 2026-10-26 — One tile, one action

**Status: Babuni.dev requested; implemented, device acceptance open.** Babuni.dev explicitly replaced separate portal/topic and tile/selection actions with one tile-wide control. AI kept the existing full-face select button, made the portal decorative, routed hover/focus through the tile, and retained click/tap/keyboard selection plus drag discrimination. An overlay button avoids nested buttons and gives one accessible action. Keeping two controls or requiring a first portal tap for topics would conflict with the user’s usability direction. Established timing/positioning and image masking are preserved.

## 2026-10-26 — Mobile center discovery and persistent blooms

**Status: Babuni.dev explicitly decided; implemented, native-device acceptance open.** Centered-tile topic discovery replaces the need for mobile hover/long press. Keeping a bloom open while panning deliberately reverses the earlier human drag-to-close request; it is not an AI-originated change to that approved behavior. Babuni.dev’s newer direction prioritizes readability and control.

**AI implementation choices:** Detect primary coarse/no-hover input rather than shrinking the desktop window; use the physically covering tile rather than logical source coordinates or the nearest tile. A center over a module/empty reservation has no topic owner. Preserve the current random reveal order/timing and suppress competing ambient hints on mobile. Store bloom geometry independently of DOM recycling and retain its source until closure. Alternatives were long-press/two-step touch discovery (not desired by Babuni.dev), width-only detection (would alter narrow desktop interaction), or closing/reopening offscreen blooms (contrary to persistent panning). No responsive size, motion speed or bloom arrangement retuning.

## 2026-10-26 — Architecture before polish; specify modules together

**Babuni.dev decided:** Current mobile feedback comes from real phone testing, functionality is satisfactory for this stage, and architecture/underlying structure takes priority over polish. Discuss module families before implementing full bloom. AI’s earlier resize/focus-first recommendation is not the chosen immediate work sequence.

**Babuni.dev requested and implemented:** Suppress redundant topic bubbles only on the tile with an open bloom. Preserve normal topics elsewhere, including other instances of that project.

**AI proposed, approval open:** Five module families—text, image collections, media, development history and resources—with shared identity/preview/source/provenance fields, reusable detail views and layout kept separate. Alternatives are bespoke renderers for every concept/devlog/architecture label or a fixed identical module set for all projects; the draft favors reuse and optional content. These family boundaries, module selection and layout are explicitly not locked.

## 2026-10-26 — Populate and sample the small-bloom preview layer

**Babuni.dev decided:** Small-bloom modules first, real image/video support now, a full content set for BABUNI.DEV and five for Button Game, empty definitions omitted, up to nine displayed from an arbitrarily larger content set, randomized sequential reveals and a random subset when needed. They confirmed working bubbles and phone orientation in actual use, while deferring polish.

**AI interpretation/implementation:** Nine previews in addition to the project anchor. Use its eight neighboring slots plus one adjacent cell to the right when a ninth is needed, retaining the original right/below first slots for sparse projects. Clear the complete sampled footprint before revealing it to avoid constantly retargeting moving tiles. Keep the existing expansion duration and use the existing topic stagger range for the newly requested sequence. A left/right split of each row keeps the project centered with invertible visual occupancy. Alternatives were nine total cells including the project (would allow only eight previews), overlapping panels (contrary to physical vacancies), or sequential displacement for each reveal (would repeatedly alter geometry).

The initial five editorial families reuse four renderer types: journal/history is a text role; image gallery, video and resources have their own previews. Button Game summaries use verified public project docs rather than invented media. Originals stay local; selected, compressed web derivatives are versioned under public/media. Native video loads only after deliberate interaction; external player frames require Load video.

**Still open:** Babuni.dev considered both a left-content/right-module selection layout and larger scrollable full-page modules. Neither is locked by this implementation. Full-page expansion, enlarged text readers and final full-bloom navigation remain the next design/implementation layer. No unrelated positioning, tile size or shift-speed retuning.


## 2026-10-26 — Button Game portal artwork

**Status: Implemented. Babuni.dev direction:** Use the supplied Button Game logo. **AI implementation choice:** Optional `portalArtwork` on stable project catalog records rather than another renderer-specific project-ID branch or automatic folder discovery. Missing artwork keeps the existing color fallback. Revisit automatic authoring only if requested.


## 2026-10-26 — Eight modules around the center

**Status: Implemented; supersedes the earlier nine-preview interpretation. Babuni.dev decided:** Up to eight surrounding previews plus the center project form a 3×3 square. **AI execution:** Cap eight and delete the extra slot at (2,0). Keep random sampling from larger populated catalogs and the same reveal timing; fewer populated modules still reserve fewer cells.


## 2026-10-26 — Draggable big bloom and module detail

**Status: Implemented, human-confirmed.** Enter big bloom by activating a small-bloom module/Read more; land on its intro, then activate again for detail. Small-bloom center tile remains close. Big-bloom project portal sits at top left and returns one step to centered small bloom. Detail Back/Escape returns to the same big-bloom camera. This supersedes previous second-center-click entry and full-bloom-to-grid descriptions.

**Babuni.dev decided:** Drag navigation in big bloom; normal scrolling in text detail. All populated modules appear progressively, not just the eight sampled previews. One Videos collection per project. YouTube migration is deferred until links exist.

**AI implementation choices:** Separate modal project field over retained grid, distinct equal-size card slots around the chosen center, randomized remaining assignment/reveal order once per entry, and 720 ms portal travel reusing existing centering timing. Hidden grid shifts suspend after the current normal-tempo shift finishes; there is no acceleration. Layout and content identities remain separate.


## 2026-10-26 — Big bloom grows inside the living grid

**Status: Implemented, explicit Babuni.dev revision.** Big bloom shares the living grid and its pan controller; project tiles physically move aside and remain outside the footprint. Each module occupies 2×2 grid cells. The chosen module is central, with the original-size project tile in its lower-left quarter as one-step Back. This supersedes the separate full-page intro canvas and top-left portal clone. Only detail views remain modal.

**Babuni.dev decided:** Top-first clockwise appearance like the site spiral, extension downward for catalogs exceeding nine, no instruction/header bar in big bloom, and more content at each discovery depth. **AI geometry choices:** Three module columns; selected top-left at `(anchor.column, anchor.row - 1)` so its lower-left cell is exactly the existing anchor. Exclude only that cell from vacancies; reserve all other covered cells. Preserve the same small sample on return. Keep randomized content assignment while ordering physical reveals. A question-mark tooltip offers optional guidance.

**Alternatives:** Independent overlay canvas and hiding all other projects are superseded. Vertical/diagonal tile redistribution was unnecessary: the existing invertible horizontal row mapping clears every footprint and protects actual occupied columns for autonomous shifts.


## 2026-10-26 — Four additional portal images

**Implemented — Babuni.dev direction:** Use the four supplied FavorCraft, FlourishForever, ResistForever and SocialForever PNGs as portal identities. **AI execution:** Explicit `portalArtwork` URLs on the existing stable project records; unchanged supplied files and shared circular crop. Automatic folder discovery remains unimplemented.


## 2026-10-26 — Stronger action and waiting feedback

**Implemented — Babuni.dev direction:** Make pending switches visibly responsive through stronger tile glow and slightly faster waiting pulses, and acknowledge Read more/Back presses. **AI choice:** 1400 ms opacity pulse, 240 ms press acknowledgement, persistent queued-button highlight and aria-busy. Preserve all movement/navigation clocks and use a steady indication for reduced motion. This supersedes the earlier 1600 ms feedback cycle, not the approved shift tempo.


## 2026-10-27 — Content validation and authoring

**Status: Implemented AI implementation choice within Babuni.dev’s requested content-validation scope.** Retain the existing JSON authoring format; provide local checks and blank templates rather than introducing a CMS or MDX migration. Empty modules are valid drafts; partial media records are errors. Build failures prevent structurally broken content from being packaged. Remote availability and editorial accuracy remain human review responsibilities. Revisit the format when real authoring needs justify it.


## 2026-10-27 — Five more project portals

**Implemented:** Reuse explicit `portalArtwork` assignments and existing circular clipping for five more supplied images. Keep original filenames and pixels; do not infer assignments dynamically or introduce new rendering behavior.


## 2026-10-27 — Framed detail reader

**Status: Implemented user-directed revision.** Detail is a framed square modal over the living grid rather than a full-viewport opaque reader. AI selected responsive viewport-bounded dimensions, a 980px cap and 420ms fade/grow entrance. A fade alone was possible; subtle scale accompanies opacity to follow the requested growing-element feel. Keep native dialog semantics and internal scroll; do not make background grid interactive while reading. Exact visual feel remains subject to Babuni.dev review.


## 2026-10-27 — Hidden scrollbars

**Implemented, user-directed:** Hide scrollbar chrome throughout the site rather than disabling overflow. Keep wheel, touch and keyboard scrolling available for long content. Remove the detail reader’s scrollbar gutter so no empty scrollbar strip remains.


## 2026-10-27 — Repository-backed project documentation

**Status: Implemented. Human direction:** Reuse the shared documentation structure across all available projects; public repositories only. **AI implementation choices:** Explicit stable-ID mapping, ten allowlisted documentation paths, anonymous public-visibility verification at refresh, commit-pinned raw downloads, atomic snapshot replacement and offline build validation. Missing/empty paths omit modules. One refresh failure preserves the previous complete snapshot. Existing matching text bodies are replaced by upstream text while media/resources and curated previews survive.

**Alternatives:** Fuzzy name guessing can misassign families; full clones/recursive Markdown imports can pull unrelated material; browser-time GitHub fetches create availability/rate-limit dependencies. A content-collection/CMS migration is unnecessary to preserve the current runtime contract. Source updates are published through explicit refresh/review rather than webhooks at this stage. Revisit delivery splitting because bundling the entire imported corpus increases first-load size. Private content and uncertain family associations remain excluded until separately resolved.


## D-028 — Eager summaries, lazy full documents, and GitHub CI (2026-10-27)

**Status:** Babuni.dev accepted the AI's recommended performance and verification work; implementation prepared, post-change verification pending.

**Babuni.dev direction:** Proceed with the recommended on-demand loading of project documentation and automatic GitHub test/build checks. Preserve the project's distinctive interaction design and existing timing.

**AI decision:** Keep a small synchronous index of supported public documentation modules (current teaser and existing big-bloom intro), so selecting and expanding a project never waits for network. Emit exact original Markdown into allowlisted, versioned-in-Git-but-generated-on-build same-origin static resources. Fetch one actual document only when the user opens its detail. On an error show a retry, never substitute invented content. Generate these files offline from the checked-in public snapshot and local source files before dev/test/build; ignore the duplicate build products in Git. Enable read-only GitHub Actions on main/PR/manual dispatch, using Node 24 and locked dependency installs.

**Alternatives:** Vite lazy import of the whole 1.34 MB JSON (still unnecessarily downloads every project's content at first project open); network fetch at small-bloom time (changes approved reveal timing); live GitHub API calls in the visitor browser (introduces quota, privacy, and reliability issues). None adopted.

**Verification open:** Build size reduction, CI green status, user-visible network behavior, long-text scroll/retry and device regression. Static base URL assumes domain-root hosting; revisit if deploying under a URL prefix.


## D-030 — Carry already-loaded portal artwork through shift completion (2026-10-27)

**Babuni.dev observation:** Logo artwork sometimes flickers immediately after row/column shifts finish. Preserve approved movement while investigating the end-of-shift handoff.

**AI root-cause hypothesis (grounded in inspected code):** A completed movement repopulated static DOM slots. Changed `projectIndex` values caused `portal.replaceChildren()` and a newly constructed lazy-loading image, although that same artwork was already decoded in the tile visually arriving from the adjacent cell. This can produce a brief blank/missing artwork frame.

**AI decision:** Rotate the actual tile DOM residents through shifted logical slots **before** committing shift history and synchronizing project identities, keeping each `projectIndex` paired with its existing element and decoded logo. Only the wrapped offscreen pool slot gets normal recycling. Use bloom-aware `occupiedCell` to identify the real shifted line. Do not change shift times, motion paths or visual treatment.

**Rejected approaches:** Fade or hide the handoff; eagerly preload all source logos; assign an entirely new image element to each destination; change the viewport's approved motion.

**Status:** Source fix and tests prepared for review, not accepted as a verified visual fix. Regression tests/build and Babuni.dev's actual screen observation required.

## D-031 — Link directly to Babuni.dev's already-converted WebP originals (2026-10-27)

**Babuni.dev direction:** Portal PNGs were already converted to WebP locally. Change the website's image paths, add the previously absent BuxbrewResist image mapping, and explain how the originals are committed to GitHub.

**AI interpretation corrected:** The earlier assumption that Babuni.dev still needed conversion or substitute image generation was wrong. Do not synthesize or re-encode the original portal art from screenshots.

**Implementation:** Twelve direct `portalArtwork` URLs with `.webp`, unchanged image renderer, and an optional byte-preserving local file arranger for canonical asset paths. The local user performs the separate Git binary push; `git add -A` tracks additions and deletions. Existing logo design and interaction geometry stay unchanged.

**Status:** Code-side paths implemented. Until Babuni.dev pushes the original WebPs, the remote code points to assets not yet in GitHub and CI asset validation can fail. Post-upload tests and visual review are required.


## 2026-10-27 — Complete supplied WebP artwork and retain reader attribution

**Status: Implemented, user-authorized.** Publish every supplied WebP together with its matching stable project metadata, including ROARR, The Great Iceflow Relay and WorkThatGodBod. Keep original bytes; remove superseded PNGs in line with the local conversion rather than shipping duplicate unused formats. Historical originals remain in Git history.

The asynchronous document body owns a dedicated child container. Source and credit footers are siblings and survive success, failure and retry. This replaces destructive updates to the complete article while retaining abort/stale-view guards. No motion/design alternatives were applied beyond the requested repairs.


## 2026-10-27 — Render repository Markdown as document structure

**Status: Implemented user-requested correction.** Use a maintained Markdown lexer rather than expanding the partial regex parser. The renderer builds an allowlisted set of DOM elements from Marked tokens, never raw HTML. Supports common Markdown/GFM formatting, tables and tasks. Relative links resolve to their source document; known heading references scroll inside the reader. Raw HTML remains literal; unsafe schemes and credential-bearing links are inert. Markdown image references stay explicit links, so importing a document does not introduce automatic media downloads. Revisit advanced syntax only when supported by actual authoring needs.


## 2026-10-27 — Dismiss the reader from its surround

**Status: Implemented, explicit user direction.** Replace the reader’s visible Back to big bloom button with outside-click/tap dismissal while retaining Escape. Use a deliberate backdrop gesture that starts and ends outside, rather than closing whenever a click targets the dialog: native dialog padding also targets the dialog, and text selection may end beyond its edge. Restore the originating module control’s focus and retain the same big-bloom camera and cleanup behavior.


## 2026-10-27 — Markdown previews and ongoing content

**Status: Implemented from Babuni.dev direction.** Small and big bloom previews interpret Markdown, with a shared safe DOM renderer and bounded source excerpts. AI chose inert link labels in cards to preserve established depth navigation; full reader links remain interactive. Raw HTML remains literal and document images remain explicit links. Content completion is ongoing, secondary work rather than a release gate; functional validation remains required. Revisit excerpt selection as source authoring evolves.


## 2026-10-27 — Header navigation survives every depth

**Status: Accepted direction from Babuni.dev; implemented by AI.** The site header persists through all four stages, superseding the earlier big-bloom header hiding rule. This is the site navigation, separate from the rejected big-bloom instruction bar. Projects contains a searchable alphabetical list of current candidate tiles; choosing one waits for existing movement, closes an existing bloom, centers and opens a small bloom. About provides verified project context. The same header moves into the reader modal top layer and returns on dismissal. AI implementation preserves existing motion durations. All available saved AI screenshots become historical visual documentation with provenance; future saved verification captures should join the archive.


## 2026-10-27 — Responsive reading and activity cues

**Status: Implemented from Babuni.dev phone feedback.** Below 600px, reader is full-width and taller, frame-free with a minimum 64px dismissal strip below (plus safe-area allowance). Desktop retains the square. Dismissal mirrors the accepted 420ms opening; reduced motion skips the animation. Grid shift/reveal tempo is unchanged. Centered header activity identifies project/depth/document; small headers allow a second row. Help is far right and works by hover, focus or tap. Small bloom closes through the original tile, another project or Escape; its redundant Close button is removed. About is an explicitly evolving draft, synthesized by AI from available evidence at Babuni.dev’s request; unsupported personal history is deferred.

## 2026-10-27 — Dated documentation audit #28 (editorial clarification; no new approval)

**Already-decided interaction contract:** Babuni.dev selected the toy-box metaphor, engraved/colored portals, living recycled stone grid, contextual bubbles and **spatially reserved** small/big bloom. The creator explicitly corrected an earlier AI rendering of blooms as floating dashboard panels; a full-screen conventional portfolio replacement remains **unapproved**. Later user-requested revisions added Markdown-aware previews, reader backdrop dismissal, shared navigation and direct project search. Those are source-implemented and preserve established line-shift timing.

**Current evidence reconciliation:** Earlier README counted eleven supplied portal artworks and last referred to the 97-test stage; later checked-in media and journal now establish fifteen WebPs and a reported 126-test milestone. That updates documentary evidence only, not the creator's art or the tested code.

**Repository synchronization is a separate action:** The portfolio reads a manually reviewed imported document snapshot. Although other Babuni.dev project Markdown was revised in this numbered audit, updating the portfolio's snapshot requires a **distinct review, explicit sync, verification and commit**. No user approval of unreviewed automatic live ingestion is inferred. The 53 named candidates still are not 53 public, finished projects.

**Open (not approved):** Svelte framework adoption, changes to spatial timing/appearance, site deployment, release license, full native-phone/mobile/reduced-motion signoff and choice of performance thresholds. Only Babuni.dev can approve these decisions.

## 2026-10-27 — All published images use WebP

**Status: Implemented from Babuni.dev request.** Public artwork, screenshots, gallery images, posters and favicon use real WebP containers. Originals stay outside public. AI selected quality 85 for current JPEG-source media after lossless trials increased size; retain dimensions. Genuine future PNG screenshots should use measured lossless WebP when practical. Validate extension and container before build. Imported Markdown image references remain source text/explicit links, not downloaded or rewritten assets.


## 2026-10-27 — Shift playback responds to drag, never to a press

**Status: Implemented from Babuni.dev request.** A tile press does not pause or retime an active shift. Existing 9px pointer travel distinguishes drag; actual dragging brakes logical shift speed over 280ms and release ramps it back up. AI selected that short ramp within the requested organic-stop behavior; its feel remains for human acceptance. Uninterrupted shifts retain 4400ms. Reader/background pauses stay immediate. Source/vacancy caches must remain equivalent to existing geometry, including future larger footprints. Desktop performance is an open empirical acceptance track; the measured cache speedup is not a claimed end-to-end FPS gain.


## 2026-10-27 — Spatial highlight and explicit keyboard activation

**Status: Implemented from Babuni.dev clarification.** Tab enters at the center item; arrows change keyboard focus/highlight without activating. Space/Enter opens the focused tile/module; Escape goes back one depth. This supersedes arrow-key continuous grid panning. The header retains conventional keyboard behavior; Tab from a highlighted primary grid control reaches Projects. Keep focus on the corresponding item on return. AI implementation may minimally bring an offscreen highlighted neighbor into view; this is not continuous keyboard camera control. Long-session/cross-browser keyboard acceptance remains open.

## 2026-10-27 — Graphic-only browser identity

**Status:** implemented at Babuni.dev’s request. Use the supplied B without its bottom wordmark for the browser favicon. AI chose a compact transparent 64×64 WebP and project-level toolbar disabling instead of CSS concealment. Keep the header text and project portal art unchanged. The image editor assisted extraction; provenance and exact prompt are in FAVICON_ASSET.md. Revisit favicon sizing if human tab testing finds it unclear.


### Header B mark — 2026-10-27

Babuni.dev additionally requested the B to the left of BABUNI.DEV in the persistent header, using WebP, and explicitly authorized committing, pushing, updating and restarting the local site for future changes. AI reused the transparent 64×64 favicon at 32×32 CSS pixels, with fixed dimensions and decorative empty alternative text beside the existing accessible brand name. This adds no image duplicate or interaction changes.

## 2026-10-27 — Reader-only frameless scrolling

**Status:** implemented from Babuni.dev’s direction, awaiting visual acceptance. Native browser chrome stays hidden; a floating gold thumb has no track/frame. AI chose a 24px transparent hit area around a 6px visible mark and a 36–96px thumb, with full-range proportional dragging. A conventional framed scrollbar was rejected by the human request; hiding every indicator would prevent the requested fast drag. The reader scroll element is separate from its animated shell so the handle stays visible during content scrolling.

## 2026-10-27 — Retain warm coordinate identities

**Status:** AI implementation responding to Babuni.dev’s long-session slowdown report; performance acceptance pending. Keep the full authoritative shift history and at most 2,048 cached coordinates. Advance cached identities using only appended inverse shifts; use the old prefix on previously uncached edges. Prefer individual LRU eviction to whole-map flushes. Do not truncate history or change visual motion to hide increasing calculation costs. Infinite unseen areas still need history; a bounded exact history representation is future research, not claimed solved. Human keyboard and reader-handle acceptance and positive Firefox evidence are recorded in DEVLOG.

## 2026-10-28 — Separate public editions for private projects

**Status:** human direction confirmed; publication pending. Babuni.dev chose public documentation only for Ethera, Morkahja RPG, MorkahjaWorld and arcanitebrothers. Keep existing implementation repositories private. AI prepared separate curated Markdown editions with the standard website paths; copying entire private histories was not selected. Only anonymously verified public editions may become portfolio sources. See PUBLIC_DOCUMENTATION_PLAN.md.

## 2026-10-28 — Public edition mapping verified

**Status:** four public documentation repositories published by Babuni.dev and anonymously verified by AI. Use Ethera-docs, Morkahja-docs, MorkahjaWorld-docs and arcanitebrothers-docs for exactly the four formerly private-review tiles. Keep implementation sources private and outside the snapshot. Preserve existing other snapshots and unconfirmed family mappings. Full source commits are pinned in repository-documents.json; this is a reviewed static import, not private/live fetching.

## 2026-10-28 — Resize retains exploration state

**Status:** implemented from Babuni.dev’s correction, awaiting human resize acceptance. A viewport change rebuilds the bounded tile pool, not the selected project's exploration state. Preserve existing bloom panel instances, module choices, reservations and pending selections. Responsive tile-size changes rescale the camera in cell units and in-flight endpoints without changing elapsed timing. Closing/reopening was rejected by the human report.

**Performance decision:** report the current warning honestly. Keep synchronous intros and original supplied artwork bytes in this fix; no raised warning threshold, shortened intros, unapproved async opening gate or silently recompressed originals. Per-project preview chunks and separate smaller image derivatives remain AI proposals, not confirmed design changes.

## 2026-10-28 — Owner-curated active project list

**Status:** accepted human direction, implemented. Withdraw the four named gimmick/duplicate/shared-document tiles. A discovered repository is not sufficient reason to keep a project that Babuni.dev does not consider a distinct work. Keep journal/decision/collaboration material inside BABUNI.DEV; retain one MorkahjaWorld worldbuilding tile. Do not infer authorization to delete repositories, rewrite history or merge other unresolved families. Existing public documentation snapshots retain their provenance; a separate attributed scope note records the worldbuilding correction until its public edition is updated.

## 2026-10-28 — Additional owner withdrawals

**Status:** accepted and implemented. Babuni.dev additionally withdraws The Amberbrew Family and Practical Templates Creator as standalone website entries. Remove their active grid/search/topic/mapping records; preserve historical research and unrelated projects. Neither entry had an imported source to delete.

## 2026-10-28 — Warehouse Performance Model withdrawn

**Babuni.dev requested:** remove Warehouse Performance Model too. **Implemented by AI:** removed its semantic ID from the active grid/search catalog, both topic maps and unresolved repository mappings. No connected snapshot or curated module existed; no repository, document, artwork or other project was deleted. Current totals: 46 entries, 35 connected public sources, nine missing-repository entries and two family-clarification entries. Historical inventory mentions remain historical. No interaction timing or layout change.

## 2026-10-28 — GuildChatAI withdrawn

**Babuni.dev requested:** remove GuildChatAI too. **AI implementation:** removed its active catalog/topic/mapping records and the orphaned public GuildChatAI snapshot (ten documents). All other retained snapshots, projects, artwork and interaction behavior remain unchanged. No repository deletion was requested or performed. Active totals: 45 entries, 34 connected public sources, 33 external snapshots and 316 external documents. Historical research mentions remain historical. Verification is recorded in DEVLOG.

## 2026-10-28 — Dual-PC Streaming Setup withdrawn

**Babuni.dev requested:** remove Dual-PC Streaming Setup too. **AI implementation:** removed its active semantic ID, topics and unresolved repository mapping. It had no connected source snapshot or curated module content. All other sources, projects, artwork and interactions remain unchanged; historical mentions remain historical. Current totals: 44 entries, 34 connected public sources, eight missing-repository entries and two family-clarification entries. No repository deletion or new timing/layout change. Verification is recorded in DEVLOG.

## 2026-10-28 — Mech-Arena withdrawn

**Babuni.dev requested:** remove Mech-Arena too. **AI implementation:** removed its active semantic ID, topic records and unresolved repository mapping. It had no connected source snapshot or curated module content. Other projects, documents, artwork, layout and timing remain unchanged; historical research mentions remain historical. Totals: 43 entries, 34 connected public sources, seven missing-repository entries and two family-clarification entries. No repository deletion. Verification is recorded in DEVLOG.

## 2026-10-28 — Local Prompt Lab is part of Anskar Grotzschnapf

**Babuni.dev clarified:** Local Prompt Lab is part of the Anskar Grotzschnapf project, not an independent project. **AI implementation:** removed the standalone catalog/topic/mapping records, retaining Anskar Grotzschnapf and its existing public source unchanged. No imported Local Prompt Lab snapshot or curated modules existed to transfer. Preserve supplied LocalPromptLab.webp as historical artwork rather than delete it. Active totals: 42 entries, 34 connected public sources, six missing-repository entries and two family-clarification entries. Nineteen active artwork assignments; twenty supplied portal WebPs retained. No repository deletion, automatic source rewrite or interaction change. Verification is recorded in DEVLOG.


## 2026-10-28 — Neutral capacity without resizing (implemented)

**Babuni.dev direction/decision:** five gray decorative placeholders, no portal or project, rather than the AI's proposed tile enlargement. Preserve timing and position feel. **AI implementation:** real-project uniqueness includes entering/departing overlap; continuing assignments are never repaired by visible renaming. Five neutral identities can repeat decoratively if exhausted; no extra project records are invented. Stable fillers may remain until recycled. Alternative of reusing a departing real project during animation rejected because both copies are still visible. Revisit filler aesthetics after human testing.

Requested names and Rocket Game 42 addition are implemented. Menu-only grouping is **proposed, not approved/implemented**; see PROJECT_GROUPING_PROPOSAL.md. RoarGuild vs Roar Guild and the two admin-console candidates remain separate pending review.


## 2026-10-28 — Replace the five-filler policy (implemented)

**Babuni.dev rejected:** repeated empty decoration forming walls; absolute uniqueness at the expense of a populated grid. **Confirmed choice:** three unique neutral tiles, with occasional real-project repeats when necessary, while keeping the identity-stability fix. **AI implementation:** never prefill the offscreen band with neutral decoration, reserve all continuing and staged identities, exhaust unique real/neutral options before real-project fallback. Alternatives of resizing tiles or returning to visible identity repair remain rejected. Decorative neutral marks distinguish the three identities; they are still inert, not projects.

**Menu grouping approved:** implement the earlier World of Warcraft/Morkahja/AI/Games list, removing duplicate Admin Console; add Music for the two new profiles. Grouping has no grid-layout effect. **Curation:** retain Arcanitebrothers; rename addon to RoarGuild Add-on and assign guild artwork solely to the community; retain Analubia after the human's immediate correction. Keep Mighty Morkah and Elixior distinct; a separate Babuni Gaming project/link was not supplied or added.


## 2026-10-28 — Buxbrew character artwork (implemented)

Babuni.dev explicitly chose the existing `BuxbrewCharacter.webp` for the character-story entry. AI mapped the supplied asset directly, preserving its bytes; no generated replacement or assignment to the separate Buxbrew addon/repository tile.


## 2026-10-28 — Morkahja artwork (implemented)

Babuni.dev supplied Morkahja.webp; AI mapped it to the Morkahja project rather than the distinct Worldbuilding project. Use the original file and existing round mask; no generated replacement.


## 2026-10-28 — TotemTimers artwork (implemented)

Babuni.dev chose TotemTimers.webp. AI assigned the existing supplied asset directly to TotemTimers through the established portal renderer; original bytes retained.


## 2026-10-28 — Babuni Gaming project (implemented)

**Human direction:** Babuni Gaming is its own project spanning gaming, streaming, experience sharing and some related addon/media work; current focus WoW, broader than WoW in scope. Use the original supplied cat, unchanged, converted to WebP. **AI implementation choice:** Games menu category, three populated introduction/resources modules, original-size lossless conversion and the existing portal mask. This avoids restricting the project to the WoW category or merging away the distinct addon/Azeroth Moments histories. Profile resources are sufficient without inventing individual embeds or a dedicated GitHub repository. Revisit detailed modules as the human authors more content.


## 2026-10-28 — EnchantVisuals artwork (implemented)

Babuni.dev selected the supplied EnchantVisuals.webp. AI mapped the existing asset directly to EnchantVisuals, retaining its bytes and the established portal renderer.


## 2026-10-28 — Buxbrew Addon (implemented)

Babuni.dev chose the exact display name Buxbrew Addon for stable ID `buxbrew`. AI applied a display-only rename; no merge with the character story or repository rename.


## 2026-10-28 — BuxbrewCharge artwork (implemented)

Babuni.dev selected BuxbrewCharge.webp. AI assigned the supplied asset directly to BuxbrewCharge, retaining its original bytes and the existing portal renderer.


## 2026-10-28 — Buxbrew Addon artwork (implemented)

Babuni.dev selected BuxbrewAddon.webp. AI assigned the supplied asset directly to Buxbrew Addon (`buxbrew`), retaining original bytes and the established portal renderer.


## 2026-10-29 — Distinct RoarGuild Add-on artwork (implemented)

Babuni.dev selected RoarGuildAddon.webp for the addon. AI mapped the supplied asset to `roarguild`; the community continues using ROARGuild.webp. The earlier no-addon-artwork state is superseded, with original bytes retained.


## 2026-10-29 — MeleeStartAttack artwork (implemented)

Babuni.dev selected MeleeStartAttack.webp. AI mapped the supplied asset directly to MeleeStartAttack, retaining original bytes and the existing renderer.


## 2026-10-29 — Babuni Admin naming with public-only sources (implemented)

Babuni.dev renamed the implementation and requested website correction. AI metadata checks found it remains private and the old public docs edition remains public. Rename the visible project to Babuni Admin, keeping its stable ID/artwork. Keep the public edition as the content source and explain its historical naming in Public documentation. Switching the source to a private repository would conflict with the confirmed public-only rule; no private content import, repository visibility change or public-docs repository rename is authorized or performed.


## 2026-10-29 — Canonical public Admin docs source (implemented)

Babuni.dev renamed the separate public docs repository. AI verified public visibility anonymously and adopted babunidev/babuni.admin-docs as the canonical source, rather than relying on GitHub redirects from the previous URL. Preserve document bodies and pinned revision; implementation remains private. This completes the previously pending public repository rename connection.


## 2026-10-29 — BuxbrewDing artwork (implemented)

Babuni.dev selected BuxbrewDing.webp. AI mapped the supplied asset directly to BuxbrewDing, retaining original bytes and the established renderer.


## 2026-10-29 — Amazin artwork (implemented)

Babuni.dev selected Amazin.webp. AI mapped the supplied asset directly to Amazin, retaining original bytes and the established renderer.


## 2026-10-29 — Mighty Morkah artwork (implemented)

Babuni.dev selected MightyMorkah.webp. AI mapped the supplied asset directly to Mighty Morkah, retaining original bytes and the established renderer.


## 2026-10-29 — Elixior artwork (implemented)

Babuni.dev supplied Elexior.webp. AI assigned it to existing music project `elixior`; the filename spelling does not rename the project. Original bytes and existing renderer retained.


## 2026-10-29 — Newest-first spiral from public commits (implemented)

**Human request/choice:** sort the initial spiral at each build by latest project commit, using public documentation dates for private-code projects. **AI choices:** use the latest commit on each explicitly connected branch; newest at center, following the existing clockwise spiral. Preserve base catalog order for equal timestamps and undated projects, with undated projects after dated ones. Reject import/check/build timestamps as activity proxies and do not read private implementation commits.

Order is static per loaded bundle; no live rearrangement or timing change. Normal builds write refreshed metadata only to ignored generated files, with a checked-in fallback for offline/fresh clones. Explicit baseline saving is a separate reviewed command. Network/API failure warns and reuses only matching verified dates. Optional CI authentication may read commit metadata only after a public visibility check. Menu categories and alphabetical search order remain independent.


## 2026-10-29 — Withdraw Fantasy RPG Assets; supplied GatherMap art (implemented)

Babuni.dev withdrew Fantasy RPG Assets as a standalone project and chose GatherMap.webp for GatherMap. AI removed only the active catalog entry and related metadata, preserving history, and mapped the supplied WebP without editing. No other project was merged or removed.


## 2026-10-29 — Short project labels (implemented)

Babuni.dev chose Ethera and Local AI as the exact visible names. AI applied display-only renames, retaining stable identity, historical source text and artwork filenames; no project merge or repository rename.


## 2026-10-29 — Remove Fantasy Architecture

**Babuni.dev decided:** remove Fantasy Architecture because it is not a project. **AI execution:** remove active metadata rather than rename or hide it; preserve historical records. Status: implemented; reversible through Git history.


## 2026-10-29 — Grimnir portal artwork

**Babuni.dev requested:** use the supplied Grimnir.webp for Grimnir. **AI execution:** map the existing stable project ID to `/portal-content/Grimnir.webp`, preserving the supplied WebP bytes and existing round portal mask. This replaces its provisional colored portal; 34 active projects now have supplied artwork. No project identity, source, timing or placement changes. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture in this pass. Original artwork is retained without re-encoding.


## 2026-10-29 — ROARSounds portal artwork

**Babuni.dev requested:** use the supplied ROARsounds.webp for ROARSounds. **AI execution:** assign it to the existing `roarsounds` identity, replacing its provisional colored portal. Preserve supplied WebP bytes and the round mask; 35 active projects now have supplied artwork. No timing, positioning, source or identity changes. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates. No browser screenshot taken.


## 2026-10-29 — Worldbuilding and Roar Guild artwork

**Babuni.dev supplied:** MorkahjaWorldbuilding.webp and ROAR.webp. **AI interpretation/execution:** assign the first to Morkahja Worldbuilding and replace Roar Guild’s ROARGuild.webp mapping with ROAR.webp. Preserve the former file as historical artwork and keep RoarGuild Add-on’s separate image. Both new WebPs are copied unchanged; 36 active projects now have supplied artwork. No identity, source, timing or positioning changes. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture in this pass.


## 2026-10-29 — Correct ROAR artwork assignment

**Babuni.dev corrected:** ROAR.webp belongs to ROAR, not Roar Guild, which already had artwork. **AI error and correction:** the previous assignment inferred the wrong project; assign ROAR.webp to stable ID `roar` and restore ROARGuild.webp to `roar-guild-and-community`. RoarGuild Add-on retains its separate artwork. Earlier entry records the superseded mistake. There are now 37 active artwork assignments. No image bytes or interaction behavior changed. **Verification:** distinct artwork regression assertions, content validation and static production build run before publication with cached activity dates; no browser screenshot taken.


## 2026-10-29 — ROARRunlimited artwork

**Babuni.dev supplied:** RoarUnlimited.webp. **AI execution:** assign the unchanged WebP to the existing ROARRunlimited project (`roarrunlimited`), replacing its provisional colored portal and retaining the round mask. There are now 38 active artwork assignments. Other ROAR-family mappings, labels, timing and placement remain unchanged. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — ROARemoteTrigger artwork

**Babuni.dev supplied:** ROARRemoteTrigger.webp. **AI execution:** map the unchanged supplied WebP to the existing `roaremotetrigger` project, replacing its provisional colored portal with the existing round mask. There are now 39 active artwork assignments. Existing labels, other ROAR-family artwork, source mappings, timing and placement are preserved. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser screenshot taken.


## 2026-10-29 — Remove Analubia

**Babuni.dev decided:** remove Analubia to focus this portfolio on their own current projects; they described it as a past corporate collaboration and expressed uncertainty about present ownership. This is the human’s scope decision, not an independently verified ownership claim. **AI execution:** remove its active catalog, menu, topics and unresolved source mapping; preserve historical records and external projects. There are now 42 projects, 35 connected public sources and six needing repositories. No motion or layout changes. **Verification:** full tests, content validation and static production build run before publication using cached activity dates; no browser capture or source refresh.


## 2026-10-29 — LootFeed artwork

**Babuni.dev supplied:** LootFeed.webp. **AI execution:** assign the unchanged supplied WebP to stable project ID `lootfeed`, replacing its provisional colored portal within the existing round mask. There are now 40 active artwork assignments. No project labels, source connections, timing or placement changed. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — Rocket Game 42 artwork

**Babuni.dev supplied:** Rocketgame42.webp. **AI execution:** assign the unchanged supplied WebP to stable project ID `rocket-game-42`, replacing its provisional colored portal within the existing round mask. There are now 41 active artwork assignments. Project identity, source, timing and placement are unchanged. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — GroupBuffToggle artwork

**Babuni.dev supplied:** GroupBuff.webp. **AI execution:** assign the unchanged supplied WebP to the existing GroupBuffToggle project (`groupbufftoggle`), replacing its provisional colored portal within the existing round mask. All 42 current projects now have supplied portal artwork. Project names, source mappings, timing and placement are unchanged. **Verification:** artwork regression tests, content validation and static production build run before publication using cached activity dates; no browser capture taken.


## 2026-10-29 — 512-pixel portal publishing assets

**Babuni.dev requested:** make all portal images smaller, suggesting 512 × 512. **AI implementation:** resize all 42 active portal WebPs to 512 × 512 with Lanczos resampling and WebP quality 85, preserving composition and transparency; update renderer intrinsic dimensions. This supersedes earlier byte-preservation rules for these published versions. Originals remain in Git history and in the local non-public `image-originals/portal-artwork-before-512-2026-10-29/` archive with a SHA-256 manifest. No artwork redesign, crop, portal size or animation changes. **Alternatives:** 384-pixel trial was smaller, but 512 follows the human’s chosen resolution and retains more detail. Total active portal bytes: 20,404,098 → 2,843,518 (86.1% reduction); largest 113,292 bytes. Gallery/verification images and favicon are outside this portal-only change. Import tooling still copies supplied files unchanged; intentional publishing optimization is separate. **Verification:** decoded all 42 WebPs and confirmed exact 512 × 512 dimensions; visually inspected a temporary contact sheet (not a browser capture); added a 150 KiB per-portal regression budget. Full tests, content validation and static production build run before publication with cached activity dates. No browser performance measurement claimed.


## 2026-10-29 — First Babuni Gaming video embed

**Babuni.dev supplied:** YouTube video `9fnC1ZI1iSY`, described as the first published stream test/showcase (not the first recording), with quiet microphone audio. **AI execution:** add a fourth Babuni Gaming module, Videos, using the existing click-to-load `youtube-nocookie.com` embed renderer and a descriptive label, not an invented official title. Other videos can join this collection later. Playback is served by YouTube; no recording is copied into the site and existing BABUNI.DEV local clips remain unchanged. Existing renderer requires Load video before creating the external player. **Verification:** content regression coverage, full tests, content validation and static production build run before publication with cached activity dates. YouTube page retrieval failed; official title, playback and embedding permission are not verified and require a live playback check. No browser screenshot taken.


## 2026-10-29 — Second Babuni Gaming video

**Babuni.dev supplied:** YouTube video `B2pMsZPQfCc` as the second published video, with microphone audio still very quiet but acceptable to publish. **AI execution:** append it after the first recording in the existing Videos collection; update collection context to describe both videos. Labels are descriptive, not verified official titles. Existing click-to-load YouTube embeds handle playback; no local video copy or timing/layout changes. **Verification:** ordered collection regression assertions, content validation and static production build run before publication using cached activity dates. YouTube playback and embedding permission remain unverified; no browser capture taken.


## 2026-10-29 — Visible embedded video previews

**Babuni.dev requested:** visible large video previews in modules, the big bloom and reader instead of empty Load video buttons, with the ability to play directly. **AI implementation:** replace the extra load button with a lazy embedded player using the existing approved-host validation, privacy-enhanced YouTube URL and referrer policy. Put the first player above preview text in small/big modules and remove the big-card iframe height cap; the reader shows all collection players at full content width and 16:9. Native hosted clips retain their existing behavior. **Trade-off:** embedded previews may contact the video provider when visible, before playback; this supersedes the prior click-before-player approach. AI keeps playback user initiated to avoid simultaneous audio from multiple modules; no autoplay loop is introduced. Playback controls work inside the embed without opening another bloom. **Verification:** all 32 test files, content validation and static production build passed, including lazy iframe creation and rejection of unsafe hosts. No live browser playback or YouTube availability verified, and no browser screenshot taken.


## 2026-10-29 — Mighty Morkah video collection

**Babuni.dev requested:** embed the Mighty Morkah channel’s videos using the same visible player previews. **AI execution:** add one Videos module with all ten video titles and watch IDs visible on the channel’s Videos page, in its displayed latest-first order. Preserve historical wording and WIP labels. Existing renderer shows the first player in small/big bloom and all ten lazy player embeds in the reader; playback remains user initiated. YouTube serves the media, with no copied video files. Existing overview and profile links remain. **Verification:** direct browser inspection of `https://www.youtube.com/@MightyMorkah/videos` found ten video entries (channel currently displays Morkah); search/page-fetch tools failed before browser fallback succeeded. No individual playback or embedding permission verified. Collection tests, full regression suite, content validation and static build run before publication with cached activity dates. No browser screenshot taken.


## 2026-10-29 — Matching video frames

**Babuni.dev requested:** frame video embeds like their surrounding bloom modules. **AI execution:** wrap supported players in a shared video-frame element with the module’s 2-pixel muted-gold border, 5-pixel dark inner band and shadow. The frame is inside the available content width, with no overlay intercepting player controls; applies to embedded and native videos in small bloom, big bloom and reader. Player aspect ratio and playback behavior remain unchanged. No source or media changes. **Verification:** all 32 test files, content validation and static build passed. Initial DOM test caught use of a property missing from its lightweight DOM fixture; AI used the equivalent children collection and reran successfully. No browser screenshot or visual browser acceptance performed in this pass.


## 2026-10-29 — Selected module quarter overlay

**Babuni.dev corrected:** selected big-bloom content should continue behind the portal tile, with only the bottom-left quarter covered and the right side visible. **AI diagnosis/execution:** remove the selected-card-only half-height cap on `.bloom-preview-content`; use the same full-height scrollable content region as other big cards. The actual anchor tile remains one grid cell over the lower-left quarter of the existing 2 × 2 module. No tile or module repositioning, resizing, timing or media changes. **Verification:** full regression suite, content validation and static build run before publication. Existing geometry tests cover the quarter anchor and vacancies; no live browser visual acceptance or screenshot taken in this pass.


## 2026-10-29 — Keep incoming identities through shift commit

**Babuni.dev reported:** rare identity changes immediately after the first or second startup shift, especially the last incoming tile, suspected after project removals. **AI investigation:** 400 ordinary simulated startup rounds preserved identities. Adding intermediate viewport syncs in which an incoming source briefly entered and left the visible set reproduced a first-round swap with 42 projects and three fillers (seed 0, expected index 1 became 40). This confirms a failure path, not a browser reproduction of the human’s exact incident. **AI implementation:** keep staged entrance sources retained and protected through intermediate syncs; explicitly release reservations only after resident settlement, history commit and final placement sync. Previously the first sync seeing an entrance released it, allowing later syncs to deduplicate/reassign it before completion. No catalog, duplicate policy, shift tempo, geometry or DOM transfer behavior changed. **Alternatives:** avoid padding the catalog or suppressing all deduplication; fix reservation lifetime at the shift boundary. **Verification:** new integrated placement/shift/resident test covers 400 startup rounds with intermediate syncs and all landed identities. The failing simulation passes after the fix; all 33 test files, content validation and static build passed. No sustained browser reproduction or screenshot captured; human startup acceptance remains open.


## 2026-10-29 — Body-first documentation and newest-first logs

**Babuni.dev requested:** move opening authorship, source, version, target, primary-file and verification facts to the end, and show newest changelog/development-journal entries first so modules lead with meaningful content. **AI interpretation/implementation:** add a deterministic Markdown presentation transform at document preparation, shared by repository modules and generated reader assets. Preserve original imported snapshots and upstream repositories; publish a reordered reading copy. Recognized leading labelled facts/lists/tables move intact into a final Document information section. Narrative text, safety notices inside the body, links and nested Markdown remain intact. Only log paths are date-sorted: complete sibling sections move with their subsections, dated entries sort newest first, same-day ties keep source order, undated sections keep their slots. ISO and English month dates are supported; omitted years are inferred only from an unambiguous sibling year. Unreleased entries sort first. No dates or chronology are invented for version-only or undated headings. **Alternatives:** avoid editing dozens of upstream repositories or deleting metadata; use one presentation layer for small previews, big intros and reader text. **Verification:** added metadata/preview, nested log/fence, month-date and ambiguous-year tests; all imported source documents pass a non-whitespace character preservation comparison. Existing exact-body tests now compare the presentation copy. Full regression suite, content validation and static build run before publication with cached activity dates; no source sync, browser capture or manual document-by-document editorial acceptance claimed. Limitations: unrecognized narrative-shaped facts and ambiguous dates retain their original position.


## 2026-10-29 — Larger reader and footer stripe

**Babuni.dev requested:** enlarge the reader to around 70% of available space and vertically from the header to a new thin footer, styled like the header at one-third its height. **AI interpretation/execution:** use 70vw reader width on desktop and full height between the persistent header and decorative footer. Preserve the existing edge-to-edge mobile reader and its bottom dismissal gap. Add an empty, noninteractive footer stripe with matching header background/border, height derived from one third of the current header. Move and restore both header and stripe with the modal so they remain visible at all four depths. Keep desktop outside-click margins, reader scrolling and opening/closing animations. Text retains its readable line-length limit. **Verification:** full regression suite, content validation and static production build run before publication using cached activity dates. No browser screenshot or visual acceptance performed in this pass.


## 2026-10-29 — Warmer and larger typography

**Babuni.dev requested:** larger project titles, with short names larger within the same width, slightly larger bloom text (especially small bloom), and a friendly warm palette like the repository links with readable matching backgrounds. **AI implementation:** length-based tile-title scale (short/medium/long) within the common 89% title width; increase small headings/body including the mobile override, make a smaller increase to big-bloom typography, and raise reader body text from 17 to 18px. Use warm cream/gold headings and body text on charcoal-brown bloom/reader backgrounds. Captions and secondary bloom text grow slightly. Artwork, tile/module dimensions, geometry and animation timing are unchanged; larger content continues to use existing internal scrolling. **Alternatives:** use three deterministic name-length scales rather than measuring text during grid animation; no new font dependency or per-frame layout work. **Verification:** full regression suite, content validation and static build run before publication using cached activity dates. No browser screenshot or visual/device acceptance performed in this pass.


## 2026-10-29 — Physical acceptance and release-readiness audit

**Babuni.dev confirmed:** thorough testing on two physical devices, responsive phone/laptop/wide-desktop coverage, satisfying keyboard and reduced-motion alternatives, topic interactions, fullscreen and many-hour sessions; accept milestones 1–4 and the neutral stone/portal design. Record this as human evidence, not new AI hardware verification. Content remains living WIP; owner project publishing toggles remain needed, and future performance review can follow later. **AI execution:** update current roadmap checkboxes and status, explicitly label older notes historical, keep optional MDX deferred, and document production/SEO/hosting findings in `docs/RELEASE_READINESS-2026-10-29.md`. **Measured:** production build passed; total artifact 15.20 MiB; one 699,389-byte JS chunk (199,545 gzip / 160,907 Brotli simulated), existing large-chunk warning. Initial HTML has no project headings/links; generated content is interactive and source docs load on demand. **AI proposals:** crawlable static project/document routes, search/share metadata, integrated publishing visibility, then separate VPS hostname/directory/HTTPS configuration and real delivery measurement. These are plans, not implemented features or deployment. No DNS, private content, VPS or existing website changes. Verification: static artifact inspection; full tests/content checks/build run before publication. No new live load-time/FPS/browser/device test claimed.


## 2026-10-29 — Prepare public discovery and production delivery

**Babuni.dev authorized:** publish every current catalog project and existing public-source content; implement readable pages, search/share information, sitemap, sensible crawler rules and real links, and investigate the bundle with production caching/compression prepared before weekend hosting. **AI implementation:** add static `/projects/` directory, 42 stable project pages and populated module pages from the same current module/source pipeline (433 HTML URLs total); preserve source links, Markdown safety, authorship, WIP content and date presentation. Add `www.babuni.dev` canonical site identity, per-page titles/descriptions/Open Graph/social images, project CreativeWork data, sitemap and robots.txt. Real project-directory link is in Projects menu, with a no-JavaScript home fallback. No private repositories or unconnected account inventory imported.

**Bundle change:** generate 42 per-project JSON collections and fetch only a selected project, cached with deduplicated pending requests and retry after failure. Start fetching alongside the existing shift/centering procedure; a still-loading selected tile retains busy feedback and stale completions cannot reopen a closed/different selection. Keep the original motion, module content volume and source documents. Initial JS reduced from the audited 683 KiB / 195 KiB gzip to approximately 118 KiB / 37 KiB gzip; the 500 kB warning disappears without raising the warning limit. These are artifact/compression estimates, not internet transfer timings.

**Alternatives and boundaries:** use real, equally accessible readable pages rather than hidden keyword text or bot-only rendering; preserve the interactive grid as the main experience. All current projects are public by explicit human direction; a future publishing toggle remains optional work. Prepare a separate Nginx configuration and deployment guide with gzip, correct cache lifetimes and real 404s; do not change VPS/DNS/HTTPS before the agreed weekend or disturb arcanitebrothers.com. Actual HTTPS, gzip/cache headers, renewals, internet timings and search-account submissions remain open. No special AI file is needed for Google AI search; crawlable text and links are the foundation, without guaranteed indexing.

**Verification:** full tests/content checks/build plus sitemap/metadata/internal-link validation run before publication. Production browser preview confirmed LootFeed readable page, 42-project menu, normal shift-wait feedback, fetched eight-module small bloom, eleven-module big bloom and Overview reader with no browser errors. Two genuine browser screenshots archived as WebP in Visual documentation; physical acceptance remains attributed to Babuni.dev, not this browser check. Nginx configuration is prepared only: no local Nginx executable, live syntax test or hosting installation claimed.


## 2026-10-30 — Keep readable pages secondary

**Babuni.dev feedback:** the separate readable pages feel unattractive and do not need a Browse project pages link in the grid menu; asks how sources update and why the preview connection fails. **AI execution:** remove only that menu link, keeping the approved grid and blooms as the ordinary experience. Readable URLs, sitemap and useful no-JavaScript fallback remain publicly available to people and crawlers alike; they are not bot-only or private pages. No page redesign is claimed. Both readable pages and blooms use the same curated data and revision-pinned public snapshots, regenerated during content preparation/build; upstream document changes require a deliberate content sync, whereas commit-date refresh is separate. **Connection diagnosis:** 4326 was the temporary production preview deliberately stopped after verification; the regular local development server is on 4321. **Verification:** direct local HTTP checks, content validation, static build and canonical/internal-link checks run before publication; no browser screenshot taken for this menu-only removal. No DNS/VPS change or source snapshot refresh.


## 2026-10-30 — Golden shift status in the header

**Babuni.dev requested:** emphasize Rows/Columns are shifting and Waiting for shift to finish with a warm golden glow like the selected waiting tile, and clarify that opening waits for the shift. **AI execution:** centralize header presentation, add a static gold text glow for those two status families, and append the wait explanation to autonomous-shift messages. All direct selection waiting/centering updates use the same presenter so the glow clears for ordinary exploration, reading and centering. Existing tile feedback, 4.4-second shift tempo and opening sequence are unchanged; no extra animation is introduced, including for reduced motion. **Verification:** targeted status tests, full regression suite, content validation, static build and public-link checks run before publication with cached activity dates. No browser screenshot taken in this pass; visual acceptance remains with Babuni.dev.


## 2026-10-30 — Launch-readiness and server-access audit

**Babuni.dev asked:** check remaining launch gaps and explain direct agent/server access versus repeated manual server pulls/builds. **AI audit:** current source is clean; 37 test files, content validation, static production build and all 430 public URL/link checks passed. Current initial JS is about 120 KiB raw / 38 KiB gzip. Production dependency registry audit reported zero known advisories, not a complete security guarantee. No new browser/device or live VPS/load measurement performed. **Result:** code is ready for deployment preparation; SSH access, server-specific Nginx validation, DNS, HTTPS/renewal and live smoke/header/loading checks remain. Current CI tests/builds but does not deploy. **AI recommendation:** dedicated SSH deployment account and key, versioned static release upload and rollback, followed optionally by a manually triggered GitHub deployment workflow. These access/automation proposals are not configured or authorized as completed work. Existing Arcanite Brothers remains untouched. The local `.ssh` directory has no private key; no SSH session, key creation, new permissions or server change attempted. Update `deploy/README.md` with these distinctions and the current 41-project catalog count. Content curation and future visibility UI are not launch blockers for the already approved public catalog.


## 2026-10-31 — ActionEmotes #1 identity and public-source update

**Babuni.dev confirmed:** Buxbrew Charge is now ActionEmotes #1 and its public repository is `babunidev/ActionEmotes-1`; import its added documentation into the portfolio. **AI verification/execution:** verify public visibility and main branch, import only this project’s ten standard documents at `bb9bac59c88db3f05f824519eaaf2e37cb780e59`, replace the retired snapshot/source key, and update the display name, repository mapping and source-based action/emote summary/topics. Stable ID `buxbrewcharge`, existing public page paths and `BuxbrewCharge.webp` artwork remain, avoiding duplicate tiles or broken stable URLs. Refresh this repository’s verified commit metadata for the opening chronology and regenerate the connection report. Other repository snapshots are not refreshed. **Source limitation:** the README still describes the rename as proposed and the repository as retaining the former name; preserve its imported wording as source evidence while using the human-confirmed current identity in portfolio labels/links. Addon files/runtime behavior are not changed or tested. **Verification:** rename/source/artwork regression coverage, full tests, content validation, static build and generated page/link checks run before publication. No browser screenshot, VPS or DNS changes.


## 2026-10-31 — Import Action Emotes #1 final documentation baseline

**Babuni.dev supplied:** merged ActionEmotes-1 PR #1 and final commit `e475a45108753c9eda8de1e774e2ba95058d65c0`, requesting their revised documentation and outstanding `BuxbreCharge.toc` installation concern appear on the website. **AI verification/execution:** verify PR #1 is merged at that exact commit and publicly fetch all ten standard documents, replacing only this project’s snapshot. Its first-person history and documentation baseline now feed blooms/readable pages/readers; the prior proposed-rename wording is resolved by the new upstream README. Update verified activity metadata and add repository/review/commit links to the existing Project source module, explicitly stating that the historical filename remains unmodified and needs an installation check. Preserve stable project identity/artwork and all other repository snapshots. **Verification:** regression coverage, content validation, static build and all public page/link checks run before publication. No addon installation, in-game or filename change, browser screenshot, VPS or DNS action claimed.

## 2026-10-31 — Nine-keyword discovery and actual public sources

**Status:** Implemented from Babuni.dev’s direction. Keep three markers and choose three distinct texts from a nine-keyword project pool at each fresh exploration. Add-ons always include exactly one “World of Warcraft add-on” label, in a random position. The AI selected guaranteed inclusion over chance-only inclusion to satisfy the author’s request that the project type remain obvious. Reveal order and the established 260–420 ms intervals are preserved.

Babuni.dev chose actual public projects over separate public documentation editions. Morkahja, MorkahjaWorld and Babuni Admin are now publicly verified and connected; Ethera stays on its public edition until its actual repository becomes public. Decisions and journals in the actual projects explicitly preserve the author’s publishing intent and observed status. Licenses, contributor permissions and production security are separate decisions; the AI did not choose a license or remove external repositories.

## 2026-11-01 — GuildChatBridge restored from revised public source

**Babuni.dev requested:** Check the renamed/revised GuildChatBridge repository and implement its changes in the portfolio. **AI interpretation:** Restore the previously withdrawn GuildChatAI project under its new public name, retaining stable ID `guildchatai` rather than introducing a duplicate. This supersedes its 2026-10-28 withdrawal for the active catalog only; the withdrawal remains historical evidence.

**Implemented:** Connect `babunidev/GuildChatBridge` main at `483951aea324dec948452f66ac06c9117b5f8bea`, anonymously verified, importing its ten standard Markdown documents only. Restore its searchable World of Warcraft menu entry, source links and nine-keyword pool, with one guaranteed World of Warcraft add-on bubble. Its summary explicitly calls it a paused roleplaying experiment: guild-chat capture and manual sending exist in source, but an autonomous AI conversation bridge is absent and unverified. Existing runtime identifiers GuildChatAI, GuildChatAIDB and /gcai remain upstream historical/current implementation details, not an additional portfolio project. No game-code change, resumption decision or client compatibility test is implied.

**Alternatives/limits:** A rename-only edit could not work because the old project was no longer active. Use its previous semantic identity and source-backed paused status instead of claiming a new completed AI feature. No supplied GuildChatBridge portal artwork was found; the standard colored portal remains until Babuni.dev supplies an image. The active catalog now has 42 projects, 36 connected sources, 35 external snapshots and 41 supplied portal artworks. Preserve all unrelated source snapshots, interaction timing and geometry.

## 2026-11-01 — Authenticated, fresh activity required for production

**Babuni.dev direction:** The latest commit dates are required to select Recently updated tiles; silently deploying stale dates after GitHub 403 responses is not acceptable. Babuni.dev asked why requests were unauthenticated and how to fix the setup.

**AI diagnosis/proposal:** The activity reader accepted environment tokens but the local deployment command provided none and CI did not pass its token. Browser/Git authentication does not automatically authenticate Node fetch calls. Reuse a local `gh auth token --hostname github.com` credential in memory when neither GITHUB_TOKEN nor GH_TOKEN is set; CI must receive an explicit token. Keep the public-visibility/identity check before authenticated commit reads. No new account permission or token scope is requested. The specific historical 403 cause remains unproven because older code discarded its rate-limit headers; rate-limit exhaustion is plausible, not established fact.

**Alternatives/decision:** More warnings or silently retaining old dates would not meet the author’s freshness requirement. Production prebuild now uses --require-fresh, requires authentication and stops if any connected public source fails. No partial replacement of either activity file is written in that case. Explicit non-production refresh and offline dev/tests retain their existing cache behavior. Fetching each distinct connected repository remains necessary to discover changes; no automatic retry loop or new marker timing/geometry was introduced.

**Implemented:** The activity CLI resolves environment credentials first and local GitHub CLI login second, without printing/persisting the token. CI passes secrets.GITHUB_TOKEN only to the build step with existing contents:read permission. Error messages expose HTTP status, primary-limit exhaustion/reset and numeric Retry-After when supplied, not raw GitHub response bodies or credentials. Production builds continue to use actual public branch-head committer dates; document snapshots are not silently refreshed.

**Verification:** Deterministic tests cover credential precedence, CI without credentials, header-only authentication, public-only metadata, safe diagnostics, partial failure preserving both prior files, and successful fresh refresh. A real local authenticated production build refreshed all 36/36 sources; full tests/build and artifact token-leak checks are recorded with the final handoff. No VPS deployment or automatic GitHub Actions deployment is configured by this fix.

## 2026-11-01 — GuildChatBridge portal image

**Babuni.dev supplied:** GuildChatBridge.webp in the local public portal-content folder, requesting its use for the restored project. **AI implementation:** Map the image to stable ID `guildchatai`; resize the 1254×1254 WebP to the existing 512×512 portal standard and encode at quality 88. Preserve the supplied composition and the source file, existing circular mask, title, bubble behavior and project status. No replacement artwork, layout or interaction change was proposed. All 42 active projects now have portal artwork. **Verification:** WebP container/size and existing artwork-mapping regression checks, content validation and production build; no new physical-device acceptance or addon-runtime test is claimed.

## 2026-11-01 — Amazin renamed to StealthEmotes

**Babuni.dev requested:** Replace Amazin with the supplied StealthEmotes repository. **AI interpretation/implementation:** Update the display name and public connection while preserving semantic ID `amazin`, the existing Amazin.webp artwork, WoW menu grouping and nine-keyword/add-on classification. Replace only this repository snapshot after anonymous verification; no duplicate project is introduced and other snapshots are retained.

The upstream README identifies StealthEmotes as formerly Amazin, but still contains stale wording that the rename is proposed and the repository remains amazin. The author’s explicit instruction and verified new repository establish the portfolio name; raw upstream history is not silently rewritten. A Project source note distinguishes current repository naming from unchanged Amazin.lua/Amazin.toc, saved variables and /amazin commands. Source behavior is watched-slot emotes and rested-XP reporting, not confirmed successful Stealth detection. No addon-code change, new artwork or runtime test is claimed.

**Alternatives/verification:** Avoid adding a second tile or renaming installation files without a separate addon decision. Existing Markdown composition handles the imported documents; regression checks verify stable identity/artwork, no old source snapshot and the new source link. Run content validation, full tests and authenticated production build before publication; local restart preserves the user’s document edits and art.

## 2026-11-01 — LevelUpAnnouncer replaces BuxbrewDing

**Babuni.dev requested:** Replace BuxbrewDing with the supplied LevelUpAnnouncer repository. **AI implementation:** Rename the active tile and update its explicit public mapping, source link and ten standard document snapshot, keeping stable ID `buxbrewding`, BuxbrewDing.webp, WoW grouping and one guaranteed add-on cue. No duplicate project is added. Only this repository snapshot is replaced.

**Source evidence and alternatives:** The reviewed README describes 60 roleplay level-up announcements, local previews and explicit manual guild sends, superseding the portfolio’s prior unknown-purpose summary. The evidence classification changes from name-only to repository-backed; the nine keywords now reflect those documented subjects. The pinned README confirms the repository rename; installed BuxbrewDing.lua/BuxbrewDing.toc and /buxbrew commands retain historical names. The portfolio resource note explains that distinction rather than silently rewriting imported history or renaming game files. Lua/client compatibility and announcement behavior remain unverified; no addon code, release/version decision or installed runtime change is claimed.

**Verification:** Regression checks cover the new display/source, historical artwork identity, absence of the old source snapshot and imported documentation. Content validation, full tests, authenticated activity and production build precede publication; no browser screenshot or physical-device/gameplay test is claimed for this metadata/source update.

## 2026-11-01 — Keep ResistInsight’s identity and history

The supplied ResistInsight repository is the name I want shown in place of BuxbrewResist. AI applied that replacement to the existing tile rather than adding a duplicate, preserving its artwork and source history. The README’s on-hold status is reflected in the portfolio; ResistForever remains its separate successor. Historical installation names stay in the imported source text. This decision changes portfolio naming and source selection, not the addon’s runtime or development status.

## 2026-11-01 — Preserve identity through the ActionEmotes #2 rename

The new ActionEmotes #2 name is the replacement I requested for Buxbrew Addon. AI applied it to stable ID `buxbrew` rather than creating another project or merging it with ActionEmotes #1. The existing BuxbrewAddon.webp artwork remains. Only this source snapshot changes; historical installed identifiers remain verbatim. The repository-backed summary replaces the old unknown-purpose placeholder without claiming a tested game release.

## 2026-11-01 — Preserve the distinct Battle Emotes Legacy project

The name supplied for ROAR is now the title I want in the portfolio: **Battle Emotes Legacy**. AI changed stable ID `roar` rather than creating a duplicate or changing `roarr`. Its ROAR.webp image remains. Imported historical/runtime names are preserved and explained in the source module. This decision updates portfolio naming and source selection, not addon code or release readiness.

## 2026-11-01 — Give the separate ROARR project its new name

For stable ID `roarr`, the new name I supplied is **Battle Emotes**. AI connected the renamed repository and retained ROARR.webp; stable ID `roar` remains **Battle Emotes Legacy** with ROAR.webp. Both installed packages may use historical ROARR identifiers, but those do not merge the portfolio entries. The prior decision to leave ROARR untouched applied before this new request and is now superseded for its display/source naming only.

## 2026-11-01 — Keep the multi-slot project distinct

The MultiActionEmotes repository is the replacement I requested for ROARRunlimited. AI used its existing `roarrunlimited` identity and RoarUnlimited.webp instead of adding another project or merging it with Battle Emotes. The source link and documents now use the new repository, while historical installed names remain. This is a portfolio/source rename, not a new feature or a decision about addon distribution.

## 2026-11-01 — Preserve the addon/community distinction

The supplied RoarGuildAddon repository is the source I want for the existing **RoarGuild Add-on** entry. AI replaced its old connection while retaining stable ID `roarguild` and RoarGuildAddon.webp. The separate Roar Guild community keeps its own identity and art. Source history and installed identifiers remain verbatim; this decision updates portfolio content selection, not addon behavior or community ownership.

## 2026-11-01 — Keep RoarSoundEffects as the same sound project

The supplied RoarSoundEffects repository is the replacement I requested for ROARSounds. AI used stable ID `roarsounds` and kept ROARsounds.webp rather than adding a duplicate or merging it with the other ROAR-family projects. Imported historical names stay intact. This decision updates portfolio naming and source selection, not runtime behavior or ownership of game sound assets.

## 2026-11-01 — Preserve EmoteTrigger’s project boundary

**Status:** Superseded for display name and source by the subsequent RoarGuildAddonWrath decision below. The historical reasoning and stable identity remain relevant.

The supplied EmoteTrigger repository is the replacement I requested for ROARemoteTrigger. AI applied the name/source update to stable ID `roaremotetrigger`, preserving ROARRemoteTrigger.webp instead of creating a duplicate. Historical ROARTrigger files, /rogu and ROGUDB remain in imported source text. The separate RoarGuild Add-on keeps its own record and features; this is a portfolio rename, not a runtime migration.

## 2026-11-01 — Supersede the intermediate EmoteTrigger name

The new repository supplied for this same project is **RoarGuildAddonWrath**. The title I want represented is the current source’s **Roar Guild Addon Wrath**. AI replaced the intermediate EmoteTrigger mapping on stable ID `roaremotetrigger`, preserving ROARRemoteTrigger.webp rather than adding another entry. The non-Wrath RoarGuild Add-on remains separate. Existing installed names stay historical/current source identifiers; the earlier EmoteTrigger decision is superseded for naming, not deleted from the record.

## 2026-11-01 — Do not announce a hypothetical wait

The header correction I requested is conditional feedback: an ordinary shift should describe the shift, while an actual queued transition should say it is waiting. AI removed the unconditional appended explanation instead of changing when shifts finish or how transitions queue. Existing waiting messages and shift/wait emphasis remain. The earlier always-explain interpretation is superseded by this clarification.


## 2026-11-01 — Reuse a departing identity when the grid is full

**Babuni.dev observation:** a possible project-identity change immediately after a shift, following catalog additions/removals. The report remains a visual observation, not a confirmed reproduction of the exact event.

**AI diagnosis and implementation:** when every real and neutral identity is already visible, prefer the uniquely departing project's identity for the incoming stone instead of introducing a persistent duplicate of a continuing visible project. A departing identity is eligible only if it is not still represented by another continuing visible tile, is not pinned, and is not already reused for another simultaneous entrance.

**Boundary:** the existing 42-project catalog, three neutral identities, shift duration, movement, and bloom layout remain unchanged. When the viewport has more visible stones than identity capacity, some real-project repetition remains unavoidable; this correction does not claim otherwise. Automated regression and live-browser verification are distinct.

## 2026-11-01 — One Buxbrew module per archive folder

**Babuni.dev direction:** use the newly created `BuxbrewCharacterStory` public repository for the existing Buxbrew character-story project; expose Assets, Character, Docs, Family, Journal, Lore, Places, Relationships and Stories as nine folder modules. Each should list its Markdown files and open them in the website's own reader rather than consuming a separate module per document.

**AI implementation:** created a `document-list` module type with a reversible in-reader file selection. The character archive is imported as a pinned, strictly allowlisted public source. Root-level `AGENTS.md`, `CANON.md`, `TIMELINE.md` and `WRITING-GUIDE.md` appear under Docs. Assets currently contains no Markdown or public images, so the module links its actual three subfolders rather than fabricating entries.

**Boundaries:** retain `buxbrew-character-story` as the stable project ID, existing artwork, eight actual standard-document imports, the source link and nine folder modules. Missing standard documentation is not synthesized. No live production deployment or physical-device acceptance is implied.

## 2026-11-01 — Name the story repository AmberbrewStory

The existing public `BuxbrewCharacterStory` repository has been renamed to `AmberbrewStory`. This was my choice of repository name; it does not rename Buxbrew herself or turn the character into another website project. AI updated the connected source, pinned snapshot identity, generated reader URL contract, and reporting/tests. The existing tile's stable ID `buxbrew-character-story` and all nine collection modules remain unchanged. Earlier documentation naming the original repository remains as development history; current technical references use `babunidev/AmberbrewStory`.

## 2026-11-01 — Amberbrew Story is the public project title

**Creative decision:** The portfolio project itself is named **Amberbrew Story**, matching its `babunidev/AmberbrewStory` source repository. **Buxbrew — character story** is the previous display title, not a second project. Buxbrew remains the character's name within the family archive and source documents.

**Implementation:** AI changed the display name carried by the stable `buxbrew-character-story` catalog entry and updated its portal topic label, repository report and name regression test. The semantic ID and `BuxbrewCharacter.webp` artwork remain unchanged so grid placement, bookmarks, module lookups and existing content associations continue to refer to the same project.

## 2026-11-01 — Complete the Amberbrew Story identity rename

**Creative decision:** both the public title and the internal portfolio ID must be **Amberbrew Story** / `amberbrew-story`, matching the renamed `babunidev/AmberbrewStory` repository. The earlier decision to retain `buxbrew-character-story` is superseded by this explicit clarification, not silently rewritten.

**AI implementation:** migrated the catalog's existing entry, source-connection key, menu membership, topic pool key and tests without creating a second project. The portal artwork, position, original 40 Markdown documents, and nine document-list modules are preserved. Canonical generated module and project URLs now use the new ID. Local and VPS checkouts require an actual Git update before visitors can see this change.

## 2026-11-01 — Tests should not freeze editorial content

**Status: Accepted.** The creative rejected tests that prevented routine repository documentation updates by expecting fixed words, commit hashes, project counts, titles or other mutable content. The accepted boundary is to test parsing, safety, source integrity, grid behavior and accessibility without deciding editorial choices.

**Alternative considered:** update test expectations after every documentation sync. Rejected because it makes changing prose require code edits and obscures real regressions.

**AI implementation:** refactored content-sensitive tests toward current-data validation and synthetic fixtures, keeping checks for public-only sources, links, safe document rendering and intentional interaction behavior. **Verification:** changes are committed on a separate review branch; complete local tests and deployment remain unverified until the branch is integrated and tested.

## 2026-11-04 — Roadmap reconciliation and local admin integration

Babuni.dev requested an accurate remaining-work list and assessment of Babuni.admin. AI reconciled the active roadmap with recorded operator deployment checks and reviewed the admin's public revision `ef2d1c1`. The local-only portfolio workspace remains non-operational; outbound publishing is planned. The new ADMIN_INTEGRATION plan separates existing full static releases from proposed targeted document publishing, coherent output dependencies, release verification and visibility controls. Deployment orchestration belongs in Babuni.admin. Live loading and interaction measurements remain open; content completion is not a gate. No application behavior, upstream snapshots, server configuration or production release changed. Verification: documentation consistency and repository diff review; no new runtime, device or live performance result claimed.


## 2026-11-04 — Ground the connection in both codebases

**Human direction:** Babuni requested an actual analysis of how the admin can manage the website after the earlier review did not establish the connection. **AI finding:** GitHub and publish profiles have no capabilities or transport implementation; the portfolio workspace is a placeholder. The website has a full static pipeline, not a targeted document publisher. **Proposal, open:** begin with read-only catalog discovery, then reviewed source edits/full releases, then dependency-aware partial builds. Avoid a website rewrite or public management API for the documented outbound local-app approach. No schema, transport or automatic refresh behavior is represented as implemented or separately accepted. Detailed evidence and acceptance: [ADMIN_INTEGRATION](ADMIN_INTEGRATION.md).


## 2026-11-08 — ROARguild community repository mapping

**Status:** Accepted source mapping; local website verification pending.

**Creative direction:** The existing `roar-guild-and-community` project identity should represent the ROAR guild community repository, not the separate WoW addon repository.

**AI contribution:** Traced the existing public-document snapshot and on-demand reader pipeline, then extended its explicit path allowlist for the guild's community documents.

**Decision:** Map the stable project ID to `babunidev/ROARguild` on `main`. Import the overview, concept, journal, changelog, decisions, roadmap, charter, community principles, activities, governance, Sunday road-bonfire concept, and Oracle design. Keep `roarguild` mapped to `babunidev/RoarGuildAddon`.

**Boundary:** This is a pinned documentation connection, not a live mirror, not an addon-source import, and not evidence that the Oracle or guild activities are implemented. Local testing and creative review remain pending.
