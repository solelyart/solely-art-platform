import { test, expect } from '@playwright/test';

test.describe('Cookie Debug Tests', () => {
  test('should inspect cookie flow in detail', async ({ page }) => {
    console.log('\n=== STEP 1: Initial cookies ===');
    let cookies = await page.context().cookies();
    console.log('Cookies before auth:', JSON.stringify(cookies, null, 2));

    console.log('\n=== STEP 2: Call test-auth API ===');
    const response = await page.request.post('http://localhost:3000/api/test-auth/login', {
      data: { openId: 'test-client-openid-12345' },
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('Response status:', response.status());
    console.log('Response headers:', JSON.stringify(response.headers(), null, 2));
    const responseBody = await response.json();
    console.log('Response body:', JSON.stringify(responseBody, null, 2));

    console.log('\n=== STEP 3: Cookies after API call ===');
    cookies = await page.context().cookies();
    console.log('Cookies after auth:', JSON.stringify(cookies, null, 2));
    const sessionCookie = cookies.find(c => c.name === 'session');
    if (sessionCookie) {
      console.log('✅ Session cookie found!');
      console.log('  - Value:', sessionCookie.value.substring(0, 50) + '...');
      console.log('  - Domain:', sessionCookie.domain);
      console.log('  - Path:', sessionCookie.path);
      console.log('  - SameSite:', sessionCookie.sameSite);
      console.log('  - HttpOnly:', sessionCookie.httpOnly);
      console.log('  - Secure:', sessionCookie.secure);
    } else {
      console.log('❌ Session cookie NOT found!');
    }

    console.log('\n=== STEP 4: Navigate to home page ===');
    // Listen for all network requests
    const requests: any[] = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers()
      });
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    console.log('\n=== STEP 5: Check tRPC auth.me request ===');
    const authMeRequest = requests.find(r => r.url.includes('/api/trpc/auth.me'));
    if (authMeRequest) {
      console.log('✅ Found auth.me request');
      console.log('  - URL:', authMeRequest.url);
      console.log('  - Cookie header:', authMeRequest.headers['cookie'] || 'NO COOKIE HEADER!');
    } else {
      console.log('❌ No auth.me request found');
      console.log('All tRPC requests:', requests.filter(r => r.url.includes('/api/trpc')).map(r => r.url));
    }

    console.log('\n=== STEP 6: Cookies after navigation ===');
    cookies = await page.context().cookies();
    console.log('Cookies after navigation:', JSON.stringify(cookies, null, 2));

    console.log('\n=== STEP 7: Make manual tRPC request ===');
    const tRPCResponse = await page.request.get('http://localhost:3000/api/trpc/auth.me');
    console.log('tRPC auth.me response status:', tRPCResponse.status());
    const tRPCBody = await tRPCResponse.json();
    console.log('tRPC auth.me response:', JSON.stringify(tRPCBody, null, 2));

    // Final assertion
    expect(sessionCookie).toBeDefined();
  });
});
