/**
 * Test Utilities & Fixtures
 * Reusable helpers for comprehensive test suite
 */

import * as db from "./db";

/**
 * Test data cleanup - removes all test data from database
 * Note: This is a placeholder. In production, use a separate test database.
 */
export async function cleanupTestData() {
  // In a real test suite, you'd truncate tables or use a separate test database
  console.warn("cleanupTestData: Not implemented - use separate test database");
}

/**
 * Create test user with artist profile
 */
export async function createTestArtist(overrides?: {
  displayName?: string;
  email?: string;
}) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const displayName = overrides?.displayName || `Test Artist ${random}`;
  const email = overrides?.email || `test-artist-${timestamp}-${random}@test.com`;

  // Create user through existing function
  // Use smaller numeric ID to avoid MySQL INT range issues
  const userNumericId = Math.floor(timestamp / 1000) + random; // Smaller number
  const openId = `test-openid-${timestamp}-${random}`;
  await db.upsertUser({
    openId,
    id: userNumericId,
    email,
    name: displayName,
    role: "user",
  });

  // Create artist profile
  await db.createArtistProfile({
    userId: userNumericId,
    displayName,
    bio: "Test artist bio for automated testing",
    categories: JSON.stringify([1]),
    hourlyRate: 10000, // $100.00
    portfolioImages: JSON.stringify([]),
  });

  // Get the created artist profile
  const artist = await db.getArtistProfileByUserId(userNumericId);
  if (!artist) throw new Error("Failed to create artist profile");

  // Create default artist settings
  await db.createArtistSettings({
    artistId: artist.id,
    bookingBufferMinutes: 0,
    advanceBookingDays: 90,
    cancellationPolicy: "flexible",
  });

  return { userId: userNumericId, artist };
}

/**
 * Create test availability window
 */
export async function createTestAvailabilityWindow(
  artistId: number,
  overrides?: {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    timezone?: string;
  }
) {
  return await db.createAvailabilityWindow({
    artistId,
    dayOfWeek: overrides?.dayOfWeek ?? 1, // Monday
    startTime: overrides?.startTime || "09:00",
    endTime: overrides?.endTime || "17:00",
    timezone: overrides?.timezone || "America/New_York",
  });
}

/**
 * Create test booking
 */
export async function createTestBooking(
  artistId: number,
  clientId: number,
  overrides?: {
    requestedDate?: Date;
    status?: "pending" | "accepted" | "declined" | "completed" | "cancelled";
    serviceDescription?: string;
    budget?: number;
  }
) {
  const now = new Date();
  const requestedDate = overrides?.requestedDate || new Date(now.getTime() + 86400000); // Tomorrow

  return await db.createBooking({
    artistId,
    clientId,
    requestedDate,
    serviceDescription: overrides?.serviceDescription || "Test booking for automated testing",
    budget: overrides?.budget || 10000, // $100.00
    notes: "Automated test booking",
  });
}

/**
 * Create test slot lock
 */
export async function createTestSlotLock(
  artistId: number,
  lockedBy: number,
  overrides?: {
    date?: string;
    startTime?: string;
    durationMinutes?: number;
    expiresAt?: Date;
  }
) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const expiresAt = overrides?.expiresAt || new Date(now.getTime() + 900000); // +15 minutes

  return await db.createSlotLock({
    artistId,
    date: overrides?.date || formatDate(tomorrow),
    startTime: overrides?.startTime || "10:00",
    durationMinutes: overrides?.durationMinutes || 60,
    lockedBy,
    expiresAt,
  });
}

/**
 * Create test blackout date
 */
export async function createTestBlackout(
  artistId: number,
  overrides?: {
    startDate?: Date;
    endDate?: Date;
    reason?: string;
  }
) {
  const now = new Date();
  const startDate = overrides?.startDate || new Date(now.getTime() + 86400000);
  const endDate = overrides?.endDate || new Date(startDate.getTime() + 86400000);

  return await db.createBlackoutDate({
    artistId,
    startDate,
    endDate,
    reason: overrides?.reason || "Test blackout for automated testing",
  });
}

/**
 * Wait for specified milliseconds (for testing race conditions)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run function concurrently N times
 * Useful for testing race conditions
 */
export async function runConcurrently<T>(
  fn: () => Promise<T>,
  count: number
): Promise<PromiseSettledResult<T>[]> {
  const promises = Array.from({ length: count }, () => fn());
  return Promise.allSettled(promises);
}

/**
 * Get date N days from now
 */
export function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Get date at specific time today
 */
export function todayAt(hour: number, minute: number = 0): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

/**
 * Mock Stripe webhook event
 */
export function createMockStripeWebhook(
  type: string,
  data: any
): {
  id: string;
  type: string;
  data: { object: any };
  created: number;
} {
  return {
    id: `evt_test_${Date.now()}`,
    type,
    data: { object: data },
    created: Math.floor(Date.now() / 1000),
  };
}

/**
 * Mock Stripe Payment Intent
 */
export function createMockPaymentIntent(overrides?: {
  id?: string;
  amount?: number;
  status?: string;
  metadata?: Record<string, string>;
}) {
  return {
    id: overrides?.id || `pi_test_${Date.now()}`,
    object: "payment_intent",
    amount: overrides?.amount || 10000, // $100.00
    currency: "usd",
    status: overrides?.status || "succeeded",
    metadata: overrides?.metadata || {},
    created: Math.floor(Date.now() / 1000),
  };
}
