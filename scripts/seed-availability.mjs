import { drizzle } from "drizzle-orm/mysql2";
import { availabilityWindows, artistSettings } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

/**
 * Seed availability windows and settings for sample artists
 * 
 * Sample artists (IDs 1-6):
 * 1. Elena Martinez - Painter
 * 2. Marcus Chen - Photographer  
 * 3. Sophia Anderson - Sculptor
 * 4. James Rodriguez - Musician
 * 5. Aria Thompson - Digital Artist
 * 6. Oliver Kim - Illustrator
 */

async function seedAvailability() {
  console.log("🌱 Seeding availability data for sample artists...\n");

  try {
    // Elena Martinez (Painter) - Available weekdays 10am-6pm EST
    console.log("Adding availability for Elena Martinez (Painter)...");
    await db.insert(availabilityWindows).values([
      { artistId: 1, dayOfWeek: 1, startTime: "10:00", endTime: "18:00", timezone: "America/New_York", isActive: true },
      { artistId: 1, dayOfWeek: 2, startTime: "10:00", endTime: "18:00", timezone: "America/New_York", isActive: true },
      { artistId: 1, dayOfWeek: 3, startTime: "10:00", endTime: "18:00", timezone: "America/New_York", isActive: true },
      { artistId: 1, dayOfWeek: 4, startTime: "10:00", endTime: "18:00", timezone: "America/New_York", isActive: true },
      { artistId: 1, dayOfWeek: 5, startTime: "10:00", endTime: "18:00", timezone: "America/New_York", isActive: true },
    ]);
    await db.insert(artistSettings).values({
      artistId: 1,
      bookingBufferMinutes: 30,
      advanceBookingDays: 60,
      cancellationPolicy: "48 hours notice required for full refund. Cancellations within 24 hours are non-refundable.",
    });

    // Marcus Chen (Photographer) - Available Tue-Sat 9am-5pm PST
    console.log("Adding availability for Marcus Chen (Photographer)...");
    await db.insert(availabilityWindows).values([
      { artistId: 2, dayOfWeek: 2, startTime: "09:00", endTime: "17:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 2, dayOfWeek: 3, startTime: "09:00", endTime: "17:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 2, dayOfWeek: 4, startTime: "09:00", endTime: "17:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 2, dayOfWeek: 5, startTime: "09:00", endTime: "17:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 2, dayOfWeek: 6, startTime: "09:00", endTime: "17:00", timezone: "America/Los_Angeles", isActive: true },
    ]);
    await db.insert(artistSettings).values({
      artistId: 2,
      bookingBufferMinutes: 60,
      advanceBookingDays: 45,
      cancellationPolicy: "72 hours notice required. Weather-related cancellations are rescheduled without penalty.",
    });

    // Sophia Anderson (Sculptor) - Available Mon-Fri 11am-7pm EST
    console.log("Adding availability for Sophia Anderson (Sculptor)...");
    await db.insert(availabilityWindows).values([
      { artistId: 3, dayOfWeek: 1, startTime: "11:00", endTime: "19:00", timezone: "America/New_York", isActive: true },
      { artistId: 3, dayOfWeek: 2, startTime: "11:00", endTime: "19:00", timezone: "America/New_York", isActive: true },
      { artistId: 3, dayOfWeek: 3, startTime: "11:00", endTime: "19:00", timezone: "America/New_York", isActive: true },
      { artistId: 3, dayOfWeek: 4, startTime: "11:00", endTime: "19:00", timezone: "America/New_York", isActive: true },
      { artistId: 3, dayOfWeek: 5, startTime: "11:00", endTime: "19:00", timezone: "America/New_York", isActive: true },
    ]);
    await db.insert(artistSettings).values({
      artistId: 3,
      bookingBufferMinutes: 0,
      advanceBookingDays: 90,
      cancellationPolicy: "One week notice required for consultations. Commission cancellations subject to 50% deposit forfeiture.",
    });

    // James Rodriguez (Musician) - Available evenings and weekends
    console.log("Adding availability for James Rodriguez (Musician)...");
    await db.insert(availabilityWindows).values([
      { artistId: 4, dayOfWeek: 1, startTime: "18:00", endTime: "21:00", timezone: "America/Chicago", isActive: true },
      { artistId: 4, dayOfWeek: 3, startTime: "18:00", endTime: "21:00", timezone: "America/Chicago", isActive: true },
      { artistId: 4, dayOfWeek: 5, startTime: "18:00", endTime: "21:00", timezone: "America/Chicago", isActive: true },
      { artistId: 4, dayOfWeek: 6, startTime: "10:00", endTime: "18:00", timezone: "America/Chicago", isActive: true },
      { artistId: 4, dayOfWeek: 0, startTime: "12:00", endTime: "17:00", timezone: "America/Chicago", isActive: true },
    ]);
    await db.insert(artistSettings).values({
      artistId: 4,
      bookingBufferMinutes: 15,
      advanceBookingDays: 30,
      cancellationPolicy: "24 hours notice required. Same-day cancellations forfeit 50% of lesson fee.",
    });

    // Aria Thompson (Digital Artist) - Flexible schedule, available most days
    console.log("Adding availability for Aria Thompson (Digital Artist)...");
    await db.insert(availabilityWindows).values([
      { artistId: 5, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", timezone: "America/Denver", isActive: true },
      { artistId: 5, dayOfWeek: 2, startTime: "09:00", endTime: "17:00", timezone: "America/Denver", isActive: true },
      { artistId: 5, dayOfWeek: 3, startTime: "09:00", endTime: "17:00", timezone: "America/Denver", isActive: true },
      { artistId: 5, dayOfWeek: 4, startTime: "09:00", endTime: "17:00", timezone: "America/Denver", isActive: true },
      { artistId: 5, dayOfWeek: 5, startTime: "09:00", endTime: "17:00", timezone: "America/Denver", isActive: true },
      { artistId: 5, dayOfWeek: 6, startTime: "13:00", endTime: "17:00", timezone: "America/Denver", isActive: true },
    ]);
    await db.insert(artistSettings).values({
      artistId: 5,
      bookingBufferMinutes: 0,
      advanceBookingDays: 60,
      cancellationPolicy: "48 hours notice required. Consultations can be rescheduled once without penalty.",
    });

    // Oliver Kim (Illustrator) - Available weekdays 8am-4pm PST
    console.log("Adding availability for Oliver Kim (Illustrator)...");
    await db.insert(availabilityWindows).values([
      { artistId: 6, dayOfWeek: 1, startTime: "08:00", endTime: "16:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 6, dayOfWeek: 2, startTime: "08:00", endTime: "16:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 6, dayOfWeek: 3, startTime: "08:00", endTime: "16:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 6, dayOfWeek: 4, startTime: "08:00", endTime: "16:00", timezone: "America/Los_Angeles", isActive: true },
      { artistId: 6, dayOfWeek: 5, startTime: "08:00", endTime: "16:00", timezone: "America/Los_Angeles", isActive: true },
    ]);
    await db.insert(artistSettings).values({
      artistId: 6,
      bookingBufferMinutes: 30,
      advanceBookingDays: 45,
      cancellationPolicy: "One week notice required for commission consultations. Lessons can be cancelled 24 hours in advance.",
    });

    console.log("\n✅ Availability data seeded successfully!");
    console.log("\nSummary:");
    console.log("- Elena Martinez: Mon-Fri 10am-6pm EST (30min buffer, 60 days advance)");
    console.log("- Marcus Chen: Tue-Sat 9am-5pm PST (60min buffer, 45 days advance)");
    console.log("- Sophia Anderson: Mon-Fri 11am-7pm EST (no buffer, 90 days advance)");
    console.log("- James Rodriguez: Evenings + weekends CST (15min buffer, 30 days advance)");
    console.log("- Aria Thompson: Mon-Sat flexible MST (no buffer, 60 days advance)");
    console.log("- Oliver Kim: Mon-Fri 8am-4pm PST (30min buffer, 45 days advance)");

  } catch (error) {
    console.error("❌ Error seeding availability data:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedAvailability();
