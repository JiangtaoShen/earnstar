# Project starter (templates/project)

Copy these files into a new project repo at the start of P2 and replace every `{{…}}` placeholder. They cover the community and supply-chain items of Constitution §7 and the pre-launch checklist in `playbook/launch.md`:

| File | Purpose |
|---|---|
| `README.md` | Section skeleton with the AI disclosure; proof and the quick start at the top |
| `CONTRIBUTING.md`, `SECURITY.md` | Community files; private vulnerability reporting |
| `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md` | Issue and PR templates |
| `.github/dependabot.yml` | Version updates (keep the ecosystems the project uses) |
| `CHANGELOG.md` | Keep a Changelog, SemVer |
| `THIRD_PARTY_NOTICES.md` | License inventory, updated at every release |
| `LICENSE` | MIT (the program default) |
| `.gitattributes` | LF line endings (Constitution §5 kickoff) |

Not included, because they depend on the project: the CI workflow (`.github/workflows/ci.yml`), the demo script (`docs/demo.md` and the script that records real output), and the social preview image (1280×640). Do not copy this `TEMPLATE.md` file.
