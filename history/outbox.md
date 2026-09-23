# Outbox

This queue holds the actions that need owner approval (Constitution §3B).
- The owner decides in chat by ID, e.g. `approve O-003` or `reject O-003`.
- Status flow: `pending` → `approved` / `rejected` → `done` (with the result URL) or `expired`.
- Each item's full draft appears below the table, under its ID.

| ID | Created | Type | Target | Summary | Status | Result |
|---|---|---|---|---|---|---|
