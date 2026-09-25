# Foundational study: how open-source projects earn stars (2025-09 to 2026-09)

_Written in S016 (2026-09-25) for project 1, per `playbook/research.md` §1.1. Later projects refresh and extend it._

## 1. Question and method
**Question**: which kinds of repos gain ≥ 1,000 stars quickly today, through which channels, and how often authors with no audience manage it. The program starts with no audience (L-000) and one social channel, DEV (S013).

**Data** (all read-only, reproducible with the scripts in `history/research/foundation/`):
- **Population**: every repo created 2025-09-25..2026-06-27 (so each had ≥ 90 days) with ≥ 1,000 stars on 2026-09-25, from GitHub search: 3,246 repos (`population.csv`). Forks: none.
- **Sample**: 500 repos drawn at random (seed 1) from the population (`collect.mjs`, `sample.csv`). For each one:
  - **Star timing**: daily stars from GitHub's star history endpoint (`GET /repos/{owner}/{repo}/stargazers/history`), because the stargazer list is no longer public (§7, L-004). Its totals matched the star counts within 5 % for all 500 repos.
  - **Owner audience**: current followers of the owner (user or organization).
  - **HN**: stories linking the repo (HN Algolia), with points and dates.
  - **README pattern**: flags from the README text (media near the top, GIF, video, install heading, one-line install, badges, star-history chart, CJK text).
  - **Archetype**: labelled by hand from the name, description, and topics (`archetypes.json`); codes in §3.
- **Lower tiers**: repos with 10–99 and 100–999 stars created on 26 evenly spaced days of the same window (18,140 repos), classified by a keyword proxy (`tiers.mjs`), to turn winners-only data into conversion rates (§4).
- **DEV**: top articles of the past year in 24 tags whose body links a repo owned by the article's author, with that repo's daily stars around publication (`dev.mjs`, `dev.csv`) (§6).
- **Launch channels of cold-start winners**: web search for the launch posts of 12 winners whose owners have < 100 followers and that had no HN story (§5).

**Limitations**:
- Survivorship: the sample holds winners only. §4 adds lower tiers for the denominator.
- Followers are measured today, so they overstate the audience at launch. "Small audience" (< 100 followers today) is therefore conservative.
- Channels other than HN and DEV are not observable at scale: X/Twitter, Reddit (unreachable, L-002), WeChat, Xiaohongshu, YouTube, newsletters, and GitHub Trending leave no public per-repo record. CJK text in the README or description is used as a proxy for Chinese-community reach.
- Star-history days are UTC days; 47 repos have stars dated before their `created_at` (transferred or re-created repos), which only shortens their measured time to 1k.
- Archetype labels are one labeller's judgment; the keyword proxy agrees with them 63 % of the time (§4).

## 2. Headline findings
<!-- findings:start -->
1. **AI coding agents dominate the 2026 winners.** Of the 3,246 repos created in the window with ≥ 1k stars, 22 % mention Claude, 39 % agents, and 20 % skills. In the labelled sample, agent tooling (23 %), agent skills (17 %), and AI apps (9 %) make up half.
2. **Winning is rare, and rarer without an audience.** Of repos with ≥ 10 stars, 13.7 % reach 100 and 1.7 % reach 1,000. For owners with < 100 followers (counted today) the rates are about 10 % and 0.7 %; for everyone else about 18 % and 2.9 %. The gap is an upper bound, because a hit moves its owner out of the small bucket (§4, §9, L-005).
3. **Archetype shifts the odds several-fold.** By normalized lift (share among winners vs among repos with 10–99 stars), agent skills are over-represented about 1.8× and AI tooling 1.25×, while non-AI developer tools and playful projects (0.4× each) are under-represented. Estimated conversion from ≥ 10 to ≥ 1,000 stars: skills 3.8 % (3.4–4.2 % across sampled days), AI tooling 2.7 %, curated resources 1.9 %, non-AI tools 1.0 %, playful projects 1.0 %. The day-to-day intervals are tight, but the keyword proxy's errors are not (§4, §9, L-006). Within one problem space, the skill form beats the tool form (anti-slop linters < 40 stars; the humanizer skill 52k).
4. **Cold starts happen, usually through a borrowed burst.** A quarter of the winners (24 %) belong to users with < 100 followers, and half of those reached 1k within 90 days. Those 49 fast cold starts gained a median 260 stars in week one (12 had fewer than 100); for 7 of 12 checked, an outside amplifier was identified, and the rest are unknown (§5, §9, L-007).
5. **HN is rare among winners.** Only 5 % of winners had an HN story with ≥ 100 points, though 93 % of those reached 1k within 90 days. HN is neither necessary nor a program channel (L-001, S013).
6. **CJK-language repos are common among small-audience winners.** 14 % of winners have a CJK description, and 30 of the 49 cold-start winners have CJK text in the README. The CJK share rises from the 10–99 tier (8.9 %) to the 100–999 tier (14.7 %) but not further, and it is confounded with smaller follower counts, so it is associated with reaching 100 stars rather than shown to cause 1,000 (§9).
7. **README polish does not separate fast from slow winners.** Fast and slow winners show the same README features (§3, L-008). Whether a good README is necessary cannot be told from winners alone.
8. **DEV alone rarely moves a repo.** After a DEV article by its owner, the median repo gained 1 star in the week (p90 12); of 460 launches on repos with < 50 stars, 8 (1.7 %) gained ≥ 100 stars in 30 days, and 4 of the 7 biggest gains coincided with HN stories (§6, L-010).
9. **Most winners are fast.** 60 % reached 1k within 90 days of creation (median 68 days); the first 100 stars came within a median 4 days of the first star.
<!-- findings:end -->

## 3. Base rates
<!-- analyze:start -->
_Generated by `node history/research/foundation/analyze.mjs`. HN counts come from an exact repo-URL search, so stories that link a homepage are missed; 8 of the 27 stories with ≥ 100 points appeared after the repo already had 1k stars (§9)._

### Population

| Measure | Value |
|---|---|
| Repos created 2025-09-25..2026-06-27 with >= 1,000 stars (2026-09-25) | 3,246 |
| Owned by users / organizations | 1953 / 1293 |
| Mention Claude (description, topics, or name) | 22 % |
| Mention agents | 39 % |
| Mention skills | 20 % |
| Mention MCP | 9 % |
| Description contains CJK text | 14 % |
| Median stars (p25-p75) | 2,071 (1,341-4,027) |

