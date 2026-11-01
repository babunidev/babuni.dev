# Agent Rules — babuni.dev

These rules apply to cloud and local coding agents working on this repository.

## Primary responsibility

Develop Babuni's interactive, exploratory babuni.dev portfolio without replacing stated decisions with conventional portfolio patterns. Read CONCEPT.md, docs/DESIGN.md, and relevant existing code before modifying features. An image mockup or conversation is not proof that a feature is implemented.

## Human–AI authorship is mandatory

The creative's instructions, questions, corrections, experiments, and accept/reject decisions are part of development history, not disposable chat context.

For each substantial change, preserve this causal sequence:
1. **Creative direction:** a faithful paraphrase of what the human requested and why; quote only when explicitly useful and appropriate for publication.
2. **Agent interpretation/proposal:** what the AI inferred, recommended, or offered; mark it as AI-originated.
3. **Alternatives and decisions:** what was considered and which choice the creative confirmed. Do not convert unapproved suggestions into agreed requirements.
4. **Execution:** concrete files or behaviors changed, with code/commit/PR references.
5. **Verification and outcome:** commands run, observations, failures, limitations, and what remains unresolved.

See docs/AI_COLLABORATION.md for attribution, provenance, privacy rules, and publication style.

**Public narrative style:** Write development stories from the human creative's first-person perspective. Never start a sentence with “I” or “My”; integrate those pronouns naturally into varied sentences. Use “creative” instead of “creator” for the maker of a work. Explain AI proposals and actions as AI work, not as code or testing personally performed by the creative. Keep journal entries brief and readable, separate proposals from implemented and verified work, and preserve the significance of corrections and abandoned approaches. Use neutral technical prose in specifications where it reads better.

## Every meaningful change must update documentation

- CHANGELOG.md: only actual changes, organized by Added / Changed / Fixed / Removed / Security.
- docs/DEVLOG.md: editorial development narrative about goals, human input, AI contribution, trade-offs, tests, failures, discoveries.
- docs/DECISIONS.md: decisions with status, alternatives, rationale, and ability to revisit.
- docs/DESIGN.md, docs/ARCHITECTURE.md, docs/CONTENT.md: maintain consistency with changed behavior.
- ROADMAP.md: keep status truthful and distinguish planned from built.
- CONCEPT.md: revise only when Babuni.dev confirms a substantial change to vision.

Prefer documentation updates in the same commit as the implementation. If a discussion changed direction but produced no code, record it as a design entry, **not** an implementation in CHANGELOG.

## Sources and privacy

Only write claims based on material actually available to the agent: this conversation, explicitly supplied files, verified repository state, and tests it ran. There is no automatic access to every previous ChatGPT conversation. Ask for or retrieve missing context before claiming a complete history.

Do not automatically publish raw private chats, identity details, tokens, keys, VPS credentials, unrelated personal or financial information, or third-party material. Public-facing development history should paraphrase relevant project directions, preserve meaningful attribution, and omit irrelevant personal content. Public release of verbatim quotes or sensitive materials requires explicit approval.

Use labels **Babuni.dev requested**, **AI proposed**, **Babuni.dev decided**, **Implemented**, **Tested**, and **Open** where appropriate. Never fabricate a test, outcome, conversation, date, feature, or acceptance.

## Development safeguards

- Preserve existing Git history and uncommitted local changes.
- Follow the creative's requested Git workflow. The established default is direct, reviewable changes on `main`; never overwrite concurrent or uncommitted work. Do not assume permission to deploy to production.
- Build and run appropriate tests where possible; report what was actually run.
- Keep semantic, stable project identifiers independent from recycled visual tile instances.
- Consider mobile, keyboard, reduced motion, performance, and readability.
- Minimize unnecessary dependencies and avoid committing secrets or generated build artifacts.
- When starting a new session, read current docs; at the end, record any substantive decisions and code outcomes accessible in that session.

## Scope

This file governs babuni.dev. The human–AI documentation method may be copied to Babuni.dev's other repositories **only when deliberately adopted there**; this file cannot automatically control other projects or ChatGPT conversations.


