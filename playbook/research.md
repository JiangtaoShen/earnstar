# Understanding people and choosing a project (P0–P1)

**Principle (owner directive, S023)**: think from the point of view of real people. The question is not "what earns stars" but "what do these people actually need, and can we serve it better than what they use today?" No promotion is used (Constitution §1), so a project succeeds only if people who have the problem can find it, try it, and keep using it, and if it keeps getting better from what they do and say.

**Goal of P0–P1**: one real, recurring need of a group of people the developer can understand and serve well, with evidence in their own words, and a first version small enough to release early and improve in short cycles.

P2 may not start until the **Selection Gate** (§6) passes (Constitution §5).

## 1. Stages
1. **Choose people, not ideas.** Pick a group whose work the developer can understand and test on this machine (e.g., developers on Windows, maintainers of small open-source projects, users of a given tool). Write down who they are and what they are trying to get done.
2. **Collect needs in their own words.** Read where these people describe problems and workarounds: issues and discussions of the tools they use, Q&A sites, forums, mailing lists, changelogs, and their own blog posts. Record each need as a quote with a link, the situation it arises in, how often it seems to happen, and what the person does today instead. Prefer needs where people already spend effort on workarounds (scripts, manual steps, long threads) over needs inferred from 👍 counts alone (L-029).
3. **Understand the job.** For the strongest needs, reconstruct the task step by step as the user experiences it. Where possible, do the task yourself on this machine with the tools people use today, and note exactly where it hurts.
4. **Try the existing solutions.** For each strong need, find what exists (search in the users' own words and languages, `tools/crowding.mjs`, the feature lists of the largest adjacent tools) and actually use the best ones. Record why they fail these users, or confirm that they already serve them well (then the need is met; drop it). A niche full of recent attempts that nobody uses is a warning that the need may be weaker than it looks; find out why they failed before going further.
5. **Prototype on real tasks.** Build a throwaway prototype of the core of the solution (budget in `defaults.md`) and try it on realistic tasks taken from the users' own descriptions. The question is whether it would have helped the person who wrote the issue. Test fixtures must look like the users' own files (ordinary names, no hints such as `gbk_crlf.c` or an `orig/` folder), and when AI agents are involved, test with the models and tool settings users actually run, not only the newest model (L-032). Count behavioural evidence (scripts, workflows, forks) in independent people or projects, not in search hits, and check whether the workarounds already work for those who have them (L-031).
6. **Landscape audit before the ADR.** Before drafting, an independent subagent audits the leading candidate's landscape with fresh searches in every language its users write in (including Japanese and Korean where relevant), by outcome words, across GitHub (open the 0–10-star tier), the package registries and plugin directories, and the current changelogs and open PRs of the tools involved. The developer verifies every negative claim the decision would rest on ("no fix merged", "nothing exists for X", "nobody does Y") and reads the main issue threads to the end (L-034).
7. **Decide.** Write the selection ADR: the people, the need with its evidence, why existing tools fail, the smallest first version, how the project will learn from use after release without promotion (issues, discussions, downloads, the developer's own daily use), and the first three iterations it expects.
8. **Independent critique.** A subagent with no stake reviews the ADR from the user's point of view: is the need real, is it unmet, would these people actually use this? It runs fresh searches (it must not rely only on the developer's files, L-029). Record every objection and its response.
9. **Confirm** the decision in a later session, with fresh context.

## 2. Sources
- **Issues and discussions** of the tools the users rely on, sorted by reactions and by recency; long threads where people share workarounds are the strongest evidence.
- **Q&A and forums** (Stack Overflow, GitHub Discussions, project forums), read-only.
- **Changelogs and docs** of the tools involved, to check what is already native (L-026).
- **The users' own artifacts**: scripts, gists, and small repos people wrote for themselves are evidence of a need and a source of requirements.
- **Program data**: `history/metrics/`, `lessons.md`, and the developer's own experience using tools on this machine.
- Helper tools: `tools/crowding.mjs` (who already pursues a need), `tools/declined.mjs` (requests maintainers declined), `tools/starhist.mjs` and `tools/basecount.mjs` (context only; they describe outcomes, they do not choose projects).

## 3. Evaluation (1–5 per criterion, weighted)
| Criterion | Weight | A score of 5 means |
|---|---|---|
| The need is real | 30 % | Several independent people describe it in their own words, with workarounds or repeated effort |
| It is unmet | 20 % | The existing solutions were tried, and they clearly fail these users |
| We can serve it well | 20 % | The developer can build a first version that solves the core need on this machine, and test it fully on realistic tasks |
| People can find and try it | 15 % | Users with the need search with words that lead to the project, inside an app's own registry where new entries get real use (L-035); trying it takes a minute. Score 2 when the people look for fixes mainly in a vendor's issue thread (L-034), and at most 3 for plain GitHub, PyPI, or npm |
| It can keep improving | 15 % | Clear next iterations, signals to learn from after release, low maintenance, no hosted cost |

Treat differences smaller than one point on one criterion as noise. When candidates tie, prefer the one whose users the developer understands best and whose need the developer meets in its own work, because daily use is the most reliable feedback without promotion.

## 4. Knock-outs (any one rejects the idea)
- The need is not real (no independent people describing it) or is already met well by an existing tool or a native feature of the current release.
- It needs money, hosted services, or accounts beyond GitHub.
- It carries legal, ToS, or trademark risk.
- The developer cannot test it on realistic tasks.
- Its value depends on promotion rather than on people looking for a solution.

## 5. Outputs
- **`history/research/earnstar_N/`**: `people.md` (who and what they are trying to get done), `needs.md` (needs in users' own words with links), one file per candidate (the job, existing solutions tried, prototype results), and `critique.md`.
- **`history/decisions/ADR-NNN-project-N-selection.md`**: the people and the need; the evidence; why existing tools fail; the first version; how the project will learn after release; the first three iterations; the evaluation; the critique outcome.

## 6. Selection Gate (every item must pass before P2)
- [ ] The people and the need are described, with quotes and links from at least five independent people.
- [ ] The existing solutions were found (in the users' own words and languages) and the best ones actually tried; why they fail is recorded. An independent landscape audit ran before the ADR, and every negative claim the decision rests on was verified by the developer (§1.6, L-034).
- [ ] A prototype was tried on realistic tasks from the users' own descriptions.
- [ ] The first version, the learning plan after release, and the first three iterations are written down.
- [ ] The independent critique is recorded and every objection is answered.
- [ ] The decision was confirmed in a later session.

## 7. Iteration (P2–P4)
- **Release early**: the first version solves the core need well and is released by the deadline in `defaults.md`.
- **Cycle**: each cycle starts from evidence (new issues and questions, what users ask that the docs do not answer, usage signals, the developer's own use on real tasks), picks the most valuable improvement, ships it with a changelog entry, and records what was learned.
- **Answer every user**: issues and discussions in the project repo get a first response within the next session (§3D disclosure applies).
- **Review**: at each iteration review (`defaults.md`), compare what users actually do with what the ADR assumed; change direction only with an ADR.
- **Accumulate experience**: lessons that generalize go to `lessons.md`; the playbook changes when experience shows a better way.

## 8. Naming
- Short, memorable, and in the words users search with.
- Free on GitHub and on the target package registry.
- No trademark conflicts. Never use "Claude", "Claude Code", or "Anthropic" in a project's name or logo; plain-text references in the description are fine (L-013).
- Rename `earnstar_N` at the start of P2 (Constitution §3A). The local folder name stays unchanged. After renaming, update `name` in `repos.json` and the clone's remote (`git remote set-url origin https://github.com/JiangtaoShen/<new name>.git`).
