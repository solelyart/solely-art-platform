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

  // Verify session cookie was set
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'app_session_id');
  if (!sessionCookie) {
    throw new Error('Session cookie was not set by test-auth endpoint');
  }
  console.log('✅ Session cookie set:', sessionCookie.value.substring(0, 20) + '...');

  // Navigate to home page to verify authentication worked
  await page.goto(expectedUrl || '/', { waitUntil: 'domcontentloaded' });
  
  // Wait for the tRPC auth.me query to complete
  // This is critical - the React app needs this response to update auth state
  let authResponseReceived = false;
  try {
    const authResponse = await page.waitForResponse(
      (response) => response.url().includes('/api/trpc/auth.me'),
      { timeout: 10000 }
    );
    authResponseReceived = true;
    const authData = await authResponse.json();
    console.log('✅ tRPC auth.me response:', JSON.stringify(authData).substring(0, 100));
  } catch (error) {
    console.warn('⚠️  Warning: tRPC auth.me response not detected within 10s');
  }
  
  // Wait for network to be idle after tRPC query
  await page.waitForLoadState('networkidle');
  
  // Give React extra time to update state if auth response was slow
  await page.waitForTimeout(authResponseReceived ? 1000 : 3000);
  
  // Wait for the page to fully render with auth state
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Wait for authentication to complete after navigating to a new page
 * Use this after clicking links that navigate to protected pages
 */
export async function waitForAuthAfterNavigation(page: Page) {
  try {
    // Wait for the auth.me query to complete on the new page
    await page.waitForResponse(
      (response) => response.url().includes('/api/trpc/auth.me'),
      { timeout: 10000 }
    );
    console.log('✅ Auth check completed after navigation');
  } catch (error) {
    console.warn('⚠️  Warning: auth.me response not detected after navigation');
  }
  
  // Wait for React to update auth state
  await page.waitForTimeout(1000);
  
  // Wait for network to settle
  await page.waitForLoadState('networkidle');
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
    // Retry with longer timeout to handle slow auth state propagation
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 }); // Increased from 10000ms

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
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 }); // Increased from 10000ms

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
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 }); // Increased from 10000ms

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
