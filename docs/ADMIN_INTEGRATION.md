# Babuni.admin ↔ babuni.dev integration

## Briefing for Babuni Admin — ready to connect (2026-11-10)

This section is the current handoff. The 2026-11-04 review below is a historical snapshot. Its finding that no publish route exists has since been superseded.

babuni.dev now provides three command-line tools. Each one runs from the babuni.dev checkout (`~/Projects/babunidev/babuni.dev`, or `BABUNI_DEV_CHECKOUT` in the admin local service). Each one is safe to call without a terminal: it fails with a clear message instead of prompting.

| Tool | Purpose | Babuni Admin status |
|---|---|---|
| `scripts/publish-document.sh` | Publish one babuni.dev document without a build | **Connected** (Documents page, `local-service/portfolioDocuments.mjs`) |
| `scripts/pull-repository.mjs` | Update the pinned snapshot of documents from the other connected repositories | **Ready, not connected** |
| `scripts/publish-site.sh` | Build committed `origin/main` and publish only the changed files | **Ready, not connected** |

### Prerequisites on the operator's machine

- **Deployment key in the SSH agent:** `ssh-add ~/.ssh/id_ed25519_babuni_deploy`. The publish scripts exit with code `3` and print `SSH_KEY_NOT_LOADED` on stderr if it is missing and there is no terminal.
- **GitHub CLI logged in (`gh auth login`)**, for `pull-repository.mjs`. The token goes only to `https://api.github.com`. Raw document downloads stay anonymous, and private repositories are refused.
- **`NODE_OPTIONS=--no-network-family-autoselection`** for `pull-repository.mjs` on the Nobara desktop. `publish-site.sh` sets it for its own build.

### `scripts/pull-repository.mjs`: bring in source-repository document changes

```
node --experimental-strip-types scripts/pull-repository.mjs <name | owner/name ...> | --all [--write]
```

- **Without `--write`,** it is a check only and writes nothing.
- **With `--write`,** it updates `src/content/repository-documents.json` in the working tree, and only for repositories whose document text changed. A repository whose head moved but whose documents are identical is left alone.
- **It refuses to write if the snapshot file already has uncommitted changes.** It also validates the merged snapshot before writing.
- **Repositories that are no longer connected** are dropped from the snapshot on `--write` and reported as `DROPPED   <owner/name>   (no longer connected)`.
- **Several names can be given at once.** `--write` refuses while the snapshot file has uncommitted changes, so pull related repositories in one run.
- **Paired folder images:** with `--write`, it also stores paired images as WebP under `public/media/repositories/`. Image changes appear as `NEW|CHANGED|REMOVED <image path>` lines, and those files must be committed together with the snapshot.
- **It does not commit, push or publish.**
- **Output (stdout), one block per repository:**
  - `CHANGED   <owner/name>   <old8> -> <new8>`, followed by indented lines `NEW|CHANGED|REMOVED <path>`.
  - Or `same      <owner/name>`, optionally with `(head moved …, documents identical)`.
- **Final line:** `No document changes.`, `<n> repository(ies) have document changes. Add --write …` or `Snapshot updated for <n> repository(ies). …`
- **Errors:** exit code `1`, with a one-line message on stderr.
- **Recommendation:** show `REMOVED` documents prominently and ask for confirmation before `--write`. A removal takes the page off the website. On 2026-11-10, Babuni confirmed upstream that a removed AmberbrewStory chapter was intentional.
- **Runtime:** a full `--all` check takes roughly a minute or two.

### Between pull and publish: commit and push

`publish-site.sh` builds **committed `origin/main`**, not the local working tree. After `--write`, the snapshot must be committed and pushed, or the publish will not include it. Babuni Admin needs one of two things here:
- an explicit, confirmed "commit and push snapshot" step (path `src/content/repository-documents.json` only; message such as `content: pull document changes from <n> source repositories`), or
- a clear handoff that asks the operator to do it.

Never commit other working-tree changes along with the snapshot.

### `scripts/publish-site.sh`: publish the built site

