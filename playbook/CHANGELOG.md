# Playbook, templates, and tools changelog

Newest first. Each entry gives the date, session, change, reason, and evidence.

- **2026-10-02 · S021**: `workstation.md` §4: pitfalls on log times (read the clock before each entry) and on slash commands passed from Git Bash (path conversion turns them into prompts) and on headless runs inheriting this repo's `CLAUDE.md`. Reason: one unintended model run during the mods spike. New `tools/wave.mjs`: snapshots of every repo matching a search, saved under `history/research/waves/`, with the gainers since the previous snapshot; it masks CJK runs in descriptions so snapshots pass `tools/check.mjs`. Reason: the Mods launch must be measured over several sessions without a star-history call per repo. `lessons.md`: L-025 (small owners at Claude Code's platform launches win late, not in launch week). `research.md` §4: reference classes from the last 6 months with their own same-period control, a check of each need against the current release's native settings, and category searches in the users' own words; `lessons.md` L-026. `lessons.md` L-027 (a winner's visible recipe is not its cause; open the bottom tier of a reference class; check winners' authors' follow-ups; choose class members in advance). `lessons.md` L-028 (measured base rates of Show HN and V2EX launches for small owners; outcomes are tail-driven). New `templates/project/`: a project starter with the community, supply-chain, and README items of Constitution §7, referenced from `launch.md`; reason: shorten P2 setup once the Gate passes, whichever project is chosen. New `tools/crowding.mjs`: a crowding check for one idea (several short searches in users' words, merged; entrant count, star distribution, top entrants, and a sample of the 0–9-star tier), so no niche is called empty without opening its bottom tier (L-027). Reason: S021's candidates #40 and #45 each had 20–40 tiny entrants that platform-term searches missed. Reason: the S021 critique of draft ADR-003 found a 2025 reference class that vanished under its control, MVP items that were already native, and a 28k-star incumbent missed by platform-term searches. Evidence: S021 log §3 and §8, `history/research/earnstar_1/launch-forms.md`.

- **2026-10-02 · S020**: `defaults.md`: a session without a duration runs until the owner says stop (with early close only when no useful work remains or a usage limit stops work); a given duration stays a minimum. Session template: "Length rule" and "Close reason" rows. Reason: the owner's decision ("Approve A" [translated]) after noting that sessions stopped right at 2 h; the Constitution §4 was amended in the same session. Evidence: S020.

- **2026-10-02 · S019**: `workstation.md` §5: the measured context cost of a headless run and an environment-control rule. Reason: the first signed-in smoke test. Evidence: S019.

- **2026-10-01 · S018**: New `tools/starhist.mjs` (star-history summaries for case studies) and `tools/basecount.mjs` (base rates by star threshold, counting the misses); both replace repeated ad hoc scripts. `research.md` §4: rules for applying knock-outs and scores consistently (from the S018 critique). `workstation.md` §4: pitfall on backticks inside double-quoted shell strings. `research.md` §1.4: landscape searches include the target users' languages (L-017). `research.md` §1.2: scan repos created in the last 90 days (L-020). `lessons.md`: L-017 to L-024, H-009; `launch.md`: a passive-discovery channel section; also L-014 (late copies of known skill concepts earn nothing), L-015 (keyword mining of user messages cannot rank habits), L-016 (the official plugin directory is a company channel), H-008 (platform launches create search demand). Evidence: S018, `history/research/earnstar_1/corrections.mjs`.

- **2026-09-25 · S017**: `workstation.md` §5 (new): limits for headless Claude Code evaluations on the owner's subscription. Reason: the owner approved small-scale runs ("Yes, small-scale headless evaluations are allowed" [translated]). Evidence: S017.

- **2026-09-25 · S016**:
  - `research.md` sources: GitHub's star-history endpoint replaces stargazer lists for other people's repos.
  - `lessons.md`: L-004 to L-013 from the foundational study and the first spike; H-003, H-004, H-005, and H-007 annotated.
  - `workstation.md`: pitfall on escapes in scripted source edits.
  - `research.md` §9: no Claude, Claude Code, or Anthropic names in project names (L-013).
  - `launch.md`: awesome lists are follow-on channels that often need prior traction, and some accept only human submissions (L-009).
  - Reason: GitHub restricted stargazer data (changelog 2026-06-30) and shipped `GET /repos/{owner}/{repo}/stargazers/history` (changelog 2026-09-04); the foundational study's results. Evidence: S016, `history/research/foundation.md`.

