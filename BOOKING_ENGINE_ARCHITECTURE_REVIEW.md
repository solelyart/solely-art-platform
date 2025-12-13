# Booking Engine Architecture Review

**Solely Art Platform**  
**Document Version:** 1.0  
**Date:** December 12, 2024  
**Author:** Manus AI

---

## Executive Summary

The Solely Art Platform has established a sophisticated database schema and foundational backend API for a comprehensive booking engine designed to connect clients with artists for creative services. The architecture demonstrates thoughtful planning around critical booking system requirements including availability management, slot locking to prevent double-bookings, and flexible scheduling capabilities. However, the implementation remains incomplete, with significant gaps between the database schema and the interactive user experience required for a production-ready booking flow.

This document provides a comprehensive review of the current booking engine architecture, analyzing the database schema, backend logic, API endpoints, and implementation status. The analysis reveals that while the foundational data structures are well-designed and production-ready, the system lacks the interactive booking flow UI, availability management interfaces, and advanced scheduling features necessary to deliver the "Calendly meets Upwork for art" experience envisioned for the platform.

---

## 1. Database Schema Analysis

The booking engine database schema consists of seven interconnected tables that form a comprehensive foundation for managing the complete booking lifecycle from service discovery through review completion.

### 1.1 Core Booking Tables

The **bookings** table serves as the central entity tracking all booking requests and their lifecycle states. Each booking record captures the relationship between a client and an artist, the service being requested, timing information, budget constraints, and the current status of the booking request.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique booking identifier | Auto-incrementing primary key |
| `clientId` | int (FK) | References user who made the booking | Indexed for client query performance |
| `artistId` | int (FK) | References artist profile being booked | Indexed for artist query performance |
| `serviceDescription` | text | Description of requested service | Free-form text allowing custom requests |
| `requestedDate` | timestamp | Desired date/time for service | Stores UTC timestamp |
| `status` | enum | Current booking state | Values: pending, accepted, declined, completed, cancelled |
| `budget` | int | Client's budget in cents | Optional field, nullable |
| `notes` | text | Additional client notes | Optional field for special requests |
| `createdAt` | timestamp | Booking creation timestamp | Auto-generated on insert |
| `updatedAt` | timestamp | Last modification timestamp | Auto-updated on changes |

The status enum provides a clear state machine for booking lifecycle management. Bookings begin in **pending** status when created by clients, transition to **accepted** or **declined** based on artist response, move to **completed** when service is delivered, or can be **cancelled** by either party. This state management is critical for workflow orchestration and notification triggers.

The **services** table defines the bookable offerings that artists provide to clients. Each service represents a specific creative offering with defined pricing, duration, and description.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique service identifier | Auto-incrementing primary key |
| `artistId` | int (FK) | References artist profile | Indexed for artist query performance |
| `name` | varchar(255) | Service name | Required field, e.g., "Portrait Commission" |
| `description` | text | Detailed service description | Optional, allows rich formatting |
| `price` | int | Service price in cents | Required, stored as integer for precision |
| `durationMinutes` | int | Expected service duration | Required for calendar scheduling |
| `isActive` | boolean | Service availability flag | Default true, indexed for filtering |
| `createdAt` | timestamp | Service creation timestamp | Auto-generated on insert |
| `updatedAt` | timestamp | Last modification timestamp | Auto-updated on changes |

The services table enables artists to create a catalog of standardized offerings with clear pricing and time commitments. The `durationMinutes` field is particularly important for calendar integration, as it allows the system to calculate booking slot requirements and prevent scheduling conflicts.

### 1.2 Review and Reputation System

The **reviews** table implements a post-booking feedback mechanism that builds artist reputation and provides social proof for potential clients.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique review identifier | Auto-incrementing primary key |
| `bookingId` | int (FK, unique) | References completed booking | One review per booking constraint |
| `clientId` | int (FK) | References reviewing client | Indexed for client query performance |
| `artistId` | int (FK) | References reviewed artist | Indexed for artist query performance |
| `rating` | int | Numerical rating (1-5) | Required field, constrained range |
| `comment` | text | Written review text | Optional testimonial |
| `createdAt` | timestamp | Review creation timestamp | Auto-generated on insert |

The unique constraint on `bookingId` ensures that each completed booking can only receive one review, preventing duplicate feedback. The dual indexing on both `artistId` and `bookingId` optimizes the common query patterns of fetching all reviews for an artist profile and checking if a specific booking has been reviewed.

### 1.3 Availability Management System

The availability management subsystem consists of three interconnected tables that work together to define when artists are available, prevent double-bookings, and handle exceptions to regular schedules.

The **availabilityWindows** table defines recurring weekly availability patterns for each artist. This approach allows artists to set consistent working hours that repeat each week without requiring manual entry for every future date.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique window identifier | Auto-incrementing primary key |
| `artistId` | int (FK) | References artist profile | Indexed for artist query performance |
| `dayOfWeek` | int | Day of week (0-6, 0=Sunday) | Indexed for calendar queries |
| `startTime` | varchar(5) | Window start time (HH:MM) | 24-hour format, e.g., "09:00" |
| `endTime` | varchar(5) | Window end time (HH:MM) | 24-hour format, e.g., "17:00" |
| `timezone` | varchar(64) | IANA timezone identifier | Required for global scheduling |
| `isActive` | boolean | Window active status | Default true, allows temporary disabling |
| `createdAt` | timestamp | Window creation timestamp | Auto-generated on insert |
| `updatedAt` | timestamp | Last modification timestamp | Auto-updated on changes |

