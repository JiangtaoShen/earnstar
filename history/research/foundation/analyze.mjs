#!/usr/bin/env node
// Base rates for the foundational study, from the files written by collect.mjs.
//
//   node history/research/foundation/analyze.mjs     print Markdown tables (pasted into foundation.md)
//
// Reads lab/foundation/population.json and sample.json (raw) and archetypes.json (manual labels, committed).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(HERE, '..', '..', '..', 'lab', 'foundation');
const pop = JSON.parse(fs.readFileSync(path.join(LAB, 'population.json'), 'utf8'));
const arch = JSON.parse(fs.readFileSync(path.join(HERE, 'archetypes.json'), 'utf8'));
const sample = JSON.parse(fs.readFileSync(path.join(LAB, 'sample.json'), 'utf8')).map(r => ({ ...r, archetype: arch[r.full_name] }));

const NAMES = {
  SK: 'Agent skills, plugins, prompts, configs', AT: 'AI-agent and LLM tooling (MCP, harnesses, CLIs, infra)',
  AA: 'AI end-user apps', ML: 'Research code and model releases', CR: 'Curated resources and learning material',
  DT: 'Developer tools and libraries (non-AI)', SH: 'Self-hosted apps', DA: 'Desktop and mobile utilities',
  SEC: 'Security and OSINT', GR: 'Grey area (ToS or legal risk)', FUN: 'Playful or visual', HW: 'Hardware and firmware', OTH: 'Other',
};
const CJK_RANGES = [[0x2e80, 0x2fdf], [0x3000, 0x303f], [0x3040, 0x30ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0xff00, 0xffef], [0xac00, 0xd7af]];
const hasCJK = s => { if (!s) return false; for (const ch of s) { const c = ch.codePointAt(0); if (CJK_RANGES.some(([lo, hi]) => c >= lo && c <= hi)) return true; } return false; };

const q = (xs, p) => { const v = xs.filter(x => x !== null && x !== undefined && !Number.isNaN(x)).sort((a, b) => a - b); if (!v.length) return null; return v[Math.min(v.length - 1, Math.floor(p * v.length))]; };
const med = xs => q(xs, 0.5);
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)} %` : '–');
const fmt = x => (x === null || x === undefined ? '–' : typeof x === 'number' ? (Math.abs(x) >= 100 ? Math.round(x).toLocaleString('en-US') : Math.round(x * 10) / 10) : x);
const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map(r => `| ${r.map(fmt).join(' | ')} |`)].join('\n');

const timed = sample.filter(r => r.star_source === 'github');
const fast = r => r.days_create_to_1k !== null && r.days_create_to_1k !== undefined && r.days_create_to_1k <= 90;
const small = r => r.owner_type === 'User' && r.owner_followers !== null && r.owner_followers < 100;
const out = [];

// 1. Population
const kw = re => pop.filter(r => re.test(`${r.description || ''} ${(r.topics || []).join(' ')} ${r.full_name}`)).length;
out.push('### Population', '');
out.push(table(['Measure', 'Value'], [
  ['Repos created 2025-09-25..2026-06-27 with >= 1,000 stars (2026-09-25)', pop.length],
  ['Owned by users / organizations', `${pop.filter(r => r.owner_type === 'User').length} / ${pop.filter(r => r.owner_type === 'Organization').length}`],
  ['Mention Claude (description, topics, or name)', pct(kw(/claude/i), pop.length)],
  ['Mention agents', pct(kw(/agent/i), pop.length)],
  ['Mention skills', pct(kw(/skill/i), pop.length)],
  ['Mention MCP', pct(kw(/\bmcp\b|model context protocol/i), pop.length)],
  ['Description contains CJK text', pct(pop.filter(r => hasCJK(r.description)).length, pop.length)],
  ['Median stars (p25-p75)', `${fmt(med(pop.map(r => r.stars)))} (${fmt(q(pop.map(r => r.stars), 0.25))}-${fmt(q(pop.map(r => r.stars), 0.75))})`],
]));
const langs = {}; for (const r of pop) langs[r.language ?? 'none'] = (langs[r.language ?? 'none'] || 0) + 1;
out.push('', `Languages: ${Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} ${pct(v, pop.length)}`).join(', ')}.`, '');

