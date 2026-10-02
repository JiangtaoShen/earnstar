<!-- Copied from the private working file lab/s024/g4/agentA/evidence.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# G4 / agent A: evidence for two candidate needs (researchers who revise papers)

Collected 2026-10-03 (UTC), read-only. Sources: Stack Exchange API (tex, academia), GitHub API (repos, issues),
GitLab API, CTAN API, HN Algolia API, WebFetch/WebSearch, and the built-in browser (for CSDN, which blocks fetch).
Raw pulls are in `raw/` (SE excerpts, issue bodies, READMEs, HN JSON). No usernames are recorded.
Every quotation below is verbatim text fetched in this session (HTML stripped, at most 20 words). Chinese text is translated and marked [translated].
Blocked from this machine: zhihu.com (403), purplelink.llc (filtered by a corporate web filter), and the Hobson Google Site (login redirect). For those, only search-result descriptions are used, and they are never quoted.

---

## NEED 1: "Produce a marked-up (track-changes) version of my revised LaTeX manuscript that actually compiles"

### Evidence table (people's own words)

"Revision?" = the post ties the problem to a journal revision, a thesis correction, or an editor's request.

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Revision? | Workaround? |
|---|---|---|---|---|---|
| 1 | "The editor has asked for a track changes file." / "I get a compilation error with the diff file (but the individual files do compile)" | https://tex.stackexchange.com/questions/765514 | 2026-08-17 | yes (journal) | yes: Overleaf + Tom Hejda's latexdiff recipe; "If I remove the tables in main2.tex, the diff file does compile" |
| 2 | "editing the diff file for each equation and table will take a lot of time and there is a deadline" | https://tex.stackexchange.com/questions/702076 | 2023-11-23 | yes (research papers) | yes: `--math-markup=none`, `PICTUREENV=tabular` (suppresses markup). Asker afterwards: "How you people mark changes in the tabular environment or equation environment ?" ([comment](https://tex.stackexchange.com/questions/702076#comment1746739_702076), 2023-11-25) |
| 3 | "I am trying to get a diff between two versions of my thesis." / "So I asked ChatGPT…" | https://tex.stackexchange.com/questions/757504 | 2025-12-25 | yes (thesis) | yes: `VERBATIMLINEENV`, then an unmerged latexdiff PR or a personal fork |
| 4 | "latexdiff will insert a \DIFaddend or a \DIFaddbegin on the same line as the \caption command and causes errors" | https://tex.stackexchange.com/questions/727654 (= latexdiff issue #309) | 2024-09-30 | n/a | yes: `--graphics-markup=NONE` or `PICTUREENV=longtable`, which drops the markup |
| 5 | "those changes need to be exactly right on the diff.pdf file" | https://tex.stackexchange.com/questions/735578 | 2025-01-22 | n/a | no answer. The maintainer says the flat diff is a basic design limit |
| 6 | "The whole point of the exercise is to reduce the amount of manual work needed" | https://tex.stackexchange.com/questions/752825#comment1882731_752825 | 2025-11-11 | n/a | yes: pre-process with de-macro, flatten, tweak by hand |
| 7 | "I often need to do a few tweaks by hand." (a different user, same thread) | https://tex.stackexchange.com/questions/752825#comment1881683_752825 | 2025-11-03 | n/a | yes: manual edits to diff.tex |
| 8 | "I am submitting a minor revision of my manuscript." / \deleted on a whole section "does not work as expected" | https://tex.stackexchange.com/questions/766504 | 2026-09-19 | yes (journal) | yes: the `changes` package with manual \added/\deleted |
| 9 | "Clearly, there is no point in using changes if the old text must be modified." | https://tex.stackexchange.com/questions/755991 | 2025-12-10 | n/a | yes: lua-ul with LuaLaTeX |
| 10 | "When is use the the track change command added like below [code] no output is generated." | https://tex.stackexchange.com/questions/758595 | 2026-01-22 | n/a | yes: a savebox wrapper |
| 11 | "I would like to report an error I have been encountering while comparing two tables with latexdiff." | https://github.com/ftilmann/latexdiff/issues/298 | 2024-03-13 | n/a | no (closed) |
| 12 | "I ended up removing the entire `\mbox` and using `\text` to make the diff work for my immediate use case" | https://github.com/ftilmann/latexdiff/issues/313 | 2024-12-18 | n/a | yes: rewrote the source ("kind of a tedious process") |
| 13 | "This fails to compile, as the arguments of `\frac` have been split up." | https://github.com/ftilmann/latexdiff/issues/322 | 2025-10-20 | n/a | yes: add spaces in the source |
| 14 | "the syntax is broken due to unmatched curly brackets" | https://github.com/ftilmann/latexdiff/issues/328 | 2026-01-16 | n/a | no |
| 15 | "the generated file no longer compiles to pdf with pdflatex" | https://github.com/ftilmann/latexdiff/issues/294 | 2024-02-15 | n/a | no (open) |
| 16 | "useful to review a document with line numbers because the diff document would have the exact same layout" | https://github.com/ftilmann/latexdiff/issues/338 | 2026-07-28 | yes (review) | asks for an additions-only style |
| 17 | "the bibliography and the "\citep{}" inside my thesis don't work (they come up as ??? on the file)" | https://github.com/am009/git-latexdiff-web/issues/2 | 2024-09-16 | yes (thesis corrections on Overleaf) | used the latexdiff.cn web service |
| 18 | "I had to dig up a Perl script that could handle the task within the LaTeX framework." | https://dynamicecology.wordpress.com/2025/09/04/i-wish-journals-didnt-ask-for-ms-revisions-with-tracked-changes/#comment-125426 | 2025-09-04 | yes (journal) | yes: latexdiff |
| 19 | "The end result needs some manual tweaking, but it works for me." | same post, #comment-125456 | 2025-09-04 | yes (journal) | yes: latexdiff, and also "I just highlight the added text and do not show deleted parts." |
| 20 | "If the generated diff.tex file cannot be compiled" [translated] | https://blog.csdn.net/qq_42328201/article/details/139300015 | 2024-05-31 | yes (paper submission) | yes: copy into a new .tex file; CJKutf8 |
| 21 | "I can't get the .tex -file created by Latexdiff to compile on my maschine." | https://tex.stackexchange.com/questions/686046 | 2023-05-18 | n/a | yes: UTF-16 output from PowerShell redirection |
| 22 | "the PDF is not being produced and I only get a long log file with errors" | https://tex.stackexchange.com/questions/673192 | 2023-01-28 | n/a | yes: XeLaTeX or LuaLaTeX |
| 23 | "It works nicely but not for the bibliography." (latexdiff inside Overleaf) | https://tex.stackexchange.com/questions/690478 | 2023-07-06 | n/a | no answer |
| 24 | "The ability to run latexdiff on two files to create and compile a diff.tex would be a great improvement." | https://github.com/overleaf/overleaf/issues/397 | 2016-02-19 (+1s in 2017, 2018, 2023) | n/a | a 2023 commenter built a Telegram bot |
| 25 | "latexdiff can quite easily get confused and produce LaTeX code that won't compile." (an online LaTeX editor developer) | https://news.ycombinator.com/item?id=5163319 | 2013-02-04 | n/a | n/a |

