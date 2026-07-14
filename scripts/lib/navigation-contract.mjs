/**
 * Load NAVIGATION_CONTRACT.v1.json and validate marker regions.
 * Gene: repo.tooling.genetic_starter.agentstack_dx.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT } from './paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONTRACT = path.join(KIT_ROOT, 'contracts/NAVIGATION_CONTRACT.v1.json');

/**
 * @param {string} [contractPath]
 */
export function loadNavigationContract(contractPath = DEFAULT_CONTRACT) {
  if (!fs.existsSync(contractPath)) {
    throw new Error(`navigation contract missing: ${contractPath}`);
  }
  return JSON.parse(fs.readFileSync(contractPath, 'utf8'));
}

/**
 * @param {import('./navigation-contract.mjs').NavigationContract} contract
 * @param {{ file?: string, id?: string, marker?: string }} query
 */
export function findRegion(contract, query) {
  const regions = contract.regions || [];
  if (query.id) return regions.find((r) => r.id === query.id) ?? null;
  if (query.marker) {
    return (
      regions.find((r) => r.beginMarker === query.marker || r.endMarker === query.marker) ?? null
    );
  }
  if (query.file) return regions.find((r) => r.file === query.file) ?? null;
  return null;
}

/**
 * @param {import('./navigation-contract.mjs').NavigationContract} contract
 * @param {{ file: string, marker?: string, regionId?: string }} spec
 * @returns {{ ok: true, region: object } | { ok: false, error: string }}
 */
export function validateMarkerRegion(contract, spec) {
  const region = spec.regionId
    ? findRegion(contract, { id: spec.regionId })
    : spec.marker
      ? findRegion(contract, { marker: spec.marker })
      : null;

  if (!region) {
    return {
      ok: false,
      error: `no contract region for ${spec.regionId || spec.marker || spec.file}`,
    };
  }
  if (region.file !== spec.file.replace(/\\/g, '/')) {
    return {
      ok: false,
      error: `region ${region.id} is for ${region.file}, not ${spec.file}`,
    };
  }
  if (!region.beginMarker) {
    return { ok: false, error: `region ${region.id} missing beginMarker` };
  }
  return { ok: true, region };
}

/**
 * @param {string} filePath
 * @param {string} beginMarker
 * @param {string | null | undefined} endMarker
 */
export function assertMarkersInFile(filePath, beginMarker, endMarker) {
  const errors = [];
  if (!fs.existsSync(filePath)) {
    return [`file missing: ${filePath}`];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(beginMarker)) {
    errors.push(`missing begin marker ${beginMarker} in ${filePath}`);
  }
  if (endMarker && !content.includes(endMarker)) {
    errors.push(`missing end marker ${endMarker} in ${filePath}`);
  }
  return errors;
}

/**
 * Append a line block inside a contract region (before endMarker, or after begin for append-only).
 * @param {string} filePath
 * @param {{ beginMarker: string, endMarker?: string | null }} region
 * @param {string} block
 */
export function appendInsideRegion(filePath, region, block) {
  let content = fs.readFileSync(filePath, 'utf8');
  const line = block.trimEnd();
  if (content.includes(line)) {
    return { changed: false, content };
  }

  if (!content.includes(region.beginMarker)) {
    throw new Error(`begin marker not found in ${filePath}: ${region.beginMarker}`);
  }

  if (region.endMarker) {
    const endIdx = content.indexOf(region.endMarker);
    if (endIdx === -1) {
      throw new Error(`end marker not found in ${filePath}: ${region.endMarker}`);
    }
    const before = content.slice(0, endIdx).trimEnd();
    content = `${before}\n${line}\n${region.endMarker}${content.slice(endIdx + region.endMarker.length)}`;
    return { changed: true, content };
  }

  const beginIdx = content.indexOf(region.beginMarker);
  const insertAt = beginIdx + region.beginMarker.length;
  const head = content.slice(0, insertAt);
  const tail = content.slice(insertAt);
  content = `${head}\n${line}${tail.startsWith('\n') ? '' : '\n'}${tail}`;
  return { changed: true, content };
}
