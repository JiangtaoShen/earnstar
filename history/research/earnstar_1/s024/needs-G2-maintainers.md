<!-- Copied from the private working file lab/s024/needs-G2.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# User needs, group G2: maintainers of small and mid-sized open-source projects on GitHub

Session S024, researched 2026-10-02/03 (UTC). Read-only research; nothing was posted anywhere. Usernames are omitted; links point to the exact comment or post.

**Sources**: GitHub Community discussions (GraphQL search plus a systematic pull of every discussion created since 2025-01 in the Repositories, Projects and Issues and Pull Requests categories and since 2025-06 in the Actions and "Other feedback" categories, ranked by upvotes and comments: 12,361 discussions), cli/cli `extension-idea` issues, top-reacted open issues of release-please, semantic-release, changesets, dependabot-core, renovate, actions/stale, release-drafter and git-cliff, GitHub code search (workflow files), Hacker News (Algolia API), the GitHub blog and changelog 2025–2026, maintainers' blog posts, npm download counts. Three topics were researched by helper agents with the same rules (AI-generated contributions; release and publishing; knowing who uses a project); their raw notes are in `lab/s024/g2/sub-ai/`, `sub-release/`, `sub-usage/`.

**Limits**: Reddit is unreachable. GitHub's search API was shared between four agents and hit its rate limit several times, so some searches were retried or skipped. Upvote counts on GitHub Community mix OSS maintainers with company users; where a need is mostly a company-team need this is said. "Independent people" means different authors on different projects, counted from the linked rows.

**What 2026 already changed** (checked on github.blog/changelog): repository settings to restrict or disable PRs (2026-02-13), pinned comments and "+1" reduction banners (2026-02-05), open-PR limits for users without write access (2026-06-17; draft-PR counting and smarter bypass signals in progress), duplicate-issue detection (preview, 2026-06-18), issue fields (GA for organizations, 2026-07-02), agent automation controls in Issues (2026-07-23), triage-role bypass of issue restrictions (2026-08-03), the new pull-requests dashboard (GA 2026-07-09), the star-history endpoint replacing public stargazer lists (2026-09). Custom thread subscriptions were removed on 2026-08-10 and the removal was paused a week later.

(P) marks evidence from issue or PR bodies that read as agent-written: it shows a project hit the problem, not a maintainer's own words. W marks a person who describes a workaround.

## Part 1. Strongest candidates (deeper look)

### G2-1. Know which issues and PRs are waiting on me, and stop the stale bot from closing the ones that are waiting on me

