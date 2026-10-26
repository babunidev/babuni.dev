# babuni.dev

**An interactive creative portfolio and digital workshop.**

Projects appear as engraved stone tiles with colored portal windows. An endlessly recyclable grid slowly shifts around the visitor. Projects unfold from small previews into fully explorable galleries, documents, videos, and development histories.

The website itself is intended to become one of its exhibits: a record of its concepts, design experiments, code, decisions, and human–AI collaboration.

## Project status

**Living-grid prototype underway.** Astro 7 and the mechanical grid are on `main`: a screen-centered, freely pannable, recycling grid with autonomous row/column shifts and a one-time clockwise entrance animation. Its temporary content catalog uses **53 named candidates** from [the inventory](docs/PROJECT_INVENTORY.md), including one-line descriptions for future information bubbles. These are provisional visual test entries, **not 53 verified or approved published portfolio exhibits**. Colored portals and stone faces are temporary; functionality takes priority over finished portal textures. The latest changes still need a full local build and physical-device verification.

## Local development

Requires Node.js `>=22.23.4` (the version range declared by the project and locked Astro package) and npm. Run these commands from the repository root:

```sh
npm ci
npm run dev
```

Open the local address printed by Astro (normally http://localhost:4321). For agents, use `npm run dev -- --background`; manage it with `npm run astro -- dev status`, `npm run astro -- dev logs`, and `npm run astro -- dev stop`.

`npm run build` creates the static site in `dist/`. `npm run preview` serves that build locally.

The starter build was independently verified on 2026-10-26 against commit `ea90117`. This verifies compilation, not browser behavior or the planned interactions. CI and a dedicated type-check command are not yet configured; see [foundation review](docs/REVIEW-2026-10-26.md).

## Documentation

- [Concept](CONCEPT.md) — the vision and agreed design direction
- [Roadmap](ROADMAP.md) — milestones, priorities, and status
- [Changelog](CHANGELOG.md) — verified repository changes
- [Agent rules](AGENTS.md) — requirements for all coding agents
- [Development journal](docs/DEVLOG.md) — the creative process and experiments
- [Decision register](docs/DECISIONS.md) — decisions and alternatives
- [Design reference](docs/DESIGN.md) — interaction and visual behavior
- [Architecture](docs/ARCHITECTURE.md) — technical approach and constraints
- [Content model](docs/CONTENT.md) — project data and media modules
- [Candidate project inventory](docs/PROJECT_INVENTORY.md) — provisional creative-work memory for prototype content; not approved publication data
- [Human–AI collaboration](docs/AI_COLLABORATION.md) — attribution and evidence rules
- [ChatGPT project instructions](.chatgpt/PROJECT_INSTRUCTIONS.md) — instructions to paste into the ChatGPT project's settings

## Intended technology

Astro, TypeScript and a dedicated interactive UI layer (Svelte is under consideration); GitHub-based content and development; eventual deployment to the owner's VPS at babuni.dev.

## Working principles

Explore before explaining. Delight without obscuring usability. Record not just what was made, but who directed it, what choices were examined, and how the result was verified. Never treat generated mockups as implemented features.

## License

No software license has been selected. Public visibility does not imply permission to reuse the source code.
