#!/usr/bin/env python3
"""Transcribe Qrio reels for the watch pages (qrioapp.in/watch/...).

Picks published English reels (best first by reel_quality), transcribes their
audio with faster-whisper "base" on this Mac (free, offline), and caches each
transcript in content/watch-src/transcripts/<reel_id>.json so reruns only do
new reels. Run with ~/.qrio-loader/bin/python (has faster-whisper).

  transcribe.py [--top 160]
"""
import argparse, json, os, re, subprocess, sys, tempfile
import requests

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "content", "watch-src", "transcripts")


def env():
    for l in open(os.path.expanduser("~/.qrio/loader.env")):
        m = re.match(r"\s*(?:export\s+)?([A-Z0-9_]+)=(.*)", l)
        if m:
            os.environ.setdefault(m.group(1), m.group(2).strip().strip("'\""))
    u = os.environ["SUPABASE_URL"].rstrip("/") + "/rest/v1/"
    k = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    h = {"apikey": k}
    if not k.startswith("sb_secret_"):
        h["Authorization"] = "Bearer " + k
    return lambda p: requests.get(u + p, headers=h, timeout=60).json()


def candidates(get, top):
    reels = get("reels?select=id,video_url,language,views_count,status&status=eq.published&limit=5000")
    q = {r["reel_id"]: r for r in get("reel_quality?select=*&limit=5000")}
    reels = [r for r in reels if (r.get("language") or "en") == "en"]
    def score(r):
        x = q.get(r["id"])
        # Real watch data only (reel_quality comes from reel_seen). reels.views_count
        # and likes_count include seeded dummy numbers, so they are never used here.
        quality = (x["completion"] * 0.6 + (1 - x["skip_rate"]) * 0.4) if x and x["viewers"] >= 3 else 0.3
        return quality + min(x["viewers"] if x else 0, 60) / 600
    reels.sort(key=score, reverse=True)
    return reels[:top]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=160)
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    get = env()
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cpu", compute_type="int8", cpu_threads=4)
    reels = candidates(get, a.top)
    print(len(reels), "candidates", flush=True)
    for n, r in enumerate(reels, 1):
        path = os.path.join(OUT, r["id"] + ".json")
        if os.path.exists(path):
            continue
        with tempfile.TemporaryDirectory() as tmp:
            wav = os.path.join(tmp, "a.wav")
            p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", r["video_url"], "-vn", "-ac", "1",
                                "-ar", "16000", wav], capture_output=True)
            if p.returncode or not os.path.exists(wav):
                json.dump({"id": r["id"], "text": "", "error": "no audio"}, open(path, "w"))
                continue
            segs, info = model.transcribe(wav, language="en", vad_filter=True, beam_size=1)
            text = " ".join(s.text.strip() for s in segs).strip()
        json.dump({"id": r["id"], "text": text, "lang_prob": round(info.language_probability, 2)},
                  open(path, "w"), ensure_ascii=False)
        print(f"[{n}/{len(reels)}] {r['id'][:8]} {len(text.split())} words", flush=True)


if __name__ == "__main__":
    main()
