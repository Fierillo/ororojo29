import pool from './db';

export const products = {
  getAll: async () => {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.name'
    );
    return result.rows;
  },

  getBySlug: async (slug: string) => {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  },

  getFeatured: async () => {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.featured = true ORDER BY p.name'
    );
    return result.rows;
  },

  getByCategory: async (categoryId: number) => {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = $1 ORDER BY p.name',
      [categoryId]
    );
    return result.rows;
  },

  create: async (data: { name: string; price: number; description: string; category_id: number; destacado?: boolean; image_id?: number }) => {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await pool.query(
      `INSERT INTO products (name, slug, price, description, category_id, featured, image_id, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [data.name, slug, data.price, data.description, data.category_id, data.destacado || false, data.image_id || null]
    );
    return result.rows[0];
  },

  update: async (id: number, data: { name: string; price: number; description: string; category_id: number; destacado?: boolean; image_id?: number }) => {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await pool.query(
      `UPDATE products SET name = $1, slug = $2, price = $3, description = $4, category_id = $5, featured = $6, image_id = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [data.name, slug, data.price, data.description, data.category_id, data.destacado || false, data.image_id || null, id]
    );
    return result.rows[0];
  },

  delete: async (id: number) => {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  },
};

export const categories = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  },

  getById: async (id: number) => {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  getBySlug: async (slug: string) => {
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  },

  create: async (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await pool.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );
    return result.rows[0];
  },

  delete: async (id: number) => {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  },
};

export const images = {
  create: async (filename: string, mimeType: string, data: Buffer) => {
    const result = await pool.query(
      'INSERT INTO images (filename, mime_type, data) VALUES ($1, $2, $3) RETURNING id',
      [filename, mimeType, data]
    );
    return result.rows[0].id;
  },

  get: async (id: number) => {
    const result = await pool.query('SELECT mime_type, data FROM images WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
};

export const siteConfig = {
  get: async () => {
    const result = await pool.query("SELECT value FROM site_config WHERE key = 'admin_data'");
    return result.rows[0]?.value || {};
  },

  update: async (data: Record<string, unknown>) => {
    await pool.query(
      `INSERT INTO site_config (key, value, updated_at) VALUES ('admin_data', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify(data)]
    );
  },
};