<!-- Copied from the private working file lab/s024/audit-n2/audit-N2.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Independent landscape audit: N2, accent-insensitive `[[` linking in Obsidian

S024, 2026-10-03 (UTC). An independent auditor ran fresh searches. Everything here is read-only: nothing was posted, starred, installed or opened as an issue. The plugin sources were shallow-cloned only so their code could be read (`src/`). The two official Obsidian app bundles were downloaded only for grep and were never run (`app/`).

**Question.** Does any existing tool, or Obsidian itself, already let people type `[[maximo` and get the note "máximo" offered in the `[[` link suggester? Where the answer is "partly", which part is left?

**Scratch evidence in this folder**
- Registry snapshot: `community-plugins.json` (8,334 entries) and `community-plugin-stats.json`.
- Search scripts and results:
  - `q.mjs`: regex search over id, name, description and author.
  - `inapp.mjs`: replays the in-app search algorithm.
  - `reg_links*.txt`, `gh_repos.txt`, `gh_code.txt`, `gh_unshift.txt`, `ghinfo.txt`.
- Forum data: `forum/` (thread dumps t1655, t83304, t30924, t60485, t105718, t106484, t100007, t24793; searches s1–s3).
- Changelogs 1.9.3 to 1.14.4 and the roadmap: `cl/`.
- Obsidian 1.13.7 `app.js`: `app/`, extracted from the official `obsidian-1.13.7.asar.gz`.
  - The 1.14.4 early-access bundle could not be fetched: the beta URL returns 404 without a Catalyst login.

---

## 1. Existing solutions found

Download counts are from the 2026-10-03 stats file. "Upd." is the last registry update. ★ = GitHub stars. "`[[` need" asks one thing: does it make the native `[[` popup (or an equivalent popup triggered by `[[`) match "maximo" to "máximo"?

### 1.1 Accent-insensitive link insertion that exists today, with a different gesture

