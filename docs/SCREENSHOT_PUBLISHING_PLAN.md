# Screenshot publishing plan

Babuni asked on 2026-11-25 for the development screenshots in `~/Pictures/Development Screenshots/` to appear on babuni.dev: in each project's grid modules, and as small clickable images in the development logs. The work goes one project at a time. This plan was proposed by Claude Code (Claude Opus 5.5); the per-project status below records what is actually done.

## Where the images live

**Decision (Babuni, 2026-11-25): no screenshots in Git.** Git holds the software and its own images (artwork, icons, QR codes). Screenshots live in a media folder on the server, `/var/www/babuni.dev/shared/screenshots/`, which every release links as `screenshots`, so it is served at `https://www.babuni.dev/screenshots/` with the deploy key alone. Visitors load every image from the server anyway; Git was only the way files reached it.

- **Outside the releases:** `scripts/publish-site.sh` replaces the release folders and deletes files that are not in the build, but never touches `shared/`.
- **What Git keeps instead:** `src/content/server-media.json` lists every file with its size and SHA-256. The content check uses it to confirm that every gallery or journal image exists, and the upload script uses it to confirm that the server has the same bytes.
- **On Babuni's computer:** the WebP copies in `public/screenshots/` (ignored by Git), so the local dev server shows them; the PNG originals stay in `~/Pictures/Development Screenshots/`. The server copy is not backed up by Git, so these local copies are the backup.
- **Earlier the same day** the Button Game screenshots were briefly committed to Git (commit `4c1c30a`); they and the 67 older verification screenshots were moved to the server media folder. Removing them does not shrink the Git history, which keeps those 9 MB.
- **Measured:** a sample of 53 screenshots was 62 MB as PNG, 43 MB as lossless WebP and 4 MB as WebP quality 85 at most 1600 px.

## Format

- Full image: WebP quality 85, at most 1600 px on the longest side, never enlarged.
- Thumbnail: WebP quality 75, at most 480 px on the longest side, in a `thumbs/` folder next to it.
- Path: `/screenshots/<project-id>/<YYYY-MM-DD>/<name>.webp` (locally under `public/screenshots/`), with the date prefix removed from the file name because the folder already carries it.
- Made by `npm run screenshots:import -- <source-folder> <project-id>`, uploaded by `scripts/publish-screenshots.sh`. The script never overwrites an existing file. Pure-white rows at the bottom edge, where the captured page was shorter than the browser window, are cropped; nothing else is edited.

## How they appear

- **Grid:** each project gets a *Screenshots* gallery module (or its existing empty gallery is filled), with alt text and a dated caption for every image.
- **Development log:** the entry that matches a screenshot's date and subject links it as Markdown, `![alt](https://www.babuni.dev/screenshots/<project-id>/<date>/<name>.webp)`. The full URL also shows the image on GitHub. The site's reader shows the thumbnail and opens the full image when it is clicked.

## Order and status

Every image is looked at before it is published. Screenshots that show live user data, credentials, private messages or e-mail addresses are left out. Near-identical retakes (`-2`, `-3`) are kept in the repository but may be left out of the gallery.

| # | Project (site ID) | Screenshot folders | Count | Status |
|---|---|---|---|---|
| 1 | Button Game (`button-game`) | `Buttongame` | 13 | Done 2026-11-25: 13 published (283 KB), 9 in the gallery, 10 in the journal |
| 2 | Rocket Game 42 (`rocket-game-42`) | `Rocketgame42` | 13 | Planned |
| 3 | Eldgrim (`eldgrim`) | `Eldgrim`, `eldgrim` | 12 | Planned |
| 4 | Babuni Admin (`arcanitebrothers`) | `babuni-admin`, `babuni.admin` | 38 | Planned, needs a careful privacy check |
| 5 | Morkahja (`morkahja-rpg`) | `Morkahja` | 35 | Planned |
| 6 | BABUNI.DEV (`babuni-dev`) | `babuni.dev`, `babunidev` | 127 | Planned; joins the existing visual documentation |
| 7 | Morkahja web app | `MorkahjaWebApp` | 543 | Planned: all in the repository (estimated 64 MB), a selection in the gallery, the matching ones in the journal |
| 8 | Analubia | `Analubia` | 1377 | On hold (Babuni, 2026-11-25): not on the website until Babuni has decided how publicly Analubia can be worked on |

## Steps for each project

1. Look at every screenshot (contact sheet) and leave out anything private.
2. Run the import script; check the sizes it reports; upload with `scripts/publish-screenshots.sh`.
3. Add or fill the gallery module in `src/content/project-modules.json`.
4. Add the images to the matching dated entries of the project's own `docs/DEVLOG.md`, commit and push that repository, then refresh its snapshot here.
5. Run `npm run content:check`, `npm run test:grid` and `npm run build`; check the gallery and the journal thumbnails in a browser.
6. Update `CHANGELOG.md`, `docs/DEVLOG.md` and this table; commit, push and publish.

## Storage limits

Estimated from a random sample of 60 images each (2026-11-25): Morkahja web app about 64 MB, Analubia about 116 MB; projects 1–7 together roughly 75 MB. The server had 2.9 GB free (93% used) on 2026-11-25. If the media folder outgrows the server, hosted object storage such as Cloudflare R2 or Hetzner Object Storage can take over the same `/screenshots/` paths.