- **2026-09-25 · S015**:
  - `defaults.md`: the session length is a 2 h minimum with no fixed cap, and close-out comes after the minimum.
  - Session template row renamed to "Minimum".
  - `research.md`: emoji replaced by plain English, with a search qualifier.
  - Reason: owner decision on session length, and the English audit. Evidence: S015.

- **2026-09-24 · S013**: DEV-only promotion.
  - `launch.md` rewritten: channels are DEV and awesome lists; DEV packages and their workflow; HN, Reddit, and the screenshot flow removed.
  - `research.md`: distribution plan and scoring based on DEV; HN kept as a reading-only research source.
  - `defaults.md`: HN/Reddit rows removed; the DEV cap raised to 3 per project.
  - `lessons.md`: HN/Reddit hypotheses retired.
  - `metrics.mjs`: HN and Reddit branches removed; `tools/evidence.mjs` deleted; `inbox/` ignore rule removed.
  - Reason: owner decision ("Delete the other two promotion methods. Only consider DEV." [translated]). Evidence: S013.

- **2026-09-24 · S012**: The DEV channel.
  - New `tools/devto.mjs`: `whoami`, `stats`, and `post` with guards (the outbox item must be approved; content check; AI disclosure; at most 4 tags; `--validate`). The key is read from the user environment without a restart and is never printed.
  - `metrics.mjs` snapshots DEV items; `check.mjs` gains `--file`.
  - `launch.md` gains the DEV rules and the DEV package format; `lessons.md` gains L-003 and H-007; `defaults.md` gains the DEV article cap.
  - Reason: the owner registered a DEV account and asked how to use the API. Evidence: S012 scratch tests (each guard refused as expected; public DEV stats fetched; a cached 404 on a brand-new article diagnosed as a CDN artifact).

- **2026-09-24 · S011**: Fixes from an end-to-end simulation (findings F1–F15 in the S011 log).
  - **`usage.mjs`**: ledger lines are pure ASCII, with JSON escapes. A Chinese research query had made the append-only ledger fail the content check, which would have blocked every commit.
  - **`evidence.mjs`**: archived files are named by time and hash, because localized screenshot names broke the check.
  - **`hours.mjs`**:
    - timeline with month-end clamping, which replaces a month-overflow calculation;
    - a closed project stops accruing expected hours at the `closed` date in `repos.json`;
    - hours per phase;
    - the shortfall flag only after 14 days.
  - **`metrics.mjs`**: Reddit rows use the owner's latest reading instead of a request that always failed.
  - **`check.mjs`**: silent on success in hook mode.
  - **`defaults.md`**: research floor of ≥ 2 sessions (was 3); the note on measuring continuous research.
  - **`launch.md`**: channel metrics; **`research.md`**: remote and registry update after a rename.
  - Reason: the owner asked for a simulation. Evidence: S011.

- **2026-09-24 · S010**: Monthly work-hour tracking.
  - New `tools/hours.mjs`: month and project totals from the ledger, pro-rated targets, the shortfall flag, and `--write-state`.
  - `defaults.md` gains the 60 h/month target and the 60 % shortfall threshold.
  - The session template gains a month-to-date row; the report template gains hours vs. expected.
  - Reason: owner decision to add a 60 h/month target, because the calendar-based timeline had no protection against under-investment. Evidence: S010, including a synthetic-ledger test (partial-month pro-rating, month attribution in Asia/Shanghai, gap/admin exclusion, shortfall flag).

- **2026-09-24 · S009**: The promotion-package workflow.
  - `launch.md`: package structure (HN fact sheet with no prose; Reddit draft plus images), image rules, and the after-posting steps.
  - New `tools/evidence.mjs`: owner screenshots are stored privately and their hashes are recorded in `channels.json`.
  - `channels.json` gains the fields `promo`, `evidence`, and `owner_reported`.
  - Added `history/promo/README.md`; `inbox/` is git-ignored; the outbox links packages.
  - Reason: the owner will post on both venues and return screenshots as proof. Evidence: S009, including a scratch test of `evidence.mjs` (archive, duplicate skip, unknown-item refusal, BOM-prefixed JSON).

