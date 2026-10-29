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

Publishing scope: all 42 current catalog projects and their existing connected public documentation are authorized for publication. A future visibility control must remove content from routes, sitemap, module JSON and generated documents as well as the grid; robots.txt is not access control. New repositories/private material are not implicitly imported.
