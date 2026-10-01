# Independent critique of ADR-002 (draft) — objections and responses

_S018, 2026-10-01. A research subagent with no stake in the decision reviewed `history/decisions/ADR-002-project-1-selection.md` and the candidate files, argued against the draft, and checked claims against the data (read-only). Its verdict: reject #31. Every objection and the developer's response follow (Selection Gate, `playbook/research.md` §1.7)._

| # | Objection | Severity | Response |
|---|---|---|---|
| 1 | A direct competitor exists: [minorun365/claude-code-japanese-guard](https://github.com/minorun365/claude-code-japanese-guard), a Stop hook that reads `last_assistant_message` and asks for a Japanese rewrite, created 2026-09-25 by a developer with 260 followers; the English-only searches missed it | high | **Accepted and verified**: 36 stars on 2026-10-01 (22 in its first two days, 0 on each of the last two), owner followers 260. The "no existing tool" claim was wrong. Method fix: landscape searches must include the target users' languages (L-017, `research.md`). |
| 2 | The prediction (median 100) is not calibrated: the first mover, with a native audience and README and the hook at its peak, reached 36 | high | **Accepted**. A realistic median would be about 20–30. |
| 3 | A vendor fix is likely before launch: #96326's comments show the English share varies by CLI version (0–7 % on 2.1.280, 45 % on 2.1.281, 31.8 % on 2.1.282), which points to a patchable harness component; #28 was deprioritized for the same risk | high | **Accepted**. The screening was inconsistent: #28 (218 👍) was deprioritized for vendor-fix risk while #31 (15 👍) was not. |
| 4 | Demand is thin and partly misread: 2 repos hold 54 % of the English replies, 24 % of English replies follow an English user turn (likely wanted), the corpus is mostly Cursor with no Opus 5.5 or Claude Code replies, and no new reports since 2026-09-24 | high | **Accepted**. "20 of 37 repos" overstated the evidence. |
| 5 | DEV cannot reach the users; CJK cold starts ignite on in-language communities the program cannot post to; a non-English README is unapproved | high | **Accepted**, and confirmed by the launch-channel research below: the only dated breakout (fluent-korean) started with the author's own GeekNews post. Distribution should have scored 2, not 4. |
| 6 | The reference class does not fit: guides, translation packs, a legal skill, and an output style, from community members with native READMEs; the right class is September's Stop-hook repos (5, 6, and 36 stars) | med | **Accepted**. |
| 7 | A 60-line hook is unlikely to earn stars; four commenters already wrote drift counters; the Stop hook checks only the final reply while drift also appears in status notes, and the user still sees the English reply first | med | **Accepted**. |
| 8 | The ranking is within noise (0.10 spread vs 0.20 per scoring point); with corrected scores #31 falls to 3.20, below #23 and #30; it was conceived, deep-dived, and ranked first in one session | med | **Accepted**. The Gate's later-session reflection exists for exactly this reason. |
| 9 | "CJK first" no longer fits: Japanese is taken, Korean has few transcripts | low | **Accepted**. |
| 10 | The Gate is far from met | low | **Accepted**; the draft ADR is withdrawn rather than carried forward. |

**Outcome**: ADR-002's proposed decision is withdrawn in S018. #31 is knocked out. The selection is rerun in the next session among #30, #23 (as a habit to be found or as the meter), and any stronger new candidate, scored with the same standards used to reject #7 and #28.

## Related research: how language-community tools launched (subagent, S018)
| Repo | Channels found | Matches the peak? | Confidence |
|---|---|---|---|
| snflkd/fluent-korean | The author's own GeekNews post on 2026-08-18 (25 points, [news.hada.io/topic?id=32613](https://news.hada.io/topic?id=32613)), then a third-party X post on 2026-08-20 | Yes: 7 stars in 30 days, then 211 on the X post's day | High |
| kimlawtech/korean-privacy-terms | Picked up the day it was created by NomaDamas/k-skill (about 7.7k stars), [issue #144](https://github.com/NomaDamas/k-skill/issues/144) | Week 1 plausible; the August spike unexplained | Medium |
| LifeActor/Claude_zh-CN_LanguagePack | A linux.do lineage stated in its README | No peak given | Medium |
| lhfer/claude-howto-zh-cn | None found; the upstream luongnv89/claude-howto gained about 26k stars in April 2026, likely lifting the translation | Not verified | Low |
| taekchef/claude-code-zh-cn | None found | Not found | Low |

Conclusions: the channels that carry these tools are local and in the target language (GeekNews and X for Korean, linux.do for Chinese, in-language collections such as k-skill); none of the five used HN, Reddit, or any English channel; nothing observed is reachable through an English DEV account; the working routes would be third-party, non-English posts, which need the owner's approval (Constitution §3B).

# Independent critique of ADR-003 (draft, #39) — objections and responses

_S021, 2026-10-02. A research subagent with no stake in the decision reviewed `history/decisions/ADR-003-project-1-selection.md` and its evidence, searched for missed competitors in English, Chinese, and Japanese, and re-checked numbers (scratch scripts kept outside the repo). Verdict: "accept with changes, on conditions". The developer re-ran the two decisive checks (rows 1 and 4) before responding._

| # | Objection | Severity | Response |
|---|---|---|---|
| 1 | The status-line reference class is misread: its 6.4 % to 1k comes from Claude Code's 2025 boom and has no same-period control (`research.md` §4); in 2026 the status-line niche converts far worse | high | **Accepted and verified**: `tools/basecount.mjs 'topic:claude-code created:2025-08-07..2025-08-28'` gives 274 repos, 49 ≥ 100 (17.9 %), 14 ≥ 1k (5.1 %), the same as the status-line window (17 %, 6.4 %), so the "status-line effect" disappears under the control. `'statusline claude created:2026-03-01..2026-06-30'`: 1,607 repos, 12 ≥ 100, 2 ≥ 1k (0.12 %), against 0.59 % for the 2026 `topic:claude-code` control (critic). The "6.4 % vs 0.43 %" argument is withdrawn. |
| 2 | The prediction is over-optimistic: at days 55–85 the reference class's median is about 5 stars; only 8 of 47 reached 85 | high | **Accepted**. A realistic median is about 20 (50 % interval 6–70; 90 % interval 0–600). |
| 3 | ccstatusline did not win by launch timing: about 1.7k after three months; most stars came after the docs started linking it (between 2026-01-04 and 2026-02-06, Wayback) and during Claude Code's own peak (March–April 2026); its monthly stars fell 78 % since | high | **Accepted** (the docs-link timing is the critic's Wayback check, not re-verified). A docs link is luck the program cannot reproduce; demand should be scored from trends, not totals. |
| 4 | Native settings already cover much of the transcript MVP: `viewMode: "focus"` (a one-line summary of tool calls with diffstats), the turn line's "done" clock, `showTurnDuration`, `timeFormat`/`timeZone`; #21151 was partly fixed in February; VS Code got per-message timestamps on 2026-09-28, so CLI timestamps are a live vendor-fix risk. S021's own "check each issue on the current release" was applied to #35 but not to #39 | high | **Accepted and verified** in the settings reference (`viewMode`, `showTurnDuration`, `timeFormat`). candidate-39 §3's "the CLI does not have timestamps" was partly wrong. |
| 5 | Inconsistent scoring: #39 merges two deprioritized ideas (#36, #35's transcript items) into the top score; distribution counted channels not usable now (B-class lists, a directory that does not accept mods yet, a stale third-party directory); sustainability ignored a one-day-old render API. Rescore 3.15–3.30, a tie with #34 and #35 | med-high | **Accepted**. Rescored below. |
| 6 | The landscape misses near-identical entrants, all tiny (KilimcininKorOglu/claude-code-mods with 58 mods including timestamps and a usage band; AJclemendor/my-mods; aleslanger/claude-code-statusline-designer with 22 themes and live preview; FEIF-L/claude-code-theme-editor; dracula/claude-code-cli; ccstatusline-nocturne; chronoclaude); no mods work in ccstatusline or tweakcc | med | **Accepted**; added to the landscape by reference here. Together with claude-hud (found by the developer during the critique window, `candidate-39.md` §10), the space is filling at 0–12 stars, on top of two large status-line incumbents. |
| 7 | The desktop app is the only differentiator a status-line tool cannot copy, and it is unverified; the desktop app already shows plan usage natively (#41456, comment of 2026-09-29) | med | **Accepted**. A desktop render check becomes a hard condition for any desktop-based variant. |
| 8 | The process repeats ADR-002's failure: conceived 06:38, spiked 06:40–06:50, drafted 07:10 | med | **Accepted**. The later-session reflection stays mandatory, and the selection is reopened rather than confirmed in this form. |
| 9 | npm downloads do not count users (ccstatusline 409,745 in July, 93,600 in August, 183,793 in September) | low | **Accepted**; star trends are used instead. |
| 10 | Install and trust friction is understated (marketplace add, install, reload; mods run with the user's permissions; admins can block them) | low | **Accepted**; time-to-wow 4. |

**Rescore of #39** (critic's, accepted): demand 3, differentiation 3, time-to-wow 4, feasibility 4, distribution 2, sustainability 3 = **3.15**, tied with #35 (3.15) and #34 (3.30) within noise.

**Critic's best variant**: "your status line, everywhere": a band mod that draws the output of the user's existing status-line command (ccstatusline, claude-hud, powerline) in the band and in the desktop Code tab, plus a live configurator; 15–25 hours; it builds on incumbents' installed base instead of competing (L-025's bridge pattern). Risks: process calls, unverified desktop drawing, and a native desktop status bar (#41456).

**Outcome**: ADR-003's draft is not confirmed. Its quantitative case was wrong in direction and size. The selection stays open in S021: the next step is a study of the reference class that matches the program (small owners, 2026, all topics), then a rescore of every candidate against it, including the bridge variant.
