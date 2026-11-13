# Production Hosting — Deployed Release and Update Procedure

**Current snapshot (2026-11-01):** The first public HTTPS release was verified on 31 October. This guide contains both current update procedure and dated historical setup logs. The deployed revision must be checked before claiming that later changes on `main` are live. Browser performance, full media checks and external indexing remain separate work.

Target: `https://www.babuni.dev`. Keep `arcanitebrothers.com`, its `/var/www/morkahja` directory, Node service and existing Nginx site unchanged. Babuni.dev is a static build; do not run the Astro development server publicly.

**Status update, 2026-10-31:** Release `8e47ce5` is on the VPS via a separate Nginx site. Public `www` DNS points to the VPS; local and public HTTP returned 200. Certbot installed HTTPS and configured redirection; the observed HTTPS status is 200, HTTP redirects with 301, and simulated certificate renewals succeeded for both websites. The post-deployment regression check of the Arcanite Brothers HTTPS homepage returned 200. The existing API health endpoint also returned HTTP 200 via `https://arcanitebrothers.com/health`. The public homepage header check from Nobara returned HTTP 200 with `Content-Encoding: gzip`, `Vary: Accept-Encoding`, `Cache-Control: no-cache`, `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`. Fingerprinted CSS/JS, project JSON and HTML caching checks have since passed; the sitemap is publicly retrievable. Visual browser/media behavior remains to be verified. Brotli is not assumed installed.

## Routine release procedure

The initial setup, DNS and certificate steps have already been performed; repeat them only when there is an explicitly authorized infrastructure change. For a normal website update, build and validate the chosen revision, upload it as an isolated release, switch the symlink, run external smoke checks, and retain rollback capability.

1. Create a new release directory under `/var/www/babuni.dev/releases/` and upload the complete contents of the reviewed `dist/` build. Never upload private keys, `.env`, source checkouts or node_modules.
2. Point `/var/www/babuni.dev/current` at that release. Keep the previous target for rollback; remove obsolete generated files by deploying a complete new directory rather than merging uploads.
3. Prepare a separate `babuni.dev` Nginx site from `nginx-babuni.dev.conf`. Confirm the IPv6 listen setting matches the server. Check `nginx -t` before a reload; a reload, not a reboot, applies the site. Do not replace the default or existing arcanitebrothers site.
4. **Historical first-setup step (already completed on 2026-10-31):** update ONLY the reviewed `www.babuni.dev` DNS records. Remove conflicting parking/CNAME records for that hostname. Inspect A and AAAA results: IPv6 must either reach this same site or be absent. Preserve email and unrelated DNS records. Apex `babuni.dev` is not silently redirected or reconfigured by this template.
5. **Historical first-setup step (already completed on 2026-10-31):** once DNS reaches the new site, obtain and install a certificate for `www.babuni.dev` using the already installed Certbot/Nginx setup, selecting only this hostname/site. Configure HTTP-to-HTTPS redirection and test renewal. Do not reuse the Arcanite Brothers certificate.
6. Check HTTPS, real 404 responses, all routes, media and existing Arcanite Brothers behavior. Verify gzip and cache headers, using a GET request (HEAD responses may not demonstrate compression):

```bash
curl -sS -D - -o /dev/null -H 'Accept-Encoding: gzip' https://www.babuni.dev/
curl -sS -D - -o /dev/null https://www.babuni.dev/_project-modules/lootfeed.json
curl -sS -D - -o /dev/null https://www.babuni.dev/projects/lootfeed/
```

Also verify the actual fingerprinted `/_astro/` script has long immutable caching, while HTML and stable-name module/document assets revalidate. Test no-JavaScript reading, small/big bloom, video playback and reader dismissal. Use a clean browser profile and throttled network for loading measurements. Record transferred bytes, TTFB, LCP and interaction/layout observations; artifact size or localhost speed is not a substitute.

7. After the live pages work, verify ownership in Google Search Console/Bing Webmaster Tools and submit `/sitemap.xml`. No search account access or submissions are performed by the build. Indexing is not guaranteed.

Rollback: return `current` to the previous release, validate Nginx and reload only if its configuration changed. Existing Arcanite Brothers remains independent. Server package maintenance and the earlier PXE/Rescue warning are separate from this site release; do not reboot into Rescue as a deployment step.

Publishing scope: the checked-in catalog contains **42 project identities** (2026-11-01); I approved publication of the then-current collection on 2026-10-29. Later additions or changed external source material still require their own source and publication checks. A future visibility control must remove content from routes, sitemap, module JSON and generated documents as well as the grid; robots.txt is not access control. New repositories/private material are not implicitly imported.


