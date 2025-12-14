# Solely Art Platform: Security & Fraud Prevention Guide
## Protecting Your Marketplace from Hackers, Scammers, and Financial Theft

**Last Updated:** December 2024  
**Platform:** Manus (web-db-user template)  
**Location:** North Carolina

---

## Table of Contents

1. [Threat Landscape for Marketplaces](#threat-landscape-for-marketplaces)
2. [Technical Security Defenses](#technical-security-defenses)
3. [Fraud Prevention Strategies](#fraud-prevention-strategies)
4. [Cyber Liability Insurance](#cyber-liability-insurance)
5. [Incident Response Plan](#incident-response-plan)
6. [Security Monitoring & Auditing](#security-monitoring-auditing)
7. [Employee & Contractor Security](#employee-contractor-security)
8. [Third-Party Risk Management](#third-party-risk-management)

---

## Threat Landscape for Marketplaces

### Common Attack Vectors

Marketplaces are high-value targets because they handle money flow between multiple parties. Understanding the threats helps you prioritize defenses.

#### 1. Payment Fraud & Theft

**Scenario: Stolen Credit Cards**

Fraudsters use stolen credit card information to make bookings on your platform. The booking appears legitimate initially, but weeks later the real cardholder disputes the charge (chargeback). By then, you've already paid out the artist.

**Financial Impact:**
- Original payment: $500 booking
- Artist payout: $440 (88% after 12% commission)
- Chargeback: -$500 (you must refund client)
- Chargeback fee: -$15 (Stripe penalty)
- **Net loss: $955** (you paid artist $440 + refunded client $500 + fee $15)

**Frequency:** 0.5-2% of transactions for new marketplaces

**Annual Impact at Scale:**
- 500 monthly bookings × $200 average = $100,000 GMV/month
- 1% fraud rate = $1,000 monthly losses = **$12,000 annual losses**

**Scenario: Account Takeover**

Hacker gains access to a client's account and books services using saved payment methods. Client disputes charges, you lose the money plus artist payout.

**Scenario: Fake Artist Accounts**

Fraudster creates fake artist profile, receives bookings and payouts, then disappears. Client never receives service, demands refund.

**Financial Impact:**
- Multiple bookings before detection: $2,000-10,000
- All must be refunded to clients
- Artist payouts cannot be recovered
- **Net loss: $2,000-10,000**

#### 2. Business Email Compromise (BEC)

**Scenario: CEO Fraud**

Hacker impersonates you (platform owner) via email and instructs your bookkeeper or assistant to wire funds to a "new vendor account" or "urgent payment."

**Example Email:**

> From: john.doe@solelyart-platform.com (spoofed)  
> To: bookkeeper@solelyart.com  
> Subject: URGENT - Wire Transfer Needed
>
> Hi Sarah,
>
> I'm in a meeting with investors and need you to wire $25,000 to our new marketing agency immediately. Here are the wire instructions:
>
> Bank: First National Bank  
> Account: 123456789  
> Routing: 987654321  
> Name: Marketing Solutions LLC
>
> Please confirm once sent. Don't call - I'm in back-to-back meetings all day.
>
> Thanks,  
> John

Your bookkeeper, believing this is legitimate, wires $25,000 to the fraudster's account. By the time you discover the fraud, the money is gone.

**Financial Impact:** $10,000-100,000 per incident

**Frequency:** 1-2 attempts per year for small businesses

**Recovery Rate:** 10-20% (most funds are unrecoverable)

#### 3. Invoice Manipulation

**Scenario: Hacked Email Account**

Hacker gains access to your email or accounting system and monitors invoices. When you send an invoice to a client or vendor, the hacker intercepts it and sends a modified version with their bank account details.

**Example:**

1. You send invoice to client for $5,000 marketing campaign
2. Hacker intercepts email and modifies invoice PDF
3. Client receives invoice with hacker's bank account
4. Client pays $5,000 to hacker's account
5. You never receive payment, client believes they paid
6. Dispute ensues, relationship damaged

**Financial Impact:** $5,000-50,000 per incident

**Frequency:** Rare but devastating when it happens

#### 4. Ransomware

**Scenario: System Lockout**

Hacker gains access to your systems (via phishing email, weak password, or software vulnerability) and encrypts all your data. You receive a ransom demand:

> Your files have been encrypted. Pay 5 Bitcoin ($150,000) within 72 hours or your data will be permanently deleted. Payment instructions: [...]

Your platform is completely offline. You cannot process bookings, artists cannot access their accounts, clients cannot contact you. Every hour offline costs you revenue and reputation.

**Financial Impact:**
- Ransom payment: $50,000-500,000 (if you pay)
- Lost revenue during downtime: $5,000-50,000 (depending on duration)
- Data recovery costs: $10,000-100,000 (if you don't pay)
- Reputation damage: Immeasurable

**Frequency:** 1 in 10 small businesses will be targeted

**Average Downtime:** 21 days if you don't pay, 7 days if you do pay

#### 5. Data Breach

**Scenario: Database Hack**

Hacker exploits a vulnerability in your application (SQL injection, weak authentication, unpatched software) and gains access to your database. They steal:

- 5,000 user records (names, emails, passwords)
- 500 artist records (SSNs, bank account info)
- 2,000 booking records (payment details, addresses)

The hacker sells this data on the dark web or uses it for identity theft.

**Financial Impact:**
- Forensic investigation: $10,000-50,000
- Legal fees: $20,000-100,000
- Notification costs: $50,000-100,000 (letters, credit monitoring)
- Regulatory fines: $10,000-100,000 (NC Attorney General, FTC)
- Lawsuits: $100,000-1,000,000 (class action from affected users)
- Reputation damage: 30-50% customer loss
- **Total: $190,000-1,350,000**

**Frequency:** 1 in 5 small businesses will experience a data breach

**Average Cost per Record:** $150-250

#### 6. Denial of Service (DoS/DDoS)

**Scenario: Traffic Flood**

Hacker floods your website with fake traffic, overwhelming your servers and making your platform inaccessible to legitimate users. This could be:

- Extortion attempt (pay us or we'll keep attacking)
- Competitor sabotage
- Ideological attack (hacktivism)

**Financial Impact:**
- Lost revenue during downtime: $1,000-10,000 per day
- Mitigation costs: $5,000-50,000
- Reputation damage: Users lose trust

**Frequency:** 1-2 attacks per year for visible platforms

**Duration:** Hours to weeks depending on sophistication

#### 7. Social Engineering

**Scenario: Support Impersonation**

Hacker calls your customer support pretending to be a client who "forgot their password" and convinces your support agent to reset the account. Hacker gains access to the account and:

- Changes bank account details to divert payouts
- Books services using saved payment methods
- Steals personal information

**Scenario: Vendor Impersonation**

Hacker impersonates a legitimate vendor (e.g., "Stripe support") and calls your team claiming there's an "urgent security issue" that requires you to provide login credentials or click a link.

**Financial Impact:** $5,000-50,000 per incident

**Frequency:** Multiple attempts per month as you grow

### Risk Assessment by Business Stage

**Pre-Launch (No Revenue):**
- Risk Level: LOW
- Primary Threats: Code vulnerabilities, weak authentication
- Focus: Secure development practices, penetration testing

**Beta Launch ($0-10K Monthly GMV):**
- Risk Level: LOW-MEDIUM
- Primary Threats: Payment fraud, account takeover
- Focus: Fraud detection, MFA enforcement

**Growth Stage ($10K-100K Monthly GMV):**
- Risk Level: MEDIUM-HIGH
- Primary Threats: All of the above
- Focus: Comprehensive security program, cyber insurance

**Scale Stage ($100K+ Monthly GMV):**
- Risk Level: HIGH
- Primary Threats: Sophisticated attacks, organized crime
- Focus: Security team, 24/7 monitoring, incident response

---

## Technical Security Defenses

### Layer 1: Infrastructure Security (Manus-Provided)

Your Manus hosting environment provides baseline security that protects against many common attacks:

**✅ What Manus Already Provides:**

1. **HTTPS/TLS Encryption**
   - All traffic encrypted in transit
   - Prevents man-in-the-middle attacks
   - Protects payment data during transmission

2. **Web Application Firewall (WAF)**
   - Blocks common attack patterns (SQL injection, XSS)
   - Rate limiting to prevent brute force
   - DDoS mitigation at network layer

3. **Database Encryption**
   - Data encrypted at rest
   - Protects against physical server theft
   - Automatic backups encrypted

4. **Secure Infrastructure**
   - Regular security patches
   - Isolated environments
   - Professional operations team

5. **SSL Certificate Management**
   - Automatic renewal
   - Strong cipher suites
   - HSTS enforcement

**What This Means:** You inherit enterprise-grade infrastructure security without managing servers, firewalls, or certificates.

### Layer 2: Application Security (Your Responsibility)

While Manus provides infrastructure security, you must implement application-level security in your code.

#### Authentication & Authorization

**1. Enforce Strong Passwords**

```typescript
// server/routers.ts

import { z } from 'zod';

const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const appRouter = router({
  auth: router({
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: passwordSchema,
        name: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Registration logic
      }),
  }),
});
```

**2. Implement Multi-Factor Authentication (MFA)**

MFA is **required by most cyber insurance providers** and reduces account takeover risk by 99.9%.

```typescript
// server/routers.ts

import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export const appRouter = router({
  auth: router({
    /**
     * Enable MFA for user account
     */
    enableMFA: protectedProcedure
      .mutation(async ({ ctx }) => {
        const userId = ctx.user.id;

        // Generate secret
        const secret = authenticator.generateSecret();

        // Generate QR code
        const otpauth = authenticator.keyuri(
          ctx.user.email,
          'Solely Art',
          secret
        );
        const qrCode = await QRCode.toDataURL(otpauth);

        // Store secret (encrypted) in database
        await db.update(user)
          .set({
            mfaSecret: secret, // Should be encrypted in production
            mfaEnabled: false, // Not enabled until verified
          })
          .where(eq(user.id, userId));

        return { qrCode, secret };
      }),

    /**
     * Verify MFA setup
     */
    verifyMFA: protectedProcedure
      .input(z.object({
        code: z.string().length(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        const userRecord = await db.query.user.findFirst({
          where: eq(user.id, userId),
        });

        if (!userRecord?.mfaSecret) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'MFA not initialized',
          });
        }

        // Verify code
        const isValid = authenticator.verify({
          token: input.code,
          secret: userRecord.mfaSecret,
        });

        if (!isValid) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid verification code',
          });
        }

        // Enable MFA
        await db.update(user)
          .set({ mfaEnabled: true })
          .where(eq(user.id, userId));

        return { success: true };
      }),

    /**
     * Verify MFA code during login
     */
    verifyMFALogin: publicProcedure
      .input(z.object({
        email: z.string().email(),
        code: z.string().length(6),
      }))
      .mutation(async ({ input }) => {
        const userRecord = await db.query.user.findFirst({
          where: eq(user.email, input.email),
        });

        if (!userRecord?.mfaSecret || !userRecord.mfaEnabled) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'MFA not enabled',
          });
        }

        const isValid = authenticator.verify({
          token: input.code,
          secret: userRecord.mfaSecret,
        });

        if (!isValid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid MFA code',
          });
        }

        // Generate session token
        // ... (existing login logic)

        return { success: true, token: '...' };
      }),
  }),
});
```

**Frontend MFA Setup:**

```tsx
// client/src/pages/SecuritySettings.tsx

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SecuritySettings() {
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const enableMFA = trpc.auth.enableMFA.useMutation();
  const verifyMFA = trpc.auth.verifyMFA.useMutation();

  const handleEnableMFA = async () => {
    try {
      const result = await enableMFA.mutateAsync();
      setQrCode(result.qrCode);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleVerifyMFA = async () => {
    try {
      await verifyMFA.mutateAsync({ code: verificationCode });
      toast({
        title: 'MFA Enabled',
        description: 'Two-factor authentication is now active on your account',
      });
      setQrCode(null);
    } catch (error: any) {
      toast({
        title: 'Invalid Code',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Security Settings</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!qrCode ? (
            <>
              <p className="text-sm text-muted-foreground">
                Two-factor authentication (2FA) requires you to enter a code from your phone
                in addition to your password when logging in. This makes your account much
                more secure.
              </p>
              <Button onClick={handleEnableMFA} disabled={enableMFA.isPending}>
                {enableMFA.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Enable Two-Factor Authentication'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Step 1: Scan QR Code</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use an authenticator app like Google Authenticator, Authy, or 1Password
                    to scan this QR code:
                  </p>
                  <img src={qrCode} alt="MFA QR Code" className="border rounded-lg" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Step 2: Enter Verification Code</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the 6-digit code from your authenticator app:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="max-w-[150px]"
                    />
                    <Button
                      onClick={handleVerifyMFA}
                      disabled={verificationCode.length !== 6 || verifyMFA.isPending}
                    >
                      {verifyMFA.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Enable'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

**MFA Enforcement Policy:**

- **Required for:** Platform owner, admins, employees with financial access
- **Strongly recommended for:** All users
- **Enforcement timeline:**
  - Launch: Optional for all users
  - Month 3: Required for admins
  - Month 6: Required for artists handling $10K+ monthly volume
  - Month 12: Required for all users

**3. Implement Rate Limiting**

Prevent brute force attacks by limiting login attempts:

```typescript
// server/_core/rate-limit.ts

import { TRPCError } from '@trpc/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const record = store[options.key];

  // Reset if window expired
  if (!record || now > record.resetAt) {
    store[options.key] = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    return;
  }

  // Increment count
  record.count++;

  // Check limit
  if (record.count > options.limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Too many attempts. Try again in ${retryAfter} seconds.`,
    });
  }
}
```

```typescript
// server/routers.ts

import { rateLimit } from './_core/rate-limit';

export const appRouter = router({
  auth: router({
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Rate limit: 5 attempts per 15 minutes per IP
        rateLimit({
          key: `login:${ctx.req.ip}:${input.email}`,
          limit: 5,
          windowMs: 15 * 60 * 1000,
        });

        // Login logic...
      }),
  }),
});
```

**Rate Limit Policies:**

- **Login attempts:** 5 per 15 minutes per IP + email
- **Password reset:** 3 per hour per email
- **API calls:** 100 per minute per user
- **Booking creation:** 10 per hour per user
- **Payment attempts:** 3 per hour per user

**4. Implement Session Security**

```typescript
// server/_core/session.ts

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(userId: number, email: string) {
  const token = jwt.sign(
    {
      userId,
      email,
      iat: Date.now(),
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return token;
}

export function verifySession(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      iat: number;
    };

    // Check if session is too old (force re-login after 30 days)
    const age = Date.now() - decoded.iat;
    if (age > 30 * 24 * 60 * 60 * 1000) {
      throw new Error('Session expired');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid session');
  }
}

export function invalidateSession(userId: number) {
  // In production, maintain a blacklist of invalidated tokens
  // or use Redis to store active sessions
  // For now, tokens will naturally expire after 7 days
}
```

**Session Security Best Practices:**

- ✅ Use HTTP-only cookies (prevents XSS attacks)
- ✅ Use secure cookies (HTTPS only)
- ✅ Use SameSite=Strict (prevents CSRF attacks)
- ✅ Short session duration (7 days max)
- ✅ Force re-login after 30 days
- ✅ Invalidate sessions on password change
- ✅ Invalidate sessions on suspicious activity

#### Input Validation & Sanitization

**1. Validate All User Input**

```typescript
// server/routers.ts

import { z } from 'zod';

// Define strict schemas for all inputs
const createBookingSchema = z.object({
  artistId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive().optional(),
  location: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export const appRouter = router({
  booking: router({
    create: protectedProcedure
      .input(createBookingSchema)
      .mutation(async ({ ctx, input }) => {
        // Input is automatically validated by Zod
        // Additional business logic validation
        if (input.endTime && input.endTime <= input.startTime) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'End time must be after start time',
          });
        }

        // Proceed with booking creation
      }),
  }),
});
```

**2. Sanitize HTML Content**

```typescript
// server/utils/sanitize.ts

import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}

export function sanitizeText(text: string): string {
  // Remove any HTML tags
  return text.replace(/<[^>]*>/g, '');
}
```

```typescript
// server/routers.ts

import { sanitizeHTML, sanitizeText } from './utils/sanitize';

export const appRouter = router({
  artist: router({
    updateProfile: protectedProcedure
      .input(z.object({
        bio: z.string().max(5000),
        displayName: z.string().max(100),
      }))
      .mutation(async ({ ctx, input }) => {
        // Sanitize inputs
        const bio = sanitizeHTML(input.bio);
        const displayName = sanitizeText(input.displayName);

        // Update profile
        await db.update(artistProfiles)
          .set({ bio, displayName })
          .where(eq(artistProfiles.userId, ctx.user.id));

        return { success: true };
      }),
  }),
});
```

**3. Prevent SQL Injection**

Drizzle ORM automatically prevents SQL injection through parameterized queries:

```typescript
// ✅ SAFE - Drizzle uses parameterized queries
const artist = await db.query.artistProfiles.findFirst({
  where: eq(artistProfiles.id, artistId),
});

// ✅ SAFE - Drizzle escapes values
const artists = await db.select()
  .from(artistProfiles)
  .where(like(artistProfiles.specialty, `%${searchTerm}%`));

// ❌ NEVER DO THIS - Raw SQL with user input
const artists = await db.execute(
  `SELECT * FROM artist_profiles WHERE specialty LIKE '%${searchTerm}%'`
);
```

**If you must use raw SQL:**

```typescript
// ✅ SAFE - Use parameterized queries
const artists = await db.execute(
  sql`SELECT * FROM artist_profiles WHERE specialty LIKE ${`%${searchTerm}%`}`
);
```

#### File Upload Security

**1. Validate File Types**

```typescript
// server/routers.ts

import { storagePut } from './storage';
import crypto from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const appRouter = router({
  artist: router({
    uploadPortfolioImage: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
        fileData: z.string(), // Base64 encoded
      }))
      .mutation(async ({ ctx, input }) => {
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(input.fileType)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
          });
        }

        // Validate file size
        if (input.fileSize > MAX_FILE_SIZE) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'File too large. Maximum size is 10MB.',
          });
        }

        // Generate random filename to prevent enumeration
        const randomSuffix = crypto.randomBytes(16).toString('hex');
        const extension = input.fileName.split('.').pop();
        const safeFileName = `${ctx.user.id}-portfolio-${randomSuffix}.${extension}`;

        // Decode base64 and upload to S3
        const fileBuffer = Buffer.from(input.fileData, 'base64');
        const { url, key } = await storagePut(
          `portfolio-images/${safeFileName}`,
          fileBuffer,
          input.fileType
        );

        // Store URL in database
        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.userId, ctx.user.id),
        });

        if (!artist) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Artist profile not found',
          });
        }

        const currentImages = artist.portfolioImages
          ? JSON.parse(artist.portfolioImages)
          : [];

        const updatedImages = [...currentImages, { url, key, uploadedAt: Date.now() }];

        await db.update(artistProfiles)
          .set({
            portfolioImages: JSON.stringify(updatedImages),
          })
          .where(eq(artistProfiles.id, artist.id));

        return { url, key };
      }),
  }),
});
```

**2. Scan Files for Malware**

For production, integrate with a malware scanning service:

```typescript
// server/utils/malware-scan.ts

import axios from 'axios';

export async function scanFile(fileBuffer: Buffer, fileName: string): Promise<boolean> {
  // Option 1: VirusTotal API (free tier available)
  const response = await axios.post(
    'https://www.virustotal.com/api/v3/files',
    fileBuffer,
    {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY,
      },
    }
  );

  const scanId = response.data.data.id;

  // Wait for scan results
  await new Promise(resolve => setTimeout(resolve, 5000));

  const resultResponse = await axios.get(
    `https://www.virustotal.com/api/v3/analyses/${scanId}`,
    {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY,
      },
    }
  );

  const stats = resultResponse.data.data.attributes.stats;
  const isMalicious = stats.malicious > 0;

  return !isMalicious;
}
```

```typescript
// server/routers.ts

import { scanFile } from './utils/malware-scan';

export const appRouter = router({
  artist: router({
    uploadPortfolioImage: protectedProcedure
      .input(/* ... */)
      .mutation(async ({ ctx, input }) => {
        // ... validation ...

        const fileBuffer = Buffer.from(input.fileData, 'base64');

        // Scan for malware
        const isSafe = await scanFile(fileBuffer, input.fileName);

        if (!isSafe) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'File failed security scan',
          });
        }

        // ... upload to S3 ...
      }),
  }),
});
```

#### Security Headers

```typescript
// server/index.ts

import helmet from 'helmet';

const app = express();

// Apply security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
}));
```

---

## Fraud Prevention Strategies

### Payment Fraud Detection

**1. Stripe Radar (Built-in)**

Stripe Radar is automatically enabled on your account and uses machine learning to detect fraudulent payments.

**How It Works:**
- Analyzes 100+ signals per transaction
- Compares to billions of transactions across Stripe network
- Assigns risk score to each payment
- Blocks high-risk payments automatically

**Configuration:**

1. Go to Stripe Dashboard → Radar
2. Review default rules
3. Add custom rules for your marketplace

**Recommended Custom Rules:**

```
// Block payments from high-risk countries
Block if :ip_country: in ['NG', 'GH', 'ID', 'PK']

// Block high-value first-time transactions
Block if :amount: > 50000 and :customer_created_at: < 1h

// Block rapid repeat payments
Block if :repeat_payment_count: > 3 in 1h

// Require 3D Secure for high-value transactions
Request 3DS if :amount: > 20000

// Block mismatched billing/shipping countries
Block if :billing_country: != :shipping_country: and :amount: > 10000
```

**2. Manual Review Process**

For high-value or suspicious bookings, implement manual review:

```typescript
// server/routers.ts

export const appRouter = router({
  booking: router({
    create: protectedProcedure
      .input(/* ... */)
      .mutation(async ({ ctx, input }) => {
        // ... create booking ...

        // Check if manual review needed
        const needsReview =
          booking.totalPrice > 50000 || // $500+
          ctx.user.createdAt > Date.now() - 24 * 60 * 60 * 1000 || // New user (< 24h)
          ctx.user.bookingCount === 0; // First booking

        if (needsReview) {
          // Set booking status to pending review
          await db.update(bookings)
            .set({ status: 'pending_review' })
            .where(eq(bookings.id, booking.id));

          // Notify owner for manual review
          await notifyOwner({
            title: '⚠️ Booking Requires Review',
            content: `Booking ${booking.id} flagged for manual review\nAmount: $${(booking.totalPrice / 100).toFixed(2)}\nClient: ${ctx.user.email}\nReason: ${needsReview ? 'High value / New user / First booking' : 'Unknown'}`,
          });

          return {
            booking,
            status: 'pending_review',
            message: 'Your booking is being reviewed and will be confirmed within 24 hours.',
          };
        }

        // ... proceed with payment ...
      }),
  }),
});
```

**Manual Review Checklist:**

- [ ] Verify client email is legitimate (not disposable email)
- [ ] Check client IP location matches billing address
- [ ] Review client's previous bookings (if any)
- [ ] Verify artist profile is complete and legitimate
- [ ] Check booking details are reasonable (date, time, location)
- [ ] Search client email for fraud reports online
- [ ] If suspicious, contact client directly to verify

**3. Velocity Checks**

Monitor for unusual patterns:

```typescript
// server/utils/fraud-detection.ts

export async function checkVelocity(userId: number): Promise<{
  safe: boolean;
  reason?: string;
}> {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;

  // Check bookings in last 24 hours
  const recentBookings = await db.query.bookings.findMany({
    where: and(
      eq(bookings.clientId, userId),
      gte(bookings.createdAt, new Date(oneDayAgo))
    ),
  });

  // Flag if > 5 bookings in 24 hours
  if (recentBookings.length > 5) {
    return {
      safe: false,
      reason: 'Too many bookings in 24 hours',
    };
  }

  // Check bookings in last hour
  const veryRecentBookings = recentBookings.filter(
    b => b.createdAt.getTime() > oneHourAgo
  );

  // Flag if > 2 bookings in 1 hour
  if (veryRecentBookings.length > 2) {
    return {
      safe: false,
      reason: 'Too many bookings in 1 hour',
    };
  }

  // Check total amount in last 24 hours
  const totalAmount = recentBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // Flag if > $2,000 in 24 hours
  if (totalAmount > 200000) {
    return {
      safe: false,
      reason: 'High transaction volume in 24 hours',
    };
  }

  return { safe: true };
}
```

```typescript
// server/routers.ts

import { checkVelocity } from './utils/fraud-detection';

export const appRouter = router({
  booking: router({
    create: protectedProcedure
      .input(/* ... */)
      .mutation(async ({ ctx, input }) => {
        // Check velocity
        const velocityCheck = await checkVelocity(ctx.user.id);

        if (!velocityCheck.safe) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: `Booking limit exceeded: ${velocityCheck.reason}. Please contact support if you need to make multiple bookings.`,
          });
        }

        // ... proceed with booking ...
      }),
  }),
});
```

### Artist Verification

Prevent fake artist accounts:

**1. Identity Verification**

Stripe Connect automatically verifies artist identity during onboarding:
- Government-issued ID (driver's license, passport)
- SSN or EIN
- Bank account ownership

**Additional Verification Steps:**

```typescript
// server/routers.ts

