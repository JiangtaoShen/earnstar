<!-- Copied from the private working file lab/s024/needs-G1.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# G1 needs: Windows developers whose tools assume macOS/Linux

Researched 2026-10-03 (S024), read-only. Sources: GitHub issues/comments via `gh api` (anthropics/claude-code, openai/codex, google-gemini/gemini-cli, anomalyco/opencode, plus GitHub-wide searches), GitHub repo search, npm registry, Stack Exchange API, web search (CSDN / blogs). Reddit and LINUX DO (403) not reachable. No usernames recorded; independence of people was checked by comparing author hashes (raw data in `lab/s024/g1/`).

`[W]` = the row describes a workaround the person uses or built. Quotes are verbatim, ≤ 20 words; `[translated]` marks a translation from Chinese. Dates are issue/comment creation dates (UTC).

Important context found while researching: the agent CLIs are fixing Windows bugs fast, so every need below was checked against the current changelog / open PRs:
- Claude Code now ships a native **PowerShell tool** on Windows and fixed Write/Edit CRLF handling in 2.1.77 / 2.1.89 (`CHANGELOG.md`, saved as `g1/cc_changelog.md`). It has **not** fixed non-UTF-8 encodings or the `nul` file.
- Gemini CLI closed "Preserve EOLs" as completed (google-gemini/gemini-cli#16148). Requests to run pwsh instead of PowerShell 5.1 were closed as duplicates (#18374); current default not verified.
- Codex: two maintainer PRs to make `apply_patch` CRLF-aware were **closed unmerged** (openai/codex#11416, #15035); no CRLF fix merged since (searched merged PRs to 2026-10-02). Codex has PreToolUse/PostToolUse hooks that fire for `apply_patch` and load on native Windows.
- OpenCode: PR "preserve CRLF line endings and BOM on Windows file writes" (anomalyco/opencode#20217) is still **open**.

---

## N1. "Keep my CRLF line endings": agent edits turn CRLF files into LF or mixed line endings

- **Who and situation**: Windows developers (Visual Studio / .NET / C++ / batch files, `core.autocrlf=true` repos) letting Codex, OpenCode (and earlier Gemini CLI / Claude Code) edit files. Result: VS "inconsistent line endings" warnings, whole-file diffs, failed patch matching, broken undo, token-wasting retries.
- **Evidence** (16 independent people):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "it does not adhere to the line endings in the file but appears to alway use Unix-style LF" | https://github.com/openai/codex/issues/4003 | 2025-09-21 |
| 2 | "This bug makes the codex diff completely useless" | https://github.com/openai/codex/issues/4003#issuecomment-4095237119 | 2026-03-20 |
| 3 | "I tried using `.editorconfig` and `.gitattributes` with the expectation that codex would honor it. It did not." | https://github.com/openai/codex/issues/4003#issuecomment-4570074985 | 2026-05-29 |
| 4 [W] | "have Codex write a hook that checks for all modified (git) files and normalizes them" | https://github.com/openai/codex/issues/4003#issuecomment-5015593256 | 2026-07-19 |
| 5 [W] | "detects the mixed line-endings and fixes the file before VS notices. Zero tokens and zero hooking." (own FileWatcher app) | https://github.com/openai/codex/issues/4003#issuecomment-5058133540 | 2026-07-23 |
| 6 [W] | "apply_patch appears to insert or replace lines using LF-only line endings. This creates mixed line endings" … later: "use a system prompt that tells Codex to convert my files to LF before editing them" | https://github.com/openai/codex/issues/25048 , https://github.com/openai/codex/issues/25048#issuecomment-5311933704 | 2026-05-29 / 2026-08-17 |
| 7 | "Does anyone at OpenAI actually use Windows without WSL2 for their day-to-day work?" | https://github.com/openai/codex/issues/25048#issuecomment-5311817927 | 2026-08-17 |
| 8 | "EOL and BOM get broken. Undo does not work. Unchanged lines presented as changed." | https://github.com/openai/codex/issues/25048#issuecomment-5476811147 | 2026-08-31 |
| 9 [W] | "When they don't forget, they run an explicit conversion step which takes additional time." | https://github.com/openai/codex/issues/25048#issuecomment-5620047029 | 2026-09-10 |
| 10 | "apply_patch fails to handle newlines and it falls back to writing edits with python but it's extremely token-intensive and slow" | https://github.com/openai/codex/issues/9914 | 2026-01-26 |
| 11 | "Gave it specific instructions NEVER to change EOL. Huge amount of flailing about with Powershell scripts" | https://github.com/openai/codex/issues/13148 | 2026-02-28 |
| 12 | "Editing files with Opencode always messes with whitespace and line endings in files in Windows." | https://github.com/anomalyco/opencode/issues/6348 | 2025-12-29 |
| 13 | "opencode introduces LF line endings when using the builtin tool apply_patch" | https://github.com/anomalyco/opencode/issues/37090 | 2026-07-15 |
| 14 | "Agents always tend to output LF line breaks" … "Visual Studio and Git have detected conflicts." | https://github.com/anomalyco/opencode/issues/16770 | 2026-03-09 |
| 15 | "it continually has to try 4-5 times per edit resulting in a large waste of processing power and tokens" | https://github.com/google-gemini/gemini-cli/issues/4056 | 2025-07-13 |
| 16 | "I can argue, plead, pester, and remind all I want, and claude won't remember" | https://github.com/anthropics/claude-code/issues/38887 | 2026-03-25 |
| 17 [W] | Built an OpenCode plugin: "Preserve original file BOM and line endings when OpenCode modifies files." | https://github.com/timxx/opencode-preserve-format | 2026-05-10 |

- **Frequency signals**: codex#4003 74 👍 / 38 comments, "fixed in 0.66.0" (2025-12) then reported broken again Jan → Jul 2026; codex#25048 open, 23 👍, comments to 2026-09-20. ~10 separate EOL issues in Codex (#4003, #4395, #6026, #7926, #9455, #9914, #13148, #21164, #25048, #35789), ~10 in OpenCode (#6348, #16770, #18616, #23084, #31224, #37090, #45880, #45926, #45927, #50740; newest 2026-09-22), 6 in Gemini CLI, 7 in Claude Code. Underlying platform topic is old and big: SO "How line ending conversions work with git core.autocrlf" 163k views.
- **What people do today**: prompt rules (ignored), `.gitattributes`/`.editorconfig` (agents ignore them; only affect checkout), ask the agent to convert files (slow, wastes tokens, breaks undo), self-written PostToolUse hooks, a self-written file watcher run from Task Scheduler, the OpenCode plugin above.
- **Existing solutions checked**:

| Solution | Adoption | Verdict |
|---|---|---|
| Claude Code native (Write keeps CRLF since 2.1.77; CRLF doubling fixed 2.1.89) | built-in | **Meets** for Claude Code EOL (but not encodings, see N2) |
| Gemini CLI native (#16148 closed completed) | built-in | **Mostly meets** (a CRLF diff-snippet bug #29130 still open 2026-08-30) |
| Codex native | — | **Fails**: fix PRs #11416/#15035 closed unmerged; #25048 open |
| OpenCode native | — | **Fails**: PR #20217 open since spring 2026 |
| timxx/opencode-preserve-format (OpenCode plugin) | 1★, 28 npm downloads/month | Partly (OpenCode only, EOL+BOM only, no encodings) |
| ymonster/claude_encoding_guard | 16★ | Claude Code only (see N2) |
| amrali-eg/LineEndingNormalizer (Windows CLI) | 1★ | Manual normalizer, not agent-aware |
| `.gitattributes` / `git add --renormalize`, `unix2dos`, VS "NoMixedLineEndings" ext | standard | Fail for this case: act at checkout/commit or manually, not right after the agent's edit; Codex undo still breaks |

- **Search words**: "codex crlf windows", "codex apply_patch line endings", "codex mixed line endings visual studio", "opencode crlf", "AI agent changes line endings", "preserve line endings hook", "codex hook normalize line endings".
- **Verdict**: **strong** (but only for Codex / OpenCode users now; Claude Code and Gemini largely fixed natively). Many independent people, long duplicate trail, people writing hooks and watchers, no adopted tool. Risk: a Codex fix could land any time.

## N2. "Don't destroy my file's encoding": agent edits rewrite GBK / Shift_JIS / Windows-125x / Latin-1 / BOM files as UTF-8

- **Who and situation**: Windows developers on legacy or locale-bound code: Delphi/C++ Builder, VB6/VBA, ERP languages (ADVPL), PL/I, Java with CP1250, Chinese .NET projects in GBK, Japanese Shift_JIS sources. One edit (even ASCII-only) corrupts every non-ASCII character in the whole file; build tools that require the legacy encoding then break.
- **Evidence** (19 independent people):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "it replaces the accented characters with special characters" (ADVPL, Windows-1252) | https://github.com/anthropics/claude-code/issues/3416 | 2025-07-12 |
| 2 | "It assumes UTF-8 encoding for all operations, which causes character corruption" | https://github.com/anthropics/claude-code/issues/7134 | 2025-09-04 |
| 3 | "fixing the errors generated by this issue consumes a lot of tokens" | https://github.com/anthropics/claude-code/issues/7134#issuecomment-3376508934 | 2025-10-07 |
| 4 | "Still an issue. Same with Win-1251 encoding" | https://github.com/anthropics/claude-code/issues/7134#issuecomment-3656418670 | 2025-12-15 |
| 5 [W] | "I wrote an MCP server that handles encoding-aware file reads and writes CP1251, CP1252, ISO-8859, KOI8" | https://github.com/anthropics/claude-code/issues/7134#issuecomment-3876684525 | 2026-02-10 |
| 6 | "Every time it touches my code, the whole file comes back garbled." (VBA, Spanish) | https://github.com/anthropics/claude-code/issues/7134#issuecomment-4137860556 | 2026-03-26 |
| 7 | "raise the issue with developers supporting legacy code in C++ Builder 6." | https://github.com/anthropics/claude-code/issues/7134#issuecomment-4175280551 | 2026-04-02 |
| 8 [W] | "both the encoding and the line endings should just be preserved as-is." (built a hook) | https://github.com/anthropics/claude-code/issues/7134#issuecomment-4265042549 | 2026-04-17 |
| 9 | "The encoding is mandated by the toolchain and can't be changed." (PL/I, Latin-1) | https://github.com/anthropics/claude-code/issues/7134#issuecomment-4922011057 | 2026-07-09 |
| 10 | "an ASCII-only edit — a change that touches no non-ASCII characters — still corrupts every non-ASCII byte" | https://github.com/anthropics/claude-code/issues/7134#issuecomment-4923969362 | 2026-07-09 |
| 11 | "same root cause with a different legacy codepage: Windows-1250 (CP1250), Polish Java source files." | https://github.com/anthropics/claude-code/issues/7134#issuecomment-5177345977 | 2026-08-04 |
| 12 | "as soon as it touches one file it corrupts all the international characters immediately" | https://github.com/anthropics/claude-code/issues/7134#issuecomment-5373263530 | 2026-08-21 |
| 13 | "Edit on a Shift_JIS file replaces every Japanese character in the file with U+FFFD and saves it as UTF-8" | https://github.com/anthropics/claude-code/issues/96263 | 2026-09-23 |
| 14 | "apply_patch fails on non UTF-8 encoded files, making codex revert to other commands/tools for patching code" | https://github.com/openai/codex/issues/21164 | 2026-05-05 |
| 15 | "it converts it to UTF-8-WITCH BOM, and this always breaks my code" | https://github.com/openai/codex/issues/8340 | 2025-12-19 |
| 16 [W] | "We have been forced to add explicit rules in our workspace instructions" (Chinese content) | https://github.com/openai/codex/issues/16542 | 2026-04-02 |
| 17 | "The Read tool cannot correctly display files encoded in GBK (codepage 936)." | https://github.com/anomalyco/opencode/issues/31604 | 2026-06-10 |
| 18 | "I have to remind it every time, quite troublesome" [translated] (PowerShell edits add GBK mojibake) | https://github.com/anomalyco/opencode/issues/30205 | 2026-06-01 |
| 19 [W] | Blog: GBK Chinese comments garbled after Claude edits; author wrote `gbk_hook.js` (iconv-lite, Pre/PostToolUse) [translated summary] | https://devpress.csdn.net/awstech/6a73037110ee7a33f2969df4.html | 2026-06-27 |

- **Frequency signals**: claude-code#7134 open since 2025-09, 30 👍, 31 comments, "me too" every month to 2026-08; ~10 duplicates in Claude Code (#3416, #5518, #6485, #7134, #12203 closed not planned, #13939, #28523, #64601, #96263 …); same pattern in Codex (#8340, #16542, #21164) and OpenCode (#30205, #31604). Chinese community posts (CSDN, bilibili, LINUX DO) found by web search. SO "Using PowerShell to write a file in UTF-8 without the BOM" 492k views shows the broader Windows encoding pain.
- **What people do today**: convert the repo to UTF-8 (often not allowed by the toolchain), prompt rules, "add a first-line comment" trick (https://www.80aj.com/2026/05/10/claude-code-fix-encoding/), self-written hooks (iconv/chardet), an MCP server the model must remember to use, post-hoc mojibake repair.
- **Existing solutions checked**:

| Solution | Adoption | Verdict |
|---|---|---|
| Claude Code / Codex / OpenCode native | — | **Fail**: still reproduces in Claude Code 2.1.x (#96263, 2026-09-23); no encoding support in Codex `apply_patch`; OpenCode PR #20217 open (BOM only) |
| ymonster/claude_encoding_guard (Claude Code plugin: Pre-Read converts to UTF-8, Post-Edit converts back, keeps EOL) | 16★, pushed 2026-08 | **Meets for Claude Code** per a user (#7134 comment 4308202185); requires `uv`; Claude Code only; misses writes done via Bash/PowerShell |
| dimitar-grigorov/mcp-file-tools (Go MCP server, 45 encodings, keeps BOM/EOL) | 24★, pushed 2026-09 | Partly: works for any MCP client but the model must choose its tools instead of the built-in Edit; not transparent |
| haodehaode378/text-encoding-guard (detect/repair Chinese mojibake; CC hook + GitHub Action) | 45★ | Partly: repairs UTF-8-as-GBK mojibake after the fact; does not preserve GBK files |
| devslimbr/cc-tools | 9★, last push 2025-10 | Partly, stale |
| Codex / OpenCode / Gemini equivalents | none found (GitHub, npm) | **Unmet** |

- **Search words**: "claude code windows-1252", "claude code GBK [zh]", "codex encoding GBK", "AI agent corrupts encoding", "preserve file encoding claude code", "Shift_JIS claude code", "codex apply_patch non utf-8", "[zh] [zh] hook".
- **Verdict**: **strong**, partly met for Claude Code users only (small, Python/uv-based plugin), unmet elsewhere. Same mechanism as N1 and N6, so one tool could cover all three.

## N3. "I can't delete this `nul` file": agents leave undeletable reserved-name files in projects

- **Who and situation**: Windows users of Claude Code (and OpenCode in early 2026). A 0-byte `nul` (sometimes `NUL`) appears in the repo root or subfolders; Explorer, `del`, `Remove-Item` fail; folder can't be deleted; git, Unity, IDEs choke.
- **Evidence** (15 independent people):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "Claude CLI is creating an unwanted file named "nul" in the current directory during execution." | https://github.com/anthropics/claude-code/issues/4928 | 2025-08-01 |
| 2 [W] | "None of the workarounds to delete the 'nul' files would work for me" (renames it in 7-Zip) | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3753372067 | 2026-01-15 |
| 3 [W] | "All my .gitignores have 'nul' at the bottom..." | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3757025607 | 2026-01-15 |
| 4 [W] | "I was able to prevent `nul` files from being generated by adding the following to my `.bashrc`" (DEBUG trap) | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3769878067 | 2026-01-19 |
| 5 | "not being able to even open the directory with my IDE because of its existence." | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3825635330 | 2026-01-30 |
| 6 | "This file corrupted my whole project and i couldn't find out why" (Unity) | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3837195074 | 2026-02-02 |
| 7 | "This cannot be deleted via Explorer, CMD, PowerShell, \\?\ paths, robocopy, git clean" | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3859982500 | 2026-02-06 |
| 8 [W] | "Found 4 nul files scattered across subdirectories after a session." (deletes with Python `\\?\`) | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3876650442 | 2026-02-10 |
| 9 [W] | "I wrote a PreToolUse hook to prevent nul, and other reserverd file names creation." | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3921615797 | 2026-02-18 |
| 10 [W] | "I made a small tool called nonul that might help." (Explorer context-menu delete) | https://github.com/anthropics/claude-code/issues/4928#issuecomment-4059576814 | 2026-03-14 |
| 11 | "A stray 0-byte file named `NUL` is created in the working directory every time a Claude Code session starts" | https://github.com/anthropics/claude-code/issues/86224 | 2026-08-12 |
| 12 | "This issue is still occurring as of CC version 2.1.280" | https://github.com/anthropics/claude-code/issues/86224#issuecomment-5798281642 | 2026-09-23 |
| 13 | "This file keeps appearing even though I did not create it manually." | https://github.com/anomalyco/opencode/issues/11403 | 2026-01-31 |
| 14 | "That file can't be deleted on Windows." | https://github.com/anomalyco/opencode/issues/13369 | 2026-02-12 |
| 15 | "Now I'm stuck with this "NUL" file" (pre-AI, Cygwin program; 56,551 views) | https://stackoverflow.com/questions/17883481/delete-a-file-named-nul-on-windows | 2013-07-26 |

- **Frequency signals**: claude-code#4928 235 👍 / 184 comments, closed "completed" 2026-02-27, reopened in spirit by #86224 which lists 11 closed duplicates (#30247, #23942, #17886, #20568, #23343, #17005, #15398, #25968, #16642, #31240 …) and reproduces on 2.1.229 and 2.1.280 (Sept 2026). OpenCode had at least 6 nul issues Jan–Mar 2026 (all closed; #13369 as completed). SO question 56k views, activity renewed 2026-02.
- **What people do today**: `del "\\?\C:\path\nul"`, `rename \\.\C:\..\NUL. x`, `rm nul` from Git Bash/WSL, 7-Zip/WinRAR "delete after archiving", VS Code delete, `.gitignore` entries, `.bashrc` DEBUG traps, PreToolUse hooks.
- **Existing solutions checked**:

| Solution | Adoption | Verdict |
|---|---|---|
| Claude Code native ("adjustments in 2.1.42") | — | **Fails**: still created per session in 2.1.280 (#86224) |
| 4laoshiren/nonul (Explorer "Delete" replacement) | 15★, last push 2026-04 | Partly: deletion only |
| ontisme/NulRemover, EchoJohn/NulKiller, yancongya/delete-nul, aramiscd/delete-nul-files | 0–2★ each | Partly: deletion one-liners; nobody adopts them |
| rweijnen/claude-hooks, kmgallahan gist (PreToolUse rewriters) | 5★ / gist | Partly: prevent model-written `> nul`, but not the session-start file |
| SO answer (`\\?\` prefix) | 56k views | **Meets** the deletion part for anyone who searches |

- **Search words**: "delete nul file windows", "claude code nul file", "cannot delete folder nul", "remove reserved name file windows".
- **Verdict**: **medium**. Very visible and recurring, but the deletion fix is a known one-liner and five tiny tools got almost no adoption; prevention depends on the vendor's own bug.

## N4. "The agent keeps running bash syntax in PowerShell (and vice versa)": `&&`, `$VAR`, `/dev/null`, `move`, `find`, backslash paths

- **Who and situation**: native-Windows users of agent CLIs; the model mixes cmd / PowerShell 5.1 / Git Bash syntax, fails, retries, wastes tokens; instructions in CLAUDE.md / GEMINI.md are ignored.
- **Evidence** (12 independent people):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "On Windows native (no WSL), CC still makes a lot of errors trying to run essential commands" | https://github.com/anthropics/claude-code/issues/5049 | 2025-08-03 |
| 2 [W] | "I've had some luck adding this to `C:\Users\[user]\.claude\CLAUDE.md`" | https://github.com/anthropics/claude-code/issues/5049#issuecomment-3148716216 | 2025-08-03 |
| 3 [W] | "it attempts to run `find` and expects a gnu compatable tool not the windows `find.exe`" | https://github.com/anthropics/claude-code/issues/5049#issuecomment-3175993897 | 2025-08-11 |
| 4 | "Claude still breaks often when combining Unix-style commands and Windows path separators" | https://github.com/anthropics/claude-code/issues/5049#issuecomment-3765853609 | 2026-01-18 |
| 5 | "it tries layering cmd + PowerShell + bash, and always messes up quotes, command separators, etc." | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3837282847 | 2026-02-02 |
| 6 [W] | "Instead I just fix a variety of Windows issues by modifying the tool calls directly" (Python PreToolUse hook, later a gist) | https://github.com/anthropics/claude-code/issues/4928#issuecomment-3848600448 | 2026-02-04 |
| 7 [W] | "A fix is available as a Claude Code plugin: powershell-default" | https://github.com/anthropics/claude-code/issues/5049#issuecomment-4082921238 | 2026-03-18 |
| 8 | "Agent intermittently emits PowerShell-only syntax and fragile quoting" (title) | https://github.com/openai/codex/issues/9581 | 2026-01-21 |
| 9 | "it attempts to execute `git status && git branch` in the shell. This causes a `ParserError`" | https://github.com/google-gemini/gemini-cli/issues/20773 | 2026-03-01 |
| 10 [W] | "I've even added instructions to my global GEMINI.md, but the agent consistently ignores and uses `run_shell_command` with `&&`" | https://github.com/google-gemini/gemini-cli/issues/27097 | 2026-05-15 |
| 11 | "Bash syntax (`=`) leaking into PowerShell execution causes CommandNotFoundException" | https://github.com/anomalyco/opencode/issues/11330 | 2026-01-30 |
| 12 | "Windows bash tool fails with "export is not recognized"" | https://github.com/anomalyco/opencode/issues/11927 | 2026-02-03 |

- **Frequency signals**: claude-code#5049 open, 26 👍; #7490 (configurable shell) 144 👍; codex#16579/#16717 (choose shell) 50/41 👍; gemini#18374, #15493, #2353, #3126 (choose shell). Mostly late 2025 – May 2026.
- **What people do today**: CLAUDE.md/AGENTS.md rules, PreToolUse rewriting hooks, plugins replacing the Bash tool, installing pwsh 7, WSL.
- **Existing solutions checked**:

| Solution | Adoption | Verdict |
|---|---|---|
| Claude Code native PowerShell tool (2026; model is told "Shell: PowerShell") | built-in | **Largely meets** for Claude Code |
| Gemini CLI shell choice (#18374 closed as duplicate; #27097 shows PS 5.1 still used in 2026-05) | built-in | Partly / unclear |
| 20000419/fauxnix (deterministic bash→PowerShell translation, MCP + CLI, installers for CC/Codex/OpenCode/Kimi/Qwen) | 666★, 870 npm downloads/month, created 2026-08 | **Meets** for agents willing to call it (MCP, not transparent) |
| microsoft/coreutils (uutils coreutils/findutils/grep for Windows, winget) | 5.2k★, preview | Partly: makes GNU commands exist natively |
| rweijnen/claude-hooks, kmgallahan gist, cruzlauroiii powershell-default | 0–5★ | Partly, Claude Code only |

- **Search words**: "claude code windows bash commands fail", "codex powershell && windows", "agent uses && powershell 5.1", "bash to powershell agent".
- **Verdict**: **already met / partly met**. Strong historical evidence, but natively addressed in Claude Code (PowerShell tool), and fauxnix + Microsoft coreutils occupy the space.

## N5. "Chinese/Japanese/Korean output is garbled in the agent's shell tool" (code pages 936/932/949 vs UTF-8)

- **Who and situation**: developers on non-English Windows (GBK/CP936, CP932, CP949; also CP437/850) running agent CLIs; command output, git commit messages and file reads come back as mojibake, or the CLI crashes.
- **Evidence** (9 independent people):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "crashes on Windows when executing shell commands that produce output using standard, non-UTF-8 Windows console codepages" | https://github.com/google-gemini/gemini-cli/issues/4945 | 2025-07-26 |
| 2 | "any Japanese characters present in the standard output (stdout) of the executed command are displayed as garbled text" | https://github.com/google-gemini/gemini-cli/issues/12468 | 2025-11-03 |
| 3 | "Korean characters (UTF-8) passed as string arguments are corrupted or garbled" | https://github.com/google-gemini/gemini-cli/issues/20186 | 2026-02-24 |
| 4 | "non-ASCII characters (e.g., Chinese filenames) appear garbled in the output of PowerShell commands" | https://github.com/anomalyco/opencode/issues/23636 | 2026-04-21 |
| 5 | "On Simplified Chinese versions of Windows, the default system ACP is **936 (GBK)**." | https://github.com/anomalyco/opencode/issues/31187 | 2026-06-07 |
| 6 | "Chinese output of the bash tool on Windows is garbled" [translated] | https://github.com/anomalyco/opencode/issues/31830 | 2026-06-11 |
| 7 | "shell wrapper via `powershell.exe -Command` mojibakes UTF-8 files on non-English locales" | https://github.com/openai/codex/issues/23044 | 2026-05-16 |
| 8 | "UTF-8 Markdown files sometimes showed up as mojibake in the agent/tool context" | https://github.com/openai/codex/issues/15422 | 2026-03-21 |
| 9 [W] | Blog fixing Codex/Claude/OpenCode mojibake with a `setup-ai-cli-utf8.ps1` script, UTF-8 wrapper commands, profile and `chcp 65001` [translated summary] | https://deepseek.csdn.net/6a31f80f10ee7a33f27e33aa.html | 2026-05-11 |

(Also claude-code#96271, 2026-09-23: Bash tool decodes CP932 output as UTF-8; same reporter as N2 row 13.)
- **Frequency signals**: individual issues get 0–7 👍, but they recur in every agent and are handled one by one (Claude Code changelog lists several UTF-8 fixes; OpenCode closed #31187/#31830 as not planned). Many Chinese how-to posts.
- **What people do today**: Windows "Beta: Use Unicode UTF-8 for worldwide language support" (system-wide, breaks some legacy apps), PowerShell profile `[Console]::OutputEncoding`, `chcp 65001`, `PYTHONUTF8=1`, wrapper scripts.
- **Existing solutions checked**: vendor fixes (ongoing, partial); Guz007/claude-win-doctor (0★, diagnostics); no adopted cross-agent tool. A user-side tool can only set environment/profile, which the blog scripts already do.
- **Search words**: "codex [zh] windows", "claude code [zh] powershell", "opencode garbled chinese windows", "gemini cli japanese garbled".
- **Verdict**: **medium**. Real and recurring, but the root fix lives inside each agent; the user-side fix is a known set of settings.

## N6. "Scripts the agent writes for Windows don't run": `.ps1` without BOM, `.bat`/`.cmd` with LF

- **Who and situation**: agents create PowerShell 5.1 scripts and batch files as UTF-8-without-BOM and LF; PS 5.1 reads ANSI and fails, cmd.exe misparses LF + multibyte text. One case deleted 1,068 files.
- **Evidence** (4 independent people + SO):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "Write tool on Windows produces UTF-8 without BOM for .ps1 files, causing PowerShell 5.1 UnexpectedToken errors" | https://github.com/anthropics/claude-code/issues/58545 | 2026-05-13 |
| 2 [W] | "AI ignores AGENTS.md bat-file rules on Windows (CRLF + encoding) despite existing guardrails" (also #31224, #31276, same reporter) | https://github.com/anomalyco/opencode/issues/31275 | 2026-06-07 |
| 3 | "PowerShell 5.1 parses it as ANSI and a mojibake quote kills the script - silently when scheduled" | https://github.com/anthropics/claude-code/issues/90962 | 2026-08-31 |
| 4 | "1,068 files were permanently deleted in one second" … "Changing only the line endings to CRLF makes the bug disappear." | https://github.com/anthropics/claude-code/issues/92328 | 2026-09-05 |
| 5 | SO "LF Versus CRLF Line Endings in Windows Batch Files" (6,248 views); SO "Using PowerShell to write a file in UTF-8 without the BOM" (492,524 views) | https://stackoverflow.com/questions/38836068 , https://stackoverflow.com/questions/5596982 | 2016 / 2011 |

- **Frequency signals**: low 👍 (0–1), but all from 2026-05 → 2026-09, unresolved in Claude Code (#90962, #92328 open), severe consequences.
- **What people do today**: AGENTS.md rules (ignored), manual re-save in an editor, `.gitattributes *.bat eol=crlf` (only at checkout).
- **Existing solutions checked**: none specific. `.editorconfig` (`charset = utf-8-bom`, `end_of_line = crlf`) states the rule but agents don't apply it; claude_encoding_guard only restores an *existing* file's format, not new files.
- **Search words**: "claude code ps1 BOM", "AI generated bat file LF", "powershell 5.1 utf8 bom script error", "agent writes batch file wrong line endings".
- **Verdict**: **medium** on its own; strong as a feature of the N1/N2 tool (apply `.editorconfig` / Windows conventions to *new* files).

## N7. "tmux-based agent tools don't run on native Windows" (agent teams, orchestrators)

- **Evidence** (6 independent people): "Windows Terminal users cannot use split-pane mode for agent teams." https://github.com/anthropics/claude-code/issues/24384 (2026-02-09, 50 👍); "Windows users are completely locked out of Claude Code's agent teams" https://github.com/anthropics/claude-code/issues/34150 (2026-03-13); "tmux-first, which makes native Windows usage difficult or impossible" https://github.com/Yeachan-Heo/oh-my-codex/issues/36 (2026-02-15, 29 comments); "C# desktop development deeply relies on native Windows APIs" (can't use WSL) https://github.com/bmad-code-org/bmad-loop/issues/92 (2026-07-08); "Windows users … cannot use Claudio without WSL." https://github.com/Iron-Ham/claudio/issues/33 (2026-01-08); "Please bring a windows version" https://github.com/manaflow-ai/cmux/issues/1012 (2026-03-06, 51 👍).
- **Workarounds**: WSL; psmux.
- **Existing solutions**: **psmux/psmux** (native tmux-compatible multiplexer for Windows, Rust) 3,597★, pushed 2026-10-02; a comment (apparently from the psmux side) reports "`--teammate-mode tmux` works on Windows via Psmux" (https://github.com/anthropics/claude-code/issues/24384#issuecomment-4204276338, 2026-04-08), and a 2026-03-08 tester confirmed tmux commands work through it but split panes did not appear then (#24384 comment 4018941949). oh-my-codex closed native-Windows team support as completed (#36) but declined full psmux pane support (#1996, not planned).
- **Search words**: "tmux windows native", "claude code agent teams windows", "tmux for powershell".
- **Verdict**: **already met** (psmux).

## N8. "Tell me when the agent finishes or needs input" on Windows

- **Evidence** (3+ people): claude-code#13024 (81 👍, 2025-12-04) hook for waiting-for-input; #26581 (34 👍, 2026-02-18) system notifications; #57230 (49 👍, open, 2026-05-08) toast notifications in the VS Code extension.
- **Existing solutions**: **777genius/agent-notifications** 813★ (Windows CI; Claude Code, Codex, OpenCode; sounds, click-to-focus); many smaller ones; Claude Code hooks (`Notification`, `Stop`).
- **Verdict**: **already met** for CLIs (the VS Code extension UI gap is the vendor's).

## N9. "direnv doesn't work in PowerShell / Git Bash on Windows"

- **Evidence** (3+ people): "enable (`Invoke-Expression "$(direnv hook pwsh)"`) the app on Windows with Powershell, but it's not working!" https://github.com/direnv/direnv/issues/1214 (2023-12-13, 23 👍, 27 comments); "PATH gets mangled when using direnv from git-bash on Windows" https://github.com/direnv/direnv/issues/253 (2017, 30 comments); "direnv mangles environment variables on windows" https://github.com/direnv/direnv/issues/1274 (2024-04-23, 11 👍).
- **Existing solutions**: **jdx/mise** (34.5k★) documents `mise activate pwsh` and `[env]` / `.env` loading; works natively.
- **Verdict**: **weak / already met** (low recency, strong alternative).

## N10. "ssh-copy-id is not recognized" in PowerShell

- **Evidence**: superuser "Alternative to ssh-copy-id on windows", 151,412 views, last activity 2026-09-03: "ssh-copy-id : The term 'ssh-copy-id' is not recognized as the name of a cmdlet" https://superuser.com/questions/1747549 . 34 GitHub repos of personal ports (all ≤ 9★, e.g. https://github.com/axeprpr/ssh-copy-id-windows, https://github.com/joshkerr/ssh-copy-id) show people writing their own scripts.
- **Existing solutions**: Git for Windows ships `/usr/bin/ssh-copy-id` (verified on this PC); one-line PowerShell answers on the question.
- **Filter problem**: realistic testing needs an SSH server (enabling Windows OpenSSH Server is a system change).
- **Verdict**: **weak / already met**.

## N11. "Agent skill/plugin scripts break on native Windows" (author side)

- **Evidence** (5 people): "all rooted in Unix-first assumptions" (PATHEXT, cp1252, `select` on pipes) https://github.com/anthropics/skills/issues/1061 (2026-04-28); "validate.py crashes/fails on Windows due to cp1252 encoding" https://github.com/anthropics/skills/issues/1938 (2026-09-29); "three bundled plugins' hooks never run … hooks.json invokes .sh by bare path" https://github.com/anthropics/claude-code/issues/95673 (2026-09-20); "Native Windows is untested and most likely does not work end-to-end today." https://github.com/tatsuya6502/cc-skills/issues/6 (2026-08-23); xlsx `recalc.py` "unguarded socket.AF_UNIX access" https://github.com/anthropics/skills/issues/1120 (2026-05-10).
- **Existing solutions**: ruff `PLW1514` / pylint `unspecified-encoding` catch the encoding part; nothing checks hook commands or POSIX-only APIs for Windows.
- **Verdict**: **weak–medium** (real, but each report is fixed in its own repo; audience is skill authors, low search volume).

## N12. "Symlinks need admin / Developer Mode": tools fail with `EPERM ... symlink`

- **Evidence** (4+ people): "Windows requires elevated (admin) privileges for symlinks by default" https://github.com/paperclipai/paperclip/issues/63 (2026-03-05, 11 👍); "junction would work without elevation" https://github.com/openclaw/openclaw/issues/77958 (2026-05-05); "profile startup fails with `EPERM`" https://github.com/VincentFF/pi-profile-switch/issues/67 (2026-09-29); vltpkg#1498, cherry-studio#14360.
- **Existing solutions**: fix belongs inside each tool (junction fallback); npm `symlink-dir` ("Cross-platform directory symlinking", 315k downloads/week).
- **Verdict**: **weak** for a standalone tool.

Also looked at and dropped: EBUSY / locked files (vendor-internal bugs; PowerToys File Locksmith exists), Git Bash MSYS path conversion (`MSYS_NO_PATHCONV=1` is the known, documented fix; little new demand found), console windows flashing, clipboard image paste (vendor bugs, mostly fixed).

---

## Ranking

| Rank | Need | Independent people | Recency | Existing solutions | Verdict |
|---|---|---|---|---|---|
| 1 | N2 Keep non-UTF-8 encodings / BOM when agents edit | 19 | to 2026-09-23 | claude_encoding_guard 16★ (CC only, uv), mcp-file-tools 24★ (opt-in MCP); nothing for Codex/OpenCode | **Strong**, partly met (CC only) |
| 2 | N1 Keep CRLF line endings when agents edit | 16 (+1 plugin author) | to 2026-09-22 | Fixed natively in Claude Code and Gemini; Codex fix PRs closed unmerged; OpenCode PR open; opencode-preserve-format 1★ | **Strong** for Codex/OpenCode users |
| 3 | N6 Agent-written `.ps1` / `.bat` follow Windows conventions | 4 (+SO 492k views) | to 2026-09-05 | none specific | Medium alone; strong as part of N1/N2 |
| 4 | N3 Undeletable `nul` files | 15 | to 2026-09-23 | SO one-liner; 5 tiny tools ≤ 15★; vendor bug unfixed | Medium |
| 5 | N5 CJK mojibake in agent shell output | 9 | to 2026-09-23 | vendor fixes, settings, blog scripts | Medium |
| 6 | N4 Bash vs PowerShell syntax mixing | 12 | to 2026-05 | CC PowerShell tool, fauxnix 666★, MS coreutils 5.2k★ | Partly / already met |
| 7 | N11 Skill/plugin scripts break on Windows | 5 | to 2026-09-29 | ruff/pylint partial | Weak–medium |
| 8 | N7 tmux-based agent tools on Windows | 6 | to 2026-07 | psmux 3.6k★ | Already met |
| 9 | N8 Agent notifications on Windows | 3+ (81/49/34 👍) | to 2026-05 | agent-notifications 813★ | Already met |
| 10 | N12 Symlink EPERM | 4+ | to 2026-09-29 | in-tool fixes, symlink-dir | Weak |
| 11 | N9 direnv on PowerShell | 3+ | to 2025-04 | mise 34.5k★ | Weak / met |
| 12 | N10 ssh-copy-id on Windows | 1 SO question (151k views) + 34 DIY repos | to 2026-09 | Git Bash ships it, one-liners | Weak / met |

**Honest read**: most G1 needs are either already met (tmux, notifications, direnv, ssh-copy-id, shell-syntax translation) or live inside the agent vendors' code (mojibake, `nul`, symlinks). The one cluster that is strong, recent, cross-agent and still unmet outside Claude Code is **N1 + N2 + N6: "the agent should leave my file's encoding, BOM and line endings exactly as they were, and write new Windows scripts the way Windows expects."** People are already writing their own hooks, watchers, plugins and MCP servers for it, and none of those has real adoption (max 45★). A single small tool could serve it through each agent's hook/plugin API (Claude Code and Codex PostToolUse hooks both cover file edits on native Windows; OpenCode plugins can post-process tool writes (as opencode-preserve-format shows); Gemini CLI documents hooks (docs/hooks)), plus an agent-agnostic `git`-diff based "restore format of changed files" command for anything the hooks miss (e.g., writes done through the shell, which hooks can't see: claude-code#87356).

Caveats for the critique step: (a) Codex or OpenCode may merge an EOL fix at any time, shrinking N1 to the encoding half; (b) testing on real Codex sessions needs an OpenAI account (Claude Code is available here; the hook logic itself can be tested with fixtures and git); (c) low adoption of the existing small tools may also mean people rarely search for a tool and instead wait for the vendor.
