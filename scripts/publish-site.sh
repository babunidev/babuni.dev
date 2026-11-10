#!/usr/bin/env bash
# Usage: scripts/publish-site.sh [--apply]
# Builds committed origin/main in a temporary worktree, compares it with the live site
# and publishes only the files that differ, as a hard-linked release.
set -euo pipefail
apply="${1:-}"
key="$HOME/.ssh/id_ed25519_babuni_deploy"
server="babunideploy@89.167.120.88"
remote="/var/www/babuni.dev"
ssh_cmd="ssh -i $key -o IdentitiesOnly=yes -o BatchMode=yes"

cd "$(dirname "$0")/.."
repo="$PWD"
git fetch -q origin main
work="$(mktemp -d /tmp/babuni-site-XXXXXX)"
agent_started=0
cleanup() {
  git -C "$repo" worktree remove --force "$work/site" >/dev/null 2>&1 || true
  rm -rf "$work"
  if [ "$agent_started" = 1 ]; then ssh-agent -k >/dev/null 2>&1 || true; fi
}
trap cleanup EXIT
if ! ssh-add -l 2>/dev/null | grep -q "babuni.dev deployment"; then
  [ -t 0 ] || { echo "SSH_KEY_NOT_LOADED: unlock the deployment key in your SSH agent first" >&2; exit 3; }
  eval "$(ssh-agent -s)" >/dev/null; agent_started=1; ssh-add "$key"
fi

commit="$(git rev-parse --short origin/main)"
previous="$($ssh_cmd -n "$server" "readlink $remote/current")"
echo "Building origin/main $commit; live release: $previous"
git worktree add -q --detach "$work/site" origin/main
(cd "$work/site" && npm ci --silent && NODE_OPTIONS=--no-network-family-autoselection npm run build >"$work/build.log" 2>&1) \
  || { echo "BUILD_FAILED" >&2; tail -n 20 "$work/build.log" >&2; exit 4; }
echo "Build finished: $(find "$work/site/dist" -type f | wc -l) files"

mkdir -p "$work/live"
rsync -a -e "$ssh_cmd" "$server:$remote/current/" "$work/live/"
python3 scripts/keep-live-bundle.py "$work/live" "$work/site/dist"
{ diff -rq "$work/live" "$work/site/dist" --exclude=release.txt || true; } \
  | sed -E "s#^Files $work/live/(.*) and .* differ\$#CHANGED  \1#; s#^Only in $work/site/dist/?(.*): (.*)\$#ADDED    \1/\2#; s#^Only in $work/live/?(.*): (.*)\$#REMOVED  \1/\2#" \
  | sed 's#  /#  #; s#//#/#' | sort > "$work/changes.txt"
echo "--- changes ---"
cat "$work/changes.txt"
count="$(wc -l < "$work/changes.txt")"
if [ "$count" -eq 0 ]; then echo "Nothing to publish."; exit 0; fi
if [ "$apply" != "--apply" ]; then echo "Dry run: $count path(s) differ. Add --apply to publish."; exit 0; fi

release="$(date +%Y%m%d-%H%M%S)-$commit-site"
echo "Creating release $release"
$ssh_cmd -n "$server" "cd $remote/releases && cp -al \"\$(readlink -f ../current)\" $release"
rsync -rt --delete --exclude=release.txt --chmod=F644,D755 -e "$ssh_cmd" "$work/site/dist/" "$server:$remote/releases/$release/"
$ssh_cmd -n "$server" "cd $remote/releases/$release && printf '%s\n' $release > release.txt.tmp && mv -f release.txt.tmp release.txt && test -s index.html"
$ssh_cmd -n "$server" "cd $remote && ln -s releases/$release .current-$release && mv -Tf .current-$release current"
live="$(curl -fsS --max-time 20 "https://www.babuni.dev/release.txt?check=$(date +%s)" || true)"
if [ "$live" != "$release" ]; then
  $ssh_cmd -n "$server" "cd $remote && ln -s $previous .rb-$release && mv -Tf .rb-$release current"
  echo "VERIFY_FAILED: live site reported '${live:-nothing}'; switched back to $previous" >&2
  exit 5
fi
echo "Published and verified: $release"
echo "Rollback: ssh ... 'cd $remote && ln -s $previous .rb && mv -Tf .rb current'"
