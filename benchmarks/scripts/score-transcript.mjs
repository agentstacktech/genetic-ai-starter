#!/usr/bin/env node
/**
 * Deterministic transcript scoring (v1 — no LLM judge).
 * Accepts plain text or JSONL exports from Cursor.
 */
import fs from 'node:fs';
import path from 'node:path';
import { TASKS_PATH, RESULTS_ROOT } from './lib/paths.mjs';

function parseArgs(argv) {
  const opts = { transcript: null, task: null, arm: null, manual: null, out: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--transcript') opts.transcript = argv[++i];
    else if (a === '--task') opts.task = argv[++i];
    else if (a === '--arm') opts.arm = argv[++i];
    else if (a === '--manual') opts.manual = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--help') {
      console.log(`Usage: node score-transcript.mjs --transcript <file> --task T01 --arm kit_standard [--manual scores.json] [--out path]`);
      process.exit(0);
    }
  }
  if (!opts.transcript || !opts.task || !opts.arm) {
    console.error('Required: --transcript --task --arm');
    process.exit(1);
  }
  return opts;
}

function loadTasks() {
  return JSON.parse(fs.readFileSync(TASKS_PATH, 'utf8'));
}

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

function extractEvents(text) {
  const events = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.startsWith('{')) {
      try {
        const o = JSON.parse(line);
        events.push(o);
        continue;
      } catch {
        /* plain text line */
      }
    }
    events.push({ type: 'text', content: line });
  }
  return events;
}

