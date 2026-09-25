#!/usr/bin/env node
// How many GitHub stars does a DEV article bring? (foundational study, channel base rates)
//
//   node history/research/foundation/dev.mjs collect    top DEV articles of the past year for several tags; keep those whose body
//                                                       links a GitHub repo owned by the article's author (user.github_username)
//   node history/research/foundation/dev.mjs stars      star history of each repo around its article's publication
//   node history/research/foundation/dev.mjs report     Markdown summary
//
// Raw data in lab/foundation/dev-*.json (git-ignored); the report is pasted into foundation.md with the CSV next to this script.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'foundation');
const ART = path.join(LAB, 'dev-articles.json');
const CSV = path.join(HERE, 'dev.csv');
const TAGS = ['showdev', 'opensource', 'github', 'ai', 'webdev', 'programming', 'javascript', 'python', 'productivity', 'tooling',
  'cli', 'rust', 'go', 'typescript', 'devops', 'claude', 'mcp', 'agents', 'llm', 'react', 'tutorial', 'beginners', 'career', 'machinelearning'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();

async function get(url, headers = {}) {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'earnstar-research', ...headers } });
      if (r.status === 404) return null;
      if (r.status === 429 || r.status === 403) { await sleep(5000 * (i + 1)); continue; }
      if (r.ok) return r.json();
    } catch {}
    await sleep(1500 * (i + 1));
  }
  return null;
}
const gh = (p, v = '2022-11-28') => get(`https://api.github.com${p}`, { Authorization: `Bearer ${TOKEN}`, 'X-GitHub-Api-Version': v });

async function collect() {
  const seen = new Map();
  for (const tag of TAGS) {
    for (let page = 1; page <= 3; page++) {
      const list = await get(`https://dev.to/api/articles?tag=${tag}&top=365&per_page=100&page=${page}`);
      await sleep(400);
      if (!list?.length) break;
      for (const a of list) if (!seen.has(a.id)) seen.set(a.id, { ...a, via: tag });
    }
    console.error(`${tag}: ${seen.size} articles`);
  }
  // Keep candidates whose author has a GitHub username; fetch bodies to find links to the author's own repos.
  const cands = [...seen.values()].filter(a => a.user?.github_username);
  const out = [];
  let i = 0;
  for (const a of cands) {
    const full = await get(`https://dev.to/api/articles/${a.id}`);
    await sleep(350);
    if (++i % 100 === 0) console.error(`bodies ${i}/${cands.length}`);
    if (!full?.body_markdown) continue;
    const gu = a.user.github_username.toLowerCase();
    const repos = new Set();
    for (const m of full.body_markdown.matchAll(/github\.com\/([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)/g)) {
      const owner = m[1].toLowerCase(), repo = m[2].replace(/\.git$/, '').replace(/[.,)]+$/, '');
      if (owner === gu && !['issues', 'pulls', 'settings'].includes(repo.toLowerCase())) repos.add(`${m[1]}/${repo}`);
    }
    if (repos.size) out.push({
      id: a.id, url: a.url, title: a.title, published_at: a.published_at, reactions: a.public_reactions_count, comments: a.comments_count,
      tags: a.tag_list, via: a.via, author: a.user.username, github: a.user.github_username, ai_disclosure: a.ai_disclosure_level ?? null,
      repos: [...repos],
    });
  }
  fs.writeFileSync(ART, JSON.stringify(out, null, 1));
  console.log(`collect: ${seen.size} top articles, ${cands.length} with a GitHub username, ${out.length} link the author's own repo`);
}

// Daily stars of a repo from GitHub's star history endpoint (weekly buckets, days[0] = Sunday UTC).
async function daily(full) {
  const weeks = [];
  for (let page = 1; page <= 10; page++) {
    const r = await gh(`/repos/${full}/stargazers/history?per_page=30&page=${page}`, '2026-03-10');
    if (!Array.isArray(r) || !r.length) break;
    weeks.push(...r);
    if (r.length < 30) break;
  }
  const m = new Map();
  for (const w of weeks) w.days.forEach((c, i) => m.set(new Date(w.week * 1000 + i * 86400e3).toISOString().slice(0, 10), c));
  return m;
}

