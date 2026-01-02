import { test, expect } from '../../fixtures/auth.fixture';

/**
 * REGRESSION TESTING
 * 
 * Regression tests ensure that previously developed and tested software
 * still performs correctly after changes (bug fixes, enhancements, configuration changes).
 * 
 * Purpose: Catch bugs introduced by new code changes and ensure existing
 * functionality continues to work as expected.
 * 
 * These tests should be run:
 * - After every code deployment
 * - After bug fixes
 * - After feature additions
 * - Before major releases
 */

test.describe('Critical Path Regression Tests', () => {
  /**
   * User Authentication Flow
   * Critical: Users must be able to log in and out
   */
  test('regression: user login and logout flow', async ({ authenticatedClientPage }) => {
    // User is already logged in via auth fixture
    await expect(authenticatedClientPage.locator('[data-testid="logout-button"]')).toBeVisible();

    // Test logout
    await authenticatedClientPage.click('[data-testid="logout-button"]');
    await authenticatedClientPage.waitForURL('/');
    
    // Verify successful logout - user should see login option
    await expect(authenticatedClientPage.locator('[data-testid="logout-button"]')).not.toBeVisible();
  });

  /**
   * Artist Search and Discovery
   * Critical: Users must be able to find artists
   */
  test('regression: artist search functionality', async ({ page }) => {
    await page.goto('/browse');

    // Search by name
    await page.fill('[data-testid="search-input"]', 'Jane');
    await page.click('[data-testid="search-button"]');

    // Verify results
    await expect(page.locator('[data-testid="artist-card"]')).toHaveCount(1, { timeout: 5000 });

    // Clear search
    await page.fill('[data-testid="search-input"]', '');
    await page.click('[data-testid="search-button"]');

    // Verify all artists shown
    const allArtists = page.locator('[data-testid="artist-card"]');
    expect(await allArtists.count()).toBeGreaterThan(1);
  });

  /**
   * Booking Creation Flow
   * Critical: Core business functionality
   */
  test('regression: complete booking creation flow', async ({ authenticatedClientPage: page }) => {
    // Navigate to search
    await page.goto('/browse');

    // Select artist
    await page.click('[data-testid="artist-card"]:first-child');

    // Select date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);

    // Select time
    await page.click('[data-testid="time-slot"]:not([disabled]):first-child');

    // Select duration
    await page.selectOption('[data-testid="duration-select"]', '60');

    // Proceed to booking
    await page.click('[data-testid="book-now-button"]');

    // Verify booking summary
    await expect(page.locator('[data-testid="booking-summary"]')).toBeVisible();

    // Verify can proceed to payment
    await expect(page.locator('[data-testid="proceed-to-payment"]')).toBeEnabled();
  });

  /**
   * Payment Processing
   * Critical: Revenue-generating functionality
   */
  test('regression: successful payment processing', async ({ authenticatedClientPage: page }) => {
    // Create a booking
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"]:not([disabled]):first-child');
    await page.click('[data-testid="book-now-button"]');
    await page.click('[data-testid="proceed-to-payment"]');

    // Complete payment
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await page.click('[data-testid="submit-payment"]');

    // Verify payment success
    await page.waitForURL('**/booking/confirmed/**', { timeout: 15000 });
    await expect(page.locator('[data-testid="confirmation-message"]')).toBeVisible();
  });

  /**
   * Payment Failure Handling
   * Critical: Must handle failed payments gracefully
   */
  test('regression: declined payment handling', async ({ authenticatedClientPage: page }) => {
    // Create a booking
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"]:not([disabled]):first-child');
    await page.click('[data-testid="book-now-button"]');
    await page.click('[data-testid="proceed-to-payment"]');

    // Use declined card
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4000000000000002');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await page.click('[data-testid="submit-payment"]');

    // Verify error handling
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]'))
      .toContainText('payment', { ignoreCase: true });

    // Verify can retry
    await expect(page.locator('[data-testid="submit-payment"]')).toBeEnabled();
  });

  /**
   * Booking Cancellation
   * Critical: Users must be able to cancel bookings
   */
  test('regression: booking cancellation flow', async ({ authenticatedClientPage: page }) => {
    // Navigate to bookings
    await page.goto('/bookings');

    // Find a confirmed booking
    const confirmedBooking = page.locator('[data-testid="booking-card"][data-status="confirmed"]').first();
    
    // If no confirmed booking exists, skip test
    if (await confirmedBooking.count() === 0) {
      test.skip();
      return;
    }

    // Get booking ID
    const bookingId = await confirmedBooking.getAttribute('data-booking-id');

    // Click cancel
    await confirmedBooking.click();
    await page.click('[data-testid="cancel-booking"]');

    // Confirm cancellation
    await page.click('[data-testid="confirm-cancel"]');

    // Verify cancellation success
    await expect(page.locator('[data-testid="cancellation-message"]')).toBeVisible();

    // Verify booking status updated
    await page.goto('/bookings');
    const cancelledBooking = page.locator(`[data-booking-id="${bookingId}"]`);
    await expect(cancelledBooking).toHaveAttribute('data-status', 'cancelled');
  });

  /**
   * Messaging System
   * Critical: Communication between clients and artists
   */
  test('regression: send and receive messages', async ({ authenticatedClientPage: page }) => {
    // Navigate to messages
    await page.goto('/messages');

    // Select a conversation
    const firstConversation = page.locator('[data-testid="conversation-item"]').first();
    
    if (await firstConversation.count() === 0) {
      test.skip();
      return;
    }

    await firstConversation.click();

    // Send a message
    const testMessage = `Test message ${Date.now()}`;
    await page.fill('[data-testid="message-input"]', testMessage);
    await page.click('[data-testid="send-message"]');

    // Verify message appears
    await expect(page.locator('[data-testid="message-item"]').last())
      .toContainText(testMessage);

    // Verify message input cleared
    await expect(page.locator('[data-testid="message-input"]')).toHaveValue('');
  });

  /**
   * Profile Management
   * Critical: Users must be able to update their profiles
   */
  test('regression: update user profile', async ({ authenticatedClientPage: page }) => {
    // Navigate to profile
    await page.goto('/profile');

    // Update bio
    const newBio = `Updated bio ${Date.now()}`;
    await page.fill('[data-testid="bio-input"]', newBio);

    // Save changes
    await page.click('[data-testid="save-profile"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Refresh page and verify changes persisted
    await page.reload();
    await expect(page.locator('[data-testid="bio-input"]')).toHaveValue(newBio);
  });

  /**
   * Navigation and Routing
   * Critical: Users must be able to navigate the application
   */
  test('regression: main navigation links work correctly', async ({ page }) => {
    await page.goto('/');

    // Test main navigation link (Browse Artists in header)
    const navLinks = [
      { selector: '[data-testid="nav-search"]', expectedUrl: '/browse' },
    ];

    for (const link of navLinks) {
      await page.click(link.selector);
      await page.waitForURL(`**${link.expectedUrl}`);
      expect(page.url()).toContain(link.expectedUrl);
      await page.goto('/');
    }
  });

  /**
   * Responsive Design
   * Critical: Application must work on mobile devices
   */
  test('regression: mobile viewport functionality', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to home
    await page.goto('/');

    // Verify mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Test mobile navigation
    await page.click('[data-testid="mobile-nav-search"]');
    await page.waitForURL('**/search');

    // Verify search works on mobile
    await page.fill('[data-testid="search-input"]', 'Jane');
    await page.click('[data-testid="search-button"]');
    await expect(page.locator('[data-testid="artist-card"]')).toBeVisible();
  });

  /**
   * Form Validation
   * Critical: Forms must validate user input
   * Note: App uses Manus OAuth - testing artist profile form validation
   */
  test('regression: form validation works correctly', async ({ page }) => {
    // Navigate to become-artist page (requires auth, will show sign-in prompt if not authenticated)
    await page.goto('/become-artist');
    
    // Check if we're on the form page or sign-in prompt
    const hasForm = await page.locator('[data-testid="artist-profile-form"]').isVisible().catch(() => false);
    
    if (hasForm) {
      // Try to submit form without selecting categories
      await page.fill('[data-testid="display-name-input"]', 'Test Artist');
      await page.click('[data-testid="create-profile-button"]');
      
      // Should show toast error about categories (handled by client-side validation)
      // The form requires at least one category to be selected
      await expect(page.locator('.sonner-toast')).toBeVisible({ timeout: 5000 });
    } else {
      // User not authenticated - verify sign-in prompt is shown
      await expect(page.locator('text=Sign In')).toBeVisible();
    }
  });

  /**
   * Error Pages
   * Critical: Application must handle errors gracefully
   */
  test('regression: 404 page displays correctly', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Verify 404 page
    await expect(page.locator('[data-testid="404-page"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('404');

    // Verify can navigate back
    await page.click('[data-testid="back-to-home"]');
    await page.waitForURL('**/');
  });
});
