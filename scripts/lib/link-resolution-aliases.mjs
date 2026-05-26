/**
 * Resolve markdown link targets that are valid in consumer installs but not literal paths.
 */

/**
 * @param {string} target
 * @returns {string|null} rewritten target, or null if unchanged
 */
export function resolveLinkAlias(target) {
  const normalized = target.replace(/\\/g, '/');
  if (normalized.endsWith('.cursorrules.fragment.md')) {
    return normalized.replace(/\.cursorrules\.fragment\.md$/, '.cursorrules');
  }
  return null;
}

/**
 * @param {string} target
 * @returns {boolean}
 */
export function shouldSkipLinkValidation(target) {
  const n = target.replace(/\\/g, '/');
  return (
    n.endsWith('gene_document_resolver.py') ||
    n.endsWith('ai_gene_interface.py') ||
    n.includes('kit_vendor.gen1.md')
  );
}

/**
 * @param {string} target
 */
export function applyLinkAliasForResolve(target) {
  return resolveLinkAlias(target) || target;
}