// 2. Speed
out.push('### Speed to 1,000 stars (sample)', '');
out.push(table(['Measure', 'Value'], [
  ['Sample size / with star history', `${sample.length} / ${timed.length}`],
  ['Reached 1k within 90 days of creation', pct(timed.filter(fast).length, timed.length)],
  ['Days from creation to 1k: p25 / median / p75', `${fmt(q(timed.map(r => r.days_create_to_1k), 0.25))} / ${fmt(med(timed.map(r => r.days_create_to_1k)))} / ${fmt(q(timed.map(r => r.days_create_to_1k), 0.75))}`],
  ['Days from first star to 1k: p25 / median / p75', `${fmt(q(timed.map(r => r.days_first_to_1k), 0.25))} / ${fmt(med(timed.map(r => r.days_first_to_1k)))} / ${fmt(q(timed.map(r => r.days_first_to_1k), 0.75))}`],
  ['Days from first star to 100: median', fmt(med(timed.map(r => r.days_first_to_100)))],
  ['Share of first-90-day stars (from creation) that came in the first 7 days after the first star: median', pct(Math.round(100 * med(timed.filter(r => r.stars_90d_from_create > 0).map(r => r.stars_7d / r.stars_90d_from_create))), 100)],
  ['Peak single day as a share of total stars: median', pct(Math.round(100 * med(timed.map(r => r.peak_day_stars / r.history_total))), 100)],
]));
out.push('');

// 3. Archetypes
out.push('### By archetype (sample)', '');
const groups = Object.keys(NAMES).map(k => [k, sample.filter(r => r.archetype === k)]).filter(([, g]) => g.length).sort((a, b) => b[1].length - a[1].length);
out.push(table(['Code', 'Archetype', 'n', 'Share', '1k in <= 90 d', 'Median stars', 'Median days to 1k', 'Small-audience owners', 'HN story >= 100 pts', 'CJK description'],
  groups.map(([k, g]) => {
    const gt = g.filter(r => r.star_source === 'github');
    return [k, NAMES[k], g.length, pct(g.length, sample.length), pct(gt.filter(fast).length, gt.length), med(g.map(r => r.stars)),
      med(gt.map(r => r.days_create_to_1k)), pct(g.filter(small).length, g.length), pct(g.filter(r => r.hn_max_points >= 100).length, g.length),
      pct(g.filter(r => hasCJK(r.description)).length, g.length)];
  })));
out.push('');

// 4. Audience
out.push('### By owner audience (sample)', '');
const buckets = [
  ['User, < 100 followers', r => small(r)], ['User, 100-999', r => r.owner_type === 'User' && r.owner_followers >= 100 && r.owner_followers < 1000],
  ['User, 1k-9,999', r => r.owner_type === 'User' && r.owner_followers >= 1000 && r.owner_followers < 10000], ['User, >= 10k', r => r.owner_type === 'User' && r.owner_followers >= 10000],
  ['Organization, < 100 followers', r => r.owner_type === 'Organization' && r.owner_followers < 100], ['Organization, >= 100', r => r.owner_type === 'Organization' && r.owner_followers >= 100],
];
out.push(table(['Owner', 'n', 'Share', '1k in <= 90 d', 'Median stars', 'Median days to 1k', 'HN story >= 100 pts', 'Top archetypes'],
  buckets.map(([name, f]) => {
    const g = sample.filter(f), gt = g.filter(r => r.star_source === 'github');
    const a = {}; for (const r of g) a[r.archetype] = (a[r.archetype] || 0) + 1;
    return [name, g.length, pct(g.length, sample.length), pct(gt.filter(fast).length, gt.length), med(g.map(r => r.stars)), med(gt.map(r => r.days_create_to_1k)),
      pct(g.filter(r => r.hn_max_points >= 100).length, g.length), Object.entries(a).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k, v]) => `${k} ${v}`).join(', ')];
  })));
out.push('');

