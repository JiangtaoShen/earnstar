# earnstar_1 — ideas and screening

_Stage 2 (divergence) started in S016 (2026-09-25), after the foundational study (`../foundation.md`). Stage 3 (screening) and the deep dives follow in later sessions._

## Inputs from the foundational study
- Repos about AI coding agents dominate the 2026 winners: 22 % of the 3,246 repos with ≥ 1k stars mention Claude, 39 % agents, 20 % skills.
- By estimated conversion from ≥ 10 to ≥ 1,000 stars, agent skills lead (4.2 %), then AI-agent tooling (2.8 %); non-AI developer tools (1.0 %) and playful projects (0.8 %) trail. The average is 1.7 %.
- Owners with < 100 followers convert far less: 10 % of their repos with ≥ 10 stars reach 100, and 0.6 % reach 1,000.
- Cold-start winners needed a burst of a few hundred stars in the first week, borrowed from a large venue (Habr, XDA, Qiita, a Chinese aggregator account on X, Reddit). The program's own channels are DEV, awesome lists, and GitHub discovery.
- README features (media near the top, install heading) are table stakes: they do not separate fast from slow winners.
- A DEV article alone brings a median of 1 star in its first week (L-010); every viral skill burst studied had an outside amplifier (§23 case studies). The project must be easy for others to share.
- The developer can test on Windows 10 with a GTX 1660 Ti; macOS- or iOS-only software cannot be tested (knock-out).

## Raw ideas (≥ 15)
Each: one line, then the evidence that triggered it. Codes as in `../foundation.md` §3.

