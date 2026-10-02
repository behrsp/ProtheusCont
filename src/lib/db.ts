import { Pool, neon } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_oWpq0dA6EnCF@ep-shiny-union-b6u4g5rz-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require";

// Tagged template function for template queries
export const sql = neon(connectionString);

// Pool instance for parameterized string queries
export const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
