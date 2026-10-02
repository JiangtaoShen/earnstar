# ADR-005: Start from people's real needs, iterate, and use no promotion

- **Date / session**: 2026-10-03 / S023 (admin)
- **Status**: accepted
- **Approved by**: owner, in chat: "Abandon promotion. You must think from the human perspective about what users actually need. Keep iterating and accumulating experience. This is the most important thing. Your direction is a bit off; revise the outline and start over." [translated]

## Context
From S016 to S022 the program selected project 1 by studying how repositories earn stars: base rates, launch channels, platform waves, and the forms of past winners. Every lead (about ten candidates, three draft ADRs) was knocked out by independent critiques, mostly because the same idea had already been built several times without success, and the research concluded that outcomes depended on promotion channels the program lacked (`history/research/earnstar_1/channel-memo.md`). When the developer asked the owner to choose promotion channels, the owner rejected the premise: good projects do not depend on promotion; the developer should start from what people actually need, release early, and improve continuously.

## Decision
1. **No promotion** of any kind (Constitution §1, §3B): no social posts, article series, list submissions, or replies in other projects' threads that point to a program project. DEV publishing (`tools/devto.mjs`) and channel tracking are retired; outbox item O-001 is withdrawn.
2. **People first**: P0 becomes "Understand people". Selection starts from a group of people the developer can understand and serve, and from their needs in their own words, with evidence from several independent people; the existing solutions are tried; a prototype is tried on realistic tasks (`playbook/research.md`, rewritten).
3. **Release early and iterate**: P3 is a release, P4 is iteration in short cycles from users' evidence and the developer's own use, with an iteration review every 14 days (`playbook/launch.md`, `playbook/defaults.md`).
4. **Accumulate experience**: each iteration records what it taught; lessons that generalize go to `playbook/lessons.md`.
5. **Stars stay the measure, not the target**: the objective's metric is unchanged (stars at close, +30 d, +90 d), but decisions are made for users, not for star tactics.
6. **Restart**: project 1's selection starts again with this method. The earlier research stays in `history/research/earnstar_1/` as background.

## Changes made in S023
- `CLAUDE.md` (Constitution): §0 (developer role), §1 (objective: the way, no promotion, measure, signals of usefulness), §3B (promotion removed; DEV block removed), §3D (DEV disclosure line removed), §4 (useful work while blocked), §5 (lifecycle: P0 Understand people, P3 Release, P4 Iterate; Gate summary), §6 (promotion files retired), §7 (README says who it is for; "Findable, not promoted").
- `playbook/research.md` rewritten; `playbook/launch.md` rewritten (release and iteration); `playbook/defaults.md` (floor removed, prototype budget, iteration review, time on users, plateau signal, DEV row removed).
- `tools/devto.mjs` removed; `tools/metrics.mjs` no longer tracks channels; `templates/project-report.md` reports users and iterations instead of channel attribution.
- `STATE.md`, `history/outbox.md` (O-001 withdrawn), root `README.md`, `playbook/lessons.md` (L-030), `playbook/CHANGELOG.md`.

## Expected outcome
Projects chosen for a real, unmet need that the developer can serve and test, found by people who search for a solution, and improved release by release. Review at project 1's first iteration review (first release + 14 days) and at its close: did users with the need arrive, use it, and come back, and what did the iterations teach?

## Result
To be filled in at the review date.
