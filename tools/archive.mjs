#!/usr/bin/env node
// Evidence retention for Claude Code transcripts.
//
//   node tools/archive.mjs --verify    check every transcript hash recorded in history/ledger.jsonl
//
// archiveFiles(files), called by tools/usage.mjs on every ledger write, copies transcripts into
// archive/transcripts/<path under ~/.claude/projects>. The folder is git-ignored because transcripts contain
// system prompts and personal data; only the hashes are public (ledger field `evidence`).
// Transcripts are append-only, so a recorded {bytes, sha256} is verified against the first `bytes` bytes of
// the latest archived copy. If a new version does not extend the archived one, the old copy is kept as
// <name>.<timestamp>.bak rather than overwritten.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVE = path.join(ROOT, 'archive', 'transcripts');
const BASE = path.join(os.homedir(), '.claude', 'projects');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');

function rel(src) {
  const r = path.relative(BASE, src);
  return (r.startsWith('..') || path.isAbsolute(r) ? path.basename(src) : r).replace(/\\/g, '/');
}

export function archiveFiles(files) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return [...files].sort().map(src => {
    const buf = fs.readFileSync(src);
    const file = rel(src), dst = path.join(ARCHIVE, file);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    if (fs.existsSync(dst)) {
      const old = fs.readFileSync(dst);
      const extends_ = old.length <= buf.length && buf.subarray(0, old.length).equals(old);
      if (!extends_) fs.renameSync(dst, `${dst}.${stamp}.bak`);
    }
    fs.writeFileSync(dst, buf);
    return { file, bytes: buf.length, sha256: sha(buf) };
  });
}

function verify() {
  const ledger = path.join(ROOT, 'history', 'ledger.jsonl');
  const res = { checked: 0, ok: 0, failed: [] };
  for (const line of fs.readFileSync(ledger, 'utf8').split(/\r?\n/).filter(Boolean)) {
    const e = JSON.parse(line);
    for (const ev of e.evidence ?? []) {
      res.checked++;
      const dst = path.join(ARCHIVE, ev.file), dir = path.dirname(dst), name = path.basename(dst);
      const candidates = [dst, ...(fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.startsWith(name + '.') && f.endsWith('.bak')).map(f => path.join(dir, f)) : [])];
      const ok = candidates.some(c => {
        if (!fs.existsSync(c)) return false;
        const b = fs.readFileSync(c);
        return b.length >= ev.bytes && sha(b.subarray(0, ev.bytes)) === ev.sha256;
      });
      if (ok) res.ok++; else res.failed.push({ ledger_id: e.id, ...ev });
    }
  }
  console.log(JSON.stringify(res, null, 2));
  if (res.failed.length) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--verify')) verify();
  else { console.error('usage: node tools/archive.mjs --verify'); process.exit(1); }
}
