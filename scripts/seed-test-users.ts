/**
 * Seed Test Users for Playwright E2E Testing
 * 
 * Creates 3 test users:
 * 1. Test Client - Regular user for booking tests
 * 2. Test Artist - Artist with complete profile for booking management tests
 * 3. Test Admin - Admin user for admin feature tests
 */

import { getDb } from '../server/db';
import { users, artistProfiles, services } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const TEST_USERS = {
  client: {
    email: 'playwright-client@test.com',
    name: 'Test Client',
    openId: 'test-client-openid-12345',
    role: 'user' as const,
  },
  artist: {
    email: 'playwright-artist@test.com',
    name: 'Test Artist',
    openId: 'test-artist-openid-67890',
    role: 'user' as const,
  },
  janeDoe: {
    email: 'jane.doe@test.com',
    name: 'Jane Doe',
    openId: 'jane-doe-openid-99999',
    role: 'user' as const,
  },
  admin: {
    email: 'playwright-admin@test.com',
    name: 'Test Admin',
    openId: 'test-admin-openid-11111',
    role: 'admin' as const,
  },
};

const ARTIST_PROFILE = {
  displayName: 'Test Artist',
  bio: 'Professional test artist for automated Playwright testing. This profile is used exclusively for E2E test scenarios and should not be used for production bookings.',
  location: 'Raleigh, NC',
  hourlyRate: 10000, // $100.00 in cents
  categories: JSON.stringify([1, 2]), // JSON string format
  portfolioImages: JSON.stringify([
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
  ]),
  isAvailable: true,
};

const JANE_DOE_PROFILE = {
  displayName: 'Jane Doe',
  bio: 'Talented artist specializing in portrait photography and digital art. Available for commissions and custom projects.',
  location: 'New York, NY',
  hourlyRate: 12000, // $120.00 in cents
  categories: JSON.stringify([1, 3]), // Different categories
  portfolioImages: JSON.stringify([
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
  ]),
  isAvailable: true,
};

const TEST_SERVICES = [
  {
    name: 'Portrait Session',
    description: 'Professional portrait photography session for testing booking flow',
    price: 15000, // $150.00
    durationMinutes: 60,
  },
  {
    name: 'Event Coverage',
    description: 'Full event photography coverage for testing extended bookings',
    price: 50000, // $500.00
    durationMinutes: 240,
  },
];

async function seedTestUsers() {
  console.log('🌱 Seeding test users for Playwright E2E testing...\n');

  const db = await getDb();

  try {
    // 1. Create Test Client User
    console.log('Creating test client user...');
    const [existingClient] = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_USERS.client.email))
      .limit(1);

    let clientUser;
    if (existingClient) {
      console.log('  ⚠️  Test client user already exists, skipping...');
      clientUser = existingClient;
    } else {
      const result = await db.insert(users).values(TEST_USERS.client);
      // Fetch the created user
      [clientUser] = await db.select().from(users).where(eq(users.email, TEST_USERS.client.email)).limit(1);
      console.log('  ✅ Test client user created:', TEST_USERS.client.email);
    }

    // 2. Create Test Artist User
    console.log('\nCreating test artist user...');
    const [existingArtist] = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_USERS.artist.email))
      .limit(1);

    let artistUser;
    if (existingArtist) {
      console.log('  ⚠️  Test artist user already exists, skipping...');
      artistUser = existingArtist;
    } else {
      await db.insert(users).values(TEST_USERS.artist);
      // Fetch the created user
      [artistUser] = await db.select().from(users).where(eq(users.email, TEST_USERS.artist.email)).limit(1);
      console.log('  ✅ Test artist user created:', TEST_USERS.artist.email);
    }

    // 3. Create Artist Profile
    console.log('\nCreating artist profile...');
    const [existingProfile] = await db
      .select()
      .from(artistProfiles)
      .where(eq(artistProfiles.userId, artistUser.id))
      .limit(1);

    let artistProfile;
    if (existingProfile) {
      console.log('  ⚠️  Artist profile already exists, skipping...');
      artistProfile = existingProfile;
    } else {
      await db
        .insert(artistProfiles)
        .values({
          ...ARTIST_PROFILE,
          userId: artistUser.id,
        });
      // Fetch the created profile
      [artistProfile] = await db.select().from(artistProfiles).where(eq(artistProfiles.userId, artistUser.id)).limit(1);
      console.log('  ✅ Artist profile created for:', ARTIST_PROFILE.displayName);
    }

    // 4. Create Test Services
    console.log('\nCreating test services...');
    const existingServices = await db
      .select()
      .from(services)
      .where(eq(services.artistId, artistProfile.id));

    if (existingServices.length > 0) {
      console.log(`  ⚠️  ${existingServices.length} services already exist, skipping...`);
    } else {
      const servicesToCreate = TEST_SERVICES.map((service) => ({
        ...service,
        artistId: artistProfile.id,
      }));

      await db.insert(services).values(servicesToCreate);
      console.log(`  ✅ Created ${servicesToCreate.length} test services`);
      servicesToCreate.forEach((service) => {
        console.log(`     - ${service.name} ($${service.price / 100})`);
      });
    }

    // 5. Create Jane Doe Artist User
    console.log('\nCreating Jane Doe artist user...');
    const [existingJaneDoe] = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_USERS.janeDoe.email))
      .limit(1);

    let janeDoeUser;
    if (existingJaneDoe) {
      console.log('  ⚠️  Jane Doe user already exists, skipping...');
      janeDoeUser = existingJaneDoe;
    } else {
      await db.insert(users).values(TEST_USERS.janeDoe);
      [janeDoeUser] = await db.select().from(users).where(eq(users.email, TEST_USERS.janeDoe.email)).limit(1);
      console.log('  ✅ Jane Doe user created:', TEST_USERS.janeDoe.email);
    }

    // 6. Create Jane Doe Artist Profile
    console.log('\nCreating Jane Doe artist profile...');
    const [existingJaneDoeProfile] = await db
      .select()
      .from(artistProfiles)
      .where(eq(artistProfiles.userId, janeDoeUser.id))
      .limit(1);

    if (existingJaneDoeProfile) {
      console.log('  ⚠️  Jane Doe profile already exists, skipping...');
    } else {
      await db
        .insert(artistProfiles)
        .values({
          ...JANE_DOE_PROFILE,
          userId: janeDoeUser.id,
        });
      console.log('  ✅ Jane Doe artist profile created');
    }

    // 7. Create Test Admin User
    console.log('\nCreating test admin user...');
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_USERS.admin.email))
      .limit(1);

    if (existingAdmin) {
      console.log('  ⚠️  Test admin user already exists, skipping...');
    } else {
      await db.insert(users).values(TEST_USERS.admin);
      console.log('  ✅ Test admin user created:', TEST_USERS.admin.email);
    }

    console.log('\n✅ Test user seeding complete!\n');
    console.log('📝 Test User Credentials:');
    console.log('   Client: playwright-client@test.com (openId: test-client-openid-12345)');
    console.log('   Artist: playwright-artist@test.com (openId: test-artist-openid-67890)');
    console.log('   Admin:  playwright-admin@test.com (openId: test-admin-openid-11111)');
    console.log('\n⚠️  Note: These users use Manus OAuth. You may need to configure');
    console.log('   Playwright to authenticate with these openIds for testing.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    process.exit(1);
  }
}

// Run the seed script
seedTestUsers();
