# Outbox

This queue holds the actions that need owner approval (Constitution §3B).
- The owner decides in chat by ID, e.g. `approve O-003` or `reject O-003`.
- **Status flow**: `pending` → `approved` / `rejected` → `done` or `expired`.
- **Executed by**: `developer` or `owner`.
- A promotion item links its package in `history/promo/<project>/<ID>-<venue>/` and gives the recommended posting time in Asia/Shanghai.
- When a promotion post or PR goes live, it is registered in `history/channels.json` and its `C-NNN` ID goes in the Result column. The owner's screenshots are recorded with `tools/evidence.mjs`.
- Each item's full draft appears below the table, under its ID.

| ID | Created | Type | Target | Summary | Status | Decided | Executed by | Result |
|---|---|---|---|---|---|---|---|---|
