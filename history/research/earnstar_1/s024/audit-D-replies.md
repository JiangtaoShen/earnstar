<!-- Copied from the private working file lab/s024/audit-d/audit-D.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Independent landscape audit: D, "who owes the next reply?" for GitHub maintainers

S024, 2026-10-03 (UTC). An independent auditor with no stake in the choice ran fresh searches. Everything was read-only: nothing was posted, starred, followed, installed, or opened as an issue or PR. Sources: GitHub Marketplace (its JSON search endpoint, default sort "popularity-desc", and `sort:created-desc`), GitHub REST/GraphQL search (repos, issues, legacy code search), the GitHub changelog (WordPress API, 2025-01 to 2026-10), the public roadmap (`github/roadmap`), GitHub Docs, web search, READMEs and source files of every tool named below.

**Question.** Can a small maintainer today (a) keep a reply-state label (waiting for author / needs maintainer) current automatically, (b) let a stale job close only issues that wait on the author, and (c) see across all their repos the items where they owe the next reply? Where the answer is "partly", what is left, and would an unknown author's new Action be found and used without promotion?

**Scratch evidence in this folder (`lab/s024/audit-d/`)**
- Marketplace: `mp.mjs` (search), `mp/` (53 queries), `mp_summary{1,2,3}.txt`, `slug2repo.mjs`, `slugs1*.tsv`, `slugs2.tsv`, `mp_recent_cat.txt`, `mpdate.mjs` (page-to-date map), `mpsample.mjs`/`mpsample.json` and `mpuse.mjs`/`mpsample_uses.json` (40-action adoption sample).
- Code search: `cs.mjs`/`cs_out.json` (who references each Action), `cq.mjs`/`cq_out.json`, `cq_actions.json`, `cq_reconcile.json`, `cq_gitdeck.json`.
- Repo and issue search: `rs.sh`, `rs1-3.txt`, `rs_ghx.txt`, `is.sh`, `is1.txt`, `ic.sh`, `t_stale1122.txt`, `t_stale346.txt`, `t_stale719.txt`, `stale_issues.txt`, `builtown_2024_2026.txt`, `need_more.txt`, `ghdash_issues.txt`.
- GitHub Community: `ds.sh`, `dc.sh`, `ds1.txt`, `d177902.txt`, `d200164.txt`, `d185387.txt`, `d197319.txt`.
- Native: `clsearch.mjs`, `clget.mjs`, `cl1.txt`, `cl2.txt`, `cl/native1.txt`, `cl/native2.txt`, `roadmap_status.txt`, `agentics_*.md`.
- READMEs of 46 tools: `readme/`; gitdeck's inbox logic: `gitdeck_inbox.ts`.

---

## 1. Existing solutions

"Uses" = workflow files under `.github/workflows` that reference the Action (legacy code search, 2026-10-03; forks excluded by GitHub). "Ext. owners" = distinct owners among the first 100 hits other than the Action's own owner. ★ = stars. Verdict is against D's job, not against the tool's own goal.

### 1.1 Packaged Actions for the reply-state lifecycle