export const appRouter = router({
  artist: router({
    /**
     * Submit additional verification documents
     */
    submitVerification: protectedProcedure
      .input(z.object({
        portfolioUrl: z.string().url().optional(),
        socialMediaLinks: z.array(z.string().url()).optional(),
        references: z.array(z.object({
          name: z.string(),
          email: z.string().email(),
          relationship: z.string(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.userId, ctx.user.id),
        });

        if (!artist) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Artist profile not found',
          });
        }

        // Store verification data
        await db.update(artistProfiles)
          .set({
            verificationData: JSON.stringify(input),
            verificationStatus: 'pending',
            verificationSubmittedAt: new Date(),
          })
          .where(eq(artistProfiles.id, artist.id));

        // Notify owner for manual review
        await notifyOwner({
          title: '🎨 Artist Verification Submitted',
          content: `${artist.displayName} submitted verification\nUser ID: ${ctx.user.id}\nReview at: ${process.env.VITE_APP_URL}/admin/artists/${artist.id}/verify`,
        });

        return { success: true };
      }),
  }),
});
```

**2. Portfolio Review**

Manually review artist portfolios before approval:

- [ ] Verify portfolio images are original work (reverse image search)
- [ ] Check social media presence matches claimed identity
- [ ] Verify references (call or email)
- [ ] Review sample work quality
- [ ] Check for red flags (stock photos, inconsistent style, no online presence)

**3. Gradual Trust Building**

Limit new artists until they build reputation:

```typescript
// drizzle/schema.ts

