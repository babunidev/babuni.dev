# Authoring project preview modules

## Current stage

The small bloom renders content previews, not the future full-page expanded reader. Its project tile stays centered initially; up to nine populated modules reserve real neighboring cells and reveal in a shuffled sequence. Eight fit around the anchor; a ninth extends one cell farther right. Pan to reach modules outside a small viewport. Reopening samples again; a selection is stable while open. Empty definitions do not render or reserve cells.

Project definitions live in `src/content/project-modules.json`, keyed by stable project ID. Module IDs are unique within a project and independent of position. There is no nine-entry limit on the content catalog.

## Where to put images and videos

- `public/media/babuni-dev/images/` — website screenshots, sketches and artwork.
- `public/media/babuni-dev/videos/` — web-ready clips and poster images.
- Use the same structure under `public/media/button-game/` when its media is ready.
- Refer to these as `/media/babuni-dev/images/filename.jpg`, without `public` in the URL.

GitHub versions the assets. The deployed website serves them; GitHub is not a video streaming backend. The current native player progressively loads an MP4/WebM URL on demand (`preload="none"`), with no autoplay. MP4 exports here have their metadata at the beginning for playback/seek support. Larger future libraries can use an external media host without changing module identity. A file alone does not create a module: add it to the catalog explicitly.

Keep original visual documentation in its source folder. Only selected website-ready derivatives belong under `public/media/`. The originals were not modified. Current exports derive from four short files in Babuni.dev’s `visualdocumentationmaterial/moduleContentVideo`; they crop browser chrome and encode a 960px-wide H.264 MP4. The mixed 26-minute recording is not published here. The two JPG screenshots are copied unchanged.

## Supported definitions

All modules have `id`, `type`, `title`, `preview`, and optional `source`/`credit` metadata.

- **Text:** `body` holds plain text, or `document` references one of the local document sources registered in `src/lib/project-content.ts`. The provider resolves the real Markdown into `body`; the small card displays the curated preview. Concepts, architecture, journals, changelogs and collaboration records reuse this type. Full text is available in the data for a later expanded reader.
- **Gallery:** `images` contains `{src, alt, caption?}` entries. The preview shows one image with a Next image control where applicable.
- **Video:** `video` contains `{src, poster?, title}` for a local/native clip, or `{embed, title}` for a supported external player. Embed URLs must be HTTPS `www.youtube-nocookie.com/embed/<id>` or `player.vimeo.com/video/<id>`. External frames load only after pressing Load video.
- **Resources:** `links` contains `{label, href}` entries. Resource destinations open on explicit activation.

An empty `body`, empty `images`/`links`, or absent video source is intentionally empty. Do not add filler text simply to make an empty module appear. Button Game has exactly five populated definitions and four empty definitions; its media is not invented. Other provisional projects keep one summary preview from their existing catalog description.

## First content sets and provenance

BABUNI.DEV has twelve populated modules: overview, concept, journal, changelog, architecture, collaboration, gallery, four recordings and repository resources. Each opening selects nine without replacement. Button Game has overview, play/combinations, Android Wi-Fi play, development story and source/documentation. Its editorial text was grounded in public README, CONCEPT, journal and architecture documents inspected on 2026-10-26. These are curated snapshots with source links, not an automatic live feed or independent gameplay/release verification.

## Verification

Run `npm run test:grid` and `npm run build`. Catalog tests check populated counts, linked document/media existence, random sampling, unique identities, stagger bounds and embed URL validation. Geometry tests cover one through nine module footprints, stationary anchors, reversible mapping, no overlapping expansion and straight vertical shift endpoints.

The expanded page layout is still open for refinement: fixed left-content/right-selector panes versus larger scrolling modules was discussed by Babuni.dev, not finalized or implemented in this stage.
