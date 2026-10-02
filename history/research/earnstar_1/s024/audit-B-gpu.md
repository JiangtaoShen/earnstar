<!-- Copied from the private working file lab/s024/audit-b/audit-B.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# Audit B: "PyTorch can't use my GPU after an install or update; which build works on my card?"

Independent landscape audit, 2026-10-03 (Asia/Shanghai). Read-only: `gh api`, PyPI JSON, pypistats, HN Algolia, VS Code Marketplace and npm search APIs, web search and fetch. Nothing was installed, and no Python environment was modified. One read-only check ran pip's vendored `packaging` in the system Python 3.13. Scratch files are in this folder: `rd/` holds competitor READMEs, `ed_*` env-doctor source, `csc.py` cuda-stack-check, `cd_*` Comfy-Desktop, `uv_*` uv-torch, `pt_cuda_init.py` PyTorch, and `s1.txt`/`s2.txt` the repo searches.

**Bottom line first:** the broad need is now largely met where the users actually are, and the remaining gap is narrow, hard to find, and mostly cannot be tested on this machine. Do not select B. Details follow.

---

## 1. Existing tools and native features

Meaning of the verdict column: **M** = meets the need, **P** = partly meets it, **F** = fails it. Stars and downloads are as of 2026-10-03. Download figures are pypistats monthly totals without mirrors.

### 1a. Native / upstream

