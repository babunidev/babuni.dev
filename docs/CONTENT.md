# Portfolio Content Model

## Goal

Content must be editable by humans or authorized AI agents without rewriting the interface. Every project may use a different mix of modules. The website's own development record is a first-class portfolio item.

## Suggested project fields (schema to finalize)

- id: stable, unique slug independent of title and tile instance
- title, shortSummary, longDescription
- status: idea / prototype / in-development / released / archived
- categories and tags
- portal: logo/art asset, alt text, project-specific engraving theme
- infoPoints: three currently planned short flavor hints (above/left/right); former four-point plan superseded. Include curation evidence and review status.
- modules: ordered set of typed preview/detail sources
- links: official sources, repository, demos, releases with explicit labels
- created / updated dates only when supported by records
- provenance: source documents, verified claims, original Babuni.dev notes

## Module types

- Text document: summary, Markdown/MDX body, related notes.
- Development log: chronological author–AI narrative with provenance.
- Image gallery: asset list, captions, alt descriptions, rights, display order.
- Video: title, poster, embedded URL or local media, transcript where possible.
- File: filename, file type, size if known, licensing/availability, download URL.
- Release: version, date, changelog reference, source.
- Feature / experiment: demonstrated behavior, media, implementation status.

## Progressive disclosure

Grid tile displays the engraved title and portal. Temporary bubbles show short project facts. Small bloom displays introductory modules that occupy neighboring tile space. Full bloom exposes module previews. Detailed viewers show the full text, galleries, video or downloads.

## Self-exhibit: babuni.dev

Treat this website as an ordinary project record rather than special hardcoded prose. Its available modules should include concept, dev journal, changes, design evolution/mockups, architecture, and collaboration methodology. Being the first or centered tile remains a proposal requiring visual testing.

## AI authoring contract

Before generating a project entry, verify facts against its source repository, Babuni.dev-provided material or an authoritative link. AI may write explanatory text, but must distinguish source facts from inference and avoid inventing achievements, releases or contributors.

Maintain both human agency and transparency:
- The human author is responsible for creative direction and approval of substantive changes.
- An agent's generated description is an edited artifact, not a first-person quotation from the human.
- Development entries should attribute requests/decisions and AI contributions explicitly.

## Privacy and rights

The public repository is not a full chat archive. Summarize project-relevant prompts rather than copying private conversations. Do not publish identities, personal-life data, secrets, or copyrighted media without proper rights. Keep original asset attribution and licensing.

## Open design work

Schema implementation, media hosting policy, thumbnail generation, image resolution variants, embed consent/privacy, download serving, content validation and AI publishing permissions.

## Provisional candidate catalog for the living-grid prototype (2026-10-26)

The temporary `src/lib/demo-projects.ts` now contains **53 candidate identities**, transcribed in approximate recent-to-old order from `PROJECT_INVENTORY.md`. Each carries a provisional slug-like `id`, visible `name`, `shortSummary`, original inventory `evidence` label and decorative `tint`. BABUNI.DEV stays at the center and is rendered uppercase. These are **prototype names**, not a set of 53 verified, approved, independent releases. Related addon lineages, alternative names, lore works, and conceptual studies have deliberately not been merged yet.

The one-line descriptions are stored for future info points or bloom content but are not yet displayed as new information bubbles. Before converting any entry into a portfolio exhibit, confirm individual title, relationship to parent works, authorship, status, source links, rights and Babuni.dev approval. The later production schema must not assume the provisional catalog IDs will remain final.

## Temporary topic label for the first information point (2026-10-26)

For the first interactive information bubble, a separate `src/lib/project-topics.ts` map supplies **one very short subject/category** per provisional project ID. It was manually derived by the assistant from the available one-line candidate descriptions, intentionally avoiding longer marketing blurbs and technical/release claims. The 53 topic words are provisional editorial metadata, independent of title, summary and evidence fields. Examples include "Reaction game", "Local AI" and "Worldbuilding".

Later versions should review actual project descriptions, reliable documentation, development journals, and existing creative material, then curate a richer but minimal set of interesting descriptors. Such keyword extraction should retain provenance and human editorial approval; avoid automatic publication of unreviewed AI-generated claims. The existing descriptions remain stored for future, richer interactions. Currently the popup renders only its one topic, not the original shortSummary, and does not imply that all 53 candidates are distinct finished exhibits.

