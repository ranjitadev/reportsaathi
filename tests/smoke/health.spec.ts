import { test, expect } from '@playwright/test';

/**
 * Smoke test: Walking Skeleton
 *
 * Verifies the end-to-end path:
 *   Browser → Frontend (Next.js) → Backend /api/health → SQLite DB → response rendered
 */
test.describe('Walking Skeleton — Health Check Smoke Test', () => {
  test('home page loads and shows health card', async ({ page }) => {
    await page.goto('/');

    // Page title
    await expect(page).toHaveTitle(/ReportSaathi/);

    // Health card is rendered (not error state)
    const card = page.getByTestId('health-card');
    await expect(card).toBeVisible({ timeout: 15_000 });
  });

  test('health card shows version read from backend', async ({ page }) => {
    await page.goto('/');
    const version = page.getByTestId('health-version');
    await expect(version).toBeVisible({ timeout: 15_000 });
    await expect(version).toHaveText('1.0.0');
  });

  test('health card shows app name read from SQLite database', async ({ page }) => {
    await page.goto('/');
    const appName = page.getByTestId('db-app-name');
    await expect(appName).toBeVisible({ timeout: 15_000 });
    await expect(appName).toHaveText('ReportSaathi');
  });

  test('backend /api/health returns 200 with correct shape', async ({ request }) => {
    const backendUrl = process.env.PLAYWRIGHT_BACKEND_URL ?? 'http://localhost:3001';
    const response = await request.get(`${backendUrl}/api/health`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('healthy');
    expect(body.version).toBe('1.0.0');
    expect(body.db.appName).toBe('ReportSaathi');
    expect(typeof body.db.seededAt).toBe('string');
    expect(new Date(body.db.seededAt).toISOString()).toBe(body.db.seededAt);
  });
});
