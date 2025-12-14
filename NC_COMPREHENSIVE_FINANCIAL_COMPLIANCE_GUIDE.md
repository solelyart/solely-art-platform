# North Carolina Marketplace Financial & Compliance Guide
## Complete Implementation Guide for Solely Art Platform

**Last Updated:** December 2024  
**Location:** North Carolina  
**Business Type:** Artist Services Marketplace Platform  
**Structure:** LLC (Recommended)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [North Carolina Business Formation](#north-carolina-business-formation)
3. [Banking Infrastructure: Mercury Setup](#banking-infrastructure-mercury-setup)
4. [Payment Processing: Stripe Connect Integration](#payment-processing-stripe-connect-integration)
5. [Mercury API Integration for Financial Dashboard](#mercury-api-integration-for-financial-dashboard)
6. [North Carolina Tax Obligations](#north-carolina-tax-obligations)
7. [Sales Tax on Creative Services](#sales-tax-on-creative-services)
8. [Independent Contractor Classification](#independent-contractor-classification)
9. [Artist Tax Reporting (1099-K)](#artist-tax-reporting-1099-k)
10. [Insurance Requirements](#insurance-requirements)
11. [Data Privacy & Security Compliance](#data-privacy-security-compliance)
12. [Complete Implementation Timeline](#complete-implementation-timeline)
13. [Financial Projections & Cost Analysis](#financial-projections-cost-analysis)
14. [Ongoing Compliance Calendar](#ongoing-compliance-calendar)
15. [Resources & Professional Services](#resources-professional-services)

---

## Executive Summary

This guide provides complete financial infrastructure and compliance requirements for operating Solely Art Platform—an artist services marketplace—in North Carolina. The platform connects clients with creative professionals (painters, photographers, musicians, designers) for commissioned work, operating as a two-sided marketplace with a 12% platform commission.

### Business Model Overview

**Revenue Flow Architecture:**

Clients book artists through the platform and pay via Stripe. Payments flow into Stripe's balance, where they are automatically split: 85-90% goes directly to the artist's bank account via ACH transfer, while the platform receives 10-15% commission deposited into the Mercury business account. Stripe deducts its processing fee (2.9% + $0.30) from the platform's share, not the artist's portion.

**Example Transaction ($200 booking):**
- Client pays: $200.00
- Stripe processing fee: $5.80 (2.9% + $0.30) — paid by platform
- Platform commission (12%): $24.00 → Mercury business account
- Artist receives: $170.20 (85.1%) → Artist's personal bank account
- Platform net profit: $18.20 per booking

**Key Financial Infrastructure:**

The platform operates with three interconnected systems: **Mercury** serves as the business bank account receiving commission revenue and paying operating expenses with zero monthly fees and 4-5% APY on idle cash. **Stripe Connect** handles all payment processing, artist payouts, and 1099-K tax form generation automatically. **QuickBooks Online** syncs with both Mercury and Stripe for automated accounting and tax preparation. This architecture ensures clean separation between platform revenue and artist payouts while maintaining full compliance with IRS and North Carolina Department of Revenue requirements.

### North Carolina Advantages

North Carolina offers one of the most favorable business environments for marketplace platforms in the United States. The state features a flat 4.75% personal income tax rate (compared to 13.3% in California or 10.9% in New York), a 2.5% corporate tax rate (one of the nation's lowest), and no franchise tax as of 2024. The business registration process is streamlined with online LLC formation completing in 24-48 hours for just $125, and annual compliance requires only a $200 annual report filing. North Carolina does not tax most creative services, eliminating complex sales tax obligations that plague marketplaces in states like Washington or Hawaii.

The state's central East Coast location provides timezone advantages for serving national clients, while the Research Triangle and Charlotte areas offer growing tech ecosystems with access to talent. North Carolina's pro-business legal environment includes reasonable liability laws and clear independent contractor guidelines, reducing regulatory risk compared to states with aggressive worker classification enforcement like California.

### Critical Compliance Requirements

**Independent Contractor Classification:** Properly classifying artists as independent contractors rather than employees is the single most important compliance issue. North Carolina uses the ABC test for unemployment insurance purposes, requiring that artists are (A) free from control in performing services, (B) performing services outside the platform's usual course of business, and (C) customarily engaged in an independent trade. The platform must maintain documentation demonstrating artist autonomy, including written independent contractor agreements, evidence that artists control their own schedules and rates, and proof that artists work for multiple clients.

**Tax Obligations:** The platform must make quarterly estimated tax payments to both the IRS and North Carolina Department of Revenue. Based on projected annual net income of $84,000, quarterly payments total approximately $9,271 each quarter ($8,224 federal + $1,047 NC), due April 15, June 15, September 15, and January 15. Setting aside 35-40% of monthly revenue in a separate tax reserve account ensures funds are available when payments are due.

**Artist Tax Reporting:** Stripe automatically issues 1099-K forms to artists earning $600 or more annually, eliminating the platform's responsibility for tracking and filing these forms. However, the platform should provide artists with earnings dashboards, annual summary emails, and educational resources about self-employment tax obligations.

### First-Year Cost Summary

**One-Time Setup Costs:**
- NC LLC formation: $125
- EIN application: Free
- NC DOR registration: Free
- General liability insurance: $500-1,500
- Cyber liability insurance: $1,000-2,500
- CPA consultation: $200-500
- Employment attorney review: $1,500-3,000
- Privacy policy/terms of service: $500-2,000
- **Total: $3,825-9,775**

**Annual Recurring Costs:**
- NC Annual Report: $200
- Insurance renewals: $1,500-4,000
- CPA tax filing: $1,000-2,500
- QuickBooks Online: $360-1,080
- Mercury banking: $0
- **Total: $3,060-7,930**

**Variable Transaction Costs (500 monthly bookings at $200 average):**
- Stripe processing fees: $2,900/month (2.9% of $100K GMV)
- Stripe Connect fees: $1,000/month ($2 per active artist after first 10)
- **Total: $3,900/month or $46,800/year**

**Total First-Year Costs:** $53,685-64,505

**Projected First-Year Revenue:**
- Monthly commission (12% of $100K GMV): $12,000
- Annual commission revenue: $144,000
- Less operating expenses: $60,000
- Less transaction costs: $46,800
- **Net profit before taxes: $37,200**
- Less taxes (42% effective rate): $15,624
- **Net profit after taxes: $21,576**

This represents a lean first year focused on product-market fit. Profitability improves significantly in Year 2 as one-time setup costs are eliminated and economies of scale reduce per-transaction costs.

---

## North Carolina Business Formation

### Choosing the Right Business Structure

North Carolina offers several business entity types, each with distinct tax implications, liability protection, and administrative requirements. For a marketplace platform like Solely Art, the choice between LLC and C-Corporation depends on your growth trajectory, funding plans, and tax optimization goals.

#### Limited Liability Company (LLC) - Recommended for Launch

An LLC provides the optimal balance of simplicity, liability protection, and tax flexibility for a bootstrapped marketplace platform. North Carolina LLCs are "pass-through" entities by default, meaning business income flows through to your personal tax return rather than being taxed at the corporate level. This avoids double taxation while providing full liability protection that shields your personal assets from business debts and lawsuits.

**Advantages for Marketplace Platforms:**

The administrative burden is minimal with only an annual $200 report filing required. Tax filing is straightforward using Schedule C (sole proprietor) or Form 1065 (partnership) attached to your personal return. You maintain full control over business decisions without board requirements or corporate formalities. The LLC structure allows you to elect S-Corporation tax treatment later via IRS Form 2553 once profitable, enabling you to reduce self-employment taxes by splitting income between salary and distributions.

**Tax Treatment:**

As a pass-through entity, all business profit is subject to both income tax and self-employment tax. Using our $84,000 net income example, you would pay 4.75% NC income tax ($3,990), 22% federal income tax ($18,480), and 15.3% self-employment tax ($12,852), totaling $35,322 or a 42% effective tax rate. While this seems high, it's actually favorable compared to C-Corporation double taxation at lower profit levels.

**When to Consider S-Corp Election:**

Once net income exceeds $60,000-80,000 annually, electing S-Corporation status can save $3,000-5,000 per year in self-employment taxes. An S-Corp allows you to pay yourself a "reasonable salary" subject to payroll taxes, while taking remaining profits as distributions that avoid the 15.3% self-employment tax. For example, with $84,000 profit, you might pay yourself a $60,000 salary (subject to all taxes) and take $24,000 as distributions (subject only to income tax, not self-employment tax), saving approximately $3,672 annually.

**Recommendation:** Start as a standard LLC for simplicity. Once you reach $100,000+ annual net income, consult with a CPA about electing S-Corp status for tax savings.

#### C-Corporation - For Venture-Backed Growth

A C-Corporation makes sense only if you plan to raise venture capital funding, as most VCs require C-Corp structure for their investment vehicles. C-Corps pay corporate income tax at 2.5% (NC) + 21% (federal) = 23.5% on profits, which is lower than the LLC's 42% effective rate. However, when you extract profits as dividends or salary, you pay personal income tax again, creating double taxation.

**When C-Corp Makes Sense:**

If you plan to reinvest all profits for growth without taking distributions, the 23.5% corporate rate is attractive. If you're raising $500K+ in venture funding, VCs will require C-Corp structure. If you plan to offer stock options to employees, C-Corps have better equity compensation structures. If you anticipate selling the company for $10M+, C-Corp provides more favorable exit tax treatment.

**When C-Corp Doesn't Make Sense:**

If you're bootstrapping and need to pay yourself from profits, double taxation makes C-Corp expensive. If you're profitable but not hypergrowth, the administrative burden (board meetings, corporate minutes, complex tax filings) outweighs benefits. If you're unsure about long-term plans, LLC provides more flexibility to convert later.

**Recommendation:** Only choose C-Corp if you have committed venture funding or definitive plans to raise institutional capital within 12 months.

### North Carolina LLC Formation Process

The North Carolina Secretary of State provides a streamlined online filing system that makes LLC formation faster and simpler than most states. The entire process can be completed in 30 minutes with approval typically within 24-48 hours.

#### Step 1: Choose and Reserve Your Business Name

North Carolina requires your LLC name to include "Limited Liability Company," "LLC," or "L.L.C." The name must be distinguishable from all existing business entities registered in North Carolina. Use the business name search tool at sosnc.gov/online/search to check availability.

**Naming Considerations:**

Choose a name that reflects your marketplace platform rather than limiting yourself to a specific service category. "Solely Art Platform LLC" or "Solely Art Marketplace LLC" is better than "Solely Art Painting Services LLC" because it allows expansion into new creative categories without rebranding. Check domain availability at the same time to ensure you can secure matching web domains.

If you're not ready to file immediately but want to secure your name, pay $30 to reserve it for 120 days. This prevents others from taking your chosen name while you finalize business plans or wait for funding.

**DBA (Doing Business As) Names:**

You can operate under a different name than your legal LLC name by filing a DBA (also called "assumed name" or "trade name"). For example, you might form "Solely Art Platform LLC" but operate publicly as just "Solely Art." DBAs are filed with your county Register of Deeds office for $26 and must be renewed every 10 years. This allows brand flexibility while maintaining legal entity separation.

#### Step 2: Designate a Registered Agent

North Carolina law requires every LLC to maintain a registered agent with a physical NC address (not a PO Box) available during normal business hours to receive legal documents, tax notices, and official correspondence. You have two options:

**Option 1: Serve as Your Own Registered Agent (Free)**

If you have a physical North Carolina address and are available during business hours, you can serve as your own registered agent at no cost. This works well for home-based businesses or if you have a dedicated office. The downside is that your home address becomes public record in the LLC filing, and you must be available to receive documents during business hours.

**Option 2: Hire a Registered Agent Service ($100-300/year)**

Professional registered agent services provide a commercial address, receive documents on your behalf, and scan/forward them to you digitally. This keeps your home address private, ensures someone is always available to receive documents, and provides a stable address if you move. Reputable services include:

- **Northwest Registered Agent** - $125/year, excellent service, privacy-focused
- **Incfile** - $119/year, includes free year of service with LLC formation
- **Registered Agents Inc** - $100/year, NC-based company
- **ZenBusiness** - $199/year, includes compliance monitoring

**Recommendation:** If you work from home and value privacy, hire a registered agent service. If you have a commercial office or don't mind your address being public, serve as your own agent to save $100-300 annually.

#### Step 3: File Articles of Organization

Navigate to sosnc.gov and select "File Online" → "Limited Liability Company" → "Articles of Organization." The online form requires:

**Required Information:**

1. **LLC Name** - Your chosen business name including LLC designation
2. **Registered Agent Name and Address** - Physical NC address (not PO Box)
3. **Principal Office Address** - Can be same as registered agent or your home/office
4. **Mailing Address** - Where you want official correspondence sent
5. **Management Structure** - Choose "member-managed" (owners run the business) or "manager-managed" (hired managers run it). For a solo founder or small team, choose member-managed.
6. **Organizer Information** - Name and address of person filing (can be you or an attorney)
7. **Effective Date** - Immediate or future date (choose immediate)

**Optional Information:**

- **Purpose Statement** - NC allows "all lawful purposes" or you can specify "operating an online marketplace platform connecting clients with creative service providers"
- **Duration** - Choose "perpetual" (exists indefinitely) rather than setting an end date
- **Initial Members** - Not required in NC, but you can list members if desired

**Filing Fee:** $125 (credit card or ACH payment)

**Processing Time:** 24-48 hours for online filings, 5-10 business days for mail filings

After approval, you'll receive a stamped Articles of Organization document via email. Download and save multiple copies—you'll need this for opening bank accounts, applying for business licenses, and tax registrations.

#### Step 4: Obtain Your EIN (Employer Identification Number)

The EIN is your business's federal tax identification number, equivalent to a Social Security number for your LLC. You need an EIN to open business bank accounts, hire employees, file tax returns, and establish business credit. The IRS issues EINs for free, and the process takes about 5 minutes online.

**Application Process:**

1. Visit irs.gov/ein and click "Apply Online Now"
2. Select "Limited Liability Company" as your entity type
3. Provide your LLC name, address, and formation date
4. Provide your personal SSN as the "responsible party"
5. Answer questions about your business (number of employees, principal activity)
6. Submit application
7. Receive EIN immediately upon completion

**Important:** The EIN is issued instantly online, but you can only apply Monday-Friday 7am-10pm ET. If you apply outside these hours, you'll need to wait or use the mail/fax option (4-6 weeks processing).

**EIN Confirmation Letter:**

After receiving your EIN, the IRS mails a confirmation letter (CP 575) within 2-4 weeks. This letter is required by most banks to open business accounts, so request it immediately after receiving your EIN online. You can also download Form SS-4 confirmation from the IRS website as temporary proof while waiting for the official letter.

#### Step 5: Create an Operating Agreement

While North Carolina does not legally require an operating agreement, creating one is critical for liability protection, tax purposes, and operational clarity. An operating agreement is an internal document that defines how your LLC operates, including ownership percentages, profit distribution, management responsibilities, and procedures for major decisions.

**Why You Need an Operating Agreement:**

Courts can "pierce the corporate veil" and hold you personally liable for business debts if you fail to maintain proper corporate formalities. An operating agreement demonstrates that your LLC is a legitimate separate entity, not just an alter ego of yourself. Banks often require an operating agreement to open business accounts. If you have multiple members, the agreement prevents disputes by clearly defining each member's rights and responsibilities. The agreement allows you to customize profit distributions, management structure, and voting rights rather than defaulting to NC's statutory rules.

**Key Provisions to Include:**

**Ownership Structure:** List all members with their ownership percentages and initial capital contributions. For example, "John Smith owns 100% of membership interests with an initial capital contribution of $5,000."

**Management Structure:** Specify whether the LLC is member-managed (owners make decisions) or manager-managed (appointed managers make decisions). For a solo founder, state "The LLC shall be managed by its sole member, who has authority to bind the LLC and make all business decisions."

**Profit and Loss Allocation:** Define how profits and losses are distributed. Default is proportional to ownership, but you can customize. For example, "Profits and losses shall be allocated 100% to the sole member" or "Profits shall be distributed 60% to Member A and 40% to Member B regardless of ownership percentages."

**Capital Contributions:** Specify initial and future capital contribution requirements. "No member shall be required to make additional capital contributions without unanimous consent."

**Voting Rights:** Define voting thresholds for major decisions. "Routine business decisions require simple majority vote. Major decisions (selling the company, taking on debt over $50,000, admitting new members) require unanimous consent."

**Transfer Restrictions:** Prevent members from selling their ownership interests without approval. "No member may transfer, sell, or assign their membership interest without written consent of all other members."

**Dissolution Procedures:** Define what happens if the LLC dissolves. "Upon dissolution, assets shall be distributed to members proportionally after paying all debts and obligations."

**Buy-Sell Provisions:** If you have multiple members, include procedures for one member buying out another. "If a member wishes to exit, they must offer their interest to other members at fair market value determined by independent appraisal."

**Templates and Professional Preparation:**

You can create an operating agreement using online templates from LegalZoom ($99), Rocket Lawyer ($39/month membership), or Northwest Registered Agent (free with registered agent service). For a simple single-member LLC, a template is sufficient. For multi-member LLCs or complex ownership structures, hire a business attorney to draft a custom agreement ($500-1,500).

**Recommendation:** Use a template for a single-member LLC, but have an attorney review it ($200-300). For multi-member LLCs, hire an attorney to draft a custom agreement to prevent future disputes.

#### Step 6: Register with North Carolina Department of Revenue

Within 60 days of forming your LLC, register with the NC Department of Revenue to obtain your state tax identification number and set up required tax accounts. This registration is free and takes about 15 minutes online.

**Registration Process:**

1. Visit ncdor.gov and select "Register a Business"
2. Complete Form NC-BR (Business Registration Application)
3. Provide your EIN, LLC name, formation date, and business address
4. Select your NAICS code: **812990** - "All Other Personal Services" (best fit for marketplace platforms)
5. Indicate which tax accounts you need:
   - **Income Tax Withholding** - Only if you have employees (not needed for independent contractor artists)
   - **Sales and Use Tax** - Only if you sell taxable goods or services (likely not needed for creative services)
   - **Corporate Income Tax** - Only if you elect C-Corp status (not needed for LLC)
6. Provide estimated monthly sales and number of employees
7. Submit registration

**What You'll Receive:**

- **NC Tax ID Number** - Your state tax identification number (different from EIN)
- **Account Numbers** - Specific account numbers for each tax type you registered for
- **Filing Instructions** - Information about when and how to file returns
- **Confirmation Letter** - Mailed within 2 weeks

**Important:** Even if you don't need sales tax or withholding accounts immediately, completing the registration establishes your business in the NC DOR system and makes it easier to add accounts later if needed.

### Annual Compliance Requirements

North Carolina has minimal ongoing compliance requirements compared to states like California or New York, making it attractive for small businesses and startups.

#### NC Annual Report

Every LLC must file an annual report with the NC Secretary of State by April 15 each year. The report updates your business information (address, registered agent, members/managers) and confirms your LLC is still active. The filing fee is $200 annually.

**Filing Process:**

1. Visit sosnc.gov and log into your account
2. Select "File Annual Report"
3. Review and update business information
4. Pay $200 fee via credit card or ACH
5. Receive confirmation email

**Consequences of Not Filing:**

If you miss the April 15 deadline, NC imposes a $200 late fee (doubling your cost to $400). If you fail to file for two consecutive years, the NC Secretary of State will administratively dissolve your LLC, requiring reinstatement fees and potential loss of business name. Set a calendar reminder for March 1 each year to ensure timely filing.

**Recommendation:** File your annual report in early March to avoid the April rush and ensure you don't miss the deadline.

#### Federal Tax Returns

LLCs file different federal tax returns depending on their structure and election:

**Single-Member LLC (Disregarded Entity):**
- File Schedule C (Profit or Loss from Business) attached to Form 1040
- Report all business income and expenses on Schedule C
- Pay self-employment tax on net profit via Schedule SE
- Due April 15 (or October 15 with extension)

**Multi-Member LLC (Partnership):**
- File Form 1065 (Partnership Return) by March 15
- Issue Schedule K-1 to each member showing their share of income/loss
- Members report K-1 income on their personal Form 1040
- Partnership itself doesn't pay tax; members pay on their share

**LLC Electing S-Corp Status:**
- File Form 1120-S (S-Corporation Return) by March 15
- Issue Schedule K-1 to each shareholder
- File Form 941 quarterly for payroll taxes
- File Form 940 annually for unemployment taxes
- More complex but can save on self-employment taxes

**LLC Electing C-Corp Status:**
- File Form 1120 (C-Corporation Return) by April 15
- Pay corporate income tax on profits
- File Form 941 quarterly for payroll taxes if you have employees
- Most complex structure with highest compliance burden

**Recommendation:** Start as a single-member LLC filing Schedule C for simplicity. Hire a CPA once annual revenue exceeds $100,000 to evaluate whether S-Corp election makes sense.

#### North Carolina Tax Returns

**Individual Income Tax (Form D-400):**

If your LLC is taxed as a pass-through entity (default for LLCs), you report business income on your personal NC income tax return Form D-400. The form is due April 15 each year (same as federal return). NC allows you to e-file for free through the NC DOR website or use tax software like TurboTax or H&R Block.

**Corporate Income Tax (Form CD-405):**

If you elect C-Corp status, your LLC files Form CD-405 (Corporate Income Tax Return) by April 15. The return is more complex and typically requires a CPA to prepare. Filing fee is included in the $200 annual report fee.

**Estimated Tax Payments:**

If you expect to owe $1,000+ in NC income tax, you must make quarterly estimated payments using Form NC-40. Payments are due April 15, June 15, September 15, and January 15. Calculate estimated taxes at 4.75% of your projected net income.

---

## Banking Infrastructure: Mercury Setup

### Why Mercury for Marketplace Platforms

Mercury is purpose-built for technology companies and offers the most sophisticated digital banking experience for marketplace platforms. Unlike traditional banks that view online marketplaces as high-risk and impose restrictive policies, Mercury understands the marketplace business model and provides features specifically designed for platforms processing high transaction volumes.

#### Key Advantages for Solely Art

**Zero-Fee Structure:** Mercury charges no monthly account fees, no minimum balance requirements, no transaction fees for ACH transfers, and no fees for debit card purchases. This is critical for a marketplace where you're receiving daily Stripe deposits and making frequent payments to contractors, software vendors, and service providers. Traditional banks like Chase or Bank of America charge $15-16/month plus $0.50 per transaction over 20-200 transactions monthly, which would cost $500-1,000 annually for a marketplace processing 500+ monthly transactions.

**High-Yield Treasury:** Mercury automatically sweeps idle cash into interest-bearing treasury accounts earning 4-5% APY (as of December 2024). With an average balance of $20,000, you earn approximately $1,000 annually in passive income—enough to cover several months of software subscriptions. Traditional banks pay 0.01% APY, earning just $2 annually on the same balance.

**API Access:** Mercury provides a RESTful API that enables you to build custom financial dashboards within your Solely Art admin panel. You can programmatically retrieve account balances, transaction history, and revenue metrics to display alongside booking data, creating a unified view of business performance. Traditional banks don't offer API access, forcing you to manually export CSV files or use unreliable third-party aggregators like Plaid.

**Modern Interface:** Mercury's dashboard is designed for daily use with real-time balance updates, intelligent transaction categorization, and mobile app parity. You can approve payments, review transactions, and monitor cash flow from your phone with the same functionality as the desktop interface. Traditional bank interfaces feel dated and clunky, with limited mobile functionality and delayed transaction posting.

**Fast Account Opening:** Mercury approves most accounts within 24-48 hours with a fully online application process. You don't need to visit a branch, mail documents, or wait for signature cards. Traditional banks require 1-3 weeks for business account approval, often with in-person branch visits.

**Startup-Friendly:** Mercury specializes in early-stage companies and understands that you may not have significant revenue or assets yet. They approve accounts based on business model viability rather than requiring minimum deposits or revenue history. Traditional banks often require $10,000+ opening deposits or 2+ years of financial statements.

#### When Mercury Isn't Ideal

**No Physical Branches:** If you need to deposit cash or checks in person, Mercury won't work. The platform offers mobile check deposit with a $25,000 monthly limit, but this doesn't help if clients pay you in cash. For a marketplace platform where all revenue comes via Stripe ACH deposits, this limitation is irrelevant.

**No Business Credit Cards:** Mercury doesn't issue business credit cards directly (though they partner with Stripe Issuing for card programs). If you want to build business credit or earn credit card rewards, you'll need to apply for cards from Chase, American Express, or Capital One separately.

**Limited International Features:** Mercury supports international wire transfers but charges $25-40 per wire and doesn't offer multi-currency accounts. If you plan to pay international artists or receive international client payments, you'll need to add Wise Business as a complementary service.

**Newer Company:** Mercury was founded in 2019, making it a relatively young company compared to century-old banks. While they're well-funded by top VCs (Andreessen Horowitz, Coatue) and have strong financials, there's less institutional stability than a bank that's survived multiple economic cycles.

### Mercury Account Opening Process

#### Eligibility Requirements

Mercury primarily serves US-based businesses in technology, software, and professional services sectors. To qualify, you need:

1. **US Business Entity** - LLC, Corporation, or Partnership registered in any US state
2. **EIN** - Federal Employer Identification Number from IRS
3. **Formation Documents** - Articles of Organization/Incorporation
4. **Business Website** - Active website explaining your business (your Solely Art platform)
5. **Beneficial Owners** - Personal information for all owners with 25%+ ownership
6. **Business Description** - Clear explanation of your marketplace business model

**Industries Mercury Typically Approves:**
- SaaS and software companies
- Marketplace platforms (like Solely Art)
- Professional services
- E-commerce businesses
- Consulting firms
- Creative agencies

**Industries Mercury May Decline:**
- Cryptocurrency exchanges
- Cannabis businesses
- Adult entertainment
- Gambling and gaming
- High-risk financial services

Your artist marketplace platform falls squarely in Mercury's target market and should be approved quickly.

#### Application Process (Step-by-Step)

**Step 1: Create Account (5 minutes)**

Visit mercury.com and click "Get Started." Provide your email address and create a password. Mercury sends a verification code to your email—enter it to proceed.

**Step 2: Business Information (10 minutes)**

Provide detailed information about your LLC:

- **Legal Business Name:** Exactly as it appears on Articles of Organization (e.g., "Solely Art Platform LLC")
- **DBA/Trade Name:** If different from legal name (e.g., "Solely Art")
- **Business Address:** Physical address in North Carolina (can be home address)
- **Formation State:** North Carolina
- **Formation Date:** Date from Articles of Organization
- **EIN:** 9-digit federal tax ID number
- **Business Structure:** Limited Liability Company
- **Industry:** Select "Marketplace" or "Internet Software & Services"
- **Website URL:** Your platform URL (must be live and functional)
- **Business Description:** Detailed explanation of your marketplace model

**Example Business Description:**

"Solely Art Platform is a two-sided marketplace connecting clients with professional artists for commissioned creative services. Clients browse artist profiles, view portfolios, and book services including portrait painting, event photography, mural art, custom illustrations, and music performances. The platform facilitates booking, payment processing, and communication between clients and artists. Artists set their own rates and availability, operating as independent contractors. The platform charges a 12% commission on completed bookings. Revenue is generated through platform fees, not by providing creative services directly."

**Why the Description Matters:**

Mercury's underwriting team reviews your business description to understand your model and assess risk. Be specific about:
- You're a technology platform, not a creative services provider
- Artists are independent contractors, not employees
- You facilitate transactions but don't provide services yourself
- Revenue comes from platform fees, not service delivery

This positions you as a low-risk technology company rather than a high-risk service provider.

**Step 3: Ownership Information (10 minutes)**

Provide personal information for all beneficial owners (anyone with 25%+ ownership):

- **Full Legal Name:** As it appears on government ID
- **Date of Birth:** MM/DD/YYYY
- **SSN:** Required for identity verification and OFAC screening
- **Home Address:** Physical address (not PO Box)
- **Ownership Percentage:** Percentage of LLC membership interests
- **Title:** CEO, Founder, Managing Member, etc.
- **Phone Number:** Personal mobile number
- **Email Address:** Personal email

If you're the sole owner, you'll provide your information only. If you have co-founders or investors with 25%+ ownership, each must provide their information.

**Step 4: Document Upload (5 minutes)**

Upload clear, legible copies of required documents:

1. **Articles of Organization** - Stamped copy from NC Secretary of State (PDF)
2. **EIN Confirmation Letter** - IRS Form CP 575 or SS-4 confirmation (PDF)
3. **Operating Agreement** - Signed copy showing ownership structure (PDF)
4. **Government-Issued ID** - Driver's license or passport for each beneficial owner (JPG or PDF)

**Document Tips:**
- Ensure all documents are fully visible with no cut-off edges
- Use PDF format for business documents, JPG or PDF for IDs
- File size limit is typically 10MB per document
- Documents must be in English or include certified translations

**Step 5: Business Details (10 minutes)**

Answer questions about your business operations:

**Expected Monthly Revenue:**
- Select range: $0-10K, $10K-50K, $50K-100K, $100K-500K, $500K+
- Be realistic based on your projections
- For Solely Art at 500 monthly bookings: Select "$100K-500K" (you'll process $100K GMV, receive $12K commission)

**Expected Monthly Transactions:**
- Number of deposits and withdrawals per month
- For Solely Art: ~30-50 transactions (4-30 Stripe deposits + 20-40 expense payments)

**Expected Transaction Types:**
- ACH transfers (most common)
- Wire transfers (occasional)
- Debit card purchases (frequent)
- Check deposits (rare)

**Primary Use of Account:**
- Receiving revenue from customers
- Paying vendors and contractors
- Paying business expenses
- Owner compensation

**Funding Source:**
- Personal savings (if bootstrapped)
- Investor funding (if you raised capital)
- Business revenue (if migrating from another bank)

**Step 6: Review and Submit (5 minutes)**

Review all information for accuracy. Mercury's underwriting team will verify everything against public records and your submitted documents. Inaccuracies or inconsistencies can delay approval or result in rejection.

**Common Mistakes to Avoid:**
- Business name doesn't match Articles of Organization exactly
- EIN doesn't match IRS records
- Ownership percentages don't add up to 100%
- Business description is vague or confusing
- Website is under construction or doesn't explain business model
- Documents are blurry, cut off, or illegible

After submitting, Mercury sends a confirmation email and begins underwriting review.

#### Approval Timeline and Process

**Typical Timeline:**

- **24-48 hours:** Most straightforward applications
- **3-5 days:** Applications requiring additional documentation
- **1-2 weeks:** Applications with complex ownership or international owners

**What Mercury Reviews:**

Mercury's underwriting team verifies your business legitimacy, assesses risk, and ensures compliance with banking regulations. They check:

1. **Business Verification:** Confirms LLC is registered with NC Secretary of State and in good standing
2. **Identity Verification:** Verifies beneficial owners' identities against government databases
3. **OFAC Screening:** Checks owners against sanctions lists and politically exposed persons databases
4. **Risk Assessment:** Evaluates business model for fraud risk, money laundering risk, and regulatory risk
5. **Website Review:** Confirms website is professional, functional, and matches business description
6. **Document Verification:** Ensures all documents are authentic and match provided information

**Possible Outcomes:**

**Approved:** You receive an email with account details and can immediately start using your Mercury account. You can deposit funds, order debit cards, and set up ACH transfers.

**Additional Information Requested:** Mercury emails requesting clarification or additional documents. Common requests include:
- More detailed business description
- Explanation of revenue model
- Proof of business legitimacy (customer contracts, invoices)
- Additional ownership documentation
- Updated website with clearer business explanation

Respond within 48 hours to avoid application expiration. Provide thorough, professional responses addressing their specific concerns.

**Declined:** Mercury determines they cannot support your business. Reasons include:
- High-risk industry
- Unclear or suspicious business model
- Incomplete or inaccurate application
- Owners with adverse financial history
- Business doesn't fit Mercury's target market

If declined, Mercury provides a reason. You can address concerns and reapply after 90 days, or consider alternatives like Relay (easier approval) or traditional banks.

**Improving Approval Odds:**

1. **Professional Website:** Ensure your Solely Art platform is live, functional, and clearly explains your marketplace model before applying
2. **Detailed Business Description:** Spend time crafting a clear, comprehensive explanation of how your platform works
3. **Complete Documentation:** Upload all required documents in high quality before submitting
4. **Accurate Information:** Double-check all information matches official records exactly
5. **Responsive Communication:** If Mercury requests additional information, respond within 24 hours with thorough answers

#### Initial Account Setup

Once approved, complete these setup steps to optimize your Mercury account:

**Step 1: Fund Your Account**

Mercury requires no minimum opening deposit, but you should fund your account with enough to cover initial expenses. Transfer funds via:

- **ACH transfer from personal bank account** - Free, takes 2-3 business days
- **Wire transfer** - $25 fee, same-day arrival
- **Check deposit via mobile app** - Free, 2-5 business days

**Recommended Initial Deposit:** $5,000-10,000 to cover first month of operating expenses (hosting, software subscriptions, marketing, legal fees).

**Step 2: Order Debit Cards**

Mercury provides free physical debit cards for all team members. Order cards for:
- Yourself (primary card)
- Any co-founders or employees who need spending ability
- Virtual cards for online subscriptions (unlimited free virtual cards)

Physical cards arrive in 7-10 business days. Virtual cards are available immediately for online purchases.

**Step 3: Set Up Team Access**

If you have co-founders, employees, or contractors who need access to financial information, invite them to Mercury with appropriate permission levels:

- **Admin:** Full access including transfers, payments, and settings
- **Member:** Can view transactions and initiate payments requiring approval
- **Bookkeeper:** Read-only access to transactions and statements
- **Accountant:** Read-only access plus ability to export data

**Recommendation:** Give your CPA bookkeeper-level access so they can reconcile accounts and prepare tax returns without needing you to manually export data.

**Step 4: Connect to Accounting Software**

Mercury integrates directly with QuickBooks Online and Xero. Connect your accounting software to enable automatic transaction sync:

1. Log into Mercury dashboard
2. Navigate to Settings → Integrations
3. Select QuickBooks Online or Xero
4. Authorize connection
5. Configure sync settings (daily automatic sync recommended)

Transactions automatically import into your accounting software, categorized by Mercury's AI. Your bookkeeper or CPA can then review and adjust categories as needed.

**Step 5: Configure Notifications**

Set up email and mobile notifications for:
- Large transactions (e.g., over $1,000)
- Low balance alerts (e.g., below $5,000)
- Failed payments or returned ACH transfers
- New team member additions
- Security events (password changes, new device logins)

These alerts help you monitor cash flow and catch issues quickly.

**Step 6: Enable Treasury**

Mercury's treasury feature automatically sweeps idle cash into interest-bearing accounts earning 4-5% APY. Enable it in Settings → Treasury. You can set a minimum operating balance to keep in checking (e.g., $5,000) with excess automatically swept to treasury daily.

**Example:** If your checking balance is $25,000 and you set minimum operating balance to $5,000, Mercury automatically moves $20,000 to treasury earning 4.5% APY ($900/year). Funds remain accessible and can be moved back to checking instantly if needed.

### Connecting Mercury to Stripe

Once your Mercury account is active, connect it to Stripe as your payout destination so commission revenue automatically deposits from Stripe to Mercury.

#### Step 1: Verify Mercury Account in Stripe

1. Log into Stripe Dashboard at dashboard.stripe.com
2. Navigate to Settings → Business settings → Payout details
3. Click "Add bank account"
4. Select "Manually enter bank details"
5. Enter Mercury routing and account numbers:
   - **Routing Number:** Found in Mercury dashboard under Account Details
   - **Account Number:** Found in Mercury dashboard under Account Details
   - **Account Holder Name:** Your LLC legal name exactly as registered
   - **Account Type:** Checking

6. Click "Add bank account"

**Step 2: Verify Micro-Deposits**

Stripe makes two small test deposits to your Mercury account (e.g., $0.32 and $0.45) within 1-2 business days. These appear in your Mercury transaction list as "Stripe Verification."

1. Log into Mercury and note the two deposit amounts
2. Return to Stripe Dashboard → Payout details
3. Click "Verify amounts"
4. Enter the two deposit amounts exactly
5. Click "Verify"

Stripe confirms verification and activates Mercury as your payout destination.

**Step 3: Set Payout Schedule**

In Stripe Dashboard → Settings → Payout schedule, configure how often Stripe deposits your commission revenue to Mercury:

**Daily Automatic Payouts (Recommended):**
- Stripe deposits funds to Mercury every business day
- Provides consistent daily cash flow
- Easier to track revenue and reconcile accounts
- Typical deposit timing: 2 business days after transaction

**Weekly Payouts:**
- Stripe deposits funds every Friday
- Simpler reconciliation with 4 deposits per month
- Less frequent monitoring required
- May create cash flow gaps early in week

**Monthly Payouts:**
- Stripe deposits funds on 1st of each month
- Simplest reconciliation with 1 deposit per month
- Requires maintaining larger cash reserves for operating expenses
- Not recommended for early-stage businesses

**Manual Payouts:**
- You trigger payouts manually via Stripe Dashboard or API
- Maximum control over timing
- Requires active management
- Useful for specific cash flow needs

**Recommendation:** Choose daily automatic payouts for consistent cash flow and easier financial monitoring. You'll receive commission revenue 2 business days after each booking completes, providing steady income to cover operating expenses.

**Step 4: Test End-to-End Flow**

Before launching, test the complete payment flow in Stripe test mode:

1. Create a test booking with test payment
2. Verify Stripe splits payment correctly (artist portion + platform commission)
3. Confirm webhook events fire properly
4. Check that commission amount appears in Stripe balance
5. Trigger a test payout to Mercury (in test mode, no real money moves)
6. Verify payout appears in Mercury transaction list

This testing ensures your integration works correctly before processing real customer payments.

---

## Payment Processing: Stripe Connect Integration

### Understanding Stripe Connect for Marketplaces

Stripe Connect is Stripe's solution for platforms that need to pay out to multiple recipients. It's specifically designed for marketplace business models where you collect payments from customers and distribute funds to service providers while taking a commission. Connect handles the complex financial infrastructure, regulatory compliance, and tax reporting that would otherwise require significant engineering and legal resources.

#### Why Stripe Connect is Essential

**Automated Payment Splitting:** When a client books an artist for $200, Stripe automatically splits the payment at the source: $170.20 goes directly to the artist's bank account via ACH transfer, $24.00 (your 12% commission) goes to your Mercury account, and $5.80 (Stripe's processing fee) is deducted from your commission. This happens automatically without any manual transfers or reconciliation on your part.

**Compliance and Tax Reporting:** Stripe automatically generates and files 1099-K tax forms for artists who earn $600+ annually, eliminating your responsibility for tracking artist earnings, collecting W-9 forms, and filing tax documents with the IRS and state revenue departments. This alone saves hundreds of hours and thousands in potential penalties for missing or incorrect forms.

**Identity Verification and KYC:** Stripe handles all Know Your Customer (KYC) and identity verification requirements for artists through the Connect onboarding flow. Artists provide their SSN or EIN, date of birth, and address, which Stripe verifies against government databases. This protects you from fraud and ensures compliance with anti-money laundering regulations.

**Payout Management:** You control when artists receive their funds. You can configure instant payouts (artists receive funds within 30 minutes for a 1% fee they pay), standard payouts (2-7 business days, free), or hold funds until booking completion or review period ends. This flexibility protects you from chargebacks and disputes.

**Dispute and Chargeback Handling:** When a client disputes a charge, Stripe provides evidence submission tools and manages the dispute process with the card network. You're responsible for covering chargebacks, but Stripe's Radar fraud prevention system reduces fraudulent transactions by 99%+ compared to manual review.

#### Connect Account Types Comparison

Stripe offers three Connect account types, each with different levels of platform control, artist visibility, and compliance responsibility.

**Express Accounts (Recommended for Solely Art):**

Express accounts provide the optimal balance of simplicity and functionality for most marketplace platforms. Stripe hosts the entire onboarding flow, requiring minimal integration work on your part. Artists complete onboarding through a Stripe-hosted page where they provide identity information, business details, and bank account information. The process takes 5-10 minutes and Stripe handles all verification.

Artists receive access to the Express Dashboard, a Stripe-hosted interface where they can view their payout history, update bank details, download tax forms (1099-K), and manage their account settings. This eliminates the need for you to build these features into your platform, saving months of development time.

Stripe handles all compliance requirements including identity verification, tax form collection (W-9), 1099-K generation and filing, and regulatory reporting. You're not responsible for tracking or filing tax documents, significantly reducing legal and administrative burden.

You control payout timing and can hold funds until booking completion, after a review period, or based on custom business logic. This protects you from chargebacks and ensures quality service delivery before releasing funds to artists.

The main limitation is that artists see Stripe branding in the onboarding flow and Express Dashboard, not your Solely Art branding. For most marketplaces, this is an acceptable trade-off for the reduced complexity and compliance burden.

**Standard Accounts:**

Standard accounts give artists full Stripe accounts with complete access to the Stripe Dashboard. Artists see all transaction details, can set up their own products and subscriptions, and have more control over their funds. This is appropriate for platforms where sellers are sophisticated businesses that need detailed financial reporting and want to use Stripe for other purposes beyond your platform.

The downside is that you have less control over payouts and artists can see sensitive transaction information that may reveal your commission rates or business model details. Standard accounts are typically used by platforms like Shopify where sellers are established businesses, not individual service providers like your artists.

**Custom Accounts:**

Custom accounts give you maximum control and white-labeling but require you to build the entire onboarding flow, dashboard, and compliance infrastructure yourself. You're responsible for collecting tax information, verifying identities, generating 1099-K forms, and handling regulatory compliance. This requires significant engineering resources and legal expertise.

Custom accounts make sense only for large platforms with dedicated engineering teams and specific requirements that Express or Standard accounts can't meet. For Solely Art, the additional complexity and compliance burden far outweigh any benefits.

**Recommendation:** Use Express accounts for fast implementation, reduced compliance burden, and built-in features that would take months to build yourself.

### Stripe Connect Implementation

#### Database Schema Updates

First, extend your existing `artistProfiles` table to store Stripe Connect account information:

```typescript
// drizzle/schema.ts - Add to existing artistProfiles table
export const artistProfiles = sqliteTable('artist_profiles', {
  // ... existing fields (id, userId, bio, location, etc.) ...
  
  // Stripe Connect fields
  stripeConnectAccountId: text('stripe_connect_account_id').unique(),
  stripeConnectOnboardingComplete: integer('stripe_connect_onboarding_complete', { mode: 'boolean' }).default(false),
  stripeConnectChargesEnabled: integer('stripe_connect_charges_enabled', { mode: 'boolean' }).default(false),
  stripeConnectPayoutsEnabled: integer('stripe_connect_payouts_enabled', { mode: 'boolean' }).default(false),
  stripeConnectDetailsSubmitted: integer('stripe_connect_details_submitted', { mode: 'boolean' }).default(false),
  stripeConnectCurrentlyDue: text('stripe_connect_currently_due'), // JSON array of required fields
  stripeConnectEventuallyDue: text('stripe_connect_eventually_due'), // JSON array of future requirements
  stripeConnectUpdatedAt: integer('stripe_connect_updated_at', { mode: 'timestamp' }),
});
```

Also add Stripe payment tracking to your existing `bookings` table:

```typescript
// drizzle/schema.ts - Add to existing bookings table
export const bookings = sqliteTable('bookings', {
  // ... existing fields (id, clientId, artistId, startTime, etc.) ...
  
  // Stripe payment fields
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  stripeChargeId: text('stripe_charge_id'),
  stripeTransferId: text('stripe_transfer_id'), // Transfer to artist
  stripeFeeAmount: integer('stripe_fee_amount'), // Stripe processing fee in cents
  platformCommissionAmount: integer('platform_commission_amount'), // Platform commission in cents
  artistPayoutAmount: integer('artist_payout_amount'), // Amount artist receives in cents
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  refundedAt: integer('refunded_at', { mode: 'timestamp' }),
  refundAmount: integer('refund_amount'), // Refund amount in cents if applicable
});
```

Run the migration to update your database:

```bash
pnpm db:push
```

#### Backend Stripe Connect Helpers

Create a new file for Stripe Connect helper functions:

```typescript
// server/stripe.ts - Stripe Connect integration
import Stripe from 'stripe';
import { db } from './db';
import { artistProfiles, bookings } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Create a Stripe Connect Express account for an artist
 */
export async function createConnectAccount(
  artistId: number,
  email: string,
  country: string = 'US'
) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: country,
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual', // Most artists are sole proprietors
    business_profile: {
      mcc: '7299', // Merchant category code: "Miscellaneous Personal Services"
      product_description: 'Creative services including art, photography, music, and design',
      url: process.env.VITE_APP_URL,
    },
    settings: {
      payouts: {
        schedule: {
          interval: 'manual', // Platform controls payout timing
        },
      },
    },
  });

  // Store account ID in database
  await db.update(artistProfiles)
    .set({
      stripeConnectAccountId: account.id,
      stripeConnectUpdatedAt: new Date(),
    })
    .where(eq(artistProfiles.id, artistId));

  return account;
}

/**
 * Generate onboarding link for artist to complete Stripe Connect setup
 */
export async function createConnectAccountLink(
  accountId: string,
  returnUrl?: string,
  refreshUrl?: string
) {
  const baseUrl = process.env.VITE_APP_URL;
  
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl || `${baseUrl}/dashboard/stripe-connect/refresh`,
    return_url: returnUrl || `${baseUrl}/dashboard/stripe-connect/complete`,
    type: 'account_onboarding',
  });

  return accountLink.url;
}

/**
 * Refresh Connect account status from Stripe
 */
export async function refreshConnectAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  
  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requirementsCurrentlyDue: account.requirements?.currently_due || [],
    requirementsEventuallyDue: account.requirements?.eventually_due || [],
    disabled: account.requirements?.disabled_reason || null,
  };
}

/**
 * Update artist's Connect status in database
 */
export async function updateArtistConnectStatus(artistId: number) {
  const artist = await db.query.artistProfiles.findFirst({
    where: eq(artistProfiles.id, artistId),
  });

  if (!artist?.stripeConnectAccountId) {
    throw new Error('Artist does not have a Connect account');
  }

  const status = await refreshConnectAccountStatus(artist.stripeConnectAccountId);

  await db.update(artistProfiles)
    .set({
      stripeConnectChargesEnabled: status.chargesEnabled,
      stripeConnectPayoutsEnabled: status.payoutsEnabled,
      stripeConnectDetailsSubmitted: status.detailsSubmitted,
      stripeConnectOnboardingComplete: status.chargesEnabled && status.payoutsEnabled,
      stripeConnectCurrentlyDue: JSON.stringify(status.requirementsCurrentlyDue),
      stripeConnectEventuallyDue: JSON.stringify(status.requirementsEventuallyDue),
      stripeConnectUpdatedAt: new Date(),
    })
    .where(eq(artistProfiles.id, artistId));

  return status;
}

/**
 * Create a payment intent with destination charge for booking
 */
export async function createBookingPayment({
  amount, // Total amount in cents (e.g., 20000 for $200)
  artistConnectAccountId,
  applicationFeePercent = 12,
  bookingId,
  clientEmail,
  description,
}: {
  amount: number;
  artistConnectAccountId: string;
  applicationFeePercent?: number;
  bookingId: number;
  clientEmail: string;
  description?: string;
}) {
  // Calculate application fee (platform commission)
  const applicationFeeAmount = Math.round(amount * (applicationFeePercent / 100));

  // Create Payment Intent with destination charge
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    application_fee_amount: applicationFeeAmount,
    transfer_data: {
      destination: artistConnectAccountId,
    },
    metadata: {
      bookingId: bookingId.toString(),
      applicationFeePercent: applicationFeePercent.toString(),
    },
    receipt_email: clientEmail,
    description: description || `Solely Art Booking #${bookingId}`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never', // Disable redirect-based payment methods for simpler UX
    },
  });

  return paymentIntent;
}

/**
 * Confirm a payment intent
 */
export async function confirmPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
  return paymentIntent;
}

/**
 * Create a refund for a booking
 */
export async function refundBookingPayment(
  paymentIntentId: string,
  amount?: number, // Optional partial refund amount in cents
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount, // If undefined, refunds full amount
    reason: reason,
    refund_application_fee: true, // Refund platform commission too
    reverse_transfer: true, // Reverse transfer to artist
  });

  return refund;
}

/**
 * Manually trigger payout to artist (for manual payout schedule)
 */
export async function triggerArtistPayout(
  artistConnectAccountId: string,
  amount: number, // Amount in cents
  bookingId: number
) {
  const payout = await stripe.payouts.create(
    {
      amount: amount,
      currency: 'usd',
      metadata: {
        bookingId: bookingId.toString(),
      },
    },
    {
      stripeAccount: artistConnectAccountId,
    }
  );

  return payout;
}
```

This implementation provides all the core Stripe Connect functionality you need:

1. **Account Creation** - Creates Express accounts for artists with appropriate settings
2. **Onboarding Links** - Generates hosted onboarding URLs for artists to complete setup
3. **Status Tracking** - Monitors artist account status and updates database
4. **Payment Processing** - Creates destination charges that automatically split payments
5. **Refund Handling** - Processes refunds that reverse both platform and artist portions
6. **Manual Payouts** - Triggers payouts to artists when bookings complete (optional)

The destination charge model (`transfer_data.destination`) is the cleanest architecture for marketplaces because:
- Payment is charged to client's card immediately
- Funds are automatically split at the source
- Artist portion goes directly to artist's account
- Platform commission stays in platform's Stripe balance
- No manual transfers or reconciliation needed
- Refunds automatically reverse both portions

#### tRPC API Endpoints

Add Stripe Connect endpoints to your existing tRPC router:

```typescript
// server/routers.ts - Add Stripe Connect router
import {
  createConnectAccount,
  createConnectAccountLink,
  updateArtistConnectStatus,
  createBookingPayment,
  confirmPayment,
  refundBookingPayment,
} from './stripe';

export const appRouter = router({
  // ... existing routers (artist, booking, etc.) ...

  stripe: router({
    /**
     * Start Connect onboarding for current artist
     */
    startConnectOnboarding: protectedProcedure
      .mutation(async ({ ctx }) => {
        const userId = ctx.user.id;

        // Get artist profile
        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.userId, userId),
        });

        if (!artist) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Artist profile not found. Create an artist profile first.',
          });
        }

        // Create or retrieve Connect account
        let accountId = artist.stripeConnectAccountId;

        if (!accountId) {
          const account = await createConnectAccount(
            artist.id,
            ctx.user.email,
            'US'
          );
          accountId = account.id;
        }

        // Generate onboarding link
        const onboardingUrl = await createConnectAccountLink(accountId);

        return { onboardingUrl };
      }),

    /**
     * Get Connect onboarding status for current artist
     */
    getConnectStatus: protectedProcedure
      .query(async ({ ctx }) => {
        const userId = ctx.user.id;

        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.userId, userId),
        });

        if (!artist?.stripeConnectAccountId) {
          return {
            hasAccount: false,
            onboardingComplete: false,
            chargesEnabled: false,
            payoutsEnabled: false,
          };
        }

        // Refresh status from Stripe
        const status = await updateArtistConnectStatus(artist.id);

        return {
          hasAccount: true,
          onboardingComplete: status.chargesEnabled && status.payoutsEnabled,
          chargesEnabled: status.chargesEnabled,
          payoutsEnabled: status.payoutsEnabled,
          requirementsCurrentlyDue: status.requirementsCurrentlyDue,
          requirementsEventuallyDue: status.requirementsEventuallyDue,
          disabled: status.disabled,
        };
      }),

    /**
     * Refresh onboarding link if expired or incomplete
     */
    refreshConnectLink: protectedProcedure
      .mutation(async ({ ctx }) => {
        const userId = ctx.user.id;

        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.userId, userId),
        });

        if (!artist?.stripeConnectAccountId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Connect account not found',
          });
        }

        const onboardingUrl = await createConnectAccountLink(
          artist.stripeConnectAccountId
        );

        return { onboardingUrl };
      }),
  }),

  booking: router({
    // ... existing booking endpoints ...

    /**
     * Create booking with payment intent
     */
    createBookingWithPayment: protectedProcedure
      .input(z.object({
        artistId: z.number(),
        serviceId: z.number(),
        startTime: z.number(), // Unix timestamp
        endTime: z.number(),
        budget: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        // Get artist and verify Connect account
        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.id, input.artistId),
        });

        if (!artist) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Artist not found' });
        }

        if (!artist.stripeConnectAccountId || !artist.stripeConnectOnboardingComplete) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Artist has not completed payment setup',
          });
        }

        // Get service for pricing
        const service = await db.query.services.findFirst({
          where: eq(services.id, input.serviceId),
        });

        if (!service) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Service not found' });
        }

        // Calculate total amount
        const durationHours = (input.endTime - input.startTime) / (1000 * 60 * 60);
        const totalAmount = Math.round(service.price * durationHours * 100); // Convert to cents

        // Calculate commission breakdown
        const platformCommission = Math.round(totalAmount * 0.12); // 12%
        const stripeFee = Math.round(totalAmount * 0.029 + 30); // 2.9% + $0.30
        const artistPayout = totalAmount - platformCommission;

        // Create booking record
        const [booking] = await db.insert(bookings).values({
          clientId: userId,
          artistId: input.artistId,
          serviceId: input.serviceId,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime),
          status: 'pending_payment',
          totalPrice: totalAmount / 100, // Store in dollars
          platformCommissionAmount: platformCommission,
          stripeFeeAmount: stripeFee,
          artistPayoutAmount: artistPayout,
          notes: input.notes,
          createdAt: new Date(),
        }).returning();

        // Create payment intent
        const paymentIntent = await createBookingPayment({
          amount: totalAmount,
          artistConnectAccountId: artist.stripeConnectAccountId,
          applicationFeePercent: 12,
          bookingId: booking.id,
          clientEmail: ctx.user.email,
          description: `${service.name} with ${artist.displayName || 'artist'}`,
        });

        // Store payment intent ID
        await db.update(bookings)
          .set({
            stripePaymentIntentId: paymentIntent.id,
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, booking.id));

        return {
          booking,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };
      }),

    /**
     * Confirm booking payment after client completes payment
     */
    confirmBookingPayment: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify booking belongs to user
        const booking = await db.query.bookings.findFirst({
          where: and(
            eq(bookings.id, input.bookingId),
            eq(bookings.clientId, ctx.user.id)
          ),
        });

        if (!booking) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
        }

        if (!booking.stripePaymentIntentId) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'No payment intent found for this booking',
          });
        }

        // Retrieve payment intent status from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          booking.stripePaymentIntentId
        );

        if (paymentIntent.status === 'succeeded') {
          // Update booking status
          await db.update(bookings)
            .set({
              status: 'pending', // Pending artist acceptance
              paidAt: new Date(),
              stripeChargeId: paymentIntent.latest_charge as string,
              updatedAt: new Date(),
            })
            .where(eq(bookings.id, input.bookingId));

          // TODO: Send notification to artist about new booking

          return { success: true, booking };
        } else if (paymentIntent.status === 'requires_payment_method') {
          throw new TRPCError({
            code: 'PAYMENT_REQUIRED',
            message: 'Payment method failed. Please try a different card.',
          });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Payment status: ${paymentIntent.status}`,
          });
        }
      }),

    /**
     * Refund a booking (artist or admin only)
     */
    refundBooking: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        amount: z.number().optional(), // Optional partial refund in dollars
        reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.query.bookings.findFirst({
          where: eq(bookings.id, input.bookingId),
          with: {
            artist: true,
          },
        });

        if (!booking) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
        }

        // Verify user is artist or admin
        if (booking.artist.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to refund this booking' });
        }

        if (!booking.stripePaymentIntentId) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'No payment found for this booking',
          });
        }

        // Convert amount to cents if provided
        const refundAmountCents = input.amount ? Math.round(input.amount * 100) : undefined;

        // Create refund
        const refund = await refundBookingPayment(
          booking.stripePaymentIntentId,
          refundAmountCents,
          input.reason
        );

        // Update booking status
        await db.update(bookings)
          .set({
            status: 'refunded',
            refundedAt: new Date(),
            refundAmount: refund.amount / 100, // Store in dollars
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, input.bookingId));

        // TODO: Send notification to client about refund

        return { success: true, refund };
      }),
  }),
});
```

These endpoints provide:

1. **Artist Onboarding** - `startConnectOnboarding` creates Connect account and returns hosted onboarding URL
2. **Status Checking** - `getConnectStatus` retrieves current onboarding status and requirements
3. **Link Refresh** - `refreshConnectLink` generates new onboarding URL if previous expired
4. **Payment Creation** - `createBookingWithPayment` creates booking and payment intent with automatic splitting
5. **Payment Confirmation** - `confirmBookingPayment` verifies payment succeeded and updates booking
6. **Refund Processing** - `refundBooking` creates refund that reverses both platform and artist portions

#### Webhook Handler for Payment Events

Stripe webhooks notify your backend when payment events occur asynchronously (payment succeeded, payment failed, refund processed, etc.). This is critical because payment confirmation can happen outside your application flow (e.g., 3D Secure authentication, delayed bank transfers).

Create a webhook handler:

```typescript
// server/webhooks.ts - Stripe webhook handler
import Stripe from 'stripe';
import { db } from './db';
import { bookings, artistProfiles } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Handle incoming Stripe webhook events
 */
export async function handleStripeWebhook(
  rawBody: string,
  signature: string
) {
  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle event based on type
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    case 'charge.refunded':
      await handleRefund(event.data.object as Stripe.Charge);
      break;

    case 'account.updated':
      await handleAccountUpdated(event.data.object as Stripe.Account);
      break;

    case 'payout.paid':
      await handlePayoutPaid(event.data.object as Stripe.Payout);
      break;

    case 'payout.failed':
      await handlePayoutFailed(event.data.object as Stripe.Payout);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return { received: true };
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = parseInt(paymentIntent.metadata.bookingId);

  if (!bookingId) {
    console.error('No bookingId in payment intent metadata');
    return;
  }

  await db.update(bookings)
    .set({
      status: 'pending', // Pending artist acceptance
      paidAt: new Date(),
      stripeChargeId: paymentIntent.latest_charge as string,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId));

  // TODO: Send notification to artist about new paid booking
  console.log(`Payment succeeded for booking ${bookingId}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = parseInt(paymentIntent.metadata.bookingId);

  if (!bookingId) {
    console.error('No bookingId in payment intent metadata');
    return;
  }

  await db.update(bookings)
    .set({
      status: 'payment_failed',
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId));

  // TODO: Send notification to client about payment failure
  console.log(`Payment failed for booking ${bookingId}`);
}

