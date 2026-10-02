# Demand-first mining: requests that maintainers decline (S021)

_2026-10-02. Research subagent (read-only), checked and condensed by the developer. Method: closed-as-not-planned issues sorted by 👍, wontfix, out-of-scope, and "potential extension / possible plugin / extension-idea" labels, and top-upvoted feature-request discussions, across editors (VS Code, Zed, Neovim, Helix), terminals (WezTerm, Alacritty, Windows Terminal), Windows (PowerToys, WSL, winget, Docker for Windows), GitHub (gh CLI, community discussions), runtimes and toolchains (Bun, Deno, Node, uv, pip, cargo, TypeScript, Prettier), app frameworks (Godot, FreeCAD, Excalidraw, Logseq, Tauri, Electron), AI tools (llama.cpp, Ollama, Codex, Gemini CLI, Claude Code, OpenCode, Open WebUI), self-hosted apps (Immich, Jellyfin, Home Assistant, Paperless-ngx, Audiobookshelf), and Ghostty. Each kept request was screened with `tools/crowding.mjs --since 2025-01-01` (4–5 phrases) plus all-time searches, and every repo linked in its thread was counted. Raw outputs: `lab/earnstar_1/s021/demandfirst/` (git-ignored)._

**Bottom line**: of 26 declined or deferred requests that a standalone tool could meet, **one** has a genuinely empty bottom tier; one more is worth watching; the rest are owned or crowded. In 20 of the 26 threads a workaround tool is already linked from the thread.

