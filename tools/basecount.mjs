#!/usr/bin/env node
// Base rates including the misses (L-023): how many repos matching a GitHub search reach each star threshold.
//
//   node tools/basecount.mjs "<search qualifiers>" [thresholds]
//   e.g. node tools/basecount.mjs '"opus 5.5" created:2026-09-21..2026-09-27' 0,10,100,500,1000
//
// Prints the count at each threshold and the share of repos with >= 10 stars that reach each higher one, so a
// reference class is never judged by its winners alone. Uses the search API (30 requests per minute; this tool
// pauses between calls). Auth: `gh auth token`, never printed.

import { execFileSync } from 'node:child_process';

const [query, th = '0,10,100,500,1000'] = process.argv.slice(2);
if (!query) { console.error('usage: node tools/basecount.mjs "<search qualifiers>" [thresholds]'); process.exit(2); }
const thresholds = th.split(',').map(Number).filter(n => Number.isFinite(n)).sort((a, b) => a - b);
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function count(q) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=1`, { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'earnstar-research' } });
    if (r.status === 403 || r.status === 429) { await sleep(20000); continue; }
    if (r.ok) return (await r.json()).total_count;
    await sleep(2000);
  }
  return null;
}

const counts = [];
for (const t of thresholds) {
  counts.push([t, await count(`${query} stars:>=${t}`)]);
  await sleep(2200);
}
const base10 = counts.find(([t]) => t === 10)?.[1];
console.log(`Query: ${query}\n\n| Stars ≥ | Repos | Share of repos with ≥ 10 |\n|---|---|---|`);
for (const [t, n] of counts) console.log(`| ${t} | ${n ?? 'error'} | ${base10 && t >= 10 && n != null ? `${((100 * n) / base10).toFixed(1)} %` : ''} |`);
