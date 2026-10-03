<!-- Copied from the private working file lab/s024/comfyui/needs-comfyui.md in S024; runs of Chinese or Japanese text are replaced by [zh] (Constitution §9). Links lead to the originals. -->
# ComfyUI users' non-GPU tooling needs: candidates, evidence, landscape

S024, 2026-10-03 (Asia/Shanghai). Read-only research. Sources: `gh api` (issues, discussions, code, commits, READMEs); the registry API (`api.comfy.org/nodes`, all 5,817 packs crawled today with names and descriptions, `registry-full.json`); ComfyUI-Manager's `custom-node-list.json` (`../audit-b/cnl.json`, fetched today); the official forum (forum.comfy.org); web search and fetch. Two research subagents collected Chinese voices (`zh-evidence.md`: GitHub, Bilibili, cnblogs, V2EX) and Japanese plus non-GitHub English voices (`ja-en-evidence.md`: note.com, Qiita, Zenn, blogs, forum.comfy.org). I spot-checked the quotes that decide a verdict (forum topic 4403, ComfyUI #14287, #16651, Bilibili BV1VciEBwEVJ stats). Nothing was posted, installed, starred, or followed. No usernames are recorded.

Access limits: Reddit unreachable; Zhihu (403), CSDN (521), 5ch (403), and Civitai (UK block page) not readable. Chinese and Japanese evidence therefore leans on GitHub, Bilibili comment APIs, note.com, and Qiita.

Helpers in this folder: `rs.mjs <regex>` searches registry id+name+description plus Manager-only entries; `tbl.mjs <ids>` prints downloads, stars, last push; `wf/` holds the READMEs of the workflow-manager packs.

---

## 0. Bottom line first

**No strong-unmet need was found.** Each need with repeated, recent user voices is met by a native feature added in 2025–2026, by a large maintained pack, or by several small 2026 packs. The registry gained **2,358 packs in 2026 (1,135 since July)**, many AI-assisted, and they fill obvious tooling gaps within weeks. Three gaps that looked open at first turned out to be filled on verification: ComfyUI-Manager already finds unused node packs (Node Usage Analyzer, merged 2026-07-20), comfy-cli already bisects custom nodes (`comfy node bisect`, in the official troubleshooting docs), and a mature workflow-snapshot pack already exists.

What remains is **partly met**, with gaps of trust, adoption, and discoverability rather than of existence:

1. **N2 Workflow safety net** (automatic versions and backups, so a frontend bug, update, or mis-save cannot destroy work). The strongest recent evidence: English, Chinese, and Japanese voices, 2025-09 → 2026-09, with save/overwrite bugs that keep returning. Workflow Snapshot Manager does it (server-side snapshots, browse deleted workflows, 79 commits since 2026-02) but has 529 registry downloads and 2 stars; Yeban does it with 468 and 2.
2. **N1 Workflow library** (folders, thumbnails, tags, search) to replace the abandoned Workspace Manager (102k downloads, 1,454 stars, unmaintained since 2025-04). At least 12 replacements, feature-complete ones among them (G-Workflows, Yeban, Workflow Vault, xiaozhuguang), each ≤ 1,200 downloads. Native-fix risk is real (thumbnails "planned"; the sidebar is being redesigned).
3. **N16 Which node pack broke it** (in-app guided bisect). Comfy-cli already bisects and the official docs recommend it, but it is CLI-only; portable users bisect by hand. Only ~6 first-person voices, and sufferers search forums, not the registry.
4. **N8 After an update, which of my workflows broke**. The most frequent pain overall, but rollback (Manager snapshots, git tags) and culprit-finding (comfy-cli bisect) exist; the uncovered part (re-check my own saved workflows) is not what users ask for, and sufferers look in vendor threads (L-034).

