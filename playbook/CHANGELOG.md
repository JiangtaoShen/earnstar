# Playbook, templates, and tools changelog

Newest first. Each entry gives the date, session, change, reason, and evidence.

- **2026-09-24 · S003**: Owner-approved audit extension (7 items).
  - `tools/archive.mjs`: transcript archive, with append-only prefix-hash verification.
  - `tools/usage.mjs`: agent configuration, work composition (tools, subagents, compactions, research trail), git activity with human-commit detection, the rules version, and evidence hashes; gap entries now also trigger on commits.
  - `tools/metrics.mjs`: channels (HN via the Firebase API, Reddit JSON, GitHub PRs), community and first-response time, release downloads, npm/PyPI downloads, security settings; tolerates a BOM.
  - Templates: owner involvement, external actions, human contribution, compliance.
  - Outbox: added Decided and Executed-by columns; added `history/channels.json`.
  - `launch.md`: supply-chain checklist items, channel registration, the Reddit fallback.
  - Reason: close the evidence gaps found in the S003 review (transcripts were deleted after 30 days; AI and human contributions could not be told apart; channel attribution was missing). Evidence: S003 tests, recorded in its log.

- **2026-09-24 · S002**: Added `tools/machine.mjs` (hardware profile + machine ID; software versions per session), recorded it in ledger entries, and added a Machine row to the session template. Reason: the owner requires every session to record its machine, because some projects are hardware-dependent. Evidence: S002.

- **2026-09-24 · S001**: Added the session kind `admin` (owner messages outside `start work` that change repo content) to the session template and `tools/usage.mjs`. Reason: keep every change traceable to a logged session. Evidence: S001.

- **2026-09-24 · S000**: Added `.gitattributes` (LF everywhere) and made both tools accept CRLF input. Reason: `core.autocrlf=true` on this machine would otherwise put `\r` into CSV fields after a fresh clone. Evidence: git's CRLF warnings on the initial commit.
- **2026-09-24 · S000**: Initial versions of `defaults.md`, `research.md`, `launch.md`, `lessons.md`, the templates, and `tools/usage.mjs` and `tools/metrics.mjs`. Reason: program setup. Evidence: ADR-001.
