#!/usr/bin/env node
// Which agent habits do users correct most often? Counts corrective user messages in public SpecStory chat
// histories (.specstory/history/*.md in public GitHub repos), grouped by habit and by distinct repo.
//
//   node history/research/earnstar_1/corrections.mjs collect    list transcripts via code search, fetch them, keep user turns
//   node history/research/earnstar_1/corrections.mjs report     habits ranked by the number of repos whose users corrected them
//
// A "correction" is a user turn with a corrective cue (stop, don't, never, I told you, why did you, ...) that also
// matches a habit pattern. Limitations: self-selected repos; English only; keyword patterns, not a reading of each turn.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'earnstar_1');
fs.mkdirSync(LAB, { recursive: true });
const OUT = path.join(LAB, 'user-turns.jsonl');
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

const QUERIES = ['"Claude Code"', '"claude-opus"', '"claude-sonnet"', 'cursor', 'codex', 'gemini', 'gpt'].map(t => `path:.specstory/history ${t}`);

function userTurns(md) {
  const out = [];
  for (const p of md.split(/^_\*\*/m)) {
    const m = p.match(/^User\b[^\n]*?\*\*_/);
    if (!m) continue;
    let body = p.slice(m[0].length).split(/^---\s*$/m)[0];
    body = body.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ').trim();
    if (body) out.push(body.slice(0, 4000));
  }
  return out;
}

async function collect() {
  const seen = new Set(), files = [];
  for (const q of QUERIES) {
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
  const outStream = fs.createWriteStream(OUT);
  let turns = 0;
  for (let i = 0; i < files.length; i += 8) {
    await Promise.all(files.slice(i, i + 8).map(async f => {
      const md = await get(`https://raw.githubusercontent.com/${f.repo}/${f.sha}/${encodeURI(f.path)}`, {}, true);
      if (!md) return;
      for (const text of userTurns(md)) { outStream.write(JSON.stringify({ repo: f.repo, path: f.path, text }) + '\n'); turns++; }
    }));
    if (i % 400 === 0) console.error(`fetched ${Math.min(i + 8, files.length)}/${files.length}`);
  }
  outStream.end();
  console.log(`collect: ${files.length} transcripts, ${turns} user turns`);
}

const CUE = /\b(stop|don'?t|do not|never|no more|quit|why (did|do|are|would) you|i (told|said|asked) you|you (keep|always|again)|please (don'?t|stop)|not what i asked|instead of|without asking)\b/i;
export const HABITS = {
  code_comments: /\bcomments?\b/i,
  emoji: /\bemojis?\b/i,
  extra_doc_files: /\b(markdown|\.md|readme|summary|summaries|report|documentation) (files?|docs?)\b|\b(create|creating|write|writing) (a |another |new )?(md|markdown|summary|readme|report)\b/i,
  mocks_placeholders: /\b(mocks?|mocked|placeholders?|dummy|stubs?|fake data|hard-?cod(e|ed|ing))\b/i,
  test_tampering: /\b(tests?)\b[^.]{0,60}\b(modif|chang|delet|remov|skip|disabl|weaken|cheat)|\b(modif|chang|delet|remov|skip|disabl|weaken)\w*\b[^.]{0,40}\btests?\b/i,
  silent_fallbacks: /\b(fallbacks?|silently|swallow\w*|default values?)\b/i,
  overengineering: /\b(over-?engineer\w*|too complex|over-?complicat\w*|simplif\w*|keep it simple|unnecessary|bloat\w*)\b/i,
  verbosity: /\b(verbose|too long|shorter|concise|brief|wall of text|rambl\w*|less text)\b/i,
  jargon_style: /\b(jargon|plain english|simple (words|language|terms)|metaphors?)\b/i,
  sycophancy: /\b(absolutely right|stop agreeing|flatter\w*|sycophan\w*|apologi[sz]\w*)\b/i,
  asks_too_much: /\b(stop asking|don'?t ask|just do it|keep going|continue without|without asking)\b/i,
  unrequested_changes: /\b(didn'?t ask|not asked|never asked|only (change|modify|touch|edit)|unrelated|other files|scope)\b/i,
  git_actions: /\b(commit|push|git (reset|checkout|stash|rebase))\b/i,
  deletes_code: /\b(delete|deleted|deleting|remove|removed|removing)\b/i,
  guessing: /\b(assum\w*|guess\w*|make (it|things) up|made (it|that) up|hallucinat\w*|invent\w*)\b/i,
  false_done: /\b(you said (it|that|you)|didn'?t actually|not (actually )?(done|fixed|working)|still (broken|failing|not working)|you claimed)\b/i,
  formatting: /\b(bullet points?|tables?|headings?|bold)\b/i,
  dev_servers: /\b(dev server|npm (run )?dev|run the server|start the server|background process)\b/i,
  types_any: /\b(any type|type any|as any|ts-ignore|eslint-disable)\b/i,
};

// Many "user" turns are injected text (compaction summaries, skill files, pasted diffs, git status). Keep turns that
// look typed by a person: short, few lines, and free of headings, diffs, tables, and file listings (S018 precision check).
export function humanShaped(t) {
  if (t.length > 600 || t.split('\n').length > 8) return false;
  return !/^\s*(#{1,6} |[+-]{1,3} |\||diff --git|@@ |On branch |Changes not staged|\d+:\d+ +(Warning|Error))/m.test(t);
}

function report() {
  const byHabit = new Map(Object.keys(HABITS).map(k => [k, { turns: 0, repos: new Set(), example: null }]));
  const repos = new Set(), corrRepos = new Set();
  let turns = 0, corrective = 0;
  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
    if (!line) continue;
    const r = JSON.parse(line);
    turns++; repos.add(r.repo);
    if (!humanShaped(r.text) || !CUE.test(r.text)) continue;
    corrective++; corrRepos.add(r.repo);
    for (const [k, re] of Object.entries(HABITS)) if (re.test(r.text)) { const g = byHabit.get(k); g.turns++; g.repos.add(r.repo); }
  }
  console.log(`User turns: ${turns.toLocaleString('en-US')} in ${repos.size} repos; with a corrective cue: ${corrective.toLocaleString('en-US')} in ${corrRepos.size} repos.\n`);
  console.log('| Habit | Repos with a correction | Share of those repos | Corrective turns |\n|---|---|---|---|');
  for (const [k, g] of [...byHabit].sort((a, b) => b[1].repos.size - a[1].repos.size))
    console.log(`| ${k} | ${g.repos.size} | ${Math.round((100 * g.repos.size) / corrRepos.size)} % | ${g.turns} |`);
}

const cmd = process.argv[2];
if (cmd === 'collect') await collect();
else if (cmd === 'report') report();
else if (cmd) { console.error('usage: corrections.mjs collect | report'); process.exit(2); }
