import { describe, it, expect } from 'vitest';
import request from 'supertest';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Helper to get admin session
async function getAdminSession() {
  const res = await request(BASE_URL)
    .post('/api/auth')
    .send({ password: process.env.ADMIN_PASSWORD || 'testpassword' });
  
  return res.headers['set-cookie'];
}

describe('HACKER: Invalid input on product creation', () => {
  it('should reject empty name', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: '', price: 100, description: 'Test' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject null name', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: null, price: 100, description: 'Test' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject negative price', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: 'Test Product', price: -100, description: 'Test' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject extremely large price', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: 'Test Product', price: 999999999999, description: 'Test' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject missing description', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: 'Test Product', price: 100 });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject non-number price', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: 'Test', price: 'not a number', description: 'Test' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject invalid category_id', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: 'Test', price: 100, description: 'Test', category_id: 'invalid' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject negative category_id', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({ name: 'Test', price: 100, description: 'Test', category_id: -1 });
    
    expect([400, 401]).toContain(res.status);
  });
});

describe('HACKER: Invalid input on category creation', () => {
  it('should reject empty category name', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/categories')
      .set('Cookie', cookie)
      .send({ name: '' });
    
    expect([400, 401]).toContain(res.status);
  });

  it('should reject null category name', async () => {
    const cookie = await getAdminSession();
    
    const res = await request(BASE_URL)
      .post('/api/categories')
      .set('Cookie', cookie)
      .send({ name: null });
    
    expect([400, 401]).toContain(res.status);
  });
});