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
# Security & Fraud Prevention Guide Part 2
## Cyber Insurance, Incident Response, and Monitoring

---

## Cyber Liability Insurance

### Why You Need Cyber Insurance

**Reality Check:** Even with perfect security, you can still be hacked. Cyber insurance is your financial safety net.

**Cost of a Data Breach (Without Insurance):**

| Expense Category | Cost Range |
|-----------------|------------|
| Forensic investigation | $10,000 - $50,000 |
| Legal fees | $20,000 - $100,000 |
| Notification costs | $50,000 - $100,000 |
| Credit monitoring (1 year) | $20,000 - $50,000 |
| Regulatory fines | $10,000 - $100,000 |
| Lawsuits & settlements | $100,000 - $1,000,000 |
| Business interruption | $50,000 - $500,000 |
| Reputation damage | Immeasurable |
| **TOTAL** | **$260,000 - $1,900,000** |

**Cost of Cyber Insurance:** $1,000 - $2,500/year

**ROI:** One breach would cost 100-1,900x your annual premium.

### Coverage Types

#### 1. First-Party Coverage (Your Direct Losses)

**Business Interruption & Extra Expenses**

Covers lost revenue and additional costs when your business is shut down by a cyber event.

**What's Covered:**
- Lost revenue during downtime (based on historical revenue)
- Extra expenses to keep operating (temporary systems, overtime pay)
- Costs to restore systems and data
- Public relations to manage reputation damage

**Example Scenario:**

Ransomware locks your platform for 7 days. Your average daily revenue is $3,000.

- Lost revenue: $3,000 × 7 = $21,000
- System restoration: $15,000
- PR firm: $5,000
- **Total covered: $41,000**

**Policy Limit:** $100,000 - $1,000,000

**Waiting Period:** 8-24 hours (you must be down this long before coverage kicks in)

**Cyber Extortion & Ransomware**

Covers costs related to ransomware attacks and extortion threats.

**What's Covered:**
- Ransom payment (where legal)
- Professional negotiator fees
- Cryptocurrency acquisition costs
- Legal advice on whether to pay
- Law enforcement cooperation costs

**Example Scenario:**

Hacker demands $50,000 in Bitcoin to decrypt your data.

- Negotiator reduces demand to $30,000
- Bitcoin acquisition fees: $500
- Legal consultation: $2,000
- **Total covered: $32,500**

**Important:** Some states prohibit paying ransoms to sanctioned entities. Insurance covers legal advice to navigate this.

**Policy Limit:** $50,000 - $500,000

**Data Breach Response**

Covers immediate costs after a data breach.

**What's Covered:**
- Forensic investigation (determine what was stolen)
- Legal fees (comply with notification laws)
- Notification costs (letters, emails, call center)
- Credit monitoring for affected individuals (1-2 years)
- Identity theft protection services
- Public relations and crisis management
- Regulatory defense and fines

**Example Scenario:**

Hacker steals 5,000 user records (names, emails, passwords).

- Forensic investigation: $15,000
- Legal fees: $10,000
- Notification letters: $5,000 (5,000 × $1)
- Credit monitoring: $25,000 (5,000 × $5/year)
- PR firm: $10,000
- NC Attorney General fine: $25,000
- **Total covered: $90,000**

**Policy Limit:** $100,000 - $2,000,000

**Social Engineering Fraud & Funds Transfer Fraud**

Covers direct financial theft from scams.

**What's Covered:**
- Business email compromise (CEO fraud)
- Invoice manipulation
- Wire transfer fraud
- Phishing scams that result in money transfer
- Fraudulent instructions from "vendors" or "clients"

**Example Scenario:**

Hacker impersonates you and tricks your bookkeeper into wiring $25,000 to a fraudulent account.

- **Total covered: $25,000** (direct theft)

**Policy Limit:** $50,000 - $500,000

**Deductible:** $5,000 - $25,000 (you pay this first)

**Important:** This coverage has strict requirements:
- Must have dual authorization for wire transfers over $10,000
- Must verify all payment changes via phone (not email)
- Must have MFA enabled for financial systems

#### 2. Third-Party Coverage (Claims Against You)

**Privacy Liability**

Covers lawsuits from customers whose data was breached.

**What's Covered:**
- Legal defense costs
- Settlements and judgments
- Class action lawsuits
- Privacy violation claims
- Failure to protect data claims

**Example Scenario:**

500 artists sue you in class action after their SSNs and bank account info were stolen.

- Legal defense: $150,000
- Settlement: $500,000 ($1,000 per artist)
- **Total covered: $650,000**

**Policy Limit:** $1,000,000 - $5,000,000

**Network Security Liability**

Covers lawsuits from third parties harmed by your security failures.

**What's Covered:**
- Transmission of malware to users
- Failure to prevent unauthorized access
- Failure to protect third-party data
- Denial of service attacks originating from your systems

**Example Scenario:**

Your platform is hacked and used to distribute malware. 100 users' computers are infected.

- Legal defense: $50,000
- Settlements: $100,000
- **Total covered: $150,000**

**Policy Limit:** $1,000,000 - $5,000,000

**Media Liability**

Covers claims related to content on your platform.

**What's Covered:**
- Defamation (negative reviews, false statements)
- Copyright infringement (artists upload copyrighted work)
- Trademark infringement
- Privacy violations (publishing private information)

**Example Scenario:**

Artist uploads copyrighted images to portfolio. Copyright owner sues your platform for $50,000.

- Legal defense: $20,000
- Settlement: $15,000
- **Total covered: $35,000**

**Policy Limit:** $1,000,000 - $2,000,000

**Regulatory Defense & Penalties**

Covers fines and penalties from regulators.

