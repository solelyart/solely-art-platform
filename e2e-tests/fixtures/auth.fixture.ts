import { test as base, expect, Page } from '@playwright/test';
import { testConfig } from '../playwright.env';

/**
 * Authentication Fixture for Manus OAuth
 * 
 * Since Solely Art uses Manus OAuth (not traditional email/password),
 * we use a test-only authentication endpoint to bypass OAuth for E2E testing.
 * 
 * This is the industry-standard approach for testing OAuth-based applications.
 * 
 * KEY FIX: We navigate to the page first, then make the auth request via
 * page.evaluate() so the cookie is properly associated with the browser context
 * and persists across navigations.
 */

type AuthFixtures = {
  authenticatedClientPage: Page;
  authenticatedArtistPage: Page;
  authenticatedAdminPage: Page;
};

/**
 * Helper function to authenticate via test-auth endpoint
 * Uses page.evaluate() to make the request from within the browser context
 * This ensures cookies are properly set and persist across navigations
 */
async function authenticateUser(page: Page, openId: string, expectedUrl?: string) {
  // First navigate to the base URL to establish the browser context
  await page.goto(testConfig.baseUrl, { waitUntil: 'domcontentloaded' });
  
  // Make the auth request from within the browser context
  // This ensures the cookie is properly associated with the domain
  const authResult = await page.evaluate(async (data) => {
    const response = await fetch('/api/test-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ openId: data.openId }),
      credentials: 'include' // Important: include cookies in the request
    });
    
    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }
    
    return await response.json();
  }, { openId });
  
  console.log('✅ Test-auth response:', JSON.stringify(authResult).substring(0, 100));

  // Verify session cookie was set
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'app_session_id');
  
  if (!sessionCookie) {
    console.log('⚠️  Available cookies:', cookies.map(c => c.name));
    throw new Error('Session cookie was not set by test-auth endpoint');
  }
  
  console.log('✅ Session cookie set:', sessionCookie.value.substring(0, 20) + '...');
  console.log('   Domain:', sessionCookie.domain);
  console.log('   Path:', sessionCookie.path);

  // Reload the page to pick up the new auth state
  await page.reload({ waitUntil: 'domcontentloaded' });
  
  // Wait for the tRPC auth.me query to complete
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
  
  // Give React extra time to update state
  await page.waitForTimeout(authResponseReceived ? 1000 : 3000);
  
  // Navigate to the expected URL if different from base
  if (expectedUrl && expectedUrl !== '/' && expectedUrl !== testConfig.baseUrl) {
    await page.goto(expectedUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Wait for authentication to complete after navigating to a new page
 * Use this after clicking links that navigate to protected pages
 */
export async function waitForAuthAfterNavigation(page: Page) {
  // First, verify the cookie is still present
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
  await page.waitForTimeout(1000);
  
  // Wait for network to settle
  await page.waitForLoadState('networkidle');
}

/**
 * Ensure cookies are set for all relevant domains
 * Call this before navigating to protected pages
 */
export async function ensureCookiesForDomain(page: Page, targetUrl: string) {
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'app_session_id');
  
  if (sessionCookie) {
    const url = new URL(targetUrl);
    
    // Check if cookie is already set for this domain
    const cookieForDomain = cookies.find(
      c => c.name === 'app_session_id' && c.domain.includes(url.hostname)
    );
    
    if (!cookieForDomain) {
      // Add cookie for the target domain
      await page.context().addCookies([{
        name: 'app_session_id',
        value: sessionCookie.value,
        domain: url.hostname,
        path: '/',
        httpOnly: true,
        secure: url.protocol === 'https:',
        sameSite: 'Lax'
      }]);
      console.log('✅ Cookie propagated to domain:', url.hostname);
    }
  }
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
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 });

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
   * Authenticated Artist Page
   * Automatically logs in as an artist before tests
   */
  authenticatedArtistPage: async ({ page }, use) => {
    // Authenticate as test artist
    await authenticateUser(page, testConfig.testUsers.artist.openId, '/');

    // Verify authentication
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 });

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
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 15000 });

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
