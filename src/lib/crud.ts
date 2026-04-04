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

  create: async (data: { name: string; price: number; description: string; category_id: number | null; destacado?: boolean; image_id?: number | null; specs?: string }) => {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await pool.query(
      `INSERT INTO products (name, slug, price, description, category_id, featured, image_id, specs, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      [data.name, slug, data.price, data.description, data.category_id, data.destacado || false, data.image_id || null, data.specs || null]
    );
    return result.rows[0];
  },

  update: async (id: number, data: { name: string; price: number; description: string; category_id: number | null; destacado?: boolean; image_id?: number | null; specs?: string }) => {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await pool.query(
      `UPDATE products SET name = $1, slug = $2, price = $3, description = $4, category_id = $5, featured = $6, image_id = $7, specs = $8, updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [data.name, slug, data.price, data.description, data.category_id, data.destacado || false, data.image_id || null, data.specs || null, id]
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

  create: async (name: string, intro_text?: string, image_id?: number | null) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const result = await pool.query(
      'INSERT INTO categories (name, slug, intro_text, image_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, slug, intro_text || null, image_id || null]
    );
    return result.rows[0];
  },

  update: async (id: number, data: { name?: string; intro_text?: string; image_id?: number | null }) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
      updates.push(`slug = $${paramIndex++}`);
      values.push(data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
    if (data.intro_text !== undefined) {
      updates.push(`intro_text = $${paramIndex++}`);
      values.push(data.intro_text);
    }
    if (data.image_id !== undefined) {
      updates.push(`image_id = $${paramIndex++}`);
      values.push(data.image_id);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
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