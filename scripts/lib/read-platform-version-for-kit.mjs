import fs from 'node:fs';
import path from 'node:path';

/**
 * Platform version from a specific kit root (consumer submodule layout).
 * @param {string} kitRoot
 */
export function readPlatformVersionForKitRoot(kitRoot) {
  if (process.env.AGENTSTACK_CORE_VERSION?.trim()) {
    return process.env.AGENTSTACK_CORE_VERSION.trim();
  }

  const constantsPy = path.join(kitRoot, '..', 'shared', 'constants.py');
  const monorepoPy = path.join(kitRoot, '..', '..', 'shared', 'constants.py');
  for (const py of [constantsPy, monorepoPy]) {
    if (fs.existsSync(py)) {
      const text = fs.readFileSync(py, 'utf8');
      const m = text.match(/AGENTSTACK_CORE_VERSION:\s*str\s*=\s*["']([^"']+)["']/);
      if (m) return m[1];
    }
  }

  const platformFile = path.join(kitRoot, 'PLATFORM_VERSION');
  if (fs.existsSync(platformFile)) {
    const v = fs.readFileSync(platformFile, 'utf8').trim();
    if (v) return v;
  }

  const manifestPath = path.join(kitRoot, 'KIT_MANIFEST.json');
  if (fs.existsSync(manifestPath)) {
    const v = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).version;
    if (v) return v;
  }

  throw new Error(`Cannot resolve platform version from kit root: ${kitRoot}`);
}