## Access and update workflow — historical audit 2026-10-30

The following predeployment assessment predates the 31 October VPS installation. Its claims that deployment, SSH access, DNS and TLS were still pending are preserved as history and are **superseded** by later dated sections.

Current repository checks pass: 37 test files, content validation, static production build and 430 canonical/public-link checks. The registry audit of installed non-development dependencies reported zero known advisories at this time; it does not prove complete application or server security. Initial JS is approximately 120 KiB raw / 38 KiB gzip. These are local artifact checks; live delivery remains unmeasured.

The site is ready for deployment preparation, not already deployed or certified for the live server. Still required: a working SSH identity on this computer, hostname fingerprint verification, separate release-directory ownership, live Nginx syntax test, DNS A/AAAA validation, TLS/renewal, existing-site regression check and actual compressed/cache-header and loading measurements. The current user's `.ssh` directory contains known_hosts but no private key; no SSH login or server access was attempted. Do not paste credentials in chat or commit them.

**AI recommendation, not configured:** use a new SSH key with a dedicated deployment account scoped to Babuni.dev's release directory. An administrator performs the initial Nginx/HTTPS setup; routine file uploads need no general administrator rights and normally no Nginx restart. Unlock an encrypted key locally when needed. With a working authorized SSH connection, the agent can run approved deployment/inspection commands from this workspace subject to available network permissions. No agent needs to be installed on the VPS for this approach.

Routine release: build and validate the reviewed commit locally or in GitHub Actions; upload `dist/` into a new versioned release directory; switch the `current` link; check the live pages; retain a previous release for rollback. The production server serves static files continuously. It does not need repeated `git pull`, `npm install`, `npm run build` or `npm run dev` commands.

Current GitHub Actions only tests/builds. Optional future automation: a manually triggered deployment job, with a restricted deployment credential stored in GitHub's protected secret storage, a verified/pinned server host key and a chosen release commit. A later automatic-on-main deployment requires a separate decision; it is not silently enabled by this audit. Do not give a deployment job unrelated site/database permissions.

## Server access and maintenance update — creator-operated session, 2026-10-30

This updates the earlier access audit above; the earlier statements describe the state **before** this later session. At the time, I verified the existing VPS host identity and established working, passphrase-protected ED25519 SSH access from Nobara Linux through a separate sudo-capable administrator account. Root password authentication remains restricted. The private key stays on Babuni's computer, not in this repository. **This is administrator access, not the separately scoped deployment account or agent/CI access proposed above.**

Then I completed an Ubuntu 26.04 package upgrade (55 upgrades, four newly installed packages, two phased updates deferred). The new kernel was installed but a reboot remained pending. Nginx, PostgreSQL and SSH were checked as active, and the existing Node.js API was online under PM2. Nginx was enabled at boot; PostgreSQL reported `enabled-runtime`, and the `ssh` service reported `disabled` (socket activation not yet checked). PM2 initially had a saved dump but no system-level PM2 startup unit. **Later verification:** Babuni executed the PM2-generated systemd startup command, which created and enabled `pm2-morkahja.service`, and successfully saved the live process list through `sudo -iu morkahja pm2 save`. Checks returned `pm2-morkahja.service: enabled`, `ssh.socket: enabled` and `active`, and `postgresql.service: enabled`. Nginx was previously verified enabled. Boot recovery is still untested until an actual reboot.

**Reboot result (later in session):** At the time, I rebooted the VPS and successfully reconnected through SSH. Ubuntu reported version 26.04.1 LTS, kernel `7.0.0-42-generic` (new kernel active), zero immediately applicable updates, 9% memory use and 23.1% filesystem use. SSH recovery and kernel activation are verified. Later post-reboot checks showed Nginx, PostgreSQL, `ssh.socket` and `pm2-morkahja` all `active`. `sudo -iu morkahja pm2 list` showed `morkahja-api` `online`, zero restarts since boot and 57.6 MB of memory. This verifies service/process recovery, **not** public HTTP or application-functional responses. A recent Hetzner backup/snapshot has not been verified in the shared record. No babuni.dev static deployment, DNS/TLS changes, CI deployment, or direct AI server access was reported in this session. Preserve the existing unrelated website and API throughout deployment work.

## Shared VPS hostname change — creator-operated session, 2026-10-31

