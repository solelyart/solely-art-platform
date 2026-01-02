import helmet from 'helmet';
import type { RequestHandler } from 'express';

// ============================================================================
// Security Headers Configuration
// ============================================================================

/**
 * Helmet middleware configuration for comprehensive security headers
 * 
 * This configuration sets up:
 * - Content Security Policy (CSP)
 * - HTTP Strict Transport Security (HSTS)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - X-XSS-Protection
 * - Referrer-Policy
 * - And more...
 */

// ============================================================================
// Content Security Policy (CSP) Configuration
// ============================================================================

const cspDirectives = {
  // Default source for all content
  defaultSrc: ["'self'"],
  
  // Script sources
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for some React inline scripts
    "'unsafe-eval'", // Required for development (remove in production if possible)
    "https://js.stripe.com", // Stripe payment scripts
    "https://www.google.com", // Google services
    "https://www.gstatic.com", // Google static content
    "https://maps.googleapis.com", // Google Maps
  ],
  
  // Style sources
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and inline styles
    "https://fonts.googleapis.com", // Google Fonts
  ],
  
  // Image sources
  imgSrc: [
    "'self'",
    "data:", // Data URLs for inline images
    "blob:", // Blob URLs for uploaded images
    "https:", // Allow all HTTPS images
    "https://*.stripe.com", // Stripe images
    "https://maps.googleapis.com", // Google Maps tiles
    "https://maps.gstatic.com", // Google Maps static
  ],
  
  // Font sources
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com", // Google Fonts
    "data:", // Data URLs for inline fonts
  ],
  
  // Connect sources (XHR, WebSocket, EventSource)
  connectSrc: [
    "'self'",
    "https://api.stripe.com", // Stripe API
    "https://maps.googleapis.com", // Google Maps API
    "https://*.manus.im", // Manus services
    "wss:", // WebSocket connections
  ],
  
  // Frame sources
  frameSrc: [
    "'self'",
    "https://js.stripe.com", // Stripe iframe
    "https://hooks.stripe.com", // Stripe webhooks
    "https://www.google.com", // Google reCAPTCHA
  ],
  
  // Object sources (plugins)
  objectSrc: ["'none'"],
  
  // Media sources
  mediaSrc: ["'self'", "https:", "blob:"],
  
  // Worker sources
  workerSrc: ["'self'", "blob:"],
  
  // Child sources (deprecated, use frameSrc and workerSrc)
  childSrc: ["'self'", "blob:"],
  
  // Form action destinations
  formAction: ["'self'"],
  
  // Frame ancestors (who can embed this page)
  frameAncestors: ["'self'"],
  
  // Base URI
  baseUri: ["'self'"],
  
  // Manifest sources
  manifestSrc: ["'self'"],
  
  // Upgrade insecure requests in production
  upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
};

// Remove null values from CSP directives
const cleanedCspDirectives = Object.fromEntries(
  Object.entries(cspDirectives).filter(([_, value]) => value !== null)
);

// ============================================================================
// Helmet Configuration
// ============================================================================

export const securityHeaders: RequestHandler = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: cleanedCspDirectives,
    reportOnly: false, // Set to true for testing without blocking
  },
  
  // HTTP Strict Transport Security (HSTS)
  // Forces HTTPS for 1 year, includes subdomains, allows preload list
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  
  // X-Frame-Options
  // Prevents clickjacking by disallowing framing
  frameguard: {
    action: 'sameorigin', // Allow same origin framing only
  },
  
  // X-Content-Type-Options
  // Prevents MIME type sniffing
  noSniff: true,
  
  // X-XSS-Protection
  // Legacy XSS protection (modern browsers use CSP instead)
  xssFilter: true,
  
  // Referrer-Policy
  // Controls referrer information sent with requests
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  
  // X-DNS-Prefetch-Control
  // Controls browser DNS prefetching
  dnsPrefetchControl: {
    allow: false,
  },
  
  // X-Download-Options
  // Prevents IE from executing downloads in site's context
  ieNoOpen: true,
  
  // X-Permitted-Cross-Domain-Policies
  // Restricts Adobe Flash and PDF cross-domain policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },
  
  // Origin-Agent-Cluster
  // Requests browser to isolate the origin
  originAgentCluster: true,
  
  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: false, // Disabled to allow third-party resources
  
  // Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: {
    policy: 'same-origin-allow-popups', // Allow popups for OAuth
  },
  
  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: {
    policy: 'cross-origin', // Allow cross-origin resource loading
  },
});

// ============================================================================
// Development-friendly Security Headers
// ============================================================================

/**
 * Less restrictive security headers for development
 * Use this during development to avoid CSP blocking issues
 */
export const devSecurityHeaders: RequestHandler = helmet({
  contentSecurityPolicy: false, // Disable CSP in development
  strictTransportSecurity: false, // Disable HSTS in development
  frameguard: {
    action: 'sameorigin',
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
});

// ============================================================================
// Custom Security Headers Middleware
// ============================================================================

/**
 * Additional custom security headers not covered by Helmet
 */
export const customSecurityHeaders: RequestHandler = (req, res, next) => {
  // Permissions-Policy (formerly Feature-Policy)
  // Controls which browser features can be used
  res.setHeader('Permissions-Policy', [
    'accelerometer=()',
    'camera=()',
    'geolocation=(self)',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=(self)',
    'usb=()',
  ].join(', '));
  
  // Cache-Control for API responses
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

// ============================================================================
// Combined Security Middleware
// ============================================================================

/**
 * Get the appropriate security headers based on environment
 */
export function getSecurityMiddleware(): RequestHandler[] {
  const isDev = process.env.NODE_ENV !== 'production';
  
  return [
    isDev ? devSecurityHeaders : securityHeaders,
    customSecurityHeaders,
  ];
}

// ============================================================================
// Export
// ============================================================================

export default securityHeaders;