- **Need**: "the bot threatens to close the issue on me" while "I'm waiting on an update from the maintainer" ([HN](https://news.ycombinator.com/item?id=41317039), 2024-08-22); maintainers answer by hand-building "waiting for author / waiting for maintainer" label state machines.
- **Who and situation**: maintainers of small and mid-sized projects who ask reporters for more information, want issues the reporter abandoned to close on their own, and want the ones where the maintainer owes the next reply to stay visible (and never be closed as "stale").
- **Evidence**

| Quote / artifact | Link | Date | W |
|---|---|---|---|
| "I basically created my own custom response 'action' precisely because the default behavior of stale bot is so aggressive." (links to Neovim's own response workflow) | [actions/stale#719](https://github.com/actions/stale/issues/719#issuecomment-1858310205) | 2023-12-15 | W: own workflow |
| "Default behavior can be disruptive for contributors of a repository" (issue title, 17 reactions) | [actions/stale#719](https://github.com/actions/stale/issues/719) | 2022-04-18 | |
| "Stale bot is becoming a plague, closing important issues and harming the community." | [actions/stale#861](https://github.com/actions/stale/issues/861) | 2022-10-27 | |
| "a stale bot should never mark something as stale if the responsibility is on the maintainer to take an action" (an OSS maintainer's blog) | [jacobtomlinson.dev](https://jacobtomlinson.dev/posts/2024/most-stale-bots-are-anti-user-and-anti-contributor-but-they-dont-have-to-be/) | 2024-12-05 | W: label scheme |
| "It would be fair that this tag is removed as soon as the response is given" | [zephyr#26602](https://github.com/zephyrproject-rtos/zephyr/issues/26602) | 2020-07-02 | |
| "the logic of the workflow does not follow these statements" (stale closes issues users kept alive) | [anthropics/claude-code PR #20914](https://github.com/anthropics/claude-code/pull/20914) | 2026-01-26 | W: fix to own workflow |
| (P) "Adds 6 GitHub Actions workflows to automatically manage issue triage and response-tracking labels" | [aws-blocks PR #176](https://github.com/aws-devtools-labs/aws-blocks/pull/176) | 2026-07-09 | W |
| "Remove 'status: waiting for author' label when review is (re-)requested" (title) | [mochajs/mocha#5978](https://github.com/mochajs/mocha/issues/5978) | 2026-05-18 | W |
| (P) "An unresolved thread whose last comment is not theirs looks the same as one they answered." | [patchdesk#228](https://github.com/kwanpham2195/patchdesk/issues/228) | 2026-09-16 | W: building it |
| (P) "A two-layer, agent-assisted PR triage system to help work down the review backlog" | [pymc-labs/CausalPy PR #1090](https://github.com/pymc-labs/CausalPy/pull/1090) | 2026-07-27 | W |
| Feature request: filter notifications by latest comment author (shipped in v0.12.0) | [prune-github-notifications#754](https://github.com/JoshuaKGoldberg/prune-github-notifications/issues/754) | 2026-09-20 | |

- **Frequency signals**: GitHub code search finds **173** workflow files that react to `issue_comment` with an "awaiting" label and `author_association` (query in `lab/s024/g2`), almost all hand-written with `actions/github-script`; examples range from 13 to 36k stars (gchq/CyberChef 36k, langchain-ai/deepagents 30k, teams-for-linux 5.1k, microsoft/debugpy 2.5k, HomeAssistant-OctopusEnergy 1.0k, obsidian-reminder 662, homebridge-smartthings 38). Several forks of TensorRT-LLM carry the same `waiting_for_feedback.yml`. A further 252 workflow files point actions/stale's `only-labels` at an "awaiting" label, and 193 still use the abandoned lee-dohm/no-response.
- **What people do today**: copy-paste github-script workflows (often 2–6 per repo) that add "waiting for author" when a maintainer asks, remove it when the author replies, add "needs maintainer response" on new issues, and point actions/stale's `only-labels` at the author-waiting label.
- **Existing solutions checked**

| Solution | Adoption | Verdict |
|---|---|---|
| [lee-dohm/no-response](https://github.com/lee-dohm/no-response) (close if author silent; removes label when author replies) | 48 stars, last push 2024-01; still referenced by 193 workflow files (code search) | partly (author side only; abandoned: dependency PRs unmerged since 2023, 2024 bug reports unanswered; maintained fork [bugwelle/no-response-action](https://github.com/bugwelle/no-response-action) 0 stars) |
| [actions/stale](https://github.com/actions/stale) with `only-labels` | very widely used | partly (no notion of who replied last; misfires are the complaint) |
| [aws-actions/stale-issue-cleanup](https://github.com/aws-actions/stale-issue-cleanup) | 13 stars | partly |
| [jd-solanki/gh-action-toggle-awaiting-reply-label](https://github.com/jd-solanki/gh-action-toggle-awaiting-reply-label) | 1 star, last push 2023 | partly (toggle only) |
| [dosu-ai/better-stale-bot](https://github.com/dosu-ai/better-stale-bot) (LLM-based stale bot, Agentic Workflow; needs an LLM API key) | 6 stars, created 2026-04 | partly (reads threads before closing; does not separate maintainer-owes vs author-owes) |
| [imhoffd/needs-reply](https://github.com/imhoffd/needs-reply) (close after no reply) | 4 stars, last push 2024-09 | partly (author side only) |
| [dessant/label-actions](https://github.com/dessant/label-actions), [peaceiris/actions-label-commenter](https://github.com/peaceiris/actions-label-commenter) (act when a label is added) | 129 / 87 stars | fails for this need (label-triggered replies, no reply-state) |
| [github-community-projects/issue-metrics](https://github.com/github-community-projects/issue-metrics) | 540 stars | fails (reports time-to-first-response, no queue) |
| [gh-dash](https://github.com/dlvhdr/gh-dash) | 12.6k stars | fails (GitHub search cannot express "last human comment not by a maintainer") |
| GitHub native: issue fields (GA 2026-07, organizations only), saved views (preview), agentic workflows and Copilot automations (need an LLM) | — | partly (a status field can be defined in orgs, not in personal-account repos; no automatic who-owes-the-reply logic) |

- **Search words**: "awaiting response label github action", "remove waiting for author label when author comments", "issues waiting for maintainer response", "stale bot only close issues waiting on author", "needs reply".
- **Filter**: a GitHub Action in the user's repo (default `GITHUB_TOKEN`, deterministic, no LLM) plus an optional `gh` extension that lists "waiting on me" items across the user's repos; both testable on Windows with Node and `gh` against real public repos (read-only for the queue, a scratch repo for the Action). Passes.
- **Verdict**: **medium-strong, partly met**. The workaround signal is the strongest found in this research (173 hand-written workflows), the ready-made actions are old, tiny, or one-sided, and a maintainer-side "what is waiting on me across my repos" view does not exist. Risk: each project's label scheme differs, so a tool must be configurable without becoming another stale bot.

### G2-2. Catch issues opened through the API or by agents that skip the issue form

- **Need**: "autoclosing opens without the issue template (which implies using the API which often now implies AI)" ([HN, a Homebrew maintainer](https://news.ycombinator.com/item?id=49475029), 2026-08-28).
- **Who and situation**: maintainers who rely on YAML issue forms (required fields, checkboxes, version, reproduction) and now receive issues created by `gh`, the REST API, or coding agents, which bypass the form entirely: no labels, no template sections, often long AI-written text.
- **Evidence** (helper agent; spot-checked: the Homebrew workflow, the Keycloak issue, and the HN comment exist as quoted)

| Quote | Link | Date | W |
|---|---|---|---|
| "autoclosing opens without the issue template (which implies using the API which often now implies AI)" | [HN](https://news.ycombinator.com/item?id=49475029) | 2026-08-28 | W: own [check-issues.yml](https://github.com/Homebrew/brew/blob/main/.github/workflows/check-issues.yml) (Homebrew) |
| "When users create issues with AI, they use the GitHub API ... there are also no labels" | [keycloak-github-bot#84](https://github.com/keycloak/keycloak-github-bot/issues/84) | 2026-09-24 | W: extending own bot |
| "being able to create a blank issue ... by using a non-existent template" | [#185387](https://github.com/community/community/discussions/185387#discussioncomment-17252376) | 2026-06-10 | reported to GitHub |
| "markdown-based templates that can be easily deleted or filled out by an LLM" | [#197319](https://github.com/community/community/discussions/197319#discussioncomment-17362209) | 2026-06-19 | wants form-style PR templates |
| (code) a workflow that prepends PR-submission guidelines to every new issue | [MLflow issue-warning.yml](https://github.com/mlflow/mlflow/blob/master/.github/workflows/issue-warning.yml) | 2026-03 | W: own workflow |

- **Frequency signals**: 5 independent projects, all 2026; each wrote its own script. No GitHub Community thread with many votes. Related: GitHub's planned "issue limits" (blog post on PR limits, 2026-06).
- **What people do today**: in-repo scripts that parse the body for the form's section headings and close or label issues that lack them (Homebrew, Keycloak), or prepend warnings (MLflow).
- **Existing solutions checked**

| Solution | Adoption | Verdict |
|---|---|---|
| [lucasbento/auto-close-issues](https://github.com/lucasbento/auto-close-issues) | 55 stars, last push 2022-08 | fails (matches markdown templates; YAML-form support asked in its #14, unanswered) |
| [roots/issue-closer-action](https://github.com/roots/issue-closer-action) | 33 stars, last push 2023-01 | partly (regex on body; "closes valid issues" complaint #1) |
| [rickstaa/empty-issues-closer-action](https://github.com/rickstaa/empty-issues-closer-action) | 4 stars, 2024-03 | partly (markdown templates) |
| [machiecodes/check-template](https://github.com/machiecodes/check-template) | 0 stars, 2026-04 | unproven |
| LLM-based screeners ([JohnsonRan/nomore-spam](https://github.com/JohnsonRan/nomore-spam) 28 stars, [Blue-B/slopguard](https://github.com/Blue-B/slopguard) 59 stars) | small | partly (need an LLM key or are unreliable: slopguard's README reports its first real run caught none of the slop) |
| GitHub native | — | fails today (forms are not enforced for API-created issues); issue limits planned |

- **Search words**: "close issues not using issue template", "enforce issue forms", "issue created via API without template", "validate issue form fields action", "auto close blank issues".
- **Filter**: a GitHub Action reading the repo's own `.github/ISSUE_TEMPLATE/*.yml` and checking new issue bodies; deterministic, no LLM, testable on a scratch public repo with `gh issue create`. Passes.
- **Verdict**: **medium**. The clearest unserved gap on the AI-contribution side: real, recent, every project rolls its own, and the old actions predate YAML forms. Narrow, and GitHub could absorb it with issue limits or by enforcing forms for API callers.

### G2-3. Stop "assign me" races and several PRs for the same issue

- **Need**: "almost every recent issue has one or more PRs for it" ([jaeger#9536](https://github.com/jaegertracing/jaeger/issues/9536#issuecomment-5649984050), 2026-09-13).
- **Who and situation**: maintainers who label "good first issue" or invite contributions and now get "please assign me" comments, competing PRs from people (and agents) who never claimed the issue, and PRs on issues that were not ready.
- **Evidence** (helper agent)

| Quote | Link | Date | W |
|---|---|---|---|
| "the 'good first issue' label is turning out to be excellent clickbait" | [go-github#3939](https://github.com/google/go-github/issues/3939#issuecomment-3799567576) | 2026-01-26 | CONTRIBUTING change |
| "A contributor comments 'please assign this issue to me' - The bot shall quote the contributing guidelines" | [openwisp-utils#571](https://github.com/openwisp/openwisp-utils/issues/571) | 2026-01-30 | W: own bot |
| "A team member then needs to manually review and assign the contributor" | [learningequality/.github#47](https://github.com/learningequality/.github/issues/47) | 2026-02-17 | W: own `/assign` with cap |
| "We do not assign issues. Submit a PR when you're ready" | [joomla-cms#47215](https://github.com/joomla/joomla-cms/issues/47215) | 2026-02-24 | pinned policy |
| "describe the way we change our approach for assigning issues" | [airflow PR #62417](https://github.com/apache/airflow/pull/62417) | 2026-02-24 | policy doc |
| "almost every recent issue has one or more PRs for it" | [jaeger#9536](https://github.com/jaegertracing/jaeger/issues/9536#issuecomment-5649984050) | 2026-09-13 | drafting a policy |
| "first ask to be assigned ... only then open a non-draft PR ... manage that process manually" | [#198851](https://github.com/community/community/discussions/198851#discussioncomment-17342059) | 2026-06-17 | asks GitHub for a gate |
| "the 'good first issue' GitHub label is specifically attracting these kinds of contributions" | [HN](https://news.ycombinator.com/item?id=49474770) | 2026-08-28 | |
| (code) closes PRs on issues "already claimed by an earlier open PR"; labels duplicate PRs | [MLflow auto-close-pr.js](https://github.com/mlflow/mlflow/blob/master/.github/workflows/auto-close-pr.js), [duplicate-prs.js](https://github.com/mlflow/mlflow/blob/master/.github/workflows/duplicate-prs.js) | 2026-02/03 | W: own policy engine |
| "Ask agents to check for duplicate issues/PRs" | [pytorch PR #199192](https://github.com/pytorch/pytorch/pull/199192) | 2026-09-30 | rule in CLAUDE.md |

- **Frequency signals**: about 10 independent projects in 2026, several large (Airflow, PyTorch, MLflow, Jaeger, Joomla); GitHub said it may "explore using issue assignment as an additional signal" for PR-limit bypass ([#198851](https://github.com/community/community/discussions/198851#discussioncomment-17343485)).
- **What people do today**: written policies; home-made `/assign` bots with caps; MLflow's scripts that close PRs on unclaimed or already-claimed issues and label duplicates.
- **Existing solutions checked**: [takanome-dev/assign-issue-action](https://github.com/takanome-dev/assign-issue-action) (15 stars, active; `/assign-me`, auto-unassign; no PR linkage) — partly; [leanprover-community/intentions](https://github.com/leanprover-community/intentions) (6 stars, 2026; claims with expiry) — partly; prow (329 stars) and zulipbot (93) — heavy or project-specific; older `/take` actions (55 stars and less, stale since 2024 or earlier); [EFrMG/triage-o-mator](https://github.com/EFrMG/triage-o-mator) (4 stars, clusters duplicate PRs). Nothing packages the MLflow-style rule "a PR must reference an issue that is ready and claimed by its author; one open PR per issue".
- **Search words**: "assign issue to me bot", "close pull requests for unassigned issues", "one PR per issue", "duplicate pull requests same issue", "good first issue spam".
- **Filter**: a GitHub Action on `pull_request_target`/`issue_comment`; deterministic; testable on a scratch repo. Passes.
- **Verdict**: **medium**. Strong 2026 pain in mid/large projects; the assignment half is served, the PR-linkage policy is not packaged. Risk: GitHub's PR-limit roadmap (assignment as a bypass signal) may cover part of it.

### G2-4. Spot AI-written issues whose claims are not true for this repo

- **Need**: "5% human and 95% clanker-generated and largely inaccurate" ([a maintainer's blog](https://lucumr.pocoo.org/2026/5/24/pi-oss/), 2026-05-24).
- **Who and situation**: maintainers who spend time chasing confident bug reports that cite files, functions, versions, or environment facts that do not exist.
- **Evidence** (helper agent; 10 independent people): "I've lost a lot of time chasing AI-written bug reports that were actually something else" ([HN](https://news.ycombinator.com/item?id=47218864), 2026-03-02); "analyses are based on limited data and assumptions" ([OvenMediaEngine#2022](https://github.com/OvenMediaLabs/OvenMediaEngine/issues/2022), 2026-03-16, pinned policy); "maintainers and community moderators do not have the capacity to review all such content" ([AFFiNE#14645](https://github.com/toeverything/AFFiNE/issues/14645), 2026-03-13); "Users are also using AI to generate slop issues, which is just as annoying" ([#185387](https://github.com/community/community/discussions/185387#discussioncomment-15695150), 2026-02-04); "We've been seeing more and more AI spam. It's awful. It saps our time" ([typescript-eslint#12475](https://github.com/typescript-eslint/typescript-eslint/issues/12475), 2026-07-01, evaluating agentscan and anti-slop); also QwenPaw (#4333), python-bibtexparser (PR #622), an HN maintainer on recycled mitigations ([47464632](https://news.ycombinator.com/item?id=47464632)). The blog author built an `/is` prompt that re-checks each issue against the code (W).
- **Existing solutions**: "AI detection" is crowded and weak: about 22 "AI slop issues" and 53 "slop github action" repos created in 2026 (keyword counts, upper bounds); [Blue-B/slopguard](https://github.com/Blue-B/slopguard) (59 stars) reports 0% caught with 3 false positives on its first real run; [peakoss/anti-slop](https://github.com/peakoss/anti-slop) (835 stars) is PR-focused, with complaints about false positives (#16) and irreversible closes (#19). Deterministic "do the cited paths, symbols, and versions exist in this repo" checks exist only in 0-star tools aimed at security reports.
- **Filter**: deterministic checks (cited paths, symbols, versions exist in the repo) fit in a GitHub Action and are testable; LLM-based judging would need an API key. Passes for the deterministic part.
- **Search words**: "detect AI generated issues", "verify bug report file paths exist", "hallucinated bug report", "AI slop issues action".
- **Verdict**: **medium, crowded on detection**. The open angle (cheap claim verification against the repo) is narrow and would sit inside an intake action like G2-2 rather than stand alone.

### G2-5. See an accurate, exportable list of who depends on my project

- **Need**: "That would be awesome if GitHub could deliver an endpoint for listing the dependent repositories/packages of a repository" ([#123759](https://github.com/orgs/community/discussions/123759), 2024-05-14, 27 upvotes).
- **Who and situation**: library and Action maintainers who want notable dependents for a README or website, adoption over time, or candidates for sponsorship, and find the dependents page approximate, stale, or empty.
- **Evidence** (helper agent; about 25 people, 17 of them 2024–2026): "It previously had 4k dependents, and all of a sudden in turned into zero." ([#34687](https://github.com/orgs/community/discussions/34687#discussioncomment-3947381)); "Why are those projects still being listed as Dependents?" ([#171055](https://github.com/orgs/community/discussions/171055), 2025-08); "Tracking this over time is a useful metric for understanding adoption" ([repohistory#25](https://github.com/repohistory/repohistory/issues/25), 2026-02, W: ghtopdep by hand); "There is no GitHub API for the dependents/used-by count, so scraping is the only option" ([actions-marketplace-checks#247](https://github.com/rajbos/actions-marketplace-checks/issues/247), 2026-07, W: regex scraping); "I have created a simple tool that can sort dependents by stars" ([#5575](https://github.com/orgs/community/discussions/5575#discussioncomment-15688730), 2026-02, W); "tool gives no results anymore" ([ghtopdep#39](https://github.com/andriyor/ghtopdep/issues/39), 2026-03); "looking for corporate usage that should be targeted for sponsorship solicitations" ([ecosyste.ms roadmap#30](https://github.com/ecosyste-ms/roadmap/issues/30), 2025-08).
- **Platform facts**: GitHub docs call dependent counts "approximate"; "Used by" appears only above 100 dependents; there is no REST or GraphQL API; `robots.txt` has `Disallow: /*/*/network` (checked 2026-10-03); the Acceptable Use Policies only clearly allow scraped data for research and archiving.
- **Existing solutions**: [nvuillam/github-dependents-info](https://github.com/nvuillam/github-dependents-info) (162 stars, active; CLI and Action, sorted lists and badges) and [andriyor/ghtopdep](https://github.com/andriyor/ghtopdep) (328 stars; broken since 2025-12 per #39) meet the listing need by scraping; ecosyste.ms (free open API) and deps.dev (counts only) offer non-scraped data that disagrees with GitHub's.
- **Search words**: "list dependents github", "who uses my library", "used by count api", "top dependents by stars".
- **Filter**: **fails** for a new tool: the core data comes from a page `robots.txt` disallows (ToS gray zone), and the non-scraped sources are third-party services.
- **Verdict**: **medium need, already met for listing, blocked for the rest** (accuracy and history depend on scraping).

## Part 2. Other candidates

### G2-6. Clear out notifications for issues and PRs that are already closed or merged

- **Need**: "Merged PRs and closed PRs are just noise around the signal." ([#15591](https://github.com/orgs/community/discussions/15591#discussioncomment-10160810), 2024-07-26)
- **Who and situation**: maintainers and active contributors whose web inbox fills with notifications for PRs that were merged or closed (Dependabot/Renovate bumps, PRs they were review-requested on), especially after time away. Not only OSS maintainers: many comments come from people in companies.
- **Evidence** (one row per person; W = describes a workaround)

| Quote (verbatim, ≤ 20 words) | Link | Date | W |
|---|---|---|---|
| "I currently have 219 notifications. Clearing them is an insane chore." | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-4300642) | 2022-12-03 | manual steps |
| "over 1200 notifications (most of which were closed pull requests from dependabot)" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-8201544) | 2024-01-21 | W: octokit script, then an Actions template repo |
| "Being a high profile maintainer on GitHub is extremely dreadful if this isn't addressed" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-10200655) | 2024-07-31 | |
| "I am drowning in notifications of auto-created, already-merged PRs" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-10139735) | 2024-07-24 | |
| "we have to resort to running scripts hitting their API" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-12076091) | 2025-02-06 | W |
| "I rewrote the above script. It's not super fast" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-12305876) | 2025-02-24 | W: gist |
| "I just wrote this again using `gh` (so you don't need a token)" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-13367043) | 2025-06-04 | W: Python + gh |
| "I have 5k notifications of closed or merged PRs that I can't go through." | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-15064982) | 2025-11-24 | |
| "I wrote simple script. It's not very solid solution" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-15117289) | 2025-11-30 | W: gist |
| "I'm guaranteed a spam message for every PR branch I'm tagged in" | [comment](https://github.com/orgs/community/discussions/15591#discussioncomment-16534762) | 2026-04-12 | |
| A prominent Node.js maintainer published his own "cleanup-merged-prs" CLI | [repo](https://github.com/mcollina/cleanup-notifications) | 2025-04 | W: own tool |
| "hundreds of 'Bump xxx from A to B' notifications ... many of them are already merged" (README) | [repo](https://github.com/XenoAmess/github-notification-auto-done-skill) | 2026-07 | W: own tool |

- **Frequency signals**: [#15591](https://github.com/orgs/community/discussions/15591) has 630 upvotes and 51 top-level comments (2022-04 to 2026-06); duplicates [#78187](https://github.com/orgs/community/discussions/78187) (2023) and [#171622](https://github.com/orgs/community/discussions/171622) (2025); `gh` CLI notifications request [cli/cli#659](https://github.com/cli/cli/issues/659) (172 reactions, open since 2020). GitHub has not shipped a status filter as of 2026-10 (the `is:` status filter is suggested by the UI but does not work, per a 2025-06 comment).
- **What people do today**: browser-console snippets and bookmarklets that tick closed/merged rows; gists and scripts that call `DELETE /notifications/threads/{id}`; Refined GitHub's per-page "select by status"; dedicated tools (below).
- **Existing solutions checked**

| Solution | Adoption | Verdict |
|---|---|---|
| [JoshuaKGoldberg/prune-github-notifications](https://github.com/JoshuaKGoldberg/prune-github-notifications) (npm CLI, prunes bot bumps; latest-comment-author filter added 2026-09) | 7 stars, 1,824 npm downloads in Sept 2026, pushed 2026-10-02 | meets (CLI) |
| [nobe4/gh-not](https://github.com/nobe4/gh-not) (gh extension, rule-based: jq filters, actions done/read/hide) | 36 stars; author says "mostly done" | meets |
| [k1LoW/gh-triage](https://github.com/k1LoW/gh-triage) (gh extension: mark done/read/unsubscribe by conditions) | 37 stars, pushed 2026-09-28 | meets |
| [awendt/gh-cleanup-notifications](https://github.com/awendt/gh-cleanup-notifications) (gh extension, closed PRs → done) | 10 stars | meets (unread only) |
| [mcollina/cleanup-notifications](https://github.com/mcollina/cleanup-notifications) | 1 star | meets (merged PRs) |
| [refined-github](https://github.com/refined-github/refined-github) "Select notifications by type and status" | 32k stars | partly (browser, one page at a time) |
| [Gitify](https://github.com/gitify-app/gitify) desktop app, [Octobud](https://github.com/octobud-hq/octobud) inbox | 5.4k / 29 stars | partly (different inbox) |

- **Search words**: "github notifications mark merged as done", "clear closed pull request notifications", "filter notifications is:merged", "gh extension notifications cleanup".
- **Verdict**: **already met** (at least five working tools, two of them maintained `gh` extensions). Real, long-lived pain, but the gap is discoverability, not tooling; another tool would be the sixth.

### G2-7. Mute bot comments (Dependabot, Renovate, AI reviewers) in notifications

- **Need**: "My Github notifications are largely spam now due to not being able to filter for humans." ([#5793](https://github.com/orgs/community/discussions/5793#discussioncomment-4298406), 2022-12-03)
- **Who and situation**: maintainers and teams using bots (dependency bots, CI reporters, and since 2025 AI review bots like CodeRabbit or Codex) whose comments flood web, email, and Slack notifications. Most commenters are company teams using Slack; some are OSS maintainers.
- **Evidence**

| Quote | Link | Date | W |
|---|---|---|---|
| "I turned off notifications because it is not possible to turn off notifications by bots" | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-6193692) | 2023-06-16 | W: disabled notifications |
| "Please let us mute notifications from dependabot/renovate/actions" | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-7833717) | 2023-12-12 | |
| "we have some repos with upwards of 4 bots commenting in PRs" | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-8770010) | 2024-03-13 | |
| "I don't want 3000 line emails which make notifications useless killing real human input" | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-14502051) | 2025-09-24 | |
| "we ended up using pullnotifier ... it exactly mutes bots" | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-15123447) | 2025-12-01 | W: paid hosted service |
| "getting substantially worse now that everybody is vibecoding GitHub integrations onto everything" | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-16549616) | 2026-04-13 | |
| "The slack notifications are so noisy that I miss the actual notification from people." | [comment](https://github.com/orgs/community/discussions/5793#discussioncomment-17846925) | 2026-07-31 | |

- **Frequency signals**: [#5793](https://github.com/orgs/community/discussions/5793) 353 upvotes, 44 comments, 2021-09 to 2026-09 ("This is now a critical problem", 2026-09-29); related [#35673](https://github.com/orgs/community/discussions/35673) (388 upvotes, team-wide review notifications). Growing with AI review bots.
- **What people do today**: turn notifications off; hosted Slack services (pullnotifier); notification-pruning CLIs (G2-6) filter bot-authored threads in the web inbox only.
- **Existing solutions**: for the web inbox, gh-not (jq filter on author), gh-triage, prune-github-notifications (filters dependency bumps and, since 2026-09, by latest comment author) meet it. For email and Slack, nothing open-source and GitHub-only was found; those channels are controlled by GitHub's email sender and the Slack app, which a GitHub-only tool cannot filter.
- **Search words**: "mute dependabot notifications", "github notifications ignore bots", "hide bot comments notifications".
- **Verdict**: **medium, mostly out of reach**. The web-inbox part is met (G2-6 tools); the painful part (email/Slack) needs GitHub to change its senders, and the audience is mostly company teams.

### G2-8. Keep low-quality and AI-generated pull requests from eating review time

- **Need**: "As of today, I would say that 1 out of 10 PRs created with AI is legitimate" ([#185387](https://github.com/orgs/community/discussions/185387#discussioncomment-15631403), 2026-01-28).
- **Evidence**

| Quote | Link | Date | W |
|---|---|---|---|
| "Just today I had to batch-close several AI generated PRs which were all submitted around the same time." | [#185387](https://github.com/orgs/community/discussions/185387#discussioncomment-15657800) | 2026-01-31 | W: batch-closing by hand |
| "When I see a 10K SLOC commit which purports to fix 12 outstanding issues, it's unreviewable." | [#185387](https://github.com/orgs/community/discussions/185387#discussioncomment-15662399) | 2026-02-01 | |
| "We just implemented & automated the open PR limits for new contributors ... we could only do this with labels." (Jaeger) | [#185387](https://github.com/orgs/community/discussions/185387#discussioncomment-15726619) | 2026-02-07 | W: label automation |
| "I sometimes get a flurry of PRs from over-exuberant contributors" (receives hundreds of PRs a week) | [HN](https://news.ycombinator.com/item?id=48665753) | 2026-06-24 | uses PR limits |
| "5 (so far) AI-generated draft PRs within 5 minutes on a repo with the limit set to 2" | [#198851](https://github.com/orgs/community/discussions/198851#discussioncomment-18651627) | 2026-09-29 | |
| "army of AI agents opening PRs and issues ... has made me close PR and issue access" | [HN](https://news.ycombinator.com/item?id=48501183) | 2026-06-12 | W: closed PRs |

- **Frequency signals**: [#185387](https://github.com/orgs/community/discussions/185387) 226 upvotes, 128 comments; GitHub's [Maintainer Month update](https://github.com/orgs/community/discussions/197319); HN "PS3 emulator devs ask people to stop flooding it with AI PRs" (189 points, 2026-05); GitHub blog "[Pull request limits are cutting down the noise](https://github.blog/open-source/maintainers/how-pull-request-limits-are-cutting-down-the-noise/)" (2026-06).
- **Existing solutions**: native PR restriction settings (2026-02-13) and open-PR limits with bypass list (2026-06-17; draft counting being added, smarter bypass signals and cross-repo controls planned); [mitchellh/vouch](https://github.com/mitchellh/vouch) (5,117 stars), [peakoss/anti-slop](https://github.com/peakoss/anti-slop) (835), [MatteoGabriele/agentscan](https://github.com/MatteoGabriele/agentscan) and its Action (114 / 61), good-egg (53), contributor-report (66), and dozens of 0–2-star "slop" Actions created in 2026.
- **Verdict**: **already met / crowded**, with GitHub actively shipping in this exact space.

### G2-9. Keep traffic history (views, clones, referrers) beyond GitHub's 14 days

- **Need**: "GitHub deletes your repository traffic after 14 days." (repo description, [Resetnak/OpenStars](https://github.com/Resetnak/OpenStars), 2026-09)
- **Who and situation**: maintainers who want to know whether anyone uses their project over months, not two weeks.
- **Evidence**: community question [#136608](https://github.com/orgs/community/discussions/136608) (2024-08, "view one month's worth of traffic"); feature request [ScottKirvan/Smokey#18](https://github.com/ScottKirvan/Smokey/issues/18) ("Track traffic history beyond GitHub's 14-day window"); [MudwoodLabs/pyrxd PR #693](https://github.com/MudwoodLabs/pyrxd/pull/693) ("Keep the traffic numbers GitHub throws away after 14 days"); a [DEV article](https://dev.to/resetnak/githubs-traffic-api-has-a-14-day-memory-heres-what-i-learned-archiving-it-1lc0) and a [Medium article](https://medium.com/towards-generative-ai/retaining-github-traffic-data-beyond-the-14-day-limitation-3849934e398a) on archiving it; traffic page reliability complaints [#173494](https://github.com/orgs/community/discussions/173494) (137 upvotes, 65 comments, 2025-09) and [#208852](https://github.com/orgs/community/discussions/208852) (traffic frozen since 2026-09-23, 41 upvotes). Every one of these people built or adopted an archiver (W).
- **Existing solutions**: [jgehrcke/github-repo-stats](https://github.com/jgehrcke/github-repo-stats) (Action, 390 stars, pushed 2026-07), [vladkens/ghstats](https://github.com/vladkens/ghstats) (self-hosted, 189 stars), [piebro/github-repo-traffic-stats](https://github.com/piebro/github-repo-traffic-stats), [hrodrig/gghstats](https://github.com/hrodrig/gghstats), and about 30 more repos created in 2026 alone (three of them identical "github-traffic-archive" copies). This program's own `tools/metrics.mjs` does the same.
- **Search words**: "github traffic history more than 14 days", "archive github traffic", "github clones views history action".
- **Verdict**: **already met (saturated)**.

### G2-10. Track release-asset download counts over time

- **Need**: "GitHub shows download counts per release asset — but only the current total. No history." ([DEV post](https://dev.to/davidb31/beyond-github-stars-tracking-real-adoption-of-my-open-source-projects-g29), 2026-03, W: built a hosted history site).
- **Evidence** (helper agent; about 15 voices): Headlamp via LFX Insights ("It would be useful for us to see if people are using our different releases over time.", [insights#810](https://github.com/linuxfoundation/insights/discussions/810), 2025-10, W: curl + jq); counts reset to zero when an asset is replaced ([grev#49](https://github.com/HanaDigital/grev/issues/49), [shields#10130](https://github.com/badges/shields/issues/10130)); "only the cumulative `download_count` per release asset" ([auto-mobile#4890](https://github.com/kaeawc/auto-mobile/issues/4890), 2026-07, W: daily snapshots); about 12 maintainers built their own tracker in 2026.
- **Existing solutions**: more than 20, including free hosted history (release-monitor.com, download-history.cdviz.dev), Actions such as [MacRimi/repo-growth](https://github.com/MacRimi/repo-growth) (keeps counts when assets are replaced), snapshot viewers [HanaDigital/grev](https://github.com/HanaDigital/grev) (287 stars) and tooomm/github-release-stats (119).
- **Verdict**: **already met (saturated)**, the same pattern as traffic history (G2-9).

### G2-11. Publish brand-new npm packages and set up trusted publishing for many packages

- **Need**: "it's not possible to publish the initial version of a package using OIDC" ([npm/cli#8544](https://github.com/npm/cli/issues/8544), 2025-09-01, 100 reactions).
- **Evidence** (helper agent; 18+ people): "We have to shamefully create a 1 day granular token with read & write access to all packages." ([comment](https://github.com/npm/cli/issues/8544#issuecomment-4414735794), 2026-05-10, W); "i also didn't want to do it manually ... I did it with playwright" ([#161015](https://github.com/orgs/community/discussions/161015#discussioncomment-14459091), 2025-09-19, W); "we have 9000+ packages and multiple new packages every week" (2025-10-08); "Currently you can only configure it after a package was published at least once." ([#201329](https://github.com/orgs/community/discussions/201329#discussioncomment-17626817), 2026-07-13, W: prepublish token); "I probably entered my OTP 20-30 times to do so" ([#208130](https://github.com/orgs/community/discussions/208130#discussioncomment-18489235), 2026-09-17).
- **Existing solutions**: native `npm trust` bulk configuration (2026-02-18) and `npm stage publish`, which can create a new package as `0.0.0-stage` (2026-05-22); [dmno-dev/fledgling](https://github.com/dmno-dev/fledgling) (34 stars, 2,233 downloads/month; placeholder publish and whole-monorepo trust sync) and [azu/setup-npm-trusted-publish](https://github.com/azu/setup-npm-trusted-publish) (67 stars, 7,317 downloads/month) meet it; npm's roadmap adds namespace-level OIDC in 2027.
- **Verdict**: **already met**.

### G2-12. Find out why trusted publishing fails (404, ENEEDAUTH, 403)

- **Need**: "expensive to debug because npm emits generic errors that point users toward the wrong subsystem" ([npm/cli#9088](https://github.com/npm/cli/issues/9088), 2026-03-10).
- **Evidence** (helper agent; about 19 people): "ended up reverting everything and creating an unsafe token for publishing" ([#173102](https://github.com/orgs/community/discussions/173102#discussioncomment-15230433), 2025-12-11, W); "it wasted me 3 hours" (2026-04-26); "A 404 is flat-out wrong because my package exists and it's public." ([npm/cli#9088](https://github.com/npm/cli/issues/9088#issuecomment-4681743645), 2026-06-11); "Npm doesn't even log OIDC failures by default." ([#208130](https://github.com/orgs/community/discussions/208130#discussioncomment-18570778), 2026-09-23); three 2026 blog posts on the misleading 404.
- **Existing solutions**: the most common cause (an old npm on the runner) is documented; npm 11.20 logs OIDC failures at warn level and more logging is in review; [github/actions-oidc-debugger](https://github.com/github/actions-oidc-debugger) (118 stars) prints the claims but does not compare them with npm's configuration; npm-script-lens `publish --check` (1.2k downloads/month); fernforge tools (0 stars).
- **Filter**: testing needs real npm packages and an npm account (the owner's). Fails the "no account beyond GitHub" filter for development and testing.
- **Verdict**: **medium**, shrinking as npm improves its own errors.

### G2-13. Release a Rust workspace that adds a new crate under trusted publishing

- **Need**: (P) "The workspace publication partially succeeded, then failed on the new uv-threads crate" ([astral-sh/uv-dev#1948](https://github.com/astral-sh/uv-dev/issues/1948), 2026-09-18).
- **Evidence** (helper agent): 9 projects in 2026 hit HTTP 403 "Trusted Publishing tokens do not support creating new crates" part-way through a release (51Degrees/rust, higebu/packet-dissector, rustledger, BloqrAI and others; mostly agent-written issue bodies, marked P); about 10 more repos carry hand-written workarounds; one human thread ([cargo#13397](https://github.com/rust-lang/cargo/issues/13397)): "Sometimes a cargo publish run of multiple packages will fail. It is then necessary to restart it."
- **Existing solutions**: release-plz (1,494 stars) skips already-published crates but has no token lane for new ones; cargo-release (1,589) and cargo-workspaces (605) do not handle it; idempotent `cargo publish --workspace` (cargo#16012) is unmerged. None meets it.
- **Filter**: testing needs crates.io publishing (an account beyond GitHub). Fails for testing.
- **Verdict**: **medium, niche**, and crates.io could fix it natively.

### G2-14. Ship correct third-party license notices with release artifacts

- **Need**: (P) "from the bundle's actual inputs at release time (not a hand-maintained list)" ([yooz-labs/remi#1131](https://github.com/yooz-labs/remi/issues/1131), 2026-10-02).
- **Evidence** (helper agent): 12 projects in 2026 (NVIDIA/kubevirt-gpu-device-plugin: "when the Dockerfile was bumped the notices kept the old version."; others about bundling stripping license files, mixed Go/npm/Python/Debian inventories). All issue bodies read as agent-written (P); no strong human thread found.
- **Existing solutions**: mature per-ecosystem generators (license-checker 4.0M downloads/month, license-webpack-plugin 21.7M, rollup-plugin-license 1.07M, generate-license-file 252k, go-licenses, cargo-about, pip-licenses); multi-ecosystem ORT (heavy) and ScanCode; licensed's `notices` (low-maintenance mode).
- **Verdict**: **medium/weak**: met per ecosystem; the mixed-ecosystem gap has no human voices yet. (This program needs it for its own `THIRD_PARTY_NOTICES`, Constitution §7.)

### G2-15. Know which companies and projects use my project

- **Need**: "We do not know who uses LQ.AI, what they use it for, or where they get stuck." ([lq-ai#582](https://github.com/LegalQuants/lq-ai/issues/582), 2026-09-16).
- **Evidence** (helper agent; about 18 voices): Vulkan-Hpp ("I would be interested to know 'right now' who actually uses Vulkan-Hpp.", [#2227](https://github.com/KhronosGroup/Vulkan-Hpp/issues/2227), 2025-07); KRR, next-safe-action, Datalevin, NPOI asking users in issues; a Java library author: "of the large corporations that use the libraries I publish I can see exactly 50" ([blog](https://mccue.dev/pages/6-27-26-who-uses), 2026-06, W: Scarf, paid beyond the free tier); issue titles since 2025: 77 "who is using", 55 "who's using", 13 "[zh]".
- **Existing solutions**: "Who is using" issues and ADOPTERS files (manual); Scarf (hosted gateway, paid); code search, ecosyste.ms, deps.dev for projects only.
- **Filter**: identifying companies needs a download gateway and IP-to-organization data (hosted, paid); the "which projects" part reduces to G2-5. Fails.
- **Verdict**: **strong need, not feasible** for a small GitHub-only tool.

## Part 3. Weaker or already-met candidates from the main research

### G2-16. Be told when the default branch's CI breaks, no matter who triggered it

- **Need**: "I'd like to see all failed workflows ... regardless of who broke the build." ([#55379](https://github.com/orgs/community/discussions/55379), 2023-05-13)
- **Who and situation**: maintainers whose default branch is changed by bots (Dependabot auto-merge) or scheduled runs; GitHub only notifies the actor (or whoever last edited the cron).
- **Evidence**: OP: "possible to add a step that sends an email, but this is cumbersome to do for all repositories" (W); "We currently have to use either a `failed()` job at the end of every workflow or use the webhook" ([comment](https://github.com/orgs/community/discussions/55379#discussioncomment-6657604), 2023-08-07, W); "It is such a design flaw that only one person can receive failure notification." ([comment](https://github.com/orgs/community/discussions/55379#discussioncomment-12079948), 2025-02-06).
- **Frequency signals**: 32 upvotes; small thread. Many 2026-09 threads about scheduled workflows silently not firing (e.g., [#209036](https://github.com/orgs/community/discussions/209036), [#209331](https://github.com/orgs/community/discussions/209331)) show the related "silent failure" pain, but those are platform incidents.
- **Existing solutions**: [drivendataorg/failed-build-issue-action](https://github.com/drivendataorg/failed-build-issue-action) (opens an issue on failure; 9 stars, maintained), many Slack/email notifier actions. Partly met per repo; no cross-repo "which of my default branches are red" view was found besides dashboards like [javiertuya/dashgit](https://github.com/javiertuya/dashgit) (17 stars).
- **Search words**: "notify on failed workflow default branch", "github actions failure create issue", "scheduled workflow failed notification".
- **Verdict**: **weak-medium** (few people, simple workarounds exist).

### G2-17. Validate `dependabot.yml` before it lands on main

- **Need**: "I would like a standalone validator ... to validate my config before pushing it." ([dependabot-core#4605](https://github.com/dependabot/dependabot-core/issues/4605#issuecomment-2435663391), 2024-10-24, 29 reactions)
- **Evidence**: "This is currently hindering my adoption of Dependabot." (2023-12-15); "now Dependabot is silently failing ... after pulling the same PR to over a dozen repos" (2025-09-19, W: fixing by hand); "so we don't merge broken dependabot config file updates without noticing" (2026-05-26). Issue: 142 reactions, 29 comments, open since 2022-01.
- **Existing solutions**: [@bugron/validate-dependabot-yaml](https://www.npmjs.com/package/@bugron/validate-dependabot-yaml) (npm, schema plus extra checks; 1,416 downloads in Sept 2026, updated 2025-09 for an ecosystem-specific key); SchemaStore schema in editors; GitHub's own check now runs on some PRs (reports from 2025-10, not on others 2025-12).
- **Verdict**: **partly met / weak** for a new tool: a working validator exists; the remaining gap (semantic errors that only Dependabot's backend detects) cannot be closed from outside.

### G2-18. Delete old or renamed workflows from the Actions sidebar

- **Need**: "Is there a way to delete or hide old/renamed Workflows?" ([#26256](https://github.com/orgs/community/discussions/26256), 420 upvotes, 145 comments, 2019-09 to 2026-02).
- **Evidence**: "Most people here, including myself, have just created a homebrewed solution" ([comment](https://github.com/orgs/community/discussions/26256#discussioncomment-13062210), 2025-05-07, W); "Forget about it, implement your own thing like we all did." (2025-05-26, W); a 2026-02-19 comment ports the `gh run list | xargs gh run delete` one-liner to PowerShell (W).
- **Existing solutions**: deleting all runs removes the workflow; one-liner with `gh run delete`; [Mattraks/delete-workflow-runs](https://github.com/Mattraks/delete-workflow-runs) (255 stars).
- **Verdict**: **already met** by a one-liner and an established Action (cosmetic chore).

### G2-19. Handle Dependabot/Renovate PRs across many repositories at once

- **Need**: "it's a hell of a noise if you're maintaining projects on multiple platforms" ([HN, PRoctr author](https://news.ycombinator.com/item?id=49109247), 2026-07-30, W: built a TUI).
- **Evidence**: people keep building the same tool: [rnorth/gh-combine-prs](https://github.com/rnorth/gh-combine-prs) (111 stars), [einride/gh-dependabot](https://github.com/einride/gh-dependabot) (44), [javiertuya/dashgit](https://github.com/javiertuya/dashgit) (17), [mxmehl/proctr](https://github.com/mxmehl/proctr) (2026), [lemra-org/bot-pr-sweeper](https://github.com/lemra-org/bot-pr-sweeper) (2026), [BaseMax/auto-merge-dependabot-prs](https://github.com/BaseMax/auto-merge-dependabot-prs), [govuk-one-login/dependabot-dashboard](https://github.com/govuk-one-login/dependabot-dashboard) (2026), plus native Dependabot grouped updates and auto-merge.
- **Verdict**: **already met (crowded)**.

### G2-20. Remove an AI agent ("Claude") from the repository's Contributors list

- **Need**: "I already all co-authored commits from the commit history, and it's been over a month now. Claude's still appearing" ([#197389](https://github.com/orgs/community/discussions/197389#discussioncomment-18080457), 2026-08-19).
- **Evidence**: [#175200](https://github.com/orgs/community/discussions/175200) (16 upvotes; "doing a rename dance to rename and archive the original tainted one", 2026-02-08, W); [#191565](https://github.com/orgs/community/discussions/191565) (13 upvotes, 24 comments; "Rename your 'main' branch to 'main1' and back", 2026-04-11, W, confirmed by four later replies); [#197389](https://github.com/orgs/community/discussions/197389) (12 upvotes); [#207164](https://github.com/orgs/community/discussions/207164) and [#207111](https://github.com/orgs/community/discussions/207111) (2026-09, cache stale after rewrite). A GitHub reply on 2026-10-01 says they are "currently investigating solutions" and published a troubleshooting guide.
- **Existing solutions**: Claude Code's own setting to omit the trailer (prevention); at least seven tiny tools created in 2026 ([HurleySk/de-claude](https://github.com/HurleySk/de-claude), [Londopy/git-attribution](https://github.com/Londopy/git-attribution), [izam-mohammed/claim-your-code](https://github.com/izam-mohammed/claim-your-code), [jepanana/un-author](https://github.com/jepanana/un-author), [Jose-Ribeir/strip-coauthor](https://github.com/Jose-Ribeir/strip-coauthor), [dalpat/git-strip-coauthor](https://github.com/dalpat/git-strip-coauthor), [Zingzy/no-claude-coauthor](https://github.com/Zingzy/no-claude-coauthor)); the branch-rename trick.
- **Verdict**: **already met (crowded)**, and a poor fit for this program: a tool whose purpose is removing AI attribution sits badly with the Constitution's AI-disclosure rules (§3C, §3D).

### G2-21. Get rid of "ghost" notifications from spam repos (mass-mention crypto spam)

- **Evidence**: [#174283](https://github.com/orgs/community/discussions/174283) "Git Coin Community SPAM" (211 upvotes, 109 comments, 2025-09); [#174310](https://github.com/orgs/community/discussions/174310) "Cannot clear notification from gitcoin" (109 upvotes, 37 comments); [#174927](https://github.com/orgs/community/discussions/174927) "Ghost Notifications" (50); [#174843](https://github.com/orgs/community/discussions/174843) (44); [#174831](https://github.com/orgs/community/discussions/174831) ghost issues misused for spamming (79).
- **Existing solutions**: [emmanuel-ferdman/gh-gonest](https://github.com/emmanuel-ferdman/gh-gonest) (gh extension, 119 stars, pushed 2026-08) "detects and removes ghost notifications from banned/deleted" repos.
- **Verdict**: **already met**.

### G2-22. Be notified only when an issue or PR is closed or merged (custom thread subscriptions)

- **Evidence**: [#204563](https://github.com/orgs/community/discussions/204563) (43 upvotes, 2026-08-10: "the custom notification was a great way to actually know if the PR was merged/Issue was resolved"); [#204555](https://github.com/orgs/community/discussions/204555) (19 upvotes: "I'm very frequently only subscribing to when issue or pull request is merged/closed/reopened").
- **Status**: GitHub announced the removal on 2026-08-10 and paused it a week later, so the native feature still exists.
- **Verdict**: **weak** (native feature exists; watch for the deprecation resuming).

## Part 4. Also checked, briefly (helper agents' weaker findings)

| Candidate | People | What exists | Verdict |
|---|---|---|---|
| AI-generated security reports (curl, Linux, rsync, GNOME; [#189802](https://github.com/orgs/community/discussions/189802)) | 9 | GitHub shipped structured forms, rate limits and an allow-list for private vulnerability reports (2026-10-01/02); AI triage planned | already met / being met natively |
| One account spraying PRs and issues across many repos | 4–5 | agentscan, good-egg, vouch, contributor-report, about 100 "contributor trust/reputation" repos created in 2026; GitHub plans cross-repo controls | weak-medium, crowded |
| Autonomous agents (OpenClaw-style) opening PRs and issues | 7 | same tools as above; agent automation controls; draft-PR counting fix | weak as a separate tool |
| AI walls of text in comments | 7 | native "Low Quality" hide option (2026-04-09); written policies | weak |
| Hacktoberfest spam | 0 in 2026 | Hacktoberfest 2026 no longer counts PRs | already met |
| Draft PRs bypassing PR limits | 5 | GitHub building an optional setting (2026-09-28) | already met (in progress) |
| Publishing to npm from unsupported CI (Bitbucket, Azure, TeamCity, GHES) or a laptop; per-package approval | ~22 | registry-only; npm roadmap: batch approval 2026, more providers 2027 | strong need, no tool can fix it |
| dist-tag through trusted publishing ([npm/cli#8547](https://github.com/npm/cli/issues/8547), 60 reactions) | 6+ | shipped 2026-09-30 | already met |
| CHANGELOG section → GitHub Release notes ([cli/cli#9276](https://github.com/cli/cli/issues/9276)) | 3–4 | ffurrer2/extract-release-notes (71 stars), mindsers/changelog-reader-action (106), taiki-e/create-gh-release-action (96) | already met |
| Fixes piling up unreleased | users loud (up to 44 reactions on one issue); maintainers cite time and publish rights, not visibility | dhth/unreleased (4), electron/unreleased (17) | weak |
| Combined downloads across npm, PyPI, crates, Docker, Releases (for grant reports) | ~6 | several 0–3-star aggregators; single-registry sites | weak-medium |
| Loss of public stargazer lists ([#201209](https://github.com/orgs/community/discussions/201209), 161 upvotes) | many | star-history endpoint (2026-09-04); owners still see their own stargazers | weak (the lost "who" is private by design) |
| SBOM and provenance | not researched deeply | npm provenance, PyPI attestations, GitHub attestations, immutable releases | already met (native) |

## Observations

1. **Most maintainer chores already have several tools.** Notification cleanup has at least five working tools, yet people were still writing gists in 2025 and 2026; traffic history and release-download history each have 20–30 tools, most created in 2026. In these areas the gap is discoverability, not tooling, and another tool would join a crowd.
2. **The one cluster where every project still writes its own code is issue and PR intake**: who owes the next reply (G2-1), issues that skip the form (G2-2), and which PR may claim which issue (G2-3). The signals are hand-written `actions/github-script` workflows (173 for reply-state labels alone) and project-specific bots at Neovim, Homebrew, Keycloak, MLflow, OpenWISP, AWS and others, while the published Actions for these jobs are old (2022–2024), tiny, or one-sided.
3. **GitHub is shipping fast in exactly this space** (PR limits, issue limits planned, issue fields, agentic workflows, duplicate detection). Any tool here must be useful on its own today and degrade gracefully if GitHub adds a native equivalent. Issue fields are organization-only, so personal-account repos (most small maintainers) are not covered by them.
4. **Evidence quality.** Many 2026 issue and PR bodies in project repos read as agent-written; they are marked (P) and count as "this project hit the problem", not as a maintainer's own words. GitHub Community upvotes mix maintainers with company users (strongly so for G2-6 and G2-7).

## Ranking

| Rank | Need | Independent people / projects | Strongest workaround signal | Existing solutions | Passes the small-tool filter? | Verdict |
|---|---|---|---|---|---|---|
| 1 | G2-1 Who owes the next reply; stale only for author-waiting issues | 8 human + 3 (P), 2020–2026 | 173 hand-written reply-state workflows; 252 stale configs keyed to an "awaiting" label; 193 still on an abandoned action | partly: no-response (abandoned, author side), stale (no reply-state), tiny toggles; no cross-repo "waiting on me" view | yes (Action plus optional `gh` extension; testable on public repos) | **medium-strong** |
| 2 | G2-2 Issues opened through the API or by agents that skip the issue form | 5 projects, all 2026 | Homebrew, Keycloak, MLflow in-repo scripts | fails/partly: 2022–2024 actions built for markdown templates | yes | **medium** |
| 3 | G2-3 "Assign me" races, several PRs per issue | ~10 projects, 2026 | MLflow policy scripts, OpenWISP and Learning Equality bots | partly: assignment bots exist; PR-to-claimed-issue policy not packaged | yes | **medium** |
| 4 | G2-4 AI-written issues with false claims | 10 | Pi's re-check prompt | detection crowded and unreliable; claim checks only in 0-star tools | yes (best inside G2-2) | **medium** |
| 5 | G2-13 Rust workspace release adding a new crate under trusted publishing | 9 (P) + 1 human | ~10 repos with hand-written lanes | none | no (needs crates.io account to test) | medium, niche |
| 6 | G2-12 Diagnose trusted-publishing failures | ~19 | reverting to tokens | partly; npm improving its own logs | no (needs npm account) | medium |
| 7 | G2-5 Accurate, exportable dependents | ~25 | scrapers, ghtopdep | listing met (github-dependents-info) | no (scraping a robots-disallowed page) | medium |
| 8 | G2-7 Mute bots in notifications | 7+ (mostly company teams) | turning notifications off; paid Slack service | web inbox met (G2-6 tools); email/Slack unreachable | partly | medium |
| 9 | G2-14 Third-party notices for mixed artifacts | 12 (P) | own generators | per-ecosystem tools mature | yes | medium/weak |
| 10 | G2-15 Which companies use my project | ~18 | "who is using" issues; Scarf (paid) | not feasible without a gateway | no | strong need, not feasible |
| 11 | G2-16 Default-branch CI failure alerts | 3 | failure jobs, webhooks | failed-build-issue-action, notifier actions | yes | weak-medium |
| 12 | G2-17 Validate `dependabot.yml` before merge | 4+ | fixing a dozen repos by hand | @bugron/validate-dependabot-yaml (1.4k downloads/month) | yes | weak (partly met) |
| — | G2-6 Clear notifications for closed/merged items | 12 | many gists and scripts | 5+ tools incl. gh-not, gh-triage, prune-github-notifications | — | already met |
| — | G2-8 Gate AI-generated PRs | 6 + large threads | label automations | native PR settings and limits; vouch, anti-slop, agentscan | — | already met / crowded |
| — | G2-9 Traffic history beyond 14 days | 5+ | own archivers | 30+ tools | — | already met |
| — | G2-10 Release-asset download history | ~15 | own trackers | 20+ tools, free hosted history | — | already met |
| — | G2-11 npm first publish and bulk trusted-publishing setup | 18+ | short-lived tokens, Playwright | `npm trust`, `npm stage publish`, fledgling, setup-npm-trusted-publish | — | already met |
| — | G2-18 to G2-21 (old workflows, Dependabot PRs across repos, AI co-author in Contributors, ghost notifications) | various | one-liners, own tools | established tools for each | — | already met |
| — | G2-22 Notify only on close/merge | 2 threads | — | native feature (removal paused) | — | weak |

**Bottom line**: no need here is both strong and clearly unmet. The best candidate for a small, testable, non-promoted tool is the issue/PR intake cluster, led by G2-1 (reply-state lifecycle and a "waiting on me" queue), with G2-2 and G2-3 as natural extensions. Its evidence is mostly behavioural (many projects writing the same workflow) rather than many people asking in one thread, and GitHub could absorb parts of it; a later-session check of the 173 workflows (what states and rules they actually implement) would show whether one configurable tool can replace them.
