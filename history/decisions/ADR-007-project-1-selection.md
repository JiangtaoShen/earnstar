# ADR-007: Project 1 selection — accent-insensitive linking for Obsidian

- **Date / session**: 2026-10-03 / S024 (draft)
- **Status**: on hold after the independent critique (`history/research/earnstar_1/critique.md`, ADR-007 section): by the playbook's one standard D scores higher (3.65 against about 3.1–3.4), demand for linking specifically is about 22 people, the plugin that owns the search words gets about 50 installs a month, and the spike has defects. The choice between N2 and D is put to the owner (STATE, "Awaiting owner").
- **Approved by**: developer (selection is within the developer's authority; the Obsidian account and the first listing are B-class and go through the outbox)

## Context
S024 restarted project 1's selection under ADR-005 (people first, no promotion). A first round over four groups (Windows developers, maintainers, local-GPU Python users, researchers) produced ADR-006, which its critique withdrew (L-034), and a landscape audit knocked out the GPU candidate. A measurement of discovery channels then showed that without promotion, new tools from unknown authors get real use mainly through in-app registries, Obsidian's first (L-035). A second round over Obsidian and ComfyUI users found both registries saturated except for one Obsidian need with an unmet core, which passed an independent pre-ADR landscape audit as "partly met" and an end-to-end spike in the real app. The P0+P1 ceiling (2026-10-09) may be exceeded because of the owner-ordered restart (recorded reason).

## Selection Gate checklist
- [x] People and need with quotes and links from at least five independent people: forum t/1655 (154 posts, 2020–2026) and related threads (`s024/needs-G5-obsidian.md` N2; `candidate-N2-accents.md` §1).
- [x] Existing solutions found in the users' languages and checked in code; independent landscape audit before this ADR; negatives verified by the developer (`s024/audit-N2-accents.md`; S024 log 09:09–09:11).
- [x] Prototype on realistic tasks from the users' descriptions, end to end in Obsidian 1.13.7 (`candidate-N2-accents.md` §3).
- [x] First version, learning plan, first three iterations (below).
- [ ] Independent critique recorded, every objection answered.
- [ ] Decision confirmed in a later session.

## The people and the need
Obsidian users who write in languages with accents or diacritics and want to link and switch to notes without typing the accents exactly: "Start typing "[[" to link to another page whose name has a diacritic … The matches don't appear"; "I write my notes in Spanish … I stumble upon this almost daily". Most are not developers and cannot build a workaround; today they keep unaccented aliases on every note or duplicate words in file names.

## Options (one standard, `needs.md`)
| Candidate | Need | Unmet | Serve | Find | Improve | Weighted |
|---|---|---|---|---|---|---|
| **N2 accent-insensitive linking (Obsidian)** | 4 | 3 | 4 | 3 | 3 | **3.50** |
| D who owes the next reply (maintainers) | 4 | 2 | 5 | 3 | 4 | 3.65 |
| C LaTeX track changes that compile | 4 | 3 | 3 | 3 | 3 | 3.30 (not audited) |
| A agent-broken encodings | 5 | 2 | 3 | 2 | 3 | 3.25 |
| B PyTorch/GPU doctor | 4 | 2 | 2 | 2 | 2 | 2.60 |

N2 and D are within noise. `research.md` §3's tie-break prefers the users the developer understands best and whose need it meets in its own work. That rule exists because daily use is the most reliable feedback without promotion; neither candidate gives the developer daily use now (the program's repos have no issues to triage, and the developer does not write accented notes), so the rule does not separate them. The decision therefore rests on the principle of ADR-005: D's people (maintainers) already solve their problem themselves with workflows that work (1 stale label in 15, S024 log 06:43–06:47); N2's people cannot, keep paying for it daily, and look for plugins in a registry where new plugins get real use. **N2 is selected.**

## Why existing tools fail these users
No plugin and no native feature makes Obsidian's own `[[` suggestions, quick switcher, or in-file find ignore accents (verified eight ways, in five languages). The alternatives make the user change gesture or window (Omnisearch, Another Quick Switcher, Symbol linking, Various Complements with an option off by default), which users in the thread reject. In-app searches for "accent" or "diacritics" find no linking plugin.

## Decision
Build project 1 as an Obsidian community plugin that makes link suggestions and note switching ignore accents and diacritics, while keeping Obsidian's own popups, ranking, and behaviour.

### First version (release by day 35 after kickoff, 2026-10-30)
1. `[[` file and alias suggestions, and heading suggestions (`#`, `##`), find notes when the typed text differs only by accents, case, or diacritics; extra matches are appended to Obsidian's own results with correct highlights; a query typed with accents ranks the exactly accented note first.
2. The quick switcher does the same.
3. Built-in folding for Latin, Greek, Vietnamese, Arabic, and Hebrew marks and for letters that do not decompose (ß, æ, œ, ø, ł, đ, ð, þ, ı); a setting per surface; any internal error or unknown Obsidian version falls back to native behaviour and says so once.
4. End-to-end tests on Windows and Linux in CI with wdio-obsidian-service on the earliest supported and the latest public Obsidian; README in the users' words (who it is for, a recorded before/after made by the test suite, quick start, an honest comparison with Omnisearch, Another Quick Switcher, Various Complements, Symbol linking, and CJK Search, and when those are the better choice); MIT; no telemetry; no network.

### How the project will learn after release (no promotion)
- **Users**: issues and discussions, answered within the next session; questions the README should have answered become README changes.
- **Usage signals**: Obsidian's public per-plugin download counts (`community-plugin-stats.json`) as the main signal, compared with the measured cohort of first-time authors (median about 300 at 60–94 days, L-035); GitHub traffic and referrers.
- **Release watch**: each session checks Obsidian's public and early-access changelogs; each release reruns the end-to-end suite; a native fix is announced in the README and the plugin steps aside.
- **The developer's own use**: the developer keeps multilingual fixture vaults built from the forum's examples and runs them on every Obsidian release.

### First three iterations (expected)
1. In-file find and replace (Ctrl+F) ignoring accents.
2. Whatever users report first: missing letters or scripts, ranking, conflicts with other suggestion plugins (Various Complements, Omnisearch, CJK Search, Fuzzy Chinese Pinyin).
3. Core search ignoring accents, if Omnisearch's separate window proves not to be enough for users.

## Predictions (falsifiable)
Base rates (L-035): first-time authors' new Obsidian plugins reach a median of 293 downloads at about 60–94 days; 16.9 % reach 1,000; stars are about 0.8 per 100 installers.
- **Downloads**: 300–1,500 by release + 60 days (median 500), above the cohort median because the search words are unclaimed and the need is daily.
- **Stars at close** (≥ 2026-11-25): 0–6 (median 2). Stars will lag real use in this channel.
- **Users**: at least one issue or discussion from someone other than the developer by release + 30 days.
- **Kill or pivot signals at the first iteration review (release + 14 days)**: fewer than 100 downloads above the bot floor (about 36 per version) and no external issue → re-examine the name and description words before any feature; a native accent fix in Obsidian → announce it and stop feature work; CJK Search or another plugin adds accent folding for `[[` → compare honestly and consider joining efforts (contributions to other projects go through the outbox).

## Outbox items this implies (B-class)
- An Obsidian account connected to the program's GitHub account, and the first listing in the Community directory (owner approval; the owner creates or supplies the account).
- Optional: short README sections in Spanish, French, and Portuguese, the users' languages (Constitution §3B, non-English content).

## Expected outcome
People who write in accented languages find the plugin by searching "accents" or "diacritics" in Obsidian, install it in a minute, and link to their notes without retyping accents; the project improves from their reports. Review at the first iteration review and at close.

## Result
To be filled in at the review date.
