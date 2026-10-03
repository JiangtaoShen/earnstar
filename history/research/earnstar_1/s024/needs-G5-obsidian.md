<!-- Copied from the private working file lab/s024/obsidian/needs-obsidian.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Obsidian users: candidate needs for a new community plugin

S024 research note (lab, private). Data pulled 2026-10-03 (UTC). Read-only: nothing was posted, starred, installed or submitted. No usernames are recorded; the links lead to the posts.

**Question.** What real, recurring need of Obsidian desktop users could a new community plugin from a new author meet well, where existing plugins and native features do not already meet it?

**Sources and method**
- Registry: `community-plugins.json` (8,334 plugins) and `community-plugin-stats.json`. "+3 mo" means downloads gained from the 2026-07-01 snapshot to the 2026-10-01 snapshot (`../channels/obs/`). For a plugin with no release in that window, this is close to the number of new installs.
- GitHub GraphQL: repo status for the 1,000 most-downloaded plugins (`ghinfo.json`), the most-reacted issues of the top 300 (`issues.json`, `topissues.txt`), and issues since 2025-04 for 395 stale repos (`broken.json`, `broken.txt`).
- forum.obsidian.md Discourse JSON:
  - Feature requests: top all-time and yearly (`forum/fr_top.txt`).
  - Plugin ideas: top all-time and yearly (`forum/pi_top.txt`).
  - Help: top yearly (`forum/help_top.txt`).
  - Targeted searches (`forum/search*.txt`) and full threads (`forum/t*_full.json`, fetched by `thread.mjs`).
- Obsidian changelog 1.8.6–1.14.4 (`cl/`), and the roadmap page.
- A sub-researcher covered the Chinese and Japanese communities: forum-zh.obsidian.md, Zenn, Qiita and blogs (`cjk/`). I spot-checked its key claims: forum-zh threads 28934 and 62492, the laboradian blog post, Omnisearch #471/#558/#559, and the CJK Bold Fix repo and registry entry.
- Gaps: Reddit was unreachable, and pkmer.cn returned HTTP 525.
- Helper scripts in this folder:
  - `q.mjs`: registry text search over id, name and description. This is what the in-app browser matches.
  - `info.mjs`: downloads, stars, last push and open issues for given plugin ids.
  - `thread.mjs`: dumps a forum thread.

---

## 0. What the landscape looks like (read this first)

1. **Saturation.** Almost every popular forum request already has one or more plugins. There were 1,000–1,700 new plugins a month after the 2026-05 automated review. A typical check returns 5–60 matches: task archiving 24, mind maps 67, Bases views 167, image zoom 46, date pickers 19, tray 7, merged table cells 10, auto-linking 23. The L-029 pattern, where "open" ideas turn out to be already built, applies to the registry at scale.
2. **Native features added in 2025–2026 removed many old gaps:**
   - Bases (1.9) with group-by, summaries and list view (1.10), and kanban plus collapsible groups (1.14).
   - Color highlights (1.14). This makes Highlightr redundant.
   - Delete-attachments prompt (1.12).
   - Image drag-resize (1.12), and a new image system with zoom (1.13).
   - CLI (1.12).
   - Settings window with search (1.13).
   - Delete a property vault-wide (1.10).
   - Paste a URL over selected text to make a link (1.11). This makes "Paste URL into selection" redundant.
   - Open `.md` files outside the vault, and "Open with" (1.14.2).
   - MathJax 4 restored after a one-week Temml detour (1.14.0 → 1.14.1).
   - The roadmap marks as *planned*: Calendar view for Bases, **PDF annotation** ("waiting for native support in PDF.js"), and sort search results by relevance.
3. **Stranded demand.** Several unmaintained plugins are still installed at scale, because users search by their names:

