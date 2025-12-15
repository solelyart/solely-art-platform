# Playwright Cookie Authentication Research Findings

## Key Findings from Official Documentation

### 1. Browser Context Isolation
- Playwright executes tests in isolated browser contexts
- Each context has its own cookie storage
- Cookies must be explicitly saved and restored using `storageState`

### 2. Recommended Authentication Patterns

**Pattern A: Setup Project (Single Account)**
- Authenticate once in a setup project
- Save state to `playwright/.auth/user.json`
- All tests reuse the same authenticated state
- **Best for**: Tests that don't modify server-side state

**Pattern B: Worker-Scoped Authentication (Multiple Accounts)**
- Authenticate once per worker process
- Each worker gets a unique account
- State saved per worker using `parallelIndex`
- **Best for**: Tests that modify shared server-side state

### 3. Critical Cookie Handling Points

**From Documentation:**
> "Wait until the page receives the cookies. Sometimes login flow sets cookies in the process of several redirects. Wait for the final URL to ensure that the cookies are actually set."

**Recommended Wait Strategy:**
```typescript
// Wait for final URL after redirects
await page.waitForURL('https://example.com/');

// OR wait for element that proves cookies are set
await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
```

### 4. Storage State Persistence
- `storageState` covers: cookies, localStorage, IndexedDB
- Session storage is NOT persisted by default
- Must use `page.context().storageState({ path: authFile })` to save
- Must configure `storageState: 'path/to/file.json'` in config to load

## Current Implementation Issues

### Problem: API Request vs Page Navigation
Our current approach:
1. Call `page.request.post('/api/test-auth/login')` - sets cookie via API
2. Navigate to page with `page.goto('/')`
3. Expect cookie to be available

**Potential Issue**: `page.request` uses [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext) which has **separate cookie storage** from the browser context!

From APIRequestContext docs:
> "If you want API requests to not interfere with the browser cookies you should create a new APIRequestContext"

This means:
- Cookies set via `page.request.post()` go to APIRequestContext storage
- Browser context (used by `page.goto()`) has separate cookie storage
- **Cookies don't automatically transfer between the two!**

### Solution Direction
We need to either:
1. **Option A**: Set cookies directly in browser context after API call
2. **Option B**: Use page navigation for authentication instead of API
3. **Option C**: Extract cookies from API response and add them to context

## Next Steps
1. Verify if APIRequestContext vs BrowserContext is the root cause
2. Test cookie transfer between contexts
3. Implement proper cookie handling


## CRITICAL DISCOVERY: page.request DOES Share Cookies!

### From Official APIRequestContext Documentation:

> "APIRequestContext returned by browserContext.request and **page.request shares cookie storage** with the corresponding BrowserContext. Each API request will have Cookie header populated with the values from the browser context. **If the API response contains Set-Cookie header it will automatically update BrowserContext cookies** and requests made from the page will pick them up. This means that **if you log in using this API, your e2e test will be logged in** and vice versa."

### What This Means:
- ✅ `page.request.post()` **DOES** share cookies with browser context
- ✅ Set-Cookie headers from API responses **SHOULD** automatically update browser cookies
- ✅ Our approach of using `page.request` for authentication is correct

### So Why Isn't It Working?

The documentation confirms our approach should work. The issue must be elsewhere:

1. **Cookie not being set by server?** - No, we verified with curl that Set-Cookie header is present
2. **Cookie domain/path mismatch?** - Possible
3. **Cookie being set but not sent with subsequent requests?** - Possible
4. **tRPC not including cookies in requests?** - Possible
5. **Server not recognizing the cookie format?** - Possible

### Next Investigation Steps:
1. Check if cookie is actually in browser context after API call
2. Verify tRPC requests include Cookie header
3. Check server-side session validation logic
4. Compare cookie from test-auth vs real OAuth flow


## Cookie Configuration Analysis

### Current Cookie from test-auth endpoint:
```
Set-Cookie: session=<JWT_TOKEN>; 
  Max-Age=31536000; 
  Path=/; 
  Expires=Tue, 15 Dec 2026 00:38:23 GMT; 
  HttpOnly; 
  SameSite=Lax
```