## First bloom module from provisional summaries (2026-10-26)

The one-cell small-bloom prototype uses the selected candidate's existing provisional `shortSummary`. Its contents are distinct from the much shorter topic marker. This tests spatial displacement and selection before a production portfolio schema exists. Occasional ambient topic teasers reuse the same 53 reviewed-for-prototype draft subjects; no new creative claims, art assets or source materials are added. Publication approval and proper multi-module content remain future milestones.

## Lower small-bloom module — 2026-10-26

**Babuni.dev requested** a second module below the selected project after consulting the intended content. CONCEPT and DESIGN list descriptions, keywords, metadata, media, dev-log and file availability as candidates without fixing this slot. **AI chose** a provisional “Project notes” module using existing `project-topics.ts` labels and `demo-projects.ts` evidence classification, explicitly stating that candidate details await review. No invented release status, media availability, or development history is supplied. The right summary module remains. Final lower-module editorial choice and production project verification remain open for Babuni.dev.

## Topic wing presentation — 2026-10-26

Babuni.dev explicitly allows topic snippets to overlap neighboring tiles. Existing provisional labels are unchanged. AI removed the right bubble’s narrow-column typography and uses matching readable padding/font sizes across all three; wrapping is based on a shared reading-width limit, not available room inside the tile.

**2026-10-26 presentation update:** Babuni.dev requested random sequential topic discovery. Existing labels remain unchanged; portal exploration now accumulates the three snippets in shuffled order rather than showing all simultaneously.

**2026-10-26 calm-shift correction:** Summary, notes and topic text are unchanged. Pending selections retain their source/project identity while waiting for the current shift. Visibility reservations now check occupied visual positions, avoiding decisions based on pre-displacement positions. Fading content in place was authorized as an alternative but not implemented in this correction.

## First supplied portal image — 2026-10-26

**Babuni.dev supplied** `PortalContentImages/PortalContentBabuniDev.png` and identified it as the logo they made for BABUNI.DEV. The agent inspected and copied that file unchanged into `public/portal-content/PortalContentBabuniDev.png`; the agent did not generate or redraw it. Source and served copy have identical SHA-256 digests. It is assigned only to semantic project ID `babuni-dev`, independent of visual position or recycled DOM slot.

The square artwork is displayed behind a round crop; the original is retained intact. PNG preserves the supplied logo’s pixels and supports transparency if later versions use it; a JPEG conversion was unnecessary for this first integration. Other projects’ portal art remains unprovided. No new provenance, rights, release-status or project-summary claims are inferred from the image.

**2026-10-26 unified tile control:** Existing topic text and supplied artwork are unchanged. Each tile’s single button announces its project name and three topic snippets; the portal is decorative, with no duplicate accessible action or extra tab stop. Whole-tile hover/focus presents the same snippets in the existing shuffled sequence.

**2026-10-26 mobile discovery:** Existing topic labels and their random sequential reveal are reused for the tile under the screen center on coarse/no-hover input. This reveals hints, not project selection. No new copy or long-press instructions were introduced. Open summary/notes modules keep their content while panning away and back; their semantic source is retained beyond DOM recycling.

## Full-bloom module proposal — AI draft for Babuni.dev review, 2026-10-26

Babuni.dev asked to specify module structure collaboratively before building full bloom, prioritizing architecture and underlying structures over polish. The following is **AI-proposed, not an approved schema or implementation**. It refines the existing module candidates without requiring every project to have every type.

| Family | Content examples | Preview and expanded view |
| --- | --- | --- |
| Text / document | Overview, concept, guide, architecture, collaboration notes | Short excerpt; conventional scrolling reader |
| Image collection | Artwork, screenshots, sketches, design evolution | Cover/thumbnail; browsable gallery and optional art-only fullscreen |
| Media | Video or audio where provided | Poster/title; deliberate playback and supporting captions/transcript when available |
| Development history | Journal entries, experiments, decisions, changes and releases | Recent entry or highlight; chronological entries opening into the shared text reader |
| Resources | Source repositories, demos, releases and downloadable files | Named destination/file summary; explicit open/download action |

