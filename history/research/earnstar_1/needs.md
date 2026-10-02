# earnstar_1 — needs in people's own words (P0, S024)

Method: `playbook/research.md` §1–§3. Four groups (`people.md`) were studied in parallel by independent subagents with fresh searches in English and Chinese (read-only; quotes with links; independence checked by author; existing solutions searched by the outcome users want, L-029). The full reports, with every quote and link, are in `s024/`:

| Group | Report | Needs examined | Strongest need |
|---|---|---|---|
| G1 Windows developers | `s024/needs-G1-windows.md` | 12 | AI coding agents rewrite non-UTF-8 files as UTF-8 and break CRLF line endings |
| G2 Small-project maintainers | `s024/needs-G2-maintainers.md` | 22 | Know who owes the next reply; let the stale bot close only issues that wait on the reporter |
| G3 Local-GPU Python users | `s024/needs-G3-local-gpu.md` | 12 | "PyTorch can't use my GPU after an install or update; which build works on my card?" |
| G4 Researchers writing papers | `s024/needs-G4-researchers.md`, `s024/needs-G4-latexdiff-evidence.md` | 14 | A track-changes PDF of a revised LaTeX paper that compiles |

Most needs examined (about 60) were already met by a native feature or an adopted tool, or belong inside a vendor's code. The ones below are real and only partly met.

## Shortlist

