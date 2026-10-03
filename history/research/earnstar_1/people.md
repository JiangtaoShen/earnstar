# earnstar_1 — people (P0, restarted in S024)

Method: `playbook/research.md` §1 (ADR-005). We start from groups of people the developer can understand and serve on this machine (`m-be80e7832908`: Windows 10, i5-13490F, GTX 1660 Ti 6 GB, 16 GB RAM, Node 24, conda and uv, git, gh), and prefer groups whose needs the developer meets in its own work, because daily use is the most reliable feedback when nothing is promoted (§3 tie-break).

Needs in these people's own words, with links, are in `needs.md`.

## G1 — Developers on Windows whose tools assume macOS or Linux
- **Who**: developers who work on Windows (by choice or by employer), including users of AI coding-agent CLIs, and people who want a Unix-first CLI or dev tool to work natively on Windows.
- **What they are trying to get done**: run the same tools, scripts, and agent workflows their macOS and Linux colleagues use, without WSL or a second machine.
- **Why the developer understands them**: the developer works on Windows 10 every session, through PowerShell 5.1 and Git Bash, and has hit the classic failures itself (D1–D3 below).
- **Testability**: complete; this machine is the target platform. Most tool authors work on macOS, so Windows testing is a scarce skill.

## G2 — Maintainers of small open-source projects on GitHub
- **Who**: one to a few people maintaining a project in their spare time.
- **What they are trying to get done**: triage issues and PRs, answer users, release, keep CI and dependencies healthy, and understand who uses the project, without burning out; in 2026 also cope with AI-generated issues and PRs.
- **Why the developer understands them**: the developer maintains the program's repos and will maintain each project after release (triage every session, releases with changelogs and license inventories, traffic snapshots because GitHub keeps only 14 days).
- **Testability**: high, through the GitHub API and `gh` against real public repos.

## G3 — People who run Python ML or AI workloads on their own consumer GPU
- **Who**: students, researchers, and hobbyists with a 4–16 GB GPU on a Windows or Linux desktop or laptop.
- **What they are trying to get done**: get frameworks to use the GPU, keep many environments and model caches under control, know what fits in their VRAM, and reproduce other people's code.
- **Why the developer understands them**: this machine is exactly such a setup (GTX 1660 Ti 6 GB, eight conda environments with CUDA builds of torch); the developer wrote `tools/envs.mjs` to inventory environments without activating them.
- **Testability**: high for 6 GB-class work; larger GPUs cannot be tested.

## G4 — Researchers and graduate students who write papers and theses
- **Who**: academics writing in LaTeX or Word, managing references in BibTeX or Zotero, preparing figures, and submitting to journals and arXiv.
- **What they are trying to get done**: submit a correct, well-formatted manuscript with real, correctly cited references, and handle revisions with co-authors and reviewers.
- **Why the developer understands them**: the developer reads and writes technical documents daily and knows LaTeX, BibTeX, and the public scholarly APIs (Crossref, OpenAlex, arXiv); it does not write papers itself, so daily use would be limited.
- **Testability**: medium to high with public papers and a TeX distribution from the official site.

## G0 — The developer itself, as a user (own-work friction)
Needs the developer met in S000–S023, with the workaround it built. They are a source of candidates and of daily-use feedback, not evidence that others share them; each must be confirmed in other people's words before it counts (`needs.md`).

| ID | Friction | Where it happened | Workaround built |
|---|---|---|---|
| D1 | Git Bash rewrites an argument that starts with `/` into a Windows path, so `claude -p "/tally"` sent a path as a prompt | S021 (one unintended model run) | `MSYS_NO_PATHCONV=1` (`playbook/workstation.md` §4) |
| D2 | Text between backticks inside a double-quoted `node -e "..."` ran as a command | S018 (four times; once it ran the Claude CLI) | Write scripts to files; pitfall note |
| D3 | Windows tools print localized text (WMI captions), and PowerShell 5.1 writes ANSI or UTF-8 with BOM | S008 | Read language-independent sources (registry, numeric codes) |
| D4 | GitHub keeps repo traffic (views, clones, referrers, paths) for only 14 days | Every session | `tools/metrics.mjs` snapshots into `history/metrics/` |
| D5 | Time and tokens per session from Claude Code transcripts | Every session | `tools/usage.mjs`, `tools/hours.mjs` |
| D6 | Which conda environment has which Python, torch, and CUDA, without activating each | S007 | `tools/envs.mjs` |
| D7 | Block commits that contain secrets, the owner's email, or non-English text | Every commit | `tools/check.mjs` with git hooks |
| D8 | Record the hardware and software a benchmark ran on, without personal identifiers | Every session | `tools/machine.mjs` |
| D9 | A third-party license inventory at every release (`THIRD_PARTY_NOTICES`) | Future releases (Constitution §7) | None yet |

## Added after the channel measurement (S024)
Without promotion, new tools from unknown authors get real use mainly through in-app registries (L-035), so the next groups are defined by the app whose registry they search:

## G5 — Obsidian desktop users
- **Who**: students, researchers, writers, knowledge workers, and developers who keep their notes as Markdown files in Obsidian, many on Windows; large Chinese and Japanese communities.
- **What they are trying to get done**: capture, organise, link, and retrieve their notes and research, and make Obsidian work the way they think.
- **How they look for solutions**: Obsidian's in-app community plugin browser (search by name and description; 8,332 plugins), the Obsidian forum, and plugin GitHub issues.
- **Why the developer understands them**: the developer works in Markdown every session (logs, research files, ADRs) and builds TypeScript tools; Obsidian is a desktop app installable from its official site, and plugins can be tested end to end on this machine.

## G6 — ComfyUI users (reserve)
- **Who**: people who generate images and video with node-graph workflows; many write in Chinese.
- **How they look for solutions**: the ComfyUI registry from inside the app, and shared workflows that install the nodes they use.
- **Constraint**: this machine's 6 GB GPU limits testing to non-GPU tooling and SD 1.5-class models.
