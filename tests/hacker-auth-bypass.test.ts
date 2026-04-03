import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

describe('HACKER: Auth bypass attempts', () => {
  // Endpoints that should require auth
  const protectedEndpoints = [
    { method: 'POST', path: '/api/products', body: { name: 'Test', price: 100, description: 'Test' } },
    { method: 'PUT', path: '/api/products?id=1', body: { name: 'Test', price: 100, description: 'Test' } },
    { method: 'DELETE', path: '/api/products?id=1' },
    { method: 'POST', path: '/api/categories', body: { name: 'Test Category' } },
    { method: 'DELETE', path: '/api/categories?id=1' },
    { method: 'POST', path: '/api/images', body: {} },
    { method: 'GET', path: '/api/site-config' },
    { method: 'PUT', path: '/api/site-config', body: { test: 'value' } },
  ];

  for (const endpoint of protectedEndpoints) {
    it(`should block ${endpoint.method} ${endpoint.path} without auth`, async () => {
      let res: any;
      
      if (endpoint.method === 'GET') {
        res = await request(BASE_URL).get(endpoint.path);
      } else if (endpoint.method === 'POST') {
        res = await request(BASE_URL).post(endpoint.path).send(endpoint.body || {});
      } else if (endpoint.method === 'PUT') {
        res = await request(BASE_URL).put(endpoint.path).send(endpoint.body || {});
      } else if (endpoint.method === 'DELETE') {
        res = await request(BASE_URL).delete(endpoint.path);
      }
      
      // Should return 401 Unauthorized
      expect(res.status).toBe(401);
    });
  }

  it('should block request with fake cookie', async () => {
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', ['admin_session=fake_token_12345'])
      .send({ name: 'Test', price: 100, description: 'Test' });
    
    expect(res.status).toBe(401);
  });

  it('should block request with tampered cookie', async () => {
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', ['admin_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.fake_signature'])
      .send({ name: 'Test', price: 100, description: 'Test' });
    
    expect(res.status).toBe(401);
  });

  it('should block request with X-Admin-Password header (old method)', async () => {
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('X-Admin-Password', 'wrongpassword')
      .send({ name: 'Test', price: 100, description: 'Test' });
    
    expect(res.status).toBe(401);
  });
});

describe('HACKER: Invalid ID parameter tests', () => {
  it('should reject non-numeric image ID', async () => {
    const res = await request(BASE_URL)
      .get('/api/images/abc');
    
    expect([400, 404]).toContain(res.status);
  });

  it('should reject negative image ID', async () => {
    const res = await request(BASE_URL)
      .get('/api/images/-1');
    
    expect([400, 404]).toContain(res.status);
  });

  it('should reject zero image ID', async () => {
    const res = await request(BASE_URL)
      .get('/api/images/0');
    
    expect([400, 404]).toContain(res.status);
  });

  it('should reject SQL-like image ID', async () => {
    const res = await request(BASE_URL)
      .get('/api/images/1 OR 1=1');
    
    expect([400, 404]).toContain(res.status);
  });

  it('should reject non-numeric product ID in PUT', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .put('/api/products?id=abc')
      .set('Cookie', cookie)
      .send({ name: 'Test', price: 100, description: 'Test' });
    
    expect(res.status).toBe(400);
  });

  it('should reject non-numeric category ID in DELETE', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .delete('/api/categories?id=xyz')
      .set('Cookie', cookie);
    
    expect(res.status).toBe(400);
  });
});

// Helper function
async function getAdminSession() {
  const res = await request(BASE_URL)
    .post('/api/auth')
    .send({ password: process.env.ADMIN_PASSWORD || 'testpassword' });
  
  return res.headers['set-cookie'];
}