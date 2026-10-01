# Mods launch wave: day-0 snapshot (S021)

_Snapshot at 2026-10-01 22:30 UTC (2026-10-02 06:30 Asia/Shanghai), about 4.5 hours after Claude Code 2.1.287 shipped (about 18:00 UTC on 10-01, [kingy.ai](https://kingy.ai/news/claude-code-2-1-287-mods-permissions-rollout/)). Research subagent (read-only), checked and condensed by the developer. The star-history endpoint buckets by UTC day, so "10-01" is a partial launch day. Data: `lab/earnstar_1/s021/modmeta.json` (285 verified mod repos with metadata), `wave_verified*.tsv` (git-ignored)._

**Bottom line**: no launch wave yet on GitHub or HN. The mod-building wave happened during early access (09-14 to 09-22), and the large star counts belong to authors who already had an audience, or to the Jev wave, not to mods.

## 1. Mod repos
**What marks a mod**: `hooks/hooks.json` declares `"modules"` (e.g., `"modules": ["./register.ts"]` in Anthropic's `mods/diff`).

**Search**: code search `'"modules" path:hooks filename:hooks.json'` (132 hits), `'"modules" filename:hooks.json'` (1,166, mostly noise), `'register(on filename:register.ts'` (161); every `hooks/hooks.json` found was fetched and parsed for a `modules` key (332 passed, 121 failed). Repo searches: `claude code mod created:>=2026-09-25` 73, `claude mod created:>=2026-09-25` 138, `claude-code-mods` 75, `topic:claude-code-mods` 7, `topic:claude-mods` 15, `topic:claude-code-mod` 10, `topic:function-hooks` 35 (mixed), `claude mod created:>=2026-09-30` 59; candidates checked through `git/trees/HEAD?recursive=1`.

| Verified mod repos (lower bounds; the code index lags) | Repos |
|---|---|
| All | **285** |
| Created before 09-01 (older repos that added a mod) | 82 |
| Created 09-01..09-24 (early access) | 133 |
| Created 09-25..09-30 | 32 |
| Created on 10-01 UTC | **38** (31 of them 17:00–22:00 UTC, after the launch) |

Daily creation peaked in early access (20 repos on 09-15, 16 on 09-22). Stars are tiny: median 0; 126 repos with ≥ 1, 49 with ≥ 10, 19 with ≥ 100. **The 38 launch-day repos have 6 stars in total, none more than 2.** No new mod repo with ≥ 3 stars since 09-30 (`claude created:>=2026-09-30 stars:>=3`: 49 repos, none a mod).

**Top mod-bearing repos** (Anthropic and davila7 excluded; "incidental" = a large toolkit that also contains a mod):

| Repo | ★ | Created | Owner followers | What |
|---|---|---|---|---|
| kunchenguid/firstmate | 7,421 | 06-12 | 6,434 | Multi-agent tool; ships the firstmate-calm mod (the stars are the product's, not the mod's) |
| tamaratran/fast-jev-compaction | 7,306 | 09-17 | 151 | Jev-scored compaction (Jev wave) |
| zenbu-labs/terminal-browser | 3,579 | 07-06 | org | Browser in the terminal |
| tractorjuice/arc-kit | 2,252 | 2025-10 | 84 | Incidental |
| caliber-ai-org/ai-setup | 1,293 | 03-10 | org | Incidental |
| hex/claude-council | 815 | 2025-12 | 62 | Asks several agents and compares |
| Storybloq/storybloq | 760 | 04-17 | org | Project memory and ticket board |
| kunchenguid/compact-adviser | 191 | 09-17 | 6,434 | When to run /compact |
| greenpolo/cc-multi-cli-plugin | 184 | 04-05 | 6 | Other vendors' models |
| pleaseai/shunt | 165 | 07-09 | org | Per-agent model routing |
| tamaratran/jev-pruner | 155 | 09-18 | 151 | Trims Bash output with Jev |
| danyuchn/pii-guard | 149 | 03-30 | 40 | zh-TW PII redaction |
| GhalebDweikat/winnow | 100 | 09-16 | 4 | Context sieve |
| halluton/Mindful-Claude | 81 | 03-02 | 11 | Breathing while you wait |
| darrell-tw/darrelltw-mods | 57 | 09-16 | 3 | Stock band |
| karanb192/cache-tax | 39 | 09-18 | 164 | Keeps the prompt cache warm |
| sezaakgun/cc-arcade | 36 | 09-13 | 17 | Games above the prompt |
| karanb192/awesome-claude-code-mods | 32 | 09-15 | 164 | List with a footprint scanner |
| karanb192/claude-code-mods | 32 | 09-15 | 164 | Builder skill and mods |
| AlmogBaku/ContextSaver | 24 | 09-16 | 115 | Token-waste blocker |

Every repo above predates the launch. The best launch-day repos have 2 stars (daboy-dev/claude-code-usage-line, minuteman3/claude-autoresearch).

## 2. Stars per UTC day
| Repo | 09-28 | 09-29 | 09-30 | 10-01 (partial) | Peak day |
|---|---|---|---|---|---|
| firstmate | 51 | 42 | 39 | 38 | 09-08: 226 |
| fast-jev-compaction | 119 | 60 | 53 | 42 | 09-18: 2,049 |
| terminal-browser | 15 | 24 | 43 | 19 | 08-20: 412 |
| shunt | 0 | 3 | 30 | 11 | 09-30: 30 |
| awesome-claude-code-mods | 1 | 0 | 0 | 1 | 09-15: 10 |
| anthropics/claude-code | 142 | 129 | 155 | 108 | — |
| anthropics/claude-plugins-official | 65 | 48 | 49 | 30 | 09-25: 268 |
| davila7/claude-code-templates | 107 | 82 | 59 | 23 | — |

No repo shows a launch spike.

## 3. Lists and directories
- **claude-mods.com**: "independent, unofficial directory", no person or repo named; domain registered 2026-09-14 ([RDAP](https://rdap.verisign.com/com/v1/domain/claude-mods.com)); static site, **stale** ("Updated Sep 17, 2026", 75 mods, install guide still sets the early-access flag); no submission form.
- **karanb192/awesome-claude-code-mods**: 32★, about 1★ a day since mid-September, last push 09-29; "72 mods in 142 candidate repos" as of 09-17; a footprint scan per mod (hooks and `$` calls from `claude plugin validate`), reach levels, and a scoreboard page (https://mods.karanbansal.in/). karanb192/claude-code-mods 32★ (flat since 09-17); ray-amjad/awesome-claude-code-function-hooks 3★. New lists created 10-01 (joeVenner, RichardJSun) have 0★.
- **Official directory**: anthropics/claude-plugins-official (315 plugins) contains one mod, Anthropic's own; anthropics/claude-plugins-community (2,283 entries) one mod (next-steps, added 10-01). No third-party mod is listed in either. The blog says the directory will accept plugins with mods later.
- **davila7/claude-code-templates**: 38 mods under `cli-tool/components/mods/` (games 15, security 7, integrations 5, productivity 5, UI 3, observability 2, enterprise 1), since 09-16.

## 4. Launch coverage
- **HN** (Algolia, 22:26 UTC): the blog post 3 points, the claude.dev guide 3, the docs 2, a mod repo 2; no comments. Early-access posts were similar.
- **X**: a trending page "Claude Code Launches Mods for Custom AI Coding Tools" exists (not readable, HTTP 402).
- **Anthropic's demos**: the blog shows `/diff` as a mod and sec-default; the claude.dev guide (2026-10-01) shows **Token Weather** (a context "forecast" band), **Blast Radius** (a review pane for risky Bash commands), and **Replay Theater** (`/replay` to step through edits); no standalone repos for the last two were found.
- **Press**: kingy.ai (release notes), wavect.io and ccleaks.com (explainers), explainx.ai (names Mindful Claude, a Tetris mod, an RWX CI panel).

## 5. Non-English
- Japanese: Zenn "Introduction to Claude Mods" [translated title] (nogu66, 09-19, 88 likes); a paid Zenn book (09-21, 1 like; code in hide-sora/claude-code-mods-jissen, 0★); tomatoaiu/rename-ja (10-01, 0★). Qiita: none.
- Chinese: danyuchn/pii-guard (zh-TW, 149★), darrell-tw/darrelltw-mods (57★); a linux.do thread "has everyone tried claude mods yet" [translated title] (topic 2919620; blocked by Cloudflare). Juejin, Zhihu: none.

## 6. Categories (keyword counts over 281 descriptions; rough)
- **Crowded**: Jev compaction and routing 33; usage, quota, and context meters 26 (plus 20 dashboards on claude-mods.com; Anthropic's own Token Weather demo); compaction 21; model and effort routing 22; games 13 plus davila7's 15; fleet and subagent views; "while you wait" and wellness about 20; pets about 9 (buddy, ascii-pet, tamaclaude, octo-pet, cc-buddy, pixelband, clawd-band).
- **Thin or missing**: themes and skins 2; notifications and sound about 1; voice/TTS 0; test-results pane about 0; file tree 2; localization and accessibility 2; keybindings/vim 2; image preview 1; standalone versions of Anthropic's Blast Radius and Replay Theater demos 0.

## Developer's reading
- The day-0 picture supports L-025, not a DSH-style burst: early-access mods with good ideas stayed at 0–60 stars unless their author had an audience. H-008 (search demand at launch) is not yet visible on day 0; it should be re-measured with `tools/wave.mjs` over the next sessions.
- The list and directory slots are already held (karanb192's footprint list, claude-mods.com, davila7's catalogue), so #26-A has no real angle (knock-out).
- Pets and meters are crowded since early access; the thin categories are where a newcomer can still be first.
