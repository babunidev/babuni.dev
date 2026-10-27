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
