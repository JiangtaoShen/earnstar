# Independent selection panel (S022)

_2026-10-02. A research subagent with no prior context read the evidence (`ideas.md`, `critique.md`, `channel-memo.md`, `smallwin.md`, `scenario-b.md`, `scenario-c.md`, `demand-first.md`, `launch-forms.md`, `mods-wave.md`, `mods-demand.md`, the candidate files, ADR-003) and proposed a selection for scenario (a) and (b+c). The developer had pre-registered its own ranking before the panel reported (S022 log, 15:48). Scratch outputs: `lab/earnstar_1/s022/panel/` (git-ignored). Condensed by the developer; the developer's verification follows in `candidate-47.md`._

## New probes (all regressed to their controls)
| Probe | Result | Verdict |
|---|---|---|
| Fake-star checker | 61 entrants, max 15; all-time leaders Ullaakut/astronomer 777 (2019), hehao98/StarScout 198 | Many tried, none rose |
| Interactive LLM explainers | 653 entrants, median 0, 5 ≥ 100 (w3cj/how-llms-work 617) | Crowded |
| NSFC grant-proposal skills (c) | 264 entrants; njzjz/nsfc-agent-skills 631 (owner 500 followers) | Crowded |
| Academic-writing skills | Of repos with ≥ 10 stars (2026-03..06), 32.8 % reach 100 and 3.6 % reach 1k; control `topic:agent-skills` 27.5 % and 7.0 % | No lift |
| Hallucinated-citation checkers | 619 entrants; 378, 250, 102 at the top | Crowded |
| Music skills for agents | 492 entrants, 14 ≥ 100 | Crowded |
| "Is the model nerfed?" lane | Chinese "dumbed-down" repos (2026-06..09): 407; of those with ≥ 10 stars, 30 % reach 100 and 5 % reach 1k; control `topic:agent-skills` 22.5 % and 4.4 % | No lift (winners cluster, but conversion equals the control) |
| Same lane, Claude side | 47 entrants for six phrases; relevant: lukehutch/unnerfcc 28, MaximoCorrea1/dumbometer 4, cyw6130/iqdrop 2 | Thin bottom tier |
| Mods wave, day 2 | `topic:claude-code-mods` 11 repos; `claude mod created:>=2026-09-25` 204; the early list at 59 | Still no wave (L-025) |
| Next model release | None announced by Anthropic | #34 timing unknown |

**Immich auto-rotation knocked out** (vendor fix): an Immich organization member published a rotation model on 2026-09-23, "Built to decide whether this is worth building in" (bo0tzz/rotfix-experiment; membership verified by the panel with `gh api orgs/immich-app/members/bo0tzz`), the same rule that knocked out #28 and #31.

## The panel's candidate: #47, a local monitor of Claude Code changes
A zero-token CLI (`npx <name>`; no "Claude" in the name, L-013) that reads the local Claude Code transcripts and charts, per turn, the serving model, output and thinking tokens, `service_tier`, `speed`, and `fallback_credit`; it flags silent reroutes and token "shrinkflation" beyond noise with honest intervals; the developer publishes a reference panel at each model release, which users can compare against with an optional small probe. Model fingerprinting was dropped (crowded and tied to the API-relay grey market: unclecode/modelprint 127, Ikaleio/lm-detector 115, rt22766/claude-skill-model-fingerprint 114, bi-boo/claude-model-fingerprint 77).

**Demand signals** (panel): HN 49296740 "Why does Opus 5 feel worse to work with?" 993 points (2026-08-14); HN 49901736 livenerf 914 points (2026-09-29); HN 49789224 "Median thinking declined" 425 points; anthropics/claude-code#78888 (open, 20 👍): a user found by hand in `~/.claude/projects/` a silent reroute lasting about 840 assistant messages, with "no per-response model display"; #83510 "measurable quality regression" (open); Codex equivalents from small owners in 2026-09 (verified in `candidate-47.md`).

**Differentiation** (panel): livenerf answers "did the model get worse on one central benchmark" (its own validation cannot separate Opus 5 from 5.5 on accuracy while tokens fall 62 % at low effort); #47 answers "did your sessions change", from your own logs, at no token cost; ccusage (18,835) shows cost, not change.

