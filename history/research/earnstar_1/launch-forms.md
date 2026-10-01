# Which forms of repos won past platform launches (S021)

_2026-10-02. Research subagent (read-only), checked and condensed by the developer. Question: for the Mods launch (Claude Code 2.1.287, 2026-10-01), which form of project wins in a platform's first weeks, counting the misses? Data and scripts: `lab/earnstar_1/s021/forms/` (git-ignored: `all.tsv` lists the 235 classified repos with form codes, `hist2.jsonl` their star histories)._

## Method
GitHub search for repos created from launch day to day 21, sorted by stars; 235 on-topic repos with ≥ 300 stars (≥ 100 for DSH) classified by hand. Official platform repos, off-topic README hits, and tag riders excluded. Star histories from `/stargazers/history` (a scratch copy of `tools/starhist.mjs` that also records days to 1k); denominators from `tools/basecount.mjs`.

Launch dates (Claude Code changelog and `npm view @anthropic-ai/claude-code time`): MCP 2024-11-25; Claude Code hooks v1.0.38, 2025-06-30; plugins v2.0.12, 2025-10-09; Skills v2.0.20, 2025-10-16 (plugins and Skills pooled as "CC", window 10-09..11-06); DeepSeek Harness (DSH) 2026-08-13.

Queries (each combined with `created:<window> stars:>=300`): MCP `mcp`, `topic:mcp`, `topic:mcp-server`, `topic:model-context-protocol`, `"model context protocol"`, `mcp in:readme`, `claude`, `anthropic`, `server in:name`; hooks `hooks`, `hook claude`, `claude`, `topic:claude-code`, `"claude code"`; CC `skills`, `skill`, `topic:claude-skills`, `topic:agent-skills`, `claude`, `topic:claude-code`, `plugin claude`, `marketplace claude`, `"agent skills"`, `skills in:readme claude`; DSH `dsh`, `deepseek harness`, `topic:dsh-plugin`, `dsh-plugin`, `harness deepseek in:readme`, `deepseek` (with `stars:>=100`).

Forms: a list, b single tool, c pack, d builder, e manager/installer, f showcase/fun, g guide, h client/host/bridge.

## 1. Winners by form (≥ 300 / ≥ 1k stars today)
| Form | MCP | Hooks | CC | DSH | Pooled | Owners < 100 followers, of ≥ 1k |
|---|---|---|---|---|---|---|
| a list | 4/4 | 0/0 | 10/8 | 5/1 | 19/13 | 2/13 |
| b single | 48/16 | 3/3 | 22/8 | 29/7 | 102/34 | 14/34 |
| c pack | 1/0 | 1/0 | 38/19 | 3/2 | 43/21 | 2/21 |
| d builder | 6/3 | 2/0 | 4/3 | 1/0 | 13/6 | 3/6 |
| e manager | 2/1 | 1/1 | 10/2 | 2/1 | 15/5 | 1/5 |
| f showcase/fun | 0/0 | 1/1 | 1/1 | 8/2 | 10/4 | 2/4 |
| g guide | 0/0 | 1/1 | 3/1 | 2/1 | 6/3 | 0/3 |
| h client | 8/3 | 0/0 | 0/0 | 19/5 | 27/8 | 2/8 |
| **Total** | 69/27 | 9/6 | 88/42 | 69/19 | 235/94 | 26/94 |

