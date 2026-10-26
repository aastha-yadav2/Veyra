import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('CORS Security Policy Integration Tests', () => {
  it('allows requests from default dev whitelisted origins (e.g. localhost:5173)', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.body.status).toBe('ok');
  });

  it('allows requests without an Origin header (server-to-server, health check probes)', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('veyra-planning-backend');
  });

  it('blocks requests from unauthorized origins with 403 Forbidden and structured JSON error', async () => {
    const response = await request(app)
      .post('/api/planning/generate')
      .set('Origin', 'https://malicious-attacker-website.com')
      .send({ eventType: 'wedding' })
      .expect(403);

    expect(response.body.status).toBe('error');
    expect(response.body.error.code).toBe('CORS_FORBIDDEN');
    expect(response.body.error.message).toBe('Origin not allowed by CORS policy.');
  });
});
