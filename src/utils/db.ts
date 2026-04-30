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

// Get DB from Worker env (Astro 6 Cloudflare adapter)
// In .astro frontmatter: import { env } from 'cloudflare:workers'; getDB(env);
export function getDB(env: any) {
  if (env?.DB) {
    return env.DB;
  }
  return createMockDB();
}

// Legacy — for pages that haven't migrated to env import yet
export function getDBFromLocals(locals: any) {
  // Try Astro v5 pattern (deprecated but fallback)
  try {
    if (locals?.runtime?.env?.DB) {
      return locals.runtime.env.DB;
    }
  } catch {}
  return createMockDB();
}

function createMockDB() {
  return {
    prepare(_sql: string) {
      return {
        bind(..._values: unknown[]) { return this; },
        first() { return null; },
        all() { return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } }; },
        run() { return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } }; },
      };
    },
    exec(_sql: string) {
      return { results: [], success: true, meta: { duration: 0, last_row_id: 0, changes: 0 } };
    },
  };
}