**Builders stating the problem in their own README (2025–2026)**

| Quote | Link | Created |
|---|---|---|
| "every serious latexdiff user eventually ends up maintaining a pile of fragile pre/post-processing scripts around it" | https://github.com/GoBobr/texdiff | 2026-10-01 |
| "Plain `latexdiff` is excellent for simple papers, but major revisions often break it" | https://github.com/buaabarty/automated-latex-paper-diff | 2026-05-11 |
| "which breaks LaTeX table structure and causes "Misplaced \cr" compilation errors" | https://github.com/feathertop/latexdiff-notables | 2026-04-05 |
| "real-world multi-file `biblatex`/`biber` Overleaf projects that vanilla `latexdiff --flatten` mishandles" | https://github.com/Trailokaya/latexdiff | 2026-06-08 |
| "fixes the \DIFadd and \DIFdel commands that latexdiff inserts in math formulas, so the LaTeX file compiles correctly" [translated] | https://github.com/Tegredum/researchTool-py-011-latexdiffFormulaFix | 2026-02-01 |
| "daily around till now 200+ diffs created" (self-reported usage of a browser latexdiff tool) | https://news.ycombinator.com/item?id=48567337 | 2026-06-17 |

**Counter-evidence (record it, don't hide it)**
- "latexdiff does what you need and is super easy to run on the pair of before/after source files" ([DE #comment-125477](https://dynamicecology.wordpress.com/2025/09/04/i-wish-journals-didnt-ask-for-ms-revisions-with-tracked-changes/#comment-125477), 2025-09-06).
- The latexdiff maintainer: "Most of the times, it works fine with changes in tabular environments and equations." ([comment](https://tex.stackexchange.com/questions/702076#comment1746786_702076), 2023-11-25).
- An academia.SE answer: "I don't think that any track changes in either LaTeX or pdf is necessary." ([187276](https://academia.stackexchange.com/questions/187276), 2022-07-25). Many journals accept red-coloured text instead (accepted answer on [42519](https://academia.stackexchange.com/questions/42519): "I simply colour them in red").
- Editors disagree about whether tracked versions are useful at all. The Dynamic Ecology post (2025-09-04) argues they are "useless at best". A large-journal editor in the comments requires them ([#comment-125478](https://dynamicecology.wordpress.com/2025/09/04/i-wish-journals-didnt-ask-for-ms-revisions-with-tracked-changes/#comment-125478)).

**Independent people.** 23 users (rows 1–23), 19 of them in 2024–2026. Of these, 10 tie the problem explicitly to a journal revision, a thesis correction, or an editor's request. On top of that, at least 7 builders wrote tools for it in 2026. The rest hit the same failure mode ("diff.tex doesn't compile") but give no context.

### Frequency signals
- tex.SE "Track changes" in LaTeX (2012): **199,180 views, 271 votes** ([65453](https://tex.stackexchange.com/questions/65453)). "Using latexdiff with git": 48,774 views. "How to highlight citations in a revised manuscript": 37,948 views.
- tex.SE tag [latexdiff]: 174 questions in total, 20 since 2023, and recent ones get about 80–900 views. tex.SE as a whole is in decline (one 2025 asker went to ChatGPT first), so treat these counts as a floor. A text search for "track changes" finds 311 posts, 58 of them since 2023.
- academia.SE "Standard method for showing changes made to a LaTeX manuscript": 7,139 views ([42519](https://academia.stackexchange.com/questions/42519)). "How should I highlight extensive changes in a revised manuscript?": 11,045 views.
- latexdiff repo ([ftilmann/latexdiff](https://github.com/ftilmann/latexdiff)): 677 stars, 269 issues ever filed. **81 issues contain "compile"** and 31 mention table/tabular. 36 issues were opened since 2024. The most-reacted open issues are "error with booktabs" (#111, 11 reactions) and "Table layout breaks when removing a row" (#5, 16 comments).
- GitHub repos matching "latexdiff", by creation year: 2020: 8, 2021: 5, 2022: 15, 2023: 8, 2024: 11, 2025: 10, **2026 (to Oct 3): 27**. That is 144 in total and 48 since 2024, almost all with 0–15 stars. The 2026 jump looks like individuals building one-off fixes with AI coding tools.
- CSDN: dozens of latexdiff how-to and error posts. The related-post list shows read counts such as "3[zh]+" (30k+) and "1[zh]+" (10k+), with titles like "latexdiff[zh]_latexdiff [zh]" ("Using latexdiff and the pitfalls I hit: equation errors" [translated]).
- Journals push this format. PLOS: "PLOS recommends the use of latexdiff to track changes in the manuscript PDF during review" ([PLOS LaTeX](https://journals.plos.org/plosone/s/latex)). Elsevier: "you will usually be asked for two files", one marked up and one clean ([Elsevier support](https://www.elsevier.support/publishing/answer/how-do-i-submit-my-revision-with-tracked-changes)).

### Workarounds people use
1. **Manual colour macros**: `\textcolor{red}`, a custom `\rev{}`, `soul` `\hl`, or the `changes` package (`\added`, `\deleted`, `\replaced`, plus the `final` option). These also break, on `\cite{a,b}` (#9), whole sections (#8), lists (#10), and IEEE two-column layouts.
2. **latexdiff with flags**: `--math-markup=none|whole`, `PICTUREENV=tabular|longtable`, `--graphics-markup=NONE`, `--flatten`, `--append-textcmd`, `--exclude-safecmd=cite`. Each of these mostly *suppresses* markup inside the problem area; it does not mark it correctly.
3. **Hand-editing diff.tex** until it compiles (#2, #6, #7, #19), or **removing tables and putting them back** afterwards (latexdiff-notables).
4. **Changing the source** so latexdiff copes (#12, #13; tex.SE 681408: "not use parentheses around each item").
5. **Overleaf** latexmkrc or `\ShellEscape` recipes ([Overleaf article](https://www.overleaf.com/learn/latex/Articles/How_to_use_latexdiff_on_Overleaf)). Because of the 24-hour history limit, free users must keep a copy of old.tex in the project, and they hit the 10-second free compile limit.
6. **Online services**: upload two .tex files or two zips (see below).
7. **Show additions only** (DE #125456; latexdiff #338).
8. **Platform fixes**: encoding (UTF-16 from PowerShell `>`), installing Perl on Windows/MiKTeX (tex.SE 755852, 603303), or switching the engine to XeLaTeX.

### Existing solutions

| Name | Link | Adoption | Last update | Verdict | Why |
|---|---|---|---|---|---|
| latexdiff (+ latexdiff-vc, --flatten) | https://github.com/ftilmann/latexdiff · CTAN | 677★, in TeX Live/MiKTeX; the de facto standard named by PLOS | v1.4.0 2026-01-02; pushed 2026-09-20 | **partly** | Core engine, actively maintained. Output often fails to compile on tables, longtable, booktabs, math, custom macros, minted, glossaries, and bibliographies (81 "compile" issues). The maintainer calls the flat diff a design limit. Needs Perl, which is hard on Windows. |
| git-latexdiff | https://gitlab.com/git-latexdiff/git-latexdiff | 214★ (GitLab) | activity 2026-06-25 | partly | Handles git revisions and multi-file projects. Same latexdiff engine underneath, so the same compile failures. Needs git and a shell. |
| Overleaf Track Changes | https://docs.overleaf.com/collaborating/track-changes | huge user base | current | **fails for the free plan; partly for paid** | Premium only. Plans page: Free has no track changes, "previous 24 hours only" of history, and 1 collaborator. Student plan £6.50/mo (annual), Standard £13.25/mo. Docs describe a review panel in the editor and say nothing about producing a marked-up PDF. Feature request #397 (built-in latexdiff) has been open since 2016. Free compile timeout is 10 s ([plan limits](https://docs.overleaf.com/getting-started/free-and-premium-plans/plan-limits)). |
| Overleaf latexdiff recipes | https://www.overleaf.com/learn/latex/Articles/How_to_use_latexdiff_on_Overleaf | widely linked | n/a | partly | Works on simple papers. Row 1 (2026) shows it failing on tables. Users must keep the old file in the project. |
| `changes` package | CTAN `changes` v4.2.1 (2021-07-15) | top answer on the 199k-view question | 2021 | partly | Manual marking, which needs discipline and doesn't capture edits you forgot. It breaks on sections, lists, and multi-citations (2025–2026 questions). |
| `texchanges` (new) | https://github.com/phucnht/texchanges · CTAN 0.3.0 | 3★ | 2026-08-18 | unknown (too new) | Accept/reject markup in the source, aimed at AI agents and reviewers. Bundles latexdiff for automatic diffs. |
| thelatexlab "Track Changes in LaTeX" | https://thelatexlab.com/latex-track-changes/ | unknown | live | partly | Free, runs real latexdiff server-side, accepts zips (500 KB per file, 5 MB zip). "The output is a `.tex` file", so the user still has to make it compile. |
| 3142.nl latex-diff | https://3142.nl/latex-diff/ | used by a 2026 Chrome extension | live | partly | Two single .tex files in, diff.tex out. No PDF, no projects. |
| latexdiff.cn (am009/git-latexdiff-web) | https://github.com/am009/git-latexdiff-web | 15★ | 2026-07-26 | partly | Two Overleaf zips in, PDF out. Issues report a bibliography showing "???" (#2, 2024) and "500 Internal Error" (#4, 2026). |
| latexdiff-zip / latexdiff.toftul.net | https://github.com/toftul/latexdiff-zip | 0★ | 2026-09-30 | partly | Zip or arXiv IDs in, PDF out, with figures compared side by side and a bibliography diff. Very new. |
| Purplelink LaTeX Diff | https://purplelink.llc/tools/latex-diff/ | unknown | live | partly (unverified) | Blocked from this machine. Search snippet: zips in, PDF out, "Tables are treated as opaque blocks", so edited tables are not marked. |
| Browser-only latexdiff (WebPerl) | https://github.com/StijnRis/latexdiff-online, https://github.com/jingjie00/latexdiff-ui (latexdiff.web.app) | 1★, 2★ | 2026-08 / 2026-05 | partly | Private and need no install, but produce diff.tex only and take a single file. |
| Wrappers that harden latexdiff (2024–2026) | buaabarty/automated-latex-paper-diff (table-aware, audit report, Docker); Trailokaya/latexdiff (zips, biblatex, subfiles); jiwatode-mohit/latex_diff_py; feathertop/latexdiff-notables; s3researchlab/latexdiff-with-input; manueldeprada/mdp-texdiff (todonotes); mfouesneau/rust-latexdiff; RonPhysics/Tex-change-app (Windows GUI); NoeSilva13/latex-diff (VS Code); huangpipip/Overleaf-LatexDiff (Chrome) | 0–5★ each | 2025–2026 | partly | Each fixes one slice (tables, includes, notes, citations). None is adopted. Most need TeX Live, Perl, Docker, or a shell. |
| GoBobr/texdiff (AST-based, not latexdiff) | https://github.com/GoBobr/texdiff | 0★ | created 2026-10-01 | unknown | The only "valid by construction" approach found (pylatexenc tree diff, `--check`). Built two days ago: a direct competitor to watch. |
| latexdiffcite, latexdiffr, comparxiv | twilsonco/latexdiffcite (28★), hughjonesd/latexdiffr (46★), temken/comparxiv (354★, last push 2022) | small to medium | 2025 / 2025 / 2022 | partly | Niche: citations, R Markdown, arXiv versions. |
| PDF compare: diff-pdf, Draftable, Acrobat Pro Compare | https://github.com/vslavik/diff-pdf (4,324★) | diff-pdf popular | diff-pdf 2026-03 | **fails** for this need | Visual or text diff of PDFs, not the strike-through/colour LaTeX markup journals ask for. When text reflows, every following line differs. Draftable desktop costs $129/yr (search snippet); Acrobat Pro is paid. |
| typdiff (adjacent, Typst) | https://github.com/sou1118/typdiff | 75★ in 7 months | 2026-08-20 | n/a | Signal: Typst users want the same thing. HN 2024-07-20: "The only thing I need to start writing more serious documents with Typst is an equivalent to latexdiff." |

### Search words a person with this problem types
`latexdiff not compiling` · `latexdiff alternative` · `latexdiff table error` · `latexdiff Misplaced \noalign` · `latexdiff booktabs` · `latexdiff equation error` · `latexdiff bibliography` · `latexdiff multiple files` / `--flatten` · `latexdiff overleaf` · `latexdiff online` · `track changes latex` · `track changes overleaf free` · `latex compare two versions pdf` · `marked-up manuscript latex` · `highlight changes revised manuscript latex` · `latex diff pdf` · Chinese: `latexdiff [zh]` · `latexdiff [zh]` · `latexdiff [zh]` · `latex [zh] [zh]` · `latex [zh] [zh]` · `overleaf latexdiff`.

### Verdict: **strong need, crowded, partly met**
The pain is real, recurring (at least once per revision round), deadline-driven, and voiced by 19 independent people in 2024–2026. No tool reliably compiles on real papers (tables, math, macros, bibliographies), and Overleaf's built-in option is paywalled. The caveat is that more than 40 small wrappers and at least 7 web services appeared in 2024–2026, none with traction, and an AST-based competitor launched on 2026-10-01. Winning here requires visibly better compile reliability on real manuscripts, not another wrapper.

---

## NEED 2: "Write the response-to-reviewers letter and keep it in sync with the revised manuscript"

### Evidence table (people's own words)

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround? |
|---|---|---|---|---|
| 1 | "every time I make a change to my manuscript the line numbers change a bit" | https://academia.stackexchange.com/questions/35086 | 2015-01-02 (9,067 views) | yes. Accepted answer: "leave all of the line numbers in the response as XXX until I am done with the revision" |
| 2 | "avoid having to revise the response letters to the reviewers to have it match the presumably new page numbers" | https://tex.stackexchange.com/questions/688018 | 2023-06-08 | no answer (0 answers) |
| 3 | "I'm trying to gain in efficiency in building a point-by-point response to reviewers of my scientific papers." | https://tex.stackexchange.com/questions/611962 | 2021-08-25 | yes: Hobson's quoting hack plus the qting package and sed; answer suggests `--append-textcmd` |
| 4 | "I need to ensure that the reference numbers correspond exactly to the original document's numbering." | https://tex.stackexchange.com/questions/694153 | 2023-08-23 | no answer |
| 5 | "They want a single pdf file with the letter first and the paper second." | https://tex.stackexchange.com/questions/692087 | 2023-07-27 | no answer (pdfpages is the usual route) |
| 6 | "it's required that my responses to each question be in red while the rest of the text is in black" | https://tex.stackexchange.com/questions/714283 | 2024-03-28 | yes: natbib/biblatex inside Quarto |
| 7 | "I am trying to present my reviewer response with highlighted texts." | https://tex.stackexchange.com/questions/685626 | 2023-05-13 | yes: manual line breaks around soul |
| 8 | "I want to cite a reviewer's response to another reviewer, essentially cross-referencing between files." | https://github.com/cdc08x/letter-2-reviewers-LaTeX-template/issues/4 | 2025-03-12 | tried `xr`: "it doesn't in practice" |
| 9 | "figuring out which line numbers to reference in the response to review when using MS Word is challenging" | https://dynamicecology.wordpress.com/2025/09/04/i-wish-journals-didnt-ask-for-ms-revisions-with-tracked-changes/#comment-125428 | 2025-09-04 | yes: cites line numbers of the clean PDF |
| 10 | "the line numbers change so many times that they frequently get messed up" (an associate editor's view) | same post, #comment-125454 | 2025-09-04 | n/a (reviewer side) |
| 11 | "Most people don’t provide enough detail in the response document these days" (reviewer side) | same post, #comment-125475 | 2025-09-05 | n/a |
| 12 | "useful to review a document with line numbers because the diff document would have the exact same layout" | https://github.com/ftilmann/latexdiff/issues/338 | 2026-07-28 | wants an additions-only diff so line numbers match |
| 13 | "reviewer comments and author replies drift out of sync" (builder's README) | https://github.com/zzaiyan/PaperRevisionKit | 2026 (created 2026-01-16) | built a template kit |
| 14 | "I ran into a really long comment from a reviewer recently, and it can't be contained in a comment box." | https://github.com/klb2/review-response-template/issues/7 | 2026-08-22 | no (template formatting) |

**Independent people.** 12 users (rows 1–12; row 13 is a builder, row 14 is about template formatting only). 8 of them describe the *sync* part specifically (rows 1, 2, 3, 4, 8, 9, 10, 12), and only 4 of those fall in 2024–2026 (8, 9, 10, 12). Most other posts are about formatting the letter, which templates already solve.

### Frequency signals
- academia.SE "How to keep track of line numbers in response to reviewers?": 9,067 views, 15 votes (2015). Nothing newer on academia.SE comes close.
- tex.SE: a text search for "response to reviewers" finds only 15 posts (9 since 2020), and "response letter" finds 42. Recent questions get 82–821 views, so the sync problem is asked rarely.
- GitHub: about 120 repos match "response to reviewers". Top templates: klb2/review-response-template 141★, paolocrosetto/reply_to_referee_template 79★, cdc08x 75★, javism 59★, chauby 56★. Searches for "rebuttal/response/reply to reviewers" return 206 (2024), 335 (2025), and 861 (2026) repos, but these counts are noisy because they include non-academic "rebuttal" repos. Many 2026 entries are AI-agent "skills", for example lachlanchen/paper-revision-skill, Hao-Thunder/Peer-Review-Response-Writer, a Chinese rebuttal Claude skill, and the `nature-response` skill installed in this very environment.
- Commercial AI is active: SciSpace "Response to Reviewers Letter Generator", Trinka's response letter builder (beta), and many 2026 SEO guides ("Best AI Tools for Responding to Reviewers (2026)").

### Workarounds people use
- XXX placeholders and a saved copy of the old PDF to cross-index line numbers at the end (academia 35086).
- LaTeX cross-referencing: `lineno` + `\linelabel` + `xr`/`xr-hyper` + `\pageref`/`\lineref` ([seananderson.ca, 2013](https://seananderson.ca/2013/04/28/cross-referencing-reviewer-replies-in-latex/); the [Hobson "response letter hacks" PDF](https://hobsonresearch.com/wp-content/uploads/2018/01/responseletter_hacks.pdf), which also `\input`s quoted passages so they update automatically). This is fragile on Overleaf (row 8).
- Templates with `\comment`/`\reply`/`\changes` environments, with latexdiff output pasted into the letter by hand (paolocrosetto template: "copy-paste your latexdiff-generated code into the reply").
- Word tables, a spreadsheet of comments (rejoinderoo converts CSV or Excel to LaTeX/Typst), and ChatGPT or Claude to draft replies.

### Existing solutions

| Name | Link | Adoption | Last update | Verdict | Why |
|---|---|---|---|---|---|
| Letter templates (klb2, cdc08x, javism, chauby, paolocrosetto, Zenke Lab, Overleaf gallery) | e.g. https://github.com/klb2/review-response-template | 50–141★ each, plus an Overleaf template | 2024–2026 | **meets** the formatting part | Saturated: dozens of free, polished templates. |
| Sync-capable LaTeX approaches: lineno + xr (Hobson, Anderson), `minorrevision` (CTAN 1.1: "Quote and refer to a manuscript for minor revisions"), sergiud/rebuttal ("Cross-referencing of additions, deletions, and changes between the revised manuscript and the rebuttal letter"), cdc08x (sidenotes in the paper that point to comments), jealie/latex-reviewer-diff (links plus latexdiff) | https://github.com/sergiud/rebuttal (8★), https://github.com/jealie/latex-reviewer-diff (10★, 2016) | low | sergiud 2026-09 | **partly** | The automatic page and line reference problem is solved in principle, but each needs LaTeX setup, `xr` is fragile on Overleaf, and adoption is tiny. |
| Revision kits (CNNC-Lab/paper-template with `make diff` + `make rebuttal`; zzaiyan/PaperRevisionKit) | https://github.com/CNNC-Lab/paper-template, https://github.com/zzaiyan/PaperRevisionKit (8★) | low | 2026 | partly | Bundle the letter and the diff in one workflow. New, with little use. |
| rejoinderoo | https://github.com/andreas-bauer/rejoinderoo | 28★, web app | 2026-09-02 | partly | Turns a spreadsheet into a letter. No link to the manuscript. |
| AI drafting (ChatGPT/Claude, SciSpace agent, Trinka, Paperpal; many GitHub agent skills) | https://scispace.com/agents/response-to-reviewers-letter-generator-19b8wauz | high and growing | 2026 | **meets / crowded** for drafting replies | General LLMs already draft point-by-point replies. Syncing quoted text and line numbers with the compiled PDF is not their focus. |

### Search words
`response to reviewers latex template` · `rebuttal letter latex` · `reply to reviewers template` · `point-by-point response template` · `line numbers response to reviewers` · `reference line numbers in another document latex` · `xr lineno response letter` · `quote revised text in response letter` · `response letter overleaf template` · `AI response to reviewers` · Chinese: `[zh] [zh] latex` · `[zh] [zh]` · `[zh] [zh]`.

### Verdict: **weak to medium; already met for drafting and formatting, only partly met for sync**
People find it tedious, but only about 8 people across 2015–2026 describe the sync problem, and only 4 of them in 2024–2026, so the evidence is thin. The letter itself is solved by more than 100 templates and by general AI. The remaining gap (automatic page and line references plus quoted changed passages that stay correct after edits) already has LaTeX-native answers that few people use. It is best treated as a feature of Need 1, for example a diff tool that also emits a change list with page and line numbers to paste into the letter, rather than as a standalone project.

---

## Cross-need notes for selection
- The two needs meet at line numbers. Reviewers want changes located by page and line (#338; DE #125428, #125454). A tool that produces a compilable marked-up PDF *and* a list of changed locations with page/line numbers (for the letter) would cover the part of Need 2 that is actually missing.
- Adoption risk: the dozens of 2024–2026 latexdiff wrappers average about 0–5 stars, and the best web tool repo has 15. People use such tools once per revision through a web search, without starring. Stars may need a library or CLI that other tools build on, or very visible reliability.
- Evidence of competition is fresh (GoBobr/texdiff on 2026-10-01, toftul/latexdiff-zip on 2026-06, texchanges on CTAN 2026-08). Re-check these before the Gate.
