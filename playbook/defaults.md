# Defaults

Tunable parameters referenced by the Constitution. Change them only with a `CHANGELOG.md` entry that gives the reason and the evidence.

| Parameter | Value | Rationale |
|---|---|---|
| Session budget if unspecified | 2 h wall-clock | Owner's stated average |
| Checkpoint interval | ≤ 45 min | Limits loss if the machine stops abruptly |
| Close-out reserve | ≥ 10 % of budget | Leaves time for the log, ledger, and push |
| Maintenance cap (past projects) | ≤ 15 % of a session | Keeps focus on the current project |
| P0 + P1 budget | ≤ 7 days after kickoff and ≤ 12 active hours | Avoids analysis paralysis |
| First public release | ≤ day 21 after kickoff | Leaves time to iterate on real feedback |
| Launch concentration | HN and Reddit posts within the same 48 h | Hypothesis H-002: star velocity drives Trending |
| Owner posting load | ≤ 4 posts per project in total | Owner time is scarce |
| Plateau (close signal) | Stars gained in the last 14 days < max(10, 5 % of total) | Marginal return has flattened |
| Idle cap for active time | 60 min | Used by `tools/usage.mjs` |
