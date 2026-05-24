/** Kit Integration Protocol (KIP) v2 — shared constants. */

export const LOCK_SCHEMA_VERSION = 2;

export const DEFAULT_KIT_SUBMODULE_PATH = 'tools/genetic-ai-starter';

export const DEFAULT_KIT_REPO_URL = 'https://github.com/agentstacktech/genetic-ai-starter.git';

export const FALLBACK_KIT_PATHS = [
  DEFAULT_KIT_SUBMODULE_PATH,
  'vendor/genetic-ai-starter',
  'genetic-ai-starter',
];

export const NPM_KIT_REL = 'node_modules/@agentstack/genetic-ai-starter';

export const ALLOWED_KIT_REPO_HOSTS = ['github.com/agentstacktech/genetic-ai-starter'];

export function kitReleaseTag(platformVersion) {
  return `genetic-ai-starter-v${platformVersion}`;
}