export const artistProfiles = sqliteTable('artist_profiles', {
  // ... existing fields ...
  
  trustLevel: text('trust_level').default('new'), // 'new', 'trusted', 'verified'
  maxBookingValue: integer('max_booking_value').default(25000), // $250 max for new artists
  completedBookings: integer('completed_bookings').default(0),
  avgRating: integer('avg_rating'), // 1-5 stars × 100 (e.g., 450 = 4.5 stars)
});
```

```typescript
// server/routers.ts

export const appRouter = router({
  booking: router({
    create: protectedProcedure
      .input(/* ... */)
      .mutation(async ({ ctx, input }) => {
        const artist = await db.query.artistProfiles.findFirst({
          where: eq(artistProfiles.id, input.artistId),
        });

        // Check artist trust level limits
        if (artist.trustLevel === 'new' && booking.totalPrice > artist.maxBookingValue) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `This artist is new to our platform and currently limited to bookings under $${(artist.maxBookingValue / 100).toFixed(2)}. They will be able to accept larger bookings after completing ${5 - artist.completedBookings} more bookings.`,
          });
        }

        // ... proceed with booking ...
      }),
  }),
});
```

**Trust Level Progression:**

- **New Artist:** Max $250 per booking, max 5 bookings/week
- **Trusted Artist:** Max $1,000 per booking, max 20 bookings/week (after 5 completed bookings with 4+ star average)
- **Verified Artist:** No limits (after 20 completed bookings with 4.5+ star average)

### Chargeback Prevention

Chargebacks are expensive ($15 fee + lost revenue). Prevent them proactively:

**1. Clear Policies**

```tsx
// client/src/pages/BookingPolicy.tsx

