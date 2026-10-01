# Candidate #31 — reply-language lock for coding agents (deep dive, in progress)

_Started in S018 (2026-10-01). Stage 4 of `playbook/research.md`._

**One line**: keep every user-facing reply of a coding agent in the user's language. A Stop hook detects the language of the final reply and, on a mismatch, blocks and asks for a rewrite in the configured language; a report command measures drift in local transcripts. Deterministic (script and language detection, no model calls); works today with classic hooks in Claude Code, later as a mod, and where possible in other agents.

## 1. Demand (≥ 3 signals)
1. anthropics/claude-code [#96326](https://github.com/anthropics/claude-code/issues/96326) (12 👍, 9 comments, 2026-09-23): with Opus 5.5, a Japanese user's replies drift into English after English tool output (specs, subagent reports, code review), despite `~/.claude/CLAUDE.md` and the session language setting; corrections hold for one turn.
2. [#96601](https://github.com/anthropics/claude-code/issues/96601) (2026-09-24): a Traditional Chinese user counted assistant text blocks in 147 local transcripts: English replies 0.4 % on Opus 5 vs 4.2 % on Opus 5.5.
3. Earlier, independent reports: Spanish [#21871](https://github.com/anthropics/claude-code/issues/21871), a CLAUDE.md language rule [#64166](https://github.com/anthropics/claude-code/issues/64166), the language setting during auto-accept [#32107](https://github.com/anthropics/claude-code/issues/32107), and the reverse, English sessions drifting into Chinese, Korean, or Russian ([#82264](https://github.com/anthropics/claude-code/issues/82264), [#96046](https://github.com/anthropics/claude-code/issues/96046), [#12553](https://github.com/anthropics/claude-code/issues/12553)).
4. Public transcripts (spike, §5): in repos whose user writes Chinese, Japanese, or Korean, 20 of 37 had at least one English agent reply, and 12 of 37 had ≥ 10 % English replies.

Caveat: issue reactions are low; non-English users file and upvote fewer GitHub issues, and some English replies are wanted.

## 2. Landscape (≥ 10 repos)
No tool that enforces reply language was found by English-only GitHub searches on 2026-10-01; this was wrong (see §9). Adjacent tools for language communities and plain-language output (stars on 2026-10-01; owner followers today):

| Repo | Stars | Created | Owner followers | What |
|---|---|---|---|---|
| op7418/Humanizer-zh | 18,790 | 2026-01-18 | 5,017 | Chinese version of the humanizer skill |
| lhfer/claude-howto-zh-cn | 2,303 | 2026-03-30 | 17 | Chinese Claude Code guide |
| snflkd/fluent-korean | 1,357 | 2026-07-10 | 9 | Output style for clear Korean replies |
| taekchef/claude-code-zh-cn | 771 | 2026-04-02 | 8 | Chinese localization helper for the CLI |
| kimlawtech/korean-privacy-terms | 586 | 2026-04-18 | 70 | Korean legal documents via Claude Code |
| djfksjd/ir-search | 381 | 2026-07-11 | – | Korean research skill for several agents |
| fivetaku/cc101 | 301 | 2026-02-24 | 405 | Korean beginner guide |
| LifeActor/Claude_zh-CN_LanguagePack | 211 | 2026-05-19 | 8 | Chinese UI language pack |
| codyhxyz/high-agency-mode | 0 | 2026-04-24 | – | A Stop hook that rewrites low-agency phrasing (same mechanism, different purpose) |
| byunghun-ben/claude-plain-language | 0 | 2026-08-13 | – | Language-adaptive output style |
| Sports-Ai-Science/ai-pair-language-qcd-study | 0 | 2026-05-14 | – | Study of output language (English vs Japanese) |

Vendor coverage: Claude Code has a session language setting and output styles; #96326 shows both fail after English tool output on Opus 5.5.

## 3. Case studies (≥ 5): language-community tools from small-audience owners
GitHub star history, 2026-10-01:

| Repo | Owner followers | Week 1 | First 30 days | Peak day | Total |
|---|---|---|---|---|---|
| lhfer/claude-howto-zh-cn | 17 | 392 | 949 | 79 (2026-04-04) | 2,303 |
| snflkd/fluent-korean | 9 | 3 | 7 | 211 (2026-08-20) | 1,357 |
| taekchef/claude-code-zh-cn | 8 | 10 | 95 | 28 (2026-04-13) | 771 |
| kimlawtech/korean-privacy-terms | 70 | 208 | 235 | 105 (2026-08-04) | 586 |
| LifeActor/Claude_zh-CN_LanguagePack | 8 | 47 | 114 | 15 (2026-05-23) | 211 |
| op7418/Humanizer-zh (large owner, for contrast) | 5,017 | 1,334 | 2,884 | 409 (2026-01-19) | 18,790 |

**Reading**: tools made for one language community, by owners with almost no audience, reached 200–2,300 stars, with a median of about 770 among the five small-owner cases. That is far above the general cold-start rate (about 0.7 % of repos with ≥ 10 stars reach 1,000, L-005), although these cases are survivors and their launch channels were not traced.

## 4. Differentiation (draft)
"Why this over a CLAUDE.md rule, the language setting, or fluent-korean?" — _Rules and settings ask; this checks every reply and makes the agent rewrite the ones in the wrong language, for any language, and shows the drift rate before and after._ fluent-korean improves Korean style but does not enforce the language; no tool enforces it.

## 5. Feasibility spike (S018, `langdrift.mjs`, no owner quota used)
- **Detector**: script share (CJK characters among CJK plus Latin letters, after removing code, inline code, URLs, and file paths) separates Chinese, Japanese, and Korean replies from English ones in public transcripts. Languages that share the Latin script (Spanish, German, Portuguese) need a word-based detector; to do.
- **Prevalence**: 1,874 public SpecStory transcripts found by CJK search terms; 866 have a user writing mostly in CJK. Among the 37 repos with ≥ 5 agent replies of ≥ 30 letters: 1,621 replies, 289 English (17.8 % pooled); per-repo English share median 2 %, p75 12 %, p90 38 %. By model, where ≥ 60 replies: GPT-5.3 11.6 %, GPT-5.4 8.6 %, GPT-5.5 8.5 %, Claude Opus 4.6 8.3 %, GPT-4.1 0 %, Cursor's default 19.9 %. Small samples; some English replies may have been requested.
- **Mechanism (confirmed in the docs)**: the Stop hook input includes `last_assistant_message` ("the final assistant message text from the current turn"), so no transcript parsing is needed; exit code 2 with a reason on stderr, or `decision: "block"`, makes Claude continue with the reason as a system reminder; `SubagentStop` works the same way ([hooks docs](https://code.claude.com/docs/en/hooks)). The docs describe no built-in loop guard, so the hook caps its own retries.
- **Prototype** (throwaway, `lab/spike/langlock/hook.mjs`, about 60 lines, Node, no dependencies): on 7 simulated Stop inputs it allowed Japanese, Chinese, and English replies in the configured language, allowed short replies and replies whose English is only in code blocks, and blocked the English line quoted in #96326 ("All gates pass. Now for the pre-commit review.") for a Japanese user and a Chinese reply for an English user. The retry cap blocked twice and then allowed the stop. Design fix found: after giving up, the counter never resets in that session, so the cap must be per turn (e.g., keyed by the transcript's user-message count).
- **Other agents**: Codex has a Stop hook whose request carries `last_assistant_message`, `stop_hook_active`, and a `turn_id`, and it can block with a reason ([stop.rs](https://github.com/openai/codex/blob/main/codex-rs/hooks/src/events/stop.rs)); Gemini CLI's `AfterAgent` hook receives `prompt_response` and can "reject the response and force a retry" with `decision: "deny"` or exit code 2 ([hooks reference](https://github.com/google-gemini/gemini-cli/blob/main/docs/hooks/reference.md)). One small hook can therefore serve Claude Code, Codex, and Gemini CLI; OpenCode (plugins) is not yet checked.
- **Which languages first**: GitHub code search on 2026-10-01 finds far more public transcripts from CJK users than from other non-English users: Simplified Chinese 1,652, Japanese 699, Traditional Chinese 255, Korean 10, versus Spanish ("por favor") 78, German ("bitte") 52, Portuguese ("obrigado") 2. CJK first; Latin-script languages need a word-based detector later.
- **Still open**: an end-to-end run in a real session (needs the owner to sign in the CLI), a word-based detector for Latin-script languages, and Windows path handling in the hook command.

## 6. Distribution plan (draft)
- **Communities**: the audiences are Chinese, Japanese, and Korean developers (and others). A README in their languages would need the owner's approval (Constitution §3B); without it, the English README must still be clear to them, with screenshots of before/after replies.
- **DEV article**: the measurement itself, e.g., how often agents answer non-English users in English, by model, and how a deterministic check fixes it (#ai, #agents, #programming).
- **Search and topics**: `claude-code`, `codex`, `hooks`, `i18n`, `localization`, `japanese`, `chinese`, `korean`.
- **Awesome lists** (follow-on, L-009): VoltAgent/awesome-agent-skills after adoption; hesreallyhim/awesome-claude-code via the owner after ≥ 14 days or 100 stars.
- **Amplifier readiness**: a side-by-side screenshot (drifted English reply vs locked reply) that works in any language's social feed.

## 7. Name candidates (S018; decided at the start of P2, research.md §9)
All free on npm (registry 404 on 2026-10-01); GitHub repos with the same name: `langlock` 18, `keeplang` 2, `replylang` 0, `tonguelock` 0. None may contain "Claude" (L-013).

## 8. Risks
- A model or harness fix could reduce the drift (#96601 asks whether the regression is in the harness); the lock still helps across agents and for the reverse drift.
- Demand evidence is thin in reaction counts.
- Rewrites cost tokens; the hook must trigger only on clear mismatches (short replies and code-only replies excluded).

## 9. Outcome (S018): knocked out
The independent critique (`critique.md`) found a same-product competitor missed by English-only searches: [minorun365/claude-code-japanese-guard](https://github.com/minorun365/claude-code-japanese-guard) (Stop hook, `last_assistant_message`, one-line install; created 2026-09-25; owner followers 260; 36 stars on 2026-10-01 and fading). With a native audience, first-mover timing, and the hook at its peak, it reached 36 stars. Together with a likely vendor fix, thin and concentrated demand, and no reachable channel, #31 is knocked out. Its measurement scripts remain useful evidence for #23 and #24.