**What's Covered:**
- FTC investigations and fines
- State attorney general fines
- GDPR fines (if you have EU users)
- CCPA fines (if you have CA users)
- Legal defense against regulatory actions

**Example Scenario:**

NC Attorney General investigates your data breach and fines you $50,000 for inadequate security.

- Legal defense: $30,000
- Fine: $50,000
- **Total covered: $80,000**

**Policy Limit:** $100,000 - $1,000,000

**Important:** Some policies exclude intentional violations or gross negligence.

### Recommended Insurance Providers

#### Coalition (Recommended for Tech Startups)

**Why Coalition:**
- Specializes in tech companies and marketplaces
- Includes active security monitoring (scans your systems for vulnerabilities)
- Fast claims process (24-48 hour response)
- Competitive pricing for startups

**Coverage:**
- First-party: $100,000 - $5,000,000
- Third-party: $1,000,000 - $10,000,000
- Social engineering: $100,000 - $1,000,000

**Pricing:**
- $1,200 - $2,000/year for $1M/$1M coverage
- $2,500 - $4,000/year for $2M/$2M coverage

**Unique Features:**
- Free security monitoring and alerts
- Incident response team on standby 24/7
- Pre-breach risk assessments
- Post-breach forensics included

**Application Process:**
1. Go to coalitioninc.com
2. Complete online questionnaire (15 minutes)
3. Coalition scans your systems for vulnerabilities
4. Receive quote within 24 hours
5. Purchase online, coverage starts immediately

**Requirements:**
- ✅ Multi-factor authentication (MFA) required
- ✅ Regular data backups (daily or weekly)
- ✅ Endpoint protection (antivirus/EDR)
- ✅ Patch management (update software regularly)

#### Chubb (Best for Comprehensive Coverage)

**Why Chubb:**
- Established insurer with strong financial ratings (A++ from AM Best)
- Comprehensive coverage with fewer exclusions
- Higher policy limits available
- Good for businesses planning to scale

**Coverage:**
- First-party: $250,000 - $10,000,000
- Third-party: $1,000,000 - $25,000,000
- Social engineering: $250,000 - $2,000,000

**Pricing:**
- $1,500 - $2,500/year for $1M/$1M coverage
- $3,000 - $5,000/year for $2M/$2M coverage

**Unique Features:**
- Dependent business interruption (covers losses if Stripe/Manus goes down)
- Invoice manipulation coverage
- Cryptocurrency theft coverage
- Reputational harm coverage

**Application Process:**
1. Contact Chubb agent or go to chubb.com
2. Complete detailed application (30-45 minutes)
3. Provide financial statements and security documentation
4. Underwriter reviews application (3-5 business days)
5. Receive quote and negotiate terms
6. Purchase policy, coverage starts on effective date

**Requirements:**
- ✅ MFA required for all admin accounts
- ✅ Daily backups with offsite storage
- ✅ Annual security audit or penetration test
- ✅ Incident response plan documented
- ✅ Employee security training program

#### Cowbell Cyber (Best for Fast Online Quotes)

**Why Cowbell:**
- 100% online application and purchase
- AI-powered risk assessment (instant quotes)
- Competitive pricing for small businesses
- Simple, straightforward policies

**Coverage:**
- First-party: $100,000 - $5,000,000
- Third-party: $1,000,000 - $5,000,000
- Social engineering: $100,000 - $500,000

**Pricing:**
- $1,000 - $1,800/year for $1M/$1M coverage
- $2,000 - $3,500/year for $2M/$2M coverage

**Unique Features:**
- Instant quotes (no waiting for underwriter)
- Month-to-month payment options
- Continuous risk monitoring
- Cybersecurity tools included (password manager, VPN)

**Application Process:**
1. Go to cowbell.insure
2. Enter business information (10 minutes)
3. AI scans your systems and assesses risk
4. Receive instant quote
5. Purchase online, coverage starts immediately

**Requirements:**
- ✅ MFA required
- ✅ Regular backups
- ✅ Antivirus software
- ✅ Firewall enabled

#### Travelers (Best for Bundling with Other Insurance)

**Why Travelers:**
- Can bundle cyber with general liability and E&O
- Discount for bundling (10-15% savings)
- Strong claims handling reputation
- Pre-breach risk management tools included

**Coverage:**
- First-party: $100,000 - $5,000,000
- Third-party: $1,000,000 - $10,000,000
- Social engineering: $100,000 - $1,000,000

**Pricing:**
- $1,400 - $2,200/year for $1M/$1M coverage
- $2,800 - $4,500/year for $2M/$2M coverage
- 10-15% discount if bundled with GLI + E&O

**Unique Features:**
- CyberRisk portal with security tools
- Pre-breach training and resources
- Dedicated incident response team
- Reputation management services

**Application Process:**
1. Contact Travelers agent or go to travelers.com
2. Complete application (20-30 minutes)
3. Underwriter reviews (2-3 business days)
4. Receive quote
5. Purchase policy

**Requirements:**
- ✅ MFA required
- ✅ Daily backups
- ✅ Security awareness training for employees
- ✅ Incident response plan

### Comparison Table

| Provider | Best For | Annual Cost ($1M/$1M) | Unique Features | Application Time |
|----------|----------|----------------------|-----------------|------------------|
| **Coalition** | Tech startups | $1,200 - $2,000 | Active security monitoring | 24 hours |
| **Chubb** | Comprehensive coverage | $1,500 - $2,500 | Dependent business interruption | 3-5 days |
| **Cowbell** | Fast quotes | $1,000 - $1,800 | Instant AI-powered quotes | Instant |
| **Travelers** | Bundling | $1,400 - $2,200 | 10-15% bundle discount | 2-3 days |

### Coverage Recommendations by Business Stage

