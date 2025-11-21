import express from 'express';
import { serviceConfig, SERVICE_ID, SERVICE_NAME } from './config/serviceConfig';
import loggingMiddleware from './middleware/logging';
import errorHandler from './middleware/errorHandler';
import healthRouter from './routes/health';
import infoRouter from './routes/info';
import versionRouter from './routes/version';
import debugEnvRouter from './routes/debugEnv';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(loggingMiddleware);

  app.use('/health', healthRouter);
  app.use('/info', infoRouter);
  app.use('/version', versionRouter);
  app.use('/debug/env', debugEnvRouter);

  app.use(errorHandler);

  return app;
}

function startServer(): void {
  const app = createApp();
  const port = Number(process.env.PORT) || 8080;

  try {
    // Initialize backing services if available, without failing the server startup.
    // Dynamic imports avoid pulling configuration when running tests.
    const { getDbPool } = require('./db');
    const { getRedisClient } = require('./redis');

    try {
      getDbPool();
    } catch (error) {
      console.error('Failed to initialize database pool', error);
    }

    try {
      getRedisClient();
    } catch (error) {
      console.error('Failed to initialize Redis client', error);
    }
  } catch (error) {
    console.warn('Optional services could not be initialized', error);
  }

  app.listen(port, () => {
    console.log(
      `${SERVICE_NAME} (${SERVICE_ID}) listening on port ${port} in ${process.env.NODE_ENV || 'development'} mode (base: ${serviceConfig.SERVICE_BASE_URL})`
    );
  });
}

if (require.main === module) {
  startServer();
}

export default createApp;
