#!/usr/bin/env node
// Owner-supplied evidence for promotion items (screenshots of posts, comments, scores).
//
//   node tools/evidence.mjs --item C-001 <file> [<file> ...]
//
// Copies each file into archive/promo/<project>/<item>/ (private and git-ignored: screenshots can show account
// details) and records {file, bytes, sha256, added_utc} under the item's `evidence` in history/channels.json,
// so the public record can later be checked against the private copy. Source files (e.g., in inbox/) are left
// in place; delete them after the commit.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHANNELS = path.join(ROOT, 'history', 'channels.json');
const BOM_RE = new RegExp('^' + String.fromCharCode(0xfeff));

const a = process.argv.slice(2);
const i = a.indexOf('--item');
if (i < 0 || !a[i + 1] || a.length < 3) { console.error('usage: node tools/evidence.mjs --item C-NNN <file> [...]'); process.exit(1); }
const id = a[i + 1];
const files = a.filter((_, k) => k !== i && k !== i + 1);

const reg = JSON.parse(fs.readFileSync(CHANNELS, 'utf8').replace(BOM_RE, ''));
const item = (reg.items ?? []).find(x => x.id === id);
if (!item) { console.error(`no item ${id} in history/channels.json; register the post first`); process.exit(1); }

const dir = path.join(ROOT, 'archive', 'promo', item.project ?? 'unknown', id);
fs.mkdirSync(dir, { recursive: true });
item.evidence ??= [];
for (const src of files) {
  const buf = fs.readFileSync(src);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  if (item.evidence.some(e => e.sha256 === sha256)) { console.log(`skip duplicate ${src}`); continue; }
  // Name by time and hash only: source names (e.g., a localized screenshot tool's default) may be non-English.
  const ext = (path.extname(src).toLowerCase().match(/^\.[a-z0-9]{1,5}$/) ?? [''])[0];
  const name = `${new Date().toISOString().replace(/[:.]/g, '-')}_${sha256.slice(0, 12)}${ext}`;
  fs.writeFileSync(path.join(dir, name), buf);
  item.evidence.push({ file: path.relative(ROOT, path.join(dir, name)).replace(/\\/g, '/'), bytes: buf.length, sha256, added_utc: new Date().toISOString() });
  console.log(`archived ${src} -> ${name} (${sha256.slice(0, 12)})`);
}
fs.writeFileSync(CHANNELS, JSON.stringify(reg, null, 2) + '\n');