**Pre-Launch (No Revenue):**
- Coverage: $500K first-party / $1M third-party
- Cost: $800 - $1,200/year
- Provider: Cowbell (cheapest, fast setup)

**Beta Launch ($0-10K Monthly GMV):**
- Coverage: $1M first-party / $1M third-party
- Cost: $1,200 - $2,000/year
- Provider: Coalition (includes security monitoring)

**Growth Stage ($10K-100K Monthly GMV):**
- Coverage: $2M first-party / $2M third-party
- Cost: $2,500 - $4,000/year
- Provider: Coalition or Chubb

**Scale Stage ($100K+ Monthly GMV):**
- Coverage: $5M first-party / $5M third-party
- Cost: $5,000 - $10,000/year
- Provider: Chubb (comprehensive coverage)

### Application Tips

**1. Be Honest About Security Practices**

Don't exaggerate your security measures. If you claim to have MFA enabled but don't, your claim could be denied.

**2. Implement Required Controls Before Applying**

Most insurers require:
- ✅ Multi-factor authentication (MFA)
- ✅ Regular backups (daily or weekly)
- ✅ Antivirus/endpoint protection
- ✅ Patch management

Implement these BEFORE applying to get better rates and avoid denial.

**3. Document Everything**

Maintain documentation of:
- Security policies and procedures
- Employee training records
- Backup schedules and tests
- Incident response plan
- Vendor security assessments

Insurers may request this during application or claims.

**4. Get Multiple Quotes**

Pricing varies significantly between providers. Get quotes from at least 3 insurers:
- Coalition (tech-focused)
- Chubb (comprehensive)
- Cowbell (budget-friendly)

**5. Read the Exclusions**

Pay attention to what's NOT covered:
- ❌ Prior known breaches
- ❌ Intentional acts or fraud
- ❌ Unencrypted data (some policies)
- ❌ Failure to patch known vulnerabilities
- ❌ Bodily injury or property damage

**6. Consider Dependent Business Interruption**

If your business depends on third-party services (Stripe, Manus, AWS), add this endorsement. It covers losses if THEIR systems go down.

**Example:** Stripe has an outage for 24 hours. You can't process payments. Dependent business interruption covers your lost revenue.

**Cost:** +$200-500/year

### Claims Process

**Step 1: Detect Incident (Day 0)**

You discover a security incident:
- Data breach
- Ransomware attack
- Business email compromise
- Denial of service attack

**Step 2: Notify Insurer (Within 24-48 Hours)**

Call your insurer's incident hotline (provided in policy documents):
- Coalition: 1-888-COALITION
- Chubb: 1-800-CHUBB-CYBER
- Cowbell: 1-833-COWBELL-1
- Travelers: 1-800-TRAVELERS

**What to Report:**
- Date and time of discovery
- Type of incident
- Systems affected
- Data potentially compromised
- Estimated impact

**Step 3: Activate Incident Response (Day 0-1)**

Insurer connects you with pre-approved vendors:
- Forensic investigator
- Legal counsel
- PR firm
- Breach notification service

**Costs:** Covered by insurance (no upfront payment)

**Step 4: Investigation (Days 1-14)**

Forensic team investigates:
- How did the breach occur?
- What data was accessed/stolen?
- How many individuals affected?
- Is the threat still active?

**Deliverable:** Forensic report with findings and recommendations

**Step 5: Notification (Days 15-30)**

Legal counsel determines notification requirements:
- Which individuals must be notified?
- Which regulators must be notified?
- What information must be included?

Breach notification service handles:
- Drafting notification letters
- Mailing letters to affected individuals
- Setting up call center for questions
- Providing credit monitoring enrollment

**Step 6: Regulatory Response (Days 30-90)**

If regulators investigate:
- Legal counsel represents you
- Provide requested documentation
- Negotiate fines and penalties
- Implement corrective actions

**Step 7: Litigation Defense (Months 3-24)**

If lawsuits are filed:
- Legal counsel defends you
- Negotiate settlements
- Go to trial if necessary

**Insurance covers:** Legal fees, settlements, judgments

**Step 8: Claims Settlement (Ongoing)**

Submit invoices to insurer for reimbursement:
- Forensic investigation: $15,000
- Legal fees: $50,000
- Notification costs: $25,000
- Credit monitoring: $30,000
- Regulatory fines: $25,000
- **Total: $145,000**

**You pay:** Deductible ($5,000-25,000)

**Insurance pays:** Remaining amount up to policy limit

**Typical Timeline:**
- Incident response: 30-60 days
- Regulatory investigation: 3-6 months
- Litigation: 12-24 months
- Total claims process: 12-36 months

### Marketplace-Specific Considerations

**1. Dependent Business Interruption**

Your marketplace depends on:
- **Stripe** (payment processing)
- **Manus** (hosting and infrastructure)
- **Mercury** (banking, if using API)

If any of these go down, you lose revenue. Standard cyber policies DON'T cover this.

**Solution:** Add "Dependent Business Interruption" endorsement

**Cost:** +$200-500/year

**Coverage:** Lost revenue if third-party service outage lasts >8 hours

**Example:** Stripe has 24-hour outage. You lose $3,000 in daily revenue. Insurance covers $3,000 minus deductible.

**2. Invoice Manipulation**

Hackers could:
- Intercept invoices to clients
- Change bank account details to their own
- Clients pay hackers instead of you

**Solution:** Ensure policy includes "Invoice Manipulation" coverage

**Coverage:** Reimburses you for diverted payments

**Limit:** $50,000 - $250,000

**3. Funds Transfer Fraud**

Hackers could:
- Compromise your email or banking access
- Initiate wire transfers to their accounts
- Steal funds before you notice

**Solution:** Ensure policy includes "Funds Transfer Fraud" coverage

**Coverage:** Reimburses stolen funds

**Limit:** $50,000 - $500,000

