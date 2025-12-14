/**
 * Test-Only Authentication Endpoint
 * 
 * This endpoint is ONLY enabled in test/development environments
 * and allows Playwright tests to authenticate without going through OAuth.
 * 
 * ⚠️ NEVER enable this in production!
 */

import { Router } from 'express';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sdk } from './_core/sdk';
import { getSessionCookieOptions } from './_core/cookies';

const router = Router();
const COOKIE_NAME = "session";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Only enable in test/development
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

if (isTestEnvironment) {
  /**
   * POST /api/test-auth/login
   * 
   * Authenticates a test user by openId and returns a session cookie
   * 
   * Body: { openId: string }
   * Returns: { success: boolean, user: User }
   */
  router.post('/login', async (req, res) => {
    try {
      const { openId } = req.body;

      if (!openId) {
        return res.status(400).json({ error: 'openId is required' });
      }

      const db = await getDb();
      
      if (!db) {
        return res.status(500).json({ error: 'Database not available' });
      }
      
      // Find user by openId
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.openId, openId))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create session token using Manus SDK (same as OAuth flow)
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set session cookie (same as OAuth callback)
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return res.json({
        success: true,
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Test auth error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  });

  /**
   * POST /api/test-auth/logout
   * 
   * Clears the session cookie
   */
  router.post('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    return res.json({ success: true });
  });

  console.log('⚠️  Test authentication endpoints enabled at /api/test-auth/*');
  console.log('   This should NEVER be enabled in production!');
} else {
  // In production, return 404 for all test-auth routes
  router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}

export default router;
