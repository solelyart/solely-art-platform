import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Solely Art Platform
 * Covers E2E, functional, regression, and performance testing
 */
export default defineConfig({
  testDir: './e2e-tests/tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    
    // Collect trace on failure
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Timeout for each action
    actionTimeout: 10 * 1000,
    
    // Navigation timeout
    navigationTimeout: 15 * 1000,
  },

  // Configure projects for different browsers and test types
  projects: [
    // Chromium - Desktop
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },

    // Firefox - Desktop
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },

    // WebKit - Desktop
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    // Mobile Chrome
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },

    // Mobile Safari
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },

    // Performance testing project
    {
      name: 'performance',
      testMatch: /.*\.perf\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
