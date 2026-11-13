# Human–AI Collaboration and Provenance

Follow [the documentation standard](DOCUMENTATION.md) for first-person author voice throughout project documentation, factual changelogs, and naming the AI tool and verified model for each contribution.

## Purpose

babuni.dev is both a creative portfolio and a record of how the work came into being. The human creative, **Babuni**, originates and directs the vision, makes decisions, corrects interpretations, and assesses results. AI may research, propose, write, design, implement, and test under that direction. Neither contribution should be hidden or misattributed.

The living stone grid is an example. Its toy-box premise, shifting plates, portal information points, endless field, and physically reserved bloom cells emerged through my direction and corrections. Describing it simply as “AI built a portfolio” would obscure the work that shaped it.

This document sets the publication and evidence rules. [AGENTS.md](../AGENTS.md) governs development practice, while [DEVLOG.md](DEVLOG.md) tells the story.

## Authorship and narrative voice

Public-facing development history is written **from the human creative's first-person perspective**, in natural, varied prose. Use “I” and “my” within sentences, but **never begin a sentence with “I” or “My.”** Refer to a person who conceives or makes work as a **creative**, not a **creator**.

Write about the motivation, the choice, the collaboration, and the result. Avoid promotional language, repetitive labels, and exhaustive accounts of routine commands. Keep changelogs factual and technical details direct.

First-person narration does **not** mean claiming personal execution of AI work. Write plainly when AI drafted a document, changed code, generated a visualization, or ran a test. Likewise, an AI suggestion cannot become the creative's idea or approved decision without evidence.

## Five kinds of evidence

1. **Creative direction:** The creative's original idea, goal, constraint, question, observation, or correction.
2. **AI contribution:** A suggestion, interpretation, research finding, draft, design, code change, or action performed by AI.
3. **Decision and iteration:** What I accepted, rejected, refined, or deferred, including consequential alternatives and misunderstandings.
4. **Implementation:** What actually changed, with file, issue, PR, or commit references where available.
5. **Verification:** What was tested or observed, by whom and how, and what remains uncertain.

These are evidence categories, **not five mandatory subheadings for every journal entry**. A two-sentence adjustment can be sufficient. Larger work may need a fuller account. Preserve cause and effect without turning the journal into a transcript.

## Status and source integrity

Keep **proposed**, **accepted**, **implemented**, **verified**, and **deployed** distinct. A design mockup is not a shipped feature; a commit is not a passing test; a passing automated test is not a real-device observation; a local build is not proof of production deployment.

Use material actually available: the current conversation, accessible previous discussions, supplied files, repository contents, commits, and recorded test evidence. An agent does not necessarily have access to every archived conversation, local file, or tool session. Mark incomplete historical reconstructions as **retrospective**, and never invent missing motives, dialogue, approvals, results, or dates.

Attribute human device checks to the creative and AI-driven browser or automated tests to the agent that performed them. Record verification limits when material.

## Publication and privacy

The repository is public, but project conversations are not automatically public documents. Publish concise, relevant summaries rather than raw transcripts. Exclude credentials, keys, private account details, unrelated personal information, sensitive infrastructure data, and third-party material without appropriate rights or authorization.

Preserve original credits and licenses for source documents and media. A public repository link is not evidence that its content was authored by AI or that it was tested in a running application.

## Where information belongs

| Document | Primary responsibility |
| --- | --- |
| [Development journal](DEVLOG.md) | Brief, publishable first-person story of the creative process |
| [Decision register](DECISIONS.md) | Accepted, proposed, superseded, and open decisions with rationale |
| [Changelog](../CHANGELOG.md) | Actual repository changes and stated verification limits |
| [Concept](../CONCEPT.md) | Lasting creative vision, not a running implementation report |
| [Design](DESIGN.md), [Architecture](ARCHITECTURE.md), [Content](CONTENT.md) | Current specifications and clearly marked historical context |
| [Roadmap](../ROADMAP.md) | Milestones and current outstanding work |

For substantial implementation work, update the relevant documents together when practical. For discussion-only work, prepare a documentation-ready account without pretending a repository change occurred.

## Example: making physical space for a bloom

The early bloom visualization showed floating panels around the selected project. That AI interpretation missed the spatial relationship I wanted: selecting a tile should physically move its neighbors aside and reserve actual grid cells for content. After the correction, the design became a grid-native bloom rather than an overlay dashboard.

This is the kind of history worth retaining. The creative correction explains **why** the design changed; implementation and test evidence belong alongside the appropriate dated development record. At the time of the early example, the behavior had not yet been implemented; later work must not be retroactively attributed to that original experiment.

## Historical provenance checkpoint — 27 October 2026

An earlier documentation audit recorded the distinction between **53 candidate tiles**, **34 mapped tiles / 33 public sources**, **15 original WebP portal artworks**, and **21 archived AI captures** at that particular checkpoint. It also compared earlier 97-test reports with a later journal report of 126 tests. These counts are historical, **not current inventory or verification claims**.

That audit examined the repository and its existing documentation, but did **not** run new tests, a content sync, production build, physical-device trials, or deployment. Its core editorial conclusion remains: external project documents are revision-pinned snapshots, and updates require deliberate synchronization and review. Current status belongs in the repository, [roadmap](../ROADMAP.md), and newer dated records.

## Reuse in other projects

This method can be adapted for other Babuni repositories, but only when deliberately adopted in their own project rules. Neither this file nor a ChatGPT conversation automatically changes another project's instructions.
