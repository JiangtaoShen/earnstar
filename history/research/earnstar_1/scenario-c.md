# Scenario (c): launching through Chinese developer communities (S021)

_2026-10-02. Research subagent (read-only), checked and condensed by the developer; prepared in case the owner allows a Chinese README and owner-written posts in Chinese communities (`channel-memo.md`). linux.do pages sit behind a Cloudflare check that was not bypassed, so linux.do evidence comes from search snippets and its public Telegram mirror; V2EX evidence comes from the sov2ex search API and the V2EX topic API. Chinese titles are given as English translations. Scripts and data: `lab/earnstar_1/s021/scen_c/` (git-ignored)._

## 1. Chinese-language small-owner winners (from `smallwin.md`'s data, suspicious rows excluded)
- 364 of 799 kept winners have Chinese text in the description or the README head (the earlier flag, description-only, found 274); 86 have ≥ 1k stars. Median week-1 stars: 157 (non-CJK winners: 210).
- **No Chinese winner had an HN story** of ≥ 50 points (English winners: 31).
- Ignition: unknown-source spike 218, slow 82, news hook 64.

| Category (keyword rules, approximate) | n | ≥ 1k | Median week 1 | Examples |
|---|---|---|---|---|
| DeepSeek Harness plugins, clients, skins, pets | 49 | 10 | 160 | dsh-market 5,237; dsh-TUI 3,911 |
| Short-video, short-drama, explainer production | 29 | 8 | 203 | printfilm 4,081; vox-director 2,108 |
| Image-style prompt galleries, illustration skills (need an image model) | 19 | 3 | 189 | photo-abstract-editorial 5,818; handraw-style 3,951 |
| Office, academic, and job documents | 16 | 2 | 86 | ASu-skills 5,298; gongwen-gbt9704-skill 743 |
| Windows desktop utilities | ~13 | ~5 | ~101 | RogueCleaner 1,128; StarPie 1,014 |
| Tutorials and books | 12 | 0 | 181 | pi-textbook 1,383 |
| Finance (A-shares) | 11 | 1 | 144 | easy-stock 1,118 |
| Content-platform workflows (WeChat Official Accounts, Xiaohongshu, Douyin) | 8 | 2 | 159 | gzh-design-skill 3,881 |
| Codex Desktop skins and pets | 7 | – | – | Codex-Dream-Skin 14,881 |

About 25 winners are workflows for a named Chinese platform (WeChat 9, Xiaohongshu 5, QQ 3, Douyin 2, Bilibili 2, Feishu/DingTalk 2, Xianyu 1). Several can be built and tested without platform accounts (layout skills with HTML output, rule corpora, text skills, a userscript, China-standard document workflows); others need accounts or personal chat data and are excluded.

