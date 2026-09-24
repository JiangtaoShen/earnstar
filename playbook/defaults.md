# Defaults

Tunable parameters referenced by the Constitution. Change them only with a `CHANGELOG.md` entry that gives the reason and the evidence.

| Parameter | Value | Rationale |
|---|---|---|
| Monthly work-hour target | 60 h per calendar month, pro-rated for partial months (`TARGET_HOURS` in `tools/hours.mjs`) | Owner's decision (S010): 2 h/day on average, scheduled flexibly |
| Project shortfall threshold | < 60 % of expected hours at the 2-month minimum (`SHORTFALL` in `tools/hours.mjs`) | Prevents closing an under-invested project |
| Session minimum if unspecified | 2 h of wall-clock working time; no fixed cap after it (finish the current task, start no new large task) | Owner's decision (S015) |
| Checkpoint interval | ≤ 45 min | Limits loss if the machine stops abruptly |
| Close-out | Starts after the minimum, at a clean stopping point; not counted toward the minimum | Leaves time for the log, ledger, and push |
| Maintenance cap (past projects) | ≤ 15 % of a session | Keeps focus on the current project |
| P0 + P1 floor | ≥ 8 active hours (phase P0/P1 in `tools/hours.mjs`), across ≥ 2 sessions on ≥ 2 calendar days | A ≥ 2-month commitment justifies deep research; a second day gives fresh-context reflection. S011 lowered the session count from 3 to 2, so that one long owner block plus one more day suffices |
| P0 + P1 ceiling | ≤ 14 days after kickoff; exceeding it needs a recorded reason in the selection ADR (the Gate takes precedence) | Guards against analysis paralysis |
| Feasibility spike | ≤ 4 active hours, throwaway code | Retires the main technical risk cheaply |
| First public release | ≤ day 35 after kickoff | Leaves ≥ 25 days of feedback before the 2-month minimum |
| Pivot review | Launch + 14 days | Most launch-driven stars arrive in the first week |
| Continuous research (P2–P4) | ≥ 10 % of active time | Learning continues after selection. Sessions are tagged with a single phase, so this share is reported in each session log and supported by the ledger's web searches and fetches; the ledger cannot measure it directly |
| DEV articles | ≤ 3 per project (a build write-up at launch, then up to two technical deep dives or milestone write-ups, ≥ 3 weeks apart) | DEV is the only social channel (S013), but it forbids clout-driven posting, so quality beats volume |
| Plateau (close signal) | Stars gained in the last 14 days < max(10, 5 % of total) | Marginal return has flattened |
| Idle cap for active time | 60 min | Used by `tools/usage.mjs` |
| Free-space floor | ≥ 30 GB on each of C: (conda environments, caches) and D: (work files) | Keeps the owner's machine usable. Datasets and models go in `lab/` or project folders and are pruned when no longer needed |