**Shared structure proposed:** Each project owns an ordered list of optional modules. Each module has a stable ID, family, title, short preview, full content or source references, and provenance/credits where applicable. Preview and detailed view use the same content source, avoiding separate prose for every display depth. Layout preferences are separate from content identity; do not bake fixed grid coordinates or a mandatory eight-module ring into project data. Load heavy media only when needed.

History can reuse text rendering for individual entries; overview, concept and architecture are editorial roles of text modules, not separate one-off renderer types. Releases can appear as history entries linking to resource records. A feature/experiment can use text plus images/media rather than needing a custom component per project.

**First self-exhibit candidate:** BABUNI.DEV could offer Overview/Concept, Design sketches, Development journal, Changelog, Architecture and Human–AI collaboration. Only include media that actually exists and is approved. These are candidates for review, not built full-bloom modules or claims that a gallery is already available.

**Open for refinement:** Family boundaries, which modules appear in small bloom, initial full-bloom selection/order, whether history needs its own overview layout, and how much layout control project authors receive. No full-bloom renderer or production schema has been implemented by this draft.

## First populated preview catalog — 2026-10-26

**Babuni.dev authorized:** Populate BABUNI.DEV from its documentation and supplied visual material, and create five content-bearing Button Game modules. **Implemented:** BABUNI.DEV contains twelve populated definitions: overview, concept, development journal, changelog, architecture, collaboration methodology, a two-image collection, four supplied recordings and repository resources. Sampling shows up to nine per opening. Text/document modules contain actual body text or resolved local Markdown; cards show curated excerpts.

Button Game’s five are overview, play/combinations, Android Wi-Fi play, development story and source/documentation. They are AI-curated summaries grounded in the public repository README, CONCEPT, docs/DEVLOG and docs/ARCHITECTURE inspected on 2026-10-26. Source links are retained. Historical/release-status contradictions in evolving upstream docs were not promoted into unverified release claims. Image/video and two other definitions remain empty and are excluded; no Button Game media was invented or repurposed from unrelated footage.

Babuni.dev supplied the two JPG screenshot records and four short recordings from `visualdocumentationmaterial/moduleContentVideo`. JPGs are unchanged; video exports crop browser chrome, scale to 960px and encode web-ready MP4 plus poster images. Originals remain unchanged locally. The 26-minute mixed recording was inspected through sample frames and excluded. Media credit identifies Babuni.dev as supplier and discloses the derivative operation. Individual preview playback is implemented; full-page text/gallery composition remains future work.

See [Module authoring](MODULE_AUTHORING.md) for `public/media/<project-id>/images/` and `videos/` paths, catalog fields, empty-slot rules, supported external player URLs and asset checks. Adding media alone does not automatically publish a module; selection is explicit in the project catalog.


## 2026-10-26 — Button Game portal artwork

Babuni.dev supplied `public/portal-content/PortalContentButtonGame.png`; copied unchanged and assigned to `button-game`. This portal identity image does not populate a gallery module or change the five populated Button Game modules.


## 2026-10-26 — Eight modules around the center

**Babuni.dev correction:** Display at most eight populated modules around the project tile. This supersedes nine-preview descriptions above. BABUNI.DEV retains its twelve definitions, sampling eight per opening; Button Game retains five populated modules. No content was deleted.


## 2026-10-26 — Draggable big bloom and module detail

**Babuni.dev requested:** A single Videos home for all project recordings, used in small and big bloom. **Implemented:** Four BABUNI.DEV video definitions consolidated into `videos`, containing all four supplied records. BABUNI.DEV now has nine populated modules (eight sampled in small bloom, all nine in big bloom); Button Game retains five, with empty definitions excluded. Source text, galleries, credits and video assets remain intact. Expanded readers use real resolved bodies rather than only the curated preview sentence. Basic document blocks render; advanced Markdown styling and relative-document navigation remain future improvements.

Babuni.dev deferred YouTube migration because links are not available. Existing local MP4 playback remains; no videos were uploaded and no claim of YouTube-backed traffic is made.


## 2026-10-26 — Big bloom grows inside the living grid

