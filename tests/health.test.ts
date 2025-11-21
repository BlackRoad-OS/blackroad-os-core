import request from 'supertest';
import { createApp } from '../src/server';
import { SERVICE_ID } from '../src/config/serviceConfig';

describe('GET /health', () => {
  it('returns ok status and service id', async () => {
    const app = createApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, service: SERVICE_ID });
    expect(typeof response.body.ts).toBe('string');
  });
});
