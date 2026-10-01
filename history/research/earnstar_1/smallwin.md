# Small-owner winners of 2026 (S021)

_Repos created 2026-07-01..09-10, stars as of 2026-10-02. Research subagent (read-only), checked and condensed by the developer. This is the reference class that matches the program: owners without an audience, in the current, harsher ecosystem (L-026). Data and scripts: `lab/earnstar_1/s021/smallwin/` (git-ignored): `population.json` (search census in 15 five-day slices, each under 1,000 results), `final.json` (every row with its labels), `ignition_sample.tsv`, `hnall.json` (HN stories matched by URL), `analyze.mjs` and `lift.mjs` (the tables below)._

## 1. Denominator and small-owner share
`node tools/basecount.mjs "created:2026-07-01..2026-09-10" 10,100,300,1000`: 43,082 / 5,657 / 1,703 / 492 (five two-week slices were stable: 3.9–4.1 % of repos with ≥ 10 stars reached 300, and 1.0–1.2 % reached 1,000).

| Tier | All repos | Users with < 100 followers | Share |
|---|---|---|---|
| 10–99 | 37,425 | sample of 800 (8 days, by recent update): 514 | 64.3 % |
| 100–299 | 3,954 | sample of 418: 268 | 64.1 % |
| ≥ 300 | 1,703 | census: 763 | 44.8 % |
| ≥ 1,000 | 492 | census: 149 | 30.3 % |

From ≥ 10 stars, small users reach 300 at about 2.8 % and 1,000 at about 0.54 %; everyone else at 6.0 % and 2.2 %. Small organizations (< 100 followers and no other repo ≥ 300) add 192 winners ≥ 300 (55 ≥ 1k).

**Topic base rates** (all owners, same window; share of repos with ≥ 10 stars reaching 300 / 1,000): agent-skills 9.4 % / 4.1 %; codex 9.3 % / 4.1 %; claude-code 8.4 % / 3.5 %; dsh-plugin 8.1 % / 2.9 %; mcp 6.9 % / 2.4 %; macos 7.2 % / 2.2 %; self-hosted 4.5 % / 1.8 %; windows 4.8 % / 1.5 %.

**Excluded as inorganic or abusive**: 89 of 955 small-owner winners (9.3 %; 21 ≥ 1k): proxy and circumvention panels 21, subscription bridging and "2api" gateways 15, account-registration bots 14, anti-detect browsers and cracks 11, location spoofers and app mods 9, jailbreaks and leaked prompts 8, leaked builds 2, lures and clones 3 (e.g., arvids-unavailable/openGym, 7,010 stars, whose description is the URL of the original with 1,588), one repo asking for stars, other 6. A further 67 kept repos (8 %) were flagged for low engagement.

## 2. Archetypes (866 kept: 676 users, 190 small organizations)
| Archetype | ≥ 300 (users + orgs) | ≥ 1k | CJK | Median week-1 ★ | Median days to 100 | HN story ≥ 50 pts | News hook | Lift vs the 10–99 tier* |
|---|---|---|---|---|---|---|---|---|
| AI app/model/ML | 206 (139+67) | 40 | 26 % | 189 | 5 | 2 % | 15 % | 1.3× |
| AI agent tooling | 181 (131+50) | 47 | 32 % | 171 | 8 | 2 % | 33 % | 1.25× |
| Agent skill | 133 (124+9) | 28 | 55 % | 191 | 3 | 2 % | 9 % | 2.9× |
| Desktop/mobile app | 97 (81+16) | 23 | 36 % | 102 | 9 | 5 % | 3 % | 0.7× |
| Developer tool (non-AI) | 86 (58+28) | 21 | 23 % | 168 | 6 | 10 % | 1 % | 0.5× |
| Game/fun/creative | 32 | 4 | 31 % | 222 | 3 | 6 % | 25 % | 0.6× |
| Tutorial/course/book | 26 | 3 | 65 % | 221 | 9 | 4 % | 12 % | 0.9× |
| Curated list | 25 | 0 | 28 % | 97 | 8 | 0 % | 32 % | (n = 5) |
| Self-hosted/SaaS alternative | 24 | 7 | 13 % | 130 | 14 | 13 % | 0 % | 0.55× |
| Data, template, other | 56 | 10 | 39 % | – | – | – | – | – |
| **Total** | **866** | **183** | **35 %** | **180** | **6** | **4 %** | **15 %** | |