N1, N2, and N16 are UI or maintenance tools: they get **no auto-installs from shared workflows** (the registry's pull mechanism) and must be found by search, N1/N2 against a dozen look-alikes. Details in §2–§5.

---

## 1. Context that shapes every verdict

- **Saturation.** 5,817 packs; 2,358 created in 2026. For most needs below, a registry search returns 5–30 packs, most created in 2026, most with < 2,000 downloads.
- **Native features added 2025–2026** (ComfyUI_frontend release notes in `fe-releases.txt`, core changelog): Media Assets panel with media-type and date filters, name search, grid views, bulk select (2026-07/08); "Load Image (from Outputs)"; persistence of unsaved workflow tabs; missing-model detection with one-click download, HF gated-model hints, Civitai URL metadata, rescan on refresh (2026), "alternate model sources" PR #17825 open; model library with an info panel; App mode; subgraph blueprints; search aliases; queue panel v2. Comfy-cli `comfy node bisect`. Manager Node Usage Analyzer and snapshots (ComfyUI commit, node pack versions, pip packages; `glob/manager_core.py`).
- **Native gaps that remain:** no folder create/move in the Workflows sidebar (frontend #3560 open; "Still missing" 2026-04-22); no workflow thumbnails, tags, or versions (#717 "planned", 2025-09); LoadImage cannot browse input subfolders (core PR #12099 closed unmerged, 2026-01); Media Assets cannot search by prompt, model, or seed; job history is session-only (#15965, 2026-08).
- **The pull channel favors graph nodes.** Shared workflows auto-install the packs whose nodes they contain. Sidebar and UI extensions spread only through search.
- **Update churn dominates.** Since 2025-09, 579 issues in Comfy-Org repos mention "after update" and 233 "downgrade". Much of it is GPU and memory behaviour (out of scope); workflow loss and UI regressions are a large non-GPU share. The Japanese subagent dates a spike to Nov–Dec 2025 (Nodes 2.0, 0.4.x).

---

## 2. Candidate needs with evidence

Quotes are ≤ 20 words; translations are marked [translated]; "(subagent)" marks quotes collected by a subagent and not re-fetched by me. "People" counts independent people found across all three evidence files.

### N1. Organize and find saved workflows (folders, thumbnails, tags, search): the Workspace Manager gap

People: ≥ 20 (EN, ZH, JA), 2024-10 → 2026-06.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "Comfy's workflow manager sucks. Workspace Manager is so good and much better. I miss it every day." | [11cafe/comfyui-workspace-manager#504](https://github.com/11cafe/comfyui-workspace-manager/issues/504) (+3 "agree" replies 2025-10, 2025-11, 2026-03) | 2025-07-02 |
| 2 | "this "Workflow Manager" is significantly better than the built-in one" | [#506](https://github.com/11cafe/comfyui-workspace-manager/issues/506) | 2025-08-06 |
| 3 | "returning to Comfy after a break and realizing this wasn't there anymore I'm lost" | #506, another person | 2025-08-16 |
| 4 | "[zh]" [translated] "It only lists workflows; no management; it can't even create folders." | [#503](https://github.com/11cafe/comfyui-workspace-manager/issues/503) | 2026-03-08 |
| 5 | "[zh]" [translated] "This won't be updated, a pity. Any alternative that shows thumbnails?" | [#500](https://github.com/11cafe/comfyui-workspace-manager/issues/500) | 2025-04-24 |
| 6 | "we cannot even sort the workflow in time created order!!!" | [ComfyUI_frontend#3560](https://github.com/Comfy-Org/ComfyUI_frontend/issues/3560) | 2025-07-19 |
| 7 | "Still missing in frontend v1.42.11 / ComfyUI 0.19.3." | #3560, another person | 2026-04-22 |
| 8 | "The 'save as' dialog doesn't allow to change folder, it always saves in 'workflows' folder." (subagent) | [forum.comfy.org 3891](https://forum.comfy.org/t/how-to-save-workflows-outside-of-workflows-folder/3891) (774 views) | 2025-10-24 |
| 9 | [zh]workflow_001.json workflow_new.json workflow_final.json [zh]…[zh] [translated] "With files named _001, _new, _final, you can't tell them apart without opening them." (subagent) | [note.com](https://note.com/botemaker/n/n862153227c30) | 2026-06-25 |
| 10 | "I want to display thumbnails directly in the workflows sidebar, sourced from the local User's stored workflow.json" | [ComfyUI_frontend#717](https://github.com/Comfy-Org/ComfyUI_frontend/issues/717) | 2026-03-07 |

- Workaround: keep the abandoned Workspace Manager despite its bugs ("Unsaved Workflow" #506/#501, Edge loading #509, data loss #488); arrange files in Explorer; naming rules (date_model_purpose_vN); symlink the workflows folder (#688); a Chinese user's remake (#507).
- Signals: Workspace Manager still has the most installs (102,355; 1,454 stars); Chinese videos promoting replacements: BV1VciEBwEVJ (2026-01-04, 3,736 views, 262 favorites, verified via API), BV1hVeKzqERM (2025-08, 1,147 views, 42 favorites); ≥ 12 replacement packs created 2025–2026.
- Verdict: **partly met** (§3.2).

### N2. A safety net for workflows: automatic versions and backups after loss or silent overwrite

People: ≥ 14 (EN, ZH, JA), 2024-12 → 2026-09.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "For the 3rd time I've lost all my saved workflows in ComfyUI after updating/installing new custom nodes" | [ComfyUI#10225](https://github.com/Comfy-Org/ComfyUI/issues/10225) (15 comments to 2026-08) | 2025-10-05 |
| 2 | "the changes to workflows simply disappear after restarting Comfyui, at this point this is just lame." (8 reactions) | #10225, another person | 2026-02-15 |
| 3 | "hours of work lost as ComfyUI pretends to save." | #10225, another person | 2026-03-15 |
| 4 | "When loading a workflow, node values are being silently rewritten." | [ComfyUI#13017](https://github.com/Comfy-Org/ComfyUI/issues/13017) (34 comments) | 2026-03-17 |
| 5 | "We are forced to never update comfy until this is solved" (a studio; workflows of hundreds of nodes) | [ComfyUI_frontend#10772](https://github.com/Comfy-Org/ComfyUI_frontend/issues/10772) | 2026-03-31 |
| 6 | Saving reverts to an old version or overwrites with another open tab's workflow, for about 3 months (subagent, paraphrase) | [ComfyUI#13652](https://github.com/Comfy-Org/ComfyUI/issues/13652) | 2026-05-01 |
| 7 | "recent changes to a workflow vanishes when switching between tabs" (subagent) | [ComfyUI#13713](https://github.com/Comfy-Org/ComfyUI/issues/13713) | 2026-05-05 |
| 8 | "[zh]json[zh] 1KB" [translated] "The moment I right-click save, the workflow is wiped; the JSON becomes 1 KB." | [ComfyUI#16651](https://github.com/Comfy-Org/ComfyUI/issues/16651) | 2026-09-29 |
| 9 | "[zh]" [translated] "I saved over the wrong file several times; luckily the version history had the old ones." (subagent) | [workspace-manager#490](https://github.com/11cafe/comfyui-workspace-manager/issues/490) | 2025-01-04 |
| 10 | [zh] [translated] "Next day the same workflow's settings were broken." (subagent) | [note.com](https://note.com/botemaker/n/n862153227c30) | 2026-06-25 |

- Workaround: export JSON by hand ("[zh]" [translated] "worst case I'll export manually from now on", #488, 2024-12); revert the frontend package; loosen browser site permissions for localhost (#10225); Git or `v1_backup.json` copies; never update.
- Signals: GitHub search finds 22 issues "failed to save workflow" and 240 mentioning "unsaved workflow" in ComfyUI contexts; the loss bugs recur across releases (2025-09 → 2026-09); the NZ manager pitches "[zh]" [translated] "automatic backup, no fear of losing".
- Verdict: **partly met** (§3.1).

### N3. Find past outputs by prompt, model, or seed, and reopen the workflow behind them

People: ≥ 14 (JA 5, EN 4, ZH 5), 2025-03 → 2026-10.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | [zh]ComfyUI[zh]&[zh] [translated] "The only way to check is dragging the image into ComfyUI; no list view." (subagent) | [note.com](https://note.com/earl_grey_y/n/n9296483e4ae8) (7 likes) | 2026-01-10 |
| 2 | [zh]LoRA[zh]……[zh] [translated] "How did I make this? I forgot the LoRA and prompt…" (subagent) | [Qiita](https://qiita.com/kihara-takahiro/items/d3a7d92b22dd6aff89fe) | 2026-05-16 |
| 3 | "Is there any way to see a gallery for old generated images?" | [ComfyUI#7121](https://github.com/Comfy-Org/ComfyUI/issues/7121) | 2025-03-07 |
| 4 | After a restart "the History tab is empty" (subagent) | [ComfyUI#15965](https://github.com/Comfy-Org/ComfyUI/issues/15965) | 2026-08-29 |
| 5 | "[zh]lora[zh]" [translated] "The metadata shows model and LoRA, not the prompt." (subagent) | Bilibili comment, BV1LN836eEnk | 2026-08-23 |
| 6 | "[zh]" [translated] "After upscaling, the image shows no info." (subagent) | [cnblogs](https://www.cnblogs.com/gccbuaa/p/19509015) | 2026-01-20 |

- Workaround: date subfolders via `filename_prefix`; drag the PNG back in; external indexers; self-built galleries (three Japanese authors and one Chinese commenter built their own, two with Claude Code or AI help).
- Verdict: **met** (§3.7).

### N4. Batch-process a folder of images and keep the original filenames

People: ≥ 14 (EN 6, JA 2, ZH ≥ 6), 2023 → 2026-09. Nobody asked about mirroring subfolder trees.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "I want the files my workflow exports to keep a reference to the *original* image name" | [ComfyUI#8699](https://github.com/Comfy-Org/ComfyUI/issues/8699) | 2025-06-27 |
| 2 | "Upscaling is so effective and successful now; literally the hardest part is the filename." | #8699, another person | 2025-12-19 |
| 3 | "How is this still not a thing? I wanted to batch convert a whole folder of images keeping them named" | #8699, another person | 2026-09-27 |
| 4 | [zh]ComfyUI [zh]…[zh] [translated] "Where is batch processing? I just want to bulk-upscale… (furious)" (subagent) | [note.com](https://note.com/motiseitai/n/n9f460f6dd6d0) (15 likes) | 2025-08-22 |
| 5 | "all of them do not really Work proper… i really need a Node like that." (subagent) | [forum.comfy.org 4343](https://forum.comfy.org/t/request-node-load-image-from-folder/4343) | 2026-03-21 |
| 6 | "Save original file names when batch processing (Load Image List From Dir)" (user wrote their own node) (subagent) | [Inspire-Pack#248](https://github.com/ltdrdata/ComfyUI-Inspire-Pack/issues/248) | 2025-08-09 |
| 7 | "[zh]" [translated] "With thousands of originals you can't rename them all." (subagent) | Bilibili BV1YG411i7rv (32k views; the ask runs 2024-05 → 2026-02) | 2025-08-29 |

- Workaround: Load Image Batch with the run count set by hand; external Python scripts calling the API; bulk-rename software afterwards; AI-written custom nodes.
- Verdict: **met, but people do not find it or find it flaky** (§3.4).

### N5. A shared workflow opens with missing models: which file, where to put it, why it is still "missing"

People: ≥ 17 (EN 7, JA 2, ZH ≥ 8), 2025-01 → 2026-06.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "after two days of guessing where the 'missing models error' wants things to be placed, and never succeeding" | [forum.comfy.org 4403](https://forum.comfy.org/t/trying-failing-to-run-qwen-image-edit-2511-on-linux/4403) (verified) | 2026-04-19 |
| 2 | "Says 'Missing Models'. Downloaded. Put in place. Still says they're missing" (title) (subagent) | [forum.comfy.org 3789](https://forum.comfy.org/t/newbie-installed-comfy-says-missing-models-downloaded-put-in-place-still-says-theyre-missing/3789) | 2025-09-12 |
| 3 | Desktop "should automatically download the required models into the appropriate model directories" (got a Save As dialog) | [ComfyUI#14287](https://github.com/Comfy-Org/ComfyUI/issues/14287) (verified) | 2026-06-04 |
| 4 | "workflow still showed 4 more models missing. But the model manager does not list these 4 models." (subagent) | [ComfyUI-Manager#2284](https://github.com/Comfy-Org/ComfyUI-Manager/issues/2284) | 2025-11-15 |
| 5 | "[zh] [zh] [zh]…[zh]" [translated] "I put the models in the right folder; the loader still can't find them." (+3 "same here", 2025-12 → 2026-06) (subagent) | Bilibili BV1GmcHe5E9e | 2025-10-14 |
| 6 | "[zh],[zh]" [translated] "Every time I must move the model into the right folder; a hassle." (subagent) | [ComfyUI-Manager#2368](https://github.com/Comfy-Org/ComfyUI-Manager/issues/2368) | 2025-12-09 |

- Workaround: wget by hand; symlinks; hf-mirror in China; reinstall; netdisk model packs.
- Verdict: **met, with a buggy native path** (§3.5).

### N6. Find and remove node packs and models that no workflow uses; duplicates and disk space

People: ≥ 10 (EN, ZH, JA), mostly builders and disk-space complaints; few first-person "find unused" asks.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "It would be a useful feature to list the unused libraries from the installed ones." | [ComfyUI-Manager#433](https://github.com/Comfy-Org/ComfyUI-Manager/issues/433) | 2024-02-24 |
| 2 | "Is there any plan to implement this? It sounds like a good to have feature." | [ComfyUI-Manager#2101](https://github.com/Comfy-Org/ComfyUI-Manager/issues/2101) | 2026-02-16 |
| 3 | "Have you ever installed dozens of custom node extensions only to forget which ones you actually use?" | [destroyerco/ComfyUI-Cleaner](https://github.com/destroyerco/ComfyUI-Cleaner) README | 2026-02-22 |
| 4 | "[zh],[zh]…[zh]" [translated] "I know many models are duplicates but daren't delete them; workflows would break." (subagent) | Bilibili BV1mMLUzKENN (11.8k views, 670 favorites) | 2025-04-29 |
| 5 | [zh] [translated] "Download models freely and the system drive fills up." (subagent) | [Qiita](https://qiita.com/y_hoshiba/items/9b67b1d2273b477c4748) | 2026-01-06 |

- Verdict: **met** (§3.6): Manager Node Usage Analyzer (2026-07); LoRA Manager duplicate finder; DaiMao_Tools SHA-256 dedupe; native `extra_model_paths.yaml` for other drives.

### N7. Pause the queue and keep it across restarts

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "it's been two years since this was open, any progress in this feature?" (9 reactions) | [ComfyUI#1032](https://github.com/Comfy-Org/ComfyUI/issues/1032) (28 reactions) | 2025-03-09 |
| 2 | "Quickly becoming essential: reboot-safe pause/resume, ideally with an option to export the current queue" | #1032 | 2025-08-17 |
| 3 | "be able to add things to the queue without having to start it immediately" (6 reactions) | #1032 | 2024-06-08 |

- Verdict: **met.** comfyui_queue_manager (21,556 downloads, 62 stars, pushed 2026-09-27: pause/resume, DB persistence across restarts, archive, export/import), QueueControl, Queue Pause, Save Load Queues, Persistent-Queue, pause-resume proxy, Yara.

### N8. Updates break things: which of my workflows broke, what caused it, how to roll back

People: ≥ 20 (EN ≥ 12, JA 7, ZH), 2025-11 → 2026-09; the most frequent pain.

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "The last two updates created several problems on my side and caused me to lose a significant amount of time" | [ComfyUI#12985](https://github.com/Comfy-Org/ComfyUI/issues/12985) (13 reactions on the OP) | 2026-03-16 |
| 2 | "experience has shown that some Comfy updates break it completely" | [ComfyUI#15100](https://github.com/Comfy-Org/ComfyUI/issues/15100) (36 comments) | 2026-07-31 |
| 3 | [zh] [translated] "Seems to be a node, but I can't tell which." (subagent) | [note.com](https://note.com/motiseitai/n/n4b9990b4768d) | 2025-11-28 |
| 4 | [zh] [translated] "If you can't afford breakage now, better not update." (subagent) | same note | 2025-11-28 |
| 5 | "I had a backup of the previous version and so reverted to that." (subagent) | [forum.comfy.org 3980](https://forum.comfy.org/t/how-to-revert-to-previous-nodes-new-node-design-issues/3980) | 2025-11-30 |
| 6 | "I like old version better as well, so I downgraded back to v0.3.76." | [ComfyUI_frontend#7320](https://github.com/Comfy-Org/ComfyUI_frontend/issues/7320) | 2025-12-25 |

- Workaround: don't update; full backup copies; Manager snapshots; `git checkout <tag>` and pinning `comfyui-frontend-package`; disable-all-then-bisect by hand; reinstall.
| 7 | "[zh]" [translated] "I want to go back to the previous version; how?" (subagent) | [ComfyUI#9475](https://github.com/Comfy-Org/ComfyUI/issues/9475) | 2025-08-21 |
| 8 | "[zh] [zh]" [translated] "Don't update, even if it means missing useful new nodes." (subagent) | Bilibili BV1hw3xzTEse (7,925 views) | 2025-07-20 |

- Culprit-finding is the recurring sub-need: see N16.
- Verdict: **partly met** (§3.3).

### N9. Civitai-compatible metadata so uploads show the model, LoRAs, and prompt

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "the metadata is present in the images, but it doesn't load in civitai." | [ComfyUI#1182](https://github.com/Comfy-Org/ComfyUI/issues/1182) | 2023-08-10 |
| 2 | "Resources are not properly picked up on CivitAI from the Save Image with Metadata node" | [mnemic-nodes#44](https://github.com/MNeMoNiCuZ/ComfyUI-mnemic-nodes/issues/44) | 2026-10-02 |
| 3 | "Allow more Civitai resource metadata for better cross-tool compatibility" | [ComfyUI-Image-Saver#140](https://github.com/alexopus/ComfyUI-Image-Saver/issues/140) | 2026-09-22 |
| 4 | "ModuleNotFoundError on ComfyUI v0.8+…" (an abandoned 101k-download incumbent) | [SaveImageWithMetaData#102](https://github.com/nkchocoai/ComfyUI-SaveImageWithMetaData/issues/102) | 2026-05-05 |

- Verdict: **met.** ComfyUI-Image-Saver (967,663 downloads, maintained), comfyui_image_metadata_extension (175,994), SaveImageWithMetaDataUniversal (maintained fork), ~30 more. Residual friction sits in Civitai's parser.

### N10. Reproduce one image out of a batch

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "out of a batch of 100 images, I like image 77 and wish to reproduce that one" | [Discussion #1124](https://github.com/Comfy-Org/ComfyUI/discussions/1124) | 2023-08-05 |
| 2 | Latent From Batch result is "similar to the batched image, but they are not identical" (no response) (subagent) | [ComfyUI#12051](https://github.com/Comfy-Org/ComfyUI/issues/12051) | 2026-01-24 |
| 3 | "This way we can use it on Save Image metadata and don't loose the 'Recreate it' possibility." (subagent) | [forum.comfy.org 3722](https://forum.comfy.org/t/store-seed-from-batch-latent-image-and-expose-it-to-sampler/3722) | 2025-08-20 |
| 4 | [zh] [translated] "After finding one you like, you want it again." (subagent) | [note.com](https://note.com/tsugiito_design/n/n983d2cf0484b) | 2026-09-24 |

| 5 | "[zh]comfyui[zh]" [translated] "Dragging the image back in does not regenerate it identically." (random tags resolved server-side are missing from the saved workflow; 3 people) (subagent) | [WeiLin-Comfyui-Tools#55](https://github.com/weilin9999/WeiLin-Comfyui-Tools/issues/55) | 2025-11-30 |

- Verdict: **partly met.** Native Latent From Batch (not bit-identical, #12051); Inspire KSampler `batch_seed_mode`; ksampler-batch (per-item seeds). Workaround: batch count instead of batch size. Testable on SD 1.5, but evidence is thin and part of it is GPU nondeterminism no node can fix.

### N11. LoadImage with input subfolders

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "This is so needed i cant believe it is not added yet" | [ComfyUI#1220](https://github.com/Comfy-Org/ComfyUI/issues/1220) (23 reactions) | 2024-09-26 |
| 2 | "usecase is input folder with symlinks and there is no easy solution" | #1220 | 2025-05-19 |
| 3 | "very frustrating… to have to rely on third-party custom nodes just to be allowed to organise images" | #1220 | 2025-06-23 |

- A Comfy member: "it would be better to create this as a separate custom node" (2024-10-01). Core PR #12099 closed unmerged (2026-01).
- Verdict: **partly met** by Crystools "Load image with metadata", LoadImageEnhanced, ImageGalleryLoader (1,849), Load-Image-Gallery (7,378), gallery-loader. Narrow.

### N12. Popular frontend extensions broken by Nodes 2.0 and UI churn

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "The autocomplete doesn't seem to work anymore when you switch over to the new Nodes 2.0" (7 reactions) | [Custom-Scripts#517](https://github.com/pythongosssss/ComfyUI-Custom-Scripts/issues/517) | 2026-01-02 |
| 2 | "I am not sure that I will be able to adapt this node package for version 2.0." (owner, 1.2M-download pack) | [mxToolkit#51](https://github.com/Smirnov75/ComfyUI-mxToolkit/issues/51) | 2025-12-24 |
| 3 | "No longer works with the latest version of ComfyUI v0.33.3… is this great tool dead?" | [Crystools#287](https://github.com/crystian/ComfyUI-Crystools/issues/287) (2.3M downloads) | 2026-08-22 |
| 4 | "Latest ComfyUI version breaks fast groups bypasser, no alternative" | [rgthree#704](https://github.com/rgthree/rgthree-comfy/issues/704) | 2026-03-11 |
| 5 | "[Request] Add 'Abandoned' to the readme" (subagent) | [comfyui-dynamicprompts#69](https://github.com/adieyal/comfyui-dynamicprompts/issues/69) | 2024-11-30 |

- Verdict: **met by replacements.** Autocomplete-Plus (63,298) and ~7 more; ≥ 12 resource monitors plus a maintained Crystools fork; ≥ 6 slider packs; Impact and ~20 wildcard packs. Nodes 2.0 is still opt-in.

### N13. Undo the 2025-12 queue/job-history UI change

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | "would really appreciate an option to kill this with fire" (11 reactions, 26 comments) | [ComfyUI_frontend#7107](https://github.com/Comfy-Org/ComfyUI_frontend/issues/7107) | 2025-12-02 |
| 2 | "i hate this change. bring back the option to put back, where it belongs" (9 reactions) | [ComfyUI_frontend#7320](https://github.com/Comfy-Org/ComfyUI_frontend/issues/7320) | 2025-12-10 |
| 3 | "OLD QUEUE PLS" (18 reactions) | [ComfyUI#11092](https://github.com/Comfy-Org/ComfyUI/issues/11092) | 2025-12-04 |
| 4 | "first thing I do every frontend load is use the browser's inspect tool to manually delete the html nodes" | #7107 | 2026-04-06 |

- Verdict: **native fix in progress** ("it's coming back guys", Comfy contributor, 2026-01-09; queue panel v2); ComfyUI-DisableJobHistory exists. A custom fix would chase weekly frontend refactors.

### N14. Recommended settings per checkpoint

- "It would be great to be able to store recommended settings for Checkpoints" ([LoRA-Manager#762](https://github.com/willmiao/ComfyUI-Lora-Manager/issues/762), 2026-01-08, 3 reactions). Five builders shipped it in 2026 (checkpoint_preset_manager 1,011 downloads; Comfy-Cabinet; Dragos-ModelPresets; CWK; Model Preset Pilot). Thin first-person evidence. **Partly met, crowded.**

### N15. Prompt library and styles (A1111 Styles / easy-prompt-selector)

- "a prompt management system similar to A1111's sdweb-easy-prompt-selector" ([LoRA-Manager#337](https://github.com/willmiao/ComfyUI-Lora-Manager/issues/337), 2025-08-03, 4 reactions; "I also need this feature" 2025-08-05); [zh]Auto111[zh]Styles[zh]…[zh] [translated] "couldn't find a node I liked, so I built one" (note.com, 2026-08-30, 64 likes, subagent). **Met**: Prompt Assistant (161,798; 2,392 stars), FranckyB Prompt Manager (24,517), ComfyAssets PromptManager (29,129), EreNodes, ~20 more.

### N16. Find which custom node pack broke ComfyUI after an install or update

People: ≥ 6 (JA 4, ZH 2), 2025-11 → 2026-08, plus Chinese tutorials teaching manual "[zh]" (binary search).

| # | Quote | Source | Date |
|---|---|---|---|
| 1 | [zh] [translated] "Seems to be a node, but I can't tell which." (subagent) | [note.com](https://note.com/motiseitai/n/n4b9990b4768d) | 2025-11-28 |
| 2 | [zh]ComfyUI[zh] [translated] "I installed a new custom node and ComfyUI stopped starting." (subagent) | [note.com](https://note.com/auto_science/n/nfb65c1f8f7f2) | 2026-06-23 |
| 3 | [zh]…[zh] [translated] "Right after installing a new node, it won't start or slows sharply." (subagent) | [note.com](https://note.com/tsukushi_mebuki/n/n5796cdd3c38d) | 2026-05-08 |
| 4 | Blamed Nodes 2.0 and custom nodes, removed node folders; the culprit was a Chrome extension (paraphrase, subagent) | [Hatena blog](https://fa.hatenadiary.jp/entry/n/nbc89e1cb03d4) | 2025-12-20 |
| 5 | "[zh]" [translated] "Deleting that one fixed it before; now I don't know which one is the problem again." (subagent) | Bilibili BV1ho5x6cE2f comments (drag-and-drop broken after the 2026-05 update; 160 comments, 389 favorites per subagent) | 2026-08-24 |

- Workaround: disable all, re-enable half, restart, repeat (official docs; Manager toggles; frontend "Extensions" settings for JS-side culprits); delete suspects named in comment threads; reinstall.
- Landscape: **partly met.** Comfy-cli `comfy node bisect start/good/bad` automates it, and the official troubleshooting page recommends it, but says it "requires some command line experience"; portable and launcher users (most Chinese and Japanese voices above) do not use comfy-cli. Registry and Manager list: 0 packs for "bisect", "safe mode", "conflict check", "which node broke" (regex search); GitHub repo search: none. An in-app guided bisect cannot help when ComfyUI no longer starts (a standalone script could). Native-fix risk: medium (Manager owns enable/disable). Findability: low; sufferers search forums and Bilibili, where the official page and tutorials answer first.

### Other recurring needs seen (all met or out of scope)

- Notifications when the queue finishes (ComfyUI #16268, 2026-09-11; JA note 2025-02): many packs (sound, ntfy, Discord, email). Met.
- Viewing outputs and running workflows from a phone (3 JA voices, 2025–2026): App mode plus Tailscale, SmartGallery mobile UI, ComfyUIMini. Met.
- Deleting rejected images after the frontend removed the delete button (forum 4438, 2026-05): native regression; galleries delete. Met.
- XY plots for diffusion-model (UNet-only) files (JA builder, 2026): one voice. Not pursued.
- Manager v4 / Desktop migration moves models, wildcards, workflows (forum 4458, JA blog 2026-09): documentation and native paths. Out of scope.
- User data kept inside a plugin's folder (saved tags, prompts) wiped by a Manager update ("Manager[zh]" [translated] "a Manager plugin update wiped the staging area; everything gone", [WeiLin-Comfyui-Tools#64](https://github.com/weilin9999/WeiLin-Comfyui-Tools/issues/64), 2026-03-26): a per-plugin design bug, not a pack-sized need.
- China network access to HF/GitHub (hf-mirror tips with 20–45 likes): infrastructure, met by mirrors and launchers.
- Several mobile apps exist; a Chinese user wishes they were combined (Bilibili BV1ULzEBaEUe, 372 favorites, 2026-01): not testable as a node pack.

---

## 3. Strict existing-solution checks (six strongest by evidence)

Verdict scale: **strong-unmet** (nothing meets it), **partly met** (something meets it but with a real gap: quality, maintenance, adoption, or a missing capability), **met**.

### 3.1 N2: Workflow safety net (versions, backups, restore)

Search words (registry and Manager list via `rs.mjs`; GitHub repo search; web EN/ZH/JA): "backup", "auto save", "version history", "revision", "snapshot", "rollback", "restore point", "recover", "workflow history", "[zh] / [zh] / [zh]", "lost my workflow", "workflow disappeared" (outcome words).

| Pack | Downloads | Stars | Last push | Meets the need? |
|---|---|---|---|---|
| [Workflow Snapshot Manager](https://github.com/ethanfel/Comfyui-Workflow-Snapshot-Manager) | 529 | 2 | 2026-08-24 | **Yes**: auto-captures edits (debounced), named and locked snapshots, search, restore, browse renamed or deleted workflows, server-side JSON storage, export/import (v3.1.0; 79 commits since 2026-02-24; 0 issues). |
| [Yeban Workflow Manager](https://github.com/wsq194/yeban-workflow-manager) | 468 | 2 | 2026-07-08 | **Yes**: timed auto-save, a version snapshot before each save (max 20), backup before overwrite, metadata self-repair; plus groups, thumbnails, tags. Chinese-first; 9 commits. |
| [Workflow Vault](https://github.com/avillabon/ComfyUI_Workflow_Vault) | 62 | 15 | 2026-10-02 | Partly: explicit versions per entry, not automatic. |
| [ComfyUI Sidebar Organizer](https://github.com/xiake-1/comfyui-sidebar-organizer) | 13 | 1 | 2026-09-06 | Partly: "auto-backup area". |
| [Workflow-Version-Control](https://github.com/mkaizen/ComfyUI-Workflow-Version-Control) | not in registry | 1 | 2026-05-31 | Partly: desktop Git-style GUI outside ComfyUI. |
| [Bone-Studio Workflow Manager](https://github.com/juangea/bs-comfyui-workflow-manager) | 237 | 4 | 2026-06-30 | Partly: optional Git versioning. |
| [ComfyUI Workflow Backup](https://github.com/zavatmotion/ComfyUI-Workflow-Backup) | Manager-only | 3 | 2026-02-11 | No: one-off export of workflow + models. |
| [HuggingFace Download & Backup](https://github.com/jnxmx/ComfyUI_HuggingFace_Downloader) | 6,450 | 29 | 2026-09-10 | No: whole-install backup to HF. |
| Workspace Manager (abandoned) | 102,355 | 1,454 | 2025-04-16 | Had version history (#490 shows it saved a user); now loses data itself (#488). |
| NZ workflow manager (beta) | 157 | 1 | 2026-01-22 | Versions and auto-backup claimed; full version distributed off-registry. |
| Native frontend | — | — | — | **No versions.** Persists unsaved tabs in browser storage, the mechanism behind several loss bugs (#10225, #13017 diagnosis). Fixes ship and regress. |
| Native output metadata | — | — | — | Partial recovery: each *run* embeds its workflow in the output PNG; edits never run are not. |

Negative checks: registry regex "backup|auto.?save|version history|revision" → 9 hits (above); "rollback|snapshot|restore point|downgrade" → Snapshot Manager plus unrelated; GitHub repo search "comfyui workflow version history OR snapshot" → the same set; web EN/ZH/JA → NZ manager, Workspace Manager remakes, Git advice.

**Verdict: partly met.** A mature implementation exists (Snapshot Manager), so the function is not missing; the gap is that almost nobody has it (529 downloads) while loss reports keep coming, and its robustness under the very bugs that cause loss is unproven. Native-fix risk: medium (the team fixes persistence bugs, not versioning).

### 3.2 N1: Workflow library (folders, thumbnails, tags, search)

Search words: "workflow manager / management / browser / organizer / library / gallery / explorer", "workspace manager", "organize workflows", "find my workflows", "workflow folders / thumbnails / tags", "[zh] / [zh] / [zh]", "[zh]"; GitHub repo search "comfyui workflow manager" (39 repos).

| Pack | Downloads | Stars | Last push | Folders | Thumbs | Tags | Search | Versions | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Workspace Manager | 102,355 | 1,454 | 2025-04-16 | ✓ | ✓ | – | ✓ | ✓ | Abandoned; bugs open |
| [G-Workflows](https://github.com/AI4VFX/comfyui-g-workflows) | 255 | 31 | 2026-09-17 | ✓ | ✓ | ✓ (AutoTag) | ✓ | – | Works on the native folder; shows each workflow's models and node packs; 80 commits |
| [Yeban](https://github.com/wsq194/yeban-workflow-manager) | 468 | 2 | 2026-07-08 | groups | ✓ | ✓ | ✓ | ✓ | Chinese-first |
| [Workflow Vault](https://github.com/avillabon/ComfyUI_Workflow_Vault) | 62 | 15 | 2026-10-02 | ✓ | ✓ | ✓ | ✓ | ✓ | Own vault folder, Markdown docs, example media |
| [Workflow Studio](https://github.com/ketle-man/ComfyUI-Workflow-Studio) | 1,164 | 17 | 2026-10-02 | ✓ | ✓ | ✓ | ✓ | – | All-in-one (models, gallery, batch) |
| [xiaozhuguang](https://github.com/xiaozhuguang/ComfyUI-xiaozhuguang) | 372 | 80 | 2026-10-02 | ✓ nested | ✓ | ✓ | ✓ (pinyin) | ✓ | Chinese UI suite; can take over the native panel |
| [Workflow Folders](https://github.com/loFei/ComfyUI-Workflow-Folders) | 273 | 4 | 2026-04-16 | ✓ | – | – | native | – | Adds folder ops to the native panel |
| [comfyui-browser](https://github.com/netaart/comfyui-browser) | 0 (git installs) | 678 | 2026-08-09 | collections | – | – | ✓ | – | Image/workflow browser |
| [yichengup WorkflowManager](https://github.com/yichengup/ComfyUI-WorkflowManager) | not in registry | 51 | 2026-08-23 | ✓ | – | – | – | – | |
| [Bone-Studio](https://github.com/juangea/bs-comfyui-workflow-manager) | 237 | 4 | 2026-06-30 | ✓ | – | – | ✓ | Git | Projects layer |
| NZ workflow manager (beta) | 157 | 1 | 2026-01-22 | ✓ | ✓ | – | ✓ | ✓ | Full version off-registry |
| Others: Flow-Hub (146), TealPug (27, cloud), Sidebar Organizer (13), Aaalice Workflow Hub (31 stars), comfy-viewer, gregowahoo manager | small | | | | | | | | |
| **Native Workflows sidebar** | — | — | — | browse only; no create/move (#3560) | no (#717 "planned") | no | ✓ | no | Left-sidebar redesign merging now (DES-1219/1220, 2026-09-30) |

**Verdict: partly met.** Feature-complete small packs exist; none has adoption; the most-installed option is abandoned and buggy. A new entrant would be about the 13th. Native-fix risk: medium–high.

### 3.3 N8: After an update, which of my workflows broke, what caused it, and rollback

Search words: "regression", "test workflows", "validate workflow", "smoke test", "rollback", "snapshot", "downgrade", "safe update", "pin version", "bisect", "safe mode", "doctor / diagnose / troubleshoot", "[zh] [zh]"; GitHub repo and code search.

| Solution | Adoption | Last update | Meets the need? |
|---|---|---|---|
| ComfyUI-Manager snapshots (ComfyUI commit, node pack versions, pip) | Manager 16,326 stars | 2026-10 | **Rollback: yes** for core and nodes (the code records git- and registry-installed packs; a JA note claims only git installs are covered); the frontend package via pip. Does not say which workflows broke. |
| comfy-cli `comfy node bisect start/good/bad` | comfy-cli 994 stars; in the official troubleshooting docs | 2026-10-02 | **Culprit-finding: yes**, interactive binary search over node packs. CLI only; users quoted above did not know it. |
| `git checkout <tag>` + `pip install comfyui-frontend-package==x` | many guides | — | Rollback by hand. |
| ComfyUI Desktop stable channel | official | — | Reduces exposure; breakage still reported on stable (#15100). |
| [ComfyUI-Doctor](https://github.com/rookiestar28/ComfyUI-Doctor) | 4,380 downloads, 76 stars | 2026-09-22 | Diagnoses runtime errors as they occur; no before/after comparison. |
| [comfyui-setup-manager](https://github.com/badgids/comfyui-setup-manager) | 17 stars | 2026-08-21 | Standalone install/update/repair manager. |
| [Renest](https://github.com/renest-ai/comfyui-renest) | 1 star | 2026-10-02 | Saves "a run that worked" (models, nodes, packages) for another Linux GPU machine; tied to the Renest service. |
| ComfyUI-Launcher | 897 stars | 2024-08 | Per-workflow isolated environments; stale. |
| A check that re-validates or re-runs the user's own saved workflows after an update | — | — | **None found** (registry regex "regression\|test (my )?workflows\|validate workflow\|smoke test" → 0; GitHub search → none). |

**Verdict: partly met.** Rollback and culprit-finding exist. The uncovered part is not what users ask for (they ask for stable releases); much of the breakage is GPU/memory behaviour or frontend rendering that a backend check cannot see; a real check needs two installs or a snapshot swap. Sufferers look in Comfy-Org threads and forums, so a registry pack is found late (L-034, score "findable" 2).

### 3.4 N4: Batch-process a folder and keep filenames

Search words: "load images from folder/dir/path", "batch loader", "folder of images", "load image batch", "filename", "original filename", "keep names", "subfolder"; code checks of the three biggest packs.

| Pack | Downloads | Stars | Last push | Meets the need? |
|---|---|---|---|---|
| WAS Node Suite (v3 / revised fork) | 1,161,591 / 1,540,596 | 1,858 / 234 | 2026-10-02 / 2026-06-04 | **Yes**: "Load Image Batch" with `filename_text`, incremental mode, glob patterns. Users report slowness on 15k-file folders (#541) and index resets (forum 4343). |
| Inspire Pack | 911,218 | 817 | 2025-11-17 | **Yes**: "Load Image List From Dir" outputs `FILE PATH`; a user still asked to keep names on save (#248). |
| KJNodes | 4,525,894 | 3,343 | 2026-09-13 | **Yes**: "Load Images From Folder (KJ)" with `include_subfolders`. |
| Batch Folder Tools | 1,870 | 4 | 2026-03-23 | Yes: iterate a folder through any workflow. |
| Sequential Image Loader | 1,955 | 29 | 2026-07-24 | Yes: one image per queue press (fixes the run-count chore). |
| comfyui-simple-batch | 128 | 1 | 2026-09-25 | Yes: folder tree in, mirrored tree out. |
| Load Image With Filename (two packs) | 1,061 / 2,571 | 2 / 0 | 2026-03 | Yes (single image + filename). |
| mnemic-nodes, WWAA, filename-tools, Batch Name Loop, LoadImageEnhanced, HuaTool, ~10 more | 1k–92k | | 2025–2026 | Yes/partly. |

**Verdict: met.** Complaints persist because core LoadImage has no filename output, users do not find pack nodes, and some loaders are slow or lose their index. A new pack would be about the 20th.

### 3.5 N5: Missing models when opening a shared workflow

Search words: "missing models", "model downloader", "download missing/required models", "model linker / relink / fix paths", "workflow models", "[zh]".

| Solution | Downloads | Stars | Last push | Meets the need? |
|---|---|---|---|---|
| **Native** missing-model panel | — | — | 2026-09 | **Yes** for workflows carrying model URLs: one-click download to the right folder, HF gated hints, Civitai URLs, rescan. Bugs: Save As dialog on Desktop (#14287, closed), ignores `extra_model_paths.yaml` (#13676), greyed button (#8583, fixed). |
| [Workflow Models Downloader](https://github.com/slahiri/ComfyUI-Workflow-Models-Downloader) | 13,669 | 151 | 2025-11-29 | Yes: scans, searches HF/Civitai, downloads; 14 open issues, inactive since 2025-11. |
| [Comfy Asset Downloader](https://github.com/ServiceStack/comfy-asset-downloader) | 29,726 | 23 | 2025-05-08 | Yes (by URL). |
| [Model Resolver](https://github.com/Azornes/Comfyui-Model-Resolver) | 1,468 | 38 | 2026-09-16 | Yes: local fuzzy matching for renamed files plus cloud lookup. |
| Model Installer, Missing Models Fetcher, Install Missing Models, fix_names, ModelFetcher, Model Linker, Workflow Doctor, HF Downloader | 23–6,450 | | 2025–2026 | Yes/partly. |

**Verdict: met** (native plus ≥ 10 packs). The residual pain is "I put the file somewhere and it is still missing" (wrong folder, GGUF needs another loader), which Model Resolver and the native panel address only partly.

### 3.6 N6: Unused node packs and models; duplicates

Search words: "unused", "cleaner", "orphan", "duplicate / dedup", "disk space", "find unused custom nodes", "[zh]", "[zh] / [zh]"; GitHub repo search (6 repos); Manager source; LoRA Manager source.

| Solution | Adoption | Last update | Meets the need? |
|---|---|---|---|
| **ComfyUI-Manager Node Usage Analyzer** ([PR #2152](https://github.com/Comfy-Org/ComfyUI-Manager/pull/2152)) | ships with Manager | merged 2026-07-20 | **Yes**: counts the workflows in the user directory that use each pack; filters "Used In Any Workflow" and "Installed and Unused" (`js/custom-nodes-manager.js`). |
| LoRA Manager | 832,276 downloads, 1,504 stars | 2026-10-02 | Yes for models: organization, "Clean up and manage disk space", a duplicates manager (`DuplicatesManager.js`). |
| [DaiMao_Tools](https://github.com/Emiya-wkq/ComfyUI-DaiMao_Tools) | 59 stars | 2025-09-22 | Yes: SHA-256 duplicate finder and remover nodes. |
| ComfyUI_Usage_Checker (JA), Model-Analytics, Model-Cleaner, ComfyUI-Cleaner ×2, Find_Unused_Custom_Nodes | ≤ 10 stars each | 2025–2026 | Yes (scripts or small nodes). |
| Native `extra_model_paths.yaml` | — | — | Moves model storage to another drive. |

**Verdict: met** (native since 2026-07). Manager issue #2101 is still open although the feature shipped through #2152, so reading the issue alone gives the wrong answer (an L-034 trap that this check caught).

### 3.7 N3 (summary check): search past outputs

Majoor Assets Manager searches "by filename, prompt, metadata, type, rating, workflow" (7,137 downloads, 135 stars, pushed 2026-10-02); SmartGallery "Deep Search… prompts, models, parameters" (386 stars); Image-MetaHub (324 stars, subagent); Sidebar Gallery (SQLite index); Infinite Image Browsing (1,354 stars); Diffusion Toolkit (1,013 stars); ComfyUI-Gallery (28,738 downloads); native Media Assets (filters, name search). **Met.**

---

## 4. Excluded by the filter

- Custom-node Chinese translation (AIGODLIKE stale since 2025-03; DD-Translation fork, 838 stars): non-English content needs owner approval (§3B) and the need is met by the fork.
- Speed, VRAM, model support, GPU errors: the bulk of 2026 issues; not testable on a 6 GB Turing card and not tooling.
- Civitai/LiblibAI browsing or scraping nodes: ToS risk.

---

## 5. Ranking

Scores 1–5. Evidence = independent people and recency. Unmet = 5 if nothing exists, 1 if met natively or by a large maintained pack. Findable = will sufferers find a new pack by registry search (UI-only packs get no workflow auto-install). Testable on this machine.

| Rank | Need | Evidence | Unmet | Findable | Testable | Native-fix risk | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | N2 Workflow safety net | 5 | 2 | 3 | 5 | medium | partly met |
| 2 | N1 Workflow library | 5 | 2 | 3 | 5 | medium–high | partly met |
| 3 | N8 Which workflows broke after an update | 5 | 2 | 2 | 3 | low | partly met |
| 3b | N16 Which node pack broke ComfyUI (in-app guided bisect) | 3 | 3 | 2 | 5 | medium | partly met (CLI only) |
| 4 | N4 Batch folder, keep filenames | 5 | 1 | 3 | 5 | low | met |
| 5 | N5 Missing models | 5 | 1 | 3 | 5 | native improving | met |
| 6 | N3 Search past outputs | 5 | 1 | 3 | 5 | medium | met |
| 7 | N11 LoadImage subfolders | 3 | 2 | 4 | 5 | low | partly met |
| 8 | N10 Reproduce one image of a batch | 3 | 2 | 3 | 4 | low | partly met |
| 9 | N14 Per-checkpoint settings | 2 | 2 | 3 | 5 | low | partly met |
| 10 | N13 Old queue/job UI | 4 | 2 | 2 | 5 | high (in progress) | partly met |
| 11 | N6 Unused packs/models, duplicates | 4 | 1 | — | 5 | — | met (native) |
| 12 | N7 Pause/persist queue | 3 | 1 | — | 5 | — | met |
| 13 | N9 Civitai metadata | 3 | 1 | — | 5 | — | met |
| 14 | N12 Broken frontend extensions | 4 | 1 | — | 5 | — | met |
| 15 | N15 Prompt library | 3 | 1 | — | 5 | — | met |

---

## 6. Bottom line (blunt)

- **ComfyUI non-GPU tooling is saturated in October 2026.** Every need with real, repeated voices has a solution, most have 5–30. People keep asking because they do not find the packs, the packs are scattered across tiny repos, or the incumbent was abandoned. Three "nothing does this" first impressions were wrong on verification (Manager analyzer, comfy-cli bisect, Snapshot Manager), which is the L-034 lesson again.
- **No candidate is strong-unmet.** The best are N2 and N1, partly met: the function exists in small 2026 packs with 2–80 stars each. Together they are what the abandoned Workspace Manager was: "a workflow library that never loses a version". Choosing them would be a deliberate bet that execution and naming can win a crowded field (the L-029 tie-break), not a gap.
- **Against N1/N2:** UI extensions get no workflow-driven installs; a dozen look-alikes compete in registry search; the frontend team may ship folders, thumbnails, or history; frontend internals change weekly, and every 2026 workflow manager has had to chase them. A server-side design (snapshot on every file write and every queued prompt, independent of browser storage) would be sturdier than frontend-only packs and is fully testable here without a GPU, but Snapshot Manager already stores server-side.
- **N16 (in-app guided bisect) is the least crowded** (0 registry packs; comfy-cli covers CLI users only), but its evidence is thin (~6 first-person voices), it cannot help when ComfyUI no longer starts, and the official docs page already answers the search. Worth a cheap prototype only if the program wants a small, testable, low-competition tool rather than a big audience.
- **If the program needs an unmet need with the registry's pull mechanism, this search did not find one in ComfyUI tooling.** The registry channel's measured base rate (12–19 % of new packs reach 1,000 downloads) is an average over packs that mostly duplicate each other; it does not imply that a new duplicate of a non-graph UI tool would beat it.
