#!/usr/bin/env node
// Archetype and audience mix by star tier, to turn the winners-only sample into conversion rates (foundational study).
//
//   node history/research/foundation/tiers.mjs collect [days] [seed]   repos created on random days of the window, in the tiers
//                                                                     10-99 and 100-999 stars, plus owner followers for a subsample
//   node history/research/foundation/tiers.mjs report                  validate the keyword classifier on the manual labels, then compare tiers
//
// The keyword classifier is a coarse proxy; its agreement with the manual labels is reported next to the results.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'foundation');
const OUT = path.join(LAB, 'tiers.json');
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function gh(p) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(`https://api.github.com${p}`, { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'earnstar-research', 'X-GitHub-Api-Version': '2022-11-28' } });
    if (r.status === 403 || r.status === 429) { await sleep(20000); continue; }
    if (r.ok) return r.json();
    if (r.status === 404 || r.status === 422) return null;
    await sleep(2000);
  }
  return null;
}
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// Coarse archetype classifier. Codes as in archetypes.json, with AT and AA merged into AI (they cannot be told apart by keywords).
export function classify(r) {
  const s = `${r.full_name} ${r.description || ''} ${(r.topics || []).join(' ')}`.toLowerCase();
  const has = re => re.test(s);
  if (has(/2api|free[- ]?(api|token|account|sms)|vpn|v2ray|clash|trojan|airport|jichang|bypass|crack|keygen|cheat|account pool|auto[- ]?reg|proxy (pool|panel)|whitelist|unlock|jailbreak|patcher|patches|mod(ded|ified) version|watermark remov/)) return 'GR';
  // Skills: judged on the name and description only, because tools often carry skill topics too.
  const name = r.full_name.toLowerCase(), desc = (r.description || '').toLowerCase();
  if (/skill|prompt/.test(name) || /\b(a|an|agent|claude|claude code|codex|ai) skills?\b|skills? (for|that|to|collection)|collection of (agent )?skills|plugin for claude|\bprompts?\b|agents\.md|claude\.md|subagents|slash commands|meta-prompt/.test(desc)) return 'SK';
  if (has(/awesome|curated|a list of|guide|tutorial|course|learn|roadmap|handbook|cheat ?sheet|interview|study|notes|resources|book\b|lessons|from scratch|curriculum/)) return 'CR';
  if (has(/\b(cvpr|iccv|eccv|iclr|icml|neurips|nips|aaai|acl|emnlp|siggraph|www|kdd)\b|official (code|implementation|pytorch)|paper|diffusion|world model|foundation model|vla\b|dataset|benchmark|pretrain|fine-?tun/)) return 'ML';
  if (has(/pentest|penetration|security|vulnerab|exploit|osint|\bcve\b|red ?team|malware|forensic|reverse engineer/)) return 'SEC';
  if (has(/\bmcp\b|agent|llm|\bai\b|claude|codex|gpt|openai|chatgpt|gemini|deepseek|qwen|rag\b|langchain|inference|cursor|copilot|opencode|openclaw|vibe[- ]coding|ollama|tts|speech|transcri/)) return 'AI';
  if (has(/esp32|firmware|arduino|raspberry|flipper|hardware|pcb|keyboard|3d[- ]print|home[- ]?assistant|esphome/)) return 'HW';
  if (has(/self[- ]?host|homelab|alternative to|\bdocker\b|dashboard|server for|web ui|webui/)) return 'SH';
  if (has(/macos|menu ?bar|android|\bios\b|iphone|windows app|desktop app|tray|screen recorder|clipboard|window manager/)) return 'DA';
  if (has(/game|\bfun\b|toy|simulat|pixel|art\b|animation|visuali[sz]/)) return 'FUN';
  if (has(/\bcli\b|terminal|tui|library|framework|sdk|neovim|nvim|vscode|\bgit\b|compiler|database|parser|runtime|api\b|developer|devtool|kubernetes|k8s|lint|\bcss\b|react|component/)) return 'DT';
  return 'OTH';
}

