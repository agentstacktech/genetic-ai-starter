import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const KIT_ROOT = path.resolve(__dirname, '../..');
export const PAYLOAD_ROOT = path.join(KIT_ROOT, 'payload');
export const PROFILES_DIR = path.join(KIT_ROOT, 'profiles');
export const EXTENSIONS_DIR = path.join(KIT_ROOT, 'extensions');

export function resolveKitPath(...segments) {
  return path.join(KIT_ROOT, ...segments);
}
