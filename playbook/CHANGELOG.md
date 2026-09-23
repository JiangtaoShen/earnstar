# Playbook, templates, and tools changelog

Newest first. Each entry gives the date, session, change, reason, and evidence.

- **2026-09-24 · S000**: Added `.gitattributes` (LF everywhere) and made both tools accept CRLF input. Reason: `core.autocrlf=true` on this machine would otherwise put `\r` into CSV fields after a fresh clone. Evidence: git's CRLF warnings on the initial commit.
- **2026-09-24 · S000**: Initial versions of `defaults.md`, `research.md`, `launch.md`, `lessons.md`, the templates, and `tools/usage.mjs` and `tools/metrics.mjs`. Reason: program setup. Evidence: ADR-001.
