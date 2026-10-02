# Channel policy: evidence for the owner's decision (S021 update)

_2026-10-02. Updates the question raised in S018 (STATE, "Awaiting owner") with S021's evidence. The decision is the owner's (S013 set DEV as the only social channel); this memo only lays out what the data says._

## What S021 found
1. **Three candidates fell for the same reason.** #39 (an interface customizer on Claude Code's new mods), #40 (an image editor for agents), and #35 (a fix pack) each looked strong on the features of past winners, and each was rejected by an independent critique: when checked, the winners' stars came from ignition the program cannot see or create, not from features we can copy. The clearest case: the author of kajisho5/ffmpeg-skill (944 stars in week 1) shipped the identical recipe for images three days later, and it has 1 star (L-027).
2. **How audience-less repos win in 2026** (`smallwin.md`, repos created July–September 2026 by owners with < 100 followers, 866 winners with ≥ 300 stars): 64 % ignited in a spike whose source GitHub data cannot show (posts on X, Xiaohongshu, WeChat, or GitHub Trending after a seed), 20 % grew slowly (mostly substantial daily-use software or company-backed projects), 12 % rode a news hook, 3 % came from HN. 35 % have a CJK description, against 20 % in the lower tiers (lift about 1.5×); 55 % of the small-owner skill winners are CJK.
3. **DEV does not ignite**: a DEV article brings a median of about 1 star in its first week (L-010); recent #claudecode articles get 0–2 reactions (S021 check). No winner in the study showed DEV as its source.
4. **HN turns dormant repos into winners** when it lands: AminBlg/SimpleEnglish (14 stars in week 1, then HN 363 points, now 3,630), arnegiacomo/fugleramme (1 star in week 1, HN 2,391 points on day 59, now 3,497), devdotfast/whiteboard (HN 423, 2,534), mokshablr/gander (4 in week 1, HN 211, 1,127), clawkwork/clawk (4 in week 1, HN 226, 1,023); ninjahawk/livenerf (HN 894, 744 stars in two days; S018). HN requires the poster's own words (L-001).

## Expected outcome by scenario (judgement from the evidence above)
| Scenario | What it allows | Expected stars per project at close |
|---|---|---|
| (a) DEV only (current) | DEV articles, GitHub search and topics, lists through the outbox | Median in single digits to tens; the critiques' calibrated medians for S021's candidates were 4–20 |
| (b) The owner posts selected launches in their own words (e.g., a Show HN, a Reddit or X post), with material prepared by the developer through the outbox | One or two posts per launch | A real chance of hundreds to thousands when a post lands; most posts do not land, so the median stays modest, but the upper tail opens |
| (c) A Chinese README and the owner's posts in Chinese communities (V2EX, linux.do, Juejin), and Chinese curated weeklies (ruanyf/weekly, HelloGitHub) by self-recommendation | Bilingual projects; one or two community posts per launch | About twice the odds of the English control (small-owner repos with ≥ 10 stars reach 1,000 at 0.61 % vs 0.28 %; `scenario-c.md` §4), but no shortcut: repos launched with a V2EX "share creation" post have a median of 8 stars, gain a median of +3 in the three days after the post, and reach ≥ 300 in 5.2 % of cases; the weeklies mostly feature repos already rising |

**Calibration added later in S021** (`scenario-c.md`): the Chinese channel roughly doubles the odds rather than transforming them, and an HN base rate for Show HN posts is being measured (scenario b); the recommendation below stands, with expectations kept modest in every scenario.

## Developer's recommendation
Allow **(c), and (b) for launches that fit HN** (something people can try, per HN's rules), limited to one or two posts per launch, written or rewritten by the owner, with AI authorship disclosed in the project and no vote or star solicitation (Constitution §3C). Under (a) alone, the program should expect small numbers and judge projects by learning value. Each post would still go through the outbox (B-class), and the developer would prepare the material.

## What changes with the answer
- Under (a): prefer substantial daily-use tools that grow through search (the 20 % slow path) and accept small numbers.
- Under (b): prefer something people can try in a minute, with a measurable claim (HN-friendly).
- Under (c): add Chinese-language candidates (search in Chinese, L-017) and a bilingual README; workflow skills from small owners in the Chinese community regularly reach hundreds to thousands (S018, `ideas.md`).
