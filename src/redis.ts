import IORedis from 'ioredis';
import config from './config';

let client: IORedis | null = null;

function createClient(): IORedis | null {
  if (!config.redisUrl) {
    return null;
  }
  if (!client) {
    client = new IORedis(config.redisUrl, {
      lazyConnect: true,
    });
    client.on('error', (error) => {
      console.error('Redis error', error);
    });
    void client.connect().catch((error) => {
      console.error('Redis initial connection failed', error);
    });
  }
  return client;
}

export function getRedisClient(): IORedis | null {
  return createClient();
}

export async function checkRedisHealth(): Promise<'ok' | 'error' | 'disabled'> {
  const redis = createClient();
  if (!redis) return 'disabled';

  try {
    await redis.ping();
    return 'ok';
  } catch (error) {
    console.error('Redis health check failed', error);
    return 'error';
  }
}