Content depth is now progressive: small bloom retains curated teaser sentences; large text modules use up to 1,600 characters derived from the real resolved body, with full text still in detail. Large galleries add captions and counts; the Videos intro lists the supplied recordings and keeps the collection detail. Credits remain visible. No new content or YouTube URLs were fabricated. The catalog remains nine populated BABUNI.DEV modules and five Button Game modules; the latter’s empty definitions remain excluded. Larger future catalogs extend down instead of adding extra lateral rings.


## 2026-10-26 — Four additional portal images

Babuni.dev supplied four additional portal identity files, copied unchanged: `FavorCraft.png` → `favorcraft`, `FlourishForever.png` → `flourishforever`, `ResistForever.png` → `resistforever`, and `SocialForever.png` → `socialforever`. They live under `public/portal-content/` and do not create or fill gallery modules.


## 2026-10-26 — Stronger action and waiting feedback

Babuni.dev’s positive assessment of the current design and request for stronger interaction feedback are recorded in DEVLOG. This feedback update changes no project prose, media assets, module counts or content sampling.


## 2026-10-27 — Content validation and authoring

Babuni.dev requested Content Validation and Authoring. Existing nine BABUNI.DEV populated modules and five populated/four empty Button Game modules are retained. Use `npm run content:check` and the blank-template workflow in MODULE_AUTHORING.md. Empty definitions stay hidden; incomplete media/link records fail validation. Sources and credits are checked structurally, not independently fact-checked or license-cleared. No additional project content was invented.


## 2026-10-27 — Five more project portals

AnskarGrotzschnapf.png, AzerothMoments.png, LocalAAIWorkstation.png, LocalPromptLab.png and RoarForever.png are supplied project portal images, copied unchanged and assigned to their matching project IDs. Portal artwork does not populate gallery modules or establish project release readiness.


## 2026-10-27 — Framed detail reader

All module types retain their full detail content in the new framed square reader. Long text, galleries and video collections scroll inside the panel. No summaries, source claims or media changed. Explicit image fullscreen remains a separate opt-in action.


## 2026-10-27 — Hidden scrollbars

Long text and media collections retain native scrolling with hidden scrollbars; no content is removed or truncated by this presentation change.


## 2026-10-27 — Repository-backed project documentation

The repository-backed source contract is now implemented in project-repositories.json and REPOSITORY_CONNECTIONS.md. Standard files map to Overview, Concept, Development journal, Changelog, Architecture, Design, Decisions, Human–AI collaboration, Roadmap and Content. Source bodies are preserved, not rewritten by AI. Existing curated teasers may still introduce them; other teasers are literal source excerpts. Source links identify an exact fetched commit; local BABUNI.DEV sources link to main.

Coverage: 34 connected tiles via 33 public repositories, twelve with no match found, four private-review and three unresolved family mappings. One additional public repository, Rocketgame42, has no existing tile. Missing documents are omitted rather than filled. Button Game’s old five-populated/four-empty description is historical: its actual source documentation now populates additional text modules; images/video remain empty until supplied. BABUNI.DEV now has 13 populated modules, including existing gallery/video/resources.

Babuni.dev explicitly chose public-only extraction. Private documents were not fetched; their URLs and review notes are handed off outside the public checkout. No source repo is changed. Public source availability is checked at refresh time, not on every visitor request; source factual claims, rights and advanced Markdown fidelity remain editorial review items.


## 2026-10-27 — Public documentation as on-demand static assets

The source of truth stays unchanged: manually curated modules and credits in `project-modules.json`, explicit public-only repository mappings, full verified public snapshots in `repository-documents.json`, and local Babuni.dev Markdown documents. Development/export tooling now derives *temporary* static files for each allowlisted source document and an index containing short source-derived previews and up-to-1,600-character big-bloom intros. Both the original author/source link and document text remain intact. Missing, empty, private, and unresolved sources do not generate publication modules.

Only the short index is included when the browser first loads the grid. Full source text arrives when someone opens its detail, not when they enter small/big bloom. Manual media, credited project summaries, gallery/video modules and explicit links remain unchanged. Source paths are validated to prevent fetching arbitrary repository files. Regenerate with `npm run content:prepare`; the normal npm dev, test and build scripts do so automatically. Never edit or commit generated files; update the original Markdown or reviewed snapshots instead. Network errors in the visitor's browser must show a retry, not fabricated filler. The original source provenance and editorial review requirements still apply.

## Portal-artwork sources changed to creator-owned WebP originals (2026-10-27)