---

## Astro development

### Development server

When starting the dev server, use background mode:

```sh
npm run dev -- --background
```

Manage the background server with `npm run astro -- dev stop`, `npm run astro -- dev status`, and `npm run astro -- dev logs`.

### Astro reference

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Local testing handoff

When a change requires local browser or phone testing, provide the appropriate pull/restart commands and note any local uncommitted changes that must be protected. LAN access is optional and should be enabled only when needed for testing:

```bash
git pull --ff-only
npx astro dev stop
npm run dev -- --host 0.0.0.0
```

Do not append a restart ritual to documentation-only updates or claim the developer's machine was restarted. For LAN testing, bind to `0.0.0.0` only on a trusted network.

## Author attribution

Identify the human creative as **Babuni** and the website/repository as **babuni.dev**. Avoid using “creator” as a title or generic name for Babuni.dev. Attribute AI implementation and documentation work distinctly; preserve historical evidence and third-party credits.

## Preserve approved interaction feel

Babuni.dev explicitly requested on 2026-10-26: do not independently change established timing, positioning, or other approved feature behavior while solving another issue. Preserve the existing feel. If a proposed solution needs such a change that Babuni.dev has not already authorized, explain the idea and ask before implementing it. Record AI proposals separately from human decisions. In particular, clicking/selecting a project must never accelerate autonomous shifts: let the current shift finish at its normal tempo before opening.

## Historical development priorities and test attribution

On 2026-10-26, the creative prioritized architecture and underlying structures before visual polish and required discussion of module kinds before full-bloom implementation. These are historical sequencing decisions, **not unfinished tasks or overriding current instructions**. The creative's physical phone feedback must be recorded as human device evidence, separately from agent browser simulations or automated tests.

## Browser screenshot archive

Babuni.dev requested on 2026-10-27 that browser test screenshots be added to the project's visual documentation. Publish all website images as WebP. Capture temporary PNGs outside `public/` if needed, convert genuine PNG screenshots to lossless WebP where practical, and inspect actual encoded format rather than relying on filenames. Save verification screenshots under `public/media/babuni-dev/images/verification/`, add them to BABUNI.DEV's Visual documentation gallery and `docs/VISUAL_DOCUMENTATION.md`, and caption the test context and historical status. Distinguish AI browser captures from human-supplied art and actual phone acceptance. Preserve earlier captures even when their design is superseded. Do not claim unavailable or unsaved screenshots were recovered.

## Current-state and evidence safeguards

- **Verify before claiming:** Read current source and relevant documentation before stating that a feature, test, deployment, or publication is complete. Dated audits and test counts describe their original checkpoints, not the current branch. Record the exact commands and results actually observed.
- **Preserve project identity:** The current creative identity is Babuni; babuni.dev is the portfolio. Keep stable project IDs separate from display names and recycled tile instances. Project ordering and recent-update indicators changed on 2026-10-30; do not restore older newest-first behavior without direction.
- **Preserve the experience:** The toy-box metaphor, engraved stone portals, living grid, contextual bubbles, small/big grid-native blooms, and readable detail views are central. Do not change approved movement timing, input behavior, or animation feel as an incidental fix.
- **Treat imported documents as snapshots:** External repositories are not live mirrors. Sync only when explicitly in scope, review changed source documents, then validate with `npm run content:check`, `npm run test:grid`, and `npm run build`. Do not imply that a new upstream commit is already published here.
- **Keep documentation work bounded:** A documentation-only review must not modify website content, application code, generated snapshots, or media unless separately requested. Record actual documentation changes in the changelog and the context in the journal where meaningful.
- **Separate code, CI, and live-site evidence:** A commit is not a successful test, a test is not physical-device acceptance, and source changes are not proof of deployment. The 2026-10-31 hosting and HTTPS checks describe the deployed release at that time, not necessarily the latest `main` state.
- **Safe rendering and rights:** Keep Markdown rendering protections, source-relative links, credits, and rights intact. Do not silently make imported Markdown executable or alter original art.
