#!/usr/bin/env node
// Premise check for idea 23a (comment bloat): comment density of lines added by commits co-authored by Claude,
// against commits without an AI trailer in the same repos. Public GitHub data only.
//
//   node history/research/earnstar_1/comments.mjs collect [N]   N commits with the trailer (default 300), plus same-repo baselines
//   node history/research/earnstar_1/comments.mjs report
//
// Limitations: commits without a trailer may still be AI-assisted (other tools, or no trailer), which biases the
// baseline toward the agent group, so real differences are larger, not smaller. The comment detector is line-based.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'earnstar_1');
fs.mkdirSync(LAB, { recursive: true });
const OUT = path.join(LAB, 'comments.json');
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function gh(p) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(`https://api.github.com${p}`, { headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'earnstar-research', 'X-GitHub-Api-Version': '2022-11-28' } });
    if (r.status === 403 || r.status === 429) { await sleep(15000); continue; }
    if (r.ok) return r.json();
    if (r.status === 404 || r.status === 409 || r.status === 422) return null;
    await sleep(2000);
  }
  return null;
}

const LANG = [
  [/\.(py)$/, /^\s*#/], [/\.(ts|tsx|js|jsx|mjs|go|rs|java|kt|swift|c|cc|cpp|h|hpp|cs)$/, /^\s*(\/\/|\/\*|\*(?!\*?\s*$)|\*\/)/],
];
const AI = /co-authored-by:\s*(claude|codex|cursor|copilot|gemini|opencode|aider)|generated with \[?claude|🤖/i;
function density(commit) {
  let code = 0, comments = 0;
  for (const f of commit?.files || []) {
    const lang = LANG.find(([ext]) => ext.test(f.filename));
    if (!lang || !f.patch || /(^|\/)(vendor|dist|build|node_modules|__generated__)\//.test(f.filename) || /\.min\./.test(f.filename)) continue;
    for (const line of f.patch.split('\n')) {
      if (!line.startsWith('+') || line.startsWith('+++')) continue;
      const body = line.slice(1);
      if (!body.trim()) continue;
      code++;
      if (lang[1].test(body)) comments++;
    }
  }
  return { code, comments };
}

async function collect(N = 300) {
  const seen = new Set(), rows = [];
  for (const month of ['2026-06', '2026-07', '2026-08', '2026-09']) {
    for (let page = 1; page <= 3 && rows.filter(r => r.group === 'claude').length < N; page++) {
      const q = encodeURIComponent(`"Co-Authored-By: Claude" committer-date:${month}-01..${month}-28`);
      const r = await gh(`/search/commits?q=${q}&per_page=100&page=${page}`);
      await sleep(2500);
      for (const it of r?.items || []) {
        const repo = it.repository.full_name;
        if (seen.has(repo) || it.repository.fork) continue; // one agent commit per repo, to avoid one repo dominating
        seen.add(repo);
        const c = await gh(`/repos/${repo}/commits/${it.sha}`);
        const d = density(c);
        if (d.code < 10) continue;
        // Baseline: the latest commits in the same repo without an AI trailer.
        const list = await gh(`/repos/${repo}/commits?per_page=40`);
        const human = (list || []).filter(x => !AI.test(x.commit.message) && (x.parents || []).length === 1).slice(0, 3);
        let hc = 0, hk = 0;
        for (const h of human) { const d2 = density(await gh(`/repos/${repo}/commits/${h.sha}`)); hc += d2.code; hk += d2.comments; }
        rows.push({ group: 'claude', repo, sha: it.sha, ...d, base_code: hc, base_comments: hk, base_commits: human.length });
      }
      console.error(`${month} page ${page}: ${rows.length} agent commits`);
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));
  console.log(`collect: ${rows.length} agent commits with same-repo baselines`);
}

function report() {
  const rows = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const paired = rows.filter(r => r.base_code >= 10);
  const ratio = (k, c) => (c ? k / c : 0);
  const q = (xs, p) => { const v = [...xs].sort((a, b) => a - b); return v[Math.min(v.length - 1, Math.floor(p * v.length))]; };
  const agent = paired.map(r => ratio(r.comments, r.code)), base = paired.map(r => ratio(r.base_comments, r.base_code));
  const pooled = (k, c) => (100 * paired.reduce((s, r) => s + r[k], 0)) / paired.reduce((s, r) => s + r[c], 0);
  const higher = paired.filter(r => ratio(r.comments, r.code) > ratio(r.base_comments, r.base_code)).length;
  console.log([
    `Repos with an agent commit and a same-repo baseline (>= 10 added code lines each): ${paired.length} (of ${rows.length} agent commits).`,
    `Comment share of added lines, pooled: agent commits ${pooled('comments', 'code').toFixed(1)} %, baseline commits ${pooled('base_comments', 'base_code').toFixed(1)} %.`,
    `Per-repo median: agent ${(100 * q(agent, 0.5)).toFixed(1)} %, baseline ${(100 * q(base, 0.5)).toFixed(1)} %; p75: agent ${(100 * q(agent, 0.75)).toFixed(1)} %, baseline ${(100 * q(base, 0.75)).toFixed(1)} %.`,
    `Repos where the agent commit is more comment-dense than the baseline: ${higher} of ${paired.length} (${Math.round((100 * higher) / paired.length)} %).`,
  ].join('\n'));
}

const [cmd, a1] = process.argv.slice(2);
if (cmd === 'collect') await collect(Number(a1) || 300);
else if (cmd === 'report') report();
else { console.error('usage: comments.mjs collect [N] | report'); process.exit(2); }
