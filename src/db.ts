import { Pool } from 'pg';
import config from './config';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    pool = new Pool({ connectionString: config.databaseUrl });
    pool.on('error', (error: Error) => {
      console.error('Unexpected Postgres error', error);
    });
  }
  return pool;
}

export async function checkDbHealth(): Promise<'ok' | 'error'> {
  try {
    await getPool().query('SELECT 1');
    return 'ok';
  } catch (error) {
    console.error('DB health check failed', error);
    return 'error';
  }
}

export function getDbPool(): Pool {
  return getPool();
}
