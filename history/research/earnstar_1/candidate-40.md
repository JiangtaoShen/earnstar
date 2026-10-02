# Candidate #40: give your coding agent an image editor

_**Status: knocked out by the independent critique (S021, `critique.md`): the same product by ffmpeg-skill's author has 1★.** S021, 2026-10-02. Deep dive to the Selection Gate's standard (`playbook/research.md` §1.4), written after the small-owner study (`smallwin.md`) and the ADR-003 critique (`critique.md`), so it applies the new method rules: a reference class from the last 6 months with a same-period control, needs checked against what already exists, and searches in the users' own words and languages (L-017, L-026)._

## 1. The idea in one paragraph
An agent skill plus a set of local, deterministic image tools that coding agents (Claude Code, Codex, Cursor, any agent that reads `SKILL.md`, and MCP clients) call to edit images the way a careful human would: inspect, edit, then verify the result (dimensions, file size, a perceptual similarity score, and a look at the output, since these agents can read images). Typical jobs: web assets (favicon and app-icon sets, social cards, responsive `srcset` sizes, WebP/AVIF at a quality target), product shots (background removal, smart crop to an aspect ratio, upscaling), documentation (annotate screenshots with boxes and arrows, blur secrets and faces, stitch and frame screenshots), and batch work (resize, convert, strip metadata, contact sheets, visual diffs). No cloud, no API keys, no image model to pay for; optional local models for background removal and upscaling. The README leads with a gallery of before/after pairs that one script rebuilds from scratch.

## 2. Reference class with a same-period control
Skills that give agents a local tool or creative domain, created 2026-03-01..09-10 (`tools/basecount.mjs '<tool> skill in:name,description created:2026-03-01..2026-09-10' 0,10,100,1000`, run 2026-10-02):

| Tool | Repos | ≥ 10 | ≥ 100 | ≥ 1,000 |
|---|---|---|---|---|
| ffmpeg | 358 | 29 | 6 | 2 |
| blender | 255 | 31 | 11 | 2 |
| remotion | 1,301 | 71 | 17 | 4 |
| godot | 248 | 18 | 6 | 1 |
| kicad | 82 | 7 | 2 | 1 |
| manim | 82 | 8 | 2 | 0 |
| openscad | 39 | 3 | 0 | 0 |
| pandoc | 41 | 1 | 1 | 0 |
| imagemagick | 13 | 1 | 0 | 0 |
| **Pooled** | | **169** | **45 (26.6 %)** | **10 (5.9 %)** |
| Control: all `skill` repos, same window | 623,331 | 12,026 | 2,253 (18.7 %) | 352 (2.9 %) |