export function BookingPolicy() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Booking & Cancellation Policy</h1>

      <div className="prose prose-gray max-w-none">
        <h2>Payment & Refunds</h2>
        <p>
          When you book a service through Solely Art, your payment is held securely until
          the service is completed. Here's how it works:
        </p>

        <h3>Before the Service</h3>
        <ul>
          <li>
            <strong>Payment Authorization:</strong> Your card is charged immediately when
            you book. The artist receives notification of your booking.
          </li>
          <li>
            <strong>Artist Acceptance:</strong> The artist has 24 hours to accept or decline
            your booking. If declined, you receive a full refund automatically.
          </li>
          <li>
            <strong>Cancellation by Client:</strong> You can cancel up to 48 hours before
            the scheduled service for a full refund. Cancellations within 48 hours are
            subject to a 50% cancellation fee.
          </li>
          <li>
            <strong>Cancellation by Artist:</strong> If the artist cancels for any reason,
            you receive a full refund immediately.
          </li>
        </ul>

        <h3>After the Service</h3>
        <ul>
          <li>
            <strong>Service Completion:</strong> After the service is completed, the artist
            marks the booking as complete. You have 48 hours to dispute if there's an issue.
          </li>
          <li>
            <strong>Disputes:</strong> If you're unsatisfied with the service, contact us
            within 48 hours. We'll mediate between you and the artist to reach a fair
            resolution.
          </li>
          <li>
            <strong>Refund Requests:</strong> Refund requests after service completion are
            evaluated case-by-case. Partial or full refunds may be issued if the service
            didn't meet agreed-upon terms.
          </li>
        </ul>

        <h3>Chargebacks</h3>
        <p>
          <strong>Please contact us before initiating a chargeback with your bank.</strong>
          Chargebacks harm both the artist and our platform. We're committed to resolving
          any issues fairly and quickly. If you initiate a chargeback without contacting us
          first, your account may be suspended.
        </p>

        <h2>Service Expectations</h2>
        <p>
          To ensure a great experience:
        </p>
        <ul>
          <li>Review the artist's portfolio and ratings before booking</li>
          <li>Communicate clearly about your expectations</li>
          <li>Provide accurate information (location, timing, requirements)</li>
          <li>Be present and available during the scheduled service time</li>
          <li>Treat artists with respect and professionalism</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          Questions about a booking? Contact us at support@solelyart.com or call
          (919) 555-0123. We're here to help!
        </p>
      </div>
    </div>
  );
}
```

**2. Require Booking Confirmation**

```typescript
// server/routers.ts