/**
 * Handle refund processed
 */
async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.stripePaymentIntentId, paymentIntentId),
  });

  if (booking) {
    await db.update(bookings)
      .set({
        status: 'refunded',
        refundedAt: new Date(),
        refundAmount: charge.amount_refunded / 100, // Convert to dollars
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));

    // TODO: Send notification to client about refund
    console.log(`Refund processed for booking ${booking.id}`);
  }
}

/**
 * Handle Connect account status update
 */
async function handleAccountUpdated(account: Stripe.Account) {
  const artist = await db.query.artistProfiles.findFirst({
    where: eq(artistProfiles.stripeConnectAccountId, account.id),
  });

  if (artist) {
    await db.update(artistProfiles)
      .set({
        stripeConnectChargesEnabled: account.charges_enabled,
        stripeConnectPayoutsEnabled: account.payouts_enabled,
        stripeConnectDetailsSubmitted: account.details_submitted,
        stripeConnectOnboardingComplete: account.charges_enabled && account.payouts_enabled,
        stripeConnectCurrentlyDue: JSON.stringify(account.requirements?.currently_due || []),
        stripeConnectEventuallyDue: JSON.stringify(account.requirements?.eventually_due || []),
        stripeConnectUpdatedAt: new Date(),
      })
      .where(eq(artistProfiles.id, artist.id));

    console.log(`Connect account updated for artist ${artist.id}`);
  }
}

