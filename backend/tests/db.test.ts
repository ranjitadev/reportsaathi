import { describe, it, expect, beforeAll } from 'vitest';
import { getAppConfig, getDb } from '../lib/db';

describe('getDb', () => {
  it('returns a database instance', () => {
    const db = getDb();
    expect(db).toBeDefined();
  });

  it('is a singleton (same instance returned)', () => {
    const a = getDb();
    const b = getDb();
    expect(a).toBe(b);
  });
});

describe('getAppConfig', () => {
  let config: ReturnType<typeof getAppConfig>;

  beforeAll(() => {
    config = getAppConfig();
  });

  it('returns app_name "ReportSaathi"', () => {
    expect(config.app_name).toBe('ReportSaathi');
  });

  it('returns version "1.0.0"', () => {
    expect(config.version).toBe('1.0.0');
  });

  it('returns a valid ISO seeded_at timestamp', () => {
    expect(new Date(config.seeded_at).toISOString()).toBe(config.seeded_at);
  });
});