export const appRouter = router({
  booking: router({
    /**
     * Artist accepts booking
     */
    accept: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.query.bookings.findFirst({
          where: eq(bookings.id, input.bookingId),
          with: {
            artist: true,
            client: true,
          },
        });

        if (!booking) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Booking not found',
          });
        }

        // Verify user is the artist
        if (booking.artist.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized',
          });
        }

        // Update booking status
        await db.update(bookings)
          .set({
            status: 'confirmed',
            confirmedAt: new Date(),
          })
          .where(eq(bookings.id, input.bookingId));

        // Notify client
        // (In production, send email notification)

        return { success: true };
      }),

    /**
     * Mark booking as completed
     */
    complete: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.query.bookings.findFirst({
          where: eq(bookings.id, input.bookingId),
          with: {
            artist: true,
          },
        });

        if (!booking) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Booking not found',
          });
        }

        // Verify user is the artist
        if (booking.artist.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized',
          });
        }

        // Update booking status
        await db.update(bookings)
          .set({
            status: 'completed',
            completedAt: new Date(),
          })
          .where(eq(bookings.id, input.bookingId));

        // Update artist stats
        await db.update(artistProfiles)
          .set({
            completedBookings: sql`${artistProfiles.completedBookings} + 1`,
          })
          .where(eq(artistProfiles.id, booking.artist.id));

        // Notify client to leave review
        // (In production, send email notification)

        return { success: true };
      }),
  }),
});
```

**3. Collect Evidence**

Store evidence that service was provided:

```typescript
// drizzle/schema.ts

