import { Page, expect } from '@playwright/test';

/**
 * Utility Helper Functions for Playwright Tests
 * 
 * Common operations used across different test types
 */

/**
 * Wait for API response with specific criteria
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  expectedStatus: number = 200
) {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      const status = response.status();
      const matchesUrl = typeof urlPattern === 'string' 
        ? url.includes(urlPattern) 
        : urlPattern.test(url);
      return matchesUrl && status === expectedStatus;
    },
    { timeout: 10000 }
  );
  return response;
}

/**
 * Fill form with data object
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [name, value] of Object.entries(formData)) {
    await page.fill(`input[name="${name}"], textarea[name="${name}"]`, value);
  }
}

/**
 * Select date in date picker
 */
export async function selectDate(page: Page, selector: string, date: Date) {
  await page.click(selector);
  
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();

  // Navigate to correct year and month
  await page.selectOption('[data-testid="year-select"]', year.toString());
  await page.selectOption('[data-testid="month-select"]', month);

  // Click on the day
  await page.click(`[data-date="${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}"]`);
}

/**
 * Select time slot
 */
export async function selectTimeSlot(page: Page, time: string) {
  await page.click(`[data-testid="time-slot"][data-time="${time}"]`);
}

/**
 * Complete Stripe payment form
 */
export async function completeStripePayment(
  page: Page,
  cardNumber: string = '4242424242424242',
  expiry: string = '12/25',
  cvc: string = '123',
  zip: string = '12345'
) {
  // Wait for Stripe iframe to load
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');

  // Fill card details
  await stripeFrame.locator('input[name="cardnumber"]').fill(cardNumber);
  await stripeFrame.locator('input[name="exp-date"]').fill(expiry);
  await stripeFrame.locator('input[name="cvc"]').fill(cvc);
  await stripeFrame.locator('input[name="postal"]').fill(zip);
}

/**
 * Measure page load performance
 */
export async function measurePageLoadTime(page: Page): Promise<number> {
  const performanceTiming = await page.evaluate(() => {
    const timing = performance.timing;
    return timing.loadEventEnd - timing.navigationStart;
  });
  return performanceTiming;
}

/**
 * Measure API response time
 */
export async function measureAPIResponseTime(
  page: Page,
  apiCall: () => Promise<void>
): Promise<number> {
  const startTime = Date.now();
  await apiCall();
  const endTime = Date.now();
  return endTime - startTime;
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string,
  path: string = './reports/screenshots'
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `${path}/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * Verify no console errors
 */
export async function verifyNoConsoleErrors(page: Page) {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return {
    getErrors: () => errors,
    assertNoErrors: () => {
      expect(errors).toHaveLength(0);
    },
  };
}

/**
 * Wait for element to be stable (not animating)
 */
export async function waitForStableElement(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible' });
  
  // Wait for animations to complete
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      const rect1 = element.getBoundingClientRect();
      return new Promise((resolve) => {
        setTimeout(() => {
          const rect2 = element.getBoundingClientRect();
          resolve(
            rect1.top === rect2.top &&
            rect1.left === rect2.left &&
            rect1.width === rect2.width &&
            rect1.height === rect2.height
          );
        }, 100);
      });
    },
    selector
  );
}

/**
 * Simulate network conditions
 */
export async function simulateNetworkConditions(
  page: Page,
  preset: 'slow3g' | 'fast3g' | '4g' | 'offline'
) {
  const profiles = {
    slow3g: { downloadThroughput: 50 * 1024, uploadThroughput: 50 * 1024, latency: 2000 },
    fast3g: { downloadThroughput: 1.6 * 1024 * 1024, uploadThroughput: 750 * 1024, latency: 562.5 },
    '4g': { downloadThroughput: 4 * 1024 * 1024, uploadThroughput: 3 * 1024 * 1024, latency: 20 },
    offline: { downloadThroughput: 0, uploadThroughput: 0, latency: 0 },
  };

  const profile = profiles[preset];
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: preset === 'offline',
    downloadThroughput: profile.downloadThroughput,
    uploadThroughput: profile.uploadThroughput,
    latency: profile.latency,
  });
}

/**
 * Generate random test data
 */
export function generateTestData() {
  const timestamp = Date.now();
  return {
    email: `test-${timestamp}@example.com`,
    firstName: `Test${timestamp}`,
    lastName: `User${timestamp}`,
    phone: `555${String(timestamp).slice(-7)}`,
    password: 'TestPassword123!',
  };
}

/**
 * Create a booking (helper for multiple test types)
 */
export async function createBooking(
  page: Page,
  artistName: string,
  date: Date,
  time: string,
  duration: number = 60
) {
  // Search for artist
  await page.goto('/search');
  await page.fill('[data-testid="search-input"]', artistName);
  await page.click('[data-testid="search-button"]');

  // Select artist
  await page.click(`[data-testid="artist-card"]:has-text("${artistName}")`);

  // Select date and time
  await selectDate(page, '[data-testid="date-picker"]', date);
  await selectTimeSlot(page, time);

  // Select duration
  await page.selectOption('[data-testid="duration-select"]', duration.toString());

  // Proceed to booking
  await page.click('[data-testid="book-now-button"]');

  // Wait for booking confirmation
  await page.waitForURL('**/booking/**');
}


/**
 * Navigate to an artist that has services configured (Elena Martinez - artist ID 1)
 * This ensures booking flow tests work correctly with an artist that has services
 */
export async function navigateToTestArtist(page: Page) {
  // Navigate directly to Elena Martinez (artist ID 1) who has services configured
  await page.goto('/artist/1');
  
  // Wait for artist profile to load
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="artist-name"], h1, h2', { timeout: 10000 });
}

/**
 * Navigate to the booking page for an artist
 * Handles the navigation from artist profile to booking page
 */
export async function navigateToBookingPage(page: Page) {
  // Extract artist ID from current URL or default to 1
  const currentUrl = page.url();
  const artistId = currentUrl.match(/\/artist\/(\d+)/)?.[1] || '1';
  
  // Navigate directly to booking page
  await page.goto(`/book/${artistId}`);
  
  // Wait for booking page to load
  await page.waitForLoadState('networkidle');
}

/**
 * Select a service on the booking page
 * Required before selecting date/time
 */
export async function selectService(page: Page, serviceName?: string) {
  // Wait for services to load
  await page.waitForSelector('[data-testid="service-card"], [data-testid="service-option"]', { timeout: 5000 }).catch(() => {
    console.log('No service cards found, services may not be configured');
  });
  
  if (serviceName) {
    // Click specific service by name
    await page.click(`[data-testid="service-card"]:has-text("${serviceName}"), [data-testid="service-option"]:has-text("${serviceName}")`);
  } else {
    // Click first available service
    const serviceCard = page.locator('[data-testid="service-card"], [data-testid="service-option"]').first();
    if (await serviceCard.count() > 0) {
      await serviceCard.click();
    }
  }
}