The catalog's twelve `portalArtwork` paths now target WebP files, including BuxbrewResist. Babuni.dev provided and already converted the images locally; their source bytes are *not* accessible from the file-manager screenshot in this cloud session. No image was generated, re-encoded, extracted from a thumbnail, or falsely attributed to AI.

The expected source path is `public/portal-content/<canonical>.webp`. The optional byte-preserving `npm run artwork:import -- "folder"` helper aligns local filenames, and Babuni.dev's subsequent local Git commit will add the original images. Only the image binary commit and a green CI content check can verify that the paths resolve in GitHub.


## 2026-10-27 — Complete supplied WebP artwork and retain reader attribution

Supplied portal artwork now covers fifteen projects. The additional ROARR.webp, TheGreatIceflowRelay.webp and WorkThatGodBod.webp are explicitly assigned; BuxbrewResist.webp and the earlier eleven are included in Git as well. All WebPs are byte-preserved, with old portal PNGs removed as superseded. This adds identity artwork, not invented gallery/module content.

Source links and attribution credits remain available throughout asynchronous document loading, including failures and retries. No repository document bodies or factual claims were rewritten.


## 2026-10-27 — Render repository Markdown as document structure

Imported Markdown is preserved unchanged while the detail reader now displays its common Markdown/GFM structure correctly, including the WorkThatGodBod Content example supplied by Babuni.dev. Relative/reference links and heading navigation work without rewriting stored documents. Raw HTML, scripts and embeds are not executed; Markdown images remain explicit links, with galleries/videos still authored as their existing module types. This supersedes earlier descriptions of a headings-and-flat-lists-only reader. Advanced extensions such as math/MDX and GitHub-specific alert styling are not claimed.


## 2026-10-27 — Dismiss the reader from its surround

The complete module content, source links and attribution remain in the reader. Its navigation chrome now omits Back to big bloom; outside click/tap or Escape returns one level without rewriting content or resetting the big-bloom camera.


## Preview formatting and living content — 2026-10-27

Babuni.dev clarified that this is a living, growing project: WIP content is expected and completion is secondary. Curated previews may contain Markdown. Generated teasers preserve inline formatting; longer intros preserve fitting Markdown blocks and bounded paragraph excerpts. Initial document H1 is omitted to avoid duplicating the module title. Preview text links remain labels until reading the document. No AI-authored factual summaries replace repository text.


## About, project search and screenshot history — 2026-10-27

Babuni.dev requested About and searchable direct project navigation. Search uses the existing 53-candidate inventory, including WIP/unresolved entries, not a new claim that every project is complete. About summarizes the existing creative workshop concept and human/AI attribution. All 19 locally available saved AI browser verification screenshots have been added to Visual documentation, with historical captions identifying superseded states and distinguishing browser evidence from actual phone tests. The original supplied artwork/prototype images remain. See `VISUAL_DOCUMENTATION.md` for the archive manifest.


## WIP About and interface language — 2026-10-27

Babuni.dev requested a more personal About and authorized gathering available chats/known project information as WIP. AI drafted `src/content/about.md` from established project interests and creative-process discussions, using the artist name Babuni.dev. FavorCraft’s public README supplies exact Babunigaming Instagram, YouTube and CurseForge URLs; the connected repository owner supports the GitHub profile. No exact place of origin, personal legal name or life-history dates were verified; these remain future authoring rather than placeholders presented as facts. About wording is an AI-assisted editorial draft. Public profile references do not imply the accounts were live-login tested. Activity labels use current project/module names. Controls are contextual help rather than persistent bottom copy.

## 2026-10-27 — Source freshness, tile coverage and media inventory

The current inventory of **53 named tiles** is a prototype/candidate set. Of those, **34 tile entries** are associated with **33 public repository sources**; 15 distinct creator-supplied WebP portal images are committed at `public/portal-content/`. A candidate tile lacking a repository, release, media, author-approved text or full documentary set must be shown as provisional rather than filled with AI-invented biography.

GitHub source material is ingested as **reviewed revisions**, currently represented by `src/content/project-repositories.json` and `src/content/repository-documents.json`. The latter contains a **static snapshot**, so the sequential documentation commits in other repositories do **not** automatically refresh the site. The explicit `npm run content:sync` flow must be followed by `content:check`, test/build, source/credit review and a new commit. This audit has **not** run that sync or updated generated assets.

