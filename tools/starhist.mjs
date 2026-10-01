#!/usr/bin/env node
// Star-history summary for any public GitHub repos, for research (read-only).
//
//   node tools/starhist.mjs OWNER/REPO [OWNER/REPO ...]          Markdown table
//   node tools/starhist.mjs --json OWNER/REPO [...]               JSON lines
//
// Columns: owner followers, created, first star, stars in the first 7 and 30 days after the first star, the peak day,
// the total from the history, and the last 30 days. Source: GET /repos/{owner}/{repo}/stargazers/history
// (API version 2026-03-10; weekly buckets with daily counts, weeks start Sunday UTC), which works for any public repo
// since the stargazer list itself became private in July 2026 (L-004). Auth: `gh auth token`, never printed.

import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const asJson = args[0] === '--json';
const repos = asJson ? args.slice(1) : args;
if (!repos.length) { console.error('usage: node tools/starhist.mjs [--json] OWNER/REPO [...]'); process.exit(2); }
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function gh(path, version = '2022-11-28') {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(`https://api.github.com${path}`, { headers: { Authorization: `Bearer ${TOKEN}`, 'X-GitHub-Api-Version': version, 'User-Agent': 'earnstar-research' } });
    if (r.status === 404) return null;
    if (r.status === 403 || r.status === 429) { await sleep(15000); continue; }
    if (r.ok) return r.json();
    await sleep(1500);
  }
  return null;
}

async function summary(full) {
  const info = await gh(`/repos/${full}`);
  if (!info) return { repo: full, error: 'not found' };
  const user = await gh(`/users/${info.owner.login}`);
  const weeks = [];
  for (let page = 1; page <= 100; page++) {
    const w = await gh(`/repos/${full}/stargazers/history?per_page=30&page=${page}`, '2026-03-10');
    if (!Array.isArray(w) || !w.length) break;
    weeks.push(...w);
    if (w.length < 30) break;
  }
  const days = [];
  for (const w of weeks) w.days.forEach((c, i) => days.push([new Date(w.week * 1000 + i * 86400e3).toISOString().slice(0, 10), c]));
  days.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const first = days.find(d => d[1] > 0);
  const after = first ? days.filter(d => d[0] >= first[0]) : [];
  const sum = (xs, n) => xs.slice(0, n).reduce((s, d) => s + d[1], 0);
  const peak = days.reduce((m, d) => (d[1] > m[1] ? d : m), ['', 0]);
  return {
    repo: full, followers: user?.followers ?? null, owner_type: info.owner.type, created: info.created_at.slice(0, 10),
    stars: info.stargazers_count, first_star: first?.[0] ?? null, week1: sum(after, 7), d30: sum(after, 30),
    peak_day: peak[0] || null, peak: peak[1], total: days.reduce((s, d) => s + d[1], 0), last30: sum([...days].reverse(), 30),
  };
}

const rows = [];
for (const r of repos) rows.push(await summary(r));
if (asJson) for (const r of rows) console.log(JSON.stringify(r));
else {
  console.log('| Repo | Owner followers | Created | First star | Week 1 | First 30 days | Peak day | Total | Last 30 days |');
  console.log('|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) console.log(r.error ? `| ${r.repo} | ${r.error} | | | | | | | |`
    : `| ${r.repo} | ${r.followers}${r.owner_type === 'Organization' ? ' (org)' : ''} | ${r.created} | ${r.first_star} | ${r.week1} | ${r.d30} | ${r.peak} (${r.peak_day}) | ${r.total} | ${r.last30} |`);
}
