# earnstar

**Can an AI coding agent, working alone, build open-source projects that people genuinely want to star?**

[Claude Code](https://www.anthropic.com/claude-code), Anthropic's AI coding agent, is the sole developer here. Over 12 months it builds and maintains 4–6 projects, one at a time, under the supervision of [@JiangtaoShen](https://github.com/JiangtaoShen). Every session is logged, and every number is measured from source data.

## Ground rules
- **People first.** Each project starts from what real people need, in their own words; it is released early and improved continuously from what its users do and say, and every iteration records what it taught.
- **No promotion.** Projects are not advertised anywhere; people find them because they solve a problem they were looking to solve.
- **Stars must be earned.** No buying, trading, or soliciting stars or votes; no spam; AI authorship is always disclosed.
- **One project at a time**, each lasting 2–3 months.
- **Full audit trail**: time, tokens, decisions, and metrics for every session.
- The complete rules are in [CLAUDE.md](CLAUDE.md).

## Projects
| # | Project | Status | Stars |
|---|---|---|---|
| 1 | — | selection restarted on 2026-10-03 from people's real needs ([ADR-005](history/decisions/ADR-005-user-needs-no-promotion.md)) | — |

## Earlier research: how repositories earned stars in 2026
Before the restart, the program studied how repositories earn stars (S016–S022). It no longer chooses projects this way, and it uses no promotion, but the measurements may help other maintainers. Measured from public GitHub, Hacker News, and V2EX data in 2026; every number links to its method and data.

- **Most bursts come from places public data cannot show.** Of 866 repos created July–September 2026 by owners with fewer than 100 followers that reached 300 stars, 64 % took off in a spike with no visible source, 20 % grew slowly, 12 % rode a news hook, and 3 % came from Hacker News ([smallwin.md](history/research/earnstar_1/smallwin.md)).
- **Every launch channel open to a small owner is a ticket worth a few percent.** One Show HN of a new GitHub repo: median about 3 stars, about 2.8 % chance of 100 stars within 30 days ([scenario-b.md](history/research/earnstar_1/scenario-b.md)). One V2EX "share my creation" post: median +3 stars in three days ([scenario-c.md](history/research/earnstar_1/scenario-c.md)). One DEV article: median about 1 star in a week ([foundation.md](history/research/foundation.md)).
- **Copying a winner's recipe predicts nothing.** A skill that gained 944 stars in its first week was followed three days later by its author's identical recipe for a neighbouring tool, which earned 1 star ([critique.md](history/research/earnstar_1/critique.md)).
- **Obvious ideas are built many times over.** Ideas that looked open (an image editor for agents, a local benchmark of coding models on your own repo, a monitor of model changes, an interactive dougong explainer) each had several near-identical repos at 0–2 stars within weeks of the triggering news ([ideas.md](history/research/earnstar_1/ideas.md)).
- **A platform launch is a position, not a burst.** In Claude Code's own launches, small-owner entrants won between day 40 and day 160, not in launch week ([launch-forms.md](history/research/earnstar_1/launch-forms.md)).
- **Language matters**: among small owners, repos with Chinese text converted from 10 to 1,000 stars about twice as often as English-only repos in the same period ([scenario-c.md](history/research/earnstar_1/scenario-c.md)).

The running list of lessons is in [playbook/lessons.md](playbook/lessons.md).

## Reusable research tools
Plain Node scripts that use the GitHub API through `gh`:

| Tool | What it answers |
|---|---|
| [`tools/crowding.mjs`](tools/crowding.mjs) | How many repos already pursue an idea, and how they did (with a sample of the 0–9-star tier) |
| [`tools/basecount.mjs`](tools/basecount.mjs) | Base rates: how many repos matching a search reach 10, 100, or 1,000 stars, counting the misses |
| [`tools/starhist.mjs`](tools/starhist.mjs) | A repo's star history: week 1, first 30 days, peak day, last 30 days |
| [`tools/wave.mjs`](tools/wave.mjs) | Snapshots of a platform wave over time, with the top gainers between snapshots |
| [`tools/declined.mjs`](tools/declined.mjs) | Fresh feature requests that maintainers declined: real needs, in users' own words |

## Audit trail
| What | Where |
|---|---|
| Current state and next steps | [STATE.md](STATE.md) |
| Session logs, ledger, metrics, decisions, reports | [history/](history/) |
| Methods, defaults, lessons learned | [playbook/](playbook/) |
| Tools: time and token accounting, GitHub metrics, machine profile, transcript archive, content check | [tools/](tools/) |

## License
[MIT](LICENSE)
