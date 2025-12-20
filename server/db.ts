import { eq, and, or, like, desc, sql, gte, gt, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  artistProfiles, 
  InsertArtistProfile,
  categories,
  InsertCategory,
  bookings,
  InsertBooking,
  reviews,
  InsertReview,
  ArtistProfile,
  services,
  availabilityWindows,
  blackoutDates,
  artistSettings,
  slotLocks,
  conversations,
  InsertConversation,
  messages,
  InsertMessage,
  portfolioCollections,
  portfolioItems
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER QUERIES =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.userType !== undefined) {
      values.userType = user.userType;
      updateSet.userType = user.userType;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserType(userId: number, userType: "client" | "artist" | "both") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ userType }).where(eq(users.id, userId));
}

export async function updateUserProfilePhoto(userId: number, photoUrl: string | null, photoKey: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ 
    profilePhotoUrl: photoUrl, 
    profilePhotoKey: photoKey 
  }).where(eq(users.id, userId));
}

// ===== ARTIST PROFILE QUERIES =====

export async function createArtistProfile(profile: InsertArtistProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(artistProfiles).values(profile);
  return result;
}

export async function getArtistProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(artistProfiles).where(eq(artistProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getArtistProfileById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(artistProfiles).where(eq(artistProfiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateArtistProfile(id: number, updates: Partial<InsertArtistProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(artistProfiles).set(updates).where(eq(artistProfiles.id, id));
}

export async function searchArtists(params: {
  category?: string;
  location?: string;
  searchTerm?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(artistProfiles.isAvailable, true)];

  if (params.category) {
    conditions.push(like(artistProfiles.categories, `%${params.category}%`));
  }

  if (params.location) {
    conditions.push(like(artistProfiles.location, `%${params.location}%`));
  }

  if (params.searchTerm) {
    const searchCondition = or(
      like(artistProfiles.displayName, `%${params.searchTerm}%`),
      like(artistProfiles.bio, `%${params.searchTerm}%`)
    );
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const results = await db
    .select({
      id: artistProfiles.id,
      userId: artistProfiles.userId,
      displayName: artistProfiles.displayName,
      bio: artistProfiles.bio,
      location: artistProfiles.location,
      categories: artistProfiles.categories,
      portfolioImages: artistProfiles.portfolioImages,
      hourlyRate: artistProfiles.hourlyRate,
      isAvailable: artistProfiles.isAvailable,
      createdAt: artistProfiles.createdAt,
      updatedAt: artistProfiles.updatedAt,
      profilePhotoUrl: users.profilePhotoUrl,
    })
    .from(artistProfiles)
    .leftJoin(users, eq(artistProfiles.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(artistProfiles.createdAt));
  
  return results;
}

export async function getAllArtists() {
  const db = await getDb();
  if (!db) return [];

  const results = await db.select().from(artistProfiles).orderBy(desc(artistProfiles.createdAt));
  return results;
}

// ===== CATEGORY QUERIES =====

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(categories).values(category);
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== BOOKING QUERIES =====

export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bookings).values(booking);
  const insertId = Number(result[0].insertId);
  const created = await getBookingById(insertId);
  if (!created) throw new Error("Failed to retrieve created booking");
  return created;
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBookingsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bookings).where(eq(bookings.clientId, clientId)).orderBy(desc(bookings.createdAt));
}

export async function getBookingsByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bookings).where(eq(bookings.artistId, artistId)).orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(id: number, status: "pending" | "accepted" | "declined" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

// ===== REVIEW QUERIES =====

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(reviews).values(review);
}

export async function getReviewsByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.artistId, artistId)).orderBy(desc(reviews.createdAt));
}

export async function getReviewsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.clientId, clientId)).orderBy(desc(reviews.createdAt));
}

