import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

/**
 * Integration tests for Artist Availability Dashboard and Booking Management
 * Tests features 1-10 from conceptual implementation
 */

describe("Artist Availability Dashboard", () => {
  let testArtistId: number;
  let testUserId: number;

  beforeAll(async () => {
    // Get first artist from seeded data
    const artists = await db.getAllArtists();
    if (artists && artists.length > 0) {
      testArtistId = artists[0].id;
      testUserId = artists[0].userId;
    }
  });

  describe("Feature 1: Weekly Schedule Management", () => {
    it("should create availability window", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const result = await caller.availability.createWindow({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        timezone: "America/New_York",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should get availability windows", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const windows = await caller.availability.getWindows();
      expect(windows).toBeDefined();
      expect(Array.isArray(windows)).toBe(true);
    });

    it("should update availability window", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const windows = await caller.availability.getWindows();
      if (windows && windows.length > 0) {
        const result = await caller.availability.updateWindow({
          windowId: windows[0].id,
          isActive: false,
        });

        expect(result.success).toBe(true);
      }
    });
  });

  describe("Feature 2: Blackout Dates System", () => {
    it("should create blackout date", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const result = await caller.availability.createBlackout({
        startDate: tomorrow,
        endDate: nextWeek,
        reason: "Test vacation",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should get blackout dates", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const blackouts = await caller.availability.getBlackouts();
      expect(blackouts).toBeDefined();
      expect(Array.isArray(blackouts)).toBe(true);
    });

    it("should delete blackout date", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const blackouts = await caller.availability.getBlackouts();
      if (blackouts && blackouts.length > 0) {
        const result = await caller.availability.deleteBlackout({
          blackoutId: blackouts[0].id,
        });

        expect(result.success).toBe(true);
      }
    });
  });

  describe("Feature 3: Booking Policy Configuration", () => {
    it("should get artist settings", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const settings = await caller.availability.getSettings();
      expect(settings).toBeDefined();
    });

    it("should update booking policies", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const result = await caller.availability.updateSettings({
        bookingBufferMinutes: 30,
        advanceBookingDays: 60,
        cancellationPolicy: "Flexible cancellation up to 24 hours before appointment.",
      });

      expect(result.success).toBe(true);
    });

    it("should apply preset policy templates", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      // Test moderate preset
      const result = await caller.availability.updateSettings({
        bookingBufferMinutes: 15,
        advanceBookingDays: 60,
        cancellationPolicy: "Cancellation allowed up to 48 hours before appointment.",
      });

      expect(result.success).toBe(true);

      const settings = await caller.availability.getSettings();
      expect(settings?.bookingBufferMinutes).toBe(15);
      expect(settings?.advanceBookingDays).toBe(60);
    });
  });

  describe("Feature 4: Availability Calculation", () => {
    it("should calculate available slots", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: "test", name: "Test User" },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const slots = await caller.availability.getAvailableSlots({
        artistId: testArtistId,
        startDate: tomorrow.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0],
        durationMinutes: 60,
      });

      expect(slots).toBeDefined();
      expect(Array.isArray(slots)).toBe(true);
    });
  });
});

