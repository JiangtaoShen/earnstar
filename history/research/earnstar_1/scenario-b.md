# Scenario (b): Show HN as a launch channel (S021)

_2026-10-02. Research subagent (read-only), checked and condensed by the developer; prepared in case the owner allows owner-written posts such as one Show HN per launch (`channel-memo.md`; HN requires the poster's own words, L-001). Scripts and data: `lab/earnstar_1/s021/scen_b/` (git-ignored)._

## 1. Base rates (Show HN, 2026-06-01..09-25)
HN Algolia `search_by_date?tags=show_hn`, sliced by day: 14,508 stories, **5,126 linking a github.com repo**.

| Points ≥ | 2 | 5 | 10 | 20 | 50 | 100 | 200 | 300 | 500 |
|---|---|---|---|---|---|---|---|---|---|
| GitHub-linked share | 76 % | 20.4 % | 9.3 % | 5.6 % | **3.2 %** (163) | **1.46 %** (75) | 0.47 % | **0.20 %** (10) | 0.08 % |

- **Front page**: 11 of 14 Show HNs with 20–29 points appeared on past front pages (8 sample days, pages 1–4), so P(touching the front page) ≈ 5–6 %; P(≥ 100 points) ≈ 1.5 %. September looked weaker (8 of 1,026 at ≥ 100, 0.78 %; one partial month).
- **Reposts**: 331 repos were posted more than once; later attempts reached 50 points 2.4 % and 100 points 0.4 % of the time (e.g., carloslfu/slotstream 3 → 240 points). The HN FAQ allows "a small number of reposts".

**Stars by points tier** (star-history endpoint; week 1 = 7 days from the post):

| Tier | All repos: stars now (median) / week-1 median | Small-owner new repos (user < 100 followers, created ≤ 30 days before): stars now, median (IQR) |
|---|---|---|
| ≥ 100 points (all 75) | 470 (p90 4,368) / 329 | **231 (152–470)**, n 19; max 1,127 (gander) |
| 50–99 (sample 30) | 136 / 120 | 136 (41–402), n 12 |
| 20–49 (30) | 83 / 46 | 72, n 9 |
| 10–19 (29) | 28 / 14 | 22, n 10 |
| 5–9 (30) | 13 / 5 | 9, n 14 |
| 1–4 (30) | 5 / 3 | 4, n 14 |

Of 35 small-owner users who reached 100 points, 3 now have ≥ 1k stars (fugleramme 3,498; lathe 1,679; gander 1,127). An arXiv paper (2511.04453) reports a mean of +289 stars in the week after HN exposure for 138 AI-tool repos.

**Expected result of one Show HN by a small owner** (weighting the tiers): median about **3 stars**, mean about **12**; P(≥ 100 stars within 30 days) ≈ **2.8 %**; P(≥ 500) ≈ 0.7 %; no new small-owner repo in the sample reached 1,000 within 30 days.

## 2. What lands
Categories of the 75 posts with ≥ 100 points: non-AI developer tools, languages, databases, systems 22; AI coding-agent tools 12; other AI apps or infrastructure 11; consumer and utility apps 11; local or efficient AI on consumer hardware 9; hardware and maker 5; games, retro, history 5.

| Title feature | Posts | Reached 100 | Lift vs 1.46 % |
|---|---|---|---|
| Local LLM on small hardware | 20 | 4 | 13.7× (small sample; the whole local-LLM lane, 275 Show HNs in March–September 2026, reached 100 points at 2.55 % vs 1.70 % overall, about 1.5×: `ideas.md` #45) |
| "Without AI" / "no LLM" | 13 | 2 | 10.5× |
| Single binary | 28 | 2 | 4.9× |
| First person ("I built…") | 135 | 9 | 4.6× |
| Measurable claim (×, %, GB, tok/s) | 180 | 9 | 3.4× |
| "Alternative to" | 77 | 3 | 2.7× |
| Agent, Claude, Codex, Cursor, or MCP | 1,598 | 15 | **0.64×** |
| MCP | 190 | **0** | 0 |
| Skill(s) | 138 | **0** | 0 |
| "Windows" (all Show HN) | 113 | **0** | 0 |

Small-n lifts are confounded. Ready-to-try features barely separate landed posts from the rest (one-line install 50 of 75 landed vs 63 of 89 below; media near the top 51/75 vs 63/89; a live-demo link 33 % vs about 20 %), matching L-008.

**AI-built projects can land, but the reception is hostile**: root agent files appear in 40 % of landed repos (37–47 % of controls); examples of disclosed AI-built posts at 161–312 points; but 36 of the 75 landed threads contain remarks about vibe-coding, slop, or AI-written READMEs (23 of 60 controls; crude regex); "Ask HN: Add flag for AI-generated articles" got 1,102 points. **The Show HN rules now say "The project should be non-trivial. Don't post quickly-generated one-offs"** (news.ycombinator.com/showhn.html), so the owner would have to genuinely use the project and explain it in their own words.

## 3. Candidates (subagent's judgement from §1)
| # | Candidate | Competitors (0–9 tier opened) | Evidence | P(≥ 100 points) | Stars at close: median (90 % interval) |
|---|---|---|---|---|---|
| 1 | **Local coding model, tested on your own repo**: replay recent commits and tests with local models through llama.cpp; report pass rate and tok/s on your GPU (hook: measured on a 6 GB GTX 1660 Ti) | AlexsJones/llmfit 37,419 (checks fit, not task success); four tiny entrants (1–6) | "Ask HN: replaced Claude/GPT with a local model for daily coding?" 1,318 points; canirun.ai 1,520; lane precedents 312–937 points | 3–5 % | 8 (0–600) |
| 2 | **Show HN outcome explorer** (open dataset, daily by Actions) | three tiny entrants | HN-meta Show HNs: 9 of 129 reached 100 points; star tools get 2–8 points | 4–7 % | 5 (0–300); risk of the "reading material" exclusion |
| 3 | **Skill-atrophy check for agent users** | ashutosh-rath02/atrophy 133 and tiny entrants | lathe (402 points; 1,679 stars from a 30-follower owner) | 2–4 % | 6 (0–400); "many tried, none rose" |
| 4 | **Bad-redaction checker in the browser** | freelawproject/x-ray 829; the same product at 2 (2026-09-18) | x-ray 709 points during a news event; 2–12 points without news | 1–2 % | 3 (0–300) |
| 5 | **llama.cpp speed tuner for small GPUs** | llama.cpp's built-in `--fit` | Same lane as #1 | 1–2 % | 3 (0–150) |

Knocked out after checks: MoE expert streaming (JustVugg/colibri 38,876), local video search (ssrajadh/sentrysearch 4,526), duplication meter for AI code (rafal-qa/slopo 812), ExifTool in the browser (3 points), old-GPU fine-tuning (Soup 7,970), HN title predictor (done in 2019).

## 4. Without a landing
About 80 % of GitHub Show HNs get 1–4 points; small-owner new repos in that tier have a median of 4 stars, the same as no post. HN's value is the upper tail, not the median. Structural risks: AI-built disclosure draws "slop" remarks; the rule against quickly generated one-offs; the owner's HN account history is unknown; Windows-specific tools had zero landings, so a product must be cross-platform and its README written plainly.

## Uncertainty
Algolia may omit dead or flagged posts; the front-page proxy rests on 8 days; "stars now" includes non-HN sources; follower counts are today's; tier samples are small (n 9–19 for small owners); categories and the AI-remark regex are crude; candidate odds are judgement.

## Developer's reading
A Show HN is a lottery ticket with a real upper tail (about 3 % chance of ≥ 100 stars for a small owner) and a median indistinguishable from no post. It suits the program only for a substantial project the owner genuinely uses, and it would face open hostility to AI-built work. The local-model lane looked like the highest-lift lane, but measured over the whole lane its lift is about 1.5×, and its best idea for this machine (#45) turned out crowded (`ideas.md` #45).
