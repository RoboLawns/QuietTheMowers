// Unified database utility for QuietTheMowers
// In Cloudflare production: uses D1 via locals.runtime.env.DB
// In local development: uses SQLite via better-sqlite3

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: { duration: number; last_row_id: number; changes: number };
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): T | null;
  all<T = Record<string, unknown>>(): D1Result<T>;
  run(): D1Result;
}

// Helper for generating UUIDs
export function generateId(): string {
  return crypto.randomUUID();
}

// Get DB from Astro locals
export function getDBFromLocals(locals: any) {
  // Cloudflare D1 binding (production / wrangler dev)
  if (locals?.runtime?.env?.DB) {
    return locals.runtime.env.DB;
  }

  // Local Node.js development with better-sqlite3
  try {
    const { getLocalDB } = require('./local-db');
    const db = getLocalDB();

    return {
      prepare(sql: string) {
        const stmt = db.prepare(sql);
        let bound: unknown[] = [];
        return {
          bind(...values: unknown[]) { bound = values; return this; },
          first<T = Record<string, unknown>>() { return stmt.get(...bound) as T | null; },
          all<T = Record<string, unknown>>() {
            const results = stmt.all(...bound) as T[];
            return { results, success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } };
          },
          run() {
            const result = stmt.run(...bound);
            return { results: [], success: true, meta: { duration: 0, last_row_id: Number(result.lastInsertRowid), changes: result.changes } };
          },
        };
      },
      exec(sql: string) {
        db.exec(sql);
        return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } };
      },
    };
  } catch {
    // Cloudflare worker context (no native modules) — return mock
    return createMockDB();
  }
}

function createMockDB() {
  return {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) { return this; },
        first() { return null; },
        all() { return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } }; },
        run() { return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } }; },
      };
    },
    exec(sql: string) {
      return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } };
    },
  };
}
