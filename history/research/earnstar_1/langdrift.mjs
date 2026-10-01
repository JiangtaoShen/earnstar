#!/usr/bin/env node
// Feasibility spike for idea #31 (reply-language lock): in public SpecStory chat histories whose user writes in
// Chinese, Japanese, or Korean, how often does the agent reply in English, by model?
//
//   node history/research/earnstar_1/langdrift.mjs collect   list transcripts with CJK user text via code search, fetch, split turns
//   node history/research/earnstar_1/langdrift.mjs report    English-reply rate in CJK-user transcripts, by model family
//
// Language is judged by script: the share of CJK characters among CJK plus Latin letters, after removing code,
// inline code, URLs, and paths. Search terms are built from code points so this file stays free of CJK text
// (Constitution §9). Limitations: self-selected repos; English replies can be legitimate (e.g., the user asked for them).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'earnstar_1');
fs.mkdirSync(LAB, { recursive: true });
const OUT = path.join(LAB, 'langdrift.jsonl');
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

// "please" in Simplified and Traditional Chinese, "please (do)" in Japanese, "please do" in Korean.
const TERMS = [[0x8BF7], [0x8ACB], [0x304F, 0x3060, 0x3055, 0x3044], [0xD574, 0xC8FC, 0xC138, 0xC694]].map(cps => String.fromCodePoint(...cps));
const CJK = [[0x3040, 0x30ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xac00, 0xd7af], [0xf900, 0xfaff]];
export function cjkShare(text) {
  const t = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/[\w./\\-]+\.(md|ts|js|py|json|yaml|yml|tsx|go|rs)\b/g, ' ');
  let c = 0, l = 0;
  for (const ch of t) {
    const cp = ch.codePointAt(0);
    if (CJK.some(([a, b]) => cp >= a && cp <= b)) c++;
    else if ((cp >= 65 && cp <= 90) || (cp >= 97 && cp <= 122)) l++;
  }
  return { cjk: c, latin: l, share: c + l ? c / (c + l) : null };
}

function turns(md) {
  const out = [];
  for (const p of md.split(/^_\*\*/m)) {
    const u = p.match(/^User\b[^\n]*?\*\*_/), a = p.match(/^Agent \(([^)]+)\)([^_]*)\*\*_/);
    if (!u && !a) continue;
    if (a && (/sidechain/.test(a[2]) || /synthetic/.test(a[1]))) continue;
    let body = p.slice((u || a)[0].length).split(/^---\s*$/m)[0];
    body = body.replace(/<tool-use[\s\S]*?<\/tool-use>/g, ' ').replace(/<details>[\s\S]*?<\/details>/g, ' ').replace(/<[^>]+>/g, ' ');
    out.push({ role: u ? 'user' : 'agent', model: a ? a[1].trim().toLowerCase() : null, ...cjkShare(body) });
  }
  return out;
}

async function collect() {
  const seen = new Set(), files = [];
  for (const t of TERMS) {
    for (let page = 1; page <= 10; page++) {
      const r = await get(`https://api.github.com/search/code?q=${encodeURIComponent(`path:.specstory/history ${t}`)}&per_page=100&page=${page}`, { Authorization: `Bearer ${TOKEN}` });
      await sleep(7000);
      if (!r?.items?.length) break;
      for (const it of r.items) {
        const key = `${it.repository.full_name}/${it.path}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const sha = (it.html_url.match(/\/blob\/([0-9a-f]{40})\//) || [])[1];
        if (sha) files.push({ repo: it.repository.full_name, path: it.path, sha });
      }
      console.error(`term ${TERMS.indexOf(t)} page ${page}: ${files.length} files`);
      if (r.items.length < 100) break;
    }
  }
  const out = fs.createWriteStream(OUT);
  for (let i = 0; i < files.length; i += 8) {
    await Promise.all(files.slice(i, i + 8).map(async f => {
      const md = await get(`https://raw.githubusercontent.com/${f.repo}/${f.sha}/${encodeURI(f.path)}`, {}, true);
      if (md) out.write(JSON.stringify({ repo: f.repo, path: f.path, turns: turns(md) }) + '\n');
    }));
    if (i % 400 === 0) console.error(`fetched ${Math.min(i + 8, files.length)}/${files.length}`);
  }
  out.end();
  console.log(`collect: ${files.length} transcripts`);
}

function family(model) {
  // Tools name models differently: claude-opus-4-8, claude-4.6-opus-high-thinking, copilot/claude-sonnet-4.5.
  const m = (model || '').replace(/\[.*?\]/g, '').replace(/-\d{8}$/, '');
  const a = m.match(/(opus|sonnet|haiku|fable)-(\d+)(?:[.-](\d)\b)?/), b = m.match(/(\d+)(?:[.-](\d))?-(opus|sonnet|haiku|fable)/);
  if (a) return `claude ${a[1]} ${a[2]}${a[3] ? '.' + a[3] : ''}`;
  if (b) return `claude ${b[3]} ${b[1]}${b[2] ? '.' + b[2] : ''}`;
  const g = m.match(/(gpt-[\d.]+|gemini-[\d.]+|composer|grok)/);
  if (g) return g[1].replace(/^composer$/, 'cursor composer');
  return /default|auto/.test(m) ? 'auto/default' : 'other';
}

function report() {
  const by = new Map();
  let tx = 0, cjkTx = 0;
  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
    if (!line) continue;
    const r = JSON.parse(line);
    tx++;
    const users = r.turns.filter(t => t.role === 'user' && t.cjk + t.latin >= 5);
    // A CJK-user transcript: at least 3 user turns, and at least 70 % of them mostly CJK.
    if (users.length < 3 || users.filter(t => t.share > 0.3).length / users.length < 0.7) continue;
    cjkTx++;
    for (const t of r.turns.filter(t => t.role === 'agent' && t.cjk + t.latin >= 30)) {
      const f = family(t.model);
      const g = by.get(f) || { replies: 0, english: 0, repos: new Set(), engRepos: new Set() };
      g.replies++; g.repos.add(r.repo);
      if (t.share < 0.05) { g.english++; g.engRepos.add(r.repo); }
      by.set(f, g);
    }
  }
  console.log(`Transcripts: ${tx}; with a CJK-writing user: ${cjkTx}. English reply = < 5 % CJK characters among letters, ≥ 30 letters.\n`);
  console.log('| Model | Repos | Agent replies | English replies | Share | Repos with any English reply |\n|---|---|---|---|---|---|');
  for (const [f, g] of [...by].filter(([, g]) => g.replies >= 60).sort((a, b) => b[1].replies - a[1].replies))
    console.log(`| ${f} | ${g.repos.size} | ${g.replies} | ${g.english} | ${((100 * g.english) / g.replies).toFixed(1)} % | ${g.engRepos.size} |`);
}

const cmd = process.argv[2];
if (cmd === 'collect') await collect();
else if (cmd === 'report') report();
else if (cmd) { console.error('usage: langdrift.mjs collect | report'); process.exit(2); }
