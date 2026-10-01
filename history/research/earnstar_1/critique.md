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
