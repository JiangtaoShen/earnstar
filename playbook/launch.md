# Launch and growth (P2–P4)

## Pre-launch checklist (every item must pass before any promotion)
- [ ] The README meets Constitution §7. A demo GIF or screenshot sits above the fold. Badges show only real signals (CI, license, version).
- [ ] The quick start works from a clean clone, using only the documented commands.
- [ ] Release `v0.1.0` or later, with notes. A package is published if applicable; its first publication goes through the outbox.
- [ ] The description carries the core keywords. The repo has 5–10 topics and a social preview image (1280×640).
- [ ] CI is green. LICENSE, CONTRIBUTING, issue and PR templates, and SECURITY.md are present.
- [ ] Dependabot alerts and secret scanning are enabled, and `THIRD_PARTY_NOTICES` is current.
- [ ] Any published package is listed under `packages` in `repos.json`, so download tracking starts on day one.
- [ ] Real good-first-issues are open, and known limitations are stated.
- [ ] AI disclosure is present. The repo is public.

## Channels (fixed for the program)
- **Hacker News (Show HN)**. The rules below were verified on 2026-09-24 (S008) against news.ycombinator.com/newsguidelines.html and /showhn.html.
  - **AI text**: the guidelines say "Don't post generated text or AI-edited text."
    - The developer therefore provides only a factual brief: what it is, how to try it, links, and known limitations.
    - The owner writes the title, the text, and every comment personally, without AI editing, and states in their own words that an AI agent built the project.
  - **Eligibility**: Show HN is for "something you've made that other people can play with". Reading material, explicitly including lists, is off topic. Users should be able to try it "ideally without barriers such as signups or emails".
  - **Title**: must begin with "Show HN". No uppercase or exclamation points for emphasis.
  - **Votes**: never ask anyone, friends included, to upvote or comment ("Don't solicit upvotes, comments, or submissions").
  - **Account use**: HN asks that it not be used "primarily for promotion". The owner's account should also take part in ordinary discussion.
- **Reddit**
  - The owner posts to 1–2 subreddits whose rules allow it, with text tailored to each subreddit. No cross-post spam.
  - **Access limit (verified in S008)**: Reddit is unreachable from the developer's environment. Unauthenticated API calls get HTTP 403, and the fetch tool, the built-in browser, and web search all block the domain.
  - The owner therefore checks the subreddit rules (self-promotion, AI content, flair, account age and karma), using the checklist in each package. The owner's screenshots provide the post's score and comment count.
- **Awesome lists**
  - One PR per list, through the outbox.
  - Only lists that are active (a merged PR within the last 90 days) and whose criteria the project meets.
  - Follow each list's CONTRIBUTING exactly.
- **Timing** (a common heuristic, unverified; see H-006): Tuesday to Thursday, 08:00–10:00 US Eastern, which is 20:00–22:00 Asia/Shanghai during US daylight time and 21:00–23:00 otherwise.
- **Reposts** follow each venue's own rules. Never post twice to the same venue within a week.

## Promotion packages (owner-approved workflow, S009)
The owner posts on both HN and Reddit. The developer prepares a complete package for each post and archives it; after posting, the owner sends screenshots as proof.
- **Location**: `history/promo/<project key>/`, with one folder per outbox item, e.g. `O-003-hn/` or `O-004-reddit-selfhosted/`. `history/promo/<project key>/README.md` indexes the items, their status, and their post URLs.
- **HN package**, following L-001: no ready-to-post prose.
  - `brief.md`: a fact sheet in bullet points (what it is, who it is for, how to try it in 60 s, what is novel, limitations, links, the AI-authorship fact), 2–3 title directions starting with "Show HN:", and facts for likely questions.
  - The owner writes the text and comments personally. HN posts carry no images, so the visuals must be in the README above the fold.
- **Reddit package**, only where the subreddit's rules allow it:
  - `draft.md`: title and body tailored to one subreddit, with the AI disclosure, plus facts for likely questions and a rules checklist for the owner (self-promotion, AI content, flair, account age and karma).
  - `images/`: the images to attach, captioned.
- **Images**:
  - Real screenshots, terminal GIFs, or diagrams of the actual project, produced reproducibly by a script in the project repo, and named in `images/README.md` with the command that made them.
  - PNG or GIF, under 10 MB.
  - Never mock-ups presented as real output (§3C).
- **Outbox item**: it links the package and gives the target URL and the recommended posting time in Asia/Shanghai.
- **After posting**:
  1. The owner puts the screenshots in `D:\earnstar\inbox\`, or pastes them in chat, together with the post URL.
  2. The developer registers the item in `history/channels.json` (`url`, `posted_utc`, `by: owner`, `promo`, `owner_minutes` if reported).
  3. The developer runs `node tools/evidence.mjs --item C-NNN <files>`. The screenshots go into private storage (`archive/promo/`) and their SHA-256 hashes are recorded publicly.
  4. The developer clears `inbox/`.
- **Metrics**:
  - HN items are snapshotted automatically.
  - Reddit items show `unavailable` in `metrics.mjs` (L-002). Readings taken from the owner's screenshots go into the item's `owner_reported` entries (read time, score, comments, source file).
- **Registration timing**: snapshot each item in every session for the first 7 days, then as usual.

## After launch
- **First 72 h**: check referrers and issues every session. Fix reported bugs within the session and cut a patch release.
- **Within 2 weeks**: ship a feature release that addresses the top feedback.
- **Second wave (optional, ≥ 3 weeks after launch)**: a major release may justify one post in a new, relevant subreddit.
- **Track**: stars per day, the unique-visitor-to-star conversion, and top referrers. Interpret them in the session log.

## Levers inside GitHub (autonomous)
- **README iteration**: log each change with its date and compare conversion before and after.
- **Discoverability**: keywords in the description and topics, for GitHub search.
- **Web search**: a GitHub Pages demo or docs site.
- **Releases**: each release appears in watchers' and followers' feeds.
- **Maintenance**: fast, courteous responses, and real good-first-issues to attract contributors.
