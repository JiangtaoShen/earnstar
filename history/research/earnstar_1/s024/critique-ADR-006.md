<!-- Copied from the private working file lab/s024/critique/critique-ADR-006.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Independent critique of ADR-006 (candidate A: keep and repair encodings and line endings broken by AI agents)

- **Date**: 2026-10-03 (S024). Critic: an independent subagent with no stake in the decision. Everything outside `lab/s024/critique/` was read-only. Nothing was posted, starred, or installed.
- **Read**: ADR-006, `candidate-A-encoding.md`, `needs.md`, `s024/needs-G1-windows.md` (N1, N2, N6), `playbook/research.md`, `playbook/lessons.md`, `lab/s024/proto-a/keepenc.mjs`, `lab/s024/fx/make.py`.
- **Fresh research**: `gh api` (issues, PRs, releases, repo and code search, star history, READMEs), the npm registry and download API, the VS Code Marketplace API, the official Claude plugin marketplace, web search (Cursor forum, Kilo docs, Codex and Claude Code hook docs, CSDN, Zenn, Qiita). Search terms were in English, Chinese, and Japanese and described outcomes ("[zh]", "[zh]", "mojibake", "preserve encoding", "restore encoding git", "encoding guard", "crlf codex", "sjis claude code").
- **Tests I ran** on the prototype: `lab/s024/critique/autocrlf_test.py` and `damage_modes_test.py`. Their fixture repos `fx_*` are in the same folder.

## Verdict (short)
**Reject ADR-006 as drafted, and do not confirm it in S025.** The need is real and current. But the draft fails Gate item 2: about 25 existing tools and three native vendor fixes were missed. Its three novelty claims are false: "nothing for Codex", "Codex CRLF fixes closed unmerged", and "nobody repairs U+FFFD damage". It also scores A by a different standard than D. Scored by one standard, A's 0.5-point lead disappears: A comes to 3.45–3.65, D to 3.65, and B to 3.75. A narrowed A could come back only as a new ADR with the changes listed at the end. No alternative has been shown to be clearly better. B scores highest once the scores are made consistent, and it suits the no-promotion model better, but it needs the same fresh landscape search first.

---

## 1. Objections, ranked

### FATAL

