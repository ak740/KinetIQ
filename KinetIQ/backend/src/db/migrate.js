import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './pool.js';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Applies schema.sql (idempotent: CREATE TABLE IF NOT EXISTS). */
export async function migrate() {
  const sql = await readFile(path.join(here, 'schema.sql'), 'utf8');
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) await pool.query(stmt);
  console.log(`[db] schema ready (${statements.length} statements)`);
}