async function stars() {
  const arts = JSON.parse(fs.readFileSync(ART, 'utf8'));
  const cache = new Map();
  for (const a of arts) {
    a.repo_stats = [];
    for (const full of a.repos.slice(0, 3)) {
      if (!cache.has(full)) {
        const info = await gh(`/repos/${full}`);
        cache.set(full, info && !info.fork ? { info, days: await daily(full) } : null);
      }
      const c = cache.get(full);
      if (!c) continue;
      const pub = Date.parse(a.published_at.slice(0, 10) + 'T00:00:00Z');
      const sum = (from, to) => { let s = 0; for (let t = pub + from * 86400e3; t <= pub + to * 86400e3; t += 86400e3) s += c.days.get(new Date(t).toISOString().slice(0, 10)) ?? 0; return s; };
      let before = 0; for (const [d, n] of c.days) if (Date.parse(d + 'T00:00:00Z') < pub) before += n;
      a.repo_stats.push({
        repo: full, stars_now: c.info.stargazers_count, created_at: c.info.created_at, stars_before: before,
        pre7: sum(-7, -1), win7: sum(0, 6), win30: sum(0, 29), post_30_60: sum(30, 59),
      });
    }
  }
  fs.writeFileSync(ART, JSON.stringify(arts, null, 1));
  console.log(`stars: ${arts.length} articles, ${cache.size} repos`);
}

function report() {
  const arts = JSON.parse(fs.readFileSync(ART, 'utf8')).filter(a => a.repo_stats?.length);
  // One row per article: its main repo = the linked repo with the largest 7-day gain.
  const rows = arts.map(a => ({ ...a, main: a.repo_stats.reduce((m, s) => (s.win7 > m.win7 ? s : m)) }));
  const q = (xs, p) => { const v = [...xs].sort((x, y) => x - y); return v.length ? v[Math.min(v.length - 1, Math.floor(p * v.length))] : null; };
  const lift = r => r.main.win7 - r.main.pre7;
  const esc = s => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));
  const ascii = s => String(s).replace(/[^\x20-\x7e]/g, '').trim();
  fs.writeFileSync(CSV, ['article_url,published_at,reactions,comments,tags,repo,stars_before,pre7,win7,win30,post_30_60,stars_now',
    ...rows.map(r => [r.url, r.published_at, r.reactions, r.comments, r.tags.join(' '), r.main.repo, r.main.stars_before, r.main.pre7, r.main.win7, r.main.win30, r.main.post_30_60, r.main.stars_now].map(x => esc(ascii(x))).join(','))].join('\n') + '\n');
  const L = [];
  L.push(`Articles (top-365 lists of ${TAGS.length} tags) linking the author's own GitHub repo, with star history: ${rows.length}.`, '');
  L.push('| Measure | p25 | Median | p75 | p90 | Max |', '|---|---|---|---|---|---|');
  for (const [name, f] of [['Reactions', r => r.reactions], ['Repo stars before the article', r => r.main.stars_before], ['Stars in the 7 days before', r => r.main.pre7],
    ['Stars in days 0-6 after publication', r => r.main.win7], ['Lift (days 0-6 minus the 7 days before)', lift], ['Stars in days 0-29', r => r.main.win30], ['Stars in days 30-59', r => r.main.post_30_60]]) {
    const xs = rows.map(f);
    L.push(`| ${name} | ${q(xs, 0.25)} | ${q(xs, 0.5)} | ${q(xs, 0.75)} | ${q(xs, 0.9)} | ${Math.max(...xs)} |`);
  }
  const fresh = rows.filter(r => r.main.stars_before < 50);
  L.push('', `Articles about repos with < 50 stars at publication (cold start): ${fresh.length}; their 7-day gain: median ${q(fresh.map(r => r.main.win7), 0.5)}, p75 ${q(fresh.map(r => r.main.win7), 0.75)}, p90 ${q(fresh.map(r => r.main.win7), 0.9)}, max ${Math.max(0, ...fresh.map(r => r.main.win7))}; share with >= 100 stars in 30 days: ${Math.round(100 * fresh.filter(r => r.main.win30 >= 100).length / (fresh.length || 1))} %.`);
  const byReact = [[0, 20], [20, 50], [50, 100], [100, 1e9]].map(([lo, hi]) => { const g = rows.filter(r => r.reactions >= lo && r.reactions < hi); return `${lo}-${hi === 1e9 ? '' : hi - 1} reactions: n ${g.length}, median 7-day gain ${q(g.map(r => r.main.win7), 0.5)}`; });
  L.push('', `By reactions: ${byReact.join('; ')}.`, '');
  L.push('Top 15 by 7-day gain:', '', '| Article | Published | Reactions | Repo | Stars before | 7 days before | Days 0-6 | Days 0-29 |', '|---|---|---|---|---|---|---|---|');
  for (const r of [...rows].sort((x, y) => y.main.win7 - x.main.win7).slice(0, 15))
    L.push(`| [${ascii(r.title).slice(0, 60).replace(/\|/g, '/')}](${r.url}) | ${r.published_at.slice(0, 10)} | ${r.reactions} | ${r.main.repo} | ${r.main.stars_before} | ${r.main.pre7} | ${r.main.win7} | ${r.main.win30} |`);
  console.log(L.join('\n'));
}

const cmd = process.argv[2];
if (cmd === 'collect') await collect();
else if (cmd === 'stars') await stars();
else if (cmd === 'report') report();
else { console.error('usage: dev.mjs collect | stars | report'); process.exit(2); }
