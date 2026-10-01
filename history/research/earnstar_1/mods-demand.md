# Mods: demand that a mod can now meet (S021)

_2026-10-02, day 1–2 after Claude Code 2.1.287 launched Mods. Gathered by a research subagent (read-only), checked and condensed by the developer. Method: the 300 open and 200 closed-as-not-planned issues in anthropics/claude-code with the most 👍, each checked against the mods docs (`overview`, `interface`, `events`, `api`, `reference`) and `mods/types/claude-code.d.ts`; all 226 comments on [#91870](https://github.com/anthropics/claude-code/issues/91870); GitHub repo and code searches. Caveats: code search hit the rate limit once, so repos created since 2026-10-01 may be missing; the theme counts in §3 are manual tallies. "#N" means github.com/anthropics/claude-code/issues/N. Raw data: `lab/earnstar_1/s021/` (git-ignored)._

## 1. Top requests and whether a mod can deliver them
| # | Issue (related issues) | 👍 | Created | State | Can a mod deliver it? |
|---|---|---|---|---|---|
| 1 | #45596 Bring Back Buddy | 1,186 | 2026-04-09 | open | **Yes**: a companion in the band or a pane (`Raster`/`Text`), reacting to `tool.call`/`turn.*`, state in `$.store` |
| 2 | #77136 Rhetorical tics | 438 | 07-13 | open | Partly: inject rules (`prompt.section`) or flag replies; cannot fix the model |
| 3 | #18170 Copy adds indentation (+#22073 79, #13378 75, #62699 74, #37796 59) | 297 | 01-14 | open | Partly: a clean-copy command via `$.ui.copy`; the renderer's hard wraps are out of reach |
| 4 | #24726 VS Code auto-attaches file/selection (+#20944 97) | 258 | 02-10 | open | Likely, unverified: hooks run in VS Code and `prompt.attachment` can drop an attachment kind, but the IDE kind is not named in the types |
| 5 | #65961 Verbose code comments | 250 | 06-07 | open | Partly: flag or deny comment-heavy edits |
| 6 | #13354 Continue when limit reached (+#35744 102) | 208 | 2025-12-08 | open | **Yes**: `usage().rateLimits[].resetsAt` + `$.clock.after` + `$.prompt.submit` |
| 7 | #28240 Prompt fires on `cd` in compound bash (+#30519 79, #27957 74, #91650 61, #30213 60, #13340 51, #18160 50, #30435 40) | 208 (≈620 in total) | 02-24 | open | **Yes**: `tool.check` can return `allow` after checking each part of the command; security-sensitive |
| 8 | #21151 No file name on folded Read rows | 186 | 01-27 | open | **Yes**: the `ToolGroup` render site exposes `calls[].input` |
| 9 | #23134 Disable paste collapse | 142 | 02-04 | open | No: the prompt box is not a render site |
| 10 | #25045 Let skills rename sessions (+#15762 40, #40346 14) | 130 | 02-11 | open | **Yes**: `$.tool.register` + `$.command.run('rename')` |
| 11 | #13585 Quota info in CLI (+#21943 48; not planned #516 129, #5621 47) | 126 | 2025-12-10 | open | Yes, via `$.session.usage()`; already crowded |
| 12 | #2254 Disable welcome banner | 121 | 2025-06-18 | open | Partly |
| 13 | #19649 Bash used instead of Read/Edit (+#87971 90, #90450 48, #88041 39) | 119 | 01-21 | open | Yes (rewrite the `auto_mode` attachment); an env-var workaround exists (#88041) |
| 14 | #53454 "load-bearing" | 119 | 04-26 | open | Partly: display-only rewrite |
| 15 | #37951 Hide inline diffs | 98 | 03-23 | open | Yes: replace `ToolResult` |
| 16 | #26904 `/delete` current session | 91 | 02-19 | open | Partly, via `$.process`; risky |
| 17 | #44763 Message timestamps (+#2441 63, #21051 54) | 90 | 04-07 | open | Yes: redraw `UserMessage`/`AssistantMessage` |
| 18 | #27242 Review context after compaction | 89 | 02-20 | open | Partly |
| 19 | #43326 Auto-pick model/effort | 70 | 04-04 | open | Yes: `turn.step` `{model, effort}` |
| 20 | #41456 Status bar in Desktop | 70 | 03-31 | open | Partly |
| 21 | #24968 Custom turn-duration verbs | 69 | 02-11 | open | Yes (terminal only) |
| 22 | #14375 Mermaid rendering | 60 | 2025-12-17 | open | Yes; already claimed by two mods |
| 23 | #33323 Prompt queue | 59 | 03-11 | open | Yes; already claimed (claude-queue) |
| 24 | #9516 User-interrupt hook | 53 | 2025-10-14 | open | Yes: `turn.complete.isAborted` |
| 25 | #42700 Read responses aloud (+ not planned #2189 15) | 35 | 04-02 | open | Yes, via `$.audio.speak`; Windows support unverified |

No mod can touch: #826 scroll to top (690), #1913 flicker (321), #18435 Desktop multi-account (844).

## 2. Already shipped?
- **Buddy (#1)**: as mods, a `games/pet` mod in davila7/claude-code-templates (32,269★ catalogue; from sezaakgun/cc-arcade, 36★, 09-13), rezzminator/buddy (1★, 09-27, [linked in #45596](https://github.com/anthropics/claude-code/issues/45596#issuecomment-5852196649)), tomada1114/clawd-band (0★), claudecafe cc-maid (1★). Earlier non-mod workarounds show that people star this: cpaczek/any-buddy **612★**, ramarivera/coding-buddy **466★**, grayashh/buddy-reroll 239★, fiorastudio/buddy 115★, talkvalue/Buddi 93★.
- **Compound-command permissions (#7)**: no mod; older hooks liberzon/claude-hooks 17★, broven/claude-permissions-plugin 5★.
- **Auto-continue (#6)**: no mod; wrappers saaranshM/unsnooze 166★ and scripts under 6★. The Desktop app already does this natively ([comment](https://github.com/anthropics/claude-code/issues/13354#issuecomment-5304658149), 2026-08-15); the CLI does not.
- **Read file names (#8), hide diffs (#15)**: no dedicated mod. firstmate-calm (in kunchenguid/firstmate, 7,421★) restyles the transcript but not these.
- **Timestamps (#17)**: diegorv "time" mod (0★); earlier plugin zoharbabin/claude-code-message-timestamps 70★.
- **Session rename (#10)**: built by one commenter, not published ([comment](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5715965902)).
- **Quota and context meters (#11)**: crowded (Arunjay4213/claude-mods, cache-tax, usage-weather, usage-wrapup, cctop, bullswarm, and day-one repos).
- **VS Code auto-attach (#4)**: only binary patches and gists that break each release ([#24726](https://github.com/anthropics/claude-code/issues/24726), comments of 09-14 and 09-16).

## 3. What #91870's commenters build (226 comments, 138 authors; Anthropic's @poteat 32)
| Theme | ≈ comments | Anthropic replied? |
|---|---|---|
| Guards, policy, fail-closed, permission logic | ~50 | Yes, many ([MCP via `tool.call`](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5531058610), [order](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5530555431), [isolation](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5546290346), [`.catch` fail-closed](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5588686533)) |
| Audit log, provenance, event stream | ~12 | Yes (`next.trace`) |
| Workflow panes (PR list, drawer, buttons, env manager, commits, Vercel) | ~10 | Partly |
| Secret/PII redaction | ~10 | Indirectly |
| Context injection and compaction control | ~10 | Yes ([`session.append`](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5840819337)) |
| Fleet dashboards, session titles | ~8 | Partly |
| Fun panes (games, Doom, pixel art, browser) | ~7 | Yes ([limits raised, WebAssembly planned](https://github.com/anthropics/claude-code/issues/91870#issuecomment-5702935782)) |
| Usage, cost, quota meters | ~6 | No |
| Windows shell pain as the motive | ~6 | No |
| Human-in-the-loop questions | ~4 | Yes (`$.ui.ask`) |

The thread is dominated by governance and hook power users; end-user UX asks live in the issue tracker.

## 4. Codex evidence
- Codex Desktop ships floating **Pets**, including custom pets (openai/codex #20730, #41465). In #45596, users cite it: ["codex is currently beating claude code in the buddy department"](https://github.com/anthropics/claude-code/issues/45596#issuecomment-5259680261) (08-11); [Codex Pets popular at work](https://github.com/anthropics/claude-code/issues/45596#issuecomment-5268944611) (08-12).
- Caution: the top Codex pet issues ask to **disable** pets (#34349 81, #34170 36, #44546 19). A companion must be opt-in and easy to switch off.
- Codex asks a mod can match in Claude Code: a sound when a task finishes (openai/codex #3962, 199 👍), a custom status line (#17827, 198 👍).

## 5. The subagent's top five (demand × unclaimed × buildable in ~40 h on Windows)
1. **A companion with original art** (not Anthropic's): 1,186 👍 and Codex Pets pressure; earlier workarounds 612★ and 466★; best mod-native attempt 1★. Risks: Anthropic could ship Buddy back as a built-in mod; the davila7 catalogue already distributes a pet; Buddy's own art or name would raise IP issues.
2. **A "transcript clarity" pack**: file names on folded Read rows (#21151), hide inline diffs (#37951), timestamps (#44763 + #2441 + #21051), custom turn verbs (#24968); ≈ 560 👍 combined; zero tokens; fully testable with `claude plugin test`; no mod competitor.
3. **CLI auto-continue at the limit reset** (≈ 310 👍): no mod; risk that the CLI gets the Desktop's native feature; a real end-to-end test means exhausting the quota.
4. **Compound-command permission fixer** (≈ 620 👍 over 8 issues): deterministic pain, 17★ competitors; a parsing bug would auto-approve commands, so it may only add allows when every segment already matches an allow rule, never override a deny.
5. **VS Code auto-attach blocker** (355 👍): tiny build; feasibility unverified (one-hour check needed).