The timezone field is particularly critical for a global marketplace, as it ensures that availability windows are interpreted correctly regardless of the client's location. The `isActive` flag provides a soft-delete mechanism, allowing artists to temporarily disable availability windows without losing the configuration.

The **slotLocks** table implements a temporary reservation system that prevents double-booking during the checkout process. When a client selects a time slot and begins the booking flow, the system creates a slot lock that reserves that time for a limited duration.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique lock identifier | Auto-incrementing primary key |
| `artistId` | int (FK) | References artist profile | Indexed for artist query performance |
| `date` | varchar(10) | Lock date (YYYY-MM-DD) | Indexed for date-based queries |
| `startTime` | varchar(5) | Lock start time (HH:MM) | 24-hour format |
| `durationMinutes` | int | Lock duration in minutes | Matches service duration |
| `lockedBy` | int (FK) | References user holding lock | Indexed for user query performance |
| `expiresAt` | timestamp | Lock expiration timestamp | Indexed for cleanup queries |
| `createdAt` | timestamp | Lock creation timestamp | Auto-generated on insert |

The slot lock mechanism is essential for preventing race conditions where multiple clients attempt to book the same time slot simultaneously. The `expiresAt` field enables automatic cleanup of abandoned locks, ensuring that slots become available again if a client doesn't complete their booking within the allocated time window (typically 10-15 minutes).

The **blackoutDates** table handles exceptions to regular availability patterns, allowing artists to block out specific date ranges for vacations, holidays, or other commitments.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique blackout identifier | Auto-incrementing primary key |
| `artistId` | int (FK) | References artist profile | Indexed for artist query performance |
| `startDate` | timestamp | Blackout period start | Inclusive boundary |
| `endDate` | timestamp | Blackout period end | Inclusive boundary |
| `reason` | varchar(255) | Optional blackout reason | Optional field for artist notes |
| `createdAt` | timestamp | Blackout creation timestamp | Auto-generated on insert |

The date range approach allows artists to block out anything from single days to extended periods with a single record. The system should check blackout dates when calculating available slots to ensure that no bookings are accepted during these periods.

### 1.4 Artist Configuration

The **artistSettings** table stores artist-specific booking policies and preferences that customize the booking experience for each artist.

| Field | Type | Purpose | Implementation Notes |
|-------|------|---------|---------------------|
| `id` | int (PK) | Unique settings identifier | Auto-incrementing primary key |
| `artistId` | int (FK, unique) | References artist profile | One settings record per artist |
| `bookingBufferMinutes` | int | Buffer time between bookings | Default 0, prevents back-to-back bookings |
| `advanceBookingDays` | int | Maximum days in advance | Default 30, prevents far-future bookings |
| `cancellationPolicy` | text | Artist's cancellation policy | Optional free-form text |
| `createdAt` | timestamp | Settings creation timestamp | Auto-generated on insert |
| `updatedAt` | timestamp | Last modification timestamp | Auto-updated on changes |

The `bookingBufferMinutes` field is particularly important for artists who need setup or cleanup time between sessions. For example, a photographer might require 30 minutes between portrait sessions to review images and prepare equipment. The `advanceBookingDays` field prevents clients from booking too far in the future, which can be important for artists whose schedules or pricing may change over time.

### 1.5 Schema Strengths

The database schema demonstrates several architectural strengths that position the platform well for production deployment:

**Comprehensive Lifecycle Coverage**: The schema captures the complete booking journey from service discovery through review submission, with clear state transitions and relationship tracking at each stage.

**Scalability Considerations**: Strategic indexing on foreign keys and frequently queried fields (status, date ranges, active flags) ensures that query performance will remain acceptable as the dataset grows. The use of separate tables for availability patterns, locks, and blackouts prevents the bookings table from becoming a performance bottleneck.

**Data Integrity**: The unique constraint on `reviews.bookingId` prevents duplicate reviews, while the unique constraint on `artistSettings.artistId` ensures consistent configuration. Foreign key relationships maintain referential integrity across the system.

**Timezone Awareness**: The explicit timezone field in availability windows demonstrates awareness of the challenges of global scheduling, a critical consideration for a marketplace that aims to connect artists and clients across geographic boundaries.

**Flexible Pricing**: Storing prices in cents as integers avoids floating-point precision issues that can lead to financial discrepancies. The optional budget field on bookings allows for both fixed-price and negotiable service models.

### 1.6 Schema Gaps and Considerations

Despite its strengths, the current schema has several gaps that should be addressed as the booking engine evolves:

**Missing Service-Booking Relationship**: The bookings table uses a free-form `serviceDescription` field rather than a foreign key to the services table. This design choice provides flexibility for custom requests but makes it difficult to track which services are most popular, calculate accurate service-specific analytics, or enforce service-specific booking rules. Consider adding an optional `serviceId` foreign key to support both structured service bookings and custom requests.

**No Booking Confirmation Tracking**: The schema lacks fields to track whether booking confirmations have been sent, when they were sent, or whether they were acknowledged. This information is valuable for debugging communication issues and ensuring reliable notification delivery.

