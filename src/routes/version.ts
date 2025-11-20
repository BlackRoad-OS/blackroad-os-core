import { Router } from 'express';
import config from '../config';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    version: config.version,
    commit: config.commit,
    env: config.env,
  });
});

export default router;
