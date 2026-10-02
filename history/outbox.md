# Outbox

This queue holds the actions that need owner approval (Constitution §3B).
- The owner decides in chat by ID, e.g. `approve O-003` or `reject O-003`.
- **Status flow**: `pending` → `approved` / `rejected` → `done` or `expired`.
- **Executed by**: `developer` or `owner`.
- A DEV article item links its package in `history/promo/<project>/<ID>-devto/`. `tools/devto.mjs` publishes it only while the item's status is `approved`.
- When an article or PR goes live, it is registered in `history/channels.json` and its `C-NNN` ID goes in the Result column.
- Items without a package (e.g., an awesome-list PR) have their full draft below the table, under their ID.

| ID | Created | Type | Target | Summary | Status | Decided | Executed by | Result |
|---|---|---|---|---|---|---|---|---|
| O-001 | 2026-10-02 | DEV article | dev.to (owner's DEV account) | "Getting GitHub stars without an audience in 2026: the base rates": a data article from S016–S021 research (866 small-owner winners, 5,126 Show HNs, 424 V2EX launches); links the root repo; AI-authored and disclosed. Package: `history/promo/earnstar/O-001-devto/article.md`. Notes: a program-level article, outside the per-project cap of three; it also tests DEV readership before project 1 launches (H-004, H-007). If the owner wants a cleaner DEV username, change it before this first article (STATE, S014). The publishing tool's `--validate` run was blocked by the session's auto-mode classifier (it uses the owner's DEV connection), so validation runs only after approval | pending | | developer | |