async function collect(days = 6, seed = 7) {
  const start = Date.parse('2025-09-25T00:00:00Z'), end = Date.parse('2026-06-27T00:00:00Z');
  const rand = rng(seed), picked = new Set();
  while (picked.size < days) picked.add(new Date(start + Math.floor(rand() * ((end - start) / 86400e3 + 1)) * 86400e3).toISOString().slice(0, 10));
  const rows = [];
  for (const day of [...picked].sort()) {
    for (const [tier, range] of [['10-99', '10..99'], ['100-999', '100..999']]) {
      for (let page = 1; page <= 10; page++) {
        const r = await gh(`/search/repositories?q=${encodeURIComponent(`created:${day} stars:${range} fork:false`)}&per_page=100&page=${page}`);
        await sleep(2200);
        if (!r?.items?.length) break;
        for (const it of r.items) rows.push({ tier, day, full_name: it.full_name, owner: it.owner.login, owner_type: it.owner.type, stars: it.stargazers_count,
          language: it.language, topics: it.topics, description: it.description });
        if (r.items.length < 100) break;
      }
      console.error(`${day} ${tier}: ${rows.length}`);
    }
  }
  // Owner followers for up to 300 random repos per tier.
  for (const tier of ['10-99', '100-999']) {
    const g = rows.filter(r => r.tier === tier).map(r => [rand(), r]).sort((a, b) => a[0] - b[0]).slice(0, 300).map(x => x[1]);
    for (let i = 0; i < g.length; i += 8) await Promise.all(g.slice(i, i + 8).map(async r => { r.owner_followers = (await gh(`/users/${r.owner}`))?.followers ?? null; }));
  }
  fs.writeFileSync(OUT, JSON.stringify({ days: [...picked].sort(), rows }, null, 1));
  console.log(`tiers: ${rows.length} repos on ${picked.size} days`);
}

