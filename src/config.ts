import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file in development
dotenv.config();

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

// Validate PORT
const port = Number(process.env.PORT ?? 3000);

if (!Number.isFinite(port) || port <= 0) {
  throw new Error(`PORT must be a positive integer, got: ${process.env.PORT}`);
}

// Helper to require environment variables with detailed error messages
function requireEnv(name: string, description?: string): string {
  const value = process.env[name];
  if (!value) {
    if (isDev) {
      console.warn(
        `Warning: ${name} is not set. ${description || 'This may cause issues.'}`
      );
      return '';
    }
    throw new Error(
      `Configuration error: ${name} is required in ${env} environment.\n` +
      `${description ? `Description: ${description}\n` : ''}` +
      `Please set this environment variable and restart the application.`
    );
  }
  return value;
}

// Helper to validate URLs
function validateUrl(url: string, name: string): void {
  if (!url) return;
  try {
    new URL(url);
  } catch (error) {
    throw new Error(
      `Configuration error: ${name} must be a valid URL, got: ${url}`
    );
  }
}

// Build configuration with validation
const dbUrl = requireEnv(
  'DATABASE_URL',
  'PostgreSQL connection string (e.g., postgresql://user:pass@host:port/db)'
);

const publicBaseUrl = requireEnv(
  'PUBLIC_BASE_URL',
  'Public-facing base URL for this API (e.g., https://core.blackroad.systems)'
);

// Validate URLs
validateUrl(dbUrl, 'DATABASE_URL');
validateUrl(publicBaseUrl, 'PUBLIC_BASE_URL');
if (process.env.REDIS_URL) {
  validateUrl(process.env.REDIS_URL, 'REDIS_URL');
}

const config: Config = {
  env,
  port,
  dbUrl,
  redisUrl: process.env.REDIS_URL,
  publicBaseUrl,
  appVersion: loadPackageVersion(),
};

// Log configuration summary in development
if (isDev) {
  console.log('Configuration loaded:');
  console.log(`  Environment: ${config.env}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Database: ${config.dbUrl ? '✓ configured' : '✗ not configured'}`);
  console.log(`  Redis: ${config.redisUrl ? '✓ configured' : '✗ not configured'}`);
  console.log(`  Public URL: ${config.publicBaseUrl}`);
  console.log(`  Version: ${config.appVersion}`);
}

export default config;
