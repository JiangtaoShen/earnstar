#!/usr/bin/env node
// Content policy check for program repos: no Chinese (Constitution §9), no secrets, and no owner email (§3C, privacy).
//
//   node tools/check.mjs [--repo <path>]    scan all tracked and untracked (non-ignored) files; exit 1 on findings
//   node tools/check.mjs --staged           scan the staged version of staged files (pre-commit hook)
//   node tools/check.mjs --msg <file>       scan a commit message file (commit-msg hook)
//   node tools/check.mjs --file <file>      scan one file (e.g., an article before publishing)
//   node tools/check.mjs --install <repo>   install pre-commit and commit-msg hooks into <repo>/.git/hooks
//
// Hooks must never be bypassed (--no-verify). Owner emails are matched by SHA-256, so they never appear here.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
// CJK ideographs, radicals, kana, compatibility ideographs, CJK and full-width punctuation (by code point).
const CJK_RANGES = [[0x2e80, 0x2fdf], [0x3000, 0x303f], [0x3040, 0x30ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0xff00, 0xffef]];
const hasCJK = s => { for (const ch of s) { const c = ch.codePointAt(0); if (CJK_RANGES.some(([lo, hi]) => c >= lo && c <= hi)) return true; } return false; };
const SECRETS = [
  ['GitHub token', /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['Anthropic key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI-style key', /\bsk-(proj-)?[A-Za-z0-9]{32,}\b/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['npm token', /\bnpm_[A-Za-z0-9]{36}\b/],
  ['PyPI token', /\bpypi-AgE[A-Za-z0-9_-]{50,}/],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const BLOCKED_EMAIL_SHA256 = new Set([
  'be5aa1a637313ad64d627751fb8ef3b2564e94bd78b9ed983a3a44db2ec22f1f',
  '50a6f429739b06fde0aeb21d9b8ed42eef429c23dd2f55f582288df3aefc2a07',
]);

const git = (repo, a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 256 << 20 });
const sha = s => crypto.createHash('sha256').update(s.toLowerCase()).digest('hex');

function scan(label, text, out) {
  if (text.includes('\0')) return; // binary
  text.split(/\r?\n/).forEach((line, i) => {
    const where = `${label}:${i + 1}`;
    if (hasCJK(line)) out.push(`${where}: Chinese text: ${line.trim().slice(0, 100)}`);
    for (const [name, re] of SECRETS) if (re.test(line)) out.push(`${where}: possible ${name}`);
    for (const m of line.match(EMAIL) ?? []) if (BLOCKED_EMAIL_SHA256.has(sha(m))) out.push(`${where}: owner email`);
  });
}

function report(findings, quiet = false) {
  if (!findings.length) { if (!quiet) console.log('check: ok'); return; }
  console.error(`check: ${findings.length} finding(s)\n` + findings.map(f => `  ${f}`).join('\n'));
  process.exit(1);
}

const a = process.argv.slice(2);
const arg = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
const findings = [];

if (a.includes('--install')) {
  const repo = path.resolve(arg('--install') ?? '.');
  const hooks = path.join(git(repo, ['rev-parse', '--absolute-git-dir']).trim(), 'hooks');
  const node = SELF.replace(/\\/g, '/');
  fs.mkdirSync(hooks, { recursive: true });
  fs.writeFileSync(path.join(hooks, 'pre-commit'), `#!/bin/sh\nexec node "${node}" --staged\n`, { mode: 0o755 });
  fs.writeFileSync(path.join(hooks, 'commit-msg'), `#!/bin/sh\nexec node "${node}" --msg "$1"\n`, { mode: 0o755 });
  console.log(`hooks installed in ${hooks}`);
} else if (a.includes('--file')) {
  scan(path.basename(arg('--file')), fs.readFileSync(arg('--file'), 'utf8'), findings);
  report(findings);
} else if (a.includes('--msg')) {
  scan('commit message', fs.readFileSync(arg('--msg'), 'utf8').split(/\r?\n/).filter(l => !l.startsWith('#')).join('\n'), findings);
  report(findings, true);
} else if (a.includes('--staged')) {
  const repo = git('.', ['rev-parse', '--show-toplevel']).trim();
  for (const f of git(repo, ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']).split('\0').filter(Boolean)) {
    scan(f, git(repo, ['show', `:${f}`]), findings);
  }
  report(findings, true);
} else {
  const repo = path.resolve(arg('--repo') ?? git('.', ['rev-parse', '--show-toplevel']).trim());
  for (const f of git(repo, ['ls-files', '-co', '--exclude-standard', '-z']).split('\0').filter(Boolean)) {
    const p = path.join(repo, f);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) scan(f, fs.readFileSync(p, 'utf8'), findings);
  }
  report(findings);
}
