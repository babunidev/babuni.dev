# babuni.dev

**Creative:** Babuni  
**Project:** An interactive portfolio and digital workshop

babuni.dev is a place to explore creative work rather than browse a conventional list of projects. Its starting point is a living field of engraved stone tiles, each with a colored portal into a different work. The field can be dragged, its rows and columns shift gently, and individual projects open into increasingly detailed views.

The website is also one of the projects it documents. Its concept, experiments, decisions, implementation, and human–AI collaboration are part of the work.

## The experience

Visitors can explore the site at four depths:

1. **Living grid:** Engraved project tiles and their portals share an endlessly recycled surface. Small information bubbles offer glimpses of each project.
2. **Small bloom:** Selecting a tile opens neighboring preview modules by making room in the grid.
3. **Big bloom:** A chosen module expands into a larger, grid-native arrangement with more substantial previews.
4. **Full detail:** Documents, galleries, videos, and other material open in dedicated readable views.

The persistent navigation provides direct access to projects, galleries, and the About page. The site preserves the playful, exploratory character of the original toy-box concept while making longer material readable.

## Project status

The interactive prototype and its core exploration stages have been implemented. On **29 October 2026**, the creative accepted milestones 1–4 after physical-device and long-session testing. At that checkpoint, the catalog contained **42 retained projects**, with WebP portal artwork assigned to each, and **35 connected public repository sources**. The broader candidate inventory is not the same as the approved public catalog.

A subsequent change on **30 October 2026** retained BABUNI.DEV as the initial tile and shuffled the other projects once per visit. Recently updated projects receive a gold label and portal-ring indicator, based on a provisional activity rule. These changes are recorded in the source and changelog; their browser behavior was not separately verified in that change record.

The first release was staged on the VPS on **31 October 2026**. The [development journal](docs/DEVLOG.md) records subsequent public HTTPS and redirect checks, a successful Certbot renewal dry run, working static asset responses, and successful checks of the existing Arcanite Brothers website and API. These observations verify specific deployment functions, **not** every interaction or performance characteristic of the live site. Later local commits and edits are not necessarily part of the deployed release.

Publishing controls, continuing content review, production performance measurements, and further browser/device checks remain separate work. For dated milestones and limitations, see the [roadmap](ROADMAP.md) and [development journal](docs/DEVLOG.md).

## Local development

Requires Node.js **22.23.4 or later** and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro, normally `http://localhost:4321`.

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run test:grid` | Run the automated regression tests |
| `npm run build` | Validate and build the static site into `dist/` |
| `npm run preview` | Preview a completed build locally |
| `npm run content:prepare` | Prepare local document and module assets from reviewed sources |
| `npm run content:sync` | Refresh imported repository documentation |
| `npm run content:check` | Check prepared content and WebP assets |
| `npm run activity:sync` | Refresh public repository activity metadata |

Development and test startup use the latest locally verified activity cache without requiring a network refresh. A normal production build requests fresh activity data and runs content preparation and validation through its configured scripts.

For agent-managed Astro development, `npm run dev -- --background` starts a background server; `npm run astro -- dev status`, `npm run astro -- dev logs`, and `npm run astro -- dev stop` manage it.

### Imported documentation

Project documents imported from other repositories are **revision-pinned static snapshots**, not live copies. Updating an external project repository does not automatically update what visitors read here. Publication requires a deliberate content-sync, validation, test, build, and review cycle. Details are in [module authoring](docs/MODULE_AUTHORING.md) and [repository connections](docs/REPOSITORY_CONNECTIONS.md).

## Technology and verification

The site uses **Astro 7**, TypeScript and native browser DOM modules, with **Marked** for Markdown rendering. Svelte and MDX were explored as possible options but are not current dependencies.

GitHub Actions runs automated tests and production builds for main-branch pushes and pull requests. Past test counts and bundle measurements belong to the versions and dates on which they were recorded; they should not be read as fresh test results. See the [release-readiness report](docs/RELEASE_READINESS-2026-10-29.md), [performance notes](docs/PERFORMANCE-2026-10-28.md), and [CI workflow](.github/workflows/ci.yml).

## Documentation

### Creative direction and development history

- [Concept](CONCEPT.md) — the creative vision and interaction principles
- [Development journal](docs/DEVLOG.md) — the human perspective, collaboration, experiments, and results
- [Decision register](docs/DECISIONS.md) — accepted choices, alternatives, and open questions
- [Roadmap](ROADMAP.md) — milestones and ongoing work
- [Changelog](CHANGELOG.md) — recorded changes to the repository
- [Human–AI collaboration](docs/AI_COLLABORATION.md) — attribution, evidence, and narrative standards

### Design, engineering, and publishing

- [Design reference](docs/DESIGN.md) — visual and interaction behavior
- [Architecture](docs/ARCHITECTURE.md) — implementation structure and technical constraints
- [Content model](docs/CONTENT.md) — project and module organization
- [Module authoring](docs/MODULE_AUTHORING.md) — source documents, previews, and media
- [Visual documentation](docs/VISUAL_DOCUMENTATION.md) — screenshots and visual evidence
- [Repository connections](docs/REPOSITORY_CONNECTIONS.md) — linked public sources and unresolved candidates
- [Project inventory](docs/PROJECT_INVENTORY.md) — candidate project records and their review status
- [Deployment guide](deploy/README.md) — hosting configuration and release procedures
- [Agent rules](AGENTS.md) — development and documentation requirements
- [ChatGPT project instructions](.chatgpt/PROJECT_INSTRUCTIONS.md) — portable project instruction reference

## Authorship and working principles

The human creative establishes the ideas, direction, constraints, and decisions. AI assists with research, discussion, writing, design, code, and testing when asked. The documentation records those contributions distinctly, including corrections, rejected approaches, implementation, and verification.

Explore before explaining. Keep the playful interactions intact without sacrificing accessibility, performance, or readable content. A proposed design, a committed implementation, and a tested result are different things.

## License

No software license has been selected. Public access to the repository does not, by itself, grant permission to reuse its source code.
