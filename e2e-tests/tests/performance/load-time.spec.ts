import { test, expect } from '../../fixtures/auth.fixture';
import { measurePageLoadTime, measureAPIResponseTime } from '../../utils/helpers';

/**
 * PERFORMANCE TESTING
 * 
 * Performance tests evaluate how the system performs in terms of responsiveness
 * and stability under a particular workload.
 * 
 * Purpose: Ensure the application meets performance requirements and
 * identify performance bottlenecks.
 * 
 * Key Metrics:
 * - Page load time
 * - Time to First Contentful Paint (FCP)
 * - Time to Interactive (TTI)
 * - API response time
 * - Resource loading time
 */

test.describe('Performance Tests', () => {
  // Import performance thresholds from centralized config
  // These are development-optimized values (30-50% more lenient than production)
  const THRESHOLDS = {
    PAGE_LOAD: parseInt(process.env.PERFORMANCE_PAGE_LOAD_MAX || '4000'),
    API_RESPONSE: parseInt(process.env.PERFORMANCE_API_RESPONSE_MAX || '1000'),
    FCP: parseInt(process.env.PERFORMANCE_FIRST_CONTENTFUL_PAINT_MAX || '2000'),
    TTI: parseInt(process.env.PERFORMANCE_TTI_MAX || '6000'),
    LCP: parseInt(process.env.PERFORMANCE_LCP_MAX || '3500'),
    IMAGE_LOAD: parseInt(process.env.PERFORMANCE_IMAGE_LOAD_MAX || '3000'),
    BUNDLE_SIZE: parseInt(process.env.PERFORMANCE_BUNDLE_SIZE_MAX || String(600 * 1024)),
    SEARCH_RESULTS: parseInt(process.env.PERFORMANCE_SEARCH_MAX || '2500'),
  };

  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    
    console.log(`Home page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD);

    // Verify page is interactive
    await expect(page.locator('[data-testid="search-link"]')).toBeVisible();
  });

  test('should meet Core Web Vitals standards', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};

          entries.forEach((entry: any) => {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              vitals.FCP = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            }
          });

          // Get Time to Interactive from performance timing
          const perfTiming = performance.timing;
          vitals.TTI = perfTiming.domInteractive - perfTiming.navigationStart;

          resolve(vitals);
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // Fallback timeout
        setTimeout(() => {
          const perfTiming = performance.timing;
          resolve({
            FCP: perfTiming.domContentLoadedEventEnd - perfTiming.navigationStart,
            TTI: perfTiming.domInteractive - perfTiming.navigationStart,
            LCP: perfTiming.loadEventEnd - perfTiming.navigationStart,
          });
        }, 5000);
      });
    });

    console.log('Core Web Vitals:', metrics);

    // Verify metrics meet thresholds
    expect(metrics.FCP).toBeLessThan(THRESHOLDS.FCP);
    expect(metrics.LCP).toBeLessThan(THRESHOLDS.LCP);
    expect(metrics.TTI).toBeLessThan(THRESHOLDS.TTI);
  });

  test('should load search results quickly', async ({ page }) => {
    await page.goto('/browse');

    const startTime = Date.now();

    // Trigger search
    await page.fill('[data-testid="search-input"]', 'Jane');
    await page.click('[data-testid="search-button"]');

    // Wait for results
    await page.waitForSelector('[data-testid="artist-card"]', { timeout: 5000 });

    const searchTime = Date.now() - startTime;

    console.log(`Search results load time: ${searchTime}ms`);
    expect(searchTime).toBeLessThan(THRESHOLDS.SEARCH_RESULTS);
  });

  test('should load artist profile within acceptable time', async ({ page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    const startTime = Date.now();
    await page.waitForURL('**/artist/**');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`Artist profile load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD);

    // Verify all sections loaded
    await expect(page.locator('[data-testid="artist-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="artist-portfolio"]')).toBeVisible();
  });

  test('should fetch availability data quickly', async ({ page }) => {
    await page.goto('/browse');
    await page.click('[data-testid="artist-card"]:first-child');

    // Measure API response time
    const startTime = Date.now();

    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/availability')),
      page.click('[data-testid="date-picker"]'),
    ]);

    const responseTime = Date.now() - startTime;

    console.log(`Availability API response time: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(THRESHOLDS.API_RESPONSE);
    expect(response.status()).toBe(200);
  });

  test('should handle image loading efficiently', async ({ page }) => {
    await page.goto('/browse');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Measure image loading performance
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const metrics = images.map(img => {
        const entry = performance.getEntriesByName(img.src)[0] as PerformanceResourceTiming;
        return entry ? {
          url: img.src,
          duration: entry.duration,
          size: entry.transferSize,
        } : null;
      }).filter(Boolean);

      return metrics;
    });

    console.log(`Loaded ${imageMetrics.length} images`);

    // Verify no image takes too long to load
    imageMetrics.forEach((metric: any) => {
      expect(metric.duration).toBeLessThan(THRESHOLDS.IMAGE_LOAD);
      console.log(`Image: ${metric.url.substring(0, 50)}... - ${metric.duration}ms - ${metric.size} bytes`);
    });
  });

  test('should handle concurrent API requests efficiently', async ({ page }) => {
    await page.goto('/');

    // Login

    // Measure concurrent requests
    const startTime = Date.now();

    const responses = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/bookings')),
      page.waitForResponse(resp => resp.url().includes('/api/messages')),
      page.waitForResponse(resp => resp.url().includes('/api/profile')),
    ]);

    const totalTime = Date.now() - startTime;

    console.log(`Concurrent API requests completed in: ${totalTime}ms`);

    // Verify all requests succeeded
    responses.forEach((response, index) => {
      console.log(`Request ${index + 1}: ${response.status()} - ${response.url()}`);
      expect(response.status()).toBe(200);
    });

    // Total time should be less than sum of individual requests (parallel execution)
    expect(totalTime).toBeLessThan(THRESHOLDS.API_RESPONSE * 2);
  });

  test('should maintain performance under slow network conditions', async ({ page }) => {
    // Simulate slow 3G network
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 Kbps
      latency: 562.5, // 562.5ms RTT
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    console.log(`Page load time on slow 3G: ${loadTime}ms`);

    // On slow network, we expect longer load times but still reasonable
    // Slow 3G (1.6 Mbps) can take 20-30s for initial page load with all resources
    expect(loadTime).toBeLessThan(30000); // 30 seconds max on slow 3G

    // Verify critical content is visible
    await expect(page.locator('[data-testid="search-link"]')).toBeVisible();
  });

  test('should optimize bundle size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Measure JavaScript bundle sizes
    const bundleMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.endsWith('.js'));

      return jsResources.map(r => ({
        url: r.name,
        size: r.transferSize,
        duration: r.duration,
      }));
    });

    const totalJSSize = bundleMetrics.reduce((sum: number, r: any) => sum + r.size, 0);

    console.log(`Total JavaScript size: ${(totalJSSize / 1024).toFixed(2)} KB`);
    bundleMetrics.forEach((bundle: any) => {
      console.log(`  ${bundle.url.split('/').pop()} - ${(bundle.size / 1024).toFixed(2)} KB - ${bundle.duration.toFixed(2)}ms`);
    });

    // Verify total JS size is reasonable
    expect(totalJSSize).toBeLessThan(THRESHOLDS.BUNDLE_SIZE);
  });

  test('should cache resources effectively', async ({ page }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstLoadResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.length;
    });

    // Second visit (should use cache)
    await page.reload();
    await page.waitForLoadState('networkidle');

    const cachedResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const cached = resources.filter(r => r.transferSize === 0);
      return {
        total: resources.length,
        cached: cached.length,
        cacheRate: (cached.length / resources.length) * 100,
      };
    });

    console.log(`Cache statistics:`, cachedResources);
    console.log(`  Total resources: ${cachedResources.total}`);
    console.log(`  Cached resources: ${cachedResources.cached}`);
    console.log(`  Cache rate: ${cachedResources.cacheRate.toFixed(2)}%`);

    // Verify significant caching (at least 50% of resources)
    expect(cachedResources.cacheRate).toBeGreaterThan(50);
  });

  test('should handle booking flow without performance degradation', async ({ authenticatedClientPage: page }) => {
    // Already authenticated via fixture

    // Measure each step of booking flow
    const timings: Record<string, number> = {};

    // Step 1: Search
    let startTime = Date.now();
    await page.goto('/browse');
    await page.waitForLoadState('networkidle');
    timings.search = Date.now() - startTime;

    // Step 2: Artist profile
    startTime = Date.now();
    await page.click('[data-testid="artist-card"]:first-child');
    await page.waitForURL('**/artist/**');
    await page.waitForLoadState('networkidle');
    timings.profile = Date.now() - startTime;

    // Step 3: Availability check
    startTime = Date.now();
    await page.click('[data-testid="date-picker"]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.waitForSelector('[data-testid="time-slot"]');
    timings.availability = Date.now() - startTime;

    // Step 4: Booking creation
    startTime = Date.now();
    await page.click('[data-testid="time-slot"]:not([disabled]):first-child');
    await page.click('[data-testid="book-now-button"]');
    await page.waitForSelector('[data-testid="booking-summary"]');
    timings.booking = Date.now() - startTime;

    console.log('Booking flow timings:');
    Object.entries(timings).forEach(([step, time]) => {
      console.log(`  ${step}: ${time}ms`);
      expect(time).toBeLessThan(3000); // Each step should be under 3 seconds
    });

    const totalTime = Object.values(timings).reduce((sum, time) => sum + time, 0);
    console.log(`  Total booking flow: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(10000); // Total flow should be under 10 seconds
  });

  test('should measure and report Web Vitals for monitoring', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Collect comprehensive performance metrics
    const performanceReport = await page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      return {
        // Navigation Timing
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        domProcessing: timing.domComplete - timing.domLoading,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart,

        // Resource counts
        resources: performance.getEntriesByType('resource').length,
        
        // Memory (if available)
        memory: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        } : null,
      };
    });

    console.log('Performance Report:');
    console.log(`  DNS Lookup: ${performanceReport.dns}ms`);
    console.log(`  TCP Connection: ${performanceReport.tcp}ms`);
    console.log(`  Time to First Byte: ${performanceReport.ttfb}ms`);
    console.log(`  Download: ${performanceReport.download}ms`);
    console.log(`  DOM Processing: ${performanceReport.domProcessing}ms`);
    console.log(`  DOM Content Loaded: ${performanceReport.domContentLoaded}ms`);
    console.log(`  Page Load: ${performanceReport.pageLoad}ms`);
    console.log(`  Resources Loaded: ${performanceReport.resources}`);

    if (performanceReport.memory) {
      console.log(`  JS Heap Used: ${(performanceReport.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    }

    // Verify key metrics
    expect(performanceReport.ttfb).toBeLessThan(500);
    expect(performanceReport.domContentLoaded).toBeLessThan(2000);
    expect(performanceReport.pageLoad).toBeLessThan(THRESHOLDS.PAGE_LOAD);
  });
});
