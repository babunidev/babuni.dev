#!/usr/bin/env bash
# One-time setup, run by Babuni as root on the server (it needs the admin password):
#   sudo bash /home/babunideploy/setup/install-screenshots-location.sh
# Installs the /screenshots/ nginx rule next to the existing snippets and includes it in the
# babuni.dev site. Keeps a backup of the site file and restores it if `nginx -t` fails.
# Running it again changes nothing.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
site=/etc/nginx/sites-available/babuni.dev
snippet=/etc/nginx/snippets/babuni-screenshots-locations.conf
line='    include snippets/babuni-screenshots-locations.conf;'
anchor='    include snippets/buttongame-locations.conf;'

[ "$(id -u)" = 0 ] || { echo "Run with sudo." >&2; exit 1; }
install -m 644 -o root -g root "$here/nginx-screenshots-locations.conf" "$snippet"
install -d -m 755 -o babunideploy -g babunideploy /var/www/babuni.dev/shared /var/www/babuni.dev/shared/screenshots

if ! grep -qF "$line" "$site"; then
  [ "$(grep -cF "$anchor" "$site")" = 1 ] || { echo "Expected one Button Game include line in $site; nothing changed." >&2; exit 1; }
  backup="$site.bak-$(date +%Y%m%d-%H%M%S)"
  cp -a "$site" "$backup"
  sed -i "s|^$anchor\$|$line\n$anchor|" "$site"
  if ! nginx -t; then cp -a "$backup" "$site"; echo "nginx -t failed; restored $site" >&2; exit 1; fi
  echo "Added the include line (backup: $backup)."
else
  nginx -t
fi
systemctl reload nginx
echo "Done: /screenshots/ is served from /var/www/babuni.dev/shared/screenshots/."
