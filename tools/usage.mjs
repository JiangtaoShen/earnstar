#!/usr/bin/env node
// Time and token accounting from Claude Code transcripts (~/.claude/projects/<slug>/**/*.jsonl).
//
//   node tools/usage.mjs --since <ISO> [--until <ISO>]                  print a summary
//   node tools/usage.mjs --since <ISO> --ledger --id S001 --kind work --project earnstar_1 --phase P0 [--note "..."]
//   node tools/usage.mjs --gap                                          record tokens since the last ledger entry;
//                                                                       prints open_utc for the new session
//
// Windows are half-open [since, until). Ledger windows are contiguous, so the ledger covers every token.
// Assistant records are deduplicated by requestId (one API call is split across several transcript lines).
// Active time sums gaps between consecutive records, except gaps that end at an owner prompt or an answered
// question (waiting for the owner, reported as owner_wait_min) and gaps longer than IDLE_MIN (sleep or hang).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

export function summarize(since, until) {
  const t0 = Date.parse(since), t1 = Date.parse(until);
  if (Number.isNaN(t0) || Number.isNaN(t1)) throw new Error('invalid --since/--until');
  const stamps = [], requests = new Map(), sessions = new Set(), effort = {};
  let prompts = 0;
  for (const dir of transcriptDirs()) for (const file of walk(dir)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (!line) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      if (o.type !== 'user' && o.type !== 'assistant') continue;
      const t = Date.parse(o.timestamp);
      if (Number.isNaN(t) || t < t0 || t >= t1) continue;
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
      if (!m?.usage || !m.model || m.model === '<synthetic>') continue;
      const key = o.requestId || m.id || o.uuid;
      const prev = requests.get(key);
      if (!prev || (m.usage.output_tokens ?? 0) >= (prev.usage.output_tokens ?? 0)) {
        requests.set(key, { model: m.model, usage: m.usage, effort: o.effort ?? 'unavailable' });
      }
    }
  }
  const zero = () => ({ requests: 0, input: 0, cache_creation: 0, cache_read: 0, output: 0, thinking: 0 });
  const models = {}, totals = zero();
  for (const r of requests.values()) {
    const u = r.usage, m = (models[r.model] ??= zero());
    effort[r.effort] = (effort[r.effort] ?? 0) + 1;
    for (const acc of [m, totals]) {
      acc.requests++;
      acc.input += u.input_tokens ?? 0;
      acc.cache_creation += u.cache_creation_input_tokens ?? 0;
      acc.cache_read += u.cache_read_input_tokens ?? 0;
      acc.output += u.output_tokens ?? 0;
      acc.thinking += u.output_tokens_details?.thinking_tokens ?? 0;
    }
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
    models,
    effort,
    totals: { ...totals, all_tokens: totals.input + totals.cache_creation + totals.cache_read + totals.output },
    source: 'Claude Code transcripts; thinking is a subset of output; all_tokens = input + cache_creation + cache_read + output',
  };
}

function lastLedger() {
  if (!fs.existsSync(LEDGER)) return null;
  const lines = fs.readFileSync(LEDGER, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  return lines.length ? JSON.parse(lines.at(-1)) : null;
}

function append(entry) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
}

const o = args();
const now = new Date().toISOString();
if (o.gap) {
  const last = lastLedger();
  if (!last) { console.log(JSON.stringify({ open_utc: now, gap: 'no ledger yet' }, null, 2)); process.exit(0); }
  const s = summarize(last.close_utc, now);
  if (s.totals.requests > 0) {
    append({ id: `${last.id}+gap`, kind: 'gap', project: null, phase: null, open_utc: last.close_utc, close_utc: now,
      recorded_utc: now, note: 'Tokens after the previous ledger entry (its close-out and any out-of-session chat).', ...s });
  }
  console.log(JSON.stringify({ open_utc: now, gap_requests: s.totals.requests, gap_tokens: s.totals.all_tokens }, null, 2));
} else if (o.since) {
  const until = typeof o.until === 'string' ? o.until : now;
  const s = summarize(o.since, until);
  if (o.ledger) {
    for (const k of ['id', 'kind']) if (typeof o[k] !== 'string') throw new Error(`--ledger requires --${k}`);
    append({ id: o.id, kind: o.kind, project: o.project ?? null, phase: o.phase ?? null,
      open_utc: s.window.since, close_utc: s.window.until, recorded_utc: now, note: o.note ?? null, ...s });
  }
  console.log(JSON.stringify(s, null, 2));
} else {
  console.error('usage: --since <ISO> [--until <ISO>] [--ledger --id SNNN --kind work|setup --project key --phase Pn] | --gap');
  process.exit(1);
}
