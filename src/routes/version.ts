import { Router } from 'express';
import packageJson from '../../package.json';
import { SERVICE_ID } from '../config/serviceConfig';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    service: SERVICE_ID,
    version: packageJson.version,
  });
});

export default router;