| Plugin | Total downloads | +3 mo (Jul–Sep 2026) | Last release | State |
|---|---|---|---|---|
| Calendar | 3,148,924 | +327,436 | 2021-04-20 | Bugs on clean installs ([#389](https://github.com/liamcain/obsidian-calendar-plugin/issues/389), [#395](https://github.com/liamcain/obsidian-calendar-plugin/issues/395)). Maintained alternatives exist: Calendar Plus, Journals, Notebook Navigator. |
| Kanban | 2,710,582 | +323,742 | 2024-05-31 | Native Bases kanban since 1.14 |
| Remotely Save | 2,270,655 | +255,863 | 2024-10-20 | "[Is this plugin Dead?](https://github.com/remotely-save/remotely-save/issues/1151)" (35 reactions). Sync needs third-party accounts, so it is out of filter. |
| PDF++ | 816,005 | +224,961 | 2025-08-30 | Settings tab broken on 1.13 ([#569](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/569)). Fixes sit in unmerged PRs. Native PDF annotation is planned. |
| Periodic Notes | 769,754 | +67,377 | 2022-04-14 | Ribbon bug ([#258](https://github.com/liamcain/obsidian-periodic-notes/issues/258)). Journals and Calendar Plus cover it. |
| Highlightr | 728,849 | +57,666 | 2022-08-31 | Native color highlights since 1.14 |
| Mind Map | 891,549 | +45,521 | 2020-12-13 | Broken ("No content found", [#117](https://github.com/lynchjames/obsidian-mind-map/issues/117), 42 reactions). Mindmap NextGen and 60+ others cover it. |
| Better Search Views | 50,066 | +5,589 | 2024-12-01 | Crashes when patching internals since 1.12.x, mostly on mobile ([#63](https://github.com/ivan-lednev/better-search-views/issues/63), [#68](https://github.com/ivan-lednev/better-search-views/issues/68)) |

   In every row except Better Search Views, a maintained successor or a native feature already exists. A new plugin would sort below the stranded plugin and its successor in a download-sorted list. Stranded demand is therefore real but not a good opening for a new author.
4. **What remains open has two shapes:**
   - **(a) Findability gaps:** the feature exists, buried in a multi-feature plugin whose name and description don't contain the users' words. In-app search matches only name, author and description (L-035).
   - **(b) Fragmented or partial fixes** of a long-standing core limitation that a plugin can patch.
   - Fresh breakage from 1.13 (the image system, the settings window) is a third shape, but it carries a high risk of a native fix.

---

## 1. Candidate needs (15)

Quotes are verbatim, at most 20 words; translations are marked [translated]. "L" = likes, "P" = posts, "V" = views.

### N1. Show date and date-time properties in *my* format, independent of the OS language (Properties panel, Bases)
- **Who:** international users whose OS display language differs from their regional format. This is very common on **Windows**, where Obsidian follows the display language, not the "Short date" setting. Also Linux (LANG vs LC_TIME) and institutional PCs where OS settings can't be changed.
- **Workarounds:**
  - Switch Windows' regional format to "Recommended" and hand-edit the short date (#129, #137).
  - Change the OS language to "English (UK/Dutch)" (#18, #69).
  - Add `--lang=ru` or `--lang=ja` to the shortcut (#115, #117), or set LANG in the .desktop file or Flatpak (#33, #118, #120).
  - Use text properties instead of dates (#23, #138).
  - A CSS snippet that re-orders the date-input fields, re-shared and extended to date-time (#146–#148, #155).
  - Pretty Properties' "custom date format" setting (announced in-thread by its author, #136).
- **Frequency:**
  - FR [t/64139](https://forum.obsidian.md/t/64139): **660 L, 155 P, 29,586 V**, open since 2023-07-31, last post 2026-09-30.
  - Per-OS spin-offs: [Windows t/69327](https://forum.obsidian.md/t/69327) (32 P) and [Linux t/103498](https://forum.obsidian.md/t/103498) (30 P).
  - At least 6 further threads in 2025–2026: 101329 (2,181 V), 103969, 108950, 116681, 117435, and Bases 105153 / 102853.

| Quote | Link | Date |
|---|---|---|
| "I'm using Windows 11 with the system language set to English, but my time and region are set to German." | [t/64139/122](https://forum.obsidian.md/t/64139/122) | 2025-08-27 |
| "with an institutional computer, it's pretty challenging to change OS settings" | [t/64139/124](https://forum.obsidian.md/t/64139/124) | 2025-08-28 |
| "it bothers me literally every day" | [t/64139/125](https://forum.obsidian.md/t/64139/125) | 2025-08-30 |
| "This is crazy that this hasn't been implemented yet, especially with the introduction of Bases." | [t/64139/128](https://forum.obsidian.md/t/64139/128) | 2025-09-15 |
| "I wrote a snippet to change MM-DD-YYYY to DD-MM-YYYY." | [t/64139/146](https://forum.obsidian.md/t/64139/146) | 2026-01-26 |
| "Is there any way I can configure Obsidian's rendered date format in the Properties view" | [t/101329](https://forum.obsidian.md/t/101329) | 2025-05-30 |
| "there's no way to adjust how they're displayed because it's tied to system locales." | [t/117435](https://forum.obsidian.md/t/117435) | 2026-08-17 |
| "Add my name to the list of people who would like to see dates formatted properly with ISO 8601." | [t/64139/157](https://forum.obsidian.md/t/64139/157) | 2026-09-22 |

**Status:** met *functionally* by Pretty Properties, but hard to find (strict check §2.A).

### N2. Find and link notes without typing accents or diacritics (café = cafe, ü = u, Arabic harakat, Hebrew nikud)
- **Who:** people who write in French, Spanish, Catalan, Portuguese, German, Polish, Hungarian, Vietnamese, Arabic, Hebrew, and English writers using borrowed terms. The core link suggester (`[[`), quick switcher, in-file find and global search are all accent-sensitive.
- **Workarounds:**
  - Aliases without accents on every note (#43, #54, #86, #128).
  - Duplicate unaccented words in filenames ("Idées idees", #53).
  - Regex with `.` in place of the accented letter (#122).
  - Typing around the letter ("fdora" for "Fœdora", #111).
  - Plugins for parts of the job: Omnisearch (search, plus a modal that inserts a `[[link]]`), Another Quick Switcher (switcher), Various Complements (word completion, with a "treat accent diacritics as alphabetic" option).
- **Frequency:**
  - FR [t/1655](https://forum.obsidian.md/t/1655): **786 L, 154 P, 11,801 V**, open since 2020-06-11, last post 2026-09-25.
  - Separate threads: [t/106484](https://forum.obsidian.md/t/106484) (2025-10), bug report [t/105718](https://forum.obsidian.md/t/105718) (2025-09), Arabic [t/100007](https://forum.obsidian.md/t/100007) (2025-04), [t/96773](https://forum.obsidian.md/t/96773) (merged, 2025-02).
  - Plugin issues: Quick Switcher++ [#246](https://github.com/darlal/obsidian-switcher-plus/issues/246) (2026-06, not planned: "uses the builtin Obsidian searching algorithm"); Various Complements [#211](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/211), [#310](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/310), [#331](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/331); Another Quick Switcher [#250](https://github.com/tadashi-aikawa/obsidian-another-quick-switcher/issues/250).
  - A post that reads as the Obsidian team's says a core attempt stalled on "unicode complexities" and highlight offsets ([t/1655/141](https://forum.obsidian.md/t/1655/141), 2025-11-26). Diacritics are not on the roadmap.

| Quote | Link | Date |
|---|---|---|
| "Omnisearch works but I'm mostly bothered when linking notes" | [t/1655/111](https://forum.obsidian.md/t/1655/111) | 2025-02-18 |
| "For now, I just make lots of aliases for the same word. Can't this be a plugin though?" | [t/1655/128](https://forum.obsidian.md/t/1655/128) | 2025-07-08 |
| "I meant a plugin to solve this issue, not Omnisearch or Another Quick Switcher." | [t/1655/130](https://forum.obsidian.md/t/1655/130) | 2025-07-10 |
| "Start typing "[[" to link to another page whose name has a diacritic … The matches don't appear" | [t/105718](https://forum.obsidian.md/t/105718) | 2025-09-16 |
| "if a note file is called "itaú receipt.md", searching for "itau" would list the note." | [t/106484](https://forum.obsidian.md/t/106484) | 2025-10-05 |
| "I write my notes in Spanish (550+ million speakers ) and I stumble upon this almost daily." | [t/1655/145](https://forum.obsidian.md/t/1655/145) | 2026-02-20 |
| "This is would help me tremendously, first in link suggestions, then in the quick switcher and in search." | [t/1655/146](https://forum.obsidian.md/t/1655/146) | 2026-02-26 |

**Status:** partly met. The inline `[[` suggester has no fix (strict check §2.B).

### N3. Click an image in Live Preview to see and edit its Markdown again (opt out of the 1.13 image widget)
- **Who:** people who work heavily with images, Vim users, and anyone who edits image paths, alt text or sizes. This arrived with 1.13 public (2026-07-30).
- **Workarounds:** select the image and press Enter (Tab exposes the size), or switch to source mode. Some themes (Minimal) had to be updated before Enter worked (#6).
- **Frequency:**
  - FR [t/116732](https://forum.obsidian.md/t/116732): 31 L, 12 P in 2 months.
  - Related: [t/117413](https://forum.obsidian.md/t/117413) ("always show the link for embedded images"); Vim help [t/117839](https://forum.obsidian.md/t/117839) (12 P); bug [t/117440](https://forum.obsidian.md/t/117440) (the new image UI breaks link updates).

| Quote | Link | Date |
|---|---|---|
| "Previously, clicking an image immediately revealed its Markdown code, which made it quick and natural to edit" | [t/116732/3](https://forum.obsidian.md/t/116732/3) | 2026-08-04 |
| "the new image system is not working at all for me." | [t/116732/4](https://forum.obsidian.md/t/116732/4) | 2026-08-05 |
| "Some user may prefer to have the textual link always displayed." | [t/117413](https://forum.obsidian.md/t/117413) | 2026-08-16 |
| "image links are the only ones requiring an extra mouse interaction" | [t/116732/8](https://forum.obsidian.md/t/116732/8) | 2026-08-18 |
| "Spending minutes to do something that took literally 1 second before!" | [t/116732/10](https://forum.obsidian.md/t/116732/10) | 2026-08-26 |
| "it's impossible to use Vim navigation in the preview-mode to edit the markdown of image files." | [t/117839](https://forum.obsidian.md/t/117839) | 2026-08-31 |

**Status:** unmet. The one plugin that did this removed the feature. The risk of a native fix is high (strict check §2.C).

### N4. Bold and italic break next to Chinese or Japanese punctuation in Live Preview
- **Who:** Chinese and Japanese writers. It happens more often with AI-pasted text.
- **Workarounds:**
  - Spaces, zero-width spaces, or a `\` before markers ([28934/51](https://forum-zh.obsidian.md/t/topic/28934/51)).
  - Three Linter custom regexes that "took about a month" to get right ([28934/53](https://forum-zh.obsidian.md/t/topic/28934/53), 2026-02-28).
  - The CJK Bold Fix plugin (2026-02).
- **Frequency:**
  - FAQ thread [forum-zh 28934](https://forum-zh.obsidian.md/t/topic/28934): 52 P, 5,173 V, 2024-01 to 2026-07.
  - Duplicates go back to 2021 (6004, 19201, 52130, 62492).
  - Japanese blog posts 2026-02 and 2026-07; English forum [t/106859](https://forum.obsidian.md/t/106859) (2025-10).
  - Root cause: CommonMark flanking rules ([commonmark-spec #650](https://github.com/commonmark/commonmark-spec/issues/650)). Not fixed in the 1.9–1.14 changelogs.

| Quote | Link | Date |
|---|---|---|
| "[zh]" [translated: bold fails when the bolded text contains a Chinese colon] | [forum-zh 62492](https://forum-zh.obsidian.md/t/topic/62492) | 2026-06-19 |
| "2026[zh]" [translated: it's 2026 and still not fixed] | [28934/56](https://forum-zh.obsidian.md/t/topic/28934/56) | 2026-07-09 |
| "[zh]bug[zh]" [translated: unbelievable — found it today, didn't expect such an old bug] | [28934/57](https://forum-zh.obsidian.md/t/topic/28934/57) | 2026-07-12 |
| "[zh]…[zh]" [translated: (CJK Bold Fix) misbehaves… unexplained rendering errors] | [28934/55](https://forum-zh.obsidian.md/t/topic/28934/55) | 2026-03-21 |
| "[zh]" [translated: if bold ends with [zh] the rest of the line turns bold] | [laboradian](https://laboradian.com/obsidian-highlighting-bug/) | 2026-07-24 |
| "[zh]**[zh]**[zh]" [translated: in Japanese, bold gets misaligned] | [wineroses](https://wineroses.hatenablog.com/entry/2026/02/23/164319) | 2026-02-23 (sub-researcher) |

**Status:** partly met by two young, small plugins (strict check §2.D).

### N5. Search that works for Chinese and Japanese (substrings, word segmentation, relevance)
- **Who:** CJK users with large vaults.
- **Workarounds:** spaces or `line:()` queries in native search; VS Code; QuickAdd scripts; Clever Search (off-registry, about 1 GB engine); external CLIs.
- **Frequency:**
  - forum-zh [57396](https://forum-zh.obsidian.md/t/topic/57396) (1,189 V), [45445](https://forum-zh.obsidian.md/t/topic/45445) (1,792 V), [10470](https://forum-zh.obsidian.md/t/topic/10470) (77 P, 9,303 V).
  - Zenn [mikke](https://zenn.dev/kimushun1101/articles/mikke-markdown-search-cli): 117 likes.
  - Omnisearch [#471](https://github.com/scambier/obsidian-omnisearch/issues/471) (CJK tokenization, closed not planned 2025-09). [#558](https://github.com/scambier/obsidian-omnisearch/issues/558): the maintainer said "you can go ahead" but then declined the 1,400-line PR [#559](https://github.com/scambier/obsidian-omnisearch/issues/559) (2026-07-15), adding he would rather write it himself.

| Quote (sub-researcher; Omnisearch items verified) | Link | Date |
|---|---|---|
| "[zh]"[zh]"[zh]"[zh]"[zh]…[zh]" [translated: searching [zh] doesn't find [zh]… a segmentation problem] | [forum-zh 46792](https://forum-zh.obsidian.md/t/topic/46792) | 2025-02-20 |
| "[zh]" [translated: results aren't sorted by relevance at all] | [forum-zh 57396](https://forum-zh.obsidian.md/t/topic/57396) | 2026-01-05 |
| "Omnisearch…[zh]" [translated: Omnisearch misses many things that exist] | [forum-zh 59536](https://forum-zh.obsidian.md/t/topic/59536) | 2026-03-13 |
| "[zh]CLI[zh]" [translated: most note-search CLIs can barely search Japanese] | [Zenn mikke](https://zenn.dev/kimushun1101/articles/mikke-markdown-search-cli) | 2026-08-18 |

**Status:** partly met. Chinese is served by Vault Curate (5,458 downloads) and cm-chs-patch (73,988, editor word-splitting only). Japanese is weak. This is a big build in a niche that Omnisearch (1.95M downloads) owns, and "relevance" sorting is on Obsidian's roadmap.

### N6. Rendered (reading-mode) backlinks and search results, with context
- **Who:** heavy backlink users and outliners.
- **Workarounds:** Better Search Views (BSV); Query Control via BRAT; self-patching BSV with AI ([#68](https://github.com/ivan-lednev/better-search-views/issues/68)).
- **Frequency:** FR [t/195](https://forum.obsidian.md/t/195): 256 L, 70 P, open since 2020, last post 2026-09-11. BSV [#63](https://github.com/ivan-lednev/better-search-views/issues/63) has 11 comments.

| Quote | Link | Date |
|---|---|---|
| "I'm now using Better Search Views plugin to fix that." | [t/195/65](https://forum.obsidian.md/t/195/65) | 2025-02-20 |
| "Because third party plugin keep failing or contain bugs after Obsidian update." | [t/195/66](https://forum.obsidian.md/t/195/66) | 2025-02-26 |
| "this is absolutely essential and the thing that annoys me the most" | [t/195/70](https://forum.obsidian.md/t/195/70) | 2025-12-22 |
| "Better Search Views keeps crashing and crashing. The plugin hasn't been updated in 2 years." | [BSV #68](https://github.com/ivan-lednev/better-search-views/issues/68) | 2026-07-02 |
| "I used a bit of AI to patch it myself and it hasn't crashed since." | [BSV #68](https://github.com/ivan-lednev/better-search-views/issues/68) | 2026-07-11 |

**Status:** partly met (strict check §2.E).

### N7. PDF annotation that keeps working (PDF++ is unmaintained)
- **Who:** students and researchers. PDF++ has 816k downloads and gained 225k in the last 3 months.
- **Workarounds:**
  - AI-patched builds shared in issues.
  - Community PR [#572](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/572), unmerged.
  - Turning off "settings in a new window".
- **Frequency:**
  - [#569](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/569): 9 reactions, 10 comments.
  - Core FR [t/31015](https://forum.obsidian.md/t/31015): 505 L, last post 2026-09-28.
  - Mobile corruption bug [#565](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/565).
  - No push since 2025-08-30, with 165 open issues.

| Quote | Link | Date |
|---|---|---|
| "I have no access to any settings besides these two." | [#569](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/569) | 2026-08-03 |
| "there is a version that I fix this problem with AI." | [#569](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/569) | 2026-08-14 |
| "I really need obsidian PDF++ to work on mobile." | [#565](https://github.com/RyotaUshio/obsidian-pdf-plus/issues/565) | 2026-07-19 |

**Status:** partly met. PDF++ still works on desktop with the workaround. Native PDF annotation is on the roadmap. A replacement would be a very large build, and a fork is not a new tool.

### N8. A maintained calendar for daily notes
- **Frequency:** Calendar still gains about 100k installs a month on a 2021 release.

| Quote | Link | Date |
|---|---|---|
| "apparently it's not maintained anymore (last update was 5 years ago)." | [Calendar #403](https://github.com/liamcain/obsidian-calendar-plugin/issues/403) | 2026-01-26 |
| "Calendar does not work for me at all either. I can't even open it." | [#389](https://github.com/liamcain/obsidian-calendar-plugin/issues/389) | 2025-06-10 |
| "Calendar settings page is blank and throws TypeError on clean install" | [#395](https://github.com/liamcain/obsidian-calendar-plugin/issues/395) | 2025-08-26 |

**Status:** met.
- Calendar Plus (an "update of the Calendar plugin", weekly commits).
- Journals (+37k in 3 months).
- Notebook Navigator (1.0M downloads, includes a calendar).
- Calendar for Daily Notes; Calendar Bases.
- Native "Calendar view for Bases" is planned.

### N9. Weekly and monthly (periodic) notes that keep working
| Quote | Link | Date |
|---|---|---|
| "my Daily Note Ribbon Icon is visible, but my Weekly Note is not." | [Periodic Notes #258](https://github.com/liamcain/obsidian-periodic-notes/issues/258) | 2026-01-09 |
| "are you still maintaining this repo" | [#258](https://github.com/liamcain/obsidian-periodic-notes/issues/258) | 2026-08-18 |
| "For anyone still hitting this since the repo's unmaintained" | [#258](https://github.com/liamcain/obsidian-periodic-notes/issues/258) | 2026-09-02 |

**Status:** met by Journals (140k), Calendar Plus and LifeOS. Periodic Notes itself mostly works.

### N10. Automatically move completed tasks to a "Done" section or an archive file (declined by Tasks)
- **Frequency:**
  - Tasks [#2855](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2855): 83 reactions.
  - [#2856](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2856): 54 reactions.
  - Both closed not planned on 2026-06-09 in a backlog cleanup.

| Quote | Link | Date |
|---|---|---|
| "having a "completed tasks" list within the note would be super-helpful" | [#2855](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2855) | 2024-12-08 |
| "I'm currently using a custom script to move all completed tasks to another file." | [#2855](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2855) | 2025-05-18 |
| "I keep a todo today, a todo backlog, and a todo done." | [#2855](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/2855) | 2025-07-15 |

**Status:** met; crowded. The registry has 24 matches:
- Archiver (37k), Completed Area (9.9k), Completed Tasks (4.6k), To-Do to Done Mover, CheckSorted, Move Completed Tasks, DoneDrop, Smart Done Mover (with Tasks support), and more.

### N11. Record the time of day on task completion and on due or scheduled dates (declined by Tasks)
- **Frequency:**
  - Tasks [#3306](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/3306): 38 reactions, closed not planned 2026-06-09.
  - [#3307](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/3307): 57 reactions, open.
  - [#3372](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/3372): date format, 43 reactions, not planned.

| Quote | Link | Date |
|---|---|---|
| "so we can see what time we marked something as done" | [#3306](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/3306) (from 2022 discussion) | 2025-02-06 |
| "Strongly waitong for this feature!" | [#3306](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/3306) | 2025-08-17 |
| "Following up on this! Want real bad!" | [#3306](https://github.com/obsidian-tasks-group/obsidian-tasks/issues/3306) | 2025-09-05 |

**Status:** partly met.
- Checkbox Time Tracker (4.7k) stamps the time on check-off.
- TaskNotes (1.86M) and Operon support times.
- Tasks Datetime (417).
- A companion that writes times *into Tasks' own format* would fight Tasks' parser.

### N12. Tables with merged cells and multi-line cells (Table Extended is abandoned)
| Quote | Link | Date |
|---|---|---|
| "The plugin has not been updated in ages, has some errors and no viable forks." | [t/110965](https://forum.obsidian.md/t/110965) | 2026-02-09 |
| "With all of the changes to Obsidian lately, old and/or unmaintained plugins will surely have issues." | [t/110965/5](https://forum.obsidian.md/t/110965/5) | 2026-02-11 |
| "Formatting Markdown tables no longer works in Live Preview mode after upgrade to Obsidian 1.13" (issue title) | [Sheets Extended #95](https://github.com/NicoNekoru/obsidan-advanced-table-xt/issues/95) | 2026-07-30 |

Also: Advanced Tables "[Merge Cells](https://github.com/tgrosinger/advanced-tables-obsidian/issues/323)" (17 reactions).

**Status:** partly met. Sheets Extended (63k; Live Preview broken on 1.13), Rich Table (5.2k, new), Structural Tables (1.6k), HTML Tables (1.3k).

### N13. Closing a tab should return to the previously active tab (changed in 1.10)
- **Frequency:** FR [t/107675](https://forum.obsidian.md/t/107675) (27 L) and [t/106821](https://forum.obsidian.md/t/106821) (12 L).

| Quote | Link | Date |
|---|---|---|
| "Yeah, todays update broke my workflow." | [t/107675/2](https://forum.obsidian.md/t/107675/2) | 2025-11-11 |
| "Activating the right tab just destroyed my UX in Obsidian." | [t/106821/5](https://forum.obsidian.md/t/106821/5) | 2025-11-13 |
| "there are no plugins that work around it nicely" | [t/107675/9](https://forum.obsidian.md/t/107675/9) | 2026-04-01 |

**Status:** met (small).
- A plugin was announced in-thread on 2026-08-31.
- Others: Close and Switch to Recent Tab, Recent Tab Switcher, TabJump.
- Users also built a QuickAdd macro as a workaround.

### N14. Edit embedded (transcluded) notes in place
- **Frequency:** FR [t/15339](https://forum.obsidian.md/t/15339): **1,079 L**, 207 P, last post 2026-07-18.

| Quote | Link | Date |
|---|---|---|
| "This is a truly critical modern feature that can significantly reduce friction." | [t/15339/217](https://forum.obsidian.md/t/15339/217) | 2026-05-09 |
| "I've used … sync-embeds … a little bit as a workaround for this not being a first-class feature" | [t/15339/219](https://forum.obsidian.md/t/15339/219) | 2026-06-29 |
| "+1 for this to solve the problem on One single massive daily note" | [t/15339/220](https://forum.obsidian.md/t/15339/220) | 2026-07-18 |

**Status:** partly met. Sync Embeds (26k), Embed Editor (1.4k), Mirror (1.3k). Users want it in core, which is a hard CodeMirror problem.

### N15. Fold or unfold all headings to level N with a hotkey
- **Frequency:** FR [t/8276](https://forum.obsidian.md/t/8276): 151 L, 56 P, last post 2026-05-26.

| Quote | Link | Date |
|---|---|---|
| "This would be a huge help for navigating larger notes." | [t/8276/52](https://forum.obsidian.md/t/8276/52) | 2024-10-26 |
| "for example, fold all H1, fold all H1+H2." | [t/8276/53](https://forum.obsidian.md/t/8276/53) | 2025-02-14 |
| "Two of the most frequently-suggested workarounds (Creases and the Fold All Headings) are not feasible substitutes" | [t/8276/57](https://forum.obsidian.md/t/8276/57) | 2026-05-26 |

**Status:** met.
- Creases (45.6k). The poster called it abandoned, but it released on 2026-05-12.
- Outline Level Fold (647, 2026), Structure Commander (568).

**Smaller CJK needs from the sub-researcher (all partly met or met):**
- **First-line indent consistent across Live Preview, Reading and PDF** ([forum-zh 30218](https://forum-zh.obsidian.md/t/topic/30218), 7,994 V; quote "[zh]" [translated: edit and reading mode being inconsistent is hard to accept], 2024-05-06). Plugins: Jisage 4.4k, heti 3.5k (stale), and three plugins from Jul–Aug 2026 with under 1.1k downloads each.
- **Cleaning pasted Chinese text** (punctuation width, spaces). Linter, Easy Typing and Text Format own this.
- **Japanese vertical writing** (Tategaki 4.1k, Tate, TsumugiMark). Fragmented, but niche.
- **Chinese-style heading numbering** (Auto Headings, 2026-07). Met.
- **Pinyin search** (Fuzzy Chinese Pinyin, 31.9k). Met.
- **Bilibili timestamps** (Media Extended v3 plus mx-bili; Smart Media Notes). Low volume.

**Also checked and found met:**
- Export many notes or a folder to one PDF: Better Export PDF has "Export folder to PDF", and the forum idea [t/34323](https://forum.obsidian.md/t/34323) had 160 L.
- Display a title instead of the filename: Front Matter Title, maintained.
- Date pickers; tray (7 plugins); read-only mode (several); regex replace commands (Regex Quick Actions, Replace Commands); checkboxes in tables; draw.io (successor draw.io at 56k); mind maps; disabling auto-save (Autosave Control); graph node positions (Persistent Graph); remembering scroll position (Remember cursor position at 188k, plus 7 more); local version history (Edit History, Time Machine, and others); default template (Default Template, Templater); Shell commands' 1.13 settings bug (workaround: turn off settings-in-a-window).

---

## 2. Strict existing-solution checks (strongest five)

Table columns: downloads | +3 mo | last release | stars | last push | open issues | repo created.

### 2.A N1 — date format independent of the OS
**Registry queries:**
- `date format`, `date display`, `iso 8601|iso date`, `dd/mm|dd\.mm|yyyy-mm-dd|mm/dd`, `locale`.
- `date ?picker|date (property|properties)|(property|properties).*(date|calendar)|datetime`.
- `pretty.?propert|propert(y|ies).*(style|format|appearance|display)`.

| Plugin | DL | +3 mo | Release | ★ | Push | Issues | Created | Meets the need? |
|---|---|---|---|---|---|---|---|---|
| Pretty Properties | 325,311 | +108,524 | 2026-09-30 | 358 | 2026-09-30 | 29 | 2025-06-04 | **Yes.** A moment.js format for date and datetime properties, Bases opt-in ("disabled by default, because they can make bases slower"). Its README lists "set custom date format", but its **registry description does not mention dates**. |
| Datetime Language Changer | 3,237 | +318 | 2023-10-31 | 5 | 2023-10-31 | 0 | 2023-10-27 | No. It changes moment's locale, not the property widget. |
| Human Readable Dates | 1,480 | +1,341 | 2026-08-31 | 2 | 2026-08-31 | 2 | 2025-08-29 | No. Relative dates in the editor. |
| Relative Dates | 1,074 | +951 | 2026-05-15 | 4 | 2026-05-15 | 3 | 2025-08-11 | No. |
| Date Nullable Time | 64 | +64 | 2026-08-10 | 0 | 2026-08-10 | 0 | 2026-08-03 | No. |
| Datepicker | 10,590 | +1,256 | 2025-07-20 | 23 | 2025-07-20 | 11 | 2024-06-28 | No. It inserts dates in the body. |
| Metadata Menu | 348,777 | +91,730 | 2026-02-11 | 729 | 2026-02-11 | 220 | 2022-06-29 | No. Typed fields; it does not change the native date widget. |

**Native:**
- None. The only related changelog line (1.9 era) says formula and file properties now display dates "according to your OS locale".
- Not on the roadmap.

**In-app search words** users would type: "date format", "date display", "ISO date", "DD.MM.YYYY", "property date". A search for "date format" returns two unrelated plugins (Daily notes sorter, 320; Auto Date on Open, 81). **Nobody owns these words.**

**Verdict: met functionally, not findable.**
- The need is real and large, and Windows users are central to it.
- A new single-purpose plugin would add findability and simplicity (Properties panel, Bases on by default, date-time 24h, per-device), not a capability nobody has.
- Risk: Pretty Properties adds "date format" to its description, and the gap closes overnight. An independent critique (L-029) would call this a near-duplicate.

### 2.B N2 — accent-insensitive linking and search
**Registry queries** (at least three wordings each, in English):
- `accent`, `diacrit`, `insensitive|normali[sz]`, `umlaut|unicode|latin`, `ignore.*(accent|case)`.
- `link (suggest|autocomplet|complet)`, `wiki ?link`, `fuzzy.*(switcher|search)`, `quick ?switcher`.

| Plugin | DL | +3 mo | Release | ★ | Push | Issues | Created | Meets the need? |
|---|---|---|---|---|---|---|---|---|
| Omnisearch | 1,950,976 | +385,223 | 2026-09-05 | 2,159 | 2026-09-19 | 83 | 2022-04-10 | **Partly.** Vault search ignores diacritics (setting) and can "directly insert a `[[link]]` from the search results" (a modal). It does not change the inline `[[` suggester, the quick switcher, find-in-file or backlinks. Users call it slow ("most of the time it breaks obsidian", #128). |
| Another Quick Switcher | 233,222 | +96,650 | 2026-09-09 | 403 | 2026-09-09 | 45 | 2021-09-18 | **Partly.** Its own switcher normalizes diacritics ([#250](https://github.com/tadashi-aikawa/obsidian-another-quick-switcher/issues/250)). It does not cover inline linking. |
| Various Complements | 611,922 | +107,156 | 2026-08-26 | 940 | 2026-08-26 | 57 | 2021-02-06 | **Partly.** "Treat accent diacritics as alphabetic characters" applies to its own word-triggered completions, including internal links ([#331](https://github.com/tadashi-aikawa/obsidian-various-complements-plugin/issues/331)). This is a heavyweight autocomplete system, not the `[[` popup. |
| Quick Switcher++ | 494,585 | +100,841 | 2026-09-12 | 637 | 2026-09-24 | 22 | 2020-08-15 | No. Declined ([#246](https://github.com/darlal/obsidian-switcher-plus/issues/246), 2026-06). |
| Diacritics-Free Search | 284 | +214 | 2026-06-11 | 0 | 2026-06-11 | 2 | 2026-05-04 | **Partly.** In-file find and replace plus vault search ignoring diacritics, with Hebrew, Arabic and Latin. No link suggester or switcher. |
| At People | 4,480 | +2,001 | 2026-08-23 | 19 | 2026-08-23 | 0 | 2025-10-24 | No. Accent-insensitive only for `@` people links. |
| Boost Link Suggestions | 1,789 | +334 | 2026-09-06 | 14 | 2026-09-06 | 0 | 2022-12-18 | No. Its own `b[` trigger, sorted by link count, no normalization. |

**Native:**
- Not in 1.9–1.14.
- Not on the roadmap.
- Team post (2025-11-26): an attempt stalled on Unicode or highlight-offset complexity.

**In-app search words:** "accent", "accents", "diacritics", "ignore accents", "accent insensitive". A search for "accent" returns At People and accent-*color* plugins. "Diacritics" returns Diacritics-Free Search (284) and two unrelated plugins. One user only learned the word "diacritic" from the forum ([t/1655/109](https://forum.obsidian.md/t/1655/109)), so a name should say "accents" in plain words.

**Negative claim** "no plugin makes the `[[` link suggester accent-insensitive": verified with 9 queries plus the READMEs and issues of Omnisearch, Another Quick Switcher, Various Complements, Quick Switcher++, Boost Link Suggestions and Diacritics-Free Search.

**Feasibility:**
- Plugins already patch the core link suggester (Rendered Block Link Suggestions, Quick Preview), so a `[[` suggester with NFD-folded matching is buildable.
- Add an accent-insensitive switcher and in-file find, then test with French, Spanish, Vietnamese and Arabic fixture vaults on Windows 10, with wdio-obsidian-service end to end.
- Risk: the core suggester's internals change between releases (BSV is the cautionary case).

**Verdict: partly met, with the most-cited piece unmet.** Search and switching are covered by big plugins. The everyday act of linking with `[[` is not.

### 2.C N3 — click an image to reveal its Markdown (1.13 image widget)
**Registry queries:**
- `reveal`, `image (link|markdown|source|syntax|code)`.
- `(click|edit).*image|image.*(click|edit)`, `live preview.*image|image.*live preview`.
- `image.*(syntax|embed code|wikilink|link text|raw)`, `(show|reveal|expose|display).*(link|markdown|source)`.

| Plugin | DL | +3 mo | Release | ★ | Push | Issues | Created | Meets the need? |
|---|---|---|---|---|---|---|---|---|
| Better Live Preview Image | 1,626 | +1,330 | 2026-08-10 | 3 | 2026-08-10 | 0 | 2026-05-25 | **No (anymore).** Its description still says "Markdown reveal", but its CHANGELOG 1.1.0 says it "Remove[d] the custom click-to-reveal Markdown … in favor of Obsidian's native editing flow". |
| Image Kit | 378 | +378 | 2026-09-21 | 0 | 2026-09-21 | 0 | 2026-09-13 | No. Layout menu (size, align, caption) for 1.13+. |
| Pixel Perfect Image | 28,272 | +8,270 | 2026-08-17 | 94 | 2026-08-23 | 2 | 2025-01-06 | No. Right-click menu, exact resize. |
| Image Toolkit | 135,417 | +23,818 | 2025-09-01 | 74 | 2025-09-01 | 18 | 2025-08-27 | No. A viewer. |
| Image Converter | 539,321 | — | — | — | — | — | — | No. Conversion and editing. |

**Native:** 1.13 added Enter to reveal and Tab for size. Users ask for an option, and the forum shows two months of complaints. Obsidian reverted Temml to MathJax within a week of a backlash (1.14.0 → 1.14.1), so **the risk of a native fix is high**.

**In-app search words:** "image markdown", "image link", "show image link", "old image behavior". Nobody owns them.

**Verdict: unmet now, but a poor bet.**
- The only attempt was withdrawn because it fought the core.
- It depends on internals.
- A native option would make the plugin obsolete (L-026).

### 2.D N4 — CJK emphasis in Live Preview
**Registry queries:**
- `cjk`, `bold.*(chinese|japanese|cjk)`, `emphasis`.
- `flanking|commonmark|cjk.?friendly`, `[zh]|[zh]|[zh]|[zh]|[zh]`.
- `(bold|italic|emphasis).*(render|fix|broken|punctuation)`, `chinese.*(markdown|render|format)`.

| Plugin | DL | +3 mo | Release | ★ | Push | Issues | Created | Meets the need? |
|---|---|---|---|---|---|---|---|---|
| CJK Bold Fix | 1,667 | +700 | 2026-02-22 | 9 | 2026-09-19 | 2 | 2026-02-22 | **Partly.** Live Preview only, line-by-line regexes. Open bugs [#1](https://github.com/ebibibi/obsidian-cjk-bold-fix/issues/1) and [#2](https://github.com/ebibibi/obsidian-cjk-bold-fix/issues/2); [#3](https://github.com/ebibibi/obsidian-cjk-bold-fix/issues/3) fixes English emphasis inside mixed lines. A user calls it buggy (28934/55), another installed it happily (laboradian). The author is active. |
| Live Preview Bold Fix | 269 | — | — | — | — | — | — | Partly. "inconsistent bold rendering around punctuation … in mixed CJK/English text". |
| Japanese Novel Tool | 788 | +788 | 2026-09-20 | 2 | 2026-09-27 | 0 | 2026-06-09 | No. Ruby, emphasis marks, indent. |

**Native:**
- Not fixed in 1.9–1.14.
- Reading view renders correctly, per CJK Bold Fix's README.

**In-app search words:** "CJK bold", "Chinese bold", "Japanese bold". CJK Bold Fix owns them. Chinese and Japanese words ([zh], [zh]) match nothing, because descriptions are English. Program repos must be English (§3B), but an English description can say "Chinese/Japanese bold and italic".

**Verdict: partly met.**
- The need is real (2021–2026, zh and ja), small in scope, and easy to test with fixtures.
- It is a duel with an active incumbent that owns the search words.
- It is niche, and Obsidian could fix it upstream (CodeMirror Markdown parser option).

### 2.E N6 — rendered backlinks and search results
**Registry queries:**
- `backlink`, `query control|search (panel|pane|view)|global search`.
- `(render|rendered|reading).*(backlink|search|mention)|(backlink|mention).*(render|context|preview)`, `better search views|search result`.

| Plugin | DL | +3 mo | Release | Push | Meets the need? |
|---|---|---|---|---|---|
| Better Search Views | 50,066 | +5,589 | 2024-12-01 | 2024-12-01 | **Mostly, on desktop.** Crashes on mobile since 1.12.x. The maintainer could not reproduce it (2026-05-29). |
| Query Control | 606 | — | — | — | Partly. A fork, "experimental". |
| Link Tree | 14,822 | — | — | — | Partly. An editable recursive links/backlinks view. |
| Influx | 31,392 | — | — | — | Partly. Backlinked clippings rendered in the footer. |
| Core Search Assistant | 35,813 | +3,282 | 2026-08-23 | — | Partly. Card previews. |

**In-app search words:** "backlinks", "search results". Better Search Views owns them.

**Verdict: partly met.** The users who are stuck are mostly on mobile. Out of filter.

---

## 3. Ranking

Scores 1–5 use `playbook/research.md` §3: real 30 %, unmet 20 %, serve well 20 %, findable 15 %, improvable 15 %. Differences under one point on a criterion are noise.

| Rank | Need | Real | Unmet | Serve | Find | Improve | **Weighted** | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | N2 accent-insensitive `[[` linking, switcher, find | 5 | 3.5 | 3.5 | 4 | 4 | **4.10** | partly met; inline linking unmet |
| 2 | N1 date and date-time display format, independent of the OS | 5 | 2 | 4 | 4.5 | 3 | **3.83** | met functionally (Pretty Properties); unfindable |
| 3 | N4 CJK bold and italic in Live Preview | 4 | 3 | 3 | 3 | 3 | **3.30** | partly met (CJK Bold Fix, 1.7k) |
| 4 | N5 CJK full-text search | 4.5 | 3 | 2.5 | 2 | 3.5 | **3.28** | partly met; big build |
| 5 | N3 image Markdown reveal (1.13) | 3.5 | 4 | 2.5 | 3 | 2 | **3.10** | unmet; high risk of a native fix |
| 6 | N12 merged and multi-line table cells | 3.5 | 2.5 | 3 | 2 | 3 | 2.90 | partly met |
| 7 | N14 edit embeds in place | 4.5 | 2 | 2 | 2.5 | 2.5 | 2.90 | partly met |
| 8 | N11 task completion time | 3.5 | 2.5 | 3 | 2.5 | 2.5 | 2.90 | partly met; fights the Tasks format |
| 9 | N6 rendered backlinks and search | 3.5 | 2 | 3 | 2 | 3 | 2.80 | partly met (mobile breakage) |
| 10 | N7 PDF annotation (PDF++ stranded) | 4.5 | 2.5 | 1.5 | 2 | 2 | 2.75 | partly met; native planned |
| 11–15 | N8 calendar, N9 periodic notes, N10 task archiving, N13 tab MRU, N15 fold to level | — | 1 | — | — | — | — | met |

---

## 4. Bottom line (blunt)

1. **The Obsidian registry is saturated.** For 13 of the 15 needs, the function already exists in one or more plugins, often several made in 2026. Stranded users of dead plugins already have maintained successors. A new plugin in a download-sorted list sits below both.
2. **Only one candidate has a clearly unmet core: N2, accent-insensitive linking.** It has a six-year, 786-like request; daily pain across many languages; behavioural workarounds (alias farms, duplicated filenames, regex tricks); and an explicit "can't this be a plugin?". Big plugins cover search and switching, but the inline `[[` suggester, the act users do most, has no fix. The search words ("accents", "diacritics") are effectively unowned. It is testable on Windows 10 with fixture vaults. The main risk is that it patches a core suggester that Obsidian can change; the risk of a native fix is low, since the team said its attempt stalled.
3. **N1 (date format) is the cleanest findability play but not an unmet need.** Pretty Properties (325k, maintained) already does it. A focused plugin named in the users' words would probably get found, but a critique would rightly call it a near-duplicate (L-029). If chosen, it must be framed and evaluated as "make an existing capability findable and simpler for Windows users", and the developer should accept that the incumbent can close the gap by editing one description line.
4. **N4 (CJK emphasis) is a real, small, testable niche with an active incumbent.** It is a duel, not an open field. Keep it as a runner-up, or as the second iteration of a "CJK typesetting" idea.
5. **Avoid N3 (image reveal) and the PDF++, Calendar and Kanban stranded markets.** Each is likely to be fixed natively, or already has successors, or needs a fork rather than a new tool.

**Next steps if N2 is pursued** (Gate items still to do):
- Prototype a `[[` suggester with folded matching on a French/Spanish/Vietnamese vault under Windows.
- Check how it coexists with Various Complements and Omnisearch.
- Read the full Various Complements docs on internal-link completion.
- Run the independent multilingual landscape audit (French, Spanish, German and Portuguese searches of forums and blogs) before an ADR (L-034).
