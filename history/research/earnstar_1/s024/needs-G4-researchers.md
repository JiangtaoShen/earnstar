<!-- Copied from the private working file lab/s024/g4/needs-G4.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# G4 needs: researchers and graduate students who write papers and theses

Session S024, 2026-10-03 (Asia/Shanghai). Read-only user research; nothing was posted, starred, or installed.

**Method.** Candidate needs were collected from TeX.SE and academia.SE (Stack Exchange API), Hacker News (Algolia API), GitHub (repositories and issues of latexdiff, Zotero, pandoc, Better BibTeX, thesis templates, and the tools people wrote themselves), the Zotero forums, Overleaf/arXiv/journal documentation, university graduate-school pages, and Chinese pages reachable through web search. For each strong candidate, existing solutions were searched by the outcome users want, in English and Chinese, sorted by stars and by recency (`tools/crowding.mjs` for crowding counts), and checked against current docs and their own issue trackers. One task was reproduced by hand (latexdiff on realistic table/math edits, `try-latexdiff/`). Three sub-agents gathered the evidence for N1 and N5 (agent A), N6–N8 (agent B) and N3–N4 (agent C); their complete tables and raw pulls are in `agentA/`, `agentB/`, `agentC/`, and a sample of their quotes was re-checked against the raw pages.

**Rules for quotes.** Every quote is verbatim text fetched in this session, at most 20 words; Chinese is translated and marked [translated]; usernames are not recorded. "Workaround" marks rows where the person describes what they do instead.

**Limits.** Reddit (where many figure/formatting complaints live) is unreachable. The anonymous Stack Exchange quota (300 calls/day) ran out during the session, so a few TeX.SE items are cited by title only. zhihu.com and most CSDN pages refuse fetching; Chinese evidence uses pages that loaded. TeX.SE traffic has fallen sharply since 2023, so 2024–2026 counts understate demand.

**Summary.** Of 14 candidate needs, four are already met despite strong demand (checking that references exist, updating preprints, arXiv compile failures, GB/T 7714-2025), and several more are mostly met by native features, plugins or free workarounds. No need was found that is both strong and unserved. The strongest needs that remain only partly met are N1 (a marked-up revision PDF from LaTeX that compiles; 23 people), N6 (clickable Zotero citations in Word; 44 people, rising) and N2 (a LaTeX thesis that passes the new US accessibility checks; emerging in 2025–2026), followed by LaTeX→Word (N9) and Zotero↔Overleaf sync without premium (N8). See the ranking table at the end.

---

## N1. "Give me a marked-up (track-changes) PDF of my revised LaTeX manuscript that actually compiles"

- **Need**: "The editor has asked for a track changes file" — and the latexdiff output "doesn't compile", usually because of tables, math, custom macros, multi-file projects, or the bibliography; Overleaf's own track changes is paid-only.
- **Who and situation**: an author (or PhD student doing thesis corrections) at revision time, usually under a deadline; journals such as PLOS and Elsevier ask for a marked-up and a clean version. Recurs at every revision round.

**Evidence** (selected from 23 independent people collected by sub-agent A; full table with all rows: `agentA/evidence.md`; quotes were re-checked against the raw pages for a sample)

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround described |
|---|---|---|---|---|
| 1 | "The editor has asked for a track changes file." / "I get a compilation error with the diff file" | https://tex.stackexchange.com/questions/765514 | 2026-08-17 | yes: Overleaf latexdiff recipe; "If I remove the tables in main2.tex, the diff file does compile" |
| 2 | "I am submitting a minor revision of my manuscript." (`changes` package: \deleted on a section "does not work as expected") | https://tex.stackexchange.com/questions/766504 | 2026-09-19 | yes: manual \added/\deleted markup |
| 3 | "I am trying to get a diff between two versions of my thesis." | https://tex.stackexchange.com/questions/757504 | 2025-12-25 | yes: VERBATIMLINEENV, then an unmerged latexdiff PR / personal fork |
| 4 | "The whole point of the exercise is to reduce the amount of manual work needed" | https://tex.stackexchange.com/questions/752825#comment1882731_752825 | 2025-11-11 | yes: de-macro, flatten, tweak by hand |
| 5 | "I often need to do a few tweaks by hand." (another user, same thread) | https://tex.stackexchange.com/questions/752825#comment1881683_752825 | 2025-11-03 | yes: hand-edit diff.tex |
| 6 | "I had to dig up a Perl script that could handle the task within the LaTeX framework." | https://dynamicecology.wordpress.com/2025/09/04/i-wish-journals-didnt-ask-for-ms-revisions-with-tracked-changes/#comment-125426 | 2025-09-04 | yes: latexdiff |
| 7 | "The end result needs some manual tweaking, but it works for me." | same post, #comment-125456 | 2025-09-04 | yes: latexdiff; or highlight additions only |
| 8 | "latexdiff will insert a \DIFaddend or a \DIFaddbegin on the same line as the \caption command and causes errors" | https://tex.stackexchange.com/questions/727654 (= latexdiff #309) | 2024-09-30 | yes: `--graphics-markup=NONE` / `PICTUREENV=longtable` (drops the markup) |
| 9 | "I ended up removing the entire `\mbox` and using `\text` to make the diff work" | https://github.com/ftilmann/latexdiff/issues/313 | 2024-12-18 | yes: rewrote the source |
| 10 | "This fails to compile, as the arguments of `\frac` have been split up." | https://github.com/ftilmann/latexdiff/issues/322 | 2025-10-20 | yes: add spaces in the source |
| 11 | "the bibliography and the "\citep{}" inside my thesis don't work (they come up as ??? on the file)" | https://github.com/am009/git-latexdiff-web/issues/2 | 2024-09-16 | yes: latexdiff.cn web service |
| 12 | "If the generated diff.tex file cannot be compiled" [translated] | https://blog.csdn.net/qq_42328201/article/details/139300015 | 2024-05-31 | yes: copy into a new .tex; CJKutf8 |
| 13 | "editing the diff file for each equation and table will take a lot of time and there is a deadline" | https://tex.stackexchange.com/questions/702076 | 2023-11-23 | yes: `--math-markup=none`, `PICTUREENV=tabular` (suppresses markup) |
| 14 | "The ability to run latexdiff on two files to create and compile a diff.tex would be a great improvement." | https://github.com/overleaf/overleaf/issues/397 | 2016-02-19 (+1s 2017–2023) | a 2023 commenter built a Telegram bot |

