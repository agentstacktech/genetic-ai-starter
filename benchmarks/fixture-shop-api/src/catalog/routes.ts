import type { IncomingMessage, ServerResponse } from 'node:http';
import { applyListFilter } from './listFilter.js';

export function catalogRouter(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.url?.startsWith('/api/products')) {
    const items = applyListFilter([{ id: '1', name: 'Widget' }], req.url);
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ items }));
    return true;
  }
  return false;
}