- **2026-09-24 · S008**: Full audit.
  - **`tools/check.mjs`**: blocks Chinese text, secret-like strings, and the owner's emails (matched by hash); installed as pre-commit and commit-msg hooks.
  - **`tools/machine.mjs`**:
    - ID scheme v2 hashes language-independent fields only; the OS name now comes from the registry (English).
    - Records the OS patch level.
    - The new ID `m-be80e7832908` supersedes `m-6da16b4278d0`.
  - **Code-point logic instead of backslash-u escapes** in `check.mjs`, `machine.mjs`, and `metrics.mjs`. The tooling had silently turned the escapes into literal characters.
  - **`launch.md`**: HN rules verified with quotes (the owner writes all HN text; lists are not eligible for Show HN). Reddit marked unreachable, with owner-reported metrics. The timing heuristic is labeled unverified (H-006).
  - **`research.md`**: the Reddit source note; the list archetype caveat; subreddit rule checks go through the owner.
  - **`lessons.md`**: L-001, L-002, H-006.
  - **`workstation.md`**: tooling pitfalls.
  - Reason: the owner's audit request and the rule "no Chinese in the repo". Evidence: S008.

- **2026-09-24 · S007**:
  - Added `playbook/workstation.md`: an environment reuse policy (reuse as is → additive install checked by dry run → new `earnstar-*` env by clone or uv venv) and hardware notes.
  - Added `tools/envs.mjs`: a private environment inventory in `lab/envs.json`.
  - `tools/machine.mjs` finds conda outside PATH and records the env count, the `earnstar-*` envs, and free space on every drive.
  - The free-space floor now covers C: as well.
  - Reason: owner directive to reuse existing conda environments to save storage. Evidence: S007 inventory (10 environments; conda on C:, 108 GiB free).

- **2026-09-24 · S006**:
  - `tools/machine.mjs` records toolchain versions (python, pip, uv, conda, rustc, go, java, dotnet, docker, cmake, nvcc, winget), reading stderr where tools print there.
  - The session template gains an "Environment changes" section.
  - `defaults.md` gains a free-space floor of 30 GB.
  - `.gitignore` excludes `lab/`.
  - Reason: the owner granted use of the workstation, so installs and resource use must be auditable. Evidence: S006; java 21.0.11 was detected only after the stderr fix.

- **2026-09-24 · S005**: Research became a hard gate.
  - `research.md` rewritten into eight stages (foundational study, divergence, screening, deep dive, feasibility spike, decision and pre-mortem, independent critique, reflection), plus the Selection Gate, continuous learning, and the pivot review.
  - `defaults.md`:
    - The P0+P1 budget "≤ 7 days, ≤ 12 active hours" is replaced by a floor (≥ 8 active hours, ≥ 3 sessions, ≥ 2 calendar days) and a ceiling (≤ 14 days, overridable with a reason).
    - First release moved from day 21 to day 35.
    - Added: spike ≤ 4 active hours; pivot review at launch + 14 days; continuous research ≥ 10 %.
  - Reason: owner directive that a ≥ 2-month project must not start without sufficient learning and research. Evidence: S005.

- **2026-09-24 · S003**: Owner-approved audit extension (7 items).
  - `tools/archive.mjs`: transcript archive, with append-only prefix-hash verification.
  - `tools/usage.mjs`: agent configuration, work composition (tools, subagents, compactions, research trail), git activity with human-commit detection, the rules version, and evidence hashes; gap entries now also trigger on commits.
  - `tools/metrics.mjs`: channels (HN via the Firebase API, Reddit JSON, GitHub PRs), community and first-response time, release downloads, npm/PyPI downloads, security settings; tolerates a BOM.
  - Templates: owner involvement, external actions, human contribution, compliance.
  - Outbox: added Decided and Executed-by columns; added `history/channels.json`.
  - `launch.md`: supply-chain checklist items, channel registration, the Reddit fallback.
  - Reason: close the evidence gaps found in the S003 review (transcripts were deleted after 30 days; AI and human contributions could not be told apart; channel attribution was missing). Evidence: S003 tests, recorded in its log.

- **2026-09-24 · S002**: Added `tools/machine.mjs` (hardware profile + machine ID; software versions per session), recorded it in ledger entries, and added a Machine row to the session template. Reason: the owner requires every session to record its machine, because some projects are hardware-dependent. Evidence: S002.

- **2026-09-24 · S001**: Added the session kind `admin` (owner messages outside `start work` that change repo content) to the session template and `tools/usage.mjs`. Reason: keep every change traceable to a logged session. Evidence: S001.

- **2026-09-24 · S000**: Added `.gitattributes` (LF everywhere) and made both tools accept CRLF input. Reason: `core.autocrlf=true` on this machine would otherwise put `\r` into CSV fields after a fresh clone. Evidence: git's CRLF warnings on the initial commit.
- **2026-09-24 · S000**: Initial versions of `defaults.md`, `research.md`, `launch.md`, `lessons.md`, the templates, and `tools/usage.mjs` and `tools/metrics.mjs`. Reason: program setup. Evidence: ADR-001.
