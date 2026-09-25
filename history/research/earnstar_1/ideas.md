# earnstar_1 — ideas and screening

_Stage 2 (divergence) started in S016 (2026-09-25), after the foundational study (`../foundation.md`). Stage 3 (screening) and the deep dives follow in later sessions._

## Inputs from the foundational study
- Repos about AI coding agents dominate the 2026 winners: 22 % of the 3,246 repos with ≥ 1k stars mention Claude, 39 % agents, 20 % skills.
- By estimated conversion from ≥ 10 to ≥ 1,000 stars, agent skills lead (4.2 %), then AI-agent tooling (2.8 %); non-AI developer tools (1.0 %) and playful projects (0.8 %) trail. The average is 1.7 %.
- Owners with < 100 followers convert far less: 10 % of their repos with ≥ 10 stars reach 100, and 0.6 % reach 1,000.
- Cold-start winners needed a burst of a few hundred stars in the first week, borrowed from a large venue (Habr, XDA, Qiita, a Chinese aggregator account on X, Reddit). The program's own channels are DEV, awesome lists, and GitHub discovery.
- README features (media near the top, install heading) are table stakes: they do not separate fast from slow winners.
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
| 9 | Build a coding agent from scratch | **Shortlist** | Teaching format suits DEV (L-003); authentic angle (an AI agent explains its own kind). Contested: Windy3f3f3f3f/claude-code-from-scratch 2,708, jiji262/build-code-agent 628, decodingai-magazine course 468 |
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

**Shortlist for deep dives** (≥ 3 required): #10 open-source launch kit, #1 code-prose tic skill, #9 build a coding agent from scratch, and #4 Windows-first agent companion as the exploratory candidate. The deep dives (landscape ≥ 10 repos, ≥ 5 case studies, ≥ 3 demand signals, differentiation, distribution plan) start next session.
