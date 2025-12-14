import { test, expect } from '@playwright/test';

/**
 * UNIT TESTING
 * 
 * Unit tests verify individual components or functions in isolation.
 * These tests focus on the booking availability calculation logic.
 * 
 * Purpose: Ensure that individual functions work correctly without
 * dependencies on other parts of the system.
 */

test.describe('Availability Calculator - Unit Tests', () => {
  /**
   * Test the availability calculation function directly
   * This simulates testing a JavaScript module/function
   */
  test('should calculate available time slots correctly', async ({ page }) => {
    // Navigate to a page that exposes the availability calculator
    await page.goto('/');

    // Inject the availability calculator function for testing
    await page.evaluate(() => {
      // This simulates the actual availability calculation logic
      (window as any).calculateAvailableSlots = (
        startTime: string,
        endTime: string,
        duration: number,
        bookedSlots: string[],
        bufferTime: number = 0
      ) => {
        const availableSlots: string[] = [];
        const start = new Date(`2024-01-01 ${startTime}`);
        const end = new Date(`2024-01-01 ${endTime}`);

        let current = new Date(start);
        while (current < end) {
          const timeString = current.toTimeString().slice(0, 5);
          
          // Check if slot is not booked
          if (!bookedSlots.includes(timeString)) {
            availableSlots.push(timeString);
          }

          // Move to next slot (duration + buffer)
          current = new Date(current.getTime() + (duration + bufferTime) * 60000);
        }

        return availableSlots;
      };
    });

    // Test Case 1: Basic availability calculation
    const basicSlots = await page.evaluate(() => {
      return (window as any).calculateAvailableSlots(
        '09:00',
        '17:00',
        60,
        []
      );
    });

    expect(basicSlots).toEqual([
      '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00'
    ]);

    // Test Case 2: Availability with booked slots
    const slotsWithBookings = await page.evaluate(() => {
      return (window as any).calculateAvailableSlots(
        '09:00',
        '17:00',
        60,
        ['10:00', '14:00']
      );
    });

    expect(slotsWithBookings).toEqual([
      '09:00', '11:00', '12:00', '13:00', '15:00', '16:00'
    ]);
    expect(slotsWithBookings).not.toContain('10:00');
    expect(slotsWithBookings).not.toContain('14:00');

    // Test Case 3: Availability with buffer time
    const slotsWithBuffer = await page.evaluate(() => {
      return (window as any).calculateAvailableSlots(
        '09:00',
        '13:00',
        60,
        [],
        30 // 30 minute buffer
      );
    });

    expect(slotsWithBuffer).toEqual(['09:00', '10:30', '12:00']);
  });

  test('should handle edge cases in availability calculation', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      (window as any).calculateAvailableSlots = (
        startTime: string,
        endTime: string,
        duration: number,
        bookedSlots: string[]
      ) => {
        const availableSlots: string[] = [];
        const start = new Date(`2024-01-01 ${startTime}`);
        const end = new Date(`2024-01-01 ${endTime}`);

        let current = new Date(start);
        while (current < end) {
          const timeString = current.toTimeString().slice(0, 5);
          if (!bookedSlots.includes(timeString)) {
            availableSlots.push(timeString);
          }
          current = new Date(current.getTime() + duration * 60000);
        }

        return availableSlots;
      };
    });

    // Edge Case 1: Start time equals end time
    const emptySlots = await page.evaluate(() => {
      return (window as any).calculateAvailableSlots('09:00', '09:00', 60, []);
    });
    expect(emptySlots).toEqual([]);

    // Edge Case 2: All slots are booked
    const fullyBooked = await page.evaluate(() => {
      return (window as any).calculateAvailableSlots(
        '09:00',
        '12:00',
        60,
        ['09:00', '10:00', '11:00']
      );
    });
    expect(fullyBooked).toEqual([]);

    // Edge Case 3: Duration longer than available time
    const longDuration = await page.evaluate(() => {
      return (window as any).calculateAvailableSlots('09:00', '10:00', 120, []);
    });
    expect(longDuration).toEqual([]);
  });

  test('should validate booking policy rules', async ({ page }) => {
    await page.goto('/');

    // Inject booking policy validation function
    await page.evaluate(() => {
      (window as any).validateBookingPolicy = (
        bookingDate: Date,
        minimumAdvanceHours: number,
        maximumAdvanceDays: number
      ) => {
        const now = new Date();
        const minDate = new Date(now.getTime() + minimumAdvanceHours * 60 * 60 * 1000);
        const maxDate = new Date(now.getTime() + maximumAdvanceDays * 24 * 60 * 60 * 1000);

        if (bookingDate < minDate) {
          return { valid: false, reason: 'Booking is too soon' };
        }

        if (bookingDate > maxDate) {
          return { valid: false, reason: 'Booking is too far in advance' };
        }

        return { valid: true, reason: null };
      };
    });

    // Test Case 1: Valid booking within policy
    const validBooking = await page.evaluate(() => {
      const tomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000);
      return (window as any).validateBookingPolicy(tomorrow, 24, 90);
    });
    expect(validBooking.valid).toBe(true);

    // Test Case 2: Booking too soon
    const tooSoon = await page.evaluate(() => {
      const soon = new Date(Date.now() + 1 * 60 * 60 * 1000);
      return (window as any).validateBookingPolicy(soon, 24, 90);
    });
    expect(tooSoon.valid).toBe(false);
    expect(tooSoon.reason).toBe('Booking is too soon');

    // Test Case 3: Booking too far in advance
    const tooFar = await page.evaluate(() => {
      const farFuture = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
      return (window as any).validateBookingPolicy(farFuture, 24, 90);
    });
    expect(tooFar.valid).toBe(false);
    expect(tooFar.reason).toBe('Booking is too far in advance');
  });

  test('should calculate booking price correctly', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      (window as any).calculateBookingPrice = (
        baseRate: number,
        duration: number,
        serviceFeePercent: number = 10
      ) => {
        const subtotal = (baseRate / 60) * duration;
        const serviceFee = subtotal * (serviceFeePercent / 100);
        const total = subtotal + serviceFee;

        return {
          subtotal: Math.round(subtotal * 100) / 100,
          serviceFee: Math.round(serviceFee * 100) / 100,
          total: Math.round(total * 100) / 100,
        };
      };
    });

    // Test Case 1: Standard pricing
    const standardPrice = await page.evaluate(() => {
      return (window as any).calculateBookingPrice(100, 60, 10);
    });
    expect(standardPrice.subtotal).toBe(100);
    expect(standardPrice.serviceFee).toBe(10);
    expect(standardPrice.total).toBe(110);

    // Test Case 2: Half-hour session
    const halfHourPrice = await page.evaluate(() => {
      return (window as any).calculateBookingPrice(100, 30, 10);
    });
    expect(halfHourPrice.subtotal).toBe(50);
    expect(halfHourPrice.serviceFee).toBe(5);
    expect(halfHourPrice.total).toBe(55);

    // Test Case 3: Two-hour session
    const twoHourPrice = await page.evaluate(() => {
      return (window as any).calculateBookingPrice(100, 120, 10);
    });
    expect(twoHourPrice.subtotal).toBe(200);
    expect(twoHourPrice.serviceFee).toBe(20);
    expect(twoHourPrice.total).toBe(220);
  });
});
