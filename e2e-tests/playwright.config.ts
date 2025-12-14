import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './playwright.env';

/**
 * Playwright Configuration for Solely Art Platform
 * 
 * This configuration supports multiple testing types:
 * - Unit tests
 * - Integration tests
 * - Functional tests
 * - Regression tests
 * - Performance tests
 * - End-to-end tests
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Maximum time one test can run
  timeout: 60 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: testConfig.baseUrl,

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Navigation timeout
    navigationTimeout: 30 * 1000,

    // Action timeout
    actionTimeout: 10 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    // Chromium - Desktop
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Firefox - Desktop
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // WebKit - Desktop
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },

    // Mobile Safari
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
      },
    },
  ],

  // Web server configuration (for local development)
  // Dev server should already be running at the configured baseURL
  webServer: undefined,
});