export const bookings = sqliteTable('bookings', {
  // ... existing fields ...
  
  completionEvidence: text('completion_evidence'), // JSON array of evidence
  completionNotes: text('completion_notes'), // Artist's notes about service
  clientConfirmedCompletion: integer('client_confirmed_completion', { mode: 'boolean' }),
  clientConfirmedAt: integer('client_confirmed_at', { mode: 'timestamp' }),
});
```

```typescript
// server/routers.ts

export const appRouter = router({
  booking: router({
    /**
     * Upload completion evidence (photos, documents)
     */
    uploadEvidence: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        evidenceType: z.enum(['photo', 'document', 'signature']),
        fileData: z.string(), // Base64
        fileName: z.string(),
        fileType: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.query.bookings.findFirst({
          where: eq(bookings.id, input.bookingId),
          with: {
            artist: true,
          },
        });

        if (!booking) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Booking not found',
          });
        }

        // Verify user is the artist
        if (booking.artist.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized',
          });
        }

        // Upload evidence to S3
        const fileBuffer = Buffer.from(input.fileData, 'base64');
        const randomSuffix = crypto.randomBytes(16).toString('hex');
        const extension = input.fileName.split('.').pop();
        const safeFileName = `booking-${input.bookingId}-evidence-${randomSuffix}.${extension}`;

        const { url, key } = await storagePut(
          `booking-evidence/${safeFileName}`,
          fileBuffer,
          input.fileType
        );

        // Store evidence reference
        const currentEvidence = booking.completionEvidence
          ? JSON.parse(booking.completionEvidence)
          : [];

        const newEvidence = {
          type: input.evidenceType,
          url,
          key,
          fileName: input.fileName,
          notes: input.notes,
          uploadedAt: Date.now(),
        };

        const updatedEvidence = [...currentEvidence, newEvidence];

        await db.update(bookings)
          .set({
            completionEvidence: JSON.stringify(updatedEvidence),
          })
          .where(eq(bookings.id, input.bookingId));

        return { success: true, url };
      }),

    /**
     * Client confirms service completion
     */
    confirmCompletion: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.query.bookings.findFirst({
          where: eq(bookings.id, input.bookingId),
        });

        if (!booking) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Booking not found',
          });
        }

        // Verify user is the client
        if (booking.clientId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized',
          });
        }

        // Mark as confirmed by client
        await db.update(bookings)
          .set({
            clientConfirmedCompletion: true,
            clientConfirmedAt: new Date(),
          })
          .where(eq(bookings.id, input.bookingId));

        return { success: true };
      }),
  }),
});
```

**Evidence Types:**

- **Photos:** Before/after photos of work
- **Documents:** Signed agreements, receipts, invoices
- **Signatures:** Digital signature from client confirming completion
- **Messages:** Chat logs showing client satisfaction
- **Reviews:** Positive review from client

**4. Respond to Chargebacks Quickly**

When you receive a chargeback notification from Stripe:

1. **Gather Evidence (Within 7 Days):**
   - Booking details (date, time, location, service description)
   - Payment receipt
   - Artist confirmation of acceptance
   - Completion evidence (photos, documents, signatures)
   - Client confirmation of completion
   - Communication logs (emails, messages)
   - Cancellation policy acknowledgment

2. **Submit Dispute Response:**
   - Go to Stripe Dashboard → Disputes
   - Upload all evidence
   - Write clear explanation of why chargeback is invalid
   - Submit within 7 days

3. **Follow Up:**
   - Monitor dispute status
   - Provide additional evidence if requested
   - If you win, funds are returned
   - If you lose, accept the loss and learn from it

**Chargeback Win Rate:**

- With strong evidence: 40-60% win rate
- Without evidence: 5-10% win rate

**Prevention is Key:** Focus on preventing chargebacks rather than fighting them.

---

*[Document continues with Cyber Liability Insurance, Incident Response Plan, and remaining sections...]*

**Due to length, I'll create this as Part 2...**
