# Visual documentation

This document is the **visual evidence index** for babuni.dev: dated browser captures, creative-supplied screenshots, visual experiments, and recorded regressions. It complements the [development journal](DEVLOG.md), [design reference](DESIGN.md), and [dated performance reports](PERFORMANCE-2026-10-27.md). It is not a gallery of the current site alone, nor proof that a design was accepted or deployed.

**Evidence rules:** Identify who supplied or captured an image, what environment or viewport it shows when known, what the image demonstrates, and what it cannot establish. A simulated mobile viewport is not a physical phone test; a still image does not establish animation smoothness or performance. Retain superseded and failed captures with accurate captions. Do not reconstruct missing timestamps or claim that an inaccessible capture was recovered.

**Publishing rules:** Keep original source files and authorship distinct from published derivatives. Since 2026-11-25 screenshots are not kept in Git: website-ready captures belong in the server media folder, locally `public/screenshots/babuni-dev/verification/` (or `public/screenshots/<project-id>/`), listed in `src/content/server-media.json` (see [Screenshot publishing plan](SCREENSHOT_PUBLISHING_PLAN.md)). The files named below were moved there from `public/media/babuni-dev/images/verification/` that day; the gallery must reference the intended published asset. Verify WebP content rather than trusting a filename extension. Preserve credits, relevant rights, and accessibility descriptions. Where a screenshot documents a change, link its dated evidence to the corresponding journal or design decision.

## Initial screenshot archive — historical starting set

The first archival pass collected the **19 available AI browser captures** listed below. This is a historical starting count, **not a total of all currently archived screenshots**. Their original test times were not reconstructed and some layouts are now superseded.

- `big-bloom-grid-preview.webp` — big bloom grid preview.
- `big-bloom-preview.webp` — big bloom preview.
- `bloom-preview.webp` — bloom preview.
- `calm-bloom-preview.webp` — calm bloom preview.
- `framed-detail-reader.webp` — framed detail reader.
- `markdown-bloom-preview.webp` — markdown bloom preview.
- `markdown-reader-workthatgodbod.webp` — markdown reader workthatgodbod.
- `mobile-center-topics-preview.webp` — mobile center topics preview.
- `mobile-persistent-bloom-preview.webp` — mobile persistent bloom preview.
- `module-previews.webp` — module previews.
- `new-portal-artworks.webp` — new portal artworks.
- `open-bloom-no-topics-preview.webp` — open bloom no topics preview.
- `portal-logo-preview.webp` — portal logo preview.
- `reader-outside-dismissal.webp` — reader outside dismissal.
- `repository-backed-roar-detail.webp` — repository backed roar detail.
- `restored-reader-attribution.webp` — restored reader attribution.
- `stronger-waiting-feedback.webp` — stronger waiting feedback.
- `topic-wings-preview.webp` — topic wings preview.
- `unified-tile-preview.webp` — unified tile preview.

Subsequent dated sections add captures to this original set. Counts quoted at individual checkpoints describe that moment, not the latest inventory. Do not include unsaved tool captures or images from inaccessible chats as if they were archived.

## Persistent-navigation verification, 2026-10-27

- `persistent-header-project-search.webp` — Projects search inside the About reader.
- `persistent-header-big-bloom.webp` — Site header above grid-native big bloom.

Both are AI browser captures added with this change. Total archived AI captures: 21, alongside two original supplied images.

## Reader and activity refinement, 2026-10-27

- `reader-controls-about-wip.webp` — WIP About, source-backed links, centered activity.
- `reader-contextual-activity.webp` — Reading BABUNI.DEV Overview, centered contextual label and header-end help.

Both captures are desktop browser evidence; the full-width phone reader needs physical-phone confirmation. Total AI browser captures: 23, alongside two original supplied images.

## WebP publication check, 2026-10-27

- `webp-publication-check.webp` — browser-loaded WebP portal artwork, gallery and video poster; Next image worked.

All 24 archived AI captures now publish as actual WebP. Earlier `.png` filenames contained JPEG bytes, despite the previous extension-based description. Captions preserve history; original bytes remain outside public assets.

## Desktop shift playback, 2026-10-27

- `desktop-shift-playback.webp` — grid after a real drag during an active shift. AI desktop browser evidence; still image is not FPS proof. See PERFORMANCE-2026-10-27.md for measured callback intervals and limits.

## Spatial keyboard highlight, 2026-10-27

