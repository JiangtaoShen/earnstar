# Research and selection (P0–P1)

**Why this phase decides the project**: every project runs for at least two months. Execution cannot rescue a weak idea, so P0–P1 is the highest-leverage work in the program.

**Goal**: choose, on evidence rather than intuition, the project with the highest expected stars per work-hour that the developer can build to a high standard within the timeline.

P2 may not start until the **Selection Gate** (§6) passes (Constitution §5).

## 1. Stages
1. **Foundational study**: how do open-source projects earn stars today? Written in project 1, then refreshed and extended in every later project.
   - Sample ≥ 30 repos that gained ≥ 1,000 stars within 90 days of creation, over the past 12 months. Include ≥ 10 whose authors had small audiences (< 100 followers), because they show how cold starts succeed.
   - For each repo, record: archetype, language, launch channels, days to 1k stars, README pattern, and author audience (current followers as a proxy; note this limitation).
   - Output: `history/research/foundation.md`, giving base rates by archetype and by channel. Record the conclusions in `lessons.md`.
2. **Divergence**: ≥ 15 raw ideas, each one line with the evidence that triggered it.
3. **Screening**: apply the knock-outs (§4) and shortlist ≥ 3 candidates.
4. **Deep dive on each shortlisted candidate**:
   - **Landscape**: ≥ 10 comparable or adjacent repos, with stars, star history, last activity, recurring issue themes, and gaps.
   - **Case studies**: ≥ 5 successful launches of the same archetype, dissected for what drove the stars, with evidence (launch posts, timing, visible referrers).
   - **Demand**: ≥ 3 independent signals of real pain (issues with many thumbs-up reactions, forum threads, repeated questions), each linked.
   - **Differentiation**: a one-sentence answer to "why this over X", checked against the top 3 alternatives.
   - **Distribution plan**:
     - a DEV article angle that teaches something on its own (L-003), with candidate tags and evidence that those tags have active readers;
     - ≥ 2 awesome lists whose criteria the MVP would meet;
     - GitHub search keywords and topics.
5. **Feasibility spike** on the leading candidate: a throwaway prototype of the riskiest technical part, within the budget in `defaults.md`, run on this machine.
6. **Decision and pre-mortem**:
   - Score the candidates (§3).
   - Then answer: "It is close day and the project has fewer than N stars. Why?" List the top failure modes and their mitigations.
7. **Independent critique**:
   - A subagent with no stake in the decision reviews the draft ADR and argues against it.
   - Record every objection and its response. Change the decision if the objections warrant it.
8. **Reflection**: confirm the decision in a later session than the one that drafted it, with fresh context.

## 2. Sources (cite every source used)
- **GitHub search**, for fast risers by topic or language: `gh api -X GET search/repositories -f q="created:>YYYY-MM-DD stars:>200 topic:X" -f sort=stars`.
- **Star history of any public repo**: `gh api -H "X-GitHub-Api-Version: 2026-03-10" repos/OWNER/REPO/stargazers/history` (weekly buckets with daily counts). Since July 2026 the stargazer list itself is private to a repo's admins and collaborators (L-004). The study scripts in `history/research/foundation/` show the full method.
- **GitHub Trending** (daily and weekly, per language) and OSS Insight collections.
- **Hacker News** (reading only; it is not a program channel), via the Algolia API, e.g. `hn.algolia.com/api/v1/search?tags=show_hn&numericFilters=points>100`. Read the comments to learn what developers value.
- **DEV**: top articles by tag (`dev.to/api/articles?tag=X&top=N`) show which topics and formats draw readers, and which articles link to GitHub repos.
- **Reddit** is unreachable from this environment (L-002); use secondary sources only.
- **Issues of popular repos, sorted by thumbs-up reactions** (`sort:reactions-+1`): demand that the maintainers will not meet.
- **Package download trends** (npm, PyPI), as demand evidence.
- **Awesome lists in the domain**: gaps, and each list's inclusion criteria.
- **Program data**: `history/metrics/` and `lessons.md`.

