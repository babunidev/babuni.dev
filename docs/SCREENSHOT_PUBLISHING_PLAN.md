# Screenshot publishing plan

Babuni asked on 2026-11-25 for the development screenshots in `~/Pictures/Development Screenshots/` to appear on babuni.dev: in each project's grid modules, and as small clickable images in the development logs. The work goes one project at a time. This plan was proposed by Claude Code (Claude Opus 5.5); the per-project status below records what is actually done.

## Where the images live

**Decision (proposed by the AI, accepted by Babuni in the request to commit and push):** web-sized WebP derivatives are committed to this repository; the original PNGs stay in `~/Pictures/Development Screenshots/` as the private collection and are not committed.

- **Why GitHub and not only the server:** `scripts/publish-site.sh` builds `origin/main` in a clean worktree and syncs `dist/` with `--delete`, so files placed only on the server would be removed by the next publish. Committed files also keep their history and attribution next to the journal entries that cite them.
- **Why not the original PNGs:** a sample of 53 screenshots measured 62 MB as PNG, 43 MB as lossless WebP and 4 MB as WebP quality 85 at most 1600 px. Git keeps every committed byte forever, so only the small derivatives go in.

## Format

- Full image: WebP quality 85, at most 1600 px on the longest side, never enlarged.
- Thumbnail: WebP quality 75, at most 480 px on the longest side, in a `thumbs/` folder next to it.
- Path: `public/media/<project-id>/screenshots/<YYYY-MM-DD>/<name>.webp`, with the date prefix removed from the file name because the folder already carries it.
- Made by `npm run screenshots:import -- <source-folder> <project-id>`. The script never overwrites an existing file. Pure-white rows at the bottom edge, where the captured page was shorter than the browser window, are cropped; nothing else is edited.

## How they appear

- **Grid:** each project gets a *Screenshots* gallery module (or its existing empty gallery is filled), with alt text and a dated caption for every image.
- **Development log:** the entry that matches a screenshot's date and subject links it as Markdown, `![alt](https://www.babuni.dev/media/<project-id>/screenshots/<date>/<name>.webp)`. The full URL also shows the image on GitHub. The site's reader shows the thumbnail and opens the full image when it is clicked.

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
| 7 | Morkahja web app | `MorkahjaWebApp` | 543 | Needs a choice: a selection per day, or all |
| 8 | Analubia | `Analubia` | 1358 | Needs a choice: no Analubia project exists on the site yet |

## Steps for each project

1. Look at every screenshot (contact sheet) and leave out anything private.
2. Run the import script; check the sizes it reports.
3. Add or fill the gallery module in `src/content/project-modules.json`.
4. Add the images to the matching dated entries of the project's own `docs/DEVLOG.md`, commit and push that repository, then refresh its snapshot here.
5. Run `npm run content:check`, `npm run test:grid` and `npm run build`; check the gallery and the journal thumbnails in a browser.
6. Update `CHANGELOG.md`, `docs/DEVLOG.md` and this table; commit, push and publish.