/**
 * Handle successful payout to artist
 */
async function handlePayoutPaid(payout: Stripe.Payout) {
  const bookingId = payout.metadata?.bookingId;

  if (bookingId) {
    // TODO: Update booking payout status if tracking individual payouts
    console.log(`Payout completed for booking ${bookingId}`);
  }
}

/**
 * Handle failed payout to artist
 */
async function handlePayoutFailed(payout: Stripe.Payout) {
  const bookingId = payout.metadata?.bookingId;

  if (bookingId) {
    // TODO: Alert platform admin about failed payout
    // TODO: Notify artist to update bank details
    console.error(`Payout failed for booking ${bookingId}: ${payout.failure_message}`);
  }
}
```

Add the webhook endpoint to your Express server:

```typescript
// server/_core/index.ts - Add webhook route
import express from 'express';
import { handleStripeWebhook } from '../webhooks';

const app = express();

// CRITICAL: Webhook route must use raw body, NOT JSON parsed body
// Place this BEFORE any body parsing middleware
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      const rawBody = req.body.toString();
      await handleStripeWebhook(rawBody, signature);
      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// ... rest of your Express setup with JSON body parsing for other routes
```

**Configure Webhook in Stripe Dashboard:**

1. Log into Stripe Dashboard at dashboard.stripe.com
2. Navigate to Developers → Webhooks
3. Click "Add endpoint"
4. Enter webhook URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `account.updated`
   - `payout.paid`
   - `payout.failed`
6. Click "Add endpoint"
7. Copy the webhook signing secret (starts with `whsec_...`)
8. Add to your environment variables: `STRIPE_WEBHOOK_SECRET=whsec_...`

**Test Webhooks:**

Stripe provides a webhook testing tool in the Dashboard. Click "Send test webhook" and select an event type to verify your endpoint receives and processes events correctly.

---

*[Document continues with remaining sections: Mercury API Integration, NC Tax Obligations, Sales Tax, IC Classification, 1099-K, Insurance, Privacy, Implementation Timeline, Financial Projections, Compliance Calendar, and Resources]*

*Due to length constraints, I'll continue in the next response...*

## Mercury API Integration for Financial Dashboard

### Mercury API Overview

Mercury's API enables you to build custom financial dashboards within your Solely Art admin panel, providing real-time visibility into cash flow, revenue metrics, and expense tracking without leaving your platform. The API is RESTful, well-documented, and provides comprehensive access to account data.

#### API Capabilities

**Account Information:**
- Retrieve account balances (checking + treasury)
- Get account details (routing number, account number, status)
- List all accounts if you have multiple

**Transaction Data:**
- Fetch transaction history with filtering and pagination
- Search transactions by amount, date range, description, or counterparty
- Get transaction details including merchant information and categorization

**Recipient Management:**
- Create and manage payment recipients
- Store recipient bank details for recurring payments
- Verify recipient account ownership

**Payment Initiation:**
- Create ACH transfers to recipients
- Schedule future-dated payments
- Cancel pending payments

**Webhooks:**
- Receive real-time notifications for new transactions
- Get alerts for low balance or large transactions
- Monitor account status changes

### Enabling Mercury API Access

#### Step 1: Generate API Key

1. Log into Mercury dashboard at mercury.com
2. Navigate to Settings → Developers → API Keys
3. Click "Create API Key"
4. Enter a descriptive name: "Solely Art Platform - Production"
5. Select permissions:
   - **Read account information** - Required for balance and details
   - **Read transactions** - Required for transaction history
   - **Create payments** - Optional, only if you want to initiate payments via API
   - **Manage recipients** - Optional, for storing recipient details
6. Click "Create Key"
7. Copy the API key immediately (starts with `pk_live_...`) - it's only shown once
8. Store securely in your environment variables

**Security Best Practices:**

- Never commit API keys to version control
- Use separate keys for development and production
- Rotate keys every 90 days
- Revoke keys immediately if compromised
- Limit permissions to only what's needed

#### Step 2: Store API Key in Environment

Add Mercury API credentials to your environment configuration:

```typescript
// server/_core/env.ts - Add Mercury configuration
export const env = {
  // ... existing env vars ...
  
  MERCURY_API_KEY: process.env.MERCURY_API_KEY!,
  MERCURY_API_URL: 'https://api.mercury.com/api/v1',
};
```

Add to your `.env` file (never commit this file):

```bash
MERCURY_API_KEY=pk_live_your_actual_key_here
```

For production deployment on Manus, add the environment variable through the Management UI Settings → Secrets panel.

### Mercury API Client Implementation

Create a reusable Mercury API client:

```typescript
// server/mercury.ts - Mercury API client
import axios, { AxiosInstance } from 'axios';
import { env } from './_core/env';

