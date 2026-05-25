#!/usr/bin/env bash
# start-chrome-dev.sh — launch Chrome with remote debugging for the shared
# browser bridge (macOS / Linux).
#
# Opens Chrome with a DEDICATED profile (so it never disturbs your normal
# Chrome) and a DevTools port the agent's cdp.js connects to. Log into whatever
# sites you want the agent to see — the session persists in the profile dir.
#
# Usage:  ./start-chrome-dev.sh [PORT] [PROFILE_DIR]
set -euo pipefail

PORT="${1:-9222}"
PROFILE_DIR="${2:-.chrome-dev-profile}"
DIR="$(pwd)/$PROFILE_DIR"
mkdir -p "$DIR"

CANDIDATES=(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "google-chrome"
  "google-chrome-stable"
  "chromium"
  "chromium-browser"
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
)
CHROME=""
for c in "${CANDIDATES[@]}"; do
  if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME="$c"; break; fi
done
if [ -z "$CHROME" ]; then
  echo "Chrome/Chromium not found. Edit this script with your browser path." >&2
  exit 1
fi

echo "Launching Chrome on debug port $PORT"
echo "  profile: $DIR"
echo "  verify:  curl http://127.0.0.1:$PORT/json/version"

"$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$DIR" \
  --no-first-run \
  --no-default-browser-check \
  >/dev/null 2>&1 &

echo "Chrome started (pid $!). Leave it running; log into your sites."
