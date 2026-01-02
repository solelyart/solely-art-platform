// ============================================================================
// Security Middleware Exports
// ============================================================================

// Rate Limiting
export {
  generalApiLimiter,
  authLimiter,
  bookingLimiter,
  paymentLimiter,
  contactLimiter,
  newsletterLimiter,
  rateLimiters,
  ipBlacklistMiddleware,
  isWhitelisted,
  isBlacklisted,
  addToWhitelist,
  addToBlacklist,
  removeFromWhitelist,
  removeFromBlacklist,
  getWhitelist,
  getBlacklist,
  createRedisRateLimiter,
} from './rateLimiter';

// XSS Sanitization
export {
  sanitizePlainText,
  sanitizeBasicText,
  sanitizeRichText,
  sanitizeExtendedRichText,
  sanitizeEmail,
  sanitizeUrl,
  sanitizePhone,
  sanitizeNumber,
  sanitizeInteger,
  sanitizeArtistBio,
  sanitizeReviewComment,
  sanitizeMessage,
  sanitizeServiceDescription,
  sanitizeNotes,
  sanitizeUserName,
  sanitizeBookingNotes,
  sanitizeObject,
  sanitizers,
} from './sanitizer';

// Security Headers
export {
  securityHeaders,
  devSecurityHeaders,
  customSecurityHeaders,
  getSecurityMiddleware,
} from './securityHeaders';