## 2. Launch channels (first days)
| Repo | Channel and date | Self-posted? | Matches the peak? |
|---|---|---|---|
| isjiamu/gzh-design-skill | The author's own WeChat Official Account article ("The WeChat layout skill thousands asked me for is open source" [translated]), 2026-07-07; an X repost by op7418 the same day | Yes; the author had an audience | Yes (peak 07-07, 876) |
| czm15053/linuxdo-idea-ui | linux.do topic 2806191 (an open-source "slacking-off" userscript), about 08-24 | Probably | Yes (peak 08-26) |
| fanbuz/codesucker | The author's linux.do promotion post (topic 2645815, about 07-25), a Juejin post | Yes | No (week 1: 64; peak 08-09) |
| LunarXuan/Pindo | The author's linux.do post (topic 2805536), 08-24 | Yes | Partly |
| aakk007/RogueCleaner | A third-party X post (07-28), blogs | No | Partly |
| Hisn00w/ASu-skills | Added to NousResearch/hermes-agent as an optional skill (PR #95269, 08-26) | No | Yes (peak 08-27) |
| xr843/insect-world | The author's V2EX post (08-12), then ruanyf/weekly #408 | Yes | +174 stars in three days (14 before) |
| YTwsy/OpenSurge-for-Mac; zwc456baby/my-tv-webview; siknet/FreePEP | The authors' V2EX "share creation" posts | Yes (FreePEP unverified) | +338 / +190 / +278 in three days |

**Measured channel base rates**:
- **V2EX "share creation" posts** linking a repo created ≤ 45 days earlier (424 posts, 2026-07-01..09-10): the repos now have a median of **8 stars**; 12 % reached ≥ 100, **5.2 % ≥ 300**, 1.9 % ≥ 1k; in the three days after the post the median gain was **+3** (90th percentile +24), and only 2.8 % gained ≥ 100. Small owners (328): median 6; 3.7 % ≥ 300.
- **ruanyf/weekly**: 45 of 411 launch-age submissions were featured (11 %); featured repos already had a median of 77 stars, so it mostly picks repos already rising; median gain in the three days after a feature +69 against +55 before.
- **HelloGitHub**: one launch-age submission featured in issues 124–126, with no lift.
- **Authors' follow-ups mostly flop** (L-027 again): gzh-design-skill's author's next repo has 4 stars despite a WeChat audience.

## 3. Candidates for a bilingual launch (subagent; calibration anchor: a V2EX post gives a median of 8 stars and a 5 % chance of ≥ 300)
Niches found full ("many tried, none rose"): WeChat article to Markdown (≥ 7 skills), e-invoices (about 20 at 0–33), C-drive cleaners (233 repos), Codex mojibake fixers (about 15), "dumbed-down model" detectors (14+), de-AI writing skills (a roundup exists), thesis formatting (about 40), OFD viewers (≥ 12), bill analysers (≥ 8), arithmetic-drill generators (27), agent-from-scratch tutorials.

1. **Windows used-PC inspection report** ("MacCheck for Windows"): CPU and GPU identity against the claimed spec, SSD power-on hours and data written (SMART), battery wear, screen, keyboard, and camera tests, and a PASS/WARN/FAIL report. Competitor: andyhuo520/MacCheck 631 (macOS only; 419 in week 1); Windows attempts at 0–1. Demand: V2EX threads on inspecting used machines. Expected: median 15–40; about 10 % chance of ≥ 300. Testable on this PC (battery checks need mocks). L-014 risk.
2. **Procedural 3D explainer of Chinese timber joinery** (mortise-and-tenon, bracket sets), proportions from the public-domain Yingzao Fashi (1103), bilingual, static site. Competitors: four repos at 1–2 stars. Precedents: insect-world 772, prehistoric-animal-museum 1,083; counter-evidence: other 3D toys got almost nothing. Expected: median 30–80; upside 500–1k; cultural accuracy must be sourced.
3. **A day-one bilingual extension for the next Chinese agent-platform launch** (standing option): DSH plugins with ≥ 10 stars reached ≥ 300 at 6.4 % and ≥ 1k at 2.1 % (control 4.0 % and 1.1 %). Cannot be built in advance; crowded within days.
4. **Guandan card-game web trainer with an explainable rule-based AI**: about 462 "guandan" repos, mostly reinforcement-learning competition code (11–127 stars), plus one 612-star RL agent. Expected: median 10–40; 40 hours is tight.
5. **GB/T 7714 citation checker and fixer** before thesis season: competitors at 0–3. Expected: median 5–20.

## 4. Base rates (small users, < 100 followers, repos created 2026-07-01..09-10)
Numerator: the census of ≥ 300-star winners; denominator: a full census of 8 sample days (4,455 repos with 10–299 stars) with follower counts and the same README-head CJK check, scaled to the window's tier totals. "Clean" excludes suspicious rows.

| Group | Est. repos with ≥ 10★ | → ≥ 300 (all / clean) | → ≥ 1k (all / clean) |
|---|---|---|---|
| Any CJK text | 11,846 | 3.49 % / **2.81 %** | 0.73 % / **0.61 %** |
| Chinese description | 5,983 | 3.74 % / 3.01 % | 0.75 % / 0.59 % |
| English control | 18,568 | 1.88 % / **1.56 %** | 0.34 % / **0.28 %** |
| All small users | 30,414 | 2.51 % / 2.04 % | 0.49 % / 0.41 % |

CJK lift: about 1.8× at ≥ 300 and 2.2× at ≥ 1k (the 1.5× in `smallwin.md` rested on descriptions only). **Correction to `smallwin.md`**: in the full day census, small users are 72.8 % of the 10–99 tier (not 64 %), so their rate to 300 is about 2.5 % (not 2.8 %).

Uncertainty: follower counts are today's; only `README.md` was read; eight sample days may not represent the window; Chinese two-character keyword searches tokenize loosely; linux.do posts could not be opened. Not checked: whether a new account can register on linux.do, and V2EX's rules on AI-written content. linux.do promotion posts must carry a public-benefit tag and declaration.

## Developer's reading
A Chinese launch roughly doubles the odds but is no shortcut: a typical V2EX post adds a handful of stars, and the curated weeklies feature repos that are already rising. The biggest Chinese wins rode platform waves (DSH, Codex skins) or authors' existing audiences. `channel-memo.md` is updated with these numbers.
