import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { testConfig } from './playwright.env';

/**
 * Authentication Setup for Playwright Tests
 * 
 * This file uses Playwright's official storageState pattern to authenticate
 * test users once and reuse the authenticated state across all tests.
 * 
 * IMPORTANT: We use page.evaluate() to make auth requests from within the
 * browser context. This ensures cookies are set for the correct domain
 * (the actual test URL, not localhost).
 */

// Auth state file paths
const authDir = path.join(__dirname, 'playwright/.auth');
export const clientAuthFile = path.join(authDir, 'client.json');
export const artistAuthFile = path.join(authDir, 'artist.json');
export const adminAuthFile = path.join(authDir, 'admin.json');

/**
 * Helper function to authenticate via test-auth endpoint
 * Uses page.evaluate() to make the request from within the browser context
 * This ensures cookies are properly set for the correct domain
 */
async function authenticateUser(page: any, openId: string, userName: string) {
  const baseUrl = testConfig.baseUrl;
  
  console.log(`🔐 Authenticating as ${userName}...`);
  console.log(`   Base URL: ${baseUrl}`);
  
  // Navigate to the base URL first to establish the browser context
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  
  // Make the auth request from within the browser context
  // This ensures the cookie is properly associated with the domain
  const authResult = await page.evaluate(async (data: { openId: string }) => {
    const response = await fetch('/api/test-auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ openId: data.openId }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      return { success: false, status: response.status, error: await response.text() };
    }
    
    return await response.json();
  }, { openId });
  
  // Verify authentication succeeded
  expect(authResult.success).toBeTruthy();
  console.log(`✅ ${userName} auth response:`, authResult.user?.name || 'Success');
  
  // Verify session cookie was set for the correct domain
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c: any) => c.name === 'app_session_id');
  
  if (!sessionCookie) {
    console.log('⚠️  Available cookies:', cookies.map((c: any) => `${c.name}@${c.domain}`));
    throw new Error('Session cookie was not set by test-auth endpoint');
  }
  
  console.log(`✅ Session cookie set for domain: ${sessionCookie.domain}`);
  
  // Reload the page to pick up the new auth state
  await page.reload({ waitUntil: 'networkidle' });
  
  // Verify the logout button is visible (confirms auth worked)
  try {
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 10000 });
    console.log(`✅ ${userName} authenticated - logout button visible`);
  } catch (e) {
    console.warn(`⚠️  Logout button not visible for ${userName}, but continuing...`);
  }
}

/**
 * Authenticate as Test Client
 */
setup('authenticate as client', async ({ page }) => {
  await authenticateUser(page, testConfig.testUsers.client.openId, 'Test Client');
  
  // Save the authenticated state (cookies + localStorage)
  await page.context().storageState({ path: clientAuthFile });
  console.log('💾 Client auth state saved to:', clientAuthFile);
});

/**
 * Authenticate as Test Artist
 */
setup('authenticate as artist', async ({ page }) => {
  await authenticateUser(page, testConfig.testUsers.artist.openId, 'Test Artist');
  
  await page.context().storageState({ path: artistAuthFile });
  console.log('💾 Artist auth state saved to:', artistAuthFile);
});

/**
 * Authenticate as Test Admin
 */
setup('authenticate as admin', async ({ page }) => {
  await authenticateUser(page, testConfig.testUsers.admin.openId, 'Test Admin');
  
  await page.context().storageState({ path: adminAuthFile });
  console.log('💾 Admin auth state saved to:', adminAuthFile);
});
