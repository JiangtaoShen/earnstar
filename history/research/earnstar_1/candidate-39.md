# Candidate #39: a configurable interface for Claude Code, built on mods

_S021, 2026-10-02, day 1–2 after Mods launched in Claude Code 2.1.287. Deep dive to the Selection Gate's standard (`playbook/research.md` §1.4). Related evidence: `mods-demand.md`, `mods-wave.md`, `launch-forms.md`; spike in `lab/spike/uikit/` (summarised in §6)._

## 1. The idea in one paragraph
One plugin of mods that lets a user reshape what Claude Code draws, without patching it or writing code: a band of widgets above the prompt (model, folder, branch, context fill, plan limits with reset times, cost, and more), and transcript tweaks (Read and search groups folded into one line that names the files, inline diffs hidden or shortened, message timestamps, a quieter or themed spinner and turn line). Everything is configured live from a `/customize` pane inside Claude Code, with presets ("calm", "dashboard", "minimal"). It works in the terminal and in the desktop app's Code tab, and is tested on every Claude Code release.

## 2. Why now: the closest precedent is the status-line launch
Claude Code 1.0.71 (2025-08-07, npm publish time) added "Customizable status line: add your terminal prompt to Claude Code with /statusline" (changelog). Repos created in the following three weeks (`tools/basecount.mjs 'statusline created:2025-08-07..2025-08-28'`, run 2026-10-02):

| Stars ≥ | Repos | Share of all 47 |
|---|---|---|
| 10 | 19 | 40 % |
| 100 | 8 | 17 % |
| 500 | 4 | 8.5 % |
| 1,000 | 3 | 6.4 % |

For comparison, L-024's unconditional prior for new agent-ecosystem repos is 4.0 % to 100 and 0.47 % to 1,000, and in the Claude Code hooks, plugins, and Skills launches no small-owner repo reached 1,000 within three weeks (L-025). The status line is a UI extension point that every user sees every minute; Mods' interface sites (the band, the spinner, tool rows, messages) are the same kind of extension point, much richer.

