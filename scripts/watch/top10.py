#!/usr/bin/env python3
"""Weekly "Top 10 on Qrio": the most-watched reels of the last 7 days that have
a watch page, written to content/top10/<YYYY>-w<WW>.json (ISO week of the
Monday it is built). Run every Monday (routines/blog.md) after build_data.py.

Ranking: distinct viewers whose first view fell in the 7 days before the run
(reel_seen.first_seen_at), ties broken by total watch time.

  ~/.qrio-loader/bin/python scripts/watch/top10.py
"""
import collections, datetime as dt, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from transcribe import ROOT, env  # noqa: E402


def main():
    get = env()
    now = dt.datetime.now(dt.timezone.utc)
    since = (now - dt.timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")
    rows, off = [], 0
    while True:
        page = get(f"reel_seen?select=reel_id,watch_ms&first_seen_at=gte.{since}&limit=1000&offset={off}")
        rows += page
        if len(page) < 1000:
            break
        off += 1000
    watch = {r["id"]: r for r in json.load(open(os.path.join(ROOT, "content", "watch.json")))}
    viewers, ms = collections.Counter(), collections.Counter()
    for r in rows:
        if r["reel_id"] in watch:
            viewers[r["reel_id"]] += 1
            ms[r["reel_id"]] += r["watch_ms"] or 0
    top = sorted(viewers, key=lambda k: (viewers[k], ms[k]), reverse=True)[:10]
    year, week, _ = now.isocalendar()
    out = {"week": f"{year}-w{week:02d}", "built": now.isoformat(), "from": since[:10], "to": now.strftime("%Y-%m-%d"),
           "items": [{"id": k, "slug": watch[k]["slug"], "viewers": viewers[k]} for k in top]}
    d = os.path.join(ROOT, "content", "top10")
    os.makedirs(d, exist_ok=True)
    json.dump(out, open(os.path.join(d, out["week"] + ".json"), "w"), indent=1)
    print(out["week"], len(top), "reels")


if __name__ == "__main__":
    main()
