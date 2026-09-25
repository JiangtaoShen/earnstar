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

**23b-specific landscape** (GitHub search, 2026-09-25): [snflkd/fluent-korean](https://github.com/snflkd/fluent-korean) 1,337 stars (created 2026-07-10, an output style for clear Korean replies); [alexgreensh/attention-span](https://github.com/alexgreensh/attention-span) 1,133 (2026-08-04, "make your agents talk human"); [yzhao062/agent-style](https://github.com/yzhao062/agent-style) 694 (21 writing rules); [woerndl/unsloppify](https://github.com/woerndl/unsloppify) 24; [zcaceres/claudem-ipsum](https://github.com/zcaceres/claudem-ipsum) 4 (a Claudespeak lorem-ipsum joke). No repo uses the name "Claudese". Competition exists but has no dominant owner (none above 1.4k). fluent-korean suggests a language-specific variant: clear Chinese replies would reach the largest cold-start community (L-007), but non-English repo content needs the owner's approval (Constitution §3B).

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

Two 23b-specific cases (GitHub star history and HN Algolia, 2026-09-25):

| Repo | Owner followers | Week 1 | First 28 days | Peak day | Total | HN |
|---|---|---|---|---|---|---|
| snflkd/fluent-korean | 9 | 3 | 7 | 212 on 2026-08-20 | 1,337 | none |
| alexgreensh/attention-span | 196 | 232 | 883 | 171 on 2026-08-15 | 1,133 | none |

fluent-korean is a cold start with delayed ignition: almost nothing for six weeks, then one day of 212 stars without HN, most likely a Korean community post (to be confirmed).

**Pattern**: every burst had an outside amplifier; low-scoring HN posts did nothing; the author's own small audience gave ~200 stars at most. Several repos had second waves months later.

## 3. Demand (≥ 3 signals)
1. anthropics/claude-code [#3382](https://github.com/anthropics/claude-code/issues/3382) "You're absolutely right!" — 871 👍 (sycophancy).
2. anthropics/claude-code [#77136](https://github.com/anthropics/claude-code/issues/77136) recent models write "verbose, jargon-heavy, over-stylised" replies — 438 👍, 131 comments, citing a Reddit thread with 450+ upvotes.
3. anthropics/claude-code [#65961](https://github.com/anthropics/claude-code/issues/65961) verbose code comments that persist despite CLAUDE.md rules — 245 👍.
4. Public transcripts: of 1,860 SpecStory chat histories on GitHub that mention Claude Code, 183 contain "absolutely right" (code search, 2026-09-25).
5. The size of the viral behavior skills themselves (§1): users adopt such fixes in the hundreds of thousands.
6. For 23b, the habit has a name and a pattern list: "Claudese" ([benn.substack.com](https://benn.substack.com/p/the-frontier-fails-the-turing-test), 2026-06-26). The #77136 thread cites an Arena.ai analysis of the same patterns, reports that it worsened with Opus 5, says colleagues moved to Codex over it, and names "output style" 30 times as the fix people try; it never mentions caveman, i-have-adhd, or humanizer.

**Leading sub-candidate after S016: 23b (Claudese)**, with the caveats in the independent review (`../foundation.md` §9). It has the strongest recent demand, a meme-able name, deterministic text metrics for measurement (stock phrases, abstract nouns, sentence length, agreement openers), and a fresh news hook (Claude Opus 5.5, 2026-09-22).

## 4. Differentiation (draft)
"Why this over caveman, i-have-adhd, or humanizer?" — Draft: _it targets a habit none of them owns, and it proves its effect with a reproducible measurement on the current model._ To do: fix the habit, then check this sentence against the top 3 alternatives.

## 5. Distribution plan (draft)
- **Hook**: an AI coding agent fixes its own habit and publishes the numbers (AI disclosure as the hook; tests H-004).
- **DEV article**: the measurement itself (method, before/after, how to reproduce). Tags to verify at writing time: `ai`, `claude`, `productivity`, `opensource`. DEV alone brings ~1 star a week at the median (L-010), so the article is the seed that others can share, not the engine.
- **Awesome lists** (follow-on, L-009): VoltAgent/awesome-agent-skills after the skill has users; hesreallyhim/awesome-claude-code after ≥ 14 days or 100 stars, submitted by the owner through the web form.
- **Trending lever** (L-011): an evaluation harness in code gives the repo a detected language; 7 of 9 viral skills checked have one (caveman Go, i-have-adhd Python, humanizer Python, taste-skill JavaScript, pua Python, hallmark CSS, planning-with-files Shell).
- **Search and topics**: `claude-code`, `agent-skills`, `claude-skills`, `codex`, and the habit's own words (e.g., `sycophancy`).
- **Amplifier readiness**: a screenshot-sized before/after, a one-line install, and a name that works as a tweet.

## 6. Measurement spike (S016, no owner quota used)
`claudese.mjs` collects public SpecStory chat histories (`.specstory/history/*.md` in public GitHub repos), whose agent headers name the model, keeps the agent's prose (code blocks removed), and counts marker phrases. First run on 2026-09-25: 2,063 transcripts, 71,912 agent turns.

Rates per 1,000 words of agent prose (code blocks removed); models with >= 20,000 words.

| Model | Repos | Agent turns | Words | absolutely_right | heres_the_thing | honest_take | genuinely | load_bearing | substrate | worth_noting | the_real | crucially | All markers |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| opus 4 | 3 | 4130 | 100,666 | 0.18 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.04 | 0.00 | 0.22 |
| opus 4.5 | 28 | 7607 | 80,797 | 0.05 | 0.00 | 0.00 | 0.01 | 0.00 | 0.00 | 0.00 | 0.05 | 0.01 | 0.12 |
| opus 4.6 | 21 | 8478 | 108,519 | 0.00 | 0.00 | 0.04 | 0.03 | 0.00 | 0.00 | 0.02 | 0.12 | 0.00 | 0.20 |
| opus 4.7 | 12 | 10979 | 188,395 | 0.00 | 0.00 | 0.00 | 0.08 | 0.05 | 0.00 | 0.01 | 0.01 | 0.02 | 0.16 |
| opus 4.8 | 17 | 5564 | 85,970 | 0.00 | 0.00 | 0.01 | 0.35 | 0.02 | 0.00 | 0.03 | 0.01 | 0.03 | 0.47 |
| opus 5 | 11 | 3099 | 43,382 | 0.00 | 0.00 | 0.02 | 0.09 | 0.00 | 0.00 | 0.07 | 0.02 | 0.00 | 0.21 |
| sonnet 4 | 18 | 1814 | 46,642 | 0.09 | 0.00 | 0.00 | 0.02 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.11 |
| sonnet 4.5 | 62 | 10077 | 202,113 | 0.15 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.05 | 0.01 | 0.21 |
| sonnet 4.6 | 36 | 8819 | 145,922 | 0.00 | 0.00 | 0.03 | 0.06 | 0.00 | 0.00 | 0.00 | 0.11 | 0.01 | 0.21 |
| sonnet 5 | 17 | 2320 | 51,237 | 0.00 | 0.02 | 0.00 | 0.25 | 0.04 | 0.00 | 0.00 | 0.02 | 0.00 | 0.33 |

**Readings** (small, self-selected samples: 3–62 repos per model):
- **Measurement from public data works**, with ≥ 43,000 words for each of 10 model versions.
- **"You're absolutely right" was not observed in newer models**: 0.05–0.18 per 1,000 words in Opus 4, Opus 4.5, Sonnet 4, and Sonnet 4.5 (10 of 62 Sonnet 4.5 repos), and none in about 114 repos using 4.6-and-later models. But the older hits are concentrated (Opus 4: 13 of 18 hits in one repo; Opus 4.5: all 4 in one repo), model is confounded with time (system prompts, users banning the phrase), and other flattery persists ("good catch", "great point", "fair point": 0.23 per 1,000 words in Opus 4.6). 23c stays undecided until a broader agreement lexicon is measured.
- **"genuine(ly)" rose, but not monotonically**: ≤ 0.08 per 1,000 words through Opus 4.7, then 0.35 in Opus 4.8 and 0.25 in Sonnet 5, but 0.09 in Opus 5. One repo supplies 10 of Opus 4.8's 30 hits, and the regex also counts technical uses of "genuine". Consistent with #77136's timing, but weak on its own.
- **Fixed phrases are sparse** (< 0.5 per 1,000 words), so they cannot carry the measurement alone. Next: a data-derived lexicon (words whose rates rose most between model generations), sentence length, and abstract-noun rates.

**Data-derived lexicon** (`claudese.mjs lexicon`): words used relatively more by Opus 4.8, Opus 5, and Sonnet 5 than by the 4.5/4.6 models. Across all repos (165,564 vs 503,499 words), topic words dominate (payload, jq, curl, bytes), but style words stand out: deliberately (61× the older rate), verdict (36×), untouched (20×), owns (19×), landed (17×), survives (14×), flagging (13.5×), genuinely (13.4×), precisely (11×), drift (11×), carries (10×), holds (9×). Restricted to the 13 repos with transcripts from both groups (`--paired`, 79,338 vs 135,373 words), untouched (92×), end-to-end (40×), precisely (23×), pre-existing (13×), unrelated (10×), silently (8×), and drift (8×) remain, while dates and tool names still leak in.

**Spike conclusion**: public transcripts can detect marker shifts between model generations (the disappearance of "absolutely right", the rise of "genuinely"). A robust Claudese metric that separates style from task needs either many more paired repos or a controlled prompt set run headless, which the owner approved at small scale in S017 (`playbook/workstation.md` §5).

## 7. Refined concept (S016, to be tested in the deep dive)
**A local Claudese meter plus the fix.** One command scores the user's own Claude Code transcripts, which Claude Code keeps locally as JSONL, for Claudese markers and prints a shareable score card; a skill or output style reduces the habit; running the meter again shows the before and after on the user's own sessions.
- **Why this form**: the score card is a screenshot others can share, which is the amplifier every studied burst needed (§2); the measurement runs on each user's own data, privately, with no upload and no quota spent by the program; the public-transcript data (§6) supplies the DEV article's model-by-model findings.
- **Landscape check** (GitHub search, 2026-09-25): local transcript tools measure tokens, cost, and sessions, not writing style: kenn-io/agentsview 5,990 stars, nateherkai/token-dashboard 709, opalinehq/cli 301, hmenzagh/CCMeter 116, numman-ali/cc-wrapped 87 (a "Wrapped"-style summary). No style meter was found.
- **Testability**: the developer can build and test the meter on this machine's own transcripts, which stay private (Constitution §6: transcripts are never published).
- **Local-format check** (throwaway code in `lab/spike/`, run on this program's own transcripts only, aggregates only): Claude Code's local JSONL records carry the model name (`claude-opus-5-5`) and separable text blocks, so the meter's input is straightforward. The only marker hit was almost certainly a quotation (this session quoted issue #3382's title), so the meter must skip quoted text and code.
- **Naming constraint (settled)**: the name must not contain "Claude" (L-013), so "Claudese" can appear in the description and the article but not as the project name.
- **Risks to check**: whether the fix measurably works without harming task quality (the demand in i-have-adhd #4); support for other agents' transcript formats (Codex, OpenCode).

## 8. To do
- Pick the habit (23b leads; 23c is undecided) with a baseline measurement on the current model (Claude Opus 5.5, released 2026-09-22), using small-scale headless runs (approved in S017).
- Name search (GitHub, npm, trademarks).
- Feasibility spike: the evaluation harness and a first skill draft.