| Tool | ★ / uses / ext. owners / last push | What it does | Verdict | Evidence |
|---|---|---|---|---|
| [tiangolo/issue-manager](https://github.com/tiangolo/issue-manager) | 73 / **213** / 68 / **2026-10-02** (releases 0.7.0–0.8.1, June–July 2026) | Maintainer adds a label (`waiting`, `answered`, …); if nobody comments within the per-label delay, it posts a message and closes; if anyone comments after the label, it **removes the label** (`remove_label_on_comment`, default true); optional reminder before closing; works on PRs (new review or commit counts). Docker action, default `GITHUB_TOKEN`. | **Meets (b)** and the "remove waiting label on reply" half of (a). Fails: does not add the label on a maintainer comment, no "needs maintainer" label. | `readme/tiangolo_issue-manager.md`; Marketplace slug `tiangolo-s-issue-manager` |
| [lee-dohm/no-response](https://github.com/lee-dohm/no-response) | 48 / 193 / 76 / 2024-01-25 | Closes labelled issues after N days without author reply; removes the label when the author replies. `node12`. | **Meets (b)** for the author side; inactive but **still runs**: prettier, yazi, zoxide and pyenv runs on 2026-10-02/03 all `success`. Not listed in the Marketplace (404). | `action.yml`; runs via `gh api …/actions/workflows/…/runs` |
| [hramos/needs-attention](https://github.com/hramos/needs-attention) | 13 / 41 / 36 / 2024-11 (`node16`) | When the issue author comments on an issue labelled "Needs Author Feedback", removes it and adds "Needs Attention". Maintainer adds the first label by hand. | **Partly (a)**: the swap, not the add. | README; Marketplace `needs-attention` (listed under "needs response", "needs author") |
| [siegerts/pending-response](https://github.com/siegerts/pending-response) / [pending-author-response](https://github.com/siegerts/pending-author-response) | 2 / 1 and 0 / 9 / 2023-03 (`node12`) | Removes a pending-response label when a non-member (by `author_association`) comments; optionally adds an "actionable" label. | **Partly (a)**, works on personal repos. | README; Marketplace `pending-response-follow-up`, `pending-author-response-follow-up` |
| [jd-solanki/gh-action-toggle-awaiting-reply-label](https://github.com/jd-solanki/gh-action-toggle-awaiting-reply-label) | 1 / 105 / 79 / 2023-12 | Toggles one label: adds it when a team member comments, removes it when the issue author comments. | **Meets (a) for organization repos only**: member detection calls `orgs.checkMembershipForUser({org: ctx.repo.owner})` (`index.js:93-116`), so personal-account repos never see a "member". 53 of its first 100 users are ThemeSelection admin-template copies. | `index.js`; README note "narrowed down to organization usage only" |
| [MBilalShafi/no-response-add-label](https://github.com/MBilalShafi/no-response-add-label) (fork of no-response) | 1 / 26 / 19 / 2024-02 | no-response plus adding a label on author reply. | Partly (MUI and antvis use it). | Marketplace `no-response-add-label` |
| [aws-actions/stale-issue-cleanup](https://github.com/aws-actions/stale-issue-cleanup) | 13 / 153 / 23 (49 of 98 repos are `aws/*`) / 2026-08-25 | Stale bot that runs only on issues with a `response-requested` label and removes labels on new activity. | **Meets (b)**. | README |
| [imhoffd/needs-reply](https://github.com/imhoffd/needs-reply) | 4 / 10 / 6 / 2024-09 | Closes labelled issues after no reply. | Partly (b). | Marketplace `close-issues-after-no-reply` (rank 1 for "no reply") |
| [retorquere/label-gun](https://github.com/retorquere/label-gun) | 0 / 13 / 4 / 2026-08-31 | Issue state machine (`awaiting`, `in-progress`, `blocked`, `backlog`), demands evidence, reopens on user activity, Project sync. | Partly (a)+(b), Zotero/CSL ecosystem only. | README |
| [Sonia-corporation/stale](https://github.com/Sonia-corporation/stale) | 15 / 19 / 6 / 2026-09-24 | actions/stale alternative. | Fails (no reply-state). | README |
| FTBTeam/awaiting-reply-action (archived), v-fidelusaleksander/state-labels (labels as key-value store, 2025-09), bugwelle/no-response-action (maintained fork, 2026-09), step-security/needs-attention (hardened copy), mheap/github-action-issue-management (4★), Automattic/action-repo-gardening, krizzu/issue-triage-action, probot/stale-action (archived) | 0–6 / 0–11 / 0–4 | Variants of the above. | Partly or fails. | `cs2.txt`, READMEs |
| Reusable workflows: anchore/workflows `remove-awaiting-response-label.yaml` (2024-09), open-telemetry `issue-management-stale-action.yml`, robogeosociety `awaiting-your-action.yml` template | org-internal | Same job, shared inside one org. | Partly. | `cq_actions.json` |

**Recipe already possible with no code** (verified from the READMEs): `hramos/needs-attention` or `siegerts/pending-response` (swap on author reply) + `tiangolo/issue-manager` or `actions/stale` with `only-labels: <waiting label>` (close only author-waiting issues). What no maintained packaged Action does: **add** the waiting label automatically when a maintainer replies on a **personal-account** repo, and **add** "needs maintainer response" to new or answered items, in one configuration.

### 1.2 Stale family

| Tool | Status | Verdict |
|---|---|---|
| [actions/stale](https://github.com/actions/stale) (1,716★; v11.0.0 2026-07-28) | Options through v11: `only-labels`, `any-of-labels`, `exempt-*`, `labels-to-add-when-unstale`, `labels-to-remove-when-unstale`, `ignore-updates`, `only-issue-types`, `sort-by`, … No option keyed on who commented last. [#1122](https://github.com/actions/stale/issues/1122) (open since 2023-12, 20 comments; labelled a feature request by a GitHub contributor on 2025-04-10) asks exactly for this. | Partly: closes only author-waiting issues if a label is kept by something else (254 workflow files point `only-labels` at an "awaiting" label). |

### 1.3 Bots and Apps

| Tool | Verdict |
|---|---|
| Microsoft GitHub Policy Service (`.github/policies/*.yml`, "Needs: Author Feedback" + "No-Recent-Activity") | Meets (a)+(b) but is **Microsoft-internal** (run by "GitHub Inside Microsoft", 1ES). Not available to others. |
| [microsoft/vscode-github-triage-actions](https://github.com/microsoft/vscode-github-triage-actions) (144★, **archived**) | `needs-more-info-closer`, `author-verified`, etc. Fails (archived, VS Code-specific). |
| probot/no-response, probot/stale (Apps) | Archived. Their users moved to lee-dohm/no-response and actions/stale; that migration is how no-response got its 193 users. |
| Mergify, palantir/policy-bot | PR merge rules; no issue reply-state. Fail. |
| Dosu ([dosu-ai/better-stale-bot](https://github.com/dosu-ai/better-stale-bot), 6★, 0 uses) | LLM agentic workflow (needs an LLM key); reads threads, removes `Stale` on non-bot activity. Does not separate maintainer-owes from author-owes. Fails D's "deterministic" requirement. |

### 1.4 LLM and agentic triage (2026)
- GitHub Agentic Workflows samples ([githubnext/agentics](https://github.com/githubnext/agentics), 972★): `issue-triage.md` applies `needs-info`; `repo-assist.md` tracks issue states including `awaiting_clarification`. LLM, paid engine.
- [withastro/triagebot-action](https://github.com/withastro/triagebot-action) (221★, 2026-06): LLM label state machine (reproduce, fix, ask reporter).
- Marketplace "issue triage" listings by `created-desc` (`mp_recent_cat.txt`): about 30 of the newest are AI triagers (jev-triage, hush, laya, groundskeeper, triagepod, copilot-triage, maintainerbot, …). None keeps a deterministic reply-state.
- Verdict: partly (they can set a waiting label), but they need an LLM and do not track the turn.

### 1.5 Cross-repo "where do I owe the reply?"

| Tool | ★ / created | What it does | Verdict |
|---|---|---|---|
| [ai-ecoverse/gh-monday](https://github.com/ai-ecoverse/gh-monday) (gh extension) | 0 / 2026-02-16 | "ACTION NEEDED — PRs/issues where someone else acted last (waiting on you)"; enriches each item with its last actor; also "WAITING ON OTHERS". Scope: PRs authored/review-requested/assigned and issues **involving you**, 7-day window by default. | **Partly**: the exact signal, but misses issues in your repos that never involved you and anything older than the window. |
| [adamsilverstein/landingit](https://github.com/adamsilverstein/landingit) | 0 / 2026-03-25 | Multi-repo PR and issue dashboard with a "Last Commented By" column and a filter hiding rows where you commented last ([#113](https://github.com/adamsilverstein/landingit/issues/113), 2026-04-22). | Partly (desktop app, PR-centred). |
| [nobe4/gh-not](https://github.com/nobe4/gh-not) | 36 / 2024-05 | Notification manager; enrichment adds authors and **latest commenters**; jq rules can filter on them. | Partly (notifications only). |
| [JoshuaKGoldberg/prune-github-notifications](https://github.com/JoshuaKGoldberg/prune-github-notifications) | 7 | Filters notifications by latest comment author (v0.12.0, [#754](https://github.com/JoshuaKGoldberg/prune-github-notifications/issues/754), 2026-09-20). | Partly (pruning, not a queue). |
| [matsen/bipartite](https://github.com/matsen/bipartite) `bip checkin` | 32 / 2026-01 | "Ball-in-court" filter across repos ([#102](https://github.com/matsen/bipartite/issues/102)). | Partly (research-group tool). |
| [debba/gitdeck](https://github.com/debba/gitdeck) (formerly gh-dashboard) | 417 / 2026-04-29 | Cross-repo issues and PRs with an "inbox"; reasons are review-requested, assigned, mentioned, comment count (`src/utils/inbox.ts`); no last-commenter logic. | Partly. |
| [k1LoW/gh-triage](https://github.com/k1LoW/gh-triage) | 37 | Rule-based notification triage; fields include `author`, `answered` (Discussions only); no last-commenter field. | Fails for this signal. |
| [dlvhdr/gh-dash](https://github.com/dlvhdr/gh-dash) | 12,581 | Sections defined by GitHub search filters; added a notifications view (PR #738, 2026-01). Search has no last-commenter qualifier; no issue asks for one. | Partly (can show "never commented by me", not "replied after me"). |
| gebibd00-jpg/oss-maintainer-pulse, Alexandr-Kravchuk/github-pr-manager, alrayyes/forge-dashboard, jackchuka/gh-oss-watch (13★), radiohead/gh-inbox, chadmayfield/gh-repos-hud, Octobox (4,485★), Gitify (5,361★) | 0–13 / 2025–2026 | Digests, PR queues, notification clients. | Partly or fail. |

### 1.6 What projects actually do (behaviour, re-counted)

| Code search (`path:.github/workflows`) | Files | Repos / owners in first 100 |
|---|---|---|
| `issue_comment author_association awaiting` | **180** (the G2 count, reproduced exactly) | 97 / 89 |
| `only-labels awaiting` | 254 | 98 / 77 |
| `"waiting for author"` | 231 | 79 / 54 |
| `"awaiting response" issue_comment` | 186 | 100 / 73 |
| `"needs maintainer"` | 176 | 89 / 81 |
| `"waiting for maintainer"` | 140 | 61 / 46 |
| `"needs-author-feedback"` | 92 | 72 / 47 |

New hand-written implementations in 2024–2026 (each read; `builtown_2024_2026.txt`): anchore (2024-09), microsoft/autogen (2024-10), JuliaDocs/Documenter.jl (2025-10), prowler (2025-11), jaeger (2026-01), dora-rs (2026-04, "generated with Claude"), mocha (2026-05 and 2026-08; the second written by Copilot), typescript-eslint (2026-06 proposal), SignalK (2026-07), gchq/CyberChef (2026-07), LangChain. None adopted a packaged Action; each wrote its own in one PR.

## 2. GitHub-native status (as of 2026-10-03)
- **Issue search** has no last-commenter or "awaiting" qualifier (Docs list checked). But native search already gives a cross-repo **"never replied by me" queue**: `user:@me is:issue is:open -commenter:@me` (tested on sindresorhus: 875 of 1,204 open issues), and it can be pinned as a **saved view** (dashboard 2025-05; repository saved views GA 2026-08-20; private saved views GA 2026-09-25). What native search cannot express is "I replied, then the author replied after me".
- **Notifications** cover that remaining case: after commenting, a maintainer is subscribed and the author's reply returns the thread to the inbox. A dashboard-feedback commenter says notifications already show what awaits them ([#177902](https://github.com/orgs/community/discussions/177902)).
- **PR dashboard** (github.com/pulls, GA 2026-07-09): "Inbox" sections for review requests, PRs needing fixes (CI failures, new comments) and ready to merge. This is the native "waiting on me" for PRs. Nothing equivalent exists for issues.
- **New dashboard** default since 2026-10-01: issues and PRs lists with filters, up to 12 items per list.
- **Issue fields** GA 2026-07-02 for organizations only (not personal-account repos, per the changelog and the Docs).
- **Roadmap, public preview pending**: **"Granular issue status"** ([github/roadmap#1336](https://github.com/github/roadmap/issues/1336), 2026-09-24; plans Free, Team, Enterprise): statuses beyond open/closed, usable "across issue lists, boards, APIs, and automation without needing to stitch together labels". Also "Issues Board View" (#1337), "Show repo member role labels in Issue list view" (#1334, GA), and "Focused issue timeline and activity panel" (#1332). A native "Waiting for author" status is one config step away once this ships, and a label-based tool would then be the old way.
- **Copilot automations** (2026-06-02; comment triggers 2026-08-03) and **agent automation controls** (2026-07-23) can set labels and status on each comment, but need paid Copilot and an LLM; public-repo support was "coming soon" at launch.
- **Projects built-in workflows**: no trigger on comments or commenters (Docs checked).
- **actions/stale**: v11.0.0 (2026-07-28) added nothing in this direction; #1122 is open.

## 3. Adoption reality for the channel (GitHub Actions and the Marketplace)

**Marketplace size and ranking**
- 33,638 Actions are listed. Ordered by `created-desc`, pages 1–100 (2,000 listings) cover 2026-08-01 to 2026-10-02, so about **850–1,000 new listings a month** in 2026.
- Default ranking is "popularity-desc" and appears to follow dependents: crmne/copilot-triage, 18 days old, ranks first for "reply" with 97 workflow files in 48 repos of only 3 owners (its author's own).
- Search requires every query word in the name or description. For D's users' own words, the slots are empty:

| Query | Results | Rank 1 |
|---|---|---|
| "awaiting response", "awaiting reply", "awaiting feedback", "waiting for author", "needs reply", "needs feedback", "unanswered", "replied", "responded" | **0** | — |
| "needs response", "needs author" | 1 | hramos `needs-attention` |
| "no reply" | 3 | imhoffd `close-issues-after-no-reply` |
| "no response" | 3 | an unrelated release-notes tool; `no-response-add-label` 2nd |
| "follow up" | 7 | release-follow-up; `pending-response-follow-up` 3rd |
| "stale" | 76 | actions/stale |
| "label on comment" | 15 | an AI labeller; `pending-response-follow-up` 10th |
| "reply" | 18 | copilot-triage; `close-issues-after-no-reply` 6th |

So a new Action whose description contains those words would be the only hit for them. Whether maintainers type them into the Marketplace is unknown: search volume is not public. Web search for the users' words does surface Marketplace listings (jd-solanki's toggle and imhoffd's closer were the first results for "github action remove waiting for author label when author comments").

**Reference class 1: Marketplace Actions listed 2026-03..07** (`mpsample_uses.json`): 40 Actions, two fixed positions on every 10th `created-desc` page from 110 to 300, ages about 2.5–7 months; 34 of 40 owners have fewer than 100 followers.
- **Stars**: median 1, p75 1, p90 5; 19 have 0; 3 have ≥ 10.
- **Workflow files in other owners' repos: 35 of 40 have none**; 5 have ≥ 1, 2 have ≥ 2, maximum 6 owners (derailed-dash/gemini-review-action). One of the two with ≥ 2 counts only the author's own organisations (hpehl → hal, patternfly-java). 22 of 40 have no reference at all, not even from the author.

**Reference class 2: this category.** Every Action here with more than 20 users got them through a host project or a migration, not through discovery:

| Action | Users came from |
|---|---|
| lee-dohm/no-response (193) | Migration from the archived probot/no-response App; GitHub-staff author; used in github/docs |
| tiangolo/issue-manager (213) | FastAPI ecosystem (author has 32k followers) |
| aws-actions/stale-issue-cleanup (153) | AWS repositories (49 of 98) |
| jd-solanki toggle (105) | ThemeSelection admin templates copied by template users |
| hramos/needs-attention (41) | React Native and Facebook SDKs |
| MBilalShafi/no-response-add-label (26) | MUI and antvis |

Category Actions by authors without such a host have 0–2 external owners after 1–6 years: FTBTeam (0), state-labels (0), mheap (0), bugwelle (0), step-security (0), krizzu (2), siegerts pending-response (1).

**Feedback loop.** The category's issue trackers are almost silent: tiangolo/issue-manager has 8 issues in 7 years (mostly the author's tests); hramos/needs-attention has 3 issues.

**Agents.** In 2026, projects ask an agent to write the workflow inline (mocha via Copilot, dora-rs via Claude). An Action published in 2026-10 is not in any model's training data, so agents will not suggest it.

## 4. Negatives and need, re-checked

### 4.1 Negatives in the G2 report and `needs.md`

| Claim | Checks (three or more, differently worded) | Result |
|---|---|---|
| "No cross-repo 'waiting on me' view; gh-dash cannot express 'last human comment is not a maintainer's'" | (1) gh-extension topic search: notifications, triage, inbox, dashboard, maintainer, review, stale; (2) issue search: "last commenter", "waiting on me", "last comment" filter, "needs reply"; (3) two web searches; (4) source of gitdeck and gh-monday | **Refuted as written.** gh-monday (2026-02) ranks "someone else acted last (waiting on you)" across repos; landingit filters "last commented by"; gh-not and prune-github-notifications filter notifications by latest commenter; native `-commenter:@me` saved views cover never-answered items. **True in a narrow form**: no tool lists, for every repo you own, issues where a non-maintainer spoke after the last maintainer comment with no time window. The gh-dash part is verified (search filters only; no issue asks for it). |
| "lee-dohm/no-response is abandoned" | (1) last push 2024-01-25, dependency PRs open since 2022–2023, 2024 issues unanswered; (2) `node12` in `action.yml`; (3) recent runs in four projects | **Verified as inactive, but it still works** (all runs `success` on 2026-10-02/03), and a maintained replacement for the same job exists (tiangolo/issue-manager, releases in June–July 2026, 213 users). "Abandoned" overstates the gap. |
| "actions/stale has no notion of who replied last" | (1) full option list in the v11 README; (2) release notes v9.1.0–v11.0.0; (3) its issues: #1122 open, #346 (2021) closed unimplemented, PR #1358 (`ignore-bot-updates`) open | **Verified.** |
| "Toggle actions have 1–4 stars" | Stars plus code search | **True for stars, misleading for use**: jd-solanki 105 files, hramos 41 (13★), MBilalShafi 26 (1★). In this category stars do not track use. |
| "Issue fields are organization-only" | Changelog GA text; Docs; web search | **Verified.** But "granular issue status" is on the roadmap for Free plans (2026-09-24). |
| "180 hand-written workflows" | Same query re-run | **Reproduced: 180.** L-031 still applies (about 20 independent projects in the first 100). Count drift between reports: no-response is 193 under `.github/workflows`, 368 in any `.yml`, and 609 anywhere (the 435 in `needs.md` sits in this range); `only-labels awaiting` is 254 under workflows and 744 in any `.yml` (`needs.md` says 774). Cite the workflows-path counts. |
| "An LLM-based stale bot (6★)" | Repo, code search | Verified (dosu-ai/better-stale-bot: 6★, no code-search users). |
| Implicit: "ready-made Actions are old, tiny or one-sided" | §1.1 | **Partly refuted.** tiangolo/issue-manager is current, used, and does the author-side job well. A no-code two-Action recipe exists. |

### 4.2 Need strength (2024–2026, distinct people, L-031)
- **People stating the outcome in their own words: about 12**, with one or two more (P) or agent-assisted:
  - wolph ([actions/stale#1122](https://github.com/actions/stale/issues/1122#issuecomment-2572015048), 2025-01-06): a maintainer of many projects who wants issues never closed until reviewed, but closed after the reporter goes silent. This is the clearest statement of D, and it is **addressed to actions/stale**, not to a new tool.
  - gforsyth ([ibis#9717](https://github.com/ibis-project/ibis/issues/9717), 2024-07-29): a view of issues whose last commenter is not a project member. Solved with a script.
  - The jacobtomlinson.dev blog post (2024-12).
  - fingolfin ([Documenter.jl#2795](https://github.com/JuliaDocs/Documenter.jl/pull/2795), 2025-10).
  - andoniaf ([prowler#9245](https://github.com/prowler-cloud/prowler/pull/9245), 2025-11).
  - yurishkuro ([jaeger#7899](https://github.com/jaegertracing/jaeger/pull/7899), 2026-01).
  - phil-opp (dora-rs#1605, 2026-04).
  - JoshuaKGoldberg ([mocha#5978](https://github.com/mochajs/mocha/issues/5978), 2026-05; prune-github-notifications#754, 2026-09).
  - adamsilverstein ([landingit#113](https://github.com/adamsilverstein/landingit/issues/113), 2026-04).
  - StyleShit ([typescript-eslint#12461](https://github.com/typescript-eslint/typescript-eslint/issues/12461), 2026-06).
  - tkurki (SignalK#2824, 2026-07).
  - mark-wiemer ([mocha#6212](https://github.com/mochajs/mocha/issues/6212), 2026-08).
  - matsen (bipartite#102, 2026-02, agent-written).
  - One counter-voice: a maintainer in #1122 (2025-08) is satisfied with adding a stale label by hand.
- **Every one of them solved it themselves**, with a workflow or a personal dashboard, usually in one PR and often with an agent.
- **Requests for a packaged tool in 2025–2026: none found.** The closest is wolph's request that actions/stale itself add the option.
- **Requests for a cross-repo "waiting on me" view**: four (gforsyth, adamsilverstein, JoshuaKGoldberg, matsen), all self-built.
- **GitHub Community**: no thread for this; 12 queries returned nothing on-topic (`ds1.txt`).
- **Verdict**: the outcome is a real, recurring maintainer need, roughly as well evidenced as N2's linking need, or slightly better. The need for a **tool** is near zero: people with the need meet it in minutes themselves, and the prototype found their workflows work (1 stale label in 15).

## 5. Re-scored on the program's five criteria (one standard, `needs.md`)

| Criterion (weight) | Prior (`needs.md`) | Audit | Reason |
|---|---|---|---|
| Need (30 %) | 4 | **4** | About 12 distinct people in 2024–2026 state the outcome; hundreds of workflow files; new self-built implementations every month in 2026. |
| Unmet (20 %) | 2 | **2** (1.5 for the Action, 2.5 for the queue) | Self-built workflows work, and a maintained Action (issue-manager) plus a swap Action give a no-code recipe. Native saved views cover "never replied". gh-monday, landingit and gh-not already compute "someone else spoke last". The residue: one config doing the whole state machine on personal-account repos, and an all-owned-repos queue for "author replied after me". |
| Serve (20 %) | 5 | **4.5** | Deterministic and fully testable on public repos. Minus: a native status field is coming and may replace labels; `author_association` edge cases (private org members show as CONTRIBUTOR, triage-role users, bots). |
| Find (15 %) | 3 | **2.5** | The users' exact words are unclaimed in Marketplace search (rank 1 for 9 queries), and web search reaches Marketplace listings: a 3 by the rule. Reduced because the measured base rate is about zero: 35 of 40 Actions listed 2026-03..07 have no external user at 2.5–7 months. Every Action in this category with real use got it from a host project or a migration the program cannot copy. Agents write the workflow inline. |
| Improve (15 %) | 4 | **3** | Users of this category almost never file issues (8 and 3 issues in seven and four years). The developer's own repos have little issue traffic, so its own use teaches little. A native status may move the target. Iterations exist (PR support, native-status sync, the gh extension) but will run on little evidence. |
| **Weighted** | 3.65 | **3.33** | 1.20 + 0.40 + 0.90 + 0.375 + 0.45. Range under other defensible scores: 3.0 (3.5/1.5/4.5/2/3) to 3.68 (4/2.5/5/3/3.5). N2 after its critique is 3.08 (range to 3.40): **the two now overlap, within noise.** |

**Expected outcome** if released around 2026-10-30, measured 2026-11-25 (26 days) and 2026-12-25 (56 days):
- **Workflow files in other owners' repos referencing the Action** (code search, the observable usage measure): **median 0**, 80 % interval 0–2, ≥ 5 a tail below 5 %. Basis: reference class 1 (5 of 40 with any external user at 2.5–7 months, mean 0.28 owners) and the no-host Actions of reference class 2 (0–2 external owners after years). A shorter window than class 1, but the Marketplace slots for the users' exact words are empty: these offset.
- **Stars across the Action and the gh extension**: **median 1, range 0–3**, tail about 5. Basis: class 1 stars (median 1, p90 5); gh extensions (L-035, median 0); stars in this category do not follow use.
- **Comparison**: N2's critique predicts 100–300 downloads at 30 days (about 100–200 real installers) and 0–4 stars at close. Expected stars are about the same. **Expected real users are lower for D**: a handful of repos at most, against 100+ installers.

## 6. Verdict
- D's own users already have what they need. Projects that care write the workflow in one PR, often with an agent; their workflows work (L-031). A maintained packaged Action (tiangolo/issue-manager, 213 users, released in July 2026) already does the author-waiting half: close only labelled issues, and drop the label on reply.
- The cross-repo "waiting on me" half is crowded with 2026 one-person tools (gh-monday, landingit, gh-not rules, gitdeck). Native saved views (`-commenter:@me`) and notifications cover most of it.
- GitHub has "granular issue status" on its public roadmap for Free plans. That may soon make a label-based state machine the old way.
- The residual gap is narrow: one configuration that runs the full state machine on personal-account repos, and an all-owned-repos queue for "the author replied after me". In 2025–2026, nobody asked for either as a packaged tool.
- The channel does not carry unknown authors. 88 % of 2026 Marketplace Actions have no outside user after months. Every Action in this category with real use got it through a famous host project, a template, or an App migration.
- **Expected result by close: 0–2 outside repos and 0–3 stars.** That is no better than N2 on stars, and worse on real users.
- **Strengths that stand**: it is the developer's own job (it triages program repos every session), it is fully deterministic and testable, and the users' words are unclaimed in Marketplace search.
- **Do not present D as the "safer" or higher-scoring alternative.** Corrected, it is 3.3 against N2's 3.1: a tie on the program's rules, with both expected to earn about one or two stars.
- **If the owner picks D**:
  - Pick it knowingly as a well-made tool for the developer's own use with a small findability bet.
  - Narrow v1 to the actual residue: personal-account repos, one file, the full state machine, a stale guard, and a mapping to native issue status when that ships.
  - Pre-register the code-search usage measure at release + 26 and + 56 days.
  - Do not build the gh extension unless the queue covers "the author replied after me" across all owned repos with no time window; anything less duplicates gh-monday and saved views.
