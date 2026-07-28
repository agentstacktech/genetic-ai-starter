/**
 * Resolve markdown link targets that are valid in consumer installs but not literal paths.
 */

/**
 * @param {string} target
 * @param {{ mode?: 'kit' | 'consumer' }} [opts]
 * @returns {string|null} rewritten target, or null if unchanged
 */
export function resolveLinkAlias(target, opts = {}) {
  const mode = opts.mode || 'kit';
  const normalized = target.replace(/\\/g, '/');
  // Consumer trees: install merges fragment → `.cursorrules`.
  // Kit payload SoT keeps `.cursorrules.fragment.md` on disk — do not rewrite in kit mode.
  if (mode === 'consumer' && normalized.endsWith('.cursorrules.fragment.md')) {
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
    n === '...' ||
    n.endsWith('gene_document_resolver.py') ||
    n.endsWith('ai_gene_interface.py') ||
    n.includes('kit_vendor.gen1.md') ||
    /^\.\.\/MCP_/.test(n) ||
    /^\.\.\/architecture\//.test(n) ||
    n === 'AGENTSTACK_PLUGIN_PHILOSOPHY.md'
  );
}

/**
 * @param {string} target
 * @param {{ mode?: 'kit' | 'consumer' }} [opts]
 */
export function applyLinkAliasForResolve(target, opts = {}) {
  return resolveLinkAlias(target, opts) || target;
}
