# Design and Engineering Decision Register

**Status vocabulary:** Accepted, Proposed, Experimental, Superseded, Open. Entries reconstructed from conversation are marked retrospective. New decisions should include date, Babuni.dev input, AI proposal, rationale, and evidence.

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

## Adding decisions

For each entry add date, status, motivating Babuni.dev request, alternatives (including AI-originated ones), rationale, impact, and verification links. When changing a decision, mark the original **Superseded** rather than silently rewriting history.

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
