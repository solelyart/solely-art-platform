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
  slotLocks
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
    .select()
    .from(artistProfiles)
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
  return result;
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

export async function createAvailabilityWindow(data: {
  artistId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(availabilityWindows).values(data);
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

  await db.insert(blackoutDates).values(data);
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

// ============================================================================
// Artist Settings
// ============================================================================

export async function createArtistSettings(data: {
  artistId: number;
  bookingBufferMinutes?: number;
  advanceBookingDays?: number;
  cancellationPolicy?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(artistSettings).values(data);
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
  await db.delete(slotLocks).where(lt(slotLocks.expiresAt, now));
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
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T23:59:59");
  
  // Ensure start date is not before end date
  if (start > end) return [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day for comparison
  
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + advanceBookingDays);

  // Start from today if start date is in the past
  let currentDate = start < today ? new Date(today) : new Date(start);
  
  while (currentDate <= end && currentDate <= maxDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday

    // Check if this day has availability windows
    const dayWindows = windowsByDay.get(dayOfWeek);
    if (!dayWindows || dayWindows.length === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Check if date is in blackout period
    const isBlackedOut = blackouts.some(blackout => {
      const blackoutStart = new Date(blackout.startDate);
      const blackoutEnd = new Date(blackout.endDate);
      return currentDate >= blackoutStart && currentDate <= blackoutEnd;
    });

    if (isBlackedOut) {
      currentDate.setDate(currentDate.getDate() + 1);
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

    currentDate.setDate(currentDate.getDate() + 1);
  }

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
