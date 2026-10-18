import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import catalogRoutes from './routes/catalog.js';
import testRoutes from './routes/tests.js';
import learningRoutes from './routes/learning.js';
import progressRoutes from './routes/progress.js';

// Each feature area is a router mounted under /api. To extend the platform,
// add a router file and register it here.
const routers = [authRoutes, catalogRoutes, testRoutes, learningRoutes, progressRoutes];

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  for (const r of routers) app.use('/api', r);

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal server error' });
  });
  return app;
}
