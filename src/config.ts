import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

type AppEnvironment = 'development' | 'staging' | 'production' | string;

export type AppConfig = {
  env: AppEnvironment;
  port: number;
  databaseUrl: string;
  redisUrl?: string;
  publicCoreUrl?: string;
  version: string;
  commit: string;
};

const env: AppEnvironment = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

function loadPackageVersion(): string {
  try {
    const pkgPath = path.resolve(__dirname, '..', 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch (error) {
    console.warn('Unable to read package version', error);
    return '0.0.0';
  }
}

function parsePort(): number {
  const raw = process.env.CORE_PORT ?? process.env.PORT ?? '3000';
  const port = Number(raw);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`CORE_PORT/PORT must be a positive integer, received: ${raw}`);
  }

  return port;
}

function requireEnv(name: string, description?: string): string {
  const value = process.env[name];

  if (!value) {
    if (isDev) {
      console.warn(`Warning: ${name} is not set. ${description ?? ''}`.trim());
      return '';
    }

    throw new Error(
      `Configuration error: ${name} is required in ${env} environment.` +
        (description ? `\n${description}` : '')
    );
  }

  return value;
}

function validateUrl(value: string, name: string): void {
  if (!value) return;
  try {
    new URL(value);
  } catch (error) {
    throw new Error(`Configuration error: ${name} must be a valid URL. Received: ${value}`);
  }
}

const databaseUrl = requireEnv('DATABASE_URL', 'PostgreSQL connection string');
const publicCoreUrl = process.env.PUBLIC_CORE_URL || '';
const redisUrl = process.env.REDIS_URL || undefined;

validateUrl(databaseUrl, 'DATABASE_URL');
validateUrl(publicCoreUrl, 'PUBLIC_CORE_URL');
if (redisUrl) {
  validateUrl(redisUrl, 'REDIS_URL');
}

const config: AppConfig = {
  env,
  port: parsePort(),
  databaseUrl,
  redisUrl,
  publicCoreUrl,
  version: loadPackageVersion(),
  commit:
    process.env.COMMIT_SHA ||
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT_SHA ||
    'unknown',
};

if (isDev) {
  console.log('Configuration loaded:', {
    env: config.env,
    port: config.port,
    databaseUrl: config.databaseUrl ? 'configured' : 'missing',
    redisUrl: config.redisUrl ? 'configured' : 'missing',
    publicCoreUrl: config.publicCoreUrl || 'missing',
    version: config.version,
    commit: config.commit,
  });
}

export default config;
