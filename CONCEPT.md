# babuni.dev — Creative Concept

**Owner and creative director:** Babuni.dev  
**State:** Agreed concept, not a finished specification  
**Origin:** Retrospective reconstruction from project conversations, October 2026

## The toy box

babuni.dev is a personal, explorable workshop. Visiting it should feel like opening a childhood toy box: an assortment of works that invite discovery and play. A toy may be finished, unfinished, experimental, artistic, technical, fictional, or something in between.

Visitors are not marched through a linear portfolio or blog. They encounter shapes, names, colors, and glimpses of worlds first; greater understanding becomes available through engagement.

The website itself belongs in the collection. Babuni.dev has confirmed BABUNI.DEV as the initial center tile, with its own concept, sketches, dev log, architecture, and changelog. Other projects begin in a clockwise spiral around it. The exact rendered result remains subject to hands-on testing.

## The surface

The viewport is filled edge to edge by a tight field of square **tiles**, viewed straight from above with no perspective. One complete tile starts at the exact screen center; the entire field is free to move afterward. The original 6 × 4 desktop layout was an early density illustration, not a target count. Partial tiles can be visible at any edge. There is no decorative landscape behind the grid.

The tiles are stylized, deliberately restrained stone objects. Historical Mesoamerican masonry was an early inspiration, but the desired result is an original design language, not an imitation. Each tile carries a legible **engraved project title**, project-specific engravings, and a recessed, colored **portal**. The portal displays the project's visual identity or a view into its world.

A slim persistent top bar contains BABUNI.DEV, Projects (dropdown), Gallery, and About. Babuni.dev confirmed searchable direct project finding in October 2026: choosing a project moves the grid to it and opens its small bloom. The header remains available across all four stages.

## Living motion

Individual projects remain anchored to grid cells; they do not drift as independent floating objects. At intervals, whole horizontal or vertical lines move smoothly, one cell at a time, like shifting plates. Motion is calm, eased, and unobtrusive.

A round first selects horizontal or vertical motion by chance. Eligible lines roll d20; results above 10 move. Lines roll in an initiative order, with proposed bonuses +4, +3, +2, +1 for the first four in that order. This is a *proposed* rule and needs generalization and testing for six columns or more.

Visitors can drag the entire field in any direction. Visual tiles are recycled offstage so that no edge or empty background becomes visible. Project identities are assigned in Babuni.dev's clockwise spiral, stay stable while visible, and are reused after leaving view. The screen stays fully filled: when there are fewer distinct projects than visible cells, project identities repeat rather than producing empty or filler tiles. When enough projects exist, visible duplicates should be avoided.

## Discovery and the four depths

1. **Grid:** colored portals and engraved titles. Three small glowing points (above, left, right of the portal) can reveal very brief topic/flavor snippets. The previous four-point idea was later revised by Babuni.dev.
2. **Small bloom:** first click or tap. The selected tile remains the anchor. Neighboring tiles physically glide aside; the space of one or more adjacent *tile cells* becomes introductory project modules. The rest of the grid stays present and slows down. The open bloom travels with the grid during panning; selecting another project closes the old one before opening the next.
3. **Full bloom / big bloom:** activate a small-bloom module or its Read more control. Stay in the same living grid: tiles make physical space for modules spanning 2×2 tile cells. The chosen module grows into the middle. The original-size project tile occupies its lower-left quarter as a one-step back control; Read more stays opposite at bottom right. Other modules reveal from the top in the site’s clockwise spiral, with additional modules extending downward in three columns. Neighboring project tiles remain available and can shift outside the reserved footprint. Large previews reveal more source content before a further click opens full detail. There is no big-bloom header strip; optional instructions live behind a small help tooltip.
4. **Expanded module:** selecting a text, image, video, or file module opens an appropriate detailed view. Text scrolls normally; image galleries are freely browsable, with a prominent center image. A separate fullscreen image control displays the art without captions or UI.

Navigation returns one level at a time: expanded module → big bloom → small bloom → grid. The small-bloom center tile closes that bloom; entering big bloom requires activating a module. The big-bloom field is navigated by dragging, while long text scrolls normally in detail. Each project has one Videos collection module rather than a module per recording.

## Information points

Three small lights surrounding the portal—**top, left, and right**—are *not links*. Their tiny bubbles give a category, form, theme, or other interesting flavor instead of a sales pitch. This supersedes the earlier four-point sketch. On desktop, hovering or focusing anywhere on a tile reveals all three in succession; on mobile, the tile occupying the screen center reveals them automatically while browsing; the whole tile is one button for selecting the project, including its portal; one randomly chosen point may briefly reveal its clue without interaction, including on other tiles while a small bloom is open. Babuni.dev revised their presentation on 2026-10-26: holographic callouts may extend over neighboring tiles like wings. The left bubble anchors by its bottom-right corner, the right by its bottom-left, and the top grows upward. They can be ignored. Their exact wording will be curated from reliable project material and development history.

## Content and presentation

A project is a container for independently expandable modules: short and long descriptions, keywords, screenshots, artwork, moving previews, videos, documents, files, releases, and development history. The small and full blooms adapt to the available content instead of forcing every project into the same filled-out card. Babuni.dev specified up to eight populated small-bloom preview modules around the central project tile (a 3×3 total footprint), sampled randomly when more content exists and revealed one after another; empty definitions do not appear.

Long-form material must remain readable in conventional scrolling views. Animation should communicate relationship and discovery, not interrupt reading.

## Performance as a visible principle

The initial screen begins with a central tile. Nearby tiles progressively appear until the visible grid fills. A small offscreen buffer is readied for incoming shifts and dragging. Heavy images, videos, and documents load on demand. The site does not need a compulsory loading screen.

Lower-power / reduced-motion modes may substitute fade-reposition-fade for extensive travel animations. This is a proposed fallback to verify, not a tested optimization claim.

## Creation as a recorded collaboration

Babuni.dev directs the vision, sketches behavior in conversation, accepts or rejects alternatives, and tests results. AI agents may translate those directions into structured specifications, code, media, or documents. Both parts must be visible in the project's record without presenting AI-generated decisions as Babuni.dev's own words.

See [Human–AI collaboration](docs/AI_COLLABORATION.md) and [Development journal](docs/DEVLOG.md).

## Open design questions

Exact tile aspect ratio and visual assets; repeat spacing and stable keys in infinite wrap; precise bloom cell-reservation algorithm; mobile gestures and accessibility; shift collision / interruption rules; image-gallery and video-preview behavior; performance thresholds; full-bloom arrangement constraints; how the site's self-exhibit should be positioned. Resolve by prototyping and recording decisions rather than guessing.
