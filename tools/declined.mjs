#!/usr/bin/env node
// Watch for fresh demand that maintainers decline (S021, history/research/earnstar_1/demand-first.md): feature requests
// closed as "not planned", or labelled as extension or plugin ideas, with many 👍, in the last N days. The first credible
// standalone answer to such a request tends to take most of the stars, so speed matters; run this at each session open.
//
//   node tools/declined.mjs [--days 14] [--min 30]
//
// Prints two tables: issues anywhere on GitHub closed as not planned in the window with at least --min 👍, and recent
// issues in watched repos that carry an extension or plugin label. Before acting on any row, run tools/crowding.mjs on it
// and read the thread for linked workarounds. A reply in the thread is a third-party write (Constitution §3B).
// Auth: `gh auth token`, never printed.

import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i < 0 ? def : Number(args[i + 1]); };
const DAYS = opt('--days', 14);
const MIN = opt('--min', 30);
const since = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Repos whose maintainers label requests that a plugin or extension could meet (S021 survey).
const WATCH = [
  ['zed-industries/zed', 'label:"potential extension"'],
  ['cli/cli', 'label:extension-idea'],
  ['advplyr/audiobookshelf', 'label:"possible plugin"'],
  ['microsoft/PowerToys', 'label:"Idea-New PowerToy"'],
  ['microsoft/vscode', 'label:*out-of-scope'],
];

async function search(q) {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=reactions-%2B1&order=desc&per_page=50`;
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'earnstar-research' } });
    if (r.status === 403 || r.status === 429) { await sleep(20000); continue; }
    if (r.status === 422) return { items: [] };
    if (r.ok) return r.json();
    await sleep(2000);
  }
  throw new Error(`search failed: ${q}`);
}
// Program repos hold no CJK text (Constitution §9), so CJK runs in titles become "[CJK]" and output can be pasted into notes.
const CJK = [[0x2e80, 0x2fdf], [0x3000, 0x303f], [0x3040, 0x30ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0xff00, 0xffef]];
const isCJK = ch => { const c = ch.codePointAt(0); return CJK.some(([lo, hi]) => c >= lo && c <= hi); };
const clean = t => { let out = '', run = false; for (const ch of t) { if (isCJK(ch)) { if (!run) out += '[CJK]'; run = true; } else { out += ch; run = false; } } return out; };
const repoOf = it => it.repository_url.split('/').slice(-2).join('/');
const row = it => `| ${it.reactions?.['+1'] ?? 0} | ${it.created_at.slice(0, 10)} | ${(it.closed_at ?? '').slice(0, 10)} | ${repoOf(it)}#${it.number} | ${clean(it.title ?? '').replace(/\|/g, '/').slice(0, 90)} |`;

console.log(`Declined demand, window ${since} .. today, at least ${MIN} 👍\n`);
const notPlanned = await search(`is:issue reason:"not planned" closed:>=${since} reactions:>=${MIN}`);
console.log('Closed as not planned (all of GitHub):\n\n| 👍 | Created | Closed | Issue | Title |\n|---|---|---|---|---|');
for (const it of notPlanned.items) console.log(row(it));
await sleep(2500);

console.log('\nWatched repos, extension or plugin labels, created in the window:\n\n| 👍 | Created | Closed | Issue | Title |\n|---|---|---|---|---|');
for (const [repo, label] of WATCH) {
  const j = await search(`repo:${repo} is:issue ${label} created:>=${since}`);
  for (const it of j.items) console.log(row(it));
  await sleep(2500);
}
