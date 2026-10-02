<!-- Copied from the private working file lab/s024/needs-G3.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# G3 needs: people running Python ML/AI on their own consumer GPU

Researched 2026-10-03 (S024), read-only. Group: students, researchers and hobbyists on Windows/Linux desktops and laptops with 4–16 GB VRAM.

**Sources used.** GitHub issues, discussions, and repo search (`gh api`). PyTorch Forums (Discourse JSON API). The Stack Exchange API (its quota ran low; Stack Overflow is now a weak venue for this group, and most 2025–26 traffic is on GitHub and the PyTorch forum). Web search in English and Chinese (CSDN pages often return HTTP 521 to the fetch tool, so CSDN items are cited by title). PyPI JSON and pypistats. Reddit was skipped (unreachable). Raw notes and helper scripts are in `lab/s024/g3/`.

**Caveat on counts.** In 2026, GitHub issue search is inflated by agent-generated issues and PRs, so absolute counts overstate demand. Ratios against a control phrase ("CUDA out of memory") are more stable. Counts are given as rough signals only.

Notation: [W] means the row describes a workaround. Quotes are verbatim and ≤ 20 words. Chinese quotes are translated and marked [translated].

---

## N1. "PyTorch can't use my GPU after I installed or updated it. Which build works on my card?"

- **Who and situation**: Owners of older GPUs (GTX 9xx/10xx Maxwell and Pascal, Titan X, Quadro P-series) and of brand-new ones (RTX 50 Blackwell), usually running ComfyUI, Whisper, or a transcription or TTS app. An app update or `pip install torch` pulls a build that lacks kernels for their GPU (cu128+ dropped sm_50–sm_61 in 2.8; pre-cu128 builds lack sm_120), or one that needs a newer driver (cu130+ needs R580). `torch.cuda.is_available()` still says True, and the failure appears at the first kernel launch: "no kernel image is available". Users hold contradictory beliefs about which versions work.
- **Evidence** (independent people):

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "I'm pretty new to this so any help is really appreciated" (GTX 1070, ComfyUI) | https://github.com/Comfy-Org/ComfyUI/issues/9705 | 2025-09-03 |
| 2 | "Yesterday everything worked perfectly, then I stupidly updated and now ComfyUI is useless for me." (1050 Ti) | https://github.com/Comfy-Org/ComfyUI/issues/9705#issuecomment-3253963267 | 2025-09-04 |
| 3 | [W] reinstalled 2.7.1+cu118 per a recipe: "BUT NONE OF THIS WORKS." (1080 Ti) | https://github.com/Comfy-Org/ComfyUI/issues/9705#issuecomment-3255639197 | 2025-09-04 |
| 4 | "I, a non-technical person, have also encountered a CUDA problem. I couldn't understand your conversation at all." | https://github.com/Comfy-Org/ComfyUI/issues/9705#issuecomment-3263509068 | 2025-09-07 |
| 5 | [W] tried the suggested downgrade: "not satisfying with torch 2.7.0 and not proceed to install... im tired already" (GTX 1060) | https://github.com/Comfy-Org/ComfyUI/issues/10468#issuecomment-3538504638 | 2025-11-16 |
| 6 | [W] "I tried using a GTX 1070 and am now falling back to my CPU, but it takes forever" | https://github.com/rishikanthc/Scriberr/issues/273#issuecomment-3595453014 | 2025-12-01 |
| 7 | "I checked Chatgpt and it was telling me all sorts of things about using using CUDA 11.8" (GTX 1080; 9,309 views) | https://discuss.pytorch.org/t/what-version-of-pytorch-is-compatible-with-nvidia-geforce-gtx-1080/222056 | 2025-08-04 |
| 8 | "I've been trying to get it to work for hours, but it's not working" (1080 Ti; 3,776 views) | https://discuss.pytorch.org/t/pytorch-not-supported/222789 | 2025-08-31 |
| 9 | "`--torch-backend=auto` ignores CUDA compute capability when installing `torch` for GTX 1080 Ti" (still open) | https://github.com/astral-sh/uv/issues/14742 | 2025-07-18 |
| 10 | [W] "Downgrading to an earlier PyTorch release (e.g., 2.4.1 + cu121) that still includes `sm_61` works" (GTX 1050) | https://github.com/bnsreenu/digitalsreeni-image-annotator/issues/57 | 2025-08-19 |
| 11 | "help me please, im already tired." Old torch would not install; "version 2.9 or higher install easy" (1050 Ti; 1,483 views) | https://discuss.pytorch.org/t/gtx-1050ti-cuda-error-no-kernel-image-is-available-for-execution/223956 | 2025-11-16 |
| 12 | [W] "I deleted the venv folder and allowed Comfy to recreate everything but I still get the error." (GTX 960; 6,841 views) | https://discuss.pytorch.org/t/uninstall-pytorch-completely-to-install-older-version/223551 | 2025-10-09 |
| 13 | App developer: "this sounds a lot like Pytorch is simply not usable for end-user software" (2,476 views) | https://discuss.pytorch.org/t/how-to-deal-with-pytorch-gpu-compatibility-hell/224182 | 2025-12-13 |
| 14 | [W] App author's own routing fix: "`torch.cuda.is_available()` returns `True` even without matching kernels, so the failure only surfaced at runtime." | https://github.com/RobThePCGuy/Claude-Patent-Creator/pull/26 | 2026-06-20 |
| 15 | [W] built a website: "I made page PyTorch install command picker which shows you all compatible pytorch versions" | https://discuss.pytorch.org/t/easily-selecting-compatible-pytorch-version-for-python-version-and-gpu/225174 | 2026-07-14 |
| 16 | "I downloaded CUDA 13.3 as there new update but now I cant run PyTorch" (toolkit misconception persists) | https://discuss.pytorch.org/t/cuda-13-3-update-no-compatibility/225338 | 2026-08-28 |
| 17 | "boltz pins only `torch>=2.2`, so pip installs the **latest** torch", which needed a newer driver than installed | https://github.com/yehlincho/BoltzDesign1/issues/38 | 2026-09-24 |
| 18 | PyTorch maintainer, after Windows cu126 builds silently lacked sm_50/52: "Would be nice to surface this information at the picker somehow." | https://github.com/pytorch/pytorch/issues/160575#issuecomment-3197797182 | 2025-08-18 |

