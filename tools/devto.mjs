#!/usr/bin/env node
// DEV (dev.to) publishing and stats through the Forem API v1 (Constitution §3B; playbook/launch.md).
//
//   node tools/devto.mjs whoami                                    verify the key (prints the username only)
//   node tools/devto.mjs post --item O-NNN [--project key] <file>  publish an approved article package
//   node tools/devto.mjs post --item O-NNN --validate <file>       run every check without publishing
//   node tools/devto.mjs stats                                     views, reactions, comments of own articles
//
// Key: DEVTO_API_KEY from the process environment, or from the user environment in the registry (so a newly set
// key works without restarting Claude Code). The key is never printed, logged, or written anywhere.
// `post` refuses unless: the outbox item is `approved` (set only after the owner approves it in chat); the article
// passes tools/check.mjs; and it discloses AI authorship (DEV requires it; the program's standard line names
// Claude Code). The file is Markdown with DEV front matter (title, published, tags <= 4, canonical_url, series).
// A published article is registered in history/channels.json as type `devto`.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://dev.to/api';
const BOM_RE = new RegExp('^' + String.fromCharCode(0xfeff));
const CHANNELS = path.join(ROOT, 'history', 'channels.json');
const OUTBOX = path.join(ROOT, 'history', 'outbox.md');

export function devtoKey() {
  if (process.env.DEVTO_API_KEY) return process.env.DEVTO_API_KEY;
  if (process.platform !== 'win32') return null;
  try {
    const out = execFileSync('reg', ['query', 'HKCU\\Environment', '/v', 'DEVTO_API_KEY'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const m = out.match(/DEVTO_API_KEY\s+REG_(?:EXPAND_)?SZ\s+(\S+)/);
    return m ? m[1] : null;
  } catch { return null; }
}

export async function devto(method, p, key, body) {
  const r = await fetch(API + p, {
    method,
    headers: { 'api-key': key, accept: 'application/vnd.forem.api-v1+json', 'content-type': 'application/json',
      'user-agent': 'earnstar-devto/1.0 (github.com/JiangtaoShen/earnstar)' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`DEV API ${method} ${p}: HTTP ${r.status} ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

function outboxStatus(id) {
  for (const line of fs.readFileSync(OUTBOX, 'utf8').split(/\r?\n/)) {
    const c = line.split('|').map(s => s.trim());
    if (c[1] === id) return c[6] ?? null;
  }
  return null;
}

function frontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return Object.fromEntries(m[1].split(/\r?\n/).map(l => l.match(/^(\w+):\s*(.*)$/)).filter(Boolean).map(x => [x[1], x[2].trim()]));
}

async function main() {
const a = process.argv.slice(2);
const arg = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const cmd = a[0];
const key = devtoKey();
const needKey = () => { if (!key) { console.error('DEVTO_API_KEY is not set (see playbook/launch.md, "DEV")'); process.exit(1); } };

if (cmd === 'whoami') {
  needKey();
  const u = await devto('GET', '/users/me', key);
  console.log(JSON.stringify({ username: u.username, id: u.id, joined_at: u.joined_at }));
} else if (cmd === 'stats') {
  needKey();
  const list = await devto('GET', '/articles/me/all?per_page=1000', key);
  for (const x of list) console.log(JSON.stringify({ id: x.id, published: x.published, url: x.url, views: x.page_views_count, reactions: x.public_reactions_count, comments: x.comments_count }));
} else if (cmd === 'post') {
  const item = arg('--item'), file = a.at(-1);
  if (!item || !file || file.startsWith('--')) { console.error('usage: post --item O-NNN [--project key] <file.md>'); process.exit(1); }
  const status = outboxStatus(item);
  if (status !== 'approved') { console.error(`outbox ${item} status is "${status}"; publish only after the owner approves it in chat`); process.exit(1); }
  const md = fs.readFileSync(file, 'utf8').replace(BOM_RE, '');
  const fm = frontMatter(md);
  if (!fm?.title) { console.error('front matter with a title is required'); process.exit(1); }
  if ((fm.tags ?? '').split(',').filter(t => t.trim()).length > 4) { console.error('DEV allows at most 4 tags'); process.exit(1); }
  if (!/Claude Code/.test(md) || !/\bAI\b/.test(md)) { console.error('the article must disclose AI authorship (name Claude Code and say it is AI)'); process.exit(1); }
  const chk = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'check.mjs'), '--file', file], { encoding: 'utf8' });
  if (chk.status !== 0) { console.error(chk.stderr || chk.stdout); process.exit(1); }
  if (a.includes('--validate')) { console.log('package valid; not published (--validate)'); return; }
  needKey();
  const res = await devto('POST', '/articles', key, { article: { body_markdown: md } });
  console.log(JSON.stringify({ id: res.id, url: res.url, published: res.published, published_at: res.published_at }));
  if (res.published) {
    const reg = JSON.parse(fs.readFileSync(CHANNELS, 'utf8').replace(BOM_RE, ''));
    const n = Math.max(0, ...reg.items.map(x => Number(String(x.id).slice(2)) || 0)) + 1;
    const project = arg('--project') ?? path.relative(ROOT, file).replace(/\\/g, '/').match(/history\/promo\/([^/]+)\//)?.[1] ?? null;
    reg.items.push({ id: `C-${String(n).padStart(3, '0')}`, outbox: item, project, type: 'devto', url: res.url, devto_id: res.id,
      posted_utc: res.published_at ?? new Date().toISOString(), by: 'developer',
      promo: path.relative(ROOT, path.dirname(path.resolve(file))).replace(/\\/g, '/') + '/', owner_minutes: null });
    fs.writeFileSync(CHANNELS, JSON.stringify(reg, null, 2) + '\n');
    console.log(`registered as C-${String(n).padStart(3, '0')} in history/channels.json`);
  }
} else {
  console.error('usage: node tools/devto.mjs whoami | stats | post --item O-NNN [--project key] <file.md>');
  process.exit(1);
}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
