# Portfolio Content Model

## Goal

Content must be editable by humans or authorized AI agents without rewriting the interface. Every project may use a different mix of modules. The website's own development record is a first-class portfolio item.

## Suggested project fields (schema to finalize)

- id: stable, unique slug independent of title and tile instance
- title, shortSummary, longDescription
- status: idea / prototype / in-development / released / archived
- categories and tags
- portal: logo/art asset, alt text, project-specific engraving theme
- infoPoints: three currently planned short flavor hints (above/left/right); former four-point plan superseded. Include curation evidence and review status.
- modules: ordered set of typed preview/detail sources
- links: official sources, repository, demos, releases with explicit labels
- created / updated dates only when supported by records
- provenance: source documents, verified claims, original Babuni.dev notes

## Module types

- Text document: summary, Markdown/MDX body, related notes.
- Development log: chronological author–AI narrative with provenance.
- Image gallery: asset list, captions, alt descriptions, rights, display order.
- Video: title, poster, embedded URL or local media, transcript where possible.
- File: filename, file type, size if known, licensing/availability, download URL.
- Release: version, date, changelog reference, source.
- Feature / experiment: demonstrated behavior, media, implementation status.

## Progressive disclosure

Grid tile displays the engraved title and portal. Temporary bubbles show short project facts. Small bloom displays introductory modules that occupy neighboring tile space. Full bloom exposes module previews. Detailed viewers show the full text, galleries, video or downloads.

## Self-exhibit: babuni.dev

Treat this website as an ordinary project record rather than special hardcoded prose. Its available modules should include concept, dev journal, changes, design evolution/mockups, architecture, and collaboration methodology. Being the first or centered tile remains a proposal requiring visual testing.

## AI authoring contract

Before generating a project entry, verify facts against its source repository, Babuni.dev-provided material or an authoritative link. AI may write explanatory text, but must distinguish source facts from inference and avoid inventing achievements, releases or contributors.

Maintain both human agency and transparency:
- The human author is responsible for creative direction and approval of substantive changes.
- An agent's generated description is an edited artifact, not a first-person quotation from the human.
- Development entries should attribute requests/decisions and AI contributions explicitly.

## Privacy and rights

The public repository is not a full chat archive. Summarize project-relevant prompts rather than copying private conversations. Do not publish identities, personal-life data, secrets, or copyrighted media without proper rights. Keep original asset attribution and licensing.

## Open design work

Schema implementation, media hosting policy, thumbnail generation, image resolution variants, embed consent/privacy, download serving, content validation and AI publishing permissions.

## Provisional candidate catalog for the living-grid prototype (2026-10-26)

The temporary `src/lib/demo-projects.ts` now contains **53 candidate identities**, transcribed in approximate recent-to-old order from `PROJECT_INVENTORY.md`. Each carries a provisional slug-like `id`, visible `name`, `shortSummary`, original inventory `evidence` label and decorative `tint`. BABUNI.DEV stays at the center and is rendered uppercase. These are **prototype names**, not a set of 53 verified, approved, independent releases. Related addon lineages, alternative names, lore works, and conceptual studies have deliberately not been merged yet.

The one-line descriptions are stored for future info points or bloom content but are not yet displayed as new information bubbles. Before converting any entry into a portfolio exhibit, confirm individual title, relationship to parent works, authorship, status, source links, rights and Babuni.dev approval. The later production schema must not assume the provisional catalog IDs will remain final.

## Temporary topic label for the first information point (2026-10-26)

For the first interactive information bubble, a separate `src/lib/project-topics.ts` map supplies **one very short subject/category** per provisional project ID. It was manually derived by the assistant from the available one-line candidate descriptions, intentionally avoiding longer marketing blurbs and technical/release claims. The 53 topic words are provisional editorial metadata, independent of title, summary and evidence fields. Examples include "Reaction game", "Local AI" and "Worldbuilding".

Later versions should review actual project descriptions, reliable documentation, development journals, and existing creative material, then curate a richer but minimal set of interesting descriptors. Such keyword extraction should retain provenance and human editorial approval; avoid automatic publication of unreviewed AI-generated claims. The existing descriptions remain stored for future, richer interactions. Currently the popup renders only its one topic, not the original shortSummary, and does not imply that all 53 candidates are distinct finished exhibits.

## First bloom module from provisional summaries (2026-10-26)

The one-cell small-bloom prototype uses the selected candidate's existing provisional `shortSummary`. Its contents are distinct from the much shorter topic marker. This tests spatial displacement and selection before a production portfolio schema exists. Occasional ambient topic teasers reuse the same 53 reviewed-for-prototype draft subjects; no new creative claims, art assets or source materials are added. Publication approval and proper multi-module content remain future milestones.
