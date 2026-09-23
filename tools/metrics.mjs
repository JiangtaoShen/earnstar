#!/usr/bin/env node
// Snapshot program metrics (repos.json status: root | active | closed) via the gh CLI and public APIs.
//
//   node tools/metrics.mjs            snapshot all tracked repos and all channel items
//   node tools/metrics.mjs earnstar_1 snapshot one repo key (channel items of that project only)
//
// Outputs (history/metrics/), all timestamps UTC:
//   snapshots.csv          per run and repo: stars, forks, watchers, issues, 14-day traffic totals
//   traffic_daily.csv      upserted per (date, key); GitHub keeps only 14 days, so this is the permanent record
//   referrers.csv          top referrers (14-day aggregate) per run
//   stars/<key>.csv        all star timestamps, rebuilt each run
//   community/<key>.csv    every issue/PR: kind, author association, dates, first owner response; rebuilt each run
//   community.csv          per run and repo: external issues/PRs, open, unanswered, median first-response hours
//   releases.csv           per run and release: asset download count
//   package_daily.csv      upserted per (date, key, registry, package): npm / PyPI downloads (repos.json "packages")
//   security.csv           per run and repo: secret scanning, push protection, Dependabot alerts and updates
//   channels.csv           per run and item in history/channels.json: score, comments, PR state
// Privacy: no user logins are stored.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'history', 'metrics');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); // tolerate BOM (e.g., Notepad)
const reg = readJson(path.join(ROOT, 'repos.json'));
const CHANNELS = path.join(ROOT, 'history', 'channels.json');
const INTERNAL = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

const errors = [];
const gh = a => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 << 20 });
const tryGh = (a, fallback, quiet = false) => {
  try { return gh(a); } catch (e) { if (!quiet) errors.push(`gh ${a.join(' ')}: ${String(e.stderr || e.message).trim()}`); return fallback; }
};
const api = (p, fallback) => { const s = tryGh(['api', p], null); return s === null ? fallback : JSON.parse(s); };
const lines = s => (s ?? '').split(/\r?\n/).filter(Boolean);
const cell = v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const row = a => a.map(cell).join(',') + '\n';
const hours = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 360000) / 10;

async function getJson(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'earnstar-metrics/1.0 (github.com/JiangtaoShen/earnstar)' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) { errors.push(`${url}: ${e.message}`); return null; }
}

function appendCsv(file, header, rows) {
  if (!rows.length) return;
  const p = path.join(OUT, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, row(header));
  fs.appendFileSync(p, rows.map(row).join(''));
}

function writeCsv(file, header, rows) {
  const p = path.join(OUT, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, row(header) + rows.map(row).join(''));
}

function upsertCsv(file, header, keyCols, rows) {
  const p = path.join(OUT, file), map = new Map(), key = r => keyCols.map(i => r[i]).join('|');
  if (fs.existsSync(p)) for (const l of lines(fs.readFileSync(p, 'utf8')).slice(1)) { const f = l.split(','); map.set(key(f), f); }
  for (const r of rows) map.set(key(r), r.map(String));
  writeCsv(file, header, [...map.values()].sort((a, b) => key(a).localeCompare(key(b))));
}

function community(full, key) {
  const items = lines(tryGh(['api', '--paginate', `repos/${full}/issues?state=all&per_page=100`, '--jq',
    '.[] | [.number, (if .pull_request then "pr" else "issue" end), .author_association, .created_at, .state, (.closed_at // ""), .comments] | @tsv'], ''))
    .map(l => { const [n, kind, assoc, created, state, closed, comments] = l.split('\t'); return { n, kind, assoc, created, state, closed, comments: Number(comments) }; });
  for (const it of items) {
    it.first = '';
    if (INTERNAL.has(it.assoc)) continue;
    const times = [];
    if (it.comments > 0) times.push(...lines(tryGh(['api', '--paginate', `repos/${full}/issues/${it.n}/comments?per_page=100`, '--jq',
      '.[] | select(.author_association == "OWNER") | .created_at'], '')));
    if (it.kind === 'pr') times.push(...lines(tryGh(['api', '--paginate', `repos/${full}/pulls/${it.n}/reviews?per_page=100`, '--jq',
      '.[] | select(.author_association == "OWNER") | .submitted_at'], '')));
    it.first = times.sort()[0] ?? '';
  }
  writeCsv(`community/${key}.csv`, ['number', 'kind', 'author_association', 'created_utc', 'state', 'closed_utc', 'comments', 'first_owner_response_utc', 'response_hours'],
    items.map(i => [i.n, i.kind, i.assoc, i.created, i.state, i.closed, i.comments, i.first, i.first ? hours(i.created, i.first) : '']));
  const ext = items.filter(i => !INTERNAL.has(i.assoc));
  const resp = ext.filter(i => i.first).map(i => hours(i.created, i.first)).sort((a, b) => a - b);
  const median = resp.length ? resp[Math.floor((resp.length - 1) / 2)] : '';
  return { ext_issues: ext.filter(i => i.kind === 'issue').length, ext_prs: ext.filter(i => i.kind === 'pr').length,
    ext_open: ext.filter(i => i.state === 'open').length, ext_open_unanswered: ext.filter(i => i.state === 'open' && !i.first).length, median_first_response_h: median };
}