Among repos that reach 10 stars, tool skills reach 1,000 about twice as often as skills in general. The small-owner rate in the same period is lower (0.54 % of all small-user repos with ≥ 10 stars reach 1,000, `smallwin.md` §1); skills are over-represented among small-owner winners 2.9× (`smallwin.md` §2). Image editing is an **under-tried** niche (13 ImageMagick skills, one above 10 stars), not one where many tried and failed (the pattern that sank #10, #13, #21, #32).

## 3. Landscape (stars on 2026-10-02)
| Repo | Stars | Created | What | Gap |
|---|---|---|---|---|
| kajisho5/ffmpeg-skill | 1,449 | 2026-09-03 | 42 FFmpeg tools + skill + MCP; CI on FFmpeg 5.1–9; 53 reproducible demos; npm (17,790 downloads in September) | Video and audio only; the model to follow for images |
| wuyoscar/GPT-Image2-Skill | 5,621 | 2026-04-22 | Generative images through a paid model | Generates, does not edit deterministically; needs an API |
| s1dashu/ip-as-logo-skill | 5,751 | 2026-07..09 | Logo generation (image model) | Generative |
| ningzimu/image-to-editable-ppt-skill | 2,753 | 2026-05-21 | Images to editable slides | Different job |
| Anionex/agent-vision-toolkit | 1,216 | 2026-08-01 | Image understanding for text-only models (OCR, Q&A, UI restoration) | Reads images, does not edit them |
| artokun/comfyui-mcp | 778 | 2026-02-15 | ComfyUI from agents | Needs ComfyUI and a GPU workflow; generative |
| alonw0/web-asset-generator | 511 | 2025-10-21 | Favicons, app icons, social images from a logo, text, or emoji (skill) | One slice of the job; slow growth (17 in week 1) |
| stevysmith/og-image-skill | 99 | 2026-01-11 | Open Graph images | One slice |
| MussaCharles/claude-code-image-sanitizer | 26 | 2025-11-30 | Resize images for Claude Code's limits | One slice |
| YaddyVirus/darktable-mcp | 20 | 2026-05-06 | Photo editing via darktable | Needs darktable |
| BoomLinkAi/image-worker-mcp | 18 | 2025-05-23 | sharp-based MCP | Thin wrapper |
| xiaowu89/skill-matting | 16 | 2026-07-30 | Background removal skill | One slice |
| AeyeOps/mcp-imagemagick | 15 | 2025-06-17 | ImageMagick MCP | Thin wrapper |
| piephai/mcp-image-optimizer | 12 | 2025-08-08 | Optimization MCP | One slice |
| greatSumini/sharp-mcp | 11 | 2025-11-28 | sharp MCP | Thin wrapper |
| ramon-webdevpro-nl/claude-skills (ImageMagick, Inkscape) | 10 | 2026-04-21 | Personal skills | Not a product |
| Apothic-AI/lucida-image-background-remover-skill | 6 | 2026-07-20 | Background removal | One slice |

Searches: "imagemagick mcp", "sharp mcp image", "pillow mcp", "image resize mcp", "image optimization skill", "favicon skill", "og image skill", "image editing skill", "background removal skill", "photo editing claude", "image toolkit agent", and in Chinese and Japanese ("image processing skill", "image editing skill"): nothing relevant above 16 stars in those languages. Anthropic's own skills (anthropics/skills) include document, art, and design skills but no image-editing toolkit.

## 4. Case studies (what drove the stars)
1. **kajisho5/ffmpeg-skill** (40 followers; 2026-09-03): 944 stars in week 1, peak 414 on day 5, 1,449 in a month; 119 forks; no HN story; source of the spike not visible. README: one sentence ("Give your coding agent a video editor"), a one-line `npx` install, a 2×2 GIF grid of before/after pairs with the exact command under each, "All 53 demos … generated from synthetic footage by one script", CI badges for five FFmpeg versions.
2. **htdt/godogen** (142 followers): "Claude Code skills that build complete Godot games"; HN 337 points on 2026-03-16 brought 2,575 stars in 30 days; a second wave peaked at 544 on 2026-08-25; 7,037 now, 379 in the last 30 days. The output (playable games) is the demo.
3. **EverettFish/holo-card-studio** (20 followers; 2026-09-07): Blender skill for holographic cards; 1,469 in week 1, peak 607 on day 1; 1,856 now. Visual output as the hook.
4. **achimala/dream-loop** (128 followers; 2026-09-07): Blender skill; 968 in week 1; 1,609 now.
5. **Pan-Chera/Multi-Agent-CAD** (24 followers; 2026-07-30): 4 stars in week 1, then 909 in 30 days (peak 262 on day 7); 1,013 now. CAD with agents.
6. **aklofas/kicad-happy** (54 followers; 2026-03-09): 56 in week 1, 139 in 30 days, then steady growth to 1,324 (240 in the last 30 days): the slow, organic path of a tool used daily.
7. **alonw0/web-asset-generator** (28 followers; 2025-10-21): 17 in week 1, 62 in 30 days, 511 now: the nearest slice of this idea grows slowly without a showcase.

Reading: in this archetype, small owners win with a capability whose result is visible at a glance, a gallery that proves it, and a one-line install; a careful, tested toolset (ffmpeg-skill, kicad-happy) can also keep growing after the first burst. The ignition source is mostly invisible (`smallwin.md` §3), which is the program's main risk (§9).

## 5. Demand signals
1. **Media-editing skills for agents are wanted now**: ffmpeg-skill gained 1,449 stars and 17,790 npm downloads in its first month (September 2026).
2. **Developers already ask agents for image assets**: web-asset-generator (511), og-image-skill (99), app-preview-craft-skill (an App Store screenshot skill, Show HN 2026-09-17), and the claude-code-image-sanitizer niche (26) each cover one slice; generative logo and image skills are among the largest small-owner winners (ip-as-logo-skill 5,751; GPT-Image2-Skill 5,621), showing that image work is a top use of agents.
3. **Visual output wins**: 49 of the 133 small-owner skill winners of July–September 2026 produce images, posters, video, or diagrams (`smallwin.md` §3).
4. **Oversized images break agent sessions** ([#13480](https://github.com/anthropics/claude-code/issues/13480), 90 👍, closed; [#2939](https://github.com/anthropics/claude-code/issues/2939), 63 👍, open), so preparing images for an agent (downscale, crop, stitch) is a felt problem, though the engine now scales some images itself (changelog).
5. **General developer volume**: image handling libraries are among the most-installed packages (e.g., sharp), so the jobs are common; this is context, not agent-specific demand.

Honest limit: no issue thread asks for "an image editor for agents" by name; the demand is shown by adjacent winners and slices, as it was for ffmpeg-skill before it launched.

## 6. Differentiation
"Why this over a generative image skill, an ImageMagick MCP, or asking the agent to improvise?"
- **Generative skills** (GPT-Image2-Skill, logo skills) create new pictures with a paid model; this edits the user's own images exactly, locally, for free, and leaves the original untouched.
- **ImageMagick/sharp MCP servers** (≤ 18★) expose raw commands; this gives the agent a workflow (inspect → edit → verify) and tested tools for whole jobs (an icon set, a social card, a cleaned screenshot), with measurable checks.
- **Improvised commands**: a frontier agent can improvise a good edit, but slowly and expensively (S021 baseline: 38 turns and about $1 for one cutout without a model, against a few tool calls); every tool here is tested on a fixed corpus in CI, so batch jobs are fast and repeatable. (Claims that agents get flags wrong must be measured before they are made.)

One sentence: **"Give your coding agent an image editor: tested local tools for the image jobs developers actually do (icons, social cards, screenshots, cutouts, web formats), with a before/after gallery you can rebuild yourself, and no API keys."**

## 7. Distribution plan (channels usable today)
- **README as the launch**: the ffmpeg-skill pattern (one-sentence value, `npx`/`uvx` one-line install, a gallery grid with the exact command under each pair, a "rebuild every demo with one script" claim, CI badges).
- **Passive discovery**: GitHub search and topics (`agent-skills`, `claude-code`, `codex`, `mcp`, `image-processing`, `imagemagick`, `background-removal`, `favicon`); skills.sh through genuine `npx skills add` installs (a weak channel, dominated by brands); npm or PyPI search; a primary language (Python or TypeScript) so a spike can reach that language's Trending list (L-011).
- **DEV**: one article that teaches (how to make an agent verify its own image edits: perceptual metrics plus looking at the result), with this as the example. Tags with readers: #ai (median top-30 reactions over 90 days 127), #productivity (105), #opensource (44), #python or #typescript (38).
- **Lists (B-class, outbox)**: active lists of agent skills and MCP servers that accept new entries meeting their criteria (to be checked one by one at launch), as follow-on channels (L-009).

## 8. Feasibility (plan; spike pending)
Everything runs on this machine: Python with Pillow and NumPy (present in an owner environment; a project-local `earnstar-*` uv environment avoids touching it), optional ONNX Runtime with an Apache-2.0 or MIT background-removal model (e.g., U²-Net or BiRefNet) and a BSD-licensed upscaler (Real-ESRGAN), which run on the CPU or the GTX 1660 Ti. Riskiest parts for the spike (≤ 4 h): install size and speed of the optional models on Windows; quality of background removal on varied inputs; whether an agent, given the skill, picks the right tool and verifies its result (a few headless runs within `workstation.md` §5).

**Spike result (S021, 08:05–08:15, `lab/spike/img/`)**: a project-local uv environment (`earnstar-imgspike`, Python 3.12, Pillow 12.3, NumPy, ONNX Runtime; 100 MB on D:) and two background-removal models from the rembg project's releases (U²-Net-p, 4.6 MB, and IS-Net general-use, 179 MB; both Apache-2.0), run directly through ONNX Runtime on the CPU with Pillow and NumPy only (no rembg package). Test images: two NASA photos in the public domain (Wikimedia Commons: "Buzz salutes the U.S. Flag", "Sally Ride (1984)"). Results: the astronaut on the Moon was cut out cleanly by the small model in 0.11 s inference (0.5 s end to end; the flag correctly excluded); on the studio portrait the small model left the shuttle model and table half-visible, while IS-Net gave a clean cutout with hair detail in 0.62 s. The developer verified both by looking at the before/after sheets, which is the self-check an agent can do too (escalate to the larger model when residue is visible). The riskiest technical part (local cutout quality and speed on Windows without a GPU) is retired; the other operations are standard Pillow. Not yet tested: whether an agent given the skill picks the right tool and verifies its work (headless runs), and installs on macOS and Linux (CI).

**Agent baseline without the skill (S021, 08:08–08:15; two headless runs, Claude Opus 5.5, `--permission-mode dontAsk`, only the spike's Python allowed, no installs)**: task "remove the background from a studio portrait, save a transparent PNG, check your result". Run 1 (`lab/eval/img1/`, inside the lab tree): the agent found the IS-Net model the spike had downloaded two folders up, kept the largest connected region, checked alpha statistics, spot pixels, and the image by eye, and fixed a slightly see-through interior it caught itself: 9 turns, 55 s, $0.44 API-equivalent. Run 2 (a scratch folder with no model; downloads forbidden): it traced an outline by hand from a gridded copy, refined the edge with color models, and caught and fixed four errors by viewing the result: 38 turns, 295 s, $1.02. **Both results are clean** (side-by-side sheet viewed by the developer). So a frontier agent does not need to be taught the workflow, and its improvised result can match a model's on one image; the skill's value is speed, cost, and repeatability (a few turns instead of 38; batch jobs; deterministic tools), not capability. This weakens the "quality gap" claim in §6 and must be reflected in the scoring (differentiation) and the README's proof (turns, time, and cost per job, measured).

## 9. Risks
1. **Ignition**: like most small-owner winners, it may need an outside spark the program cannot make (L-007, `smallwin.md` §3). Mitigation: a gallery strong enough to be shared by others; a DEV article; timing a release near a relevant news hook if one appears.
2. **A large incumbent or vendor moves**: ffmpeg-skill's author adds images, or Anthropic adds an image skill to anthropics/skills. Mitigation: ship quickly and broadly; cross-agent support.
3. **"Agents can already do this"**: if the README does not show a clear quality gap against improvised commands, it reads as a thin wrapper. Mitigation: show failure cases of improvised edits (lost alpha, rotated EXIF, wrong color profile) next to the tool's result, measured.
4. **Model and dependency weight**: optional models must download on demand, with licenses recorded in THIRD_PARTY_NOTICES.
5. **Test images**: only generated images or public-domain and CC0 photos, recorded with their sources (Constitution §7).
