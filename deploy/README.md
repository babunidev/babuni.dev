# Prepared production hosting — not deployed

Target: `https://www.babuni.dev`. Keep `arcanitebrothers.com`, its `/var/www/morkahja` directory, Node service and existing Nginx site unchanged. Babuni.dev is a static build; do not run the Astro development server publicly.

Babuni.dev deferred DNS/hosting work to the weekend. No configuration in this folder has been installed on the VPS. The template uses standard Nginx gzip and cache directives; live `nginx -t`, TLS and header verification remain required. Brotli is not assumed installed.

1. Create a new release directory under `/var/www/babuni.dev/releases/` and upload the complete contents of the reviewed `dist/` build. Never upload private keys, `.env`, source checkouts or node_modules.
2. Point `/var/www/babuni.dev/current` at that release. Keep the previous target for rollback; remove obsolete generated files by deploying a complete new directory rather than merging uploads.
3. Prepare a separate `babuni.dev` Nginx site from `nginx-babuni.dev.conf`. Confirm the IPv6 listen setting matches the server. Check `nginx -t` before a reload; a reload, not a reboot, applies the site. Do not replace the default or existing arcanitebrothers site.
4. On the agreed weekend, update ONLY the reviewed `www.babuni.dev` DNS records. Remove conflicting parking/CNAME records for that hostname. Inspect A and AAAA results: IPv6 must either reach this same site or be absent. Preserve email and unrelated DNS records. Apex `babuni.dev` is not silently redirected or reconfigured by this template.
5. Once DNS reaches the new site, obtain and install a certificate for `www.babuni.dev` using the already installed Certbot/Nginx setup, selecting only this hostname/site. Configure HTTP-to-HTTPS redirection and test renewal. Do not reuse the Arcanite Brothers certificate.
6. Check HTTPS, real 404 responses, all routes, media and existing Arcanite Brothers behavior. Verify gzip and cache headers, using a GET request (HEAD responses may not demonstrate compression):

```bash
curl -sS -D - -o /dev/null -H 'Accept-Encoding: gzip' https://www.babuni.dev/
curl -sS -D - -o /dev/null https://www.babuni.dev/_project-modules/lootfeed.json
curl -sS -D - -o /dev/null https://www.babuni.dev/projects/lootfeed/
```

Also verify the actual fingerprinted `/_astro/` script has long immutable caching, while HTML and stable-name module/document assets revalidate. Test no-JavaScript reading, small/big bloom, video playback and reader dismissal. Use a clean browser profile and throttled network for loading measurements. Record transferred bytes, TTFB, LCP and interaction/layout observations; artifact size or localhost speed is not a substitute.

7. After the live pages work, verify ownership in Google Search Console/Bing Webmaster Tools and submit `/sitemap.xml`. No search account access or submissions are performed by the build. Indexing is not guaranteed.

Rollback: return `current` to the previous release, validate Nginx and reload only if its configuration changed. Existing Arcanite Brothers remains independent. Server package maintenance and the earlier PXE/Rescue warning are separate from this site release; do not reboot into Rescue as a deployment step.

Publishing scope: all 41 current catalog projects and their existing connected public documentation are authorized for publication. A future visibility control must remove content from routes, sitemap, module JSON and generated documents as well as the grid; robots.txt is not access control. New repositories/private material are not implicitly imported.


## Access and update workflow — audit 2026-10-30

Current repository checks pass: 37 test files, content validation, static production build and 430 canonical/public-link checks. The registry audit of installed non-development dependencies reported zero known advisories at this time; it does not prove complete application or server security. Initial JS is approximately 120 KiB raw / 38 KiB gzip. These are local artifact checks; live delivery remains unmeasured.

The site is ready for deployment preparation, not already deployed or certified for the live server. Still required: a working SSH identity on this computer, hostname fingerprint verification, separate release-directory ownership, live Nginx syntax test, DNS A/AAAA validation, TLS/renewal, existing-site regression check and actual compressed/cache-header and loading measurements. The current user's `.ssh` directory contains known_hosts but no private key; no SSH login or server access was attempted. Do not paste credentials in chat or commit them.