// 5. Channels
out.push('### Launch channels (sample)', '');
const hnAny = sample.filter(r => r.hn_posts > 0), hn100 = sample.filter(r => r.hn_max_points >= 100);
const nearHN = hn100.filter(r => r.hn_within_7d_of_first_star);
out.push(table(['Signal', 'Share of sample', 'Median stars (with / without)', '1k in <= 90 d (with / without)'], [
  ['Any HN story linking the repo', pct(hnAny.length, sample.length), `${fmt(med(hnAny.map(r => r.stars)))} / ${fmt(med(sample.filter(r => !r.hn_posts).map(r => r.stars)))}`,
    `${pct(hnAny.filter(fast).length, hnAny.filter(r => r.star_source === 'github').length)} / ${pct(sample.filter(r => !r.hn_posts && fast(r)).length, sample.filter(r => !r.hn_posts && r.star_source === 'github').length)}`],
  ['HN story >= 100 points', pct(hn100.length, sample.length), `${fmt(med(hn100.map(r => r.stars)))} / ${fmt(med(sample.filter(r => r.hn_max_points < 100).map(r => r.stars)))}`,
    `${pct(hn100.filter(fast).length, hn100.filter(r => r.star_source === 'github').length)} / ${pct(sample.filter(r => r.hn_max_points < 100 && fast(r)).length, sample.filter(r => r.hn_max_points < 100 && r.star_source === 'github').length)}`],
  ['HN story >= 100 points within 7 days of the first star', pct(nearHN.length, sample.length), `${fmt(med(nearHN.map(r => r.stars)))} / –`, '–'],
  ['README contains CJK (Chinese-community proxy)', pct(sample.filter(r => r.cjk_readme).length, sample.length), `${fmt(med(sample.filter(r => r.cjk_readme).map(r => r.stars)))} / ${fmt(med(sample.filter(r => !r.cjk_readme).map(r => r.stars)))}`,
    `${pct(sample.filter(r => r.cjk_readme && fast(r)).length, sample.filter(r => r.cjk_readme && r.star_source === 'github').length)} / ${pct(sample.filter(r => !r.cjk_readme && fast(r)).length, sample.filter(r => !r.cjk_readme && r.star_source === 'github').length)}`],
]));
out.push('');

// 6. README patterns: fast (<= 30 d) vs slow (> 90 d)
out.push('### README patterns (sample): fast (1k in <= 30 days) vs slow (> 90 days)', '');
const f30 = timed.filter(r => r.days_create_to_1k <= 30), slow = timed.filter(r => r.days_create_to_1k > 90);
const feat = [['Image, GIF, or video in the first 4,000 characters (badges excluded)', r => r.media_above_fold], ['GIF anywhere', r => r.gif_anywhere],
  ['Video anywhere', r => r.video_anywhere], ['Install/quick-start/usage heading', r => r.quickstart], ['One-line install command', r => r.one_liner_install],
  ['>= 3 badges in the head', r => r.badges_head >= 3], ['Star-history chart', r => r.star_history], ['States it was built with AI', r => r.ai_disclosed]];
out.push(table(['Pattern', 'All', `Fast (n=${f30.length})`, `Slow (n=${slow.length})`],
  feat.map(([name, f]) => [name, pct(sample.filter(f).length, sample.length), pct(f30.filter(f).length, f30.length), pct(slow.filter(f).length, slow.length)])));
out.push('', `Median README length: fast ${fmt(med(f30.map(r => r.readme_len)))} characters, slow ${fmt(med(slow.map(r => r.readme_len)))}.`, '');

// 7. Case list: fast risers, all small-audience ones first
const cases = timed.filter(fast).filter(r => r.archetype !== 'GR');
const pickCases = [...cases.filter(small).sort((a, b) => a.days_create_to_1k - b.days_create_to_1k),
  ...cases.filter(r => !small(r)).sort((a, b) => a.days_create_to_1k - b.days_create_to_1k)];
const clean = d => (hasCJK(d) ? '(CJK description)' : (d || '').replace(/[^\x20-\x7e]/g, '').replace(/\|/g, '/').trim().slice(0, 80));
const readme = r => [r.media_above_fold ? 'media' : '', r.gif_anywhere ? 'gif' : '', r.one_liner_install ? '1-line install' : '', r.cjk_readme ? 'CJK' : ''].filter(Boolean).join(', ') || 'text only';
const chan = r => (r.hn_max_points >= 100 ? `HN ${r.hn_max_points} pts${r.hn_within_7d_of_first_star ? ' (launch week)' : ''}` : r.hn_posts ? `HN ${r.hn_max_points} pts` : r.cjk_readme ? 'no HN; CJK README' : 'no HN');
out.push('### Fast risers (1k within 90 days; grey-area repos excluded): small-audience owners first', '');
out.push(`Small-audience fast risers: ${cases.filter(small).length}. Total fast risers listed: ${pickCases.length}.`, '');
out.push(table(['Repo', 'Arch.', 'Lang.', 'Owner followers', 'Days to 1k', 'Stars now', 'Channel evidence', 'README', 'Description'],
  pickCases.map(r => [`[${r.full_name}](https://github.com/${r.full_name})`, r.archetype, r.language ?? '–', `${r.owner_followers}${r.owner_type === 'Organization' ? ' (org)' : ''}`,
    Math.round(r.days_create_to_1k), r.stars, chan(r), readme(r), clean(r.description)])));

console.log(out.join('\n'));
