import { Router } from 'express';
import { SERVICE_ID } from '../config/serviceConfig';

const router = Router();

router.get('/', (_req, res) => {
  const { NODE_ENV, OS_ROOT, LOG_LEVEL, SERVICE_BASE_URL } = process.env;

  res.json({
    ok: true,
    service: SERVICE_ID,
    env: {
      NODE_ENV: NODE_ENV || 'development',
      OS_ROOT: OS_ROOT || 'https://blackroad.systems',
      LOG_LEVEL: LOG_LEVEL || 'info',
      SERVICE_BASE_URL: SERVICE_BASE_URL || 'https://core.blackroad.systems',
    },
  });
});

export default router;