**Requirements:**
- ✅ Dual authorization for transfers >$10,000
- ✅ MFA on banking systems
- ✅ Verify all payment changes via phone

**4. Payment Card Industry (PCI) Fines**

If you store credit card data (you shouldn't - Stripe handles this), you could face PCI DSS fines after a breach.

**Solution:** Ensure policy includes "PCI Fines & Penalties" coverage

**Coverage:** Reimburses PCI fines

**Limit:** $50,000 - $250,000

**Best Practice:** DON'T store credit card data. Let Stripe handle it. This eliminates PCI compliance requirements.

---

## Incident Response Plan

### Why You Need an Incident Response Plan

**Without a Plan:**
- Panic and confusion
- Delayed response (hours or days)
- Evidence destroyed
- Regulatory violations
- Higher costs
- Longer downtime

**With a Plan:**
- Clear roles and responsibilities
- Immediate response (minutes)
- Evidence preserved
- Compliance with notification laws
- Lower costs
- Faster recovery

**Insurance Requirement:** Most cyber insurance policies require a documented incident response plan.

### Incident Response Team

**Core Team (Minimum):**

1. **Incident Commander** (You, platform owner)
   - Overall responsibility
   - Makes final decisions
   - Communicates with stakeholders

2. **Technical Lead** (Developer or IT person)
   - Investigates technical details
   - Implements containment measures
   - Restores systems

3. **Communications Lead** (Marketing or customer support)
   - Drafts communications
   - Manages customer inquiries
   - Coordinates with PR firm

**Extended Team (As Needed):**

4. **Legal Counsel** (External attorney)
   - Advises on legal obligations
   - Handles regulatory notifications
   - Manages litigation

5. **Forensic Investigator** (External firm)
   - Determines root cause
   - Identifies compromised data
   - Preserves evidence

6. **PR Firm** (External firm)
   - Manages media inquiries
   - Protects reputation
   - Crisis communications

**Pre-Approved Vendors:**

Establish relationships BEFORE an incident:

- **Forensic Firm:** Mandiant, CrowdStrike, Kroll
- **Legal Counsel:** Privacy attorney experienced in data breaches
- **PR Firm:** Crisis communications specialist

**Cost:** $0 upfront (pay only if incident occurs)

**Benefit:** Immediate response (no time wasted finding vendors)

### Incident Response Phases

#### Phase 1: Detection & Analysis

**Indicators of Compromise:**

- Unusual login activity (logins from foreign countries, impossible travel)
- Failed login attempts (brute force attacks)
- Unexpected database queries
- Slow system performance
- Unusual network traffic
- Antivirus alerts
- User reports of suspicious activity
- Stripe fraud alerts
- Mercury fraud alerts

**Detection Tools:**

```typescript
// server/utils/security-monitoring.ts

import { db } from '../db';
import { notifyOwner } from '../_core/notification';

/**
 * Monitor for suspicious login activity
 */
export async function monitorLogins() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  // Check for brute force attempts
  const recentFailedLogins = await db.query.loginAttempts.findMany({
    where: and(
      eq(loginAttempts.success, false),
      gte(loginAttempts.createdAt, new Date(oneHourAgo))
    ),
  });

  // Group by IP address
  const failedByIP: { [ip: string]: number } = {};
  recentFailedLogins.forEach(attempt => {
    failedByIP[attempt.ipAddress] = (failedByIP[attempt.ipAddress] || 0) + 1;
  });

  // Alert if >10 failed attempts from single IP
  Object.entries(failedByIP).forEach(([ip, count]) => {
    if (count > 10) {
      notifyOwner({
        title: '🚨 Brute Force Attack Detected',
        content: `IP ${ip} has ${count} failed login attempts in the last hour. Consider blocking this IP.`,
      });
    }
  });

  // Check for impossible travel
  const recentSuccessfulLogins = await db.query.loginAttempts.findMany({
    where: and(
      eq(loginAttempts.success, true),
      gte(loginAttempts.createdAt, new Date(oneHourAgo))
    ),
    orderBy: [desc(loginAttempts.createdAt)],
  });

  // Group by user
  const loginsByUser: { [userId: number]: typeof recentSuccessfulLogins } = {};
  recentSuccessfulLogins.forEach(attempt => {
    if (!loginsByUser[attempt.userId]) {
      loginsByUser[attempt.userId] = [];
    }
    loginsByUser[attempt.userId].push(attempt);
  });

  // Check for logins from different countries within 1 hour
  Object.entries(loginsByUser).forEach(([userId, logins]) => {
    if (logins.length >= 2) {
      const countries = new Set(logins.map(l => l.country));
      if (countries.size > 1) {
        notifyOwner({
          title: '🚨 Impossible Travel Detected',
          content: `User ${userId} logged in from ${Array.from(countries).join(', ')} within 1 hour. Possible account takeover.`,
        });
      }
    }
  });
}

// Run every 5 minutes
setInterval(monitorLogins, 5 * 60 * 1000);
```

**Analysis Questions:**

1. **What happened?**
   - Data breach, ransomware, DDoS, fraud, etc.

2. **When did it happen?**
   - Exact date and time of incident

3. **How did it happen?**
   - Attack vector (phishing, SQL injection, stolen credentials, etc.)

4. **What systems are affected?**
   - Database, web server, payment system, etc.

5. **What data is compromised?**
   - User records, payment info, artist data, etc.

6. **How many individuals are affected?**
   - Exact count for notification requirements

7. **Is the threat still active?**
   - Is the attacker still in your systems?

#### Phase 2: Containment

**Immediate Actions (Within 1 Hour):**

1. **Isolate Affected Systems**
   - Disconnect compromised servers from network
   - Disable compromised user accounts
   - Revoke API keys and access tokens

2. **Preserve Evidence**
   - Take snapshots of affected systems
   - Capture logs before they're overwritten
   - Document everything

3. **Notify Incident Response Team**
   - Alert all team members
   - Activate external vendors (forensics, legal, PR)

4. **Assess Impact**
   - Determine scope of compromise
   - Identify affected data and users

**Short-Term Containment (Within 24 Hours):**

1. **Stop the Bleeding**
   - Patch vulnerabilities
   - Change all passwords and API keys
   - Implement additional access controls

2. **Prevent Further Damage**
   - Block attacker IP addresses
   - Disable compromised features
   - Increase monitoring

3. **Communicate Internally**
   - Brief all team members
   - Establish communication protocols
   - Set up war room (physical or virtual)

**Long-Term Containment (Days 2-7):**

1. **Rebuild Compromised Systems**
   - Restore from clean backups
   - Rebuild servers from scratch if necessary
   - Implement enhanced security controls

2. **Verify Threat Elimination**
   - Forensic team confirms attacker is removed
   - No backdoors or persistent access remain

3. **Resume Operations**
   - Gradually bring systems back online
   - Monitor closely for re-infection

#### Phase 3: Eradication

**Goal:** Remove the threat completely and fix vulnerabilities.

**Actions:**

1. **Remove Malware**
   - Delete malicious files
   - Remove backdoors
   - Clean infected systems

2. **Patch Vulnerabilities**
   - Fix the security flaw that allowed the attack
   - Update all software to latest versions
   - Implement additional security controls

3. **Strengthen Defenses**
   - Implement MFA if not already enabled
   - Add rate limiting
   - Enhance monitoring and alerting
   - Conduct security audit

#### Phase 4: Recovery

**Goal:** Restore normal operations and verify systems are secure.

**Actions:**

1. **Restore Systems**
   - Bring all systems back online
   - Verify functionality
   - Test thoroughly

2. **Restore Data**
   - Restore from backups if necessary
   - Verify data integrity
   - Reconcile any lost data

3. **Monitor Closely**
   - Enhanced monitoring for 30 days
   - Watch for signs of re-infection
   - Respond immediately to any anomalies

4. **Communicate with Users**
   - Notify affected individuals (legal requirement)
   - Provide updates on recovery progress
   - Offer credit monitoring if appropriate

#### Phase 5: Post-Incident Review

**Goal:** Learn from the incident and improve defenses.

**Actions:**

1. **Conduct Post-Mortem**
   - What happened?
   - How did it happen?
   - What went well?
   - What went poorly?
   - What should we do differently?

2. **Update Incident Response Plan**
   - Incorporate lessons learned
   - Update contact information
   - Refine procedures

3. **Implement Improvements**
   - Fix identified weaknesses
   - Enhance security controls
   - Improve monitoring and detection

4. **Train Team**
   - Share lessons learned
   - Update security training
   - Conduct tabletop exercises

### Incident Response Playbooks

Create specific playbooks for common incidents:

#### Playbook 1: Data Breach

**Trigger:** Discovery that unauthorized person accessed user data

**Immediate Actions (Hour 0-1):**
- [ ] Isolate affected database server
- [ ] Disable compromised user accounts
- [ ] Capture database logs
- [ ] Notify incident commander
- [ ] Activate forensic team

**Investigation (Hours 1-24):**
- [ ] Determine what data was accessed
- [ ] Identify affected users (exact count)
- [ ] Determine how breach occurred
- [ ] Verify breach is contained

**Notification (Days 1-30):**
- [ ] Notify cyber insurance provider
- [ ] Engage legal counsel
- [ ] Determine notification requirements
- [ ] Draft notification letters
- [ ] Notify NC Attorney General (if >1,000 affected)
- [ ] Notify affected individuals
- [ ] Set up call center for questions
- [ ] Offer credit monitoring

**Recovery (Days 30+):**
- [ ] Patch vulnerability
- [ ] Implement enhanced security
- [ ] Monitor for further incidents
- [ ] Conduct post-mortem

#### Playbook 2: Ransomware

**Trigger:** Systems encrypted, ransom demand received

**Immediate Actions (Hour 0-1):**
- [ ] Isolate infected systems (disconnect from network)
- [ ] Do NOT pay ransom yet
- [ ] Preserve ransom note and all evidence
- [ ] Notify incident commander
- [ ] Activate forensic team

**Assessment (Hours 1-6):**
- [ ] Determine extent of encryption
- [ ] Identify ransomware variant
- [ ] Check if decryption tools available (nomoreransom.org)
- [ ] Assess backup availability
- [ ] Estimate recovery time with/without paying ransom

**Decision (Hours 6-24):**
- [ ] Notify cyber insurance provider
- [ ] Engage legal counsel
- [ ] Engage ransomware negotiator
- [ ] Decide: pay ransom or restore from backups?

**If Paying Ransom:**
- [ ] Negotiator contacts attacker
- [ ] Negotiate lower amount
- [ ] Acquire cryptocurrency
- [ ] Pay ransom
- [ ] Receive decryption key
- [ ] Test decryption on sample data
- [ ] Decrypt all systems
- [ ] Verify data integrity

**If Restoring from Backups:**
- [ ] Verify backups are clean (not infected)
- [ ] Rebuild systems from scratch
- [ ] Restore data from backups
- [ ] Test thoroughly
- [ ] Bring systems back online

**Recovery (Days 7+):**
- [ ] Patch vulnerability
- [ ] Implement enhanced security
- [ ] Improve backup procedures
- [ ] Conduct post-mortem

#### Playbook 3: Business Email Compromise

**Trigger:** Discovery that fraudulent payment was made

**Immediate Actions (Hour 0-1):**
- [ ] Contact receiving bank immediately (request wire recall)
- [ ] Contact your bank (Mercury) to stop payment if possible
- [ ] Change all email passwords
- [ ] Enable MFA on all accounts
- [ ] Notify incident commander

**Investigation (Hours 1-24):**
- [ ] Determine how email was compromised
- [ ] Identify all fraudulent transactions
- [ ] Calculate total loss
- [ ] Preserve all evidence (emails, wire instructions)

**Recovery (Days 1-7):**
- [ ] Notify cyber insurance provider
- [ ] File police report
- [ ] Engage legal counsel
- [ ] Attempt to recover funds (usually unsuccessful)
- [ ] Implement dual authorization for wire transfers
- [ ] Conduct security training for all employees

**Prevention (Ongoing):**
- [ ] Require phone verification for all payment changes
- [ ] Never send wire instructions via email
- [ ] Use secure portal for financial communications
- [ ] Train employees to recognize phishing

### Communication Templates

#### Internal Communication (To Team)

**Subject:** URGENT: Security Incident - Action Required

**Body:**

> Team,
>
> We have detected a security incident affecting our platform. Here's what you need to know:
>
> **What Happened:**  
> [Brief description of incident]
>
> **Current Status:**  
> [Contained / Under investigation / Resolved]
>
> **Impact:**  
> [Systems affected, data compromised, downtime expected]
>
> **Your Actions:**  
> 1. Change your password immediately
> 2. Enable MFA if not already enabled
> 3. Do NOT discuss this incident publicly or on social media
> 4. Forward any suspicious emails or activity to security@solelyart.com
>
> **Next Steps:**  
> [Timeline for resolution, next update]
>
> **Questions:**  
> Contact [Incident Commander] at [phone/email]
>
> Thank you for your cooperation.

#### External Communication (To Users)

**Subject:** Important Security Notice

**Body:**

> Dear [User Name],
>
> We are writing to inform you of a security incident that may have affected your account.
>
> **What Happened:**  
> On [date], we discovered that an unauthorized person gained access to our systems. We immediately took action to secure our platform and launched an investigation.
>
> **What Information Was Involved:**  
> [List specific data types: names, emails, passwords, payment info, etc.]
>
> **What We're Doing:**  
> - We have secured our systems and removed the unauthorized access
> - We are working with cybersecurity experts to investigate
> - We have notified law enforcement
> - We are implementing additional security measures
>
> **What You Should Do:**  
> 1. Change your password immediately at [link]
> 2. Enable two-factor authentication for added security
> 3. Monitor your accounts for suspicious activity
> 4. Be cautious of phishing emails claiming to be from us
>
> **Credit Monitoring:**  
> We are offering [1-2 years] of free credit monitoring to all affected users. Enroll at [link] using code [code].
>
> **Questions:**  
> Contact us at security@solelyart.com or call [phone number].
>
> We sincerely apologize for this incident and are committed to protecting your information.
>
> Sincerely,  
> [Your Name]  
> Founder, Solely Art

---

## Security Monitoring & Auditing

### Continuous Monitoring

**What to Monitor:**

1. **Authentication Events**
   - Failed login attempts
   - Successful logins from new locations
   - Password changes
   - MFA enrollments/removals
   - Account lockouts

2. **Authorization Events**
   - Privilege escalations
   - Admin actions
   - Access to sensitive data
   - Permission changes

3. **Data Access**
   - Database queries
   - File downloads
   - API calls
   - Export operations

4. **Financial Transactions**
   - Payment processing
   - Refunds
   - Payouts
   - Commission calculations

5. **System Health**
   - Error rates
   - Response times
   - Resource utilization
   - Uptime

**Monitoring Tools:**

```typescript
// server/utils/audit-log.ts

import { db } from '../db';
import { auditLogs } from '../../drizzle/schema';

export enum AuditEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  PASSWORD_CHANGE = 'password_change',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  PAYMENT_PROCESSED = 'payment_processed',
  REFUND_ISSUED = 'refund_issued',
  ADMIN_ACTION = 'admin_action',
  DATA_EXPORT = 'data_export',
  PERMISSION_CHANGE = 'permission_change',
}

export async function logAuditEvent(params: {
  userId?: number;
  eventType: AuditEventType;
  details: any;
  ipAddress: string;
  userAgent: string;
}) {
  await db.insert(auditLogs).values({
    userId: params.userId,
    eventType: params.eventType,
    details: JSON.stringify(params.details),
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    createdAt: new Date(),
  });

  // Check for suspicious patterns
  await checkSuspiciousActivity(params);
}

async function checkSuspiciousActivity(params: {
  userId?: number;
  eventType: AuditEventType;
  ipAddress: string;
}) {
  // Check for rapid failed logins
  if (params.eventType === AuditEventType.LOGIN_FAILURE) {
    const recentFailures = await db.query.auditLogs.findMany({
      where: and(
        eq(auditLogs.eventType, AuditEventType.LOGIN_FAILURE),
        eq(auditLogs.ipAddress, params.ipAddress),
        gte(auditLogs.createdAt, new Date(Date.now() - 15 * 60 * 1000))
      ),
    });

    if (recentFailures.length >= 5) {
      await notifyOwner({
        title: '🚨 Brute Force Attack',
        content: `IP ${params.ipAddress} has ${recentFailures.length} failed login attempts in 15 minutes`,
      });
    }
  }

  // Check for admin actions from new locations
  if (params.eventType === AuditEventType.ADMIN_ACTION && params.userId) {
    const user = await db.query.user.findFirst({
      where: eq(user.id, params.userId),
    });

    if (user?.role === 'admin') {
      const recentAdminLogins = await db.query.auditLogs.findMany({
        where: and(
          eq(auditLogs.userId, params.userId),
          eq(auditLogs.eventType, AuditEventType.LOGIN_SUCCESS),
          gte(auditLogs.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        ),
      });

      const knownIPs = new Set(recentAdminLogins.map(log => log.ipAddress));

      if (!knownIPs.has(params.ipAddress)) {
        await notifyOwner({
          title: '🚨 Admin Action from New Location',
          content: `Admin user ${user.email} performed action from new IP ${params.ipAddress}`,
        });
      }
    }
  }
}
```

**Database Schema:**

```typescript
// drizzle/schema.ts

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => user.id),
  eventType: text('event_type').notNull(),
  details: text('details'), // JSON
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### Security Audits

**Frequency:**
- **Self-audit:** Monthly
- **External audit:** Annually
- **Penetration test:** Annually (after $500K revenue)

**Monthly Self-Audit Checklist:**

**Access Control:**
- [ ] Review user accounts (disable inactive accounts)
- [ ] Review admin accounts (verify all are legitimate)
- [ ] Review API keys (rotate old keys)
- [ ] Review database access (verify only necessary access)

**Authentication:**
- [ ] Verify MFA enabled for all admins
- [ ] Review failed login attempts
- [ ] Check for weak passwords
- [ ] Verify session timeouts are enforced

**Data Protection:**
- [ ] Verify backups are running daily
- [ ] Test backup restoration
- [ ] Verify encryption is enabled
- [ ] Check for exposed sensitive data

**Payment Security:**
- [ ] Review Stripe Radar rules
- [ ] Check for unusual refund patterns
- [ ] Verify commission calculations are correct
- [ ] Review high-value transactions

**System Security:**
- [ ] Update all dependencies
- [ ] Patch known vulnerabilities
- [ ] Review error logs for security issues
- [ ] Check for unusual traffic patterns

**Compliance:**
- [ ] Review privacy policy (ensure up-to-date)
- [ ] Verify GDPR compliance (if applicable)
- [ ] Check data retention policies
- [ ] Review vendor security assessments

### Penetration Testing

**When to Conduct:**
- Before public launch
- Annually after launch
- After major feature releases
- After security incidents

**Types of Penetration Tests:**

1. **External Network Test**
   - Tests your public-facing systems
   - Simulates attacks from the internet
   - Cost: $3,000 - $10,000

2. **Web Application Test**
   - Tests your web application for vulnerabilities
   - Includes OWASP Top 10 testing
   - Cost: $5,000 - $15,000

3. **Internal Network Test**
   - Tests your internal systems
   - Simulates insider threats
   - Cost: $5,000 - $15,000

4. **Social Engineering Test**
   - Tests your employees' security awareness
   - Includes phishing simulations
   - Cost: $2,000 - $5,000

**Recommended for Solely Art:**
- **Pre-launch:** Web application test ($5,000)
- **Annually:** Web application test + external network test ($10,000)

**Penetration Testing Firms:**
- **Offensive Security:** offensivesecurity.com
- **Rapid7:** rapid7.com
- **Coalfire:** coalfire.com
- **Trustwave:** trustwave.com

---

## Employee & Contractor Security

### Security Training

**Frequency:**
- **Onboarding:** All new employees/contractors
- **Refresher:** Quarterly
- **After incidents:** Immediately

**Topics:**

1. **Password Security**
   - Use strong, unique passwords
   - Use password manager
   - Never share passwords
   - Enable MFA everywhere

2. **Phishing Awareness**
   - Recognize phishing emails
   - Don't click suspicious links
   - Verify sender identity
   - Report suspicious emails

3. **Social Engineering**
   - Verify requests via phone
   - Don't provide sensitive info via email
   - Be suspicious of urgent requests
   - Follow verification procedures

4. **Data Protection**
   - Don't store sensitive data locally
   - Encrypt sensitive files
   - Don't email sensitive data
   - Use secure file sharing

5. **Device Security**
   - Keep software updated
   - Use antivirus
   - Lock devices when away
   - Don't use public WiFi for work

6. **Incident Reporting**
   - Report suspicious activity immediately
   - Don't try to investigate yourself
   - Preserve evidence
   - Follow incident response plan

**Training Resources:**
- **KnowBe4:** knowbe4.com (phishing simulations + training)
- **SANS Security Awareness:** sans.org/security-awareness-training
- **Cybrary:** cybrary.it (free security courses)

### Access Control Policies

**Principle of Least Privilege:**

Give users only the access they need to do their job.

**Access Levels:**

1. **Public** (No authentication)
   - View artist profiles
   - Search services
   - View reviews

2. **Client** (Authenticated user)
   - Create bookings
   - View own bookings
   - Leave reviews

3. **Artist** (Authenticated user with artist profile)
   - Accept/decline bookings
   - View earnings
   - Upload portfolio

4. **Admin** (Platform owner)
   - View all data
   - Manage users
   - Process refunds
   - View financial reports

**Access Review:**
- Review all user access quarterly
- Remove access for inactive users
- Verify admin accounts are legitimate
- Audit high-privilege actions

### Offboarding Procedures

When an employee or contractor leaves:

**Immediate (Day 0):**
- [ ] Disable user account
- [ ] Revoke database access
- [ ] Revoke API keys
- [ ] Remove from GitHub/code repositories
- [ ] Remove from Slack/communication tools
- [ ] Change shared passwords

**Within 24 Hours:**
- [ ] Review audit logs for unusual activity
- [ ] Verify no unauthorized access
- [ ] Update emergency contact lists
- [ ] Notify team of departure

**Within 1 Week:**
- [ ] Retrieve company devices
- [ ] Delete company data from personal devices
- [ ] Verify no data was exfiltrated
- [ ] Update documentation

---

## Third-Party Risk Management

### Vendor Security Assessment

**Critical Vendors:**
- **Stripe** (payment processing)
- **Manus** (hosting)
- **Mercury** (banking)

**Assessment Questions:**

1. **Data Security**
   - How is data encrypted (at rest and in transit)?
   - Where is data stored (geographic location)?
   - Who has access to data?
   - How long is data retained?

2. **Access Control**
   - How are user accounts managed?
   - Is MFA required?
   - How are passwords stored?
   - How often are access reviews conducted?

3. **Incident Response**
   - Do you have an incident response plan?
   - How quickly do you detect incidents?
   - How do you notify customers of breaches?
   - Have you had any breaches in the past 3 years?

4. **Compliance**
   - What certifications do you have (SOC 2, ISO 27001, PCI DSS)?
   - Are you GDPR compliant?
   - Are you CCPA compliant?
   - Do you conduct regular security audits?

5. **Business Continuity**
   - What is your uptime SLA?
   - How often do you back up data?
   - What is your disaster recovery plan?
   - How quickly can you restore service?

**Vendor Security Ratings:**

| Vendor | SOC 2 | ISO 27001 | PCI DSS | GDPR | Uptime SLA | Risk Level |
|--------|-------|-----------|---------|------|------------|------------|
| **Stripe** | ✅ | ✅ | ✅ Level 1 | ✅ | 99.99% | LOW |
| **Manus** | ✅ | ✅ | N/A | ✅ | 99.9% | LOW |
| **Mercury** | ✅ | ❌ | N/A | ✅ | 99.9% | LOW |

**All three vendors are low-risk and meet security standards.**

### Service Level Agreements (SLAs)

**Stripe:**
- Uptime: 99.99% (4.38 minutes downtime/month)
- Support: 24/7 email, phone for high-volume accounts
- Incident notification: Real-time via dashboard + email

**Manus:**
- Uptime: 99.9% (43.8 minutes downtime/month)
- Support: Email support, response within 24 hours
- Incident notification: Email + platform notifications

**Mercury:**
- Uptime: 99.9% (43.8 minutes downtime/month)
- Support: Email + phone support during business hours
- Incident notification: Email + SMS for critical issues

**Monitoring:**
- Subscribe to status pages (status.stripe.com, status.manus.im)
- Set up alerts for service disruptions
- Have backup plans for critical services

---

## Summary & Action Plan

### Security Checklist (Pre-Launch)

**Technical Security:**
- [ ] Implement strong password requirements
- [ ] Enable MFA for all admin accounts
- [ ] Implement rate limiting on login attempts
- [ ] Add input validation and sanitization
- [ ] Configure security headers (CSP, HSTS, etc.)
- [ ] Implement audit logging
- [ ] Set up security monitoring and alerts
- [ ] Conduct penetration test

**Fraud Prevention:**
- [ ] Enable Stripe Radar
- [ ] Configure custom fraud rules
- [ ] Implement velocity checks
- [ ] Add manual review for high-value bookings
- [ ] Implement artist verification process
- [ ] Create clear booking and refund policies

**Insurance:**
- [ ] Purchase cyber liability insurance ($1M/$1M minimum)
- [ ] Add dependent business interruption coverage
- [ ] Add invoice manipulation coverage
- [ ] Add funds transfer fraud coverage
- [ ] Document all security controls for insurer

**Incident Response:**
- [ ] Create incident response plan
- [ ] Identify incident response team
- [ ] Pre-approve forensic firm
- [ ] Pre-approve legal counsel
- [ ] Pre-approve PR firm
- [ ] Create communication templates
- [ ] Conduct tabletop exercise

**Monitoring:**
- [ ] Set up audit logging
- [ ] Configure security alerts
- [ ] Subscribe to vendor status pages
- [ ] Schedule monthly security audits
- [ ] Schedule annual penetration test

**Training:**
- [ ] Conduct security training for all team members
- [ ] Create security policies and procedures
- [ ] Document offboarding procedures
- [ ] Set up phishing simulations

### Estimated Costs

| Category | One-Time | Annual |
|----------|----------|--------|
| **Cyber Insurance** | $0 | $1,200 - $2,000 |
| **Penetration Testing** | $5,000 | $10,000 |
| **Security Training** | $0 | $500 |
| **Forensic Retainer** | $0 | $0 (pay if used) |
| **Legal Retainer** | $0 | $0 (pay if used) |
| **Monitoring Tools** | $0 | $0 (included in Manus) |
| **MFA Solution** | $0 | $0 (open source) |
| **TOTAL** | **$5,000** | **$11,700 - $12,500** |

**Total First Year:** $16,700 - $17,500

**Cost per Month:** $1,392 - $1,458

**As Percentage of Revenue (Year 1):**
- $530,000 GMV × 12% commission = $63,600 revenue
- Security costs: $17,500
- **2.75% of revenue**

**This is a reasonable investment to protect your business.**

### Priority Timeline

**Week 1 (Before Launch):**
- [ ] Implement MFA for admin accounts
- [ ] Configure Stripe Radar rules
- [ ] Purchase cyber insurance
- [ ] Create incident response plan

**Week 2-4 (Beta Launch):**
- [ ] Implement audit logging
- [ ] Set up security monitoring
- [ ] Conduct security training
- [ ] Create communication templates

**Month 2-3:**
- [ ] Conduct penetration test
- [ ] Implement recommended fixes
- [ ] Document security policies
- [ ] Conduct tabletop exercise

**Ongoing:**
- [ ] Monthly security audits
- [ ] Quarterly security training
- [ ] Annual penetration test
- [ ] Annual insurance renewal

---

**This comprehensive security and fraud prevention guide provides everything you need to protect your Solely Art marketplace from hackers, scammers, and financial theft. Implement these measures systematically, starting with the highest-priority items, and you'll significantly reduce your risk of costly security incidents.**
