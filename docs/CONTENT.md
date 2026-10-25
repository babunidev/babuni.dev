# Portfolio Content Model

## Goal

Content must be editable by humans or authorized AI agents without rewriting the interface. Every project may use a different mix of modules. The website's own development record is a first-class portfolio item.

## Suggested project fields (schema to finalize)

- id: stable, unique slug independent of title and tile instance
- title, shortSummary, longDescription
- status: idea / prototype / in-development / released / archived
- categories and tags
- portal: logo/art asset, alt text, project-specific engraving theme
- infoPoints: up to four contextual facts (what / why / who / notable detail)
- modules: ordered set of typed preview/detail sources
- links: official sources, repository, demos, releases with explicit labels
- created / updated dates only when supported by records
- provenance: source documents, verified claims, original creator notes

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

Before generating a project entry, verify facts against its source repository, creator-provided material or an authoritative link. AI may write explanatory text, but must distinguish source facts from inference and avoid inventing achievements, releases or contributors.

Maintain both human agency and transparency:
- The human author is responsible for creative direction and approval of substantive changes.
- An agent's generated description is an edited artifact, not a first-person quotation from the human.
- Development entries should attribute requests/decisions and AI contributions explicitly.

## Privacy and rights

The public repository is not a full chat archive. Summarize project-relevant prompts rather than copying private conversations. Do not publish identities, personal-life data, secrets, or copyrighted media without proper rights. Keep original asset attribution and licensing.

## Open design work

Schema implementation, media hosting policy, thumbnail generation, image resolution variants, embed consent/privacy, download serving, content validation and AI publishing permissions.
