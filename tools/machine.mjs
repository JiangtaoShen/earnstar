#!/usr/bin/env node
// Machine profile for the audit trail.
//
//   node tools/machine.mjs     print { machine_id, hardware, software } and save the hardware profile
//                              to history/machines/<machine_id>.json if it is new
//
// machine_id hashes the stable hardware fields only. Volatile software versions (drivers, CUDA, runtimes,
// free disk) are recorded per session in the ledger by tools/usage.mjs.
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

function windows() {
  const ps = `[Console]::OutputEncoding=[Text.Encoding]::UTF8;
    $c=Get-CimInstance Win32_Processor | Select-Object -First 1 Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed;
    $s=Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory;
    $o=Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture;
    $g=@(Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion);
    $d=@(Get-PhysicalDisk | Select-Object FriendlyName,MediaType,Size);
    @{cpu=$c;sys=$s;os=$o;gpu=$g;disk=$d} | ConvertTo-Json -Depth 4 -Compress`;
  const raw = run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps]);
  if (!raw) return null;
  const j = JSON.parse(raw);
  return {
    board: `${j.sys.Manufacturer} ${j.sys.Model}`.trim(),
    cpu: { model: j.cpu.Name.trim(), cores: j.cpu.NumberOfCores, threads: j.cpu.NumberOfLogicalProcessors, base_mhz: j.cpu.MaxClockSpeed },
    ram_gib: GiB(j.sys.TotalPhysicalMemory),
    gpus: j.gpu.map(g => ({ model: g.Name, driver: g.DriverVersion })),
    disks: j.disk.map(d => ({ model: d.FriendlyName, media: d.MediaType, size_gb: Math.round(d.Size / 1e9) })),
    os: { name: j.os.Caption, version: j.os.Version, build: j.os.BuildNumber, arch: os.arch() },
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

export function collectMachine() {
  const base = (process.platform === 'win32' && windows()) || generic();
  const nv = nvidia();
  // Stable hardware: GPU model and VRAM (NVIDIA VRAM from nvidia-smi; WMI caps it at 4 GiB).
  const gpus = base.gpus.map(g => {
    const n = nv.gpus.find(x => x.model === g.model);
    return { model: g.model, vram_mib: n?.vram_mib ?? 'unavailable' };
  });
  for (const n of nv.gpus) if (!gpus.some(g => g.model === n.model)) gpus.push({ model: n.model, vram_mib: n.vram_mib });
  const hardware = { board: base.board, cpu: base.cpu, ram_gib: base.ram_gib, gpus, disks: base.disks, os: base.os };
  const machine_id = 'm-' + crypto.createHash('sha256').update(JSON.stringify(hardware)).digest('hex').slice(0, 12);

  const drive = path.parse(ROOT).root;
  let disk_free_gib = 'unavailable';
  try { const s = fs.statfsSync(drive); disk_free_gib = GiB(s.bavail * s.bsize); } catch {}
  const software = {
    gpu_drivers: [...base.gpus.map(g => `${g.model}: ${g.driver}`), ...nv.gpus.map(g => `${g.model} (nvidia-smi): ${g.driver}`)],
    cuda: nv.cuda,
    node: process.version,
    git: firstLine(run('git', ['--version'])),
    gh: firstLine(run('gh', ['--version'])),
    // Toolchains: an install or upgrade shows up as a version change between ledger entries.
    toolchains: Object.fromEntries(Object.entries({
      python: ['python', ['--version']], pip: ['pip', ['--version']], uv: ['uv', ['--version']], conda: ['conda', ['--version']],
      rustc: ['rustc', ['--version']], go: ['go', ['version']], java: ['java', ['-version']], dotnet: ['dotnet', ['--version']],
      docker: ['docker', ['--version']], cmake: ['cmake', ['--version']], nvcc: ['nvcc', ['--version']], winget: ['winget', ['--version']],
    }).map(([k, [cmd, a]]) => {
      // Some tools (e.g., java) print their version to stderr.
      const r = spawnSync(cmd, a, { encoding: 'utf8', timeout: 30000, windowsHide: true });
      const out = !r.error && r.status === 0 ? (r.stdout || r.stderr || '').trim() : null;
      return [k, out ? (k === 'nvcc' ? out.match(/release [\d.]+[^\r\n]*/)?.[0] ?? firstLine(out) : firstLine(out)) : 'unavailable'];
    })),
    work_drive: drive,
    work_drive_free_gib: disk_free_gib,
  };
  return { machine_id, hardware, software };
}

export function saveProfile(m) {
  const file = path.join(DIR, `${m.machine_id}.json`);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ machine_id: m.machine_id, first_seen_utc: new Date().toISOString(), hardware: m.hardware }, null, 2) + '\n');
  }
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const m = collectMachine();
  console.log(JSON.stringify({ ...m, profile: saveProfile(m) }, null, 2));
}
