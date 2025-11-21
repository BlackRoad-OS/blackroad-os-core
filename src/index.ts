import config from './config';
import { getDbPool } from './db';
import { getRedisClient } from './redis';
import { createApp } from './server';
import { SERVICE_ID, SERVICE_NAME } from './config/serviceConfig';

const app = createApp();

const parsedPort = Number(process.env.PORT || process.env.CORE_PORT || config.port || 8080);
const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 8080;

try {
  getDbPool();
  getRedisClient();
} catch (error) {
  console.error('Failed to initialize services', error);
}

app.listen(port, () => {
  console.log(
    `${SERVICE_NAME} (${SERVICE_ID}) listening on port ${port} in ${config.env} mode (version: ${config.version}, commit: ${config.commit})`
  );
});
