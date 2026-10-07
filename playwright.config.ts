import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 60_000,

  expect: {
    timeout: 10_000,
  },

  use: {
    baseURL: 'https://verzel-store.qa-test-verzel-store.workers.dev',

    // Deixa cada ação mais lenta para acompanhar visualmente
    launchOptions: {
      slowMo: 1000,
    },

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  reporter: [['html', { open: 'never' }]],
});