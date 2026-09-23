#!/usr/bin/env node
// Machine profile for the audit trail.
//
//   node tools/machine.mjs     print { machine_id, hardware, software } and save the hardware profile
//                              to history/machines/<machine_id>.json if it is new
//
// machine_id (ID scheme v2) hashes stable, language-independent hardware fields only; display names such as
// the OS product name are stored but not hashed. Scheme v1 (m-6da16b4278d0) also hashed the localized OS caption.
// Volatile software versions (drivers, CUDA, runtimes, OS patch level, free disk) are recorded per session in
// the ledger by tools/usage.mjs.
// Privacy: no hostname, user name, serial number, MAC or IP address is collected.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'history', 'machines');

const run = (cmd, args) => {
  try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 }).trim(); }
  catch { return null; }
};
const firstLine = s => (s ? s.split(/\r?\n/)[0].trim() : 'unavailable');
const GiB = b => Math.round((b / 2 ** 30) * 10) / 10;
const BOM_RE = new RegExp('^' + String.fromCharCode(0xfeff)); // byte-order mark written by some editors

function windows() {
  const ps = `[Console]::OutputEncoding=[Text.Encoding]::UTF8;
    $c=Get-CimInstance Win32_Processor | Select-Object -First 1 Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed;
    $s=Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory;
    $o=Get-CimInstance Win32_OperatingSystem | Select-Object Version,BuildNumber;
    $r=Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' | Select-Object ProductName,EditionID,DisplayVersion,UBR;
    $g=@(Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion);
    $d=@(Get-PhysicalDisk | Select-Object FriendlyName,MediaType,Size);
    @{cpu=$c;sys=$s;os=$o;reg=$r;gpu=$g;disk=$d} | ConvertTo-Json -Depth 4 -Compress`;
  const raw = run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps]);
  if (!raw) return null;
  const j = JSON.parse(raw);
  return {
    board: `${j.sys.Manufacturer} ${j.sys.Model}`.trim(),
    cpu: { model: j.cpu.Name.trim(), cores: j.cpu.NumberOfCores, threads: j.cpu.NumberOfLogicalProcessors, base_mhz: j.cpu.MaxClockSpeed },
    ram_gib: GiB(j.sys.TotalPhysicalMemory),
    gpus: j.gpu.map(g => ({ model: g.Name, driver: g.DriverVersion })),
    disks: j.disk.map(d => ({ model: d.FriendlyName, media: d.MediaType, size_gb: Math.round(d.Size / 1e9) })),
    // Registry ProductName is English regardless of display language (WMI Caption is localized).
    os: { name: j.reg.ProductName, edition: j.reg.EditionID, release: j.reg.DisplayVersion, version: j.os.Version,
      build: j.os.BuildNumber, arch: os.arch() },
    os_patch: j.reg.UBR != null ? `${j.os.BuildNumber}.${j.reg.UBR}` : 'unavailable',
  };
}

function generic() {
  const c = os.cpus();
  return {
    board: 'unavailable',
    cpu: { model: c[0]?.model?.trim() ?? 'unavailable', cores: 'unavailable', threads: c.length, base_mhz: c[0]?.speed ?? null },
    ram_gib: GiB(os.totalmem()),
    gpus: [],
    disks: [],
    os: { name: os.type(), version: os.release(), build: os.version?.() ?? 'unavailable', arch: os.arch() },
  };
}

function nvidia() {
  const q = run('nvidia-smi', ['--query-gpu=name,memory.total,driver_version', '--format=csv,noheader,nounits']);
  if (!q) return { gpus: [], cuda: 'unavailable' };
  const gpus = q.split(/\r?\n/).filter(Boolean).map(l => {
    const [model, vram, driver] = l.split(',').map(s => s.trim());
    return { model, vram_mib: Number(vram), driver };
  });
  const cuda = (run('nvidia-smi', []) ?? '').match(/CUDA Version:\s*([\d.]+)/)?.[1] ?? 'unavailable';
  return { gpus, cuda };
}

