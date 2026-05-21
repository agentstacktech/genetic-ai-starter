/**
 * Replace {{PROJECT_NAME}}, {{DOMAIN}}, {{SUBSYSTEM}}, etc. in file content.
 */
const PLACEHOLDER_RE = /\{\{([A-Z0-9_]+)\}\}/g;

export function substitute(content, vars, { strict = false } = {}) {
  const unresolved = new Set();
  const out = content.replace(PLACEHOLDER_RE, (_, key) => {
    if (vars[key] !== undefined && vars[key] !== '') return vars[key];
    unresolved.add(key);
    return `{{${key}}}`;
  });
  if (strict && unresolved.size > 0) {
    throw new Error(`Unresolved placeholders: ${[...unresolved].join(', ')}`);
  }
  return out;
}

export function findUnresolved(content) {
  const found = [...content.matchAll(PLACEHOLDER_RE)].map((m) => m[1]);
  return [...new Set(found)];
}