class MercuryClient {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://api.mercury.com/api/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Get all accounts
   */
  async getAccounts() {
    const response = await this.client.get('/accounts');
    return response.data;
  }

  /**
   * Get specific account details
   */
  async getAccount(accountId: string) {
    const response = await this.client.get(`/accounts/${accountId}`);
    return response.data;
  }

  /**
   * Get account balance
   */
  async getBalance(accountId: string) {
    const response = await this.client.get(`/accounts/${accountId}/balance`);
    return response.data;
  }

  /**
   * Get transactions with optional filters
   */
  async getTransactions(params: {
    accountId: string;
    startDate?: string; // ISO 8601 format: 2024-01-01
    endDate?: string;
    limit?: number; // Max 100 per request
    offset?: number; // For pagination
    status?: 'pending' | 'sent' | 'cancelled' | 'failed';
  }) {
    const response = await this.client.get(`/accounts/${params.accountId}/transactions`, {
      params: {
        start: params.startDate,
        end: params.endDate,
        limit: params.limit || 100,
        offset: params.offset || 0,
        status: params.status,
      },
    });
    return response.data;
  }

  /**
   * Get single transaction details
   */
  async getTransaction(accountId: string, transactionId: string) {
    const response = await this.client.get(
      `/accounts/${accountId}/transactions/${transactionId}`
    );
    return response.data;
  }

