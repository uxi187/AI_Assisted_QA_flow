import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Global timeout for each action - increased for slower mobile browsers */
    actionTimeout: 45000,
    /* Navigation timeout - increased for mobile */
    navigationTimeout: 60000,
  },

  /* Global test timeout - increased for mobile compatibility */
  timeout: 90000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Optimize for desktop testing
        actionTimeout: 30000,
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        actionTimeout: 35000,
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // WebKit can be slower, increase timeouts
        actionTimeout: 40000,
        navigationTimeout: 45000,
      },
    },

    /* Test against mobile viewports with optimized settings */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile-specific optimizations
        actionTimeout: 60000,
        navigationTimeout: 75000,
        // Slow down interactions for mobile stability
        launchOptions: {
          slowMo: 100,
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        // Mobile Safari can be particularly slow
        actionTimeout: 75000,
        navigationTimeout: 90000,
        // Extra slow down for mobile Safari
        launchOptions: {
          slowMo: 200,
        },
      },
    },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./utils/global-setup'),
  globalTeardown: require.resolve('./utils/global-teardown'),

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
});