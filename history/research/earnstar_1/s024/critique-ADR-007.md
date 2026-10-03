<!-- Copied from the private working file lab/s024/critique-n2/critique-ADR-007.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Independent critique of ADR-007 (N2: accent-insensitive linking for Obsidian)

- **Date**: 2026-10-03 (S024). Critic: an independent subagent with no stake in the decision. Everything outside `lab/s024/critique-n2/` was read-only. Nothing was posted, liked, starred, followed, opened as an issue, or installed outside the lab folder. One third-party plugin (Various Complements 11.4.2, 940 stars) was installed from its GitHub release into the **sandboxed** test vault only; CJK Search (0 stars) was read, never run.
- **Read**: ADR-007, `candidate-N2-accents.md`, `s024/audit-N2-accents.md`, `s024/needs-G5-obsidian.md` (N2), `needs.md`, `s024/channels.md` §1, `playbook/research.md`, `playbook/lessons.md`, `playbook/defaults.md`, `STATE.md`, the spike (`lab/s024/proto-n2/fold.mjs`, `e2e/plugin/main.js`, `e2e/test/*.mjs`).
- **Fresh research** (two research assistants plus my own checks; every claim the verdict rests on was re-checked by me, marked ✔):
  - Forum: all 154 live posts of t/1655 and its revision history, 13 related threads, forum search in 9 languages, web search in ES/FR/PT/DE/VI/PL (`forum/forum-report.md`, `forum/t1655_classification.tsv`, raw JSON in `forum/raw/`).
  - Registry: today's `community-plugins.json` and stats, the in-app search replayed from the 1.13.7 `app.js`, GitHub repo and code search, CJK Search's source and commits, 30 days of commits of 12 close tools, the 1.14.0–1.14.4 changelogs, the roadmap, `obsidian-api`, and the developer policies (`registry/registry-report.md`, `registry/src/`, `registry/cl/`, `registry/pol/`).
  - Monthly registry snapshots in `lab/s024/channels/obs/` for download trajectories.
- **Tests I ran in the real app**: 22 edge cases, including 5k and 15k-note vaults and Obsidian 1.8.10, 1.10.6, 1.12.7 and 1.13.7 (§3; harness in `e2e/`).

## Verdict (short)
**Proceed with changes; do not confirm as drafted.** The narrow claim survives a second, independent search: nothing public or in early access makes Obsidian's *own* `[[` popup, quick switcher, or Ctrl+F ignore accents, and the wrap-the-native-suggester approach is technically sound (the hook has been stable from 1.8.10 to 1.13.7). But the ADR does not follow from the program's own method. Scored by the one standard of `needs.md`, N2 comes to about **3.1**, below D (3.65). The tie-break rule as written favours D, and the ADR replaces it with a rule that is not in the playbook. The need for the chosen job (linking and switching) is far narrower than the ADR presents: about 22 people in six years, 7 in 2025–2026, and 2 in 2026. The ADR's four 2026 quotes do not mention linking at all. The only natural experiment on the search words ("Diacritics-Free Search") points *below* the cohort median, not above it. The audit missed five more accent-aware linking and switching tools. The spike has two user-facing defects and one unload defect. The expected outcome is about two stars, and that is a decision for the owner, not the developer. **F1 must be resolved by the owner, and S3 and S4 by tests, before the confirmation session.** If the owner, told plainly that the expected result is 0–6 stars, does not accept that, the answer is **reject**.

---

## 1. Objections, ranked

### FATAL (blocks confirmation as written)

**F1. The selection contradicts the program's own scoring and tie-break rule.**
- **D scores higher in the ADR's own table** (3.65 against 3.50). The ADR calls this noise and turns to the tie-break in `research.md` §3: "prefer the one whose users the developer understands best and whose need the developer meets in its own work."
  - The ADR quotes only the second half (daily use) and says it does not separate the candidates.
  - The first half clearly favours D. The developer *is* a maintainer: Constitution §4 has it triage issues and PRs in program repos at every session, and `needs.md` says so for D. It has never used Obsidian for its own notes and does not write accented text (the ADR admits this).
  - The ADR then decides on a criterion that is not in the playbook ("N2's people cannot [build a workaround]; D's already have working ones"). A tie-break invented inside an ADR, which happens to favour the developer's leading candidate, is what L-029 warns against when it says "choose by a stated tie-break rule".
