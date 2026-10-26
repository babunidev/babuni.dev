# Changelog

All notable **verified repository changes** are recorded here. Human–AI reasoning and proposals belong in docs/DEVLOG.md, not here.

Follow the spirit of Keep a Changelog: Added, Changed, Fixed, Removed, Security. Do not claim work is finished because it was discussed, illustrated, or started locally.

## [Unreleased]

### Added
- Dated foundation review (`docs/REVIEW-2026-10-26.md`) with findings, verification scope, and human–AI attribution.
- README local development prerequisites and install/run/build commands.
- Initial Astro 7 project foundation: package scripts, lockfile, TypeScript configuration, base page, favicons, and editor configuration (creator's commit `294831c`).
- Project documentation baseline: concept, roadmap, agent guidance, design, architecture, content policy, decisions, journal, collaboration policy, and ChatGPT project instructions.
- Updated README describing the portfolio's goals and documentation.

### Changed
- Integrated local Astro foundation and documentation on `main` in merge commit `5902121`, preserving both agent instruction sets in AGENTS.md.
- Aligned documented workflow to the creator's decision to develop directly on `main` unless requested otherwise.

### Fixed
- Stale current framework status in D-011 and missing independent-build evidence in the architecture baseline.

### Verification
- On 2026-10-26, an independent text-source snapshot of `ea90117` installed with lifecycle scripts disabled and passed `npm run build` (one static page). Manifest/lockfile consistency and relative Markdown links passed inspection. Dedicated type checking, browser testing, and dependency vulnerability auditing were not performed.
- The creator reported Astro 7.4.2 starting successfully at localhost:4321 before the merge. The repository content and merge commit were verified on GitHub. At that time, no post-merge build or browser test had been independently performed.

## Conventions

Each future entry should include the change, its user-visible or technical effect, and optionally a PR/commit reference. Avoid duplicating brainstorm narratives from DEVLOG. Date releases when actual releases happen; do not invent version numbers.
