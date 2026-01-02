# E2E Testing Research: Authentication & Test ID Best Practices

**Research Date:** January 2, 2026  
**Purpose:** Investigate industry best practices for handling cross-domain cookie issues and test ID strategies in Playwright E2E testing.

---

## Part 1: Cross-Domain Cookie Authentication Issues

### The Problem

When running Playwright tests against a different domain than where the cookie was set (e.g., testing on `https://xxx.manusvm.computer` but cookie set for `localhost`), cookies are not automatically sent with requests due to browser security policies.

### Industry Solutions

#### 1. **Playwright's Official storageState Approach** (Recommended)

From [Playwright Documentation](https://playwright.dev/docs/auth):

- Authenticate once in a **setup project**
- Save the browser state (cookies + localStorage) to a JSON file
- Reuse this state across all tests via `storageState` config

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

**Key Insight:** The storageState file contains cookies for the exact domain where they were set. When tests run against the same domain, cookies are automatically included.

#### 2. **API-Based Authentication** (Best for OAuth)

From [Checkly Documentation](https://checklyhq.com/docs/learn/playwright/authentication):

For OAuth applications, authenticate via API and save the state:

```typescript
setup('authenticate', async ({ request }) => {
  await request.post('/api/test-auth/login', {
    data: { openId: 'test-user-id' }
  });
  await request.storageState({ path: authFile });
});
```

#### 3. **Token Injection** (For Azure AD / External OAuth)

From [Hotovo Blog](https://www.hotovo.com/blog/how-to-ski-azure-login-in-ui-tests-using-playwright):

Inject access tokens directly into localStorage:

```typescript
await page.evaluate((token) => {
  localStorage.setItem('access_token', token);
}, 'YOUR_ACCESS_TOKEN');
```

#### 4. **Cookie Domain Propagation**

From [GitHub Issue #2795](https://github.com/microsoft/playwright/issues/2795):

Playwright's `context.cookies()` API works at the context level, showing all cookies. However, DevTools only shows cookies for the current domain.

**Solution:** Use `context.addCookies()` with the correct domain:

```typescript
await page.context().addCookies([{
  name: 'app_session_id',
  value: sessionCookie.value,
  domain: 'xxx.manusvm.computer', // Target domain
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'Lax'
}]);
```

### Root Cause Analysis for Solely Art Platform

The current test failures are caused by:

1. **Domain Mismatch:** Cookie set for `localhost` but tests run on `manusvm.computer`
2. **Missing Cookie Propagation:** The `ensureCookiesForDomain()` helper exists but isn't called consistently
3. **Test-Auth Endpoint:** Sets cookie correctly, but for the wrong domain

---

## Part 2: Test ID Best Practices

### Why Use data-testid?

From [DEV.to Article](https://dev.to/johnnyv5g/data-testid-bridging-the-gap-between-qa-engineering-and-front-end-dev-gja):

1. **Separation of Concerns:** Test selectors separate from UI/functionality attributes
2. **Stability:** Unlike classes/IDs, `data-testid` is meant to be stable
3. **Readability:** Test code becomes more readable
4. **Performance:** Faster and more reliable than class-based selection

### Playwright's Locator Priority

From [Playwright Best Practices](https://playwright.dev/docs/best-practices):

Playwright recommends prioritizing **user-facing attributes**:

1. `page.getByRole()` - Best for accessibility
2. `page.getByText()` - Good for visible text
3. `page.getByLabel()` - Good for form fields
4. `page.getByTestId()` - Good for explicit test contracts

### Best Practices for data-testid

| Practice | Description |
|----------|-------------|
| **Descriptive Naming** | Use `submit-button`, `login-form`, not `btn1` |
| **Key Interactive Elements** | Buttons, inputs, links, forms |
| **Dynamic Content** | Modals, dropdowns, dynamically loaded lists |
| **Avoid Overuse** | Not every element needs a testid |
| **Unique Identifiers** | Each testid should be unique on the page |
| **Multiple Children** | Assign to specific children, not containers |

### Naming Convention

```
[component]-[element]-[action/state]

Examples:
- booking-form-submit-button
- artist-profile-name
- payment-card-input
- 404-page-container
```

---

## Part 3: Recommendations for Solely Art Platform

### Fix 1: Update Auth Fixture to Use storageState

**Current Approach:** Custom fixture with `page.evaluate()` for auth
**Recommended Approach:** Use Playwright's official setup project pattern

```typescript
// e2e-tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

setup('authenticate', async ({ request, baseURL }) => {
  // Call test-auth endpoint
  await request.post(`${baseURL}/api/test-auth/login`, {
    data: { openId: 'test-client-openid' }
  });
  
  // Save state including cookies
  await request.storageState({ path: authFile });
});
```

### Fix 2: Configure storageState in playwright.config.ts

```typescript
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

### Fix 3: Add Missing Test IDs

| Element | Suggested data-testid |
|---------|----------------------|
| 404 Page | `404-page` |
| Booking Form | `booking-form` |
| Payment Form | `payment-form` |
| Error Message | `error-message` |
| Loading Spinner | `loading-spinner` |

### Fix 4: Update Test-Auth Endpoint for Domain Flexibility

Ensure the cookie is set with proper domain handling:

```typescript
// server/test-auth.ts
const cookieOptions = {
  ...getSessionCookieOptions(req),
  // Don't set domain explicitly - let browser use current domain
};
res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
```

---

## Summary

| Issue | Root Cause | Solution |
|-------|------------|----------|
| Auth cookie not sent | Domain mismatch | Use storageState with setup project |
| Missing test IDs | Elements not tagged | Add data-testid to 404, booking, payment |
| Flaky auth tests | Custom fixture complexity | Simplify with official Playwright pattern |

---

## References

1. [Playwright Authentication Docs](https://playwright.dev/docs/auth)
2. [Playwright Best Practices](https://playwright.dev/docs/best-practices)
3. [Checkly Authentication Guide](https://checklyhq.com/docs/learn/playwright/authentication)
4. [GitHub Issue: Cross-domain cookies](https://github.com/microsoft/playwright/issues/2795)
5. [Hotovo: Skip Azure Login](https://www.hotovo.com/blog/how-to-ski-azure-login-in-ui-tests-using-playwright)
6. [DEV.to: data-testid Best Practices](https://dev.to/johnnyv5g/data-testid-bridging-the-gap-between-qa-engineering-and-front-end-dev-gja)
