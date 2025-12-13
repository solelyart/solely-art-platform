import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Booking Calendar Integration", () => {
  let testArtistId: number;

  beforeAll(async () => {
    // Use existing sample artist with seeded availability
    testArtistId = 1; // Elena Martinez - has Mon-Fri 10am-6pm EST availability
  });

  describe("Calendar Data Retrieval", () => {
    it("should retrieve availability windows for artist with seeded data", async () => {
      const windows = await db.getAvailabilityWindowsByArtistId(testArtistId);
      
      expect(windows.length).toBeGreaterThan(0);
      expect(windows[0]).toHaveProperty('dayOfWeek');
      expect(windows[0]).toHaveProperty('startTime');
      expect(windows[0]).toHaveProperty('endTime');
      expect(windows[0]).toHaveProperty('timezone');
    });

    it("should retrieve artist settings for calendar configuration", async () => {
      const settings = await db.getArtistSettings(testArtistId);
      
      expect(settings).toBeDefined();
      expect(settings).toHaveProperty('bookingBufferMinutes');
      expect(settings).toHaveProperty('advanceBookingDays');
      expect(settings).toHaveProperty('cancellationPolicy');
    });

    it("should calculate available slots for a future date range", async () => {
      // Get a Monday 2 weeks from now
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      
      // Find next Monday
      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        dateStr,
        dateStr,
        60 // 1 hour session
      );

      // Elena has Mon-Fri 10am-6pm, so should have slots
      expect(slots.length).toBeGreaterThan(0);
      
      // Verify slot structure
      if (slots.length > 0) {
        expect(slots[0].date).toBe(dateStr);
        expect(slots[0].startTime).toMatch(/^\d{2}:\d{2}$/);
        expect(slots[0].endTime).toMatch(/^\d{2}:\d{2}$/);
        expect(slots[0].timezone).toBe("America/New_York");
      }
    });

    it("should return no slots for dates without availability windows", async () => {
      // Get a Saturday (Elena doesn't work weekends - works Mon-Fri only)
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      
      // Find next Saturday
      while (futureDate.getDay() !== 6) {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        dateStr,
        dateStr,
        60
      );

      // Saturday should have no slots as Elena only works Mon-Fri
      expect(slots.length).toBe(0);
    });
  });

  describe("Slot Availability Checking", () => {
    it("should correctly identify available slots", async () => {
      // Get a Monday 2 weeks from now at 2pm
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      
      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const isAvailable = await db.isSlotAvailable(
        testArtistId,
        dateStr,
        "14:00",
        60
      );

      // 2pm on a Monday should be available for Elena (works 10am-6pm)
      expect(isAvailable).toBe(true);
    });

    it("should correctly identify unavailable slots outside working hours", async () => {
      // Get a Monday 2 weeks from now at 8am (before 10am start)
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      
      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const isAvailable = await db.isSlotAvailable(
        testArtistId,
        dateStr,
        "08:00",
        60
      );

      // 8am is before Elena's 10am start time
      expect(isAvailable).toBe(false);
    });
  });

  describe("Multi-day Range Queries", () => {
    it("should calculate slots across multiple days", async () => {
      // Get next week's Monday-Friday
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() + 7);
      
      // Find next Monday
      while (startDate.getDay() !== 1) {
        startDate.setDate(startDate.getDate() + 1);
      }
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 4); // +4 days = Friday
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        startDateStr,
        endDateStr,
        60
      );

      // Should have slots for 5 days (Mon-Fri)
      expect(slots.length).toBeGreaterThan(0);
      
      // Verify we have slots from multiple days (at least 4 weekdays)
      const uniqueDates = new Set(slots.map(slot => slot.date));
      expect(uniqueDates.size).toBeGreaterThanOrEqual(4);
    });

    it("should respect advance booking days limit", async () => {
      // Get artist settings to check advance booking limit
      const settings = await db.getArtistSettings(testArtistId);
      const advanceDays = settings?.advanceBookingDays || 60;
      
      // Try to book beyond the advance booking limit
      const today = new Date();
      const tooFarDate = new Date(today);
      tooFarDate.setDate(tooFarDate.getDate() + advanceDays + 10);
      
      const dateStr = tooFarDate.toISOString().split('T')[0];
      
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        dateStr,
        dateStr,
        60
      );

      // Should return no slots beyond advance booking limit
      expect(slots.length).toBe(0);
    });
  });

  describe("Slot Duration Handling", () => {
    it("should calculate slots for different durations", async () => {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      
      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const dateStr = futureDate.toISOString().split('T')[0];
      
      // Get slots for 30-minute sessions
      const slots30 = await db.calculateAvailableSlots(
        testArtistId,
        dateStr,
        dateStr,
        30
      );

      // Get slots for 2-hour sessions
      const slots120 = await db.calculateAvailableSlots(
        testArtistId,
        dateStr,
        dateStr,
        120
      );

      // Should have more 30-minute slots than 2-hour slots
      expect(slots30.length).toBeGreaterThan(slots120.length);
      
      // Verify duration is reflected in end times
      if (slots30.length > 0) {
        const firstSlot = slots30[0];
        const [startHour, startMin] = firstSlot.startTime.split(':').map(Number);
        const [endHour, endMin] = firstSlot.endTime.split(':').map(Number);
        const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        expect(durationMinutes).toBe(30);
      }
    });
  });

  describe("Timezone Handling", () => {
    it("should return timezone information with slots", async () => {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 14);
      
      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        dateStr,
        dateStr,
        60
      );

      expect(slots.length).toBeGreaterThan(0);
      
      // All slots should have timezone
      slots.forEach(slot => {
        expect(slot.timezone).toBeDefined();
        expect(typeof slot.timezone).toBe('string');
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid artist ID gracefully", async () => {
      const slots = await db.calculateAvailableSlots(
        99999, // Non-existent artist
        "2025-12-15",
        "2025-12-15",
        60
      );

      expect(slots).toEqual([]);
    });

    it("should handle past dates correctly", async () => {
      const pastDate = "2020-01-01";
      
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        pastDate,
        pastDate,
        60
      );

      // Past dates get adjusted to today, so may have slots if today is a workday
      // The important thing is it doesn't error
      expect(Array.isArray(slots)).toBe(true);
    });

    it("should handle invalid date range (end before start)", async () => {
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-31",
        "2025-12-01",
        60
      );

      expect(slots).toEqual([]);
    });
  });
});
