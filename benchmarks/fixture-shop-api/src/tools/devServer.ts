/**
 * Local dev helper — NOT the production main server.
 * Use `npm run dev` for hot reload experiments only.
 */
import { createServer } from 'node:http';

const PORT = 4000;

createServer((_req, res) => {
  res.end('dev-only');
}).listen(PORT, () => {
  console.log(`dev server (not production) on ${PORT}`);
});