// conda is often not on PATH; ~/.conda/environments.txt lists the root and every env.
function condaInfo() {
  const txt = path.join(os.homedir(), '.conda', 'environments.txt');
  if (!fs.existsSync(txt)) return { exe: 'conda', envs: 0, earnstar_envs: [] };
  const paths = fs.readFileSync(txt, 'utf8').replace(BOM_RE, '').split(/\r?\n/).map(s => s.trim()).filter(p => p && fs.existsSync(p));
  const root = paths.find(p => !/[\\/]envs[\\/]/i.test(p));
  const exe = root && fs.existsSync(path.join(root, 'Scripts', 'conda.exe')) ? path.join(root, 'Scripts', 'conda.exe') : 'conda';
  const names = paths.filter(p => p !== root).map(p => path.basename(p));
  // Owner env names stay private (tools/envs.mjs, lab/envs.json); only counts and earnstar-* names are recorded.
  return { exe, envs: paths.length, earnstar_envs: names.filter(n => n.startsWith('earnstar-')) };
}

function drivesFree() {
  if (process.platform !== 'win32') return {};
  const out = {};
  for (const l of 'CDEFGHIJ') {
    try { const s = fs.statfsSync(`${l}:\\`); if (s.blocks > 0) out[`${l}:`] = GiB(s.bavail * s.bsize); } catch {}
  }
  return out;
}

export function collectMachine() {
  const conda = condaInfo();
  const base = (process.platform === 'win32' && windows()) || generic();
  const nv = nvidia();
  // Stable hardware: GPU model and VRAM (NVIDIA VRAM from nvidia-smi; WMI caps it at 4 GiB).
  const gpus = base.gpus.map(g => {
    const n = nv.gpus.find(x => x.model === g.model);
    return { model: g.model, vram_mib: n?.vram_mib ?? 'unavailable' };
  });
  for (const n of nv.gpus) if (!gpus.some(g => g.model === n.model)) gpus.push({ model: n.model, vram_mib: n.vram_mib });
  const hardware = { board: base.board, cpu: base.cpu, ram_gib: base.ram_gib, gpus, disks: base.disks, os: base.os };
  // ID scheme v2: exclude display names (os.name, os.release) so localization or marketing names cannot change the ID.
  const { name: _n, release: _r, ...osKey } = base.os;
  const machine_id = 'm-' + crypto.createHash('sha256')
    .update(JSON.stringify({ scheme: 'v2', ...hardware, os: osKey })).digest('hex').slice(0, 12);

  const drive = path.parse(ROOT).root;
  let disk_free_gib = 'unavailable';
  try { const s = fs.statfsSync(drive); disk_free_gib = GiB(s.bavail * s.bsize); } catch {}
  const software = {
    gpu_drivers: [...base.gpus.map(g => `${g.model}: ${g.driver}`), ...nv.gpus.map(g => `${g.model} (nvidia-smi): ${g.driver}`)],
    cuda: nv.cuda,
    os_patch: base.os_patch ?? 'unavailable',
    node: process.version,
    git: firstLine(run('git', ['--version'])),
    gh: firstLine(run('gh', ['--version'])),
    // Toolchains: an install or upgrade shows up as a version change between ledger entries.
    toolchains: Object.fromEntries(Object.entries({
      python: ['python', ['--version']], pip: ['pip', ['--version']], uv: ['uv', ['--version']], conda: [conda.exe, ['--version']],
      rustc: ['rustc', ['--version']], go: ['go', ['version']], java: ['java', ['-version']], dotnet: ['dotnet', ['--version']],
      docker: ['docker', ['--version']], cmake: ['cmake', ['--version']], nvcc: ['nvcc', ['--version']], winget: ['winget', ['--version']],
    }).map(([k, [cmd, a]]) => {
      // Some tools (e.g., java) print their version to stderr.
      const r = spawnSync(cmd, a, { encoding: 'utf8', timeout: 30000, windowsHide: true });
      const out = !r.error && r.status === 0 ? (r.stdout || r.stderr || '').trim() : null;
      return [k, out ? (k === 'nvcc' ? out.match(/release [\d.]+[^\r\n]*/)?.[0] ?? firstLine(out) : firstLine(out)) : 'unavailable'];
    })),
    python_envs: { conda_envs_total: conda.envs, earnstar_envs: conda.earnstar_envs },
    work_drive: drive,
    work_drive_free_gib: disk_free_gib,
    drives_free_gib: drivesFree(),
  };
  return { machine_id, hardware, software };
}

export function saveProfile(m) {
  const file = path.join(DIR, `${m.machine_id}.json`);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ machine_id: m.machine_id, id_scheme: 'v2', first_seen_utc: new Date().toISOString(), hardware: m.hardware }, null, 2) + '\n');
  }
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const m = collectMachine();
  console.log(JSON.stringify({ ...m, profile: saveProfile(m) }, null, 2));
}
