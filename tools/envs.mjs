#!/usr/bin/env node
// Python environment inventory, used to reuse existing environments before creating new ones.
//
//   node tools/envs.mjs      probe every conda env and standalone Python; write lab/envs.json; print a summary
//
// Sources: ~/.conda/environments.txt (conda root and envs), `py -0p` (python.org installs), `uv python list`.
// lab/envs.json is private (git-ignored): owner environment names and paths can reveal the owner's private work.
// Public logs refer to owner environments by spec (e.g., "owner conda env, py3.10, torch 2.5.1+cu121").
// Environments created by the developer are named earnstar-<purpose> and may be named publicly.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'lab', 'envs.json');

const PROBE = `
import sys, json, os, importlib.metadata as m, importlib.util as u
pk = ['torch','torchvision','tensorflow','jax','jaxlib','numpy','scipy','pandas','scikit-learn','matplotlib','notebook',
      'jupyterlab','transformers','deepxde','optuna','pymoo','sympy','numba','opencv-python','pillow','requests']
out = {'python': sys.version.split()[0], 'packages': {}}
for p in pk:
    try: out['packages'][p] = m.version(p)
    except Exception: pass
try:
    s = u.find_spec('torch')
    if s and s.submodule_search_locations:
        f = os.path.join(list(s.submodule_search_locations)[0], 'version.py')
        for line in open(f, encoding='utf8'):
            if line.startswith('cuda'):
                v = line.split('=')[-1].strip().strip("'\\"")
                if v != 'None': out['torch_cuda'] = v
except Exception: pass
out['count'] = sum(1 for _ in m.distributions())
print(json.dumps(out))
`;

const run = (cmd, a) => {
  const r = spawnSync(cmd, a, { encoding: 'utf8', timeout: 60000, windowsHide: true });
  return !r.error && r.status === 0 ? r.stdout.trim() : null;
};

function probe(py) {
  const out = run(py, ['-c', PROBE]);
  try { return out ? JSON.parse(out.split(/\r?\n/).at(-1)) : { error: 'probe failed' }; } catch { return { error: 'probe failed' }; }
}

const envs = [];
const seen = new Set();
const txt = path.join(os.homedir(), '.conda', 'environments.txt');
if (fs.existsSync(txt)) {
  const paths = fs.readFileSync(txt, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const root = paths.find(p => !/[\\/]envs[\\/]/i.test(p));
  for (const p of paths) {
    const py = path.join(p, 'python.exe');
    if (!fs.existsSync(py)) continue;
    const name = p === root ? 'base' : path.basename(p);
    seen.add(path.resolve(py).toLowerCase());
    envs.push({ kind: 'conda', name, path: p, owner: !name.startsWith('earnstar-'), ...probe(py) });
  }
}
for (const line of (run('py', ['-0p']) ?? '').split(/\r?\n/)) {
  const m = line.match(/(-V:\S+)\s+\*?\s*(.+python\.exe)\s*$/i);
  if (m && !seen.has(path.resolve(m[2]).toLowerCase())) { seen.add(path.resolve(m[2]).toLowerCase()); envs.push({ kind: 'python.org', name: m[1], path: m[2], owner: true, ...probe(m[2]) }); }
}
for (const line of (run('uv', ['python', 'list', '--only-installed']) ?? '').split(/\r?\n/)) {
  const m = line.match(/^(\S+)\s+(.+python\.exe)\s*$/i);
  if (m && !seen.has(path.resolve(m[2]).toLowerCase())) { seen.add(path.resolve(m[2]).toLowerCase()); envs.push({ kind: 'uv', name: m[1], path: m[2], owner: true, ...probe(m[2]) }); }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generated_utc: new Date().toISOString(), envs }, null, 2) + '\n');
for (const e of envs) {
  const p = e.packages ?? {};
  const key = ['torch', 'tensorflow', 'jax', 'numpy', 'scipy', 'pandas', 'scikit-learn'].filter(k => p[k]).map(k => `${k} ${p[k]}`).join(', ');
  console.log(`${e.kind.padEnd(10)} ${e.name.padEnd(16)} py${e.python ?? '?'}${e.torch_cuda ? ` cu${e.torch_cuda}` : ''}  ${e.count ?? '?'} pkgs  ${key}`);
}
console.log(`\n${envs.length} environments -> ${path.relative(ROOT, OUT)} (private)`);
