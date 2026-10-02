# Defaults

Tunable parameters referenced by the Constitution. Change them only with a `CHANGELOG.md` entry that gives the reason and the evidence.

| Parameter | Value | Rationale |
|---|---|---|
| Monthly work-hour target | 60 h per calendar month, pro-rated for partial months (`TARGET_HOURS` in `tools/hours.mjs`) | Owner's decision (S010): 2 h/day on average, scheduled flexibly |
| Project shortfall threshold | < 60 % of expected hours at the 2-month minimum (`SHORTFALL` in `tools/hours.mjs`) | Prevents closing an under-invested project |
| Session length if unspecified | Until the owner says stop; close early only if no useful work remains or a usage or rate limit stops the work, and say why. A given duration (`start work 3h`) is a minimum | Owner's decision (S020), replacing the 2 h default of S015, which in practice became a target rather than a floor |
| Checkpoint interval | ≤ 45 min | Limits loss if the machine stops abruptly; matters more in long sessions |
| Close-out | Starts when the owner says stop (or after a given minimum), at a clean stopping point; not counted toward a minimum | Leaves time for the log, ledger, and push |
| Maintenance cap (past projects) | ≤ 15 % of a session | Keeps focus on the current project |
| P0 + P1 floor | None (removed in S023): the Gate asks for evidence of a real need and a later-session confirmation, not hours | Owner directive S023: understanding people matters more than research volume |
| P0 + P1 ceiling | ≤ 14 days after kickoff; exceeding it needs a recorded reason in the selection ADR (the Gate takes precedence). Project 1 exceeds it because the owner ordered a restart of the selection on 2026-10-03 | Guards against analysis paralysis |
| Prototype on real tasks | ≤ 4 active hours, throwaway code | Tests whether the solution would have helped the people who described the need |
| First public release | ≤ day 35 after kickoff | Leaves ≥ 25 days of feedback before the 2-month minimum |
| Iteration review | Every 14 days after the first release | Compares what users actually do with what the selection ADR assumed |
| Time on users (P2–P4) | ≥ 10 % of active time on users' issues, questions, and workflows, and on the developer's own use of the project | Learning from use is how the project improves without promotion |
| Plateau (close signal) | Stars gained in the last 14 days < max(10, 5 % of total), and no open user-reported need of high value | Close when growth has flattened and users' needs are met |
| Idle cap for active time | 60 min | Used by `tools/usage.mjs` |
| Free-space floor | ≥ 30 GB on each of C: (conda environments, caches) and D: (work files) | Keeps the owner's machine usable. Datasets and models go in `lab/` or project folders and are pruned when no longer needed |
