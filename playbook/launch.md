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

## Channels (fixed for the program, S013)
Social promotion uses DEV only (owner decision, S013). The other outward channels are awesome-list PRs and GitHub's own discovery.

- **DEV (dev.to)**. Rules verified on 2026-09-24 (S012) against dev.to/guidelines-for-ai-assisted-articles-on-dev (L-003).
  - **Allowed**: AI-assisted and AI-generated articles, if they disclose it, either with the tag `#ABotWroteThis` or anywhere in the text. The program's standard disclosure line names Claude Code, and `tools/devto.mjs` refuses articles without it.
  - **Forbidden**:
    - bot or AI comments, on any post including our own, so the developer never comments; the owner may reply personally;
    - articles whose main purpose is building a brand, a social presence, or clout. Every article must teach something on its own (how it was built, a technique, benchmarks with method), with the project as the example rather than the pitch.
  - **Mechanics**: `tools/devto.mjs` publishes Markdown with DEV front matter (`title`, `published`, `tags` ≤ 4, `canonical_url`, `series`). It refuses unless the outbox item is `approved`, passes `tools/check.mjs`, and carries the disclosure. `--validate` runs all checks without publishing.
  - **Key**: the owner creates it at dev.to/settings/extensions ("DEV Community API Keys") and stores it as the user environment variable `DEVTO_API_KEY` with the command below, so it never appears in chat, logs, or history. The developer never sees or prints it. The owner can revoke it on the same page.
    `$k = Read-Host "DEV API key"; [Environment]::SetEnvironmentVariable('DEVTO_API_KEY', $k, 'User'); Remove-Variable k`
  - **Tags**: choose tags with active readerships that match the article, researched at the time of writing, and cite the evidence in the package.
- **Awesome lists**
  - One PR per list, through the outbox.
  - Only lists that are active (a merged PR within the last 90 days) and whose criteria the project meets.
  - Follow each list's CONTRIBUTING exactly.
  - Expect lists to require prior traction (a minimum age or star count; some reject brand-new projects), so plan them as follow-on channels after the launch burst, not as the ignition (L-009).
  - Some lists accept only human-made submissions (e.g., hesreallyhim/awesome-claude-code, through its web issue form). Such an item is queued with `Executed by: owner`, and the developer prepares the text.

## DEV article packages
- **Location**: `history/promo/<project key>/O-NNN-devto/`. `history/promo/<project key>/README.md` indexes the articles, their status, and their URLs.
- **Contents**:
  - `article.md`: the full article with front matter and the disclosure line.
  - `images/` if needed. Images can also be linked from the project repo (raw GitHub URLs).
- **Images**:
  - Real screenshots, terminal GIFs, or diagrams of the actual project, produced reproducibly by a script in the project repo, and named in `images/README.md` with the command that made them.
  - PNG or GIF, under 10 MB.
  - Never mock-ups presented as real output (§3C).
- **Workflow**:
  1. Validate: `node tools/devto.mjs post --item O-NNN --validate <article.md>`.
  2. Add the outbox item, linking the package.
  3. The owner approves it in chat; the developer marks it `approved`.
  4. Publish: `node tools/devto.mjs post --item O-NNN <article.md>`. The tool registers the article in `history/channels.json` (`by: developer`).
  5. Mark the outbox item `done`, with its `C-NNN` ID.
- **Metrics**: `metrics.mjs` snapshots every item in every session into `channels.csv`.
  - DEV items: with the key, own-article stats include page views; without it, only the public reaction and comment counts. A just-published article can briefly return a cached 404 from DEV's CDN (seen in S012); it resolves on its own.
  - Awesome-list PRs: state (`open`, `merged`, `closed`) and comment count.

## After launch
- **First 72 h**: check referrers and issues every session. Fix reported bugs within the session and cut a patch release.
- **Within 2 weeks**: ship a feature release that addresses the top feedback.
- **Second article (optional, ≥ 3 weeks after launch)**: a technical deep dive on DEV, within the cap in `defaults.md`.
- **Track**: stars per day, the unique-visitor-to-star conversion, top referrers (dev.to among them), and DEV views and reactions. Interpret them in the session log.

## Levers inside GitHub (autonomous)
- **README iteration**: log each change with its date and compare conversion before and after.
- **Discoverability**: keywords in the description and topics, for GitHub search.
- **Web search**: a GitHub Pages demo or docs site.
- **Releases**: each release appears in watchers' and followers' feeds.
- **Maintenance**: fast, courteous responses, and real good-first-issues to attract contributors.