- `spatial-keyboard-highlight.webp` — Human–AI collaboration highlighted in big bloom after reader Escape, with no reader open. AI desktop evidence; not complete keyboard/device acceptance.

## Browser branding — 2026-10-27

- `browser-branding.webp` — AI desktop browser capture of the grid with no Astro toolbar. Favicon link metadata was checked separately; browser tab chrome is not captured. Original JPEG bytes are preserved outside public assets; published capture is WebP.

- `header-branding.webp` — AI desktop browser capture, 2026-10-27: B WebP beside BABUNI.DEV, no Astro toolbar. Original capture is JPEG, preserved outside public assets.

## Reader position handle — 2026-10-27

- `reader-scroll-first-preview.webp` — AI desktop browser capture of the initial long proportional thumb, superseded by the compact version.
- `reader-scroll-dragged.webp` — AI desktop browser capture after dragging the compact thumb to the final About links. Scroll position changed from 0 to 345, then Home returned to 0.

Both originals were JPEG bytes and were converted to WebP for publication. These are desktop observations, not physical-phone acceptance.

## Retained source cache — 2026-10-27

- `retained-cache-bloom.webp` — AI desktop smoke capture after normal dragging, queued selection/shift completion, eight-module small-bloom opening and dragging with the bloom retained. Not an hours-long or FPS check. Original encoded JPEG is held outside public; published asset is WebP.

## Four public documentation editions — 2026-10-28

- `public-documentation-reader.webp` — AI desktop browser verification of Ethera’s public Concept in the reader, after small → big → reader navigation. Public pinned source link checked in the accessibility tree. No physical-phone check claimed. Original JPEG bytes preserved outside public assets.

## Production resize checks — 2026-10-28

- `resize-first-server-ended.webp` — first small-bloom resize capture, with failed artwork reloads after the temporary local server ended. Superseded; retained as requested development history, not successful image verification.
- `production-small-bloom-resize.webp` — verified 900×680 production viewport, same eight small modules and loaded selected artwork after resize.
- `production-big-bloom-resize.webp` — verified thirteen-module big bloom after desktop/phone resize and reader return.

AI desktop browser viewport evidence; no physical-device acceptance claimed. Encoded originals were JPEG and are retained outside public; published versions are WebP.

## Owner project curation — 2026-10-28

- `arcanitebrothers-banner-verified.webp` — AI desktop browser capture of supplied ArcaniteBrothers artwork loaded in the selected portal with eight preview modules. Menu was separately verified to contain 49 entries, zero withdrawn names and one MorkahjaWorld. Original capture is JPEG, retained outside public assets; publication is WebP. No physical-device check claimed.


## Curation and neutral grid verification — 2026-10-28

AI browser captures, not human phone acceptance. Original encoded captures retained outside public assets; published versions converted to quality-85 WebP.

- `curated-grid-default.webp` — default viewport with curated project artwork.
- `curated-grid-desktop.webp` — 1920×1080 viewport with partially visible edges and neutral vacancy at left; autonomous shift active. Not evidence of a new tile-size decision.


## Human neutral-wall regression report — 2026-10-28

`neutral-wall-human-report.webp` is Babuni.dev's supplied desktop screenshot of the rejected repeated-placeholder walls. Converted from actual PNG to lossless WebP, with original retained outside public assets. It is failure evidence for the superseded five-filler policy, not an AI verification capture or proof of the corrected behavior.


## Bounded neutral and music menu checks — 2026-10-28

AI browser captures at 1920×1080, published as quality-85 WebP after checking actual encoding (JPEG originals retained outside public assets). All available captures from this pass are archived:

- `bounded-neutral-desktop.webp` — corrected grid before wide drags.
- `bounded-neutral-after-pan.webp` — after two wide drags; three unique neutral identities, no gray walls; real project repeats are allowed.
- `music-project-menu.webp` — grouped Music search showing both author-supplied outlets.

These are short browser observations, not real-phone or prolonged-session acceptance. The human's earlier wall screenshot remains separately archived as failure evidence.


## Babuni Gaming verification — 2026-10-28

`babuni-gaming-project-preview.webp` — AI browser capture at the default viewport, showing the original cat in its round portal and the three new small-bloom modules. Menu search returned the project under Games; loaded image measured 1000×1000 and the resource module contained all three exact supplied profile URLs. Actual screenshot encoding was JPEG, converted to quality-85 WebP; original retained outside public assets. This is a browser check, not physical-device acceptance or external media playback verification.


## Babuni Admin rename — 2026-10-29

