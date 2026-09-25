#!/usr/bin/env node
// Spike for candidate 23b: can "Claudese" be measured deterministically from public transcripts?
// Source: SpecStory chat histories committed to public GitHub repos (.specstory/history/*.md), whose agent
// headers name the model, e.g. "_**Agent (claude-opus-4-8)**_".
//
//   node history/research/earnstar_1/claudese.mjs collect    list transcripts by code search, fetch them (raw), keep agent prose
//   node history/research/earnstar_1/claudese.mjs report     marker rates per 1,000 words, by model
//   node history/research/earnstar_1/claudese.mjs lexicon    words whose rate rose most from the 4.5/4.6 models to Opus 4.8, Opus 5, and Sonnet 5
//
// Limitations: code search returns at most 1,000 files per query; repos that commit transcripts are a
// self-selected sample; markers are a fixed phrase list, not a judgment of quality.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'earnstar_1');
fs.mkdirSync(LAB, { recursive: true });
const OUT = path.join(LAB, 'claudese.json');
const BODIES = path.join(LAB, 'claudese-bodies.jsonl');
const TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, headers = {}, text = false) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'earnstar-research', ...headers } });
      if (r.status === 403 || r.status === 429) { await sleep(20000); continue; }
      if (r.status === 404) return null;
      if (r.ok) return text ? r.text() : r.json();
    } catch {}
    await sleep(2000);
  }
  return null;
}

