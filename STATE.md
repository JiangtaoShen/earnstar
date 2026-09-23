# STATE — handoff

_Last updated: 2026-09-24 by S008 (admin)._

## Program
- **Program start**: — (set at the first `start work`)
- **Program end**: —
- **Phase**: not started. The next project is `earnstar_1`.

## Current project
| Field | Value |
|---|---|
| Key / name | earnstar_1 / — |
| Kickoff | — |
| Earliest / latest close | — / — |
| Phase | — |
| Sessions / active hours | 0 / 0 |

## Open session
- **ID**: —
- **open_utc**: —

Both are empty when no session is open.

## Next actions
1. At the first `start work`, kick off project 1:
   - Set the program and project dates here.
   - Mark `earnstar_1` as `active` in `repos.json`.
   - Clone it over HTTPS into `projects/earnstar_1/` and install the content-check hooks: `node tools/check.mjs --install projects/earnstar_1`.
   - Begin P0 with the foundational study (`playbook/research.md` §1), then work through the stages to the Selection Gate. No building before the Gate passes.

## Owner promotion accounts
| Platform | Status | Registered | Username |
|---|---|---|---|
| Hacker News | ready (owner-reported) | 2026-09-24 | not provided; record it from the first post URL |
| Reddit | ready (owner-reported) | 2026-09-24 | not provided; record it from the first post URL |

- Credentials stay with the owner only (Constitution §3C). The registration email is intentionally not recorded in this public repo.
- Both accounts are new. Many subreddits gate posting on account age and karma, and Reddit is unreachable from the developer's environment (L-002), so the owner checks target subreddit rules when an outbox item asks. Genuine participation before launch helps; karma farming does not and is not advised. HN posts and comments must be written by the owner personally (L-001).

## Awaiting owner
- **Reddit channel decision** (S008). Reddit is unreachable from the developer's environment (L-002), so every Reddit rule check, research lookup, and metric depends on the owner. Options: keep Reddit on these terms, or replace it with a platform the developer can reach. Not blocking until the P3 launch plan.

## Session history
| ID | Date (Asia/Shanghai) | Kind | Summary |
|---|---|---|---|
| S000 | 2026-09-23 → 2026-09-24 | setup | Root project designed with the owner and built (ADR-001) |
| S001 | 2026-09-24 | admin | Owner created `earnstar_1`…`earnstar_6` (public, empty); Constitution §3A amended: root never renamed |
| S002 | 2026-09-24 | admin | Machine recording added (`tools/machine.mjs`, ledger field, §4/§6/§7/§9 amended); primary machine `m-6da16b4278d0` |
| S003 | 2026-09-24 | admin | Audit extension (7 items): transcript archive + hashes, owner involvement, agent config, work composition, channels, community/adoption, supply chain; `cleanupPeriodDays` = 365 |
| S004 | 2026-09-24 | admin | Owner reported HN and Reddit accounts ready; recorded without personal identifiers |
| S005 | 2026-09-24 | admin | Research made a hard gate: Selection Gate, foundational study, spike, pre-mortem, independent critique, research floor, pivot review; Constitution §5/§6 amended |
| S006 | 2026-09-24 | admin | Owner handed over the workstation during sessions: local experiments, installs from trusted sources, web learning (§3A), with guardrails (§3C); `lab/` added; toolchain versions tracked |
| S007 | 2026-09-24 | admin | Environment reuse policy (`playbook/workstation.md`), private env inventory (`tools/envs.mjs`), C: added to the free-space floor |
| S008 | 2026-09-24 | admin | Full audit: repo made Chinese-free (owner order), `tools/check.mjs` and hooks, machine ID scheme v2 (`m-be80e7832908`), open-step ordering fix, HN rules verified (L-001), Reddit found unreachable (L-002) |

## Notes
- `earnstar_1`…`earnstar_6` were created public on 2026-09-24, so development happens in the open. Making a repo private is B-class; it cost nothing while stars were 0.