```
scripts/publish-site.sh            # dry run
scripts/publish-site.sh --apply    # publish
```

- **Steps:** fetches `origin/main` and builds it in a temporary worktree (`npm ci` + `npm run build`), compares the build with the live release and lists the differences. With `--apply`, it creates a hard-linked release, switches `current`, and checks that `https://www.babuni.dev/release.txt` reports the new release.
- **Output (stdout):**
  - `Building origin/main <commit>; live release: releases/<name>`
  - `Build finished: <n> files`
  - `--- changes ---`, then one line per path: `CHANGED  <path>`, `ADDED    <path>` or `REMOVED  <path>`.
  - Then `Nothing to publish.` or `Dry run: <n> path(s) differ. Add --apply to publish.`
  - With `--apply`: `Creating release <name>`, `Published and verified: <name>` and `Rollback: ssh ... '<command>'`.
- **The change list can run to hundreds of lines** (538 on 2026-11-10). The admin's current 64 KB stdout cap for document publishing may cut it. Parse the summary lines and show a count, plus a scrollable or abbreviated list.
- **Exit codes:**
  - `0`: success, including a dry run or nothing to publish.
  - `3`: `SSH_KEY_NOT_LOADED`.
  - `4`: `BUILD_FAILED`, with the last build log lines on stderr.
  - `5`: `VERIFY_FAILED`. The live site did not report the new release after the switch, so the script switched back to the previous release automatically.
  - Other non-zero values: a failure in another step.
- **Runtime:** the build takes several minutes, so allow a timeout of at least 10 minutes for both the dry run and `--apply`. The document publisher's 90/180-second timeouts are far too short.
- **Rollback:** the previous release stays on the server. Show the printed rollback line after a publish.

### Rules for the admin side

- **One lock for all publishing.** `publish-document.sh` and `publish-site.sh` both switch the live `current` link, so they must never run at the same time. Extend the existing `PUBLISH_BUSY` guard to cover both.
- **Fixed scope.** Use fixed argument lists with no shell (`spawn(..., {shell:false})`), as the document route already does. Pull targets should be chosen from the connected repositories in `src/content/project-repositories.json`, never from free text.
- **Dry run first, then a confirmed apply,** for both pull (`--write`) and site publish (`--apply`).
- **Which path to use:** documents from other repositories always go pull → commit/push → `publish-site.sh`. `publish-document.sh` only covers babuni.dev's own standard documents.

### Verified on 2026-11-10 (AI-run, on the Nobara desktop)

- **Pull check:** `pull-repository.mjs --all` (dry run, then `--write`) found document changes in 24 of 37 connected repositories.
- **Checks on the result:** `npm run content:check`, `npm run test:grid` (191 passed) and `npm run build` passed.
- **Committed:** `fd89891`, pushed to `origin/main`.
- **Published:** `publish-site.sh --apply` published release `20261110-004601-fd89891-site`, and the script reported it verified.
- **Not done:** none of this has been run through Babuni Admin yet.

## Current code review — 2026-11-04

**Request:** Babuni asked for an actual analysis of both repositories so the local administration application can manage the portfolio. The earlier review of documentation and a placeholder page did not establish an operational connection. This review follows the implemented routing, capability registry, profile schema and website generation/loading code instead.

**Baselines:** babuni.admin main commit was verified as `17f8f5e44afdf514829282d507afea2b7eddb629` through the commits endpoint after an earlier tree response exposed an older baseline; website parent is `d12fe74`. Remote files were read at the pinned admin revision. This is code inspection, not an execution of the admin app, a complete security audit or a live connection test. No upstream snapshots, admin code, credentials or server state were modified.

## What the admin actually has