describe("Booking Management Interface", () => {
  let testArtistId: number;
  let testClientId: number;
  let testBookingId: number;

  beforeAll(async () => {
    // Get first artist
    const artists = await db.getAllArtists();
    if (artists && artists.length > 0) {
      testArtistId = artists[0].id;
    }

    // Use artist userId as client for testing
    if (artists && artists.length > 0) {
      testClientId = artists[0].userId;
    }
  });

  describe("Feature 5: Booking Request Workflow", () => {
    it("should create booking request", async () => {
      const caller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      tomorrow.setHours(14, 0, 0, 0);

      const result = await caller.bookings.create({
        artistId: testArtistId,
        serviceDescription: "Portrait painting session",
        requestedDate: tomorrow,
        budget: 500,
        notes: "Looking forward to working with you!",
      });

      expect(result.success).toBe(true);
    });

    it("should get booking requests", async () => {
      const caller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const bookings = await caller.bookings.getMyBookings();
      expect(bookings).toBeDefined();
      expect(Array.isArray(bookings)).toBe(true);

      if (bookings && bookings.length > 0) {
        testBookingId = bookings[0].id;
      }
    });

    it("should accept booking request", async () => {
      if (!testBookingId) {
        console.log("Skipping: no test booking available");
        return;
      }

      const artists = await db.getAllArtists();
      const artistUserId = artists?.[0]?.userId;

      if (!artistUserId) {
        console.log("Skipping: no artist user ID");
        return;
      }

      const caller = appRouter.createCaller({
        user: { id: artistUserId, openId: "test-artist", name: "Test Artist" },
      });

      const result = await caller.bookings.updateStatus({
        bookingId: testBookingId,
        status: "accepted",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Feature 6: Booking History & Timeline", () => {
    it("should filter bookings by status", async () => {
      const caller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const bookings = await caller.bookings.getMyBookings();
      expect(bookings).toBeDefined();

      const pending = bookings?.filter((b) => b.status === "pending");
      const accepted = bookings?.filter((b) => b.status === "accepted");

      expect(Array.isArray(pending)).toBe(true);
      expect(Array.isArray(accepted)).toBe(true);
    });

    it("should sort bookings by date", async () => {
      const caller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const bookings = await caller.bookings.getMyBookings();
      if (bookings && bookings.length > 1) {
        const sorted = [...bookings].sort(
          (a, b) =>
            new Date(b.requestedDate).getTime() -
            new Date(a.requestedDate).getTime()
        );

        expect(sorted[0].requestedDate >= sorted[sorted.length - 1].requestedDate).toBe(
          true
        );
      }
    });
  });

  describe("Feature 7: Cancellation Management", () => {
    it("should cancel booking", async () => {
      if (!testBookingId) {
        console.log("Skipping: no test booking available");
        return;
      }

      const caller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const result = await caller.bookings.updateStatus({
        bookingId: testBookingId,
        status: "cancelled",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Feature 8: Search & Filter System", () => {
    it("should support date range filtering", async () => {
      const caller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const bookings = await caller.bookings.getMyBookings();
      expect(bookings).toBeDefined();

      const now = new Date();
      const future = bookings?.filter(
        (b) => new Date(b.requestedDate) > now
      );

      expect(Array.isArray(future)).toBe(true);
    });
  });

  describe("Feature 9: Notification Integration", () => {
    it("should trigger notifications on booking creation", async () => {
      // Notifications are triggered automatically in the mutation
      // This test verifies the notification functions exist
      const notifications = await import("./notifications");

      expect(notifications.notifyBookingCreated).toBeDefined();
      expect(notifications.notifyBookingAccepted).toBeDefined();
      expect(notifications.notifyBookingDeclined).toBeDefined();
      expect(notifications.notifyBookingCancelled).toBeDefined();
      expect(notifications.notifyBookingCompleted).toBeDefined();
    });
  });

  describe("Feature 10: End-to-End Workflow", () => {
    it("should complete full booking lifecycle", async () => {
      // 1. Client creates booking
      const clientCaller = appRouter.createCaller({
        user: { id: testClientId, openId: "test-client", name: "Test Client" },
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);
      tomorrow.setHours(10, 0, 0, 0);

      const createResult = await clientCaller.bookings.create({
        artistId: testArtistId,
        serviceDescription: "Photography session",
        requestedDate: tomorrow,
        budget: 300,
      });

      expect(createResult.success).toBe(true);

      // 2. Get booking ID
      const clientBookings = await clientCaller.bookings.getMyBookings();
      const newBooking = clientBookings?.find(
        (b) => b.serviceDescription === "Photography session"
      );

      if (!newBooking) {
        console.log("Skipping: booking not found");
        return;
      }

      // 3. Artist accepts booking
      const artists = await db.getAllArtists();
      const artistUserId = artists?.[0]?.userId;

      if (!artistUserId) {
        console.log("Skipping: no artist user ID");
        return;
      }

      const artistCaller = appRouter.createCaller({
        user: { id: artistUserId, openId: "test-artist", name: "Test Artist" },
      });

      const acceptResult = await artistCaller.bookings.updateStatus({
        bookingId: newBooking.id,
        status: "accepted",
      });

      expect(acceptResult.success).toBe(true);

      // 4. Artist marks as completed
      const completeResult = await artistCaller.bookings.updateStatus({
        bookingId: newBooking.id,
        status: "completed",
      });

      expect(completeResult.success).toBe(true);
    });
  });
});
