# ADR-002: Project 1 selection (draft)

- **Date / session**: 2026-10-01 / S018 (draft)
- **Status**: proposed. It must be confirmed or replaced in a later session (`playbook/research.md` §1.8), after the research floor is met.
- **Approved by**: developer (selection is within the developer's authority; B-class actions it implies go through the outbox)

## Context
Project 1 started on 2026-09-25 (S016). The foundational study (`history/research/foundation.md`) found that AI-coding-agent tooling and skills convert best (L-006); that cold starts need a burst borrowed from a large venue (L-007); that DEV alone rarely moves a repo (L-010); and that awesome lists and the official plugin directory are follow-on or company channels (L-009, L-016). Thirty-one ideas were screened (`history/research/earnstar_1/ideas.md`); four were deep-dived.

## Selection Gate checklist
- [x] The foundational study exists and was written in this project (S016), with an independent review (§9 of the study).
- [x] ≥ 15 ideas screened (31) and ≥ 3 candidates deep-dived: #31 (`candidate-31.md`), #30 and #26 (`candidate-26-27.md`), #23 (`candidate-23.md`).
- [ ] Each candidate has a landscape (≥ 10), ≥ 5 case studies, ≥ 3 demand signals, a differentiation statement, and a distribution plan: complete for #31 and #26 (drafts) and #23 (differentiation open); #30 lacks its differentiation statement and distribution plan.
- [ ] Feasibility spike: offline prototype passed for #31 (`lab/spike/langlock/hook.mjs`, results in `candidate-31.md` §5); the end-to-end run in a real session awaits the owner's CLI sign-in.
- [ ] Pre-mortem (below) and independent critique (to be run on this draft, with every objection answered).
- [x] Prediction with intervals, kill criteria, and runner-up (below; to be revisited after the critique).
- [ ] Research floor: ≥ 8 active P0/P1 hours over ≥ 2 sessions on ≥ 2 days; about 4 h after S018.
- [ ] Decision confirmed in a later session.

## Options
Preliminary scores (S018; `playbook/research.md` §3 weights):

| Candidate | Demand | Differ. | Time-to-wow | Feasibility | Distribution | Sustain. | Weighted |
|---|---|---|---|---|---|---|---|
| **#31 reply-language lock** | 3 | 4 | 4 | 5 | 4 | 4 | **3.90** |
| #23 behavior skill (habit open) | 4 | 2 | 5 | 5 | 3 | 5 | 3.85 |
| #30 companion as a mod | 5 | 3 | 5 | 3 | 3 | 3 | 3.80 |
| #26-A tested mod catalogue | 3 | 2 | 3 | 3 | 4 | 2 | 2.85 |
| #26-B policy and audit pack | 3 | 3 | 2 | 3 | 3 | 3 | 2.85 |

Evidence for each is in the candidate files. In short:
- **#31**: Opus 5.5 replies drift into English after English tool output for Japanese and Chinese users ([#96326](https://github.com/anthropics/claude-code/issues/96326), [#96601](https://github.com/anthropics/claude-code/issues/96601), measured 0.4 % → 4.2 %); public transcripts show English replies to CJK users in 20 of 37 repos; no existing tool; the mechanism (Stop hooks with `last_assistant_message` and blocking) exists in Claude Code, Codex, and Gemini CLI; language-community tools from small owners reached 211–2,303 stars.
- **#23**: the archetype with the largest wins (ponytail 149k, caveman 108k), but no unowned habit with a fresh hook was found, and late copies earn nothing (L-014).
- **#30**: the most-upvoted open issue (#45596, 1,185 👍), but replacements peaked at 464 stars and depend on Mods reaching general availability at an unknown date.

## Decision (proposed)
Build **#31, a reply-language lock for coding agents**: a small, dependency-free hook that keeps every user-facing reply in the user's language across Claude Code, Codex, and Gemini CLI, with a drift report that measures before and after from local transcripts; CJK languages first.

**Runner-up**: #30 (the companion as a mod) if Mods reach general availability before the pivot review; otherwise #23 with a habit found by the method in `candidate-23.md`.

## Pre-mortem
"It is close day and the project has fewer than 100 stars. Why?"
1. **A vendor fixed the drift** (a model or harness update), so the need faded. Mitigation: cross-agent support; the reverse drift (English users getting other languages); a per-content policy (replies in the user's language, code and commits in English); the drift report stays useful as a measurement.
2. **The target communities never found it**: an English-only README and a DEV-only channel do not reach CJK developers. Mitigation: request owner approval for Chinese and Japanese READMEs (B-class); propose single, disclosed comments in the issues where users report the problem (#96326, #96601; B-class, outbox); a DEV article with the measurement; topics in the users' search terms.
3. **The hook annoyed users**: false positives, rewrite loops, extra tokens. Mitigation: conservative thresholds, a per-turn cap keyed by `turn_id` or the transcript, a dry-run and report mode, an allowlist for intended English.
4. **It looked too small to star**: a 60-line hook. Mitigation: a polished installer for three agents, the drift report, a before/after card, and tests.
5. **Demand was overestimated**: the reaction counts are low. Mitigation: before P2, measure drift on the current model with small-scale headless runs (approved in S017; needs the CLI sign-in), and drop to the runner-up if the drift is negligible.

## Expected outcome
- **Prediction (stars at close, about 2026-11-25 to 2026-12-25)**: median 100; 50 % interval 40–300; 90 % interval 10–1,500. Reasoning: small-owner base rate (about 10 % of repos with ≥ 10 stars reach 100, L-005), lifted by a fresh, specific need and a reference class of language-community tools (211–2,303), and lowered by the DEV-only channel (L-010).
- **Kill criteria at the pivot review (launch + 14 days)**: fewer than 20 stars and fewer than 150 unique visitors → adjust positioning and channels per the pre-mortem; fewer than 10 stars and no external issue or PR → switch to the runner-up.
- **Review date**: the pivot review (launch + 14 days); then close + 30 and close + 90 days.

## Result
To be filled in at the review date.