| Component | Implemented behavior | Consequence for portfolio integration |
| --- | --- | --- |
| [Portfolio overview](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/src/features/babuni-dev/pages/OverviewPage.tsx) and navigation | Static overview; explicitly says it cannot edit/publish; navigation exposes Overview only | There is no existing project/module editor to connect to a website endpoint |
| [Adapter registry](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/vite/connectionAdapters.ts) | `github` and `remote-publish` belong to workspace `babuni-dev`, both have `transport: planned` and an empty capability list | Saving a profile or a credential cannot activate either transport |
| [Profile registry](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/vite/localConnectionRegistry.ts) | Persists project/kind/name/target, disabled initially; GitHub target is owner/repo; publish target is a hostname | No portfolio branch/path allowlist, website checkout, SSH user/port/release root, expected deployed revision or publish policy is represented here; the separate Morkahja-only private probe configuration does not fill this gap |
| [Local service router](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/local-service/server.mjs) | Profile CRUD, health, test/inspect, local sessions and a separately guarded Morkahja `probe` route; capability-gated | Inspect requires `local:inspect`; Connect requires `local:connect`. Neither capability is granted to the portfolio. No GitHub document read/write, build, stage or publish route exists |
| [Connection health](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/local-service/connectionHealth.mjs) | The ordinary test path returns `ADAPTER_NOT_IMPLEMENTED` for portfolio remote profiles, even with a stored credential; the separate Morkahja probe is a different operation | A successful keyring check must not appear as a working website connection |
| [Connections UI](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/src/pages/ConnectionsPage.tsx) | Lists GitHub and remote publishing as planned; UI session is distinct from service token | A Connections profile is preparation, not a working publishing control |

