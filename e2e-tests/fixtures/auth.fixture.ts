import { test as base, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Authentication Fixture
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

export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated Client Page
   * Automatically logs in as a client before tests
   */
  authenticatedClientPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in client credentials
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify authentication
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
  },

  /**
   * Authenticated Artist Page
   * Automatically logs in as an artist before tests
   */
  authenticatedArtistPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in artist credentials
    await page.fill('input[name="email"]', process.env.TEST_ARTIST_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_ARTIST_PASSWORD || '');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForURL('**/artist/dashboard', { timeout: 10000 });

    // Verify authentication
    await expect(page.locator('[data-testid="artist-menu"]')).toBeVisible();

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test
    await page.click('[data-testid="artist-menu"]');
    await page.click('text=Logout');
  },

  /**
   * Authenticated Admin Page
   * Automatically logs in as an admin before tests
   */
  authenticatedAdminPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/admin/login');

    // Fill in admin credentials
    await page.fill('input[name="email"]', process.env.TEST_ADMIN_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_ADMIN_PASSWORD || '');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    // Verify authentication
    await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test
    await page.click('[data-testid="admin-menu"]');
    await page.click('text=Logout');
  },
});

export { expect };
