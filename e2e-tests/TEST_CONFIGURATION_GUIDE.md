# Playwright Test Configuration Guide

## Overview

This guide explains how to configure the Playwright testing environment for the Solely Art platform, including test users, environment variables, and test data setup.

---

## Environment Configuration

### Existing Platform Configuration ✅

The Solely Art platform already has these configured:

- **Stripe Integration**: Test mode enabled with `VITE_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
- **Database**: PostgreSQL/MySQL database with Drizzle ORM
- **Authentication**: Manus OAuth with session management
- **Dev Server**: Running on port 3001 (https://3001-i2n72hz3d5qj5wiu5d2aq-60e4fd42.manusvm.computer)

### Required Test Configuration

Create a `.env.test` file in the project root with:

```bash
# Application URL (use the actual dev server URL)
BASE_URL=https://3001-i2n72hz3d5qj5wiu5d2aq-60e4fd42.manusvm.computer

# Test User Credentials (to be created)
TEST_CLIENT_EMAIL=playwright-client@test.com
TEST_CLIENT_PASSWORD=TestClient123!

TEST_ARTIST_EMAIL=playwright-artist@test.com
TEST_ARTIST_PASSWORD=TestArtist123!

TEST_ADMIN_EMAIL=playwright-admin@test.com
TEST_ADMIN_PASSWORD=TestAdmin123!

# Stripe Test Configuration (already configured in platform)
STRIPE_TEST_CARD_SUCCESS=4242424242424242
STRIPE_TEST_CARD_DECLINE=4000000000000002
STRIPE_TEST_CARD_3DS=4000002500003155

# Performance Thresholds
PERFORMANCE_PAGE_LOAD_MAX=3000
PERFORMANCE_API_RESPONSE_MAX=500

# Test Configuration
HEADLESS=true
SLOW_MO=0
RUN_VISUAL_REGRESSION=false
RUN_ACCESSIBILITY_TESTS=true
```

---

## Test User Setup

### Required Test Users

You need to create 3 test users in the platform:

#### 1. Test Client User
- **Email**: `playwright-client@test.com`
- **Password**: `TestClient123!`
- **Role**: Regular client (user)
- **Purpose**: Testing booking flow, search, reviews

#### 2. Test Artist User
- **Email**: `playwright-artist@test.com`
- **Password**: `TestArtist123!`
- **Role**: Artist with complete profile
- **Purpose**: Testing artist dashboard, booking management, portfolio

**Artist Profile Requirements**:
- Display Name: "Test Artist"
- Bio: "Professional test artist for automated testing"
- Categories: At least 2 categories selected
- Location: "Raleigh, NC"
- Hourly Rate: $100/hour
- Portfolio: At least 3 images uploaded
- Services: At least 2 services created

#### 3. Test Admin User
- **Email**: `playwright-admin@test.com`
- **Password**: `TestAdmin123!`
- **Role**: Admin
- **Purpose**: Testing admin features (if implemented)

---

## Creating Test Users

### Option 1: Manual Creation (Recommended for Initial Setup)

1. **Start the dev server** (already running)
2. **Sign up through the UI**:
   - Go to the application URL
   - Click "Sign In" → Create account via Manus OAuth
   - Use the test email addresses above
3. **Set up artist profile** (for test artist):
   - Navigate to "Become an Artist"
   - Complete the artist onboarding form
   - Upload portfolio images
   - Create services

### Option 2: Database Seeding Script (Automated)

Create a seed script to automatically create test users:

```typescript
// scripts/seed-test-users.ts
import { db } from '../server/db';
import { users, artists, services } from '../drizzle/schema';
import bcrypt from 'bcryptjs';

async function seedTestUsers() {
  // Create test client
  const clientUser = await db.insert(users).values({
    email: 'playwright-client@test.com',
    name: 'Test Client',
    role: 'user',
  }).returning();

  // Create test artist user
  const artistUser = await db.insert(users).values({
    email: 'playwright-artist@test.com',
    name: 'Test Artist',
    role: 'user',
  }).returning();

  // Create artist profile
  const artistProfile = await db.insert(artists).values({
    userId: artistUser[0].id,
    displayName: 'Test Artist',
    bio: 'Professional test artist for automated testing',
    location: 'Raleigh, NC',
    hourlyRate: 10000, // $100 in cents
    categories: [1, 2], // Adjust based on your category IDs
    portfolioImages: JSON.stringify([
      'https://example.com/test1.jpg',
      'https://example.com/test2.jpg',
      'https://example.com/test3.jpg',
    ]),
    isActive: true,
  }).returning();

  // Create test services
  await db.insert(services).values([
    {
      artistId: artistProfile[0].id,
      name: 'Portrait Session',
      description: 'Professional portrait photography session',
      price: 15000, // $150
      durationMinutes: 60,
    },
    {
      artistId: artistProfile[0].id,
      name: 'Event Coverage',
      description: 'Full event photography coverage',
      price: 50000, // $500
      durationMinutes: 240,
    },
  ]);

  console.log('✅ Test users created successfully');
}

seedTestUsers().catch(console.error);
```

Run with: `tsx scripts/seed-test-users.ts`

---

## Playwright Configuration

The `playwright.config.ts` file is already configured with:

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: Configured from environment variable
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: 4 workers
- **Timeout**: 30 seconds per test
- **Screenshots**: On failure
- **Videos**: On first retry

### Authentication State

Playwright uses authentication fixtures to maintain logged-in state:

```typescript
// e2e-tests/fixtures/auth.fixture.ts
// Automatically handles login for different user roles
```

---

## Running Tests

### Local Development

```bash
# Run all tests
pnpm test:e2e

# Run specific test suite
pnpm test:e2e tests/functional/booking-workflow.spec.ts

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run in debug mode
pnpm test:e2e --debug

# Run specific browser
pnpm test:e2e --project=chromium
```

### CI/CD (GitHub Actions)

Tests run automatically on:
- Pull requests to `main` branch
- Pushes to `main` branch
- Manual workflow dispatch

---

## Test Data Management

### Cleanup Strategy

After each test run, clean up test data:

```typescript
// Clean up test bookings
await db.delete(bookings).where(
  or(
    eq(bookings.clientId, testClientId),
    eq(bookings.artistId, testArtistId)
  )
);
```

### Isolation

Each test should:
- Use unique test data when possible
- Clean up after itself
- Not depend on other tests
- Be idempotent (can run multiple times)

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Element not found"
- **Solution**: Check that data-testid attributes are present in components
- **Check**: Review TEST_ID_IMPLEMENTATION_COMPLETE.md for added test IDs

**Issue**: Authentication fails
- **Solution**: Verify test user credentials in .env.test
- **Check**: Ensure test users exist in database

**Issue**: Stripe payments fail
- **Solution**: Verify Stripe test mode is enabled
- **Check**: Use test card numbers (4242 4242 4242 4242)

**Issue**: Tests timeout
- **Solution**: Increase timeout in playwright.config.ts
- **Check**: Verify dev server is running and accessible

---

## Next Steps

1. ✅ Create .env.test file with configuration
2. ✅ Create test users (manual or via seed script)
3. ✅ Verify test users can log in
4. ✅ Run initial test suite
5. ✅ Fix any failing tests
6. ✅ Set up CI/CD pipeline
7. ✅ Create Monday.com QA board

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
