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
  - The owner therefore checks the subreddit rules (self-promotion, AI content, flair, account age and karma) and reports each post's score and comment count. The developer drafts from the owner's findings and from secondary sources.
- **Awesome lists**
  - One PR per list, through the outbox.
  - Only lists that are active (a merged PR within the last 90 days) and whose criteria the project meets.
  - Follow each list's CONTRIBUTING exactly.
- **Timing** (a common heuristic, unverified; see H-006): Tuesday to Thursday, 08:00–10:00 US Eastern, which is 20:00–22:00 Asia/Shanghai during US daylight time and 21:00–23:00 otherwise.
- **Outbox launch items** contain:
  - the exact target URL;
  - the factual brief (for HN) or draft text (for Reddit, where the subreddit allows it);
  - the recommended posting time in Asia/Shanghai;
  - facts for answering likely questions.
- **Reposts** follow each venue's own rules. Never post twice to the same venue within a week.
- **Registration**: when an item goes live, add it to `history/channels.json` (with the approving outbox ID, the URL, `posted_utc`, `by`, and `owner_minutes` if the owner reports it). Snapshot it in each session for the first 7 days, then as usual.
- **Reddit metrics**: `metrics.mjs` records Reddit items as `unavailable` (see the access limit above). The owner reports the score and comment count; the developer records them in the session log, labeled `owner-reported`, with the time the owner read them.

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