- **"Unmet" is scored by two standards.** `needs.md` ("one standard") says: "Self-built workarounds that work count against 'unmet' for every candidate alike; native fixes in any widely used tool count as meeting the need for those willing to use it."
  - D was cut to 2 because its workflows work.
  - N2 keeps 3, although its people also have working options:
    - Unaccented aliases. Users describe them as working but tedious: #43, #45, #54, #55, #86, #128, t/83304#2.
    - Omnisearch, with 1.95M downloads, inserts `[[links]]` from its modal. Staff pointed users to it in the thread (#94, #129), and four users report it solved their problem (#44, #66, #89, #110).
    - At least eight other tools insert accent-insensitive links by another gesture (§2).
- **Re-scored by the one standard** (my scores, with reasons):
  - Need: 3.5. About 22 people in six years ask for linking or switching, 7 in 2025–2026 and 2 in 2026. The alias farms are strong behavioural evidence.
  - Unmet: 2.5. Only the exact gesture is unmet; there are working options and many alternative gestures.
  - Serve: 3.5. The spike works and the hook is stable. Against that: user-facing defects, 1.14 cannot be tested, private internals, no daily use by the developer, and real mobile cannot be tested.
  - Find: 2.5. The people gather in a vendor's feature-request thread (L-034), and the one plugin that owns the words has about 50 real installs a month (S2).
  - Improve: 3.
  - Weighted: 1.05 + 0.5 + 0.7 + 0.375 + 0.45 = **3.08**.
  - **D leads by more than noise**: Serve by 1.5 and Improve by 1. Even the most generous consistent scoring (4 / 2.5 / 4 / 3 / 3 = **3.40**) leaves N2 behind D.
- **The ADR's people-first argument is not empty.**
  - D's prototype showed that its people's workflows already work (L-031). N2's people pay a recurring cost every time they link.
  - That is a real difference. But it is a difference in *how much the workaround costs*, and the scoring standard does not measure it.
- **Resolve by one of these:**
  - (a) Amend the "one standard" in `needs.md` and the tie-break in `research.md` §3 through `playbook/CHANGELOG.md`, with the reason. Example wording: "a workaround with a per-use cost counts less against 'unmet' than a one-time setup". Then re-score **every** candidate under the new rule and let the result decide.
  - (b) Put N2 against D to the owner as an explicit choice, with each candidate's expected outcome (N2: about 300–600 downloads and 0–6 stars at close). Record the decision in the ADR. "Approved by: developer" is not adequate for a choice that departs from the playbook's rule.

### SERIOUS

**S1. The demand for the chosen job is much narrower than the ADR presents, and its recent quotes are not about linking.**
- **Thread t/1655** (✔ verified from the revision history):
  - It has no votes (`vote_count` 0). The 786 is the total of all likes; the first post has 161.
  - Post #1 asks only about **search**.
  - The title was "Ignore accents/diacritics in search" until **2024-11-25**, when a staff account added "link suggestion, quick switcher, find in file" (post #1, revision 5). Most of the 786 likes were therefore given to a search-only request, and search is already served by Omnisearch and others.
- **People who ask for LINK or SWITCHER** (`forum-report.md`; I re-read the posts):
  - In t/1655: 14 distinct users, 4 of them in 2025–2026.
  - Across the forum: about 22 (27–29 with +1s in threads titled for those surfaces), 7 in 2025–2026, and **2 in 2026** (#146 and t/83304#4).
  - After the retitle, 33 users posted: 5 named linking or the switcher, 12 named search only, and 15 named no surface.
- **The ADR's 2026 evidence is misattributed** (✔):
  - #144 (French) and #145 (Spanish, "almost daily") name no surface. #150 is a bare "still needed".
  - #154 ("long-term viability … professional needs") follows the same user's #153, which is about **search**, and about "formatting or editing modes inject[ing] code into the text".
  - The only link-specific quote in the ADR is t/105718, a bug report with 0 likes, closed as a duplicate.
- **Resolve:**
  - Rewrite "The people and the need" with the link- and switcher-specific counts.
  - Quote the link-specific posts: #36, #83, #96, #99, #102, #111, #126, #130, #146, t/30924, t/83304, t/105718.
  - Say that most of the likes are for search.
  - Re-score Need at 3–3.5.

**S2. The findability premise and the download prediction are contradicted by the one natural experiment on these search words.**
- **Diacritics-Free Search** (✔, monthly snapshots in `lab/s024/channels/obs/`):
  - Its name says "Diacritics". Its description says "ignoring diacritics — Hebrew nikud, Arabic tashkil, Latin accents". The audit found it ranks first on Google in French, Spanish and German.
  - It was listed in June 2026: 70 downloads on 07-01, 164 on 08-01, 229 on 09-01, 274 on 10-01, and 284 today. Of these, 251 are on its latest version (1.0.8).
  - With a bot floor of about 36 per version, that is about **50 real installs a month**. It sits **below** the first-time-author median (293 at 60–94 days), although it owns exactly the words the ADR says are "unclaimed".
  - It also already does in-file find and replace while ignoring diacritics, which is the ADR's iteration 1. Almost nobody installed it for that.
- **The people do not find accent-aware linking tools through the registry today.**
  - Linkosaurus ("Accents optional … on by default", 2,950 downloads) and PhraseSync (accent folding in its link suggestions, 8,738 downloads) already turn "maximo" into `[[Máximo]]` (§2).
  - Not one forum poster names either of them, or Various Complements, Symbol linking, Diacritics-Free Search, or CJK Search.
  - The forum users know only the two plugins staff named (Omnisearch and Another Quick Switcher).
- **In-app placement** (replayed from 1.13.7 code; default sort is by downloads):
  - A new 0-download plugin lands **last** for "accent" (13 results), "accents" (6), "diacritics" (4), "link suggestions" (11), "quick switcher" (11), "switcher" (32) and "link" (771).
  - No query in Spanish, French, Portuguese, or German matches anything ("acentos" returns 0). One user only learned the word "diacritic" in the thread (#109).
- **The prediction has no reference class.** It says 300–1,500 by release + 60 days (median 500), "above the cohort median because the search words are unclaimed". The words are claimed by Diacritics-Free Search, and it fell below the median.
- **Resolve:**
  - Use Diacritics-Free Search and the cohort as the base: a median of about 250–350 total downloads at 60 days, of which about 100–200 are real installers.
  - State the expected *unique* installers.
  - Pre-register a findability check: the plugin's position for each query, and downloads above the floor at release + 14 and + 30 days.

**S3. The spike has defects that hurt exactly these users, and Gate item 3 is ticked although the v1 scope was not prototyped.** Details in §3.
- **(T5) Unresolved links cannot be chosen.**
  - Linking to a note that does not exist yet is an everyday Obsidian act. The test was `[[economie` with an existing link to "Économie politique".
  - Choosing the folded row throws `TypeError: Cannot read properties of null (reading 'basename')`. Enter then falls through to the editor and leaves `[[economie⏎]]`.
  - Typing the accent correctly shows the row **twice**. The spike's de-duplication never works, because native rows carry `path` without `.md` and the spike's keys use `getLinkSuggestions()` paths with `.md`.
  - The spike's "0 errors" counted only wrapper exceptions, not selection errors.
- **(T7) Typing correctly gets worse.**
  - Natively, `[[Máximo` offers only "Máximo común divisor". With the spike, "Maximo (no accent)" ranks first, and Enter links to the wrong note.
  - The ADR knows "ranking when the query has accents" is a gap. It does not say that the gap is a **regression** for people who type accents, who are the plugin's own audience.
  - Rows are not "appended": Obsidian re-sorts the combined list by score.
- **(T17) Disabling the plugin does not restore native behaviour** when another plugin has wrapped `getFileSuggestions` after it. CJK Search uses this pattern. The disabled code stays in the chain. This contradicts v1 item 3 ("falls back to native behaviour").
- **(T20) Speed.**
  - At 15,000 notes the spike takes 106–120 ms per keystroke against native 46–52 ms (2.3×), on an i5-13490F.
  - Above 10,000 files, 1.13.7 deliberately uses a cheaper matcher. The spike runs full fuzzy matching over about 19,000 entries on every keystroke and folds every string again each time (no cache).
  - 1.14.2 and 1.14.3 make native fuzzy matching "always used" and "faster in large vaults", so the bar rises.
- **(T9, T10) Not prototyped.** Heading search (`#res` → "Résumé", `[[##evaluation`, `[[maximo comun divisor#`) and the quick switcher are both v1 scope, and neither was prototyped.
- **Resolve:**
  - Fix T5, T7 and T17 in the spike: use the native `linktext` type, use the native key format, give folded-only rows a tie-break penalty, and make the wrapper a pass-through flag rather than a reassignment.
  - Cache the folded strings and respect the 10k-file threshold.
  - Prototype the switcher and the heading modes.
  - Add all 22 cases to the e2e suite.
  - Until then, mark Gate item 3 as **partly met**.

**S4. Obsidian 1.14 will likely go public around the planned release date, with the matcher just rewritten, and it cannot be tested now.**
- 1.14.0 has been in early access since 2026-09-02. Earlier versions took 17 days (1.12), 33 (1.11) and 63 (1.13) to go public, so 1.14 will most likely be public between mid-October and early November. The plugin is due on 2026-10-30.
- Its notes rewrite exactly the hooked path:
  - 1.14.2: "no longer switch to a simplified algorithm in vaults with more than 10,000 files. Fuzzy matching is now always used."
  - 1.14.3: "matches where your letters start words now rank higher, and searching is faster in large vaults".
- The early-access build returns 404 without a Catalyst login, and Catalyst costs money (budget 0).
- No note mentions diacritics, and a native fix of a 786-like request would be a headline item, so a native fix in 1.14 looks unlikely. A broken or changed hook does not.
- **Resolve:**
  - Hold the confirmation session until 1.14 is public and the probe suite has run on it.
  - Alternatively, ask the owner (outbox) whether they already have Catalyst access and can place the 1.14 build in the cache.
  - The release date may need to move. State that in the ADR.

**S5. The landscape is more crowded than the ADR and the audit say. The narrow claim holds, but "verified eight ways" missed five tools, and iterations 1 and 3 target surfaces that are already served.**
- **Missed by the audit** (all verified in code or README by me, ✔):
  - Linkosaurus: 2,950 downloads. "Accents optional", on by default since 2026-07-31 (commit `12aa39b9ef`). It auto-links as you type.
  - PhraseSync: 8,738 downloads. NFD and mark stripping in its mid-sentence link suggester (`main.ts` `normalizeText`).
  - Barosaurus (2,813) and Searchosaurus (3,043): note switcher and search replacements built on `fold()` (lowercase, ß→ss, NFD, marks removed).
  - CFR Find: 1,492 downloads. Diacritic-insensitive vault search **and in-file search**. The audit's §1.3 listed it as "checked, with no accent handling found"; that is false.
- **"In-app searches for 'accent' … find no linking plugin" is literally false.** At People, an `@` linker with "accent-insensitive matching" in its description, is the first result for "accent" and the only one for "accent insensitive".
- **The iterations target served surfaces.**
  - Iteration 1 (in-file find) is served in modals by CFR Find and Diacritics-Free Search.
  - Iteration 3 (core search) is served by Omnisearch, CFR Find, Searchosaurus and Diacritics-Free Search.
- **Resolve:**
  - Correct "Why existing tools fail these users" and list these tools.
  - Keep them in the README comparison.
  - Justify iteration 1 as *native* Ctrl+F in place, and only with evidence (one user asked for in-file find: #92, plus t/10348#25). Otherwise drop it.
  - Drop iteration 3, since search is the one surface users report as solved by Omnisearch.
  - Record an erratum to the audit for CFR Find (L-034 again, in the pre-ADR audit itself).

**S6. The program's measure and close rules do not fit this project. That is a decision for the owner.**
- The ADR predicts 0–6 stars at close (median 2), which is consistent with L-035 (about 0.8 stars per 100 installers).
- The plateau rule in `defaults.md` ("Stars gained in the last 14 days < max(10, 5 % of total)") is met from day one, so only "no high-value work remains" keeps the project open.
- **The main download prediction can never be checked inside the project.** Release + 60 days is 2026-12-29, after the unconditional latest close of 2026-12-25 (`STATE.md`: kickoff 2026-09-25).
- Owner directive ADR-005 says stars do not choose projects. But choosing, in a 12-month program measured by stars, a project whose expected outcome is about two stars is a strategic trade-off the owner should make knowingly.
- **This is not a reason for the developer to reject. It is a reason to ask.**
- **Resolve:**
  - Add an outbox item stating the expected stars and downloads, and the alternative (D).
  - Move the predictions to release + 30 days and close.
  - Propose a downloads-above-floor plateau signal as a `defaults.md` change, with its reason.

### MINOR

- **M1. The Arabic, Hebrew and NFD claims are wrong, and real Arabic folding is missing.** (✔ T12, T13)
  - Native 1.13.7 already finds "שָׁלוֹם עֲלֵיכֶם" from `שלום`, and "مُحَمَّد" from `محمد`: fuzzy subsequence matching skips combining marks.
  - Native also finds an NFD-named file from NFC input, because Obsidian normalizes paths.
  - So the audit's "Unmet: … Arabic, Hebrew and decomposed input" is wrong for these cases, and "built-in folding for … Arabic, and Hebrew marks" (v1 item 3) adds nothing there.
  - What Arabic users would need is letter folding (ة→ه, ى→ي; أ/إ/آ→ا works only through NFD). The spike does not do it: `[[مدرسه` and `[[مصطفي` fail.
- **M2. Transliteration conventions are not handled.**
  - `[[muenchen` does not find "München". Germans without an umlaut key type "ue", and Danes and Norwegians type "aa" or "oe".
  - Either support these conventions or state the limit.
- **M3. "Users in the thread reject" the alternatives overstates it.**
  - Four reject Omnisearch: #102, #106, #128, #130.
  - Four say it solved their problem: #44, #66, #89, #110.
  - Staff point to plugins at #94 and #129.
  - Only #130 rejects Another Quick Switcher. Nobody in the thread has tried Various Complements, Symbol linking, Linkosaurus or PhraseSync.
- **M4. "Most are not developers and cannot build a workaround" is unverified.** The main workaround (aliases) needs no programming, and it works.
- **M5. Duplication policy.**
  - The developer policies advise: "Consider contributing to existing projects rather than creating new projects that duplicate existing functionality."
  - CJK Search uses the same architecture, but excludes Latin, Greek and Cyrillic by design (`scripts/build_data.py:321` at `6d360ac91d`). It has 40 downloads, and its name would never be found by accent users.
  - The ADR should record why contributing to it would not serve these users. This is advice, not a rule, so it is minor.
- **M6. The automated review requires typed internals.**
  - The official ESLint rules make `no-explicit-any` a warning that cannot be disabled, and the type-checked `no-unsafe-*` rules apply. The spike's untyped access to `editorSuggest.suggests` would need typings.
  - CJK Search and Easy Links patch the same internals and are listed ("Satisfactory — 4 issues"), so this is low risk.
- **M7. Mobile.**
  - The plugin claims mobile, but only Electron emulation can be tested here (T19 passes).
  - The 2.3× per-keystroke cost (T20) matters most on phones.
  - Real iOS cannot be tested at all, and an Android AVD is heavy. State this in the README, or ship desktop-only first.
- **M8. "786 likes" is presented as demand for linking.** It is the total of likes on a mostly search thread, with no votes (see S1).
- **M9. The learning plan has no channel to the people.**
  - The sufferers are in t/1655, where the program may not post.
  - The developer has no daily use; the "fixture vaults run on every release" are regression tests, not use.
  - Expect few issues. Say so, and treat download trends as the main signal.

## 2. Competitors and native status found

| Tool | Downloads | What it does with accents | Gesture | In the ADR or audit? |
|---|---|---|---|---|
| Native `[[`, switcher, Ctrl+F (1.13.7) | — | Accent-sensitive. Combining marks (Hebrew, Arabic harakat) are skipped by subsequence matching; paths are NFC (T12) | — | partly wrong (M1) |
| Native PDF find | — | PDF.js `matchDiacritics` off, so it ignores accents | PDF only | audit yes |
| Obsidian 1.14.0–1.14.4 (early access) | — | No diacritic mention; matcher rewritten (1.14.2, 1.14.3) | — | yes |
| Omnisearch | 1.95M | Ignores diacritics; Alt+Enter inserts `[[link]]` | modal | yes |
| Another Quick Switcher | 237k | Option (off) normalizes diacritics; inserts link | modal | yes |
| Various Complements | 614k | Option (off); word-triggered link completion, not inside `[[` | prose | yes |
| Symbol linking / @ Symbol Linking / At People | 4.6k / – / 4.5k | Accent-insensitive by default | `@` trigger | yes |
| **Linkosaurus** | 2,950 | "Accents optional", on by default (2026-07-31) | auto-link on Space | **no** |
| **PhraseSync** | 8,738 | NFD + mark stripping in its link suggester | mid-sentence suggestions | **no** |
| **Barosaurus**, **Searchosaurus** | 2,813, 3,043 | `fold()`: ß→ss, NFD, marks removed | switcher / search modal | **no** |
| **CFR Find** | 1,492 | Diacritic-insensitive vault and in-file search (since 2026-07-04) | modal | **listed as "no accent handling"** |
| Diacritics-Free Search | 284 | Find and replace plus vault search ignoring diacritics | modal | yes |
| CJK Search | 40 | Same wrapper architecture; excludes Latin, Greek and Cyrillic by design | native surfaces | yes |
| Outside the registry: mathe00/obsidian-better-auto-linker-plugin, mariomile/obsidian-sonar | – | Accent-insensitive auto-linking / search | — | no |

**Nothing found** (code search, registry, the 763 plugins added since 2026-09-15, gists, Templater/QuickAdd scripts, open PRs of the close tools) makes Obsidian's *own* `[[` popup, native switcher, or native Ctrl+F fold accents. The narrow claim stands.

## 3. Edge-case tests in the real app (Obsidian 1.13.7, sandboxed, wdio-obsidian-service 3.2.1)

**Harness and fixtures**
- A copy of the spike's e2e folder, in `lab/s024/critique-n2/e2e/`. The plugin `main.js` is unchanged.
- New fixture vaults:
  - `vault-edge/`: subfolders, duplicate basenames, an accented alias, unresolved links, an NFD file name, Greek, Arabic and Turkish names, and distractor notes.
  - `vault-rtl/`: Hebrew and Arabic names.
  - Generated vaults, written by `tools/mkvault-*.mjs`, with Spanish, French, Portuguese and English titles in 60 folders:
    - `vault-5k/`: 5,003 notes, 8,987 link suggestions.
    - `vault-15k/`: 15,003 notes, about 19,000 link suggestions.
- Tests: `test/{probe,edge,unres,stack,rtl,perf}.e2e.mjs`.
- Raw outputs: `probe.out`, `perf-5k.out`, `perf-15k.out`.
- Machine `m-be80e7832908` (i5-13490F, Windows 10).

| # | Case | Result | Verdict |
|---|---|---|---|
| T1 | Re-run of the spike suite | Same as the developer's run: 12/12 queries find the accented note, 0 wrapper errors | reproduced |
| T2 | Subfolder note `Cours/Français/Élève.md`, `[[eleve`; embed `![[eleve` | Found (2nd, after "Eleventh hour", the native order for a prefix match); highlight on "Élève"; inserts `[[Élève]]` and `![[Élève]]` | pass |
| T3 | Duplicate basenames `A/Café.md`, `B/Café.md`, `[[cafe` | Both offered; inserts `[[A/Café\|Café]]`, the same form native uses (`[[B/Café\|Café]]` for `[[café`) | pass |
| T4 | Accented alias "Café crème" on `Coffee.md`, `[[creme` | Found; inserts `[[Coffee\|Café crème]]` | pass |
| T5 | **Unresolved link** "Économie politique", `[[economie` then Enter | Selection throws `TypeError … (reading 'basename')`; Enter inserts a newline: `[[economie⏎]]`. `[[Économie` shows the row twice (native `linktext` + spike `file`) | **FAIL** |
| T6 | Shift+Enter on `[[eleve` | Inserts `[[eleve]]` as typed, like native | pass |
| T7 | **Typed with accents**, `[[Máximo`, Enter | Native: only "Máximo común divisor". Spike: "Maximo (no accent)" first; Enter inserts `[[Maximo (no accent)]]` | **FAIL (regression)** |
| T8 | Upper case `[[ELEVE` | Found | pass |
| T9 | Headings: `[[Máximo común divisor#res` ("Résumé"), `[[maximo comun divisor#`, `[[##resu`, `[[##evaluation` | Nothing found in any case | FAIL (v1 scope, not prototyped) |
| T10 | Quick switcher, "eleve" | 5 distractors, no "Élève" | FAIL (v1 scope, not prototyped) |
| T11 | Greek `[[αθηνα`; Arabic `[[احمد` → "أحمد"; Vietnamese `[[tieng viet` | Found with the spike, not natively | pass |
| T12 | Hebrew `[[שלום`; Arabic `[[محمد` → "مُحَمَّد"; NFD file "Señorita" with `[[señorita` | **Native already finds all three** | claim wrong (M1) |
| T13 | Arabic ta marbuta `[[مدرسه` → "مدرسة"; alef maqsura `[[مصطفي` → "مصطفى" | Not found with or without the spike | FAIL (M1) |
| T14 | `[[muenchen` → "München" | Not found | FAIL (M2) |
| T15 | Turkish `[[istanbul` → "İstanbul notları" | Native already finds it | n/a |
| T16 | Various Complements 11.4.2 installed (sandbox only, default settings) | `[[` stays the core suggester with the spike's rows; no errors | pass |
| T17 | **Unload with another wrapper on top** (the CJK Search pattern), then disable the spike | Folded matches keep appearing, through a re-enable/disable cycle too | **FAIL** |
| T18 | Unload with nothing stacked | Native behaviour restored | pass |
| T19 | Mobile UI (`emulateMobile`) | Same as desktop (emulation only) | pass |
| T20 | **Latency** per keystroke (median of 3 runs of `getSuggestions`, 6–17-character queries) | 5k notes: native 34–69 ms, spike 55–102 ms. **15k notes: native 46–52 ms, spike 106–120 ms (2.3×)** | concern |
| T21 | Ranking at 5k and 15k notes | `[[reunion de equipo` and `[[eleve suivi`: target first. `[[réunion` (typed with the accent): 981 and 2,621 rows (native 320 and 721); the Spanish "Reunión de equipo semanal" ranks 342nd and 661st, past the 100-row limit | pass, but accented queries are noisy |
| T22 | Hook stability: the unchanged spike on **1.8.10, 1.10.6 and 1.12.7** | Same results as on 1.13.7 for `eleve`, `economie` and `Máximo`, including the T5 and T7 defects | **the hook has been stable for about 20 months** (a point for the ADR) |

## 4. Findability and the measure (question 4)
- **Will they find it?**
  - Only if they search the plugin browser for "accent", "accents" or "diacritics" (a new plugin lands last of 4–13 results), or browse "Recently released" (about 1,000 new plugins a month).
  - Evidence that they do is weak:
    - Diacritics-Free Search gets about 50 real installs a month on those words.
    - Linkosaurus and PhraseSync already solve linking without accents, and no forum poster has found them.
    - Forum posters know only the plugins staff named.
  - A plain name and description help ("Ignore accents in link suggestions and quick switcher"), but they cannot create search behaviour that the evidence does not show.
- **A realistic prediction**:
  - At release + 30 days: 100–300 total downloads.
  - At release + 60 days: 200–600, median about 300.
  - Stars at close: 0–4. The ADR's upper ranges are not implausible as tails, but the median should sit at or below the cohort, not above it.
- **Is this a sensible project for a program measured in stars?**
  - By the measure, no: about 2 stars expected.
  - By the program's first principle (real people, a real unmet gesture, in a channel where new tools get used), it is defensible.
  - Weighing those two is the owner's call (S6), not a ground for the developer to reject, and not one the developer may settle alone either.

## 5. Method (question 5)
- **N2 over D**: not justified by the rules as written (F1). The tie-break was bent: its first half was dropped, and a criterion from outside the playbook decided.
- **Inflated scores**:
  - Unmet 3, against the one standard.
  - Find 3: the people gather in a vendor thread, and the natural experiment is poor.
  - Need 4: the link-specific count is 7 people in 2025–2026.
  - Serve 4: this went *up* from the G5 note's 3.5 after a spike that left the switcher, headings and 1.14 untested.
- **False or unverified statements in the ADR** (✔ each):
  1. "786 likes" as demand for linking (S1, M8).
  2. The 2026 quotes as evidence for linking (S1).
  3. "In-app searches for 'accent' or 'diacritics' find no linking plugin" (At People; S5).
  4. "Users in the thread reject" the alternatives (M3).
  5. "Most are not developers and cannot build a workaround" (M4).
  6. Built-in Arabic and Hebrew mark folding as a gap (M1).
  7. Gate item 2 ticked although the audit missed five tools and misreported CFR Find (S5).
  8. Gate item 3 ticked although the v1 scope (switcher, headings) was not prototyped and two defects went unseen (S3).
  9. A prediction horizon after the latest close (S6).
- **Stated correctly**:
  - The narrow negative claim.
  - The 1.14 changelog lines.
  - The team statement (#95).
  - The cohort base rates.
  - The weighted arithmetic.

## 6. Changes required before confirmation (if the owner keeps N2)
1. **F1**: either amend the standard and tie-break in the playbook (CHANGELOG entry, re-score every candidate), or record the owner's explicit choice of N2 over D. The choice must be made knowing the star expectation (S6, outbox).
2. **S1, M8**: rewrite the need section with the link- and switcher-specific counts and link-specific quotes, and re-score Need.
3. **S2**: replace the prediction with one anchored on Diacritics-Free Search and the cohort, using unique installers and horizons inside the project. Pre-register the findability check.
4. **S3**: fix T5, T7 and T17; cache the folding and respect the 10k-file threshold; prototype the switcher and headings; put T1–T22 in the e2e suite; mark Gate item 3 "partly met" until then.
5. **S4**: run the suite on public 1.14 (or an owner-supplied build) before the confirmation session. Move the release date if needed.
6. **S5, M3**: correct "Why existing tools fail" and the competitor table; drop iteration 3; justify or drop iteration 1; add an erratum to the audit (CFR Find).
7. **M1, M2, M5–M7, M9**: fix the script claims (add Arabic letter folding or drop the claim); decide on transliteration; record the CJK Search contribution question; type the internals for review; state mobile limits; state that few issues are expected.

## 7. Answers this critique needs from the ADR author
| # | Question |
|---|---|
| 1 | Which rule picks N2 over D, and is it in the playbook before the decision? |
| 2 | Does the owner accept an expected 0–6 stars for project 1? |
| 3 | What is the evidence that people with this need search the plugin browser, given Diacritics-Free Search, Linkosaurus and PhraseSync? |
| 4 | When will the suite run on 1.14, and what happens to the 2026-10-30 date if 1.14 changes the hook? |
| 5 | Which iteration replaces "core search", which is already served? |