**Limited Payment Integration**: While the schema includes budget and price fields, there are no fields to track payment status, payment method, transaction IDs, or refund information. The user requirements explicitly exclude Stripe integration, but the schema should still accommodate basic payment tracking if the platform plans to handle any financial transactions in the future.

**No Recurring Booking Support**: The current schema only supports one-time bookings. Many creative services (such as weekly art lessons or ongoing consulting relationships) benefit from recurring booking patterns. Consider adding fields to support series bookings or recurring schedules.

**Availability Window Limitations**: The current availability window design assumes consistent weekly patterns. It cannot easily represent complex schedules like "available every other Tuesday" or "available the first Monday of each month." For MVP purposes, weekly patterns are sufficient, but more sophisticated scheduling may be needed as the platform matures.

---

## 2. Backend API Analysis

The backend API provides a foundational set of tRPC procedures for managing bookings, services, and reviews. The implementation demonstrates proper authentication patterns and basic CRUD operations, but lacks the sophisticated availability calculation and slot management logic required for a complete booking experience.

### 2.1 Booking Router Endpoints

The bookings router exposes three core procedures that handle the basic booking lifecycle:

**`bookings.create`** (Protected Procedure)

This mutation creates a new booking request from a client to an artist. The procedure accepts the artist ID, service description, requested date, optional budget, and optional notes. It automatically sets the booking status to "pending" and records the authenticated user as the client.

```typescript
Input Schema:
- artistId: number (required)
- serviceDescription: string (required, min 1 character)
- requestedDate: Date (required)
- budget: number (optional)
- notes: string (optional)

Returns: { success: boolean }
```

The implementation is straightforward and functional, but it lacks several important validations and business logic checks:

- No verification that the requested date is within the artist's availability windows
- No check for existing bookings or slot locks that might conflict with the requested time
- No validation that the requested date is not during a blackout period
- No enforcement of the artist's advance booking days limit
- No automatic slot lock creation to reserve the time during booking confirmation
- No service duration consideration (since serviceId is not captured)

**`bookings.getMyBookings`** (Protected Procedure)

This query retrieves all bookings relevant to the authenticated user. The procedure intelligently determines whether the user is a client or artist (or both) and returns the appropriate bookings. For artists, it fetches their artist profile and returns bookings where they are the service provider. For clients, it returns bookings where they are the requester.

```typescript
Input: None (uses authenticated user context)

Returns: Array of Booking objects
```

The implementation correctly handles the dual-role nature of users who may be both artists and clients. However, it lacks filtering, sorting, and pagination capabilities that would be essential for users with many bookings. Consider adding query parameters for status filtering, date range filtering, and pagination.

**`bookings.updateStatus`** (Protected Procedure)

This mutation allows authorized users to update the status of a booking. The procedure verifies that the user has permission to modify the booking (either as the client or as the artist) before allowing the status change.

```typescript
Input Schema:
- bookingId: number (required)
- status: enum (required) - accepted, declined, completed, cancelled

Returns: { success: boolean }
```

The authorization logic correctly prevents unauthorized status changes, but the procedure lacks business logic constraints on valid status transitions. For example, it should prevent:

- Accepting or declining a booking that is already completed
- Completing a booking that hasn't been accepted
- Declining a booking after it has been accepted (should require cancellation instead)

Additionally, the procedure doesn't handle the side effects of status changes, such as releasing slot locks when a booking is declined or creating review prompts when a booking is completed.

### 2.2 Services Router Endpoints

The services router was recently added and provides comprehensive CRUD operations for managing artist service offerings. This router is well-implemented and production-ready.

**`services.create`** (Protected Procedure)

Creates a new service offering for the authenticated artist. The procedure validates that the user has an artist profile before allowing service creation.

```typescript
Input Schema:
- name: string (required)
- description: string (optional)
- price: number (required, in cents)
- durationMinutes: number (required)

Returns: { success: boolean }
```

**`services.getByArtistId`** (Public Procedure)

Retrieves all active services for a specific artist. This endpoint is public to allow potential clients to browse service offerings without authentication.

```typescript
Input Schema:
- artistId: number (required)

Returns: Array of Service objects
```

**`services.update`** (Protected Procedure)

Updates an existing service. The procedure verifies that the authenticated user owns the service before allowing modifications.

```typescript
Input Schema:
- serviceId: number (required)
- name: string (optional)
- description: string (optional)
- price: number (optional)
- durationMinutes: number (optional)

Returns: { success: boolean }
```

**`services.delete`** (Protected Procedure)

Deletes a service offering. The procedure verifies ownership before deletion.

```typescript
Input Schema:
- serviceId: number (required)

Returns: { success: boolean }
```

The services router is well-designed and complete. The only enhancement to consider is soft-deletion (setting `isActive` to false) rather than hard deletion to preserve historical data for analytics and to prevent breaking references from existing bookings.

### 2.3 Reviews Router Endpoints

The reviews router implements a basic review system with proper validation of review eligibility.

**`reviews.create`** (Protected Procedure)

Creates a new review for a completed booking. The procedure enforces several important business rules:

- Only the client who made the booking can create a review
- Reviews can only be created for completed bookings
- The booking must exist and be accessible

```typescript
Input Schema:
- bookingId: number (required)
- artistId: number (required)
- rating: number (required, 1-5 range)
- comment: string (optional)

Returns: { success: boolean }
```

