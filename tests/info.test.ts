import request from 'supertest';
import { createApp } from '../src/server';
import { SERVICE_ID, SERVICE_NAME } from '../src/config/serviceConfig';

describe('GET /info', () => {
  it('returns service metadata', async () => {
    const app = createApp();

    const response = await request(app).get('/info');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: SERVICE_NAME,
      id: SERVICE_ID,
    });
    expect(typeof response.body.version).toBe('string');
    expect(typeof response.body.time).toBe('string');
    expect(typeof response.body.env).toBe('string');
  });
});