Languages: Python 30 %, TypeScript 24 %, none 8 %, Rust 7 %, JavaScript 7 %, Go 5 %, Shell 3 %, Swift 3 %, HTML 3 %, Kotlin 2 %.

### Speed to 1,000 stars (sample)

| Measure | Value |
|---|---|
| Sample size / with star history | 500 / 500 |
| Reached 1k within 90 days of creation | 60 % |
| Days from creation to 1k: p25 / median / p75 | 23 / 68 / 132 |
| Days from first star to 1k: p25 / median / p75 | 15 / 58 / 122 |
| Days from first star to 100: median | 4 |
| Share of first-90-day stars (from creation) that came in the first 7 days after the first star: median | 17 % |
| Peak single day as a share of total stars: median | 9 % |

### By archetype (sample)

| Code | Archetype | n | Share | 1k in <= 90 d | Median stars | Median days to 1k | Small-audience owners | HN story >= 100 pts | CJK description |
|---|---|---|---|---|---|---|---|---|---|
| AT | AI-agent and LLM tooling (MCP, harnesses, CLIs, infra) | 113 | 23 % | 67 % | 2,211 | 61 | 19 % | 9 % | 3 % |
| SK | Agent skills, plugins, prompts, configs | 84 | 17 % | 63 % | 2,294 | 65 | 21 % | 4 % | 19 % |
| AA | AI end-user apps | 47 | 9 % | 62 % | 1,848 | 58 | 21 % | 0 % | 36 % |
| GR | Grey area (ToS or legal risk) | 47 | 9 % | 55 % | 1,869 | 79 | 49 % | 0 % | 34 % |
| ML | Research code and model releases | 45 | 9 % | 56 % | 1,533 | 72 | 7 % | 2 % | 2 % |
| CR | Curated resources and learning material | 45 | 9 % | 62 % | 2,513 | 51 | 24 % | 2 % | 33 % |
| DT | Developer tools and libraries (non-AI) | 36 | 7 % | 64 % | 2,368 | 56 | 17 % | 17 % | 8 % |
| DA | Desktop and mobile utilities | 26 | 5 % | 50 % | 1,811 | 100 | 54 % | 0 % | 8 % |
| SH | Self-hosted apps | 23 | 5 % | 30 % | 1,796 | 138 | 30 % | 9 % | 13 % |
| SEC | Security and OSINT | 13 | 3 % | 69 % | 1,613 | 56 | 15 % | 0 % | 8 % |
| FUN | Playful or visual | 8 | 2 % | 63 % | 1,499 | 63 | 25 % | 13 % | 13 % |
| HW | Hardware and firmware | 7 | 1 % | 43 % | 1,156 | 175 | 29 % | 29 % | 0 % |
| OTH | Other | 6 | 1 % | 67 % | 1,202 | 90 | 17 % | 17 % | 0 % |

### By owner audience (sample)

| Owner | n | Share | 1k in <= 90 d | Median stars | Median days to 1k | HN story >= 100 pts | Top archetypes |
|---|---|---|---|---|---|---|---|
| User, < 100 followers | 121 | 24 % | 50 % | 1,572 | 88 | 3 % | GR 23, AT 22, SK 18 |
| User, 100-999 | 129 | 26 % | 67 % | 2,281 | 56 | 5 % | SK 26, AT 21, GR 17 |
| User, 1k-9,999 | 42 | 8 % | 67 % | 3,347 | 47 | 5 % | SK 13, AT 10, CR 4 |
| User, >= 10k | 11 | 2 % | 91 % | 2,195 | 25 | 9 % | AT 4, SK 3, CR 1 |
| Organization, < 100 followers | 62 | 12 % | 55 % | 2,009 | 87 | 3 % | AT 14, AA 13, SH 9 |
| Organization, >= 100 | 135 | 27 % | 60 % | 2,353 | 64 | 9 % | AT 42, ML 32, SK 18 |

### Launch channels (sample)

| Signal | Share of sample | Median stars (with / without) | 1k in <= 90 d (with / without) |
|---|---|---|---|
| Any HN story linking the repo | 30 % | 2,370 / 1,874 | 64 % / 58 % |
| HN story >= 100 points | 5 % | 4,347 / 1,935 | 93 % / 58 % |
| HN story >= 100 points within 7 days of the first star | 2 % | 2,404 / – | – |
| README contains CJK (Chinese-community proxy) | 39 % | 2,115 / 1,880 | 65 % / 57 % |

### README patterns (sample): fast (1k in <= 30 days) vs slow (> 90 days)

| Pattern | All | Fast (n=148) | Slow (n=199) |
|---|---|---|---|
| Image, GIF, or video in the first 4,000 characters (badges excluded) | 72 % | 67 % | 71 % |
| GIF anywhere | 11 % | 11 % | 9 % |
| Video anywhere | 22 % | 22 % | 22 % |
| Install/quick-start/usage heading | 67 % | 65 % | 67 % |
| One-line install command | 55 % | 55 % | 47 % |
| >= 3 badges in the head | 54 % | 45 % | 52 % |
| Star-history chart | 16 % | 18 % | 16 % |
| States it was built with AI | 1 % | 1 % | 1 % |

Median README length: fast 11,655 characters, slow 10,121.

### Fast risers (1k within 90 days; grey-area repos excluded): small-audience owners first

Fast risers in the sample: 275. Listed: all 49 whose owner is a user with < 100 followers, then the 15 fastest of the rest.

