# Public documentation editions — 2026-10-28

Babuni.dev chose separate public documentation for Ethera: The Stonewrought, Morkahja RPG, MorkahjaWorld and Morkahja Admin (the arcanitebrothers project). The existing implementations must stay private.

## Prepared destinations

| Project | Proposed public repository | Local preparation |
|---|---|---|
| Ethera: The Stonewrought | babunidev/Ethera-docs | public-documentation/Ethera-docs |
| Morkahja RPG | babunidev/Morkahja-docs | public-documentation/Morkahja-docs |
| MorkahjaWorld | babunidev/MorkahjaWorld-docs | public-documentation/MorkahjaWorld-docs |
| Morkahja Admin | babunidev/arcanitebrothers-docs | public-documentation/arcanitebrothers-docs |

Local paths are relative to the surrounding task workspace, not this website Git repository. These preparation folders are not yet remote repositories.

## Scope and provenance

AI inspected each private project's README and CONCEPT on 2026-10-28 and adapted a deliberately limited public summary into ten standard documents. It did not mirror private docs, Git history, runtime code, assets, configuration, operator/player records or raw conversations. Runtime, release and security results remain source-reported rather than independently verified. MorkahjaWorld remains a reserved project; arcanitebrothers is the local Morkahja Admin tool. Music contributor credit is retained for Morkahja without distributing music.

The documents preserve Babuni.dev's authorship and direction and label AI editorial work. This is a starting public edition, not a full recovery of private development history or a canonical world archive. More material can be explicitly reviewed later.

## Verification and blocker

All four local editions contain exactly the ten intended Markdown files, internal Markdown links resolve, and a simple scan found no URLs, local user paths, recognized GitHub token signatures or private-key headers in the prepared documents. These checks do not constitute a universal secret audit. Each folder has a fresh local root commit; no implementation Git history was copied. No application/game was executed.

Local GitHub CLI read-only API verification identified babunidev as the authenticated account. Automatic approval review rejected the first `gh repo create` plus push as an external disclosure without trusted approval for the exact content/destination. No public repository was created by that rejected command. No other creation attempt was made. The four original repositories remain private and the website's four `private-review` statuses remain unchanged.

A syntax-checked publishing script is available outside this website repository at `public-documentation/publish-public-documentation.sh`. It checks account identity and clean prepared commits, then creates and pushes each documentation-only repository, stopping on failure. It does not change visibility of any existing repository or connect unverified sources to the website.

## Next integration

After publication, verify anonymous public access and exact commits for all four new repositories. Update only their four website mappings; fetch the new public documentation snapshots, preserving the existing 33 sources unchanged. Then validate content, run tests/build, regenerate the connection report and commit/push the website update. Do not mark these editions connected before anonymous verification succeeds. Do not automatically repurpose the still-unconfirmed Morkahja Admin Console tile or other family tiles without scope clarification.
