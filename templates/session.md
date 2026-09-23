# SNNN — YYYY-MM-DD

| Field | Value |
|---|---|
| Session ID / kind | SNNN / work · setup · admin · reconstructed |
| Project / phase | earnstar_N (<name>) / Pn; day D since kickoff (YYYY-MM-DD) |
| Open → close (Asia/Shanghai) | YYYY-MM-DD HH:MM → YYYY-MM-DD HH:MM |
| Open → close (UTC) | … → … |
| Budget / wall-clock / active / owner-wait | 2 h / … min / … min / … min |
| Month to date | … h of … h target (ahead / behind by … h), from `tools/hours.mjs` |
| Model / effort | from the ledger (e.g., claude-opus-5-5 / xhigh) |
| Agent | Claude Code version · entrypoint · permission mode · Constitution `sha` in effect |
| Machine | `m-…` (CPU / GPU / RAM); driver, CUDA, and Node versions; profile `history/machines/m-….json` |
| Tokens | input … · cache write … · cache read … · output … (of which thinking …) · total … |
| Work composition | tool calls (top types) · subagents · compactions · web searches / URLs |
| Git | per repo: commits (human …) · +… / −… lines |
| Claude Code session IDs | … |
| Evidence | N transcripts archived (hashes in the ledger) |

## 1. Goals
## 2. Metrics at open
## 3. Work log
Time (Asia/Shanghai) — action — evidence (SHA / URL / file).
## 4. Decisions
Link the ADRs. Record minor decisions inline, with the reason for each.
## 5. Research notes
Each note: claim — source URL.
## 6. Owner involvement
- **Instructions**: each owner message, quoted (with any sensitive content redacted), and its effect.
- **Approvals**: outbox IDs approved or rejected.
- **Owner actions**: posts or other actions the owner performed (URL, time, owner-reported minutes).
- **Human commits**: from the ledger. Explain any non-zero count.
## 7. External actions by the developer
Public actions taken under A-class authority: replies, merges, releases, renames, visibility changes (with URLs).
## 8. Environment changes
- **Installs, upgrades, uninstalls**: name, version, source, scope (user or system), and reason. Cross-check against the toolchain versions in the ledger.
- **Heavy resource use**: GPU hours, large downloads, and disk used or freed. Free space at close must meet the floor in `defaults.md`.
- **Processes**: confirm that every process started in this session has been stopped.
## 9. Results vs. goals
## 10. Lessons
List the IDs added to or changed in `playbook/lessons.md`.
## 11. Deviations, incidents, errata
## 12. Next actions
