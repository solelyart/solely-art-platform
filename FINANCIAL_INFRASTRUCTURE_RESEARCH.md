# Financial Infrastructure Research
## Solely Art Platform - Revenue Tracking & Banking Setup

---

## 1. Stripe Connect for Marketplaces

### Overview
Stripe Connect is the recommended solution for marketplace platforms like Solely Art. It handles payments between multiple parties (clients → platform → artists) with built-in compliance, tax handling, and payout management.

### Key Concepts

**Marketplace Model:**
- **Merchant of Record**: Platform (Solely Art) is legally responsible for transactions
- **Payment Flow**: Client pays platform → Platform pays Stripe fees → Platform pays out to artists
- **Revenue Model**: Platform keeps application fee (commission) from each transaction

**Example Transaction ($100 booking):**
```
Client pays: $100.00
├─ Stripe fee: $1.50 (platform pays)
├─ Platform commission: $10.00 (10% application fee)
└─ Artist receives: $88.50
```

### Connect Account Types

**Express Accounts** (Recommended for Solely Art):
- Stripe-hosted onboarding (minimal integration)
- Artists get Express Dashboard for viewing payouts
- Stripe handles compliance, tax forms (1099s), identity verification
- Platform controls payout timing
- Best for: Platforms that want quick setup with less maintenance

**Standard Accounts**:
- Artists create their own full Stripe accounts
- More control for artists, less control for platform
- Artists see full transaction details
- Best for: Platforms where sellers are sophisticated businesses

**Custom Accounts**:
- Platform builds entire onboarding and dashboard
- Maximum control and customization
- Platform responsible for compliance, KYC, tax forms
- Best for: Large platforms with engineering resources

**Recommendation**: Start with **Express** accounts for faster launch, migrate to Custom later if needed.

### Monetization Strategies

1. **Application Fees** (Primary revenue source)
   - Charge 5-15% commission on each booking
   - Deducted automatically during payout
   - Covers platform costs + profit margin

2. **Subscription Fees**
   - Monthly/annual fees for premium artist features
   - Use Stripe Billing for recurring charges
   - Examples: Featured listings, advanced analytics, priority support

3. **White-label Financial Products**
   - **Instant Payouts**: Artists pay fee for same-day access to funds
   - **Stripe Capital**: Offer loans to artists based on booking history
   - **Stripe Issuing**: Branded debit cards for artists

### Payment Charge Types

**Destination Charges** (Recommended):
- Single API call creates charge and transfer
- Platform account is charged Stripe fees
- Simpler implementation
- Better for: Standard marketplace flows

**Separate Charges and Transfers**:
- Charge created on platform account
- Separate transfer to artist account
- More flexibility for complex splits
- Better for: Multi-party splits (e.g., referral fees)

---

## 2. Business Banking Setup

### Bank Account Requirements

**Platform Operating Account:**
- Business checking account for daily operations
- Receives application fees (platform revenue)
- Pays platform expenses (hosting, salaries, marketing)
- Connected to Stripe for automatic deposits

**Stripe Balance Account:**
- Stripe holds funds temporarily before payout
- Not a real bank account, but acts as clearing account
- Funds flow: Client → Stripe Balance → Artist bank account
- Platform commission automatically deposited to operating account

### Recommended Banking Structure

```
[Client Payment] → [Stripe Balance]
                       ├─→ [Artist Bank Account] (88.50)
                       ├─→ [Platform Operating Account] (10.00 commission)
                       └─→ [Stripe] (1.50 fees)
```

### Business Bank Account Providers

**Traditional Banks:**
- Chase Business Banking
- Bank of America Business Advantage
- Wells Fargo Business Banking
- Pros: Branch access, established relationships
- Cons: Monthly fees, minimum balances, slower setup

**Modern Fintech Banks:**
- Mercury (popular with startups)
- Brex Business Account
- Novo Business Banking
- Pros: No fees, fast setup, better UX, API integrations
- Cons: No physical branches, newer companies

**Recommendation**: **Mercury** or **Brex** for fast setup and modern features, or **Chase** if you need branch access and established banking relationships.

---

## 3. Revenue Tracking & Accounting

### Financial Data to Track

**Transaction-Level Data:**
- Booking ID
- Client ID
- Artist ID
- Total amount paid by client
- Platform commission (application fee)
- Stripe processing fee
- Net payout to artist
- Transaction timestamp
- Payment method
- Refund status

**Aggregate Metrics:**
- Gross Merchandise Volume (GMV): Total client payments
- Net Revenue: Platform commissions after Stripe fees
- Average commission rate
- Refund rate
- Artist payout totals
- Outstanding balances

### Database Schema for Financial Tracking

