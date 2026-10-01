# ADR-003: Project 1 selection

- **Date / session**: 2026-10-02 / S021 (draft)
- **Status**: proposed (draft). Awaits the independent critique (this session) and the reflection in a later session (Selection Gate). Supersedes the withdrawn ADR-002.
- **Approved by**: developer (selection is within the developer's authority; the B-class actions it implies go through the outbox)

## Context
Project 1 started on 2026-09-25. S016 wrote the foundational study; S018 screened 34 ideas, drafted and withdrew ADR-002 after the critique, and ranked "a ready entry when Claude Code's Mods reach general availability" as the strongest structural bet (H-008), with its unknown date as the main risk. **Mods launched in Claude Code 2.1.287 on 2026-10-01**, the day before this session ([blog](https://claude.com/blog/claude-code-mods), [docs](https://code.claude.com/docs/en/plugins/mods/overview); on by default; drawing in the terminal and the desktop Code tab). S021 measured the launch as it happened and reran the selection:
- Day-0 wave (`history/research/earnstar_1/mods-wave.md`): 285 mod repos (most from early access), median 0 stars, launch-day repos 6 stars in total, HN posts 2–3 points; the list slot is held (karanb192's footprint list, claude-mods.com, davila7's catalogue).
- Past launches by form (`launch-forms.md`, L-025): in the hooks, plugins/Skills, and MCP launches, no small-owner repo reached 1,000 in three weeks; launch-week entries won later (days 40–160).
- Demand a mod can meet (`mods-demand.md`), checked against the current release: the largest cluster (compound-command prompts) is already fixed in 2.1.287 (zero-token probe, S021 log); interface requests remain open.
- A fifth Claude Code launch, the **customizable status line** (1.0.71, 2025-08-07), is the closest precedent to Mods' interface sites: 3 of the 47 repos created in its first three weeks reached 1,000 stars (6.4 %), led by a 76-follower owner's configurator, sirmalloc/ccstatusline (13,146 stars; `candidate-39.md` §2, §4).

## Selection Gate checklist
- [x] The foundational study exists and was written in this project (S016, with an independent review); refreshed in S018 (last-90-days scan) and S021 (platform launches by form, `launch-forms.md`).
- [x] ≥ 15 ideas screened (39, `ideas.md`) and ≥ 3 candidates deep-dived: #39 (`candidate-39.md`), #30 (`candidate-26-27.md`, updated S021), #34 (`ideas.md`, case studies, landscape, forms, and the S021 completion), with #23 (`candidate-23.md`) as an earlier deep dive.
- [x] Each of #39, #30, #34 has a landscape (≥ 10), ≥ 5 case studies, ≥ 3 demand signals, a differentiation statement, and a distribution plan (links above). #23 lacks a differentiation statement (no unowned habit with a fresh hook), so it cannot be selected.
- [x] Feasibility spike succeeded for #39 (`candidate-39.md` §6): validation, three automated drawing tests, and a real interactive session on Windows. Open item: desktop rendering seen only through tests.
- [ ] Pre-mortem (below) and independent critique (to run on this draft, with every objection answered).
- [x] Prediction with intervals, kill criteria, and runner-up (below; revisited after the critique).
- [ ] Research floor: ≥ 8 active P0/P1 hours over ≥ 2 sessions on ≥ 2 days; 4.0 h before S021, so S021 must contribute ≥ 4 h (S016 and S018 already cover two days).
- [ ] Decision confirmed in a later session.

## Options
Scores (`playbook/research.md` §3 weights; 1–5):

| Candidate | Demand | Differ. | Time-to-wow | Feasibility | Distribution | Sustain. | Weighted |
|---|---|---|---|---|---|---|---|
| **#39 configurable interface (mods)** | 4 | 4 | 5 | 4 | 3 | 4 | **4.00** |
| #23 behavior skill (habit open; no differentiation statement) | 4 | 2 | 5 | 5 | 3 | 5 | 3.85 |
| #30 companion as a mod | 4 | 2 | 5 | 4 | 3 | 3 | 3.50 |
| #34 day-one model-release kit | 3 | 3 | 4 | 3 | 4 | 3 | 3.30 |
| #35 community fix pack | 3 | 3 | 3 | 4 | 3 | 3 | 3.15 |

Reasons in brief:
- **#39**: demand 4 from ccstatusline's scale (13,146 stars; 183,793 npm downloads in September) and open interface issues (desktop status bar #41456, file names #21151, timestamps, hidden diffs), held below 5 because fixed meter mods drew no stars in early access; differentiation 4 (whole interface, desktop too, update-safe, live configurator); feasibility 4, not 5, because desktop drawing is unverified by sight; distribution 3 (passive discovery and DEV only); sustainability 4 (no hosting; API churn handled by nightly CI).
- **#23 vs #39**: within noise by score (0.15), but #23 has no differentiation statement and no fresh hook, its reference class converts at 0.43 % to 1,000 (L-024) against 6.4 % in the status-line window, and it is not time-limited, while #39's opportunity is.
- **#30**: crowded (about nine companion mods), weak lasting conversion (companions rose and fell with Anthropic's own Buddy news), IP limits on the original Buddy.
- **#34**: needs a session within days of a major release (none announced) and has mixed rider evidence (L-023).
- **#35**: its largest cluster is already fixed upstream; its interface items move into #39.

## Decision (proposed)
Build **#39: a configurable interface for Claude Code on the official mods API**. MVP scope (≤ 40 active hours):
1. A band of widgets above the prompt (model, folder, branch, context fill, plan limits with reset times, session cost), with layouts and color presets.
2. Transcript tweaks, each a toggle: Read and search groups folded into one line that names the files; inline diffs shortened or hidden; message timestamps; a quieter turn line.
3. A live `/customize` pane (themes, widgets, toggles) with presets ("calm", "dashboard", "minimal"); settings saved per user.
4. Terminal and desktop support, tested with `claude plugin test` on both surfaces and in CI against the `latest` and `stable` Claude Code nightly; real-render checks in a pseudo-terminal; README recordings made from real sessions.
5. One-line install through a marketplace in the repo; no network calls, no telemetry; the README shows the `claude plugin validate` footprint.

**Runner-up**: #34 (day-one model-release kit), a different archetype that does not depend on the Mods outcome, if a major model release lands before the pivot review; otherwise #30 (the companion as a mod), which reuses the same mods code and tests.

## Pre-mortem
"It is close day and the project has fewer than 50 stars. Why?"
1. **Nobody searched for it**: the Mods launch created no search wave, and the program has no social channel. Mitigation: target the status-line search terms that already have demand; claude-mods.com's daily scan; lists through the outbox; one DEV article that teaches; measure the wave each session with `tools/wave.mjs`.
2. **An incumbent moved first**: ccstatusline (13k) or tweakcc (2.5k) added a mods mode. Mitigation: ship in Mods' first two weeks; cover the transcript and the desktop app, which a status-line tool cannot; check both repos each session.
3. **It read as "another meter"**: about 26 meter mods already exist. Mitigation: lead the README with the live `/customize` pane and before/after transcript recordings, not with numbers.
4. **First impressions broke**: a Claude Code update changed the API, or desktop drawing failed. Mitigation: nightly CI against `latest`; verify desktop before launch or state terminal-first; graceful fallbacks.
5. **Anthropic shipped the same thing natively** (as with spinner verbs and VS Code timestamps). Mitigation: breadth; retire tweaks that become native and say so.
6. **Users would not install third-party code into Claude Code** (mods are not sandboxed). Mitigation: no network or process calls by default, the footprint in the README, readable source, tests.

## Expected outcome
- **Prediction (stars at close, about 2026-11-25 to 2026-12-25)**: median 80; 50 % interval 25–300; 90 % interval 5–2,000. Reasoning: the status-line window (17 % of all repos reached 100, 6.4 % reached 1,000, but over 14 months) and a deliberate, well-made entry argue up; the absent Mods wave on day 0, the program's lack of a social channel (L-007, L-010), and slow small-owner growth at Claude Code's other launches (L-025) argue down.
- **Kill criteria at the pivot review (launch + 14 days)**: fewer than 15 stars and fewer than 150 unique visitors → adjust positioning, README, and channels per the pre-mortem; fewer than 8 stars and no external issue, PR, or discussion → switch to the runner-up.
- **Review date**: the pivot review (launch + 14 days); then close, close + 30, and close + 90 days.

## Result
To be filled in at the review date.