**AI recommendation, not configured:** use a new SSH key with a dedicated deployment account scoped to Babuni.dev's release directory. An administrator performs the initial Nginx/HTTPS setup; routine file uploads need no general administrator rights and normally no Nginx restart. Unlock an encrypted key locally when needed. With a working authorized SSH connection, the agent can run approved deployment/inspection commands from this workspace subject to available network permissions. No agent needs to be installed on the VPS for this approach.

Routine release: build and validate the reviewed commit locally or in GitHub Actions; upload `dist/` into a new versioned release directory; switch the `current` link; check the live pages; retain a previous release for rollback. The production server serves static files continuously. It does not need repeated `git pull`, `npm install`, `npm run build` or `npm run dev` commands.

Current GitHub Actions only tests/builds. Optional future automation: a manually triggered deployment job, with a restricted deployment credential stored in GitHub's protected secret storage, a verified/pinned server host key and a chosen release commit. A later automatic-on-main deployment requires a separate decision; it is not silently enabled by this audit. Do not give a deployment job unrelated site/database permissions.

## Server access and maintenance update — creator-operated session, 2026-10-30

This updates the earlier access audit above; the earlier statements describe the state **before** this later session. Babuni verified the existing VPS host identity and established working, passphrase-protected ED25519 SSH access from Nobara Linux through a separate sudo-capable administrator account. Root password authentication remains restricted. The private key stays on Babuni's computer, not in this repository. **This is administrator access, not the separately scoped deployment account or agent/CI access proposed above.**

Babuni then completed an Ubuntu 26.04 package upgrade (55 upgrades, four newly installed packages, two phased updates deferred). The new kernel was installed but a reboot remained pending. Nginx, PostgreSQL and SSH were checked as active, and the existing Node.js API was online under PM2. Nginx was enabled at boot; PostgreSQL reported `enabled-runtime`, and the `ssh` service reported `disabled` (socket activation not yet checked). PM2 initially had a saved dump but no system-level PM2 startup unit. **Later verification:** Babuni executed the PM2-generated systemd startup command, which created and enabled `pm2-morkahja.service`, and successfully saved the live process list through `sudo -iu morkahja pm2 save`. Checks returned `pm2-morkahja.service: enabled`, `ssh.socket: enabled` and `active`, and `postgresql.service: enabled`. Nginx was previously verified enabled. Boot recovery is still untested until an actual reboot.

**Reboot result (later in session):** Babuni rebooted the VPS and successfully reconnected through SSH. Ubuntu reported version 26.04.1 LTS, kernel `7.0.0-42-generic` (new kernel active), zero immediately applicable updates, 9% memory use and 23.1% filesystem use. SSH recovery and kernel activation are verified. Later post-reboot checks showed Nginx, PostgreSQL, `ssh.socket` and `pm2-morkahja` all `active`. `sudo -iu morkahja pm2 list` showed `morkahja-api` `online`, zero restarts since boot and 57.6 MB of memory. This verifies service/process recovery, **not** public HTTP or application-functional responses. A recent Hetzner backup/snapshot has not been verified in the shared record. No babuni.dev static deployment, DNS/TLS changes, CI deployment, or direct AI server access was reported in this session. Preserve the existing unrelated website and API throughout deployment work.

## Shared VPS hostname change — creator-operated session, 2026-10-31

Babuni chose to change the Ubuntu host's machine name from `morkahja-alpha` to `babunidev`; the existing `morkahja` application account and Nginx site remain separate and unchanged. Before proceeding, the existing Arcanite Brothers website responded with HTTP 200 and `/etc/nginx/sites-enabled/` showed only the pre-existing `morkahja` site symlink. No babuni.dev vhost was created.

Cloud-init originally managed `/etc/hosts`, with `preserve_hostname: false` in the main and Hetzner cloud-init config. Babuni created `/etc/cloud/cloud.cfg.d/99-preserve-hostname.cfg` containing `preserve_hostname: true` and `manage_etc_hosts: false`, changed the old machine name to `babunidev` in `/etc/hosts`, and ran `sudo hostnamectl set-hostname babunidev`. `hostnamectl --static` returned `babunidev`. The existing SSH shell prompt had not refreshed at the time of that check; a fresh shell and post-reboot persistence check remain unverified. This change alone does not deploy the site, change DNS or certificates, nor establish dedicated deployment-user permissions.