| Name | Link | Adoption | Last update | What it does | Verdict and evidence |
|---|---|---|---|---|---|
| PyTorch ≥ 2.13 unsupported-GPU warning (`_warn_unsupported_code`) | pytorch/pytorch `torch/cuda/__init__.py` | Every torch ≥ 2.13.0 (2026-07-08); 2.14.1 shipped 2026-09-30 | main 2026-06 (#186285) | On CUDA init, it names the GPU's compute capability (CC) and the CCs the wheel supports. It then prints "Your installed torch==X does not include kernels for this GPU. Reinstall the same version against a CUDA build that does, e.g.: For CUDA 12.6 use pip install torch==X --index-url …/cu126". | **P.** This is a native fix for the main N1 case. Present in tags v2.13.0 and v2.14.0, absent in v2.12.0 (checked by tag). Gaps: (1) **The printed command is probably a no-op.** Under PEP 440, `==2.14.1` matches the installed `2.14.1+cu130` (verified with pip's `packaging`: `True`), so pip reports "already satisfied". Even with `-U`, `2.14.1+cu126` does not sort above `+cu130` (`False`), so a `--force-reinstall` or explicit `+cu126` pin is needed. Not yet run in a venv. (2) The command omits torchvision and torchaudio. torchvision raises "compiled with different CUDA major versions" on a 12 vs 13 mismatch (`torchvision/extension.py`). (3) Users misread it: "it tells me I need to change the PyTorch version to v12.6" (StabilityMatrix#1648, 2026-05). (4) On 2.15, Pascal users will get "No published PyTorch CUDA builds for release … support this GPU", with no command. (5) It does not cover CPU-only wheels or the wrong-env case. |
| PyTorch `_check_cubins` "sm_XX is not compatible with the current PyTorch installation" | same file | native | — | The older message, still present. It lists the arch list and points to pytorch.org. | **F** as a fix (no command). |
| PyTorch driver-too-old error | `c10/cuda/CUDAFunctions.cpp` | native | — | "The NVIDIA driver on your system is too old (found version …). Please update your GPU driver … Alternatively, go to: https://pytorch.org…" | **P.** It names the cause and the driver fix, but gives no command and no alternative wheel. |
| "Torch not compiled with CUDA enabled" | native | — | — | AssertionError on a CPU-only build. | **F** (no cause or command). |
| pytorch.org Get Started | https://pytorch.org/get-started/locally/ | canonical | 2026-07-27 | Picker by OS, package, and CUDA. | **F** for arch. The decoded page text has no compute-capability or "legacy/older GPU" guidance. |
| RFC #190385 (CUDA matrix for 2.15) | https://github.com/pytorch/pytorch/issues/190385 | open, updated 2026-09-23 | — | Removes cu126 (and, as of 2026-09-23, also cu130) in 2.15. **2.14.x is the last release for Maxwell, Pascal, and Volta.** | Makes the need worse for pre-Turing users from about late Oct to Nov 2026, at the 8-week cadence: 2.12 → 2.13 → 2.14 were 8 weeks apart. |
| Official wheel matrix (Windows) | download.pytorch.org | — | 2026-09-30 | cu126 has 2.14.1 (arch list 5.0;6.0;6.1;7.0;7.5;8.0;8.6;9.0 per `.ci/pytorch/windows/build_env_setup.py` @v2.14.1). cu128 stops at 2.11.0, cu129 at 2.9.0. cu130 and cu132 have 2.14.1 (7.5–12.0). | Fact base. Any table pinned to cu128 is now stale. |
| PyPI torch (Windows) | pypi.org/project/torch | — | 2.14.1 | `torch-2.14.1-cp313-win_amd64.whl` is 124 MB, a **CPU-only** build. The Linux wheel is CUDA 13 (555 MB plus `cuda-toolkit==13.0.3`). | This is why N2 (a CPU swap on Windows) keeps happening. |
| uv `--torch-backend=auto` | https://docs.astral.sh/uv/guides/integration/pytorch/ | uv is huge | uv 0.12.22 (2026-10-01) | Picks a cu index from the **driver version only**: `Accelerator::Cuda { driver_version }` in `crates/uv-torch/src/accelerator.rs`. "Only available in the `uv pip` interface." | **F** for pre-Turing GPUs with driver ≥ 580 (it gives cu130). uv#14742 is open with no activity since 2025-07-23. |
| Wheel variants (PEP 817 / 825 / provider PEP) + uv preview | python/peps; astral-sh/uv#22043 | — | 2026-09-30 | PEP 817 is still Draft, and PR #5149 is switching it to Informational. PEP 825 (format) is **Provisional**. The provider PEP is unnumbered (#5133). uv's implementation tracker opened 2026-09-28 with **0 items done**. | Not a near-term fix. Arch-aware installs through variants are 2027 or later. |
| conda-forge pytorch (CUDA 12.x builds) | conda-forge/pytorch-cpu-feedstock | — | 2.13.0 | `TORCH_CUDA_ARCH_LIST=5.0;6.0;7.0;7.5;…;12.0+PTX` for CUDA 12 builds. | **P.** A Pascal-friendly route for conda users only. |
| nvidia-smi | NVIDIA | native | driver 616 | `--query-gpu=compute_cap` gives the CC. Driver 616 changed the header to "CUDA UMD Version: 13.4", which breaks parsers that match "CUDA Version:" (Soup#827, 2026-09-11). | Gives facts, not a verdict. This also adds to the maintenance cost of any doctor tool. |

### 1b. Apps and launchers (where the affected users actually are)

| Name | Link | Stars | Last update | What it does | Verdict and evidence |
|---|---|---|---|---|---|
| ComfyUI portable, cu126 build | https://github.com/Comfy-Org/ComfyUI (README l.176; release assets) | ComfyUI is huge | v0.38.0, 2026-09-29 | Ships `ComfyUI_windows_portable_nvidia_cu126.7z`: "Supports Nvidia 10 series and older GPUs". Its update .bat uses `--upgrade … --extra-index-url …/cu126`. | **M** for portable users who choose the right download. *Predicted risk, unverified:* once 2.15 is on PyPI (Windows CPU-only), that `--upgrade` with `--extra-index-url` will pick 2.15.0 CPU over 2.14.1+cu126. An open README PR (#16438, 2026-09-20) adds "no kernel image" guidance. |
| Comfy-Desktop (successor of Comfy-Org/desktop, 2.3k stars, archived 2026-06) | https://github.com/Comfy-Org/Comfy-Desktop | 526 | 2026-10-02 | A PyTorch stack picker with per-stack `computeCap` ranges and min-driver warnings, a curated cu126 "legacy" stack for Maxwell, Pascal, and Volta, and **automatic repair of a CPU-swapped torch** (`torchRepair.ts`: `getTorchVendorMismatch`, `maybeRepairTorch`). It also classifies "no kernel image" errors (`errorEvent.ts`). | **M** for Desktop users: N1 warnings and N2 repair are both built in. Adopted (non-managed) installs are excluded. |
| StabilityMatrix | https://github.com/LykosAI/StabilityMatrix | 8,862 | 2026-10-01 | `GpuInfo.IsLegacyNvidiaGpu()` (CC < 7.5) falls back to an older CUDA index for 7+ packages. There is a ComfyUI driver check on launch and a per-package "PyTorch Index" switch. | **M (mostly).** Misses remained in 2026: #1607 (reForge, GTX 1060, closed stale) and #1648 (Forge Neo, fixed by a maintainer in 1 day). |
| InvokeAI launcher | invoke-ai/launcher | — | 2026-09-06 | "GPU auto-detection + custom torch index override" (#137), after InvokeAI#9532 (GTX 1060, 2026-08-23). | **M/P** for Invoke users. |
| Pinokio | pinokiocomputer/pinokiod `kernel/gpu/nvidia.js` | 8,194 (app) | 2026-09-02 | Exposes the GPU's `sm_XX` target to app scripts. | **P.** It depends on each script. |
| ComfyUI-Manager | Comfy-Org/ComfyUI-Manager | large | current | `pip_auto_fix`, blacklist, and downgrade blacklist (see G3). | **P** (ComfyUI only, not arch-aware). |
| Easy Diffusion + torchruntime | easydiffusion | — | 2026-10-01 | Installs a GPU-appropriate torch for its users. | **M** for its users (see torchruntime below). |
| App-embedded "doctor" commands | e.g. Soup (8,030 stars) `soup doctor` | — | 2026-10 | Apps add their own env checks. | Shows the pattern: apps absorb this need themselves. |

### 1c. Standalone tools

| Name | Link | Stars / downloads | Last update | What it does | Verdict and evidence |
|---|---|---|---|---|---|
| **env-doctor** | https://github.com/mitulgarg/env-doctor ; PyPI `env-doctor` | **172 stars**, 10 forks. Downloads: 449 (Apr), 1,042 (May), 585 (Jun), 248 (Jul), 238 (Aug), **113 (Sep)** | v0.3.5, 2026-10-01 (21 releases) | `env-doctor check`: driver → toolkit → cuDNN → torch. A **compute capability check** (reads `torch.cuda.get_arch_list()` against the GPU's CC) and a driver vs wheel CUDA conflict check. `env-doctor install torch` prints an `--index-url` command. Also an MCP server, a fleet dashboard, and vLLM/SGLang resolvers. | **P. This is the near-identical incumbent the G3 report missed.** Code-read gaps: (1) for an arch mismatch the fix is always `pip install --pre torch … --index-url …/nightly/<same cu>` (`cli.py` l.186–197). That is wrong for old GPUs, because nightly cu13x has no sm_61. (2) `install torch` maps **driver → command only** (`get_install_command(pkg, max_cuda)`), and the table tops out at torch 2.9.1, so a Pascal box with a CUDA 12.9 driver gets `torch==2.8.0 … cu129`, which has no sm_61. (3) CPU-only torch: `cuda_version` is None, which leads to `"CPU" in None` in `check_library_compatibility`. Likely a TypeError; not run. (4) Current interpreter only. The README's `uvx env-doctor check` runs in an isolated env where `import torch` finds nothing. (5) Almost all issues are the author's own (#93–#144). The audience is MLOps/CI. |
| torchruntime | https://github.com/easydiffusion/torchruntime | 15 stars. Downloads 23,277 (Apr), 23,538 (May), then 11,335 (Aug), 5,687 (Sep) | 2.22.0, 2026-10-01 | `python -m torchruntime install` picks a build from the PCI database GPU model; `torchruntime test`. | **P** (install half only). CC < 7.5 → cu124, i.e. torch ≤ 2.6 when 2.14.1+cu126 exists. CC ≥ 7.5 → cu128, i.e. ≤ 2.11.0 (`platform_detection.py` l.159–174). It cannot explain an existing env or scan several envs. "Meant for app developers." |
| light-the-torch | https://github.com/Slicer/light-the-torch | 257 stars; 3,006/mo | 2026-06-29 | Driver-based backend detection. | **F** (same gap as uv). |
| rigsolve | https://github.com/satwiksps/rigsolve ; PyPI | 10 stars; 66/mo | 2026-10-01 | `rigsolve doctor`, `check --fix`, and `why`. A sourced compatibility matrix that reads metadata without importing torch. | **P.** It has the right idea, but "the current bundled data focuses on **Linux x86_64**". |
| cuda-stack-check | https://github.com/paolo-perrone/cuda-stack-check | 1 star; not on PyPI | 2026-09-23 | "Names the one layer breaking your PyTorch CUDA stack, and the exact command to fix it." It covers CPU-only wheels, driver below the wheel's CUDA, and a GPU newer than every kernel. It uses `--force-reinstall`. | **P.** The candidate's own pitch, but it **skips GPUs older than the newest compiled sm** (`if … sm_num(sm) <= sm_num(newest): continue`), so a GTX 1070 on cu130 is reported "coherent". Single env. Written for a Substack. |
| mldoctor (Shaswat2001) | https://github.com/Shaswat2001/mldoctor | 1 star; not on PyPI (name taken) | 2026-05-18 | One-shot report with **"Shadow Installs"** (torch in other conda, pyenv, venv, and system Pythons), CPU-only torch with a fix command, and nvcc vs driver. | **P.** It covers N3 and N2. No arch check; Linux paths. |
| ai-infradr | https://github.com/xxPcy/ai-infradr ; PyPI | 1 star | 2026-09-27 | CPU-only wheel, driver vs runtime, and NCCL, with evidence. | **P** (no arch check; Linux). |
| NVCheckup | https://github.com/thatcooperguy/NVCheckup | 0 stars | 2026-09-10 | Go binary for Windows and Linux. The "ai" mode detects a CPU-only wheel and a wheel newer than the driver, and lists "wrong Python environment" in its FAQ. | **P** (arch only for DGX Spark sm_121). |
| Small doctors, all ≤ 5 stars | Dheena731/Ml-env-doctor (5, `mlenvdoctor`), vipulsparmar/CudaAid (0), Adr1an04/cuda-doctor (0, Blackwell focus), karthikrshet/NVIDIA-Agent-Doctor (3), musikamoka/gpu-stack-doctor- (0, ja/zh/en, RTX 50 + WSL2), jahnclawdmonet/blackwell-doctor (0), 2876716663-max/win-ai-doctor (1, PowerShell, PATH Python only), RudrakshRakeshZodage/hwpilot (0; 60/mo), ChharithOeun/gpu-doctor (1; 11/mo), Sraman01-code/aiflow-runtime (0; Linux/macOS), CBailey589/gaff (1), darren-danaher/torch-check (0), maido-39/pytorch-env-checker (0), Xza85hrf/ML-Framework_Checker (1), hassankx/gpu-platform-readiness (0) | — | 2025-08 to 2026-10 | Generic GPU/CUDA/torch checks. | **F/P.** Crowded, unadopted (L-029 pattern, about 15 new attempts in 12 months). |
| easywheels | https://github.com/davidkny22/easywheels-cli | 1 star | 2026-07-31 | Was a GPU-aware wheel installer. | **Shut down:** "uv's team started building this into the package manager itself". |
| Web pickers | DanielHou315/torch-compat (0 stars, updated 2026-10-01, picks by CC), racinmat/pytorch-compatibility (1, 2026-09-19), elenacliu/pytorch_cuda_driver_compatibilities (37, 2024), gpuvec.com, Qualiteg table (ja, "updated June 2026") | — | — | Manual lookup. | **P** (the user must know their CC, the env, and the right command). |
| ComfyUI nodes | rookiestar28/ComfyUI-Doctor (76, runtime errors, not arch), Kurdknight_comfycheck (7, system info), SchwenderOne/ComfyUI-EnvProbe (0) | — | 2026 | In-app diagnostics. | **F/P.** |
| VS Code / npm | Denpex diagnostics (38 installs), pypilot (92), vscode-tf-cuda-tools (460); npm: nothing | — | — | — | **F** (negligible). |
| Env scanners | LakshmiN5/check-package-version (2 stars) | — | 2026-03 | Versions across envs. | **F** (no GPU verdict). |

---

## 2. Native-fix status (summary)

- **PyTorch now diagnoses the main case itself (since 2.13, 2026-07-08).** It names the CC mismatch and prints a cu126 command. The command as printed is probably ineffective: a same-version reinstall is a no-op unless forced, and torchvision and torchaudio are left mismatched. Users also misread the CUDA version as a PyTorch version. A one-line upstream PR (add `--force-reinstall` and the companion packages) would close most of the "correct command" gap.
- **2.15 (expected about late Oct to Nov 2026) drops cu126**, and with it Maxwell, Pascal, and Volta (RFC #190385, open). After that the correct answer for those cards is fixed and simple: torch 2.14.x+cu126 plus the matching torchvision/torchaudio, pinned. PyTorch's warning will then print no command.
- **uv auto**: driver-only, unchanged; #14742 is dormant. **Wheel variants**: PEP 825 is provisional, the provider PEP is unnumbered, and uv's work started 2026-09-28. Not soon.
- **Launchers have absorbed the need**: ComfyUI cu126 portable, Comfy-Desktop (CC-aware picker plus CPU-swap auto-repair), StabilityMatrix (legacy GPU → older index), InvokeAI launcher (GPU auto-detection, 2026-09), and Pinokio (sm target exposed).

## 3. The G3 negative claims, checked

| Claim (G3 report / needs §B) | Result | Evidence |
|---|---|---|
| "No adopted tool diagnoses an existing broken env" | **Refuted as stated; true only in a narrow form.** | env-doctor (172 stars, PyPI, active) diagnoses the current env, including the CC mismatch, and prints a command. Comfy-Desktop auto-repairs CPU swaps and warns on CC. StabilityMatrix detects legacy GPUs. PyTorch ≥ 2.13 itself prints cause and command. What remains true: no tool gives a *correct* one-command fix for **pre-Turing** cards across *several envs*. env-doctor sends them to nightly, PyTorch's command is likely a no-op, and cuda-stack-check ignores too-old GPUs. G3's searches missed env-doctor and about 10 of the small doctors (an L-029 and L-034 repeat). |
| "torchruntime is barely discoverable" | **Verified, with nuance.** | 15 stars. Its downloads track embedding in Easy Diffusion and are falling (23.5k in May → 5.7k in Sep). It never appears for error-string searches. Its tables are also stale (Pascal → cu124 / torch ≤ 2.6; RTX → cu128 / ≤ 2.11). |
| "uv auto reads only the driver" | **Verified.** | `accelerator.rs` on main (uv 0.12.22, 2026-10-01): `Cuda { driver_version }` only. The docs say "only available in the `uv pip` interface". |
| "PyTorch's own warning … gives no command" (G3 table) | **Outdated.** | Since 2.13 it prints a pip command (see §2). |
| "PEP 817 still Draft" | Correct but incomplete. | It is being reworked to Informational. PEP 825 is Provisional. uv's variant preview started 2026-09-28. |
| "8 conda envs with torch 2.4–2.5+cu121" (testability) | **Wrong.** | 8 envs exist, but only 3 have torch: conda-channel `pytorch` 2.4.1/2.5.1 builds with CUDA 12.1 (`conda-meta`), not pip `+cu121` wheels. Separately, system Python 3.13 has **torch 2.11.0+cpu** (`version.py: cuda = None`), a live CPU-only case. |

## 4. Findability without promotion

- **Exact error strings rank app threads, forums, and blogs, never tools.** Searches run:
  - "no kernel image … GTX 1070 ComfyUI": ComfyUI #9705, #10989, #7677, #10468, #5616, the README PR #16438, and NVIDIA forums.
  - "sm_61 is not compatible…": pytorch#53164, ComfyUI#7127, the PyTorch forum, Scriberr#273, pytorch#160575, uv#14742, StabilityMatrix#1607.
  - "Torch not compiled with CUDA enabled fix 2026": SEO blogs (runaihome, insighthubdaily, beaithink), wonderfullauncher docs, NVIDIA forum.
  - Chinese: CSDN posts dominate, with stale advice (one summary recommends "PyTorch 1.13 + CUDA 11.6" for 10/20-series).
  - Japanese: PyTorch forum, a gist, raqmedia (2026-05).
  - env-doctor appears only when searched by name. No HN launch was found for env-doctor or torchruntime.
- **Where sufferers go: the app's own issue tracker,** and maintainers answer within about a day with app-specific fixes. 2026 examples: InvokeAI#9532 → launcher #137; StabilityMatrix#1648 (fixed in 1 day); WhisperJAV#411; FreeToken#14 (a user's `uv pip install -U torch --index-url …/cu126` then broke the app's compiled extension); vyact#3 (CPU fallback added); MinusPod#624 ("mostly cosmetic"). This is the L-034 pattern: a standalone tool is found there only if its author comments in those threads, which §1/§3B forbid. **Score "people can find it" 2.**
- **Usage of existing tools:** even the 172-star incumbent has about 100–250 PyPI downloads a month (113 in Sep). The 0–1-star tools have none visible. Star origins cannot be attributed: GitHub's stargazer list API now returns 404 (REST) or an empty list (GraphQL) for repos we do not own.
- **Trend** (GitHub issues by quarter, 25Q2 → 26Q3 to 10-03; control "CUDA out of memory": 998, 816, 863, 903, 1169, 1951):
  - "no kernel image is available": 287, 252, 222, 224, 252, 405. The ratio to the control falls from 0.29 to 0.21.
  - Old warning text "not compatible with the current PyTorch installation": 135 → 36. Part of this drop is the message changing.
  - New warning text "which is of compute capability (CC)": 0, 1, 1, 3, 23, 16.
  - "NVIDIA driver … too old": 7 → 87 (mostly Linux/servers on CUDA 13 defaults).
  - "Torch not compiled with CUDA enabled": 119 → 285 (inflated by agent-written issues).
  - In the ComfyUI repo, "no kernel image": 6, 6, 9, 5, 0, 5, which is low now.
  - The pain is real and spread across many apps, but each app's own fixes are absorbing it.

## 5. Testability on this PC (GTX 1660 Ti sm_75, driver 576.88 / CUDA 12.9, Win10, WSL2 Ubuntu present but stopped)

| Failure class | Real here? | How |
|---|---|---|
| CPU-only wheel installed or swapped in | **Yes, live now** | System Python 3.13 has torch 2.11.0+cpu. Any Windows `pip install torch` from PyPI is CPU-only. |
| Driver too old for the wheel | **Yes** | cu130/cu132 wheels need ≥ 580 (Comfy-Desktop manifest: win32 580.88), and this machine has 576.88. Reproduce in a lab venv. This test case disappears if the driver is updated. |
| GPU too **old** for the wheel (Pascal on cu128+/cu13x) | **No** | sm_75 is in every official build (cu126 Windows 5.0–9.0; cu128–cu132 7.5–12.0). Only possible with recorded fixtures or mocks, or a self-built wheel without 7.5 (hours). |
| GPU too **new** (RTX 50, sm_120, on older builds) | **No** | Same reason. Fixtures only. |
| Several envs / the app runs a different Python | **Yes** | Anaconda base plus 8 envs (3 with conda pytorch), system 3.13 (CPU torch), uv-managed 3.11/3.12, py launcher, and the Store alias. ComfyUI portable `python_embeded` can be added by downloading the 7z. |
| PyTorch's printed command being a no-op / torchvision major mismatch | **Yes** | In a lab venv (install +cu130, run the printed cu126 command). |
| Linux behaviour | Partly | WSL2 Ubuntu (GPU passthrough). |

The defining N1 failures (Pascal and Blackwell) cannot be reproduced live. That contradicts L-034's rule to test under the users' real conditions.

## 6. Verdict

**Met or crowded at the level users actually reach, so do not select B.**
- PyTorch itself (≥ 2.13) now names the mismatch and a CUDA build.
- The launchers the affected non-technical users run (ComfyUI cu126 portable, Comfy-Desktop with CC-aware stacks and CPU-swap auto-repair, StabilityMatrix legacy-GPU fallback, InvokeAI launcher GPU auto-detection) already pick or repair the build for their own installs.
- A generic CLI incumbent exists (env-doctor, 172 stars).
- About 15 new tiny "doctors" appeared in 12 months, none adopted.
- The people who still suffer look in their app's issue tracker, where no standalone tool ranks and where the program may not promote. The main failure cannot be tested on this machine.

**What is genuinely unserved** (narrow, and fragile against a one-PR upstream fix):
1. A *correct* fix command for pre-Turing cards: force-reinstall, matched torchvision/torchaudio, the env's own `python.exe`, and after 2.15 a pin to `2.14.x+cu126` protected by a constraints file. env-doctor gives nightly; PyTorch's line is likely a no-op; cuda-stack-check ignores old GPUs.
2. A Windows scan of *all* Pythons, including app-embedded ones (ComfyUI `python_embeded`, A1111/Forge venvs, Pinokio), with a GPU verdict per env. mldoctor does the shadow-install listing on Linux only, at 1 star.

**If the owner still wants B, the smallest version** is a zero-dependency single file, `python torchfix.py` (Windows-first), that:
- lists every Python and its torch build;
- gives each a verdict against this GPU and driver (old arch, new arch, driver, CPU-only);
- prints exactly one copy-paste command per broken env, using that env's interpreter, `--force-reinstall`, and the matching torchvision/torchaudio for the same CUDA tag;
- optionally writes a pip constraint to stop re-swaps.

Expect the same findability ceiling as env-doctor or lower. The more effective act of usefulness would be upstream: a PR to PyTorch's warning text (add `--force-reinstall` and the companion packages) and an issue for ComfyUI's cu126 update script ahead of 2.15. Both are B-class writes that need owner approval.

**Scores for the selection rubric (1–5):**

| Criterion | Score |
|---|---|
| Need is real | 4 |
| Unmet | 2 |
| People can find it | 2 |
| We can serve it well / test it here | 2 |
| Can keep improving | 2 (the table must change every release, and the niche shrinks with each upstream fix) |
