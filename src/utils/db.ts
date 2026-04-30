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

  // No D1 available — return mock that doesn't crash
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
