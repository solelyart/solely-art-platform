#!/usr/bin/env python3
"""
Script to create Monday.com tasks from the Master Task List.
Organizes tasks by phase and creates them with appropriate metadata.
"""

import json
import subprocess
import time

# Board ID for Grant Software - Team Structure
BOARD_ID = 18391214964

# Group mappings (from board info)
GROUPS = {
    "phase_0": "group_mkyj438g",  # Phase 0: Revenue Blockers (46-58h)
    "phase_1": "group_mkyj3qf1",  # Phase 1: Paid Differentiators (30-36h)
    "phase_1_5": "group_mkyjvt1f",  # Phase 1.5: Federal Beta (Optional)
    "phase_2_plus": "group_mkyjx9wx",  # Phase 2+: Post-Launch (Deferred)
}

# Status labels (from board info)
STATUS_LABELS = {
    "backlog": {"label": "Backlog"},
    "ready": {"label": "Ready"},
    "in_progress": {"label": "In Progress"},
    "in_review": {"label": "In Review"},
    "done": {"label": "Done"},
    "blocked": {"label": "Blocked"},
    "stuck": {"label": "Stuck"}
}

# Priority labels
PRIORITY_LABELS = {
    "critical": {"label": "Critical"},
    "high": {"label": "High"},
    "medium": {"label": "Medium"},
    "low": {"label": "Low"}
}

# Phase labels
PHASE_LABELS = {
    "phase_0": {"label": "Phase 0: MVP Blockers"},
    "phase_1": {"label": "Phase 1: High Priority"},
    "phase_2": {"label": "Phase 2: Medium Priority"},
    "phase_3": {"label": "Phase 3: Low Priority"},
    "phase_4": {"label": "Phase 4: Future Enhancements"}
}

