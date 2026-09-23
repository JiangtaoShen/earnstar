#!/usr/bin/env node
// Snapshot GitHub metrics for program repos (repos.json status: root | active | closed) via the gh CLI.
//
//   node tools/metrics.mjs            snapshot all tracked repos
//   node tools/metrics.mjs earnstar_1 snapshot one repo key
//
// Outputs (history/metrics/):
//   snapshots.csv       one row per repo per run: stars, forks, watchers, issues, 14-day traffic totals
//   traffic_daily.csv   upserted per (date_utc, key): GitHub keeps only 14 days, so this is the permanent record
//   referrers.csv       top referrers (14-day aggregate) per run
//   stars/<key>.csv     full star timestamps, rebuilt each run (no user logins stored)

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'history', 'metrics');
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'repos.json'), 'utf8'));

const gh = a => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 << 20 });
const api = p => JSON.parse(gh(['api', p]));
const tryApi = (p, fallback) => { try { return api(p); } catch (e) { errors.push(`${p}: ${String(e.stderr || e.message).trim()}`); return fallback; } };
const cell = v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const row = a => a.map(cell).join(',') + '\n';

function appendCsv(file, header, rows) {
  const p = path.join(OUT, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, row(header));
  for (const r of rows) fs.appendFileSync(p, row(r));
}

function upsertTraffic(rows) {
  const p = path.join(OUT, 'traffic_daily.csv');
  const header = ['date_utc', 'key', 'views', 'view_uniques', 'clones', 'clone_uniques'];
  const map = new Map();
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, 'utf8').trim().split('\n').slice(1)) {
      const f = line.split(',');
      map.set(`${f[0]}|${f[1]}`, f);
    }
  }
  for (const r of rows) map.set(`${r[0]}|${r[1]}`, r);
  const sorted = [...map.values()].sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1]));
  fs.writeFileSync(p, row(header) + sorted.map(row).join(''));
}

const errors = [];
const only = process.argv[2];
const tracked = reg.repos.filter(r => ['root', 'active', 'closed'].includes(r.status) && (!only || r.key === only));
const utc = new Date().toISOString();
const summary = [];

for (const r of tracked) {
  const full = `${reg.owner}/${r.name}`;
  const info = tryApi(`repos/${full}`, null);
  if (!info) continue;
  const views = tryApi(`repos/${full}/traffic/views`, { count: 0, uniques: 0, views: [] });
  const clones = tryApi(`repos/${full}/traffic/clones`, { count: 0, uniques: 0, clones: [] });
  const refs = tryApi(`repos/${full}/traffic/popular/referrers`, []);

  appendCsv('snapshots.csv',
    ['utc', 'key', 'name', 'visibility', 'stars', 'forks', 'watchers', 'open_issues', 'views_14d', 'view_uniques_14d', 'clones_14d', 'clone_uniques_14d'],
    [[utc, r.key, r.name, info.visibility, info.stargazers_count, info.forks_count, info.subscribers_count, info.open_issues_count,
      views.count, views.uniques, clones.count, clones.uniques]]);

  const days = new Map();
  for (const v of views.views ?? []) days.set(v.timestamp.slice(0, 10), [v.count, v.uniques, 0, 0]);
  for (const c of clones.clones ?? []) {
    const d = c.timestamp.slice(0, 10), x = days.get(d) ?? [0, 0, 0, 0];
    x[2] = c.count; x[3] = c.uniques; days.set(d, x);
  }
  upsertTraffic([...days].map(([d, x]) => [d, r.key, ...x]));

  if (refs.length) appendCsv('referrers.csv', ['utc', 'key', 'referrer', 'count', 'uniques'], refs.map(x => [utc, r.key, x.referrer, x.count, x.uniques]));

  if (info.stargazers_count > 0) {
    try {
      const out = gh(['api', '--paginate', '-H', 'Accept: application/vnd.github.star+json',
        `repos/${full}/stargazers?per_page=100`, '--jq', '.[].starred_at']);
      const stamps = out.split('\n').filter(Boolean).sort();
      fs.mkdirSync(path.join(OUT, 'stars'), { recursive: true });
      fs.writeFileSync(path.join(OUT, 'stars', `${r.key}.csv`), 'starred_at_utc\n' + stamps.join('\n') + '\n');
    } catch (e) { errors.push(`stargazers ${full}: ${String(e.stderr || e.message).trim()}`); }
  }
  summary.push({ key: r.key, name: r.name, visibility: info.visibility, stars: info.stargazers_count, forks: info.forks_count, views_14d: views.count, uniques_14d: views.uniques });
}

console.log(JSON.stringify({ utc, repos: summary, errors }, null, 2));
