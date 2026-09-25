# Candidate #23 — measured behavior skill (deep dive, in progress)

_Started in S016 (2026-09-25). Stage 4 of `playbook/research.md`. Items marked "to do" must be completed before the Selection Gate._

**One line**: a small, sharply named skill that fixes one habit every coding-agent user notices, shipped with a reproducible before/after measurement and tested installers for several agents on Windows, macOS, and Linux.

**Sub-candidates** (from `ideas.md` #23): 23a comment bloat (weakened: no excess comment volume in Claude-co-authored commits, `comments.mjs`), 23b readable replies (verbosity and jargon, #77136), 23c sycophancy (#3382). The deep dive picks one habit.

## 1. Landscape (≥ 10 repos)
GitHub API, 2026-09-25. Stars, creation, last push, open issues.

| Repo | Stars | Created | Pushed | Open issues | Description |
|---|---|---|---|---|---|
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | 107,772 | 2026-04-04 | 2026-09-25 | 133 |  why use many token when few token do trick. Viral skill + proxy for c |
| [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | 51,074 | 2026-05-13 | 2026-09-19 | 71 | A skill to stop your coding agent from burying the answer. ADHD-friend |
| [blader/humanizer](https://github.com/blader/humanizer) | 51,929 | 2026-01-18 | 2026-09-06 | 25 | Agent skill that removes signs of AI-generated writing from text |
| [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop) | 17,561 | 2026-01-11 | 2026-03-17 | 56 | A skill file for removing AI tells from prose |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 89,989 | 2026-02-19 | 2026-09-23 | 71 | Taste-Skill - gives your AI good taste. stops the AI from generating b |
| [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | 29,133 | 2026-04-27 | 2026-08-06 | 48 | Anti-AI-slop design skill for Claude Code, Cursor, and Codex. |
| [tanweai/pua](https://github.com/tanweai/pua) | 19,700 | 2026-03-08 | 2026-09-09 | 2 |  P8 Anthropic   agentskill  Your AI has been placed on a PIP. 30 days  |
| [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | 215,055 | 2026-01-27 | 2026-04-20 | 130 | A single CLAUDE.md file to improve Claude Code behavior, derived from  |
| [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) | 4,712 | 2026-03-06 | 2026-09-25 | 39 | Skill that audits and rewrites content to remove AI writing patterns.  |
| [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) | 18,437 | 2026-01-19 | 2026-09-23 | 31 | Humanizer Claude Code Skills AI  |
| [yoavf/absolutelyright](https://github.com/yoavf/absolutelyright) | 425 | 2025-09-04 | 2025-12-25 | 2 | Claude said I'm absolutely right! |
| [huxleyli15/frank](https://github.com/huxleyli15/frank) | 3 | 2026-07-08 | 2026-07-08 | 0 | Frank  an anti-sycophancy skill for Claude Code, Cursor & Codex. No "y |
| [0xcjl/anti-sycophancy](https://github.com/0xcjl/anti-sycophancy) | 7 | 2026-04-07 | 2026-04-07 | 0 | Three-layer sycophancy defense skill for Claude Code and OpenClaw, bas |
| [hidevinliu/red-green-mode](https://github.com/hidevinliu/red-green-mode) | 9 | 2026-08-01 | 2026-09-04 | 0 | Exit-code guardrails for autonomous coding agents: detect fake-green t |
| [momomuchu/make-no-mistakes](https://github.com/momomuchu/make-no-mistakes) | 8 | 2026-07-02 | 2026-07-05 | 1 | Stop trusting 'done'. Make AI coding agents prove their work  frozen s |

**Recurring issue themes** (most-reacted issues, 2026-09-25):
- **Support for more agents**: JuliusBrussee/caveman #16 (OpenCode), #161 (Pi), #197 (Zed/JetBrains via ACP), #114 (VS Code); ayghri/i-have-adhd #6 (OpenCode).
- **Windows installers break**: caveman #366 "PowerShell 7 installer fails" (28 reactions).
- **Proof that it works without harming quality**: i-have-adhd #4 "Benchmarks on whether this reduces performance of the model" (open), and #145, a user-built benchmark.
- **Overhead and form**: i-have-adhd #187 "couldn't this be an output-style instead of a skill?"
- **Over-correction**: blader/humanizer #93 asks for an "AI-iness density pre-check" to avoid rewriting human text.

**Gaps**: no large skill owns sycophancy, test tampering, or silent fallbacks (`ideas.md` #23); the viral skills publish no reproducible measurement; installers are often untested on Windows.

## 2. Case studies (≥ 5)
Seven viral behavior skills dissected against GitHub star history by a subagent in S016 (sources in `ideas.md` #23):

| Repo | Burst | Ignition | Hook |
|---|---|---|---|
| JuliusBrussee/caveman | 4,920 stars on 2026-04-10 | HN front page, 904 points (2026-04-05), PCWorld | Meme grammar plus "cuts 65 % of tokens" |
| ayghri/i-have-adhd | 3,134 stars on 2026-07-19 after ~94 in 4 weeks | Another user's X post; later HN, 542 points | Provocative name; 10 rules |
| blader/humanizer | 908 stars on its first full day | The author's X post; Slashdot | Wikipedia's AI-tells guide turned into a skill |
| multica-ai/andrej-karpathy-skills | 1,081 stars on day one | Karpathy's viral post the day before | Karpathy's name; one 65-line CLAUDE.md |
| tanweai/pua | 2,696 stars on 2026-03-11 | Chinese dev media (CSDN, Zhihu), then English X | PIP satire |
| hardikpandya/stop-slop | 187 stars in week one | The author's own X post and Substack | A named list of AI-prose tells |
| Leonxlnx/taste-skill | 2,454 stars on 2026-05-26 | Not found | "Gives your AI good taste" |

**Pattern**: every burst had an outside amplifier; low-scoring HN posts did nothing; the author's own small audience gave ~200 stars at most. Several repos had second waves months later.

## 3. Demand (≥ 3 signals)
1. anthropics/claude-code [#3382](https://github.com/anthropics/claude-code/issues/3382) "You're absolutely right!" — 871 👍 (sycophancy).
2. anthropics/claude-code [#77136](https://github.com/anthropics/claude-code/issues/77136) recent models write "verbose, jargon-heavy, over-stylised" replies — 438 👍, 131 comments, citing a Reddit thread with 450+ upvotes.
3. anthropics/claude-code [#65961](https://github.com/anthropics/claude-code/issues/65961) verbose code comments that persist despite CLAUDE.md rules — 245 👍.
4. Public transcripts: of 1,860 SpecStory chat histories on GitHub that mention Claude Code, 183 contain "absolutely right" (code search, 2026-09-25).
5. The size of the viral behavior skills themselves (§1): users adopt such fixes in the hundreds of thousands.

## 4. Differentiation (draft)
"Why this over caveman, i-have-adhd, or humanizer?" — Draft: _it targets a habit none of them owns, and it proves its effect with a reproducible measurement on the current model._ To do: fix the habit, then check this sentence against the top 3 alternatives.

## 5. Distribution plan (draft)
- **Hook**: an AI coding agent fixes its own habit and publishes the numbers (AI disclosure as the hook; tests H-004).
- **DEV article**: the measurement itself (method, before/after, how to reproduce). Tags to verify at writing time: `ai`, `claude`, `productivity`, `opensource`. DEV alone brings ~1 star a week at the median (L-010), so the article is the seed that others can share, not the engine.
- **Awesome lists** (follow-on, L-009): VoltAgent/awesome-agent-skills after the skill has users; hesreallyhim/awesome-claude-code after ≥ 14 days or 100 stars, submitted by the owner through the web form.
- **Search and topics**: `claude-code`, `agent-skills`, `claude-skills`, `codex`, and the habit's own words (e.g., `sycophancy`).
- **Amplifier readiness**: a screenshot-sized before/after, a one-line install, and a name that works as a tweet.

## 6. To do
- Pick the habit (23b or 23c, or another unowned one) with a baseline measurement on the current model (Claude Opus 5.5, released 2026-09-22), once the owner answers the headless-evaluation question.
- Name search (GitHub, npm, trademarks).
- Feasibility spike: the evaluation harness and a first skill draft.
