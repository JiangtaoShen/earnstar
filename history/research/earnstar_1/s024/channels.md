<!-- Copied from the private working file lab/s024/channels/channels.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Where do new tools from unknown authors get found without promotion?

S024 research note. Data pulled 2026-10-03 (UTC) from public APIs and raw files. It was read-only: nothing was posted, starred, installed or submitted. Scripts and raw pulls are in the subfolders of `lab/s024/channels/`.

**Question.** On plain GitHub, new tools from unknown authors are almost never found without promotion. Is that also true of in-app plugin/extension registries, where users search inside an app they already use? How does that compare with package registries and other alternatives?

**Common yardstick.** For entries *first published 2026-03..2026-07*, I measured the share that reached ≥100, ≥1,000 and ≥10,000 installs or downloads, plus the median. Where a registry keeps history (Obsidian) or daily series (PyPI, npm), the figure is at 60–92 days. Elsewhere it is the current count, broken down by cohort month so that age is visible: the July cohort is 64–94 days old today and the March cohort is about 6–7 months old. Each channel also gets a **bot floor**, the count that an entry nobody uses still collects, so real use can be told apart from noise.

---

## 1. Obsidian community plugins (in-app registry)

| Item | Finding |
|---|---|
| Discovery | In-app *Settings → Community plugins → Browse*: text filter on **name, author, description**, plus sort options including **"Recently released"** (by directory acceptance date) and "Recently updated" ([forum 112468](https://forum.obsidian.md/t/recently-released-in-community-plugins-browser-appears-broken-or-mislabeled/112468)). Web directory community.obsidian.md can sort by "name, downloads, popularity, release date, and updated date" and has categories ([blog, 2026-05-12](https://obsidian.md/blog/future-of-plugins/)). Third-party automatic "new plugins" feed: obsidianstats.com weekly posts. The 2026-09-13..19 post lists **284 new plugins in one week**, so the "new" feed is now too long to read closely. |
| Publication | Since **2026-05-12**, authors sign in to the Community site, connect GitHub, pick the repo, and an **automated review returns results "within a few minutes"**. The plugin appears in the app **within 24 h**. Manual review is gone, and listings carry "This plugin has not been manually reviewed by Obsidian staff". Free. Every version is scanned. Authors agree to maintain the plugin and to label pricing. The 2,300+ submission backlog was cleared in days. |
| Volume | About 15 new plugins/month before May 2026 (2,705 → 2,750 from Jan to May). Then **+1,718 (May), +964 (Jun), +1,037 (Jul), +1,056 (Aug), +1,201 (Sep)**. Now 8,332 plugins. |
| Method | Monthly snapshots of `community-plugins.json`. Cohort M = ids present on the 1st of M+1 and absent on the 1st of M. Downloads come from the `community-plugin-stats.json` snapshot on the 1st of M+3 (age 61–92 days). Stars come from GitHub GraphQL (current). "Unique-installer proxy" = downloads of the single most-downloaded version, because the total counts every update download too. |
| Bot floor | Plugins listed in September with **one version** have a **median of 36 downloads** (p10 17, p90 84). Scanners and mirrors therefore add roughly 20–40 downloads per version. |

**Downloads at ~60–92 days after listing**

| Cohort | n | Median | p75 | p90 | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|---|---|
| Jan–Apr 2026 (manual review, pre-flood) | 66 | 873 | — | — | 97.0% | **47.0%** | 7.6% |
| May 2026 | 1,718 | 302 | 797 | 2,418 | 94.6% | 20.7% | 3.0% |
| Jun 2026 | 964 | 289 | 592 | 1,350 | 93.2% | 14.4% | 1.4% |
| Jul 2026 | 1,037 | 331 | 802 | 1,512 | 83.4% | 19.0% | 1.4% |
| **May–Jul, first-time authors** (owner had no plugin before Mar 2026) | 3,337 | **293** | — | — | ~91% | **16.9%** | **1.6%** |
| May–Jul, authors with earlier plugins | 247 | 639 | — | — | — | 41.7% | 8.5% |
| May–Jul, unique-installer proxy (max single-version downloads) | 3,584 | 149–202 by cohort | 289–443 | 569–1,251 | 67–85% | **4.9–12.2%** | 0.4–1.0% |

- **Downloads added after listing**, from the first month-end snapshot to two months later, which removes pre-listing installs: median 196–261, ≥1,000 in 10.9–14.2%, ≥10,000 in 0.4–1.1% (cohorts May, Jun, Jul).
- **Stars**, May–Jul cohorts (n = 3,687): median **1**, p90 12, ≥10 in 12.6%, ≥50 in 3.1%, ≥100 in **1.6%**, ≥1,000 in 0.1%.
- **Stars by download band:**

  | Downloads at ~90 d | Median stars |
  |---|---|
  | <300 | 1 |
  | 300–1k | 2 |
  | 1k–10k | 9 |
  | ≥10k | 126 |

  That is about **0.8 stars per 100 installers** (median; IQR 0.3–1.9).
- **Caveats:**
  - Downloads are GitHub release-asset downloads. They include updates, and every device or vault that installs counts separately.
  - The May cohort includes the old queue, and some of those plugins already had BRAT users.
  - A few July "new" ids are re-listings of old popular plugins (nldates, hot-reload), which inflates the tail but not the median.
  - 175 of the May–Jul plugins have since been removed.

## 2. VS Code Marketplace

| Item | Finding |
|---|---|
| Discovery | In-editor Extensions view: search by relevance, with an empty-box view of installed and recommended extensions. Sort values are `@sort:installs`, `rating`, `name`, `publishedDate` and `updateDate` ([docs](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)). Because ranking is weighted by installs and ratings, a new entry starts at the bottom. A "newest" sort exists but competes with about 3,700 new extensions a month. |
| Publication | Microsoft account plus an Azure DevOps PAT, then create a publisher and run `vsce publish`. Automated scan, live in minutes. Free. Domain verification is optional. |
| Method | Public gallery API `extensionquery` (sortBy=10 release date, flags = statistics + latest version). 30,000 extensions published 2026-01-31..2026-10-02 were crawled. "Unknown author" = publisher not domain-verified and with ≤2 new extensions in the crawl. Install counts are current. |
| Bot floor | **Low.** September cohort (0–30 days) median 4 installs. Install counts look mostly genuine; updates are counted separately. |

| Cohort (unknown authors) | Age today | n | Median | p90 | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|---|---|
| Mar 2026 | 186–216 d | 3,637 | 38 | 449 | 29.3% | 4.9% | 0.6% |
| Apr | 156–185 d | 3,152 | 29 | 327 | 24.3% | 3.6% | 0.5% |
| May | 125–155 d | 3,197 | 23 | 233 | 20.3% | 2.5% | 0.2% |
| Jun | 94–124 d | 3,037 | 18 | 182 | 16.2% | 2.1% | 0.2% |
| **Jul** | **64–94 d** | 3,002 | **13** | 108 | **10.9%** | **1.1%** | **0.0%** |
| Mar–Jul, domain-verified publishers | — | 180 | 234 | 4,185 | 62.8% | 21.7% | 5.6% |

**Caveats:** There is a lot of junk among new entries (themes, AI-chat wrappers, snippets), so the share among *useful* extensions is higher. Some top new entries look inflated, for example 166k installs in 6 months for an unknown "offline markdown preview".

## 3. Open VSX (VSCodium, Cursor, Windsurf, Gitpod, Theia and other forks)

| Item | Finding |
|---|---|
| Discovery | Search inside the forks' extension views, backed by the Open VSX search API. open-vsx.org has search with relevance, downloads, rating and timestamp sorts. Cursor and other forks made it large: the registry claims 300M monthly downloads ([2026-03](https://www.globenewswire.com/news-release/2026/03/03/3248179/0/en/Open-VSX-Registry-surpasses-300-million-monthly-downloads-as-industry-leaders-back-critical-developer-infrastructure.html)). |
| Publication | Eclipse Foundation account linked to GitHub, sign the **Open VSX Publisher Agreement**, create a namespace, then `ovsx publish` with a token. Since early 2026 there is **mandatory pre-publish scanning** with quarantine of suspicious uploads ([THN 2026-02](https://thehackernews.com/2026/02/eclipse-foundation-mandates-pre-publish.html)). Free. |
| Method | 18,797 extensions enumerated (search API, both sort orders). From the 11,063 updated since March, a random sample of 3,000 was taken and each one's oldest version timestamp fetched. **1,607 were first published Mar–Jul** (estimated 5,900 in the population). Downloads are current. |
| Bot floor | **Very high.** One-version extensions first published in July: **median 522 downloads**. September cohort, one version: median 304 (p10 145). Each version draws about 150–300 automated downloads, so counts below ~2,000 carry almost no signal. |

| Cohort | n | Median | ≥1,000 | ≥10,000 | Note |
|---|---|---|---|---|---|
| Mar–Jul, all | 1,607 | 1,334 | 59.6% | 6.0% | floor-dominated |
| Mar–Jul, unverified namespace | 610 | 807 | 40.8% | 2.6% | |
| Jul (64–94 d), unverified | 146 | 708 | 36.3% | 2.7% | |
| Mar–Jul with 1 version: share ≥5,000 | 502 | 597 | — | — | **1.2%** ≥5k |
| Mar–Jul with 2–3 versions: share ≥5,000 | 377 | 922 | — | — | **1.9%** ≥5k |

**Caveat:** "First published" is the oldest *remaining* version. Re-published namespaces, gitlens for example, appear as new. Real adoption above the floor looks similar to VS Code's.

## 4. gh CLI extensions

| Item | Finding |
|---|---|
| Discovery | `gh extension search` and `gh extension browse` use GitHub repo search on topic `gh-extension`, which defaults to star ordering. So this is plain GitHub search with a filter. |
| Publication | Name a repo `gh-*` and add the topic. Free, no review. |
| Method | Search API `topic:gh-extension created:2026-MM`, Mar–Jul. Stars are current. Install counts are not public. |

| n | Median stars | p90 | ≥10 | ≥100 | ≥1,000 |
|---|---|---|---|---|---|
| 174 | **0** | 4 | 5.7% | 2.9% | 0% |

All 5 entries at ≥100 stars belong to GitHub orgs or well-known developers: GitHubSecurityLab, github, foundation50, babarot, drogers0. **This is plain GitHub; no extra discovery.**

## 5. PyPI and npm (package registries)

| Item | PyPI | npm |
|---|---|---|
| Discovery | pypi.org search, which is weak. People mostly arrive from docs, search engines, AI assistants or dependency trees. There is **no "new" browsing in any client.** | npmjs.com search, same pattern. No "new" view. |
| Publication | Free account, trusted publishing from GitHub Actions, instant. | Free account, instant. |
| Volume | About **770 new projects per day** (XML-RPC changelog). | Millions of changes per month (replicate feed). |
| Method | 12 evenly spaced `changelog_since_serial` windows over Apr–Jul (445 h, 14,233 creates). 450 random creates checked. `pypistats /overall?mirrors=false` gives daily counts, from which the first-60/90-day sum and the September 2026 month were computed. | 70 evenly spaced windows of `replicate.npmjs.com/registry/_changes` from about 1 Apr to now. Packuments were fetched, giving **1,032 packages created Apr–Jul**. Daily counts from `api.npmjs.org/downloads/range`. |
| Removed since | 45 of 450 (10%) return 404 | — |
| Bot floor | Single-release projects: **230 in the first 90 days**, then **12/month** (p90 31) | Single-version packages: **175 in the first 90 days**, then **16/month** (p90 53) |

| Metric | PyPI (n) | Median | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|
| First 90 days, all live | 291 | 521 | 100% (floor) | 26.5% | 3.4% |
| Sep 2026 monthly, all live | 405 | 24 | 25.2% | 6.2% | 1.0% |
| Sep 2026 monthly, "CLI-ish" (console classifier or CLI words) | 80 | 19 | 25.0% | 8.8% | 1.3% |

| Metric | npm (n) | Median | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|
| First 90 days, all | 807 | 466 | 95.9% (floor) | 26.6% | 0.7% |
| Sep 2026 monthly, all | 1,032 | 30 | 16.6% | 2.1% | 0.3% |
| Sep 2026 monthly, has `bin` (CLI) | 363 | 31 | 17.1% | 1.4% | 0.3% |

**Reading:** The first-90-day totals are mostly floor, because every release re-triggers mirrors and scanners. After the floor is removed, the tail is dominated by **SDKs and dependencies of company products**: pystac-ext-table at 2.1M a month, contree-client, @formspec/config, @posthog/definitions. Their users install them because something else requires them, not because they discovered them. **Package registries are a delivery channel, not a discovery channel.**

## 6. Other channels

### Firefox AMO
| Item | Finding |
|---|---|
| Discovery | addons.mozilla.org search (sorts include relevance, users, rating, trending and newest), categories, and a curated "Recommended" program. Firefox's add-ons manager links to AMO. |
| Publication | Mozilla account, upload, automated validation, then listing. Free. |
| Method | AMO v5 search API sorted by `created`, 30,000 newest (the cap reaches 2026-03-17). The metric is **average daily users (ADU)**, an active-user measure that is stricter than installs. |
| Volume | About **4,000–6,000 new extensions per month**. 19 authors with ≥20 new extensions account for only 2.5%. |

| Cohort (authors with ≤2 new) | n | Median ADU | ≥10 | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|---|
| Apr 2026 (~5.5 months) | 2,761 | 1 | 18.7% | 3.9% | 0.4% | 0 |
| **Jul 2026 (64–94 d)** | 4,105 | 1 | 9.8% | **1.5%** | 0.3% | 0 |
| Apr–Jul | 14,354 | 1 | 12.4% | 2.4% | 0.3% | ~0 |

### ComfyUI registry (ComfyUI-Manager)
| Item | Finding |
|---|---|
| Discovery | **In-app** ComfyUI-Manager node browser with search, backed by the registry ([docs](https://docs.comfy.org/registry/overview)). A second, pull-based path: **loading someone's workflow that uses your node triggers "Install missing nodes"**, so a node spreads with the workflows people share. |
| Publication | Registry account through GitHub, create a publisher, then API key and `comfy node publish` (or the GitHub Action). Automated malicious-code scan. Free, minutes. |
| Method | `api.comfy.org/nodes`, all 5,817 nodes. `created_at` gives the cohort. Downloads and GitHub stars are current. "New publisher" = publisher account created ≥ 2026-02. |
| Bot floor | **Low.** September cohort median 5 downloads. |

| Cohort | n | Median | p90 | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|---|
| Mar–Jul, all | 1,159 | 270 | 2,854 | 78.1% | 21.7% | 3.5% |
| Mar–Jul, new publishers | 820 | 246 | 2,166 | 76.2% | **19.3%** | **3.5%** |
| **Jul, new publishers (64–94 d)** | 209 | **116** | — | 56.0% | **12.0%** | 1.9% |

- Stars, new publishers: median 2, ≥10 in 20.4%, ≥100 in **4.0%**.
- Stars by download band:

  | Downloads | Median stars |
  |---|---|
  | 1k–10k | 9 |
  | ≥10k | 118 |

  About 0.44 stars per 100 downloads.
- Caveat: some "new" registry entries are older GitHub repos registered late.

### Home Assistant HACS (default store)
| Item | Finding |
|---|---|
| Discovery | **In-app** HACS store inside Home Assistant (search, plus "new" badges on newly added repositories). Users can also add custom repositories by URL, but that requires already knowing about them. |
| Publication | A **PR to hacs/default** (a third-party repo). It must pass the HACS and hassfest Actions and needs a release and brand assets. **1,670 open PRs**, and the oldest open one dates from 2026-01-20. Merges come in batches: 920 in Mar–Jul, 477 in August, 20 in September. The September merges had waited a **median of 60 days** (p25 49, p75 82). About 150–200 additions per month. |
| Method | Diff of the `integration` list between 2026-03-01 and 2026-08-01: **749 added**. Each repo was mapped to its `custom_components/<domain>`. Installs come from the HA analytics [custom_integrations.json](https://analytics.home-assistant.io/custom_integrations.json), which only counts installs that opted in to usage analytics (692k reporting installs; HACS present in 393k), so they are **lower bounds**. |

| Added Mar–Jul | n | Median opt-in installs | p90 | ≥10 | ≥100 | ≥1,000 |
|---|---|---|---|---|---|---|
| All | 743 | **0** (78% have no reporting install) | 57 | 16.3% | 7.4% | 1.3% |
| Repo created since Dec 2025 | 632 | 0 | 11 | 10.6% | 4.1% | 0.6% |

- Stars: median 3, ≥100 in 3.9%.
- About **11 stars per 100 opt-in installs**, the strongest install-to-star conversion seen. The HA community stars a lot, and HACS shows stars.
- Testing would need a Home Assistant instance and real devices.

### Raycast store
| Item | Finding |
|---|---|
| Discovery | **In-app** store with "Recently Added", "Most Popular", featured lists and search. It runs on macOS and Windows; 952 of 3,358 listings support Windows. |
| Publication | **PR to the raycast/extensions monorepo** (a third-party repo) with human review. Free. |
| Method | `raycast.com/api/v1/store_listings` (3,358 listings). `created_at` gives the cohort. `download_count` is current. |

| Cohort | n | Median | ≥100 | ≥1,000 | ≥10,000 |
|---|---|---|---|---|---|
| Mar–Jul | 424 | 33 | 25.7% | 2.6% | 0.2% |
| Jul (64–94 d) | 100 | 19 | 12.0% | 1.0% | 0 |
| Mar–Jul, author account created ≥ Sep 2025 | 123 | 30 | 22.0% | 0.8% | 0 |

### Logseq marketplace
In-app marketplace. Publication is a PR to logseq/marketplace. `stats.json` holds GitHub release download counts.

| Cohort | n | Median downloads | ≥100 | ≥1,000 | Stars |
|---|---|---|---|---|---|
| Non-theme plugins added Mar–Jul 2026 | 99 | **61** | 36.4% | **0%** | median 1 |
| 2023 cohort (lifetime, for contrast) | — | 1,103 | — | 53.5% | — |

The ecosystem has shrunk since the DB-version transition.

### Claude Code plugin directories
- The official `anthropics/claude-plugins-official` directory has 315 plugins, 262 of them external and mostly from companies. It is in-app through `/plugin → Discover`. Entry is via a submission form plus review.
- `anthropics/claude-plugins-community` started 2026-03-20 and had 2,307 plugins by 2026-08-01. Validation is automated, and users must add the marketplace themselves.
- **No public per-entry install counts**, so the base rate cannot be measured.
- Stars of community-listed repos as a proxy: owners with <50 followers and repos created in 2026 (n = 1,051) have a median of 1 star, ≥10 in 14.7%, ≥100 in 3.0%.

### Zotero
There is no first-party plugin directory. The main third-party list (zotero-chinese/zotero-plugins) is marked "Maintenance Suspended". Not measured.

### Plain GitHub baseline (for comparison)
Repos with `topic:cli` created 2026-03..07 (n = 41,287), including well-known and promoted authors:

| ≥10 stars | ≥100 stars | ≥1,000 stars |
|---|---|---|
| 7.1% | 1.4% | 0.2% |

`topic:developer-tools` (n = 36,541): ≥10 in 8.6%, ≥100 in 1.6%.

### Not measurable with public per-entry data
Search engines and AI-assistant answers are probably where most people look for a standalone tool. Nothing public gives per-entry counts for them, so they could not be scored here.

---

## 7. Side-by-side (new entries by unknown authors, Mar–Jul 2026)

| Channel | Discovery inside the app the user already has? | New entries/month (competition) | Bot floor | ≥1,000 at ~60–94 d (or nearest) | Median | Stars ≥100 | Publication cost / delay |
|---|---|---|---|---|---|---|---|
| **Obsidian** | Yes: search on name/description, "Recently released" | ~1,000 (was ~15) | ~20–40 per version | **16.9%** (total); **5–12%** (unique proxy) | ~293 | 1.6% | Free, dashboard, minutes to 24 h |
| **ComfyUI registry** | Yes: Manager search + **missing-node auto-install from shared workflows** | ~230–430 | ~5 | **12.0%** (Jul); 19.3% (Mar–Jul) | 116–246 | 4.0% | Free, CLI/Action, minutes |
| VS Code Marketplace | Yes: search, ranked by installs | ~3,700 | ~4 | 1.1% (Jul); 4.9% (Mar, ~6.5 months) | 13–38 | n/m | Free, minutes |
| Open VSX | Yes (Cursor, VSCodium, …) | ~1,200 | **~500–600** | not separable; ~1–2% ≥5k | ~800 | n/m | Free + publisher agreement, scan |
| HACS (HA) | Yes | ~150–200 added (queue 1,670) | 0 (opt-in analytics) | 1.3% opt-in (lower bound) | 0 | 3.9% | PR to third-party repo, **median wait ~60 days** |
| Raycast | Yes: "Recently Added" | ~85 | low | 1.0% (Jul); 2.6% (Mar–Jul) | 19–33 | n/m | PR to third-party repo, human review |
| Firefox AMO | Partly (AMO site) | ~4,000–6,000 | — | ADU ≥1,000: 0.3%; ADU ≥100: 1.5–2.4% | 1 ADU | n/m | Free, automated |
| PyPI | No | ~23,000 | 230 per 90 d / 12 per month | monthly ≥1k: 6.2% (mostly dependencies) | 24/month | n/m | Free, instant |
| npm | No | very large | 175 per 90 d / 16 per month | monthly ≥1k: 2.1% | 30/month | n/m | Free, instant |
| gh extensions | No (GitHub search) | ~35 | — | (stars) ≥100: 2.9%, all orgs or well-known devs | 0 stars | 2.9% | Free |
| Logseq | Yes | ~20 | low | 0% | 61 | ~0 | PR to third-party repo |
| Claude Code plugins | Yes (official) / opt-in (community) | ~500 (community) | — | n/m | (1 star) | 3.0% | Form + review / automated |
| Plain GitHub `topic:cli` | — | ~8,000 | — | — | — | 1.4% | — |

n/m = not measured.

---

## 8. Ranking: "a useful new tool from an unknown author gets found by people who need it, without promotion"

1. **Obsidian community plugins.**
   - Users search inside the app by name and description.
   - Almost every listed plugin gets real installs: the median unique-installer proxy is ~150–200, against a floor of ~36.
   - The tail is reachable by first-time authors: 16.9% reach ≥1,000 downloads and 1.6% reach ≥10,000 in about 90 days.
   - Publishing is free and takes minutes, and the app is testable on Windows 10.
   - Caveat: since the 2026-05-12 automated-review switch, about 1,000 plugins arrive each month. The ≥1,000 share fell from 47% (manual-review era, n = 66) to about 17%, so the "Recently released" exposure is now diluted. Search on the need's words matters more than the new list.
2. **ComfyUI registry.**
   - Similar base rate: 12% reach ≥1,000 at 64–94 days and 19% across Mar–Jul, with a low bot floor.
   - It has the only true *pull* mechanism observed: shared workflows auto-install the nodes they use.
   - Stars come more readily than on Obsidian (4% reach ≥100).
   - Constraints: a GPU-centric domain (this machine has a 6 GB GTX 1660 Ti) and fast model churn.
3. **VS Code Marketplace + Open VSX** (publish to both).
   - The audience is the largest, but 3,700 new extensions a month and install-weighted ranking put a new entry far down: 1.1% reach ≥1,000 at 64–94 days, rising to about 5% by 6 months.
   - It works if the need maps to a precise search term with few competitors.
   - Open VSX counts are too bot-inflated to read below about 2,000.
4. **HACS (Home Assistant).**
   - Strong in-app store and the best star conversion (about 11 stars per 100 opt-in installs).
   - But listing needs a PR to a third-party repo, with about a 2-month median wait (1,670 open PRs), and testing needs HA plus hardware.
   - The median new integration has 0 opt-in installs.
5. **Raycast** and **Firefox AMO.**
   - In-app or store discovery exists, but the base rates are low: Raycast 1–2.6% reach ≥1,000; AMO 1.5–2.4% reach ≥100 daily users.
   - Raycast needs a reviewed PR; AMO is flooded with 4,000–6,000 new extensions a month.
6. **PyPI and npm.**
   - Not discovery channels: no new or browse surface, and counts are mostly floor or dependency traffic.
   - Useful only to deliver a tool people found elsewhere.
7. **gh CLI extensions** and **plain GitHub.**
   - About 0 stars at the median for unknown authors; the hits are orgs or well-known developers.
   - This confirms the program's own experience.
8. **Logseq.** The ecosystem is shrinking: 0% of Mar–Jul plugins reached 1,000.

Not ranked: **Claude Code directories**, because there are no public counts. Their star outcomes look like the GitHub baseline.

The **hypothesis holds, with limits.** In-app registries where users search inside the host app (Obsidian, ComfyUI, and to a lesser degree VS Code) are the only channels where new entries by unknown authors routinely get real use without promotion. Being listed alone yields ~100–300 real installs. Roughly 1 in 6–8 new Obsidian or ComfyUI entries reaches ≥1,000 within about 3 months, against ~1% for VS Code and ~0 for gh or plain GitHub.

## 9. Implications for choosing a project

1. **Choose a need that lives inside a host app with an in-app registry**, in this order of preference: Obsidian, then ComfyUI (only if the need fits a 6 GB GPU or is non-GPU tooling), then VS Code + Open VSX. The users must already be in that app and search there for the problem.
2. **Match the users' search words.** Obsidian's in-app filter matches only name, author and description. The plugin name and one-line description must contain the words users type. Pick needs whose words are not already owned by a popular plugin; check the in-app search results for those words during P0.
3. **Expect usage, not stars.** At ~90 days the median new Obsidian plugin has ~300 downloads but **1 star**. Stars run at about **0.4–0.8 per 100 installs** (Obsidian, ComfyUI), so 100 stars needs roughly 10k+ installs, which is the top ~2% of new Obsidian plugins (1.6% of first-time authors). Report installs from the registry's public stats every session as the primary usefulness signal; the registries publish them per entry.
4. **Quality and fit decide the tail, not the listing.** Listing gives everyone the ~100–300 floor. What separates the 17% from the rest is solving a searched-for problem well and updating it. Authors with earlier plugins do 2–5× better (41.7% vs 16.9% reach ≥1,000), which fits accumulated experience and returning users.
5. **Constitution fit:**
   - Obsidian, ComfyUI, VS Code and Open VSX publication is a first publication to a registry, so each needs owner approval (§3B) and an owner-supplied account or token: an Obsidian Community account, a Comfy Registry publisher, an Azure DevOps PAT, and an Eclipse account plus the Open VSX agreement.
   - HACS, Raycast and Logseq need a PR to a third-party repo per release or listing, which is also §3B, and they add long review queues. Weight them down.
   - None of the preferred channels costs money.
6. **Avoid** channels with no in-app discovery (PyPI, npm, gh extensions, standalone GitHub CLIs) as the *primary* way to be found. Use them only as delivery for a tool whose users arrive through an in-app registry or through search for an exact problem.

---

## Data and scripts (all in `lab/s024/channels/`)
- `obs/`: Obsidian snapshots (plugins and stats, 2026-01..10 plus now), `cohort.js`, `cohort2.js`, `stars.js`, `cohort_rows.json`, `stars.json`.
- `vsc/`: `crawl.mjs`, `analyze.mjs`, `vsc_recent.json` (30,000 extensions).
- `ovsx/`: `crawl.mjs`, `crawl2.mjs`, `first.mjs`, `all.json`, `sample_first.json`.
- `ghx/`: `m03..m07.tsv`.
- `pypi/`: `xr.mjs` (XML-RPC), `collect.mjs`, `stats.mjs`, `analyze.mjs`, `creates.json`, `sample.json`.
- `npm/`: `lib.mjs`, `sample.mjs`, `dl.mjs`, `analyze.mjs`, `packs.json`, `dl.json`.
- `amo/`: `crawl.mjs`, `amo_recent.json`.
- `comfy/`: `crawl.mjs`, `nodes.json`.
- `hacs/`: list snapshots, `dom.js`, `added_meta.json`, `ci.json` (HA analytics).
- `raycast/`: `crawl.mjs`, `listings.json`.
- `logseq/`: `stats.json`, `plugins.json`.
- `ccp/`: community marketplace snapshots, `stars.js`.
