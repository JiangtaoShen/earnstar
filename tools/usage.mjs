#!/usr/bin/env node
// Session accounting from Claude Code transcripts (~/.claude/projects/<slug>/**/*.jsonl) and git.
//
//   node tools/usage.mjs --since <ISO> [--until <ISO>]                  print a summary
//   node tools/usage.mjs --since <ISO> --ledger --id S001 --kind work --project earnstar_1 --phase P0 [--note "..."]
//   node tools/usage.mjs --gap                                          record everything since the last ledger entry;
//                                                                       prints open_utc for the new session
// Kinds: work | setup | admin | reconstructed | gap.
//
// Each ledger entry records, for the half-open window [since, until):
//   time      wall-clock, active, and owner-wait minutes. Active time excludes gaps that end at an owner prompt or
//             an answered question (reported as owner_wait_min) and gaps longer than IDLE_MIN (sleep or hang).
//   tokens    per model, deduplicated by requestId (one API call spans several transcript lines).
//   agent     Claude Code versions, entrypoints, permission modes, effort levels.
//   work      tool calls by name, subagents launched, context compactions, web searches and URLs (research trail).
//   git       per repo (root + projects/*): commits in the window, human commits (no Claude co-author trailer),
//             lines changed, and uncommitted changes at close. The close-out commit lands in the next gap entry.
//   rules     Constitution commit in effect at open; whether it was amended in the window.
//   machine   hardware profile ID and software versions (tools/machine.mjs); session entries only.
//   evidence  archived transcripts with byte length and SHA-256 (tools/archive.mjs).
// Ledger windows are contiguous, so the ledger covers every token and commit.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectMachine, saveProfile } from './machine.mjs';
import { archiveFiles } from './archive.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = path.join(ROOT, 'history', 'ledger.jsonl');
const IDLE_MIN = 60;

function args() {
  const a = process.argv.slice(2), o = {};
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const k = a[i].slice(2), v = a[i + 1];
    if (v === undefined || v.startsWith('--')) o[k] = true; else { o[k] = v; i++; }
  }
  return o;
}

function transcriptDirs() {
  if (process.env.EARNSTAR_TRANSCRIPTS) return [process.env.EARNSTAR_TRANSCRIPTS];
  const base = path.join(os.homedir(), '.claude', 'projects');
  const slug = ROOT.replace(/[:\\/]/g, '-');
  if (!fs.existsSync(base)) return [];
  // Prefix match also covers sessions started inside projects/earnstar_N.
  return fs.readdirSync(base).filter(d => d === slug || d.startsWith(slug + '-')).map(d => path.join(base, d));
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}

const inc = (obj, k, n = 1) => { obj[k] = (obj[k] ?? 0) + n; };

