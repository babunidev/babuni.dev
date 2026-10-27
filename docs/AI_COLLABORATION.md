# Human–AI Collaboration and Provenance Policy

## Purpose

babuni.dev documents not only outputs, but **how the human Babuni.dev used AI to make them**. What Babuni.dev asks for, notices, challenges, accepts, rejects, or improves is part of the project authorship.

A development diary that only says "AI implemented a grid" misses the decisive contribution: Babuni.dev's toy-box metaphor, shifting-plate behavior, point-origin information bubbles, cell-based bloom correction, and endless recycled layout.

## Five distinct kinds of evidence

1. **Babuni.dev direction** — a faithful paraphrase of the intention, creative constraint, observation, question or correction expressed by Babuni.dev.
2. **AI response / proposal** — what an assistant suggested, interpreted, drafted or generated. Clearly labeled as agent-originated.
3. **Babuni.dev decision** — what was explicitly confirmed, changed, or left undecided. Never promote a suggestion to accepted without evidence.
4. **Implementation action** — what was actually changed in source files, designs or deployed systems; include PR/commit references.
5. **Verification** — what was tested and what the observed result was. "Not verified" is a valid answer.

Show chronology, not just conclusions. Prefer a readable narrative that expresses why a particular design happened.

## Conversation handling

- Treat relevant conversation content as valuable source material when it is actually available to the current agent.
- Capture *meaningful project input* from all project sessions: requests, brainstorms, feedback, changes of mind, tests, corrections, failures, and approvals.
- For long exchanges, paraphrase Babuni.dev's directive and why it mattered rather than copying every turn.
- Record relevant exact words only if they are essential and explicitly appropriate to publish.
- Mark material reconstructed from past sessions as **retrospective**, citing or linking the original source if possible.
- Do not falsely claim that an agent can see or automatically archive every ChatGPT project chat. Existing access may be limited to the current context and connected sources; request missing material when needed.
- Never publish complete raw conversations by default. Exclude non-project personal details, private accounts, credentials and other sensitive material.
- Store public-safe collaboration summaries in docs/DEVLOG.md; complete private source transcripts, if ever retained, require a separately authorized private storage policy.

## Required log entry pattern

### [Date] — [Feature or discussion]

**Context and source:** Current session / issue / PR / retrospective / notes.  
**Babuni.dev's intent:** The direction and motivation in neutral, faithful words.  
**AI's contribution:** Proposal or implementation, explicitly attributed.  
**Iteration:** Alternatives considered, corrections, feedback, failure.  
**Decision:** Accepted / rejected / open, with attribution.  
**Changed artifacts:** Files, images, diagrams, code, commits, PRs.  
**Verification:** What was run or observed; uncertainty recorded plainly.  
**Result:** New capability, refined concept, or unresolved question.

## Example: The bloom geometry

**Babuni.dev's intent:** Clicking a tile should physically make room for project content in neighboring cells; the other tiles move away.  
**AI's earlier interpretation:** A central tile surrounded by floating dashboard panels.  
**Babuni.dev correction:** That interpretation didn't reserve actual tile positions.  
**Decision:** Small bloom occupies adjacent cells and displaces their original tiles.  
**Implementation:** Not yet implemented when this example was written.  
**Value to the journal:** It shows Babuni.dev clarifying geometry and the AI correcting a misleading visualization.

## Cross-project reuse

This is a reusable policy for Babuni.dev's other repositories, but each project must deliberately adopt it in its own agent rules and ChatGPT project instructions. A babuni.dev file does not automatically govern other projects.

## Accountability

Babuni.dev sets direction. Agents should be useful collaborators, not ghost authors of design decisions. Do not infer human approval from silence. If a chat changes a requirement without resulting in code, log the decision but do not present it in CHANGELOG as a shipped feature.

## 2026-10-27 — Documentation audit #28: scope and provenance

**User direction:** Continue the documented GitHub portfolio-audit sequence, now reaching `babunidev/babuni.dev` immediately after ButtonGame. Preserve the origin as a **human-directed toy-box interaction** and the site as a living record of how Babuni.dev conceived, corrected, accepted, rejected and tested work with AI. Do not flatten those detailed records into a one-line “AI built the portfolio” credit.

**AI contribution in this audit:** Examine the current Git tree, Astro/TypeScript dependencies, latest navigation/Markdown commits and the substantial existing journals; reconcile README **11 artworks → 15** and older **97-test** reports with the later **126-test** journal. Record the distinction between 53 candidate tiles, 34 mapped tiles/33 public sources, existing original WebP binaries and 21 archived AI captures. Identify that external project-doc commits require an **explicit source refresh** before they appear in this portfolio's static snapshot.

**Iteration already documented elsewhere:** The user corrected AI's suggestion of floating bloom cards, rejected scroll-as-navigation, insisted that tiles retain a coherent stone-and-portal identity through motion, supplied WebP artwork and required visible attribution in the reader. More recent requested adjustments include safe Markdown rendering and persistent header/search navigation; a browser-tested buffered-identity issue was then corrected. Do not invent private dialogue or attribute AI-origin alternatives to human acceptance.

**Verification and nonchanges:** The checked-in journal reports prior 126 Node tests and browser/build findings, but the assistant **did not run new tests, content sync, a production build, real-device trials, or deployment** during this document audit. No site source, media, tests, content snapshot, CI, package manifests or artwork was modified. Any future automation, release-license choice or performance change requires its own creator direction and evidence.