```sql
-- Transactions table
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  client_id INT NOT NULL,
  artist_id INT NOT NULL,
  
  -- Amounts in cents
  gross_amount INT NOT NULL,           -- Total paid by client
  platform_commission INT NOT NULL,     -- Application fee
  stripe_fee INT NOT NULL,              -- Stripe processing fee
  artist_payout INT NOT NULL,           -- Net to artist
  
  status ENUM('pending', 'succeeded', 'failed', 'refunded'),
  payment_method VARCHAR(50),
  currency VARCHAR(3) DEFAULT 'USD',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  INDEX idx_artist_id (artist_id),
  INDEX idx_client_id (client_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Payouts table (tracks transfers to artists)
CREATE TABLE payouts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  artist_id INT NOT NULL,
  stripe_transfer_id VARCHAR(255),
  stripe_payout_id VARCHAR(255),
  
  amount INT NOT NULL,                  -- Amount in cents
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'in_transit', 'paid', 'failed', 'canceled'),
  
  arrival_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_artist_id (artist_id),
  INDEX idx_status (status),
  INDEX idx_arrival_date (arrival_date)
);

-- Platform revenue summary (daily aggregates)
CREATE TABLE revenue_summary (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL UNIQUE,
  
  transaction_count INT DEFAULT 0,
  gross_volume INT DEFAULT 0,           -- GMV
  platform_revenue INT DEFAULT 0,       -- Commissions
  stripe_fees INT DEFAULT 0,
  artist_payouts INT DEFAULT 0,
  refund_amount INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);
```

### Accounting Integration

**QuickBooks Online** (Recommended for small-medium businesses):
- Industry standard for SMBs
- Stripe integration available
- Automatic transaction sync
- Handles invoicing, expense tracking, tax prep
- $30-90/month depending on plan

**Xero** (Alternative):
- Popular internationally
- Similar features to QuickBooks
- Better for multi-currency businesses
- $13-70/month

**Integration Approach:**
1. **Automatic Sync**: Use Stripe → QuickBooks integration
   - Transactions automatically imported daily
   - Platform commissions recorded as revenue
   - Stripe fees recorded as expenses
   - Artist payouts recorded as cost of goods sold (COGS)

2. **Manual Reconciliation**: Export CSV from Stripe monthly
   - Import into accounting software
   - Reconcile with bank statements
   - More work but more control

**Recommendation**: Use **QuickBooks Online** with automatic Stripe sync for hands-off bookkeeping.

---

## 4. Tax Compliance

### Platform Tax Obligations

**Sales Tax / VAT:**
- Digital services may be taxable depending on location
- Stripe Tax can automatically calculate and collect
- File returns quarterly or annually depending on state

**Income Tax:**
- Platform commission is taxable business income
- Deduct Stripe fees and operating expenses
- Work with CPA for tax strategy

**Payroll Tax** (if you have employees):
- Federal and state withholding
- Social Security and Medicare
- Use Gusto or Rippling for payroll processing

### Artist Tax Reporting (1099-K Forms)

**IRS Requirements:**
- Platforms must issue 1099-K forms to artists who receive:
  - $600+ in payments (as of 2024)
  - Previously $20,000+ and 200+ transactions
- Due by January 31st each year

**Stripe Connect Handles This:**
- Stripe automatically generates 1099-K forms
- Artists download from Express Dashboard
- Stripe files with IRS on your behalf
- **Critical**: This is a major reason to use Stripe Connect

### State-Specific Requirements

**Marketplace Facilitator Laws:**
- Some states require platforms to collect sales tax
- Varies by state and service type
- Consult with tax attorney for multi-state operations

---

## 5. Financial Operations Workflow

### Daily Operations

1. **Client books artist** → Payment captured via Stripe
2. **Funds held in Stripe Balance** → Pending booking confirmation
3. **Booking completed** → Trigger payout to artist
4. **Stripe transfers funds** → Artist receives payout (2-7 days)
5. **Platform commission** → Automatically deposited to operating account

### Monthly Reconciliation

1. Export Stripe transaction report
2. Reconcile with bank statements
3. Review QuickBooks sync for accuracy
4. Generate financial reports (P&L, balance sheet)
5. Review artist payout totals
6. Check for failed payments or disputes

### Annual Tasks

1. **Tax Filing** (April 15):
   - File federal and state income tax returns
   - Pay estimated quarterly taxes
   - Deduct business expenses

2. **1099-K Distribution** (January 31):
   - Verify Stripe issued 1099-Ks to artists
   - Provide copies to artists via platform

3. **Financial Audit** (if required):
   - Hire CPA for annual audit
   - Required for investors or loans

---

## 6. Implementation Checklist

### Phase 1: Business Setup (Week 1-2)
- [ ] Register business entity (LLC or Corporation)
- [ ] Obtain EIN (Employer Identification Number) from IRS
- [ ] Open business bank account (Mercury/Chase)
- [ ] Set up business credit card
- [ ] Purchase business insurance

### Phase 2: Stripe Connect Setup (Week 3-4)
- [ ] Create Stripe account (or upgrade existing)
- [ ] Enable Stripe Connect in Dashboard
- [ ] Choose Express account type for artists
- [ ] Configure application fee percentage (10-15%)
- [ ] Set up webhook endpoints for payment events
- [ ] Test Connect onboarding flow in test mode

