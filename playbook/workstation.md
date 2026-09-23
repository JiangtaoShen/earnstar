# Workstation

How the developer uses the owner's computer under Constitution §3A. The owner's environments also serve the owner's own work: reuse them to save storage, and never break them.

## 1. Python environments: reuse first
1. **Inventory**: in any session that needs Python, run `node tools/envs.mjs`. It probes every conda env and standalone Python and writes the private file `lab/envs.json` (env names can reveal the owner's private work).
2. **Reuse as is**: if an existing environment already has what the task needs, run it unchanged, via `<env>\python.exe` or `conda run -p <env> …`. The conda root is `~\anaconda3`, and conda is not on PATH.
3. **Additive install into an owner environment**:
   - Allowed only if a dry run (`conda install --dry-run …` or `pip install --dry-run …`) shows that no existing package would be upgraded, downgraded, or removed.
   - Record the added packages in the session log.
4. **New environment**, only when steps 2–3 cannot work (for example: a version conflict, a clean-install test of a package about to be released, or strict reproducibility):
   - Name it `earnstar-<purpose>`.
   - Prefer, in this order: `conda create --clone` of the closest environment (hardlinked on the same drive, so it stays small), then a project-local `uv venv` on D: (uv hardlinks from its cache).
   - Record the reason, the size, and the drive in the session log.
5. **Never** delete, rename, downgrade, or reconfigure the owner's environments, conda configuration, or channels. Never run global cache cleaning (`conda clean`, `pip cache purge`).
6. **Clean up**: remove `earnstar-*` environments when they are no longer needed, and record it.
7. **Public records** refer to owner environments by spec only, e.g. "owner conda env, py3.10, torch 2.5.1+cu121". The ledger records only the environment count and the `earnstar-*` names.

## 2. Hardware notes (`m-be80e7832908`, formerly `m-6da16b4278d0`)
- **GPU**: GTX 1660 Ti with 6 GB VRAM (Turing TU116; no tensor cores), driver 576.88, CUDA 12.9. Owner environments already include torch 2.4–2.5 builds for CUDA 12.1, which is compatible. Size experiments to fit 6 GB of VRAM.
- **CPU and RAM**: i5-13490F (10 cores, 16 threads) and 16 GB RAM. Leave headroom so the machine stays responsive.
- **Drives**: conda environments and caches live on C:; work files live on D:. Keep both above the free-space floor in `defaults.md`. E: belongs to the owner and is not used.

## 3. Hygiene
- Before closing a session, stop every process it started (servers, watchers, training runs) and confirm that GPU memory is released.
- Large downloads, datasets, and models go under `lab/` or the project folder. Prune them when no longer needed.

## 4. Tooling pitfalls
- **Unicode escapes**: the developer's file-writing and command tools turn backslash-u escape sequences into the literal characters, even inside regexes and strings. In source code, build non-ASCII characters from code points (`String.fromCharCode(0xfeff)`, numeric ranges) and never rely on backslash-u escapes. Found in S008.
- **Line endings**: the repo enforces LF (`.gitattributes`), and the tools accept CRLF input.
- **Localized output**: Windows tools print localized text (e.g., the WMI OS caption). Prefer language-independent sources, such as registry values and numeric codes.
