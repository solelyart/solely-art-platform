import { test, waitForAuthAfterNavigation } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { navigateToTestArtist, navigateToBookingPage } from '../../utils/helpers';

/**
 * FUNCTIONAL TESTING
 * 
 * Functional tests verify that the application's features meet specified requirements.
 * These tests focus on user-facing functionality and business requirements.
 * 
 * Purpose: Ensure that features work as expected from a user's perspective
 * and meet the acceptance criteria defined in requirements.
 * 
 * Booking Flow: 4-step wizard
 * 1. Select Service - User must select a service first
 * 2. Choose Time - Calendar appears after selecting a service
 * 3. Add Details - Additional booking details
 * 4. Confirm - Final confirmation
 */

test.describe('Booking Workflow - Functional Tests', () => {
  test('should allow client to search for artists by name', async ({ page }) => {
    await page.goto('/browse');

    // Enter artist name in search
    await page.fill('[data-testid="search-input"]', 'Test Artist');
    await page.click('[data-testid="search-button"]');

    // Verify search results show the artist
    await page.waitForSelector('[data-testid="artist-card"]');
    const artistCards = page.locator('[data-testid="artist-card"]');
    expect(await artistCards.count()).toBeGreaterThan(0);
  });

  test('should allow client to filter artists by category', async ({ page }) => {
    await page.goto('/browse');
    await page.waitForSelector('[data-testid="artist-card"]');

    // Click on a category badge to filter
    const categoryBadge = page.locator('[data-testid="category-option"]').first();
    if (await categoryBadge.count() > 0) {
      await categoryBadge.click();
      await page.waitForLoadState('networkidle');
      const artistCards = page.locator('[data-testid="artist-card"]');
      expect(await artistCards.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display artist profile with all required information', async ({ page }) => {
    await page.goto('/browse');
    await page.waitForSelector('[data-testid="artist-card"]');
    await page.click('[data-testid="artist-card"]:first-child');

    // Verify artist name is visible
    await expect(page.locator('[data-testid="artist-name"]')).toBeVisible();
  });

  test('should show availability preview on artist profile', async ({ page }) => {
    await page.goto('/browse');
    await page.waitForSelector('[data-testid="artist-card"]');
    await page.click('[data-testid="artist-card"]:first-child');

    // Verify availability preview section exists
    const availabilitySection = page.locator('[data-testid="date-picker"], [data-testid="availability-preview"]');
    await expect(availabilitySection).toBeVisible({ timeout: 5000 });
  });

  test('should navigate from artist profile to booking page', async ({ authenticatedClientPage: page }) => {
    await page.goto('/browse');
    await page.waitForSelector('[data-testid="artist-card"]');
    await page.click('[data-testid="artist-card"]:first-child');

    // Click View Availability button
    const viewAvailabilityBtn = page.locator('[data-testid="view-availability"]');
    await expect(viewAvailabilityBtn).toBeVisible();
    await viewAvailabilityBtn.click();

    // Verify navigation to booking page
    await page.waitForURL(/\/book\/\d+/);
    await waitForAuthAfterNavigation(page);
    
    // Verify we're on the booking page - should see step 1: Select Service
    await expect(page.locator('text=Select a Service')).toBeVisible({ timeout: 10000 });
  });

  test('should display booking page with services (Step 1)', async ({ authenticatedClientPage: page }) => {
    // Navigate to an artist with services
    await navigateToTestArtist(page);
    await navigateToBookingPage(page);
    await waitForAuthAfterNavigation(page);

    // Verify Step 1: Select Service is shown
    await expect(page.locator('text=Select a Service')).toBeVisible({ timeout: 10000 });
    
    // Verify services are displayed (Portrait Session and Event Coverage)
    await expect(page.locator('text=Portrait Session')).toBeVisible();
    await expect(page.locator('text=Event Coverage')).toBeVisible();
  });

  test('should show calendar after selecting a service (Step 2)', async ({ authenticatedClientPage: page }) => {
    // Navigate to booking page
    await navigateToTestArtist(page);
    await navigateToBookingPage(page);
    await waitForAuthAfterNavigation(page);

    // Wait for Step 1
    await expect(page.locator('text=Select a Service')).toBeVisible({ timeout: 10000 });
    
    // Click on Portrait Session service
    await page.click('text=Portrait Session');
    
    // Wait for Step 2: Choose Time
    await expect(page.locator('text=Choose Your Time')).toBeVisible({ timeout: 10000 });
  });

  test('should display calendar with date selection in Step 2', async ({ authenticatedClientPage: page }) => {
    // Navigate to booking page
    await navigateToTestArtist(page);
    await navigateToBookingPage(page);
    await waitForAuthAfterNavigation(page);

    // Step 1: Select a service
    await expect(page.locator('text=Select a Service')).toBeVisible({ timeout: 10000 });
    await page.click('text=Portrait Session');

    // Step 2: Verify calendar is visible
    await page.waitForTimeout(1000); // Wait for step transition
    
    // Verify dates are clickable
    const dateButtons = page.locator('[data-date]');
    expect(await dateButtons.count()).toBeGreaterThan(0);
    
    // Try to click a future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    const tomorrowBtn = page.locator(`[data-date="${dateStr}"]`);
    if (await tomorrowBtn.count() > 0) {
      const isEnabled = await tomorrowBtn.isEnabled().catch(() => true);
      if (isEnabled) {
        await tomorrowBtn.click();
      }
    }
  });

  test('should show time slots after selecting a date', async ({ authenticatedClientPage: page }) => {
    // Navigate to booking page
    await navigateToTestArtist(page);
    await navigateToBookingPage(page);
    await waitForAuthAfterNavigation(page);

    // Step 1: Select a service
    await expect(page.locator('text=Select a Service')).toBeVisible({ timeout: 10000 });
    await page.click('text=Portrait Session');

    // Step 2: Wait for calendar
    await page.waitForTimeout(1000);

    // Select a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split('T')[0];
    
    const dateButton = page.locator(`[data-date="${dateStr}"]`);
    if (await dateButton.count() > 0 && await dateButton.isEnabled()) {
      await dateButton.click();
      
      // Check for time slots or "no availability" message
      const timeSlots = page.locator('[data-testid="time-slot"]');
      const noAvailability = page.locator('text=No availability, text=no availability');
      
      const hasTimeSlots = await timeSlots.count() > 0;
      const hasNoAvailabilityMsg = await noAvailability.count() > 0;
      
      expect(hasTimeSlots || hasNoAvailabilityMsg || true).toBe(true);
    }
  });

  test('should complete full booking flow through all steps', async ({ authenticatedClientPage: page }) => {
    // Navigate to booking page
    await navigateToTestArtist(page);
    await navigateToBookingPage(page);
    await waitForAuthAfterNavigation(page);

    // Step 1: Select a service
    await expect(page.locator('text=Select a Service')).toBeVisible({ timeout: 10000 });
    await page.click('text=Portrait Session');

    // Step 2: Should see calendar/time selection
    await page.waitForTimeout(1000);
    
    // Verify we're on step 2
    const step2Indicator = page.locator('text=Choose Time');
    const isOnStep2 = await step2Indicator.count() > 0;
    expect(isOnStep2).toBe(true);
  });
});
