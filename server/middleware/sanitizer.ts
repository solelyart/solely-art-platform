import DOMPurify from 'isomorphic-dompurify';

// ============================================================================
// XSS Prevention & Input Sanitization Configuration
// ============================================================================

/**
 * Allowed HTML tags for different content types
 * More restrictive for user-generated content, more permissive for rich text
 */

// Basic text only - no HTML allowed
const PLAIN_TEXT_CONFIG = {
  ALLOWED_TAGS: [] as string[],
  ALLOWED_ATTR: [] as string[],
};

// Basic formatting only (for comments, reviews)
const BASIC_FORMAT_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br'],
  ALLOWED_ATTR: [] as string[],
};

// Rich text (for bios, descriptions)
const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'span',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ADD_ATTR: ['target'],
  FORCE_BODY: true,
};

// Extended rich text (for service descriptions with images)
const EXTENDED_RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: [
    ...RICH_TEXT_CONFIG.ALLOWED_TAGS,
    'img', 'figure', 'figcaption',
  ],
  ALLOWED_ATTR: [
    ...RICH_TEXT_CONFIG.ALLOWED_ATTR,
    'src', 'alt', 'title', 'width', 'height',
  ],
  ADD_ATTR: ['target'],
  FORCE_BODY: true,
};

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitize plain text - removes ALL HTML
 * Use for: names, titles, short inputs
 */
export function sanitizePlainText(input: string | null | undefined): string {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), PLAIN_TEXT_CONFIG);
}

/**
 * Sanitize text with basic formatting
 * Use for: comments, reviews, messages, notes
 */
export function sanitizeBasicText(input: string | null | undefined): string {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), BASIC_FORMAT_CONFIG);
}

/**
 * Sanitize rich text content
 * Use for: artist bios, about sections
 */
export function sanitizeRichText(input: string | null | undefined): string {
  if (!input) return '';
  
  // Add rel="noopener noreferrer" to all links for security
  const sanitized = DOMPurify.sanitize(input.trim(), RICH_TEXT_CONFIG);
  
  // Post-process to add security attributes to links
  return sanitized.replace(
    /<a\s+href=/gi,
    '<a rel="noopener noreferrer" target="_blank" href='
  );
}

/**
 * Sanitize extended rich text with images
 * Use for: service descriptions, portfolio descriptions
 */
export function sanitizeExtendedRichText(input: string | null | undefined): string {
  if (!input) return '';
  
  const sanitized = DOMPurify.sanitize(input.trim(), EXTENDED_RICH_TEXT_CONFIG);
  
  // Post-process to add security attributes to links
  return sanitized.replace(
    /<a\s+href=/gi,
    '<a rel="noopener noreferrer" target="_blank" href='
  );
}

/**
 * Sanitize email address
 * Validates and sanitizes email format
 */
export function sanitizeEmail(input: string | null | undefined): string {
  if (!input) return '';
  
  const trimmed = input.trim().toLowerCase();
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return '';
  }
  
  return sanitizePlainText(trimmed);
}

/**
 * Sanitize URL
 * Only allows http, https, and mailto protocols
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (!input) return '';
  
  const trimmed = input.trim();
  const lowerTrimmed = trimmed.toLowerCase();
  
  // Reject dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => lowerTrimmed.startsWith(protocol))) {
    return '';
  }
  
  // Check for allowed protocols
  const allowedProtocols = ['http://', 'https://', 'mailto:'];
  const hasAllowedProtocol = allowedProtocols.some(protocol => 
    lowerTrimmed.startsWith(protocol)
  );
  
  if (!hasAllowedProtocol) {
    // If no protocol and no colon (not a protocol), assume https
    if (!trimmed.includes(':')) {
      return sanitizePlainText(`https://${trimmed}`);
    }
    // Has a colon but not an allowed protocol - reject
    return '';
  }
  
  return sanitizePlainText(trimmed);
}

/**
 * Sanitize phone number
 * Removes all non-numeric characters except + for international
 */
