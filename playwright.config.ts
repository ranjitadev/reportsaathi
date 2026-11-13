import { defineConfig, devices } from '@playwright/test';

const frontendUrl = process.env.PLAYWRIGHT_FRONTEND_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: frontendUrl,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Start local dev servers automatically in local mode
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: 'npm run dev -w backend',
          port: 3001,
          reuseExistingServer: true,
        },
        {
          command: 'npm run dev -w frontend',
          port: 3000,
          reuseExistingServer: true,
        },
      ],
});
