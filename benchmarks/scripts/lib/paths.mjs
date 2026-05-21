import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const BENCH_ROOT = path.resolve(__dirname, '../..');
export const KIT_ROOT = path.resolve(BENCH_ROOT, '..');
export const FIXTURE_ROOT = path.join(BENCH_ROOT, 'fixture-shop-api');
export const WORK_ROOT = path.join(BENCH_ROOT, 'work');
export const TASKS_PATH = path.join(BENCH_ROOT, 'tasks/tasks.json');
export const OVERLAY_SHOP = path.join(BENCH_ROOT, 'overlays/shop');
export const BASELINES_DIR = path.join(BENCH_ROOT, 'baselines');
export const RESULTS_ROOT = path.join(BENCH_ROOT, 'results');
