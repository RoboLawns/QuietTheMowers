// Local SQLite database for development (when not running in Cloudflare)
import { existsSync } from 'node:fs';
import { join } from 'node:path';

let db: any = null;

function getNativeDb() {
  if (!db) {
    // Dynamic require to avoid Cloudflare worker import issues
    const Database = require('better-sqlite3');
    const dataDir = join(process.cwd(), '.data');
    if (!existsSync(dataDir)) {
      require('node:fs').mkdirSync(dataDir, { recursive: true });
    }
    db = new Database(join(dataDir, 'local.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
  }
  return db;
}

function runMigrations(database: any) {
  try {
    const tableCheck = database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (tableCheck) return;

    const { readFileSync } = require('node:fs');
    const { join: pathJoin } = require('node:path');
    const migrationsDir = pathJoin(process.cwd(), 'migrations');
    const files = ['001_initial_schema.sql', '002_seed_data.sql', '003_seed_phase3.sql'];

    for (const file of files) {
      const path = pathJoin(migrationsDir, file);
      if (existsSync(path)) {
        const sql = readFileSync(path, 'utf-8');
        database.exec(sql);
      }
    }
  } catch {
    // Tables already exist or other issue
  }
}

export function getLocalDB() {
  return getNativeDb();
}