  /**
   * Create a recipient for payments
   */
  async createRecipient(data: {
    name: string;
    email?: string;
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
  }) {
    const response = await this.client.post('/recipients', data);
    return response.data;
  }

  /**
   * Create an ACH payment
   */
  async createPayment(data: {
    accountId: string;
    recipientId: string;
    amount: number; // In cents
    description: string;
    idempotencyKey: string; // Unique key to prevent duplicate payments
    scheduledFor?: string; // ISO 8601 date for future payment
  }) {
    const response = await this.client.post('/payments', data, {
      headers: {
        'Idempotency-Key': data.idempotencyKey,
      },
    });
    return response.data;
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(paymentId: string) {
    const response = await this.client.post(`/payments/${paymentId}/cancel`);
    return response.data;
  }
}

// Export singleton instance
export const mercury = new MercuryClient(env.MERCURY_API_KEY);

// Export types for use in other files
export interface MercuryAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings';
  status: 'active' | 'closed';
  routingNumber: string;
  accountNumber: string;
  availableBalance: number; // In cents
  currentBalance: number; // In cents
  createdAt: string;
}

export interface MercuryTransaction {
  id: string;
  accountId: string;
  amount: number; // In cents, negative for debits
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  description: string;
  counterpartyName: string | null;
  postedAt: string | null;
  createdAt: string;
  category: string | null;
  note: string | null;
}