## 3. Scoring (1–5 per criterion, weighted)
| Criterion | Weight | A score of 5 means |
|---|---|---|
| Demand evidence | 25 % | Several independent signals of pain; comparable repos are growing fast |
| Differentiation | 20 % | A clear one-sentence answer to "why this over X" |
| Time-to-wow | 15 % | Understood in 10 s from the README; tried in ≤ 60 s |
| Feasibility | 15 % | The spike succeeded; an MVP takes ≤ 40 active hours on this machine; the developer can test it fully |
| Distribution fit | 15 % | A strong DEV article angle with active tags, ≥ 2 fitting awesome lists, and searchable keywords |
| Sustainability | 10 % | Low maintenance; no hosted infrastructure and no cost |

**Explore vs. exploit**:
- Projects 1–2 explore distinct archetypes.
- From project 3 on, weight archetypes by observed stars per work-hour, but keep at least one exploratory candidate in each scoring round.

**Archetype priors**: these are unverified until the foundational study or program data confirms them.
- Developer tools with instant payoff (CLI, editor/terminal utilities)
- AI/LLM tooling (agents, MCP servers, Claude Code skills and plugins)
- Curated resources (awesome lists, roadmaps, "build your own X", cheat sheets)
- Self-hostable alternatives to paid SaaS
- Templates and starter kits
- Visual or playful projects with shareable output

## 4. Knock-outs (any one rejects the idea)
- It needs money or hosted services.
- It needs owner accounts beyond GitHub and DEV.
- It carries legal, ToS, or trademark risk.
- It depends on a dominant incumbent and has no real angle against it.
- The developer cannot test it.

## 5. Outputs
- **`history/research/earnstar_N/`**: `ideas.md` (all raw ideas and the screening), one file per deep-dived candidate (landscape, case studies, demand, distribution), `spike.md`, and `critique.md` (objections and responses).
- **`history/decisions/ADR-NNN-project-N-selection.md`**:
  - the scores and the Selection Gate checklist with links;
  - the decision and the runner-up;
  - the pre-mortem;
  - predicted stars at close, with 50 % and 90 % intervals;
  - kill criteria for the pivot review (§8).

## 6. Selection Gate (every item must pass before P2)
- [ ] The foundational study exists and was refreshed in this project.
- [ ] ≥ 15 ideas were screened and ≥ 3 candidates deep-dived.
- [ ] Each candidate has a landscape (≥ 10 repos), ≥ 5 case studies, ≥ 3 demand signals, a differentiation statement, and a distribution plan.
- [ ] The feasibility spike succeeded, or the technical risk is shown to be low, with reasons.
- [ ] The pre-mortem and the independent critique are recorded, and every objection is answered.
- [ ] A prediction with intervals, kill criteria, and a runner-up are recorded.
- [ ] The research floor is met (`defaults.md`).
- [ ] The decision was confirmed in a later session.

## 7. Continuous learning (P2–P4)
- Research does not stop at P1. At least the share of active time set in `defaults.md` goes to:
  - user feedback;
  - competitor moves;
  - new comparable launches;
  - how the domain's top projects structure their code, docs, and README.
- Record findings in the session log and `lessons.md`.

## 8. Pivot review
- **When**: at the date set in `defaults.md` (launch + 14 days). Compare the metrics with the kill criteria.
- **Output**: an ADR that decides one of:
  - continue;
  - adjust the positioning, README, or channel;
  - switch to the runner-up candidate.
- **A switch** reuses the repo (renamed) and keeps the project's original kickoff and deadlines.

## 9. Naming
- Short, memorable, and searchable.
- Free on GitHub and on the target package registry.
- No trademark conflicts. Never use "Claude", "Claude Code", or "Anthropic" in a project's name or logo; plain-text references in the description are fine (L-013).
- Rename `earnstar_N` at the start of P2 (Constitution §3A). The local folder name stays unchanged. After renaming, update `name` in `repos.json` and the clone's remote (`git remote set-url origin https://github.com/JiangtaoShen/<new name>.git`).
