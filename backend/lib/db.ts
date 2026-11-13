/**
 * db.ts — In-memory SQLite database seeded with application configuration.
 *
 * This is NOT used for health data storage.
 * The app is stateless per DPDP Act 2023 requirements.
 *
 * This module exists only to:
 *   1. Demonstrate the backend can reach a database (walking skeleton requirement)
 *   2. Store immutable app config (version, build timestamp, app name) for /api/health
 */

import { DatabaseSync } from 'node:sqlite';

export interface AppConfig {
  app_name: string;
  version: string;
  seeded_at: string;
}

let _db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (_db) return _db;

  _db = new DatabaseSync(':memory:');

  _db.exec(`
    CREATE TABLE IF NOT EXISTS app_config (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const insert = _db.prepare('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)');
  insert.run('app_name', 'ReportSaathi');
  insert.run('version', '1.0.0');
  insert.run('seeded_at', new Date().toISOString());

  return _db;
}

export function getAppConfig(): AppConfig {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM app_config').all() as Array<{
    key: string;
    value: string;
  }>;

  const config: Record<string, string> = {};
  for (const row of rows) {
    config[row.key] = row.value;
  }

  return {
    app_name: config['app_name'] ?? 'ReportSaathi',
    version: config['version'] ?? '1.0.0',
    seeded_at: config['seeded_at'] ?? new Date().toISOString(),
  };
}
