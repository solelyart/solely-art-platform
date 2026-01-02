# Test Selector Reference

**Document Version:** 2.0  
**Last Updated:** December 2025  
**Total Test IDs**: 55 data-testid attributes across 10 components

---

## Overview

This document provides a complete mapping of all `data-testid` attributes used for Playwright E2E testing in the Solely Art Platform. All test IDs follow consistent kebab-case naming conventions.

---

## Application Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Landing page with hero, search, featured artists |
| `/browse` | Browse | Artist browsing and filtering |
| `/become-artist` | BecomeArtist | Artist onboarding form |
| `/dashboard` | Dashboard | User dashboard (client/artist) |
| `/artist/:id` | ArtistProfile | Artist profile page |
| `/book/:id` | BookArtist | Booking creation flow |
| `/availability` | AvailabilityDashboard | Artist availability management |
| `/bookings` | BookingManagement | Booking list and management |
| `/messages` | Messages | Messaging system |
| `/portfolio-builder` | PortfolioBuilder | Artist portfolio builder |
| `/about` | About | About page |
| `/terms` | Terms | Terms of Service |
| `/privacy` | Privacy | Privacy Policy |
| `/contact` | Contact | Contact form |

---

## Test ID Reference by Component

### Authentication & Navigation

| Selector | Component | Purpose |
|----------|-----------|---------|
| `[data-testid="login-button"]` | Header | Sign In button |
| `[data-testid="logout-button"]` | LogoutButton | Logout button |
| `[data-testid="user-menu"]` | Header | User menu dropdown |
| `[data-testid="nav-browse"]` | Header | Browse Artists nav link |
| `[data-testid="nav-dashboard"]` | Header | Dashboard nav link |
| `[data-testid="nav-become-artist"]` | Header | Become an Artist button |
| `[data-testid="search-link"]` | Home | Link to browse page |

### Home Page (10 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="hero-title"]` | Main hero heading |
| `[data-testid="search-input"]` | Search input field |
| `[data-testid="search-button"]` | Search submit button |
| `[data-testid="category-card"]` | Category cards |
| `[data-testid="featured-artist-card"]` | Featured artist cards |
| `[data-testid="nav-browse"]` | Browse Artists navigation link |
| `[data-testid="nav-dashboard"]` | Dashboard navigation link |
| `[data-testid="nav-become-artist"]` | Become an Artist button |
| `[data-testid="user-menu"]` | User avatar/menu button |
| `[data-testid="login-button"]` | Sign In button |

### Browse Page (6 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="search-input"]` | Search input field |
| `[data-testid="category-filter"]` | Category filter dropdown |
| `[data-testid="category-option"]` | Category filter badges |
| `[data-testid="apply-filters"]` | Apply filters button |
| `[data-testid="search-results"]` | Search results container |
| `[data-testid="artist-card"]` | Artist card in search results |

### Artist Profile Page (9 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="artist-name"]` | Artist name heading |
| `[data-testid="artist-bio"]` | Artist biography section |
| `[data-testid="artist-portfolio"]` | Portfolio gallery section |
| `[data-testid="artist-services"]` | Services card container |
| `[data-testid="artist-reviews"]` | Reviews section |
| `[data-testid="artist-pricing"]` | Pricing/stats section |
| `[data-testid="artist-availability"]` | Availability section |
| `[data-testid="hourly-rate"]` | Hourly rate display |
| `[data-testid="view-availability"]` | View availability button |
| `[data-testid="book-now-button"]` | Book now CTA button |

### Booking Flow (11 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="availability-calendar"]` | Calendar component |
| `[data-testid="date-picker"]` | Date picker input |
| `[data-date="YYYY-MM-DD"]` | Individual calendar dates |
| `[data-testid="time-slot"]` | Individual time slot button |
| `[data-time="HH:MM"]` | Time slot with specific time |
| `[data-testid="budget-input"]` | Budget input field |
| `[data-testid="special-requests"]` | Special requests textarea |
| `[data-testid="booking-summary"]` | Summary container |
| `[data-testid="summary-service"]` | Service name in summary |
| `[data-testid="summary-date"]` | Date in summary |
| `[data-testid="summary-time"]` | Time in summary |
| `[data-testid="summary-duration"]` | Duration in summary |
| `[data-testid="summary-total"]` | Total price in summary |
| `[data-testid="confirm-booking"]` | Confirm booking button |
| `[data-testid="confirmation-message"]` | Success confirmation card |

