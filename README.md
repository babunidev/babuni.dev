# babuni.dev

**Author:** Babuni.dev

**An interactive creative portfolio and digital workshop.**

Projects appear as engraved stone tiles with colored portal windows. An endlessly recyclable grid slowly shifts around the visitor. Projects unfold from small previews into fully explorable galleries, documents, videos, and development histories.

The website itself is intended to become one of its exhibits: a record of its concepts, design experiments, code, decisions, and human–AI collaboration.

## Project status

**Living-grid portfolio prototype with multiple depths of exploration.** Astro 7 and the mechanical grid are on `main`: screen-centered dragging, autonomous shifting and 44 retained project tiles and three unique neutral decorative identities. Visitors can explore three-point topic bubbles, open a small bloom of up to eight neighboring modules, expand into a larger grid-native bloom, and read full documentation or open galleries, videos and source links. Twenty-two active projects have supplied WebP portal artwork files, while other candidate tiles remain provisional. The repository-backed content pipeline currently maps 35 retained tiles to 35 public repositories, including BABUNI.DEV itself; other tiles remain explicitly unresolved or provisional. **Remaining candidate labels are not all verified or approved published exhibits.** Full public project documents are built as separate static assets and loaded only when opened in the reader, keeping the initial grid bundle lighter. The Projects menu groups the 44 projects under World of Warcraft, Morkahja, AI, Games and Music; categories do not rearrange the grid. Three neutral identities never repeat in view, while real projects may repeat when necessary. The work remains an active prototype, with long-session, keyboard, mobile and reduced-motion acceptance still outstanding.

## Local development

Requires Node.js `>=22.23.4` (the version range declared by the project and locked Astro package) and npm. Run these commands from the repository root:

```sh
npm ci
npm run dev
```

Open the local address printed by Astro (normally http://localhost:4321). For agents, use `npm run dev -- --background`; manage it with `npm run astro -- dev status`, `npm run astro -- dev logs`, and `npm run astro -- dev stop`.

`npm run test:grid` runs the regression suite. `npm run build` validates content, prepares the public document assets and creates the static site in `dist/`. `npm run preview` serves that build locally. `npm run content:prepare` rebuilds local preview metadata/static Markdown from reviewed sources without network access; it is invoked automatically before dev, tests and builds.

Babuni.dev's 2026-10-27 local terminal output verified **92 passing tests** and a successful build on the preceding version, with a >500 kB JavaScript chunk warning. An earlier optimized version passed **97 tests** and a clean GitHub Actions build (2026-10-27); the subsequent development journal reports **126 passing Node tests** and a production build for the persistent-navigation update, with browser observations recorded separately. The client JavaScript measures **584.7 KiB raw / 174.0 KiB gzip**, and Vite's >500 KiB raw-chunk warning remains; actual browser load-time acceptance is still open. [GitHub Actions](.github/workflows/ci.yml) now runs tests and the production build on main pushes and pull requests; check the workflow result before relying on a change. A separate full type-check command is not yet configured; see [foundation review](docs/REVIEW-2026-10-26.md).

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

The implemented prototype uses Astro 7, TypeScript/native browser DOM modules and Marked for safely rendered Markdown; Svelte is only a potential future option, **not a current dependency**. GitHub-backed content and eventual deployment to the owner's VPS at babuni.dev remain part of the plan.

## Working principles

Explore before explaining. Delight without obscuring usability. Record not just what was made, but who directed it, what choices were examined, and how the result was verified. Never treat generated mockups as implemented features.

## License

No software license has been selected. Public visibility does not imply permission to reuse the source code.

## Documentation audit #28 — 27 October 2026

The 11 core portfolio documents already contain a detailed, evidence-backed record. This audit preserves the original **toy-box metaphor**, endlessly recycled engraved-stone grid, contextual portal bubbles, **grid-native small and big blooms**, and a separate reader. It does not redesign those interactions or promote unapproved ideas into features.

**Current source snapshot:** 44 retained project tiles and three unique neutral decorative identities; 34 mapped tiles connected to 34 public repository sources; nineteen active portal artwork mappings (twenty supplied WebP files retained); working full-depth header, project search and About; Markdown-formatted previews/detail with source attribution. The latest journal reports **126 passed regression tests**, plus a production build and desktop browser checks. Those are **historical reported verification results**, not tests performed in this documentation audit. Native-phone/keyboard/reduced-motion/long-session acceptance and public deployment remain open.

**Documentation publication dependency:** The portfolio's imported project documents are **revision-pinned static snapshots**, not automatically live GitHub content. Changes just committed to other Babuni.dev repositories will not appear in project blooms until a deliberate `npm run content:sync`, `npm run content:check`, `npm run test:grid` and `npm run build` cycle is reviewed and the resulting content snapshot is committed. This audit edits Markdown **only**; it does not sync generated snapshots or deploy the site.