# Tasks organized by phase
TASKS = {
    "Pre-Launch Phase (Weeks 1-2)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "File NC LLC Articles of Organization",
                "notes": "File at sosnc.gov - $125 fee. Receive Certificate of Formation within 24-48 hours.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Obtain EIN from IRS",
                "notes": "Apply at irs.gov - free and immediate. Required for banking and tax purposes.",
                "effort": 0.5,
                "status": "backlog"
            },
            {
                "name": "Register with NC Department of Revenue",
                "notes": "Register at ncdor.gov for state tax ID - free. Required for NC tax compliance.",
                "effort": 1,
                "status": "backlog"
            },
            {
                "name": "Set up registered agent for LLC",
                "notes": "Can be yourself or use registered agent service ($100-300/year).",
                "effort": 1,
                "status": "backlog"
            },
            {
                "name": "Draft LLC Operating Agreement",
                "notes": "Cover ownership, management, capital, profit/loss distribution, dissolution. Use template ($100) or attorney ($500-1,000).",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Schedule NC CPA consultation for tax strategy",
                "notes": "Discuss NC income tax (4.75%), quarterly payments, deductions. Cost: $200-500.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Schedule NC employment attorney consultation",
                "notes": "Review NC ABC test for independent contractor classification. Cost: $1,500-3,000.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Research Mercury vs Relay vs Wise banking",
                "notes": "Compare features, fees, API access. Recommendation: Mercury for primary account.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Prepare documents for Mercury account opening",
                "notes": "Gather: EIN confirmation, Articles of Organization, ID, business information.",
                "effort": 1,
                "status": "backlog"
            },
            {
                "name": "Identify insurance broker specializing in tech/cyber",
                "notes": "Contact 2-3 brokers for quotes. Focus on cyber liability, E&O, general liability.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Create detailed project timeline (12-16 weeks)",
                "notes": "Break down all phases, assign deadlines, identify dependencies.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Choose design style (colors, fonts, layout)",
                "notes": "Select color palette, typography (Google Fonts), layout approach for marketplace.",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Sketch wireframes for key pages",
                "notes": "Home, artist profile, booking flow, dashboards. Use Figma or paper sketches.",
                "effort": 6,
                "status": "backlog"
            },
            {
                "name": "Choose and purchase domain name",
                "notes": "solelyart.com or similar. Cost: ~$15/year. Or use Manus auto-generated domain.",
                "effort": 1,
                "status": "backlog"
            },
            {
                "name": "Design logo for Solely Art Platform",
                "notes": "DIY with Canva (free) or hire designer ($100-500).",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Create brand guidelines document",
                "notes": "Document colors, fonts, tone of voice, logo usage, brand personality.",
                "effort": 3,
                "status": "backlog"
            }
        ]
    },
    "Business Formation (Weeks 1-3)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "Draft artist independent contractor agreement",
                "notes": "Address NC ABC test: free from control, outside usual course, independent trade. Must be attorney-reviewed.",
                "effort": 6,
                "status": "backlog"
            },
            {
                "name": "Review IC agreement with NC employment attorney",
                "notes": "Ensure compliance with NC ABC test. Critical for avoiding misclassification liability.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Set up 1099-NEC process for artists earning $600+",
                "notes": "Document process for collecting W-9s, generating 1099-NEC forms, filing with IRS by Jan 31.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Draft Terms of Service",
                "notes": "Cover platform rules, booking/cancellation policies, payment terms, dispute resolution, liability, indemnification.",
                "effort": 8,
                "status": "backlog"
            },
            {
                "name": "Draft Privacy Policy",
                "notes": "Cover data collection, usage, sharing, cookies, user rights, NC breach notification, contact info.",
                "effort": 6,
                "status": "backlog"
            },
            {
                "name": "Review Terms of Service and Privacy Policy with attorney",
                "notes": "Legal review to ensure compliance. Cost: $500-2,000.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Set up quarterly estimated tax payment schedule",
                "notes": "Q1: Apr 15, Q2: Jun 15, Q3: Sep 15, Q4: Jan 15. Set aside 35-40% of revenue monthly.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Set up QuickBooks Online for accounting",
                "notes": "Configure chart of accounts, connect to Mercury, set up categorization rules. Cost: $30-90/month.",
                "effort": 4,
                "status": "backlog"
            }
        ]
    },
    "Banking & Financial Setup (Weeks 2-4)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "Open Mercury business checking account",
                "notes": "Apply at mercury.com with EIN, Articles of Organization, ID. Approval in 24-48 hours. Free account.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Enable two-factor authentication (MFA) on Mercury",
                "notes": "Critical security requirement for cyber insurance.",
                "effort": 0.5,
                "status": "backlog"
            },
            {
                "name": "Connect Mercury to QuickBooks",
                "notes": "Enable automatic transaction sync and categorization.",
                "effort": 1,
                "status": "backlog"
            },
            {
                "name": "Set up Mercury API access for financial dashboard",
                "notes": "Generate API key in Mercury dashboard, store securely in environment variables.",
                "effort": 1,
                "status": "backlog"
            },
            {
                "name": "Configure Stripe account business profile",
                "notes": "Complete business name, description, address, tax ID (EIN), bank account (Mercury), statement descriptor.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Enable Stripe Connect for artist payouts",
                "notes": "Choose Connect type: Express (recommended). Configure 12% platform commission, daily payouts, standard verification.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Configure Stripe Radar fraud rules",
                "notes": "Block high-risk countries, high-value first-time customers, rapid repeat payments. Enable 3DS for $200+ transactions.",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Set up Stripe webhook endpoints",
                "notes": "Register /api/webhooks/stripe for payment_intent, charge, account, payout events.",
                "effort": 2,
                "status": "backlog"
            }
        ]
    },
    "Insurance Setup (Weeks 3-5)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "Contact insurance brokers for quotes",
                "notes": "Contact 2-3 brokers specializing in tech/cyber. Provide business model, revenue projections, security measures.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Document current security measures for insurance",
                "notes": "List: MFA enabled, daily backups, antivirus, regular updates, incident response plan.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Purchase Coalition cyber liability insurance",
                "notes": "Apply at coalitioninc.com. $1M/$1M coverage. Includes Tech E&O, breach coach, proof of loss prep. Cost: $1,200-2,000/year.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Purchase general liability insurance",
                "notes": "Bodily injury, property damage coverage. $1M per occurrence / $2M aggregate. Cost: $400-800/year.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Verify Tech E&O coverage in Coalition policy",
                "notes": "Confirm Tech E&O is bundled with cyber insurance (should be included at no extra cost).",
                "effort": 0.5,
                "status": "backlog"
            },
            {
                "name": "Save Coalition 24/7 incident hotline: 1-888-COALITION",
                "notes": "Critical contact for data breaches, ransomware, cyber incidents. Save in multiple locations.",
                "effort": 0.5,
                "status": "backlog"
            },
            {
                "name": "Create insurance summary document",
                "notes": "List all policies, coverage limits, deductibles, policy numbers, effective dates, renewal dates, claims hotlines.",
                "effort": 2,
                "status": "backlog"
            },
            {
                "name": "Add insurance renewal dates to calendar",
                "notes": "Set reminders 60 days before renewal for all policies.",
                "effort": 0.5,
                "status": "backlog"
            }
        ]
    },
    "Database & Backend (Weeks 4-5)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "Design database schema for marketplace",
                "notes": "Tables: artist_profiles, services, bookings, reviews, audit_logs. Include Stripe IDs, verification status, trust levels.",
                "effort": 6,
                "status": "backlog"
            },
            {
                "name": "Implement schema in drizzle/schema.ts",
                "notes": "Use Drizzle ORM syntax. Include proper types, indexes, foreign keys.",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Run pnpm db:push to create tables",
                "notes": "Push schema changes to database. Verify tables created in Management UI → Database.",
                "effort": 0.5,
                "status": "backlog"
            },
            {
                "name": "Create database helper functions in server/db.ts",
                "notes": "Helpers: getArtistProfile, getServicesByArtist, getBookingById, getBookingsByClient, getReviewsByArtist, updateArtistRating.",
                "effort": 6,
                "status": "backlog"
            },
            {
                "name": "Create Stripe Connect helper functions",
                "notes": "Functions: createConnectAccount, createAccountLink, getAccountStatus, createPaymentIntent, createRefund.",
                "effort": 8,
                "status": "backlog"
            },
            {
                "name": "Test Stripe functions in test mode",
                "notes": "Use test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 0002 (failure).",
                "effort": 3,
                "status": "backlog"
            }
        ]
    },
    "tRPC Endpoints (Week 5-6)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "Create artist management tRPC endpoints",
                "notes": "Endpoints: createProfile, updateProfile, uploadPortfolioImage, startStripeOnboarding, checkStripeStatus, getProfile, submitVerification.",
                "effort": 10,
                "status": "backlog"
            },
            {
                "name": "Write Vitest tests for artist endpoints",
                "notes": "Test all endpoints with valid/invalid data. Achieve >80% coverage. File: server/artist.test.ts.",
                "effort": 6,
                "status": "backlog"
            },
            {
                "name": "Create service management tRPC endpoints",
                "notes": "Endpoints: create, update, delete, uploadImage, getById, getByArtist, search.",
                "effort": 8,
                "status": "backlog"
            },
            {
                "name": "Write Vitest tests for service endpoints",
                "notes": "Test CRUD operations, image uploads, search functionality. File: server/service.test.ts.",
                "effort": 5,
                "status": "backlog"
            },
            {
                "name": "Create booking management tRPC endpoints",
                "notes": "Endpoints: create (with fraud checks), accept, decline, complete, uploadEvidence, confirmCompletion, requestRefund, getById, getMyBookings.",
                "effort": 12,
                "status": "backlog"
            },
            {
                "name": "Write Vitest tests for booking endpoints",
                "notes": "Test booking creation, velocity limits, trust limits, accept/decline, completion, refund flows. File: server/booking.test.ts.",
                "effort": 8,
                "status": "backlog"
            }
        ]
    },
    "Fraud Detection & Webhooks (Week 6)": {
        "group": "phase_0",
        "priority": "critical",
        "phase": "phase_0",
        "tasks": [
            {
                "name": "Implement velocity check fraud detection",
                "notes": "Max 5 bookings/24h, 2 bookings/1h, $2,000 total/24h per user. File: server/utils/fraud-detection.ts.",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Implement new user risk detection",
                "notes": "Flag: user created <24h ago + booking >$500. Trigger manual review.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Implement artist trust level limits",
                "notes": "New artist: max $250/booking. Trusted: max $1,000. Verified: no limits.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Write tests for fraud detection logic",
                "notes": "Test all velocity checks, trust limits, risk scoring. File: server/fraud-detection.test.ts.",
                "effort": 4,
                "status": "backlog"
            },
            {
                "name": "Create Stripe webhook handler",
                "notes": "Handle events: payment_intent.succeeded, payment_failed, charge.refunded, charge.dispute.created, account.updated, payout.paid/failed.",
                "effort": 8,
                "status": "backlog"
            },
            {
                "name": "Test webhooks with Stripe CLI",
                "notes": "Run: stripe listen --forward-to localhost:3001/api/webhooks/stripe. Test all event types.",
                "effort": 3,
                "status": "backlog"
            },
            {
                "name": "Write tests for webhook handler",
                "notes": "Test all event types, signature verification, error handling. File: server/webhooks/stripe.test.ts.",
                "effort": 5,
                "status": "backlog"
            }
        ]
    }
}