**F1. The landscape step failed (Gate item 2), and the ADR's main claims about existing solutions are false.**
L-017 and L-029 predicted exactly this, and it happened again. Evidence:
- **Codex CRLF is fixed natively, behind a flag.** The ADR says "Codex CRLF fixes closed unmerged". G1 says "no CRLF fix merged since (searched merged PRs to 2026-10-02)". Both are false.
  - openai/codex PRs [#37757](https://github.com/openai/codex/pull/37757) ("Add a line-ending preservation mode to `apply_patch`") and [#37758](https://github.com/openai/codex/pull/37758) (feature `apply_patch_preserve_line_endings`) were **merged 2026-08-10** and released in [rust-v0.148.0](https://github.com/openai/codex/releases/tag/rust-v0.148.0) on 2026-08-18. The flag is still off by default (`Stage::UnderDevelopment` in `codex-rs/features/src/lib.rs` on main today).
  - [codex#4003](https://github.com/openai/codex/issues/4003), the ADR's main CRLF thread, was **closed as completed on 2026-08-10**, with a contributor comment linking the fix ([comment 5235020382](https://github.com/openai/codex/issues/4003#issuecomment-5235020382)).
  - Users then explained how to turn it on: `codex features enable apply_patch_preserve_line_endings` ([2026-08-19](https://github.com/openai/codex/issues/4003#issuecomment-5341352203)), and how to do it in the desktop app ([2026-09-03](https://github.com/openai/codex/issues/4003#issuecomment-5519116632)). The G1 report quoted this thread only up to July.
- **Kilo (Kilo-Org/kilocode, 27,473 stars; its CLI is an OpenCode fork) has detected and preserved file encodings natively since April 2026.**
  - Issue [#7144](https://github.com/Kilo-Org/kilocode/issues/7144) was closed as completed on 2026-04-24. PRs #9421 (docs) and #9424 (tests) were merged on 2026-04-23.
  - The [docs](https://kilo.ai/docs/code-with-ai/features/file-encoding) list Shift_JIS, EUC-JP, GB2312, Big5, EUC-KR, Windows-1251, KOI8-R, and ISO-8859, using chardet and iconv-lite.
  - In the ADR's own primary thread, a user recommends it: "Please try Kilo Code. It's the only plugin/AI assistant I could find that supports legacy encoding" ([#7134 comment 5375305953](https://github.com/anthropics/claude-code/issues/7134#issuecomment-5375305953), 2026-08-21). For anyone willing to switch agents, that need is already met natively.
- **OpenCode is moving on encodings too.**
  - [PR #49881](https://github.com/anomalyco/opencode/pull/49881) ("feat(tool): support non-utf8 file encodings", 2026-09-19, open) makes edit, write, read, and apply_patch encoding-aware and adds a `file_encoding` setting.
  - Issue [#45924](https://github.com/anomalyco/opencode/issues/45924) is open. PR [#45925](https://github.com/anomalyco/opencode/pull/45925) (refuse non-UTF-8 files instead of corrupting them) was closed on 2026-09-28.
  - Merged #39258 says the v2 edit tool "preserv[es] untouched content and line endings".
- **"Nothing for Codex" is false.**
  - dimitar-grigorov/mcp-file-tools documents a Codex CLI setup (`codex mcp add …`).
  - knewstimek/agent-tool (24 stars, pushed 2026-09-30) is an encoding-preserving MCP file toolset. It documents Claude Code, Codex, Cursor, Windsurf, Cline, and Gemini CLI.
- **"Nothing repairs damage already done; the common advice is that the bytes are lost" is false.** [#7134 comment 5388799038](https://github.com/anthropics/claude-code/issues/7134#issuecomment-5388799038) (2026-08-23) is in the thread the ADR quotes six times. It publishes the same core idea as the prototype: normalize the clean copy (every non-ASCII character becomes U+FFFD), match lines, and restore unchanged lines from the clean copy. The author applied it to 348 `.pas` and 81 `.dfm` files and recovered "21,613 of 21,777 corrupted lines (99.2%)". The rest went to a CSV for manual review. It is a recipe, not a package, but the claim of novelty does not hold.
- **About 25 small tools were missed** (table in §2). The most relevant ones:
  - pindolabha/encoding-bridge-mcp: on npm since 2026-09-28, 304 downloads in September, bilingual README. It *denies the built-in Read/Edit/Write in project settings*, so the model cannot bypass it. That removes the ADR's objection to the MCP approach ("works only when the model chooses its tools").
  - jidzhang/mcp-fileencoding (7 stars): Chinese description containing "[zh]", second result for that query.
  - Four Japanese Shift_JIS MCP servers. **No Japanese search was done**, although Shift_JIS users are a named group of the people.
  - DeepSeek Harness, Gemini CLI, and VB6/Delphi-specific guards.
- **Resolve by**: redo the landscape in English, Chinese, and Japanese, recording each tool and native fix with what it serves; correct `candidate-A-encoding.md` §3 and ADR "Why existing tools fail"; re-score; re-run the critique.

**F2. The decision rests on a lead that comes from inconsistent scoring.**
- After the prototypes, D's "unmet" was cut from 3 to 2 because "the hand-written workflows work for their owners" and "an agent now writes such a workflow in minutes". A's "unmet" was raised from 3 to 4 at the same moment, but the same facts apply to A:
  - "have Codex write a hook that checks for all modified (git) files and normalizes them" (N1 row 4)
  - a self-built FileWatcher (N1 row 5)
  - a self-built MCP server (N2 row 5) and a self-built hook (N2 row 8)
  - `gbk_hook.js` from a CSDN blog (N2 row 19)
  - the Delphi user's recovery script (F1)
- A's "improve" rose from 3 to 4 because "the repair keeps its value even if one vendor fixes its tool". Vendors are not fixing one at a time; they are converging (S7).
- Consistent scores for A: need 5, unmet 3, serve 3–4, find 2 (S1), improve 3. That gives **3.45–3.65**, against D at 3.65 and B at 3.75. The 0.5 "more than noise" lead is gone.
- The tie-break does not favour A either. The developer's own repos are English, UTF-8, and `* text=auto eol=lf` (Constitution §5, §9), so the developer never meets this need in its own work.
- **Resolve by**: re-scoring all candidates by one standard in `needs.md`, and recording the change.

### SERIOUS

**S1. Findability without promotion is worse than "3".**
- Every existing tool got its users from its author's comment in a vendor thread, and the program may not post there (Constitution §3B):
  - claude_encoding_guard was created on 2026-04-16. Its author posted in #7134 on 2026-04-17, and its first star came on 04-20. It then gained about 1 star a week and has had **none since 2026-08-11** (star-history endpoint).
  - mcp-file-tools was announced in #7134 on 2026-02-10 and gains about 2–3 stars a month.
  - text-encoding-guard got 41 of its 45 stars in nine days (May 17–25), from an outside burst, and about 1 a month since.
- The GBK and Shift_JIS users search in their own languages:
  - GitHub repo search for "[zh] claude" returns 0 repos, and "[zh] claude" returns 10, all with Chinese descriptions. An English-only README does not match those queries.
  - Japanese users find hook recipes on Zenn, Qiita, and iret.media; Chinese users find them on CSDN.
- In English, the 16–24-star tools rank first and already serve Claude Code users.
- Given that the knock-out says "Its value depends on promotion rather than on people looking for a solution", Find should be **2**.
- **Resolve by**: an owner decision, before release, on zh/ja README sections (§3B); a name and description built from what users paste ("U+FFFD", "�", "mojibake", "[zh]", "[zh]", "restore encoding"); a lower prediction (S2).

**S2. The prediction is inflated and the kill signals sit below noise.**
- The closest tools gained about 3 stars a month, *with* the vendor-thread channel. The project would have about 26 days between release (2026-10-30) and close (no earlier than 2026-11-25). A median of 12 by close is about four times their rate, without their channel. A realistic median is **≤ 3**.
- "At least 50 npm downloads in a month" and the kill signal "fewer than 20 in 14 days" are within mirror and bot noise. opencode-preserve-format (1 star) gets 28 a month, and @longhun12346/file-encoding gets 67.
- **Resolve by**: median ≤ 3 stars by close; signals from GitHub traffic (search referrers, unique cloners) and from issues, not npm counts.

**S3. The v1 Claude Code plugin is weaker than the existing plugin on the core harm, and its design runs into documented Claude Code behaviour.**
- With keepenc's design the model still **sees U+FFFD on Read**. It cannot understand or edit CJK comments and strings.
  - Haiku deleted and translated text *because* it saw garbage, and "repair" cannot bring that text back.
  - Strong models notice the garbage and route around Edit through PowerShell, iconv, or Python. That shell path is the token cost users complain about, and the Edit/Write hook never fires on it.
- claude_encoding_guard shows the model real text (it converts at Read time). Its [TECHNICAL.md](https://github.com/ymonster/claude_encoding_guard/blob/main/TECHNICAL.md) says `PostToolUse(Read)` + `updatedToolOutput` "works" ("Phase E, verified 2026-06-26").
- The same document records Claude Code's **content-hash stale detection**: "any conversion that changes the on-disk content between a Read and the next Edit on the same path will trip stale-detection and force the model into a re-Read loop".
  - The ADR's design ("PostToolUse repairs the file at once") rewrites the file after every Edit. A second Edit to the same file may fail with "file has been modified externally".
  - The prototype was only tested as an after-the-fact CLI, never as a live hook with several edits in a row.
- **Resolve by** one of:
  - (a) drop the plugin from v1;
  - (b) contribute fixes to claude_encoding_guard (the short Shift_JIS miss; a Node runner instead of uv) through the outbox;
  - (c) redesign: real text through `updatedToolOutput` on Read, and `old_string` mapped back through `updatedInput` on Edit. Then verify live with at least 3 consecutive Edits to the same file.

**S4. The prototype breaks in the people's common configurations.** Reproduced by my scripts:
- **`core.autocrlf=true`** is Git for Windows' default and the setup of a [codex#25048 commenter](https://github.com/openai/codex/issues/25048) (2026-07-19: "`core.autocrlf=true` … Index stores the tracked text files as LF"). With it, the HEAD blob is LF, so `fix --git` **converted a CRLF working file to all-LF** (cases A1 and A2: "restored gbk, lf"). The tool causes the very damage it promises to prevent. The fixture (`make.py`) hard-codes `core.autocrlf false`, so this was never tested. The same applies to `.gitattributes eol=crlf` and `working-tree-encoding`.
- **Windows-1252 bytes 0x80–0x9F are decoded wrongly by Node 24.13.0's `TextDecoder`.** It returns C1 controls instead of € … ‘ ’ “ ” – — ™ (the Node issues #56542 and #60888 were closed in 2025-12, but the installed LTS still does it). In my "converted correctly to UTF-8" case, **'€' became '?'**. Any smart quote or dash that a model writes into a cp1252 file would be "not representable" and replaced. Windows-1252 is the most common encoding in the N2 evidence. The zero-dependency design needs its own codec tables.
- **Uncommitted work before the agent ran**: the prototype aligned the damaged new line to the wrong original line and wrote a **plausible but wrong CJK character (U+7387)** plus "????" into the user's own comment. That is silent mis-recovery, caused by the fallback to all original lines (`hunkOld.length ? hunkOld : L`).
- **Other damage modes**:
  - Cursor's '?' substitution ([forum](https://forum.cursor.com/t/ai-edits-corrupt-non-utf-8-characters-symbol-becomes-in-windows-1252-files/150366)) was reported as **"ok"**, so it is not even detected.
  - Double encoding ("è → Ã¨", [#7134 comment 5588181805](https://github.com/anthropics/claude-code/issues/7134#issuecomment-5588181805)) is not repaired.
  - A healthy GBK file is reported as having "4 replacement characters". This is the false alarm the Delphi user warned about.
- **Resolve by**:
  - compare against the working-tree form after git's conversion (`git cat-file --filters`), not the raw blob;
  - ship codec tables;
  - never recover outside an aligned deleted hunk;
  - detect '?' substitution and double encoding by comparing with git;
  - add `--base <rev>` for damage that was already committed;
  - test a matrix: autocrlf on/off/input, eol attributes, working-tree-encoding, and four damage modes.

**S5. The unique part ("repair") has the thinnest evidence in users' own words.**
- One person describes recovering damage after the fact, and they already did it themselves (F1).
- "The common belief is that the replaced characters cannot be recovered, so people `git checkout` the file and lose the agent's work" is the developer's inference, with no quotes.
- So the well-evidenced part (prevention) is crowded, and the uncrowded part (repair) is barely evidenced.
- **Resolve by**: at least 5 independent people (EN/ZH/JA) asking how to recover damaged files, or drop repair as the differentiator.

**S6. "We can serve it well" is overstated.**
- Codex, OpenCode, and Ollama are **not installed** on this machine (checked).
- Driving Codex `--oss` needs a tool-calling local model such as gpt-oss:20b, about 13 GB, on a 6 GB GTX 1660 Ti with 16 GB RAM. That is unverified and slow.
- In Codex, damage to non-UTF-8 files comes through the **shell fallback**, because apply_patch refuses non-UTF-8 ([codex#21164](https://github.com/openai/codex/issues/21164)). Hooks on `apply_patch` do not see that path; a hook matched on `Bash` plus a git scan would.
- The developer's "own use" (running `check --staged` in the program repos) is close to ceremonial, because those repos are LF/UTF-8 English by rule.
- **Score 3, not 4.**

**S7. The vendors are converging on fixes during the project's lifetime.**
- Codex CRLF: fixed behind a flag, likely default soon.
- Kilo: encodings shipped.
- OpenCode: encoding PR open; v2 edit preserves line endings.
- Gemini CLI: EOL fixed (#16148).
- Claude Code: CRLF fixed (2.1.77/2.1.89), and [#96263](https://github.com/anthropics/claude-code/issues/96263) was labelled `data-loss` and `has repro` on 2026-09-23.
- Iterations 1 and 3 ("more agents", per-agent settings) are an adapter treadmill that shrinks with each fix. **Improve should stay 3.**

### MINOR

- **M1. The 19 "encoding" people mix different mechanisms.** codex#8340 is a BOM *added* to UTF-8 in the VS Code extension. codex#16542 is UTF-8 Chinese garbled. opencode#30205 is PowerShell writing GBK into UTF-8 files. opencode#31604 is a display issue in Read. The prototype addresses none of these directly. Count them separately.
- **M2. The model evidence is anecdotal.** The main "silent loss" exhibit is Haiku 4.5, which rarely edits files in real Claude Code sessions. Opus and Sonnet with all tools kept everything in 3 of 3 runs, but 5 runs in total is not a frequency. #96263 shows that even Opus damages the file on the first Edit before noticing. Measure at least 10 runs per model.
- **M3. Committed damage is not handled.** The silent case ("compiled with 0 errors", found at runtime) is often discovered after commit, but v1 compares only with HEAD or the index. Add `--base`.
- **M4. The agents where the gap is widest are absent from the evidence and the plan.**
  - Cursor: forum threads from 2026-01 to 06. Staff say the agent "forces all files to be saved as UTF-8 and ignores the original encoding"; the bug still occurs in 3.0.13.
  - Copilot in Eclipse: microsoft/copilot-eclipse-feedback#24.
  - The Chinese ecosystem: DeepSeek Harness, Trae, Qoder, which have their own tiny guards.
  - Aider, by contrast, already has `--encoding`.
- **M5. Trust.** A new, AI-maintained tool that rewrites source files in ERP or mainframe codebases (for example a PL/I user on Bedrock) faces install barriers. Default to dry-run with backups.
- **M6. Schedule.** The P0+P1 ceiling must not push the decision through. The Gate comes first.

## 2. Competitors and native fixes the developer missed
Stars and last push are as of 2026-10-03.

| Name | Link | Stars | Last update | What it does | Meets the need? |
|---|---|---|---|---|---|
| Kilo (native) | [kilo.ai docs](https://kilo.ai/docs/code-with-ai/features/file-encoding), [Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) | 27,473 | 2026-10-02 | Detects and preserves each file's encoding on read and write (VS Code, JetBrains, CLI); new files are UTF-8 | **Yes**, for users willing to use Kilo |
| Codex native flag `apply_patch_preserve_line_endings` | [#37757](https://github.com/openai/codex/pull/37757), [#37758](https://github.com/openai/codex/pull/37758), [0.148.0](https://github.com/openai/codex/releases/tag/rust-v0.148.0) | — | released 2026-08-18 | Preserves CRLF, CR, and mixed endings in apply_patch, including shell-invoked patches | **Yes for CRLF**, opt-in |
| OpenCode PR #49881 | [link](https://github.com/anomalyco/opencode/pull/49881) | — | open, 2026-09-19 | Non-UTF-8 encodings in edit, write, read, and apply_patch | Not yet merged |
| knewstimek/agent-tool | [link](https://github.com/knewstimek/agent-tool) | 24 | 2026-09-30 | MCP file tools that preserve encoding and line endings; documented for CC, Codex, Cursor, Windsurf, Cline, Gemini | Partly (opt-in MCP) |
| pindolabha/encoding-bridge-mcp | [link](https://github.com/pindolabha/encoding-bridge-mcp) | 1 (npm: 304 dl in Sept) | 2026-09-30 | MCP Read/Grep/Edit/Write for legacy encodings (GBK, Big5, Shift-JIS, Windows code pages, UTF-16); **denies the built-ins** in project settings; EN/ZH README | **Largely**, for CC prevention |
| jidzhang/mcp-fileencoding | [link](https://github.com/jidzhang/mcp-fileencoding) | 7 | 2026-09-30 | MCP for GBK/GB18030 that keeps line endings and indentation | Partly |
| jasoncychueh/claude-vb6-plugin | [link](https://github.com/jasoncychueh/claude-vb6-plugin) | 4 | 2026-04-09 | CC plugin: "transparent ANSI encoding protection" for VB6 | Partly (VB6) |
| @longhun12346/file-encoding (longhun12346/artifact-skills) | [npm](https://www.npmjs.com/package/@longhun12346/file-encoding) | npm 67 dl/mo | 2026-08-09 | CC plugin / Pi extension: blocks unsafe native edits of GBK/ANSI/UTF-16 files and steers to transcoding | Partly |
| zongzi78/agent-plugins-market `encoding-safe-edit` | [link](https://github.com/zongzi78/agent-plugins-market) | 1 | 2026-09-11 | CC plugin: safe read/edit/write for GBK/GB18030/UTF-16 | Partly |
| minatoplanb/claude-code-jp-starter | [link](https://github.com/minatoplanb/claude-code-jp-starter) | 1 | 2026-02-20 | CC hooks incl. Shift_JIS protection | Partly |
| Autsunset/encoding-guard | [link](https://github.com/Autsunset/encoding-guard) | 1 | 2026-07-06 | CC skill guarding GBK sources | Weak (a skill) |
| JUrbani/edit-delphi7-units | [link](https://github.com/JUrbani/edit-delphi7-units) | 0 | 2026-09-21 | Skill to edit Delphi 7 files without corrupting their encoding | Weak |
| error21/cc-sjis-tool, fukumen/mcp-sjis-server, MichaelCharles/cp932-tools-mcp-server, s14u/golang-sjis-mcp | e.g. [fukumen](https://github.com/fukumen/mcp-sjis-server) | 0 each | 2026-04 → 2026-08 | Shift_JIS/CP932 read/edit/write that keeps encoding (and CRLF) | Partly (opt-in) |
| DovahkiinYuzuko/nen-mcp-server | [link](https://github.com/DovahkiinYuzuko/nen-mcp-server) | 1 | 2026-05-20 | Gemini CLI extension / MCP for Shift_JIS files | Partly |
| MrWeiCodes/dsh-fs-encoding | [link](https://github.com/MrWeiCodes/dsh-fs-encoding) | 6 | 2026-09-28 | DeepSeek Harness file-encoding guard (GBK, BOM) | Yes for DSH users |
| Lostforest7/dsh-encoding | [link](https://github.com/Lostforest7/dsh-encoding) | 1 | 2026-09-30 | DSH command runner with correct encodings, plus mojibake recovery | Partly |
| LZ59/opencode-encodeguard-plugin; vexakuro67/opencode-plugin-encoding-auto | [LZ59](https://github.com/LZ59/opencode-encodeguard-plugin), [vexakuro67](https://github.com/vexakuro67/opencode-plugin-encoding-auto) | 0 | 2026-08 | OpenCode encoding plugins | Partly |
| Cuicj/encoding-guard | [link](https://github.com/Cuicj/encoding-guard) | 0 | 2026-04-30 | Codex Chinese garbling fix (PowerShell) | Weak |
| skyispainted/encoding-vfs | [link](https://github.com/skyispainted/encoding-vfs) | 0 | 2026-06-15 | WinFsp virtual drive that shows GBK/Shift_JIS projects as UTF-8 to **any** tool and writes back in the original encoding | Partly (agent-agnostic, heavy install) |
| MatinNazifi/mojiguard | [link](https://github.com/MatinNazifi/mojiguard) | 0 | 2026-08-05 | Scan and repair double-encoding mojibake and ASCII-policy files; PostToolUse and pre-commit | Different damage |
| AureliaRen/garbled-text-checker | [link](https://github.com/AureliaRen/garbled-text-checker) | 1 | 2026-09-10 | 12 mojibake types, reverse restoration, CC hook | Different damage |
| tsurutanmen/cc-winjp | [link](https://github.com/tsurutanmen/cc-winjp) | 0 (PyPI) | 2026-09-30 | Diagnoses Shift_JIS traps for CC on Japanese Windows; cites #96263 | Diagnosis only |
| MikeGrierTools.tpu-mcp (VS Code Marketplace) | marketplace | 35 installs | 2026-09-18 | MCP for encoding-aware file I/O | Partly |
| Recovery recipe in #7134 | [comment 5388799038](https://github.com/anthropics/claude-code/issues/7134#issuecomment-5388799038) | — | 2026-08-23 | Line-alignment recovery from a clean copy; 99.2 % of 21,777 lines | Recipe for the "repair" part |
| Aider `--encoding` | [options](https://aider.chat/docs/config/options.html) | — | — | One encoding per session for reading and writing | Partly (single-encoding repos) |
| Japanese/Chinese hook recipes | [Zenn](https://zenn.dev/alarky/articles/claude-code-utf8-hooks), [iret.media](https://iret.media/192851), [Qiita](https://qiita.com/DIKE_zozo/items/ca9eca9af506d5c09381), CSDN `gbk_hook.js` | — | 2026 | Copy-paste Pre/PostToolUse transcoding hooks | Partly; this is where those users look |

Takeaway: about 25 attempts across six agent ecosystems, none above 24 stars, plus one native solution in a 27k-star agent. `research.md` §1.4 says such a niche "is a warning that the need may be weaker than it looks; find out why they failed before going further". The ADR did not do that analysis. The star histories in S1 suggest why they failed: users find tools in vendor threads and in-language blogs, and a few dozen people a month adopt one.

## 3. Verdict
**Reject ADR-006 as drafted.** It cannot pass the Gate:
- Item 2 fails, and the rationale in "Why existing tools fail" is partly false (F1).
- With consistent scoring the selection no longer follows from the evaluation (F2).
- Several serious objections need data, not wording, to answer them (S1, S3–S6).

**Alternatives.** B scores 3.75 against A's 3.45–3.65 and D's 3.65. B also suits the no-promotion constraint better, because its users search the web for error strings in questions with 500k views. But B has its own risks: six tiny CLIs, torchruntime, uv's `--torch-backend`, and a failure this machine cannot reproduce. It needs the same fresh, multilingual landscape before it can be called better. D's weaknesses stand.

**If A is re-proposed, it must change as follows:**
1. **Complete landscape** in EN, ZH, and JA with every row in §2. Remove the false claims ("nothing for Codex", "Codex fixes closed unmerged", "nobody repairs"). Record why the roughly 25 attempts got so few users.
2. **Narrow v1** to what no package does: an agent-agnostic git-based `check`/`fix` (pre-commit, CI, and after a session) for legacy encoding, line endings, and BOM. It would serve Cursor, Copilot, DSH, Trae, Kilo, Codex shell writes, and PowerShell writes. **Drop the Claude Code plugin from v1**, or raise contributions to claude_encoding_guard through the outbox. Point Codex users to the native flag rather than building around it.
3. **Fix the classes of defects shown in S4** before calling the prototype validated:
   - compare against the working-tree form after git's conversion (autocrlf, eol attributes, working-tree-encoding);
   - ship codec tables rather than relying on Node's TextDecoder;
   - no recovery outside aligned hunks;
   - detect '?' substitution and double encoding;
   - `--base <rev>` for damage already committed;
   - a fixture matrix across git configurations and four damage modes.
4. **Evidence for repair**: at least 5 independent people in their own words (EN/ZH/JA), or stop leading with repair.
5. **Findability**: an owner decision on zh/ja README sections *before* release; search words users paste ("U+FFFD", "�", "mojibake", "[zh]", "[zh]", "restore encoding"); Find = 2.
6. **Prediction**: median ≤ 3 stars by close. Replace npm-download kill thresholds with GitHub search referrers, unique cloners, and issues.
7. **Serve**: install and verify Codex, OpenCode, and Ollama end to end on this machine (recording installs per §3A), or mark those recipes untested from the start.
8. **Re-score A, B, and D by one standard**, then run a new independent critique, then confirm in a later session.
