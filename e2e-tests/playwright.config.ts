import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './playwright.env';
import path from 'path';

/**
 * Playwright Configuration for Solely Art Platform
 * 
 * This configuration uses the official Playwright storageState pattern:
 * - Setup project runs first to authenticate test users
 * - Auth state is saved to JSON files in playwright/.auth/
 * - Browser projects depend on setup and reuse auth state
 * 
 * Testing types supported:
 * - Unit tests
 * - Integration tests
 * - Functional tests
 * - Regression tests
 * - Performance tests
 * - End-to-end tests
 */

// Auth state file paths
const authDir = path.join(__dirname, 'playwright/.auth');
const clientAuthFile = path.join(authDir, 'client.json');
const artistAuthFile = path.join(authDir, 'artist.json');
const adminAuthFile = path.join(authDir, 'admin.json');

export default defineConfig({
  // Test directories - include root for setup files
  testDir: '.',

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

  // Configure projects with setup dependencies
  projects: [
    // ============================================
    // SETUP PROJECT - Authenticates all test users
    // ============================================
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // ============================================
    // AUTHENTICATED BROWSER PROJECTS
    // These depend on setup and use client auth state by default
    // ============================================
    
    // Chromium - Desktop (with client auth)
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: clientAuthFile,
      },
      dependencies: ['setup'],
    },

    // Firefox - Desktop (with client auth)
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
        storageState: clientAuthFile,
      },
      dependencies: ['setup'],
    },

    // WebKit - Desktop (with client auth)
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
        storageState: clientAuthFile,
      },
      dependencies: ['setup'],
    },

    // Mobile Chrome (with client auth)
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: clientAuthFile,
      },
      dependencies: ['setup'],
    },

    // Mobile Safari (with client auth)
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
        storageState: clientAuthFile,
      },
      dependencies: ['setup'],
    },

    // Tablet (with client auth)
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
        storageState: clientAuthFile,
      },
      dependencies: ['setup'],
    },

    // ============================================
    // ROLE-SPECIFIC PROJECTS
    // For tests that need specific user roles
    // ============================================
    
    // Artist-specific tests
    {
      name: 'chromium-artist',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: artistAuthFile,
      },
      dependencies: ['setup'],
      testMatch: /.*artist.*\.spec\.ts/,
    },

    // Admin-specific tests
    {
      name: 'chromium-admin',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: adminAuthFile,
      },
      dependencies: ['setup'],
      testMatch: /.*admin.*\.spec\.ts/,
    },

    // ============================================
    // UNAUTHENTICATED PROJECT
    // For tests that should run without auth
    // ============================================
    {
      name: 'chromium-no-auth',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // No storageState - runs unauthenticated
      },
      // No dependencies - runs without setup
      testMatch: /.*unauthenticated.*\.spec\.ts|.*public.*\.spec\.ts/,
    },
  ],

  // Web server configuration (for local development)
  // Dev server should already be running at the configured baseURL
  webServer: undefined,
});
