# Interaction and Visual Design Reference

This document describes intended behavior; implementation must be separately verified.

## Overall frame
- Persistent top bar: BABUNI.DEV / Projects dropdown / Gallery / About.
- Grid fills the screen beneath the bar; never reveal scenic backgrounds or blank edges.
- Approximately 6 × 4 tiles on the initial desktop concept; responsive number of cells based on viewport and tile dimensions.
- Tile graphics can extend beyond edges of the viewport; drag to explore. Center-of-viewport focus is preferred but not a fixed global origin.

## Tile visual
- Stylized low-detail stone square with slight depth, readable title engraved in the stone, project-dependent minimal engravings.
- Recessed colored central portal; project logo or themed image inside it.
- Four glowing points on portal rim. Angular sci-fi connector strokes and small translucent overlays originate there.
- Panels are temporary *information snippets*: purpose, behavior, audience, interesting characteristics.
- One random teaser occasionally; point hover/focus shows one; prolonged tile hover reveals multiple. On touch use accessible tap/focus alternative.
- Info overlays remain inside the tile boundary; do not reserve adjacent cells. This differs from bloom modules.

## Movement
- Whole row or column translates exactly one cell per successful shift.
- Slow easing, uninterrupted readability, deterministic coordinate identity.
- Randomly choose axis; determine order and roll d20 per eligible line; >10 succeeds after the applicable initiative modifier. Detailed rules remain a test parameter.
- Multiple nonconflicting lines may move in the same round.
- Allow 2D drag/pan. Recycle outgoing visual tile instances to buffers on opposite edges as needed. Do not move the underlying project data or silently duplicate content files.
- On bloom, grid movement slows. Movement must not cross reserved cells or displace an active focused tile unexpectedly; suspension near blooms is acceptable pending prototype.
- Honor reduced-motion preferences; test fade-based relocation as an alternative.

## Interaction state machine
| State | Entry | What is visible | Exit |
| --- | --- | --- | --- |
| Grid | Initial page, close project | All tiles, occasional bubbles | Activate tile |
| Small bloom | Activate a tile | Portal anchor, adjacent cell-sized overview modules, other tiles displaced | Activate same tile again, switch tile, or close |
| Full bloom | Re-activate selected tile | Center portal and complete project preview modules, other project tiles gone | Activate central tile to return to grid; activate module |
| Module detail | Activate module | Full document, media gallery, video or download information | Explicit back to full bloom |

Click/tap behaviors should be discoverable; provide visible back controls and keyboard routes. Avoid hijacking regular page scroll for state navigation.

## Small bloom composition
- A module must occupy one or more actual neighbor cells, not hover over a tile without moving it.
- Selection chooses an admissible neighboring cell to reserve; the prior tile slides away in the same quiet plate-motion language.
- Module candidates: description, keywords, metadata, media thumbnails, dev-log or file availability.
- Content arrives gradually. Small random variation in direction or order is welcome if geometry remains safe and interpretable.
- Adjacent modules may expand further only in full bloom; preserve instant selection switching.

## Full bloom composition
- Fade unrelated grid tiles completely away.
- Retain the original central portal tile as spatial anchor and collapse control.
- Surrounding modules are understated, readable frames, connected conceptually to the center.
- Modules may preview text by gentle movement and media through bounded thumbnails; do not continuously scroll text that is being read.
- Full bloom is still an overview; expanded modules contain complete content.

## Detailed module presentation
- Text / README / DEVLOG: traditional scrolling, readable type, clear return path.
- Images: freely scrolling gallery; central image has a stable maximum size, others remain visible around it; switching images uses reciprocal shrink/grow movement. Separate fullscreen button shows only image.
- Video: still or bounded hover preview where multiple videos exist; full viewing requires deliberate action, with autoplay and bandwidth considerations to test.
- Files: show what is available, type, provenance, version and trustworthy download destinations. No automatic downloads.

## Responsive and accessible interaction
- Touch should not require hover. Provide tap/focus equivalents and visible controls.
- Support keyboard focus, Escape/back, landmarks, meaningful labels, and reduced-motion preferences.
- Do not override browser context menus or globally repurpose wheel scrolling.
- Dynamic tile loading must not make projects unreachable through an accessible list or Projects menu.
- Small viewports can show fewer tiles at once without shrinking tiles below an accessible minimum.

## Visual acceptance tests
1. No blank viewport margins during drag, shifts, and resize.
2. A tile has an engraved title and its own colored portal.
3. A light-point bubble is an overlay contained by the tile, not a navigation button.
4. Small bloom frees actual neighboring cell space.
5. Full bloom removes other projects.
6. Module detail reads/browses normally.