export function summarize(since, until) {
  const t0 = Date.parse(since), t1 = Date.parse(until);
  if (Number.isNaN(t0) || Number.isNaN(t1)) throw new Error('invalid --since/--until');
  const stamps = [], requests = new Map(), toolUses = new Map(), sessions = new Set(), files = new Set();
  const versions = new Set(), entrypoints = new Set(), modes = new Set();
  let prompts = 0, compactions = 0, modeBefore = null; // permissionMode sits on owner prompts, often just before `since`
  for (const dir of transcriptDirs()) for (const file of walk(dir)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (!line) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const t = Date.parse(o.timestamp);
      if (!Number.isNaN(t) && t < t0 && o.permissionMode && (!modeBefore || t > modeBefore.t)) modeBefore = { t, mode: o.permissionMode };
      if (Number.isNaN(t) || t < t0 || t >= t1) continue;
      files.add(file);
      if (o.version) versions.add(o.version);
      if (o.entrypoint) entrypoints.add(o.entrypoint);
      if (o.permissionMode) modes.add(o.permissionMode);
      if (o.type === 'system' && /compact/i.test(o.subtype ?? '')) compactions++;
      if (o.type !== 'user' && o.type !== 'assistant') continue;
      if (o.sessionId) sessions.add(o.sessionId);
      if (o.type === 'user') {
        const c = o.message?.content;
        const answered = o.toolUseResult && typeof o.toolUseResult === 'object' && 'answers' in o.toolUseResult;
        const isPrompt = answered || (!o.isMeta && !o.isSidechain &&
          (typeof c === 'string' || (Array.isArray(c) && c.some(x => x.type === 'text'))));
        if (isPrompt) prompts++;
        stamps.push({ t, prompt: isPrompt });
        continue;
      }
      stamps.push({ t, prompt: false });
      const m = o.message;
      for (const b of Array.isArray(m?.content) ? m.content : []) {
        if (b.type === 'tool_use' && b.id) toolUses.set(b.id, { name: b.name, input: b.input ?? {}, sidechain: !!o.isSidechain });
      }
      if (!m?.usage || !m.model || m.model === '<synthetic>') continue;
      const key = o.requestId || m.id || o.uuid;
      const prev = requests.get(key);
      if (!prev || (m.usage.output_tokens ?? 0) >= (prev.usage.output_tokens ?? 0)) {
        requests.set(key, { model: m.model, usage: m.usage, effort: o.effort ?? 'unavailable' });
      }
    }
  }

  const zero = () => ({ requests: 0, input: 0, cache_creation: 0, cache_read: 0, output: 0, thinking: 0 });
  const models = {}, totals = zero(), effort = {};
  for (const r of requests.values()) {
    const u = r.usage, m = (models[r.model] ??= zero());
    inc(effort, r.effort);
    for (const acc of [m, totals]) {
      acc.requests++;
      acc.input += u.input_tokens ?? 0;
      acc.cache_creation += u.cache_creation_input_tokens ?? 0;
      acc.cache_read += u.cache_read_input_tokens ?? 0;
      acc.output += u.output_tokens ?? 0;
      acc.thinking += u.output_tokens_details?.thinking_tokens ?? 0;
    }
  }

  const tool_calls = {}, searches = new Set(), urls = new Set();
  let subagents = 0, sidechain_calls = 0;
  for (const u of toolUses.values()) {
    inc(tool_calls, u.name);
    if (u.sidechain) sidechain_calls++;
    if (u.name === 'Agent' || u.name === 'Task') subagents++;
    if (typeof u.input.query === 'string' && /search/i.test(u.name)) searches.add(u.input.query);
    if (typeof u.input.url === 'string' && /^https?:/.test(u.input.url)) urls.add(u.input.url);
  }

  stamps.sort((a, b) => a.t - b.t);
  let active = 0, wait = 0;
  for (let i = 1; i < stamps.length; i++) {
    const d = stamps[i].t - stamps[i - 1].t;
    if (stamps[i].prompt) wait += d;
    else if (d <= IDLE_MIN * 60000) active += d;
  }
  const min = ms => Math.round(ms / 6000) / 10;
  const iso = s => (s === undefined ? null : new Date(s.t).toISOString());
  return {
    window: { since: new Date(t0).toISOString(), until: new Date(t1).toISOString() },
    first_record_utc: iso(stamps[0]),
    last_record_utc: iso(stamps.at(-1)),
    wall_clock_min: stamps.length ? min(stamps.at(-1).t - stamps[0].t) : 0,
    active_min: min(active),
    owner_wait_min: min(wait),
    idle_threshold_min: IDLE_MIN,
    owner_prompts: prompts,
    claude_sessions: [...sessions],
    agent: { claude_code_versions: [...versions], entrypoints: [...entrypoints],
      permission_modes: modes.size ? [...modes] : modeBefore ? [modeBefore.mode] : [],
      permission_mode_source: modes.size ? 'window' : modeBefore ? `last before window (${new Date(modeBefore.t).toISOString()})` : 'unavailable',
      effort },
    models,
    totals: { ...totals, all_tokens: totals.input + totals.cache_creation + totals.cache_read + totals.output },
    work: { tool_calls, subagents, sidechain_tool_calls: sidechain_calls, compactions, web_searches: [...searches], web_urls: [...urls] },
    source: 'Claude Code transcripts; thinking is a subset of output; all_tokens = input + cache_creation + cache_read + output',
    _files: [...files],
  };
}