The reader delivers full Markdown **on demand**, while smaller modules retain compact, formatted previews and existing media. Raw HTML, MDX and executable embeds from external documents do not become trusted active content; images inside Markdown remain links rather than automatic media. The Visual documentation gallery stores **21 dated/context-captioned AI browser captures plus two originally supplied images**, including earlier superseded designs; see [visual manifest](VISUAL_DOCUMENTATION.md).

**Not a release claim:** A tracked WebP filename, public repository link or earlier successful browser screenshot is not proof of current user approval for every tile, native-phone usability or hosted availability.

## WebP assets and archive fidelity — 2026-10-27

All locally published image assets are WebP. Historical verification filenames now use `.webp`; captions/credits and capture context remain unchanged. The prior `.png` capture files were actually JPEG, verified by decoding rather than extension. Their quality-85 derivatives retain dimensions and use smaller files; original bytes remain in the local task image-originals archive. Source repository Markdown is unmodified. Favicon SVG was rasterized losslessly and the unused ICO duplicate was removed from public assets.


## Performance evidence — 2026-10-27

Babuni.dev’s report of uncomfortable uneven motion is actual desktop feedback. AI measurements are local in-app desktop browser samples and synthetic computation benchmarks, not physical-phone evidence or a full browser trace. See PERFORMANCE-2026-10-27.md. Verification captures remain WebP and carry development-context captions. No project source text, artwork or authored media was changed by the playback/performance work.


## Keyboard controls language and evidence — 2026-10-27

Controls help now describes highlight-first spatial navigation: Tab to center, arrows choose, Space/Enter opens, Escape returns. Selection/focus wording must not imply automatic opening. Keyboard screenshots are AI desktop browser evidence, distinct from human acceptance or phone testing. Existing project text/media remain unchanged.

## B favicon asset — 2026-10-27

Babuni.dev supplied Enchanted Stone Portal Logo.png and directed use of only its B graphic. AI used the built-in image editor to isolate the graphic, then resized and encoded the transparent 64×64 WebP (7,926 bytes). Original artwork is unchanged outside public assets; do not describe AI-assisted extraction as a pixel-identical crop. See FAVICON_ASSET.md for the exact prompt. Browser verification imagery is AI evidence, separate from human artwork and phone acceptance.


### Header B mark — 2026-10-27

Babuni.dev additionally requested the B to the left of BABUNI.DEV in the persistent header, using WebP, and explicitly authorized committing, pushing, updating and restarting the local site for future changes. AI reused the transparent 64×64 favicon at 32×32 CSS pixels, with fixed dimensions and decorative empty alternative text beside the existing accessible brand name. This adds no image duplicate or interaction changes.

## Reader handle verification imagery — 2026-10-27

Existing B WebP header/favicon art and branding captures remain intact. Added two AI browser captures to Visual documentation: the superseded first proportional-thumb preview and the compact handle after dragging. Published captures are WebP; original JPEG bytes remain outside public assets. No content sync, repository text rewrite or new human artwork is implied.

## Performance evidence and accepted interactions — 2026-10-27

Babuni.dev’s keyboard round-trip and reader-handle acceptance, positive reader scrolling and Firefox observations are human evidence. The long-session calculation benchmark is AI measurement; it is not a device frame-rate claim. Project text, imported snapshots, portal art and existing image credits are unchanged by caching work. Browser verification captures remain AI evidence with historical captions.

## Four curated public editions — 2026-10-28

Babuni.dev approved documentation-only publication for four private projects. AI prepared initial public summaries from their inspected README/CONCEPT, keeping attribution and evidence limits while excluding private links, code, assets, configuration and history. This is a narrower public edition, not a mirror of every original document. MorkahjaWorld remains reserved; arcanitebrothers documents Morkahja Admin. Publication was blocked before creation; no new source text enters the current site yet. See PUBLIC_DOCUMENTATION_PLAN.md.

## Verified public edition import — 2026-10-28

Babuni.dev published all four prepared editions. The site imports their exact public Markdown (ten documents each), retaining human/AI attribution and evidence limitations. Ethera and Morkahja RPG describe distinct applications; MorkahjaWorld stays reserved; arcanitebrothers describes Morkahja Admin. These are curated public summaries, not full private histories or runnable distributions. Revision-pinned source links point only to the public editions. Other project snapshots and media remain unchanged.