`babuni-admin-renamed-preview.webp` — AI browser capture at the default viewport: renamed tile, retained supplied artwork and Public documentation resource explaining the earlier project name. Menu search and bloom activation succeeded; its visible resource links only to the existing public documentation edition. Actual capture was JPEG, published as quality-85 WebP with original archived outside public assets. No private application or physical-device test was performed.


## Chronological first spiral — 2026-10-29 (superseded ordering)

Two AI browser captures at 1920×1080, converted from actual JPEG to quality-85 WebP; originals retained outside public assets:

- `chronological-first-spiral.webp` — early intro cascade with BABUNI.DEV, Ethera and Morkahja leading. Scaled/incomplete tiles are the existing reveal animation.
- `chronological-grid-after-shifts.webp` — fully revealed field after normal autonomous shifts; this later frame is not the pristine initial order.

This was a verification of the **earlier chronological ordering**, superseded on 2026-10-30 by the creative's decision to shuffle other projects once per visit while keeping BABUNI.DEV first. The initial DOM in this historical capture contained 45 visible identities and the first nine spiral cells exactly matched the then-generated chronological IDs. Project menu categories remained intact; selecting Babuni Admin opened its eight-preview bloom with the correct public documentation link. A failed first DOM read used an unavailable parseFloat helper; a clean reload/read succeeded. No screenshot was saved from that failed read. These checks are not extended physical-device acceptance.


## 2026-10-29 — Search-readable pages and on-demand modules

![AI desktop production preview: LootFeed readable project page with server-rendered Markdown and real links; pre-deployment localhost verification.](../public/screenshots/babuni-dev/verification/readable-project-release.webp)

AI desktop production preview: LootFeed readable project page with server-rendered Markdown and real links; pre-deployment localhost verification.

![AI desktop production preview: LootFeed small bloom after on-demand module loading; original shift wait feedback and normal reveal observed. Not a physical-device or internet-load measurement.](../public/screenshots/babuni-dev/verification/on-demand-bloom-release.webp)

AI desktop production preview: LootFeed small bloom after on-demand module loading; original shift wait feedback and normal reveal observed. Not a physical-device or internet-load measurement.

## 2026-10-31 — Random keyword discovery

![SocialForever keyword bubbles](../public/screenshots/babuni-dev/verification/random-keyword-bubbles.webp)

AI browser capture at 127.0.0.1:4327, desktop viewport. SocialForever displays three distinct sampled keywords including the guaranteed “World of Warcraft add-on” cue. Keyboard focus re-entry visibly changed its pair of keywords; the current reveal remained visible during autonomous motion. This is an agent browser observation, not a new physical-phone acceptance. The browser API returned JPEG; the archived website image is verified WebP.

## 2026-11-01 — GuildChatBridge restored

![Restored GuildChatBridge small bloom](../public/screenshots/babuni-dev/verification/guildchatbridge-restored.webp)

AI desktop browser capture: selected GuildChatBridge from the World of Warcraft menu, observed centering and eight source-backed small-bloom previews, including the paused concept and decisions. JPEG capture converted to verified WebP. No supplied project artwork, live-addon test or physical-phone acceptance is claimed.

## 2026-11-01 — Waiting copy only for queued actions

![Ordinary shift header](../public/screenshots/babuni-dev/verification/header-ordinary-shift.webp)

AI desktop browser capture from the temporary 127.0.0.1:4327 preview. The header shows only “Columns are shifting” during an unqueued shift. After the capture, activating BABUNI.DEV during that shift visibly changed the header to “Waiting for shift to finish · BABUNI.DEV”; its small bloom subsequently opened. The screenshot was captured as JPEG and archived as WebP. A later attempted queued-close observation did not encounter a shift within the browser wait window, so no closing screenshot or fresh physical-device acceptance is claimed.

## 2026-11-10 — Folder images above their documents

![Folder image layout fixture](../public/screenshots/babuni-dev/verification/folder-image-layout-fixture.webp)

AI headless-Chrome capture of a fixture page using the site's built stylesheet and the markup the new folder code produces. It shows a small bloom, a big bloom card and the reader's folder index. A 64-pixel test icon keeps its size; a 1400-pixel test image scales to the card or reader width; names and buttons are centered; a document without an image shows only its name. The images are generated test squares, not project art. This is not a capture of the live grid, and no connected repository contained paired images at the time. Not phone acceptance.


## 2026-11-19 — Sharing from the reader

