#!/usr/bin/env node
// Foundational study data collector (playbook/research.md §1.1). Read-only GitHub and HN Algolia queries.
//
//   node history/research/foundation/collect.mjs population            enumerate repos created in the window with >= 1k stars
//   node history/research/foundation/collect.mjs sample [N] [seed]     measure a seeded random sample (default 500, seed 1)
//   node history/research/foundation/collect.mjs history                (re)derive star timing from GitHub's star history API
//   node history/research/foundation/collect.mjs csv                   write the sanitized CSV next to this script
//
// Raw responses go to lab/foundation/ (git-ignored). The CSV keeps only ASCII-safe fields: descriptions that
// contain CJK text are replaced with a marker (Constitution §9), and the flag `cjk` records that fact.
// Auth: the GitHub token comes from `gh auth token` at run time and is never printed or stored.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..', '..');
const LAB = path.join(ROOT, 'lab', 'foundation');
fs.mkdirSync(LAB, { recursive: true });
const POP = path.join(LAB, 'population.json');
const SAMPLE = path.join(LAB, 'sample.json');
const CSV = path.join(HERE, 'sample.csv');
const POPCSV = path.join(HERE, 'population.csv');

// Window: created in the 12 months before kickoff, and at least 90 days before it, so every repo had 90 days.
const MONTHS = [
  ['2025-09-25', '2025-10-31'], ['2025-11-01', '2025-11-30'], ['2025-12-01', '2025-12-31'],
  ['2026-01-01', '2026-01-31'], ['2026-02-01', '2026-02-28'], ['2026-03-01', '2026-03-31'],
  ['2026-04-01', '2026-04-30'], ['2026-05-01', '2026-05-31'], ['2026-06-01', '2026-06-27'],
];

const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function gh(url, accept = 'application/vnd.github+json', raw = false, version = '2022-11-28') {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: accept, 'X-GitHub-Api-Version': version, 'User-Agent': 'earnstar-research' },
    });
    if (res.status === 403 || res.status === 429) {
      const reset = Number(res.headers.get('x-ratelimit-reset') || 0) * 1000;
      const wait = Math.max(5000, Math.min(reset - Date.now() + 1000, 120000));
      console.error(`rate limited on ${url}; waiting ${Math.round(wait / 1000)} s`);
      await sleep(wait); continue;
    }
    if (res.status === 404 || res.status === 422) return null;
    if (!res.ok) { await sleep(2000 * (i + 1)); continue; }
    return raw ? res.text() : res.json();
  }
  return null;
}
async function json(url) {
  for (let i = 0; i < 4; i++) {
    try { const r = await fetch(url, { headers: { 'User-Agent': 'earnstar-research' } }); if (r.ok) return r.json(); } catch {}
    await sleep(1500 * (i + 1));
  }
  return null;
}

// Seeded PRNG (mulberry32) so the sample is reproducible.
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

async function population() {
  const all = [];
  for (const [a, b] of MONTHS) {
    for (let page = 1; page <= 10; page++) {
      const q = encodeURIComponent(`created:${a}..${b} stars:>=1000`);
      const r = await gh(`/search/repositories?q=${q}&sort=stars&order=desc&per_page=100&page=${page}`);
      await sleep(2200); // search API: 30 requests per minute
      if (!r || !r.items.length) break;
      for (const it of r.items) all.push({
        full_name: it.full_name, owner: it.owner.login, owner_type: it.owner.type, created_at: it.created_at,
        pushed_at: it.pushed_at, stars: it.stargazers_count, forks: it.forks_count, language: it.language,
        topics: it.topics, description: it.description, fork: it.fork, archived: it.archived, license: it.license?.spdx_id ?? null,
        homepage: it.homepage, window: `${a}..${b}`,
      });
      console.error(`${a}..${b} page ${page}: ${all.length}`);
      if (r.items.length < 100) break;
    }
  }
  fs.writeFileSync(POP, JSON.stringify(all, null, 1));
  console.log(`population: ${all.length} repos -> ${path.relative(ROOT, POP)}`);
}

