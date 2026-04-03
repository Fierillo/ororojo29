import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('HACKER: Rate limiting on contact form (DoS)', () => {
  it('should block after 10 requests in 15 minutes', async () => {
    // Make 11 requests rapidly
    const promises = [];
    for (let i = 0; i < 11; i++) {
      promises.push(
        request(BASE_URL)
          .post('/api/contact')
          .send({ name: 'Test', email: 'test@test.com', message: 'test' })
      );
    }

    const results = await Promise.all(promises);
    
    // First 10 should succeed or fail normally, 11th should be rate limited
    const statusCodes = results.map(r => r.status);
    
    // At least one should be 429 (Too Many Requests)
    expect(statusCodes).toContain(429);
  }, 30000);

  it('should accept requests under rate limit', async () => {
    // Make 5 requests (under the limit of 10)
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        request(BASE_URL)
          .post('/api/contact')
          .send({ name: `Test${i}`, email: `test${i}@test.com`, message: 'test message' })
      );
    }

    const results = await Promise.all(promises);
    const statusCodes = results.map(r => r.status);
    
    // None should be 429
    expect(statusCodes).not.toContain(429);
  }, 30000);
});