#!/usr/bin/env node
// Snapshots of a platform wave: every repo matching a GitHub search, with its stars, saved per run so that later
// sessions can see who is gaining and how fast, without per-repo star-history calls.
//
//   node tools/wave.mjs <name> "<search qualifiers>" [--top N]
//   e.g. node tools/wave.mjs mods '"claude code" mod created:>=2026-09-01'
//
// Writes history/research/waves/<name>/<UTC stamp>.json ({ query, taken_utc, total_count, repos: [[full_name,
// stars, created_at, pushed_at, owner_type, description]] }) and prints thresholds, the top repos, and, when an
// earlier snapshot of the same name exists, the top gainers since then. The search API returns at most 1,000
// results per query; the tool says when a query exceeds that. Auth: `gh auth token`, never printed.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const topIdx = args.indexOf('--top');
const TOP = topIdx >= 0 ? Number(args.splice(topIdx, 2)[1]) : 15;
const [name, query] = args;
if (!name || !query || !/^[a-z0-9-]+$/.test(name)) {
  console.error('usage: node tools/wave.mjs <name: a-z0-9-> "<search qualifiers>" [--top N]');
  process.exit(2);
}
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function page(p) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=100&page=${p}`;
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'earnstar-research' } });
    if (r.status === 403 || r.status === 429) { await sleep(20000); continue; }
    if (r.status === 422) return { total_count: 0, items: [] };
    if (r.ok) return r.json();
    await sleep(2000);
  }
  throw new Error(`search failed on page ${p}`);
}

const repos = [];
let total = 0;
for (let p = 1; p <= 10; p++) {
  const j = await page(p);
  total = j.total_count;
  for (const it of j.items) {
    repos.push([it.full_name, it.stargazers_count, it.created_at, it.pushed_at, it.owner?.type ?? '', (it.description ?? '').slice(0, 140)]);
  }
  if (j.items.length < 100 || repos.length >= total) break;
  await sleep(2200);
}

const taken = new Date().toISOString();
const dir = join('history', 'research', 'waves', name);
mkdirSync(dir, { recursive: true });
const earlier = readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const file = join(dir, `${taken.slice(0, 16).replace(/:/g, '')}Z.json`);
writeFileSync(file, JSON.stringify({ query, taken_utc: taken, total_count: total, repos }, null, 0) + '\n');

const at = t => repos.filter(r => r[1] >= t).length;
console.log(`Wave "${name}" at ${taken}\nQuery: ${query}\nRepos: ${total}${total > 1000 ? ' (search returns only the first 1,000)' : ''}; with ≥ 10 stars ${at(10)}, ≥ 100 ${at(100)}, ≥ 500 ${at(500)}, ≥ 1,000 ${at(1000)}\nSaved: ${file}\n`);
console.log(`Top ${TOP} by stars:`);
for (const r of repos.slice(0, TOP)) console.log(`  ${String(r[1]).padStart(7)}  ${r[2].slice(0, 10)}  ${r[0]}  ${r[5].slice(0, 80)}`);

if (earlier.length) {
  const prev = JSON.parse(readFileSync(join(dir, earlier[earlier.length - 1]), 'utf8'));
  const days = Math.max((Date.parse(taken) - Date.parse(prev.taken_utc)) / 864e5, 1e-6);
  const before = new Map(prev.repos.map(r => [r[0], r[1]]));
  const gains = repos.map(r => [r[0], r[1] - (before.get(r[0]) ?? 0), before.has(r[0]), r[1]]).sort((a, b) => b[1] - a[1]);
  console.log(`\nSince ${prev.taken_utc} (${days.toFixed(2)} days; ${prev.total_count} → ${total} repos), top ${TOP} gainers:`);
  for (const [n, g, seen, s] of gains.slice(0, TOP)) console.log(`  +${String(g).padStart(6)}  (${(g / days).toFixed(1)}/day)  ${s} now  ${n}${seen ? '' : '  [new]'}`);
}
