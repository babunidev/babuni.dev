#!/usr/bin/env bash
# Usage: scripts/publish-document.sh <path-in-repo> [--apply]
# Publishes one committed document from origin/main to the live site without an Astro build.
set -euo pipefail
path="${1:?usage: publish-document.sh <path> [--apply]}"
apply="${2:-}"
repo="babunidev/babuni.dev"
key="$HOME/.ssh/id_ed25519_babuni_deploy"
server="babunideploy@89.167.120.88"
remote="/var/www/babuni.dev"
ssh_cmd="ssh -i $key -o IdentitiesOnly=yes -o BatchMode=yes"

cd "$(dirname "$0")/.."
git fetch -q origin main
work="$(mktemp -d)"
agent_started=0
trap 'rm -rf "$work"; if [ "$agent_started" = 1 ]; then ssh-agent -k >/dev/null 2>&1 || true; fi' EXIT
if ! ssh-add -l 2>/dev/null | grep -q "babuni.dev deployment"; then
  [ -t 0 ] || { echo "SSH_KEY_NOT_LOADED: unlock the deployment key in your SSH agent first" >&2; exit 3; }
  eval "$(ssh-agent -s)" >/dev/null
  agent_started=1
  ssh-add "$key"
fi

previous="$($ssh_cmd -n "$server" "readlink $remote/current")"
echo "Live release: $previous"
mkdir -p "$work/site" "$work/out"
rsync -a --delete -e "$ssh_cmd" "$server:$remote/current/" "$work/site/"
git show "origin/main:$path" > "$work/source.md"
node --experimental-strip-types scripts/publish-document.mjs \
  --site "$work/site" --out "$work/out" --repo "$repo" --path "$path" --from "$work/source.md" >/dev/null

changed=0
echo "--- files this document feeds ---"
while IFS= read -r f; do
  if cmp -s "$work/site/$f" "$work/out/$f"; then echo "unchanged  $f"
  else echo "CHANGED    $f"; changed=$((changed+1)); fi
done < <(cd "$work/out" && find . -type f | sed 's|^\./||' | sort)

if [ "$changed" -eq 0 ]; then echo "Nothing to publish."; exit 0; fi
if [ "$apply" != "--apply" ]; then echo "Dry run: $changed file(s) would change. Add --apply to publish."; exit 0; fi

release="$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short origin/main)-doc"
echo "Creating release $release"
$ssh_cmd -n "$server" "cd $remote/releases && cp -al \"\$(readlink -f ../current)\" $release"
rsync -rt --chmod=F644,D755 -e "$ssh_cmd" "$work/out/" "$server:$remote/releases/$release/"
$ssh_cmd -n "$server" "cd $remote/releases/$release && printf '%s\n' $release > release.txt.tmp && mv -f release.txt.tmp release.txt && test -s index.html"
$ssh_cmd -n "$server" "cd $remote && ln -s releases/$release .current-$release && mv -Tf .current-$release current"
live="$(curl -fsS --max-time 20 "https://www.babuni.dev/release.txt?check=$(date +%s)")"
test "$live" = "$release"
echo "Published and verified: $release"
echo "Rollback: ssh ... 'cd $remote && ln -s $previous .rb && mv -Tf .rb current'"
