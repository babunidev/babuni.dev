# babuni.dev — Creative Concept

**Creative and creative director:** Babuni  
**Project:** babuni.dev  
**Origin:** Retrospective account of conversations and decisions from October 2026  
**Purpose:** Creative vision and guiding principles; detailed behavior and verification belong in the linked documents.

## A toy box of creative work

The idea behind babuni.dev is a personal workshop that feels more like opening a childhood toy box than entering a conventional portfolio. Finished work belongs beside experiments, stories, games, technical projects, and things still taking shape. A visitor should encounter intriguing objects first, then discover what they mean by exploring them.

Rather than arranging my work into a chronological blog or a fixed set of cards, the site turns the collection into something visitors can move through. The website itself is one of those works: its design, development history, revisions, and collaboration with AI deserve the same attention as the projects it presents.

## An endless field of stone and portals

The main surface is an edge-to-edge field of square stone tiles, seen from directly above. Each has an engraved title and a recessed, colored portal showing something of the project behind it. Historical masonry informed early experiments, but the intended visual language is original and restrained, not a reproduction of a particular culture or a heavily ornamented fantasy interface.

One BABUNI.DEV tile starts at the center of the viewport. That position is **an opening arrangement, not a permanent center of the world**. The field can be dragged freely, with partial tiles extending past the screen edges and recycled tiles keeping the visible surface filled. There is no scenic background behind it.

A persistent header provides access to Projects, Gallery, and About. Direct project search is a practical companion to wandering: choosing a project brings it into view and opens its introductory bloom.

## A living, shifting grid

Tiles belong to grid cells rather than floating independently. From time to time, a whole row or column moves smoothly by one cell, like a slow-moving plate. The motion should make the surface feel alive without fighting the visitor for attention.

Randomized, dice-inspired movement was part of the early design. The proposed d20 rolls and initiative modifiers are historical design material, **not a promise that those exact values govern the current implementation**. Engineering details and their verification belong in [Design](docs/DESIGN.md) and [Architecture](docs/ARCHITECTURE.md).

The assortment also evolved. An earlier clockwise, newest-first spiral helped establish the opening layout. On 30 October 2026, the chosen direction became **BABUNI.DEV first, with the other projects shuffled once per visit**; their identities remain stable during subsequent movement. Recently updated projects can stand out through a gold label and an extra portal ring rather than being moved to the front. The exact activity window and count remain provisional.

The surface should never need blank filler tiles. When there are too few distinct projects to fill the visible field, identities may repeat; when enough exist, visible duplicates should be avoided. Decorative neutral tiles have their own limited identities and should not become a substitute for real projects.

## Four depths of exploration

The interface unfolds gradually, keeping its physical relationship to the grid.

1. **Grid:** Every tile carries a title and portal. Three small lights above and beside the portal reveal brief, contextual clues.
2. **Small bloom:** Selecting a tile opens introductory modules in neighboring grid cells. The original tiles make room rather than having cards simply drawn on top of them. The selected project remains the anchor.
3. **Big bloom:** Opening an introductory module expands the project into a larger arrangement of grid-native previews. Content occupies reserved space, while unrelated projects recede. The originating tile remains recognizable and provides the way back.
4. **Full detail:** A module opens a readable document, image gallery, video, or other appropriate presentation. Longer text scrolls normally; images can be viewed without surrounding interface elements.

Navigation moves back through those depths rather than relying on scroll-wheel gestures to change modes. Dragging remains a way to explore the grid; scrolling remains a way to read.

This structure grew through correction as well as invention. An early AI interpretation depicted bloom content as floating dashboard panels. The intended interaction was different: **the grid itself must move aside to make real space**. That distinction is fundamental to the experience.

## Clues, not shortcuts

Three small information points sit above, to the left, and to the right of each portal. The original four-point proposal was revised to three. Their bubbles are not links or sales messages; they offer a short fact, theme, or curious detail about the work.

On desktop, tile hover or focus can reveal these clues in sequence. On mobile, the tile near the screen center can reveal them while browsing. Occasional ambient reveals make the grid feel active even without deliberate interaction. Holographic bubbles may extend over neighboring tiles, but unlike bloom modules they do not reserve cells.

## Content that fits the work

A project may contain text, screenshots, artwork, galleries, video, source links, releases, files, or development history. The presentation should adapt to what exists rather than forcing every project into an identical template.

Small blooms can offer up to eight neighboring introductory modules, revealing them gradually when enough content is available. Bigger previews lead to full material without replacing the original source documents with thin summaries. A single Videos collection can gather recordings rather than scattering them across many separate modules.

Long-form reading must remain calm and conventional even inside an unconventional site. Project documents imported from other repositories are reviewed, revision-pinned snapshots, not automatic live mirrors.

## Usability and performance belong to the design

The grid should begin with a central tile and progressively fill the screen, preparing a modest offscreen buffer for movement. Heavy media and full documents should load only when needed. A compulsory loading screen is not part of the intended experience.

Movement must remain understandable on small screens and with keyboard or reduced-motion preferences. Alternative motion treatments may be tested when necessary, but a proposed fallback should not be described as a verified optimization. The goal is an inviting, usable toy box, not animation for its own sake.

## The development process is part of the work

The original ideas, questions, corrections, and choices come from my creative direction. AI helps translate those intentions into proposals, experiments, code, documents, and tests. Recording that distinction matters: a suggestion is not a decision, a commit is not a test, and AI execution is not work the human creative should be said to have personally performed.

The journal should explain how something came to be, including useful disagreements and abandoned directions, without turning every tool action into a story. This website is both a place to show finished work and an ongoing record of making it.

## Scope of this document

This concept describes **what the experience is meant to feel like and why it takes this form**. It does not certify that every detail is implemented or tested. Dates, release status, exact tile geometry, shift rules, accessibility behavior, performance measurements, and unresolved engineering constraints are tracked separately:

- [Design reference](docs/DESIGN.md) — precise intended interaction and visual behavior
- [Decision register](docs/DECISIONS.md) — accepted, revised, and provisional choices
- [Development journal](docs/DEVLOG.md) — human-directed development and verification history
- [Architecture](docs/ARCHITECTURE.md) — implementation and technical constraints
- [Roadmap](ROADMAP.md) — milestone status and work still open