The implementation correctly validates review eligibility, but it doesn't check for duplicate reviews (relying on the database unique constraint instead). Consider adding explicit duplicate detection to provide better error messages to users.

**`reviews.getByArtistId`** (Public Procedure)

Retrieves all reviews for a specific artist, ordered by creation date (newest first). This endpoint is public to allow potential clients to read reviews without authentication.

```typescript
Input Schema:
- artistId: number (required)

Returns: Array of Review objects
```

The reviews router is functional but basic. Consider adding pagination, filtering by rating, and the ability to mark reviews as helpful or report inappropriate content as the platform grows.

### 2.4 Database Helper Functions

The `server/db.ts` file provides a comprehensive set of database query helpers that abstract Drizzle ORM operations. The implementation follows good practices by keeping database logic separate from router logic.

**Booking Functions:**
- `createBooking(booking)` - Inserts a new booking record
- `getBookingById(id)` - Retrieves a specific booking
- `getBookingsByClientId(clientId)` - Fetches all bookings for a client
- `getBookingsByArtistId(artistId)` - Fetches all bookings for an artist
- `updateBookingStatus(id, status)` - Updates booking status

**Service Functions:**
- `createService(data)` - Inserts a new service record
- `getServicesByArtistId(artistId)` - Fetches all services for an artist
- `getServiceById(id)` - Retrieves a specific service
- `updateService(id, data)` - Updates service fields
- `deleteService(id)` - Deletes a service record

**Review Functions:**
- `createReview(review)` - Inserts a new review record
- `getReviewsByArtistId(artistId)` - Fetches all reviews for an artist
- `getArtistAverageRating(artistId)` - Calculates average rating and count

The database helper functions are well-organized and follow consistent patterns. However, there are significant gaps in availability management functionality:

**Missing Functions:**
- No functions for creating, reading, updating, or deleting availability windows
- No functions for managing slot locks (create, check conflicts, expire, delete)
- No functions for managing blackout dates
- No functions for managing artist settings
- No availability calculation logic to determine which time slots are bookable
- No conflict detection logic to prevent double-bookings

These missing functions represent the core gap between the current implementation and a production-ready booking engine.

### 2.5 API Strengths

The current API implementation demonstrates several positive architectural decisions:

**Type Safety**: The use of Zod schemas for input validation combined with tRPC's automatic type inference provides end-to-end type safety from the database through the API to the frontend. This significantly reduces the likelihood of runtime errors and improves developer experience.

**Authentication Integration**: The consistent use of `protectedProcedure` for authenticated endpoints and proper context injection (`ctx.user`) ensures that authentication is enforced at the API layer rather than relying on frontend checks.

**Authorization Patterns**: The booking status update procedure demonstrates proper authorization checking by verifying that the user has permission to modify the booking before allowing the operation.

**Error Handling**: The use of tRPC's `TRPCError` with appropriate error codes (`NOT_FOUND`, `FORBIDDEN`, `BAD_REQUEST`) provides structured error responses that the frontend can handle gracefully.

**Separation of Concerns**: The clean separation between router logic (in `routers.ts`) and database operations (in `db.ts`) makes the codebase maintainable and testable.

### 2.6 API Gaps and Missing Features

Despite its solid foundation, the API has significant gaps that prevent it from supporting a complete booking experience:

**No Availability Calculation Endpoint**: There is no procedure to calculate and return available time slots for a given artist, date range, and service duration. This is the most critical missing piece, as clients need to see available times before they can make a booking request.

**No Slot Lock Management**: There are no procedures to create, check, or release slot locks. Without this functionality, the platform cannot prevent double-bookings during the checkout process.

**No Availability Management Endpoints**: Artists have no way to manage their availability windows, blackout dates, or booking settings through the API. These administrative functions are essential for artist autonomy.

**No Booking Validation**: The booking creation endpoint doesn't validate that the requested time is actually available, within the artist's advance booking window, or outside blackout periods.

**No Notification Integration**: The API doesn't trigger notifications when bookings are created, accepted, declined, or completed. While the platform has a `notifyOwner` helper, there's no artist or client notification system.

**No Search and Discovery**: There are no endpoints to search for artists by availability, allowing clients to find artists who have open slots during their desired time frame.

**Limited Analytics**: There are no endpoints to provide artists with booking analytics, revenue summaries, or performance metrics.

---

## 3. Implementation Status Assessment

The booking engine implementation can be characterized as **foundational but incomplete**. The platform has successfully established the data architecture and basic CRUD operations required for a booking system, but it lacks the interactive user experience and sophisticated scheduling logic that would make it functional for end users.

### 3.1 Completed Components

The following components are fully implemented and production-ready:

**Database Schema (100% Complete)**: All seven booking-related tables are defined with appropriate fields, indexes, constraints, and relationships. The schema has been migrated to the database and is ready to store booking data.

**Basic Booking CRUD (80% Complete)**: The API supports creating bookings, retrieving bookings by client or artist, and updating booking status. These operations work correctly but lack validation and business logic.

**Services Management (100% Complete)**: Artists can create, read, update, and delete service offerings through the API. The services router is complete and well-implemented.

**Reviews System (90% Complete)**: Clients can submit reviews for completed bookings, and reviews are displayed on artist profiles. The system correctly validates review eligibility. Minor enhancements like pagination and duplicate detection would improve the implementation.

