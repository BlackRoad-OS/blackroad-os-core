import express from 'express';
import debugEnvRouter from './routes/debugEnv';
import healthRouter from './routes/health';
import infoRouter from './routes/info';
import versionRouter from './routes/version';
import { SERVICE_ID, SERVICE_NAME } from './config/serviceConfig';
import loggingMiddleware from './middleware/logging';
import errorHandler from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(loggingMiddleware);

  app.get('/', (_req, res) => {
    res.json({ message: 'BlackRoad OS core-api', service: SERVICE_ID, name: SERVICE_NAME });
  });

  app.use('/health', healthRouter);
  app.use('/info', infoRouter);
  app.use('/version', versionRouter);
  app.use('/debug/env', debugEnvRouter);

  app.use(errorHandler);

  return app;
}

export default createApp;
