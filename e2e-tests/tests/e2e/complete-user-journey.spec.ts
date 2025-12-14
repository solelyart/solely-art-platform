import { test, expect } from '@playwright/test';
import { generateTestData } from '../../utils/helpers';

/**
 * END-TO-END TESTING
 * 
 * End-to-end tests simulate complete user workflows from beginning to end,
 * testing the entire application stack including frontend, backend, database,
 * and external integrations.
 * 
 * Purpose: Validate that the system works as a whole and that all components
 * integrate correctly to deliver the expected user experience.
 * 
 * These tests represent real user scenarios and business workflows.
 */

test.describe('Complete User Journey - End-to-End Tests', () => {
  test('E2E: New client signs up, books artist, completes payment, and communicates', async ({ page, context }) => {
    /**
     * This test simulates a complete user journey:
     * 1. New user discovers the platform
     * 2. Signs up for an account
     * 3. Searches for an artist
     * 4. Books a session
     * 5. Completes payment
     * 6. Receives confirmation
     * 7. Sends a message to the artist
     */

    const testData = generateTestData();

    // Step 1: Discover the platform
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Solely Art', { ignoreCase: true });

    // Step 2: Sign up for an account
    await page.click('[data-testid="signup-button"]');
    await page.fill('input[name="firstName"]', testData.firstName);
    await page.fill('input[name="lastName"]', testData.lastName);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="password"]', testData.password);
    await page.fill('input[name="confirmPassword"]', testData.password);
    await page.check('input[name="agreeToTerms"]');
    await page.click('[data-testid="submit-signup"]');

    // Verify account created and logged in
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText(testData.firstName);

    // Step 3: Search for an artist
    await page.click('[data-testid="nav-search"]');
    await page.fill('[data-testid="search-input"]', 'Jane Doe');
    await page.click('[data-testid="search-button"]');

    // Verify search results
    await expect(page.locator('[data-testid="artist-card"]')).toHaveCount(1, { timeout: 5000 });

    // Step 4: View artist profile and book a session
    await page.click('[data-testid="artist-card"]');
    await page.waitForURL('**/artist/**');

    // Review artist details
    await expect(page.locator('[data-testid="artist-name"]')).toContainText('Jane Doe');
    await expect(page.locator('[data-testid="artist-bio"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-portfolio"]')).toBeVisible();

    // Select date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);

    // Wait for availability to load
    await page.waitForSelector('[data-testid="time-slot"]', { timeout: 5000 });

    // Select first available time slot
    await page.click('[data-testid="time-slot"]:not([disabled]):first-child');

    // Select duration
    await page.selectOption('[data-testid="duration-select"]', '60');

    // Add special requests
    await page.fill('[data-testid="special-requests"]', 'First time booking, looking forward to it!');

    // Proceed to booking
    await page.click('[data-testid="book-now-button"]');

    // Step 5: Review booking summary
    await expect(page.locator('[data-testid="booking-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="summary-artist-name"]')).toContainText('Jane Doe');
    await expect(page.locator('[data-testid="summary-special-requests"]'))
      .toContainText('First time booking');

    // Verify pricing
    const subtotal = await page.locator('[data-testid="summary-subtotal"]').textContent();
    const serviceFee = await page.locator('[data-testid="summary-service-fee"]').textContent();
    const total = await page.locator('[data-testid="summary-total"]').textContent();

    expect(subtotal).toMatch(/\$\d+/);
    expect(serviceFee).toMatch(/\$\d+/);
    expect(total).toMatch(/\$\d+/);

    // Proceed to payment
    await page.click('[data-testid="proceed-to-payment"]');

    // Step 6: Complete payment
    await expect(page.locator('[data-testid="payment-form"]')).toBeVisible();

    // Fill Stripe payment details
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await stripeFrame.locator('input[name="postal"]').fill('12345');

    // Submit payment
    await page.click('[data-testid="submit-payment"]');

    // Step 7: Receive confirmation
    await page.waitForURL('**/booking/confirmed/**', { timeout: 15000 });
    await expect(page.locator('[data-testid="confirmation-message"]'))
      .toContainText('Booking Confirmed');

    // Verify booking details on confirmation page
    await expect(page.locator('[data-testid="booking-id"]')).toBeVisible();
    const bookingId = await page.locator('[data-testid="booking-id"]').textContent();
    expect(bookingId).toMatch(/^[A-Z0-9]+$/);

    await expect(page.locator('[data-testid="confirmation-artist-name"]')).toContainText('Jane Doe');
    await expect(page.locator('[data-testid="confirmation-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirmation-time"]')).toBeVisible();

    // Step 8: Send a message to the artist
    await page.click('[data-testid="message-artist"]');
    await page.waitForURL('**/messages/**');

    // Compose and send message
    const messageText = 'Hi Jane! I just booked a session with you. Looking forward to it!';
    await page.fill('[data-testid="message-input"]', messageText);
    await page.click('[data-testid="send-message"]');

    // Verify message sent
    await expect(page.locator('[data-testid="message-item"]').last())
      .toContainText(messageText);

    // Step 9: View booking in bookings list
    await page.goto('/bookings');
    await expect(page.locator(`[data-booking-id="${bookingId?.trim()}"]`)).toBeVisible();
    await expect(page.locator(`[data-booking-id="${bookingId?.trim()}"]`))
      .toHaveAttribute('data-status', 'confirmed');

    // Step 10: Verify email notification (check for confirmation element)
    // In a real scenario, you might check an email testing service
    await expect(page.locator('[data-testid="email-notification-sent"]')).toBeVisible();
  });

  test('E2E: Artist receives booking, manages schedule, and communicates with client', async ({ page }) => {
    /**
     * This test simulates an artist's workflow:
     * 1. Artist logs in
     * 2. Receives booking notification
     * 3. Views booking details
     * 4. Updates availability
     * 5. Responds to client message
     */

    // Step 1: Artist logs in
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_ARTIST_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_ARTIST_PASSWORD || '');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/artist/dashboard', { timeout: 10000 });

    // Step 2: Check for new bookings
    await expect(page.locator('[data-testid="new-bookings-badge"]')).toBeVisible();

    // Step 3: View booking details
    await page.click('[data-testid="nav-bookings"]');
    await page.click('[data-testid="booking-card"][data-status="confirmed"]:first-child');

    // Verify booking details
    await expect(page.locator('[data-testid="booking-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="client-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-duration"]')).toBeVisible();

    // Step 4: Update availability
    await page.goto('/artist/availability');
    
    // Block out a date
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    await page.click('[data-testid="calendar"]');
    await page.click(`[data-date="${nextWeek.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="block-date"]');
    await page.fill('[data-testid="block-reason"]', 'Personal day');
    await page.click('[data-testid="confirm-block"]');

    // Verify date blocked
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Availability updated');

    // Step 5: Respond to client message
    await page.goto('/messages');
    await page.click('[data-testid="conversation-item"]:first-child');

    // Read client message
    const clientMessages = page.locator('[data-testid="message-item"][data-sender="client"]');
    await expect(clientMessages.first()).toBeVisible();

    // Send response
    const responseText = 'Thank you for booking! I\'m excited to work with you. See you soon!';
    await page.fill('[data-testid="message-input"]', responseText);
    await page.click('[data-testid="send-message"]');

    // Verify message sent
    await expect(page.locator('[data-testid="message-item"]').last())
      .toContainText(responseText);
  });

  test('E2E: Client cancels booking and receives refund', async ({ page }) => {
    /**
     * This test simulates the cancellation workflow:
     * 1. Client logs in
     * 2. Views bookings
     * 3. Cancels a booking
     * 4. Receives refund confirmation
     */

    // Step 1: Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Step 2: Navigate to bookings
    await page.goto('/bookings');

    // Find a confirmed booking
    const confirmedBooking = page.locator('[data-testid="booking-card"][data-status="confirmed"]').first();
    
    if (await confirmedBooking.count() === 0) {
      test.skip();
      return;
    }

    // Get booking details before cancellation
    await confirmedBooking.click();
    const bookingId = await page.locator('[data-testid="booking-id"]').textContent();
    const artistName = await page.locator('[data-testid="booking-artist-name"]').textContent();

    // Step 3: Cancel booking
    await page.click('[data-testid="cancel-booking"]');

    // Review cancellation policy
    await expect(page.locator('[data-testid="cancellation-policy"]')).toBeVisible();
    await expect(page.locator('[data-testid="refund-amount"]')).toBeVisible();

    // Confirm cancellation
    await page.fill('[data-testid="cancellation-reason"]', 'Schedule conflict');
    await page.click('[data-testid="confirm-cancel"]');

    // Step 4: Verify cancellation and refund
    await expect(page.locator('[data-testid="cancellation-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="cancellation-success"]'))
      .toContainText('cancelled');

    await expect(page.locator('[data-testid="refund-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="refund-status"]'))
      .toContainText('processing', { ignoreCase: true });

    // Verify booking status updated in list
    await page.goto('/bookings');
    const cancelledBooking = page.locator(`[data-booking-id="${bookingId?.trim()}"]`);
    await expect(cancelledBooking).toHaveAttribute('data-status', 'cancelled');

    // Verify cancellation notification sent to artist
    await expect(page.locator('[data-testid="artist-notified"]')).toBeVisible();
  });

  test('E2E: Multi-device sync - actions on desktop reflect on mobile', async ({ page, context }) => {
    /**
     * This test verifies that the application syncs data across devices
     */

    // Create two pages (simulating desktop and mobile)
    const desktopPage = page;
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });

    // Login on both devices
    for (const p of [desktopPage, mobilePage]) {
      await p.goto('/login');
      await p.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
      await p.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
      await p.click('button[type="submit"]');
      await p.waitForURL('**/dashboard');
    }

    // Send a message from desktop
    await desktopPage.goto('/messages');
    await desktopPage.click('[data-testid="conversation-item"]:first-child');
    const testMessage = `Test sync message ${Date.now()}`;
    await desktopPage.fill('[data-testid="message-input"]', testMessage);
    await desktopPage.click('[data-testid="send-message"]');

    // Verify message appears on desktop
    await expect(desktopPage.locator('[data-testid="message-item"]').last())
      .toContainText(testMessage);

    // Check if message syncs to mobile
    await mobilePage.goto('/messages');
    await mobilePage.click('[data-testid="conversation-item"]:first-child');

    // Wait for sync
    await mobilePage.waitForTimeout(2000);

    // Verify message appears on mobile
    await expect(mobilePage.locator('[data-testid="message-item"]').last())
      .toContainText(testMessage);
  });

  test('E2E: Complete booking lifecycle from creation to completion', async ({ page }) => {
    /**
     * This test follows a booking through its entire lifecycle:
     * 1. Booking created
     * 2. Payment confirmed
     * 3. Booking confirmed
     * 4. Session completed
     * 5. Review submitted
     */

    // Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');

    // Create booking
    await page.goto('/search');
    await page.click('[data-testid="artist-card"]:first-child');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"]:not([disabled]):first-child');
    await page.click('[data-testid="book-now-button"]');

    // Complete payment
    await page.click('[data-testid="proceed-to-payment"]');
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await page.click('[data-testid="submit-payment"]');

    // Get booking ID
    await page.waitForURL('**/booking/confirmed/**');
    const bookingId = await page.locator('[data-testid="booking-id"]').textContent();

    // Simulate session completion (would normally happen after the session date)
    // For testing, we'll use an API call or admin function
    await page.goto(`/bookings/${bookingId?.trim()}`);
    
    // Mark as completed (this would normally be automatic after session time)
    await page.click('[data-testid="mark-completed"]');

    // Submit review
    await expect(page.locator('[data-testid="review-form"]')).toBeVisible();
    
    // Rate the artist
    await page.click('[data-testid="star-rating"] [data-star="5"]');
    
    // Write review
    await page.fill('[data-testid="review-text"]', 'Amazing session! Jane was very professional and talented. Highly recommend!');
    
    // Submit review
    await page.click('[data-testid="submit-review"]');

    // Verify review submitted
    await expect(page.locator('[data-testid="review-success"]')).toBeVisible();

    // Verify booking marked as completed
    await page.goto('/bookings');
    const completedBooking = page.locator(`[data-booking-id="${bookingId?.trim()}"]`);
    await expect(completedBooking).toHaveAttribute('data-status', 'completed');
  });
});