export interface MercuryBalance {
  availableBalance: number; // In cents
  currentBalance: number; // In cents
  treasuryBalance: number; // In cents (if treasury enabled)
}
```

### Financial Dashboard tRPC Endpoints

Add financial dashboard endpoints to your tRPC router:

```typescript
// server/routers.ts - Add financial router
import { mercury, MercuryTransaction } from './mercury';
import { adminProcedure } from './_core/procedures'; // Restrict to admins only

export const appRouter = router({
  // ... existing routers ...

  financial: router({
    /**
     * Get current account balance
     */
    getBalance: adminProcedure
      .query(async () => {
        const accounts = await mercury.getAccounts();
        const primaryAccount = accounts.data[0]; // Assuming single account

        if (!primaryAccount) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No Mercury account found',
          });
        }

        const balance = await mercury.getBalance(primaryAccount.id);

        return {
          accountId: primaryAccount.id,
          accountName: primaryAccount.name,
          availableBalance: balance.availableBalance / 100, // Convert to dollars
          currentBalance: balance.currentBalance / 100,
          treasuryBalance: balance.treasuryBalance / 100,
          totalBalance: (balance.currentBalance + balance.treasuryBalance) / 100,
        };
      }),

    /**
     * Get recent transactions
     */
    getRecentTransactions: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        startDate: z.string().optional(), // ISO 8601: 2024-01-01
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const accounts = await mercury.getAccounts();
        const primaryAccount = accounts.data[0];

        if (!primaryAccount) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No Mercury account found',
          });
        }

        const transactions = await mercury.getTransactions({
          accountId: primaryAccount.id,
          limit: input.limit,
          offset: input.offset,
          startDate: input.startDate,
          endDate: input.endDate,
        });

        return {
          transactions: transactions.data.map((tx: MercuryTransaction) => ({
            id: tx.id,
            amount: tx.amount / 100, // Convert to dollars
            description: tx.description,
            counterparty: tx.counterpartyName,
            category: tx.category,
            status: tx.status,
            date: tx.postedAt || tx.createdAt,
            type: tx.amount > 0 ? 'credit' : 'debit',
          })),
          total: transactions.total,
          hasMore: transactions.total > input.offset + input.limit,
        };
      }),

    /**
     * Get revenue metrics for dashboard
     */
    getRevenueMetrics: adminProcedure
      .input(z.object({
        period: z.enum(['7d', '30d', '90d', '1y', 'all']).default('30d'),
      }))
      .query(async ({ input }) => {
        const accounts = await mercury.getAccounts();
        const primaryAccount = accounts.data[0];

        if (!primaryAccount) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No Mercury account found',
          });
        }

        // Calculate date range
        const endDate = new Date();
        let startDate = new Date();

        switch (input.period) {
          case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(endDate.getDate() - 90);
            break;
          case '1y':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
          case 'all':
            startDate = new Date('2024-01-01'); // Platform launch date
            break;
        }

        // Fetch all transactions in period
        const allTransactions: MercuryTransaction[] = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          const response = await mercury.getTransactions({
            accountId: primaryAccount.id,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            limit: 100,
            offset,
          });

          allTransactions.push(...response.data);
          offset += 100;
          hasMore = response.total > offset;
        }

        // Calculate metrics
        const deposits = allTransactions.filter(tx => tx.amount > 0);
        const withdrawals = allTransactions.filter(tx => tx.amount < 0);

        const totalRevenue = deposits.reduce((sum, tx) => sum + tx.amount, 0) / 100;
        const totalExpenses = Math.abs(withdrawals.reduce((sum, tx) => sum + tx.amount, 0)) / 100;
        const netIncome = totalRevenue - totalExpenses;

        // Identify Stripe deposits (commission revenue)
        const stripeDeposits = deposits.filter(tx =>
          tx.description?.toLowerCase().includes('stripe') ||
          tx.counterpartyName?.toLowerCase().includes('stripe')
        );
        const commissionRevenue = stripeDeposits.reduce((sum, tx) => sum + tx.amount, 0) / 100;

        // Calculate daily breakdown for chart
        const dailyRevenue: { [date: string]: number } = {};
        deposits.forEach(tx => {
          const date = (tx.postedAt || tx.createdAt).split('T')[0];
          dailyRevenue[date] = (dailyRevenue[date] || 0) + tx.amount / 100;
        });

        return {
          period: input.period,
          totalRevenue,
          totalExpenses,
          netIncome,
          commissionRevenue,
          transactionCount: allTransactions.length,
          averageTransactionSize: totalRevenue / deposits.length || 0,
          dailyBreakdown: Object.entries(dailyRevenue).map(([date, amount]) => ({
            date,
            amount,
          })).sort((a, b) => a.date.localeCompare(b.date)),
        };
      }),

    /**
     * Get expense breakdown by category
     */
    getExpenseBreakdown: adminProcedure
      .input(z.object({
        startDate: z.string(), // ISO 8601: 2024-01-01
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        const accounts = await mercury.getAccounts();
        const primaryAccount = accounts.data[0];

        if (!primaryAccount) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No Mercury account found',
          });
        }

        // Fetch all transactions in period
        const allTransactions: MercuryTransaction[] = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          const response = await mercury.getTransactions({
            accountId: primaryAccount.id,
            startDate: input.startDate,
            endDate: input.endDate,
            limit: 100,
            offset,
          });

          allTransactions.push(...response.data);
          offset += 100;
          hasMore = response.total > offset;
        }

        // Group expenses by category
        const expenses = allTransactions.filter(tx => tx.amount < 0);
        const categoryTotals: { [category: string]: number } = {};

        expenses.forEach(tx => {
          const category = tx.category || 'Uncategorized';
          categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(tx.amount);
        });

        // Convert to array and sort by amount
        const breakdown = Object.entries(categoryTotals)
          .map(([category, amount]) => ({
            category,
            amount: amount / 100, // Convert to dollars
            percentage: 0, // Calculate below
          }))
          .sort((a, b) => b.amount - a.amount);

        // Calculate percentages
        const totalExpenses = breakdown.reduce((sum, item) => sum + item.amount, 0);
        breakdown.forEach(item => {
          item.percentage = (item.amount / totalExpenses) * 100;
        });

        return {
          breakdown,
          totalExpenses,
        };
      }),
  }),
});
```

### Financial Dashboard UI Components

Create a financial dashboard page for admin users:

```tsx
// client/src/pages/FinancialDashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function FinancialDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  const { data: balance, isLoading: balanceLoading } = trpc.financial.getBalance.useQuery();
  const { data: metrics, isLoading: metricsLoading } = trpc.financial.getRevenueMetrics.useQuery({ period });
  const { data: transactions, isLoading: transactionsLoading } = trpc.financial.getRecentTransactions.useQuery({ limit: 20 });

  if (balanceLoading || metricsLoading || transactionsLoading) {
    return <div className="p-8">Loading financial data...</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Monitor revenue, expenses, and cash flow</p>
        </div>
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-3xl">${balance?.availableBalance.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ready to spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Treasury Balance</CardDescription>
            <CardTitle className="text-3xl">${balance?.treasuryBalance.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Earning 4.5% APY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">${metrics?.totalRevenue.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{period === '30d' ? 'Last 30 days' : period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Income</CardDescription>
            <CardTitle className="text-3xl text-green-600">${metrics?.netIncome.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Revenue minus expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily commission revenue from Stripe</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.dailyBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest deposits and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {tx.counterparty} • {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-lg font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

Add route to App.tsx:

```tsx
// client/src/App.tsx
import { FinancialDashboard } from './pages/FinancialDashboard';

// Inside your routes:
<Route path="/admin/financial" element={<FinancialDashboard />} />
```

This financial dashboard provides:

1. **Real-Time Balance Display** - Shows available, treasury, and total balances
2. **Revenue Metrics** - Calculates total revenue, expenses, and net income for selected period
3. **Revenue Trend Chart** - Visualizes daily commission revenue over time
4. **Recent Transactions** - Lists latest deposits and withdrawals with categorization
5. **Expense Breakdown** - Groups expenses by category for budget analysis

The dashboard automatically syncs with Mercury via API, providing accurate financial data without manual CSV exports or reconciliation.

---

## North Carolina Tax Obligations

### State Income Tax Structure

North Carolina's flat income tax rate simplifies tax calculations and planning compared to progressive tax states. Understanding your specific tax obligations based on business structure is critical for accurate quarterly payments and year-end filing.

#### LLC Tax Treatment (Pass-Through)

As a pass-through entity, your LLC's net income flows directly to your personal tax return. You report business income and expenses on **Schedule C** (Profit or Loss from Business) attached to your **Form 1040** federal return, and on **Form D-400** for North Carolina.

**Tax Calculation Example ($84,000 net income):**

**Federal Taxes:**
- Gross income: $84,000
- Standard deduction (2024): $14,600 (single) or $29,200 (married filing jointly)
- Taxable income: $69,400 (single) or $54,800 (married)
- Federal income tax (22% bracket): $15,268 (single) or $12,056 (married)
- Self-employment tax (15.3% on 92.35% of net income): $11,878
- **Total federal tax: $27,146 (single) or $23,934 (married)**

**North Carolina Taxes:**
- Net income: $84,000
- Standard deduction: $12,750 (single) or $25,500 (married filing jointly)
- Taxable income: $71,250 (single) or $58,500 (married)
- NC income tax (4.75% flat rate): $3,384 (single) or $2,779 (married)

**Total Tax Burden:**
- Federal: $27,146 (single) or $23,934 (married)
- NC: $3,384 (single) or $2,779 (married)
- **Combined: $30,530 (single) or $26,713 (married)**
- **Effective rate: 36.3% (single) or 31.8% (married)**

**Tax Savings Tip:** The self-employment tax ($11,878) is the largest single tax expense. Once net income exceeds $60,000-80,000, electing S-Corporation status can reduce this tax by $3,000-5,000 annually by splitting income between salary (subject to payroll taxes) and distributions (not subject to self-employment tax).

#### Quarterly Estimated Tax Payments

The IRS and NC DOR require quarterly estimated payments if you expect to owe $1,000+ annually. Payments are due four times per year on fixed dates, regardless of when you earn the income.

**Payment Schedule:**

- **Q1: April 15** - Covers January 1 - March 31 income
- **Q2: June 15** - Covers April 1 - May 31 income
- **Q3: September 15** - Covers June 1 - August 31 income
- **Q4: January 15** (following year) - Covers September 1 - December 31 income

**Calculation Method:**

The IRS provides two safe harbor methods to avoid underpayment penalties:

**Method 1: 90% of Current Year Tax**
- Estimate your total annual tax liability
- Pay 90% of that amount in quarterly installments (22.5% each quarter)
- If actual tax is higher, you owe the difference at year-end
- If actual tax is lower, you receive a refund

**Method 2: 100% of Prior Year Tax (110% if AGI > $150K)**
- Pay 100% of your previous year's total tax in quarterly installments (25% each quarter)
- Guaranteed safe harbor - no penalties even if current year tax is much higher
- Recommended for first year or if income is unpredictable

**Example Calculation (Method 1):**

Based on projected $84,000 net income:
- Federal tax: $27,146
- NC tax: $3,384
- Total annual tax: $30,530

Quarterly payments:
- Q1: $7,633 ($6,787 federal + $846 NC)
- Q2: $7,633
- Q3: $7,633
- Q4: $7,631
- **Total: $30,530**

**Payment Methods:**

**Federal (IRS):**
- **IRS Direct Pay** - Free, no registration required, pay from checking/savings account at irs.gov/payments
- **EFTPS** - Electronic Federal Tax Payment System, requires enrollment, allows scheduling future payments
- **Credit/Debit Card** - Third-party processors charge 1.87-1.99% fee ($143-152 per $7,633 payment)

**North Carolina:**
- **NC DOR Online** - Free, pay via ACH at ncdor.gov using Form NC-40
- **Check/Money Order** - Mail Form NC-40 with payment to NC DOR, PO Box 25000, Raleigh, NC 27640-0640

**Recommendation:** Use IRS Direct Pay and NC DOR online payment for free, instant confirmation. Set calendar reminders for 1 week before each deadline to avoid late penalties.

**Underpayment Penalties:**

If you don't pay enough estimated tax, the IRS and NC DOR charge interest on the underpayment:
- **Federal:** ~8% annual interest (varies quarterly based on federal short-term rate + 3%)
- **North Carolina:** 5% annual interest

The penalty is calculated based on how much you underpaid and for how long. For example, if you underpaid $5,000 in Q1 and didn't correct it until year-end filing, you'd owe approximately $400 in federal penalties and $250 in NC penalties.

**Avoiding Penalties:**

1. **Pay on time** - Set reminders for 1 week before each deadline
2. **Use safe harbor method** - Pay 100% of prior year tax to guarantee no penalties
3. **Adjust quarterly** - If income increases mid-year, increase remaining quarterly payments
4. **Make catch-up payments** - If you miss a quarter, pay double the next quarter to minimize penalties

#### Annual Tax Filing Requirements

**Federal Tax Return (Form 1040 + Schedule C):**

Due April 15 each year (or next business day if April 15 falls on weekend/holiday). File electronically through:
- **Tax software** - TurboTax Self-Employed ($119), H&R Block Premium ($85), FreeTaxUSA ($15)
- **CPA** - $500-1,500 depending on complexity
- **IRS Free File** - Free if AGI under $79,000 (2024 limit)

**What to Include:**
- Schedule C (Profit or Loss from Business) - Reports business income and expenses
- Schedule SE (Self-Employment Tax) - Calculates self-employment tax
- Form 1040 - Your personal tax return with Schedule C attached
- Form 8995 - Qualified Business Income Deduction (20% deduction for pass-through income)

**Extension Option:**
- File Form 4868 by April 15 to get automatic 6-month extension to October 15
- Extension gives you more time to file, NOT more time to pay
- You must still pay estimated tax owed by April 15 to avoid interest and penalties

**North Carolina Tax Return (Form D-400):**

Due April 15 each year, same as federal return. File electronically at ncdor.gov or through tax software that supports NC returns.

**What to Include:**
- Form D-400 - NC individual income tax return
- Schedule S - Supplemental income from Schedule C
- Form D-400TC - Tax credits if applicable

**Extension Option:**
- NC automatically grants 6-month extension if you filed federal extension
- No separate NC extension form required
- Must still pay estimated tax owed by April 15

**Record Retention:**

The IRS recommends keeping tax records for **7 years** from filing date. North Carolina requires **3 years**. Keep:
- All tax returns and supporting schedules
- W-2s, 1099s, and other income documents
- Receipts for deductible expenses
- Bank and credit card statements
- Mileage logs if claiming vehicle deduction
- Depreciation schedules for assets
- Business formation documents

Store digital copies in encrypted cloud storage (Google Drive, Dropbox) with local backups. Use accounting software like QuickBooks to automatically organize and categorize transactions throughout the year, making tax preparation significantly easier.

### Deductible Business Expenses

Maximizing legitimate business deductions reduces your taxable income and overall tax burden. The IRS allows deductions for "ordinary and necessary" business expenses - costs that are common and helpful for your marketplace platform.

#### Common Deductible Expenses for Solely Art

**Technology and Software:**
- Hosting fees (Manus platform subscription)
- Domain registration and renewal
- Software subscriptions (QuickBooks, analytics tools, design software)
- Cloud storage (Google Drive, Dropbox)
- Development tools and services
- API fees (Stripe, Mercury, third-party integrations)

**Professional Services:**
- CPA and bookkeeping fees
- Attorney fees (business formation, contract review, compliance)
- Business consultant fees
- Marketing agency or freelancer fees
- Web design and development contractors

**Office Expenses:**
- Home office deduction (if you have dedicated workspace)
- Office supplies (pens, paper, printer ink)
- Computer equipment and peripherals
- Phone and internet (business portion only)
- Furniture (desk, chair, filing cabinet)

**Marketing and Advertising:**
- Google Ads and social media advertising
- Content creation (blog posts, videos, graphics)
- Email marketing services (Mailchimp, ConvertKit)
- SEO tools and services
- Influencer partnerships
- Trade show or conference booth fees

**Financial and Banking:**
- Bank fees (though Mercury has none)
- Credit card processing fees (Stripe fees are deductible)
- Business credit card annual fees
- Accounting software subscriptions
- Payroll processing fees (if you have employees)

**Insurance:**
- General liability insurance
- Cyber liability insurance
- Professional liability (E&O) insurance
- Business property insurance
- Workers' compensation (if required)

**Education and Training:**
- Online courses related to business skills
- Books and publications about entrepreneurship, marketing, technology
- Conference and seminar registration fees
- Professional membership dues

**Travel (Business Purpose Only):**
- Airfare and lodging for business trips
- Meals during business travel (50% deductible)
- Car rental for business purposes
- Mileage (67 cents per mile in 2024) or actual vehicle expenses
- Parking and tolls

**Home Office Deduction:**

If you use part of your home exclusively and regularly for business, you can deduct home office expenses using one of two methods:

**Simplified Method:**
- Deduct $5 per square foot of home office space
- Maximum 300 square feet = $1,500 maximum deduction
- No depreciation recapture when you sell your home
- Easier calculation with less documentation

**Actual Expense Method:**
- Calculate percentage of home used for business (e.g., 200 sq ft office / 2,000 sq ft home = 10%)
- Deduct 10% of mortgage interest, property taxes, utilities, insurance, repairs, depreciation
- Requires detailed records and receipts
- Higher deduction potential but more complex
- May trigger depreciation recapture when selling home

**Example (Simplified Method):**
- Home office: 150 square feet
- Deduction: 150 × $5 = $750/year

**Example (Actual Expense Method):**
- Home: 2,000 sq ft, office: 200 sq ft = 10% business use
- Annual expenses: $15,000 mortgage interest + $3,000 property tax + $2,400 utilities + $1,200 insurance + $500 repairs = $22,100
- Business portion: $22,100 × 10% = $2,210 deduction

**Requirement:** Office space must be used **exclusively** for business. If you use your spare bedroom as both an office and guest room, you cannot claim the deduction. If you have a dedicated desk area in your living room, that doesn't qualify either. The space must be a separate room or clearly defined area used only for business.

#### Non-Deductible Expenses

Understanding what you **cannot** deduct prevents IRS audits and penalties:

**Personal Expenses:**
- Personal meals, entertainment, or travel
- Clothing (unless it's a uniform or costume required for business)
- Personal grooming and hygiene
- Commuting from home to office (if you have an external office)
- Personal portion of phone, internet, or vehicle use

**Fines and Penalties:**
- Traffic tickets
- Parking tickets
- Late payment penalties to vendors
- IRS or state tax penalties

**Political Contributions:**
- Donations to political candidates or parties
- Lobbying expenses

**Excessive Compensation:**
- Unreasonably high salaries to family members
- Compensation not commensurate with work performed

**Capital Expenses (Must Be Depreciated):**
- Buildings and land
- Vehicles
- Large equipment
- Furniture over $2,500 per item

Note: You can elect Section 179 expensing to deduct up to $1,220,000 (2024 limit) of equipment purchases in the year of purchase rather than depreciating over multiple years. This is valuable for computers, furniture, and other business equipment.

#### Tax Deduction Strategy

**Track Everything:**

Use accounting software (QuickBooks, FreshBooks, Wave) connected to your Mercury account to automatically categorize transactions. Review monthly and adjust categories as needed. Snap photos of paper receipts with your phone and upload to your accounting software immediately.

**Separate Business and Personal:**

Never mix personal and business expenses. Use your Mercury business account and business credit card exclusively for business purchases. This creates a clean audit trail and simplifies tax preparation.

**Maximize Deductions Legally:**

Take every legitimate deduction you're entitled to, but don't fabricate expenses or inflate amounts. The IRS uses algorithms to flag returns with unusually high deductions relative to income. If your deductions are legitimate and well-documented, you have nothing to fear from an audit.

**Quarterly Review:**

Review your year-to-date income and expenses quarterly when making estimated tax payments. This helps you:
- Identify missing deductions you can claim
- Adjust estimated payments if income is higher/lower than projected
- Catch categorization errors before year-end
- Plan for large purchases to optimize timing (e.g., buying equipment in December vs January)

**Year-End Tax Planning:**

In November-December, work with your CPA to:
- Accelerate deductible expenses into current year if beneficial (prepay January software subscriptions in December)
- Defer income into next year if you'll be in a lower tax bracket
- Make large equipment purchases before December 31 to claim Section 179 deduction
- Contribute to retirement accounts (SEP-IRA, Solo 401(k)) to reduce taxable income

---

## Sales Tax on Creative Services

### North Carolina Sales Tax Framework

North Carolina has one of the broadest sales tax bases in the United States, taxing many services that other states exempt. However, most creative and personal services remain exempt, which is favorable for your artist marketplace.

#### Current NC Sales Tax Rates (2024)

**State Rate:** 4.75%

**County Rates:** 2.00% - 2.75% (varies by county)

**Combined Rates by Major NC Counties:**
- Mecklenburg (Charlotte): 7.25%
- Wake (Raleigh): 7.25%
- Durham: 7.50%
- Guilford (Greensboro): 6.75%
- Forsyth (Winston-Salem): 6.75%
- Buncombe (Asheville): 6.75%
- New Hanover (Wilmington): 7.00%

Sales tax is destination-based in North Carolina, meaning you charge the rate based on where the customer receives the service, not where your business is located.

#### Services Subject to Sales Tax in NC

North Carolina taxes specific categories of services, but creative services are generally exempt:

**Taxable Services:**
- Repair, maintenance, and installation services (fixing or installing tangible personal property)
- Telecommunications services (phone, internet, cable)
- Accommodations (hotels, short-term rentals under 90 days)
- Laundry and dry cleaning services
- Storage and warehousing services
- Parking and vehicle storage
- Certain real property services (landscaping, pest control, cleaning)

**Exempt Services (Relevant to Solely Art):**
- Artistic services (painting, drawing, sculpture, murals)
- Photography services (portraits, events, commercial)
- Graphic design services (logos, branding, print design)
- Web design and development services
- Writing and editing services
- Music performance and instruction
- Dance and theater performance
- Consulting and professional services
- Personal training and coaching

**Gray Area - Digital Services:**

North Carolina has been expanding sales tax to digital goods and services, creating ambiguity for certain creative services:

**Potentially Taxable:**
- Digital artwork files sold as products (downloadable prints, stock photos)
- Digital design templates sold repeatedly
- Software or apps created for clients
- Streaming content subscriptions

**Likely Exempt:**
- Custom digital artwork created for specific client
- Custom web design services
- Custom graphic design services
- Photography services that include digital files

The distinction is whether the service is a custom professional service (exempt) or a sale of digital property (potentially taxable). The NC DOR has not issued clear guidance on this distinction, creating compliance uncertainty.

#### Marketplace Facilitator Law

North Carolina enacted the **Marketplace Facilitator Act** effective February 1, 2020 (NC Gen. Stat. § 105-164.4J). This law requires marketplace platforms to collect and remit sales tax on behalf of sellers if:

1. The platform facilitates taxable sales
2. The platform processes payments
3. The platform has economic nexus in NC ($100,000+ annual sales OR 200+ transactions)

**Key Question: Does This Apply to Solely Art?**

The law applies only if you facilitate **taxable** sales. Since most creative services are exempt from NC sales tax, the marketplace facilitator law likely does not apply to your platform.

However, if you add categories that include taxable services (e.g., art installation, equipment rental, tangible goods like art prints), you would become responsible for collecting and remitting sales tax on those specific transactions.

**Recommendation:** Consult with a NC sales tax attorney or CPA once you reach $100,000 annual GMV to confirm your specific services are exempt and document that determination. This protects you if the NC DOR ever audits your platform.

#### Sales Tax Registration Process (If Needed)

If you determine any services on your platform are taxable, register for NC sales tax:

**Step 1: Register Online**
1. Visit ncdor.gov
2. Select "Register a Business"
3. Complete Form NC-BR (if not already registered)
4. Select "Sales and Use Tax" account
5. Provide business information and estimated monthly sales
6. Submit registration (free)

**Step 2: Receive Sales Tax ID**
- NC DOR issues your Sales and Use Tax Account Number
- Mailed within 2 weeks
- Use this number on all sales tax filings

**Step 3: Configure Stripe Tax**

Stripe offers automated sales tax calculation and collection through Stripe Tax:

1. Enable Stripe Tax in Dashboard → Settings → Tax
2. Configure tax settings for North Carolina
3. Stripe automatically calculates correct rate based on customer location
4. Tax amount is added to payment total
5. Stripe tracks collected tax for reporting

**Cost:** Stripe Tax charges 0.5% of transaction amount (e.g., $1 on $200 booking)

**Alternative:** Implement manual tax calculation in your booking flow based on customer zip code. This requires maintaining a database of NC county tax rates and updating when rates change.

**Step 4: File Sales Tax Returns**

NC requires sales tax filing on a schedule based on your annual tax liability:

**Monthly Filing:** If you collect $20,000+ annually
- Due 20th of following month
- File Form E-500 online at ncdor.gov

**Quarterly Filing:** If you collect $100-$20,000 annually
- Due 20th of month following quarter end
- File Form E-500 online

**Annual Filing:** If you collect less than $100 annually
- Due January 20 of following year
- File Form E-500 online

**Step 5: Remit Collected Tax**

When filing your return, remit the total sales tax collected during the period via ACH payment through the NC DOR online portal. Keep records of all transactions, tax collected, and filings for 3 years (NC requirement) or 7 years (IRS best practice).

#### Sales Tax Compliance Strategy

**Phase 1: Launch - First $100K GMV**

Do NOT collect sales tax. The vast majority of creative services are exempt, and the administrative burden of tax compliance would slow your launch and product-market fit discovery. Focus on growth and validating your business model.

**Phase 2: $100K-500K GMV**

Consult with a NC sales tax CPA or attorney to review your specific service categories and confirm exemption status. Document this consultation and their determination in writing. This demonstrates good-faith compliance effort if the NC DOR ever questions your tax treatment.

**Phase 3: $500K+ GMV or Multi-State Expansion**

If you expand to other states, research each state's service taxation rules. States like Washington, Hawaii, and New Mexico tax most services, while states like California and Texas largely exempt services. Implement Stripe Tax or hire a sales tax compliance service like TaxJar ($19-99/month) or Avalara ($50-200/month) to automate multi-state calculations and filings.

**Recommendation:** Do not collect sales tax at launch unless you're certain services are taxable. Consult with a professional once you reach $100K annual GMV to confirm exemption status and document your compliance position.

---

## Independent Contractor Classification

### Critical Importance of Proper Classification

Misclassifying workers as independent contractors when they should be employees is one of the most expensive mistakes a marketplace platform can make. The consequences include:

**Financial Penalties:**
- Back payment of employment taxes (7.65% employer portion of FICA)
- Back payment of unemployment taxes (1-5.76% of wages)
- Penalties of $50-$280 per missing W-2 or 1099 form
- Interest on unpaid taxes dating back to original payment dates
- Potential criminal penalties for willful misclassification

**Legal Liability:**
- Worker lawsuits for unpaid wages, overtime, and benefits
- Class action lawsuits if multiple workers are misclassified
- State labor department enforcement actions
- Injunctions preventing you from operating until compliant

**Operational Disruption:**
- Requirement to reclassify all workers as employees going forward
- Need to implement payroll systems, benefits, workers' comp insurance
- Significant increase in per-worker costs (30-40% higher than IC costs)
- Potential business model disruption if margins can't support employee costs

**Example Cost:**

If the NC Department of Commerce determines you misclassified 100 artists who each earned $20,000 annually for 3 years:

- Total payments: $6,000,000
- Back employment taxes (7.65%): $459,000
- Back unemployment taxes (1%): $60,000
- Penalties (conservative): $100,000
- Legal fees: $50,000-200,000
- **Total cost: $669,000-819,000**

This can destroy an early-stage company. Proper classification from day one is essential.

### North Carolina ABC Test

North Carolina uses the **ABC Test** to determine worker classification for unemployment insurance purposes (NC Gen. Stat. § 96-8(6)). A worker is an independent contractor only if ALL three conditions are met:

#### Condition A: Free from Control and Direction

**The worker must be free from control and direction in performing the service, both under the contract and in fact.**

**What This Means:**

The platform cannot control HOW the worker performs their services. You can specify the desired outcome (e.g., "paint a portrait of the client") but not the methods, techniques, or processes used to achieve that outcome.

**Factors Supporting Independent Contractor Status:**

- Artists choose their own techniques, materials, and creative process
- Artists set their own work schedule and hours
- Artists can accept or decline bookings without penalty
- Platform doesn't supervise or monitor artists during service delivery
- Platform doesn't provide training on how to perform creative services
- Artists work remotely or at client locations, not at platform-controlled facilities
- Contract explicitly states artist is independent contractor with control over methods

**Factors Suggesting Employee Status:**

- Platform dictates specific techniques or processes artists must use
- Platform requires artists to work specific hours or shifts
- Platform monitors artists during service delivery
- Platform provides detailed instructions on how to perform services
- Platform requires artists to attend training sessions
- Platform penalizes artists for declining bookings
- Platform controls where services are performed

**Solely Art Analysis:**

✅ **PASS** - Artists have full control over their creative process, schedule, and methods. The platform facilitates bookings but doesn't supervise service delivery.

#### Condition B: Outside Usual Course of Business

**The service must be performed outside the usual course of the hiring entity's business OR outside all of the hiring entity's places of business.**

**What This Means:**

This is the most challenging condition for marketplace platforms. The question is whether the artists' services are "outside the usual course" of your business.

**Two Interpretations:**

**Narrow Interpretation (Risky for Platforms):**
- Your business IS facilitating creative services
- Artists provide those creative services
- Therefore, artists are integral to your core business
- Condition B FAILS

**Broad Interpretation (Favorable for Platforms):**
- Your business is providing technology/software (the marketplace platform)
- Artists provide creative services (not technology)
- Artists' services are outside your core technology business
- Condition B PASSES

**North Carolina Case Law:**

NC courts have not extensively ruled on marketplace platforms under the ABC test, creating legal uncertainty. However, guidance from other states and federal cases suggests:

**Factors Supporting "Outside Usual Course":**
- Platform positions itself as a technology company, not a creative services company
- Platform doesn't employ any in-house artists providing services directly
- Platform's revenue comes from technology fees, not service delivery
- Platform serves multiple service categories (diversification suggests technology focus)
- Platform doesn't guarantee service quality or outcomes (artists are independent businesses)

**Factors Suggesting "Within Usual Course":**
- Platform markets itself as a creative services provider
- Platform's entire value proposition is facilitating creative services
- Platform has no other business activities besides connecting artists with clients
- Platform controls pricing, service descriptions, or quality standards
- Platform guarantees service delivery or outcomes to clients

**Solely Art Analysis:**

⚠️ **GRAY AREA** - This is the weakest condition for marketplace platforms. Your platform's entire purpose is facilitating creative services, which could be interpreted as your "usual course of business." However, you can strengthen your position by:

1. **Positioning as Technology Platform:** Emphasize in marketing, terms of service, and business descriptions that you provide marketplace technology, not creative services
2. **Diversification:** Expand to multiple creative categories (art, photography, music, design, writing) to demonstrate broad technology focus rather than narrow service focus
3. **Artist Autonomy:** Maximize artist control over pricing, service descriptions, and client interactions
4. **No Quality Guarantees:** Don't guarantee service outcomes or quality to clients; position artists as independent businesses responsible for their own work

#### Condition C: Customarily Engaged in Independent Trade

**The worker must be customarily engaged in an independently established trade, occupation, profession, or business of the same nature as the service performed.**

**What This Means:**

The worker must be a legitimate independent business, not someone who only works for your platform. They should have their own business identity, serve multiple clients, and operate independently.

**Factors Supporting Independent Contractor Status:**

- Artist has their own business name, website, and portfolio
- Artist advertises services independently (social media, website, word-of-mouth)
- Artist serves clients outside your platform
- Artist has business cards, logo, and professional branding
- Artist files Schedule C (business income) on tax returns
- Artist has business licenses or professional certifications (if required)
- Artist maintains their own tools, equipment, and supplies
- Artist has business bank account and accounting system
- Artist can hire assistants or subcontract work

**Factors Suggesting Employee Status:**

- Artist only works through your platform
- Artist has no independent business identity
- Artist doesn't advertise services elsewhere
- Artist has no other clients
- Artist doesn't file business tax returns
- Artist doesn't maintain business infrastructure

**Solely Art Analysis:**

✅ **PASS** - Most professional artists already operate as independent businesses with their own clients, portfolios, and business infrastructure. Your platform is an additional client acquisition channel, not their sole source of work.

**Strengthening This Factor:**

During artist onboarding, ask:
- Do you have your own website or portfolio?
- Do you advertise your services independently?
- Do you have clients outside this platform?
- Do you have a business name or brand?

Document affirmative answers to demonstrate artists are independently established businesses.

### Federal IRS Classification (Common Law Test)

While the ABC test applies to NC unemployment insurance, the IRS uses a different framework called the **Common Law Test** for federal tax purposes. This test examines the degree of control and independence across three categories:

#### Behavioral Control

**Does the company control or have the right to control what the worker does and how they do their job?**

**Employee Indicators:**
- Company provides training on required methods
- Company evaluates how work is performed, not just end results
- Company provides detailed instructions
- Company supervises work in progress

**Independent Contractor Indicators:**
- Worker uses their own methods and techniques
- Company evaluates only final results
- Worker receives minimal instruction
- Worker works independently without supervision

**Solely Art:** ✅ Artists control their own methods and work independently

#### Financial Control

**Does the company control the business aspects of the worker's job?**

**Employee Indicators:**
- Company provides tools, materials, and equipment
- Company reimburses expenses
- Worker has no opportunity for profit or loss
- Worker receives guaranteed regular wage
- Worker can't work for competitors

**Independent Contractor Indicators:**
- Worker provides their own tools and materials
- Worker bears their own expenses
- Worker can profit or lose based on their business decisions
- Worker sets their own rates
- Worker can work for multiple companies

**Solely Art:** ✅ Artists provide their own tools, set rates, and work for multiple clients

#### Relationship Type

**How do the parties perceive their relationship?**

**Employee Indicators:**
- Written contract states employee relationship
- Company provides benefits (health insurance, vacation, retirement)
- Relationship is ongoing and indefinite
- Services are key aspect of company's regular business

**Independent Contractor Indicators:**
- Written contract states independent contractor relationship
- No benefits provided
- Relationship is project-based or temporary
- Services are not central to company's business

**Solely Art:** ⚠️ Mixed - Contract states IC relationship and no benefits provided (good), but relationship is ongoing and services are central to platform (concerning)

### Independent Contractor Agreement

A well-drafted independent contractor agreement is your primary defense against misclassification claims. The agreement should clearly establish the IC relationship and document factors supporting that classification.

#### Essential Contract Provisions

**1. Independent Contractor Status**

Explicitly state the relationship:

> "Artist is an independent contractor, not an employee, agent, partner, or joint venturer of Platform. Nothing in this Agreement creates an employment relationship. Artist is solely responsible for all taxes, insurance, and benefits related to their services."

**2. Control and Autonomy**

Emphasize artist's control:

> "Artist retains sole control over the manner and means of performing services, including creative techniques, materials, schedule, and methods. Platform does not supervise, direct, or control Artist's work process. Artist determines when, where, and how to perform services."

**3. Right to Decline Work**

Confirm artist can refuse bookings:

> "Artist may accept or decline booking requests at their sole discretion without penalty, consequence, or obligation to provide explanation. Platform does not guarantee Artist any minimum number of bookings or income."

**4. Multiple Clients**

Acknowledge artist works for others:

> "Artist is free to provide services to other clients, work for competitors, and operate their own independent business. Artist is not required to work exclusively for Platform."

**5. Tools and Equipment**

Specify artist provides own materials:

> "Artist provides and maintains all tools, equipment, materials, and supplies necessary to perform services at Artist's own expense. Platform does not provide, reimburse, or control Artist's tools or materials."

**6. Tax Responsibility**

Clarify tax obligations:

> "Artist is solely responsible for all federal, state, and local taxes on income earned through Platform, including self-employment taxes. Platform will issue IRS Form 1099-K if Artist earns $600 or more annually. Artist acknowledges they are not entitled to tax withholding, unemployment insurance, workers' compensation, or other employee benefits."

**7. Business Operations**

Confirm artist operates a business:

> "Artist represents that they operate an independent business providing creative services, maintain their own business identity, advertise services independently, and serve clients outside Platform. Artist may hire assistants or subcontract work at their own expense and responsibility."

**8. No Benefits**

Disclaim employee benefits:

> "Artist is not entitled to any employee benefits including but not limited to health insurance, retirement plans, paid time off, sick leave, workers' compensation, unemployment insurance, or any other benefits provided to Platform employees."

**9. Termination**

Allow either party to terminate:

> "Either party may terminate this Agreement at any time with or without cause by providing 30 days written notice. Artist may stop accepting bookings immediately without notice or penalty."

**10. Indemnification**

Protect platform from artist's actions:

> "Artist indemnifies and holds harmless Platform from any claims, damages, or liabilities arising from Artist's services, including but not limited to professional negligence, property damage, personal injury, or breach of contract with clients."

#### Attorney Review

Have a North Carolina employment attorney review your independent contractor agreement before using it. Budget $1,500-3,000 for this review. The attorney will:

- Ensure compliance with NC and federal law
- Identify potential misclassification risks
- Suggest additional protective provisions
- Customize agreement for your specific business model

This upfront investment prevents $500,000+ in misclassification liability later.

### Operational Best Practices

Beyond the contract, your day-to-day operations should reinforce independent contractor status:

**Maximize Artist Autonomy:**
- Let artists set their own rates (or choose from rate ranges they define)
- Let artists write their own service descriptions and portfolio content
- Let artists set their own availability and schedule
- Don't penalize artists for declining bookings or being unavailable
- Don't require minimum acceptance rates or response times

**Minimize Platform Control:**
- Don't provide training on how to perform creative services (platform usage training is OK)
- Don't supervise artists during service delivery
- Don't evaluate artistic techniques or methods (only final results)
- Don't require artists to use specific materials or equipment
- Don't dictate where or when services are performed

**Emphasize Artist Independence:**
- Encourage artists to maintain their own websites and portfolios
- Allow artists to promote their independent business on their profile
- Don't require exclusivity or non-compete agreements
- Don't prohibit artists from working for competitors
- Refer to artists as "independent professionals" not "our artists"

**Platform Positioning:**
- Market platform as technology/software, not creative services
- Describe platform as "connecting clients with independent artists"
- Don't guarantee service quality or outcomes to clients
- Make clear artists are independent businesses, not platform employees
- Include disclaimer: "Artists are independent contractors responsible for their own services"

**Documentation:**
- Maintain signed independent contractor agreements for all artists
- Document that artists have their own businesses (website, portfolio, business name)
- Keep records showing artists work for multiple clients
- Document artist autonomy (they set rates, decline bookings, control methods)
- Maintain records for 7 years in case of audit

### Monitoring Regulatory Changes

Worker classification law is evolving rapidly. Stay informed about:

**Federal Developments:**
- DOL proposed rule changes to independent contractor classification
- IRS guidance updates
- Federal legislation (PRO Act would adopt ABC test nationally)

**North Carolina Developments:**
- NC Department of Commerce enforcement priorities
- NC court decisions on ABC test application to platforms
- NC legislative changes to worker classification law

**Recommendation:** Join a marketplace platform trade association like the **Marketplace Platform Policy Coalition** or **Internet Association** to receive updates on regulatory changes affecting your industry. Budget $1,000-5,000 annually for membership.

---

*[Document continues with remaining sections: 1099-K Tax Reporting, Insurance Requirements, Data Privacy, Implementation Timeline, Financial Projections, Compliance Calendar, and Resources]*

*Due to length constraints, I'll create a second file for the remaining sections...*