### Phase 3: Financial Tracking (Week 5-6)
- [ ] Design database schema for transactions/payouts
- [ ] Implement transaction recording on payment success
- [ ] Build admin dashboard for revenue monitoring
- [ ] Set up automated daily/monthly reports
- [ ] Create CSV export for accounting

### Phase 4: Accounting Integration (Week 7-8)
- [ ] Sign up for QuickBooks Online
- [ ] Connect Stripe to QuickBooks
- [ ] Configure chart of accounts
- [ ] Set up automatic transaction sync
- [ ] Train on reconciliation process

### Phase 5: Tax Compliance (Week 9-10)
- [ ] Consult with CPA on tax strategy
- [ ] Enable Stripe Tax for sales tax collection
- [ ] Set up quarterly estimated tax payments
- [ ] Verify 1099-K settings in Stripe
- [ ] Document tax procedures

### Phase 6: Launch & Monitor (Week 11+)
- [ ] Launch artist onboarding with Connect
- [ ] Process first real transactions
- [ ] Monitor for failed payments/disputes
- [ ] Weekly financial review meetings
- [ ] Monthly reconciliation routine

---

## 7. Cost Breakdown

### Stripe Fees
- **Payment processing**: 2.9% + $0.30 per transaction
- **Connect fee**: $2.00 per active connected account/month (after first 10)
- **Instant Payouts**: 1% of payout amount (optional, artist pays)
- **International cards**: +1.5% for non-US cards

### Banking Fees
- **Mercury/Brex**: $0/month (free business checking)
- **Chase Business**: $15/month (waived with minimum balance)
- **Wire transfers**: $15-30 per wire (if needed)

### Accounting Software
- **QuickBooks Online**: $30-90/month
- **Xero**: $13-70/month
- **CPA services**: $1,500-5,000/year for tax prep

### Total Monthly Costs (Estimated)
- Stripe Connect: ~$50-200 (depends on # of artists)
- Banking: $0-15
- Accounting: $30-90
- **Total**: $80-305/month + variable transaction fees

---

## 8. Key Metrics to Monitor

### Platform Health
- **Gross Merchandise Volume (GMV)**: Total client payments
- **Take Rate**: Platform commission % of GMV
- **Net Revenue**: Commission minus Stripe fees
- **Monthly Recurring Revenue (MRR)**: From subscriptions (if applicable)

### Artist Metrics
- **Average Payout**: Mean amount paid to artists
- **Payout Frequency**: How often artists get paid
- **Active Artists**: Artists with bookings in last 30 days
- **Top Earners**: Identify high-performing artists

### Financial Health
- **Burn Rate**: Monthly expenses minus revenue
- **Runway**: Months of operation with current cash
- **Profit Margin**: Net income / gross revenue
- **Cash Flow**: Money in vs money out

---

## 9. Risk Management

### Chargebacks & Disputes
- Stripe Radar helps prevent fraudulent transactions
- Respond to disputes within 7 days
- Keep detailed booking records as evidence
- Platform is responsible for covering chargebacks

### Negative Balances
- Platform covers artist negative balances
- Set payout delays (7-14 days) to reduce risk
- Implement artist vetting process
- Use Radar for Platforms to flag risky accounts

### Regulatory Compliance
- Know Your Customer (KYC): Stripe handles for Express accounts
- Anti-Money Laundering (AML): Monitor suspicious activity
- PCI Compliance: Stripe handles card data security
- Terms of Service: Clear policies on refunds, disputes, payouts

---

## 10. Recommended Tools & Services

### Financial Stack
- **Payment Processing**: Stripe Connect
- **Banking**: Mercury or Chase Business
- **Accounting**: QuickBooks Online
- **Payroll** (if needed): Gusto
- **Tax Prep**: Local CPA or Bench Accounting

### Monitoring & Analytics
- **Stripe Dashboard**: Real-time transaction monitoring
- **QuickBooks Reports**: P&L, balance sheet, cash flow
- **Custom Admin Dashboard**: Build in Solely Art platform
- **Metabase or Retool**: Advanced analytics dashboards

### Legal & Compliance
- **Business Formation**: Stripe Atlas or local attorney
- **Terms of Service**: Termly or attorney
- **Privacy Policy**: Termly or attorney
- **Tax Compliance**: CPA or tax attorney

---

## Next Steps

1. **Register business entity** and obtain EIN
2. **Open business bank account** (Mercury recommended)
3. **Enable Stripe Connect** and configure Express accounts
4. **Implement financial tracking** database schema
5. **Set up QuickBooks** and connect to Stripe
6. **Consult with CPA** on tax strategy
7. **Launch artist onboarding** with Connect
8. **Monitor and iterate** on financial operations

---

*Last Updated: December 2024*
*Sources: Stripe Documentation, QuickBooks, IRS Guidelines*
