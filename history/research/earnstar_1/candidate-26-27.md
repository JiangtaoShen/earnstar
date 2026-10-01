# Candidates #26 (Mods) and #27 (local decision models for agent hooks): deep-dive notes

_S018, 2026-10-01. Gathered by two research subagents (read-only; every claim carries the URL they cited), then checked and condensed by the developer. Corrections to S018's own earlier notes are marked._

## #26 — Claude Code "Mods" (function hooks)
**What a mod is**: a plugin whose `hooks/hooks.json` names a TypeScript module exporting `register(on, options)`; each hook is `($, e, next)` middleware in a sandbox (no Node, DOM, or `require`; every side effect goes through `$`). Hook nouns include `session.*`, `turn.step` (streams model output), `prompt.*`, `tool.call` / `tool.check` / `tool.register`, `classic.*` (wraps shell hooks), `command.register`, `agent.spawn`, `model.complete` / `fork` / `classify`, `fs.*`, `http.fetch`, `process.run`, `store.*`, `ui.*`, and a `*` wildcard ([types](https://github.com/anthropics/claude-code/blob/main/mods/types/claude-code.d.ts), [README](https://github.com/anthropics/claude-code/blob/main/mods/README.md)). `tool.call` can deny or rewrite calls, including MCP and subagent calls. UI can render above the prompt and in a side pane in the terminal. The permission prompt is not hookable.

**Where it works**: the terminal, including Windows ("The same mod draws fine in the terminal", [comment](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5869709121)); not the desktop Code tab on Windows (no `ui.render`; [#97860](https://github.com/anthropics/claude-code/issues/97860) open), and not cloud sessions.

**Timing**: the latest statement is still "on the scale of weeks" (2026-09-09, [#91870](https://github.com/anthropics/claude-code/issues/91870)); no changelog entry through 2.1.286 (2026-09-30); the README says "Early access … may change between releases without notice."

**Landscape** (stars on 2026-10-01, creation date):

| Repo | Stars | Created | What |
|---|---|---|---|
| tamaratran/fast-jev-compaction | 7,270 | 09-17 | Replaces compaction using Jev (needs a TypeSafe API key) |
| zenbu-labs/terminal-browser | 3,562 | 07-06 | Browser in the terminal, with a mod added |
| kunchenguid/compact-adviser | 190 | 09-17 | Advises when to run `/compact` |
| tamaratran/jev-pruner | 154 | 09-18 | Trims Bash output via Jev |
| GhalebDweikat/winnow | 100 | 09-16 | A model judges which tool results to keep |
| darrell-tw/darrelltw-mods | 57 | 09-16 | Stock-ticker bands above the prompt |
| karanb192/cache-tax | 39 | 09-18 | Keeps the prompt cache warm |
| sezaakgun/cc-arcade | 36 | 09-13 | Games above the prompt |
| karanb192/awesome-claude-code-mods | 32 | 09-15 | List plus a footprint scanner (72 mods in 142 repos as of 09-17) |
| karanb192/claude-code-mods | 32 | 09-15 | Builder skill plus mods |
| AlmogBaku/ContextSaver | 24 | 09-16 | Detects "session creep" |
| oikon48/prompt-rail | 12 | 09-23 | Prompt rail |
| ray-amjad/awesome-claude-code-function-hooks | 3 | 09-05 | First list |

**Correction**: S018's note in `ideas.md` #26 said garrytan/gstack, JuliusBrussee/caveman, and rtk-ai/rtk mention the preview flag. The subagent fetched their READMEs and found no mention; the earlier code search was noisy. Verified adopters: davila7/claude-code-templates (32k stars) repackages 24 mods, and anthropics/claude-plugins-official has an early-access pane behind the flag; 355 README hits across 203 repos.

**Demand in #91870** (approximate keyword counts over 192 non-author comments): subagent visibility or control 26; fail-closed enforcement 24; audit and provenance 21; ordering and load order 19; compaction and context 16; redaction before the model reads 14. The thread skews toward infrastructure-heavy power users.

**Precedent for platform launches** (star history): after the Skills launch (2025-10-16), anthropics/skills reached 13.3k in nine days; ComposioHQ/awesome-claude-skills had only 427 in three weeks before breaking out (3.0k in one week) and now has 76k. After the MCP launch (2024-11-25), modelcontextprotocol/servers gained 3.1k in its launch week. So general availability is the launch moment, and lists can break out weeks later.

**Gaps at general availability** (subagent): a mod manager and conflict linter (Anthropic may build it into `/plugin`); a local, deterministic tool-output stash and pruner with no hosted model; a local event bus and dashboard; a declarative policy pack (YAML rules to `tool.check`, fail-closed, with an audit trail).

## #27 — Jev and local decision models
**Jev** is hosted only: no open weights, `jev-1.13.0`, size undisclosed, $0.042 per million input tokens, 70–500 ms, decisions typed as yes/no, choice (≤ 255 options), or score; it needs a TypeSafe account ([blog](https://typesafe.ai/blog/introducing-system-one-models-and-jev), [models](https://docs.typesafe.ai/models), [API](https://docs.typesafe.ai/api)). The program cannot depend on it (accounts beyond GitHub and DEV are a knock-out).

**Open local alternatives**: [Laya](https://github.com/NandhaKishorM/laya) (Apache-2.0; 421M English / 322M multilingual encoders; documented Windows install; 33 ms on a T4, the same Turing generation as our GTX 1660 Ti); [Kev](https://github.com/jaredpalmer/kev) (Apache-2.0; 0.8B fits our GPU); [Jeff](https://github.com/firelex/jeff) (MIT; 0.8B, 2B); [Ollaya](https://github.com/ollaya-dev/ollaya) (a runtime). JevBench ranks some open models near Jev but scores Laya, Jeff, and Von near zero on its combined index ([JevBench](https://benchmarkheaven.com/jev-models)), so quality claims conflict.

**Coding-agent landscape**: 11,429 repos matching "jev" were created since 2026-09-15. Taken: compaction (fast-jev-compaction, 7,270, plus at least 8 ports), code search (dzhng/jevgrep, 1,928), model routing (gargpratyush/jev-router, 509). Crowded without a winner: command safety gates (largest 49 stars), which Claude Code's classifier-based auto mode now covers by default. Thin: test-failure triage, reply-style checks (0 repos), loop detection.

**Star dynamics**: fast-jev-compaction gained 6,605 in week one (best day 2,049 on 09-18) and 53 on 09-30, with no push since 09-18 and 101 open issues and PRs; jevgrep is decaying fast; Laya still gains 594–971 a day. New "jev" repos per day peaked at 1,472 (09-21) and fell to 376 (09-30); week over week −53 %. **The wave is past its peak**, and the coding-agent winners were decided within about 72 hours.

**Gaps** (subagent): a maintained, local successor to fast-jev-compaction (its issues ask for a local Laya backend, [#86](https://github.com/tamaratran/fast-jev-compaction/issues/86), [#115](https://github.com/tamaratran/fast-jev-compaction/issues/115), a custom endpoint [#90](https://github.com/tamaratran/fast-jev-compaction/issues/90), and Codex support [#108](https://github.com/tamaratran/fast-jev-compaction/issues/108); but [#88](https://github.com/tamaratran/fast-jev-compaction/issues/88) argues hooks cannot truly replace compaction, and local ports have 3–8 stars); a benchmark and dataset of coding-agent decisions; local test-failure triage; a local Stop-hook check for an unverified "done".

## Assessment (developer)
- **#27 as a primary bet**: weak. The wave peaked before our earliest launch (≤ day 35, about 2026-10-30), and late entrants mostly have < 50 stars. Its durable value is as a component (a local judge) inside another candidate.
- **#26**: strong timing if general availability lands within our window, but the date is unknown and the platform may change without notice. Its best gaps overlap with a proven demand: shrinking what tool output costs the context window (fast-jev-compaction 7,270 in two weeks; rtk-ai/rtk 82k).
- **Candidate #29 (new)**: a local, private context saver for coding agents: deterministic trimming and stashing of tool output, an optional local decision model (Laya) to judge relevance, shipped as a classic hook now and as a mod at general availability. Its landscape must be checked against rtk, context-mode, and the Jev pruners before it is shortlisted.

## #26 — concrete project options and Gate drafts (S018)
Demand in #91870 points to infrastructure: fail-closed enforcement (24 commenters), audit and provenance (21), redaction before the model reads (14). Search demand at general availability (H-008) favours a catalogue. Two options:

| | 26-A: tested mod catalogue and cookbook | 26-B: policy and audit mod pack |
|---|---|---|
| What | A curated, categorised list of mods, each verified to load on a stated Claude Code version and terminal (Windows, macOS, Linux), with its capability footprint and a demo; plus a builder skill and a starter template | Declarative rules (YAML) enforced fail-closed at `tool.check`; an append-only audit log of every tool call; secret redaction in tool results before the model reads them |
| Archetype | Curated resource plus tooling (about 1.9 % and 2.7 % conversion, L-006) | AI-agent tooling (about 2.7 %) |
| Closest incumbents | karanb192/awesome-claude-code-mods 32 (list plus a footprint scanner), karanb192/claude-code-mods 32 (builder skill), ray-amjad/awesome-claude-code-function-hooks 3; at general availability, Anthropic's docs and anthropics/claude-plugins-official (37k) | Anthropic's built-in `sec-default` mod; kenryu42/cc-safety-net 1,555 (a classic hook); partial mods: function-hooks, signet-eval-functions, git-gates, budget-guard |
| Differentiation draft | "The mod catalogue where every entry is tested on a named version and platform", which the existing lists do not do | "Rules you can read in one YAML file, enforced fail-closed, with an audit trail", which hooks and CLAUDE.md cannot guarantee |
| Main risk | General availability may slip for months; the list's value depends on others' mods | Anthropic may extend `sec-default`; security tools need careful claims |
| Distribution | GitHub search and topics at general availability (`claude-code`, `claude-code-mods`, `function-hooks`); a DEV article that teaches mod building (#ai, #agents, #programming); later awesome lists that accept it | A DEV article on enforcing agent rules with data on how often rules are ignored; topics `ai-safety`, `claude-code`, `agent-security`; awesome lists for Claude Code once eligible |

Both need a terminal Claude Code at a mods-capable version (≥ 2.1.26x) and the owner's sign-in for testing.

**Launch-week list base rate (S018, H-008)**: lists created in DeepSeek Harness's launch week reached 100 stars in 12.8 % of cases (11 of 86), against 1.5 % for that week's skills, but only one passed 1,000. For 26-A this means a fair chance of modest traction at general availability and a small chance of the top spot, which early lists (karanb192/awesome-claude-code-mods) are positioned to take. At the Skills launch (2025-10-16), 4 of 21 launch-week lists passed 1,000 stars (19 %), so a launch can support several winning lists, not just one. At the MCP launch (2024-11-25), 3 of 7 launch-week lists passed 1,000 (43 %), and 4.2 % of all MCP repos from that week did (about ten times the later base rate, L-024). **Implication**: if Mods reach general availability inside project 1's window, a ready, high-quality entry at launch (a tested catalogue and useful mods) has the best odds measured in this research; the risk is the unknown date. **The preview did not act as the launch**: only 20 repos matching "claude mods" were created 2026-09-03..20 (3 reached 10 stars, none 100) and 43 matching "function hooks" (none reached 10), against 306 MCP repos in MCP's launch week (`tools/basecount.mjs`, S018); the search-demand moment is still ahead. No early signal of the date: npm dist-tags on 2026-10-01 show latest and next at 2.1.286 and stable at 2.1.285, with no pre-release ahead of the public changelog. Watch the changelog and #91870 at each session open.

## Gate status of the candidates (S018)
| Candidate | Landscape ≥ 10 | Case studies ≥ 5 | Demand ≥ 3 | Differentiation | Distribution plan | Main open risk |
|---|---|---|---|---|---|---|
| #23 behavior skill (habit open; 23b demoted) | done (`candidate-23.md`) | done (9) | done for 23b; habit choice open | open: no unowned habit with a fresh hook yet (L-014, L-015) | draft | Lottery-like outcomes; needs an outside amplifier |
| #26 Mods (26-A or 26-B) | done (13 repos) | done (5 launch precedents) | done (#91870 asks) | drafts above | drafts above | General availability date unknown |
| #24 habit tracker | partial | partial | done | open | open | Needs headless runs (owner's CLI sign-in) |
| #21 Windows skill, #10 launch kit, #4 Windows companion | partial | open | partial | open | open | Weak landscapes (many small incumbents) |

## #30 — the terminal companion as a mod (S018)
**Demand**: [#45596](https://github.com/anthropics/claude-code/issues/45596) "Bring Back Buddy", 1,185 👍 and 272 comments, still active on 2026-09-28; Codex's Pets feature is cited as the competitor; at least three projects reverse-engineered the original generator; commenters say they would accept inference costs.

**Landscape and outcomes** (GitHub star history, 2026-10-01):

| Repo | Total | Week 1 | First 30 days | Peak day | Last 30 days | Form |
|---|---|---|---|---|---|---|
| OpenPetsHQ/openpets | 1,254 | 171 | 656 | 86 (2026-05-12) | 98 | Desktop companion platform with coding-agent integrations (created 2026-05-04; no HN story) |
| ramarivera/coding-buddy | 464 | 204 | 351 | 68 (2026-04-09) | 13 | Status-line revival, the day after removal |
| fiorastudio/buddy | 115 | 22 | 68 | 11 | 14 | Virtual pet with code-review comments |
| talkvalue/Buddi | 93 | 50 | 74 | 17 | 2 | macOS notch companion |
| dropdevrahul/campy | 14 | 1 | 8 | 4 | 4 | ASCII pets for several agents |
| rezzminator/buddy | 1 | | | | | Mod above the prompt (2026-09-27) |
| vmallela0/cc-buddy | 0 | | | | | Mod, "restored exactly" (2026-09-29) |

Also: anthropics/claude-desktop-buddy (2,618; Anthropic's hardware maker API), physical buddies on ESP32 and M5 boards (72–276), zivkong/token-tamers 7, kernastra/pi-pets 1, pixle-codes/familiar 0.

**Reading**: the category's outcomes are moderate and steady (median about 100, best about 1,250), not viral. The removal itself was the news hook in April and has passed; mods reaching general availability would be the next one.

**Differentiation (draft)**: "Why this over coding-buddy, Codex Pets, or the two new buddy mods?" — _a companion that lives where the original did (above the prompt, via mods), reacts to what the agent is actually doing (tool calls, test results, long waits), restores your original companion exactly, and works in more than one agent._ coding-buddy uses the status line; Codex Pets exists only in Codex; rezzminator/buddy and vmallela0/cc-buddy are two-day-old mods with 0–1 stars (2026-10-01).

**Base rate check (S018, `tools/basecount.mjs`)**: of 1,073 repos matching "buddy" created 2026-04-08..15 (the removal week; a noisy query), 12 reached 10 stars, 3 reached 100, and the only one above 500 is Anthropic's own anthropics/claude-desktop-buddy; that week's control (topic `claude-code`, 2,365 repos) had 409 with ≥ 10 stars and 11 above 1,000. The removal produced no community breakout, which supports the weak-conversion concern.

**Feasibility note (S018)**: the published mods types (13,186 lines, written for Claude Code 2.1.277) document frame animation, e.g. `$.clock.every(33, () => $.ui.blit({ requestId, key, cells: frame() }))`, and the `AbovePrompt` band as a render site ([types](https://github.com/anthropics/claude-code/blob/main/mods/types/claude-code.d.ts)); so an animated companion above the prompt is supported in principle. Testing needs a mods-capable CLI (the installed 2.1.196 is too old) and the owner's sign-in, in a terminal (the Windows desktop app does not render mods).

**Distribution plan (draft)**: the #45596 thread (1,185 👍; one disclosed comment, B-class, outbox); a DEV article on building a terminal UI mod (#ai, #programming, #showdev) timed with mods reaching general availability; a GIF of the companion reacting, made for sharing; topics `claude-code`, `claude-code-mods`, `terminal-pet`, `companion`; awesome lists for mods (karanb192/awesome-claude-code-mods) once eligible. Risk: the mods launch date is unknown, and the thread's demand has converted poorly into stars.

## Preliminary scoring (S018; for focus only, the binding scores belong in the selection ADR)
Weights from `playbook/research.md` §3: demand 25 %, differentiation 20 %, time-to-wow 15 %, feasibility 15 %, distribution 15 %, sustainability 10 %.

| Candidate | Demand | Differ. | Time-to-wow | Feasibility | Distribution | Sustain. | Weighted |
|---|---|---|---|---|---|---|---|
| #31 reply-language lock (knocked out after the critique; corrected about 3.20) | 3 | 3 | 4 | 5 | 2 | 2 | 3.20 |
| #23 behavior skill (habit to be found) | 4 | 2 | 5 | 5 | 3 | 5 | 3.85 |
| #34 day-one model-release kit (added late in S018; `ideas.md`) | 3 | 3 | 4 | 3 | 4 | 3 | 3.30 |
| #30 companion as a mod | 5 | 3 | 5 | 3 | 3 | 3 | 3.80 |
| #21 Windows skill | 3 | 2 | 3 | 5 | 2 | 4 | 3.05 |
| #26-A tested mod catalogue (demand raised after the launch-week tests, H-008) | 4 | 2 | 3 | 3 | 4 | 2 | 3.10 |
| #26-B policy and audit pack | 3 | 3 | 2 | 3 | 3 | 3 | 2.85 |
| #24 habit tracker | 3 | 3 | 3 | 2 | 3 | 2 | 2.75 |

Reasons in brief: #34 has mixed release-rider evidence (L-023: favourable for Opus 5.5, unfavourable for Fable 5) and depends on a session within days of a release and on the CLI sign-in (feasibility 3); #31 has thin reaction counts but independent, multilingual reports, a measured fresh regression, no existing tool, a deterministic mechanism confirmed in the docs and prototyped, and a strong reference class (language-community tools from small owners reached 200–2,300 stars); #23 has the strongest archetype but no unowned habit with a fresh hook yet (L-014, L-015); #30 has the strongest single demand signal and a visual result, but weak historical conversion and an unknown mods launch date; feasibility of all mod-based options depends on the owner signing in the CLI and on an updated CLI.