| Repo | Arch. | Lang. | Owner followers | Days to 1k | Stars now | Channel evidence | README | Description |
|---|---|---|---|---|---|---|---|---|
| [aattaran/deepclaude](https://github.com/aattaran/deepclaude) | AT | JavaScript | 20 | 1 | 2,257 | HN 678 pts (launch week) | media | Use Claude Code's autonomous agent loop with DeepSeek V4 Pro, OpenRouter, or any |
| [GordenSun/GordenPPTSkill](https://github.com/GordenSun/GordenPPTSkill) | SK | Python | 87 | 4 | 3,150 | no HN; CJK README | media, 1-line install, CJK | AI-friendly PPT builder skill: 17 hand-polished Chinese PPTX templates + non-des |
| [liuup/claude-code-analysis](https://github.com/liuup/claude-code-analysis) | CR | TypeScript | 43 | 6 | 3,954 | no HN; CJK README | CJK | The analysis of Claude Code |
| [CoderLuii/HolyClaude](https://github.com/CoderLuii/HolyClaude) | AT | JavaScript | 83 | 6 | 2,570 | no HN; CJK README | media, 1-line install, CJK | AI coding workstation: Claude Code + web UI + 8 AI CLIs + headless browser + 50+ |
| [fengshao1227/ccg-workflow](https://github.com/fengshao1227/ccg-workflow) | SK | TypeScript | 62 | 10 | 5,917 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [GordenSun/GordenSuperPPTSkills](https://github.com/GordenSun/GordenSuperPPTSkills) | SK | Python | 87 | 10 | 2,012 | no HN; CJK README | media, CJK | (CJK description) |
| [sogonov/anubis](https://github.com/sogonov/anubis) | DA | Kotlin | 41 | 10 | 1,223 | no HN | text only | Android app manager with VPN integration. Manages groups of apps by freezing/unf |
| [abusoww/tuxmate](https://github.com/abusoww/tuxmate) | DT | TypeScript | 70 | 11 | 1,838 | HN 1 pts | media, 1-line install | THE MISSING BULK APP INSTALLER FOR LINUX |
| [truongduy2611/app-store-preflight-skills](https://github.com/truongduy2611/app-store-preflight-skills) | SK | – | 25 | 13 | 1,371 | no HN | 1-line install | AI agent skill to scan iOS/macOS projects for App Store rejection patterns befor |
| [nickrunning/wechat-selkies](https://github.com/nickrunning/wechat-selkies) | SH | Python | 28 | 15 | 3,044 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [rberg27/doom-coding](https://github.com/rberg27/doom-coding) | CR | – | 32 | 16 | 1,733 | HN 577 pts | media | A guide for how to use your smartphone to code anywhere at anytime. |
| [i12bp8/TagTinker](https://github.com/i12bp8/TagTinker) | HW | C | 71 | 18 | 1,958 | HN 372 pts | media | Flipper Zero app for ESL research using IR. All based on https://www.furrtek.org |
| [luzhenhua/echo-flow](https://github.com/luzhenhua/echo-flow) | DA | JavaScript | 63 | 19 | 2,291 | no HN; CJK README | 1-line install, CJK | (CJK description) |
| [luolangaga/tubatools](https://github.com/luolangaga/tubatools) | DA | C# | 71 | 19 | 4,302 | no HN; CJK README | media, CJK | (CJK description) |
| [tradecatlabs/vibe-coding-cn](https://github.com/tradecatlabs/vibe-coding-cn) | CR | Python | 55 | 20 | 16,378 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [dirac-run/dirac](https://github.com/dirac-run/dirac) | AT | TypeScript | 28 | 25 | 1,514 | HN 393 pts | media, 1-line install | Coding Agent singularly focused efficiency and context curation. Reduces API cos |
| [Houseofmvps/codesight](https://github.com/Houseofmvps/codesight) | AT | TypeScript | 29 | 28 | 1,407 | no HN | 1-line install | Universal AI context generator. Saves thousands of tokens per conversation in Cl |
| [Master-cai/Research-Paper-Writing-Skills](https://github.com/Master-cai/Research-Paper-Writing-Skills) | SK | – | 92 | 30 | 7,093 | no HN; CJK README | CJK | Skill package for ML/CV/NLP paper writing, curated and adapted from Prof. Peng S |
| [jenish-sojitra/JSAnalyzer](https://github.com/jenish-sojitra/JSAnalyzer) | SEC | Python | 79 | 30 | 1,177 | HN 20 pts | text only |  |
| [lhfer/claude-howto-zh-cn](https://github.com/lhfer/claude-howto-zh-cn) | CR | Python | 17 | 33 | 2,300 | no HN; CJK README | media, CJK | (CJK description) |
| [yituorou/meatshell](https://github.com/yituorou/meatshell) | DT | Rust | 14 | 34 | 1,476 | no HN; CJK README | media, CJK | (CJK description) |
| [dreamzero0/dreamzero](https://github.com/dreamzero0/dreamzero) | ML | Python | 7 | 35 | 2,670 | no HN | 1-line install | Code to pretrain, fine-tune, and evaluate DreamZero and run sim & real-world eva |
| [yohey-w/multi-agent-shogun](https://github.com/yohey-w/multi-agent-shogun) | AT | Shell | 52 | 38 | 1,424 | HN 3 pts | media, 1-line install, CJK | Samurai-inspired multi-agent system for Claude Code. Orchestrate parallel AI tas |
| [tianma-if/edgeever](https://github.com/tianma-if/edgeever) | SH | HTML | 64 | 44 | 1,519 | no HN; CJK README | media, 1-line install, CJK | Open-source, AI-native knowledge base & Evernote alternative with native MCP. Ze |
| [jsattler/BetterCapture](https://github.com/jsattler/BetterCapture) | DA | Swift | 54 | 47 | 1,661 | HN 4 pts | media, 1-line install | The macOS screen recorder for the rest of us - always free and open source with  |
| [mahonzhan/awesome-coding-plan](https://github.com/mahonzhan/awesome-coding-plan) | CR | SCSS | 23 | 50 | 2,886 | no HN; CJK README | CJK | (CJK description) |
| [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net) | AT | TypeScript | 73 | 51 | 1,555 | no HN; CJK README | media, 1-line install, CJK | A pre-execution guard for AI coding agents. It blocks destructive Git and file s |
| [nduckmink/arkon](https://github.com/nduckmink/arkon) | AT | Python | 56 | 53 | 1,461 | no HN | media | Arkon: Enterprise AI Knowledge Hub & MCP Server. Self-hosted knowledge base for  |
| [cubewhy/skid-homework](https://github.com/cubewhy/skid-homework) | AA | TypeScript | 93 | 53 | 1,713 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [c-narcissus/paper-framework-figure-studio-pro](https://github.com/c-narcissus/paper-framework-figure-studio-pro) | SK | – | 45 | 53 | 2,176 | no HN; CJK README | media, CJK | A multi-round co-design skill for publication-ready paper framework diagrams and |
| [skyllwt/AutoSci](https://github.com/skyllwt/AutoSci) | AA | Python | 50 | 54 | 1,687 | no HN; CJK README | media, gif, 1-line install, CJK | Karpathy's LLM-Wiki vision, fully realized  wiki-centric full-lifecycle AI resea |
| [parcadei/llm-tldr](https://github.com/parcadei/llm-tldr) | AT | Python | 0 | 55 | 1,168 | HN 1 pts | 1-line install | 95% token savings. 155x faster queries. 16 languages.  LLMs can't read your enti |
| [breaking-brake/cc-wf-studio](https://github.com/breaking-brake/cc-wf-studio) | AT | TypeScript | 87 | 59 | 5,389 | no HN | media, gif, 1-line install | CC Workflow Studio |
| [lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki) | AA | Python | 50 | 59 | 1,644 | no HN | media, 1-line install | Open Source Implementation of Karpathy's LLM Wiki. Upload documents, connect you |
| [juliye2025/evil-read-arxiv](https://github.com/juliye2025/evil-read-arxiv) | SK | Python | 64 | 61 | 1,678 | no HN; CJK README | 1-line install, CJK | (CJK description) |
| [lingfengQAQ/webnovel-writer](https://github.com/lingfengQAQ/webnovel-writer) | SK | Python | 64 | 65 | 7,198 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [eneskirca/nodeterm](https://github.com/eneskirca/nodeterm) | AT | TypeScript | 45 | 68 | 1,895 | no HN | media, 1-line install | Node-based terminal manager for AI coding agents  tmux-backed terminals and para |
| [AlexandrosGounis/pdfx](https://github.com/AlexandrosGounis/pdfx) | DA | TypeScript | 31 | 68 | 1,064 | HN 3 pts | media | A free-floating 2D Canvas for processing multiple PDF files simultaneously |
| [Javis603/token-monitor](https://github.com/Javis603/token-monitor) | AT | JavaScript | 28 | 71 | 2,360 | no HN; CJK README | media, gif, 1-line install, CJK | Local-first desktop widget for tracking token usage, costs, and limits across 40 |
| [kitsumed/ShizuCallRecorder](https://github.com/kitsumed/ShizuCallRecorder) | DA | Kotlin | 75 | 72 | 1,593 | HN 1 pts | text only | ShizuCallRecorder empowers ADB through Shizuku to record phone calls on non-root |
| [caomaolufei/AIInfraGuide](https://github.com/caomaolufei/AIInfraGuide) | CR | Astro | 60 | 73 | 2,450 | no HN; CJK README | media, CJK | (CJK description) |
| [andyhuo520/aetherviz-master](https://github.com/andyhuo520/aetherviz-master) | SK | – | 66 | 75 | 1,373 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [ufy2024/AuC](https://github.com/ufy2024/AuC) | AT | Python | 11 | 75 | 1,087 | no HN; CJK README | 1-line install, CJK | Agents-ufy-Core |
| [PenglongHuang/chinese-novelist-skill](https://github.com/PenglongHuang/chinese-novelist-skill) | SK | Python | 56 | 75 | 3,184 | no HN; CJK README | media, 1-line install, CJK | (CJK description) |
| [hello245m/free-stockdb](https://github.com/hello245m/free-stockdb) | DT | HTML | 46 | 79 | 2,699 | no HN; CJK README | CJK | (CJK description) |
| [haowang02/codex-candy-eval](https://github.com/haowang02/codex-candy-eval) | AT | Python | 50 | 83 | 1,094 | no HN; CJK README | media, CJK | (CJK description) |
| [ddlmanus/MacOptimizer](https://github.com/ddlmanus/MacOptimizer) | DA | Swift | 42 | 86 | 1,811 | no HN; CJK README | media, 1-line install, CJK | MacOptimizer is a system optimization tool designed specifically for macOS, feat |
| [Mibayy/token-savior](https://github.com/Mibayy/token-savior) | AT | Python | 26 | 87 | 1,157 | no HN | 1-line install | MCP server that gets Claude to 97.9% (188/192) on a real coding benchmark at -80 |
| [xintaofei/codeg](https://github.com/xintaofei/codeg) | AT | Rust | 38 | 88 | 3,678 | no HN; CJK README | media, 1-line install, CJK | Collaborative multi-agent AI coding workspace: aggregate sessions from Claude Co |
| [codeany-ai/open-agent-sdk-typescript](https://github.com/codeany-ai/open-agent-sdk-typescript) | AT | TypeScript | 51 (org) | 0 | 2,742 | HN 7 pts | 1-line install | Agent-SDK without CLI dependencies, as an alternative to claude-agent-sdk, compl |
| [karpathy/reader3](https://github.com/karpathy/reader3) | AA | Python | 223076 | 0 | 3,866 | HN 2 pts | media | Quick illustration of how one can easily read books together with LLMs. It's gre |
| [Tongyi-MAI/Z-Image](https://github.com/Tongyi-MAI/Z-Image) | ML | Python | 473 (org) | 1 | 12,050 | HN 398 pts (launch week) | 1-line install, CJK |  |
| [lintsinghua/claude-code-book](https://github.com/lintsinghua/claude-code-book) | CR | Python | 314 | 1 | 4,273 | no HN; CJK README | media, CJK | (CJK description) |
| [straight-tamago/misaka26](https://github.com/straight-tamago/misaka26) | DA | – | 2244 | 1 | 4,033 | no HN | text only | iOS /iPadOS 16.0 - 26.1, An ultimate customization tool, uilitizing the bug that |
| [Polymarket/polymarket-cli](https://github.com/Polymarket/polymarket-cli) | DT | Rust | 2424 (org) | 1 | 2,881 | no HN | 1-line install |  |
| [blader/humanizer](https://github.com/blader/humanizer) | SK | Python | 1262 | 1 | 51,916 | HN 3 pts | 1-line install | Agent skill that removes signs of AI-generated writing from text |
| [MemPalace/mempalace](https://github.com/MemPalace/mempalace) | AT | Python | 659 (org) | 1 | 59,268 | HN 1 pts | media, 1-line install | The best-benchmarked open-source AI memory system. And it's free. |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | CR | – | 4047 (org) | 1 | 117,811 | HN 4 pts | media | A collection of DESIGN.md files analysis by popular brand design systems. Drop o |
| [antirez/ds4](https://github.com/antirez/ds4) | AT | C | 31767 | 1 | 22,691 | HN 499 pts (launch week) | media | DeepSeek 4 Flash and PRO local inference engine for Metal, CUDA and ROCm |
| [alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill) | SK | Python | 10203 | 1 | 33,203 | no HN; CJK README | media, gif, 1-line install, CJK | (CJK description) |
| [productdevbook/port-killer](https://github.com/productdevbook/port-killer) | DA | Swift | 598 | 1 | 5,076 | HN 1 pts | media, 1-line install | A powerful cross-platform port management tool for developers. Monitor ports, ma |
| [Snapchat/Valdi](https://github.com/Snapchat/Valdi) | DT | C++ | 1440 (org) | 2 | 16,377 | HN 534 pts (launch week) | media, 1-line install | Valdi is a cross-platform UI framework that delivers native performance without  |
| [browser-use/browser-harness](https://github.com/browser-use/browser-harness) | AT | Python | 4486 (org) | 2 | 18,103 | HN 134 pts | media, gif | Browser Harness / Self-healing harness that enables LLMs to complete any task. |
| [Snowflake-Labs/pg_lake](https://github.com/Snowflake-Labs/pg_lake) | DT | Python | 2776 (org) | 2 | 1,644 | HN 371 pts (launch week) | text only | pg_lake: Postgres with Iceberg and data lake access |
<!-- analyze:end -->

## 4. Conversion by tier
<!-- tiers:start -->
_Generated by `TIERS_FILE=tiers-sys.json node history/research/foundation/tiers.mjs report`: 26 creation days spaced every 11 days (`tiers.mjs collect -11`), so weekdays rotate and every month is covered. It replaces a first sample of 6 random days (5 of them Sundays), which gave the same ranking (§9, objection 2)._

Creation days sampled (26): 2025-09-25, 2025-10-06, 2025-10-17, 2025-10-28, 2025-11-08, 2025-11-19, 2025-11-30, 2025-12-11, 2025-12-22, 2026-01-02, 2026-01-13, 2026-01-24, 2026-02-04, 2026-02-15, 2026-02-26, 2026-03-09, 2026-03-20, 2026-03-31, 2026-04-11, 2026-04-22, 2026-05-03, 2026-05-14, 2026-05-25, 2026-06-05, 2026-06-16, 2026-06-27. Tier 10-99: 15909 repos; 100-999: 2231; >= 1000: the full population (3246).
Keyword classifier agreement with the 500 manual labels (AT and AA merged into AI): 63 %.

| Archetype (keyword proxy) | 10-99 | 100-999 | >= 1000 | Lift, >= 1000 vs 10-99 |
|---|---|---|---|---|
| AI | 23.1 % | 31.2 % | 39.4 % | 1.70 |
| SK | 6.0 % | 9.5 % | 14.9 % | 2.48 |
| CR | 7.4 % | 9.6 % | 8.7 % | 1.17 |
| ML | 4.1 % | 4.2 % | 4.1 % | 0.99 |
| DT | 8.4 % | 6.5 % | 4.8 % | 0.57 |
| SH | 1.9 % | 1.7 % | 2.6 % | 1.34 |
| DA | 2.7 % | 2.8 % | 3.5 % | 1.28 |
| SEC | 2.7 % | 3.2 % | 2.9 % | 1.07 |
| GR | 1.8 % | 3.5 % | 3.4 % | 1.91 |
| FUN | 3.3 % | 2.5 % | 1.9 % | 0.58 |
| HW | 2.3 % | 1.9 % | 1.0 % | 0.43 |
| OTH | 36.3 % | 23.4 % | 12.9 % | 0.36 |

Estimated conversion for repos with >= 10 stars, by archetype (OTH excluded from the normalized lift):

| Archetype | Normalized lift (>= 1000 vs 10-99) | P(>= 100 given >= 10) | P(>= 1000 given >= 10) |
|---|---|---|---|
| AI | 1.25 | 18.1 % | 2.71 % |
| SK | 1.81 | 21.2 % | 3.79 % |
| CR | 0.86 | 17.0 % | 1.89 % |
| ML | 0.72 | 14.0 % | 1.65 % |
| DT | 0.42 | 10.6 % | 0.99 % |
| SH | 0.98 | 13.1 % | 2.27 % |
| DA | 0.93 | 14.5 % | 2.12 % |
| SEC | 0.78 | 15.5 % | 1.76 % |
| GR | 1.40 | 23.8 % | 2.83 % |
| FUN | 0.42 | 10.6 % | 1.00 % |
| HW | 0.32 | 11.1 % | 0.75 % |
| All | 1.00 | 13.7 % | 1.67 % |

Day-level bootstrap over 26 sampled days (1,000 resamples), P(>= 1000 given >= 10), 10th-90th percentile:
- SK: 3.4 % to 4.2 % (point estimate 3.8 %)
- AI: 2.5 % to 2.9 % (point estimate 2.7 %)
- CR: 1.8 % to 2.0 % (point estimate 1.9 %)
- DT: 0.9 % to 1.1 % (point estimate 1.0 %)
- FUN: 0.9 % to 1.1 % (point estimate 1.0 %)

Owners that are users with < 100 followers, given >= 10 stars: P(>= 100) 10.3 %, P(>= 1000) 0.71 %. All other owners: P(>= 100) 18.2 %, P(>= 1000) 2.94 %.

Owners that are users with < 100 followers: 10-99 tier 59 % (n 300); 100-999 tier 45 % (n 300); >= 1000 sample 24 % (n 500).
Organization-owned: 10-99 19 %; 100-999 26 %; >= 1000 40 %.
<!-- tiers:end -->

## 5. How cold starts happened
<!-- coldstart:start -->
Cold-start winners in the sample (fast risers whose owner is a user with < 100 followers, grey-area repos excluded): **49**.
- **Archetypes**: AI-agent tooling 15, agent skills 10, desktop/mobile utilities 7, curated resources 6, dev tools 3, AI apps 3, self-hosted 2, other 3. 33 of 49 are about AI coding agents.
- **Chinese reach**: 30 of 49 have CJK text in the README, and 17 have a CJK description. Only 4 of 49 had an HN story with ≥ 100 points.
- **Launch burst**: their median stars in the first 7 days after the first star is 260 (p25 105, p75 648), and their median single best day is 203 stars. Most cold starts that reached 1k in 90 days had a burst of a few hundred stars in the first week, but not all: 12 of the 49 had fewer than 100.

Launch channels of 12 cold-start winners without HN or CJK signals, found by web search (subagent in S016; every claim has a URL; confidence as judged by the searcher):

| Repo | Channels found | Amplifier | Confidence |
|---|---|---|---|
| sogonov/anubis | The author's own Russian [Habr article](https://habr.com/ru/articles/1023352/) the day after creation (+437 votes, "192K reach"), then reposts | Habr front page | high |
| abusoww/tuxmate | [XDA](https://www.xda-developers.com/tuxmate-ninite-linux-supports-every-major-distro/) ("Ninite for Linux"), [AlternativeTo](https://alternativeto.net/software/tuxmate/about) | XDA Developers | med |
| truongduy2611/app-store-preflight-skills | [GitHubDaily on X](https://x.com/GitHub_Daily/status/2035620044332560833) three days after creation; [skills.sh](https://www.skills.sh/truongduy2611/app-store-preflight-skills) | Large Chinese X account | med-high |
| Houseofmvps/codesight | [awesome-claude-code issue](https://github.com/hesreallyhim/awesome-claude-code/issues/1513); MCP directories ([Glama](https://glama.ai/mcp/servers/Houseofmvps/codesight)) | not found | low |
| breaking-brake/cc-wf-studio | Japanese dev sites [Qiita](https://qiita.com/PDC-Kurashinak/items/d0c88338d4252f52855a) and [Zenn](https://zenn.dev/sika7/articles/778304406e60e0); VS Code Marketplace | not found | low-med |
| eneskirca/nodeterm | A Reddit post, known from [a large X account's repost](https://x.com/VaibhavSisinty/status/2089588180144288169); [Product Hunt](https://www.producthunt.com/products/nodeterm-terminal-manager); a Trendshift badge | Large X account | med |
| Mibayy/token-savior | [awesome-claude-code issue](https://github.com/hesreallyhim/awesome-claude-code/issues/1376); MCP directories | not found | low |
| jsattler/BetterCapture | [MacRumors forum thread](https://forums.macrumors.com/threads/bettercapture-a-free-open-source-macos-screen-recorder.2477379/); AlternativeTo | not found | low |
| parcadei/llm-tldr | Spun out of the author's 3.9k-star [continuous-claude-v3](https://github.com/parcadei/continuous-claude-v3) | The author's sibling repo | med |
| lucasastorian/llmwiki | Created the day Karpathy published his [llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); listed in roundup guides | Karpathy's gist (indirect) | low-med |
| AlexandrosGounis/pdfx | The author's own [DEV article](https://dev.to/alexandros_gounis_dfacceb/pdf-didnt-stop-evolving-because-it-was-perfect-it-stopped-because-adobe-won-4nn6) (June 30); [Trendshift](https://trendshift.io/repositories/65803) | not found | med |
| kitsumed/ShizuCallRecorder | [F-Droid](https://f-droid.org/packages/com.kitsumed.shizucallrecorder/), IzzyOnDroid | not found | low |

**Correction checked against star data**: pdfx's burst came before its DEV article. It gained 101 and 272 stars on 2026-06-26 and 06-27 and 118 on 06-28, but only 37 on 06-30, the day of the article (GitHub star history). The DEV article rode the burst; it did not ignite it.

**Patterns**:
- **One strong post in a large community often carries a cold start** (an amplifier was identified for 7 of the 12; the other 5 are unknown): a front-page Habr article (anubis), tech press (XDA for tuxmate), Japanese dev sites (Qiita, Zenn), or a big aggregator account on X (GitHubDaily). The reach is borrowed from the venue, not the author.
- **Riding a wave works**: llmwiki appeared the same day as Karpathy's gist; many skill repos appeared within days of Claude Code features.
- **Lists and directories are follow-on, not ignition**: awesome-list issues and MCP directories appear for the weakest-evidence repos only.
- **Aggregator accounts pick up repos on their own**: GitHubDaily and similar accounts repost trending or novel repos without being asked, so a repo that is clearly useful and well presented can be amplified without any owner account.
<!-- coldstart:end -->

## 6. DEV as a launch channel
<!-- dev:start -->
_Generated by `node history/research/foundation/dev.mjs report`; data in `foundation/dev.csv`. Selection: the top-365 lists (by reactions) of 24 tags, keeping project announcements whose body links a repo owned by the author's GitHub account. Many come from niche tags, so the sample is not dominated by highly reacted articles (median 7 reactions). 33 articles are under 30 days old, so their 30-day windows are truncated._

Articles (top-365 lists of 24 tags) linking the author's own GitHub repo, with star history: 687.

| Measure | p25 | Median | p75 | p90 | Max |
|---|---|---|---|---|---|
| Reactions | 2 | 7 | 18 | 39 | 225 |
| Repo stars before the article | 0 | 0 | 4 | 28 | 25196 |
| Stars in the 7 days before | 0 | 0 | 1 | 4 | 6188 |
| Stars in days 0-6 after publication | 0 | 1 | 4 | 12 | 10962 |
| Lift (days 0-6 minus the 7 days before) | 0 | 0 | 2 | 7 | 4774 |
| Stars in days 0-29 | 0 | 2 | 7 | 28 | 21429 |
| Stars in days 30-59 | 0 | 0 | 2 | 8 | 6831 |

Articles about repos with < 50 stars at publication (cold start): 639; their 7-day gain: median 1, p75 3, p90 10, max 470; share with >= 100 stars in 30 days: 2 %.

By reactions: 0-19 reactions: n 526, median 7-day gain 1; 20-49 reactions: n 113, median 7-day gain 1; 50-99 reactions: n 38, median 7-day gain 3; 100- reactions: n 10, median 7-day gain 4.

Top 15 by 7-day gain:

| Article | Published | Reactions | Repo | Stars before | 7 days before | Days 0-6 | Days 0-29 |
|---|---|---|---|---|---|---|---|
| [Build It, Then Use It: How I wrote 435 AI engineering lesson](https://dev.to/rohitg00/build-it-then-use-it-how-i-wrote-435-ai-engineering-lessons-from-scratch-5d2d) | 2026-05-24 | 29 | rohitg00/ai-engineering-from-scratch | 13833 | 6188 | 10962 | 21429 |
| [GitHub Store reaches 1.9k in one month](https://dev.to/rainxchzed/github-store-reaches-19k-in-one-month-4l8a) | 2025-12-31 | 1 | rainxchzed/Github-Store | 1789 | 543 | 1249 | 3484 |
| [Free LocalStack Alternative  +35 AWS Services and counting](https://dev.to/nahuel990/free-localstack-alternative-20-aws-services-and-counting-4ob1) | 2026-03-24 | 8 | Nahuel990/ministack | 0 | 0 | 470 | 2139 |
| [The project file is the interface: letting AI agents drive a](https://dev.to/ronak_parmar_033c50d168b5/the-project-file-is-the-interface-letting-ai-agents-drive-a-video-editor-58hd) | 2026-07-09 | 19 | ronak-create/FableCut | 0 | 0 | 451 | 578 |
| [Letting Claude Code's Routines continuously tune my CLI's pe](https://dev.to/yamadashy/letting-claude-codes-routines-continuously-tune-my-clis-performance-2kk0) | 2026-04-30 | 6 | yamadashy/repomix | 23809 | 329 | 330 | 1654 |
| [Built Gova, a declarative GUI framework for Go](https://dev.to/namanvyas/built-gova-a-declarative-gui-framework-for-go-48m6) | 2026-04-22 | 7 | nv404/gova | 0 | 0 | 304 | 329 |
| [Introducing nono: A Secure Sandbox for AI Agents](https://dev.to/lukehinds/introducing-nono-a-secure-sandbox-for-ai-agents-1lo2) | 2026-02-02 | 5 | lukehinds/nono | 49 | 49 | 236 | 645 |
| [I Built an Open Source GitHub Dashboard Because My Repositor](https://dev.to/debba/i-built-an-open-source-github-dashboard-because-my-repositories-were-becoming-unmanageable-1hdk) | 2026-05-04 | 26 | debba/gh-dashboard | 97 | 97 | 184 | 243 |
| [prmt: instant-feeling shell prompts (sub-millisecond, even o](https://dev.to/zenpie/prmt-instant-feeling-shell-prompts-sub-millisecond-even-over-ssh-2dd3) | 2025-10-29 | 0 | 3axap4eHko/prmt | 0 | 0 | 164 | 214 |
| [cargo-rail: Making Rust Monorepos Boring Again](https://dev.to/loadingalias/cargo-rail-making-rust-monorepos-boring-again-3i93) | 2025-12-10 | 0 | loadingalias/cargo-rail | 1 | 0 | 157 | 185 |
| [I Built a Job Queue That's 32x Faster Than BullMQ (No Redis ](https://dev.to/egeominotti/i-built-a-job-queue-thats-32x-faster-than-bullmq-no-redis-required-1n5g) | 2026-01-30 | 4 | egeominotti/bunqueue | 1 | 1 | 148 | 321 |
| [Why I Built Yet Another SQL Client (And Made It Open Source)](https://dev.to/gillarohith/why-i-built-yet-another-sql-client-and-made-it-open-source-235d) | 2025-12-12 | 13 | Rohithgilla12/data-peek | 1312 | 121 | 122 | 175 |
| [Building a Process Injection Detector in Rust](https://dev.to/pandaadir05/building-a-process-injection-detector-in-rust-el2) | 2025-11-21 | 1 | pandaadir05/ghost | 0 | 0 | 105 | 222 |
| [pgit: What If Your Git History Was a SQL Database?](https://dev.to/imgajeed76/pgit-what-if-your-git-history-was-a-sql-database-1743) | 2026-03-17 | 7 | ImGajeed76/pgit | 2 | 0 | 101 | 174 |
| [I Built a Desktop App That Commits to GitHub So I Dont Have ](https://dev.to/trojanmocx/i-built-a-desktop-app-that-commits-to-github-so-i-dont-have-to-lie-about-consistency-3jd5) | 2026-01-05 | 42 | TROJANmocX/-Auto-Commit-Desktop-App | 0 | 0 | 101 | 104 |

**The large gains often came with other channels.** Of the seven biggest 7-day gains on repos with < 50 stars before the article, four had an HN story on the same day or within two days: ronak-create/FableCut (98 points), nv404/gova (143), loadingalias/cargo-rail (61), and egeominotti/bunqueue (39). Nahuel990/ministack (470 stars in the week) had a 1-point HN story; its "free LocalStack alternative" angle suggests another venue. lukehinds/nono and 3axap4eHko/prmt had no HN story. (HN Algolia, 2026-09-25.)

**Conclusion**: a DEV article by itself moves a repo by about one star a week at the median. The decision-relevant figure is the tail: of 460 launches on repos with < 50 stars, 8 (1.7 %) gained ≥ 100 stars in 30 days. Reactions barely predict stars. DEV is a place to teach and to be found later, not a reliable launch engine (L-010).
<!-- dev:end -->

## 7. Other observations
- **GitHub stargazer data is private since July 2026.** Listing another repo's stargazers now returns 404 (REST) or empty edges (GraphQL) unless the caller is an admin or collaborator ([changelog, 2026-06-30](https://github.blog/changelog/2026-06-30-upcoming-access-restrictions-to-public-api-endpoints-and-ui-views/)). The replacement is `GET /repos/{owner}/{repo}/stargazers/history` (API version 2026-03-10), which returns weekly buckets with daily counts for any public repo ([changelog, 2026-09-04](https://github.blog/changelog/2026-09-04-new-api-endpoint-provides-privacy-safe-star-history-data/); [docs](https://docs.github.com/en/rest/activity/starring)). star-history.com lost charts for repos their users do not own, then recovered with the new endpoint ([star-history blog](https://www.star-history.com/blog/github-stargazer-api-restriction/)). Our own repos are unaffected, so `tools/metrics.mjs` keeps working.
- **DEV exposes an AI-disclosure field.** The DEV articles API now returns `ai_disclosure_level` and `ai_disclosure_label` for each article (seen in S016), which fits L-003.
- **GitHub Trending thresholds by language can be low** (L-011, one snapshot on 2026-09-25): the daily lists showed "stars today" from 36 (overall), 16 (Python), 10 (TypeScript), 7 (JavaScript), 5 (Rust), 2 (Go), and 0 (Shell) upward. Repos with no detected language, such as Markdown-only skills, appear only in the overall list.
- **Skill awesome lists are follow-on channels** (L-009): of five large lists, three are closed in practice (ComposioHQ/awesome-claude-skills has 1,382 open PRs and no merge in 90 days); the two active ones require prior traction (VoltAgent/awesome-agent-skills rejects brand-new skills; hesreallyhim/awesome-claude-code needs ≥ 14 days of activity or ≥ 100 stars and accepts only human-made recommendations through its web form).
- **The skills ecosystem is extremely top-heavy.** Repos such as obra/superpowers (291k stars), affaan-m/ECC (267k), msitarzewski/agency-agents (154k), and garrytan/gstack (134k) were all created in the past year, while tools that lint or validate skills stay small (agent-sh/agnix 424, thedaviddias/skill-check 189; GitHub search, 2026-09-25).

## 8. Implications for project selection and launch
1. **Choose inside the AI-coding-agent space, in skill form where it fits.** It holds the largest audience, and skills convert best (L-006). The authentic angle is available to us alone: the developer is an AI coding agent.
2. **Plan for someone else's amplification.** Our own channels (DEV, awesome lists, GitHub search) are follow-on channels (L-009, L-010). Where the cause of a cold-start burst could be identified (7 of 12), and in all 7 viral skills dissected, it was a large venue or another person's post (L-007). The project must therefore be easy to share: a meme-able name, a complaint everyone has, a before/after demo that works as a screenshot, and a one-line install.
3. **Ride a news hook.** Winners appeared within days of a trigger (Karpathy's post, Wikipedia's AI-tells guide, a Reddit meme). Keep the build short enough to ship while a hook is fresh.
4. **Make claims measurable.** Most viral skills make unverified claims; a reproducible before/after measurement is a real differentiator and fits the Constitution (§7, §3C). It also filters ideas: the S016 premise check found no excess comment density in Claude-co-authored commits.
5. **Set expectations by base rates.** For owners with < 100 followers, about 10 % of repos with ≥ 10 stars reach 100 and about 0.7 % reach 1,000 (L-005, §9). Predictions in the selection ADR must start from these numbers.
6. **CJK-language reach may be a lever, and it needs the owner.** 30 of 49 cold-start winners had CJK text in the README, though the link to reaching 1,000 is confounded (§9). Adding it to a program repo is B-class (Constitution §3B) and must be requested through the outbox.
7. **Channel policy is the owner's decision.** The data shows DEV alone rarely moves a repo, while HN front pages and large X or Reddit posts do. The program keeps DEV-only promotion (S013) unless the owner decides otherwise.

## 9. Independent review (S016)
A subagent with no stake in the conclusions reviewed this study, its scripts, and `earnstar_1/candidate-23.md`. It confirmed that every generated table matches its script's output, that the population is not truncated by the 1,000-result search cap (largest month: 598), and that the ranking of skills and AI tooling above non-AI tools and playful projects survives a 2026-only check. Its objections, and the response to each:

| # | Objection | Severity | Response |
|---|---|---|---|
| 1 | Followers are counted after the stars arrived, so the gap between small-audience and other owners (0.57 % vs 4.4 %) is inflated: hits move their owners into the "other" bucket. If half of the 129 winners with 100–999 followers had < 100 at launch, the gap is about 0.9 % vs 3.7 %. | high | Accepted. §2, §4, §8, and L-005 now call the gap an upper bound (0.7 % vs 2.9 % with the 26-day sample). To do: estimate followers at launch. |
| 2 | The lower tiers come from 6 days, 5 of them Sundays and 2 before the skills boom; the skill share of the 10–99 tier ranges from 0.3 % to 8.7 % by day, so P(≥ 1,000 given skill) spans roughly 3–8 %. | high | Accepted and done in S016: 26 evenly spaced days (18,140 repos) replace the 6-day sample, with a day-level bootstrap. Skills: 3.8 % (3.4–4.2 %); the ranking is unchanged; the small-audience share of the 10–99 tier fell from 74 % to 59 %, which confirms the Sunday bias. |
| 3 | Classifier errors do not cancel: repos without a description (21.5 % of the 10–99 tier vs 5.1 % of winners) fall into OTH, which flatters every named class; per-class accuracy ranges from 0.13 (FUN) to 0.92 (SEC). | high | Accepted. The normalized lift (skills 2.15, dev tools 0.43) is the headline; absolute rates are indicative. To do: hand-label about 200 repos per lower tier. |
| 4 | "Every cold-start burst came from a large venue" overstates §5: 5 of 12 rows are "not found", and 12 of the 49 cold-start winners had < 100 stars in week one. | high | Accepted. Now: 7 of 12 had an identifiable outside amplifier, the rest are unknown; bursts are typical, not universal. |
| 5 | "Chinese reach is a major engine" is confounded (Chinese developers tend to have fewer followers); CJK share rises from the 10–99 tier (8.9 %) to 100–999 (14.7 %) but not to ≥ 1k (14.2 %); the detector also counts Japanese and Korean. | med | Accepted. Reworded to "associated with reaching 100 stars". |
| 6 | HN is undercounted (exact repo-URL search only); 8 of the 27 stories with ≥ 100 points came after the repo had 1k stars; the "launch week" flag used the first story's date, not the high-scoring story's (3 of 15 labels wrong). | med | Accepted. The flag now uses the high-scoring story's date (`analyze.mjs`), and §3 notes the undercount and the late stories. |
| 7 | The DEV sample is not "most-reacted" in practice (median 7 reactions), so "a typical article does worse" is unsupported; the decision figure is the tail: 8 of 460 cold launches (1.7 %) gained ≥ 100 stars in 30 days; "p90: 10" is the cold-start subset; the HN link holds for 4 of 7 big gains. | med | Accepted. §6, headline 8, and L-010 now lead with the 1.7 % tail and drop the direction-of-bias sentence. |
| 8 | "'You're absolutely right' is gone from current models" rests on a few repos (Opus 4: 13 of 18 hits from one repo; Opus 4.5: all 4 hits in 1 of 28 repos), is confounded with time (system prompts, users banning the phrase), and a missing phrase is not missing sycophancy (other flattery persists). | med-high | Accepted. `candidate-23.md` now says "not observed in about 114 newer-model repos" and 23c is undecided, pending a broader agreement lexicon. |
| 9 | "'genuinely' rose sharply" is overstated: the regex also counts "genuine"; one repo gives 10 of Opus 4.8's 30 hits; Opus 5 (0.09) is back near Opus 4.7, so the trend is not monotone. | med | Accepted. Reworded, with Opus 5 included; to do: per-repo intervals and a "genuinely"-only count. |
| 10 | "Table stakes … necessary" cannot follow from comparing winners only. | low-med | Accepted. "Necessary" removed; to do: compare with lower-tier READMEs. |
| 11 | Wording: 4.2 % vs 0.8 % is about fivefold, not fourfold; the "median 260" refers to the 49 fast cold starts; lexicon ratios rest on a 0.5 pseudo-count and 13 paired repos. | low | Accepted and reworded. |
