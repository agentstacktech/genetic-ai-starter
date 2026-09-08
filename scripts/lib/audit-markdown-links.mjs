#!/usr/bin/env node
/**
 * Shared markdown link audit entry (kit + consumer modes).
 */
import { findBrokenMarkdownLinks } from './resolve-markdown-links.mjs';

/**
 * @param {string} rootDir
 * @param {string[]} relativeFiles
 * @param {{ mode?: 'kit' | 'consumer', kitRoot?: string }} [opts]
 */
export function auditMarkdownTree(rootDir, relativeFiles, opts = {}) {
  return findBrokenMarkdownLinks(rootDir, relativeFiles, opts);
}
