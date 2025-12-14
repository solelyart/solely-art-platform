import { test as base, expect } from '@playwright/test';
import { testConfig } from '../playwright.env';

/**
 * Authentication Fixture for Manus OAuth
 * 
 * Since Solely Art uses Manus OAuth (not traditional email/password),
 * we use a test-only authentication endpoint to bypass OAuth for E2E testing.
 * 
 * This is the industry-standard approach for testing OAuth-based applications.
 * 
 * Provides authenticated contexts for different user types:
 * - Client (books artists)
 * - Artist (provides services)
 * - Admin (manages platform)
 */

type AuthFixtures = {
  authenticatedClientPage: any;
  authenticatedArtistPage: any;
  authenticatedAdminPage: any;
};

/**
 * Helper function to authenticate via test-auth endpoint
 * Sets session cookie directly without going through OAuth flow
 */
async function authenticateUser(page: any, openId: string, expectedUrl?: string) {
  // Call test-auth endpoint to get session cookie
  const response = await page.request.post(`${testConfig.baseUrl}/api/test-auth/login`, {
    data: { openId },
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok()) {
    throw new Error(`Authentication failed: ${response.status()} ${await response.text()}`);
  }

  // Session cookie is automatically set by the browser
  // Navigate to home page to verify authentication worked
  await page.goto(expectedUrl || '/');
  
  // Wait a moment for auth state to settle
  await page.waitForTimeout(500);
}

export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated Client Page
   * Automatically logs in as a client before tests
   */
  authenticatedClientPage: async ({ page }, use) => {
    // Authenticate as test client
    await authenticateUser(page, testConfig.testUsers.client.openId, '/');

    // Verify authentication by checking for logout button
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 5000 });

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test (optional, session will expire anyway)
    try {
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/', { timeout: 3000 });
    } catch (e) {
      // Ignore logout errors in cleanup
    }
  },

  /**
   * Authenticated Artist Page
   * Automatically logs in as an artist before tests
   */
  authenticatedArtistPage: async ({ page }, use) => {
    // Authenticate as test artist
    await authenticateUser(page, testConfig.testUsers.artist.openId, '/');

    // Verify authentication
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 5000 });

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test
    try {
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/', { timeout: 3000 });
    } catch (e) {
      // Ignore logout errors in cleanup
    }
  },

  /**
   * Authenticated Admin Page
   * Automatically logs in as an admin before tests
   */
  authenticatedAdminPage: async ({ page }, use) => {
    // Authenticate as test admin
    await authenticateUser(page, testConfig.testUsers.admin.openId, '/');

    // Verify authentication
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 5000 });

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test
    try {
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/', { timeout: 3000 });
    } catch (e) {
      // Ignore logout errors in cleanup
    }
  },
});

export { expect };
