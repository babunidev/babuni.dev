# Authoring project modules

This guide covers **how to add and review project modules**. It distinguishes hand-curated modules from repository-imported documents and generated publishing assets. The current instructions come first; dated sections later in this file preserve historical implementation context and should not override verified current behavior.

For content principles, see [Content model](CONTENT.md); for connected sources, [Repository connections](REPOSITORY_CONNECTIONS.md); for attribution and publication standards, [Human–AI collaboration](AI_COLLABORATION.md).

## Current authoring workflow

The small bloom renders content previews. A module's Read more opens the draggable big bloom focused on that module; another Read more opens its framed detail reader. The selected project tile is the starting anchor, not a permanent world center. Up to eight populated modules reserve real neighboring cells and reveal in a shuffled sequence. The eight immediate neighbors form a 3×3 square with the anchor in the middle. Pan to reach modules outside a small viewport. Reopening samples again; a selection is stable while open. Empty definitions do not render or reserve cells.

Project definitions live in `src/content/project-modules.json`, keyed by stable project ID. Module IDs are unique within a project and independent of position. The content catalog can contain more than eight entries.

## Media files and publication

- `public/media/babuni-dev/images/` — website screenshots, sketches and artwork.
- `public/media/babuni-dev/videos/` — web-ready clips and poster images.
- Use the same structure under `public/media/button-game/` when its media is ready.
- Refer to these as `/media/babuni-dev/images/filename.webp`, without `public` in the URL.

GitHub versions the assets. The deployed website serves them; GitHub is not a video streaming backend. The current native player progressively loads an MP4/WebM URL on demand (`preload="none"`), with no autoplay. MP4 exports here have their metadata at the beginning for playback/seek support. Larger future libraries can use an external media host without changing module identity. A file alone does not create a module: add it to the catalog explicitly.

Preserve original visual sources and credits. Only reviewed, website-ready derivatives belong under `public/media/`; historical conversion details and particular recordings belong in [Visual documentation](VISUAL_DOCUMENTATION.md). Published images use WebP. Verify actual file formats, image descriptions, rights and playback before publishing.

## Supported definitions

All modules have `id`, `type`, `title`, `preview`, and optional `source`/`credit` metadata.

- **Text:** Choose either `body` for authored text or `document` for a registered local Markdown path; never both. Curated previews appear in blooms; full source documents are prepared as separate static assets and loaded on demand in the reader. Markdown rendering and link handling must be checked against current reader behavior, not assumed from earlier prototypes.
- **Gallery:** `images` contains `{src, alt, caption?}` entries. The preview shows one image with a Next image control where applicable.
- **Video collection:** `videos` is an array of video records, one project collection module. Legacy `video` is accepted for a single record. Each record contains `{src, poster?, title}` for a local/native clip, or `{embed, title}` for a supported external player. Embed URLs must be HTTPS `www.youtube-nocookie.com/embed/<id>` or `player.vimeo.com/video/<id>`. External frames load only after pressing Load video.
- **Resources:** `links` contains `{label, href}` entries. Resource destinations open on explicit activation.

Empty module definitions are permitted, but do not appear or reserve grid cells. Do not invent filler content to populate them. Module counts in older project examples are historical, not guaranteed current.

## Source documents and provenance

Project documentation imported from public repositories is a **revision-pinned snapshot**, not a live feed. Preserve its source, revision, existing copyright, credits and authorial voice. The human creative decides content direction and publication; AI-assisted summaries must be distinguishable from source text and must not claim unverified releases or compatibility.

## Historical content sets and verification

BABUNI.DEV has nine populated modules: overview, concept, journal, changelog, architecture, collaboration, gallery, one Videos collection containing four recordings, and repository resources. Each opening selects eight without replacement. Button Game has overview, play/combinations, Android Wi-Fi play, development story and source/documentation. Its editorial text was grounded in public README, CONCEPT, journal and architecture documents inspected on 2026-10-26. These are curated snapshots with source links, not an automatic live feed or independent gameplay/release verification.

## Validation and review

For content changes, run `npm run content:check`, `npm run test:grid` and `npm run build` when the development environment is available. A production build also requires fresh public activity metadata; a failure to access it is not evidence of a content defect. Record which checks were actually run.

The following original test description is historical: Catalog tests check populated counts, linked document/media existence, random sampling, unique identities, stagger bounds and embed URL validation. Geometry tests cover one through eight module footprints, stationary anchors, reversible mapping, no overlapping expansion and straight vertical shift endpoints.

Big bloom belongs to the same draggable living grid. Every module occupies 2×2 tile cells. It contains every populated module, uncapped; the chosen module is central and the others receive shuffled content assignments once per entry. Positions reveal top-first clockwise for the first nine, then extend down in three columns. The original-size project tile stays in the selected module’s lower-left quarter and returns to the retained small bloom. Text intros use up to 1,600 characters of real body content; galleries add captions/counts and Videos lists its recordings. Detail views scroll normally and return to the same camera position. YouTube upload/URL migration is deferred by Babuni.dev; existing local recordings remain playable.


## Historical implementation notes

The following dated sections record earlier authoring mechanics, design changes and publishing decisions. Their descriptions of what was pending, generated or manually registered apply to those checkpoints and may be superseded. Check current source and scripts before applying an older procedure.

### 2026-10-26 — Button Game portal artwork

Portal identity images belong in `public/portal-content/`. Assign their public URL through `portalArtwork` in `src/lib/demo-projects.ts`; filenames alone do not assign artwork. Button Game uses `/portal-content/PortalContentButtonGame.webp`. Portal artwork is separate from gallery module content.