## 3. Landscape (stars on 2026-10-02; GitHub API)
| Repo | Stars | Created | Last push | What | Gap for us |
|---|---|---|---|---|---|
| sirmalloc/ccstatusline | 13,146 | 2025-08-08 | 2026-09-28 | Configurable status line (widgets, powerline, themes, TUI configurator); linked from the official status-line docs; 183,793 npm downloads in September | One line at the bottom, terminal only, cannot restyle the transcript; no mods plan in its issues (search 2026-10-02) |
| Haleclipse/CCometixLine | 3,470 | 2025-08-11 | — | Status line in Rust (owner 1,161 followers) | Same |
| Piebald-AI/tweakcc | 2,529 | 2025-07-20 | 2026-09-30 | Customization by patching Claude Code's binary (themes, verbs, prompts); 18,791 npm downloads in September | Patches are overwritten by every update and re-applied by hand; no mods plan (issue search 2026-10-02) |
| Owloops/claude-powerline | 1,172 | 2025-08-10 | — | Powerline status line; 17,176 npm downloads in September | Status line only |
| chongdashu/cc-statusline | 640 | 2025-08-13 | — | Status line generator | Status line only |
| rz1989s/claude-code-statusline | 479 | 2025-08-18 | — | Status line | Status line only |
| i1kazantsev/claude-code-spinner | 321 | 2026-03-02 | 2026-05-06 | Spinner phrases (Russian) | The native `spinnerVerbs` setting now covers verbs |
| martinemde/starship-claude | 150 | 2026-01-04 | 2026-04-30 | Starship-based status line; linked from the docs | Status line only |
| wynandw87/claude-code-spinner-verbs | 133 | 2026-02-18 | 2026-10-01 | 6,300 spinner verbs | Content for the native setting |
| zoharbabin/claude-code-message-timestamps | 70 | 2026-06-02 | 2026-07-08 | Message timestamps (plugin) | One fix; pre-mods method |
| darrell-tw/darrelltw-mods | 57 | 2026-09-16 | — | Stock tickers in the band (mod) | Fixed content, not configurable |
| s-a-s-k-i-a/claude-code-timestamps | 11 | 2026-04-08 | 2026-06-18 | Timestamps (plugin) | One fix |
| konsta95/ClaudeCodeMods (Dyna-UI) | 0 | 2026-09-22 | — | Status line as a mod | Early, 0★ |
| ryu111/telltale | 0 | 2026-09-17 | — | Status band (mod) | Early, 0★ |
| phuclh/claude-halloween | 1 | 2026-10-01 | — | Halloween theme (mod) | Seasonal skin |
| kunchenguid/firstmate (firstmate-calm mod) | 7,421 (the product's) | 2026-06-12 | 2026-10-01 | "Calm mode": hides tool rows, adds flourishes, inside a multi-agent product | Not standalone |
| Usage and context meter mods (cctop, token-ledger, context-lens, quota-meter, usage-weather, token-weather, about 26 repos) | 0–40 | 2026-09 | — | Fixed meters in the band or a pane | Not configurable; none drew stars in early access |

Native settings already cover some of this and are not worth re-building: color `theme` (built-in or custom), `spinnerVerbs`, `spinnerTipsEnabled`/`spinnerTipsOverride`, `maxProseWidth`, `prefersReducedMotion` (settings reference, 2026-10-02). The VS Code extension has native message timestamps; the CLI does not (changelog).

## 4. Case studies (what drove the stars)
1. **sirmalloc/ccstatusline** (76 followers): created the day after the status-line launch; 164 stars in week 1, 957 in 30 days, 13,146 now and still 423 a month. No HN story (Algolia, 2026-10-02). Drivers seen: launch timing, an interactive configurator (`npx ccstatusline@latest`), screenshots of themes, an npm one-liner, and a link from Anthropic's own status-line docs ("Community projects like ccstatusline and starship-claude provide pre-built configurations with themes", https://code.claude.com/docs/en/statusline). Growth compounding over 14 months fits L-025's second wave.
2. **Owloops/claude-powerline** (31-follower organization): created three days after the launch; 97 in week 1, 292 in 30 days, 1,172 now, peak day 60 (2025-12-12). No HN story. A distinctive look (vim-style powerline) and npm.
3. **Haleclipse/CCometixLine** (1,161 followers): four days after the launch; 242 in week 1, 3,470 now. An existing audience plus a Rust angle.
4. **chongdashu/cc-statusline** (492 followers): six days after; 57 in week 1, 640 now. A generator rather than a configurator; smaller.
5. **Piebald-AI/tweakcc** (491-follower organization): 2 stars in week 1, 56 in 30 days, then steady growth to 2,529 (peak day 47, 2026-04-14); HN posts scored 1–22 points. Shows lasting demand for customizing Claude Code's interface, met today by binary patching.
6. **PeonPing/peon-ping** (48-follower organization; 2026-02-09): 2,176 stars in week 1 (peak 1,297 on day 3), 5,062 now, 52 in the last 30 days. A playful sound layer for agent events; HN posts scored 1–4 points, so the burst came from elsewhere (not traceable here, L-002). Shows that small interface add-ons for coding agents can spread on their own when the result is instantly shareable.

Reading: in this archetype, small owners win when they ship at the moment an extension point opens, make the result visible in a screenshot, install in one line, and keep growing through search and docs links rather than one social burst. None of the six depended on HN.

## 5. Demand signals
1. **ccstatusline's scale**: 13,146 stars, 183,793 npm downloads in September 2026, 147 open issues; tweakcc 18,791 downloads; claude-powerline 17,176 (npm API, 2026-09-01..30). Many users actively customize Claude Code's interface.
2. **Desktop status bar** ([#41456](https://github.com/anthropics/claude-code/issues/41456), 70 👍, updated 2026-10-01): the desktop app has no status line; maintainers of usage widgets ask for one in September. Mods draw the band in the desktop Code tab (docs), which a status-line tool cannot.
3. **Which file was read** ([#21151](https://github.com/anthropics/claude-code/issues/21151), 186 👍, 133 comments): folded Read rows hide the file names; a maintainer landed partial improvements in February.
4. **Message timestamps** ([#44763](https://github.com/anthropics/claude-code/issues/44763) 90 👍, [#2441](https://github.com/anthropics/claude-code/issues/2441) 63, [#21051](https://github.com/anthropics/claude-code/issues/21051) 54; updated through 2026-09-13): native in VS Code only; two plugin workarounds (70★, 11★).
5. **Hide inline diffs** ([#37951](https://github.com/anthropics/claude-code/issues/37951), 98 👍, updated 2026-09-30) and **turn-duration verbs** ([#24968](https://github.com/anthropics/claude-code/issues/24968), 69 👍, updated 2026-09-24, asking for a "professional mode").
6. **Codex parity**: openai/codex [#17827](https://github.com/openai/codex/issues/17827) custom status line (198 👍).

## 6. Feasibility (spike, S021)
`lab/spike/uikit/`: one module restyles four sites from one saved config: the band (widgets from `$.session.model`, `cwd`, `usage`), the spinner (theme verbs), Read groups (one line naming the files), and a `/customize` pane (`Select` for the theme, toggles for widgets, saved in `$.store`). Results: `claude plugin validate` passes; `claude plugin test` passes 3 tests that draw the band for the terminal and desktop surfaces, press the pane's toggles, and fold Read rows; a real interactive session in a pseudo-terminal (node-pty + @xterm/headless) on Windows showed the band, the pane, the "Diving…" spinner, "Read 2 files: alpha.md, beta.md", and the context share after a turn. One Windows path bug was found only by the real render and fixed. Open: drawing in the desktop Code tab has not been seen with our own eyes (docs say yes; an early-access report on 2.1.281 said no), so it needs one check by the owner or a later build; desktop does not draw `Raster` or `Image`.

## 7. Differentiation
"Why this over ccstatusline, tweakcc, or asking Claude to write a mod?"
- **ccstatusline**: one line under the prompt, terminal only. This reshapes the whole interface (band, transcript rows, spinner, turn line), works in the desktop app too, and is configured live inside Claude Code.
- **tweakcc**: patches Claude Code's binary and must be re-applied after every update. This uses the official extension API, survives updates, and is tested against each release.
- **Asking Claude for a mod**: a one-off, untested script each user maintains. This is a tested, versioned set with presets and a live configurator.

One sentence: **"Make Claude Code's interface yours, in the terminal and the desktop app: a live-configurable band and a calmer, clearer transcript, built on the official mods API, so it survives every update."**

## 8. Distribution plan (channels the program can use today)
- **Launch timing**: first public release in Mods' first two weeks; the status-line precedent shows that the configurator that arrives first and looks best becomes the default.
- **Passive discovery**: claude-mods.com scans GitHub daily (`mods-wave.md` §3); GitHub search terms people use today ("claude code statusline", "claude code theme", "claude code timestamps", "claude code mods"); topics `claude-code`, `claude-code-mods`, `claude-mods`, `statusline`, `terminal`, `tui`, `customization`, `theme`; a description that carries those words; a primary language detected as TypeScript so a spike can reach TypeScript Trending (L-011).
- **Install in one line**: a marketplace in the repo (`/plugin marketplace add <owner>/<repo>`, then `/plugin install …`), with copy-paste commands at the top of the README.
- **Proof in the README**: real recordings of the band, the pane, and the transcript tweaks in the terminal (the spike's pseudo-terminal pipeline renders real output; no mock-ups, §3C).
- **DEV**: one article that teaches how mods draw UI (render sites, the element tree, testing a drawing with `claude plugin test`), with this project as the worked example. Tags with readers (top articles of the last 90 days, median reactions, 2026-10-02): #ai 127, #productivity 105, #opensource 44, #typescript 38, #showdev 37; #claudecode 4 and #terminal 0 are thin, so they are at most a fourth tag.
- **Lists and directories (B-class, through the outbox)**: karanb192/awesome-claude-code-mods (accepts mods; footprint-scanned), davila7/claude-code-templates (has a `mods/ui` category), hesreallyhim/awesome-claude-code (human-only submissions, owner-executed), and the official plugin directory once it accepts mods. Optional, owner-decided: one disclosed reply in [#41456](https://github.com/anthropics/claude-code/issues/41456) and [#21151](https://github.com/anthropics/claude-code/issues/21151), where people already post their workaround tools.

## 9. Risks
1. **An incumbent moves**: ccstatusline (13k) or tweakcc (2.5k) adds a mods mode. Mitigation: ship first; cover the transcript and the desktop app, where a status-line tool cannot follow; watch both repos each session.
2. **Anthropic adds native settings** (as it did for spinner verbs and VS Code timestamps). Mitigation: a set of many tweaks, each retired when native; native settings are only for simple values, not layouts.
3. **Mods do not create search demand** (day 0 shows no wave, `mods-wave.md`). Mitigation: the status-line keywords already have search demand; measure the wave with `tools/wave.mjs` each session; the pivot review has explicit kill criteria.
4. **Desktop rendering differs or fails**: verify before launch; otherwise state terminal-first.
5. **API churn between releases**: tests in CI against `latest` and `stable` each night.
6. **Visual quality**: the README must look good; the recording pipeline is proven in the spike.

## 10. Addendum (S021, 07:15): incumbents missed by the first landscape pass
A search for "hud" and "status bar" (GitHub, 2026-10-02) found the largest incumbent in this space, which the "statusline" and "theme" searches had missed:

| Repo | Stars | Owner followers | Created | Week 1 | First 30 days | Peak day | Last 30 days | What |
|---|---|---|---|---|---|---|---|---|
| jarrodwatts/claude-hud | 28,257 | 1,337 | 2026-01-02 | 1,773 | 2,780 | 1,652 (2026-03-18) | 543 | Status-line plugin: context, rate limits, active tools, agents, todos; v0.10.0 released 2026-10-01 after a render refactor ("one implementation per element and one width engine", #791); no mods code yet |
| GaoSSR/best-claude-hud | 1,109 | 46 | 2026-06-26 | 2 | 172 | 61 (2026-07-21) | 502 | Minimal status-line HUD in Rust |
| m1ckc3s/claude-status-bar | 706 | — | 2026-06-21 | — | — | — | — | Menu-bar indicator (macOS) |
| NYCU-Chung/cc-statusline | 264 | — | 2026-04-12 | — | — | — | — | Status-line dashboard |

Reading: (1) the information shown in a band (context, limits, tools, agents, todos) is already owned by two large status-line tools, claude-hud (28k, very active, a 1.3k-follower owner) and ccstatusline (13k); either can add a mods renderer quickly, so a band of the same widgets is not a defensible core for #39. (2) The archetype keeps producing small-owner winners long after its launch: best-claude-hud (46 followers) went from 2 stars in week 1 to 1,109, with 502 in the last 30 days, on a "minimal, Rust" angle. (3) What status-line tools cannot do is restyle the transcript (tool rows, diffs, timestamps, the turn line), draw in the desktop app, or take input in a pane. #39's core should move there; the band becomes an optional extra or an integration (for example, showing a status-line tool's output in the desktop band).