## Four additional original portal WebPs — 2026-10-28

Babuni.dev supplied BattleReport.webp, Ethera.webp, ROARGuild.webp and WarriorStartAttack.webp in the local public/portal-content folder and asked for them to be added. Each decoded as 1254×1254 WebP and was copied unchanged to its matching project mapping; there are nineteen original portal artworks. No AI image generation, crop, resize or recompression occurred in this import. SHA-256 records are in PERFORMANCE-2026-10-28.md. Browser resize captures are AI verification evidence and include an explicitly superseded failed local-server preview; all are published as WebP. Current source snapshots and text content are not refreshed by this task.

## Human content curation — 2026-10-28

Babuni.dev withdraws Talent Design Atlas (non-project/gimmick), Redridge Recipe Planner (duplicate of FavorCraft), Human–AI Development Journal (already within BABUNI.DEV), and Morkahja — World and Peoples (duplicate of retained MorkahjaWorld). These are authoritative curation decisions, not automated content scoring. Historical inventory entries and screenshots document prior states rather than active offerings. The remaining worldbuilding tile gains an attributed scope module because its existing public edition still reflects an earlier reserved-repository description.

ArcaniteBrothers.webp is a newly supplied 1536×1536, 169,052-byte WebP, copied unchanged to the existing project ID. Source hash and human/AI roles are recorded in DEVLOG. There are twenty mapped supplied portal artworks. Existing human–AI documents remain available through BABUNI.DEV; no journal text or contribution history was deleted.

## Family/template withdrawals — 2026-10-28

Babuni.dev additionally withdraws The Amberbrew Family and Practical Templates Creator. Their historical inventory mentions remain research history, not active projects. Neither had connected source text or curated module content. Other family/character entries are not implicitly removed.

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


## 2026-10-28 — Curated catalog and Rocket Game 42

Babuni.dev requested Rocket Game 42 (`rocket-game-42`), connected to public `babunidev/Rocketgame42`. Ten allowlisted documents were imported at `29028bcd2ed476de92bbed96d6f464e0c2968383`, verifying public access without publishing private sources. Existing snapshots were preserved. The catalog contains 43 projects and 35 public repository connections. Requested display renames preserve existing semantic IDs: Morkahja, Morkahja Worldbuilding, Roar Guild. The latter shares `ROARGuild.webp` with the still-separate addon. Twenty active project-art assignments use nineteen unique supplied files; older unused supplied art is retained.

Five neutral tile identities are renderer-only decoration, excluded from catalog/search/modules. The complete menu grouping proposal lists all 43 projects; classification and potential duplicate merges remain for Babuni.dev review, not automatic implementation.


## 2026-10-28 — Community/addon clarification and music outlets

Babuni.dev confirmed Morkahja Admin Console duplicates Arcanitebrothers: remove the former catalog/mapping entry and retain the latter's public docs. Analubia is retained after the same-message retraction of its proposed removal. Stable ID `roarguild` now displays RoarGuild Add-on and describes the human-confirmed guild invitation/character behavior tool; its supplied artwork mapping is removed. Community ID `roar-guild-and-community` retains `ROARGuild.webp`. Nineteen active project assignments use nineteen unique supplied WebPs.

