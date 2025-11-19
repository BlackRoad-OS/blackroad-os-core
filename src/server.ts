import express from 'express';
import config from './config';
import healthRouter from './routes/health';
import versionRouter from './routes/version';
import { getDbPool } from './db';
import { getRedisClient } from './redis';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'BlackRoad OS core-api' });
});

app.use('/health', healthRouter);
app.use('/version', versionRouter);

const port = config.port;

// Initialize connections lazily to fail fast if misconfigured
try {
  getDbPool();
  getRedisClient();
} catch (error) {
  console.error('Failed to initialize services', error);
}

app.listen(port, () => {
  console.log(`core-api listening on port ${port} in ${config.env} mode`);
});

export default app;
