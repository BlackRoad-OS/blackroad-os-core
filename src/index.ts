import config from './config';
import { getDbPool } from './db';
import { getRedisClient } from './redis';
import { createApp } from './server';

const app = createApp();

try {
  getDbPool();
  getRedisClient();
} catch (error) {
  console.error('Failed to initialize services', error);
}

app.listen(config.port, () => {
  console.log(
    `core-api listening on port ${config.port} in ${config.env} mode (version: ${config.version}, commit: ${config.commit})`
  );
});