Local Linux keyring/profile infrastructure exists. Latest code also implements a disabled-by-default, operator-gated Morkahja SSH/PostgreSQL health probe (`sshPostgresProbe.mjs`, `remoteProbeConfig.mjs`, `sshTunnel.mjs`): fixed read-only database checks through a temporary private Unix-domain SSH forward, followed by teardown. Its private configuration is Morkahja-specific and cannot supply portfolio release permissions. [Probe contract](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/docs/MORKAHJA_SSH_READONLY_PROBE.md). This acknowledges real transport development without confusing it with a persistent session or website publishing. The independent [security review](https://github.com/babunidev/babuni.admin/blob/17f8f5e44afdf514829282d507afea2b7eddb629/docs/PHASE2_SECURITY_REVIEW_2026-11-04.md) still requires independently authorized live operations. Morkahja's existing content and database routes are not portfolio editing APIs and must not be reused by changing a project label.

## What the website actually has

| Website code/data | Current responsibility | Integration requirement |
| --- | --- | --- |
| `src/lib/demo-projects.ts`, `project-groups.ts`, `project-topics.ts` | Stable project identities, titles/artwork, menu groups and bubbles | Admin must read the actual catalog rather than invent IDs from titles or repository names. These inputs are partly TypeScript, not one editable JSON database |
| `src/content/project-repositories.json` | Public repository/branch/status and optional document selection per project | This is the website's connection map; an admin connection UUID is a separate identity |
| `scripts/sync-repositories.mjs` | Anonymous public-visibility check, immutable revision fetch, raw snapshots; CLI refreshes all connected external sources | Add a bounded one-source/document refresh operation with expected revision; do not run a whole-catalog refresh for one edit |
| `src/content/repository-documents.json` | Raw imported source text and repository commit | Admin edits the original GitHub file, not the reordered reading copy; compare raw source and preserve credits |
| `scripts/build-document-assets.mjs` | Generates presented Markdown, document index, preview and intro; own website docs are read directly from the checkout | A website DEVLOG edit and an external DEVLOG edit enter through different inputs; generated output is never the source of truth |
| `src/lib/project-content.ts`, `repository-content.ts` | Compose curated media/text, local-document references, sourced text and folder collections | A module may depend on another repository or a local website document. Curated preview text can intentionally override sourced preview text; an edit need not change every visible summary |
| `scripts/build-project-modules.mjs` | Recreates all `public/_project-modules/` collections | No targeted project CLI exists; removing/regenerating whole directories is unsuitable as a live-file mutation |
| `src/lib/server/public-projects.ts`, `src/pages/projects/**`, sitemap | Generate project/module HTML and discovery outputs from composed modules | An updated reader file alone does not update HTML, descriptions or bloom intros |
| `src/lib/project-module-loader.ts`, `src/scripts/document-body.ts` | Cache module collections in memory, fetch reader bodies later at stable URLs | An open tab can retain old previews while fetching newly deployed Markdown; `no-cache` HTTP headers do not invalidate this JavaScript Map |
| `.github/workflows/`, `package.json`, `deploy/` | CI validation, strict activity refresh, complete static build, release-directory deployment guidance | No existing deploy workflow or website management API; current full-build release remains usable |

The standard document list is defined once in `REPOSITORY_DOCUMENTS`. AmberbrewStory also has allowlisted folder documents and generated `document-list` modules. The admin editor must distinguish editable inputs from generated folder collections, galleries, embedded video records and resource links. It cannot treat every displayed module as a Markdown file.

**Identity warning:** `babuni-dev` is the admin workspace ID and also a portfolio project ID for the website itself. The portfolio's listing for the admin software is connected to `babunidev/babuni.admin` under stable ID `arcanitebrothers`. That historical ID is intentional; renaming it to match the workspace would change established URLs/identity. Repository connection status describes source publication, not a live admin transport connection.

## Required connection: proposed contract, not implemented

```text
Babuni Admin browser → private local service
  ├─ approved GitHub reads/diffs/commits → canonical raw documents
  ├─ website build adapter → reviewed snapshot + dependent outputs
  └─ scoped deployment adapter → staged complete release → verification/rollback
                                                        ↓
                                             static babuni.dev website
```

The website can remain static. An initial full-build publisher needs no public admin login, inbound browser-to-VPS write API, database, CORS relaxation or replacement of the living-grid renderer. SSH transport belongs in the admin's private service; the website provides content/build contracts. Existing Morkahja permissions must remain separate.

### Website work

1. **Read-only discovery contract.** Export a versioned machine-readable catalog from current website inputs: stable IDs/titles/types, repository/branch/document mappings, curated versus generated origin, original source revision/hash, reader/collection/readable URLs, and supported capabilities. Choose local CLI output for a local checkout or a public non-secret built manifest; the consumer must not assume a hosted endpoint exists today. Public metadata is discovery, never authorization.
2. **One-document ingestion/build boundary.** Accept an allowlisted repository/path and expected source revision through a local tool. Fetch canonical raw content at a verified public revision, update only the selected snapshot or local checkout input, then regenerate its dependency closure. Recheck public visibility independently of authenticated GitHub edit access. Do not publish private files merely because the admin token can read them.
3. **Dependency-aware generation.** Track every consuming project/module, shared local-document reference and folder listing; render safe presented Markdown, document index, module preview/intro, JSON collections, affected project/module HTML and discovery changes. Content, metadata and sitemap dependency changes require different output sets. Compare targeted output against a full build before supporting partial builds. Full Astro rebuilds are the supported interim path.
4. **Versioned content and release identity.** Include website commit, per-source imported revision, content/artifact hashes and build identity in a release manifest. Activity commit dates are a separate input: a fresh Recently updated marker does not prove the document snapshot is current. Local documents currently have `commit: null` in the generated index; bind them to the reviewed checkout/content hashes in the release record. Reject unreviewed dirty inputs or record their exact content rather than labelling them as an unmodified Git commit.
5. **Consistent live reads.** Before frequent targeted publishing, define revision-addressed collection/document URLs or a coordinated release check/invalidation strategy. Old tabs must either keep coherent retained content or deliberately refresh together. Preserve pan position, blooms, reading position and accepted motion; no polling/reload behavior is approved by this analysis.
6. **Visibility later.** One publication rule must cover grid, project menu, generated collections/docs, readable pages, sitemap and shared media. Removing a tile alone cannot revoke a published document. Decide shared assets and historical URL behavior before exposing an on/off switch.

### Admin work

1. Implement the actual `github` adapter with read and commit capabilities scoped to allowed repositories, branches and paths. Read original text and its GitHub revision/blob identity, retain draft/base/current versions, and reject conflicting edits. Secret storage already exists; it is not the missing GitHub client.
2. Add a portfolio content service and editor to `src/features/babuni-dev/`; consume the website's discovery contract rather than the Morkahja JSON schemas. Start read-only, then a DEVLOG edit/diff/commit flow. Show upstream revision, imported website revision, proposed draft and verified deployed revision separately.
3. Add a validated website build adapter/checkout policy. Current portfolio profiles do not allow `local-files`, so simply adding the existing Morkahja local-file profile is not a solution. Define explicit build capabilities and trusted tool entry points; do not accept arbitrary shell commands from the browser.
4. Extend `remote-publish` with server-owned destination policy: SSH identity/trust, deploy user, port, allowed release root, live URL, expected release, and allowed operations. The current hostname-only profile cannot express a usable release destination. Never attach unrelated database/site authority.
5. Stage a complete coherent static release (reusing unchanged validated outputs is possible later), verify hashes, atomically activate, check the publicly served release, and restore the previous release after failed verification. Keep attribution, explicit publishing authorization, failure status, retention and cleanup in the admin. Partial build means fewer regenerated outputs, not uncoordinated edits to live files.

## Practical implementation order and acceptance

| Slice | Website change | Admin change | Done when |
| --- | --- | --- | --- |
| Read-only portfolio browsing | Catalog/source-origin contract | Read adapter, project/module browser | Current catalog and sources display with real revisions; missing/disconnected state is honest; unknown project/path rejected |
| First reviewed DEVLOG edit | Targeted snapshot ingestion; full build may be used initially | Raw Markdown editor, diff and compare-and-set GitHub write | A conflicting upstream edit is preserved/rejected rather than overwritten; no generated text is committed as raw source |
| First end-to-end static release | Release manifest and artifact validation | Scoped build/publish adapter with recovery | Selected text appears in reader, blooms and readable pages at one verified release; failed staging/verification leaves or restores previous release |
| Admin Phase 3 target: no full Astro rebuild | Dependency builder + full-build parity tests + coherent cache strategy | Invoke targeted build and publish coherent release | DEVLOG change regenerates only necessary outputs; unchanged sources remain unchanged; old tabs do not mix revisions |
| Visibility controls | Central publication filtering and asset policy | Toggle/preview/review UI | Hidden material is absent from all intended public outputs, not only the grid |

Test denied paths/repositories, malicious file inputs, stale revisions, disconnected/keyring failures, shared document consumers, failed build/upload/activation, rollback and already-open tabs using disposable fixtures/staging. Only then perform explicitly authorized live publication. No existing CI or profile test proves this end-to-end route works today.

**Conclusion:** There is no architectural mismatch requiring a website rewrite. Both applications lack an implemented content-management contract; the largest immediate gaps are the admin's inactive transports/editor and the website's missing discovery/targeted-generation/release interfaces. Connecting only a URL or adding a public website API would not complete the intended system. The items above are an AI implementation proposal based on the requested analysis, not claims that these features have been built.

## Repeatable live measurement plan

Record the served release, time, browser/device, viewport, network and whether the cache is cold or warm. Take at least three independent runs of each condition and report the median and range rather than one score.

- Network: DNS/connect/TLS time, time to first byte, response and transferred bytes, compression, cache headers and repeat-load behavior for home, an image, collection JSON, reader document and readable project page.
- Browser: use a production browser trace or Lighthouse for initial rendering, largest contentful paint, layout shifts, main-thread work and request waterfall. Synthetic throttling is labelled simulation, not a physical phone test. Field responsiveness/Core Web Vitals require real usage data; a single laboratory run is not field evidence.
- Interactions: trace panning, shifts, opening small/big bloom and reader, then repeat after sustained use; inspect dropped frames, long tasks and memory growth separately from network loading. Preserve accepted motion while diagnosing.
- Release/search: check the intended revision, representative media/source links, robots/sitemap and actual indexing tools. Crawler availability does not establish ranking or indexing.

No live measurements or new browser/device checks were performed for this documentation change. Prior server header checks remain attributed to the operator in deploy/README.md.
