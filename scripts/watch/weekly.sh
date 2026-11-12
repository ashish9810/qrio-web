#!/bin/bash
# Weekly refresh of the watch pages and the Top 10 (runs on Ashish's Mac,
# Monday 09:00 IST, via ~/Library/LaunchAgents/in.qrioapp.watch-weekly.plist).
#
# 1. Transcribe reels that are new in the top 200 English reels.
# 2. Rebuild content/watch.json (also picks up new video URLs) and this week's Top 10.
# 3. If anything changed: build the site, commit, push (Vercel deploys), then IndexNow.
# New reels only get a page once they have a hand-written title and summary in
# content/watch-src/copy.json; how many are waiting is shown in a Mac notification.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
REPO="/Users/user/Documents/Claude/Projects/Explainer/qrio-web"
PY="/Users/user/.qrio-loader/bin/python"
cd "$REPO" || exit 1
echo "=== $(date) ==="

notify() { osascript -e "display notification \"$1\" with title \"Qrio watch pages\"" >/dev/null 2>&1; }

if ! git pull -q --ff-only origin main; then
  notify "Weekly refresh stopped: git pull failed (local changes?)"; exit 1
fi

"$PY" -W ignore scripts/watch/transcribe.py --top 200 || { notify "Transcription failed, see ~/.qrio/watch_weekly.log"; exit 1; }
"$PY" -W ignore scripts/watch/build_data.py || { notify "build_data failed"; exit 1; }
"$PY" -W ignore scripts/watch/top10.py || { notify "Top 10 failed"; exit 1; }
WAITING=$(python3 -c "import json;print(len(json.load(open('content/watch-src/needs_copy.json'))))")

if git diff --quiet -- content/watch.json content/top10 content/watch-src && \
   [ -z "$(git ls-files --others --exclude-standard content/top10 content/watch-src)" ]; then
  notify "No changes this week. $WAITING new reels need a title and summary."; exit 0
fi

if ! npm run build >/tmp/qrio_watch_build.log 2>&1; then
  git checkout -- content/watch.json content/top10 2>/dev/null
  notify "Site build failed, nothing published. See /tmp/qrio_watch_build.log"; exit 1
fi

git add content/watch.json content/top10 content/watch-src
git commit -q -m "Weekly watch pages and Top 10 ($(date +%Y-%m-%d))"
if ! git push -q origin main; then notify "Push failed, commit kept locally"; exit 1; fi

# Wait for Vercel (up to ~10 minutes), then tell IndexNow.
WEEK=$(python3 -c "import datetime;y,w,_=datetime.date.today().isocalendar();print(f'{y}-w{w:02d}')")
for i in $(seq 1 60); do
  [ "$(curl -sL -o /dev/null -w '%{http_code}' "https://www.qrioapp.in/top10/$WEEK")" = "200" ] && break
  sleep 10
done
node scripts/indexnow.mjs
notify "Published: watch pages and Top 10 updated. $WAITING new reels need a title and summary."
