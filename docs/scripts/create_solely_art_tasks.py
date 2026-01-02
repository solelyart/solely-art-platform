#!/usr/bin/env python3
"""
Script to create Monday.com tasks for Solely Art Platform from Master Implementation Guide.
Focuses on critical MVP tasks organized by phase.
"""

import json
import subprocess
import time
import sys

# Board ID for Solely Art - Artist Booking Platform
BOARD_ID = 18391050422

# Group ID for Phase 1: Foundation (Weeks 1-4) - CRITICAL
GROUP_ID = "group_mkyb3nd6"

# Column IDs (from board info)
COLUMNS = {
    "notes": "long_text_mkybrj92",
    "effort_hours": "numeric_mkybvp",
    "status": "color_mkybqz3t",
    "priority": "color_mkybc1he",
    "phase": "color_mkybvrre",
    "estimated_cost": "numeric_mkyb1hgh"
}

# Critical tasks from Master Implementation Guide
# Organized by category for MVP launch
TASKS = [
    # Business Formation (Week 1-3)
    {
        "name": "File NC LLC Articles of Organization",
        "notes": "File at sosnc.gov - $125 fee. Receive Certificate of Formation within 24-48 hours. Required for banking and tax purposes.",
        "effort": 2,
        "cost": 125,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Obtain EIN from IRS",
        "notes": "Apply at irs.gov - free and immediate. Required for banking, taxes, and Stripe account.",
        "effort": 0.5,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Register with NC Department of Revenue",
        "notes": "Register at ncdor.gov for state tax ID - free. Required for NC tax compliance.",
        "effort": 1,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Draft LLC Operating Agreement",
        "notes": "Cover ownership, management, capital, profit/loss distribution, dissolution. Use template ($100) or attorney ($500-1,000).",
        "effort": 4,
        "cost": 500,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Schedule NC CPA consultation for tax strategy",
        "notes": "Discuss NC income tax (4.75%), quarterly payments, deductions. Cost: $200-500. Critical for tax planning.",
        "effort": 2,
        "cost": 350,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Schedule NC employment attorney consultation",
        "notes": "Review NC ABC test for independent contractor classification. Cost: $1,500-3,000. Critical to avoid misclassification liability.",
        "effort": 2,
        "cost": 2000,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Draft artist independent contractor agreement",
        "notes": "Address NC ABC test: free from control, outside usual course, independent trade. Must be attorney-reviewed to ensure compliance.",
        "effort": 6,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Draft Terms of Service",
        "notes": "Cover platform rules, booking/cancellation policies, payment terms, dispute resolution, liability, indemnification. Attorney review required.",
        "effort": 8,
        "cost": 1000,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Draft Privacy Policy",
        "notes": "Cover data collection, usage, sharing, cookies, user rights, NC breach notification, contact info. Attorney review required.",
        "effort": 6,
        "cost": 500,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    
    # Banking & Financial Setup (Week 2-4)
    {
        "name": "Open Mercury business checking account",
        "notes": "Apply at mercury.com with EIN, Articles of Organization, ID. Approval in 24-48 hours. Free account. Required for Stripe payouts.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Enable two-factor authentication (MFA) on Mercury",
        "notes": "Critical security requirement for cyber insurance. Enable immediately after account creation.",
        "effort": 0.5,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Set up QuickBooks Online for accounting",
        "notes": "Configure chart of accounts, connect to Mercury, set up categorization rules. Cost: $30-90/month. Required for tax filing.",
        "effort": 4,
        "cost": 60,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Configure Stripe account business profile",
        "notes": "Complete business name, description, address, tax ID (EIN), bank account (Mercury), statement descriptor. Required before accepting payments.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Enable Stripe Connect for artist payouts",
        "notes": "Choose Connect type: Express (recommended). Configure 12% platform commission, daily payouts, standard verification. Core marketplace feature.",
        "effort": 3,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Configure Stripe Radar fraud rules",
        "notes": "Block high-risk countries, high-value first-time customers, rapid repeat payments. Enable 3DS for $200+ transactions. Prevents fraud losses.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    
    # Insurance Setup (Week 3-5)
    {
        "name": "Purchase Coalition cyber liability insurance",
        "notes": "Apply at coalitioninc.com. $1M/$1M coverage. Includes Tech E&O, 24/7 breach coach, proof of loss prep. Cost: $1,200-2,000/year. Required before launch.",
        "effort": 3,
        "cost": 1600,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Purchase general liability insurance",
        "notes": "Bodily injury, property damage coverage. $1M per occurrence / $2M aggregate. Cost: $400-800/year. Required before launch.",
        "effort": 2,
        "cost": 600,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Save Coalition 24/7 incident hotline",
        "notes": "1-888-COALITION - Critical contact for data breaches, ransomware, cyber incidents. Save in multiple locations and brief team.",
        "effort": 0.5,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    
    # Database & Backend (Week 4-5)
    {
        "name": "Design database schema for marketplace",
        "notes": "Tables: artist_profiles, services, bookings, reviews, audit_logs. Include Stripe IDs, verification status, trust levels. Foundation for all features.",
        "effort": 6,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Implement schema in drizzle/schema.ts",
        "notes": "Use Drizzle ORM syntax. Include proper types, indexes, foreign keys. Run pnpm db:push to create tables.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Create database helper functions",
        "notes": "Functions: getArtistProfile, getServicesByArtist, getBookingById, getBookingsByClient, getReviewsByArtist, updateArtistRating. Reusable across endpoints.",
        "effort": 6,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    {
        "name": "Create Stripe Connect helper functions",
        "notes": "Functions: createConnectAccount, createAccountLink, getAccountStatus, createPaymentIntent, createRefund. Test in test mode with test cards.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 1: Pre-Launch (Weeks 1-4)"
    },
    
    # tRPC Endpoints (Week 5-6)
    {
        "name": "Create artist management tRPC endpoints",
        "notes": "Endpoints: createProfile, updateProfile, uploadPortfolioImage, startStripeOnboarding, checkStripeStatus, getProfile. Write Vitest tests for all.",
        "effort": 10,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create service management tRPC endpoints",
        "notes": "Endpoints: create, update, delete, uploadImage, getById, getByArtist, search. Write Vitest tests. Enable artists to list services.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create booking management tRPC endpoints",
        "notes": "Endpoints: create (with fraud checks), accept, decline, complete, confirmCompletion, requestRefund. Core marketplace transaction flow.",
        "effort": 12,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    
    # Fraud Detection & Webhooks (Week 6)
    {
        "name": "Implement velocity check fraud detection",
        "notes": "Max 5 bookings/24h, 2 bookings/1h, $2,000 total/24h per user. Prevents fraud and chargebacks. File: server/utils/fraud-detection.ts.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Implement artist trust level limits",
        "notes": "New artist: max $250/booking. Trusted: max $1,000. Verified: no limits. Reduces fraud risk for new artists.",
        "effort": 3,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Stripe webhook handler",
        "notes": "Handle events: payment_intent.succeeded, payment_failed, charge.refunded, charge.dispute.created, account.updated, payout.paid/failed. Critical for payment flow.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    
    # Frontend Development (Week 7-8)
    {
        "name": "Implement design system in index.css",
        "notes": "Color palette, typography (Google Fonts), spacing, radius, shadows. Foundation for consistent UI.",
        "effort": 4,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Home page with hero and featured artists",
        "notes": "Hero section, value proposition, featured artists, how it works, categories, testimonials, CTAs. First impression for users.",
        "effort": 8,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Artist Directory page with search/filter",
        "notes": "Search and filter UI (specialty, location, price), artist grid, pagination. Core discovery feature.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Artist Profile page",
        "notes": "Bio, portfolio gallery (lightbox), services offered, reviews/ratings, CTA to book. Showcases artist work.",
        "effort": 8,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Booking Form with Stripe Elements",
        "notes": "Service selection, date/time picker, location, special requests, price summary, Stripe payment (card, billing address). Core transaction flow.",
        "effort": 10,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Client Dashboard",
        "notes": "My Bookings (upcoming, past, cancelled), filter by status, booking cards with actions (view, review, refund). Client booking management.",
        "effort": 8,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create Artist Dashboard",
        "notes": "Overview (earnings, bookings, ratings), Bookings (accept/decline/complete), Services (CRUD), Portfolio, Stripe Onboarding. Artist management hub.",
        "effort": 12,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    
    # Security Implementation (Week 6-8)
    {
        "name": "Implement MFA for admin accounts",
        "notes": "Generate secret, QR code, verification. Required for cyber insurance. File: server/routers.ts (auth.enableMFA, auth.verifyMFA).",
        "effort": 6,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Implement rate limiting on endpoints",
        "notes": "Login: 5 attempts/15min. Password reset: 3/hour. Booking: 10/hour. Payment: 3/hour. Prevents brute force attacks.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Implement audit logging for security events",
        "notes": "Log: login success/failure, password changes, MFA enabled/disabled, payments, refunds, admin actions. Required for incident response.",
        "effort": 6,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Create incident response plan document",
        "notes": "Team roles, detection/analysis, containment, eradication, recovery, post-incident review. Playbooks for data breach, ransomware, BEC.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    
    # Testing & QA (Week 9-10)
    {
        "name": "Write comprehensive Vitest tests for all endpoints",
        "notes": "Test all tRPC endpoints with valid/invalid data, edge cases, error scenarios. Achieve >80% code coverage. Critical for quality.",
        "effort": 12,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Test complete payment flow in test mode",
        "notes": "Test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (failure). Test booking creation, acceptance, completion, refund.",
        "effort": 4,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    {
        "name": "Conduct manual testing checklist",
        "notes": "Test all features: auth, artist onboarding, booking flow, payment, reviews, refunds, fraud detection, security. All browsers and devices.",
        "effort": 8,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 2: Beta Launch (Weeks 5-8)"
    },
    
    # Pre-Launch Final (Week 13-14)
    {
        "name": "Switch Stripe to live mode",
        "notes": "Go to Stripe Dashboard → Settings → Payment. Switch from test to live. Verify live API keys in Manus Management UI → Settings → Secrets.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)"
    },
    {
        "name": "Test payment with real card (small amount)",
        "notes": "Make real booking with real card, small amount ($5-10). Verify commission deposits to Mercury. Refund immediately after test.",
        "effort": 1,
        "cost": 10,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)"
    },
    {
        "name": "Create final pre-launch checkpoint",
        "notes": "Run webdev_save_checkpoint with description: 'Final checkpoint before public launch - all features complete, tested, and optimized'.",
        "effort": 0.5,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)"
    },
    {
        "name": "Set up uptime monitoring",
        "notes": "Use UptimeRobot or Pingdom. Monitor platform availability. Configure alerts for downtime, high error rate, slow response times.",
        "effort": 2,
        "cost": 0,
        "priority": "Critical",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)"
    },
    {
        "name": "Prepare launch announcement",
        "notes": "Blog post, social media posts (Twitter, Instagram, Facebook), email to beta users, press release (optional). Ready to publish on launch day.",
        "effort": 6,
        "cost": 0,
        "priority": "High",
        "phase": "Phase 3: Public Launch & Growth (Months 3-6)"
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
    
    # Convert to JSON string (escape quotes properly)
    column_values_json = json.dumps(column_values)
    
    # Build input JSON
    input_data = {
        "boardId": BOARD_ID,
        "groupId": GROUP_ID,
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
    print(f"Creating {len(TASKS)} tasks on Solely Art Monday.com board...")
    print(f"Board ID: {BOARD_ID}")
    print(f"Group: Phase 1: Foundation (Weeks 1-4) - CRITICAL")
    print()
    
    total_tasks = len(TASKS)
    successful_tasks = 0
    failed_tasks = []
    
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
