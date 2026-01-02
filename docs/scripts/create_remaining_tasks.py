#!/usr/bin/env python3
"""
Script to create remaining Monday.com tasks from Master Implementation Guide.
Includes all additional tasks not covered in the first batch.
"""

import json
import subprocess
import time
import sys

# Board ID for Solely Art - Artist Booking Platform
BOARD_ID = 18391050422

# Group IDs (from board info)
GROUPS = {
    "phase_1": "group_mkyb3nd6",  # Phase 1: Foundation (Weeks 1-4) - CRITICAL
    "phase_2": "group_mkybara1",  # Phase 2: Beta Launch (Weeks 5-8) - HIGH
    "phase_3": "group_mkybsn59",  # Phase 3: Public Launch & Growth (Months 3-6) - MEDIUM
    "phase_4": "group_mkyb1b5f",  # Phase 4: Scale & Monetization (Months 7-12) - LOW
}

# Column IDs
COLUMNS = {
    "notes": "long_text_mkybrj92",
    "effort_hours": "numeric_mkybvp",
    "status": "color_mkybqz3t",
    "priority": "color_mkybc1he",
    "phase": "color_mkybvrre",
    "estimated_cost": "numeric_mkyb1hgh"
}

# Additional tasks organized by section
TASKS = [
    # ============================================================
    # PRE-LAUNCH PHASE - Additional Planning Tasks
    # ============================================================
    {
        "name": "Research competitor marketplaces for UX inspiration",
        "notes": "Study Thumbtack, Upwork, Fiverr, Etsy for booking flows, artist profiles, search/filter UX. Document best practices.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Create brand guidelines document",
        "notes": "Document colors, fonts, tone of voice, logo usage, brand personality. Foundation for consistent branding.",
        "effort": 3,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Design logo for Solely Art Platform",
        "notes": "DIY with Canva (free) or hire designer ($100-500). Should work at multiple sizes and on light/dark backgrounds.",
        "effort": 4,
        "cost": 300,
        "priority": "Medium",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Choose and purchase domain name",
        "notes": "solelyart.com or similar. Cost: ~$15/year. Or use Manus auto-generated domain (free).",
        "effort": 1,
        "cost": 15,
        "priority": "Medium",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Set up registered agent for LLC",
        "notes": "Can be yourself (use home address) or registered agent service ($100-300/year). Required for LLC formation.",
        "effort": 1,
        "cost": 150,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Set up quarterly estimated tax payment schedule",
        "notes": "Q1: Apr 15, Q2: Jun 15, Q3: Sep 15, Q4: Jan 15. Set calendar reminders. Set aside 35-40% of revenue monthly for taxes.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Review IC agreement with NC employment attorney",
        "notes": "Ensure compliance with NC ABC test. Critical for avoiding misclassification liability. Cost included in attorney consultation.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Set up 1099-NEC process for artists earning $600+",
        "notes": "Document process: collect W-9s from artists, generate 1099-NEC forms (QuickBooks), mail to artists by Jan 31, file with IRS by Jan 31.",
        "effort": 3,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Review Terms of Service and Privacy Policy with attorney",
        "notes": "Legal review to ensure compliance with NC law, GDPR (if applicable), CCPA. Cost: $500-2,000.",
        "effort": 2,
        "cost": 1000,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    
    # ============================================================
    # BANKING & FINANCIAL - Additional Setup
    # ============================================================
    {
        "name": "Connect Mercury to QuickBooks",
        "notes": "Enable automatic transaction sync and categorization. Saves hours of manual bookkeeping monthly.",
        "effort": 1,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Set up Mercury API access for financial dashboard",
        "notes": "Generate API key in Mercury dashboard, store securely in environment variables. Enables custom financial dashboards.",
        "effort": 1,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Set up Stripe webhook endpoints",
        "notes": "Register /api/webhooks/stripe in Stripe Dashboard for payment_intent, charge, account, payout events. Critical for payment flow.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Test Stripe functions in test mode",
        "notes": "Use test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (failure). Test all Stripe helper functions.",
        "effort": 3,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    
    # ============================================================
    # INSURANCE - Additional Tasks
    # ============================================================
    {
        "name": "Contact insurance brokers for quotes",
        "notes": "Contact 2-3 brokers specializing in tech/cyber. Provide business model, revenue projections, security measures. Get competitive quotes.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Document current security measures for insurance",
        "notes": "List: MFA enabled, daily backups, antivirus, regular updates, incident response plan. Required for cyber insurance application.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Verify Tech E&O coverage in Coalition policy",
        "notes": "Confirm Tech E&O is bundled with cyber insurance (should be included at no extra cost). Covers software bugs and service failures.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Create insurance summary document",
        "notes": "List all policies, coverage limits, deductibles, policy numbers, effective dates, renewal dates, claims hotlines. Store securely.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    {
        "name": "Add insurance renewal dates to calendar",
        "notes": "Set reminders 60 days before renewal for all policies. Prevents coverage lapses.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)",
        "group": "phase_1"
    },
    
    # ============================================================
    # DATABASE & BACKEND - Additional Tasks
    # ============================================================
    {
        "name": "Run pnpm db:push to create tables",
        "notes": "Push schema changes to database. Verify tables created in Management UI → Database. Check indexes and foreign keys.",
        "effort": 0.5,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Test all database helper functions with sample data",
        "notes": "Create test data, run all helper functions, verify results. Ensure proper error handling and edge cases.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # tRPC ENDPOINTS - Additional Testing
    # ============================================================
    {
        "name": "Write Vitest tests for artist endpoints",
        "notes": "Test all endpoints with valid/invalid data. Achieve >80% coverage. File: server/artist.test.ts. Run pnpm test.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Write Vitest tests for service endpoints",
        "notes": "Test CRUD operations, image uploads, search functionality. File: server/service.test.ts. Run pnpm test.",
        "effort": 5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Write Vitest tests for booking endpoints",
        "notes": "Test booking creation, velocity limits, trust limits, accept/decline, completion, refund flows. File: server/booking.test.ts.",
        "effort": 8,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # FRAUD DETECTION - Additional Tasks
    # ============================================================
    {
        "name": "Implement new user risk detection",
        "notes": "Flag: user created <24h ago + booking >$500. Trigger manual review. Prevents fraud from new accounts.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Write tests for fraud detection logic",
        "notes": "Test all velocity checks, trust limits, risk scoring. File: server/fraud-detection.test.ts. Run pnpm test.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Test webhooks with Stripe CLI",
        "notes": "Run: stripe listen --forward-to localhost:3001/api/webhooks/stripe. Test all event types (payment, refund, dispute, payout).",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Write tests for webhook handler",
        "notes": "Test all event types, signature verification, error handling. File: server/webhooks/stripe.test.ts. Run pnpm test.",
        "effort": 5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # FRONTEND - Additional Pages & Components
    # ============================================================
    {
        "name": "Add Google Fonts to client/index.html",
        "notes": "Choose 2-3 fonts (heading, body, monospace). Add <link> tags for Google Fonts CDN. Update index.css with font families.",
        "effort": 1,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create reusable UI components",
        "notes": "Components: ArtistCard, ServiceCard, BookingCard, ReviewCard, EmptyState, LoadingSpinner, ErrorMessage. Use shadcn/ui.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Service Detail Page",
        "notes": "Service description and images, pricing information, artist information (mini profile), CTA to book now.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create About Page",
        "notes": "Platform mission and story, team information, contact information. Builds trust with users.",
        "effort": 3,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Booking Policy Page",
        "notes": "Payment and refund policies, cancellation policies, service expectations, chargeback warning. Sets clear expectations.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Booking Detail Page",
        "notes": "Booking info (date, time, location, price), artist info, service info, status timeline, completion evidence, actions (confirm, review, refund).",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Leave Review Modal",
        "notes": "Star rating (1-5), comment textarea, submit button. Use optimistic update (show review immediately).",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Artist Bookings page",
        "notes": "List of all bookings (pending, confirmed, completed), filter by status, booking cards with actions (accept/decline, mark complete, upload evidence).",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Artist Services page",
        "notes": "List of all services, add new service button, edit/delete service actions, toggle active/inactive.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Service Form component",
        "notes": "Title, description, category, pricing type (hourly, fixed, custom), base price, duration, image upload (multiple). Save with optimistic update.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Artist Portfolio page",
        "notes": "Portfolio image grid, upload new image button, delete image action. Future: drag-and-drop reordering.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Stripe Onboarding page",
        "notes": "Check if onboarding complete. If not, show 'Complete Stripe Setup' button. Opens Stripe Connect onboarding link. Show success after completion.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Booking Confirmation page",
        "notes": "Success message, booking details, next steps (artist will review and accept), link to view booking in dashboard.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Login Page",
        "notes": "Manus OAuth login button. Use getLoginUrl() from template. Redirect to dashboard after login.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create Account Settings page",
        "notes": "User profile (name, email), password change (if applicable), MFA setup (enable two-factor authentication), logout button.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Update App.tsx with all routes",
        "notes": "Public routes: /, /artists, /artists/:id, /services/:id, /about, /booking-policy, /login. Protected routes: /dashboard, /artist/dashboard, etc.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create top navigation component",
        "notes": "Logo (links to home), nav links (Browse Artists, Become an Artist, About), user menu (Dashboard, Settings, Logout), login button.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # LLM FEATURES (Week 9)
    # ============================================================
    {
        "name": "Create smart artist matching LLM helper",
        "notes": "Function: matchArtists(query, artists). Extract intent from natural language, identify style/medium/subject preferences, score artists, return ranked list.",
        "effort": 6,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create search.smartMatch tRPC endpoint",
        "notes": "Input: natural language query (e.g., 'watercolor portrait of my dog'). Call matchArtists(). Return top 10 matches with relevance scores.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Update Artist Directory to use smart matching",
        "notes": "Add natural language search input, call search.smartMatch on submit, display results with relevance indicators.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create automated service description LLM helper",
        "notes": "Function: generateDescription(serviceInfo). Input: basic service info. Output: SEO-optimized, engaging description (200-300 words).",
        "effort": 4,
        "cost": 0,
        "priority": "Low",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Add Generate Description button to ServiceForm",
        "notes": "Artist provides basic info, clicks 'Generate Description', LLM generates description, artist can edit. Saves time for artists.",
        "effort": 3,
        "cost": 0,
        "priority": "Low",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create intelligent search with LLM enhancement",
        "notes": "Combine keyword search + semantic matching. LLM understands intent and context. Returns ranked results with 'Did you mean...?' suggestions.",
        "effort": 6,
        "cost": 0,
        "priority": "Low",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # POLISH & OPTIMIZATION (Week 10)
    # ============================================================
    {
        "name": "Optimize images (compress, thumbnails, lazy loading)",
        "notes": "Compress portfolio images before upload, generate thumbnails for grid views, use lazy loading for images below the fold.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Optimize database queries (indexes, pagination, caching)",
        "notes": "Add indexes for frequently queried fields, use pagination for large lists, implement query result caching.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Optimize frontend (code splitting, lazy load, minimize bundle)",
        "notes": "Code splitting for large pages, lazy load components below the fold, minimize bundle size with tree shaking.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Ensure accessibility (keyboard, ARIA, screen reader, contrast)",
        "notes": "All interactive elements keyboard accessible, ARIA labels, test with screen reader (NVDA/JAWS), WCAG AA color contrast.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Test responsive design (mobile, tablet, desktop)",
        "notes": "Test all pages on mobile (375px), tablet (768px), desktop (1280px+). Fix layout issues. Touch targets 44x44px. Test on real devices.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Add error boundaries and error handling",
        "notes": "Add error boundaries in React, handle network errors gracefully, show user-friendly error messages, add retry logic for failed requests.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Handle empty states consistently",
        "notes": "Empty states for: no bookings, no artists, no services, no reviews. Use EmptyState component with helpful messages and CTAs.",
        "effort": 3,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Write compelling copy for all pages",
        "notes": "Home page copy, booking flow instructions, error messages, email templates (booking confirmations, notifications). Proofread all content.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # SECURITY - Additional Implementation
    # ============================================================
    {
        "name": "Create MFA setup UI in SecuritySettings page",
        "notes": "Show QR code for scanning, verification code input, success message. Guide users through setup process.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Test rate limiting with automated requests",
        "notes": "Test all rate limits: login (5/15min), password reset (3/hour), booking (10/hour), payment (3/hour). Verify blocks work.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Implement session invalidation on password change",
        "notes": "When user changes password, invalidate all existing sessions. Force re-login on all devices.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Implement logout all devices functionality",
        "notes": "Allow users to invalidate all sessions from account settings. Useful if device is lost or compromised.",
        "effort": 3,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Add password strength indicator to UI",
        "notes": "Visual indicator (weak, medium, strong) based on password requirements. Guide users to create strong passwords.",
        "effort": 2,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Implement file upload malware scanning",
        "notes": "Optional: integrate VirusTotal API to scan uploaded files for malware. Reject malicious files.",
        "effort": 4,
        "cost": 0,
        "priority": "Low",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create monitoring dashboard for admins",
        "notes": "Dashboard showing: recent failed logins, recent admin actions, suspicious activity alerts. Admin-only access.",
        "effort": 6,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Set up security monitoring script (runs every 5 min)",
        "notes": "Monitor: brute force attacks (>10 failed logins from IP), impossible travel (logins from different countries <1h), unusual payment patterns.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Configure security headers with helmet",
        "notes": "Install helmet, configure: CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, X-XSS-Protection. Test with securityheaders.com.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create security policy document",
        "notes": "Password policy, access control policy, data protection policy, incident reporting policy, acceptable use policy.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create security procedures document",
        "notes": "Onboarding procedure, offboarding procedure, access review procedure (quarterly), backup and recovery procedure, patch management procedure.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Test backup restoration",
        "notes": "Create test database, restore from backup, verify data integrity. Document recovery procedure. Set monthly reminder to test restoration.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Conduct security training with team",
        "notes": "Training: password security, phishing awareness, social engineering, data protection, incident reporting. Document completion. Schedule quarterly refresher.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # BETA LAUNCH (Weeks 11-12)
    # ============================================================
    {
        "name": "Recruit 10-20 trusted artists for beta",
        "notes": "Friends, family, colleagues, local artists from social media, artists from existing networks. Offer incentive (free first booking, reduced commission).",
        "effort": 4,
        "cost": 100,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Recruit 50-100 potential clients for beta",
        "notes": "Friends, family, colleagues, local community members, social media followers. Offer incentive (discount on first booking).",
        "effort": 4,
        "cost": 100,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create beta invitation email",
        "notes": "Explain beta program, set expectations (bugs expected, feedback needed), provide signup link, offer incentive.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Send beta invitations to all recruited users",
        "notes": "Send invitation emails to artists and clients. Track responses. Follow up with non-responders.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create checkpoint before beta launch",
        "notes": "Run webdev_save_checkpoint with description: 'Pre-beta launch checkpoint - all features ready for beta testing'.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Set up support email (support@solelyart.com)",
        "notes": "Create support email, set up forwarding to personal email, create support email templates for common questions.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create beta feedback form",
        "notes": "Google Forms or Typeform. Questions: What did you like? What was confusing? What features are missing? Would you recommend? Any bugs?",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Announce beta launch to invited users",
        "notes": "Send beta launch announcement email with signup link, getting started guide, support email, feedback form link.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Monitor platform closely for first 24 hours",
        "notes": "Watch for errors in logs, monitor Stripe Dashboard for payment issues, monitor Mercury for deposits, respond to support emails quickly.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Track key beta metrics",
        "notes": "Signups (artists and clients), artist profiles created, services listed, bookings created, payments processed, reviews left.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Send feedback survey to beta users after 1 week",
        "notes": "Send survey to all beta users. Ask: What did you like? What was confusing? What features are missing? Would you recommend? Any bugs?",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Conduct 1-on-1 interviews with 5-10 beta users",
        "notes": "Watch them use the platform, ask follow-up questions, identify pain points. Record sessions (with permission) for later review.",
        "effort": 8,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Analyze feedback and identify top issues",
        "notes": "Categorize feedback: critical bugs, UX improvements, feature requests. Prioritize by impact and effort.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Fix critical bugs from beta feedback",
        "notes": "Fix all critical bugs that prevent core functionality. Test fixes with beta users.",
        "effort": 12,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Implement top UX improvements from beta feedback",
        "notes": "Implement highest-impact UX improvements before public launch. Retest with beta users.",
        "effort": 16,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    {
        "name": "Create checkpoint after beta fixes",
        "notes": "Run webdev_save_checkpoint with description: 'Post-beta improvements - critical bugs fixed, UX improved based on feedback'.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)",
        "group": "phase_2"
    },
    
    # ============================================================
    # PRE-LAUNCH FINAL (Weeks 13-14)
    # ============================================================
    {
        "name": "Run complete manual testing checklist again",
        "notes": "Test all features: auth, artist onboarding, booking flow, payment, reviews, refunds, fraud detection, security. All browsers and devices.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Fix any remaining bugs",
        "notes": "Fix all remaining critical and high-priority bugs. Retest. Document known medium/low priority issues for post-launch.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Run Lighthouse audit and optimize",
        "notes": "Run Lighthouse audit. Target: >90 performance score. Optimize images, code, caching. Retest until target achieved.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Run security scan (OWASP ZAP or similar)",
        "notes": "Run automated security scan. Fix any vulnerabilities found. Retest. Document results.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Run penetration test (optional, $5,000)",
        "notes": "Hire security firm to conduct penetration test. Fix any vulnerabilities found. Get security report for insurance.",
        "effort": 8,
        "cost": 5000,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Review and update Terms of Service",
        "notes": "Ensure Terms of Service are up-to-date with all features and policies. Get final attorney review if needed.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Review and update Privacy Policy",
        "notes": "Ensure Privacy Policy is up-to-date with all data collection and usage. Verify NC breach notification procedures documented.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Ensure all policies are linked in footer",
        "notes": "Footer links: Terms of Service, Privacy Policy, Booking Policy, About, Contact. Verify links work.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Verify 1099-NEC process ready for tax season",
        "notes": "Document process, test with sample data, ensure QuickBooks configured correctly. Ready for January 1099-NEC filing.",
        "effort": 2,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Verify Mercury account connected to Stripe",
        "notes": "Test commission deposit (make test booking, verify deposit in Mercury). Verify automatic daily deposits configured.",
        "effort": 1,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Set up low balance alerts in Mercury",
        "notes": "Configure alerts for balance <$1,000. Prevents insufficient funds for artist payouts.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Set up fraud alerts in Mercury",
        "notes": "Configure alerts for unusual transactions. Helps detect unauthorized access quickly.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Verify all insurance policies are active",
        "notes": "Check: cyber liability (Coalition), general liability, Tech E&O. Verify no lapses. Save all certificates.",
        "effort": 1,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Brief team on when to call insurance",
        "notes": "Brief team: call Coalition 24/7 hotline (1-888-COALITION) for data breach, ransomware, cyber incident. Document in incident response plan.",
        "effort": 1,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create launch announcement blog post",
        "notes": "Write compelling launch announcement. Explain platform value proposition, how it works, featured artists. Include screenshots.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create launch social media posts",
        "notes": "Create posts for Twitter, Instagram, Facebook. Include screenshots, value proposition, link to platform. Schedule to publish on launch day.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create launch email to beta users",
        "notes": "Thank beta users, announce public launch, invite them to continue using platform, ask for testimonials.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create press release (optional)",
        "notes": "Write press release for local media. Explain platform, target market, launch date, contact info. Distribute to local newspapers, blogs.",
        "effort": 4,
        "cost": 0,
        "priority": "Low",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Prepare marketing materials (screenshots, demo video, testimonials)",
        "notes": "Screenshots of platform, demo video (optional, 2-3 min), artist testimonials, client testimonials. Use for marketing and press.",
        "effort": 6,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Set up social media accounts",
        "notes": "Create accounts: Instagram @solelyart, Twitter @solelyart, Facebook page. Complete profiles with logo, description, link.",
        "effort": 2,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create content calendar for first month",
        "notes": "Plan social media posts for first month: artist spotlights, booking tips, platform features, user testimonials. Schedule posts.",
        "effort": 4,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Test final checkpoint rollback",
        "notes": "Test rollback to ensure checkpoint works. Verify all data and code restored correctly. Re-create checkpoint after test.",
        "effort": 1,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Set up error tracking (Sentry or similar)",
        "notes": "Install Sentry, configure error tracking, set up alerts. Helps catch and fix errors quickly in production.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Set up performance monitoring (New Relic or similar)",
        "notes": "Install New Relic, configure performance monitoring, set up alerts for slow response times.",
        "effort": 2,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Configure monitoring alerts",
        "notes": "Alerts: platform downtime, high error rate, slow response times, failed payments, security events. Send to email/Slack.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Test all monitoring alerts",
        "notes": "Trigger each alert type to ensure they work. Verify delivery to email/Slack. Fix any issues.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create support email templates",
        "notes": "Templates: booking questions, payment issues, account issues, refund requests, general inquiries. Save in support email or Google Docs.",
        "effort": 3,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Create FAQ page on website",
        "notes": "FAQs: How do I book? How do I become an artist? What's your refund policy? How do payments work? Add to footer.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Define support hours and response time SLA",
        "notes": "Define: support hours (9am-5pm ET?), response time SLA (respond within 24 hours?). Communicate to users.",
        "effort": 1,
        "cost": 0,
        "priority": "Medium",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Brief team on launch plan",
        "notes": "Brief: launch date/time, roles and responsibilities, monitoring procedures, escalation procedures, support procedures.",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Conduct launch dry run (simulate launch)",
        "notes": "Simulate launch day: publish announcement, monitor platform, respond to simulated support requests. Identify any issues.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Schedule launch for Tuesday-Thursday morning",
        "notes": "Choose launch date: Tuesday-Thursday (avoid Mon/Fri), morning (allows full day to monitor). Clear calendars for launch day.",
        "effort": 0.5,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    },
    {
        "name": "Prepare all launch materials (ready to publish)",
        "notes": "Ready to publish: blog post, social media posts (scheduled), email to beta users (ready to send).",
        "effort": 2,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)",
        "group": "phase_3"
    }
]

def create_task(task_data):
    """Create a single task in Monday.com"""
    
    # Build column values
    column_values = {
        COLUMNS["notes"]: task_data["notes"],
        COLUMNS["effort_hours"]: task_data["effort"],
        COLUMNS["status"]: {"label": "Backlog"},
        COLUMNS["priority"]: {"label": task_data["priority"]},
        COLUMNS["phase"]: {"label": task_data["phase"]},
        COLUMNS["estimated_cost"]: task_data["cost"]
    }
    
    # Convert to JSON string
    column_values_json = json.dumps(column_values)
    
    # Build input JSON
    input_data = {
        "boardId": BOARD_ID,
        "groupId": GROUPS[task_data["group"]],
        "name": task_data["name"],
        "columnValues": column_values_json
    }
    
    input_json = json.dumps(input_data)
    
    # Call Monday.com MCP tool
    cmd = [
        "manus-mcp-cli", "tool", "call", "create_item",
        "--server", "monday-com",
        "--input", input_json
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True, timeout=30)
        print(f"✅ Created: {task_data['name']}")
        return True
    except subprocess.TimeoutExpired:
        print(f"⏱️  Timeout creating: {task_data['name']}")
        return False
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create: {task_data['name']}")
        if e.stderr:
            print(f"   Error: {e.stderr[:200]}")
        return False
    except Exception as e:
        print(f"❌ Exception creating: {task_data['name']}")
        print(f"   Error: {str(e)[:200]}")
        return False

def main():
    """Main function to create all tasks"""
    print(f"Creating {len(TASKS)} additional tasks on Solely Art Monday.com board...")
    print(f"Board ID: {BOARD_ID}")
    print()
    
    total_tasks = len(TASKS)
    successful_tasks = 0
    failed_tasks = []
    
    # Group tasks by phase for reporting
    phase_counts = {}
    for task in TASKS:
        phase = task["phase"]
        phase_counts[phase] = phase_counts.get(phase, 0) + 1
    
    print("📊 Tasks by Phase:")
    for phase, count in sorted(phase_counts.items()):
        print(f"   {phase}: {count} tasks")
    print()
    
    for i, task in enumerate(TASKS, 1):
        print(f"[{i}/{total_tasks}] ", end="")
        
        success = create_task(task)
        
        if success:
            successful_tasks += 1
        else:
            failed_tasks.append(task["name"])
        
        # Rate limiting - wait 2 seconds between requests
        if i < total_tasks:
            time.sleep(2)
    
    print(f"\n{'='*80}")
    print(f"✅ Summary: {successful_tasks}/{total_tasks} tasks created successfully")
    
    if failed_tasks:
        print(f"\n❌ Failed tasks ({len(failed_tasks)}):")
        for task_name in failed_tasks:
            print(f"   - {task_name}")
    
    print(f"{'='*80}")
    
    # Calculate totals
    total_effort = sum(task["effort"] for task in TASKS)
    total_cost = sum(task["cost"] for task in TASKS)
    
    print(f"\n📊 Task Statistics:")
    print(f"   Total effort: {total_effort} hours")
    print(f"   Total estimated cost: ${total_cost:,}")
    print(f"   Average effort per task: {total_effort/total_tasks:.1f} hours")
    
    return 0 if successful_tasks == total_tasks else 1

if __name__ == "__main__":
    sys.exit(main())