At the time, I chose to change the Ubuntu host's machine name from `morkahja-alpha` to `babunidev`; the existing `morkahja` application account and Nginx site remain separate and unchanged. Before proceeding, the existing Arcanite Brothers website responded with HTTP 200 and `/etc/nginx/sites-enabled/` showed only the pre-existing `morkahja` site symlink. No babuni.dev vhost was created.

Cloud-init originally managed `/etc/hosts`, with `preserve_hostname: false` in the main and Hetzner cloud-init config. At the time, I created `/etc/cloud/cloud.cfg.d/99-preserve-hostname.cfg` containing `preserve_hostname: true` and `manage_etc_hosts: false`, changed the old machine name to `babunidev` in `/etc/hosts`, and ran `sudo hostnamectl set-hostname babunidev`. `hostnamectl --static` returned `babunidev`. The existing SSH shell prompt had not refreshed at the time of that check; a fresh shell and post-reboot persistence check remain unverified. This change alone does not deploy the site, change DNS or certificates, nor establish dedicated deployment-user permissions.

## Website deployment-directory preparation — 2026-10-31

After the existing `arcanitebrothers.com` site returned HTTP 200, I examined the sole enabled Nginx site, `morkahja`. It serves `/var/www/morkahja` and proxies selected API paths to `127.0.0.1:3000`, with its existing certificate and redirects. **The existing site file was not changed.** The babuni.dev Nginx template remains repository-only and uninstalled.

At the time, I created `/var/www/babuni.dev/releases` and created/verified a separate `babunideploy` account (UID/GID 1002, groups `babunideploy` and `users`, no sudo group reported, home `/home/babunideploy`). A `sudo chown babunideploy:babunideploy` command was run on the new site directory and releases directory without errors. **Ownership now verified:** `ls -ld /var/www/babuni.dev /var/www/babuni.dev/releases` returned `drwxr-xr-x` (755) and `babunideploy babunideploy` on both paths. SSH keys for this new account, static upload, release link, Nginx enablement, DNS and TLS are still pending. The existing web and API service must remain unaffected.

**Dedicated SSH access verified (later in session):** At the time, I created a new passphrase-protected ED25519 deployment key locally, transferred only its public key by administrator SCP, created `/home/babunideploy/.ssh` (700) and installed `/home/babunideploy/.ssh/authorized_keys` (600), both owned by `babunideploy`. Logging in over SSH as `babunideploy` using the dedicated private key and `IdentitiesOnly=yes` succeeded. This is separate from the `babuni` administrator key. **Creator-verified write access:** From the `babunideploy` SSH shell, `whoami && test -w /var/www/babuni.dev/releases && echo "Deployment directory writable"` returned `babunideploy` and `Deployment directory writable`. The dedicated account can write the planned release directory without sudo. No source files, site build, `current` symlink or Nginx configuration have been deployed yet.

## First release on the VPS — 2026-10-31

the creative's main Nobara checkout contained uncommitted editorial changes, so the assistant proposed an isolated Git worktree for the release. the creative fetched GitHub, fast-forwarded eight documentation commits, then checked out the committed `origin/main` state as a detached release worktree at `8e47ce5`, leaving local content edits untouched. Node.js 24.18.0 and npm 11.16.0 were present. `npm ci` installed 186 packages with no reported vulnerabilities; `npm run build` completed, generated 430 pages, validated 430 canonical public URLs and prepared 336 documents/41 module collections. `npm run test:grid` passed 191/191 tests.

As `babunideploy`, the creative uploaded the checked release's `dist/` with rsync to `/var/www/babuni.dev/releases/8e47ce5/` (total source size 21,105,375 bytes). A remote `test -s .../index.html` returned confirmation. The symlink `/var/www/babuni.dev/current -> releases/8e47ce5` was created successfully.

As the separate `babuni` administrator, the creative transferred and installed the checked-in `deploy/nginx-babuni.dev.conf` at `/etc/nginx/sites-available/babuni.dev`, linked it into `sites-enabled`, received a successful `nginx -t`, and ran `sudo systemctl reload nginx` without error. A request to local Nginx using `Host: www.babuni.dev` returned **HTTP 200**. The pre-existing `morkahja` configuration was not edited.

**Not yet verified:** the public A, AAAA and CNAME records for `www.babuni.dev`, external reachability, HTTPS certificate installation and renewal, live page/media/browser behavior, caching headers and a fresh regression check of Arcanite Brothers after the Nginx reload. Local HTTP 200 does not establish a complete public launch. Keep release `8e47ce5` for rollback until a subsequent deployment is independently verified.

