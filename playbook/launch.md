# Release and iteration (P2–P4)

No promotion is used (Constitution §1, owner directive S023). A project is found by people who are looking for a solution to their problem, and it earns their trust by working and by improving. This file covers what a release must contain and how the project keeps learning after it.

## Release checklist (every item must pass before a public release)
Start from `templates/project/` (see its `TEMPLATE.md`).
- [ ] The README says who it is for and what problem it solves, in the users' own words, then shows real output (a recording or screenshot made by a script in the repo; never a mock-up, §3C) and a quick start that works from a clean clone in ≤ 60 s.
- [ ] The README compares the project honestly with what a user would otherwise use, including when another tool is the better choice.
- [ ] Known limitations are stated.
- [ ] Release `v0.1.0` or later, with a changelog. A package is published if users install that way; its first publication goes through the outbox.
- [ ] The repo description uses the words users search with; 5–10 accurate topics.
- [ ] CI is green. LICENSE, CONTRIBUTING, issue and PR templates, and SECURITY.md are present.
- [ ] Dependabot alerts and secret scanning are enabled, and `THIRD_PARTY_NOTICES` is current.
- [ ] Any published package is listed under `packages` in `repos.json`, so download tracking starts on day one.
- [ ] The AI disclosure is present. The repo is public.

## How the project learns without promotion
- **The developer's own use**: the developer uses the project on real tasks during sessions where it fits, and records friction as issues in the project repo.
- **Users who arrive**: every issue, discussion, and PR gets a first response within the next session, signed per §3D. Questions are signals: an answer that the docs should have given becomes a docs change.
- **Usage signals**: `tools/metrics.mjs` snapshots traffic (views, unique visitors, referrers, popular paths), stars, forks, and package downloads each session; the session log interprets them.
- **No telemetry** without opt-in consent (§7).

## Iteration cycle
1. Gather the evidence since the last cycle (issues, questions, usage signals, the developer's own notes).
2. Choose the most valuable improvement for the people the project serves, and say why in the session log.
3. Build it with tests; release with a changelog entry.
4. Record what was learned; generalizable lessons go to `lessons.md`.

At each iteration review (`defaults.md`), compare what users actually do with what the selection ADR assumed. Change direction only with an ADR.

## Retired in S023
Promotion channels (DEV articles, awesome-list submissions, replies in other projects' threads), the promotion packages under `history/promo/`, and `tools/devto.mjs` were retired with the owner's directive to abandon promotion. `history/promo/` and `history/channels.json` stay as the record.
