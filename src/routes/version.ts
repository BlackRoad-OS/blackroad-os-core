import { Router } from 'express';
import config from '../config';

const router = Router();

const commitSha = process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || process.env.COMMIT_SHA || null;
const buildTime = process.env.BUILD_TIME || process.env.RAILWAY_BUILD_TIME || null;

router.get('/', (_req, res) => {
  res.json({
    service: 'core-api',
    appVersion: config.appVersion,
    commit: commitSha,
    buildTime,
    environment: config.env,
  });
});

export default router;
