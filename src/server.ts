import express from 'express';
import healthRouter from './routes/health';
import versionRouter from './routes/version';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ message: 'BlackRoad OS core-api' });
  });

  app.use('/health', healthRouter);
  app.use('/version', versionRouter);

  return app;
}

export default createApp;