**Spike gate** (panel; ≤ 4 h, within the 300-run cap): from transcripts alone, the monitor must flag two induced changes on a fixed task mix (effort high vs low; Opus 5.5 vs Sonnet 5.5) with ≥ 90 % detection and ≤ 10 % false alarms on unchanged windows of the program's own archive; otherwise knock #47 out.

## Scores (research.md §3 weights; distribution only for usable channels)
| Scenario | Candidate | Dem | Diff | TtW | Feas | Dist | Sust | Weighted |
|---|---|---|---|---|---|---|---|---|
| (a) | **#47** | 4 | 3 | 4 | 4 | 3 | 4 | **3.65** |
| (a) | #39/#39b | 3 | 3 | 4 | 4 | 2 | 3 | 3.15 |
| (a) | #34 | 3 | 2 | 3 | 3 | 3 | 3 | 2.80 |
| (b+c) | **#47 bilingual + Show HN** | 4 | 3 | 4 | 4 | 4 | 4 | **3.80** |
| (b+c) | #46 joinery explainer | 2 | 4 | 5 | 3 | 4 | 5 | 3.60 |
| (b+c) | Windows used-PC inspection | 3 | 3 | 4 | 3 | 3 | 3 | 3.15 |

## Calibrated predictions (stars at close)
| Candidate / scenario | Median | 50 % | 90 % |
|---|---|---|---|
| #47 (a) | 8 | 3–25 | 0–300 |
| #47 (b+c) | 15 | 5–50 | 0–700 |
| #39b (a) | 6 | 2–20 | 0–200 |
| #34 (a) | 4 | 1–15 | 0–300 |
| #46 (b+c) | 8 | 2–30 | 0–500 |
| Used-PC (c) | 6 | 2–20 | 0–400 |

Reference: `topic:agent-skills` 2026-06-01..09-30 (20,745 repos; 6.0 % reach 10; of those 22.5 % reach 100 and 4.4 % reach 1k) with the small-owner discount; P(≥ 10) raised to about 40 % for a deliberate launch; (b+c) adds the CJK lift (about 2×) and about 2.8 % per Show HN. The mean for #47 under (a) is about 25, driven by the tail.

## Is any candidate clearly better?
On the rubric, #47 leads by 0.5 under (a), more than the noise rule; in outcome, no: every reference class regresses to its control and the intervals overlap. "Best available, not dominant." #47 was conceived and scored in one sitting, so it needs the critique and a later-session confirmation.

## If the owner never answers: #47 under (a)
Main risk: a weak or confounded signal (token trends shift with the task mix; verdicts may be mostly "all clear", #45's "unexciting demo"); the spike gate tests it first. Other risks: Anthropic adds a persistent model indicator (removes the reroute half, not the shrinkflation half); ccusage adds a change view; transcript schema churn; hostility to an AI-built tool ("Claude Code audits Claude" is also the hook). Launch moments: v0.1 with a DEV data article from the program's own audit trail; one owner-approved disclosed reply in #78888; a reference panel at each model release; a DEV follow-up ≥ 3 weeks later. Kill criteria at launch + 14 days: < 10 stars, < 100 unique visitors, and no external issue, PR, or discussion → reposition (lead with a real reroute or token-drop example; the outbox reply); < 5 stars and no external engagement → switch to the runner-up (#39b if the desktop check passes, else #34 at the next major release).

## Strategy recommendations (panel)
1. Stop searching for a dominant niche; when candidates are within noise, break the tie by rule and ship by about 2026-10-30.
2. Add to the rubric: the number of dated launch moments before close + 90 days (L-028); option value if (b) or (c) is granted later; "people already do this by hand" as demand evidence ahead of 👍 counts.
3. Prefer a series format inside one repo (recurring data drops).
4. Ask the owner for a release-day session within 48 hours of a major model release.
5. Treat project 1 partly as a channel experiment with pre-registered expected effects.
6. The owner's channel answer outweighs any rubric gap; structure the README so a Chinese version can be added at no cost.