| Tool | DL / ★ / upd. | What it does with accents | `[[` need? | Code evidence |
|---|---|---|---|---|
| **Various Complements** (tadashi-aikawa) | 614,344 / 940 / 2026-08-26 | Option "Treat accent diacritics as alphabetic characters" (**default off**, `src/setting/settings.ts:153`). When on, each note basename and alias gets an unaccented synonym (`src/provider/InternalLinkWordProvider.ts:66-101`, `src/util/strings.ts:46-61`), and the internal-link index is rebuilt with it (`src/ui/AutoCompleteSuggest.ts:845-870`). So typing `maxi` **in prose** offers `[[máximo]]`. The map has 877 code points and covers Latin and Vietnamese (é ü ñ ł ø ő ạ ế đ œ). It does **not** cover Arabic harakat, Hebrew nikud, or decomposed (NFD) input. | **No.** It is word-triggered "without input `[[`" (docs, *Internal link complement*). It registers normally (`src/main.ts:86`), so the core `[[` suggester, which comes first in the manager list, always wins inside `[[`. Within `[[` it is reachable only by a manual trigger, and the result is `[[[[link]]]]`. The maintainer said "You shouldn't type `[[` before completion" ([#196](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/196), open since 2023). | ed7c679 |
| **Symbol linking** (Mara-Li fork) | 4,604 / 16 / reg. 2025-03-24, push 2025-07-10 | Link popup on a single-character trigger (default `@`, configurable). `removeAccents: true` by default (`src/settings/interface.ts:49`). It uses NFD plus `\p{Diacritic}` stripping (`src/utils/valid-file-name.ts:17`). The trigger must be a single character (`src/settings/settings.ts:544`). | **No** (only a different trigger). Its description never says "accent". | d43b1e2 |
| **@ Symbol Linking** (Ebonsignori, the original) | not in the current registry despite its README / 98 / push 2026-07-10 | Same code: `removeAccents: true` (`src/settings/settings.ts:68`). It is installed in many public vault dotfiles (code search). | **No** (`@` trigger) | caef934 |
| **At People** | 4,493 / 19 / 2026-08-23 | `@` mentions with NFD stripping (`main.js:509`), limited to a people folder. | **No** | 4aa1418 |
| **Omnisearch** | 1,956,381 / 2,159 / 2026-09-05 | Vault search with `ignoreDiacritics: true` by default (`src/settings/index.ts:124`). It uses `\p{Diacritic}` stripping, with optional Arabic letter folding (`src/tools/utils.ts:125-150`). Alt+Enter in its modal inserts a `[[link]]` (`src/components/modals.ts:86-90`, `ModalVault.svelte:221-257`). | **No.** Modal only. It registers no EditorSuggest. Users: "doesn't replace the search behavior when trying to make links with [[" ([t/1655/102](https://forum.obsidian.md/t/1655/102)). | 0a4e93b |
| **Another Quick Switcher** | 237,233 / 403 / 2026-09-09 | Its own switcher modal, with "Normalize accents/diacritics" **off by default**, flagged "2 to 5 times slower" (`src/settings.ts:761`, `:1038-1043`). "insert to editor" (Alt+Enter, `src/settings.ts:325`) inserts a link. | **No.** Modal only, no EditorSuggest. | e90bf2a |

### 1.2 Plugins that hook or replace the `[[` suggester (none folds accents)

| Plugin | DL / ★ / upd. | How it touches `[[` | Accent folding? |
|---|---|---|---|
| **CJK Search** (`cjk-search-probe`, soizo) | 40 / 0 / 2026-09-29, repo created 2026-09-22 | Wraps the native `[[` provider's `suggestManager.getFileSuggestions` and **appends** extra matches, keeping the native popup, Shift+Enter, headings and unresolved rows. It does the same for Search, Find, the quick switcher, Graph and tag suggestions (`src/editor-suggest.js:28-60`, `:80-115`). It maps highlight offsets back to the original text. | **No.** It maps CJK variants and compatibility characters (①→1, [zh]→A). Tested: its expander returns `no-mapping` for "maximo", "cafe" and "e"; é maps only to its own NFD form (e + U+0301). This is **the exact architecture N2 needs**. The repo was created 2026-09-22 and had 3 releases by 2026-09-29. |
| **Fuzzy Chinese Pinyin** | 31,903 / 78 / 2026-09-09 | **Replaces** the `[[` suggester: `editorSuggest.suggests.unshift(...)` (`src/main.ts:109-110`). It handles `#`, `|` and `^` itself or by delegating (`src/editorSuggest/fileEditorSuggest.ts:81-128`). | No. It only lowercases and applies NFKD to the query (`src/utils/pinyin.ts:25-34`). |
| **Property Over File Name** | 8,963 / – / 2026-09-10 | Unshifts its own `[[` suggester, which matches a title property. | No (code search) |
| **Easy Links** | 1,520 / 2 / 2026-06-24 | Unshifts an optional "smart `[[` suggester" (`src/main.ts:708-727`). It leaves `#`, `^` and `|` to the native one (`:196`, `:381`). | No. It calls `prepareFuzzySearch` (`:485`). |
| **Link Suggestion Prioritizer** | not in registry / 0 | Wraps the native suggester to reorder results (`src/patch.ts:29-31`, branch feature/plugin). | No |
| **Quick Preview**, **Rendered Block Link Suggestions** | 12,022 / 9,671 | Patch the rendering of native suggestions. | No |
| **Boost Link Suggestions** | 1,851 / 14 / 2026-09-06 | Its own trigger, `b[` (`main.ts:42`), using `prepareFuzzySearch` (`:65`). | No |
| At Link (599), Mention Autocomplete (2,397), QuickLink (8,599), Auto Link Suggester (1,104), Tab Link (4,418) | – | `@`, ghost-text or word triggers. | No (code read: fuzzy, `includes` or `startsWith`, none normalizes) |

### 1.3 Accent-insensitive pieces that are not about linking

| Plugin | DL | Notes |
|---|---|---|
| **Diacritics-Free Search** | 286 / 0★ / 2026-06-11 | Find and replace in the note, plus vault search, in modals. NFD plus `\p{Mn}` stripping (`src/normalize.ts:26`) covers Hebrew, Arabic and Latin, but not ł, ø or đ, which have no decomposition. Open bug: "no text is being highlighted" ([#4](https://github.com/spenhos/obsidian-diacritics-free-search/issues/4)). It **owns the web**: Google results in French, Spanish and German all surface it. |
| Completr | 86,485, stale since 2024 | "Ignore diacritics when filtering", only for its word list and scanner. No links. |
| Quick Switcher++ | 495,157 | Declined; "uses the builtin Obsidian searching algorithm" ([#246](https://github.com/darlal/obsidian-switcher-plus/issues/246), 2026-06). |
| Vault File Renamer (2,142), Slugify (533) | – | Strip accents **from file names**. This is the "rename without accents" workaround, not matching. |

Also checked, with no accent handling found: Lemons Search, CFR Find, UltraSearch, Vault Spotlight, Card View Switcher, Alias Quick Switcher, Linter, Smart Title, Note aliases and Multilingual (no plugin auto-generates unaccented aliases). Outside the registry: vaniwiki/obsidian-index-search (scripture-only) and denitdao transliterated search (2023, keyboard layouts). No CSS, Templater or QuickAdd script for `[[` was found.

## 2. Native status

- **Obsidian 1.13.7 code** (official asar; the one bundle that could be read):
  - `prepareFuzzySearch` only lowercases and calls `indexOf` (minified `$y`/`eb`), and `prepareSimpleSearch` is the same.
  - The core link suggester's `getFileSuggestions` calls these module-internal functions directly (`s=i.length<1e4?Zy(t):ab(t)`). Patching the exported `obsidian.prepareFuzzySearch` therefore **cannot** change it.
  - There is no diacritic folding anywhere except the **PDF viewer's find bar**, which has PDF.js's "Match diacritics" toggle (default off, so PDF find already ignores accents). Paths are only NFC-normalized.
- **Changelog** (64 desktop pages, 1.9.3 → 1.14.4): no diacritic or accent work. Two relevant lines are in **early access**:
  - 1.14.2 (2026-09-15): "The editor link suggestions (e.g. `[[`) and the quick switcher no longer switch to a simplified algorithm in vaults with more than 10,000 files."
  - 1.14.3 (2026-09-29): "Improved fuzzy search in the Quick switcher and suggestions: matches where your letters start words now rank higher, and searching is faster in large vaults."
  - **The team is rewriting exactly this code right now.** Whether 1.14 adds folding cannot be checked without the Catalyst build. Its notes do not say so.
- **Roadmap:** nothing on diacritics. "Sort search results by relevance" is planned.
- **Team statement:** **post #95 (2024-08-29, "Obsidian Team")**, quoting Licat. An attempt was shelved over highlight offsets, compute cost, and breaking Hebrew; "not dead in the water".
  - **Correction to the first researcher:** post #141 (2025-11-26) is a *user* re-quoting that text, not a team post.
  - Staff later pointed users to Omnisearch and Another Quick Switcher (#94, #129).

## 3. Feasibility and risks of each approach

Precondition, verified in 1.13.7: the editor-suggest manager pushes plugin suggesters after the core link, tag and third suggesters (`addSuggest` = `push`). Its `trigger` stops at the **first** suggester that fires. None of these internals (`editorSuggest.suggests`, `suggestManager`, `getFileSuggestions`, `metadataCache.getLinkSuggestions`) appears in `obsidian.d.ts` 1.14.4.

| Approach | Precedent | What works | What breaks or risks |
|---|---|---|---|
| **A. Wrap the native provider** (`suggests[0].suggestManager.getFileSuggestions`): fold every entry from `getLinkSuggestions()` once and cache it, match the folded query with `prepareFuzzySearch`, map the match ranges back, and append rows the native search missed. | CJK Search (`src/editor-suggest.js`), Link Suggestion Prioritizer | Keeps the native popup, sorting, Shift+Enter/Tab, `#` heading, `^` block and `|` alias modes, unresolved-link rows, attachments, link-format settings, and the Quick Preview/RBLS add-ons. The same wrapper pattern covers the core quick switcher (CJK Search "Open file"). | (1) Internal API that 1.14.2/1.14.3 just changed, and 1.14 cannot be tested before it ships publicly. (2) Heading mode (`[[Note#héad`, `[[##`) is a separate path and needs its own wrap. (3) Offsets: folding must stay per-code-point with an index map (Licat's blocker). CJK Search shows this is solvable. (4) Scripts: NFD + Mn misses ł, ø, đ, œ and ß, so a map is needed. Arabic needs letter folding as well as harakat (alef forms, ta marbuta), as Omnisearch does. For Hebrew, fold the candidate only, never the query (asymmetric, UTS #10), to avoid the breakage Licat described. (5) Silently does nothing for users of plugins that *replace* `[[` (Fuzzy Chinese Pinyin 31.9k, Property Over File Name 9k, Easy Links). (6) Stacking with CJK Search's wrapper must preserve `this` and the chain. |
| **B. Replace `[[` with an unshifted EditorSuggest** | Fuzzy Chinese Pinyin, Easy Links, Property Over File Name | Full control, and uses public classes. | You must reimplement headings, blocks, `|`, unresolved links, creating new notes, Markdown-link format and attachments. Fuzzy Chinese Pinyin's tracker shows the cost: block suggestions broke ([#38](https://github.com/lazyloong/obsidian-fuzzy-chinese/issues/38), [#39](https://github.com/lazyloong/obsidian-fuzzy-chinese/issues/39)), `#`/`^` after a match broke ([#68](https://github.com/lazyloong/obsidian-fuzzy-chinese/issues/68)), uncreated notes went missing ([#72](https://github.com/lazyloong/obsidian-fuzzy-chinese/issues/72)), heading insert broke on an Obsidian update ([#56](https://github.com/lazyloong/obsidian-fuzzy-chinese/issues/56)), and input lags ([#96](https://github.com/lazyloong/obsidian-fuzzy-chinese/issues/96)). Plugins also fight over the front of the list. |
| **C. Alternate trigger** (`@`, `;;`) | Symbol linking, @ Symbol Linking, At People, VC (word trigger) | Public API only, near zero risk. | **Already exists.** It does not meet the stated need: users want the `[[` they already type. |
| **D. Auto-add unaccented aliases** (`processFrontMatter`) | none found | Public API, and it immediately works in native `[[`, the switcher and search. | Writes to users' notes (frontmatter noise, sync churn), shows "maximo" alias rows, and automates the very workaround users complain about (#128, #130). It does not help find-in-file. |
| E. Monkey-patch the exported `prepareFuzzySearch` | – | – | **Does not work.** The core binds the internal function (see §2). |

## 4. The first researcher's negatives

**"No plugin makes the `[[` link suggester accent-insensitive": VERIFIED**, with a qualification. It was checked eight ways:
1. 35+ registry regexes in English and the users' languages (`accent`, `diacrit`, `insensitiv`, `normali[sz]`, `unicode`, `latin`, `umlaut`, `acento`, `sans accent`, `dấu`, `nikud`/`tashkil`/`harakat`, `translit`, `ascii`, `\[\[`, `link suggest`, `suggester`, `autocomplet`, `wiki ?link`, `fuzzy`, `switcher`, `equivalen`, `alias`).
2. Source reads of every plugin that wraps or replaces `[[` (§1.2).
3. A source read of VC's trigger, plus its maintainer's statement (#196).
4. GitHub code search: `registerEditorSuggest` + NFD/`u0300`/diacritics/`removeDiacritics`, `editorSuggest.suggests.unshift`, and `suggestManager getFileSuggestions`.
5. GitHub repo search in EN, FR, ES, PT and DE.
6. The full forum thread 1655 (posts #1–#158), plus t/83304, t/30924, t/60485 and t/105718: nobody names a `[[` fix. VC is never mentioned in 1655.
7. Forum search in five languages.
8. Web search in FR, ES, PT, DE and EN. Only Diacritics-Free Search and Omnisearch come up.

**Qualification:** "no accent-insensitive *inline link suggester*" would be **false**. Symbol linking/@ Symbol Linking (with a `@`-style trigger), At People (people only) and Various Complements (in prose, option off) all insert links while ignoring accents.

**"The in-app search for 'accent' returns nothing relevant": VERIFIED.** The in-app algorithm was replayed from 1.13.7 code: all space-separated words as substrings of name+author+description, sorted by downloads by default, with 24 queries.
- "accent": 12 hits, mostly colour plugins and renamers. Diacritics-Free Search comes 8th.
- "accents": 5 hits, including Diacritics-Free Search.
- "diacritics": 3 hits, including Diacritics-Free Search.
- "accent insensitive": At People only.
- No hits for "ignore accents", "remove accents", "without accents", "acentos", "sans accents", "umlaut", "unaccented" or "accented".
- **No plugin that does accent-insensitive *linking* is findable by these words.** Diacritics-Free Search, at 286 downloads, is the only relevant result.

**Corrections to the first researcher's file:**
- The team statement is #95 (2024-08-29), not #141.
- VC [#331](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/331) is about a custom dictionary, not internal links. The claim still holds, by the code in §1.1.
- Demand is narrower than the headline figures. Thread 1655 (786 likes) is mainly about search. About 12 distinct people ask for `[[` specifically:
  - Thread 1655 posts #9, #19, #83, #84, #96, #99, #102, #111, #130 and #146.
  - t/30924 (15 likes) and t/83304 (12 likes).
  - The bug report t/105718.

## 5. Verdict

**Partly met.** The outcome "insert a link to *máximo* by typing *maximo*" is already reachable in four ways:
- Various Complements, by typing the word without `[[`, after turning on an option that is off by default.
- Symbol linking or At People, with an `@`-style trigger.
- Omnisearch or Another Quick Switcher, through a modal and Alt+Enter.

Accent-insensitive search is met by Omnisearch and Diacritics-Free Search.

**Unmet:** accent-insensitive matching **inside Obsidian's own `[[` popup**: file and alias mode, heading mode (`[[note#…`, `[[##…`), and Arabic, Hebrew and decomposed input. A second unmet piece is the **native** quick switcher in place; Another Quick Switcher is only a replacement modal. Users explicitly reject the modal and alternative-trigger tools: "I meant a plugin to solve this issue, not Omnisearch or Another Quick Switcher" ([#130](https://forum.obsidian.md/t/1655/130)).

**Would a focused new plugin be a duplicate under L-029, L-031 and L-034?**
- **Not today, in function.** No plugin does this.
- **But it is one data change from duplication.** CJK Search already wraps the native `[[`, switcher, Find and Search with offset-safe mapping. Its author published three releases (v0.3.0 to 0.5.1) between 2026-09-22 and 2026-09-29, and adding a Latin/Arabic/Hebrew folding table is trivial for them. Various Complements' author could also add a `[[` mode, but has refused that design since 2023.

**Further risks**
- **Native.** Obsidian is rewriting link-suggestion fuzzy matching in 1.14 right now (early access). That raises both the chance of a native fix and the chance that the internal hook breaks.
- **Findability (L-034).** The sufferers gather in forum thread 1655, where the program cannot post. Only in-app search for "accents"/"diacritics" can bring them, and that channel is open: the words are unowned apart from Diacritics-Free Search (286). A name that says "accents" in plain words is required.
- **Scope check.** If pursued, build approach A (wrap, don't replace). Test it on 1.13.7 and on public 1.14 before any ADR. Coexistence with CJK Search, Fuzzy Chinese Pinyin and Various Complements must be part of the Gate prototype.
