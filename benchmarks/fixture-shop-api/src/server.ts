/**
 * Production HTTP entry — mounts auth, catalog, billing, webhooks.
 */
import { createServer } from 'node:http';
import { attachAuthMiddleware } from './auth/sessionMiddleware.js';
import { catalogRouter } from './catalog/routes.js';
import { registerWebhookRoutes } from './webhooks/delivery.js';

const PORT = Number(process.env.PORT ?? 3000);

export function createAppServer() {
  const server = createServer((req, res) => {
    attachAuthMiddleware(req, res);
    if (catalogRouter(req, res)) return;
    if (registerWebhookRoutes(req, res)) return;
    res.statusCode = 404;
    res.end('not found');
  });
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createAppServer().listen(PORT, () => {
    console.log(`shop-api listening on ${PORT}`);
  });
}