## Content validation and blank templates

Run `npm run content:check` before committing content. `npm run build` runs this automatically. Errors identify the project, entry index and field. Checks cover project/module identities, supported fields/types, previews for populated modules, registered documents, local assets (including portal artwork), image descriptions, video records and HTTP(S) resource/source URLs. Empty definitions remain valid. Every record in a nonempty media/link array must be complete; use an empty array while drafting. Native video sources must be local public files; external players use supported embed URLs.

Generate a blank definition with `npm run content:template -- gallery visual-history` (replace `gallery` with `text`, `video` or `resources`). Copy the printed JSON object into the chosen project's array in `src/content/project-modules.json`, with a comma between entries. This command writes no files. Choose a unique lowercase hyphenated ID and an accurate title. Add a preview and real content together when ready. Preserve source links and credits; do not invent claims to fill a slot. For a new project, first use its stable ID from `src/lib/demo-projects.ts`. New document sources still need a raw import/mapping in `src/lib/project-content.ts` and registration in `scripts/content-tools.mjs`.

Before publishing, review the actual module at small, big and detail depth: the summary must fairly represent the source, images need useful descriptions, links should lead to the intended destination, and third-party permissions/credits need human review. Validation checks local structure and file existence, not factual truth, remote URL availability, image quality, codecs or permission to publish. No remote content is downloaded. Existing source-linked Button Game summaries remain editorial snapshots.


## 2026-10-27 — Framed detail reader

Detail presentation update: Read more from big bloom opens the complete module inside a centered, framed square over the grid, with internal scrolling. It no longer fills the viewport. Back/Escape still returns to the retained big-bloom camera; image fullscreen stays available.


## 2026-10-27 — Repository-backed project documentation

This supersedes the earlier two-project/manual text-only workflow: `src/content/project-repositories.json` records each project’s source and status. See REPOSITORY_CONNECTIONS.md for coverage and unresolved projects. To connect another public repository, set status connected, repository owner/name and its verified branch. Private/unresolved entries cannot specify a publishable source. Optional paths select a subset of the ten standard documents.

Run `npm run content:sync` to fetch source documentation, then `npm run content:report`, `npm run content:check`, tests and build. The repository-sync process records source revisions and should preserve the prior snapshot on refresh failures; authentication requirements may change, so consult the current script and environment before running it. Missing 404 files and empty bodies are omitted; authorization/rate-limit/network failures are errors. Ordinary builds do not fetch GitHub; commit a reviewed snapshot to update what visitors read. BABUNI.DEV uses local raw documents immediately.

Standard text modules are generated automatically from source documents. The manual project-modules.json remains for curated previews, media, resources and project-specific extras. Matching text bodies come from the source; source imports can populate formerly empty text definitions. Do not edit the generated remote snapshot by hand. Excerpts are literal source text rather than independent AI summaries. New local registered documents use the shared document-path contract in repository-content.ts plus raw imports in project-content.ts. No media is automatically discovered or downloaded from README links.


## On-demand documentation assets (2026-10-27)

Full source Markdown is no longer shipped inside the grid JavaScript bundle. `npm run content:prepare` creates a compact synchronous module preview index and a collection of exact static Markdown files under `public/_project-docs/`, using only committed public repository snapshots and the current local Markdown. They are generated artifacts excluded from Git; do not hand-edit or commit them. `npm run dev`, `npm run test:grid` and `npm run build` prepare them automatically, so local work needs no additional setup. If editing docs while the dev server stays running, rerun `npm run content:prepare` (or restart dev) to refresh local source previews/assets. Before publishing fresh external documents: `npm run content:sync`, `npm run content:report`, then check/tests/build and review as usual.

The small/big blooms still display immediate source-based excerpts and the existing up-to-1,600-character introduction. Only opening a *full text detail* requests its source file, with loading, retry and cancellable close. This prevents network timing from changing the grid's approved bloom choreography. Video/gallery data remains unchanged. Verify the actual reader on desktop and phone and confirm its text parity with the original source.


## WebP publishing policy — 2026-10-27

All published images, including gallery captures, portal artwork, video posters and the favicon, use WebP. Current screenshot captures were found to contain JPEG bytes despite their historical `.png` names; these and JPEG posters use quality-85 WebP with unchanged dimensions. Future genuine PNG screenshots should use lossless WebP where practical, measuring output size and checking readability. Keep originals outside `public/`. `npm run content:check` rejects other image formats and invalid WebP container signatures before building. The browser capture may start as temporary PNG; convert it before adding it to the gallery and visual manifest.

## 2026-11-01 — Folder-based Markdown collections

The Buxbrew character archive introduces `document-list`, a generated module kind alongside text, gallery, video and resources. Nine cards are built from the pinned public source's Assets, Character, Docs, Family, Journal, Lore, Places, Relationships and Stories directories. A card lists available Markdown filenames in the modal reader. Selecting a filename loads the full Markdown inside the same reader; Back to the folder restores the list without closing the bloom. Root canon, timeline, writing guide and AGENTS documents are included in the Docs list.

The folder modules are not manually authored duplicates of document bodies. Their `documents` entries are derived from the generated document index, with `title`, `path`, `bodyUrl` and pinned `source`. Individual files do not occupy bloom tiles. The Assets folder currently provides links to its three empty media subdirectories; no missing image or Markdown is invented. Refresh the source using `npm run content:sync`, then validate/test/build before publishing. The exception is limited to the character repository, not a general recursive importer for all public GitHub repositories.