### Cookie Attributes:
- **Name**: `session` ✅
- **Path**: `/` ✅ (matches all paths)
- **Domain**: Not set (defaults to current domain) ✅
- **SameSite**: `Lax` ✅ (correct for localhost)
- **HttpOnly**: Yes ✅ (security best practice)
- **Secure**: No ✅ (correct for http://localhost)

### Analysis:
All cookie attributes look correct for localhost testing:
- Path `/` means cookie should be sent with ALL requests to localhost:3000
- No explicit domain means cookie applies to localhost:3000
- SameSite=Lax allows cookie to be sent with same-site requests
- HttpOnly prevents JavaScript access (expected)

### Hypothesis:
The cookie configuration is correct. The issue must be in how Playwright handles the cookie or how the server validates it.

### Next Steps:
1. Create a Playwright test that logs all cookies after auth
2. Check if tRPC requests actually include the Cookie header
3. Compare JWT token structure from test-auth vs real OAuth


## 🎯 ROOT CAUSE IDENTIFIED

### Debug Test Results:
1. ✅ Cookie IS set in browser context after API call
2. ✅ Cookie persists across page navigation
3. ❌ **Cookie is NOT included in HTTP request headers!**

### Evidence:
```
=== STEP 3: Cookies after API call ===
✅ Session cookie found!
  - Domain: localhost
  - Path: /
  - SameSite: Lax

=== STEP 5: Check tRPC auth.me request ===
✅ Found auth.me request
  - Cookie header: NO COOKIE HEADER!
```

### The Problem:
Playwright's browser context contains the cookie, but when the page makes HTTP requests (including tRPC calls), the Cookie header is **not being sent**.

### Why This Happens:
Research shows this is a known issue with `localhost` domains in Playwright/Chromium. The cookie domain is set to `localhost` (no port), but requests go to `localhost:3000`.

### Potential Solutions:
1. **Set explicit cookie domain** to `localhost` (already done) or `127.0.0.1`
2. **Use 127.0.0.1 instead of localhost** in tests
3. **Manually add cookies to context** with correct domain
4. **Use a real domain** (e.g., `local.test` with hosts file)

### Next Steps:
Test if using `127.0.0.1` instead of `localhost` fixes the issue.


## StackOverflow Findings: localhost vs 127.0.0.1

From Steffen Ullrich's comment:
> "From the perspective of the browser these are different things - cookies set on a localhost URL are not reflected to 127.0.0.1 and vice versa. This is the same with any other domain name and its IP address."

### Key Insight:
Browsers treat `localhost` and `127.0.0.1` as **completely separate domains** for cookie purposes, even though they resolve to the same IP address.

### BUT - This Doesn't Explain Our Issue!
Our cookie is set with domain `localhost` and we're accessing `localhost:3000`, so the domain matches. The cookie SHOULD be sent.

### Wait - Let me re-examine the debug output...

Looking back at the debug test:
```
Cookie domain: localhost
Request URL: http://localhost:3000/api/trpc/auth.me
Cookie header: NO COOKIE HEADER!
```

The domain matches, so why isn't the cookie being sent?

### New Hypothesis:
The issue might be that the cookie is being set by `page.request` (APIRequestContext) but when the page navigates, it's using a **different browser context** or the cookie isn't being properly associated with page requests.

Let me check if there's a difference between:
1. Cookies set via `page.request.post()` (API)
2. Cookies needed for page navigation requests


## Server-Side Authentication Flow

### How the server validates sessions:
1. `createContext()` calls `sdk.authenticateRequest(req)`
2. `authenticateRequest()` parses cookies from `req.headers.cookie`
3. Looks for cookie named `session`
4. Calls `verifySession(sessionCookie)` to validate JWT
5. If valid, looks up user in database by `openId`

### Critical Observation:
The server reads cookies from `req.headers.cookie` - this is a **standard HTTP header**.

If the Cookie header is missing (as our debug test showed), then:
- `cookies.get(COOKIE_NAME)` returns undefined
- `verifySession(undefined)` returns null
- `authenticateRequest()` throws "Invalid session cookie"
- Context user is set to null
- `auth.me` returns null

### This confirms:
The problem is NOT server-side validation. The problem is that **the Cookie header is not being sent with page requests** in Playwright.

### Remaining Question:
WHY isn't the Cookie header being sent when:
- ✅ Cookie exists in browser context
- ✅ Domain matches (localhost)
- ✅ Path matches (/)
- ✅ SameSite=Lax (allows same-site requests)


## 🎉 SOLUTION IMPLEMENTED

### Root Cause:
**Cookie name mismatch** between test-auth endpoint and server expectations:
- Test-auth endpoint was setting cookie named `session`
- Server was looking for cookie named `app_session_id` (from COOKIE_NAME constant in shared/const.ts)

### The Fix:
1. Updated `server/test-auth.ts` to import `COOKIE_NAME` from `@shared/const`
2. Updated `e2e-tests/fixtures/auth.fixture.ts` to look for `app_session_id` instead of `session`

### Results:
- ✅ Authentication now works in Playwright tests
- ✅ tRPC auth.me returns user object instead of null
- ✅ Test pass rate improved from 22.4% to 56% (9/16 smoke tests passing)
- ✅ All unit tests passing (4/4)
- ✅ Auth fixture working reliably

### Remaining Issues:
- Performance tests failing due to strict timing thresholds (not auth-related)
- Some tests missing required page elements (date-picker, etc.)

### Key Learnings:
1. **Always use shared constants** for cookie names across client/server/tests
2. **Server-side logging is essential** for debugging cookie issues
3. **Cookie name mismatches are silent failures** - cookies are set and sent but not recognized
4. **Playwright's page.request DOES share cookies** with browser context (documentation confirmed)
5. **Debug tests with explicit logging** are invaluable for diagnosing auth issues