function report() {
  const arch = JSON.parse(fs.readFileSync(path.join(HERE, 'archetypes.json'), 'utf8'));
  const pop = JSON.parse(fs.readFileSync(path.join(LAB, 'population.json'), 'utf8'));
  const sample = JSON.parse(fs.readFileSync(path.join(LAB, 'sample.json'), 'utf8'));
  const byName = new Map(pop.map(r => [r.full_name, r]));
  const merge = c => (c === 'AT' || c === 'AA' ? 'AI' : c);
  const labelled = Object.entries(arch).map(([n, c]) => [byName.get(n), merge(c)]).filter(x => x[0]);
  const agree = labelled.filter(([r, c]) => classify(r) === c).length;
  const { days, rows } = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const top = pop.map(r => ({ ...r, tier: '>= 1000' }));
  const tiers = [['10-99', rows.filter(r => r.tier === '10-99')], ['100-999', rows.filter(r => r.tier === '100-999')], ['>= 1000', top]];
  const codes = ['AI', 'SK', 'CR', 'ML', 'DT', 'SH', 'DA', 'SEC', 'GR', 'FUN', 'HW', 'OTH'];
  const L = [];
  L.push(`Random creation days (${days.length}): ${days.join(', ')}. Tier 10-99: ${tiers[0][1].length} repos; 100-999: ${tiers[1][1].length}; >= 1000: the full population (${top.length}).`);
  L.push(`Keyword classifier agreement with the 500 manual labels (AT and AA merged into AI): ${Math.round((100 * agree) / labelled.length)} %.`, '');
  L.push('| Archetype (keyword proxy) | 10-99 | 100-999 | >= 1000 | Lift, >= 1000 vs 10-99 |', '|---|---|---|---|---|');
  for (const c of codes) {
    const sh = tiers.map(([, g]) => g.filter(r => classify(r) === c).length / g.length);
    L.push(`| ${c} | ${(100 * sh[0]).toFixed(1)} % | ${(100 * sh[1]).toFixed(1)} % | ${(100 * sh[2]).toFixed(1)} % | ${sh[0] ? (sh[2] / sh[0]).toFixed(2) : '–'} |`);
  }
  // Conversion estimates. Tier sizes for the window from GitHub search on 2026-09-25 (S016): >= 10 stars 193,857;
  // >= 100: 26,604; >= 1,000: 3,246. Each archetype's count per tier = tier size x its share in that tier.
  const N10 = 193857 - 26604, N100 = 26604 - 3246, N1000 = 3246;
  const other = tiers.map(([, g]) => g.filter(r => classify(r) === 'OTH').length / g.length);
  L.push('', 'Estimated conversion for repos with >= 10 stars, by archetype (OTH excluded from the normalized lift):', '');
  L.push('| Archetype | Normalized lift (>= 1000 vs 10-99) | P(>= 100 given >= 10) | P(>= 1000 given >= 10) |', '|---|---|---|---|');
  for (const c of codes.filter(c => c !== 'OTH')) {
    const sh = tiers.map(([, g]) => g.filter(r => classify(r) === c).length / g.length);
    const n = [sh[0] * N10, sh[1] * N100, sh[2] * N1000], tot = n[0] + n[1] + n[2];
    const lift = sh[0] ? (sh[2] / (1 - other[2])) / (sh[0] / (1 - other[0])) : 0;
    L.push(`| ${c} | ${lift.toFixed(2)} | ${((100 * (n[1] + n[2])) / tot).toFixed(1)} % | ${((100 * n[2]) / tot).toFixed(2)} % |`);
  }
  L.push(`| All | 1.00 | ${((100 * 26604) / 193857).toFixed(1)} % | ${((100 * 3246) / 193857).toFixed(2)} % |`);
  const f = g => g.filter(r => r.owner_followers !== null && r.owner_followers !== undefined);
  const smallFrac = g => { const x = f(g); return x.filter(r => r.owner_type === 'User' && r.owner_followers < 100).length / x.length; };
  const s = [smallFrac(tiers[0][1]), smallFrac(tiers[1][1]), smallFrac(sample)];
  const sn = [s[0] * N10, s[1] * N100, s[2] * N1000], stot = sn[0] + sn[1] + sn[2];
  const ln = [(1 - s[0]) * N10, (1 - s[1]) * N100, (1 - s[2]) * N1000], ltot = ln[0] + ln[1] + ln[2];
  L.push('', `Owners that are users with < 100 followers, given >= 10 stars: P(>= 100) ${((100 * (sn[1] + sn[2])) / stot).toFixed(1)} %, P(>= 1000) ${((100 * sn[2]) / stot).toFixed(2)} %. All other owners: P(>= 100) ${((100 * (ln[1] + ln[2])) / ltot).toFixed(1)} %, P(>= 1000) ${((100 * ln[2]) / ltot).toFixed(2)} %.`);
  const smallShare = g => { const x = f(g); return x.length ? `${Math.round((100 * x.filter(r => r.owner_type === 'User' && r.owner_followers < 100).length) / x.length)} % (n ${x.length})` : '–'; };
  L.push('', `Owners that are users with < 100 followers: 10-99 tier ${smallShare(tiers[0][1])}; 100-999 tier ${smallShare(tiers[1][1])}; >= 1000 sample ${smallShare(sample)}.`);
  const org = g => `${Math.round((100 * g.filter(r => r.owner_type === 'Organization').length) / g.length)} %`;
  L.push(`Organization-owned: 10-99 ${org(tiers[0][1])}; 100-999 ${org(tiers[1][1])}; >= 1000 ${org(top)}.`);
  console.log(L.join('\n'));
}

const [cmd, a1, a2] = process.argv.slice(2);
if (cmd === 'collect') await collect(Number(a1) || 6, Number(a2) || 7);
else if (cmd === 'report') report();
else if (cmd) { console.error('usage: tiers.mjs collect [days] [seed] | report'); process.exit(2); }
