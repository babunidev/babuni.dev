# babuni.dev

**Author:** Babuni.dev

**An interactive creative portfolio and digital workshop.**

Projects appear as engraved stone tiles with colored portal windows. An endlessly recyclable grid slowly shifts around the visitor. Projects unfold from small previews into fully explorable galleries, documents, videos, and development histories.

The website itself is intended to become one of its exhibits: a record of its concepts, design experiments, code, decisions, and human–AI collaboration.

## Project status

**Living-grid portfolio prototype with multiple depths of exploration.** Astro 7 and the mechanical grid are on `main`: screen-centered dragging, autonomous shifting and 53 named provisional project tiles. Visitors can explore three-point topic bubbles, open a small bloom of up to eight neighboring modules, expand into a larger grid-native bloom, and read full documentation or open galleries, videos and source links. Eleven projects have supplied portal artwork. The repository-backed content pipeline currently maps 34 candidate tiles to 33 public repositories, including BABUNI.DEV itself; other tiles remain explicitly unresolved or provisional. **These are not 53 verified or approved published portfolio exhibits.** Full public project documents are built as separate static assets and loaded only when opened in the reader, keeping the initial grid bundle lighter. The work remains an active prototype, with long-session, keyboard, mobile and reduced-motion acceptance still outstanding.

## Local development

Requires Node.js `>=22.23.4` (the version range declared by the project and locked Astro package) and npm. Run these commands from the repository root:

```sh
npm ci
npm run dev
```

Open the local address printed by Astro (normally http://localhost:4321). For agents, use `npm run dev -- --background`; manage it with `npm run astro -- dev status`, `npm run astro -- dev logs`, and `npm run astro -- dev stop`.

`npm run test:grid` runs the regression suite. `npm run build` validates content, prepares the public document assets and creates the static site in `dist/`. `npm run preview` serves that build locally. `npm run content:prepare` rebuilds local preview metadata/static Markdown from reviewed sources without network access; it is invoked automatically before dev, tests and builds.

Babuni.dev's 2026-10-27 local terminal output verified **92 passing tests** and a successful build on the preceding version, with a >500 kB JavaScript chunk warning. The optimized version subsequently passed **97 tests** and a clean GitHub Actions build (2026-10-27). The client JavaScript measures **584.7 KiB raw / 174.0 KiB gzip**, and Vite's >500 KiB raw-chunk warning remains; actual browser load-time acceptance is still open. [GitHub Actions](.github/workflows/ci.yml) now runs tests and the production build on main pushes and pull requests; check the workflow result before relying on a change. A separate full type-check command is not yet configured; see [foundation review](docs/REVIEW-2026-10-26.md).

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
- [Module authoring](docs/MODULE_AUTHORING.md) — previews, full source documents and media authoring
- [Repository connections](docs/REPOSITORY_CONNECTIONS.md) — public sources and unresolved candidates
- [Candidate project inventory](docs/PROJECT_INVENTORY.md) — provisional creative-work memory for prototype content; not approved publication data
- [Human–AI collaboration](docs/AI_COLLABORATION.md) — attribution and evidence rules
- [ChatGPT project instructions](.chatgpt/PROJECT_INSTRUCTIONS.md) — instructions to paste into the ChatGPT project's settings

## Intended technology

Astro, TypeScript and a dedicated interactive UI layer (Svelte is under consideration); GitHub-based content and development; eventual deployment to the owner's VPS at babuni.dev.

## Working principles

Explore before explaining. Delight without obscuring usability. Record not just what was made, but who directed it, what choices were examined, and how the result was verified. Never treat generated mockups as implemented features.

## License

No software license has been selected. Public visibility does not imply permission to reuse the source code.