### A. "Don't destroy my file's encoding or line endings" (G1, N1 + N2 + N6)
- **People**: developers whose code must stay in a legacy encoding (GBK, Shift_JIS, Windows-1250/1251/1252, Latin-1; toolchains such as Delphi, C++ Builder, VB6/VBA, PL/I, ERP languages, older MSVC) or in CRLF (Visual Studio, batch files), who let an AI coding agent edit it.
- **In their words**: "The encoding is mandated by the toolchain and can't be changed" ([claude-code#7134](https://github.com/anthropics/claude-code/issues/7134#issuecomment-4922011057), 2026-07); "an ASCII-only edit … still corrupts every non-ASCII byte" ([same thread](https://github.com/anthropics/claude-code/issues/7134#issuecomment-4923969362)); "This bug makes the codex diff completely useless" ([codex#4003](https://github.com/openai/codex/issues/4003#issuecomment-4095237119), 2026-03). 19 independent people for encodings and 16 for line endings, July 2025 to September 2026, across Claude Code, Codex, OpenCode, and Gemini CLI; people wrote their own hooks, file watchers, an OpenCode plugin, and MCP servers.
- **Reproduced on this machine** (S024 log, 06:16–06:36): an ASCII-only Edit replaced every Chinese, Portuguese, and Japanese character with U+FFFD; in a realistic task, Haiku 4.5 silently deleted the Chinese comments, translated the Chinese receipt strings to English, converted CRLF to LF, and reported "Done!". Opus 5.5 and Sonnet 5.5 with shell access noticed and worked around it.
- **Existing solutions tried**: ymonster/claude_encoding_guard (16 stars; Claude Code only; needs uv) worked on the realistic fixture but missed a short Shift_JIS file; mcp-file-tools (24 stars) works only if the model chooses its tools; text-encoding-guard (45 stars) repairs Chinese mojibake after the fact. Nothing for Codex or OpenCode. Claude Code fixed CRLF natively (2.1.77, 2.1.89) but not encodings.
- **Risks**: a vendor fix could land at any time; the newest large models already work around it when they have a shell; Codex and OpenCode cannot be tested end to end here (their accounts); the existing plugins' low adoption may mean people wait for the vendor rather than search.

### D. "Who owes the next reply?" (G2-1)
- **People**: maintainers of small and mid-sized projects who ask reporters for details, want abandoned reports to close themselves, and want issues where they owe the reply to stay visible and never be closed as stale.
- **In their words**: "I basically created my own custom response 'action' precisely because the default behavior of stale bot is so aggressive" ([actions/stale#719](https://github.com/actions/stale/issues/719#issuecomment-1858310205)); "a stale bot should never mark something as stale if the responsibility is on the maintainer to take an action" ([a maintainer's blog](https://jacobtomlinson.dev/posts/2024/most-stale-bots-are-anti-user-and-anti-contributor-but-they-dont-have-to-be/), 2024-12). 8 people in their own words (2020–2026), plus behaviour: GitHub code search (verified in S024) finds 180 workflow files that toggle an "awaiting" label on `issue_comment` by `author_association`, mostly hand-written; 435 YAML files reference the inactive lee-dohm/no-response (last push 2024-01, `node12`); 774 configure actions/stale's `only-labels` with an "awaiting" label; mocha ([#6212](https://github.com/mochajs/mocha/issues/6212), 2026) and LangChain built their own in 2026.
- **Existing solutions**: no-response (48 stars, inactive; author side only), actions/stale (no notion of who replied last), toggle actions with 1–4 stars, an LLM-based stale bot (6 stars); GitHub issue fields are organization-only; no cross-repo "waiting on me" view (gh-dash cannot express "the last human comment is not a maintainer's").
- **Risks**: in 2026 an agent writes such a workflow in minutes (mocha's fix was written by Copilot), so maintainers may not search for a packaged tool; label schemes differ between projects; GitHub is shipping in this space.

### B. "PyTorch can't use my GPU; which build works on my card?" (G3, N1 + N2 + N3)
- **People**: students, hobbyists, and ComfyUI or Whisper users with older (GTX 9xx/10xx) or brand-new (RTX 50) cards; many are not technical: "I couldn't understand your conversation at all" ([ComfyUI#9705](https://github.com/Comfy-Org/ComfyUI/issues/9705#issuecomment-3263509068)).
- **Evidence**: 17+ independent people (2025–2026); questions with 500k, 229k, 76k views; an open PyTorch RFC would drop pre-Turing cards in 2.15.
- **Existing solutions**: torchruntime (15 stars) installs the right build; uv's `--torch-backend=auto` reads only the driver; picker websites; six tiny CLIs, none adopted (L-029 pattern). Missing: a local diagnosis of the current environment with the one fixing command.
- **Risks**: this machine's card (sm_75) cannot reproduce the main failure; the support table must be kept current every PyTorch release; PEP 817 wheel variants would solve the install half natively.

### C. "A track-changes PDF of my revised LaTeX paper that compiles" (G4, N1)
- **People**: authors and PhD students at revision time, under a deadline.
- **Evidence**: 23 independent people (19 in 2024–2026); reproduced here with latexdiff 1.3.2 (the current 1.4.0 was not tested).
- **Existing solutions**: latexdiff (677 stars) breaks on tables, math, and macros; Overleaf's track changes is paid; more than 40 small wrappers and 7 web services, none adopted; a tree-based rival appeared on 2026-10-01.
- **Risks**: a hard problem (robust diffing of arbitrary LaTeX); crowded with unadopted attempts; the developer would not use it in its own work.

## Evaluation (`research.md` §3; 1–5, weighted)

| Criterion (weight) | A encoding guard | D reply tracker | B GPU doctor | C latexdiff |
|---|---|---|---|---|
| The need is real (30 %) | 5 | 4 | 5 | 4 |
| It is unmet (20 %) | 3 | 3 | 3 | 3 |
| We can serve it well (20 %) | 4 | 5 | 3 | 3 |
| People can find and try it (15 %) | 3 | 3 | 4 | 3 |
| It can keep improving (15 %) | 3 | 4 | 3 | 3 |
| **Weighted** | **3.80** | **3.85** | **3.75** | **3.30** |

Reasons for the scores that decide the order:
- **A, need 5**: 35 people in their own words, recent, with self-built workarounds, and reproduced here with silent data loss. **Unmet 3**: met for Claude Code users who find a 16-star plugin, and increasingly worked around by the newest models; unmet for Codex and OpenCode. **Improve 3**: the vendor fix risk caps it.
- **D, need 4**: strong behaviour (hundreds of hand-written workflows), but fewer people asking in their own words, and much of it older. **Unmet 3**: the hand-written workflows do work for their owners; the gaps are the abandoned action, stale closures of maintainer-owed issues, and the missing cross-repo view. **Serve 5**: deterministic, fully testable against real public repos and the program's own repos.
- **B, serve 3**: the main failure cannot be reproduced on this machine's card.
- **C** trails on every criterion but the need.

A, D, and B are within noise of each other (`research.md` §3). Tie-break: prefer the users the developer understands best and whose need the developer meets in its own work. The developer is itself an AI coding agent on a Windows machine whose system code page is GBK (A), and it maintains the program's repos and triages their issues at every session open (D, Constitution §4). Neither fact decides it, so both A and D go to the next stages (understand the job in detail, try the existing solutions, prototype on realistic tasks), and the prototypes decide. B is kept as the reserve.

## After the prototypes (S024)
- **D**: the hand-written workflows work for the projects that have them (1 stale label in 15 labelled issues across five projects, `lab/s024/proto-d/replystate.mjs`); the independent projects behind the 180 code-search hits are about 20 in the first 100, not 180; the remaining gaps (a packaged version, a cross-repo "waiting on me" view) have thin evidence in users' own words, and an agent now writes such a workflow in minutes. "It is unmet" drops from 3 to 2: weighted **3.65**.
- **A**: the prototype repaired every file damaged with U+FFFD in this session's runs exactly (original plus the intended change, original encoding, line endings, and BOM), which nobody offers today (the common advice is that the bytes are lost); Codex and OpenCode can run with local models through Ollama, so they can be tested end to end here. "It is unmet" rises from 3 to 4 (prevention exists only as 1–45-star plugins per agent; repair after the fact does not exist); "we can serve it well" stays 4 (Codex and OpenCode end-to-end tests are still to be verified); "it can keep improving" rises from 3 to 4 (clear iterations per agent and editor; the repair keeps its value even if one vendor fixes its tool): weighted **4.15**.
- A now leads D by 0.5, with differences of two points on "unmet" and one on "need" in A's favour and one point on "serve" in D's favour: more than noise (`research.md` §3). **A is the candidate for the selection ADR** (ADR-006); D and B are kept as alternatives. Details: `candidate-A-encoding.md`.

## After the critique of ADR-006 (S024)
The critique (`critique.md`, ADR-006 section) showed that A was scored by a different standard than D and that A's landscape was incomplete. One standard for all candidates:
- **Unmet**: a need is not "unmet" because tools are small; it is unmet if the people who have it have no working option they can reasonably find. Self-built workarounds that work count against "unmet" for every candidate alike; native fixes in any widely used tool count as meeting the need for those willing to use it.
- **Find**: 2 when the people look for fixes mainly in a vendor's issue thread (the program may not post there, L-034); 3 when they search the web or a registry with words a project can match; 4 when they search inside an app's own registry where new entries are visible.

| Criterion (weight) | A encoding | D reply tracker | B GPU doctor | C latexdiff |
|---|---|---|---|---|
| Need (30 %) | 5 | 4 | 5 | 4 |
| Unmet (20 %) | 2 (Kilo native, Codex flag, ~25 tools, a published recovery recipe) | 2 (workarounds work) | 3 (not yet audited) | 3 |
| Serve (20 %) | 3 | 5 | 3 | 3 |
| Find (15 %) | 2 | 3 | 3 | 3 |
| Improve (15 %) | 3 | 4 | 3 | 3 |
| **Weighted** | **3.25** | **3.65** | **3.60** | **3.30** |

No candidate stands out, and all are low. B has not yet had the landscape audit that sank A (L-029, L-034), and its "unmet 3" is provisional. Next: a pre-ADR landscape audit of B, and a measurement of where new tools from unknown authors are actually found without promotion, since "people can find it" is the binding constraint the critique exposed (both started at 07:18 in S024).