const HEAD_CHARS = 4000;
function readmeFlags(md) {
  if (!md) return { readme_len: 0 };
  const head = md.slice(0, HEAD_CHARS);
  const low = md.toLowerCase();
  const media = /\.(gif|png|jpe?g|webp|svg|mp4|webm)(\?|\)|"|'|\s)|<img|<video|user-attachments\/assets|youtube\.com|youtu\.be/i;
  const badgeCount = (head.match(/img\.shields\.io|badge\.fury|\/badge\.svg|badgen\.net/gi) || []).length;
  const headNoBadges = head.replace(/!\[[^\]]*\]\([^)]*(shields\.io|badge)[^)]*\)/gi, '').replace(/<img[^>]*(shields\.io|badge)[^>]*>/gi, '');
  return {
    readme_len: md.length,
    media_above_fold: media.test(headNoBadges),
    gif_anywhere: /\.gif(\?|\)|"|'|\s)/i.test(md),
    video_anywhere: /\.(mp4|webm)|youtube\.com|youtu\.be|user-attachments\/assets/i.test(md),
    badges_head: badgeCount,
    quickstart: /^#{1,4}.*(quick ?start|getting started|install|usage|get started)/im.test(md),
    one_liner_install: /(npx |pip install |uvx |brew install |cargo install |go install |npm i(nstall)? -g |curl .*\| *(ba)?sh|docker run )/i.test(md),
    star_history: /star-history\.com|api\.star-history|starchart\.cc/i.test(low),
    cjk_readme: hasCJK(md.slice(0, 20000)),
    ai_disclosed: /(built|written|generated|made) (entirely )?(with|by) (claude|codex|cursor|ai|gpt|an ai)/i.test(md),
  };
}
const CJK_RANGES = [[0x2e80, 0x2fdf], [0x3000, 0x303f], [0x3040, 0x30ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0xff00, 0xffef], [0xac00, 0xd7af]];
function hasCJK(s) { if (!s) return false; for (const ch of s) { const c = ch.codePointAt(0); if (CJK_RANGES.some(([lo, hi]) => c >= lo && c <= hi)) return true; } return false; }

// Star timing. Since July 2026 GitHub serves stargazer lists (with starred_at) only to a repo's admins and
// collaborators (changelog 2026-06-30; REST 404 and GraphQL empty edges seen in S016). The replacement is
// GET /repos/{owner}/{repo}/stargazers/history (changelog 2026-09-04, API version 2026-03-10): weekly buckets
// (week start, Sunday 00:00 UTC) with daily counts of current stargazers. Dates are UTC days.
async function starTiming(o, n, createdAt) {
  const weeks = [];
  for (let page = 1; page <= 100; page++) {
    const r = await gh(`/repos/${o}/${n}/stargazers/history?per_page=30&page=${page}`, 'application/vnd.github+json', false, '2026-03-10');
    if (!Array.isArray(r) || !r.length) break;
    weeks.push(...r);
    if (r.length < 30) break;
  }
  if (!weeks.length) return { star_source: 'github:none' };
  const DAY = 86400e3;
  const daily = [];
  for (const w of weeks) w.days.forEach((c, i) => daily.push([w.week * 1000 + i * DAY, c]));
  daily.sort((x, y) => x[0] - y[0]);
  let cum = 0;
  const rows = daily.map(([t, c]) => [t, c, (cum += c)]).filter(x => x[2] > 0);
  if (!rows.length) return { star_source: 'github:none' };
  const iso = t => new Date(t).toISOString().slice(0, 10);
  const c0 = Date.parse(`${createdAt.slice(0, 10)}T00:00:00Z`);
  const reach = k => rows.find(x => x[2] >= k)?.[0] ?? null;
  const at = ms => { let v = 0; for (const [t, , c] of rows) { if (t <= ms) v = c; else break; } return v; };
  const f0 = rows[0][0], s100 = reach(100), s1000 = reach(1000);
  const peak = rows.reduce((m, x) => (x[1] > m[1] ? x : m), [0, -1]);
  return {
    star_source: 'github', first_star: iso(f0), star100: s100 && iso(s100), star1000: s1000 && iso(s1000),
    days_create_to_1k: s1000 ? (s1000 - c0) / DAY : null,
    days_first_to_1k: s1000 ? (s1000 - f0) / DAY : null,
    days_first_to_100: s100 ? (s100 - f0) / DAY : null,
    stars_7d: at(f0 + 6 * DAY), stars_30d: at(f0 + 29 * DAY), stars_90d_from_create: at(c0 + 90 * DAY),
    peak_day: iso(peak[0]), peak_day_stars: peak[1], history_total: cum,
  };
}