1. **Code-prose tic linter (SK/AT)**: a skill plus a deterministic CLI that flags AI tics in commit messages, PR descriptions, code comments, and docs.
   Evidence: anthropics/claude-code [#77136](https://github.com/anthropics/claude-code/issues/77136) "repetitive rhetorical tics" (438 👍) and [#65961](https://github.com/anthropics/claude-code/issues/65961) verbose code comments (245 👍); blader/humanizer has 51,918 stars (created 2026-01-18); conorbronsdon/avoid-ai-writing > 1k (sample).
2. **Coding companion ("buddy") for terminal agents (FUN/AT)**: a companion that survives updates and works across Claude Code, Codex, and OpenCode.
   Evidence: [#45596](https://github.com/anthropics/claude-code/issues/45596) "Bring Back Buddy" (1,183 👍, the most-upvoted open issue); but ramarivera/coding-buddy has only 463 stars, so the demand did not convert into stars.
3. **Usage-limit monitor (AT)**: see and forecast subscription limits across agents.
   Evidence: [#16157](https://github.com/anthropics/claude-code/issues/16157) (694 👍), [#38335](https://github.com/anthropics/claude-code/issues/38335) (476 👍); ccusage/ccusage has 18,734 stars; Windows tray monitors exist but are small (aqua5230/usage 322, babakarto/CodexBar-Win 105).
4. **Windows-first companion for coding agents (DA/AT)**: a tray app for status, notifications, limits, and approvals, where the competition is macOS-first (notch and menu-bar apps).
   Evidence: openai/codex [#13993](https://github.com/openai/codex/issues/13993) Windows installer (196 👍) and [#3962](https://github.com/openai/codex/issues/3962) sound on finish (198 👍); the sample has several macOS-only agent companions (sk-ruban/notchi, automazeio/vibeproxy).
5. **Undo/rewind for any agent (AT)**: git-based shadow checkpoints per prompt, restorable, agent-agnostic.
   Evidence: openai/codex [#9203](https://github.com/openai/codex/issues/9203) "make /undo back" (461 👍), [#11626](https://github.com/openai/codex/issues/11626) rewind (224 👍).
6. **Language-server bridge for agents (AT)**: an MCP server exposing LSP diagnostics and navigation.
   Evidence: openai/codex [#8745](https://github.com/openai/codex/issues/8745) (498 👍). Likely crowded (existing MCP LSP bridges; to be checked).
7. **Auto-continue after session limits (AT)**: wait for the reset and resume the task.
   Evidence: [#13354](https://github.com/anthropics/claude-code/issues/13354) (208 👍).
8. **Tested hooks cookbook with an installer (SK)**: curated, tested Claude Code and Codex hooks (safety, notifications, formatting, context) that install with one command.
   Evidence: disler/claude-code-hooks-mastery 3,926 stars; kenryu42/cc-safety-net 1,555 (a single hook, in the sample); showcase repos with hooks at 6k–10k stars.
9. **Build a coding agent from scratch (CR/AI)**: a short, runnable course in which each chapter adds one capability (loop, tools, permissions, context, subagents), written and verified by an AI coding agent.
   Evidence: rohitg00/ai-engineering-from-scratch on GitHub Trending (daily, 2026-09-25); lintsinghua/claude-code-book 4,273 stars (reached 1k in 1 day); gavrielc/nanoclaw Show HN (533 pts); DEV rewards articles that teach (L-003).
10. **Open-source launch kit for maintainers (SK/AT)**: skills and a CLI that audit a repo for findability and trust (README, topics, social preview, community files) and compare its star curve with base rates, using the study's data and GitHub's new star-history endpoint.
    Evidence: DEV's top articles of the past year include README and repo-polish guides (e.g., "15 Essential Sections Every README Needs", 171 reactions; "The Final 1% of Every GitHub Project", 112); marketing skill packs reached 1k+ (aaron-he-zhu/aaron-marketing-skills, onvoyage-ai/gtm-engineer-skills, in the sample). Risk: must never become a star-farming tool (§3C).
11. **Star and traffic history as code (DT)**: a GitHub Action that archives traffic (kept only 14 days by GitHub) and star history into the repo and renders SVG charts.
    Evidence: 16 % of the sampled winners embed a star-history chart; GitHub restricted stargazer data on 2026-06-30. But star-history.com recovered with the new endpoint, a dominant incumbent.
12. **Developer disk cleaner for AI-era caches (DA/DT)**: find and reclaim Hugging Face, Ollama, pip, uv, conda, npm, Docker, and agent-transcript caches on Windows, macOS, and Linux.
    Evidence: luolangaga/tubatools 4,302 and Chunyu33/light-c > 1k (Windows cleanup tools, in the sample); existing developer cleaners are tiny (riponcm/Jharu 77); this machine's own free-space floor.
13. **Skill linter and validator (AT)**: validate SKILL.md files against the spec, budgets, and trigger quality.
    Evidence: 20 % of winners mention skills; but agent-sh/agnix has 424 stars and thedaviddias/skill-check 189, so the ceiling looks low.
14. **Domain skill pack for an underserved field (SK)**: e.g., data engineering, embedded, DevOps/SRE, accessibility, or scientific computing.
    Evidence: K-Dense-AI/scientific-agent-skills 46,612 stars; GPTomics/bioSkills, himself65/finance-skills, and Master-cai/Research-Paper-Writing-Skills (7,093) in the sample. The field must be chosen by evidence of an unserved gap.
15. **DESIGN.md extractor (SK/AT)**: turn any website or screenshot into a DESIGN.md an agent can follow.
    Evidence: VoltAgent/awesome-design-md 117,811 stars; zanwei/design-dna > 1k (sample). Crowded fast.
16. **Agent session archive and search (AT)**: index transcripts across agents and search them.
    Evidence: Dicklesworthstone/coding_agent_session_search > 1k (sample); this program's own transcript archive (`tools/archive.mjs`). Likely crowded.
17. **Local-first "LLM wiki" for a codebase (AA/AT)**: Karpathy-style wiki compiled from a repo, kept current by hooks.
    Evidence: Astro-Han/karpathy-llm-wiki 2,358 stars; lucasastorian/llmwiki > 1k; nvk/llm-wiki > 1k (sample). Crowded since April 2026.
18. **Agent-readable repo map (AT)**: a compact, cached code map that cuts agent token use.
    Evidence: Houseofmvps/codesight, parcadei/llm-tldr, Mibayy/token-savior, tirth8205/code-review-graph (all > 1k in the sample). Crowded.
19. **Playful visualizer of agent work (FUN)**: replay an agent session or git history as an animation.
    Evidence: unhappychoice/gitlogue > 1k (sample). Playful projects convert poorly (0.8 %).
20. **Small-GPU local model kit (ML/AT)**: recipes to run coding models on 6 GB GPUs.
    Evidence: Show HN posts on running large models on small hardware (JustVugg/colibri 937 pts, drumih/turbo-fieldfare 919 pts). Heavy GPU work; the machine limits testing of larger models.

21. **Windows survival skill for coding agents (SK)**: measured, tested fixes for the ways agents fail on Windows (PowerShell 5.1 syntax, `nul` redirection, CRLF, encodings under non-English code pages, path quoting, conda, long paths), for Claude Code, Codex, Gemini CLI, and OpenCode.
    Evidence: GitHub issue search on 2026-09-25 matches 6,144 Claude Code issues for "windows powershell" and 12,187 Codex issues for "windows"; skill-fixable examples: anthropics/claude-code [#4928](https://github.com/anthropics/claude-code/issues/4928) stray `nul` files (235 👍), openai/codex [#4003](https://github.com/openai/codex/issues/4003) mixed line endings (75 👍), [#2860](https://github.com/openai/codex/issues/2860) a permission prompt for every shell command (110 👍). The most-voted Windows issues are desktop-app bugs that a skill cannot fix. Existing Windows skills are tiny (GuanKr/pwsh-pitfalls 2; kumu314/windows-agent-failure-modes 0, created 2026-09-17; Misaka-Mikoto-Tech/agent-skills 272, which includes a PowerShell skill). This machine runs Windows 10 with a Chinese locale, the hardest common case, and the program's own `playbook/workstation.md` records such pitfalls.
22. **Demo-GIF skill for READMEs (SK)**: an agent skill that records reproducible terminal or web demos for a README.
    Evidence: media near the top of the README is table stakes (72 % of winners, L-008). But many recent attempts have 0–2 stars (ShreyasDasari/evergif, silicon-based-Lin/terminal-demo-gif, TGPSKI/record, jondoescoding/vhs-demo-videos), which suggests weak star demand.

23. **Measured behavior skill for an unaddressed agent annoyance (SK)**: a small, sharply named skill that fixes one habit every coding-agent user notices, shipped with a reproducible before/after evaluation (Constitution §7), which the viral skills lack.
    Evidence: the largest 2026 skill winners are single-purpose behavior skills, often one file: multica-ai/andrej-karpathy-skills 215,051 (one CLAUDE.md), JuliusBrussee/caveman 107,767 (terse output), Leonxlnx/taste-skill 89,980, blader/humanizer 51,920, ayghri/i-have-adhd 51,067 (answer first), Nutlope/hallmark 29,132, tanweai/pua 19,700, hardikpandya/stop-slop 17,561. Several owners have few followers even after going viral (hardikpandya 303, tanweai 454, ayghri 539 on 2026-09-25), so this sub-archetype produces cold-start hits. Candidate habits with demand: anthropics/claude-code [#3382](https://github.com/anthropics/claude-code/issues/3382) "You're absolutely right!" (871 👍), [#77136](https://github.com/anthropics/claude-code/issues/77136) rhetorical tics (438 👍), [#65961](https://github.com/anthropics/claude-code/issues/65961) verbose comments (245 👍). The deep dive must find a habit no large skill already owns.
    First ownership check (GitHub search, 2026-09-25): owned habits are terse output (caveman), answer-first (i-have-adhd), AI prose tells (humanizer, stop-slop), generic design (taste-skill, hallmark), and engineering discipline (superpowers, andrej-karpathy-skills). Apparently unowned: sycophancy (huxleyli15/frank 3 stars, 0xcjl/anti-sycophancy 7; yoavf/absolutelyright, a counter, 425), test tampering and fake green (hidevinliu/red-green-mode 9, smixs/code-quality 12, momomuchu/make-no-mistakes 8), over-commenting and emoji overuse (no skill found), silent fallbacks (no skill found). Many tiny attempts show that the hook, name, and timing decide, not the mechanism.
    Sub-candidates for the deep dive, by demand:
    - **23a. Comment bloat**: [#65961](https://github.com/anthropics/claude-code/issues/65961) (245 👍, open, 2026-06-07) says redundant comments persist "even when explicitly told to stop" in CLAUDE.md. That argues for deterministic enforcement (a hook that checks each edit) plus a skill, measured on a fixed task set. No skill found for it.
      **Premise check (S016, `comments.mjs`)**: in 133 public repos with a commit co-authored by Claude (June–July 2026) and same-repo baseline commits without an AI trailer, comment lines made up 6.4 % of added code lines in the agent commits and 7.2 % in the baselines (per-repo medians 3.7 % and 4.7 %); the agent commit was denser in 46 % of repos. Caveats: baselines may be AI-assisted without a trailer; Python docstrings are not counted; the complaint may be about comment quality (restating code, leaking reasoning) rather than volume. As measured, the volume premise is not supported, which weakens 23a.
    - **23b. Readable replies**: [#77136](https://github.com/anthropics/claude-code/issues/77136) (438 👍, 131 comments, open, 2026-07-13) reports that recent models write "verbose, jargon-heavy, over-stylised" replies, citing a Reddit thread with 450+ upvotes. Partly overlaps caveman (terse) and i-have-adhd (answer first).
    - **23c. Sycophancy**: [#3382](https://github.com/anthropics/claude-code/issues/3382) (871 👍, closed, 2025-07) "You're absolutely right!"; the best-known agent habit, but older, and newer models may have reduced it; must be measured before choosing. Public data exists for that: GitHub code search on 2026-09-25 finds 15,840 SpecStory chat-history files (`path:.specstory/history`), 844 of which contain "absolutely right" (about 5 %, across tools and months); of the 1,860 that mention Claude Code, 183 do (about 10 %). Code search cannot split these by month, so a trend needs file enumeration in the deep dive.
    - **Case studies of viral behavior skills (S016 subagent, with star history)**: every large burst matched an outside amplifier. caveman: HN front page (904 points) on 2026-04-05, then 4,920 stars on its best day; humanizer: the author's X post ("Wikipedia made a list of AI tells") and Slashdot; andrej-karpathy-skills: created the day after Karpathy's viral post, 1,081 stars on day one; pua: Chinese dev media (CSDN, Zhihu) before English X; i-have-adhd: ~94 stars in four weeks until another person's tweet (@jjacky, 2026-07-19) brought 3,134 in a day, then a 542-point HN post in September. Low-scoring HN posts (1–3 points) did nothing. An author's own small audience produced ~187 stars in week one (stop-slop). Common traits: a meme-able name, a complaint everyone has, one small file of 4–10 rules, a before/after demo rather than a benchmark, and a news hook (Karpathy's post, Wikipedia's AI-tells guide, a Reddit meme). Several had second waves months later. Sources: HN items 47647455 and 49610631; x.com/blader/status/2013015738622284156; x.com/jjacky/status/2078689662118314318; news.slashdot.org/story/26/01/22/015250; techtimes.com article 316798; pcworld.com article 3115406.
    - **Distribution angle**: the program's AI disclosure (Constitution §3D) becomes the hook: an AI coding agent writes a skill against its own habit and publishes the measurement. That suits DEV, which wants articles that teach (L-003), and it tests H-004 directly.
    - **Feasibility note**: measured evaluations would run Claude Code headless (`claude -p`, CLI 2.1.196 is installed) on the owner's subscription. The owner must agree before that use (asked at the S016 close).

24. **Agent habit tracker (AT/CR)**: a reproducible benchmark that measures coding-agent habits (sycophancy, verbosity and jargon, comment density, test tampering) on each new model release, paired with the skills that counter them.
    Evidence: measurement posts reach the HN front page ("Fable 5 – Median thinking declined in August", 425 points, [HN 49789224](https://news.ycombinator.com/item?id=49789224)); regression complaints are among the most-voted issues (anthropics/claude-code [#42796](https://github.com/anthropics/claude-code/issues/42796), 2,073 👍; [#77136](https://github.com/anthropics/claude-code/issues/77136), 438 👍); petergpt/bullshit-benchmark > 1k (sample); every model release is a fresh news hook (Claude Opus 5.5, 2026-09-22, [HN 49803892](https://news.ycombinator.com/item?id=49803892), 1,793 points). Constraints: runs draw on the owner's Claude subscription (consent pending), and other vendors' models need accounts the program does not have.

25. **Accessibility skill with axe-measured results (SK)**: make agents ship accessible UI, measured by axe-core violations before and after.
    Evidence: design skills are saturated (174 skill repos with ≥ 1k stars mention design or UI), while accessibility has almost none. But the existing a11y skills are small (dadederk/iOS-Accessibility-Agent-Skill 168, Owl-Listener/inclusive-design-skills 101), and HN had no story on AI-generated UI accessibility above 80 points in the past year.

## Screening (preliminary, S016)
Knock-outs from `playbook/research.md` §4, plus a first incumbent check by GitHub search on 2026-09-25. To be confirmed at the start of the deep dives in the next session.

| # | Idea | Result | Reason |
|---|---|---|---|
| 1 | Code-prose tic skill | **Shortlist** | Strong demand (438 👍, 245 👍 issues; humanizer 51,918 stars). Linters for the same problem stay tiny (CodeDeficient/KarpeSlop 38, mmartoccia/grain 34, skew202/antislop 15), while the skill form wins, so ship it as a skill first. Angle: code artifacts (commits, PRs, comments, docs), which humanizer does not target |
| 2 | Buddy companion | Deprioritized | The top issue (1,183 👍) did not convert: ramarivera/coding-buddy has 463 stars. Naming it after Claude carries trademark risk |
| 3 | Usage-limit monitor | Knock-out | Dominant incumbent: ccusage/ccusage 18,734 stars |
| 4 | Windows-first agent companion | **Shortlist (exploratory)** | Testable on this machine; the incumbents are small (aqua5230/usage 322, babakarto/CodexBar-Win 105, jeongwookie/WhereMyTokens 84); a distinct archetype (DA/AT) for exploration |
| 5 | Undo/rewind for any agent | Deprioritized | A real gap (mohshomis/ckpt 7, gokay-ai/sheep 6), but Claude Code already has native rewind, and the tiny incumbents suggest weak star demand |
| 6 | LSP bridge | Deprioritized | Existing bridges (jonrad/lsp-mcp 192, blackwell-systems/agent-lsp 139) are small; large code-intelligence servers cover much of it; to be checked only if the shortlist fails |
| 7 | Auto-continue after limits | Deprioritized | A single hook; little room for differentiation |
| 8 | Hooks cookbook | Merge into #4 or #10 | Showcases already hold 4k–10k stars (disler/claude-code-hooks-mastery 3,926); a tested, installable set could be part of another candidate |
| 9 | Build a coding agent from scratch | Knock-out | Dominant incumbent: shareAI-lab/learn-claude-code 77,587 stars, plus a dozen "mini Claude Code" repos (Windy3f3f3f3f/claude-code-from-scratch 2,708, LiuMengxuan04/MiniCode 1,118, e10nMa2k/cc-mini 965, jiji262/build-code-agent 628) |
| 10 | Open-source launch kit | **Shortlist** | Unique asset (this study's data and the new star-history endpoint); dogfooded by the program itself; README and repo-polish articles rank among DEV's top posts. Must stay on the right side of §3C: findability and trust, never star solicitation |
| 11 | Star and traffic history as code | Knock-out | star-history.com recovered with the new endpoint (dominant incumbent, no real angle) |
| 12 | Developer disk cleaner | Deprioritized | Low archetype conversion (DA/DT ≈ 1–2 %); the incumbents are tiny, which suggests weak demand on GitHub rather than an open gap |
| 13 | Skill linter | Deprioritized | Low ceiling (agent-sh/agnix 424, thedaviddias/skill-check 189) |
| 14 | Domain skill pack | Keep as a fallback | High ceiling (scientific-agent-skills 46,612), but needs evidence of an unserved field first |
| 15 | DESIGN.md extractor | Knock-out | Dominant incumbent: VoltAgent/awesome-design-md 117,811 stars |
| 16 | Agent session search | Knock-out (soft) | Crowded, no clear angle |
| 17 | Codebase LLM wiki | Knock-out (soft) | Crowded since April 2026 (≥ 3 repos above 1k) |
| 18 | Agent-readable repo map | Knock-out (soft) | Crowded (≥ 4 repos above 1k in the sample) |
| 19 | Playful agent-work visualizer | Deprioritized | Playful projects convert poorly (0.8 %) |
| 20 | Small-GPU local model kit | Deprioritized | Heavy GPU work for a narrow audience; overlaps with fast-moving model releases |
| 21 | Windows survival skill | **Shortlist (weakened)** | Large pain area; fully testable on this machine. But a first landscape pass found a dozen Windows or PowerShell agent skills, all small: Misaka-Mikoto-Tech/agent-skills 272, thanh-abaii/gstack-windows-port 36, hqy2435662352/agent-powershell-standardizer 8, UncertaintyDeterminesYou4ndMe/powershell-windows-cli-agent-skill 6, GuanKr/pwsh-pitfalls 2, kumu314/windows-agent-failure-modes 0. As with #10, many tried and none rose |
| 22 | Demo-GIF skill | Deprioritized | Many recent attempts, none above 2 stars |
| 23 | Measured behavior skill | **Shortlist (lead)** | The highest-converting archetype, with cold-start viral precedents; tiny build cost; our measured evaluation is a real differentiator. Risk: extreme variance, and the habit must not already be owned by a large skill |
| 24 | Agent habit tracker | **Shortlist (conditional)** | News hook at every release and a measurable claim; conditional on the owner's consent to use the subscription for runs, and limited to Claude models |
| 25 | Accessibility skill | Deprioritized | Measurable, but weak demand signals and small incumbents |

**Shortlist for deep dives** (≥ 3 required): #23 measured behavior skill (which may absorb #1), #21 Windows survival skill, #10 open-source launch kit (weakened), and #4 Windows-first agent companion as the exploratory candidate. The deep dives (landscape ≥ 10 repos, ≥ 5 case studies, ≥ 3 demand signals, differentiation, distribution plan) continue next session.

**First landscape note on #10 (S016)**: every maintainer-launch skill or repo checker found on 2026-09-25 is small: study8677/Readme.skill 172, zenika-open-source/promote-open-source-project 862 (a guide from 2019), IndianOldTurtledove/codex-oss-maintainer-toolkit 45, 199-biotechnologies/github-optimization-skill 15, KorroAi/readme-roast 12, and several repo-health checkers with 0 stars. Many have tried and none rose, which suggests the maintainer audience is too small for this archetype's usual lift. #10 is weakened; its deep dive must find counter-evidence or drop it.
