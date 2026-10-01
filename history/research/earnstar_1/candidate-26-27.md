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