\* The same keyword-proxy label applied to winners and to the small-owner 10–99 sample (only 28 skills in that sample, so the ranking is more reliable than the multiples).

CJK: 30 % of small-user winners have a CJK description against 20 % in the 10–299 tiers (lift about 1.5×); 401 non-CJK small-user winners exist, 82 of them ≥ 1k.

**Ignition** (rules in `analyze.mjs`): all 866: unknown-source spike 558 (64 %), slow/organic 175 (20 %), news hook 105 (12 %), HN 28 (3 %); ≥ 1k (183): 108 / 42 / 26 / 7. 38 % reached 100 stars within 3 days; 64 % gained ≥ 100 in week 1; 11 % took more than 30 days. All 28 HN-ignited repos have English READMEs; no CJK repo had an HN story. News hooks: DeepSeek Harness 48, MiniMax H3 14, Pi agent 10, DLSS 5 9, Grok Build 8, Codex Desktop skins and pets 7, WorkBuddy 7, recompilation ports 5, Fable 5 5, Qwen 3.8 5.

## 3. Patterns
1. **Winners burst in the first days, from sources GitHub data cannot show** (posts on X, Xiaohongshu, WeChat, GitHub Trending, or inflation). HN explains 3 %, DEV no visible case. About 20 % grew slowly and steadily, mostly tools in daily use: trailhq/Graft (3 stars in week 1, 9,482 now, 4,009 in the last 30 days), miqdadbadjuber/anti-slop (198 in week 1, 4,237 now).
2. **Extensions for young agent tools win**: Codex is mentioned by 107 small-owner winners (26 ≥ 1k), as many as Claude (124; 30); DeepSeek Harness 73 (17 ≥ 1k). Skills are the fastest and most over-represented form (median 3 days to 100, lift 2.9×). Non-AI developer tools, self-hosted apps, and games are under-represented (0.5–0.7×).
3. **Visible output and a number beat a description**: 49 of 133 skill winners produce visual output (image, logo, poster, video, diagram); the top English skills lead with proof (kajisho5/ffmpeg-skill shows 53 before/after demos rebuilt by a script; Spielewoy/autoprompt-skill claims "cuts failures by 45%").
4. **Readable agent output is a recurring, English-friendly need, and now crowded**: AminBlg/SimpleEnglish 3,630 (HN 363 points), danyuchn/asd-ste100-skill 2,333, gvzdv/claudish-to-english 2,707 (1k in 4 days, no HN), anti-slop 4,237, kharmanskyi/open-steps 1,078, bro-skill 369, humanizer-stack 310. **This closes #23b**: claudish-to-english (created 2026-08-10) already rewrites "Claudish" through a local model as a Claude Code plugin (L-014).
5. **CJK helps but is not required**: lift about 1.5×; 55 % of skill winners are CJK; platform waves (DSH, Codex skins, WorkBuddy) are led by CJK communities; English repos win through agent tools, skills, and macOS utilities.