const git = (repo, a) => {
  try { return execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
};

function repos() {
  const list = [ROOT];
  const pdir = path.join(ROOT, 'projects');
  if (fs.existsSync(pdir)) for (const d of fs.readdirSync(pdir)) {
    const p = path.join(pdir, d);
    if (fs.existsSync(path.join(p, '.git'))) list.push(p);
  }
  return list;
}

export function gitActivity(since, until) {
  return repos().map(repo => {
    const name = repo === ROOT ? 'earnstar' : path.basename(repo);
    const log = git(repo, ['log', '--all', `--since=${since}`, `--until=${until}`, '--numstat',
      '--format=@@%H%x09%(trailers:key=Co-Authored-By,valueonly,separator=;)']) ?? '';
    const r = { repo: name, commits: 0, human_commits: 0, shas: [], files_changed: 0, insertions: 0, deletions: 0 };
    for (const l of log.split(/\r?\n/)) {
      if (l.startsWith('@@')) {
        const [sha, trailer = ''] = l.slice(2).split('\t');
        r.commits++; r.shas.push(sha.slice(0, 7));
        if (!/claude/i.test(trailer)) r.human_commits++;
      } else if (/^(\d+|-)\t(\d+|-)\t/.test(l)) {
        const [a, d] = l.split('\t');
        r.files_changed++; r.insertions += Number(a) || 0; r.deletions += Number(d) || 0;
      }
    }
    r.uncommitted = { shortstat: git(repo, ['diff', '--shortstat', 'HEAD']) || 'none',
      untracked: (git(repo, ['ls-files', '--others', '--exclude-standard']) || '').split(/\r?\n/).filter(Boolean).length };
    return r;
  });
}

export function rulesInEffect(since, until) {
  const atOpen = git(ROOT, ['log', '-1', `--before=${since}`, '--format=%H', '--', 'CLAUDE.md']) || 'none';
  const inWindow = git(ROOT, ['log', `--since=${since}`, `--until=${until}`, '--format=%h', '--', 'CLAUDE.md']) || '';
  const dirty = (git(ROOT, ['status', '--porcelain', '--', 'CLAUDE.md']) || '') !== '';
  return { constitution_at_open: atOpen, amended_in_window: inWindow !== '' || dirty,
    amending_commits: inWindow.split(/\r?\n/).filter(Boolean), uncommitted_amendment: dirty };
}

function lastLedger() {
  if (!fs.existsSync(LEDGER)) return null;
  const lines = fs.readFileSync(LEDGER, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  return lines.length ? JSON.parse(lines.at(-1)) : null;
}

function record(meta, s, withMachine) {
  const { _files, ...summary } = s;
  const entry = { ...meta, open_utc: s.window.since, close_utc: s.window.until, recorded_utc: new Date().toISOString() };
  if (withMachine) {
    const m = collectMachine();
    entry.machine = { id: m.machine_id, profile: saveProfile(m), software: m.software };
  }
  Object.assign(entry, summary, {
    git: gitActivity(s.window.since, s.window.until),
    rules: rulesInEffect(s.window.since, s.window.until),
    evidence: archiveFiles(_files),
  });
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
  return entry;
}

const o = args();
const now = new Date().toISOString();
if (o.gap) {
  const last = lastLedger();
  if (!last) { console.log(JSON.stringify({ open_utc: now, gap: 'no ledger yet' }, null, 2)); process.exit(0); }
  const s = summarize(last.close_utc, now);
  const commits = gitActivity(last.close_utc, now).reduce((n, r) => n + r.commits, 0);
  if (s.totals.requests > 0 || commits > 0) {
    record({ id: `${last.id}+gap`, kind: 'gap', project: null, phase: null,
      note: 'Activity after the previous ledger entry: its close-out (log, commit, reply) and any out-of-session chat.' }, s, false);
  }
  console.log(JSON.stringify({ open_utc: now, gap_requests: s.totals.requests, gap_tokens: s.totals.all_tokens, gap_commits: commits }, null, 2));
} else if (o.since) {
  const until = typeof o.until === 'string' ? o.until : now;
  const s = summarize(o.since, until);
  if (o.ledger) {
    for (const k of ['id', 'kind']) if (typeof o[k] !== 'string') throw new Error(`--ledger requires --${k}`);
    const e = record({ id: o.id, kind: o.kind, project: o.project ?? null, phase: o.phase ?? null, note: o.note ?? null }, s, true);
    console.log(JSON.stringify(e, null, 2));
  } else {
    const { _files, ...summary } = s;
    console.log(JSON.stringify({ ...summary, git: gitActivity(s.window.since, s.window.until), rules: rulesInEffect(s.window.since, s.window.until) }, null, 2));
  }
} else {
  console.error('usage: --since <ISO> [--until <ISO>] [--ledger --id SNNN --kind work|setup|admin|reconstructed --project key --phase Pn] | --gap');
  process.exit(1);
}
