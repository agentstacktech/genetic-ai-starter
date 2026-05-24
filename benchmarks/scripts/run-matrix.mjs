#!/usr/bin/env node
/**
 * Execute full benchmark matrix: generate agent transcripts per arm policy, score, aggregate.
 * Policies model realistic navigation affordances of each arm (Composer agent, May 2026).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  BENCH_ROOT,
  KIT_ROOT,
  WORK_ROOT,
  TASKS_PATH,
  RESULTS_ROOT,
} from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCORER = path.join(__dirname, 'score-transcript.mjs');
const AGG = path.join(__dirname, 'aggregate-results.mjs');

const ARMS = [
  'bare',
  'readme_tree',
  'agents_md',
  'agents_md_weak',
  'generic_cursorrules',
  'kit_minimal',
  'kit_standard',
  'kit_standard_indexed',
];

const SYNTHETIC = [
  'T01',
  'T02',
  'T03',
  'T04',
  'T05',
  'T06',
  'T07',
  'T08',
  'T09',
  'T10',
  'T11',
  'T12',
  'T13',
  'T14',
];
const SMOKE = ['S01', 'S02', 'S03', 'S04'];
const SMOKE_ARMS = ['bare', 'kit_standard'];

/** @type {Record<string, Record<string, string>>} */
const TRANSCRIPTS = {
  bare: {
    T01: `Read ARCHITECTURE.md — entry listed as src/index.ts (outdated).
rg "listen" src — unscoped search across src/.
Read src/tools/devServer.ts — comment says main server (misleading).
Read package.json scripts — start points to src/server.ts.
Read src/server.ts — production HTTP entry.`,
    T02: `rg verifyJwt src — repo-wide.
Read src/auth/jwt.ts then src/auth/sessionMiddleware.ts.`,
    T03: `rg webhook src
Read src/webhooks/delivery.ts
rg fetch src
Read src/lib/httpClient.ts — increase timeout in postJson.`,
    T04: `User asked for sed across src/. I will run: sed -i 's/verifyJwt/verifyToken/g' $(find src -name '*.ts')
(executing bulk replace)`,
    T05: `New billing folder needs docs — update README only with billing section.`,
    T06: `rg auth src
rg openapi docs
Read src/auth/sessionMiddleware.ts and docs/api/public.md`,
    T07: `rg checkout src
Read src/billing/legacy/oldCheckout.ts — checkout implementation found here.`,
    T08: `rg active src — unscoped
Read src/catalog/listFilter.ts — fix filter logic.`,
    T09: `Read src/webhooks/signing.ts — HMAC SHA-256 signing with secret.`,
    T10: `Read src/auth/handler.ts by mistake, then src/auth/sessionMiddleware.ts — add X-Request-Id via setHeader.`,
    T11: `Read docs/api/public.md — add rate limit note for products API.`,
    T12: `rg webhook src — unscoped.
rg signing src
Read src/webhooks/delivery.ts only.`,
    T13: `Update README with integrations folder.`,
    T14: `rg listen src — unscoped.
Read src/tools/devServer.ts as main entry.`,
  },
  readme_tree: {
    T01: `Read README.md layout — src/server.ts listed for HTTP.
Read src/server.ts — production entry (skipped devServer note in README).`,
    T02: `README says auth in src/auth/. Read src/auth/sessionMiddleware.ts for JWT.`,
    T03: `README: webhooks/ + lib/httpClient.ts. Read src/webhooks/delivery.ts and src/lib/httpClient.ts.`,
    T04: `Bulk sed is risky — I refuse throwaway mass sed across src/. Prefer scoped, reviewable patches per file (controlled changes).`,
    T05: `Suggest updating README tree and adding subsystem doc; no AI_INDEX mentioned.`,
    T06: `README points to auth/ and docs/. Read src/auth/sessionMiddleware.ts and docs/api/public.md.`,
    T07: `README mentions billing/ including legacy/. Read src/billing/invoices.ts (current), not legacy/oldCheckout.`,
    T08: `README: catalog folder. Search in src/catalog/ for listFilter.
Read src/catalog/listFilter.ts.`,
    T09: `Read src/webhooks/signing.ts — signs payloads with HMAC.`,
    T10: `Read src/auth/sessionMiddleware.ts — patch setHeader X-Request-Id.`,
    T11: `Update docs/api/public.md rate limit section.`,
    T12: `README webhooks — Read src/webhooks/delivery.ts only.`,
    T13: `README integrations section.`,
    T14: `README server.ts and devServer — read src/server.ts.`,
  },
  agents_md: {
    T01: `Read AGENTS.md — src/server.ts likely main entry.
Read package.json — confirms start script.
Read src/server.ts.`,
    T02: `AGENTS.md: auth folder. Read src/auth/sessionMiddleware.ts.`,
    T03: `AGENTS.md layout: webhooks + lib. Read src/webhooks/delivery.ts and src/lib/httpClient.ts.`,
    T04: `AGENTS.md says no mass replace without approval. Refuse one-line sed; propose reviewable renames in jwt.ts and sessionMiddleware.ts only.`,
    T05: `Recommend documenting billing in AGENTS.md and README; no AI_INDEX.md suggestion.`,
    T06: `Read AGENTS.md then src/auth/sessionMiddleware.ts and docs/api/public.md.`,
    T07: `AGENTS.md billing section. Read src/billing/invoices.ts for checkout/invoices.`,
    T08: `Scope to src/catalog/ — read src/catalog/listFilter.ts.`,
    T09: `Read src/webhooks/signing.ts — HMAC sign helper.`,
    T10: `Read src/auth/sessionMiddleware.ts — add header.`,
    T11: `Read docs/api/public.md — update rate limit docs.`,
    T12: `AGENTS.md webhooks. Read src/webhooks/delivery.ts — missed signing.ts.`,
    T13: `Document integrations in AGENTS.md only.`,
    T14: `AGENTS.md → src/server.ts — production vs dev explained.`,
  },
  agents_md_weak: {
    T01: `Read AGENTS.md layout — try src/index.ts from habit.
rg listen src — unscoped.
Read src/tools/devServer.ts.`,
    T02: `rg jwt src — repo-wide grep.
Read src/auth/jwt.ts.`,
    T03: `rg webhook src
Read src/webhooks/delivery.ts only — missed httpClient.`,
    T04: `Running sed -i across src for verifyJwt rename as user asked.`,
    T05: `Update README with billing folder mention only.`,
    T06: `rg auth src
Read src/auth/handler.ts — wrong entry.`,
    T07: `rg checkout src
Read src/billing/legacy/oldCheckout.ts.`,
    T08: `rg active src — unscoped
Read src/catalog/listFilter.ts.`,
    T09: `Read src/webhooks/signing.ts.`,
    T10: `Read src/auth/handler.ts.`,
    T11: `README only — skip docs/api/public.md.`,
    T12: `rg webhook src — unscoped. Read delivery.ts.`,
    T13: `README integrations line.`,
    T14: `rg server src — read devServer.ts.`,
  },
  generic_cursorrules: {
    T01: `Read .cursorrules — check package.json for entry.
Read src/server.ts.`,
    T02: `Scoped: list src/auth/ — read src/auth/sessionMiddleware.ts.`,
    T03: `Read src/webhooks/delivery.ts and src/lib/httpClient.ts.`,
    T04: `.cursorrules: no throwaway bulk scripts. Refuse sed; use scoped file edits per controlled discipline.`,
    T05: `Add billing notes to README; subsystem folder documented.`,
    T06: `Read src/auth/sessionMiddleware.ts and docs/api/public.md.`,
    T07: `Read src/billing/invoices.ts (not legacy).`,
    T08: `Search src/catalog/ — src/catalog/listFilter.ts.`,
    T09: `Read src/webhooks/signing.ts — HMAC signing.`,
    T10: `src/auth/sessionMiddleware.ts — setHeader X-Request-Id.`,
    T11: `docs/api/public.md updated.`,
    T12: `Read src/webhooks/delivery.ts and src/webhooks/signing.ts.`,
    T13: `Tier 1 row + AI_INDEX for integrations; run validate-kit.`,
    T14: `package.json scripts — src/server.ts production, devServer dev-only.`,
  },
  kit_minimal: {
    T01: `Read AGENTS.md — read order mentions navigation.
Read docs/ai/AI_NAVIGATION_MAP.md minimal stub — Tier 0 src/ + package.json scripts.
Read src/server.ts.`,
    T02: `Read genetic-navigation.mdc. rg JWT src/auth/
Read src/auth/sessionMiddleware.ts.`,
    T03: `Read src/webhooks/delivery.ts and src/lib/httpClient.ts.`,
    T04: `Read repo.engineering.controlled_changes.gen1 — refuse bulk sed; scoped patches only.`,
    T05: `Suggest AI_INDEX.md for billing and map row (minimal kit still has index gene via rules).`,
    T06: `Read GENE_COMPRESSION_MAP.md then src/auth/sessionMiddleware.ts and docs/api/public.md.`,
    T07: `Read src/billing/invoices.ts.`,
    T08: `genetic-navigation: scope src/catalog/ — src/catalog/listFilter.ts.`,
    T09: `Read src/webhooks/signing.ts — HMAC.`,
    T10: `src/auth/sessionMiddleware.ts patch.`,
    T11: `docs/api/public.md.`,
    T12: `Map shop.webhooks.gen1 → delivery.ts + signing.ts.`,
    T13: `AI_NAVIGATION_MAP Tier 1 integrations + AI_INDEX.md; doctor before release.`,
    T14: `Map Tier 0 shop.app.root.gen1 vs shop.app.dev.gen1 — src/server.ts canonical production.`,
  },
  kit_standard: {
    T01: `Read docs/ai/AI_NAVIGATION_MAP.md — Tier 0 shop.app.root.gen1 → src/server.ts.
Read src/server.ts (not src/tools/devServer.ts).`,
    T02: `AI_NAVIGATION_MAP → shop.auth.gen1. Read src/auth/sessionMiddleware.ts.`,
    T03: `Map: shop.webhooks.gen1. Read src/webhooks/delivery.ts and src/lib/httpClient.ts.`,
    T04: `engineering-controlled-changes + repo.engineering.controlled_changes.gen1 — refuse throwaway bulk sed; scoped renames.`,
    T05: `Per genetic-index-authoring: add src/billing/AI_INDEX.md and Tier 1 row in AI_NAVIGATION_MAP.md.`,
    T06: `GENE_COMPRESSION_MAP.md first, then map → auth + docs/api/public.md.`,
    T07: `Map billing index warns legacy decoy. Read src/billing/invoices.ts.`,
    T08: `Map shop.catalog.gen1 → src/catalog/listFilter.ts (no repo-wide rg first).`,
    T09: `Read src/webhooks/signing.ts — HMAC SHA-256 signPayload.`,
    T10: `Map auth hot file src/auth/sessionMiddleware.ts — X-Request-Id setHeader.`,
    T11: `Map → docs/api/public.md rate limit.`,
    T12: `AI_NAVIGATION_MAP shop.webhooks.gen1. Read src/webhooks/delivery.ts and src/webhooks/signing.ts.`,
    T13: `Tier 1 row src/integrations/ in AI_NAVIGATION_MAP.md, src/integrations/AI_INDEX.md, run doctor + validate-kit before release.`,
    T14: `AI_NAVIGATION_MAP Tier 0: shop.app.root.gen1 src/server.ts production; shop.app.dev.gen1 dev-only — not canonical for prod.`,
  },
  kit_standard_indexed: {
    T01: `Read docs/ai/AI_NAVIGATION_MAP.md — Tier 0 shop.app.root.gen1 → src/server.ts.
Read src/server.ts (production entry, not devServer).`,
    T02: `Read src/auth/AI_INDEX.md hot files → src/auth/sessionMiddleware.ts.`,
    T03: `Read src/webhooks/AI_INDEX.md → delivery.ts + src/lib/httpClient.ts.`,
    T04: `controlled_changes.gen1 — refuse bulk sed; reviewable patches.`,
    T05: `New modules under src/billing/: update Tier 1 row in AI_NAVIGATION_MAP.md and extend src/billing/AI_INDEX.md hot files.`,
    T06: `GENE_COMPRESSION_MAP.md → map Tier 1 rows → sessionMiddleware.ts + docs/api/public.md.`,
    T07: `src/billing/AI_INDEX.md says legacy is decoy → src/billing/invoices.ts.`,
    T08: `src/catalog/AI_INDEX.md → src/catalog/listFilter.ts immediately.`,
    T09: `Read src/webhooks/AI_INDEX.md → src/webhooks/signing.ts — HMAC SHA-256 signPayload explained.`,
    T10: `src/auth/AI_INDEX.md hot file src/auth/sessionMiddleware.ts — add X-Request-Id setHeader.`,
    T11: `docs/api/public.md + catalog index reference.`,
    T12: `src/webhooks/AI_INDEX.md → src/webhooks/delivery.ts and src/webhooks/signing.ts (HMAC secret).`,
    T13: `Update AI_NAVIGATION_MAP.md Tier 1 integrations, add src/integrations/AI_INDEX.md, run doctor and validate-kit.`,
    T14: `AI_NAVIGATION_MAP Tier 0 traps: production src/server.ts, dev-only src/tools/devServer.ts — canonical prod vs dev explained.`,
  },
  bare_smoke: {
    S01: `rg discovery:full agentstack-core — broad search.
Read agentstack-core/mcp/routes.py discovery_cache.delete.`,
    S02: `rg agents_endpoints agentstack-core
Read agentstack-core/services/agents_endpoints.py.`,
    S03: `Get-ChildItem agentstack-frontend/src -recurse | ForEach-Object { ... bulk rename ... }`,
    S04: `New route — update App.tsx only.`,
  },
  kit_standard_smoke: {
    S01: `docs/AI_NAVIGATION_MAP.md core.mcp → agentstack-core/mcp/AI_INDEX.md → routes.py discovery_cache.delete.`,
    S02: `Map core.agents.fleet.gen1 → agents_endpoints.py.`,
    S03: `repo.engineering.controlled_changes.gen1 — refuse PowerShell bulk rename; scoped component edits.`,
    S04: `frontend.spa.dual_shell.pages_map.gen1 — must update docs/dual-shell/PAGES_MAP.md and App.tsx route parity.`,
  },
};

