/**
 * Playwright Test Environment Configuration
 * 
 * This file contains all environment-specific configuration for Playwright tests.
 * Update these values based on your test environment.
 */

export const testConfig = {
  // Application URLs
  baseUrl: process.env.BASE_URL || 'https://3001-i2n72hz3d5qj5wiu5d2aq-60e4fd42.manusvm.computer',
  apiUrl: process.env.API_URL || 'https://3001-i2n72hz3d5qj5wiu5d2aq-60e4fd42.manusvm.computer/api',
  
  // Test User Credentials
  // TODO: Create these test users in the platform before running tests
  testUsers: {
    client: {
      email: process.env.TEST_CLIENT_EMAIL || 'playwright-client@test.com',
      password: process.env.TEST_CLIENT_PASSWORD || 'TestClient123!',
      name: 'Test Client',
    },
    artist: {
      email: process.env.TEST_ARTIST_EMAIL || 'playwright-artist@test.com',
      password: process.env.TEST_ARTIST_PASSWORD || 'TestArtist123!',
      name: 'Test Artist',
      displayName: 'Test Artist',
      bio: 'Professional test artist for automated testing',
      location: 'Raleigh, NC',
      hourlyRate: 100,
    },
    admin: {
      email: process.env.TEST_ADMIN_EMAIL || 'playwright-admin@test.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'TestAdmin123!',
      name: 'Test Admin',
    },
  },

  // Stripe Test Configuration
  stripe: {
    // Test card numbers (no real charges)
    testCards: {
      success: '4242424242424242',
      decline: '4000000000000002',
      requiresAuth: '4000002500003155',
      insufficientFunds: '4000000000009995',
    },
    testCvc: '123',
    testExpiry: {
      month: '12',
      year: '2030',
    },
    testZip: '27601',
  },

  // Performance Testing Thresholds (milliseconds)
  performance: {
    pageLoadMax: parseInt(process.env.PERFORMANCE_PAGE_LOAD_MAX || '3000'),
    apiResponseMax: parseInt(process.env.PERFORMANCE_API_RESPONSE_MAX || '500'),
    firstContentfulPaintMax: parseInt(process.env.PERFORMANCE_FIRST_CONTENTFUL_PAINT_MAX || '1500'),
  },

  // Test Configuration
  test: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    runVisualRegression: process.env.RUN_VISUAL_REGRESSION === 'true',
    runAccessibilityTests: process.env.RUN_ACCESSIBILITY_TESTS !== 'false',
    timeout: 30000, // 30 seconds
    retries: process.env.CI === 'true' ? 2 : 0,
  },

  // Test Data
  testData: {
    searchQuery: 'portrait',
    category: 'Photography',
    location: 'Raleigh',
    minPrice: 50,
    maxPrice: 200,
    
    // Test booking data
    booking: {
      serviceName: 'Portrait Session',
      duration: 60,
      budget: 150,
      notes: 'This is a test booking created by Playwright automated tests.',
    },

    // Test review data
    review: {
      rating: 5,
      comment: 'Excellent service! This is a test review created by Playwright automated tests.',
    },
  },
};

// Export individual sections for convenience
export const { baseUrl, apiUrl, testUsers, stripe, performance, test, testData } = testConfig;

// Helper function to get login URL
export function getLoginUrl(redirectTo?: string) {
  const redirect = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
  return `${baseUrl}/login${redirect}`;
}

// Helper function to check if running in CI
export function isCI() {
  return process.env.CI === 'true';
}

// Helper function to get test user by role
export function getTestUser(role: 'client' | 'artist' | 'admin') {
  return testUsers[role];
}
