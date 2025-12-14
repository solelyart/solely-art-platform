# Test Selector Mapping for Solely Art Platform

This document maps the Playwright test selectors to the actual application structure.

## Current Application Routes

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

## Required data-testid Attributes

### Authentication & Navigation
- `[data-testid="login-button"]` - Sign In button
- `[data-testid="logout-button"]` - Logout button  
- `[data-testid="user-menu"]` - User menu dropdown
- `[data-testid="nav-browse"]` - Browse Artists nav link
- `[data-testid="nav-dashboard"]` - Dashboard nav link
- `[data-testid="nav-become-artist"]` - Become an Artist button

### Home Page
- `[data-testid="hero-title"]` - Main hero heading
- `[data-testid="search-input"]` - Search input field
- `[data-testid="search-button"]` - Search submit button
- `[data-testid="category-card"]` - Category cards
- `[data-testid="featured-artist-card"]` - Featured artist cards

### Browse/Search Page
- `[data-testid="artist-card"]` - Artist card in search results
- `[data-testid="artist-name"]` - Artist name within card
- `[data-testid="artist-category"]` - Artist category tag
- `[data-testid="category-filter"]` - Category filter dropdown
- `[data-testid="apply-filters"]` - Apply filters button
- `[data-testid="search-results"]` - Search results container

### Artist Profile Page
- `[data-testid="artist-name"]` - Artist name heading
- `[data-testid="artist-bio"]` - Artist biography section
- `[data-testid="artist-portfolio"]` - Portfolio gallery section
- `[data-testid="artist-pricing"]` - Pricing information
- `[data-testid="artist-availability"]` - Availability section
- `[data-testid="artist-reviews"]` - Reviews section
- `[data-testid="hourly-rate"]` - Hourly rate display
- `[data-testid="view-availability"]` - View availability button
- `[data-testid="book-now-button"]` - Book now CTA button

### Booking Flow
- `[data-testid="availability-calendar"]` - Calendar component
- `[data-testid="date-picker"]` - Date picker input
- `[data-testid="time-slot"]` - Individual time slot button
- `[data-testid="duration-select"]` - Duration dropdown
- `[data-testid="booking-price"]` - Calculated booking price
- `[data-testid="special-requests"]` - Special requests textarea
- `[data-testid="char-count"]` - Character count display
- `[data-testid="proceed-to-payment"]` - Proceed to payment button

### Booking Summary
- `[data-testid="booking-summary"]` - Summary container
- `[data-testid="summary-artist-name"]` - Artist name in summary
- `[data-testid="summary-date"]` - Booking date
- `[data-testid="summary-time"]` - Booking time
- `[data-testid="summary-duration"]` - Booking duration
- `[data-testid="summary-subtotal"]` - Subtotal amount
- `[data-testid="summary-service-fee"]` - Service fee
- `[data-testid="summary-total"]` - Total amount
- `[data-testid="summary-special-requests"]` - Special requests display

### Payment
- `[data-testid="submit-payment"]` - Submit payment button
- `[data-testid="payment-error"]` - Payment error message

### Booking Confirmation
- `[data-testid="confirmation-message"]` - Confirmation heading
- `[data-testid="booking-id"]` - Booking ID display
- `[data-testid="confirmation-artist-name"]` - Artist name
- `[data-testid="confirmation-date"]` - Booking date
- `[data-testid="confirmation-time"]` - Booking time
- `[data-testid="confirmation-location"]` - Location/details
- `[data-testid="add-to-calendar"]` - Add to calendar button
- `[data-testid="message-artist"]` - Message artist button
- `[data-testid="view-booking-details"]` - View details button

### Bookings Management
- `[data-testid="booking-card"]` - Individual booking card
- `[data-testid="cancel-booking"]` - Cancel booking button
- `[data-testid="confirm-cancel"]` - Confirm cancellation button
- `[data-testid="cancellation-message"]` - Cancellation success message

### Messaging
- `[data-testid="message-input"]` - Message input field
- `[data-testid="send-message"]` - Send message button
- `[data-testid="message-list"]` - Messages list container
- `[data-testid="conversation-list"]` - Conversations list

### Dashboard
- `[data-testid="dashboard-stats"]` - Dashboard statistics
- `[data-testid="upcoming-bookings"]` - Upcoming bookings section
- `[data-testid="recent-activity"]` - Recent activity feed

## Implementation Priority

### P0 (Critical - Required for MVP tests)
1. Authentication elements (login, logout, user-menu)
2. Artist search and browse (search-input, artist-card, artist-name)
3. Booking flow (date-picker, time-slot, book-now-button)
4. Payment (submit-payment, payment-error)
5. Booking confirmation (confirmation-message, booking-id)

### P1 (High - Required for comprehensive testing)
1. Artist profile elements
2. Booking summary elements
3. Booking management elements
4. Navigation elements

### P2 (Medium - Nice to have)
1. Dashboard elements
2. Messaging elements
3. Portfolio builder elements

## Next Steps

1. Add data-testid attributes to components in priority order
2. Update Playwright test files to use correct selectors
3. Update test URLs to match actual routes
4. Configure authentication to use Manus OAuth
5. Run tests and iterate on failures
