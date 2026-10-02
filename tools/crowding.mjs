#!/usr/bin/env node
// Crowding check for one idea (L-027): how many repos already pursue it, and how did they do?
// Runs several GitHub searches phrased in the users' own words, merges the results, and prints
// the entrant count, the star distribution, the top entrants, and a sample of the bottom tier,
// so a niche is never called "empty" or "under-tried" without opening its 0-9-star repos.
//
//   node tools/crowding.mjs [--since YYYY-MM-DD] [--in name,description] "<phrase 1>" "<phrase 2>" ...
//   e.g. node tools/crowding.mjs --since 2026-01-01 "image editing skill" "imagemagick mcp" "background removal agent"
//
// Each phrase is searched as given, restricted to repos created on or after --since (default: one year
// ago) and to the fields in --in (default name,description; add readme only if the phrases are specific).
// Up to 200 results per phrase, sorted by stars. Forks are excluded by GitHub search. Read the bottom
// sample by hand: keyword matches include unrelated repos. GitHub search requires every word of a phrase
// to appear, so use short phrases of 2-3 keywords ("ollama coding benchmark", not a sentence) and several
// of them, in English and in the target users' languages (L-017). Auth: `gh auth token`, never printed.

import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); if (i < 0) return def; const v = args[i + 1]; args.splice(i, 2); return v; };
const since = opt('--since', new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10));
const fields = opt('--in', 'name,description');
const phrases = args;
if (!phrases.length) { console.error('usage: node tools/crowding.mjs [--since YYYY-MM-DD] [--in name,description] "<phrase>" ...'); process.exit(2); }
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Program repos hold no CJK text (Constitution §9), so CJK runs in descriptions become "[CJK]" and output can be pasted into research notes.
const CJK = [[0x2e80, 0x2fdf], [0x3000, 0x303f], [0x3040, 0x30ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0xff00, 0xffef]];
const isCJK = ch => { const c = ch.codePointAt(0); return CJK.some(([lo, hi]) => c >= lo && c <= hi); };
const clean = t => { let out = '', run = false; for (const ch of t) { if (isCJK(ch)) { if (!run) out += '[CJK]'; run = true; } else { out += ch; run = false; } } return out; };

async function search(q, page) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=100&page=${page}`;
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'earnstar-research' } });
    if (r.status === 403 || r.status === 429) { await sleep(20000); continue; }
    if (r.status === 422) return { total_count: 0, items: [] };
    if (r.ok) return r.json();
    await sleep(2000);
  }
  throw new Error(`search failed: ${q}`);
}

const repos = new Map();
const perPhrase = [];
for (const p of phrases) {
  const q = `${p} in:${fields} created:>=${since}`;
  let total = 0, got = 0;
  for (let page = 1; page <= 2; page++) {
    const j = await search(q, page);
    total = j.total_count;
    for (const it of j.items) {
      got++;
      const prev = repos.get(it.full_name);
      if (prev) prev.phrases.add(p);
      else repos.set(it.full_name, { name: it.full_name, stars: it.stargazers_count, created: it.created_at.slice(0, 10), pushed: it.pushed_at.slice(0, 10), owner: it.owner?.type ?? '', desc: clean(it.description ?? '').replace(/\s+/g, ' ').slice(0, 90), phrases: new Set([p]) });
    }
    if (j.items.length < 100) break;
    await sleep(2200);
  }
  perPhrase.push([p, total, got]);
  await sleep(2200);
}

const all = [...repos.values()].sort((a, b) => b.stars - a.stars);
const s = all.map(r => r.stars).sort((a, b) => a - b);
const pct = q => (s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0);
const at = t => all.filter(r => r.stars >= t).length;
const recent = all.filter(r => r.created >= new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10)).length;

console.log(`Crowding check, repos created since ${since}, searched in ${fields}\n`);
console.log('| Phrase | Matches | Read |\n|---|---|---|');
for (const [p, t, g] of perPhrase) console.log(`| ${p} | ${t} | ${g} |`);
console.log(`\nDistinct entrants read: ${all.length} (created in the last 90 days: ${recent}); stars: median ${pct(0.5)}, p90 ${pct(0.9)}, max ${s.at(-1) ?? 0}; with ≥ 10: ${at(10)}, ≥ 100: ${at(100)}, ≥ 1,000: ${at(1000)}`);
const line = r => `| ${r.stars} | ${r.created} | ${r.pushed} | ${r.owner} | ${r.name} | ${r.desc.replace(/\|/g, '/')} |`;
console.log('\nTop 12:\n\n| Stars | Created | Pushed | Owner | Repo | Description |\n|---|---|---|---|---|---|');
for (const r of all.slice(0, 12)) console.log(line(r));
const bottom = all.filter(r => r.stars < 10);
const step = Math.max(1, Math.floor(bottom.length / 12));
console.log(`\nBottom tier (< 10 stars: ${bottom.length} repos; every ${step}th shown, newest first within the sample):\n\n| Stars | Created | Pushed | Owner | Repo | Description |\n|---|---|---|---|---|---|`);
for (const r of bottom.filter((_, i) => i % step === 0).slice(0, 12).sort((a, b) => b.created.localeCompare(a.created))) console.log(line(r));