Builders who state the same problem in their own READMEs (2026): "every serious latexdiff user eventually ends up maintaining a pile of fragile pre/post-processing scripts around it" (https://github.com/GoBobr/texdiff, created 2026-10-01); "Plain `latexdiff` is excellent for simple papers, but major revisions often break it" (https://github.com/buaabarty/automated-latex-paper-diff, 2026-05-11); "which breaks LaTeX table structure and causes "Misplaced \cr" compilation errors" (https://github.com/feathertop/latexdiff-notables, 2026-04-05).

**Own reproduction (this session, `try-latexdiff/`)**: with latexdiff 1.3.2 from TeX Live 2022 on this machine (current release is 1.4.0, 2026-01, not tested), both source versions compiled, but the diff did not in 2 of 3 small realistic edits: adding a column group with `\cmidrule(lr){4-5}` (booktabs) gave "File ended while scanning use of \@@@cmidrule"; changing text inside `$\mbox{$x$ is small}$` gave "Missing } inserted". A plain row deletion + added column compiled fine.

- **Frequency signals**: TeX.SE "Track changes in LaTeX" 199,180 views / 271 votes (q/65453); tag [latexdiff] 174 questions, 20 since 2023; latexdiff repo: 81 of 269 issues mention "compile", 36 opened since 2024; GitHub repos matching "latexdiff" created per year: 11 (2024), 10 (2025), 27 (2026 to Oct 3); journals push the format (PLOS recommends latexdiff; Elsevier asks for a marked-up and a clean file).
- **Counter-evidence**: the latexdiff maintainer: "Most of the times, it works fine with changes in tabular environments and equations" (2023); some journals accept red-coloured changes; an ecology blog argues tracked versions are "useless at best" while an editor in its comments requires them.
- **What people do today**: latexdiff flags that switch markup off in problem areas; hand-editing diff.tex; removing tables and re-adding them; changing the source; manual `changes`/`\textcolor` markup (which also breaks on `\cite{a,b}`, sections, lists); Overleaf latexmkrc recipes (free plan: 24-hour history, 10-s compile limit); online services.
- **Existing solutions checked** (condensed; full table in `agentA/evidence.md`)

| Name | Link | Adoption | Last update | Verdict |
|---|---|---|---|---|
| latexdiff (+ latexdiff-vc, --flatten) | https://github.com/ftilmann/latexdiff | 677★; in TeX Live/MiKTeX; named by PLOS | v1.4.0 2026-01-02; pushed 2026-09-20 | partly: the standard, maintained, but output often fails on tables/math/macros/bibliographies; maintainer calls the flat diff a design limit; Perl needed (hard on Windows) |
| git-latexdiff | https://gitlab.com/git-latexdiff/git-latexdiff | 214★ | 2026-06 | partly: same engine |
| Overleaf Track Changes | https://docs.overleaf.com/collaborating/track-changes | huge | current | fails on the free plan (premium only; free history 24 h); docs describe an editor review panel, not a marked-up PDF; request #397 open since 2016 |
| `changes` package | CTAN | top answer on the 199k-view question | 2021 | partly: manual, breaks on sections/lists/multi-cites |
| Web services: thelatexlab, 3142.nl, latexdiff.cn (am009, 15★), latexdiff-zip (toftul, 0★), Purplelink, browser latexdiff (1–2★) | various | small | 2026 | partly: mostly return diff.tex (user must still make it compile) or treat tables as opaque blocks; reported "???" bibliographies and 500 errors |
| > 40 small wrappers 2024–2026 (buaabarty/automated-latex-paper-diff, Trailokaya/latexdiff, latexdiff-notables, rust-latexdiff, VS Code / Chrome / Windows GUI wrappers) | GitHub | 0–5★ each | 2025–2026 | partly: each fixes one slice; none adopted |
| GoBobr/texdiff (tree-based diff, `--check`, not latexdiff) | https://github.com/GoBobr/texdiff | 0★ | created 2026-10-01 | unknown: the one "valid by construction" approach; direct competitor to watch |
| PDF compare (diff-pdf 4,324★, Draftable, Acrobat) | https://github.com/vslavik/diff-pdf | popular | 2026-03 | fails: not the in-text strike-through/colour markup journals ask for |

- **Search words**: "latexdiff not compiling", "latexdiff table error", "latexdiff Misplaced \noalign", "latexdiff booktabs", "latexdiff bibliography", "latexdiff overleaf", "latexdiff online", "track changes latex", "track changes overleaf free", "marked-up manuscript latex", "highlight changes revised manuscript latex", "latexdiff [zh]", "latexdiff [zh]", "latex [zh] [zh]".
- **Verdict**: **strong need, partly met, crowded with small attempts.** Real, deadline-driven, recurring at every revision, voiced by 19 people in 2024–2026 and reproduced here; no tool reliably compiles on real papers, and Overleaf's built-in option is paid. But > 40 wrappers and ≥ 7 web services appeared in 2024–2026 without traction, and a tree-based rewrite appeared on 2026-10-01: only visibly better reliability on real manuscripts (tables, math, citations, multi-file) would matter. Such tools are used once per revision and rarely starred.

---

## N2. "Make my LaTeX thesis pass the graduate school's PDF accessibility check" (ADA Title II, from spring 2026)

- **Need**: graduate students at US public universities must now submit theses/dissertations that meet WCAG 2.1 AA, verified with a checker (PAC, Acrobat, Word's checker); LaTeX PDFs are untagged by default, and the new LaTeX tagging is young, breaks with common packages, and checkers disagree about PDF 2.0 / PDF/UA-2.
- **Who and situation**: a PhD/master's student finishing a LaTeX thesis on a departmental template, weeks before deposit; also template maintainers. (Instructors making course PDFs have the same problem but are outside this group.)

**Evidence**

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround described |
|---|---|---|---|---|
| 1 | "I am having serious problems generating a PDF in TeX that passes my accessibility checker." | https://tex.stackexchange.com/questions/750324 | 2025-08-28 | yes: MWE with \DocumentMetadata; answers: checker misreads PDF 2.0, drop a-4f |
| 2 | "What packages must I sacrifice in the name of tagging?" | https://tex.stackexchange.com/questions/749862 | 2025-08-17 | partly: writing a tagged math book skeleton |
| 3 | "I do not want that path to be made public." (figure tags exposed the image file path as alt text) | https://tex.stackexchange.com/questions/761037 | 2026-03-19 | yes: pdfpages pre-release from its author |
| 4 | "How do I debug what is causing tagging related warnings and how do I fix them?" (title; dissertation) | https://tex.stackexchange.com/questions/755399 | 2025-11-26 | not read (Stack Exchange quota exhausted) |
| 5 | "Today, the generated PDFs are not accessible. They are valid PDF/A-2b, but not tagged." (thesis-template maintainer) | https://github.com/Digital-Media/HagenbergThesis/issues/225 | 2026-09-14 | yes: veraPDF audit; 15 of ~60 loaded packages incompatible with tagging (the issue names titlesec, listings, caption, float; the official status page now lists titlesec, caption and float as compatible, listings as incompatible) |
| 6 | "Manuscripts authored in LaTeX or similar TeX engines are usually untagged and inaccessible to screen readers." (graduate manual) | https://guides.lib.uci.edu/gradmanual/accessibility | 2026 ("As of April 2026") | institution: "strongly recommended" Accessible LaTeX Template |
| 7 | Texas Tech PhD student (class of 2026) published an unofficial thesis template with his own compliance scripts (veraPDF + Python tag-tree checks for alt text, text extraction, layout), README: "Every figure needs `alt={...}`" | https://github.com/JLMicus/Texas-Tech-University-LaTeX-Thesis-and-Dissertation-Template | 2026-08-23 | yes (own scripts) |
| 8 | A student's own accessible-thesis repo (no README text) | https://github.com/yyang3388/yang-thesis-accessible | 2026-09-07 | yes |
| 9 | "universities are forcing faculty to put all their materials on Canvas ... if a pdf ... is not compliant it is immediately flagged" (adjacent group: instructors) | https://news.ycombinator.com/item?id=48058222 | 2026-05-08 | n/a |

- **Frequency signals**: TeX.SE [tagged-pdf] has 142 questions and [accessibility] 73 since 2024-01-01, among the most active topics on a shrinking site (for comparison, title searches since 2024 returned 8 questions for "latexdiff", 4 for "zotero", 5 for "bbl", 37 for "arxiv"); questions keep arriving in Aug–Sep 2026 (q/766295 alt text for math, q/766321 NVDA reading). Universities published LaTeX-specific guidance and templates in 2026: UIUC graduatecollege/uofithesis (27★, created 2026-02-17, "emphasis on accessibility and PDF/UA-2"), UC Berkeley wcagthesis, UCI Accessible LaTeX Template, Texas Tech (unofficial, row 7).
- **What people do today**: switch to a university's new accessible template if one exists; add \DocumentMetadata{tagging=on} and compile with LuaLaTeX; remove incompatible packages; ask on TeX.SE; run PAC/Acrobat/veraPDF and guess which LaTeX construct causes each failure; write their own check scripts (row 7); or convert to Word.
- **Existing solutions checked**

| Name | Link | Adoption | Last update | Verdict |
|---|---|---|---|---|
| LaTeX kernel tagging (\DocumentMetadata, tagpdf) + LaTeX Tagging Project package-status list | https://github.com/latex3/tagging-project | core LaTeX; issue tracker 99★ | active (2026-10-02) | the engine plus the data: the status list covers 2,245 packages (1,126 compatible, 319 partially, 534 currently incompatible — among them biblatex, listings, siunitx, algorithm2e; tikz partially), used by the native check below |
| veraPDF (PDF/UA validator, open source) | https://verapdf.org | standard validator | active | partly: reports PDF-level rule failures, not LaTeX causes |
| PAC (PDF Accessibility Checker) | https://pac.pdf-accessibility.org | free, Windows, closed source; named by UCI | active | partly: same; checkers disagree on PDF 2.0/UA-2 (q/750324) |
| University templates (UIUC uofithesis 27★, Berkeley wcagthesis, UCI, juliusross1/Accessible-LaTeX-Thesis-Template 11★, paulwhitten/accessible_thesis 2★) | GitHub | small | 2026 | partly: help only students who start from that template |
| LaTeX's own `\DocumentMetadata{..., check-tagging-status}` key + CTAN package latex-tagging-status (LaTeX News 42, 2025) | https://ctan.org/pkg/latex-tagging-status | in every current TeX Live | 2026-09-16 | **meets the "which of my packages are incompatible" part natively** (writes a compatibility report at the end of the run; documented as "a rough overview and a debugging aid"); few users seem to know it — no TeX.SE question above mentions it |
| Overleaf accessible-PDF support (TeX Live 2025/2026, docs page) | https://docs.overleaf.com/writing-and-editing/creating-accessible-pdfs | all Overleaf users (enabled 2026-01-29 per UCLA IT notice) | 2026 | partly: tagging works, but the docs say Overleaf has no built-in checker; users "manually cross-reference" packages and use veraPDF/ngPDF; warns Canvas's checker "may flag an accessible document as inaccessible" |
| Oleafly "Preflight" (desktop research-writing app; accessibility checks: tagging, alt text, language/title, headings, tables, links; cites PDF/UA-1 clauses; uses tagging-status data) | https://github.com/Oleafly/Oleafly | 194★ | created 2026-07-05, pushed 2026-10-02 | partly/meets for people who adopt the whole Oleafly app; not a standalone checker for an existing Overleaf/TeX Live workflow |
| M-Colley/mechcheck (thesis checks: figures, refs, abbreviations) | https://github.com/M-Colley/mechcheck | 14★ | 2026-09-22 | not about accessibility (by description) |
| blake5634/accessible_latex | GitHub | 0★ | 2026-02-22 | untested, tiny |
| GitHub searches "latex accessibility checker", "latex accessibility lint", "tagpdf check" | — | 0 results each (2026-10-02) | — | no dedicated standalone checker found |

- **Search words**: "latex thesis accessibility checker", "make latex pdf accessible PAC", "ADA Title II thesis latex", "latex tagged pdf alt text figures", "pdf/ua latex thesis fails", "which packages are compatible with tagging".
- **Verdict**: **strong need, partly met** (driver: ADA Title II deadline April 2026; recurring 2025–2026 questions; ≥ 10 university pages give LaTeX-specific accessibility guidance or templates — graduate schools (UCI, UIUC, UC Berkeley, South Carolina), libraries/IT (Iowa State, GVSU, Auburn, Texas State, UCLA), math departments (Utah, Tarleton, Purdue talk 2025-11), found by web search 2026-10-03; students and template maintainers write their own check scripts). Native pieces now exist (tagging in the kernel; `check-tagging-status` report; veraPDF/PAC; Overleaf support; Oleafly's in-app preflight). What remains unmet: a standalone, template-agnostic check that runs on an existing thesis (Overleaf zip or local TeX Live), maps PDF/UA and checker failures back to source lines (figures without `alt`, tables without headers, \multirow tables PAC rejects, incompatible packages actually used), and explains checker disagreements. Risks: US-centric and seasonal; upstream tagging changes monthly; part of the audience is instructors, not G4; Oleafly may extend its preflight to a CLI.

---

## N3. "Check that every reference really exists and its details are right before I submit" (AI-invented references)

- **Need**: authors, supervisors and reviewers must make sure no cited work is fabricated or mis-described; since May 2026 arXiv threatens a 1-year ban, ICLR 2026 desk-rejected papers, and teachers use fake references as a signal of AI use.
- **Who and situation**: authors before submission (especially with AI-assisted drafting or many co-authors), reviewers and editors handed a PDF/DOCX, supervisors/TAs checking student theses.

**Evidence** (selected from ≥ 10 independent people collected by sub-agent C; full table: `agentC/evidence.md`)

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround described |
|---|---|---|---|---|
| 1 | "Checking whether a cited book, paper, or passage exists is the absolute minimum standard for scientific work" | https://news.ycombinator.com/item?id=48142813 | 2026-05-14 | manual checking |
| 2 | "I still have to manually ensure that details like publication venue, year, volume number…are extracted correctly" | https://news.ycombinator.com/item?id=48143789 | 2026-05-15 | Zotero import + field-by-field check |
| 3 | "Do I have to manually extract each citation from a paper and then individually look each up?" | https://news.ycombinator.com/item?id=49145264 | 2026-08-02 | manual, per citation |
| 4 | "I run bib-audit, but I still check each one manually with Google Scholar" (ML author/reviewer) | https://geospatialml.com/posts/reviewing-ai-slop/ | 2026-07-30 | LLM skill, then Google Scholar, plus a personal library of trusted BibTeX |
| 5 | "I'm wondering if there's a tool available that can automatically detect and flag false references" (TA, 50+ students) | https://academia.stackexchange.com/questions/201895 | 2023-09-17 (new answer 2026-05-17; 4,358 views) | random manual review, Turnitin |
| 6 | "had a significant false positive rate (for example, it would flag a reference to a paper with a non-English title" (ICLR 2026 chairs) | https://blog.iclr.cc/2026/03/31/a-retrospective-on-the-iclr-2026-review-process/ | 2026-03-31 | automated checker, then humans checked every flag |
| 7 | "Many Chinese-literature DOIs are not yet connected to the international system; there is no query interface" [translated] | https://www.ablesci.com/post/detail?id=PQDeD7 | 2023-03 | none (CNKI only) |
| 8 | "There already exists multiple tools for automatically verifying references." | https://news.ycombinator.com/item?id=48142315 | 2026-05-14 | (supply signal) |

User complaints about existing checkers are mostly false positives: "non-unique titles lead to false positive mismatches" (hallucinator #121, 2026-02-15), "book titles seem often to be mis-parsed" (#165), CJK punctuation breaks parsing (#309, open), real 2026 arXiv IDs flagged as fabricated (ValiRef #1), "Semantic Scholar returns 429 most of the time" (OneCite #25).

- **Frequency signals**: HN "New arXiv policy: 1-year ban for hallucinated references" 659 points, 230 comments (2026-05-14); Nature news "Hallucinated citations are polluting the scientific literature" submitted to HN ≥ 9 times (Apr–May 2026); academia.SE "Is it appropriate to blacklist an author for submitting a paper with non-existent references?" 5,533 views (2026-01-09). Supply: GitHub "hallucinated citations" 164 repos, "hallucinated references" 81, mostly 2026; PyPI last 30 days: academic-refchecker 3,284, bibtex-updater 1,231, hallucinator 371, bibverify 364, citegate 305.
- **What people do today**: Google Scholar/DBLP/INSPIRE by hand; copy BibTeX only from authoritative sources (DOI content negotiation, DBLP, INSPIRE); LLM skills followed by manual checks; venue-scale checkers with human triage.
- **Existing solutions checked**

| Name | Link | Inputs | Adoption | Last update | Verdict |
|---|---|---|---|---|---|
| refchecker | https://github.com/markrussinovich/refchecker | arXiv ID, PDF, .tex, .bib/.bbl, text | 532★; 3,284 dl/mo | 2026-09-07 | meets for LaTeX/PDF authors (deep checks need an LLM key; venue gaps) |
| hallucinator | https://github.com/gianlucasb/hallucinator | PDF | 378★ | 2026-09-23 | meets for PDFs (strongest in CS); false positives on books/standards/CJK, "mark safe" workflow |
| merfanian/Bibtex-Verifier | https://github.com/merfanian/Bibtex-Verifier | .bib (in browser) | 122★ | 2026-09-28 | meets for .bib/Overleaf users |
| citegate | https://github.com/chrisyangsong/citegate | .bib (PDF/DOCX planned) | 102★ | 2026-08-30 | meets for .bib in repositories / CI |
| bibverify | https://github.com/Hylouis233/bibverify | .bib | 99★ | 2026-10-01 | meets for .bib |
| bibtex-updater (`bibtex-check`) | https://github.com/rpatrik96/bibtexupdater | .bib, Zotero | 116★ | 2026-09-26 | meets for .bib/Zotero |
| Free web services: Paperpile Citation Checker, RefRunner, GPTZero, Scholar Sidekick (+ Zotero plugin), a V2EX tool for teachers | various | .docx/PDF/.bib | n/a | 2026 | meets for Word/PDF users who accept uploads and daily limits |
| Chinese references: Liuxiangjian-ai/reference-checker-skill (136★, LLM browsing CNKI/Wanfang/VIP) | GitHub | text | 136★ | 2026-06 | partly; CNKI has no public API |

- **Search words**: "hallucinated references checker", "verify bibtex references", "check references exist", "fake citations detector", "citation checker docx", "[zh] [zh] [zh]", "AI [zh] [zh] [zh]".
- **Verdict**: **already met** (strong need, saturated supply: ≥ 9 maintained open-source tools and ≥ 6 free web services cover .bib, .tex, PDF and .docx). The only plausible gap, Chinese CNKI/Wanfang references, lacks first-person evidence of failure and a lawful data route.

## N4. "Update the arXiv/bioRxiv preprints in my bibliography to their published versions"

- **Who and situation**: authors before submission or at proofs; Zotero users with old "preprint" items.

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround |
|---|---|---|---|---|
| 1 | "there is no automated way to update preprints (like from the arXiv) that have been published" | https://forums.zotero.org/discussion/83310 | 2020-11-14 | none (Zotero staff: no updating implemented) |
| 2 | "I really want this feature as citing the publication instead of the arxiv preprint is important." | https://forums.zotero.org/discussion/88143 | 2023-04-04 | PaperMemory extension |
| 3 | "many times I find an old reference with "preprint" that I added long time ago." | https://forums.zotero.org/discussion/123938/update-metadata | 2026-01-31 | Linter for Zotero (called "somewhat obscure") |
| 4 | "This is hard and error-prone." (JabRef: replace preprint, delete, re-key by hand) | https://discourse.jabref.org/t/the-correct-way-to-replace-current-records-of-preprints-say-arxiv-by-published-articles/1835 | 2019-12-05 | JabRef merge |
| 5 | "I've found a satisfactory workflow using the excellent arXiv Workflow for Zotero plugin" | https://forums.zotero.org/discussion/99220 | 2025-10-24 | **solved by a plugin** |
| 6 | "Thanks a lot for this tool, much needed !" (bibtex-updater user) | https://github.com/rpatrik96/bibtexupdater/issues/32 | 2026-03-22 | bibtex-updater |

- **Frequency signals**: Zotero forum threads with repeated requests 2019–2026; Zotero developer "Metadata updating is coming" (2025-05-01), still absent in Zotero 8/9.
- **Existing solutions**: rebiber (3,038★, CS/NLP via DBLP/ACL, v1.3.0 2026-10-01) — meets for CS; bibtex-updater (116★, 1,231 dl/mo; arXiv, OpenAlex, Europe PMC, Crossref `is-preprint-of`, DBLP, OpenReview) — meets across fields for BibTeX/Zotero; arXiv Workflow for Zotero (389★; arXiv, bioRxiv, medRxiv, chemRxiv, PsyArXiv) — meets for Zotero; Linter for Zotero (1,059★); INSPIRE/ADS — meets for physics.
- **Search words**: "update arxiv citations to published version", "zotero preprint published version", "rebiber", "bioRxiv now published zotero".
- **Verdict**: **already met**.

## N5. "Keep the response-to-reviewers letter in sync with the revised manuscript" (page/line numbers, quoted passages)

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround |
|---|---|---|---|---|
| 1 | "every time I make a change to my manuscript the line numbers change a bit" | https://academia.stackexchange.com/questions/35086 | 2015-01-02 (9,067 views) | yes: "XXX" placeholders until the end |
| 2 | "avoid having to revise the response letters to the reviewers to have it match the presumably new page numbers" | https://tex.stackexchange.com/questions/688018 | 2023-06-08 | no answer |
| 3 | "I want to cite a reviewer's response to another reviewer, essentially cross-referencing between files." | https://github.com/cdc08x/letter-2-reviewers-LaTeX-template/issues/4 | 2025-03-12 | tried `xr`: "it doesn't in practice" |
| 4 | "figuring out which line numbers to reference in the response to review when using MS Word is challenging" | https://dynamicecology.wordpress.com/2025/09/04/i-wish-journals-didnt-ask-for-ms-revisions-with-tracked-changes/#comment-125428 | 2025-09-04 | cites line numbers of the clean PDF |
| 5 | "the line numbers change so many times that they frequently get messed up" (associate editor) | same post, #comment-125454 | 2025-09-04 | n/a |
| 6 | "useful to review a document with line numbers because the diff document would have the exact same layout" | https://github.com/ftilmann/latexdiff/issues/338 | 2026-07-28 | wants additions-only diff |

- **Frequency**: thin — about 8 people describe the sync problem over 2015–2026, only 4 in 2024–2026; most letter questions are about formatting.
- **Existing solutions**: > 100 letter templates (klb2/review-response-template 141★, paolocrosetto 79★, cdc08x 75★) — meet formatting; lineno + xr recipes, CTAN `minorrevision`, sergiud/rebuttal (8★) — partly (setup, fragile on Overleaf); rejoinderoo (28★, spreadsheet → letter); AI drafting (ChatGPT/Claude, SciSpace, many agent skills) — meets drafting.
- **Search words**: "response to reviewers latex template", "line numbers response to reviewers", "rebuttal letter latex", "[zh] [zh]", "[zh] [zh]".
- **Verdict**: **weak–medium, mostly met**; the missing part (a list of changed locations with page/line numbers) fits as a feature of N1 rather than a project of its own.

---

## N6. Word + Zotero: "click an in-text citation and jump to its bibliography entry" (and clickable DOI/URL links in the bibliography)

- **Need**: "A link from an in-text citation to the bibliography is a must-have." Universities, journals and readers of PDFs expect citations to be clickable; Zotero's Word plugin cannot produce such links.
- **Who and situation**: Word + Zotero users finishing a thesis or report as a PDF (often hundreds of citations), in any citation style (numeric, superscript, APA author-date, GB/T 7714); many in China; Mac and LibreOffice users too.

**Evidence** (selected from 44 independent people collected by sub-agent B, 2010–2026; full table: `agentB/evidence.md`; two quotes re-checked via the GitHub API)

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround described |
|---|---|---|---|---|
| 1 | "A link from an in-text citation to the bibliography is a must-have." | https://forums.zotero.org/discussion/comment/326867/#Comment_326867 | 2019-02-21 | no |
| 2 | "100+ votes for this feature. Dear Zotero team, please put this feature at the top of the priority list." | https://forums.zotero.org/discussion/comment/461839/#Comment_461839 | 2024-04-28 | no |
| 3 | "I have exactly two weeks left to pass in my thesis" | https://github.com/zotero/zotero/issues/4263#issuecomment-2276609048 | 2024-08-08 | no |
| 4 | "It worked for my thesis with more than 400 refs and the PDF also have the linked citations." | https://forums.zotero.org/discussion/comment/478710/#Comment_478710 | 2024-11-08 | yes: ZoteroLinkCitation macro |
| 5 | "I know nothing about code or this kind of thing." | https://github.com/altairwei/ZoteroLinkCitation/issues/11 | 2025-04-10 | yes: macro failed on a Google-Docs-converted file |
| 6 | "Ctrl+Click does NOT jump to the References section (no response)." | https://forums.zotero.org/discussion/125574/ctrl-click-citation-hyperlinks-fail-to-jump-to-references-despite-troubleshooting | 2025-07-21 | yes: later found macros |
| 7 | "every time I update a document with a new in-text citation, the hyperlink for that citation disappears" (600+ citations) | https://github.com/altairwei/ZoteroLinkCitation/issues/16 | 2025-10-09 | yes: re-run the macro |
| 8 | "Zotero generates the links in the bibliography as plain text rather than as hyperlinks" | https://forums.zotero.org/discussion/128365/generating-hyperlinks-in-zotero-bibliographies | 2025-12-02 | yes: ZoteroCiteLinker |
| 9 | "I really need to solve this problem" | https://github.com/zotero/zotero/issues/4263#issuecomment-3871850917 | 2026-02-09 | no |
| 10 | "which is fragile for bilingual or customized GB/T bibliography layouts" (wrote a GB/T 7714 fork) | https://github.com/altairwei/ZoteroLinkCitation/issues/23 | 2026-03-16 | yes: own fork |
| 11 | "I use physical review letters citation style, so it's not in the supported list." | https://github.com/sBaydin/ZoteroCiteLinker/issues/5 | 2026-07-20 | yes: tool, style unsupported |
| 12 | "zotero[zh]csl[zh]" [translated: "Zotero's CSL citations do not support hyperlinks"] | https://github.com/Yccc1220/ZoteroLinker/issues/13 | 2026-07-31 | yes: ZoteroLinker |
| 13 | "Clicking on something like "(Maurischat, 2024)" in the text does nothing" (master's thesis, APA 7) | https://forums.zotero.org/discussion/133071 | 2026-08-03 | no |
| 14 | "[zh]" [translated: "after the reference format changes, manually maintaining hyperlinks is time-consuming and error-prone"] | https://www.shaoqun.com/a/2756522.html (repost of a CSDN post) | 2025-03-19 | yes: VBA |

- **Frequency signals**: master forum thread https://forums.zotero.org/discussion/12431/ — 89 posts, 2010–2025; separate threads by first-post year: 2024 3, **2025 5, 2026 3** (rising); ≥ 9 bare "+1" posts on another thread (2022–2024); zotero/zotero#4263 (opened by Zotero staff 2024-06-20): open, 28 reactions, last comment 2026-04-12 "Any update so far?"; staff: "This is still planned, yes." (2024-12-22); Zotero 10.0.5 (2026-09-30) has no such feature.
- **What people do today**: run a VBA macro on the final document and re-run it after every Zotero refresh; ribbon/VSTO add-ins built on the macro; unlink citations and use Word cross-references or AutoFormat; switch to a footnote style, EndNote, or LaTeX.
- **Existing solutions checked**

| Name | Link | Adoption | Last update | Verdict |
|---|---|---|---|---|
| Zotero built-in | https://github.com/zotero/zotero/issues/4263 | — | open since 2024-06-20 | fails today; planned as an option "when unlinking citations" (final, frozen documents only) |
| altairwei/ZoteroLinkCitation (VBA macro) | https://github.com/altairwei/ZoteroLinkCitation | 139★, 25 issues | 2026-04-29 | partly: links vanish on every Zotero refresh (owner: "no amount of macro code can override it", #16); title matching breaks on special characters (#7, 28 comments); hard-coded style list; Mac errors; VBA setup hard for non-technical users |
| sBaydin/ZoteroCiteLinker (.dotm ribbon) | https://github.com/sBaydin/ZoteroCiteLinker | 72★ | 2025-11-17 (no code change since) | partly: Windows-only in practice (Mac error 429, #2); style allow-list; also activates bibliography URLs |
| Yccc1220/ZoteroLinker (VSTO add-in, Word/WPS/PPT) | https://github.com/Yccc1220/ZoteroLinker | 15★, ~675 installer downloads | 2026-09-28 | partly: Windows + admin installer; numeric/APA/MLA/Chicago; Chinese-first |
| Syize/link-zotero-citation-bibliography (Python), GB/T fork (11★), LibreOffice port (0★), smaller variants | GitHub | 0–11★ | 2025–2026 | partly / inactive |

- **Search words**: "zotero hyperlink citation to bibliography word", "link in-text citations to bibliography zotero", "zotero clickable citations pdf", "ctrl+click citation zotero", "zotero bibliography urls not clickable", "zotero [zh] [zh] [zh] [zh]", "GB/T 7714 zotero [zh]".
- **Verdict**: **strong need, partly met.** Sixteen years of requests, ≥ 44 people, more threads in 2025–2026 than before. Four community tools partly solve it on Windows for supported styles. What remains: any CSL style without a hard-coded list, Mac Word/LibreOffice, no VBA setup, and links that survive edits (possibly impossible outside Zotero, since Zotero rewrites the field result on refresh). Risk: Zotero ships its planned unlink-time option.

## N7. "Convert the EndNote (or Mendeley Cite / Citavi / NoteExpress) citations in this Word manuscript into live Zotero citations"

- **Who and situation**: someone moving to Zotero with existing documents, or co-authors/supervisors using different managers on one manuscript.

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround |
|---|---|---|---|---|
| 1 | "ability to convert EndNote in-text fields to Zotero is critical feature for everyone who is migrating from EndNote to Zotero" | https://forums.zotero.org/discussion/comment/76551/#Comment_76551 | 2010-12-01 | no |
| 2 | "my supervisor wants to add his corrections using EndNote" | https://forums.zotero.org/discussion/comment/255464/#Comment_255464 | 2016-06-08 | no |
| 3 | "colleagues who use EndNote, and we usually end up with two reference lists" | https://forums.zotero.org/discussion/63362/merging-zotero-and-endnote-reference-lists-in-a-word-document | 2016-11-30 | yes: two lists |
| 4 | "I have many documents using Endnote citations, some with over 200 citations, and all are in APA style." | https://forums.zotero.org/discussion/comment/309978/#Comment_309978 | 2018-06-05 | yes: RTF scan, then one by one |
| 5 | "two of us use Zotero and two use Endnote." (team of four) | https://academia.stackexchange.com/questions/167218/research-team-writing-using-different-tools | 2021-05-06 | no |
| 6 | "I have been trying to re-link the Mendeley citations (created with Mendeley Cite) with Zotero in a word document" | https://forums.zotero.org/discussion/comment/430115/#Comment_430115 | 2023-03-09 | no |
| 7 | "Is it possible to get Endnote citations in a paper transformed to Zotero" | https://forums.zotero.org/discussion/105624/moving-endnote-citations-to-zotero | 2023-06-15 | yes: unformatted citations + ODF scan suggested |
| 8 | "I am in the middle of writing, against a hard deadline, and this program is pure sabotage" (Mendeley Cite) | https://forums.zotero.org/discussion/comment/462402/#Comment_462402 | 2024-05-07 | no |
| 9 | "Trying to sort this out for a PhD thesis" | https://github.com/rmzelle/ref-extractor/issues/9#issuecomment-2146646205 | 2024-06-04 | no |

- **Frequency signals**: 35 people 2008–2024 (EndNote 25, Mendeley 6, Citavi 2, mixed teams 2); forum threads every year or two; **none found from 2025–2026**. Counter-evidence: "It only required a few hours." (220-page thesis, 410 citations, 2017).
- **Legal risk**: the Reference Extractor maintainer, after asking EndNote's owner: "the company couldn't rule out taking legal action if I implemented the feature, so I won't risk doing so." (https://github.com/rmzelle/ref-extractor/issues/9#issuecomment-450007793, 2018-12-26, verified via the GitHub API); Zotero ticket #686 is "wontfix".
- **Existing solutions**: Zotero natively relinks Mendeley Desktop citations (not Mendeley Cite: zotero#3020 open; not EndNote; not Citavi); RTF Scan (output not live) / ODF Scan (LibreOffice); sorinhostiuc/en2zotero (Zotero plugin, EndNote fields + Traveling Library → live Zotero, 0★, created 2026-08-23) and the same author's mc2zotero (Mendeley Cite); ≥ 10 other 2026 converters (0–4★: zotero-word-cite, zotero-word-citation-migration, CiteMigrate for Citavi, MendeleyCitePort); no in-document NoteExpress converter found.
- **Search words**: "convert endnote citations to zotero word", "endnote cite while you write zotero", "mendeley cite citations zotero word", "co-author uses endnote zotero", "endnote [zh] [zh] zotero word", "noteexpress [zh] [zh] zotero".
- **Verdict**: **medium need, already met on paper** (new converters cover the core cases; no 2025–2026 requests found; legal risk from EndNote's owner).

## N8. "Keep my Overleaf .bib in sync with Zotero without paying for Overleaf premium"

- **Who and situation**: students and researchers on the free Overleaf plan (Zotero, Git and Dropbox sync are premium), and paid teams where only the importer can refresh.

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround |
|---|---|---|---|---|
| 1 | "I do not have access to Overleaf Premium which has a Zotero plug-in, hence this solution." (2,261 views) | https://tex.stackexchange.com/questions/687000 | 2023-05-28 | yes: Zotero API URL; only 20 of 30 references |
| 2 | "I am exporting from Zotero to Overleaf using the "by URL" option" (only first 7 references) | https://forums.zotero.org/discussion/111188/zotero-export-into-overleaf-by-url-only-gives-first-7-references | 2024-01-26 | yes |
| 3 | "It's almost useless to sync Zotero library to Overleaf and do the task manually." | https://forums.zotero.org/discussion/comment/472804/#Comment_472804 | 2024-08-30 | no |
| 4 | "it greatly facilitates the synchronization of documents between Zotero and Overleaf" … "lately I can't find the button" | https://github.com/vantezzen/zotero-better-bibtex-to-overleaf/issues/2 | 2024-11-20 | yes: extension broke |
| 5 | "The Overleaf Zotero and Git integrations are only available for premium users, so it is not an option for everyone." | https://upb-syssec.github.io/blog/2025/zotero-overleaf-integration/ | 2025 | yes: own proxy server |
| 6 | "you still need to copy-paste this content into Overleaf every time you add a new reference" | https://stephengant96.github.io/posts/2025/zotero_overleaf_integration/ | 2025-05-24 | yes: BBT + Dropbox link |
| 7 | "It requires the subscription plan" (motivation of a Zotero plugin author's web app) | https://github.com/windingwind/overleaf-zotero-sync | 2025-05-30 | yes: own web app |
| 8 | "not being able to have collaborators refresh Zotero group library imports has been rather frustrating." | https://github.com/overleaf/overleaf/issues/1065#issuecomment-3129910380 | 2025-07-28 | no |
| 9 | "It seems that this format is not recognized by the extension, so I am unable to sync group collections." | https://github.com/vantezzen/zotero-better-bibtex-to-overleaf/issues/3 | 2025-11-02 | yes: extension, broken for groups |

- **Frequency signals**: 27 people 2019–2025 (about 17 strictly "without premium"); tex.SE "Make Overleaf use Better BibTeX citation keys" 11,087 views; overleaf/overleaf#1065 open since 2022 (8 reactions); library guides (Dartmouth, Waterloo, Caltech, Berkeley) teach the manual or API-URL route; GitHub has many 0★ personal sync repos.
- **Existing solutions**: Zotero Web API URL + Overleaf "From External URL" (free, manual refresh; 100-item cap, Zotero not BBT keys, API key in URL) — partly; vantezzen/zotero-better-bibtex-to-overleaf extension (14★, **1,000 Chrome users**, 2026-08-30; needs Zotero running locally; breaks on Overleaf UI changes; no groups) — partly; windingwind/overleaf-zotero-sync (8★) and UPB-SysSec proxy (3★, needs a server) — partly; Better BibTeX auto-export + cloud direct link — partly; self-hosted Overleaf — meets for self-hosters only.
- **Search words**: "overleaf zotero without premium", "zotero overleaf free", "overleaf bib auto update", "zotero api url overleaf", "better bibtex overleaf", "overleaf zotero [zh] [zh]".
- **Verdict**: **medium need, partly met**; the free API-URL trick and a 1,000-user extension cover most small projects; remaining gaps (100-item cap, BBT keys, groups, refresh by any collaborator) depend on Overleaf's UI and can break when it changes.

---

## N9. LaTeX writers must hand a Word file to co-authors, supervisors, or journals (and get the edits back)

- **Need**: "The teachers and scientific journals all ask for doc files" — I write in LaTeX but must deliver a .docx that needs few corrections, and then carry the co-author's/supervisor's Word edits back into my .tex.
- **Who and situation**: a LaTeX author whose co-authors or supervisor only use Word (track changes, comments), whose journal wants .docx (e.g., Science family at first submission), or whose university/supervisor wants a Word copy of the thesis for annotation.

**Evidence** (one row per independent person or source)

| # | Quote (verbatim, ≤ 20 words) | Link | Date | Workaround described |
|---|---|---|---|---|
| 1 | "The teachers and scientific journals all ask for doc files." | https://tex.stackexchange.com/questions/766744 | 2026-09-25 | yes: "I have tried a lot", wants "the least corrections" (Windows) |
| 2 | "I don't want to give them a whole bunch of .tex files to parse through" (thesis advisor review) | https://tex.stackexchange.com/questions/758499 | 2026-01-19 | yes: wants tables/figures/formulas as images to get line comments |
| 3 | "Is there any convenient workaround that allows me to use LaTeX for editing ... while my three co-authors use Word?" | https://tex.stackexchange.com/questions/404040 | 2017-12-01 | no (accepted answer: ask co-authors for plain text and merge by hand) |
| 4 | "my coauthors can't use the MS Word's Track Changes feature on pdf files" | https://tex.stackexchange.com/questions/53116 | 2012-04-24 | yes: tried Pandoc and htlatex, "not all of what I need" |
| 5 | "the journal Science actually prefers docx, to the point of asking latex submitters to convert to docx" | https://news.ycombinator.com/item?id=38461502 | 2023-11-29 | n/a |
| 6 | "when the magazine accepted it, they required me to convert it to Word!" | https://academia.stackexchange.com/a/90940 | 2017-06-16 | n/a |
| 7 | "[zh] Word [zh]" [translated: "your supervisor wants a Word version of the thesis to annotate it conveniently"] | https://bithesis.bitnp.net/guide/converting-to-word.html | page © 2020–2026 (thesis-template docs, not one person) | yes: PDF→Word or Pandoc; "only guarantees the body text is not lost" [translated] |
| 8 | One-person converter scripts on GitHub (workaround evidence, no quote): malcolmw/tex2docx ("scripts to convert LaTeX documents to DOCX for collaborators", 2019), jay-dennis/tex2docx (2021), Mingzefei/latex2word (55★, 2023), aray-99/latex2docx-converter (2026-01), velichko-andrei/latex-to-docx-converter (2026-03), sergio-gimenez/latex2docx (2026-04), scavero/tex2docx (2026-04), adamsconchallos/tex2docx (2026-07), zhuoyuc/sn-latex2docx (Springer Nature manuscripts, 2026-09) | github.com/<repo> | 2019–2026 | yes (each is a personal workaround) |

- **Frequency signals**: TeX.SE "How to convert a scientific manuscript from LaTeX to Word using Pandoc?" 473,304 views (q/111886, 2013); "Producing doc/docx from LaTeX" 249,030 views (q/8836); 52 TeX.SE questions matching "convert latex to word" since 2022, still asked in 2026. Crowding (`tools/crowding.mjs`, repos created since 2025-10-01, phrases "latex to word", "latex docx", "tex2docx", "latex2docx", "latex word converter"): 364 entrants, 131 in the last 90 days, median 0 stars, 16 with ≥ 10, top specific one 128★.
- **What people do today**: Pandoc (+ pandoc-crossref, --citeproc) and then hand-fixing; PDF → Word via Acrobat/iLovePDF; send PDF with line numbers and collect comments; re-type edits from the returned Word file into the .tex by hand.
- **Existing solutions checked**

| Name | Link | Adoption | Last update | Verdict |
|---|---|---|---|---|
| Overleaf "Export as Word (.docx)" | https://docs.overleaf.com/managing-projects-and-files/importing-and-exporting-files | built into the largest LaTeX editor (a search snippet dates the launch to June 2026; not verified) | 2026 | partly: Pandoc-based; docs say it keeps "structure" but "not ... visual styling"; meant "to share your content with collaborators", not for print-ready Word; no way back into the .tex |
| Pandoc (+ pandoc-crossref) | https://pandoc.org | de facto standard | active | partly: loses custom macros, complex tables, TikZ; needs command-line skill |
| hajimi-kun/latex-to-word-workflow (agent skill) | https://github.com/hajimi-kun/latex-to-word-workflow | 128★ | 2026-07-23 | partly: agent-guided Pandoc workflow with live Zotero citations and Word cross-references; depends on the user's agent and Word |
| Mingzefei/latex2word | https://github.com/Mingzefei/latex2word | 55★ | 2025-07-25 | partly (Chinese thesis focus; Pandoc wrapper) |
| Paid: Mathpix, GrindEQ, Acrobat PDF→Word | vendor sites | wide | active | partly; paid |
| Return path (Word edits → .tex): jiaj-sig/tex-docx-roundtrip; Yuming12138/latex-word-revision-cleanup | GitHub | 0★ each | 2026-09-02; 2026-09-01 | untested agent skills; nothing established |

- **Search words**: "convert latex to word", "latex to docx with equations and citations", "overleaf export word", "co-authors use word latex", "[zh] [zh] word [zh] latex [zh]", "latex [zh] word [zh] [zh]".
- **Verdict**: **medium**. The one-way conversion is a real, very old, still-asked need, but it is now partly met natively (Overleaf export, Pandoc) and saturated with near-identical personal converters (364 new repos in a year). The return path (bringing Word track changes/comments back into the LaTeX source) is barely tried, but people rarely ask for it explicitly; the evidence is implied by rows 2–4 and 7.

---

## N10. Overleaf free plan: compile timeouts (10 s) and the one-collaborator limit

- **Need**: "my thesis/CV/paper times out on Overleaf free" and "we can't co-write without paying".
- **Who**: students on Overleaf's free plan with large templates, TikZ/pgfplots figures, or several co-authors.

| # | Quote | Link | Date | Workaround |
|---|---|---|---|---|
| 1 | "Recently Overleaf reduced the available compile time on their free plan." | https://github.com/thatmariia/latex-cv-template/issues/1 | 2025-09-18 | yes: removed fonts and libraries, "not quite enough" |
| 2 | "On a fresh new project based on current template, it's already too big and overleaf reach the max compile time" | https://github.com/UNamurCSFaculty/ThesisTemplate/issues/13 | 2026-03-27 | n/a |
| 3 | "add an Overleaf font preset and a fastcompile option for the 10-second free-plan limit" (template PR) | https://github.com/H15teve/CSEE_LaTeX_Template/pull/1 | 2026-08-10 | yes |
| 4 | "Overleaf often gives errors such as "Timed out" and doesn't produce any output." (premium user, TikZ) | https://tex.stackexchange.com/questions/728236 | 2024-10-09 | yes: comment out figures and re-add one at a time |
| 5 | "The ability to collaborate on a given document with more than 1 other person is now behind a $200/yr paywall" | https://tex.stackexchange.com/questions/735760 | 2025-01-24 | yes: answers suggest VS Code LaTeX Workshop Live Share |
| 6 | "Most need a paid subscription service to enable proper collaboration" (built own editor) | https://news.ycombinator.com/item?id=49865950 | 2026-09-27 | yes |
| 7 | "It might be a useful option ... especially given the limitations of Overleaf's free plan." | https://github.com/noahd15/GraphVerification/issues/9 | 2025-04-21 | yes: Papeeria |

- **Frequency signals**: Overleaf docs: free compile timeout 10 s vs 240 s premium; free plan has 1 collaborator and no track changes, history, Git, or Zotero integration (https://docs.overleaf.com/getting-started/free-and-premium-plans/plan-limits). An earlier cut to 20 s was announced in Oct 2023 (HagenbergThesis#163). Dozens of 2026 SEO articles ("Overleaf compile timeout fix") indicate search demand.
- **Existing solutions**: compile locally (TeX Live/MiKTeX + VS Code LaTeX Workshop, Tectonic); overleaf-workshop/Overleaf-Workshop (1,675★, pushed 2026-09-13); aloth/olcli (201★, 2026-09-11, pull/push/compile from terminal); self-hosted Overleaf CE; other editors (Papeeria, Typst, Aldine). Verdict: **met** for people willing to compile locally.
- **Search words**: "overleaf compile timeout free", "overleaf timed out thesis", "overleaf alternative free collaborators".
- **Verdict**: **medium need, mostly met** (local compile and sync tools exist); a profiler of "what makes my project slow" would be a thin add-on with no direct requests found.

## N11. "It compiles on Overleaf but fails on arXiv" (bibliography/.bbl/biblatex)

| # | Quote | Link | Date | Workaround |
|---|---|---|---|---|
| 1 | "arXiv has incorporated a new file processor now and I keep getting the error message" | https://tex.stackexchange.com/questions/746340 | 2025-06-17 | yes: one answerer replaced biblatex with BibTeX and stripped `&` and \url |
| 2 | "This compiles fine on Overleaf and locally, but fails with the fatal error `alphabetic.dbx not found' on arXiv." | https://tex.stackexchange.com/questions/751628 | 2025-09-25 | n/a |
| 3 | "They don't compile any references. How can I do anything now, I'm so confused." | https://tex.stackexchange.com/questions/741106 | 2025-04-19 | yes: switch Overleaf to TeX Live 2023 for bbl format 3.2 |
| 4 | "I do not have this error offline ... I am a bit at a loss." | https://tex.stackexchange.com/questions/748355 | 2025-07-21 | n/a |
| 5 | "I uploaded all the necessary .tex files together with the accompanying .bbl file." | https://tex.stackexchange.com/questions/750193 | 2025-08-25 | n/a |
| 6 | "manually editing all entries would take a lot of time" (thesis, biblatex → BibTeX for arXiv) | https://tex.stackexchange.com/questions/752061 | 2025-10-05 | n/a |

- **Frequency**: 37 TeX.SE questions with "arxiv" in the title since 2024; 700–930 views each for the 2025 bbl/dbx ones.
- **Existing solutions**: arXiv itself (blog 2025-11-05): authors may upload .bib files and "our system will call the necessary programs"; XeLaTeX added; TeX Live 2025 the default (https://blog.arxiv.org/2025/11/05/attention-authors-updates-for-bib-file-processing-and-tex-in-arxiv-submissions). An answer on q/752061 (2026-01-11): "arXiv supports bibtex and biber since 12/2025". google-research/arxiv-latex-cleaner (7,073★, 2026-03-27) removes comments and shrinks figures.
- **Verdict**: **already met** (the main 2025 failure class was removed by arXiv in Nov–Dec 2025).

## N12. Figures and fonts that meet publisher rules (DPI, TIFF, Type 3 fonts)

- Evidence: TeX.SE "How to generate pdf without any Type3 fonts?" 74,624 views (q/18687, 2011) and "Replace Type 3 with Type 1 fonts in a PDF" 16,105 views (q/15092); the fix is a known one-liner (matplotlib `pdf.fonttype = 42`), documented by HotCRP-using venues and many guides. For DPI/format checks, PLOS offers PACE (free web tool), and in 2026 many commercial "figure checker" sites appeared (sci-draw, scholarviz, conceptviz). I found no 2024–2026 first-person posts in reachable venues (Reddit, where these complaints usually appear, is unreachable).
- **Verdict**: **weak / already met**.

## N13. "Does the cited paper actually support my sentence?" (claim-level citation checking)

- Evidence: GitHub searches "citation claim verification paper" and "check citation supports claim" return ~26–27 repos, nearly all 2026 agent skills or RAG demos with 0–8★ (e.g., Agents4Academia-AI/citation_verification 8★, groeneveld/latex_claim_verifier 0★, vmbennett/citation-check 0★). I did not find people asking for this in their own words beyond the general hallucination debate (N1).
- Constraints: needs full texts (often paywalled) and an LLM; accuracy hard to guarantee.
- **Verdict**: **weak** (unproven demand, many tiny attempts, paywall/ToS risk).

## N14. Chinese-specific reference formatting (GB/T 7714-2025, bilingual references, Word numbering)

- GB/T 7714—2025 was published 2025-12-02 and took effect 2026-07-01 (https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=C6CE52E55AC09B9C79A20AEA77CEDD14). It is already supported: zotero-chinese/styles (6,326★) ships 2025 styles (e.g., issue #630); zepinglee/gbt7714-bibtex-style (1,428★) added the 2025 styles (PR #188, 2025-06-28; follow-up issue #206, 2026-09-11); hushidong/biblatex-gb7714-2025 (60★, 2026-07-21).
- Word users who number references by hand and merge "[1][2][3]" into "[1-3]" with cross-reference field codes: many CSDN/Baidu tutorials describe the same manual field-code trick (e.g., https://blog.csdn.net/qq_38939822/article/details/129140249); reference managers (Zotero/NoteExpress with GB/T styles) already do this.
- Bilingual references (Chinese entries with English translations, required by some Chinese journals): zotero-chinese bilingual styles exist; I could not read first-person posts (CSDN and Zhihu blocked fetching).
- **Verdict**: **already met** (GB/T 7714-2025, numbering) / **weak evidence** (bilingual).

---

## Also checked and found met or too thin (no full write-up)

| Need (users' words) | Evidence seen | Existing solution | Verdict |
|---|---|---|---|
| "Show Overleaf comments in the PDF / export them" | TeX.SE q/758779 (2026-01-26, 413 views, unanswered); Overleaf comments are not in the source download | salokr/overleaf-comment-exporter (22★, 2026-06, Chrome/Firefox/Edge), Mangluu/overleaf-comments-export, PyPI `overleaf-comments-export`, a CSV/XLSX Chrome extension | already met |
| "Turn a pasted reference list into Zotero items / BibTeX" | Zotero forum threads (e.g., https://forums.zotero.org/discussion/64278) | AnyStyle (open source, web) + Zotero import, documented in Zotero's KB (https://www.zotero.org/support/kb/importing_formatted_bibliographies) and many library guides | already met |
| "Update metadata of items already in Zotero" | zotero/zotero#1515 (49 👍, open since 2018) | Linter for Zotero (1,059★), arXiv Workflow (389★); Zotero says native updating "is coming" | met by plugins |
| "Is my double-blind submission really anonymous?" (PDF metadata, self-citations, links) | academia.SE q/213456 (2024-09-09, 3,687 views) about anonymizing LaTeX sources | acmsigsoft/submission-checker (70★, organizer-side, last push 2021); Oleafly preflight has a privacy/blind-review check | weak evidence |
| "Remove my comments before sending the source" | academia.SE q/227379 (2026-08-03, 3,006 views): comments left in the .tex sent to the journal | google-research/arxiv-latex-cleaner (7,073★) strips comments | already met |

---

## Ranking

Ranked by how strong the need is *and* how much of it is still unmet for a small standalone tool. "People" counts independent people quoted in their own words (all years; 2024–2026 in brackets where known); institutions and tool builders are listed separately.

| Rank | Need | People | Existing solutions (best) | Verdict |
|---|---|---|---|---|
| 1 | N1 Marked-up revision PDF from LaTeX that compiles | 23 (19) + ≥ 7 builders in 2026; failure reproduced here | latexdiff (677★) partly; Overleaf track changes paid-only; ≥ 7 web services and > 40 wrappers (0–15★) partly; GoBobr/texdiff created 2026-10-01 | **strong, partly met, crowded with unadopted attempts** |
| 2 | N6 Clickable Zotero citations → bibliography in Word | 44 (21) + ≥ 9 "+1"; rising in 2025–2026 | ZoteroLinkCitation 139★, ZoteroCiteLinker 72★, ZoteroLinker ~675 downloads: all partly (Windows, style lists, links lost on refresh); Zotero plans an unlink-time option | **strong, partly met** |
| 3 | N2 LaTeX thesis must pass accessibility checks (ADA Title II, 2026) | 6 people (1 cited by title only) + 1 template maintainer (all 2025–2026) + ≥ 10 university pages | LaTeX tagging + `check-tagging-status` (native), veraPDF/PAC, university templates, Oleafly in-app preflight (194★): partly; no standalone checker that maps failures to LaTeX fixes | **strong but emerging, partly met** |
| 4 | N9 LaTeX → Word for co-authors/supervisors/journals (and back) | 6 people + 1 template guide + ≥ 9 personal converters | Overleaf "Export as Word" (Pandoc), Pandoc, latex-to-word-workflow skill 128★: partly; 364 converter repos in a year; return path: two 0★ skills | **medium, partly met, very crowded** (return path open but thinly evidenced) |
| 5 | N8 Overleaf .bib ↔ Zotero without premium | 27 (12) | Zotero API URL trick; BBT→Overleaf extension (1,000 users): partly | **medium, partly met** |
| 6 | N10 Overleaf free plan limits (10-s compile, 1 collaborator) | 7 (7) | local compile, Overleaf-Workshop 1,675★, olcli 201★ | **medium, mostly met** |
| 7 | N7 EndNote / Mendeley Cite / Citavi → live Zotero citations in Word | 35 (3; none in 2025–2026) | en2zotero, mc2zotero, CiteMigrate (2026, 0–4★); legal risk | **medium, met on paper** |
| 8 | N5 Response letter in sync with the revision | 12 (4 on the sync part) | > 100 templates; lineno+xr; AI drafting | **weak–medium, mostly met** (fits as a feature of N1) |
| 9 | N3 References exist and are correct (AI-invented references) | ≥ 10 (≥ 9) | refchecker 532★, hallucinator 378★, ≥ 7 more OSS, ≥ 6 free web services | **already met** (strong need) |
| 10 | N4 Update preprints to published versions | ~10 (3) | rebiber 3,038★, bibtex-updater, arXiv Workflow for Zotero 389★ | **already met** |
| 11 | N11 Compiles on Overleaf, fails on arXiv | 6 (6) | arXiv's own Nov 2025 update (.bib processing, TeX Live 2025, XeLaTeX); arxiv-latex-cleaner 7,073★ | **already met** |
| 12 | N14 GB/T 7714-2025 and Chinese reference formatting | — | zotero-chinese styles, gbt7714-bibtex-style, biblatex-gb7714-2025 | **already met** |
| 13 | N12 Figures/fonts to publisher rules | 0 first-person in 2024–2026 | known one-line fixes; PLOS PACE; many commercial checkers | **weak / met** |
| 14 | N13 Does the cited paper support my claim? | 0 direct | ~27 tiny 2026 attempts (0–8★) | **weak** |

**Reading of the ranking.**
- Nothing found is both strong and unserved. The three best candidates (N1, N6, N2) are all partly met: N1 and N6 by tools with known, documented failure modes; N2 by fast-moving native features without a practical checker on top.
- N1 is the most painful at the moment of need (deadline, editor's request, reproducible failures) but the most crowded with tiny attempts; success would require visibly better compile reliability on real manuscripts, and such tools are used once per revision.
- N6 has the most people and is still rising, but its hardest part (links that survive Zotero refreshes) may only be fixable inside Zotero, which says a built-in option is planned.
- N2 is new (driven by an April 2026 legal deadline), less crowded, and testable on this machine (TeX Live 2022 is installed but too old for tagging; a current TeX Live, veraPDF and PAC would be needed), but it is US-centric and seasonal, and it depends on upstream LaTeX changes.
- Testing on this PC: N1 and N9 can be tested now (TeX Live 2022 with latexdiff 1.3.2, Pandoc to be checked); N6 needs Microsoft Word with the Zotero plugin (not checked whether Word is installed); N2 needs TeX Live 2025+.
