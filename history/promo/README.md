# Promotion packages

DEV (dev.to) is the program's only social channel (Constitution §3B, S013).

The packages are organized in two levels:
- one folder per project (`<project key>/`, e.g. `earnstar_1/`);
- inside it, one folder per outbox item (e.g. `O-003-devto/`).

Each package holds `article.md`, which is the full article with its DEV front matter and the AI disclosure (L-003), plus optional `images/`. The developer publishes it with `tools/devto.mjs`, only after the owner approves the item in chat.

The workflow is defined in [`playbook/launch.md`](../../playbook/launch.md#dev-article-packages). Published articles are registered in [`history/channels.json`](../channels.json).
