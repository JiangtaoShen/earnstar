# Candidate N2 — "Ignore accents when I link and switch notes in Obsidian" (S024)

Evidence of the need: `s024/needs-G5-obsidian.md` (N2) and the independent landscape audit `s024/audit-N2-accents.md` (research stage 6). This file records the job, the existing solutions, and the end-to-end spike.

## 1. The people and the job
- **People**: Obsidian users who write their notes in a language with accents or diacritics (Spanish, French, Portuguese, Catalan, German, Polish, Vietnamese, Norwegian, and others; also Arabic and Hebrew with vowel points), and English writers who use such names. Most are not developers.
- **The job, step by step**: they create notes with correct names ("Máximo común divisor", "Élève", "Straße"); later, while writing, they type `[[` and the start of the name the quick way, without accents ("maximo", "eleve", "strasse"); Obsidian's suggester shows nothing, or only a different note; they retype with the exact accents, or open another search window, or give up on the link. The same happens in the quick switcher and in-file find.
- **In their words** ([forum t/1655](https://forum.obsidian.md/t/1655), 2020-06 to 2026-09, 154 posts, 786 likes, 11,801 views): "Start typing "[[" to link to another page whose name has a diacritic … The matches don't appear" ([t/105718](https://forum.obsidian.md/t/105718), 2025-09); "I write my notes in Spanish … I stumble upon this almost daily" (post 145, 2026-02); "As I write most of my notes in French, it'd be great to see this feature implemented" (post 144, 2026-01); "2026, still absolutely needed" (post 150); a user questioning the "long-term viability of this tool for my professional needs" (post 154, 2026-08).
- **Workarounds**: an unaccented alias on every note ("alias farms"), duplicated unaccented words in file names ("Idées idees"), regex tricks, other plugins' separate windows.
- **Why the core has not fixed it**: the team's explanation (post 95, 2024-08-29): an attempt stalled because "sometimes the accents are separate characters, sometimes they are not" and search highlights got wrong character offsets. Not on the roadmap. The early-access 1.14 builds rewrote fuzzy matching for `[[` and the switcher (not inspectable without an early-access login).

## 2. Existing solutions (audit, verified)
| Solution | Downloads | What it does | For this need |
|---|---|---|---|
| Native `[[`, quick switcher, in-file find (1.13.7) | — | Lower-casing only; accent-sensitive | Fails |
| Omnisearch | 1.95M | Accent-insensitive vault search; inserts a link from its own window | Partly: another window, not the `[[` popup; users in the thread reject it |
| Another Quick Switcher | 233k | Its own switcher normalizes diacritics; inserts links from its window | Partly |
| Various Complements | 612k | Accent option (off by default) in its own completions, including internal links, but not inside `[[` | Partly |
| Symbol linking, At People | 4.6k, 4.5k | Accent-insensitive links from an `@` trigger (At People: people folder only) | Partly, different gesture |
| Diacritics-Free Search | 286 | Accent-insensitive find and search | No linking |
| CJK Search | 40 | Wraps native `[[`, switcher, Find, Search for CJK character variants | No accents today; the closest competitor (one data change away) |

In-app search for "accent", "accents", "diacritics", "ignore accents" (24 queries replaying Obsidian's own matching) finds no linking plugin: the words are unclaimed.

## 3. Prototype on realistic tasks (S024 log 08:41–09:16)
- **Folding core** (`lab/s024/proto-n2/fold.mjs`): folds case, accents, letters that do not decompose (ß, æ, œ, ø, ł, đ, ð, þ, ı), Hebrew points, and Arabic harakat, with a map back to original indices; 20/20 test queries in 13 languages, including decomposed (NFD) names, ranked the expected note first with correct highlights. This is the offset problem the team cited.
- **End to end in Obsidian 1.13.7** (`lab/s024/proto-n2/e2e/`, wdio-obsidian-service, sandboxed): baseline `[[maximo` → only "Maximo (no accent)"; `[[eleve`, `[[strasse` → nothing. With the spike plugin (wraps the native suggest manager's `getFileSuggestions`, matches folded text with Obsidian's own `prepareFuzzySearch`, appends rows): all 12 queries from users' descriptions find the accented note; selection inserts `[[Élève — suivi trimestriel]]`; native heading mode and display text still work; highlights land on the right characters; 0 errors.
- **Gaps**: ranking when the query itself has accents; heading search (`#res` → "Résumé") and global heading search (`##`); the quick switcher and in-file find not yet wrapped; behaviour on 1.14 unknown.

## 4. Risks
- **Undocumented internals**: the wrap depends on the suggest manager's private method; an Obsidian update can break it (the plugin must fall back to native behaviour and be re-tested on each release).
- **Native fix**: the 1.14 matcher rewrite could add accent folding (then the plugin's job is done, which is good for the users).
- **Duplication**: CJK Search could add an accent table; Obsidian's policy asks developers to prefer collaboration over duplicates.
- **Findability**: the people gather in a forum thread the program may not post in (L-034); the in-app words are unclaimed, so the name and description must say "accents" and "diacritics" plainly (L-035).
- **Measure**: Obsidian plugins convert installs to GitHub stars at about 0.8 per 100 (L-035), so real use will show in downloads long before stars.