**Artist Profile Display (100% Complete)**: The frontend displays artist profiles with portfolio images, service cards, and reviews. The visual design aligns with the Neutral Editorial brand strategy and provides an excellent browsing experience.

**Sample Data (100% Complete)**: The platform has six sample artists with 18 services across eight categories and 18 portfolio images. This sample data demonstrates the platform's capabilities and provides a realistic testing environment.

### 3.2 Partially Implemented Components

The following components have been started but require significant additional work:

**Booking Creation Flow (30% Complete)**: The API can create booking records, but there is no interactive booking wizard in the frontend. Clients cannot select services, view available time slots, or complete the booking flow through the UI.

**Artist Dashboard (40% Complete)**: The dashboard page exists and supports profile photo uploads, but it lacks booking management features. Artists cannot view incoming requests, manage their availability, or update their booking settings.

**Booking Status Management (50% Complete)**: The API supports status updates, but there is no UI for artists to accept or decline bookings, and there are no automated status transitions or notifications.

### 3.3 Missing Components

The following components are defined in the schema but have no implementation:

**Availability Management (0% Complete)**: There is no UI or API for artists to define their availability windows, set blackout dates, or configure booking settings. The availability tables exist but are not populated or used.

**Availability Calculation (0% Complete)**: There is no logic to calculate which time slots are available for booking based on availability windows, existing bookings, slot locks, and blackout dates. This is the most critical missing piece.

**Slot Lock System (0% Complete)**: The slot locks table exists, but there is no logic to create locks when clients select time slots, check for conflicts, or automatically expire abandoned locks.

**Interactive Booking Calendar (0% Complete)**: There is no calendar UI component that displays available time slots and allows clients to select a date and time for their booking.

**Booking Notifications (0% Complete)**: There is no notification system to alert artists of new booking requests, inform clients of booking status changes, or send booking reminders.

**Advanced Search (0% Complete)**: There is no ability to search for artists based on their availability during specific date ranges, which would be a valuable feature for clients with scheduling constraints.

**Booking Analytics (0% Complete)**: There are no analytics dashboards showing booking trends, revenue summaries, or performance metrics for artists or platform administrators.

### 3.4 Implementation Priority Matrix

Based on the user requirements and the platform's value proposition as "Calendly meets Upwork for art," the following implementation priorities are recommended:

| Priority | Component | Rationale | Estimated Complexity |
|----------|-----------|-----------|---------------------|
| **Critical** | Availability calculation logic | Core booking functionality, blocks all other features | High |
| **Critical** | Interactive booking calendar UI | Primary user interaction, essential for MVP | High |
| **Critical** | Availability management UI | Artists must be able to set their schedules | Medium |
| **High** | Slot lock implementation | Prevents double-bookings, critical for reliability | Medium |
| **High** | Booking notifications | Essential for user engagement and workflow | Medium |
| **High** | Enhanced artist dashboard | Artists need to manage incoming requests | Medium |
| **Medium** | Service-booking relationship | Improves analytics and booking validation | Low |
| **Medium** | Booking status validation | Prevents invalid state transitions | Low |
| **Medium** | Sample reviews | Builds social proof for sample artists | Low |
| **Low** | Advanced availability search | Nice-to-have for clients with constraints | Medium |
| **Low** | Booking analytics | Valuable for growth but not essential for MVP | Medium |
| **Low** | Recurring bookings | Useful for ongoing relationships but not MVP | High |

---

## 4. Architectural Recommendations

Based on the analysis of the current implementation, the following architectural recommendations will guide the completion of the booking engine.

### 4.1 Availability Calculation Strategy

The availability calculation logic is the most complex and critical missing component. The system must determine which time slots are available for booking by considering multiple factors:

**Input Parameters:**
- Artist ID
- Service duration (in minutes)
- Date range to check
- Artist's timezone

**Calculation Steps:**

1. **Retrieve Availability Windows**: Query the `availabilityWindows` table for the artist's active weekly schedule. Group windows by day of week.

2. **Generate Candidate Slots**: For each date in the range, check if there is an availability window for that day of week. If so, generate time slots at regular intervals (e.g., every 30 minutes) within the window that can accommodate the service duration.

3. **Apply Blackout Dates**: Filter out any dates that fall within the artist's blackout periods from the `blackoutDates` table.

4. **Check Existing Bookings**: Query the `bookings` table for accepted bookings on those dates. Remove any time slots that would conflict with existing bookings, considering the service duration and any booking buffer time from `artistSettings`.

5. **Check Slot Locks**: Query the `slotLocks` table for active locks (where `expiresAt` is in the future). Remove any time slots that are currently locked by other users.

6. **Apply Advance Booking Limit**: Filter out any dates that are beyond the artist's `advanceBookingDays` setting from `artistSettings`.

7. **Apply Booking Buffer**: Ensure that there is sufficient buffer time between consecutive bookings based on the artist's `bookingBufferMinutes` setting.

8. **Return Available Slots**: Return an array of available time slots with date, start time, and end time in the artist's timezone.

**Implementation Considerations:**