Reached 1k within 21 days of creation: MCP 1 of 27 (punkpeye's list, day 12); hooks 0 of 6; CC 6 of 42; DSH 16 of 19. Median days to 1k: MCP lists 98, singles 153, builders 116, clients 136; hooks singles 64; CC lists 40, singles 83, packs 104, builders 59; DSH about 6.

## 2. Denominators (repos created in the window: all / ≥ 10 / ≥ 1k)
| Query (window) | Repos | 1k rate of all |
|---|---|---|
| `mcp` (MCP) | 956 / 327 / 28 | 2.9 % |
| `awesome mcp` | 9 / 7 / 4 | 44 % |
| `mcp in:name NOT awesome NOT sdk NOT client NOT framework` | 810 / 273 / 21 | 2.6 % |
| `mcp client` | 49 / 25 / 4 | 8 % |
| `hooks claude` (hooks) | 94 / 31 / 4 | 4.3 % |
| `plugin claude` (10-09..10-30) | 403 / 77 / 5 | 1.2 % |
| `awesome claude plugins` | 9 / 6 / 2 | 22 % |
| `skills claude` (10-16..11-06) | 680 / 218 / 23 | 3.4 % |
| … name contains "awesome" | 17 / 13 / 5 | 29 % |
| … plural name (skills/plugins/kit/marketplace) | 355 / 105 / 10 | 2.8 % |
| … singular name (-skill/-plugin) | 153 / 55 / 5 | 3.3 % |
| `topic:dsh-plugin` (DSH) | 12,888 / 951 / 20 | 0.16 % |
| `awesome dsh` | 104 / 25 / 1 | 1.0 % |
| `dsh desktop` | 1,468 / 80 / 4 | 0.3 % |

## 3. Small owners, packs, and singles
- **In the Claude Code and MCP launches, no repo from an owner with < 100 followers reached 1,000 within 21 days, in any form.** The fastest small-owner tools took 2–5 months (CC) or 5–15 months (MCP): RonitSachdev/ccundo (hooks; 38 followers; 573 stars in the first 21 days; 1k on day 60), severity1/claude-code-prompt-improver (Skills; 53; 541; day 83), breaking-brake/cc-wf-studio (builder; 87; 6; day 59); blazickjp/arxiv-mcp-server (57; day 153), MarkusPfundstein/mcp-obsidian (96; day 189), and three MySQL or calendar servers (days 378–436).
- **CC entries that reached 1k within 21 days had owners with 130–8,800 followers**: obra/superpowers (pack, 8,806; 5,133 in 21 days), travisvn/awesome-claude-skills (list, 420; 1,663), BehiSecc/awesome-claude-skills (list, 553; 1,979), yusufkaraaslan/Skill_Seekers (builder: docs to skills, 258; 3,432), numman-ali/openskills (loader, 509; 1,027), diet103/claude-code-infrastructure-showcase (showcase, 132; 6,688).
- **DSH was the exception**: small owners reached 1k within days (e.g., ccch1mneyyy/dsh-TUI, 39 followers, day 2, "officially recommended"; Small-tailqwq/dsh-deep-whale skins, 40, day 3), but some DSH growth may be inorganic (thousands of stars in a week from owners with < 40 followers, then flat; one description asks for stars); unverified.
- **Packs vs singles**: packs produced more CC winners (19 vs 8) but not a better per-repo rate (plural names 2.8 % vs singular 3.3 %); 20 of 21 pack winners had large audiences or brands (obra 8.8k followers, msitarzewski 7.0k, alirezarezvani 2.7k, K-Dense 1.7k). Themed packs (scientific-agent-skills 47k, AI-Research-SKILLs 13k, claude-trading-skills 2.9k) beat "my skills" collections.

## 4. When the winners broke out
- **MCP**: entering early secured a position, but stars came months later (singles, builders, and clients mostly peaked on days 100–160; wonderwhy-er/DesktopCommanderMCP had 6 stars on day 21, 9,870 now).
- **CC**: two waves. Early (days 1–7): BehiSecc, travisvn, Skill_Seekers, diet103. Late: ComposioHQ/awesome-claude-skills (412 on day 21; 1,154 in one day on day 25; 76k now), VoltAgent/awesome-agent-skills (1k on day 40), shanraisshan/claude-code-best-practice (1 star on day 21, 1k on day 99, 67k now), msitarzewski/agency-agents (595 on day 21, 1k on day 139). karanb192's earlier skills list reached only 528.
- **DSH**: almost everything was decided in days 0–3.

## Noise and limits
Follower counts are today's (inflated by success, so "< 100" is conservative); repo transfers skew owners (fastmcp moved from jlowin to PrefectHQ); creation date is not publication date (8 repos got their first star more than 21 days after creation); totals are not time-matched (MCP repos had 22 months, DSH 7 weeks); the classification is a judgement; search stems "skill" to "skills" and `OR` queries failed.

## Implications for a Mods-launch project (subagent, accepted by the developer with the notes in §5)
1. Use the Claude Code launches as the reference, not DSH: a single tool from a small owner never reached 1k in three weeks there; when it did, it took 2–15 months. A single mod is a slow, compounding bet that needs upkeep and directory listings to catch the second wave.
2. The fastest small-owner precedents were tools **about the new feature itself** (Skill_Seekers, a converter; openskills, a loader; diet103's showcase of a complete setup). For Mods: a scaffolder or test kit, a converter from hooks or status-line scripts to mods, or a showcase of a complete, real mod setup.
3. Lists have the best per-repo odds (29–44 % reached 1k in MCP and Skills; 1 % in DSH) but are winner-take-most; the top slot was not decided in week 1, yet brand and organization owners took it.
4. Do not choose a pack because it is a pack: give it one clear theme.
5. Ship in launch week, but plan for months 1–5: every winner was created in the window, while most stars came on days 40–160.

## 5. Developer's notes
- The project's scored horizon (close at 2–3 months, then close + 30 and close + 90 days) covers days 55–180 after the Mods launch, which is when most CC and MCP winners broke out. A launch-week entry is therefore measured at the right time, not only at its launch.
- The program's owner has 15 followers (L-000), so the small-owner rows apply to us; the realistic target for a single tool is a few hundred stars at close with a long tail, unless it rides a second wave of discovery (directories, lists, and search).
