# Lessons

The program's evidence base. Entry fields: **ID**, date, statement, evidence (link), confidence (low / med / high), status (hypothesis / confirmed / refuted).
Selection (`research.md`) and launch (`launch.md`) decisions must consult this file.

## Facts
- **L-000** (2026-09-23): At program start, the owner account has 15 followers and 8 public repos, each with 0–2 stars. There is no existing audience, so reach must come from external channels. Evidence: S000 baseline. Confidence: high. Status: confirmed.

_S013: HN and Reddit were removed as program channels (owner decision). L-001 and L-002 are kept as reference facts, and H-001, H-002, H-004 (HN part), and H-006 are retired._

- **L-001** (2026-09-24): Hacker News forbids generated or AI-edited text, and Show HN excludes reading material such as lists; it requires something people can try, ideally without signup. So HN posts must be written by the owner, and curated-list projects cannot launch through Show HN. Evidence: news.ycombinator.com/newsguidelines.html and /showhn.html, fetched in S008. Confidence: high. Status: confirmed.
- **L-002** (2026-09-24): Reddit is unreachable from the developer's environment through every path tried: the unauthenticated API (HTTP 403, S003), the fetch tool, the built-in browser, and web search (S008). Reddit research, rule checks, and post metrics depend on the owner. Evidence: S003 and S008 logs. Confidence: high. Status: confirmed.

- **L-003** (2026-09-24): DEV allows AI-generated articles only with disclosure (the `#ABotWroteThis` tag or in the text). It forbids bot or AI comments on any post, and articles whose main purpose is brand-building or clout. DEV is the only program channel the developer can publish to directly (via the API, with per-article owner approval). Evidence: dev.to/guidelines-for-ai-assisted-articles-on-dev, fetched in S012. Confidence: high. Status: confirmed.

## Hypotheses (priors to test)
- **H-001** (retired, S013): A Show HN that reaches the front page yields more stars than any other single action.
- **H-002** (retired, S013): Posting on HN and Reddit within the same 48 h raises the chance of reaching GitHub Trending.
- **H-003**: A demo GIF above the fold raises the visitor-to-star conversion.
- **H-004**: Disclosing AI authorship costs goodwill with some readers but earns curiosity with others; the net effect is unknown. On DEV it can be tested by comparing reactions per view.
- **H-005**: Curated-resource repos earn more stars per work-hour than tools. This must now be weighed against L-001.
- **H-006** (retired, S013): Posting on Tuesday–Thursday at 08:00–10:00 US Eastern maximizes early votes. This is a widely repeated heuristic with no source verified.
- **H-007**: A technical DEV article about how a project was built drives more long-tail stars (through tags and search) than a social post from a new account.
