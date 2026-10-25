import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { geminiService } from '../src/services/gemini.service';

describe('POST /api/planning/generate - API Integration Tests', () => {
  const validRequest = {
    eventType: 'wedding',
    eventName: 'Aarav & Aastha Wedding',
    date: '2026-12-20',
    location: 'Dehradun',
    guestCount: 250,
    budget: 800000,
    currency: 'INR',
    style: 'elegant minimal',
    preferences: ['vegetarian food', 'minimal decoration'],
  };

  it('generates a structured plan successfully (200 OK)', async () => {
    const response = await request(app)
      .post('/api/planning/generate')
      .send(validRequest)
      .expect(200);

    expect(response.body).toHaveProperty('eventSummary');
    expect(response.body).toHaveProperty('budget');
    expect(response.body.budget).toHaveProperty('total', 800000);
    expect(response.body.budget).toHaveProperty('currency', 'INR');
    expect(response.body.budget.categories.length).toBeGreaterThan(0);
    expect(response.body.budget).toHaveProperty('contingency');
    expect(response.body).toHaveProperty('timeline');
    expect(response.body).toHaveProperty('vendors');
    expect(response.body).toHaveProperty('ideas');
    expect(response.body).toHaveProperty('risks');
    expect(response.body).toHaveProperty('missingItems');
    expect(Array.isArray(response.body.missingItems)).toBe(true);
  });

  it('returns 400 Bad Request with details when payload is invalid (missing fields)', async () => {
    const invalidRequest = {
      eventType: 'wedding',
      // missing eventName, date, etc.
    };

    const response = await request(app)
      .post('/api/planning/generate')
      .send(invalidRequest)
      .expect(400);

    expect(response.body.status).toBe('error');
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  it('returns 400 Bad Request when budget is negative', async () => {
    const negativeBudgetReq = {
      ...validRequest,
      budget: -1000,
    };

    const response = await request(app)
      .post('/api/planning/generate')
      .send(negativeBudgetReq)
      .expect(400);

    expect(response.body.status).toBe('error');
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    const budgetIssue = response.body.error.details.find(
      (d: { path: string }) => d.path === 'budget'
    );
    expect(budgetIssue).toBeDefined();
  });

  it('handles unexpected internal provider errors securely (500 without leaking secrets)', async () => {
    // Spy and simulate provider exception with a fake internal secret
    const spy = vi
      .spyOn(geminiService, 'generatePlan')
      .mockRejectedValueOnce(new Error('AI provider connection timeout with AIzaSyD3fakeSecretToken'));

    const response = await request(app)
      .post('/api/planning/generate')
      .send(validRequest)
      .expect(500);

    expect(response.body.status).toBe('error');
    expect(response.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    // Ensure the secret is never returned in response
    expect(JSON.stringify(response.body)).not.toContain('AIzaSyD3fakeSecretToken');

    spy.mockRestore();
  });

  it('health endpoint returns 200 OK', async () => {
    const response = await request(app).get('/health').expect(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('veyra-planning-backend');
  });
});