- **Frequency signals**:
  - GitHub issues containing "is not compatible with the current PyTorch installation": 111 (2025Q3), 101 (Q4), 76 (2026Q1), 40 (Q2), 36 (Q3 to 10-03).
  - "no kernel image is available": about 470 per half-year, steady relative to "CUDA out of memory" (ratio 0.21–0.28).
  - "The NVIDIA driver on your system is too old": 27 (2025H2), 76 (2026H1), 86 (2026Q3 alone). This rises with the CUDA 13 default wheels, but many of these reports are from servers.
  - Stack Overflow canonical questions: "Torch not compiled with CUDA enabled" 500,541 views (57814535); "install pytorch with CUDA support with pip" 228,691; "no kernel image" 75,917 and 60,551.
  - App maintainers open catch-all threads, e.g., https://github.com/DrewThomasson/ebook2audiobook/issues/1240 "REPORT HERE FOR ALL CUDA/XPU/ROCM/MPS/JETSON ISSUES" (330 comments).
  - In Chinese, people keep publishing version tables in 2026, e.g., CSDN "[zh]…[zh]2026 [zh]" [translated: "pitfalls of version alignment… (2026 latest table)"] https://blog.csdn.net/qq_73472828/article/details/160484021.
  - **Getting worse**:
    - PyTorch 2.14 keeps CUDA 12.6 only as "Legacy".
    - RFC #190385 (open; updated 2026-09-23) proposes removing all CUDA 12.x builds in 2.15. That drops Maxwell, Pascal, and Volta entirely: https://github.com/pytorch/pytorch/issues/190385.