async function packages(r) {
  const rows = [];
  for (const p of r.packages ?? []) {
    if (p.registry === 'npm') {
      const j = await getJson(`https://api.npmjs.org/downloads/range/last-month/${encodeURIComponent(p.name)}`);
      for (const d of j?.downloads ?? []) rows.push([d.day, r.key, 'npm', p.name, d.downloads]);
    } else if (p.registry === 'pypi') {
      const j = await getJson(`https://pypistats.org/api/packages/${encodeURIComponent(p.name.toLowerCase())}/overall?mirrors=false`);
      for (const d of j?.data ?? []) if (d.category === 'without_mirrors') rows.push([d.date, r.key, 'pypi', p.name, d.downloads]);
    } else errors.push(`unknown registry ${p.registry} for ${r.key}`);
  }
  if (rows.length) upsertCsv('package_daily.csv', ['date_utc', 'key', 'registry', 'package', 'downloads'], [0, 1, 2, 3], rows);
}

async function channel(c, utc) {
  let score = '', comments = '', state = '';
  const hn = c.url.match(/news\.ycombinator\.com\/item\?id=(\d+)/);
  const pr = c.url.match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
  if (c.type === 'hn' && hn) {
    const j = await getJson(`https://hacker-news.firebaseio.com/v0/item/${hn[1]}.json`);
    if (j) { score = j.score ?? ''; comments = j.descendants ?? 0; state = j.dead ? 'dead' : j.deleted ? 'deleted' : 'live'; }
    else state = 'unavailable';
  } else if (c.type === 'reddit') {
    const j = await getJson(c.url.replace(/\/?(\?.*)?$/, '/.json'));
    const d = j?.[0]?.data?.children?.[0]?.data;
    if (d) { score = d.score; comments = d.num_comments; state = d.removed_by_category ? `removed:${d.removed_by_category}` : `upvote_ratio:${d.upvote_ratio}`; }
    else state = 'unavailable'; // Reddit often returns 403 to unauthenticated clients; see playbook/launch.md
  } else if (c.type === 'pr' && pr) {
    const j = api(`repos/${pr[1]}/pulls/${pr[2]}`, null);
    if (j) { comments = (j.comments ?? 0) + (j.review_comments ?? 0); state = j.merged ? 'merged' : j.state; }
    else state = 'unavailable';
  }
  return [utc, c.id, c.project, c.type, c.url, c.posted_utc, c.posted_utc ? hours(c.posted_utc, utc) : '', score, comments, state];
}

const only = process.argv[2];
const tracked = reg.repos.filter(r => ['root', 'active', 'closed'].includes(r.status) && (!only || r.key === only));
const utc = new Date().toISOString();
const summary = [];

for (const r of tracked) {
  const full = `${reg.owner}/${r.name}`;
  const info = api(`repos/${full}`, null);
  if (!info) continue;
  const views = api(`repos/${full}/traffic/views`, { count: 0, uniques: 0, views: [] });
  const clones = api(`repos/${full}/traffic/clones`, { count: 0, uniques: 0, clones: [] });
  const refs = api(`repos/${full}/traffic/popular/referrers`, []);

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
  if (days.size) upsertCsv('traffic_daily.csv', ['date_utc', 'key', 'views', 'view_uniques', 'clones', 'clone_uniques'], [0, 1],
    [...days].map(([d, x]) => [d, r.key, ...x]));

  appendCsv('referrers.csv', ['utc', 'key', 'referrer', 'count', 'uniques'], refs.map(x => [utc, r.key, x.referrer, x.count, x.uniques]));

  if (info.stargazers_count > 0) {
    const stamps = lines(tryGh(['api', '--paginate', '-H', 'Accept: application/vnd.github.star+json',
      `repos/${full}/stargazers?per_page=100`, '--jq', '.[].starred_at'], '')).sort();
    writeCsv(`stars/${r.key}.csv`, ['starred_at_utc'], stamps.map(s => [s]));
  }

  const com = info.size > 0 || info.open_issues_count > 0 ? community(full, r.key) : null;
  if (com) appendCsv('community.csv', ['utc', 'key', 'ext_issues', 'ext_prs', 'ext_open', 'ext_open_unanswered', 'median_first_response_h'],
    [[utc, r.key, com.ext_issues, com.ext_prs, com.ext_open, com.ext_open_unanswered, com.median_first_response_h]]);

  const rel = api(`repos/${full}/releases?per_page=100`, []);
  appendCsv('releases.csv', ['utc', 'key', 'tag', 'published_utc', 'assets', 'downloads'],
    rel.map(x => [utc, r.key, x.tag_name, x.published_at, x.assets.length, x.assets.reduce((n, a) => n + a.download_count, 0)]));

  await packages(r);

  const sa = info.security_and_analysis ?? {};
  const alerts = tryGh(['api', `repos/${full}/vulnerability-alerts`], null, true) !== null ? 'enabled' : 'disabled';
  appendCsv('security.csv', ['utc', 'key', 'secret_scanning', 'push_protection', 'dependabot_alerts', 'dependabot_updates'],
    [[utc, r.key, sa.secret_scanning?.status ?? 'unavailable', sa.secret_scanning_push_protection?.status ?? 'unavailable',
      alerts, sa.dependabot_security_updates?.status ?? 'unavailable']]);

  summary.push({ key: r.key, name: r.name, visibility: info.visibility, stars: info.stargazers_count, forks: info.forks_count,
    views_14d: views.count, uniques_14d: views.uniques, community: com });
}

const items = fs.existsSync(CHANNELS) ? readJson(CHANNELS).items ?? [] : [];
const chRows = [];
for (const c of items.filter(c => !only || c.project === only)) chRows.push(await channel(c, utc));
appendCsv('channels.csv', ['utc', 'id', 'project', 'type', 'url', 'posted_utc', 'hours_since_post', 'score', 'comments', 'state'], chRows);

console.log(JSON.stringify({ utc, repos: summary, channels: chRows.length, errors }, null, 2));