## DNS and HTTPS activation — 2026-10-31

At the time, I configured a `www` DNS A record for the existing Hetzner server at Porkbun. Public DNS returned the intended address, no AAAA result, and the site's HTTP response was 200. The root domain parking record was left unchanged.

At the time, I ran Certbot for `www.babuni.dev` using the Nginx integration and requested HTTPS redirection. Certbot reported successful issuance and deployment of a Let's Encrypt certificate expiring 2027-01-29, and configured automatic renewal. Independent HTTPS/redirect validation, a renewal dry run, browser/content checks and regression checks for the existing hosted website remain outstanding. The current public release is `8e47ce5`; the creative's local editorial changes remain excluded.

**HTTPS, redirect and renewal verification:** From the VPS, `curl` returned `HTTPS: 200` and `HTTP: 301 -> https://www.babuni.dev/`. the creative ran `sudo certbot renew --dry-run`; Certbot reported simulated renewal **success for both** `www.babuni.dev` and the existing Arcanite Brothers certificate. A subsequent `curl` request to `https://arcanitebrothers.com/` returned HTTP 200 after the new site's Nginx and Certbot changes. The separate backend health request to `https://arcanitebrothers.com/health` also returned HTTP 200. The separate nonexistent route `https://www.babuni.dev/__deployment-404-test` returned HTTP 404. A later gzip-enabled homepage request from Nobara returned HTTP 200 and the expected gzip, HTML revalidation, MIME-sniffing and referrer-policy response headers. The prior SSH connection reset after a long session, but the public website remained reachable. Asset-specific cache checks and browser/media verification remain outstanding. This verifies renewal simulation, not a future unattended renewal.

## Production asset and sitemap response checks — 2026-10-31

After reconnecting over SSH, the creative tested individual resources through the public HTTPS domain. A fingerprinted CSS file and the homepage JavaScript file both returned HTTP 200, correct CSS/JavaScript content types, and `Cache-Control: public, max-age=31536000, immutable`, as intended for versioned assets. The `/_project-modules/lootfeed.json` resource returned HTTP 200 with `application/json`, 19,676 bytes and `Cache-Control: no-cache`. The `/projects/lootfeed/` page returned HTTP 200 with `text/html`, 8,063 bytes and `Cache-Control: no-cache`. The `/sitemap.xml` file returned HTTP 200, `text/xml` and 32,721 bytes. These tests do not establish sitemap correctness, browser rendering or the behavior of every page/media element. The live release remains `8e47ce5`, regardless of subsequent source-repository commits.

## Authenticated activity refresh — 2026-11-01

Production `npm run build` now requires fresh activity from every connected public repository. It stops before Astro builds if authentication is absent or any date cannot be fetched. A failed refresh leaves both activity caches unchanged. Do not upload an old dist directory after a build failure; keep the previously deployed release active.

On Nobara, the build automatically reuses your existing github.com GitHub CLI login. If you are not logged in, run this once interactively (do not paste tokens into chat or source):

```bash
gh auth login --hostname github.com
```

Then use the existing reviewed release procedure: fetch the published main revision, build/test it in an isolated worktree, upload its completed dist and switch current only after success. No manual token export is needed when local gh login works. A preconfigured GITHUB_TOKEN or GH_TOKEN takes precedence; invalid credentials stop the production build rather than silently falling back to anonymous requests.

GitHub Actions now explicitly passes its built-in `secrets.GITHUB_TOKEN` to the build step, with the existing read-only contents permission. This authenticates activity requests but **does not add server deployment**. Local dev/test commands remain offline. Standalone non-strict activity sync can retain cached values for diagnosis; the production prebuild always selects --require-fresh.

HTTP error diagnostics include rate-limit exhaustion, reset time and numeric retry delay when provided. No automatic repeated requests are made after a failure. The old 403 output did not preserve sufficient headers to prove the historical cause. Real local verification refreshed 36/36 sources using existing authentication; this is not proof of a new hosted release.

**Verified locally and in GitHub Actions:** Revision 8b99d19 passed [run 41257743014](https://github.com/babunidev/babuni.dev/actions/runs/41257743014): 36/36 authenticated activity reads, 197 passing tests and 442 public URL checks. The local testing checkout also completed a strict 36/36 refresh and restarted successfully. Existing manual release commands continue to work using the local GitHub CLI login; the VPS is not updated until that release procedure is run.
