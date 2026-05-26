/**
 * Region-based markdown merge (kit vs tenant blocks).
 */

/**
 * @param {string} content
 * @param {string} beginMarker
 * @param {string} endMarker
 */
export function extractRegion(content, beginMarker, endMarker) {
  const start = content.indexOf(beginMarker);
  if (start === -1) return null;
  const innerStart = start + beginMarker.length;
  const end = content.indexOf(endMarker, innerStart);
  if (end === -1) return null;
  return {
    before: content.slice(0, start),
    inner: content.slice(innerStart, end).replace(/^\n/, '').replace(/\n$/, ''),
    after: content.slice(end + endMarker.length),
    fullStart: start,
    fullEnd: end + endMarker.length,
  };
}

/**
 * @param {string} content
 * @param {string} beginMarker
 * @param {string} endMarker
 * @param {string} newInner
 */
export function replaceRegion(content, beginMarker, endMarker, newInner) {
  const region = extractRegion(content, beginMarker, endMarker);
  if (!region) {
    return { content, changed: false, missing: true };
  }
  const innerBlock = `\n${newInner.trim()}\n`;
  const merged =
    region.before + beginMarker + innerBlock + endMarker + region.after;
  return { content: merged, changed: true, missing: false };
}

/**
 * Insert region at end if missing.
 */
export function insertRegionAtEnd(content, beginMarker, endMarker, inner) {
  const block = `\n\n${beginMarker}\n${inner.trim()}\n${endMarker}\n`;
  return content.trimEnd() + block;
}

/**
 * @param {string} oldInner
 * @param {string} newInner
 */
export function diffRegion(oldInner, newInner) {
  if (oldInner.trim() === newInner.trim()) return '';
  return `--- tenant\n+++ kit\n${newInner.split('\n').map((l) => `+ ${l}`).join('\n')}`;
}

/**
 * @param {string} existingContent
 * @param {string} kitContent full file from payload
 * @param {{ beginMarker: string, endMarker: string, owner: string }[]} regions
 * @returns {{ content: string, merged: string[], conflicts: string[] }}
 */
export function mergeRegionsFromKit(existingContent, kitContent, regions) {
  const kitOnly = regions.filter((r) => r.owner === 'kit' && r.endMarker);
  let result = existingContent;
  const merged = [];
  const conflicts = [];

  for (const spec of kitOnly) {
    const kitRegion = extractRegion(kitContent, spec.beginMarker, spec.endMarker);
    if (!kitRegion) {
      conflicts.push(`kit missing region ${spec.id || spec.beginMarker}`);
      continue;
    }
    const existing = extractRegion(result, spec.beginMarker, spec.endMarker);
    if (existing) {
      const replaced = replaceRegion(
        result,
        spec.beginMarker,
        spec.endMarker,
        kitRegion.inner,
      );
      result = replaced.content;
      if (replaced.changed) merged.push(spec.id || spec.beginMarker);
    } else {
      result = insertRegionAtEnd(
        result,
        spec.beginMarker,
        spec.endMarker,
        kitRegion.inner,
      );
      merged.push(`inserted:${spec.id || spec.beginMarker}`);
    }
  }

  return { content: result, merged, conflicts };
}

/**
 * Merge Tier 1 table rows in tenant region by genetic tag (first column).
 * @param {string} tableMarkdown markdown table body lines
 * @param {string} seedInner kit seed rows
 */
export function mergeTier1RowsByTag(tenantInner, seedInner) {
  const parseRows = (text) => {
    const lines = text.split('\n').filter((l) => l.trim().startsWith('|'));
    if (lines.length < 2) return { header: [], rows: [] };
    const header = lines[0];
    const sep = lines[1];
    const rows = lines.slice(2).map((line) => {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      const tag = cols[0] || '';
      return { line, tag };
    });
    return { header, sep, rows };
  };

  const tenant = parseRows(tenantInner);
  const seed = parseRows(seedInner);
  const tenantTags = new Set(tenant.rows.map((r) => r.tag));
  const mergedRows = [...tenant.rows];
  for (const row of seed.rows) {
    if (!row.tag || tenantTags.has(row.tag)) continue;
    mergedRows.push(row);
  }
  if (!tenant.header) return seedInner;
  return [tenant.header, tenant.sep, ...mergedRows.map((r) => r.line)].join('\n');
}
