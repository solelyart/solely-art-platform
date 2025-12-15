import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import * as db from "./db";
import { createTestArtist } from "./test-utils";

describe("Availability System", () => {
  let testArtistId: number;
  let testClientId: number;

  beforeAll(async () => {
    // Create unique test artists for this test suite
    const artist = await createTestArtist({ displayName: "Availability Test Artist" });
    testArtistId = artist.artist.id;
    
    const client = await createTestArtist({ displayName: "Availability Test Client" });
    testClientId = client.userId;
  });

  describe("Availability Windows", () => {
    it("should create an availability window", async () => {
      await db.createAvailabilityWindow({
        artistId: testArtistId,
        dayOfWeek: 1, // Monday
        startTime: "09:00",
        endTime: "17:00",
        timezone: "America/New_York",
      });

      const windows = await db.getAvailabilityWindowsByArtistId(testArtistId);
      expect(windows.length).toBeGreaterThan(0);
    });

    it("should retrieve active availability windows only", async () => {
      const activeWindows = await db.getActiveAvailabilityWindowsByArtistId(testArtistId);
      
      // All returned windows should have isActive = true
      activeWindows.forEach(window => {
        expect(window.isActive).toBe(true);
      });
    });

    it("should update an availability window", async () => {
      const windows = await db.getAvailabilityWindowsByArtistId(testArtistId);
      if (windows.length > 0) {
        const windowId = windows[0].id;
        
        await db.updateAvailabilityWindow(windowId, {
          startTime: "10:00",
          endTime: "18:00",
        });

        const updatedWindows = await db.getAvailabilityWindowsByArtistId(testArtistId);
        const updatedWindow = updatedWindows.find(w => w.id === windowId);
        
        expect(updatedWindow?.startTime).toBe("10:00");
        expect(updatedWindow?.endTime).toBe("18:00");
      }
    });
  });

  describe("Blackout Dates", () => {
    it("should create a blackout date", async () => {
      const startDate = new Date("2025-12-20");
      const endDate = new Date("2025-12-31");

      await db.createBlackoutDate({
        artistId: testArtistId,
        startDate,
        endDate,
        reason: "Holiday vacation",
      });

      const blackouts = await db.getBlackoutDatesByArtistId(testArtistId);
      expect(blackouts.length).toBeGreaterThan(0);
    });

    it("should retrieve future blackout dates only", async () => {
      const futureBlackouts = await db.getFutureBlackoutDatesByArtistId(testArtistId);
      const now = new Date();

      futureBlackouts.forEach(blackout => {
        expect(new Date(blackout.endDate).getTime()).toBeGreaterThanOrEqual(now.getTime());
      });
    });
  });

  describe("Artist Settings", () => {
    it("should create artist settings", async () => {
      await db.createArtistSettings({
        artistId: testArtistId,
        bookingBufferMinutes: 15,
        advanceBookingDays: 60,
        cancellationPolicy: "48 hours notice required",
      });

      const settings = await db.getArtistSettings(testArtistId);
      expect(settings).toBeDefined();
      expect(settings?.bookingBufferMinutes).toBe(15);
    });

    it("should update artist settings", async () => {
      await db.updateArtistSettings(testArtistId, {
        bookingBufferMinutes: 30,
        advanceBookingDays: 90,
      });

      const settings = await db.getArtistSettings(testArtistId);
      expect(settings?.bookingBufferMinutes).toBe(30);
      expect(settings?.advanceBookingDays).toBe(90);
    });
  });

  describe("Slot Locks", () => {
    it("should create a slot lock", async () => {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await db.createSlotLock({
        artistId: testArtistId,
        date: "2025-12-15",
        startTime: "14:00",
        durationMinutes: 60,
        lockedBy: testClientId,
        expiresAt,
      });

      const locks = await db.getActiveSlotLocks(testArtistId, "2025-12-15");
      expect(locks.length).toBeGreaterThan(0);
    });

    it("should not return expired slot locks", async () => {
      // Create an expired lock
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() - 5); // 5 minutes ago

      await db.createSlotLock({
        artistId: testArtistId,
        date: "2025-12-15",
        startTime: "15:00",
        durationMinutes: 60,
        lockedBy: testClientId,
        expiresAt,
      });

      const locks = await db.getActiveSlotLocks(testArtistId, "2025-12-15");
      
      // Should not include the expired lock
      const expiredLock = locks.find(lock => lock.startTime === "15:00");
      expect(expiredLock).toBeUndefined();
    });

    it("should delete expired slot locks", async () => {
      // Create an expired lock
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() - 5);

      await db.createSlotLock({
        artistId: testArtistId,
        date: "2025-12-16",
        startTime: "10:00",
        durationMinutes: 60,
        lockedBy: testClientId,
        expiresAt,
      });

      // Delete expired locks
      await db.deleteExpiredSlotLocks();

      // Verify the expired lock was deleted
      const locks = await db.getActiveSlotLocks(testArtistId, "2025-12-16");
      expect(locks.length).toBe(0);
    });
  });

  describe("Availability Calculation", () => {
    beforeEach(async () => {
      // Set up test data: availability window for Monday 9am-5pm
      await db.createAvailabilityWindow({
        artistId: testArtistId,
        dayOfWeek: 1, // Monday
        startTime: "09:00",
        endTime: "17:00",
        timezone: "America/New_York",
      });

      // Create artist settings
      await db.createArtistSettings({
        artistId: testArtistId,
        bookingBufferMinutes: 0,
        advanceBookingDays: 30,
      });
    });

    it("should calculate available slots for a date range", async () => {
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-15", // Monday
        "2025-12-15",
        60 // 1 hour duration
      );

      expect(slots.length).toBeGreaterThan(0);
      
      // Verify slot format
      slots.forEach(slot => {
        expect(slot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(slot.startTime).toMatch(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/);
        expect(slot.endTime).toMatch(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/);
        expect(slot.timezone).toBe("America/New_York");
      });
    });

    it("should not return slots on days without availability windows", async () => {
      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-16", // Tuesday (no availability window)
        "2025-12-16",
        60
      );

      expect(slots.length).toBe(0);
    });

    it("should not return slots during blackout dates", async () => {
      // Create a blackout for December 15
      await db.createBlackoutDate({
        artistId: testArtistId,
        startDate: new Date("2025-12-15"),
        endDate: new Date("2025-12-15"),
        reason: "Personal day",
      });

      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-15",
        "2025-12-15",
        60
      );

      expect(slots.length).toBe(0);
    });

    it("should not return slots that conflict with existing bookings", async () => {
      // Create a booking for 2pm on December 15
      await db.createBooking({
        clientId: testClientId,
        artistId: testArtistId,
        serviceDescription: "Test booking",
        requestedDate: new Date("2025-12-15T14:00:00"),
        status: "accepted",
        budget: null,
        notes: null,
      });

      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-15",
        "2025-12-15",
        60
      );

      // Should not include 2pm slot
      const conflictingSlot = slots.find(slot => slot.startTime === "14:00");
      expect(conflictingSlot).toBeUndefined();
    });

    it("should not return slots that conflict with active slot locks", async () => {
      // Create a slot lock for 3pm on December 15
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await db.createSlotLock({
        artistId: testArtistId,
        date: "2025-12-15",
        startTime: "15:00",
        durationMinutes: 60,
        lockedBy: testClientId,
        expiresAt,
      });

      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-15",
        "2025-12-15",
        60
      );

      // Should not include 3pm slot
      const lockedSlot = slots.find(slot => slot.startTime === "15:00");
      expect(lockedSlot).toBeUndefined();
    });

    it("should check if a specific slot is available", async () => {
      const isAvailable = await db.isSlotAvailable(
        testArtistId,
        "2025-12-15",
        "10:00",
        60
      );

      expect(typeof isAvailable).toBe("boolean");
    });

    it("should return false for unavailable slots", async () => {
      // Create a booking for 11am
      await db.createBooking({
        clientId: testClientId,
        artistId: testArtistId,
        serviceDescription: "Test booking",
        requestedDate: new Date("2025-12-15T11:00:00"),
        status: "accepted",
        budget: null,
        notes: null,
      });

      const isAvailable = await db.isSlotAvailable(
        testArtistId,
        "2025-12-15",
        "11:00",
        60
      );

      expect(isAvailable).toBe(false);
    });

    it("should respect booking buffer time", async () => {
      // Update artist settings to add 30-minute buffer
      await db.updateArtistSettings(testArtistId, {
        bookingBufferMinutes: 30,
      });

      // Create a booking for 2pm
      await db.createBooking({
        clientId: testClientId,
        artistId: testArtistId,
        serviceDescription: "Test booking",
        requestedDate: new Date("2025-12-15T14:00:00"),
        status: "accepted",
        budget: null,
        notes: null,
      });

      const slots = await db.calculateAvailableSlots(
        testArtistId,
        "2025-12-15",
        "2025-12-15",
        60
      );

      // Should not include 2pm or 3pm slots (2pm + 1hr + 30min buffer = 3:30pm)
      const twopmSlot = slots.find(slot => slot.startTime === "14:00");
      const threepmSlot = slots.find(slot => slot.startTime === "15:00");
      
      expect(twopmSlot).toBeUndefined();
      expect(threepmSlot).toBeUndefined();
    });

    it("should respect advance booking days limit", async () => {
      // Update settings to only allow 7 days advance booking
      await db.updateArtistSettings(testArtistId, {
        advanceBookingDays: 7,
      });

      // Try to get slots 30 days in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const slots = await db.calculateAvailableSlots(
        testArtistId,
        futureDateStr,
        futureDateStr,
        60
      );

      expect(slots.length).toBe(0);
    });
  });
});
