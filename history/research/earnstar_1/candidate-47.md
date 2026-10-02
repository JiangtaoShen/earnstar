# Candidate #47: a local monitor of changes in your Claude Code sessions

**Status: knocked out by the independent critique (S022, `critique.md`, ADR-004 section): near-identical products at 0–2 stars (nerfwatch, nerfd, iqdrop) and the serving model and effort already shown by claude-hud.**

_S022, 2026-10-02. Proposed by the independent selection panel (`panel-s022.md`); verified and extended by the developer. Gate items: landscape, case studies, demand, differentiation, distribution, feasibility._

## 1. The idea
A zero-token, local CLI that reads the Claude Code transcripts already on the user's disk (`~/.claude/projects/**/*.jsonl`) and answers "did my sessions change, and when?": which model actually served each turn (silent reroutes and fallbacks), the effort applied versus requested, output and thinking tokens per turn by model and effort over time, and serving fields such as `service_tier` and `speed`, with change detection that states its uncertainty. At each model release the developer publishes a reference panel (a fixed task mix run in headless Claude Code) so users can compare their own numbers. No network, no telemetry, nothing leaves the machine. The name must not contain "Claude" (L-013).

## 2. Verification by the developer (S022)
- **Transcript fields** (field names only, read from this session's own transcript; no content): assistant messages carry `message.model`, `message.usage` with `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`, `output_tokens_details`, `service_tier`, `inference_geo`, `iterations`, `speed`, `fallback_credit`; entries carry `effort`, `perTurnEffort`, `version`, `requestId`, `timestamp`. The program's `tools/usage.mjs` already parses this format.
- **Codex-side precedents from small owners** (`tools/starhist.mjs`, 2026-10-02):

| Repo | Owner followers | Created | Week 1 | First 30 days | Total | Last 30 days | What |
|---|---|---|---|---|---|---|---|
| xqy2006/ModelTrace | 30 | 2026-08-27 | 50 | 938 | 1,170 | 1,124 | Active probing of which model answers (Chinese description) |
| haowang02/codex-candy-eval | 51 | 2026-06-21 | 185 | 735 | 1,122 | 198 | "Codex dumbed-down test" [translated] |
| kiyoakii/is-gpt-nerfed | 81 | 2026-09-15 | 163 | 233 | 233 | 233 | "Shrinkflation detector for Codex", zero-token reader of Codex's records |
| ysh1112/codex-model-watch | 0 | 2026-09-20 | 165 | 190 | 190 | 190 | Codex model watch |

- **Claude side** (`tools/crowding.mjs --since 2026-01-01`, eight phrases in users' words including Chinese: "claude" plus the Chinese word for "dumbed-down", "claude nerf", "claude nerfed", "opus degraded", "claude shrinkflation", "claude reroute", "claude code model monitor", "claude" plus the Chinese word for "IQ"; output `lab/earnstar_1/s022/crowd/claude-nerf.md`): 143 entrants, median 0, max relevant 28 (lukehutch/unnerfcc, which changes system prompts, not a monitor); direct attempts at 0–8 stars: daimon3332/model-detect 8 (provider monitor with real CLI checks), shonkaearn-lab/ClaudeTroubleshoot 0 ("Finds the root cause of 'model nerfed' issues"), MelbPaulZ/claude-code-model-monitor 0, coldhighsun/AIUsageMonitor 1. A thin bottom tier: a few attempts, none with a release-panel or a change-detection method.
- **Adjacent incumbents (usage and cost, not change)**: ccusage/ccusage 18,835 (pushed 2026-10-02), Maciek-roboblog/Claude-Code-Usage-Monitor 8,731, Javis603/token-monitor 2,553, tddworks/ClaudeBar 1,516, hoangsonww/Claude-Code-Agent-Monitor 1,037. Risk: users file #47 under "another usage monitor"; the README must lead with change, not cost.
- **Demand**: [#78888](https://github.com/anthropics/claude-code/issues/78888) (open, 20 👍, 2026-07-18): "Fable 5 safeguard flag silently reroutes sessions to Opus 4.8 for hundreds of turns with no persistent indicator" (verified); HN stories at 993, 914, and 425 points (panel; to be re-checked by the critique).

## 3. Differentiation (draft)
"Why this over ccusage, livenerf, or the Codex nerf detectors?" ccusage and the usage monitors show cost and limits, not whether the model or its behavior changed; livenerf runs one central benchmark that cannot see your sessions; the Codex detectors do not read Claude Code. One sentence: **"Find out, from your own Claude Code logs and without spending a token, whether the model serving you changed: silent reroutes, effort, and thinking-token shifts, with honest error bars and a reference run at every model release."**

## 4. Distribution (draft)
- Launch moments (L-028): v0.1 with a DEV data article built from the program's own audit trail (real numbers, not a demo); a reference panel at each model release (Anthropic releases came every one to eight weeks in 2026); a monthly report; a DEV follow-up ≥ 3 weeks after launch.
- Passive: GitHub search in users' words ("claude nerfed", "opus degraded", "claude code model"), topics, npm.
- B-class (owner approval each time): one disclosed reply in #78888, where the user did this job by hand.
- Under (b+c): a Show HN on a measured finding; a Chinese README and posts where the "dumbed-down" meme drives Codex detectors to 1k+.

## 5. Risks
1. Signal versus noise: token trends shift with the task mix, so verdicts may be weak or mostly "all clear" (the spike gate tests it).
2. Anthropic adds a persistent model indicator (#78888's ask), removing the reroute half.
3. ccusage adds a change view.
4. Transcript schema churn between releases.
5. Claims about a vendor's model must be measured and stated with uncertainty (Constitution §3C: no unverifiable claims).
6. Positioning among usage monitors.

## 6. Spike gate (≤ 4 h; S022)
From transcripts alone, detect two induced changes on a fixed task mix (effort high vs low; Opus 5.5 vs Sonnet 5.5) with ≥ 90 % detection and ≤ 10 % false alarms on unchanged windows of the program's own archive. Results: see §7.

## 7. Spike results (S022, 16:12–16:17; data in `lab/spike/monitor/`, git-ignored)
**Step 1, passive logs (zero tokens)**: the program's own transcripts split by ledger session (18 sessions, all claude-opus-5-5 at `xhigh`, CLI 2.1.280–2.1.286): per-session median output 543–2,834 tokens and median thinking 0–1,149, driven by the task mix. A passive trend detector would false-alarm (it would report output falling about 60 % across CLI versions with nothing changed but the work). **Fail for passive "shrinkflation"; pass for passive facts** (serving model per turn, effort, `service_tier`, `speed`, fallbacks, `<synthetic>` messages), which are read directly from fields.

**Step 2, active probe** (a fixed six-problem micro-panel with deterministic answers, one headless call, no tools, run from a scratch folder outside the repo; 21 runs in total including one test; about $0.35 API-equivalent; 5–14 s per run):

| Arm | Thinking tokens (5 runs) | Mean | Output tokens | Correct |
|---|---|---|---|---|
| Opus 5.5, effort low | 222, 224, 228, 236, 258 | 234 | 263–299 | 6/6 in every run |
| Opus 5.5, effort high | 303, 311, 323, 327, 332 | 319 | 344–373 | 6/6 |
| Opus 5.5, effort xhigh | 344, 349, 395, 399, 402 | 378 | 385–443 | 6/6 |
| Sonnet 5.5, default effort | 337, 341, 349, 363, 363 | 351 | 378–404 | 6/6 |

Within an arm the thinking tokens vary by about ±5–8 %; adjacent effort levels do not overlap, so a 15–25 % shift is detectable with five runs, and the model is identified by its field. **Pass for the active probe**, with one gap: all arms scored 6/6, so the panel needs harder items with a spread of accuracy to detect capability changes, not only thinking-budget changes.

**Design consequence**: #47 becomes "facts from your logs, plus a three-cent probe": passive reading of reroutes, effort, tier, speed, and fallbacks (zero tokens), and an optional active micro-panel (a few cents of the user's plan per run) compared over time and against reference runs the project publishes at each release. Spike time: about 6 minutes of wall-clock; budget ≤ 4 h.