- **What people do today**:
  - Ask in issues and forums, and copy downgrade commands from strangers. These are often wrong ("Torch 2.7.1 dropped support", "1050 Ti supports a maximum of CUDA 11.8").
  - Downgrade Python to fit an old torch.
  - Delete and recreate venvs, or fall back to CPU.
  - App authors hand-code GPU routing (PR #26 above; ebook2audiobook; Scriberr ships a cu126 image).
  - Some users build their own picker websites.
- **Existing solutions checked**:

| Solution | Adoption | Verdict |
|---|---|---|
| PyTorch's own warning (2.8+) | native | **Partly.** It names the needed CUDA config ("Please install PyTorch with a following CUDA configurations: 12.6"), but gives no command and does not consider Python version or env. It does not fire for CPU-only builds, and does not tell a driver-too-old user what to do. |
| `python -m torch.utils.collect_env` | native | **Fails** as a diagnosis. It dumps versions only, with no arch or verdict check (checked `torch/utils/collect_env.py` on main). |
| pytorch.org "Get Started" picker | native | **Fails** for this case. It is not GPU-arch aware; a maintainer asked for this to be surfaced (row 18). |
| uv `--torch-backend=auto` (https://docs.astral.sh/uv/guides/integration/pytorch/) | uv is huge | **Fails** for pre-Turing GPUs. It reads the driver version only (`crates/uv-torch/src/accelerator.rs`, main, 2026-10), and uv #14742 is open. It works only in `uv pip`. |
| torchruntime (https://github.com/easydiffusion/torchruntime) | 15 stars, about 5.7k downloads/month (mostly via Easy Diffusion); updated 2026-10-01 | **Meets the install half for people who find it.** It reads the GPU model from a PCI database and is arch-aware (CC < 7.5 → cu124); `torchruntime test` checks the result. It is aimed at app developers. It cannot explain an existing broken env and does not scan envs. Barely discoverable. |
| light-the-torch (https://github.com/Slicer/light-the-torch) | 257 stars, about 3k downloads/month | **Fails** for this case: it is driver-based, the same gap as uv. |
| Web pickers: racinmat.github.io/pytorch-compatibility (1 star, 2026-07, CC-aware; a maintainer found errors, since fixed), torch-compat.danielhou.me (0 stars, 2026-06), elenacliu/pytorch_cuda_driver_compatibilities (37 stars, 2024) | tiny | **Partly.** Selection is manual: the user must know their CC, driver, Python, and which env is broken. |
| Small CLIs: gpu-doctor (PyPI, 11 downloads/month, 1 star), easywheels-cli (1 star), CBailey589/gaff (1 star), qwtoe/create-uv-ml (0), maido-39/pytorch-env-checker (0), Xza85hrf/ML-Framework_Checker (1) | none adopted | Many attempts, none adopted. |
| PEP 817 wheel variants (NVIDIA provider includes `sm_arch`) | **still Draft** (post-history 2026-01-24) | Would solve the install half natively once accepted and shipped. |

- **Search words**: "no kernel image is available for execution on the device"; "sm_61 is not compatible with the current PyTorch installation"; "which pytorch version for GTX 1080 / 1060 / 1050 Ti"; "PyTorch no longer supports this GPU because it is too old"; "torch.cuda.is_available() False"; "The NVIDIA driver on your system is too old"; "RTX 5070 sm_120 pytorch"; "ComfyUI CUDA error GTX 10"; "pytorch [zh] [zh] [zh]" / "sm_61 [zh]".
- **Verdict**: **Strong need, partly met.** At least 17 independent people from 2025 to 2026. The PyTorch 2.15 plan makes it worse for pre-Turing owners.
  - The **install** half is technically solved by torchruntime but is barely discoverable.
  - The **"why is my current env broken, and what single command fixes it"** half is not served by any adopted tool.
  - Risks:
    - Many tiny lookalike attempts already exist (L-029 pattern).
    - Web pickers are multiplying.
    - The gap narrows when PEP 817 variants ship.

## N2. "Installing some other package swapped my CUDA PyTorch for a CPU (or wrong) build"

- **Who and situation**: Anyone who installed a CUDA torch by hand and then ran `pip install -r requirements.txt`, `uv sync`/`uv run`, a ComfyUI custom node, or an app whose dependency pins `torch>=X`. The resolver then fetches torch from PyPI. Historically, PyPI's Windows wheel is CPU-only, and the Linux default is now a CUDA 13.x build needing a new driver and excluding pre-Turing GPUs. The working GPU setup silently breaks.
- **Evidence**:

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | App developer: "Lightning lists PyTorch as a dep, and so uv tries to automatically install the CPU version of PyTorch" [W: "hacks"] | https://stackoverflow.com/questions/79756836 | 2025-09-05 |
| 2 | "when running files through `uv run` reinstalls the version to the regular one without cuda." | https://github.com/astral-sh/uv/issues/18478 | 2026-03-14 |
| 3 | [W] found `uv run --extra gpu`: "you saved me after HOURS of suffering." | https://github.com/astral-sh/uv/issues/18478#issuecomment-4168878348 | 2026-04-01 |
| 4 | "Every time I run a command with `uv` it uninstalls and then reinstalls `torch`." | https://github.com/astral-sh/uv/issues/17830 (dup of #17711) | 2026-02-03 |
| 5 | [W] "Whisper pulled in the latest pytorch as a dependency, but I was able to get it working with an older version" | https://discuss.pytorch.org/t/gpu-support-and-obsolescence/224161 | 2025-12-10 |
| 6 | Installed from the cu126 index, "But torch still reports version 2.9.1+cu128, I have no idea why." | https://discuss.pytorch.org/t/how-to-deal-with-pytorch-gpu-compatibility-hell/224182 | 2025-12-13 |
| 7 | "boltz pins only `torch>=2.2`, so pip installs the **latest** torch" (`torch 2.14.0+cu130` > driver) | https://github.com/yehlincho/BoltzDesign1/issues/38 | 2026-09-24 |
| 8 | CSDN title: "[zh]pip[zh]pytorch gpu[zh]pytorch cpu[zh]" [translated: "installing a library with pip automatically uninstalls GPU torch and installs CPU torch"] | https://blog.csdn.net/AliceWulawula/article/details/134253218 | about 2023-11 (page not fetchable; date from ID) |
| 9 | [W] ComfyUI-Manager ships `pip_auto_fix.list` to "automatically restore the specified versions when … versions get mismatched during various custom node installations" | https://github.com/Comfy-Org/ComfyUI-Manager (README) | current |
| 10 | (older) "Took me hours to figure out the fix because I didn't know about this discussion area." | https://github.com/openai/whisper/discussions/415#discussioncomment-4130148 | 2022-11-13 |

- **Frequency signals**: GitHub issues with "Torch not compiled with CUDA enabled": 242 (2025H1), 227 (2025H2), 302 (2026H1), and 285 in 2026Q3 alone (partly agent-inflated). Stack Overflow 57814535 has 500k views, with activity in 2025. It is a staple of CSDN and Zhihu guides (e.g., cnblogs future-panda/p/18412219, updated 2026-01-06).
- **What people do today**:
  - Uninstall and reinstall torch with `--index-url`.
  - Re-run after every install.
  - uv users learn `override-dependencies`, `conflicts`, and `--extra gpu`.
  - ComfyUI users rely on ComfyUI-Manager's blacklist and auto-fix.
  - App installers add "torch preservation" code (e.g., unsloth PR #7256 "Windows torch release preservation").
- **Existing solutions checked**:
  - **pip constraints** (`-c` / `PIP_CONSTRAINT`, or a per-env `pip.ini` in `sys.prefix`): native but expert-only, and the index URL must also be configured. **Partly.**
  - **uv** (`override-dependencies`, explicit indexes, `torch-backend`): **partly**. The issues above show users fail to configure it, and `torch-backend` only works in `uv pip`.
  - **conda pinning** (`conda-meta/pinned`): does not protect against pip. **Partly.**
  - **ComfyUI-Manager** (pip_blacklist, pip_auto_fix, downgrade_blacklist): **meets the need inside ComfyUI only**.
  - **GitHub repo search** for a general "protect/lock my CUDA torch" guard (4 phrasings): **nothing found**.
- **Search words**: "pip install replaced torch with cpu version"; "uv sync installs cpu torch"; "Torch not compiled with CUDA enabled after installing"; "requirements.txt overwrote cuda pytorch"; "[zh]xformers[zh]torch[zh]cpu[zh]".
- **Verdict**: **Strong-to-medium; partly met.** About 9 people. The mechanisms exist, but each is per-tool and expert-only, and no general guard tool exists. A tool would overlap with N1 (restoring the right build needs N1's logic).

## N3. "Which of my Pythons/environments actually has a working GPU PyTorch?"

- **Who and situation**: People with several conda envs, project venvs, and apps that bundle their own Python (ComfyUI portable `python_embeded`, A1111/Forge venvs, Pinokio). They fix torch in one place while the app runs another, or have mixed pip and conda builds in one env. Diagnosing the problem takes forum round-trips.
- **Evidence**:

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "I wonder if ComfyUI has its own directory and own version of PyTorch hiding somewhere" | https://discuss.pytorch.org/t/uninstall-pytorch-completely-to-install-older-version/223551 | 2025-10-09 |
| 2 | "at Cmd it download exactly 2.8.0 but at launch ComfyUI it says exactly that it runs with 2.9.0" | https://discuss.pytorch.org/t/gtx-1050ti-cuda-error-no-kernel-image-is-available-for-execution/223956 | 2025-11-16 |
| 3 | Maintainer, to a Quadro P5000 user: "You have installed multiple PyTorch builds from various channels that could conflict with each other." | https://discuss.pytorch.org/t/pytorch-not-recognising-cuda-device/224742 | 2026-03-27 |
| 4 | Maintainer: "So I guess you are using different environments and have installed a new PyTorch" (versions printed did not match the error) | https://discuss.pytorch.org/t/pytorch-not-supported/222789 | 2025-09-02 |
| 5 | "But torch still reports version 2.9.1+cu128, I have no idea why." | https://discuss.pytorch.org/t/how-to-deal-with-pytorch-gpu-compatibility-hell/224182 | 2025-12-13 |
| 6 | [W] "I have Torch 2.7.1 and 2.8.0 in different conda and it works fine." | https://github.com/Comfy-Org/ComfyUI/issues/9705#issuecomment-3255813163 | 2025-09-04 |
| 7 | (older) "Now it shows true but Anaconda seems only to run in its own shell where it can't find whisper." | https://github.com/openai/whisper/discussions/415 | 2022-10-25 |

- **Frequency signals**: Stack Overflow "In which conda environment is Jupyter executing?" has 526,333 views (2016, an old classic). On the PyTorch forum, "which env is this" is a recurring first diagnostic question from the maintainer. A user-written "scan all envs" script appeared in 2026 (row W below).
- **What people do today**: Print `sys.executable` and `torch.__version__` by hand in each env, delete and recreate envs, keep one env per torch version, and run `conda list` and `pip list` per env.
- **Existing solutions checked**:
  - **`conda env list --size`** (native, conda 26.x): sizes only, and it excludes untracked files such as pip-installed torch. **Fails** for this need.
  - **collect_env**: one env at a time. **Fails.**
  - **LakshmiN5/check-package-version** (2 stars, 2026-03): "Scan all Python environments (venv, conda, pyenv) on your machine and report the installed version of any package". **Partly**: it reports versions only, with no GPU or arch verdict and no detection of embedded app Pythons.
  - **nb_conda_kernels**: covers Jupyter only.
- **Search words**: "which python is comfyui using"; "pytorch installed but app uses different version"; "list all conda environments with pytorch cuda version"; "multiple pytorch installations conflict".
- **Verdict**: **Medium; largely unmet as a tool.** About 7 people. It is a natural part of an N1 "doctor" and can be tested for real on the target PC (8 conda envs with torch 2.4–2.5 CUDA, plus uv and Python 3.13).

## N4. "My generation/training suddenly got 5–10× slower": VRAM silently spills into shared GPU memory (Windows)

- **Who and situation**: Windows NVIDIA users with 4–12 GB VRAM running ComfyUI, A1111/Forge, Ollama, or training loops. Since driver 536.40, CUDA allocations that exceed VRAM go to system RAM ("Sysmem Fallback") instead of raising OOM. Nothing tells the user; it just gets slow.
- **Evidence**:

| # | Quote | Link | Date |
|---|---|---|---|
| 1 | "This wasn't super obvious: it just felt like training was slow, and I didn't know why." (4 GB GTX; 1,706 views) | https://discuss.pytorch.org/t/documented-fix-slow-execution-pytorch-using-gpu-shared-memory/218909 | 2025-04-09 |
| 2 | "when dedicated GPU used up and shared GPU memory is used the generation becomes extremely slow" | https://github.com/Comfy-Org/ComfyUI/discussions/14092 | 2026-05-24 |
| 3 | [W] Set "[zh]" for python.exe [translated: set "Prefer No Sysmem Fallback" for python.exe] | https://www.cnblogs.com/zxdplay/p/19461876 | 2026-01-09 |
| 4 | [W] Built an extension: "The speed quickly becomes slow, approximately 10 times slower" | https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/14077 | 2023-11-24 |
| 5 | Unexplained slowness; maintainer asks for a "screenshot of your Task Manager's GPU Performance tab" (RTX 5090) | https://github.com/Comfy-Org/ComfyUI/issues/9177#issuecomment-3156677770 | 2025-08-05 |

- **Frequency signals**:
  - 2026 guide pages keep appearing (runaihome.com "Local AI Crawling on Windows? Shared GPU Memory Is Why … (2026)"), plus NVIDIA KB 5490.
  - In ComfyUI, "slow after update / slow at KSampler" issues are common, with mixed causes.
- **What people do today**: Watch Task Manager, change the NVIDIA Control Panel setting globally or per python.exe, use `torch.cuda.set_per_process_memory_fraction` (suggested by a PyTorch maintainer in row 1's thread), or use app flags such as `--lowvram`.
- **Existing solutions checked**:
  - **NVIDIA Control Panel policy**: the fix, but not a detector. **Partly.**
  - **nvitop** (252k downloads/month) and nvidia-smi: show dedicated memory. Under WDDM, nvidia-smi's per-process memory is often N/A (a known limitation, not re-verified this session), and neither flags shared usage. **Fails** for this need.
  - **The Giant Kitten A1111 extension**: A1111 only. **Partly.**
  - **GitHub search** for a spill detector or warning: nothing found, apart from cuda-vmm-sysmem-fallback (0 stars), a Linux shim that does the opposite.
- **Search words**: "stable diffusion suddenly slow shared gpu memory"; "pytorch training slows down windows shared memory"; "sysmem fallback policy"; "comfyui ksampler very slow 8gb"; "[zh]GPU[zh] [zh]".
- **Verdict**: **Medium.** About 5 people. The fix is known, and the need is detection and explanation ("you are spilling now; here is why and the fix"). Windows-only. It can be reproduced for real on a GTX 1660 Ti 6 GB with 16 GB RAM. The audience overlaps the N1 user base.

## N5. "AI models and caches filled my C: drive. Where are they, and how do I move or clean them?"

- **Who and situation**: Windows users whose `%USERPROFILE%\.cache\huggingface`, `.ollama\models`, pip/uv/conda caches, and conda `pkgs` land on a small system SSD.
- **Evidence**:
  - Ollama issues: https://github.com/ollama/ollama/issues/2551 "Can we change where the models are stored in windows" (37 comments, 39 reactions, 2024) and #680 "Is there a way to change the download/run directory?" (42 comments, 2023).
  - Many CN guides, e.g., "HuggingFace[zh]C[zh]" [translated: "HF models cached on C:, how to safely migrate them"] https://www.cnblogs.com/yjbjingcha/p/19004937 (2025).
  - CSDN 148896714 and 149617155 (2025).
  - "Anaconda[zh]C[zh]" [translated: "Anaconda envs take space on C:"] https://blog.csdn.net/qq_36549601/article/details/129356303.
  - 2026 English guides: knightli.com (2026-04), runaihome.com (2026).
  - [W] user-written cleaners: mbaxamb33/deep-cache-cleaner (2025-06), bpiwowar/ds-cache-cleaner (2026-01).
- **Existing solutions checked**:
  - `HF_HOME`, `OLLAMA_MODELS`, Ollama app settings, conda `envs_dirs`/`pkgs_dirs`, `PIP_CACHE_DIR`.
  - `hf cache ls/rm/prune`, with a cross-repo shared blob store since huggingface_hub v1.32.0 (2026-09-17). Release notes: https://github.com/huggingface/huggingface_hub/releases/tag/v1.32.0.
  - `uv cache prune`, `conda clean --all`, `conda env list --size`.
  - riponcm/Jharu (77 stars, 2026-07, Tauri app for macOS and Windows that cleans HF/Ollama/pip/uv/conda caches, sending items to the Recycle Bin).
- **Search words**: "huggingface cache C drive move"; "ollama models C drive"; "free up space AI models windows"; "C[zh] huggingface".
- **Verdict**: **Already met / crowded.** Native settings, the HF CLI, many guides, and at least five cleaner tools exist.

## N6. "The same model is stored twice (Ollama + LM Studio + ComfyUI + HF cache)"

- **Evidence**:
  - Several people wrote their own linkers: qaribhaider/ollama-to-lmstudio-symlinks; veiodruida/Centraliza.AI ("saving disk space through system Hardlinks"); vishwaksena-dingari/dehoard (macOS, 2026-06).
  - Blog: blog.threatresearcher.com "Reclaim 350GB of GGUF Bloat" (Windows junctions).
  - Guide: inventivehq.com "One Models Folder to Rule Them All".
- **Existing**:
  - sammcj/gollama (1,839 stars; links Ollama models to LM Studio).
  - LykosAI/StabilityMatrix (8,862 stars; shared model folders for SD UIs).
  - ComfyUI `extra_model_paths.yaml`.
  - HF shared blobs (dedup inside the HF cache only).
- **Search words**: "share models between ollama and lm studio"; "comfyui a1111 share models folder"; "duplicate gguf disk space".
- **Verdict**: **Partly met / crowded.** Workable tools exist for the main pairs, and the newcomers have 0 stars.

## N7. "Will this model fit in my VRAM, and which quantization should I pick?"

- **Existing**:
  - AlexsJones/llmfit (37,451 stars; detects the user's hardware).
  - DaoyuanLi2816/can-i-finetune-this (792 stars).
  - jaeseok614/ai-hardware-fit (43 stars).
  - HF "hardware compatibility" badges, LM Studio offload badges, and Ollama auto-fit.
  - Diffusion: willitrunai.com and heiss-ui "8 GB VRAM" pages, plus many fp8/GGUF guides.
- **Verdict**: **Already met** (strongly, for LLMs; by content for diffusion).

## N8. "Install flash-attn / xformers / SageAttention / triton on Windows without compiling for hours"

- **Evidence**:
  - flash-attention #1469 "How to get Flash-Attention under windows 11 CUDA" (25 comments, 29 reactions, 2025-01).
  - #2579 "Windows compile … can take more than 7 hours" (2026-05).
  - #2861 "Cannot install on Windows - Aiter path too long" (2026-09).
  - Issues with "CUDA_HOME environment variable is not set" are declining: 87 (2025H1), 42, 23, 14 (2026Q3).
- **Existing**:
  - mjun0812/flash-attention-prebuild-wheels (1,758 stars, a search page, 189 Windows wheels).
  - windreamer FA3 wheels (118 stars).
  - BradPita/Win-AI-Wheelhouse (82 stars, CN).
  - triton-windows and SageAttention wheels; official bitsandbytes Windows wheels.
- **Verdict**: **Largely met** for popular packages. The long tail of research CUDA extensions remains, but is not a small-tool job.

## N9. "Every venv re-installs 3–5 GB of torch+CUDA"

- **Evidence**:
  - CSDN "python[zh]" [translated: "multiple venvs need one shared package; how to avoid reinstalling"] https://blog.csdn.net/Sallee001/article/details/127799088.
  - [W] gitcode qq_39101260/pytorch-space (uv-based shared torch).
  - uv #13609 "shared caching or linking for heavy binary wheels" (2025-05).
- **Existing**: uv hardlinks from its cache by default, and conda hardlinks from `pkgs`; `--system-site-packages`.
- **Verdict**: **Partly met** (solved for uv/conda users on one drive); medium-weak.

## N10. "How big is each conda env, and which can I delete?"

- **Existing**: `conda env list --size` (native; it misses pip-installed files) and `conda clean --all`. Evidence is mostly old (PyTorch forum "Conda - Huge disk usage"; conda issue #6756).
- **Verdict**: **Weak / mostly met natively.** The only gap is pip-installed torch not being counted.

## N11. "Run someone's old repo (torch==1.x pins) on my new GPU / new Python"

- **Evidence**:
  - Zhihu "30[zh]cuda[zh]" [translated: "do RTX 30 cards not support old CUDA?"].
  - cnblogs "[zh]PyTorch[zh]" [translated: "guide for a GPU too new for PyTorch"] (2025).
  - PyTorch forum thread 223956 (Python too new for an older torch).
  - Issues with "Could not find a version that satisfies the requirement torch": 234, 426, 175, and 51 per half-year, declining.
- **Existing**: uv `--exclude-newer`, pip-rewind, Docker, and coding agents that port old code.
- **Verdict**: **Medium-weak for a tool.** The core conflict (an old torch has no kernels for a new GPU) needs code porting, not a resolver.

## N12. "An update broke my working setup. Roll it back."

- **Evidence**:
  - "Yesterday everything worked perfectly, then I stupidly updated…" (N1 row 2).
  - ComfyUI "All My Workflows and Models Were Deleted During an Update" (#10451, 2025-10).
- **Existing**:
  - `conda list --revisions` / `conda install --revision`.
  - ComfyUI-Manager snapshots, uv lockfiles, unda, pip-rewind.
  - `pip freeze` loses the `+cuXXX` index, so a naive restore re-breaks torch (overlaps N2).
- **Verdict**: **Weak-medium**; mostly covered per tool.

---

## Ranking

| Rank | Need | Independent people (2025–26 unless noted) | Existing-solution verdict | Small-tool fit / testable on target PC | Verdict |
|---|---|---|---|---|---|
| 1 | N1: torch build does not match my GPU or driver; what exactly to install | 17+ (plus maintainers; 9.3k/6.8k/3.8k-view forum threads; worsening with PyTorch 2.15 RFC) | Partly. Install is solved by torchruntime (15 stars, hard to find) but not by uv auto (driver-only, issue open since 2025-07); web pickers are manual; no adopted "diagnose my env, give one command" tool; PEP 817 still Draft | CLI/package; logic testable, but the PC's sm_75 does not reproduce the Pascal failure | **Strong**, crowded with tiny attempts |
| 2 | N2: other installs swap my CUDA torch | about 9 | Partly. Expert-only pip/uv config; ComfyUI-Manager covers ComfyUI only; no general guard found | Testable for real (pip/uv/conda on the PC) | **Strong-medium** |
| 3 | N3: which env/Python has a working GPU torch | about 7 | Largely unmet (check-package-version, 2 stars, versions only) | Testable for real (8 conda envs + uv + Python 3.13) | **Medium**, best as part of an N1 "doctor" |
| 4 | N4: silent VRAM spill to shared memory makes everything slow | about 5 | Fix known (NVIDIA setting); no detector found | Windows only; reproducible on a 6 GB GPU | **Medium** |
| 5 | N9: torch duplicated across venvs | about 3 | Partly met by uv/conda hardlinks | Testable | Medium-weak |
| 6 | N11: old repos on new GPU/Python | about 3 | Not tool-solvable (needs porting) | — | Medium-weak |
| 7 | N12: roll back a broken update | about 2 | conda revisions, ComfyUI-Manager snapshots | Testable | Weak-medium |
| 8 | N6: duplicate models across apps | about 4 (mostly tool authors) | gollama (1.8k stars), StabilityMatrix (8.9k stars), several linkers | — | Partly met / crowded |
| 9 | N5: AI caches fill C: | many (guides) | Native env vars and settings, `hf cache`, Jharu (77 stars), many cleaners | — | Already met / crowded |
| 10 | N8: Windows wheels for flash-attn etc. | many | mjun0812 (1.8k stars) and other wheel collections | — | Largely met |
| 11 | N10: conda env sizes | old | `conda env list --size` | — | Mostly met |
| 12 | N7: will the model fit in VRAM | many | llmfit (37k stars), can-i-finetune-this (792 stars), HF badges | — | Already met |

**Honest bottom line**:
- Most of the hinted jobs are already met: VRAM fit, caches, model dedup, Windows wheels, and conda sizes.
- The one area with heavy, recurring, current pain is **"PyTorch and my GPU disagree"** (N1, with N2 and N3 as causes). It is getting worse through 2026–27 as PyTorch drops CUDA 12.x (pre-Turing) and moves to CUDA 13 drivers.
- The unmet part is not a matrix (several websites now exist) but a **local, automatic diagnosis**: which envs on this machine have torch, whether each has kernels for this GPU and works with this driver, why not, and the single correct command to fix it (optionally protecting it from being swapped again).
- The caution is that many 0–1-star attempts already exist, and torchruntime solves installation for the few who find it. Usefulness would have to come from correctness (an accurate per-OS arch table maintained per release) and from findability under the exact error strings.
- N4 (spill detection) is a smaller, emptier niche worth a second look.
