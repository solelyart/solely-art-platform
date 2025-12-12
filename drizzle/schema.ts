import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with artist/client functionality.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["client", "artist", "both"]).default("client").notNull(),
  profilePhotoUrl: text("profilePhotoUrl"), // S3 URL for profile photo
  profilePhotoKey: varchar("profilePhotoKey", { length: 512 }), // S3 key for deletion
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Artist profiles with portfolio and service information
 */
export const artistProfiles = mysqlTable("artistProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  categories: text("categories").notNull(), // JSON array of category IDs
  portfolioImages: text("portfolioImages"), // JSON array of S3 URLs
  hourlyRate: int("hourlyRate"), // in cents
  isAvailable: boolean("isAvailable").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("artist_profiles_user_id_idx").on(table.userId),
}));

export type ArtistProfile = typeof artistProfiles.$inferSelect;
export type InsertArtistProfile = typeof artistProfiles.$inferInsert;

/**
 * Service categories (painting, photography, music, etc.)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Booking requests from clients to artists
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  artistId: int("artistId").notNull(),
  serviceDescription: text("serviceDescription").notNull(),
  requestedDate: timestamp("requestedDate").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "completed", "cancelled"]).default("pending").notNull(),
  budget: int("budget"), // in cents
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("bookings_client_id_idx").on(table.clientId),
  artistIdIdx: index("bookings_artist_id_idx").on(table.artistId),
  statusIdx: index("bookings_status_idx").on(table.status),
  createdAtIdx: index("bookings_created_at_idx").on(table.createdAt),
}));

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Reviews and ratings for completed bookings
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull().unique(),
  clientId: int("clientId").notNull(),
  artistId: int("artistId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  artistIdIdx: index("reviews_artist_id_idx").on(table.artistId),
  bookingIdIdx: index("reviews_booking_id_idx").on(table.bookingId),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Artist services (bookable offerings)
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // in cents
  durationMinutes: int("durationMinutes").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  artistIdIdx: index("services_artist_id_idx").on(table.artistId),
  isActiveIdx: index("services_is_active_idx").on(table.isActive),
}));

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Artist availability windows (recurring weekly schedule)
 */
export const availabilityWindows = mysqlTable("availabilityWindows", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0-6 (0 = Sunday)
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM format
  timezone: varchar("timezone", { length: 64 }).notNull(), // IANA timezone (e.g., America/New_York)
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  artistIdIdx: index("availability_windows_artist_id_idx").on(table.artistId),
  dayOfWeekIdx: index("availability_windows_day_of_week_idx").on(table.dayOfWeek),
}));

export type AvailabilityWindow = typeof availabilityWindows.$inferSelect;
export type InsertAvailabilityWindow = typeof availabilityWindows.$inferInsert;

/**
 * Temporary slot locks (prevents double-booking during checkout)
 */
export const slotLocks = mysqlTable("slotLocks", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format
  durationMinutes: int("durationMinutes").notNull(),
  lockedBy: int("lockedBy").notNull(), // user ID
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  artistIdIdx: index("slot_locks_artist_id_idx").on(table.artistId),
  dateIdx: index("slot_locks_date_idx").on(table.date),
  expiresAtIdx: index("slot_locks_expires_at_idx").on(table.expiresAt),
  lockedByIdx: index("slot_locks_locked_by_idx").on(table.lockedBy),
}));

export type SlotLock = typeof slotLocks.$inferSelect;
export type InsertSlotLock = typeof slotLocks.$inferInsert;

/**
 * Artist booking settings and policies
 */
export const artistSettings = mysqlTable("artistSettings", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull().unique(),
  bookingBufferMinutes: int("bookingBufferMinutes").default(0).notNull(),
  advanceBookingDays: int("advanceBookingDays").default(30).notNull(),
  cancellationPolicy: text("cancellationPolicy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  artistIdIdx: index("artist_settings_artist_id_idx").on(table.artistId),
}));

export type ArtistSetting = typeof artistSettings.$inferSelect;
export type InsertArtistSetting = typeof artistSettings.$inferInsert;

/**
 * Blackout dates (artist unavailable dates)
 */
export const blackoutDates = mysqlTable("blackoutDates", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull(),
  startDate: timestamp("startDate").notNull(), // Start of blackout period
  endDate: timestamp("endDate").notNull(), // End of blackout period
  reason: varchar("reason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  artistIdIdx: index("blackout_dates_artist_id_idx").on(table.artistId),
}));

export type BlackoutDate = typeof blackoutDates.$inferSelect;
export type InsertBlackoutDate = typeof blackoutDates.$inferInsert;
