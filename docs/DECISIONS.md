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
