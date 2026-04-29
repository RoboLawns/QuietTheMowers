/// <reference types="astro/client" />

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): T | null;
  all<T = Record<string, unknown>>(): { results: T[]; success: boolean };
  run(): { success: boolean; meta?: { changes: number } };
}

interface DB {
  prepare(sql: string): D1PreparedStatement;
  exec(sql: string): void;
}

declare namespace App {
  interface Locals {
    db: DB;
    auth?: () => { userId?: string };
  }
}
