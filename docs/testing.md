# Testing Guide

This document explains the test suite for `blackroad-os-core`.

## Test Overview

The core service includes automated tests using Jest and Supertest to ensure:
- API endpoints return correct responses
- Route handlers work as expected
- Configuration is properly loaded
- Database integration functions correctly

## Running Tests Locally

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## Test Structure

Tests are organized in `tests/unit/`:

- **health.test.ts** - Tests for health check endpoint
- **routes.test.ts** - Tests for API routes structure
- **config.test.ts** - Tests for configuration and environment

## Writing New Tests

### Basic Test Example

```typescript
import request from 'supertest';
import express from 'express';

const app = express();
app.get('/example', (req, res) => {
  res.json({ message: 'Hello' });
});

describe('Example Endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/example');
    expect(response.status).toBe(200);
  });

  it('should return correct message', async () => {
    const response = await request(app).get('/example');
    expect(response.body.message).toBe('Hello');
  });
});
```

### Testing Database Routes

For routes that use Prisma:

```typescript
// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    agent: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
    },
  })),
}));
```

## CI/CD Integration

Tests run automatically on:
- **Pull Requests**: All tests must pass before merge
- **Push to `main` or `develop`**: Validates branch integrity

See [CI/CD Workflows](./ci-workflows.md) for details.

## Debugging Test Failures

### Local Testing
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- health.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="health"
```

### CI Failures
1. Click "Details" next to the failing check in your PR
2. Expand the failed test step in GitHub Actions
3. Look for test failure messages and stack traces
4. Fix the issue locally and push

## Common Issues

**"Cannot find module 'supertest'"**
- Fix: Run `npm install` to install dependencies

**"Test timeout"**
- Fix: Increase timeout in test with `jest.setTimeout(10000)`

**"Database connection error"**
- Fix: Mock Prisma client or set DATABASE_URL for integration tests

**"Type errors in tests"**
- Fix: Run `npm run type-check` to find TypeScript issues