def create_task(board_id, group_id, name, notes, effort, status, priority, phase):
    """Create a single task in Monday.com"""
    
    # Build column values
    column_values = {
        "long_text_mkyc7v6w": notes,  # Notes column
        "numeric_mkygbvsa": effort,  # Effort (Hours) column
        "color_mkygdqzx": STATUS_LABELS.get(status, STATUS_LABELS["backlog"]),  # Status column
        "color_mkygfxaw": PRIORITY_LABELS.get(priority, PRIORITY_LABELS["medium"]),  # Priority column
        "color_mkyg15nr": PHASE_LABELS.get(phase, PHASE_LABELS["phase_0"])  # Phase column
    }
    
    # Convert to JSON string
    column_values_json = json.dumps(column_values)
    
    # Build input JSON
    input_json = json.dumps({
        "boardId": board_id,
        "groupId": group_id,
        "name": name,
        "columnValues": column_values_json
    })
    
    # Call Monday.com MCP tool
    cmd = [
        "manus-mcp-cli", "tool", "call", "create_item",
        "--server", "monday-com",
        "--input", input_json
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"✅ Created: {name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create: {name}")
        print(f"   Error: {e.stderr}")
        return False

def main():
    """Main function to create all tasks"""
    print(f"Creating tasks on Monday.com board {BOARD_ID}...")
    print()
    
    total_tasks = 0
    successful_tasks = 0
    
    for section_name, section_data in TASKS.items():
        print(f"\n{'='*60}")
        print(f"Section: {section_name}")
        print(f"{'='*60}")
        
        group_id = GROUPS[section_data["group"]]
        priority = section_data["priority"]
        phase = section_data["phase"]
        
        for task in section_data["tasks"]:
            total_tasks += 1
            
            success = create_task(
                board_id=BOARD_ID,
                group_id=group_id,
                name=task["name"],
                notes=task["notes"],
                effort=task["effort"],
                status=task.get("status", "backlog"),
                priority=priority,
                phase=phase
            )
            
            if success:
                successful_tasks += 1
            
            # Rate limiting - wait 1 second between requests
            time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"Summary: {successful_tasks}/{total_tasks} tasks created successfully")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
