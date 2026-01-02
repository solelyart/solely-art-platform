import { test as base, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * Authentication Fixture for Playwright Tests
 * 
 * This fixture leverages Playwright's official storageState pattern.
 * Authentication is handled by the setup project (auth.setup.ts) which runs
 * before any tests and saves authenticated state to JSON files.
 * 
 * Tests using this fixture will automatically have access to authenticated pages
 * based on the storageState configured in playwright.config.ts.
 * 
 * For role-specific tests:
 * - Client tests: Use default 'chromium' project (storageState: client.json)
 * - Artist tests: Use 'chromium-artist' project (storageState: artist.json)
 * - Admin tests: Use 'chromium-admin' project (storageState: admin.json)
 * - Unauthenticated tests: Use 'chromium-no-auth' project (no storageState)
 */

// Auth state file paths (same as in auth.setup.ts and playwright.config.ts)
const authDir = path.join(__dirname, '../playwright/.auth');
export const clientAuthFile = path.join(authDir, 'client.json');
export const artistAuthFile = path.join(authDir, 'artist.json');
export const adminAuthFile = path.join(authDir, 'admin.json');

type AuthFixtures = {
  authenticatedClientPage: Page;
  authenticatedArtistPage: Page;
  authenticatedAdminPage: Page;
};

/**
 * Wait for authentication to complete after navigating to a new page
 * Use this after clicking links that navigate to protected pages
 */
export async function waitForAuthAfterNavigation(page: Page) {
  // Verify the cookie is still present
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'app_session_id');
  
  if (!sessionCookie) {
    console.warn('⚠️  Session cookie not found after navigation!');
  } else {
    console.log('✅ Session cookie present after navigation');
  }
  
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
  await page.waitForTimeout(500);
  
  // Wait for network to settle
  await page.waitForLoadState('networkidle');
}

/**
 * Verify that the page is authenticated
 * Checks for the presence of the logout button
 */
export async function verifyAuthenticated(page: Page, timeout = 10000) {
  await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout });
}

/**
 * Verify that the page is NOT authenticated
 * Checks for the presence of the login button
 */
export async function verifyNotAuthenticated(page: Page, timeout = 10000) {
  await expect(page.locator('[data-testid="login-button"], a[href*="login"]')).toBeVisible({ timeout });
}

export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated Client Page
   * 
   * With the storageState pattern, the page is already authenticated
   * when the test starts. This fixture just provides a convenient alias
   * and verifies authentication.
   */
  authenticatedClientPage: async ({ page }, use) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify authentication by checking for logout button
    await verifyAuthenticated(page, 15000);
    console.log('✅ Client authenticated via storageState');

    // Use the authenticated page
    await use(page);
  },

  /**
   * Authenticated Artist Page
   * 
   * Note: For artist-specific tests, use the 'chromium-artist' project
   * which has artistAuthFile as storageState. This fixture is for
   * backward compatibility.
   */
  authenticatedArtistPage: async ({ page }, use) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify authentication
    await verifyAuthenticated(page, 15000);
    console.log('✅ Artist authenticated via storageState');

    // Use the authenticated page
    await use(page);
  },

  /**
   * Authenticated Admin Page
   * 
   * Note: For admin-specific tests, use the 'chromium-admin' project
   * which has adminAuthFile as storageState. This fixture is for
   * backward compatibility.
   */
  authenticatedAdminPage: async ({ page }, use) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify authentication
    await verifyAuthenticated(page, 15000);
    console.log('✅ Admin authenticated via storageState');

    // Use the authenticated page
    await use(page);
  },
});

export { expect };
