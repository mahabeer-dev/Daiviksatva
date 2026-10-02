#!/usr/bin/env bash
# Renders design/og-image.html to public/og-image.jpg (1200×630) and the favicon to
# public/apple-touch-icon.png (180×180) with headless Chrome.
# Override the browser with CHROME=/path/to/chrome if it isn't in the default macOS location.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=10000 \
  --screenshot="$TMP/og.png" "file://$PWD/design/og-image.html" >/dev/null 2>&1

# JPEG keeps the file small enough for WhatsApp's preview limit.
sips -s format jpeg -s formatOptions 82 "$TMP/og.png" --out public/og-image.jpg >/dev/null
# Home-screen icon from the SVG favicon.
printf '<html><body style="margin:0;background:#173A2E"><img src="file://%s/public/favicon.svg" width="180" height="180"></body></html>' "$PWD" > "$TMP/icon.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=180,180 --screenshot=public/apple-touch-icon.png "file://$TMP/icon.html" >/dev/null 2>&1

rm -rf "$TMP"
sips -g pixelWidth -g pixelHeight public/og-image.jpg | tail -2
ls -lh public/og-image.jpg | awk '{print "size:", $5}'
