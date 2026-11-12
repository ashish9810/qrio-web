#!/usr/bin/env python3
"""Build content/watch.json for the watch pages from the app's database.

Input:  published English reels (same ranking as transcribe.py), their
        transcripts (content/watch-src/transcripts) and hand-written titles and
        summaries (content/watch-src/copy.json, id -> {title, summary, topic}).
Output: content/watch.json, read by lib/watch.ts at build time.

A reel is only published as a page when it has a transcript of 40+ words AND
a hand-written title and summary in copy.json, so every page has real,
readable text (no thin or auto-generated pages). Reels that are new since the
last copy.json pass are listed in content/watch-src/needs_copy.json.

  ~/.qrio-loader/bin/python scripts/watch/build_data.py
"""
import json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from transcribe import ROOT, candidates, env  # noqa: E402

SRC = os.path.join(ROOT, "content", "watch-src")
TOPIC = {"business_strategy": "business", "startups": "startups", "geopolitics": "geopolitics",
         "tech": "tech-and-ai", "ai": "tech-and-ai", "history": "history", "finance": "finance",
         "science": "science", "philosophy": "ideas"}


def slugify(text, taken):
    s = re.sub(r"[^a-z0-9]+", "-", re.sub(r"['’]", "", text.lower())).strip("-")[:70].rstrip("-")
    base, n = s, 2
    while s in taken:
        s, n = f"{base}-{n}", n + 1
    taken.add(s)
    return s


def clean_transcript(t):
    t = re.sub(r"\s+", " ", t).strip()
    return t[0].upper() + t[1:] if t else t


def main():
    get = env()
    copy = json.load(open(os.path.join(SRC, "copy.json"))) if os.path.exists(os.path.join(SRC, "copy.json")) else {}
    reels = candidates(get, 160)
    ids = ",".join(r["id"] for r in reels)
    full = {r["id"]: r for r in get(f"reels?select=id,creator_id,video_url,thumb_url,caption,categories,duration_ms,width,height,published_at&id=in.({ids})")}
    creators = {c["id"]: c for c in get("creators?select=id,name,handle,avatar_url,instagram_url&limit=1000")}
    out, needs, taken = [], [], set()
    for r in reels:
        f = full.get(r["id"])
        tp = os.path.join(SRC, "transcripts", r["id"] + ".json")
        if not f or not os.path.exists(tp):
            continue
        text = clean_transcript(json.load(open(tp)).get("text", ""))
        if len(text.split()) < 40:
            continue
        c = copy.get(r["id"])
        if c and c.get("skip"):
            continue
        if not c:
            needs.append({"id": r["id"], "caption": (f["caption"] or "")[:300], "transcript": text[:900],
                          "categories": f["categories"]})
            continue
        cr = creators.get(f["creator_id"], {})
        topic = c.get("topic") or next((TOPIC[k] for k in (f["categories"] or []) if k in TOPIC), "business")
        out.append({
            "id": r["id"], "slug": slugify(c["title"], taken), "title": c["title"], "summary": c["summary"],
            "transcript": text, "topic": topic,
            "creator": {"name": cr.get("name") or "Qrio creator", "handle": cr.get("handle") or "",
                        "avatar": cr.get("avatar_url"), "instagram": cr.get("instagram_url")},
            "video": f["video_url"], "poster": f["thumb_url"],
            "posterSm": (f["thumb_url"] or "").replace("/thumbs/", "/thumbs-sm/"),
            "durationSec": round((f["duration_ms"] or 0) / 1000), "published": f["published_at"],
            "width": f["width"] or 1080, "height": f["height"] or 1920,
        })
    json.dump(out, open(os.path.join(ROOT, "content", "watch.json"), "w"), indent=1, ensure_ascii=False)
    json.dump(needs, open(os.path.join(SRC, "needs_copy.json"), "w"), indent=1, ensure_ascii=False)
    print(f"{len(out)} watch pages, {len(needs)} reels still need a title and summary")


if __name__ == "__main__":
    main()