export async function getArtistAverageRating(artistId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select({
      avgRating: sql<number>`AVG(${reviews.rating})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.artistId, artistId));

  if (result.length === 0 || !result[0]) return null;
  
  return {
    average: result[0].avgRating ? Number(result[0].avgRating) : 0,
    count: result[0].count ? Number(result[0].count) : 0,
  };
}

// ============================================================================
// Services
// ============================================================================

export async function createService(data: {
  artistId: number;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(services).values(data);
}

export async function getServicesByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(services).where(eq(services.artistId, artistId));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0] || null;
}

export async function updateService(id: number, data: {
  name?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.durationMinutes !== undefined) updateData.durationMinutes = data.durationMinutes;

  if (Object.keys(updateData).length > 0) {
    await db.update(services).set(updateData).where(eq(services.id, id));
  }
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(services).where(eq(services.id, id));
}


// ============================================================================
// Availability Windows
// ============================================================================

/**
 * Validate time format (HH:MM)
 */
function isValidTimeFormat(time: string): boolean {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

/**
 * Validate that end time is after start time
 */
function isValidTimeRange(startTime: string, endTime: string): boolean {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}

export async function createAvailabilityWindow(data: {
  artistId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validation
  if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
    throw new Error("Invalid day of week (must be 0-6)");
  }
  if (!isValidTimeFormat(data.startTime) || !isValidTimeFormat(data.endTime)) {
    throw new Error("Invalid time format (must be HH:MM)");
  }
  if (!isValidTimeRange(data.startTime, data.endTime)) {
    throw new Error("End time must be after start time");
  }

  await db.insert(availabilityWindows).values(data);
}

/**
 * Bulk create availability windows (e.g., set Mon-Fri 9-5)
 */
export async function bulkCreateAvailabilityWindows(data: {
  artistId: number;
  windows: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  timezone: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validate all windows first
  for (const window of data.windows) {
    if (window.dayOfWeek < 0 || window.dayOfWeek > 6) {
      throw new Error(`Invalid day of week: ${window.dayOfWeek}`);
    }
    if (!isValidTimeFormat(window.startTime) || !isValidTimeFormat(window.endTime)) {
      throw new Error(`Invalid time format for day ${window.dayOfWeek}`);
    }
    if (!isValidTimeRange(window.startTime, window.endTime)) {
      throw new Error(`Invalid time range for day ${window.dayOfWeek}`);
    }
  }

  // Insert all windows
  const values = data.windows.map(w => ({
    artistId: data.artistId,
    dayOfWeek: w.dayOfWeek,
    startTime: w.startTime,
    endTime: w.endTime,
    timezone: data.timezone,
  }));

  await db.insert(availabilityWindows).values(values);
}

/**
 * Delete all availability windows for an artist
 */
export async function deleteAllAvailabilityWindows(artistId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(availabilityWindows).where(eq(availabilityWindows.artistId, artistId));
}

export async function getAvailabilityWindowsByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(availabilityWindows).where(eq(availabilityWindows.artistId, artistId));
}

export async function getActiveAvailabilityWindowsByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(availabilityWindows)
    .where(and(
      eq(availabilityWindows.artistId, artistId),
      eq(availabilityWindows.isActive, true)
    ));
}

export async function updateAvailabilityWindow(id: number, data: {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
  if (data.startTime !== undefined) updateData.startTime = data.startTime;
  if (data.endTime !== undefined) updateData.endTime = data.endTime;
  if (data.timezone !== undefined) updateData.timezone = data.timezone;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  if (Object.keys(updateData).length > 0) {
    await db.update(availabilityWindows).set(updateData).where(eq(availabilityWindows.id, id));
  }
}

export async function deleteAvailabilityWindow(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(availabilityWindows).where(eq(availabilityWindows.id, id));
}

// ============================================================================
// Blackout Dates
// ============================================================================

export async function createBlackoutDate(data: {
  artistId: number;
  startDate: Date;
  endDate: Date;
  reason?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validation
  if (data.startDate > data.endDate) {
    throw new Error("Start date must be before or equal to end date");
  }

  await db.insert(blackoutDates).values(data);
}

/**
 * Bulk create blackout dates (e.g., all weekends in a month)
 */
export async function bulkCreateBlackoutDates(data: {
  artistId: number;
  dates: Array<{
    startDate: Date;
    endDate: Date;
    reason?: string | null;
  }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validate all dates
  for (const dateRange of data.dates) {
    if (dateRange.startDate > dateRange.endDate) {
      throw new Error("Invalid date range detected");
    }
  }

  const values = data.dates.map(d => ({
    artistId: data.artistId,
    startDate: d.startDate,
    endDate: d.endDate,
    reason: d.reason || null,
  }));

  await db.insert(blackoutDates).values(values);
}

/**
 * Create blackout dates from template (holidays, vacation patterns)
 */
export async function createBlackoutFromTemplate(data: {
  artistId: number;
  template: 'us-holidays' | 'weekends' | 'custom';
  year: number;
  customDates?: Array<{ month: number; day: number; reason: string }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const blackouts: Array<{
    startDate: Date;
    endDate: Date;
    reason: string;
  }> = [];

  if (data.template === 'us-holidays') {
    // Major US holidays
    blackouts.push(
      { startDate: new Date(data.year, 0, 1), endDate: new Date(data.year, 0, 1), reason: "New Year's Day" },
      { startDate: new Date(data.year, 6, 4), endDate: new Date(data.year, 6, 4), reason: "Independence Day" },
      { startDate: new Date(data.year, 11, 25), endDate: new Date(data.year, 11, 25), reason: "Christmas" },
    );
  } else if (data.template === 'weekends') {
    // All weekends in the year
    const start = new Date(data.year, 0, 1);
    const end = new Date(data.year, 11, 31);
    const current = new Date(start);
    
    while (current <= end) {
      if (current.getDay() === 0 || current.getDay() === 6) {
        blackouts.push({
          startDate: new Date(current),
          endDate: new Date(current),
          reason: "Weekend",
        });
      }
      current.setDate(current.getDate() + 1);
    }
  } else if (data.template === 'custom' && data.customDates) {
    for (const customDate of data.customDates) {
      const date = new Date(data.year, customDate.month - 1, customDate.day);
      blackouts.push({
        startDate: date,
        endDate: date,
        reason: customDate.reason,
      });
    }
  }

  if (blackouts.length > 0) {
    await bulkCreateBlackoutDates({
      artistId: data.artistId,
      dates: blackouts,
    });
  }
}

export async function getBlackoutDatesByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(blackoutDates).where(eq(blackoutDates.artistId, artistId));
}

export async function getFutureBlackoutDatesByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db
    .select()
    .from(blackoutDates)
    .where(and(
      eq(blackoutDates.artistId, artistId),
      gte(blackoutDates.endDate, now)
    ));
}

export async function deleteBlackoutDate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blackoutDates).where(eq(blackoutDates.id, id));
}

/**
 * Delete all blackout dates for an artist (used for test cleanup)
 */
export async function deleteBlackoutDatesByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blackoutDates).where(eq(blackoutDates.artistId, artistId));
}

// ============================================================================
// Artist Settings
// ============================================================================

/**
 * Preset templates for common artist booking configurations
 */
export const ARTIST_SETTINGS_PRESETS = {
  flexible: {
    bookingBufferMinutes: 0,
    advanceBookingDays: 90,
    cancellationPolicy: "Flexible cancellation up to 24 hours before appointment. Full refund available.",
  },
  moderate: {
    bookingBufferMinutes: 15,
    advanceBookingDays: 60,
    cancellationPolicy: "Cancellation allowed up to 48 hours before appointment. 50% refund for late cancellations.",
  },
  strict: {
    bookingBufferMinutes: 30,
    advanceBookingDays: 30,
    cancellationPolicy: "Strict cancellation policy. No refunds within 7 days of appointment.",
  },
  premium: {
    bookingBufferMinutes: 60,
    advanceBookingDays: 14,
    cancellationPolicy: "Premium service requires 72-hour cancellation notice. Deposit non-refundable.",
  },
} as const;

export async function createArtistSettings(data: {
  artistId: number;
  bookingBufferMinutes?: number;
  advanceBookingDays?: number;
  cancellationPolicy?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Apply smart defaults if not provided
  const settings = {
    artistId: data.artistId,
    bookingBufferMinutes: data.bookingBufferMinutes ?? ARTIST_SETTINGS_PRESETS.moderate.bookingBufferMinutes,
    advanceBookingDays: data.advanceBookingDays ?? ARTIST_SETTINGS_PRESETS.moderate.advanceBookingDays,
    cancellationPolicy: data.cancellationPolicy ?? ARTIST_SETTINGS_PRESETS.moderate.cancellationPolicy,
  };

  await db.insert(artistSettings).values(settings);
}

/**
 * Create artist settings from preset template
 */
export async function createArtistSettingsFromPreset(data: {
  artistId: number;
  preset: keyof typeof ARTIST_SETTINGS_PRESETS;
}) {
  const template = ARTIST_SETTINGS_PRESETS[data.preset];
  return createArtistSettings({
    artistId: data.artistId,
    ...template,
  });
}

export async function getArtistSettings(artistId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(artistSettings)
    .where(eq(artistSettings.artistId, artistId))
    .limit(1);
  
  return result[0] || null;
}

export async function updateArtistSettings(artistId: number, data: {
  bookingBufferMinutes?: number;
  advanceBookingDays?: number;
  cancellationPolicy?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (data.bookingBufferMinutes !== undefined) updateData.bookingBufferMinutes = data.bookingBufferMinutes;
  if (data.advanceBookingDays !== undefined) updateData.advanceBookingDays = data.advanceBookingDays;
  if (data.cancellationPolicy !== undefined) updateData.cancellationPolicy = data.cancellationPolicy;

  if (Object.keys(updateData).length > 0) {
    await db.update(artistSettings).set(updateData).where(eq(artistSettings.artistId, artistId));
  }
}

export async function deleteArtistSettings(artistId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(artistSettings).where(eq(artistSettings.artistId, artistId));
}

// ============================================================================
// Slot Locks
// ============================================================================

export async function createSlotLock(data: {
  artistId: number;
  date: string;
  startTime: string;
  durationMinutes: number;
  lockedBy: number;
  expiresAt: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(slotLocks).values(data);
  return result;
}

export async function getSlotLock(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(slotLocks).where(eq(slotLocks.id, id)).limit(1);
  return result[0] || null;
}

export async function getActiveSlotLocks(artistId: number, date: string) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db
    .select()
    .from(slotLocks)
    .where(and(
      eq(slotLocks.artistId, artistId),
      eq(slotLocks.date, date),
      gt(slotLocks.expiresAt, now)
    ));
}

export async function deleteSlotLock(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(slotLocks).where(eq(slotLocks.id, id));
}

export async function deleteExpiredSlotLocks() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const result = await db.delete(slotLocks).where(lt(slotLocks.expiresAt, now));
  return result;
}

/**
 * Get slot lock statistics for monitoring
 */
export async function getSlotLockStats() {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  
  const allLocks = await db.select().from(slotLocks);
  const activeLocks = allLocks.filter(lock => new Date(lock.expiresAt) > now);
  const expiredLocks = allLocks.filter(lock => new Date(lock.expiresAt) <= now);

  return {
    total: allLocks.length,
    active: activeLocks.length,
    expired: expiredLocks.length,
    oldestActive: activeLocks.length > 0 
      ? activeLocks.reduce((oldest, lock) => 
          new Date(lock.createdAt) < new Date(oldest.createdAt) ? lock : oldest
        ).createdAt
      : null,
  };
}

/**
 * Release slot lock by user (cancel booking flow)
 */
export async function releaseSlotLockByUser(userId: number, artistId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(slotLocks).where(
    and(
      eq(slotLocks.lockedBy, userId),
      eq(slotLocks.artistId, artistId),
      eq(slotLocks.date, date)
    )
  );
}

/**
 * Extend slot lock expiration (user still in booking flow)
 */
export async function extendSlotLock(id: number, additionalMinutes: number = 15) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const lock = await getSlotLock(id);
  if (!lock) throw new Error("Slot lock not found");

  const newExpiry = new Date(lock.expiresAt);
  newExpiry.setMinutes(newExpiry.getMinutes() + additionalMinutes);

  await db.update(slotLocks)
    .set({ expiresAt: newExpiry })
    .where(eq(slotLocks.id, id));
}

/**
 * Check if a specific slot is locked
 */
export async function isSlotLocked(
  artistId: number,
  date: string,
  startTime: string,
  durationMinutes: number
): Promise<boolean> {
  const activeLocks = await getActiveSlotLocks(artistId, date);
  
  const [reqStartHour, reqStartMin] = startTime.split(':').map(Number);
  const reqStartMinutes = reqStartHour * 60 + reqStartMin;
  const reqEndMinutes = reqStartMinutes + durationMinutes;

  for (const lock of activeLocks) {
    const [lockStartHour, lockStartMin] = lock.startTime.split(':').map(Number);
    const lockStartMinutes = lockStartHour * 60 + lockStartMin;
    const lockEndMinutes = lockStartMinutes + lock.durationMinutes;

    // Check for overlap
    if (
      (reqStartMinutes >= lockStartMinutes && reqStartMinutes < lockEndMinutes) ||
      (reqEndMinutes > lockStartMinutes && reqEndMinutes <= lockEndMinutes) ||
      (reqStartMinutes <= lockStartMinutes && reqEndMinutes >= lockEndMinutes)
    ) {
      return true;
    }
  }

  return false;
}


// ============================================================================
// Availability Calculation
// ============================================================================

export interface AvailableSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  timezone: string;
}

/**
 * Simple in-memory cache for availability calculations
 * Cache key: `${artistId}:${startDate}:${endDate}:${duration}`
 * Cache TTL: 5 minutes
 */
const availabilityCache = new Map<string, { data: AvailableSlot[]; expiresAt: number }>();

function getCacheKey(artistId: number, startDate: string, endDate: string, duration: number): string {
  return `${artistId}:${startDate}:${endDate}:${duration}`;
}

function getCachedAvailability(key: string): AvailableSlot[] | null {
  const cached = availabilityCache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expiresAt) {
    availabilityCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCachedAvailability(key: string, data: AvailableSlot[], ttlMinutes: number = 5) {
  availabilityCache.set(key, {
    data,
    expiresAt: Date.now() + (ttlMinutes * 60 * 1000),
  });
}

/**
 * Clear availability cache for a specific artist (call after settings/availability changes)
 */
export function clearAvailabilityCache(artistId: number) {
  const keysToDelete: string[] = [];
  availabilityCache.forEach((_, key) => {
    if (key.startsWith(`${artistId}:`)) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => availabilityCache.delete(key));
}

/**
 * Clear entire availability cache (maintenance)
 */
export function clearAllAvailabilityCache() {
  availabilityCache.clear();
}

/**
 * Calculate available time slots for an artist within a date range
 * 
 * @param artistId - The artist's profile ID
 * @param startDate - Start of date range (YYYY-MM-DD)
 * @param endDate - End of date range (YYYY-MM-DD)
 * @param durationMinutes - Required duration for the booking
 * @param slotIntervalMinutes - Interval between slot start times (default: 30)
 * @returns Array of available time slots
 */
export async function calculateAvailableSlots(
  artistId: number,
  startDate: string,
  endDate: string,
  durationMinutes: number,
  slotIntervalMinutes: number = 30
): Promise<AvailableSlot[]> {
  const db = await getDb();
  if (!db) return [];

  // Check cache first
  const cacheKey = getCacheKey(artistId, startDate, endDate, durationMinutes);
  const cached = getCachedAvailability(cacheKey);
  if (cached) {
    return cached;
  }

  // 1. Get artist settings
  const settings = await getArtistSettings(artistId);
  const bufferMinutes = settings?.bookingBufferMinutes || 0;
  const advanceBookingDays = settings?.advanceBookingDays || 30;

  // 2. Get active availability windows
  const windows = await getActiveAvailabilityWindowsByArtistId(artistId);
  if (windows.length === 0) return [];

  // Group windows by day of week
  const windowsByDay = new Map<number, typeof windows>();
  for (const window of windows) {
    if (!windowsByDay.has(window.dayOfWeek)) {
      windowsByDay.set(window.dayOfWeek, []);
    }
    windowsByDay.get(window.dayOfWeek)!.push(window);
  }

  // 3. Get blackout dates
  const blackouts = await getFutureBlackoutDatesByArtistId(artistId);

  // 4. Get existing bookings in date range
  const existingBookings = await db
    .select()
    .from(bookings)
    .where(and(
      eq(bookings.artistId, artistId),
      or(
        eq(bookings.status, "pending"),
        eq(bookings.status, "accepted")
      )
    ));

  // 5. Generate candidate slots
  const availableSlots: AvailableSlot[] = [];
  
  // Parse dates as UTC to avoid timezone issues
  const start = new Date(startDate + "T12:00:00Z"); // Use noon UTC to avoid date boundary issues
  const end = new Date(endDate + "T12:00:00Z");
  
  // Ensure start date is not before end date
  if (start > end) return [];
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayNoon = new Date(todayStr + "T12:00:00Z");
  
  const maxDate = new Date(todayNoon);
  maxDate.setUTCDate(maxDate.getUTCDate() + advanceBookingDays);

  // Start from today if start date is in the past
  let currentDate = start < todayNoon ? new Date(todayNoon) : new Date(start);
  
  while (currentDate <= end && currentDate <= maxDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getUTCDay(); // 0 = Sunday, use UTC to be consistent
    // Check if this day has availability windows
    const dayWindows = windowsByDay.get(dayOfWeek);
    if (!dayWindows || dayWindows.length === 0) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      continue;
    }

    // Check if date is in blackout period
    // Compare using date strings to avoid timezone issues
    const isBlackedOut = blackouts.some(blackout => {
      const blackoutStartStr = new Date(blackout.startDate).toISOString().split('T')[0];
      const blackoutEndStr = new Date(blackout.endDate).toISOString().split('T')[0];
      return dateStr >= blackoutStartStr && dateStr <= blackoutEndStr;
    });

    if (isBlackedOut) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      continue;
    }

    // Get slot locks for this date
    const locks = await getActiveSlotLocks(artistId, dateStr);

    // Generate slots for each availability window on this day
    for (const window of dayWindows) {
      const [startHour, startMin] = window.startTime.split(':').map(Number);
      const [endHour, endMin] = window.endTime.split(':').map(Number);
      
      let slotStartMinutes = startHour * 60 + startMin;
      const windowEndMinutes = endHour * 60 + endMin;

      while (slotStartMinutes + durationMinutes <= windowEndMinutes) {
        const slotStartHour = Math.floor(slotStartMinutes / 60);
        const slotStartMin = slotStartMinutes % 60;
        const slotEndMinutes = slotStartMinutes + durationMinutes;
        const slotEndHour = Math.floor(slotEndMinutes / 60);
        const slotEndMin = slotEndMinutes % 60;

        const slotStartTime = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}`;
        const slotEndTime = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}`;

        // Check if slot conflicts with existing bookings
        const hasBookingConflict = existingBookings.some(booking => {
          const bookingDate = new Date(booking.requestedDate);
          const bookingDateStr = bookingDate.toISOString().split('T')[0];
          
          if (bookingDateStr !== dateStr) return false;

          const bookingHour = bookingDate.getHours();
          const bookingMin = bookingDate.getMinutes();
          const bookingStartMinutes = bookingHour * 60 + bookingMin;
          
          // Assume booking duration is same as service duration for now
          // In production, this should use actual booking duration
          const bookingEndMinutes = bookingStartMinutes + durationMinutes + bufferMinutes;

          // Check for overlap
          return !(slotEndMinutes <= bookingStartMinutes || slotStartMinutes >= bookingEndMinutes);
        });

        // Check if slot conflicts with active locks
        const hasLockConflict = locks.some(lock => {
          const [lockStartHour, lockStartMin] = lock.startTime.split(':').map(Number);
          const lockStartMinutes = lockStartHour * 60 + lockStartMin;
          const lockEndMinutes = lockStartMinutes + lock.durationMinutes;

          // Check for overlap
          return !(slotEndMinutes <= lockStartMinutes || slotStartMinutes >= lockEndMinutes);
        });

        if (!hasBookingConflict && !hasLockConflict) {
          availableSlots.push({
            date: dateStr,
            startTime: slotStartTime,
            endTime: slotEndTime,
            timezone: window.timezone
          });
        }

        slotStartMinutes += slotIntervalMinutes;
      }
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  // Cache the results
  setCachedAvailability(cacheKey, availableSlots);
  
  return availableSlots;
}

/**
 * Check if a specific time slot is available for booking
 * 
 * @param artistId - The artist's profile ID
 * @param date - Date in YYYY-MM-DD format
 * @param startTime - Start time in HH:MM format
 * @param durationMinutes - Duration of the booking
 * @returns true if the slot is available, false otherwise
 */
export async function isSlotAvailable(
  artistId: number,
  date: string,
  startTime: string,
  durationMinutes: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Calculate end time
  const [startHour, startMin] = startTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = startMinutes + durationMinutes;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

  // Get available slots for this date
  const slots = await calculateAvailableSlots(artistId, date, date, durationMinutes);
  
  // Check if the requested slot exists in available slots
  return slots.some(slot => 
    slot.date === date && 
    slot.startTime === startTime &&
    slot.endTime === endTime
  );
}


// ===== MESSAGING QUERIES =====

export async function createConversation(conversation: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conversations).values(conversation);
  const insertId = Number(result[0].insertId);
  const created = await getConversationById(insertId);
  if (!created) throw new Error("Failed to retrieve created conversation");
  return created;
}

export async function getConversationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(conversations).where(eq(conversations.id, id));
  return result[0];
}

export async function getConversationByParticipants(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(conversations).where(
    or(
      and(eq(conversations.participant1Id, userId1), eq(conversations.participant2Id, userId2)),
      and(eq(conversations.participant1Id, userId2), eq(conversations.participant2Id, userId1))
    )
  );
  return result[0];
}

export async function getConversationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(conversations).where(
    or(
      eq(conversations.participant1Id, userId),
      eq(conversations.participant2Id, userId)
    )
  ).orderBy(desc(conversations.lastMessageAt));
}

export async function updateConversationLastMessage(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(messages).values(message);
  const insertId = Number(result[0].insertId);
  
  // Update conversation last message timestamp
  await updateConversationLastMessage(message.conversationId);
  
  const created = await getMessageById(insertId);
  if (!created) throw new Error("Failed to retrieve created message");
  return created;
}

export async function getMessageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(messages).where(eq(messages.id, id));
  return result[0];
}

export async function getMessagesByConversationId(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function markMessagesAsRead(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(messages)
    .set({ isRead: true })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        sql`${messages.senderId} != ${userId}`,
        eq(messages.isRead, false)
      )
    );
}

export async function getUnreadMessageCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  // Get all conversations for this user
  const userConversations = await getConversationsByUserId(userId);
  const conversationIds = userConversations.map(c => c.id);
  
  if (conversationIds.length === 0) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(messages)
    .where(
      and(
        sql`${messages.conversationId} IN (${sql.join(conversationIds.map(id => sql`${id}`), sql`, `)})`,
        sql`${messages.senderId} != ${userId}`,
        eq(messages.isRead, false)
      )
    );
  
  return Number(result[0]?.count || 0);
}


// ============================================================================
// Portfolio Collections & Items
// ============================================================================

export async function createPortfolioCollection(data: {
  artistId: number;
  title: string;
  description?: string;
  displayOrder?: number;
  isFeatured?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(portfolioCollections).values({
    artistId: data.artistId,
    title: data.title,
    description: data.description || null,
    displayOrder: data.displayOrder ?? 0,
    isFeatured: data.isFeatured ?? false,
  });
  
  const id = Number(result[0].insertId);
  const collections = await db.select().from(portfolioCollections).where(eq(portfolioCollections.id, id));
  return collections[0];
}

export async function getPortfolioCollectionsByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(portfolioCollections)
    .where(eq(portfolioCollections.artistId, artistId))
    .orderBy(portfolioCollections.displayOrder, portfolioCollections.createdAt);
}

export async function updatePortfolioCollection(id: number, data: {
  title?: string;
  description?: string;
  displayOrder?: number;
  isFeatured?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

  if (Object.keys(updateData).length > 0) {
    await db.update(portfolioCollections).set(updateData).where(eq(portfolioCollections.id, id));
  }
}

export async function deletePortfolioCollection(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete all items in this collection first
  await db.delete(portfolioItems).where(eq(portfolioItems.collectionId, id));
  
  // Then delete the collection
  await db.delete(portfolioCollections).where(eq(portfolioCollections.id, id));
}

export async function reorderPortfolioCollections(updates: Array<{ id: number; displayOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update each collection's display order
  for (const update of updates) {
    await db
      .update(portfolioCollections)
      .set({ displayOrder: update.displayOrder })
      .where(eq(portfolioCollections.id, update.id));
  }
}

export async function createPortfolioItem(data: {
  collectionId: number;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(portfolioItems).values({
    collectionId: data.collectionId,
    title: data.title,
    description: data.description || null,
    imageUrl: data.imageUrl,
    thumbnailUrl: data.thumbnailUrl || null,
    displayOrder: data.displayOrder ?? 0,
    isFeatured: data.isFeatured ?? false,
    metadata: data.metadata || null,
  });
  
  const id = Number(result[0].insertId);
  const items = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
  return items[0];
}

export async function getPortfolioItemsByCollectionId(collectionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.collectionId, collectionId))
    .orderBy(portfolioItems.displayOrder, portfolioItems.createdAt);
}

export async function getPortfolioItemsByArtistId(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  // Join with collections to get all items for an artist
  const result = await db
    .select({
      item: portfolioItems,
      collection: portfolioCollections,
    })
    .from(portfolioItems)
    .innerJoin(portfolioCollections, eq(portfolioItems.collectionId, portfolioCollections.id))
    .where(eq(portfolioCollections.artistId, artistId))
    .orderBy(portfolioCollections.displayOrder, portfolioItems.displayOrder);

  return result;
}

export async function getFeaturedPortfolioItems(artistId: number, limit: number = 6) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      item: portfolioItems,
      collection: portfolioCollections,
    })
    .from(portfolioItems)
    .innerJoin(portfolioCollections, eq(portfolioItems.collectionId, portfolioCollections.id))
    .where(and(
      eq(portfolioCollections.artistId, artistId),
      eq(portfolioItems.isFeatured, true)
    ))
    .orderBy(portfolioItems.displayOrder)
    .limit(limit);

  return result;
}

export async function updatePortfolioItem(id: number, data: {
  title?: string;
  description?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.metadata !== undefined) updateData.metadata = data.metadata;

  if (Object.keys(updateData).length > 0) {
    await db.update(portfolioItems).set(updateData).where(eq(portfolioItems.id, id));
  }
}

export async function deletePortfolioItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
}

export async function reorderPortfolioItems(updates: Array<{ id: number; displayOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update each item's display order
  for (const update of updates) {
    await db
      .update(portfolioItems)
      .set({ displayOrder: update.displayOrder })
      .where(eq(portfolioItems.id, update.id));
  }
}
