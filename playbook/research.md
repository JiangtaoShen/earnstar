# Research and selection (P0–P1)

**Goal**: choose the project with the highest expected stars per work-hour that the developer can build to a high standard within the timeline.

## 1. Sources (cite every source used)
- **GitHub search**, for fast risers by topic or language: `gh api -X GET search/repositories -f q="created:>YYYY-MM-DD stars:>200 topic:X" -f sort=stars`.
- **GitHub Trending** (daily and weekly, per language) and OSS Insight collections.
- **Hacker News**, via the Algolia API, e.g. `hn.algolia.com/api/v1/search?tags=show_hn&numericFilters=points>100`. Read the comments to learn why a launch worked.
- **Reddit**: top posts of the year in candidate subreddits, and recurring "is there a tool that…" questions.
- **Issues of popular repos, sorted by 👍**: demand that the maintainers will not meet.
- **Package download trends** (npm, PyPI), as demand evidence.
- **Awesome lists in the domain**: gaps, and each list's inclusion criteria.
- **Program data**: `history/metrics/` and `lessons.md`.

## 2. Candidates
- Generate ≥ 10 raw ideas; score ≥ 3.
- **Explore vs. exploit**:
  - Projects 1–2 explore distinct archetypes.
  - From project 3 on, weight archetypes by observed stars per work-hour, but keep at least one exploratory candidate in each scoring round.
- **Archetype priors**: these are unverified until program data confirms them.
  - Developer tools with instant payoff (CLI, editor/terminal utilities)
  - AI/LLM tooling (agents, MCP servers, Claude Code skills and plugins)
  - Curated resources (awesome lists, roadmaps, "build your own X", cheat sheets)
  - Self-hostable alternatives to paid SaaS
  - Templates and starter kits
  - Visual or playful projects with shareable output

## 3. Scoring (1–5 per criterion, weighted)
| Criterion | Weight | A score of 5 means |
|---|---|---|
| Demand evidence | 25 % | Several independent signals of pain; comparable repos are growing fast |
| Differentiation | 20 % | A clear one-sentence answer to "why this over X" |
| Time-to-wow | 15 % | Understood in 10 s from the README; tried in ≤ 60 s |
| Feasibility | 15 % | An MVP takes ≤ 40 active hours on this machine, and the developer can test it fully |
| Distribution fit | 15 % | Natural for HN/Reddit audiences and ≥ 1 active awesome list; searchable keywords |
| Sustainability | 10 % | Low maintenance; no hosted infrastructure and no cost |

**Knock-outs** (any one rejects the idea):
- It needs money or hosted services.
- It needs owner accounts beyond HN and Reddit.
- It carries legal, ToS, or trademark risk.
- It depends on a dominant incumbent and has no real angle against it.
- The developer cannot test it.

## 4. Output
Write `history/decisions/ADR-NNN-project-N-selection.md` containing:
- the candidates, their scores, and evidence links;
- the decision;
- **predicted stars at close** (to calibrate future predictions);
- kill criteria (the signals that would justify a pivot).

## 5. Naming
- Short, memorable, and searchable.
- Free on GitHub and on the target package registry.
- No trademark conflicts.
- Rename `earnstar_N` at the start of P2 (Constitution §3A). The local folder name stays unchanged.
