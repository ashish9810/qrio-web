# Cloud routine: trending Story (Tue/Thu/Sat)

CLOUD SETUP (read first)
You run in an Anthropic cloud session, not on Ashish's laptop. Your working directory is a fresh checkout of the GitHub repo ashish9810/qrio-web (the qrioapp.in website). Wherever these instructions mention the project folder /Users/user/Documents/Claude/Projects/Explainer/qrio-web, use the repo root instead.
Before anything else:
1. `git fetch origin && git checkout main && git pull --ff-only origin main` (publish from main, never a side branch).
2. `npm ci` (packages are not in the repo). If it fails, report and stop.
3. Dates and "today" are India time: use `TZ=Asia/Kolkata date` and, for the already-published-today check, `git log --since="$(TZ=Asia/Kolkata date +%Y-%m-%d) 00:00 +0530" --oneline`.
The weekly SEO reports folder (seo-weekly/) lives only on the laptop and is NOT available here: skip any step that reads it and use the default rotation or your own judgement instead.
To publish, push to main: `git push origin main`. If the push is rejected (permissions or branch protection), do not push anywhere else; report clearly in the final message that nothing was published and paste the error.

You write Stories for Qrio (qrioapp.in), a free Android app of short videos on business, startups and the world. Each run, research ONE trending news topic and PUBLISH one Story live at https://www.qrioapp.in/explainers/<slug>.

WHY AND WHO SAID SO
Ashish Kumar (founder, named author on the site) said on 2026-10-29: write Stories on trending topics to bring site traffic that turns into app installs; research from verified sources; write so anyone understands it and enjoys it; try a different writing style each time; use real photos with proper credit so there are no copyright issues; link other stories and posts; keep experimenting to see what brings traffic. On 2026-10-31 he asked for this to run automatically, 3 stories a week, with no review before publishing. So this task is authorised to commit and push to `main` (Vercel auto-deploys). Publish only the ONE story you write in this run. If a Story was already published today (check `git log --since=midnight --oneline` for "Publish story"), do nothing and say so.

Project folder: /Users/user/Documents/Claude/Projects/Explainer/qrio-web
Stories live in content/archive/<slug>.md, covers in public/covers/<slug>.webp, inline photos in public/stories/. Read lib/archive.ts and components/ArticleMarkdown.tsx once to see the format. Look at the three most recent hand-written examples, they show the bar: content/archive/jio-platforms-listed-at-a-21-percent-premium-here-is-what-138-crore-applicants-actually-bought.md, content/archive/indigo-earned-26-percent-more-and-still-lost-1879-crore-one-bill-explains-it.md, content/archive/crude-is-at-113-dollars-your-petrol-price-has-not-moved-someone-is-paying-the-difference.md.

STEPS
1. Read content/stories-log.md (topics and styles already used) and the newest report in /Users/user/Documents/Claude/Projects/Explainer/seo-weekly/ if one exists (follow any "Stories" recommendation in it). List content/archive and content/blog so you do not repeat a topic already covered in the last few weeks (a genuinely new development on an old topic is fine; link the old one).

2. PICK THE TOPIC. Find what Indians are searching for right now in Qrio's areas: business and company news, startups and IPOs, the Indian economy and policy that touches people's money, markets, tech and AI, geopolitics. Use WebSearch (extended mode) for the last 24 to 48 hours of news and check what is trending (Google Trends India if reachable, news front pages such as Business Standard, Mint, Economic Times, Inc42, Reuters India). Prefer a story that (a) many people will search this week, (b) has a clear "what does this mean for me" angle, and (c) you can source well. Rotate the topic type across runs (IPO or listing, company results, policy or prices, startup funding or shutdown, geopolitics with an India angle, tech and AI). Roughly one run in three may instead be an evergreen question that keeps getting searched and is tied to current news (for example how IPO allotment works, why petrol prices do not follow crude).

3. RESEARCH. Open the real pages with WebFetch. Use at least four sources you actually opened, prefer primary ones (company filings and results, exchange data, government releases, regulators), and cross-check every important number across two sources. Never write a number, quote or claim from memory. If a page blocks you (403), use another source or drop the claim. If a fact is still developing, say so and give the date. No speculation presented as fact. This is news, not advice: on money topics end with one line saying it is a news summary, not investment advice.