// Marker phrases: from the "Claudese" essay (benn.substack.com, 2026-06-26), anthropics/claude-code #77136 and #3382.
export const MARKERS = {
  absolutely_right: /you'?re absolutely (right|correct)/gi,
  heres_the_thing: /here'?s the (thing|kicker|catch)/gi,
  honest_take: /\b(the honest (take|answer|truth)|to be (honest|direct|blunt)|honestly,)/gi,
  genuinely: /\bgenuine(ly)?\b/gi,
  load_bearing: /\bload[- ]bearing\b/gi,
  substrate: /\bsubstrate\b/gi,
  worth_noting: /\b(it'?s )?worth noting\b/gi,
  the_real: /\bthe real (question|issue|problem|answer|story)\b/gi,
  crucially: /\b(crucially|critically|importantly),/gi,
};
const words = s => (s.match(/[A-Za-z']+/g) || []).length;

function agentProse(md) {
  const out = [];
  const parts = md.split(/^_\*\*/m);
  for (const p of parts) {
    const m = p.match(/^Agent \(([^)]+)\)([^_]*)\*\*_/);
    if (!m || /sidechain/.test(m[2]) || /synthetic/.test(m[1])) continue;
    let body = p.slice(m[0].length);
    body = body.split(/^---\s*$/m)[0];
    body = body.replace(/```[\s\S]*?```/g, ' ').replace(/<tool-use[\s\S]*?<\/tool-use>/g, ' ').replace(/<details>[\s\S]*?<\/details>/g, ' ');
    out.push([m[1].trim().toLowerCase(), body]);
  }
  return out;
}

async function collect() {
  const seen = new Set(), files = [];
  for (const q of ['path:.specstory/history "Claude Code"', 'path:.specstory/history "claude-opus"', 'path:.specstory/history "claude-sonnet"', 'path:.specstory/history "claude-fable"']) {
    for (let page = 1; page <= 10; page++) {
      const r = await get(`https://api.github.com/search/code?q=${encodeURIComponent(q)}&per_page=100&page=${page}`, { Authorization: `Bearer ${TOKEN}` });
      await sleep(7000); // code search: 10 requests per minute
      if (!r?.items?.length) break;
      for (const it of r.items) {
        const key = `${it.repository.full_name}/${it.path}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const sha = (it.html_url.match(/\/blob\/([0-9a-f]{40})\//) || [])[1];
        if (sha) files.push({ repo: it.repository.full_name, path: it.path, sha });
      }
      console.error(`${q} page ${page}: ${files.length} files`);
    }
  }
  const rows = [];
  const bodies = fs.createWriteStream(BODIES);
  for (let i = 0; i < files.length; i += 8) {
    await Promise.all(files.slice(i, i + 8).map(async f => {
      const md = await get(`https://raw.githubusercontent.com/${f.repo}/${f.sha}/${encodeURI(f.path)}`, {}, true);
      if (!md) return;
      const date = (f.path.match(/(\d{4}-\d{2})-\d{2}/) || [])[1] || null;
      for (const [model, body] of agentProse(md)) {
        const counts = {};
        for (const [k, re] of Object.entries(MARKERS)) counts[k] = (body.match(re) || []).length;
        rows.push({ repo: f.repo, path: f.path, month: date, model, words: words(body), counts });
        bodies.write(JSON.stringify({ repo: f.repo, model, text: body }) + '\n');
      }
    }));
    if (i % 80 === 0) console.error(`fetched ${Math.min(i + 8, files.length)}/${files.length}`);
  }
  bodies.end();
  fs.writeFileSync(OUT, JSON.stringify(rows));
  console.log(`collect: ${files.length} transcripts, ${rows.length} agent turns`);
}

function family(model) {
  const m = model.replace(/\[.*?\]/g, '').replace(/-\d{8}$/, '');
  const hit = m.match(/claude-(opus|sonnet|haiku|fable)-(\d+)(?:[.-](\d+))?/);
  return hit ? `${hit[1]} ${hit[2]}${hit[3] ? '.' + hit[3] : ''}` : null;
}

function report() {
  const rows = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const by = new Map();
  for (const r of rows) {
    const f = family(r.model);
    if (!f) continue;
    const g = by.get(f) || { words: 0, turns: 0, repos: new Set(), counts: {} };
    g.words += r.words; g.turns++; g.repos.add(r.repo);
    for (const [k, v] of Object.entries(r.counts)) g.counts[k] = (g.counts[k] || 0) + v;
    by.set(f, g);
  }
  const keys = Object.keys(MARKERS);
  const L = [`| Model | Repos | Agent turns | Words | ${keys.join(' | ')} | All markers |`, `|---|---|---|---|${keys.map(() => '---').join('|')}|---|`];
  for (const [f, g] of [...by].filter(([, g]) => g.words >= 20000).sort()) {
    const per = k => ((1000 * (g.counts[k] || 0)) / g.words).toFixed(2);
    const all = ((1000 * keys.reduce((s, k) => s + (g.counts[k] || 0), 0)) / g.words).toFixed(2);
    L.push(`| ${f} | ${g.repos.size} | ${g.turns} | ${g.words.toLocaleString('en-US')} | ${keys.map(per).join(' | ')} | ${all} |`);
  }
  console.log(`Rates per 1,000 words of agent prose (code blocks removed); models with >= 20,000 words.\n\n${L.join('\n')}`);
}

// Words over-represented in newer models: rate per million words in the newer group vs the 4.5/4.6 group,
// counting only words used in >= 5 repos of the newer group, so one chatty repo cannot drive the list.
function lexicon() {
  const OLD = new Set(['opus 4.5', 'opus 4.6', 'sonnet 4.5', 'sonnet 4.6']), NEW = new Set(['opus 4.8', 'opus 5', 'sonnet 5']);
  const tally = () => ({ n: 0, w: new Map(), repos: new Map() });
  const g = { old: tally(), new: tally() };
  const lines = fs.readFileSync(BODIES, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const group = r => { const f = family(r.model); return OLD.has(f) ? 'old' : NEW.has(f) ? 'new' : null; };
  // --paired: only repos with transcripts from both groups, so topic differences between repos cancel out.
  const paired = process.argv.includes('--paired');
  const inOld = new Set(lines.filter(r => group(r) === 'old').map(r => r.repo)), inNew = new Set(lines.filter(r => group(r) === 'new').map(r => r.repo));
  const minRepos = paired ? 3 : 5;
  for (const r of lines) {
    const k = group(r);
    if (!k || (paired && !(inOld.has(r.repo) && inNew.has(r.repo)))) continue;
    for (const w of (r.text.toLowerCase().match(/[a-z][a-z'-]+/g) || [])) {
      g[k].n++; g[k].w.set(w, (g[k].w.get(w) || 0) + 1);
      if (!g[k].repos.has(w)) g[k].repos.set(w, new Set());
      g[k].repos.get(w).add(r.repo);
    }
  }
  const rows = [];
  for (const [w, c] of g.new.w) {
    if (c < 20 || g.new.repos.get(w).size < minRepos) continue;
    const a = (1e6 * c) / g.new.n, b = (1e6 * ((g.old.w.get(w) || 0) + 0.5)) / g.old.n;
    rows.push([w, a, b, a / b, g.new.repos.get(w).size]);
  }
  rows.sort((x, y) => y[3] - x[3]);
  console.log(`${paired ? `Paired repos only (${[...inOld].filter(x => inNew.has(x)).length}). ` : ''}Newer group: ${g.new.n.toLocaleString('en-US')} words; 4.5/4.6 group: ${g.old.n.toLocaleString('en-US')} words.\n\n| Word | Per million, newer | Per million, 4.5/4.6 | Ratio | Repos (newer) |\n|---|---|---|---|---|`);
  for (const [w, a, b, r, n] of rows.slice(0, 40)) console.log(`| ${w} | ${a.toFixed(0)} | ${b.toFixed(0)} | ${r.toFixed(1)} | ${n} |`);
}

const cmd = process.argv[2];
if (cmd === 'collect') await collect();
else if (cmd === 'report') report();
else if (cmd === 'lexicon') lexicon();
else if (cmd) { console.error('usage: claudese.mjs collect | report | lexicon'); process.exit(2); }
