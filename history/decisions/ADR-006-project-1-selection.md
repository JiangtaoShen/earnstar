# ADR-006: Project 1 selection — keep and repair file encodings and line endings that AI coding agents break

- **Date / session**: 2026-10-03 / S024 (draft)
- **Status**: withdrawn in S024 after the independent critique (`history/research/earnstar_1/critique.md`, ADR-006 section): Codex shipped a CRLF fix and Kilo native encoding support, about 25 small tools already exist, the same repair recipe was published in claude-code#7134, A was scored by a different standard than D, and the prototype failed under `core.autocrlf=true`. The draft is kept as the record.
- **Approved by**: developer (selection is within the developer's authority; B-class actions it implies, such as a first npm publication, go through the outbox)

## Context
Project 1 restarted its selection on 2026-10-03 under ADR-005: start from people's real needs, no promotion, release early and iterate. S024 studied four groups of people the developer can understand and serve on this machine (`history/research/earnstar_1/people.md`) and collected about 60 needs in their own words with fresh searches (`needs.md`, `s024/`). Most were already met. Four were real and only partly met; the two strongest went through job reconstruction, trials of the existing solutions, and prototypes on realistic tasks.

The P0+P1 ceiling in `playbook/defaults.md` (14 days after kickoff, 2026-10-09) will be exceeded if confirmation slips past S025, because the owner ordered a restart of the selection on 2026-10-03 (recorded reason).

## Selection Gate checklist
- [x] The people and the need are described, with quotes and links from at least five independent people: 19 for encodings and 16 for line endings (`s024/needs-G1-windows.md` N1, N2; summary in `needs.md` §A).
- [x] The existing solutions were found (searched in English and Chinese, by outcome words, including the feature lists and changelogs of Claude Code, Codex, and OpenCode) and the best one actually tried (claude_encoding_guard, in headless runs); why they fall short is recorded (`candidate-A-encoding.md` §3).
- [x] A prototype was tried on realistic tasks from the users' own descriptions: real damage produced by four agent setups on a realistic legacy project, repaired exactly (`candidate-A-encoding.md` §2, §4).
- [x] The first version, the learning plan after release, and the first three iterations are written down (below).
- [ ] The independent critique is recorded and every objection is answered (`critique.md`, ADR-006 section).
- [ ] The decision is confirmed in a later session.

## The people and the need
Developers whose files must stay in a legacy encoding (GBK, Shift_JIS, Big5, Windows-1250/1251/1252, Latin-1) or in CRLF, because a toolchain or a team requires it, and who use AI coding agents. In their words: "The encoding is mandated by the toolchain and can't be changed"; "an ASCII-only edit … still corrupts every non-ASCII byte" ([claude-code#7134](https://github.com/anthropics/claude-code/issues/7134)); "This bug makes the codex diff completely useless" ([codex#4003](https://github.com/openai/codex/issues/4003#issuecomment-4095237119)); "I have to remind it every time" (OpenCode, [#30205](https://github.com/anomalyco/opencode/issues/30205), translated). Reports run from July 2025 to September 2026 in all four major agents and in Chinese and Japanese blogs, and people have built their own hooks, file watchers, plugins, and MCP servers.

## Options

| Candidate | Need (30 %) | Unmet (20 %) | Serve (20 %) | Find (15 %) | Improve (15 %) | Weighted |
|---|---|---|---|---|---|---|
| **A. Keep and repair encodings and line endings broken by agents and editors** | 5 | 4 | 4 | 3 | 4 | **4.15** |
| D. Who owes the next reply (maintainers) | 4 | 2 | 5 | 3 | 4 | 3.65 |
| B. Why PyTorch can't use my GPU (local-GPU users) | 5 | 3 | 3 | 4 | 3 | 3.75 |
| C. A track-changes PDF of a LaTeX revision that compiles | 4 | 3 | 3 | 3 | 3 | 3.30 |

Reasons and evidence: `needs.md` (evaluation and "After the prototypes"). D's prototype showed that maintainers' hand-written workflows already work for them; B's main failure cannot be reproduced on this machine's GPU; C is crowded with more than 40 unadopted wrappers and the developer would not use it.

## Why existing tools fail these users
Prevention exists only as small per-agent plugins (Claude Code: 16 stars, needs `uv`, missed a short Shift_JIS file; OpenCode: 1 and 5 stars; nothing for Codex), the vendors have not fixed encodings (Claude Code #7134 open for 13 months; Codex CRLF fixes closed unmerged; OpenCode's PR open), and nothing repairs damage already done: the common advice is that replaced characters are lost. The newest large models now often notice and work around the problem when they have a shell, but a fast model (Haiku 4.5) destroyed content silently in the test, and every model is exposed when it uses the built-in edit tools (`candidate-A-encoding.md` §2–§3).

## Decision
Build project 1 as a small, dependency-free tool that keeps files in their original encoding, line endings, and BOM when AI coding agents (and editors) edit them, and repairs damage after the fact from git.

### First version (release by day 35 after kickoff, 2026-10-30)
1. **CLI** (Node, zero dependencies; Windows, macOS, Linux): `check` and `fix` compare changed files with `HEAD` (or the index), restore encoding, line endings, and BOM, recover damaged characters from the original, and report text that was lost; `check --staged` works as a git pre-commit hook for any agent or editor.
2. **Claude Code plugin**: PreToolUse (Edit, Write) snapshots the original bytes; PostToolUse repairs the file at once against the snapshot and, if text was lost, tells the model the real text of the affected lines.
3. **Codex and OpenCode recipes** on the same CLI, tested end to end with local models through Ollama (to be verified in P2; if a recipe cannot be verified, it is documented as untested or left out).
4. README in the users' words (who it is for, the damage it prevents and repairs, a recorded before/after made by a script in the repo, a 60-second quick start, an honest comparison with claude_encoding_guard, mcp-file-tools, and the vendors' own fixes, and when those are the better choice), tests on generated fixtures in every supported encoding, CI on Windows and Linux.

### How the project will learn after release (no promotion)
- **Users**: issues and discussions, answered within the next session; questions the README should have answered become README changes.
- **Usage signals**: npm downloads (first publication via the outbox), traffic and referrers (`tools/metrics.mjs`), the search terms that lead to the repo.
- **The developer's own use**: the developer is itself an AI coding agent on a Windows machine whose system code page is GBK; it runs the tool's test corpus of real public repositories in legacy encodings with each release, and uses `check --staged` in the program repos to catch line-ending and BOM changes in its own commits.
- **Vendor watch**: each session checks the Claude Code, Codex, and OpenCode changelogs for native fixes and adjusts the README's "when you don't need this" section.

### First three iterations (expected)
1. More agents and editors: whichever of Codex, OpenCode, Gemini CLI, or VS Code users ask for first; detection of files whose non-ASCII text was deleted entirely.
2. Better feedback to the model: give it the real text of legacy-encoded files when it reads them, so it can edit comments and strings correctly instead of only having its damage repaired.
3. Project-level settings: respect `.gitattributes` `working-tree-encoding` and `.editorconfig`, allow an explicit encoding per path, and handle mixed-encoding files and UTF-16.

## Predictions (falsifiable)
Base rate for a new, unpromoted small-owner tool: most end with single-digit or low double-digit stars (L-005, L-024); the closest existing tool reached 16 stars in 5.5 months with no promotion.
- **By close (≥ 2026-11-25)**: 5–40 stars (median 12); at least 2 issues or discussions from people other than the developer; at least 50 npm downloads in a month, if published.
- **Kill or pivot signals at the first iteration review (release + 14 days)**: zero external issues, zero referrals from search, and fewer than 20 npm downloads in 14 days → re-examine findability (name, description, README words) before any new feature; a native Claude Code encoding fix → shift the README and the iterations to repair, CRLF, and the other agents.

## Expected outcome
People whose agents break their legacy files find the tool by searching for that damage, install it in a minute, and stop losing text; the project improves from their reports. Review at the first iteration review (release + 14 days) and at close.

## Result
To be filled in at the review date.
