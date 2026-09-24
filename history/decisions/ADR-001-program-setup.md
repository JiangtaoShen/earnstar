# ADR-001: Program setup

- **Date / session**: 2026-09-24 / S000
- **Status**: accepted
- **Approved by**: owner (in chat, S000)

## Context
The owner wants a serial program of GitHub projects, developed solely by Claude Code, that maximizes genuinely earned stars under an auditable process. The root repo must define the rules that every later session follows.

Baseline facts at setup:
- `JiangtaoShen` has 15 followers and 8 public repos with 0–2 stars each.
- `gh` is authenticated over HTTPS; there is no SSH key.
- Tools available: Node 24 and git 2.50. Python is not installed.

## Decisions
| # | Topic | Decision | Alternatives rejected |
|---|---|---|---|
| 1 | Timeline | Program of 12 months from project 1 kickoff; each project lasts 2–3 months; if < 2 months remain at a close, the Portfolio phase follows; this uses 4–6 repos (`earnstar_1`…`earnstar_6`). | 1–2 months per project (the owner's first proposal, revised by the owner) |
| 2 | Promotion | Only two social platforms: Hacker News and Reddit. The developer drafts, the owner posts. Awesome-list PRs go through the outbox and need approval. | Only passive discoverability (too little reach from a cold account); more platforms (too much owner load) |
| 3 | AI disclosure | Disclosed in every README and every reply the developer posts. | Disclosure only in the root repo; no disclosure |
| 4 | Repo authority | The developer may rename `earnstar_N` to the product name and change visibility from private to public. | Visibility only; neither |
| 5 | Layout | `D:\earnstar` is the root repo; projects go in `projects/earnstar_N/` (git-ignored); the empty `earnstar_0/` was removed. | Root repo inside `earnstar_0/` with an unversioned bootstrap file |
| 6 | Language | Repo content in English; reports to the owner in Chinese. | Chinese throughout |
| 7 | Budget | Zero spending unless the owner approves it through the outbox. | — |

The channel choice in #2 was the developer's, as the owner delegated it: HN and Reddit reach the global developer audience that English-language repos target, and they are the channels most often credited with star spikes. This is to be verified (H-001, H-002).

## Expected outcome
All later sessions follow a single protocol. The ledger and metrics make every hour, token, and star traceable.

Review: at the project 1 close, check whether any audit field was missing or had to be reconstructed.

## Result
Pending.

## Amendments
- **S001–S007**: later owner decisions (root never renamed, machine recording, the audit extension, research gate, workstation, environment reuse) are recorded in their session logs and in the Constitution.
- **S008, decision #6 (Language)**: tightened by the owner's order to have no Chinese anywhere in the repo, commit messages included. Chat with the owner stays Chinese; reports stored in the repo are English. Enforced by `tools/check.mjs`.
- **S008, decision #2 (Promotion)**: two constraints were found. HN forbids AI-generated or AI-edited text, so the owner writes all HN text (L-001). Reddit is unreachable from the developer's environment, so the owner checks rules and reports metrics (L-002). Whether to keep Reddit is put to the owner.
- **S009, decision #2**: the owner posts on both HN and Reddit; the developer prepares archived packages; the owner's screenshots serve as proof.
- **S012, decision #2**: DEV (dev.to) added as a third channel after the owner registered an account. It is the only channel the developer publishes to directly (API, per-article owner approval), so it adds no posting load for the owner. The owner's earlier limit of two social platforms was set to limit the owner's own load.
- **S008, erratum to the baseline facts**: "Python is not installed" was wrong. Python was not on PATH, but Anaconda and a python.org 3.13 install were present, found in S007.
