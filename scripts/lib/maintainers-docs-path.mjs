import path from 'node:path';
import { KIT_ROOT } from './paths.mjs';

/** Monorepo operator docs — outside `genetic-ai-starter/` subtree (not in public mirror git). */
export const MAINTAINERS_DOCS = path.join(KIT_ROOT, '..', 'docs', 'genetic-ai-starter-maintainers');