### Booking Management (4 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="booking-card"]` | Individual booking cards |
| `[data-testid="accept-booking"]` | Accept booking button (artist view) |
| `[data-testid="decline-booking"]` | Decline booking button (artist view) |
| `[data-testid="cancel-booking"]` | Cancel booking button (client view) |

### Dashboard (1 test ID)

| Selector | Purpose |
|----------|---------|
| `[data-testid="dashboard-booking-card"]` | Booking cards in dashboard |

### Messages (4 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="conversation-list"]` | Conversations list |
| `[data-testid="message-list"]` | Messages list container |
| `[data-testid="message-input"]` | Message input field |
| `[data-testid="send-message"]` | Send message button |

### Become Artist (7 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="artist-form"]` | Artist application form |
| `[data-testid="display-name-input"]` | Display name input |
| `[data-testid="bio-input"]` | Bio textarea |
| `[data-testid="location-input"]` | Location input |
| `[data-testid="hourly-rate-input"]` | Hourly rate input |
| `[data-testid="category-select"]` | Category selection |
| `[data-testid="submit-application"]` | Submit application button |

### Portfolio Builder (5 test IDs)

| Selector | Purpose |
|----------|---------|
| `[data-testid="portfolio-grid"]` | Portfolio items grid |
| `[data-testid="upload-image"]` | Upload image button |
| `[data-testid="portfolio-item"]` | Individual portfolio item |
| `[data-testid="edit-item"]` | Edit item button |
| `[data-testid="delete-item"]` | Delete item button |

---

## Naming Conventions

All test IDs follow consistent kebab-case naming:

- **Actions**: `{action}-{noun}` (e.g., `confirm-booking`, `cancel-booking`)
- **Navigation**: `nav-{destination}` (e.g., `nav-browse`, `nav-dashboard`)
- **Form Inputs**: `{field}-input` (e.g., `budget-input`, `search-input`)
- **Display Elements**: `{noun}-{type}` (e.g., `artist-card`, `booking-card`)
- **Summary Elements**: `summary-{field}` (e.g., `summary-date`, `summary-total`)
- **Data Attributes**: `data-{type}="{value}"` (e.g., `data-date="2025-01-15"`)

---

## Coverage Summary

### By Priority Level

| Priority | Description | Status |
|----------|-------------|--------|
| **P0 (Critical)** | Authentication, booking flow, payment | ✅ Complete |
| **P1 (High)** | Artist profiles, dashboard, navigation | ✅ Complete |
| **P2 (Medium)** | Messages, portfolio, reviews | ✅ Complete |

### By Component

| Component | Test IDs | Coverage |
|-----------|----------|----------|
| Home.tsx | 10 | Complete |
| Browse.tsx | 6 | Complete |
| ArtistProfile.tsx | 9 | Complete |
| BookArtist.tsx | 11 | Complete |
| BookingManagement.tsx | 4 | Complete |
| Dashboard.tsx | 1 | Complete |
| Messages.tsx | 4 | Complete |
| BecomeArtist.tsx | 7 | Complete |
| PortfolioBuilder.tsx | 5 | Complete |
| LogoutButton.tsx | 1 | Complete |
| **Total** | **55** | **~95%** |

---

## Usage Examples

### Playwright Test Examples

```typescript
// Wait for element to be visible
await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();

// Click an element
await page.click('[data-testid="book-now-button"]');

// Fill form input
await page.fill('[data-testid="search-input"]', 'portrait');

// Select a specific date
await page.click('[data-date="2025-01-15"]');

// Select a specific time slot
await page.click('[data-time="10:00"]');

// Get multiple elements
const artistCards = page.locator('[data-testid="artist-card"]');
await expect(artistCards).toHaveCount(6);
```

### Adding New Test IDs

When adding new test IDs:

1. Follow the naming conventions above
2. Add to the outermost meaningful element
3. Update this document with the new selector
4. Run tests to verify the selector works

---

## Troubleshooting

### Element Not Found

1. Verify the data-testid attribute exists in the component
2. Check if the element is conditionally rendered
3. Add appropriate wait conditions before assertions
4. Use Playwright Inspector: `npx playwright test --debug`

### Multiple Elements

When multiple elements share the same test ID (e.g., artist cards):

```typescript
// Get first element
await page.click('[data-testid="artist-card"]:first-child');

// Get specific element by index
const cards = page.locator('[data-testid="artist-card"]');
await cards.nth(2).click();

// Get element with specific text
await page.click('[data-testid="artist-card"]:has-text("Elena Martinez")');
```
