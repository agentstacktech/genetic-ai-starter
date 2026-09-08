/**
 * Shared step lists for doc/metrics audits (audit-docs, doctor --docs).
 * Gene: repo.tooling.genetic_starter.docs.gen1
 */

/** Full maintainer doc audit chain (`npm run audit:docs`). */
export const DOC_AUDIT_STEPS = [
  ['export-metrics-snapshot', 'scripts/export-metrics-snapshot.mjs'],
  ['export-platform-stats', 'scripts/export-platform-stats.mjs'],
  ['sync-platform-stats-site', 'scripts/sync-platform-stats-site.mjs', '--check'],
  ['calculate-roi', 'scripts/calculate-roi.mjs', '--export'],
  ['generate-i18n-manifest', 'scripts/generate-i18n-manifest.mjs'],
  ['check-meta-docs-boundary', 'scripts/check-meta-docs-boundary.mjs'],
  ['check-i18n-parity', 'scripts/check-i18n-parity.mjs'],
  ['check-docs-metrics', 'scripts/check-docs-metrics.mjs'],
  ['check-roi-model', 'scripts/check-roi-model.mjs'],
  ['check-platform-stats', 'scripts/check-platform-stats.mjs'],
  ['check-stats-plane-parity', 'scripts/check-stats-plane-parity.mjs'],
  ['check-version-parity', 'scripts/check-version-parity.mjs'],
  ['check-doc-hub-links', 'scripts/check-doc-hub-links.mjs'],
  ['check-site-inventory', 'scripts/check-site-inventory.mjs'],
  ['docs-check-inventory', 'scripts/check-readme-inventory.mjs'],
  ['build-doc-search-index', 'scripts/build-doc-search-index.mjs'],
  ['generate-llms-txt', 'scripts/generate-llms-txt.mjs'],
];

/** Subset for `doctor.mjs --docs` (consumer-facing meta guards). */
export const DOC_DOCTOR_STEPS = [
  ['check-docs-metrics', 'scripts/check-docs-metrics.mjs'],
  ['check-platform-stats', 'scripts/check-platform-stats.mjs'],
  ['check-i18n-parity', 'scripts/check-i18n-parity.mjs'],
  ['calculate-roi', 'scripts/calculate-roi.mjs', '--export'],
  ['check-roi-model', 'scripts/check-roi-model.mjs'],
];
