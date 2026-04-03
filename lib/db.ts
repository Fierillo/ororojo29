import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL?.replace('?sslmode=require', '?sslmode=require&uselibpqcompat=true'),
  ssl: { rejectUnauthorized: false },
});

export default pool;