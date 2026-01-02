import rateLimit, { type RateLimitRequestHandler, type Options } from 'express-rate-limit';

// Disable validation for custom key generator (we handle IPv6 properly)
const validate = false;
import type { Request, Response } from 'express';

// ============================================================================
// Rate Limit Configuration
// ============================================================================

/**
 * Rate limit tiers for different endpoint types
 * Each tier has specific limits based on security requirements
 */

// Standard rate limit headers
const standardHeaders = true; // Return rate limit info in `RateLimit-*` headers
const legacyHeaders = false; // Disable `X-RateLimit-*` headers

// Custom key generator that uses IP address
const keyGenerator = (req: Request): string => {
  // Use X-Forwarded-For header if behind a proxy, otherwise use IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip.trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
};

// Custom handler for rate limit exceeded
const createLimitHandler = (tierName: string) => (req: Request, res: Response) => {
  res.status(429).json({
    error: 'Too Many Requests',
    message: `Rate limit exceeded for ${tierName}. Please try again later.`,
    retryAfter: res.getHeader('Retry-After'),
  });
};

// ============================================================================
// IP Whitelist/Blacklist System
// ============================================================================

// In-memory storage for IP lists (in production, use Redis)
const ipWhitelist = new Set<string>([
  // Add trusted IPs here
  // '127.0.0.1',
  // '::1',
]);

const ipBlacklist = new Set<string>([
  // Add blocked IPs here
]);

/**
 * Check if an IP is whitelisted
 */
export function isWhitelisted(ip: string): boolean {
  return ipWhitelist.has(ip);
}

/**
 * Check if an IP is blacklisted
 */
export function isBlacklisted(ip: string): boolean {
  return ipBlacklist.has(ip);
}

/**
 * Add an IP to the whitelist
 */
export function addToWhitelist(ip: string): void {
  ipWhitelist.add(ip);
  ipBlacklist.delete(ip); // Remove from blacklist if present
}

/**
 * Add an IP to the blacklist
 */
export function addToBlacklist(ip: string): void {
  ipBlacklist.add(ip);
  ipWhitelist.delete(ip); // Remove from whitelist if present
}

/**
 * Remove an IP from the whitelist
 */
export function removeFromWhitelist(ip: string): void {
  ipWhitelist.delete(ip);
}

/**
 * Remove an IP from the blacklist
 */
export function removeFromBlacklist(ip: string): void {
  ipBlacklist.delete(ip);
}

/**
 * Get all whitelisted IPs
 */
export function getWhitelist(): string[] {
  return Array.from(ipWhitelist);
}

/**
 * Get all blacklisted IPs
 */
export function getBlacklist(): string[] {
  return Array.from(ipBlacklist);
}

// ============================================================================
// Skip function for whitelisted IPs
// ============================================================================

const skipIfWhitelisted = (req: Request): boolean => {
  const ip = keyGenerator(req);
  return isWhitelisted(ip);
};

// ============================================================================
// Rate Limiters for Different Tiers
// ============================================================================

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes
 * Applied to most API endpoints
 */
export const generalApiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skip: skipIfWhitelisted,
  handler: createLimitHandler('General API'),
  validate,
  message: {
    error: 'Too Many Requests',
    message: 'You have exceeded the 100 requests in 15 minutes limit.',
  },
});

/**
 * Auth Endpoints Rate Limiter
 * 5 attempts per 15 minutes
 * Applied to login, register, password reset endpoints
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skip: skipIfWhitelisted,
  handler: createLimitHandler('Authentication'),
  validate,
  message: {
    error: 'Too Many Requests',
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

/**
 * Booking Creation Rate Limiter
 * 10 requests per hour
 * Applied to booking creation endpoints
 */
export const bookingLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per window
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skip: skipIfWhitelisted,
  handler: createLimitHandler('Booking'),
  validate,
  message: {
    error: 'Too Many Requests',
    message: 'Too many booking requests. Please try again in an hour.',
  },
});

/**
 * Payment Endpoints Rate Limiter
 * 3 attempts per hour
 * Applied to payment processing endpoints
 */
export const paymentLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skip: skipIfWhitelisted,
  handler: createLimitHandler('Payment'),
  validate,
  message: {
    error: 'Too Many Requests',
    message: 'Too many payment attempts. Please try again in an hour.',
  },
});

/**
 * Contact Form Rate Limiter
 * 5 submissions per hour
 * Applied to contact form endpoints
 */
export const contactLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 submissions per window
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skip: skipIfWhitelisted,
  handler: createLimitHandler('Contact Form'),
  validate,
  message: {
    error: 'Too Many Requests',
    message: 'Too many contact form submissions. Please try again later.',
  },
});

/**
 * Newsletter Subscription Rate Limiter
 * 3 attempts per hour
 * Applied to newsletter subscription endpoints
 */
export const newsletterLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  standardHeaders,
  legacyHeaders,
  keyGenerator,
  skip: skipIfWhitelisted,
  handler: createLimitHandler('Newsletter'),
  validate,
  message: {
    error: 'Too Many Requests',
    message: 'Too many subscription attempts. Please try again later.',
  },
});

// ============================================================================
// IP Blacklist Middleware
// ============================================================================

/**
 * Middleware to block blacklisted IPs
 * Should be applied early in the middleware chain
 */
export function ipBlacklistMiddleware(req: Request, res: Response, next: Function): void {
  const ip = keyGenerator(req);
  
  if (isBlacklisted(ip)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Your IP address has been blocked.',
    });
    return;
  }
  
  next();
}

// ============================================================================
// Redis-based Rate Limiting (for production multi-instance support)
// ============================================================================

/**
 * Create a Redis-based rate limiter for production environments
 * This allows rate limiting to work across multiple server instances
 * 
 * Usage:
 * import Redis from 'ioredis';
 * import { RedisStore } from 'rate-limit-redis';
 * 
 * const redis = new Redis(process.env.REDIS_URL);
 * const store = new RedisStore({ sendCommand: (...args) => redis.call(...args) });
 * 
 * const limiter = createRedisRateLimiter({
 *   windowMs: 15 * 60 * 1000,
 *   max: 100,
 *   store,
 * });
 */
export function createRedisRateLimiter(options: Partial<Options>): RateLimitRequestHandler {
  return rateLimit({
    standardHeaders,
    legacyHeaders,
    keyGenerator,
    skip: skipIfWhitelisted,
    ...options,
  });
}

// ============================================================================
// Export all limiters as a single object for convenience
// ============================================================================

export const rateLimiters = {
  general: generalApiLimiter,
  auth: authLimiter,
  booking: bookingLimiter,
  payment: paymentLimiter,
  contact: contactLimiter,
  newsletter: newsletterLimiter,
};

export default rateLimiters;
