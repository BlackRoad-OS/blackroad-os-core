import { Router } from 'express';
import config from '../config';
import { checkDbHealth } from '../db';
import { checkRedisHealth } from '../redis';

const router = Router();

router.get('/', async (_req, res) => {
  const [dbStatus, redisStatus] = await Promise.all([
    checkDbHealth(),
    checkRedisHealth(),
  ]);

  const healthy = dbStatus === 'ok' && (redisStatus === 'ok' || redisStatus === 'disabled');

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    environment: config.env,
    checks: {
      db: dbStatus,
      redis: redisStatus,
    },
  });
});

export default router;
