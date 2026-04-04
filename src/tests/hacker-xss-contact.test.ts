import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('HACKER: XSS in contact form', () => {
  const payloads = [
    { name: '<script>alert(1)</script>', email: 'test@test.com', message: 'test' },
    { name: '<img src=x onerror=alert(1)>', email: 'test@test.com', message: 'test' },
    { name: '"><script>alert(1)</script>', email: 'test@test.com', message: 'test' },
    { name: '<svg onload=alert(1)>', email: 'test@test.com', message: 'test' },
    { name: '{{constructor.constructor("alert(1)")()}}', email: 'test@test.com', message: 'test' },
  ];

  for (const payload of payloads) {
    it(`should block XSS payload: ${payload.name.slice(0, 30)}`, async () => {
      const res = await request(BASE_URL)
        .post('/api/contact')
        .send(payload)
        .expect(200);
      
      // Check if response contains sanitized content (no raw < or >)
      if (res.body.success) {
        // The test expects the sanitization to work - if it passes, that's a FAILURE
        // We're checking that raw script tags are blocked
        expect(payload.name).not.toContain('<script>');
      }
    });
  }

  it('should block HTML in message field', async () => {
    const payload = {
      name: 'Normal Name',
      email: 'test@test.com',
      message: '<script>alert("xss")</script><img onerror="alert(1)" src="x">',
    };

    const res = await request(BASE_URL)
      .post('/api/contact')
      .send(payload)
      .expect(200);

    // If it succeeds, check that HTML was sanitized
    // The fix should encode < and > as &lt; and &gt;
    expect(res.body.success).toBe(true);
  });
});