New IDs: `mighty-morkah` (Mighty Morkah, piano/music videos at https://www.youtube.com/@MightyMorkah/videos) and `elixior` (Elixior, music/audio art at https://soundcloud.com/elexior-ludwig). Both have attributed Overview and Listen resources modules, and no invented repository/recording metadata. Direct web retrieval was unavailable, so these are human-supplied links/descriptions, not independently verified media catalogs. Mighty Morkah's move to music-only and migration of WoW videos to Babuni Gaming remain plans. No Babuni Gaming tile is added without its own supplied outlet.

All 44 current projects appear once in the approved menu groups; Music contains the two new outlets. Three neutral render identities are excluded from the project/content counts. Source snapshot contents were unchanged.


## 2026-10-28 — Buxbrew character asset

Babuni.dev assigned the supplied `BuxbrewCharacter.webp` to Buxbrew — character story. Original WebP bytes copied unchanged from the local public/portal-content folder. Twenty active projects now have twenty unique supplied artwork mappings. No new authorship or source claims are inferred from the image.


## 2026-10-28 — Supplied Morkahja WebP

Morkahja (`morkahja-rpg`) uses Morkahja.webp, supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. Twenty-one active project artwork assignments now reference twenty-one unique supplied WebPs. Morkahja Worldbuilding remains a separate entry.


## 2026-10-28 — TotemTimers supplied WebP

TotemTimers.webp was supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. Twenty-two active project artwork assignments now reference twenty-two unique supplied WebPs. No additional content or authorship claims inferred.


## 2026-10-28 — Babuni Gaming source and media

Babuni.dev supplied the project description and exact profiles:
- YouTube: https://www.youtube.com/@babunigamingg
- CurseForge: https://www.curseforge.com/members/babunigaming/projects
- Instagram: https://www.instagram.com/babunigaming/

The three Babuni Gaming modules describe gaming/streaming and sharing experiences, current WoW emphasis, the connection to some addons/Azeroth Moments, and public profile resources. AI editorial text is attributed to the supplied human direction; no activity schedule or completed video migration is claimed. CurseForge's public profile was readable during this pass; YouTube and Instagram retrieval was unavailable, so their profile contents were not independently inspected.

Source image `/home/babuni/Pictures/babunidev/Morningex1.jpg` is retained in the local image-originals archive outside public assets. Public asset `/portal-content/BabuniGaming.webp` is lossless at the original 1000×1000 dimensions, with exact decoded RGB pixel equality verified; no AI generation, crop or resizing. All public image assets remain WebP. Current artwork coverage: 23 active project assignments. No dedicated repository was supplied for this project; existing public snapshots are unchanged.


## 2026-10-28 — EnchantVisuals supplied WebP

EnchantVisuals.webp was supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. Twenty-four active project artwork assignments now reference twenty-four unique supplied WebPs. No additional authorship or source claims are inferred from the image.


## 2026-10-28 — Buxbrew Addon label

Babuni.dev renamed Buxbrew to Buxbrew Addon. This is a display-name correction; no new functionality claims are added. The character-story project and source snapshots are unchanged.


## 2026-10-28 — BuxbrewCharge supplied WebP

BuxbrewCharge.webp was supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. Twenty-five active project artwork assignments now reference twenty-five unique supplied WebPs. No additional functionality or authorship claims inferred.


## 2026-10-28 — Buxbrew Addon supplied WebP

BuxbrewAddon.webp was supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. Twenty-six active project artwork assignments now reference twenty-six unique supplied WebPs. BuxbrewCharacter.webp remains assigned solely to the character-story entry.


## 2026-10-29 — RoarGuild Add-on supplied WebP

RoarGuildAddon.webp was supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. It belongs to the addon; community Roar Guild retains ROARGuild.webp. Twenty-seven active project artwork assignments now reference twenty-seven unique supplied WebPs.


## 2026-10-29 — MeleeStartAttack supplied WebP

MeleeStartAttack.webp was supplied by Babuni.dev and copied byte-for-byte from the local portal-content folder. Twenty-eight active project artwork assignments now reference twenty-eight unique supplied WebPs. No additional functionality or authorship claims inferred.


## 2026-10-29 — Babuni Admin and historical public documentation

Babuni.dev renamed the Arcanitebrothers implementation project to Babuni Admin. Its supplied repository was confirmed private through metadata, while the existing public documentation edition remains public. The current website label is Babuni Admin; the source connection remains babunidev/arcanitebrothers-docs, with explicit historical-name context. Earlier names inside imported Markdown and prior screenshots are not silently rewritten. No private implementation documents or URLs are added to the website. Existing ArcaniteBrothers.webp remains assigned to the same stable project until replacement artwork is supplied.


## 2026-10-29 — Renamed Babuni Admin public docs

Babuni.dev supplied the renamed public docs URL: https://github.com/babunidev/babuni.admin-docs. Anonymous verification confirmed public visibility and ten standard documents at the existing revision. Their Markdown bodies are unchanged. Active links now use the new name; old names in historical documents, dated journal entries and screenshots remain truthful history. No private implementation content imported.
