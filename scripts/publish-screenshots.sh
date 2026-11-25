#!/usr/bin/env bash
# Usage: scripts/publish-screenshots.sh
# Uploads public/screenshots/ (ignored by Git) to the server's media folder, which nginx serves at
# /screenshots/. Files already on the server are never overwritten or deleted. Afterwards every file
# in src/content/server-media.json is checked on the server by SHA-256, and one over HTTPS.
set -euo pipefail
key="${DEPLOY_KEY:-$HOME/.ssh/id_ed25519_babuni_deploy}"
server="babunideploy@89.167.120.88"
remote="/var/www/babuni.dev/shared/screenshots"
ssh_cmd="ssh -i $key -o IdentitiesOnly=yes -o BatchMode=yes"
cd "$(dirname "$0")/.."

node scripts/server-media.mjs update
[ -d public/screenshots ] && rsync -rt --ignore-existing --chmod=F644,D755 -e "$ssh_cmd" public/screenshots/ "$server:$remote/"

# Compare the manifest with what the server actually holds.
expected="$(mktemp)"; actual="$(mktemp)"; trap 'rm -f "$expected" "$actual"' EXIT
node -e 'const m=require("./src/content/server-media.json");for(const [u,r] of Object.entries(m))console.log(r.sha256+"  "+u.slice("/screenshots/".length))' | sort > "$expected"
$ssh_cmd -n "$server" "cd $remote && find . -type f -name '*.webp' -printf '%P\0' | xargs -0 -r sha256sum" | sort > "$actual"
missing="$(comm -23 "$expected" "$actual")"
if [ -n "$missing" ]; then echo "MISSING_OR_DIFFERENT on the server:" >&2; echo "$missing" | sed 's/^[a-f0-9]*  /  /' >&2; exit 2; fi
echo "Server holds all $(wc -l < "$expected") listed files with matching checksums."

first="$(head -n1 "$expected" | sed 's/^[a-f0-9]*  //')"
status="$(curl -s -o /dev/null -w '%{http_code} %{content_type}' "https://www.babuni.dev/screenshots/$first")"
echo "HTTPS check /screenshots/$first: $status"
[ "${status%% *}" = 200 ] || { echo "Not served yet: has deploy/install-screenshots-location.sh been run on the server?" >&2; exit 3; }