![Reader share button](../public/screenshots/babuni-dev/verification/reader-share-desktop.webp)

![Folder document link on a narrow screen](../public/screenshots/babuni-dev/verification/reader-share-folder-document-phone.webp)

AI headless-Chrome captures from the temporary 127.0.0.1:4329 preview, at 1280 and 390 pixels. A deep link opened the changelog reader, and a second link opened one lore document inside Amberbrew Story's Lore folder. In both, the share button sits in the reader's top-right corner and copied the link to exactly the view on screen. These are browser simulations, not a physical phone test.

## 2026-11-19 — The project icon leads back

![Project icons on big-bloom cards](../public/screenshots/babuni-dev/verification/project-icon-big-bloom-desktop.webp)

![Project icon in the reader on a narrow screen](../public/screenshots/babuni-dev/verification/project-icon-reader-phone.webp)

AI headless-Chrome captures from the temporary 127.0.0.1:4329 preview at 1280 and 390 pixels. Every Button Game big-bloom card carries the round project icon top left; in the reader the icon and the share button form a row above the title. In the same run, the reader icon returned to the big bloom and a card icon returned to the small bloom. Browser simulations, not a physical phone test.

## 2026-11-25 — Projects menu by activity and About link cards

![Projects menu sorted by latest update](../public/screenshots/babuni-dev/verification/projects-menu-by-activity-desktop.webp)

![About links as cards](../public/screenshots/babuni-dev/verification/about-link-cards-desktop.webp)

![About portrait above its heading on a narrow screen](../public/screenshots/babuni-dev/verification/about-portrait-heading-phone.webp)

AI headless-Chrome captures from the temporary localhost:4391 preview, at 1366 and 390 pixels. The Projects menu lists the most recently updated project first with "today" / "2 days ago" labels; the About page shows the Elsewhere links as cards with a picture, title and description, and the portrait above "The person behind the projects". Not a physical phone test.

## 2026-11-25 — A sign-up form inside the Morkahja reader

![Morkahja sign-up frame in the reader](../public/screenshots/babuni-dev/verification/signup-reader-desktop.webp)

![Morkahja sign-up frame on a narrow screen](../public/screenshots/babuni-dev/verification/signup-reader-phone.webp)

AI headless-Chrome captures from the temporary 127.0.0.1:4329 preview at 1280 and 390 pixels, taken after Show sign-up form was pressed in Morkahja's Follow the journey reader. The frame shows the live EmailOctopus page; no address was submitted. Browser simulations, not a physical phone test.

## 2026-11-25 — The sign-up form as a big-bloom card

![Morkahja big bloom with the sign-up card in the center](../public/screenshots/babuni-dev/verification/signup-big-bloom-desktop.webp)

![The sign-up card scaled to fit on a narrow screen](../public/screenshots/babuni-dev/verification/signup-big-bloom-phone.webp)

AI headless-Chrome captures from the temporary 127.0.0.1:4329 preview at 1280 and 390 pixels, after Babuni asked for the form directly in the big bloom. The project tile is hidden while the sign-up card is the central one. These supersede the reader captures above as the current design. Browser simulations, not a physical phone test; nothing was submitted.

## 2026-11-25 — Reader text in section cards

![Changelog reader with one card per entry](../public/screenshots/babuni-dev/verification/reader-section-cards-changelog-desktop.webp)

![About page as section cards on a narrow screen](../public/screenshots/babuni-dev/verification/reader-section-cards-about-phone.webp)

AI headless-Chrome captures from the temporary localhost:4392 preview at 1366 and 390 pixels: each main section of a reader is its own card with the heading on top. Not a physical phone test.

## Development screenshots, 13–25 November 2026

Added on 2026-11-25 from Babuni's local screenshot collection, where AI agents saved their browser captures. Served from the server media folder (`/screenshots/babuni-dev/<date>/`), not kept in Git; 171 are on the server, these 47 are in the gallery and the development journal. Captures of the same day's first screenshot check keep the white strip that check found, as history. Browser captures, not physical-device acceptance.