export function sanitizePhone(input: string | null | undefined): string {
  if (!input) return '';
  
  // Keep only digits, +, and spaces
  return input.replace(/[^\d+\s\-()]/g, '').trim();
}

/**
 * Sanitize numeric input
 * Returns only numeric value or empty string
 */
export function sanitizeNumber(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined || input === '') return null;
  
  const num = typeof input === 'number' ? input : parseFloat(input);
  
  if (isNaN(num)) return null;
  
  return num;
}

/**
 * Sanitize integer input
 */
export function sanitizeInteger(input: string | number | null | undefined): number | null {
  const num = sanitizeNumber(input);
  if (num === null) return null;
  return Math.floor(num);
}

// ============================================================================
// Field-Specific Sanitizers
// ============================================================================

/**
 * Sanitize artist bio
 */
export function sanitizeArtistBio(bio: string | null | undefined): string {
  return sanitizeRichText(bio);
}

/**
 * Sanitize review comment
 */
export function sanitizeReviewComment(comment: string | null | undefined): string {
  return sanitizeBasicText(comment);
}

/**
 * Sanitize message content
 */
export function sanitizeMessage(message: string | null | undefined): string {
  return sanitizeBasicText(message);
}

/**
 * Sanitize service description
 */
export function sanitizeServiceDescription(description: string | null | undefined): string {
  return sanitizeExtendedRichText(description);
}

/**
 * Sanitize notes field
 */
export function sanitizeNotes(notes: string | null | undefined): string {
  return sanitizeBasicText(notes);
}

/**
 * Sanitize user name
 */
export function sanitizeUserName(name: string | null | undefined): string {
  return sanitizePlainText(name);
}

/**
 * Sanitize booking notes
 */
export function sanitizeBookingNotes(notes: string | null | undefined): string {
  return sanitizeBasicText(notes);
}

// ============================================================================
// Batch Sanitization
// ============================================================================

/**
 * Sanitize an object's string fields
 * Useful for sanitizing entire form submissions
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fieldConfig: Record<keyof T, 'plain' | 'basic' | 'rich' | 'extended' | 'email' | 'url' | 'phone' | 'skip'>
): T {
  const result = { ...obj };
  
  for (const [key, type] of Object.entries(fieldConfig)) {
    const value = obj[key as keyof T];
    
    if (typeof value !== 'string') continue;
    
    switch (type) {
      case 'plain':
        (result as Record<string, unknown>)[key] = sanitizePlainText(value);
        break;
      case 'basic':
        (result as Record<string, unknown>)[key] = sanitizeBasicText(value);
        break;
      case 'rich':
        (result as Record<string, unknown>)[key] = sanitizeRichText(value);
        break;
      case 'extended':
        (result as Record<string, unknown>)[key] = sanitizeExtendedRichText(value);
        break;
      case 'email':
        (result as Record<string, unknown>)[key] = sanitizeEmail(value);
        break;
      case 'url':
        (result as Record<string, unknown>)[key] = sanitizeUrl(value);
        break;
      case 'phone':
        (result as Record<string, unknown>)[key] = sanitizePhone(value);
        break;
      case 'skip':
      default:
        // Don't sanitize
        break;
    }
  }
  
  return result;
}

// ============================================================================
// Export all sanitizers
// ============================================================================

export const sanitizers = {
  plainText: sanitizePlainText,
  basicText: sanitizeBasicText,
  richText: sanitizeRichText,
  extendedRichText: sanitizeExtendedRichText,
  email: sanitizeEmail,
  url: sanitizeUrl,
  phone: sanitizePhone,
  number: sanitizeNumber,
  integer: sanitizeInteger,
  artistBio: sanitizeArtistBio,
  reviewComment: sanitizeReviewComment,
  message: sanitizeMessage,
  serviceDescription: sanitizeServiceDescription,
  notes: sanitizeNotes,
  userName: sanitizeUserName,
  bookingNotes: sanitizeBookingNotes,
  object: sanitizeObject,
};

export default sanitizers;
