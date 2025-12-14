import { test, expect } from '@playwright/test';
import { waitForAPIResponse } from '../../utils/helpers';

/**
 * INTEGRATION TESTING
 * 
 * Integration tests verify that different modules or services work together correctly.
 * These tests focus on the interaction between booking engine, payment system, and database.
 * 
 * Purpose: Ensure that components integrate properly and data flows correctly
 * between different parts of the system.
 */

test.describe('Booking and Payment Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should integrate booking creation with database', async ({ page }) => {
    // Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Create a booking
    await page.goto('/search');
    await page.fill('[data-testid="search-input"]', 'Jane Doe');
    await page.click('[data-testid="search-button"]');

    // Select artist
    await page.click('[data-testid="artist-card"]');

    // Select date and time
    await page.click('[data-testid="date-picker"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="10:00"]');

    // Proceed to booking
    await page.click('[data-testid="book-now-button"]');

    // Wait for booking creation API call
    const bookingResponse = await waitForAPIResponse(page, '/api/bookings', 201);
    const bookingData = await bookingResponse.json();

    // Verify booking was created in database
    expect(bookingData).toHaveProperty('id');
    expect(bookingData).toHaveProperty('status', 'pending');
    expect(bookingData).toHaveProperty('clientId');
    expect(bookingData).toHaveProperty('artistId');

    // Verify booking appears in UI
    await page.goto('/bookings');
    await expect(page.locator(`[data-booking-id="${bookingData.id}"]`)).toBeVisible();
  });

  test('should integrate booking with payment processing', async ({ page }) => {
    // Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Create a booking
    await page.goto('/search');
    await page.click('[data-testid="artist-card"]:first-child');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="14:00"]');
    await page.click('[data-testid="book-now-button"]');

    // Wait for booking creation
    const bookingResponse = await waitForAPIResponse(page, '/api/bookings', 201);
    const bookingData = await bookingResponse.json();

    // Proceed to payment
    await page.click('[data-testid="proceed-to-payment"]');

    // Fill payment details
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await stripeFrame.locator('input[name="postal"]').fill('12345');

    // Submit payment
    await page.click('[data-testid="submit-payment"]');

    // Wait for payment processing
    const paymentResponse = await waitForAPIResponse(page, '/api/payments', 200);
    const paymentData = await paymentResponse.json();

    // Verify payment integration
    expect(paymentData).toHaveProperty('status', 'succeeded');
    expect(paymentData).toHaveProperty('bookingId', bookingData.id);
    expect(paymentData).toHaveProperty('stripePaymentIntentId');

    // Verify booking status updated
    const updatedBookingResponse = await page.request.get(
      `${process.env.API_URL}/bookings/${bookingData.id}`
    );
    const updatedBooking = await updatedBookingResponse.json();
    expect(updatedBooking.status).toBe('confirmed');
    expect(updatedBooking.paymentStatus).toBe('paid');
  });

  test('should integrate booking cancellation with refund processing', async ({ page }) => {
    // Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');

    // Navigate to bookings
    await page.goto('/bookings');

    // Select a confirmed booking
    await page.click('[data-testid="booking-card"][data-status="confirmed"]:first-child');

    // Click cancel button
    await page.click('[data-testid="cancel-booking"]');

    // Confirm cancellation
    await page.click('[data-testid="confirm-cancel"]');

    // Wait for cancellation API call
    const cancelResponse = await waitForAPIResponse(page, '/api/bookings/*/cancel', 200);
    const cancelData = await cancelResponse.json();

    // Verify cancellation triggered refund
    expect(cancelData).toHaveProperty('status', 'cancelled');
    expect(cancelData).toHaveProperty('refundStatus', 'processing');

    // Wait for refund webhook
    await page.waitForTimeout(2000);

    // Verify refund was processed
    const refundResponse = await page.request.get(
      `${process.env.API_URL}/payments/${cancelData.paymentId}/refund`
    );
    const refundData = await refundResponse.json();
    expect(refundData.status).toBe('succeeded');
  });

  test('should integrate availability check with booking creation', async ({ page }) => {
    // Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');

    // Search for artist
    await page.goto('/search');
    await page.click('[data-testid="artist-card"]:first-child');

    // Select a date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);

    // Wait for availability check
    const availabilityResponse = await waitForAPIResponse(page, '/api/availability', 200);
    const availabilityData = await availabilityResponse.json();

    // Verify available slots are returned
    expect(availabilityData).toHaveProperty('availableSlots');
    expect(Array.isArray(availabilityData.availableSlots)).toBe(true);
    expect(availabilityData.availableSlots.length).toBeGreaterThan(0);

    // Select first available slot
    const firstSlot = availabilityData.availableSlots[0];
    await page.click(`[data-testid="time-slot"][data-time="${firstSlot}"]`);

    // Attempt to book
    await page.click('[data-testid="book-now-button"]');

    // Verify booking creation validates availability
    const bookingResponse = await waitForAPIResponse(page, '/api/bookings', 201);
    const bookingData = await bookingResponse.json();

    expect(bookingData.startTime).toBe(firstSlot);
    expect(bookingData.status).toBe('pending');
  });

  test('should handle concurrent booking attempts (race condition)', async ({ page, context }) => {
    // Create two browser contexts (simulating two users)
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Login both users
    for (const p of [page1, page2]) {
      await p.goto('/login');
      await p.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
      await p.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
      await p.click('button[type="submit"]');
      await p.waitForURL('**/dashboard');
    }

    // Both users navigate to same artist
    const artistUrl = '/artist/jane-doe';
    await page1.goto(artistUrl);
    await page2.goto(artistUrl);

    // Both select same date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const targetTime = '15:00';

    for (const p of [page1, page2]) {
      await p.click('[data-testid="date-picker"]');
      await p.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
      await p.click(`[data-testid="time-slot"][data-time="${targetTime}"]`);
    }

    // Both attempt to book simultaneously
    const [response1, response2] = await Promise.all([
      page1.click('[data-testid="book-now-button"]').then(() => 
        waitForAPIResponse(page1, '/api/bookings', null)
      ),
      page2.click('[data-testid="book-now-button"]').then(() => 
        waitForAPIResponse(page2, '/api/bookings', null)
      ),
    ]);

    // Verify only one booking succeeded
    const status1 = response1.status();
    const status2 = response2.status();

    // One should succeed (201), one should fail (409 Conflict)
    const statuses = [status1, status2].sort();
    expect(statuses).toEqual([201, 409]);

    // Verify error message for failed booking
    const failedPage = status1 === 409 ? page1 : page2;
    await expect(failedPage.locator('[data-testid="error-message"]'))
      .toContainText('This time slot is no longer available');
  });

  test('should integrate messaging with booking confirmation', async ({ page }) => {
    // Login as client
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CLIENT_EMAIL || '');
    await page.fill('input[name="password"]', process.env.TEST_CLIENT_PASSWORD || '');
    await page.click('button[type="submit"]');

    // Create and confirm a booking
    await page.goto('/search');
    await page.click('[data-testid="artist-card"]:first-child');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('[data-testid="date-picker"]');
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('[data-testid="time-slot"][data-time="11:00"]');
    await page.click('[data-testid="book-now-button"]');

    // Complete payment
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('input[name="exp-date"]').fill('12/25');
    await stripeFrame.locator('input[name="cvc"]').fill('123');
    await page.click('[data-testid="submit-payment"]');

    // Wait for confirmation
    await page.waitForURL('**/booking/confirmed/**');

    // Verify messaging connection was created
    const messagingResponse = await page.request.get(
      `${process.env.API_URL}/messages/connections`
    );
    const connections = await messagingResponse.json();

    // Find connection with artist
    const artistConnection = connections.find((c: any) => 
      c.type === 'booking' && c.status === 'active'
    );

    expect(artistConnection).toBeDefined();
    expect(artistConnection).toHaveProperty('artistId');
    expect(artistConnection).toHaveProperty('clientId');

    // Verify can send message
    await page.goto('/messages');
    await page.click(`[data-connection-id="${artistConnection.id}"]`);
    await page.fill('[data-testid="message-input"]', 'Looking forward to our session!');
    await page.click('[data-testid="send-message"]');

    // Verify message was sent
    await expect(page.locator('[data-testid="message-item"]').last())
      .toContainText('Looking forward to our session!');
  });
});
