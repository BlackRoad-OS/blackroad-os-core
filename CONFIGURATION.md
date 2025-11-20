# Configuration Guide

This document describes how to configure the BlackRoad OS Core API for different environments.

## Environment Variables

The application uses environment variables for configuration. All required variables are documented in `.env.example`.

### Quick Start (Local Development)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your local settings (default values are provided for development)

3. Start the development server:
   ```bash
   npm run dev
   ```

### Required Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | HTTP port for the API server | No | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes (prod/staging) | - |
| `REDIS_URL` | Redis connection string | No | - |
| `PUBLIC_BASE_URL` | Public-facing base URL | Yes (prod/staging) | - |

### Environment-Specific Behavior

#### Development Mode (`NODE_ENV=development`)
- Missing required variables will trigger **warnings** instead of errors
- Configuration summary is logged on startup
- More verbose error messages
- `.env` file is automatically loaded

#### Production/Staging Mode
- Missing required variables will **throw errors** and prevent startup
- URL validation is enforced
- Configuration logging is minimal

## Configuration Files

### `.env.example`
Template file with all available configuration options. **Committed to git**.

### `.env`
Local configuration file for development. **Not committed to git** (in `.gitignore`).

## Validation

The configuration system includes automatic validation:

- **Port validation**: Must be a positive integer
- **URL validation**: `DATABASE_URL`, `REDIS_URL`, and `PUBLIC_BASE_URL` must be valid URLs
- **Required fields**: Database and public URL are required in production/staging

## Railway Deployment

When deploying to Railway, set environment variables in the Railway dashboard:

1. Navigate to your Railway project
2. Select the `core-api` service
3. Go to "Variables" tab
4. Add the required environment variables for each environment:
   - `dev` environment
   - `staging` environment
   - `prod` environment

### Railway-Specific Notes

- Railway automatically sets `PORT` - do not override it
- Railway provides `DATABASE_URL` when you add a Postgres service
- Railway provides `REDIS_URL` when you add a Redis service

## Connection Strings Format

### PostgreSQL (`DATABASE_URL`)
```
postgresql://username:password@hostname:port/database
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/blackroad_core_dev
```

### Redis (`REDIS_URL`)
```
redis://username:password@hostname:port
```

Example:
```
redis://default:mypassword@localhost:6379
```

## Troubleshooting

### "Configuration error: DATABASE_URL is required"
- In production/staging, you must set `DATABASE_URL`
- Check that your environment variable is correctly set
- Verify the connection string format

### "PORT must be a positive integer"
- Check that `PORT` is set to a valid number
- On Railway, don't override the `PORT` variable

### "must be a valid URL"
- Ensure URLs include the protocol (`postgresql://`, `redis://`, `https://`)
- Check for typos in the connection string
- Verify hostname and port are correct

## Security Best Practices

1. **Never commit `.env`** to version control
2. **Rotate credentials regularly** for production databases
3. **Use strong passwords** for database connections
4. **Restrict database access** to specific IP addresses when possible
5. **Use SSL/TLS** for database connections in production
