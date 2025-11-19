import path from 'path';
import fs from 'fs';

type Environment = 'development' | 'staging' | 'production' | string;

type Config = {
  env: Environment;
  port: number;
  dbUrl: string;
  redisUrl?: string;
  publicBaseUrl?: string;
  appVersion: string;
};

function loadPackageVersion(): string {
  try {
    const pkgPath = path.resolve(__dirname, '..', 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch (error) {
    return '0.0.0';
  }
}

const env = (process.env.NODE_ENV as Environment) || 'development';
const isDev = env === 'development';

const port = Number(process.env.PORT ?? 3000);

if (!Number.isFinite(port) || port <= 0) {
  throw new Error('PORT must be a positive integer');
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value && !isDev) {
    throw new Error(`${name} is required in ${env} environment`);
  }
  return value ?? '';
}

const config: Config = {
  env,
  port,
  dbUrl: requireEnv('DATABASE_URL'),
  redisUrl: process.env.REDIS_URL,
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? requireEnv('PUBLIC_BASE_URL'),
  appVersion: loadPackageVersion(),
};

export default config;