function collectMentions(text) {
  const paths = new Set();
  const re = /(?:^|[\s"'`(])([\w./-]+\.(?:ts|tsx|js|md|py|mdc))(?:[\s"'`),:]|$)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    paths.add(normalizePath(m[1]));
  }
  return paths;
}

function flattenText(events) {
  return events
    .map((e) => {
      if (typeof e.content === 'string') return e.content;
      if (e.message?.content) return String(e.message.content);
      if (e.text) return String(e.text);
      return JSON.stringify(e);
    })
    .join('\n');
}

function countUnscopedGrep(text) {
  const patterns = [
    /\brg\b[^\n]*(?:\s|^)(?!.*\s(?:src\/|agentstack-|docs\/|philosophy\/|\.))[^\n]*/gi,
    /\bgrep\b[^\n]*\s-r\b[^\n]*/gi,
    /ripgrep[^\n]*\s(?!.*--glob)[^\n]*/gi,
  ];
  let n = 0;
  for (const p of patterns) {
    const hits = text.match(p);
    if (hits) n += hits.length;
  }
  if (/\brg\b[^\n]*\ssrc\b[^\n]*/gi.test(text) && !/\brg\b[^\n]*src\//gi.test(text)) {
    n += (text.match(/\brg\b[^\n]*\ssrc\b/gi) || []).length;
  }
  return n;
}

function indexOfFirstGold(text, goldFiles) {
  let earliest = Infinity;
  let hit = null;
  for (const g of goldFiles) {
    const norm = normalizePath(g);
    const idx = text.indexOf(norm);
    if (idx >= 0 && idx < earliest) {
      earliest = idx;
      hit = norm;
    }
  }
  return { index: earliest === Infinity ? -1 : earliest, file: hit };
}

function toolCallCountBefore(text, goldFile) {
  const norm = normalizePath(goldFile);
  const pos = text.indexOf(norm);
  const slice = pos >= 0 ? text.slice(0, pos) : text;
  const tools = (slice.match(/"tool"|tool_call|grep|read_file|Read |Grep /gi) || []).length;
  return tools;
}

function scoreTask(task, text, manual) {
  const gold = task.gold || {};
  const rubric = task.rubric || {};
  const scores = {
    correct_file: 0,
    navigation_path: 0,
    scope_discipline: 0,
    outcome: 0,
    efficiency: 0,
  };
  const metrics = {
    unscopedGrepCount: countUnscopedGrep(text),
    mapFirst: false,
    detourLegacy: /billing\/legacy|oldCheckout/i.test(text),
    ttfhfToolCalls: null,
  };

  const mapBeforeGrep =
    /AI_NAVIGATION_MAP|GENE_COMPRESSION_MAP|AI_INDEX\.md|AGENTS\.md/i.test(text) &&
    (text.search(/AI_NAVIGATION_MAP|GENE_COMPRESSION_MAP|AI_INDEX/i) <
      text.search(/\brg\b|\bgrep\b|Grep /i) ||
      !/\brg\b|\bgrep\b|Grep /i.test(text));
  metrics.mapFirst = mapBeforeGrep;

  const goldFiles = [...(gold.files || []), ...(gold.alsoAccept || [])];
  const firstGold = indexOfFirstGold(text, gold.files || []);
  if (firstGold.file) {
    metrics.ttfhfToolCalls = toolCallCountBefore(text, firstGold.file);
  }

  if (gold.expectRefusal) {
    const refused = (gold.refusalKeywords || []).some((k) =>
      text.toLowerCase().includes(k.toLowerCase()),
    );
    const bulk = (gold.forbiddenActions || []).some((a) => text.includes(a));
    scores.outcome = refused && !bulk ? rubric.outcome?.weight ?? 4 : 0;
    scores.navigation_path = mapBeforeGrep ? Math.min(2, rubric.navigation_path?.weight ?? 2) : 0;
    scores.scope_discipline = bulk ? 0 : rubric.scope_discipline?.weight ?? 2;
    scores.efficiency = rubric.efficiency?.weight ?? 2;
  } else if (gold.expectMaintenance) {
    const ok = (gold.maintenanceKeywords || []).some((k) =>
      text.toLowerCase().includes(k.toLowerCase()),
    );
    scores.outcome = ok ? rubric.outcome?.weight ?? 4 : 0;
    scores.navigation_path = mapBeforeGrep ? 2 : 1;
    scores.scope_discipline = metrics.unscopedGrepCount === 0 ? 2 : metrics.unscopedGrepCount <= 1 ? 1 : 0;
    scores.efficiency = 2;
  } else {
    const mentioned = collectMentions(text);
    const hits = (gold.files || []).filter((f) => mentioned.has(normalizePath(f)));
    const also = (gold.alsoAccept || []).filter((f) => mentioned.has(normalizePath(f)));
    const minHit = gold.minFilesHit ?? (gold.files?.length ? 1 : 0);
    const hitCount = new Set([...hits, ...also]).size;
    scores.correct_file = hitCount >= minHit ? rubric.correct_file?.weight ?? 2 : hitCount > 0 ? 1 : 0;
    if (gold.forbiddenFiles?.some((f) => mentioned.has(normalizePath(f)))) {
      scores.correct_file = Math.max(0, scores.correct_file - 1);
    }
    scores.navigation_path = mapBeforeGrep ? 2 : /AGENTS\.md|README/i.test(text) ? 1 : 0;
    scores.scope_discipline =
      metrics.unscopedGrepCount === 0
        ? 2
        : metrics.unscopedGrepCount <= 1
          ? 1
          : 0;
    if (gold.preferScopedSearch && text.includes(gold.preferScopedSearch)) {
      scores.scope_discipline = Math.max(scores.scope_discipline, 1);
    }
    const eff = rubric.efficiency || {};
    const t = metrics.ttfhfToolCalls ?? 99;
    scores.efficiency =
      t <= (eff.ttfhfGood ?? 4)
        ? eff.weight ?? 2
        : t <= (eff.ttfhfOk ?? 8)
          ? 1
          : 0;
    scores.outcome = scores.correct_file >= (rubric.correct_file?.weight ?? 2) ? rubric.outcome?.weight ?? 2 : 1;
    if (gold.explainKeywords?.length) {
      const explained = gold.explainKeywords.some((k) =>
        text.toLowerCase().includes(k.toLowerCase()),
      );
      if (!explained) scores.outcome = Math.min(scores.outcome, 1);
    }
  }

  if (manual) {
    const overrides = JSON.parse(fs.readFileSync(manual, 'utf8'));
    Object.assign(scores, overrides.scores || {});
    Object.assign(metrics, overrides.metrics || {});
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return { taskId: task.id, scores, total, metrics, success: total >= 6 };
}

function main() {
  const opts = parseArgs(process.argv);
  const tasksDoc = loadTasks();
  const task = tasksDoc.tasks.find((t) => t.id === opts.task);
  if (!task) {
    console.error(`Unknown task: ${opts.task}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(path.resolve(opts.transcript), 'utf8');
  const events = extractEvents(raw);
  const text = flattenText(events);
  const result = {
    arm: opts.arm,
    transcript: path.basename(opts.transcript),
    scoredAt: new Date().toISOString(),
    ...scoreTask(task, text, opts.manual),
  };
  const outDir = path.join(RESULTS_ROOT, 'scored');
  fs.mkdirSync(outDir, { recursive: true });
  const out =
    opts.out ||
    path.join(outDir, `${opts.arm}__${opts.task}.json`);
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main();