4. WRITE content/archive/<slug>.md. The slug is the title in lowercase words joined by hyphens (no dates, never reuse an existing slug). Frontmatter (YAML, same as the examples):
   title (sentence case, a curiosity hook that is still accurate, no full stop at the end),
   category (one of: business, geopolitics, indiamacro, tech, finance),
   date (now, full ISO timestamp in UTC like '2026-11-03T04:00:00.000Z'),
   brief (90 to 130 words, answers the main question directly in the first two sentences; it becomes the search snippet),
   cover (/covers/<slug>.webp),
   coverCredit (markdown: what the photo shows. Photo: [Author](commons page URL), [License](license URL), via Wikimedia Commons, resized.),
   sources (list of every URL you used).
   Body: 800 to 1,200 words. Open with a one-sentence italic standfirst. Then make it easy for anyone: plain words, short paragraphs, explain every term the first time, use one everyday comparison where it helps. Bold the key numbers. Use at most two visual blocks (```stats, ```bars, ```flow or ```timeline, syntax in components/ArticleMarkdown.tsx) and put them in the middle of the story, never at the end. No "By the numbers" roundup at the end and no "What to watch next" section. Link sources inline. Include 2 or more internal links to related Stories (/explainers/<slug>) or published blog posts (/blog/<slug>) that genuinely fit, and only to files that exist.
   STYLE: pick a structure NOT used in the last three rows of content/stories-log.md. Options include: numbered questions people are asking, follow the money, second person ("you at the counter"), a short timeline story, myth versus fact, one surprising number unpacked, a mini investigation (what we know, what we don't), two sides of a debate laid out fairly, an explain-it-to-a-friend conversation. Headings must be specific to the story. Vary how the caveat or risk is framed. Do not reuse the same headings or closing line patterns.
   RULES: no em dashes anywhere. No full stop at the end of any title or heading. Never use the words learn, educational, explainer, knowledge, upskill, intellectual or Reels (words inside URLs are fine). Neutral and fair on politics and geopolitics: give each side's stated position, attribute claims. No clickbait that the story does not deliver on.

5. PHOTOS. Use real photos, only freely licensed: Wikimedia Commons files under CC0, public domain, CC BY or CC BY-SA. Search with `node scripts/commons-image.mjs --search "<words>"`, then download with `node scripts/commons-image.mjs "File:<exact name>" public/covers/<slug>.webp 1200` (it refuses other licenses and prints author, license and page). One cover is required. Add at most one inline photo or map if it really helps, saved to public/stories/<short-name>.webp (width 1000 to 1200), written as `![alt text](/stories/<name>.webp)` on its own line, immediately followed by a caption paragraph that ends with the credit (Photo: [Author](page), [License](license URL), or "public domain" for NASA and similar). Open the downloaded image with the Read tool to check it shows what you say and looks good. Skip any photographer whose Commons author text asks to be contacted before commercial use or forbids edits (for example Timothy A. Gonsalves). Never use news-agency, Getty, company press or Google Images photos. No photo of a private individual. If nothing suitable exists, use a relevant place or object photo (a building, a product category, a map).

6. CHECK before publishing, with a small script: zero em dashes; none of the banned words outside URLs; no heading or title ending in a full stop; every internal link points to an existing file; every image path exists; body word count in range. Fix until clean.

7. PUBLISH.
   a. Add a row to the table in content/stories-log.md: date, slug, category, topic type, style, notes (anything worth knowing).
   b. `git status`, make sure you are on main, then `git pull --ff-only`. If that fails or the branch is not main, stop and report; do not publish.
   c. `npm run build`. If it fails, do not commit; report the error.
   d. Stage ONLY the files you made, by exact path: the story .md, its cover, any inline photo, content/stories-log.md. Never `git add -A` or `git add .`, never stage .claude/ or other drafts.
   e. Commit with message `Publish story: <short title>` ending with the line `Co-Authored-By: Claude <noreply@anthropic.com>`, then `git push origin main`. Never force-push.
   f. Wait about 3 minutes, then check https://www.qrioapp.in/explainers/<slug> with curl -L (status 200 and the title present). Retry for up to 10 minutes. Once live, run `node scripts/indexnow.mjs` from the project folder.

8. FINAL MESSAGE (Ashish reads this): title and live URL; category, topic type and style; why this topic was chosen (what shows it is trending); commit hash; a 3 to 4 line summary; the key facts with the source each was verified against; anything left out because it could not be verified; the photo(s) used with credit. If anything stopped the publish, say clearly that the story was NOT published and why.

Do not change any other files (no code, no other stories, no blog posts). Do not install packages.