## Screening
| # | Request (👍, status) | Proposed tool | Crowding | Read |
|---|---|---|---|---|
| 1 | [immich discussions/10136](https://github.com/immich-app/immich/discussions/10136) auto image-rotation detection, 131 upvotes, open since 2024-06; a collaborator linked an ONNX model, nothing landed | A sidecar that scores thumbnails with an orientation model and applies non-destructive rotations through `PUT /assets/{id}/edits` (Immich v2.5+), with a review queue | 85 entrants for four phrases, none an Immich rotation tool; generic fixers at 40★ and 11★ | **OPEN** |
| 2 | [vscode#326146](https://github.com/microsoft/vscode/issues/326146) keep the classic UI, 313 👍 (plus #326328 131 and others, about 575 in total since July 2026) | A classic-density restorer | 22 entrants, no restorer | Owned by the native `workbench.experimental.modernUI` setting today; **watch**: open if Microsoft removes it |
| 3 | [godot-proposals#4282](https://github.com/godotengine/godot-proposals/issues/4282) Mask2D node, 328 👍 | Addon | 42 entrants, relevant max 6★ | Crowded (thin); a core PR is welcome |
| 4 | [WSL#4739](https://github.com/microsoft/WSL/issues/4739) inotify for Windows-side changes, 513 👍 | Bridge | 17 entrants; wslkit/wsldrive (polished, benchmarked) at 1★ | Crowded |
| 5 | [terminal#2933](https://github.com/microsoft/terminal/issues/2933) roaming settings, 151 👍 | Sync CLI | at least six scripts at 0★; 12★ max | Crowded |
| 6 | [vscode#306502](https://github.com/microsoft/vscode/issues/306502) Copilot chat sync, 83 👍 | Export and sync | 391 entrants; 117★ max | Crowded |
| 7 | GitHub community [11831](https://github.com/orgs/community/discussions/11831) / [15935](https://github.com/orgs/community/discussions/15935) group workflows by folder (402 / 604) | Browser extension | three near-identical extensions at 1★ | Crowded |
| 8 | [TypeScript#13219](https://github.com/microsoft/TypeScript/issues/13219) `throws` clause, 1,430 👍, declined | Lint plugin | 64★, 25★, 4★ plugins; 302 entrants for errors-as-values | Crowded |
| 9 | [immich 7151](https://github.com/immich-app/immich/discussions/7151) pet detection, 781 | Tagger | tedornitier/immich-pet-tagger 215★ | Owned |
| 10 | Immich auto-stacking (469) and rule-based albums (188) | Companions | immich-stack 240★, immich-deduper 662★; immich-autotag 146★, immich-smart-albums 80★ | Owned |
| 11 | Godot inspector tabs (153), collision presets (174) | Addons | 181★, 98★ | Owned |
| 12 | [WSL#4699](https://github.com/microsoft/WSL/issues/4699) reclaim disk space, 1,190 👍 | VHDX compactor | native `wsl --manage --compact` in a 2.9.9 pre-release; 122★ tool | Owned |
| 13 | [zed#4808](https://github.com/zed-industries/zed/issues/4808) better comments, 157 | Extension | 186★ | Owned |
| 14 | [audiobookshelf#3504](https://github.com/advplyr/audiobookshelf/issues/3504) Kobo sync, 257 | Bridge | Rezarys/kobobridge 6★ about 3.5 weeks after its author posted twice in the thread | Crowded (fresh) |

Also crowded or owned: PowerToys microphone mute (190 entrants), OpenCode vim mode (106★ tool) and voice input (a 32.5k★ app), C# Solution Explorer for VS Code (399★), winget desktop shortcuts (219 entrants), gh environments (13★), format-on-save exclusions, Zed settings sync (31★), Codex /rewind (52★), per-monitor virtual desktops, focus stealing (96★).

## Findings
1. **The first credible answer to a big request takes most of the stars**: immich-pet-tagger 215★, immich-stack 240★, Godot-Inspector-Tabs 181★, zed-comment 186★ (owners with 2–65 followers); later or less visible answers sit at 0–15★ even when well built (wsldrive 1★, three Actions-sidebar extensions at 1★ each, kobobridge 6★). Across 18 thread-linked tools the median is 14★; only first movers reached ≥ 98★.
2. **More 👍 does not mean more stars**: the 1,430-👍 TypeScript request's best tool has 64★; the 1,190-👍 WSL request's 122★.
3. **The request thread is a measurable launch channel**: immich-pet-tagger's peak day (38★, 2026-05-13) is the day its author posted in the 781-upvote discussion; 64★ in week 1, about 8 % of the 👍 count; kobobridge got about 2 % (6★ from 257). A thread reply is a third-party write (Constitution §3B): owner approval and AI disclosure each time.
4. **Ecosystem base rates** (`tools/basecount.mjs`, repos created 2025-10-01..2026-03-31): Immich-named repos 588, 11 reached ≥ 100★ (1.9 %); Godot-named 9,685, 20 reached ≥ 100★ (0.2 %).

## The open candidate and the watch item
- **Immich auto-rotation companion**: the only open niche; best-converting ecosystem found; feasible on Windows (Immich in Docker, ONNX models, a non-destructive edits API). Risks: moderate demand (131), the feature could land in Immich itself, accuracy on documents and logos. Expected stars at close + 90 days: DEV only, median 4 (90 % interval 0–40); with one approved, disclosed reply in discussion 10136 and an awesome-immich PR, median 15 (2–120).
- **Watch: a VS Code classic-UI restorer** becomes a same-day launch moment with an empty bottom tier if Microsoft removes the opt-out setting.

## Recommendation (subagent)
The open supply among old requests is nearly gone; a demand-first strategy works only with speed: answer a request within days of it being declined, using a watch query each session (`gh api -X GET search/issues -f q='is:issue reason:"not planned" reactions:>30 created:>{14 days ago}' -f sort=reactions-+1`) and labels such as Zed's `potential extension`, gh's `extension-idea`, Audiobookshelf's `possible plugin`, PowerToys' `Idea-New PowerToy`, VS Code's `*out-of-scope`, and Immich's feature-request discussions; ship within about a week and ask the owner to approve one disclosed reply in the thread. The expected value per answered request is small (median about 14★), so it fits L-028's model of several launch moments rather than a single bet.
