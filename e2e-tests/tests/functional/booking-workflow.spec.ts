import { test, waitForAuthAfterNavigation } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { fillForm, selectDate, selectTimeSlot } from '../../utils/helpers';

/**
 * FUNCTIONAL TESTING
 * 
 * Functional tests verify that the application's features meet specified requirements.
 * These tests focus on user-facing functionality and business requirements.
 * 
 * Purpose: Ensure that features work as expected from a user's perspective
 * and meet the acceptance criteria defined in requirements.
 */

test.describe('Booking Workflow - Functional Tests', () => {
  test('should allow client to search for artists by name', async ({ page }) => {
    await page.goto('/');

    // Click on search
    await page.click('[data-testid="search-link"]');

    // Enter artist name
    await page.fill('[data-testid="search-input"]', 'Jane Doe');
    await page.click('[data-testid="search-button"]');

    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="artist-name"]')).toContainText('Jane Doe');
  });

  test('should allow client to filter artists by category', async ({ page }) => {
    await page.goto('/browse');

    // Select category filter
    await page.click('[data-testid="category-filter"]');
    await page.click('[data-testid="category-option"][data-value="painting"]');

    // Apply filter
    await page.click('[data-testid="apply-filters"]');

    // Verify filtered results
    const artistCards = page.locator('[data-testid="artist-card"]');
    const count = await artistCards.count();

    for (let i = 0; i < count; i++) {
      const category = await artistCards.nth(i).locator('[data-testid="artist-category"]').textContent();
      expect(category).toContain('Painting');
    }
  });

  test('should display artist profile with all required information', async ({ page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Verify profile sections are visible
    await expect(page.locator('[data-testid="artist-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-bio"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-portfolio"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-pricing"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-availability"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-reviews"]')).toBeVisible();

    // Verify pricing information
    const pricing = page.locator('[data-testid="hourly-rate"]');
    await expect(pricing).toBeVisible();
    const priceText = await pricing.textContent();
    expect(priceText).toMatch(/\$\d+\/hour/);
  });

  test('should allow client to view artist availability calendar', async ({ page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Click on availability section (navigates to /book/:id)
    await page.click('[data-testid="view-availability"]');
    
    // Wait for navigation and authentication
    await page.waitForURL(/\/book\/\d+/);
    await waitForAuthAfterNavigation(page);

    // Verify calendar is displayed
    await expect(page.locator('[data-testid="availability-calendar"]')).toBeVisible();

    // Select a future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);

    // Verify time slots are displayed
    await expect(page.locator('[data-testid="time-slot"]')).toHaveCount(8, { timeout: 5000 });

    // Verify available slots are enabled
    const availableSlots = page.locator('[data-testid="time-slot"]:not([disabled])');
    expect(await availableSlots.count()).toBeGreaterThan(0);
  });

  test('should allow client to select booking duration', async ({ page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Select date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="10:00"]');

    // Verify duration options
    await expect(page.locator('[data-testid="duration-select"]')).toBeVisible();

    // Select 2-hour duration
    await page.selectOption('[data-testid="duration-select"]', '120');

    // Verify price updates based on duration
    const priceElement = page.locator('[data-testid="booking-price"]');
    const priceText = await priceElement.textContent();
    expect(priceText).toMatch(/\$\d+/);
  });

  test('should display booking summary before confirmation', async ({ authenticatedClientPage: page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Select booking details
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="14:00"]');
    await page.selectOption('[data-testid="duration-select"]', '60');

    // Proceed to booking
    await page.click('[data-testid="book-now-button"]');

    // Verify booking summary
    await expect(page.locator('[data-testid="booking-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-artist-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-date"]')).toContainText(tomorrow.toLocaleDateString());
    await expect(page.locator('[data-testid="summary-time"]')).toContainText('14:00');
    await expect(page.locator('[data-testid="summary-duration"]')).toContainText('60 minutes');
    await expect(page.locator('[data-testid="summary-subtotal"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-service-fee"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-total"]')).toBeVisible();
  });

  test('should enforce minimum advance booking time', async ({ authenticatedClientPage: page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Try to select today's date (should be disabled or show error)
    const today = new Date();
    await page.click('[data-testid="date-picker"]');
    
    const todayElement = page.locator(`[data-date="${today.toISOString().split('T')[0]}"]`);
    
    // Verify today is disabled
    await expect(todayElement).toHaveAttribute('disabled', '');
    
    // Or if clicking is allowed, verify error message
    if (await todayElement.isEnabled()) {
      await todayElement.click();
      await expect(page.locator('[data-testid="error-message"]'))
        .toContainText('Bookings must be made at least 24 hours in advance');
    }
  });

  test('should prevent double-booking of time slots', async ({ authenticatedClientPage: page }) => {
    // Book a time slot
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    
    // Note the first available time slot
    const firstSlot = await page.locator('[data-testid="time-slot"]:not([disabled])').first();
    const slotTime = await firstSlot.getAttribute('data-time');
    await firstSlot.click();

    await page.click('[data-testid="book-now-button"]');

    // Complete payment
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await page.click('[data-testid="submit-payment"]');

    // Wait for confirmation
    await page.waitForURL('**/booking/confirmed/**');

    // Try to book the same slot again
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);

    // Verify the previously booked slot is now disabled
    const bookedSlot = page.locator(`[data-testid="time-slot"][data-time="${slotTime}"]`);
    await expect(bookedSlot).toHaveAttribute('disabled', '');
  });

  test('should allow client to add special requests to booking', async ({ authenticatedClientPage: page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Select booking details
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="10:00"]');
    await page.click('[data-testid="book-now-button"]');

    // Add special requests
    await page.fill('[data-testid="special-requests"]', 'Please bring oil paints and canvas');

    // Verify character count
    const charCount = page.locator('[data-testid="char-count"]');
    await expect(charCount).toContainText('41');

    // Proceed with booking
    await page.click('[data-testid="proceed-to-payment"]');

    // Verify special requests are included in summary
    await expect(page.locator('[data-testid="summary-special-requests"]'))
      .toContainText('Please bring oil paints and canvas');
  });

  test('should display booking confirmation with all details', async ({ authenticatedClientPage: page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Complete booking flow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="15:00"]');
    await page.click('[data-testid="book-now-button"]');

    // Complete payment
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await page.click('[data-testid="submit-payment"]');

    // Verify confirmation page
    await page.waitForURL('**/booking/confirmed/**');
    await expect(page.locator('[data-testid="confirmation-message"]'))
      .toContainText('Booking Confirmed');

    // Verify all details are present
    await expect(page.locator('[data-testid="booking-id"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirmation-artist-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirmation-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirmation-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirmation-location"]')).toBeVisible();

    // Verify action buttons
    await expect(page.locator('[data-testid="add-to-calendar"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-artist"]')).toBeVisible();
    await expect(page.locator('[data-testid="view-booking-details"]')).toBeVisible();
  });
});
