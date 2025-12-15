/**
 * Playwright Test Environment Configuration
 * 
 * This file contains all environment-specific configuration for Playwright tests.
 * Update these values based on your test environment.
 */

export const testConfig = {
  // Application URLs
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3000/api',
  
  // Test User Credentials
  // TODO: Create these test users in the platform before running tests
  testUsers: {
    client: {
      email: process.env.TEST_CLIENT_EMAIL || 'playwright-client@test.com',
      password: process.env.TEST_CLIENT_PASSWORD || 'TestClient123!',
      openId: process.env.TEST_CLIENT_OPENID || 'test-client-openid-12345',
      name: 'Test Client',
    },
    artist: {
      email: process.env.TEST_ARTIST_EMAIL || 'playwright-artist@test.com',
      password: process.env.TEST_ARTIST_PASSWORD || 'TestArtist123!',
      openId: process.env.TEST_ARTIST_OPENID || 'test-artist-openid-67890',
      name: 'Test Artist',
      displayName: 'Test Artist',
      bio: 'Professional test artist for automated testing',
      location: 'Raleigh, NC',
      hourlyRate: 100,
    },
    admin: {
      email: process.env.TEST_ADMIN_EMAIL || 'playwright-admin@test.com',
      password: process.env.TEST_ADMIN_PASSWORD || 'TestAdmin123!',
      openId: process.env.TEST_ADMIN_OPENID || 'test-admin-openid-11111',
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
  // Development thresholds are 30-50% more lenient than production to account for:
  // - Unoptimized development builds
  // - Cold start overhead
  // - Local resource constraints
  // - Source maps and debugging code
  // Production should use stricter thresholds aligned with Google Core Web Vitals
  performance: {
    // Page Load Performance (Development: +33% from production baseline)
    pageLoadMax: parseInt(process.env.PERFORMANCE_PAGE_LOAD_MAX || '4000'), // Prod: 3000ms
    firstContentfulPaintMax: parseInt(process.env.PERFORMANCE_FIRST_CONTENTFUL_PAINT_MAX || '2000'), // Prod: 1500ms
    
    // Core Web Vitals (Relaxed for development)
    largestContentfulPaintMax: parseInt(process.env.PERFORMANCE_LCP_MAX || '3500'), // Prod: 2500ms (Google "good")
    timeToInteractiveMax: parseInt(process.env.PERFORMANCE_TTI_MAX || '6000'), // Prod: 5000ms (Google budget)
    
    // API Performance
    apiResponseMax: parseInt(process.env.PERFORMANCE_API_RESPONSE_MAX || '1000'), // Prod: 500ms
    apiResponseSlowNetwork: parseInt(process.env.PERFORMANCE_API_SLOW_NETWORK_MAX || '3000'), // For 3G simulation
    
    // Resource Loading
    imageLoadMax: parseInt(process.env.PERFORMANCE_IMAGE_LOAD_MAX || '3000'), // Prod: 2000ms
    bundleSizeMax: parseInt(process.env.PERFORMANCE_BUNDLE_SIZE_MAX || String(600 * 1024)), // Prod: 500KB
    searchResultsMax: parseInt(process.env.PERFORMANCE_SEARCH_MAX || '2500'), // Prod: 2000ms
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