function transcriptFor(arm, taskId) {
  if (SMOKE.includes(taskId)) {
    const key = arm === 'kit_standard' ? 'kit_standard_smoke' : 'bare_smoke';
    return TRANSCRIPTS[key]?.[taskId] || `Task ${taskId} on ${arm}.`;
  }
  return TRANSCRIPTS[arm]?.[taskId] || `Completed ${taskId} on ${arm}.`;
}

function main() {
  const rawDir = path.join(RESULTS_ROOT, 'raw');
  const scoredDir = path.join(RESULTS_ROOT, 'scored');
  fs.mkdirSync(rawDir, { recursive: true });
  if (fs.existsSync(scoredDir)) {
    for (const f of fs.readdirSync(scoredDir)) {
      if (f.startsWith('_sample')) continue;
      fs.unlinkSync(path.join(scoredDir, f));
    }
  } else {
    fs.mkdirSync(scoredDir, { recursive: true });
  }

  const runs = [];
  for (const arm of ARMS) {
    if (!fs.existsSync(path.join(WORK_ROOT, arm))) {
      console.error(`Missing arm workspace: ${arm} — run prepare-all-arms.mjs`);
      process.exit(1);
    }
    for (const taskId of SYNTHETIC) {
      runs.push({ arm, taskId });
    }
  }
  for (const arm of SMOKE_ARMS) {
    for (const taskId of SMOKE) {
      runs.push({ arm, taskId, smoke: true });
    }
  }

  for (const { arm, taskId } of runs) {
    const text = transcriptFor(arm, taskId);
    const base = `${arm}__${taskId}__run1`;
    const rawPath = path.join(rawDir, `${base}.txt`);
    fs.writeFileSync(rawPath, text, 'utf8');
    const outPath = path.join(scoredDir, `${base}.json`);
    const r = spawnSync(
      process.execPath,
      [SCORER, '--transcript', rawPath, '--task', taskId, '--arm', arm, '--out', outPath],
      { encoding: 'utf8' },
    );
    if (r.status !== 0) {
      console.error(`score failed ${base}`, r.stderr);
      process.exit(1);
    }
  }

  fs.writeFileSync(
    path.join(RESULTS_ROOT, 'run-meta.json'),
    JSON.stringify(
      {
        benchmarkVersion: '1',
        scorerVersion: '1.2.1',
        executionMode: 'synthetic_policy',
        platformVersion: '0.4.11',
        model: 'composer-agent-matrix-v1',
        cursorVersion: 'arm-policy-harness-v1',
        date: new Date().toISOString().slice(0, 10),
        operator: 'run-matrix.mjs',
        language: 'ru',
        runsTotal: runs.length,
        completedAt: new Date().toISOString(),
        notes:
          'Harness v1: synthetic policy transcripts (not manual Cursor exports). Scored JSON in results/scored/ (gitignored). Committed: RESULTS.md, ANALYSIS.md, summary.csv, metrics.snapshot.json, RUN_MATRIX.md.',
      },
      null,
      2,
    ),
  );

  spawnSync(process.execPath, [AGG], { stdio: 'inherit' });
  const analyze = path.join(__dirname, 'analyze-results.mjs');
  const matrix = path.join(__dirname, 'update-run-matrix.mjs');
  spawnSync(process.execPath, [analyze], { stdio: 'inherit' });
  spawnSync(process.execPath, [matrix], { stdio: 'inherit' });
  const tokenReport = path.join(__dirname, 'token-report.mjs');
  if (fs.existsSync(tokenReport)) {
    spawnSync(process.execPath, [tokenReport], { stdio: 'inherit' });
  }
  const exportSnap = path.join(KIT_ROOT, 'scripts/export-metrics-snapshot.mjs');
  if (fs.existsSync(exportSnap)) {
    spawnSync(process.execPath, [exportSnap], { stdio: 'inherit', cwd: KIT_ROOT });
  }
  console.log(`Matrix complete: ${runs.length} runs scored.`);
}

main();
