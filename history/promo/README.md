# Promotion packages

One folder per project (`<project key>/`, e.g. `earnstar_1/`) and, inside it, one folder per outbox item (e.g. `O-003-hn/`).
The workflow and the contents of each package are defined in [`playbook/launch.md`](../../playbook/launch.md#promotion-packages-owner-approved-workflow-s009).

| Package | Contains | Posted by |
|---|---|---|
| HN | `brief.md`: fact sheet and title directions; no ready-to-post prose, because HN forbids generated text (L-001) | Owner, in their own words |
| Reddit | `draft.md` and `images/`: title, body, and images for one subreddit, plus a rules checklist | Owner |
| DEV | `article.md`: full article with front matter and the AI disclosure (L-003) | Developer, through `tools/devto.mjs`, after the owner approves it in chat |

The owner's post screenshots are stored privately in `archive/promo/`. Their SHA-256 hashes are listed under each item in [`history/channels.json`](../channels.json).