- This calculation should be implemented as a database helper function that can be called from multiple contexts (booking creation, calendar display, search).
- The function should be optimized for performance, as it may be called frequently. Consider caching results for short periods (e.g., 5 minutes) to reduce database load.
- The function should handle timezone conversions carefully to ensure that availability windows are interpreted correctly regardless of the client's location.
- The function should be thoroughly tested with edge cases like overnight availability windows (e.g., 22:00 to 02:00), daylight saving time transitions, and bookings that span multiple time slots.

### 4.2 Slot Lock Workflow

The slot lock mechanism prevents double-bookings by temporarily reserving time slots during the booking process. The recommended workflow is:

**When Client Selects a Time Slot:**

1. Check if the slot is available using the availability calculation logic.
2. Check if there is an existing active lock on the slot.
3. If available and unlocked, create a new slot lock with:
   - `artistId`: The artist being booked
   - `date`: The booking date (YYYY-MM-DD format)
   - `startTime`: The slot start time (HH:MM format)
   - `durationMinutes`: The service duration
   - `lockedBy`: The authenticated user's ID
   - `expiresAt`: Current time + lock duration (e.g., 10 minutes)
4. Return the lock ID to the frontend to include in the booking creation request.

**When Client Completes Booking:**

1. Verify that the lock still exists and belongs to the user.
2. Verify that the lock has not expired.
3. Create the booking record.
4. Delete the slot lock (it's no longer needed).

**When Client Abandons Booking:**

1. Allow the lock to expire naturally based on the `expiresAt` timestamp.
2. Run a periodic cleanup job (e.g., every minute) that deletes expired locks from the database.

**Lock Duration Considerations:**

- Lock duration should be long enough for users to complete the booking form but short enough to prevent slots from being unnecessarily unavailable.
- A duration of 10-15 minutes is typical for booking systems.
- Consider showing a countdown timer in the UI to create urgency and inform users of the lock expiration.

### 4.3 Interactive Booking Flow Design

The interactive booking flow should be implemented as a multi-step modal or dedicated page with the following stages:

**Step 1: Service Selection**

Display the artist's available services with name, description, price, and duration. Allow the client to select one service to book. If the booking is for a custom request, provide an option to enter a custom service description.

**Step 2: Date and Time Selection**

Display a calendar component showing the current month and next month. Use the availability calculation logic to determine which dates have available slots. Visually distinguish available dates (e.g., with a colored dot) from unavailable dates (greyed out).

When the user selects a date, display a list of available time slots for that date. Each slot should show the start time, end time, and timezone. When the user selects a time slot, create a slot lock and proceed to the next step.

**Step 3: Budget and Notes**

If the service has a fixed price, display it prominently. If the service allows custom pricing, provide a budget input field. Allow the client to enter optional notes or special requests.

**Step 4: Review and Confirm**

Display a summary of the booking details:
- Artist name and profile photo
- Service name and description
- Date and time (in the client's timezone)
- Duration
- Price or budget
- Notes

Provide a "Confirm Booking" button that creates the booking record and releases the slot lock.

**Step 5: Confirmation**

Display a success message with the booking details and next steps. Inform the client that the artist will review their request and respond within a specified timeframe (e.g., 24 hours).

**Error Handling:**

- If the slot lock expires during the booking process, inform the user and allow them to select a new time slot.
- If the slot becomes unavailable (e.g., another user booked it while the lock was expiring), inform the user and return them to the calendar.
- If the booking creation fails for any reason, release the slot lock and display an error message.

### 4.4 Artist Dashboard Enhancements

The artist dashboard should be enhanced to provide comprehensive booking management capabilities:

**Incoming Requests Tab:**

Display all pending bookings with client name, service requested, date/time, budget, and notes. Provide "Accept" and "Decline" buttons for each request. When accepting a request, create a confirmed booking and send a notification to the client. When declining, update the status and optionally provide a reason.

**Upcoming Bookings Tab:**

Display all accepted bookings that haven't occurred yet, sorted by date. Show client contact information, service details, and any special notes. Provide a "Cancel" button with a confirmation dialog.

**Past Bookings Tab:**

Display completed bookings with the option to view reviews. Provide analytics on total bookings, revenue, and average rating.

**Availability Management Section:**

Provide a UI to create, edit, and delete availability windows. Use a weekly calendar view where artists can click to add availability blocks. For each block, allow setting:
- Day of week
- Start time
- End time
- Active/inactive toggle

**Blackout Dates Section:**

Provide a calendar view where artists can select date ranges to block out. For each blackout period, allow setting:
- Start date
- End date
- Optional reason

**Booking Settings Section:**

Provide form inputs for:
- Booking buffer time (in minutes)
- Maximum advance booking days
- Cancellation policy (free-form text)

### 4.5 Notification Strategy

Implement a notification system to keep users informed of booking events:

**For Artists:**
- New booking request received
- Booking cancelled by client
- Review submitted for completed booking

**For Clients:**
- Booking request accepted
- Booking request declined (with optional reason)
- Booking reminder (e.g., 24 hours before scheduled time)
- Prompt to leave a review after booking completion

**Implementation Options:**

1. **Email Notifications**: Use the platform's built-in notification system or integrate with an email service provider (e.g., SendGrid, Postmark).

2. **In-App Notifications**: Create a notifications table and display unread notifications in the header. This requires additional database schema and UI components.

3. **Push Notifications**: For mobile users, implement push notifications using web push APIs or native mobile apps.

For MVP purposes, email notifications are sufficient. Consider adding in-app notifications as the platform grows.

### 4.6 Testing Strategy

Given the complexity of the booking engine, a comprehensive testing strategy is essential:

**Unit Tests:**
- Test availability calculation logic with various scenarios (overlapping bookings, blackout dates, buffer times, timezone conversions)
- Test slot lock creation, expiration, and conflict detection
- Test booking status validation and state transitions

**Integration Tests:**
- Test the complete booking flow from service selection through confirmation
- Test the artist dashboard booking management workflow
- Test notification delivery for all booking events

**Edge Case Tests:**
- Bookings that span midnight
- Availability windows that span midnight
- Daylight saving time transitions
- Concurrent booking attempts for the same time slot
- Expired slot locks during booking process

**Performance Tests:**
- Test availability calculation performance with large numbers of bookings
- Test database query performance with realistic data volumes
- Test concurrent user load on the booking system

The platform already uses Vitest for testing. Expand the test suite to cover the new booking engine functionality as it is implemented.

---

## 5. Implementation Roadmap

Based on the analysis and recommendations, the following phased implementation roadmap will guide the completion of the booking engine.

### Phase 1: Core Availability System (Week 1-2)

**Objective**: Implement the foundational availability calculation logic and data management.

**Tasks:**
1. Create database helper functions for availability windows (create, read, update, delete)
2. Create database helper functions for blackout dates (create, read, update, delete)
3. Create database helper functions for artist settings (create, read, update)
4. Implement the availability calculation algorithm as described in section 4.1
5. Create tRPC procedures to expose availability management to the frontend
6. Write comprehensive unit tests for availability calculation logic
7. Seed sample availability data for the six existing sample artists

**Deliverables:**
- Availability calculation function that returns available time slots
- API endpoints for managing availability windows, blackout dates, and settings
- Test suite with >80% coverage of availability logic
- Sample data demonstrating various availability patterns

### Phase 2: Interactive Booking Flow (Week 3-4)

**Objective**: Build the frontend booking wizard that allows clients to book services.

**Tasks:**
1. Create a calendar component that displays available dates
2. Create a time slot selector that shows available times for a selected date
3. Implement the multi-step booking wizard modal (service selection, date/time, budget/notes, confirmation)
4. Integrate the booking wizard with the existing artist profile pages
5. Add "Book Now" buttons to service cards and artist profiles
6. Implement slot lock creation when users select time slots
7. Add slot lock expiration countdown timer to the booking wizard
8. Implement booking creation with slot lock validation
9. Add booking confirmation page with next steps
10. Test the complete booking flow with various scenarios

**Deliverables:**
- Functional booking wizard accessible from artist profile pages
- Calendar component showing available dates
- Time slot selector showing available times
- Booking confirmation flow
- Slot lock mechanism preventing double-bookings

### Phase 3: Artist Dashboard Enhancement (Week 5)

**Objective**: Provide artists with tools to manage bookings and availability.

**Tasks:**
1. Add "Incoming Requests" tab to artist dashboard with pending bookings
2. Implement accept/decline actions for booking requests
3. Add "Upcoming Bookings" tab with accepted bookings
4. Add "Past Bookings" tab with completed bookings and reviews
5. Create availability management UI with weekly calendar view
6. Create blackout dates management UI with calendar picker
7. Create booking settings form for buffer time, advance booking days, and cancellation policy
8. Add booking analytics summary (total bookings, revenue, average rating)
9. Test all dashboard functionality

**Deliverables:**
- Enhanced artist dashboard with booking management
- Availability management interface
- Blackout dates management interface
- Booking settings configuration
- Basic analytics display

### Phase 4: Notifications and Polish (Week 6)

**Objective**: Implement notifications and refine the user experience.

**Tasks:**
1. Set up email notification infrastructure
2. Implement booking request notification for artists
3. Implement booking acceptance notification for clients
4. Implement booking decline notification for clients
5. Implement booking reminder notifications (24 hours before)
6. Implement review prompt notification after booking completion
7. Add notification preferences to user settings
8. Implement slot lock cleanup job
9. Add loading states and error handling throughout booking flow
10. Conduct user acceptance testing and gather feedback
11. Fix bugs and refine UI based on feedback

**Deliverables:**
- Email notifications for all booking events
- Automated slot lock cleanup
- Polished user experience with proper loading states and error handling
- Bug fixes and refinements based on testing

### Phase 5: Sample Data and Documentation (Week 7)

**Objective**: Create realistic sample data and comprehensive documentation.

**Tasks:**
1. Add availability windows for all six sample artists
2. Create 3-5 sample reviews for each artist with varied ratings and testimonials
3. Create sample bookings in various states (pending, accepted, completed)
4. Update MIGRATION_GUIDE.md with booking engine documentation
5. Create BOOKING_ENGINE_USER_GUIDE.md for end users
6. Create BOOKING_ENGINE_TECHNICAL_GUIDE.md for developers
7. Update API documentation with new endpoints
8. Create video walkthrough demonstrating booking flow
9. Prepare for checkpoint and GitHub release

**Deliverables:**
- Complete sample data demonstrating all booking features
- Comprehensive documentation for users and developers
- Video demonstration of booking flow
- Updated GitHub repository with v2.0.0 release

---

## 6. Conclusion

The Solely Art Platform has established a solid architectural foundation for a sophisticated booking engine that can compete with established platforms like Calendly and Upwork. The database schema is well-designed and production-ready, with thoughtful consideration of complex scheduling requirements including timezone handling, slot locking, and flexible availability patterns. The backend API provides basic CRUD operations with proper authentication and authorization patterns.

However, the implementation remains incomplete, with significant gaps between the database schema and the interactive user experience required for a functional booking system. The most critical missing components are the availability calculation logic, interactive booking calendar UI, slot lock management, and artist availability management interfaces. Without these components, the platform cannot deliver on its core value proposition of connecting clients with artists for bookable creative services.

The recommended implementation roadmap provides a clear path forward, prioritizing the core availability system and interactive booking flow before moving on to dashboard enhancements and notifications. By following this phased approach, the platform can achieve a functional MVP booking engine within 6-7 weeks of focused development effort.

The booking engine represents the heart of the Solely Art Platform's value proposition. Once implemented, it will differentiate the platform from simple artist directories and portfolio sites by providing a seamless, professional booking experience that benefits both artists and clients. Artists will gain autonomy over their schedules and booking policies, while clients will enjoy the convenience of real-time availability and instant booking confirmation.

With the strong foundation already in place and a clear roadmap for completion, the Solely Art Platform is well-positioned to deliver a best-in-class booking experience for the creative services marketplace.

---

## Appendix A: Database Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ openId          │
│ name            │
│ email           │
│ userType        │
│ role            │
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────────────┐
│   artistProfiles        │
├─────────────────────────┤
│ id (PK)                 │
│ userId (FK, unique)     │
│ displayName             │
│ bio                     │
│ location                │
│ categories              │
│ portfolioImages         │
│ hourlyRate              │
│ isAvailable             │
└────────┬────────────────┘
         │
         │ 1:N
         ├──────────────────────────────┐
         │                              │
┌────────▼────────────────┐    ┌───────▼──────────────┐
│      services           │    │  availabilityWindows │
├─────────────────────────┤    ├──────────────────────┤
│ id (PK)                 │    │ id (PK)              │
│ artistId (FK)           │    │ artistId (FK)        │
│ name                    │    │ dayOfWeek            │
│ description             │    │ startTime            │
│ price                   │    │ endTime              │
│ durationMinutes         │    │ timezone             │
│ isActive                │    │ isActive             │
└─────────────────────────┘    └──────────────────────┘
                                         
         │                              │
         │ 1:N                          │ 1:N
         │                              │
┌────────▼────────────────┐    ┌───────▼──────────────┐
│      slotLocks          │    │   blackoutDates      │
├─────────────────────────┤    ├──────────────────────┤
│ id (PK)                 │    │ id (PK)              │
│ artistId (FK)           │    │ artistId (FK)        │
│ date                    │    │ startDate            │
│ startTime               │    │ endDate              │
│ durationMinutes         │    │ reason               │
│ lockedBy (FK)           │    └──────────────────────┘
│ expiresAt               │
└─────────────────────────┘
                                         
         │                              
         │ 1:1                          
         │                              
┌────────▼────────────────┐    
│   artistSettings        │    
├─────────────────────────┤    
│ id (PK)                 │    
│ artistId (FK, unique)   │    
│ bookingBufferMinutes    │    
│ advanceBookingDays      │    
│ cancellationPolicy      │    
└─────────────────────────┘    

┌─────────────────────────┐
│       bookings          │
├─────────────────────────┤
│ id (PK)                 │
│ clientId (FK)           │───┐
│ artistId (FK)           │   │
│ serviceDescription      │   │
│ requestedDate           │   │
│ status                  │   │
│ budget                  │   │
│ notes                   │   │
└────────┬────────────────┘   │
         │                    │
         │ 1:1                │
         │                    │
┌────────▼────────────────┐   │
│       reviews           │   │
├─────────────────────────┤   │
│ id (PK)                 │   │
│ bookingId (FK, unique)  │   │
│ clientId (FK)           │───┘
│ artistId (FK)           │
│ rating                  │
│ comment                 │
└─────────────────────────┘
```

---

## Appendix B: Booking State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                     Booking Lifecycle                        │
└─────────────────────────────────────────────────────────────┘

                    [Client creates booking]
                              │
                              ▼
                      ┌───────────────┐
                      │   PENDING     │
                      └───────┬───────┘
                              │
                ┌─────────────┼─────────────┐
                │                           │
                ▼                           ▼
        ┌───────────────┐           ┌──────────────┐
        │   ACCEPTED    │           │   DECLINED   │
        └───────┬───────┘           └──────────────┘
                │                          (terminal)
                │
    ┌───────────┼───────────┐
    │                       │
    ▼                       ▼
┌──────────────┐    ┌───────────────┐
│  COMPLETED   │    │   CANCELLED   │
└──────┬───────┘    └───────────────┘
       │                   (terminal)
       │
       ▼
[Review can be created]

Valid Transitions:
- PENDING → ACCEPTED (artist accepts)
- PENDING → DECLINED (artist declines)
- PENDING → CANCELLED (client cancels)
- ACCEPTED → COMPLETED (service delivered)
- ACCEPTED → CANCELLED (either party cancels)

Invalid Transitions:
- DECLINED → any state (terminal)
- CANCELLED → any state (terminal)
- COMPLETED → any state (terminal)
- Any state → PENDING (cannot revert to pending)
```

---

**Document End**