async function measure(r) {
  const [o, n] = r.full_name.split('/');
  const user = await gh(`/users/${o}`);
  const md = await gh(`/repos/${o}/${n}/readme`, 'application/vnd.github.raw', true);
  const hn = await json(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(`github.com/${o}/${n}`)}&restrictSearchableAttributes=url&tags=story&hitsPerPage=50`);
  const hits = (hn?.hits || []).filter(h => (h.url || '').toLowerCase().includes(`github.com/${o}/${n}`.toLowerCase()));
  const hnBest = hits.reduce((m, h) => (h.points > (m?.points ?? -1) ? h : m), null);
  const hnFirst = hits.reduce((m, h) => (!m || h.created_at_i < m.created_at_i ? h : m), null);
  return {
    ...r,
    owner_followers: user?.followers ?? null, owner_created_at: user?.created_at ?? null, owner_public_repos: user?.public_repos ?? null,
    hn_posts: hits.length, hn_max_points: hnBest?.points ?? 0, hn_max_date: hnBest?.created_at ?? null,
    hn_first_date: hnFirst?.created_at ?? null,
    ...readmeFlags(md),
    ...(await starTiming(o, n, r.created_at)),
  };
}

// Re-derive star timing (and the HN-vs-first-star flag) for already measured repos.
async function history() {
  const s = JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
  const todo = s.filter(r => r.star_source !== 'github');
  for (let i = 0; i < todo.length; i += 6) {
    await Promise.all(todo.slice(i, i + 6).map(async r => { const [o, n] = r.full_name.split('/'); Object.assign(r, await starTiming(o, n, r.created_at)); }));
    if (i % 60 === 0) { fs.writeFileSync(SAMPLE, JSON.stringify(s, null, 1)); console.error(`${i}/${todo.length}`); }
  }
  for (const r of s) r.hn_within_7d_of_first_star = !!(r.hn_first_date && r.first_star && Math.abs(Date.parse(r.hn_first_date) - Date.parse(`${r.first_star}T00:00:00Z`)) <= 7 * 86400e3);
  fs.writeFileSync(SAMPLE, JSON.stringify(s, null, 1));
  console.log(`history: ${s.filter(r => r.star_source === 'github').length}/${s.length} with star timing`);
}

async function sample(N = 500, seed = 1) {
  const pop = JSON.parse(fs.readFileSync(POP, 'utf8')).filter(r => !r.fork);
  const rand = rng(seed);
  const shuffled = pop.map(r => [rand(), r]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const pick = shuffled.slice(0, N);
  const done = fs.existsSync(SAMPLE) ? JSON.parse(fs.readFileSync(SAMPLE, 'utf8')) : [];
  const have = new Set(done.map(r => r.full_name));
  const todo = pick.filter(r => !have.has(r.full_name));
  console.error(`sample ${N} (seed ${seed}): ${done.length} done, ${todo.length} to measure`);
  const out = [...done];
  const CONC = 6;
  for (let i = 0; i < todo.length; i += CONC) {
    const batch = await Promise.all(todo.slice(i, i + CONC).map(measure));
    out.push(...batch);
    if ((i / CONC) % 10 === 0) { fs.writeFileSync(SAMPLE, JSON.stringify(out, null, 1)); console.error(`${out.length}/${N}`); }
  }
  fs.writeFileSync(SAMPLE, JSON.stringify(out, null, 1));
  console.log(`sample: ${out.length} measured -> ${path.relative(ROOT, SAMPLE)}`);
}

const esc = v => {
  if (v === null || v === undefined) return '';
  const s = Array.isArray(v) ? v.join(' ') : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const clean = d => (hasCJK(d) ? '(CJK description omitted)' : (d || '').replace(/[^\x20-\x7e]/g, '').trim());
function csv() {
  const pop = JSON.parse(fs.readFileSync(POP, 'utf8'));
  const pcols = ['full_name', 'owner_type', 'created_at', 'stars', 'language', 'topics', 'fork', 'license', 'cjk', 'description'];
  fs.writeFileSync(POPCSV, [pcols.join(','), ...pop.map(r => pcols.map(c => esc(c === 'description' ? clean(r.description) : c === 'cjk' ? hasCJK(r.description) : r[c])).join(','))].join('\n') + '\n');
  const s = JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
  const ARCH = path.join(HERE, 'archetypes.json'); // manual labels, see foundation.md
  const arch = fs.existsSync(ARCH) ? JSON.parse(fs.readFileSync(ARCH, 'utf8')) : {};
  for (const r of s) r.archetype = arch[r.full_name] ?? '';
  const cols = ['full_name', 'archetype', 'owner_type', 'owner_followers', 'created_at', 'stars', 'language', 'first_star', 'star100', 'star1000',
    'days_create_to_1k', 'days_first_to_1k', 'days_first_to_100', 'hn_posts', 'hn_max_points', 'hn_first_date', 'hn_within_7d_of_first_star',
    'readme_len', 'media_above_fold', 'gif_anywhere', 'video_anywhere', 'badges_head', 'quickstart', 'one_liner_install', 'star_history',
    'cjk_readme', 'ai_disclosed', 'topics', 'cjk', 'description'];
  const round = (c, v) => (typeof v === 'number' && c.startsWith('days') ? Math.round(v * 10) / 10 : v);
  fs.writeFileSync(CSV, [cols.join(','), ...s.map(r => cols.map(c => esc(c === 'description' ? clean(r.description) : c === 'cjk' ? hasCJK(r.description) : round(c, r[c]))).join(','))].join('\n') + '\n');
  console.log(`csv: ${pop.length} population rows, ${s.length} sample rows`);
}

const [cmd, a1, a2] = process.argv.slice(2);
if (cmd === 'population') await population();
else if (cmd === 'sample') await sample(Number(a1) || 500, Number(a2) || 1);
else if (cmd === 'history') await history();
else if (cmd === 'csv') csv();
else { console.error('usage: collect.mjs population | sample [N] [seed] | history | csv'); process.exit(2); }