## 4. Fifteen instructive examples
| Repo | ★ | Owner followers | Week 1 | Days to 1k | What drove it |
|---|---|---|---|---|---|
| Fei-Away/Codex-Dream-Skin | 14,881 | 59 | 11,373 | 0 | CJK theme for Codex Desktop; six more skin and pet repos followed |
| trailhq/Graft | 9,482 | org 40 | 3 | 32 | Context layer for coding agents; slow growth, still rising |
| s1dashu/ip-as-logo-skill | 5,751 | 90 | 4,159 | 0 | Image-generation skill; the output is the demo |
| nyblnet/bento | 5,327 | 55 | 2,862 | 6 | English; a whole office app in one HTML file, "try it in 10 seconds"; no HN |
| miqdadbadjuber/anti-slop | 4,237 | 78 | 198 | 28 | Anti-slop rules for agents; slow organic growth |
| ccch1mneyyy/dsh-TUI | 3,911 | 39 | 2,041 | 2 | Created on DeepSeek Harness launch day |
| xiaobright/dsh-anchored-standard | 3,782 | 36 | 3,517 | 0 | Launch-week plugin; 81 % of its stars in 3 days |
| AminBlg/SimpleEnglish | 3,630 | 52 | 14 | 10 | Vivid hook ("Boeing manual"); HN 363 points on day 9 |
| arnegiacomo/fugleramme | 3,497 | 51 | 1 | 69 | Dormant until HN (2,391 points) on day 59 |
| gvzdv/claudish-to-english | 2,707 | 37 | 1,237 | 4 | Plain-English rewrite of Claude replies via a local model |
| Kuddev/pebrel | 2,702 | 6 | 110 | 69 | Windows-first AI terminal; slow growth |
| vinzdg/codenotch | 2,656 | 0 | 1,469 | 3 | macOS widget for coding-agent usage limits |
| Sahir619/fable-method | 2,298 | 24 | 1,125 | 9 | Fable 5 retirement news hook |
| kajisho5/ffmpeg-skill | 1,449 | 40 | 944 | 9 | Local-tool skill with a reproducible before/after gallery; npx install |
| arvids-unavailable/openGym | 7,010 | 78 | 4,267 | 19 | Inflation warning: a clone that out-starred its original 4.4× |

## 5. Directions that fit the program (subagent's list; developer's assessment follows in the session log and ideas.md)
1. **"Give your agent a ___"**: a skill that wraps a local tool (Pandoc, LibreOffice, ImageMagick, PDF tools), with a gallery a script can rebuild. Evidence: ffmpeg-skill 1,449 (944 in week 1), Alisa0808/vox-director 2,108, open-steps 1,078; skill lift 2.9×; agent-skills reach 1k at 4.1 % (of ≥ 10).
2. **A visual skill rendered by code**, needing no paid image model (SVG/HTML to PNG: infographics, diagrams, motion). Evidence: 49 visual skill winners; OrRon/EpicInfographics 431, inkboard/system-atlas 426, bangtutorial/bang-motion 554, Alexwtlf/agentic-product-demo 323; CJK leaders isjiamu/gzh-design-skill 3,881 and yang0/handraw-style 3,951. Most top visual skills rely on an image model through Codex.
3. **A Windows tray widget for agent usage and session state**. Evidence: vinzdg/codenotch 2,656 from a 0-follower owner (macOS only); change-42-yhmm/quota-float 365 (covers Codex on Windows), mikehasa/agentacct 760, qunqin24/Pulse 498, SirAllap/agentglass 331, Han-1413141/dsh-cost-meter 361. Risks: undocumented local files; the name must avoid "Claude" (L-013).
4. **A behavior-guard skill that ships its own benchmark**. Evidence: autoprompt-skill 1,298, lennney/stop-that-shit 2,444, LB623/no-negative-echo 888, s0xDk/refactoring-ui-skill 579, Kulaxyz/token-diet 472, saurabhkumar8112/cyclomatic-complexity-skill 402. Needs small, approved evaluation runs.
5. **A day-one extension, prepared in advance, for the next agent-tool launch or feature**. Evidence: DSH launch-week repos (dsh-TUI 3,911, dsh-anchored-standard 3,782, dsh-market 5,237); Codex-Dream-Skin (11,373 in week 1). Caveats: CJK-led; session timing (L-021, L-025).
6. **A single-file web tool that replaces a SaaS feature**. Evidence: nyblnet/bento 5,327 (English, no HN). Lower expected value (non-AI tools 0.5–0.7×).
7. **Readable agent output**: crowded now (pattern 4).

## 6. Noise and uncertainty
Follower counts are today's (past winners have left the small bucket, so small-owner success is understated); the 10–99 and 100–299 shares come from 8-day samples sorted by recent update; archetypes, exclusions, and hooks were labelled by one coder from descriptions; "unknown spike" cannot separate genuine viral posts from bought stars (fork ratios of 5–9 % on the large CJK spikes argue for genuine, but prove nothing); the lift column rests on small base counts. One README addressed text to AI readers; it was ignored and affected nothing.