- `2026-11-13/big-bloom-share-buttons.webp` — Big-bloom cards with the round share button in the corner, local build.
- `2026-11-13/live-big-bloom-share-buttons.webp` — The share buttons on the live site.
- `2026-11-13/deep-link-big-bloom.webp` — A deep link opening a project straight in its big bloom.
- `2026-11-13/deep-link-changelog-reader.webp` — A deep link opening a changelog in the reader.
- `2026-11-13/grid-button-game-play-module-big-bloom-desktop.webp` — The Play Button Game card with its QR code in Button Game's big bloom.
- `2026-11-19/reader-single-title-desktop.webp` — A changelog reader with one title instead of two.
- `2026-11-19/small-bloom-entries-desktop.webp` — Small-bloom cards showing the newest entry.
- `2026-11-19/reader-single-title-phone.webp` — The single title on a phone.
- `2026-11-19/classic-wow-addons-portal.webp` — The portal artwork for the Classic WoW Addons collection.
- `2026-11-19/collection-grid-desktop.webp` — The collection tile in the living grid.
- `2026-11-19/collection-big-bloom-desktop.webp` — The collection's big bloom with one card per addon.
- `2026-11-19/collection-artwork-desktop.webp` — The addon cards with their own artwork.
- `2026-11-19/project-folder-icons.webp` — All the folder icons of the collection.
- `2026-11-19/project-icon-big-bloom-desktop.webp` — The project icon in the top-left corner of a big bloom.
- `2026-11-19/project-icon-reader-desktop.webp` — The same icon in the reader.
- `2026-11-19/project-icon-big-bloom-phone.webp` — The project icon on a phone.
- `2026-11-19/reader-share-desktop.webp` — The share button in the reader.
- `2026-11-19/reader-share-folder-document-desktop.webp` — Sharing one document inside a folder reader.
- `2026-11-19/reader-share-phone.webp` — The reader's share button on a phone.
- `2026-11-20/grimnir-portal-art-small.webp` — The new Grimnir portal image in a small bloom.
- `2026-11-20/grimnir-portal-art-phone.webp` — The new portal on a phone.
- `2026-11-20/grimnir-listen-big-bloom.webp` — The Listen module pointing to the Indikin.online page.
- `2026-11-20/grimnir-listen-small-bloom.webp` — Listen in the small bloom.
- `2026-11-20/brunti-audiobook-rename-small.webp` — The portal now reading Brunti Audiobook.
- `2026-11-25/projects-menu-by-activity-desktop.webp` — The Projects menu ordered by latest update.
- `2026-11-25/projects-menu-by-activity-phone.webp` — The same menu on a phone.
- `2026-11-25/about-link-cards-desktop.webp` — The About page's link cards that started the idea.
- `2026-11-25/reader-section-cards-about-desktop.webp` — About in section cards.
- `2026-11-25/reader-section-cards-architecture-desktop.webp` — The architecture document in section cards.
- `2026-11-25/reader-section-cards-changes-desktop.webp` — The changelog in section cards.
- `2026-11-25/reader-section-cards-about-phone.webp` — Section cards on a phone.
- `2026-11-25/signup-desktop-reader-before.webp` — The Follow the journey module in the reader, before the form showed directly.
- `2026-11-25/signup-desktop-reader-form.webp` — The EmailOctopus form in the reader.
- `2026-11-25/signup-live-desktop-reader-form.webp` — The form on the live site.
- `2026-11-25/signup-phone-reader-form.webp` — The form on a phone.
- `2026-11-25/signup-big-bloom-desktop-card.webp` — The sign-up form as the whole big-bloom card.
- `2026-11-25/signup-big-bloom-phone-card.webp` — The form card on a phone.
- `2026-11-25/signup-big-bloom-tablet-card.webp` — The form card on a tablet.
- `2026-11-25/button-game-journal-thumbnails-desktop.webp` — First check: journal thumbnails with a white strip under them.
- `2026-11-25/button-game-journal-lightbox-desktop.webp` — First check: the large view with the same white band.
- `2026-11-25/button-game-journal-lightbox-desktop-3.webp` — After cropping the empty rows.
- `2026-11-25/button-game-journal-thumbnails-phone-2.webp` — The thumbnails on a phone.
- `2026-11-25/button-game-screenshots-gallery-desktop-2.webp` — Button Game's new Screenshots gallery.
- `2026-11-25/live-button-game-journal-thumbnails-desktop.webp` — The live Button Game journal loading its thumbnails from the server's media folder.
- `2026-11-25/live-morkahja-rpg-journal-thumbnails-desktop.webp` — The live Morkahja journal with its screenshot rows.
- `2026-11-25/live-morkahja-rpg-screenshots-gallery-desktop.webp` — Morkahja's Screenshots gallery.
- `2026-11-25/live-eldgrim-journal-lightbox-desktop.webp` — An Eldgrim journal screenshot opened large.
