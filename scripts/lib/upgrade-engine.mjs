import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { copyPayloadFiles } from './copy-payload.mjs';
import { PAYLOAD_ROOT } from './paths.mjs';
import { substitute } from './substitute-placeholders.mjs';
import { mergeRegionsFromKit, mergeTier1RowsByTag, extractRegion } from './merge-markdown-regions.mjs';
import {
  getKitRegions,
  isProtectedNavigationFile,
  loadNavigationContract,
} from './tenant-protected-files.mjs';
import { buildUpgradeReport, writeUpgradeReport } from './upgrade-report.mjs';

/**
 * @param {string} kitSourceType
 */
export function resolveOperationsVariant(kitSourceType) {
  if (kitSourceType === 'submodule') return 'submodule';
  if (kitSourceType === 'npm') return 'npm';
  return 'path-only';
}

export function readOperationsKitBody(variant) {
  const name = `OPERATIONS.${variant}.md`;
  const p = path.join(PAYLOAD_ROOT, 'docs/ai', name);
  const readBody = (raw) => {
    const body = extractRegion(
      raw,
      '<!-- genetic-ai-operations:body:begin -->',
      '<!-- genetic-ai-operations:body:end -->',
    );
    return body ? body.inner : raw;
  };
  if (fs.existsSync(p)) return readBody(fs.readFileSync(p, 'utf8'));
  return readBody(fs.readFileSync(path.join(PAYLOAD_ROOT, 'docs/ai/OPERATIONS.md'), 'utf8'));
}

function prepareKitContent(rel, kitContent, kitSourceType) {
  if (rel === 'docs/ai/OPERATIONS.md') {
    const variant = resolveOperationsVariant(kitSourceType || 'path');
    const body = readOperationsKitBody(variant);
    return kitContent.replace(
      /<!-- genetic-ai-operations:body:begin -->[\s\S]*?<!-- genetic-ai-operations:body:end -->/,
      `<!-- genetic-ai-operations:body:begin -->\n${body.trim()}\n<!-- genetic-ai-operations:body:end -->`,
    );
  }
  return kitContent;
}

/**
 * Apply navigation merge for one protected file.
 */
function applyNavigationFile(rel, targetRoot, vars, { forceNavigation, kitSourceType, strict }) {
  const src = path.join(PAYLOAD_ROOT, rel);
  const dest = path.join(targetRoot, rel);
  if (!fs.existsSync(src)) return { action: 'skip', conflicts: [] };

  let kitContent = substitute(fs.readFileSync(src, 'utf8'), vars, { strict });
  kitContent = prepareKitContent(rel, kitContent, kitSourceType);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, kitContent, 'utf8');
    return { action: 'write', conflicts: [] };
  }

  const regions = getKitRegions().filter((r) => r.file === rel);
  const existing = fs.readFileSync(dest, 'utf8');
  const hasKitMarkers = regions.some((r) => existing.includes(r.beginMarker));
  if (forceNavigation && !hasKitMarkers) {
    fs.writeFileSync(dest, kitContent, 'utf8');
    return { action: 'overwrite-legacy', conflicts: ['missing kit markers — full file replaced'] };
  }
  const { content, merged, conflicts } = mergeRegionsFromKit(existing, kitContent, regions);

  let finalContent = content;
  const tenantTier1 = regions.find((r) => r.id === 'tenant-tier1');
  const seedTier1 = regions.find((r) => r.id === 'tier1-seed');
  if (tenantTier1 && seedTier1) {
    const tenantR = extractRegion(finalContent, tenantTier1.beginMarker, tenantTier1.endMarker);
    const seedR = extractRegion(kitContent, seedTier1.beginMarker, seedTier1.endMarker);
    if (tenantR && seedR) {
      const mergedInner = mergeTier1RowsByTag(tenantR.inner, seedR.inner);
      finalContent = finalContent.replace(
        `${tenantTier1.beginMarker}\n${tenantR.inner}\n${tenantTier1.endMarker}`,
        `${tenantTier1.beginMarker}\n${mergedInner}\n${tenantTier1.endMarker}`,
      );
      merged.push('tier1-row-merge');
    }
  }

  fs.writeFileSync(dest, finalContent, 'utf8');
  return { action: 'merge', merged, conflicts };
}

/**
 * @param {object} params
 */
export function applyUpgrade({ targetRoot, relativeFiles, vars, options }) {
  const {
    dryRun = false,
    preserveNavigation = true,
    forceNavigation = false,
    strict = false,
    kitSourceType = 'path',
    skipPhilosophy = true,
    forcePhilosophy = false,
    mergePhilosophy = false,
  } = options;

  const written = [];
  const merged = [];
  const skipped = [];
  const conflicts = [];
  const warnings = [];

  const protectedSet = new Set(loadNavigationContract().protectedFiles || []);
  const navHandled = new Set();

  if (preserveNavigation && !dryRun) {
    for (const rel of relativeFiles) {
      if (!protectedSet.has(rel)) continue;
      const result = applyNavigationFile(rel, targetRoot, vars, {
        forceNavigation,
        kitSourceType,
        strict,
      });
      navHandled.add(rel);
      if (result.action === 'merge') merged.push(...(result.merged || []));
      else written.push(rel);
      conflicts.push(...(result.conflicts || []));
    }
  }

  const copyList = relativeFiles.filter((f) => !navHandled.has(f));

  const copyWritten = copyPayloadFiles({
    targetRoot,
    relativeFiles: copyList,
    vars,
    strict,
    dryRun,
    skipPhilosophy,
    forcePhilosophy,
    mergePhilosophy,
    preserveNavigation,
    forceNavigation,
    navigationFilesHandled: [...navHandled],
  });

  for (const f of copyWritten) {
    if (!merged.includes(f)) written.push(f);
  }

  return { written, merged, skipped, conflicts, warnings };
}

export function runPostUpgradeValidate(targetRoot, kitRoot, scriptsDir) {
  const validate = spawnSync(
    process.execPath,
    [path.join(scriptsDir, 'validate-installed.mjs'), '--target', targetRoot, '--kit-root', kitRoot],
    { encoding: 'utf8' },
  );
  return {
    status: validate.status === 0 ? 'ok' : 'failed',
    stdout: validate.stdout,
    stderr: validate.stderr,
    exitCode: validate.status ?? 1,
  };
}

export function finalizeUpgradeReport(targetRoot, partial, validation, options) {
  let exitRecommendation = 0;
  if (partial.conflicts?.length) exitRecommendation = 2;
  if (validation?.status === 'failed') exitRecommendation = exitRecommendation || 1;

  const report = buildUpgradeReport({
    ...partial,
    kitVersion: options.kitVersion || 'unknown',
    targetRoot,
    dryRun: options.dryRun,
    preserveNavigation: options.preserveNavigation,
    forceNavigation: options.forceNavigation,
    validation,
    exitRecommendation,
  });

  writeUpgradeReport(targetRoot, report, { dryRun: options.dryRun });
  return report;
}
