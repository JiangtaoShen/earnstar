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
