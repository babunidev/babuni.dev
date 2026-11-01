# Public Documentation Editions — Publication History

**Current checkpoint — 2026-11-01.** This document preserves the October 28 decision to prepare limited public documentation editions for four projects, along with the original publication safeguards and implementation history. **It is a historical publication plan, not the current repository-mapping authority.** Consult [Repository connections](REPOSITORY_CONNECTIONS.md) and `src/content/project-repositories.json` for active sources.

| Project / stable ID | Current mapped public source | Status in current mapping |
| --- | --- | --- |
| Ethera: The Stonewrought (`ethera-the-stonewrought`) | `babunidev/Ethera-docs` | Public documentation edition; implementation remains private |
| Morkahja (`morkahja-rpg`) | `babunidev/Morkahja` | Actual project repository, made public and mapped on 2026-10-31 |
| Morkahja Worldbuilding (`morkahjaworld`) | `babunidev/MorkahjaWorld` | Actual project repository, made public and mapped on 2026-10-31 |
| Babuni Admin (`arcanitebrothers`) | `babunidev/babuni.admin` | Actual project repository, made public and mapped on 2026-10-31 |

The creative's **original decision** was to publish separate, carefully limited documentation without exposing private implementation material. On 31 October, the creative subsequently made three actual repositories public and explicitly connected their standard documentation. That later action superseded the separate documentation-only mappings for those three projects; it does **not** imply that every file is suitable for republishing elsewhere, that licensing is settled, or that functionality was verified. Ethera's implementation remains private.

## Original preparation plan — 2026-10-28 (historical)

### Prepared destinations

| Project | Proposed public repository | Local preparation |
|---|---|---|
| Ethera: The Stonewrought | babunidev/Ethera-docs | public-documentation/Ethera-docs |
| Morkahja RPG | babunidev/Morkahja-docs | public-documentation/Morkahja-docs |
| MorkahjaWorld | babunidev/MorkahjaWorld-docs | public-documentation/MorkahjaWorld-docs |
| Morkahja Admin | babunidev/arcanitebrothers-docs | public-documentation/arcanitebrothers-docs |

These paths referred to the original temporary preparation workspace, not folders in the babuni.dev repository. The editions were subsequently published. The destinations shown above supersede three of the original documentation-only mappings.

## Scope and provenance — original documentation-only editions

AI inspected each private project's README and CONCEPT on 2026-10-28 and adapted a deliberately limited public summary into ten standard documents. It did not mirror private docs, Git history, runtime code, assets, configuration, operator/player records or raw conversations. Runtime, release and security results remain source-reported rather than independently verified. MorkahjaWorld remains a reserved project; arcanitebrothers is the local Morkahja Admin tool. Music contributor credit is retained for Morkahja without distributing music.

The documents preserve Babuni.dev's authorship and direction and label AI editorial work. This is a starting public edition, not a full recovery of private development history or a canonical world archive. More material can be explicitly reviewed later.

## Initial verification and publication blocker — historical

All four local editions contain exactly the ten intended Markdown files, internal Markdown links resolve, and a simple scan found no URLs, local user paths, recognized GitHub token signatures or private-key headers in the prepared documents. These checks do not constitute a universal secret audit. Each folder has a fresh local root commit; no implementation Git history was copied. No application/game was executed.

Local GitHub CLI read-only API verification identified babunidev as the authenticated account. Automatic approval review rejected the first `gh repo create` plus push as an external disclosure without trusted approval for the exact content/destination. No public repository was created by that rejected command. No other creation attempt was made. The four original repositories remain private and the website's four `private-review` statuses remain unchanged.

A syntax-checked publishing script is available outside this website repository at `public-documentation/publish-public-documentation.sh`. It checks account identity and clean prepared commits, then creates and pushes each documentation-only repository, stopping on failure. It does not change visibility of any existing repository or connect unverified sources to the website.

## Original integration plan — completed or superseded

This was the required next step when the editions were still being prepared. The dated verification below records publication of the documentation-only repositories and their initial integration. On 2026-10-31, three mappings were subsequently replaced by verified public project repositories. The current mapping should be checked before running any further import; it is not safe to restore these historical edition URLs as if they were current.

## Verified public-edition commits — 2026-10-28

- Ethera-docs: `41d64beff3e3c51dad49f46b6ab67efc4d97c6cc`
- Morkahja-docs: `e19d0aea48f6cccaf74bfb0a50f3b545b124e5ed`
- MorkahjaWorld-docs: `f27191426e68af739a904e8cb14beec5be580700`
- arcanitebrothers-docs: `da8b818e0be9fc14ba8176da25ab99ab774223be`

The importer fetched all forty documents anonymously. Existing external snapshots were preserved; authenticated metadata separately confirms all four implementations remain private. The site mapping and snapshot are locally integrated, with tests/build passing; remote website publication remains separate.


## Naming correction — 2026-10-29 (historical)

Babuni.dev renamed the project formerly listed as Arcanitebrothers to **Babuni Admin**. Stable website ID and Morkahja group membership remain unchanged. Its separate public documentation edition keeps the earlier repository name for now; implementation remains private. Earlier tables and narrative are historical.


## Documentation-only Admin destination — 2026-10-29 (superseded)

Babuni.dev renamed the public edition to `babunidev/babuni.admin-docs`. The website mapping and ten-document snapshot now use that canonical name, anonymously verified public. Earlier tables describe the original preparation/history; source bodies and pinned revision remain unchanged.

## Subsequent public-source decision — 2026-10-31

The creative later chose to make the actual **Morkahja**, **MorkahjaWorld**, and **babuni.admin** project repositories public. Their repository visibility was anonymously verified before the portfolio's standard Markdown documentation mappings were updated. These changes replaced the corresponding documentation-only source editions without changing their stable portfolio project identities. The earlier privacy boundary was a deliberate decision at the time, not an assertion that those three implementations remain private today.

**Remaining boundary:** Ethera still uses `Ethera-docs`, and its implementation has not been made public through this mapping. Public availability of a repository does not grant blanket permission to redistribute assets or prove the project is complete, tested, or deployed. Any further publication or source refresh must be explicitly authorized and reviewed; see [Module authoring](MODULE_AUTHORING.md).
