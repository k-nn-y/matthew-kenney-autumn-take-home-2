import { Pool } from "pg";

/**
 * One pool per process. Neon scales to zero after 5 minutes idle, so the first
 * query after a cold resume pays the wake cost — that is why the dashboard
 * renders its shell before awaiting data rather than blocking on it.
 */
const globalForDb = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export async function q<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

/** Money lives in the database as integer cents and is only ever formatted here. */
export const dollars = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const dollarsExact = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
