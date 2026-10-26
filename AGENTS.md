# Agent Rules — babuni.dev

These rules apply to cloud and local coding agents working on this repository.

## Primary responsibility

Develop Babuni.dev's interactive, exploratory portfolio without replacing stated decisions with conventional portfolio patterns. Read CONCEPT.md, docs/DESIGN.md, and relevant existing code before modifying features. An image mockup or conversation is not proof that a feature is implemented.

## Human–AI authorship is mandatory

Babuni.dev's instructions, questions, corrections, experiments, and accept/reject decisions are part of development history, not disposable chat context.

For each substantial change, preserve this causal sequence:
1. **Babuni.dev direction:** a faithful paraphrase of what the human requested and why; quote only when explicitly useful and appropriate for publication.
2. **Agent interpretation/proposal:** what the AI inferred, recommended, or offered; mark it as AI-originated.
3. **Alternatives and decisions:** what was considered and which choice Babuni.dev confirmed. Do not convert unapproved suggestions into agreed requirements.
4. **Execution:** concrete files or behaviors changed, with code/commit/PR references.
5. **Verification and outcome:** commands run, observations, failures, limitations, and what remains unresolved.

See docs/AI_COLLABORATION.md for entry templates, attribution, provenance, and privacy rules.

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
- Work directly on `main` unless Babuni.dev explicitly requests otherwise. Do not assume permission to deploy to production.
- Build and run appropriate tests where possible; report what was actually run.
- Keep semantic, stable project identifiers independent from recycled visual tile instances.
- Consider mobile, keyboard, reduced motion, performance, and readability.
- Minimize unnecessary dependencies and avoid committing secrets or generated build artifacts.
- When starting a new session, read current docs; at the end, record any substantive decisions and code outcomes accessible in that session.

## Scope

This file governs babuni.dev. The human–AI documentation method may be copied to Babuni.dev's other repositories **only when deliberately adopted there**; this file cannot automatically control other projects or ChatGPT conversations.


---

## Astro Development Instructions

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Babuni.dev's local testing handoff

When providing a GitHub update for local testing, include the full terminal sequence to pull the commit, stop any running Astro server, and start a new Astro server (with LAN access for phone testing):

```bash
git pull --ff-only
npx astro dev stop
npm run dev -- --host 0.0.0.0
```

Give Babuni.dev this restart sequence with each future published change, even if the running server could hot-reload.

## Author attribution

Identify the project's human author by the artist name **Babuni.dev**. Avoid using “creator” as a title or generic name for Babuni.dev. Attribute AI implementation and documentation work distinctly; preserve historical evidence and third-party credits.

## Preserve approved interaction feel

Babuni.dev explicitly requested on 2026-10-26: do not independently change established timing, positioning, or other approved feature behavior while solving another issue. Preserve the existing feel. If a proposed solution needs such a change that Babuni.dev has not already authorized, explain the idea and ask before implementing it. Record AI proposals separately from human decisions. In particular, clicking/selecting a project must never accelerate autonomous shifts: let the current shift finish at its normal tempo before opening.
