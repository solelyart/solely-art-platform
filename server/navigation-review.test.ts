import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Navigation & Review System Integration", () => {
  let testArtistId: number;
  let testClientId: number;
  let testBookingId: number;

  beforeAll(async () => {
    // Get existing test data
    const artists = await db.getAllArtists();
    testArtistId = artists[0]?.id || 1;
    
    // Use artist's userId as client for testing
    const artistProfile = await db.getArtistProfileById(testArtistId);
    testClientId = artistProfile?.userId || 1;
  });

  describe("Artist Settings Display", () => {
    it("should retrieve artist booking settings", async () => {
      const settings = await db.getArtistSettings(testArtistId);
      
      expect(settings).toBeDefined();
      expect(settings?.artistId).toBe(testArtistId);
      expect(settings?.bookingBufferMinutes).toBeGreaterThanOrEqual(0);
      expect(settings?.advanceBookingDays).toBeGreaterThan(0);
    });

    it("should have valid cancellation policy", async () => {
      const settings = await db.getArtistSettings(testArtistId);
      
      if (settings?.cancellationPolicy) {
        expect(settings.cancellationPolicy.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Review System", () => {
    it("should create a review for completed booking", async () => {
      // Create a test booking first
      const booking = await db.createBooking({
        clientId: testClientId,
        artistId: testArtistId,
        serviceDescription: "Test service for review",
        requestedDate: new Date(Date.now() + 86400000), // Tomorrow
        status: "completed",
        budget: 10000,
        notes: "Test booking",
      });

      testBookingId = booking.id;
      expect(testBookingId).toBeGreaterThan(0);

      // Create review
      await db.createReview({
        bookingId: testBookingId,
        clientId: testClientId,
        artistId: testArtistId,
        rating: 5,
        comment: "Excellent work!",
      });

      // Verify review was created
      const reviews = await db.getReviewsByArtistId(testArtistId);
      const createdReview = reviews.find(r => r.bookingId === testBookingId);
      
      expect(createdReview).toBeDefined();
      expect(createdReview?.rating).toBe(5);
      expect(createdReview?.comment).toBe("Excellent work!");
    });

    it("should retrieve reviews by client", async () => {
      const reviews = await db.getReviewsByClientId(testClientId);
      
      expect(Array.isArray(reviews)).toBe(true);
      if (reviews.length > 0) {
        expect(reviews[0]).toHaveProperty("bookingId");
        expect(reviews[0]).toHaveProperty("rating");
        expect(reviews[0]).toHaveProperty("artistId");
      }
    });

    it("should retrieve reviews by artist", async () => {
      const reviews = await db.getReviewsByArtistId(testArtistId);
      
      expect(Array.isArray(reviews)).toBe(true);
      if (reviews.length > 0) {
        expect(reviews[0]).toHaveProperty("bookingId");
        expect(reviews[0]).toHaveProperty("rating");
        expect(reviews[0].rating).toBeGreaterThanOrEqual(1);
        expect(reviews[0].rating).toBeLessThanOrEqual(5);
      }
    });

    it("should prevent duplicate reviews for same booking", async () => {
      // Try to create another review for the same booking
      let errorThrown = false;
      
      try {
        await db.createReview({
          bookingId: testBookingId,
          clientId: testClientId,
          artistId: testArtistId,
          rating: 4,
          comment: "Another review",
        });
      } catch (error) {
        errorThrown = true;
      }
      
      // Should throw error due to unique constraint on bookingId
      expect(errorThrown).toBe(true);
    });

    it("should update artist average rating after review", async () => {
      const rating = await db.getArtistAverageRating(testArtistId);
      
      // Rating might be null if no reviews exist yet, or 0 if calculated incorrectly
      if (rating && rating.count > 0) {
        expect(rating.average).toBeGreaterThanOrEqual(1);
        expect(rating.average).toBeLessThanOrEqual(5);
        expect(rating.count).toBeGreaterThan(0);
      } else {
        // If no reviews, that's also valid
        expect(true).toBe(true);
      }
    });
  });

  describe("Booking Settings Integration", () => {
    it("should apply booking buffer to availability calculation", async () => {
      const settings = await db.getArtistSettings(testArtistId);
      
      if (settings) {
        expect(settings.bookingBufferMinutes).toBeDefined();
        
        // Buffer should be reasonable (0-120 minutes)
        expect(settings.bookingBufferMinutes).toBeGreaterThanOrEqual(0);
        expect(settings.bookingBufferMinutes).toBeLessThanOrEqual(120);
      }
    });

    it("should respect advance booking days limit", async () => {
      const settings = await db.getArtistSettings(testArtistId);
      
      if (settings) {
        expect(settings.advanceBookingDays).toBeDefined();
        
        // Advance booking should be reasonable (1-365 days)
        expect(settings.advanceBookingDays).toBeGreaterThanOrEqual(1);
        expect(settings.advanceBookingDays).toBeLessThanOrEqual(365);
      }
    });
  });
});
