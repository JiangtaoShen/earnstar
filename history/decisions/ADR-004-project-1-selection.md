# ADR-004: Project 1 selection

- **Date / session**: 2026-10-02 / S022 (draft)
- **Status**: proposed. Awaits the independent critique (this session) and the confirmation in a later session (Selection Gate). Supersedes ADR-003 (on hold) and the withdrawn ADR-002.
- **Approved by**: developer (selection is within the developer's authority; the B-class actions it implies go through the outbox)

## Context
Project 1 started on 2026-09-25. S021 drafted ADR-003 (#39) and put it on hold after its critique, knocked out #35, #40, and #45, and found that small owners' wins in 2026 come mostly from ignition the program cannot see or make, that obvious niches hold 10–40 tiny entrants, and that every usable channel is a ticket worth a few percent (L-025–L-028). The owner has not yet answered the channel question (`history/research/earnstar_1/channel-memo.md`), so this ADR selects under the current policy, (a) DEV only, with a contingency for (b+c). To counter the in-session bias that sank ADR-002 and ADR-003, S022 asked an independent panel with no prior context to propose the selection (`panel-s022.md`); the developer had pre-registered its own ranking first (S022 log, 15:48: #46 first) and accepted the panel's different choice on the evidence.

## Selection Gate checklist
- [x] The foundational study exists and was written in this project (S016), refreshed in S018 and S021 (platform launches by form; the 2026 small-owner class; channel base rates).
- [x] ≥ 15 ideas screened (47, `ideas.md`, `panel-s022.md`) and ≥ 3 candidates deep-dived: #47 (`candidate-47.md`), #39/#39b (`candidate-39.md` with its critique), #34 (`ideas.md`, S018 and S021 sections), #46 (`ideas.md`, S021 measurements).
- [x] Each has a landscape (≥ 10), ≥ 5 case studies, ≥ 3 demand signals, a differentiation statement, and a distribution plan (files above; #47's in `candidate-47.md` §2–§4 and `panel-s022.md`).
- [x] Feasibility spike (`candidate-47.md` §7): passive trend detection fails (task-mix confounding, measured on the program's own transcripts); passive facts and an active micro-probe pass (adjacent effort levels separate with five runs); the design was changed accordingly.
- [ ] Pre-mortem (below) and independent critique (to run on this draft, every objection answered).
- [x] Prediction with intervals, kill criteria, and runner-up (below).
- [x] Research floor: 8.3 active P0 hours over 3 sessions on 3 days before S022 (`tools/hours.mjs`).
- [ ] Decision confirmed in a later session (S023 or later; the P0+P1 ceiling is 2026-10-09, after which a recorded reason is needed).

## Options
Scores (`playbook/research.md` §3 weights; distribution scored only for channels usable under (a)):

| Candidate | Demand | Differ. | Time-to-wow | Feasibility | Distribution | Sustain. | Weighted | Median at close (a) |
|---|---|---|---|---|---|---|---|---|
| **#47 change monitor: facts from your logs plus a three-cent probe** | 4 | 3 | 4 | 4 | 3 | 4 | **3.65** | 8 |
| #39/#39b interface on mods (critique rescore) | 3 | 3 | 4 | 4 | 2 | 3 | 3.15 | 6 |
| #35 community fix pack | 3 | 3 | 3 | 4 | 3 | 3 | 3.15 | — |
| #34 day-one release kit (panel rescore) | 3 | 2 | 3 | 3 | 3 | 3 | 2.80 | 4 |
| #46 interactive explainer series (best under (b+c) only) | 2 | 4 | 5 | 3 | 2 | 5 | 3.30 | ≈ 5 |

Knocked out: #40 (the identical product by the reference winner's author has 1★), #45 (23 identical tiny entrants), Immich auto-rotation (vendor experiment published 2026-09-23).

Why #47 leads (evidence in `candidate-47.md` and `panel-s022.md`):
- **Demand of an unusual kind**: users already do this job by hand ([#78888](https://github.com/anthropics/claude-code/issues/78888), open, 20 👍: a silent reroute found by reading `~/.claude/projects/`); a live controversy (HN 993 points on 2026-08-14, 914 on 2026-09-29, 427 on 2026-09-21; [#83510](https://github.com/anthropics/claude-code/issues/83510), 21 👍).
- **Fresh precedents from small owners on the Codex side**: xqy2006/ModelTrace 1,170 (owner 30 followers; 1,124 in the last 30 days), haowang02/codex-candy-eval 1,122 (51), kiyoakii/is-gpt-nerfed 233 (81), ysh1112/codex-model-watch 190 (0).
- **A thin Claude-side bottom tier**: 143 entrants for eight phrases in English and Chinese; direct attempts at 0–8★.
- **Feasible, testable, and cheap**: the program already parses this transcript format; the probe costs about $0.03 per run.
- **Several launch moments**: a reference run at every model release, monthly data drops, and data articles.
- It is "best available, not dominant": every reference class regressed to its control, and the predicted outcome distributions overlap.

## Decision (proposed)
Build **#47**: a local, open-source CLI that tells Claude Code users whether the model serving them changed. MVP (≤ 40 active hours, first release before 2026-10-30):
1. **Facts from your logs (zero tokens)**: per session and per day, the model that actually served each turn, flagged reroutes and fallbacks (a model other than the session's requested model, `<synthetic>` messages, non-null `fallback_credit`), the effort applied, `service_tier`, and `speed`; Markdown and JSON output.
2. **A three-cent probe (optional, the user's own plan)**: a fixed micro-panel run headless a few times, with easy items for thinking-budget stability and harder items for accuracy; results stored locally and compared with the user's own history and with the project's reference runs, with intervals.
3. **Reference runs published by the project** at each model release and monthly (`data/reference/`), each a dated launch moment.
4. Cross-platform Node CLI with no network calls except the optional probe through the user's own `claude` CLI, no telemetry; tests on fixture transcripts; CI; README led by a real finding from the program's own logs.
5. Framing (Constitution §3C): it measures changes and states uncertainty; it never claims intent or "nerfing" without evidence.

Name: chosen at the start of P2 (no "Claude", "Anthropic", or "Claude Code", L-013).

**Runner-up**: #39b (the band in the desktop app) if the owner's desktop check passes once the desktop engine supports mods; otherwise #46 (an explainer series) if (b) or (c) is granted.

**Channel contingency**: under (b+c), a bilingual README (the Chinese "dumbed-down" meme drives the Codex-side detectors) and an owner-written Show HN on a measured finding.

## Pre-mortem
"It is close day and the project has fewer than 20 stars. Why?"
1. **The probe mostly says "no change"**, so there is nothing to share. Mitigation: lead with facts users cannot see today (reroutes, the effort actually applied); publish release-day comparisons; include accuracy items with a spread.
2. **Anthropic shows the serving model persistently** (#78888's ask). Mitigation: the probe and the history remain; keep the reroute view as one feature, not the pitch.
3. **It reads as another usage monitor** among ccusage (18.8k) and four others at 1–9k. Mitigation: the README's first screen answers "did my model change?" with a real example, not cost charts.
4. **Controversy**: readers take small shifts as proof of "nerfing", or the project looks like an attack on a vendor. Mitigation: intervals, a method page, neutral language, and published raw data.
5. **No ignition under DEV only** (L-028). Mitigation: one owner-approved, disclosed reply in #78888; a DEV data article at launch and at each release; under (b+c), a Show HN and Chinese posts.
6. **Privacy worries** about reading transcripts. Mitigation: local only, no network, open source, and a plain statement of what is read.
7. **Transcript schema churn**. Mitigation: tests against the latest CLI; tolerant parsing; fixtures per version.

## Expected outcome
- **Prediction (stars at close, about 2026-11-25 to 2026-12-25)** under (a): median 8; 50 % interval 3–25; 90 % interval 0–300 (panel; reference `topic:agent-skills` 2026-06..09 with the small-owner discount; mean about 25, tail-driven). Under (b+c): median 15; 50 % 5–50; 90 % 0–700.
- **Kill criteria at the pivot review (launch + 14 days)**: fewer than 10 stars, fewer than 100 unique visitors, and no external issue, PR, or discussion → reposition (lead the README with a real reroute or token-shift example; ask the owner for the #78888 reply); fewer than 5 stars and no external engagement → switch to the runner-up.
- **Review date**: the pivot review; then close, close + 30, and close + 90 days.

## Result
To be filled in at the review date.
