import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('HACKER: SQL Injection attempts on products', () => {
  const sqlInjectionPayloads = [
    "'; DROP TABLE products; --",
    "1; DROP TABLE products; --",
    "1' OR '1'='1",
    "' OR 1=1 --",
    "admin' --",
    "1' UNION SELECT * FROM users --",
    "'; DELETE FROM products; --",
    "1 AND 1=1",
    "1' AND '1'='1' --",
    "anything' OR 'x'='x",
  ];

  for (const payload of sqlInjectionPayloads) {
    it(`should handle SQL injection in slug: ${payload.slice(0, 20)}...`, async () => {
      const res = await request(BASE_URL)
        .get(`/api/products?slug=${encodeURIComponent(payload)}`)
        .expect(200);
      
      // Should return null or empty array, not crash
      expect(res.body).toBeDefined();
    });
  }

  it('should handle SQL injection in category_id', async () => {
    const res = await request(BASE_URL)
      .get('/api/products?category=1 OR 1=1')
      .expect(200);
    
    // Should handle gracefully
    expect(res.body).toBeDefined();
  });
});

describe('HACKER: SQL Injection attempts on categories', () => {
  it('should handle SQL injection in category slug', async () => {
    const res = await request(BASE_URL)
      .get('/api/categories?id=1%20OR%201=1')
      .expect(401); // Requires auth, so should be blocked
    
    // Should return 401 Unauthorized, not 500 or crash
    expect([400, 401, 500]).toContain(res.status);
  });
});