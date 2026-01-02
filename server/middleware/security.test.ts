import { describe, it, expect } from 'vitest';
import {
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
  sanitizeObject,
} from './sanitizer';

import {
  isWhitelisted,
  isBlacklisted,
  addToWhitelist,
  addToBlacklist,
  removeFromWhitelist,
  removeFromBlacklist,
  getWhitelist,
  getBlacklist,
} from './rateLimiter';

// ============================================================================
// XSS Sanitization Tests
// ============================================================================

describe('XSS Sanitization', () => {
  describe('sanitizePlainText', () => {
    it('should remove all HTML tags', () => {
      expect(sanitizePlainText('<script>alert("xss")</script>')).toBe('');
      expect(sanitizePlainText('<b>bold</b>')).toBe('bold');
      expect(sanitizePlainText('<a href="http://evil.com">click</a>')).toBe('click');
    });

    it('should handle null and undefined', () => {
      expect(sanitizePlainText(null)).toBe('');
      expect(sanitizePlainText(undefined)).toBe('');
    });

    it('should trim whitespace', () => {
      expect(sanitizePlainText('  hello world  ')).toBe('hello world');
    });

    it('should preserve plain text', () => {
      expect(sanitizePlainText('Hello, World!')).toBe('Hello, World!');
    });
  });

  describe('sanitizeBasicText', () => {
    it('should allow basic formatting tags', () => {
      expect(sanitizeBasicText('<b>bold</b>')).toBe('<b>bold</b>');
      expect(sanitizeBasicText('<i>italic</i>')).toBe('<i>italic</i>');
      expect(sanitizeBasicText('<em>emphasis</em>')).toBe('<em>emphasis</em>');
      expect(sanitizeBasicText('<strong>strong</strong>')).toBe('<strong>strong</strong>');
    });

    it('should remove script tags', () => {
      expect(sanitizeBasicText('<script>alert("xss")</script>')).toBe('');
    });

    it('should remove onclick handlers', () => {
      const input = '<b onclick="alert(\'xss\')">click me</b>';
      expect(sanitizeBasicText(input)).toBe('<b>click me</b>');
    });

    it('should remove links', () => {
      expect(sanitizeBasicText('<a href="http://evil.com">click</a>')).toBe('click');
    });
  });

  describe('sanitizeRichText', () => {
    it('should allow paragraph and heading tags', () => {
      expect(sanitizeRichText('<p>paragraph</p>')).toBe('<p>paragraph</p>');
      expect(sanitizeRichText('<h1>heading</h1>')).toBe('<h1>heading</h1>');
    });

    it('should allow lists', () => {
      const input = '<ul><li>item 1</li><li>item 2</li></ul>';
      expect(sanitizeRichText(input)).toBe(input);
    });

    it('should allow links with href', () => {
      const input = '<a href="https://example.com">link</a>';
      const result = sanitizeRichText(input);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('should remove script tags', () => {
      expect(sanitizeRichText('<script>alert("xss")</script>')).toBe('');
    });

    it('should remove event handlers', () => {
      const input = '<p onmouseover="alert(\'xss\')">hover me</p>';
      expect(sanitizeRichText(input)).toBe('<p>hover me</p>');
    });

    it('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(\'xss\')">click</a>';
      const result = sanitizeRichText(input);
      expect(result).not.toContain('javascript:');
    });
  });

  describe('sanitizeExtendedRichText', () => {
    it('should allow images', () => {
      const input = '<img src="https://example.com/image.jpg" alt="test">';
      const result = sanitizeExtendedRichText(input);
      expect(result).toContain('src="https://example.com/image.jpg"');
      expect(result).toContain('alt="test"');
    });

    it('should remove onerror handlers from images', () => {
      const input = '<img src="x" onerror="alert(\'xss\')">';
      const result = sanitizeExtendedRichText(input);
      expect(result).not.toContain('onerror');
    });
  });

  describe('sanitizeEmail', () => {
    it('should validate and return valid emails', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
      expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    });

    it('should return empty string for invalid emails', () => {
      expect(sanitizeEmail('not-an-email')).toBe('');
      expect(sanitizeEmail('missing@domain')).toBe('');
      expect(sanitizeEmail('@nodomain.com')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(sanitizeEmail(null)).toBe('');
      expect(sanitizeEmail(undefined)).toBe('');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow http and https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should allow mailto URLs', () => {
      expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
    });

    it('should reject javascript URLs', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
    });

    it('should add https to URLs without protocol', () => {
      expect(sanitizeUrl('example.com')).toBe('https://example.com');
    });
  });

  describe('sanitizePhone', () => {
    it('should keep digits and formatting characters', () => {
      expect(sanitizePhone('+1 (555) 123-4567')).toBe('+1 (555) 123-4567');
      expect(sanitizePhone('555-123-4567')).toBe('555-123-4567');
    });

    it('should remove letters and special characters', () => {
      expect(sanitizePhone('555-ABC-4567')).toBe('555--4567');
    });
  });

  describe('sanitizeNumber', () => {
    it('should parse valid numbers', () => {
      expect(sanitizeNumber('123')).toBe(123);
      expect(sanitizeNumber('123.45')).toBe(123.45);
      expect(sanitizeNumber(123)).toBe(123);
    });

    it('should return null for invalid numbers', () => {
      expect(sanitizeNumber('not a number')).toBe(null);
      expect(sanitizeNumber('')).toBe(null);
      expect(sanitizeNumber(null)).toBe(null);
    });
  });

  describe('sanitizeInteger', () => {
    it('should return integers', () => {
      expect(sanitizeInteger('123.7')).toBe(123);
      expect(sanitizeInteger(123.9)).toBe(123);
    });
  });

  describe('Field-specific sanitizers', () => {
    it('sanitizeArtistBio should use rich text sanitization', () => {
      const bio = '<p>I am an artist</p><script>alert("xss")</script>';
      const result = sanitizeArtistBio(bio);
      expect(result).toContain('<p>I am an artist</p>');
      expect(result).not.toContain('script');
    });

    it('sanitizeReviewComment should use basic text sanitization', () => {
      const comment = '<b>Great work!</b><script>alert("xss")</script>';
      const result = sanitizeReviewComment(comment);
      expect(result).toBe('<b>Great work!</b>');
    });

    it('sanitizeMessage should use basic text sanitization', () => {
      const message = 'Hello <b>there</b>!';
      expect(sanitizeMessage(message)).toBe('Hello <b>there</b>!');
    });

    it('sanitizeServiceDescription should use extended rich text', () => {
      const desc = '<p>Service</p><img src="test.jpg" alt="test">';
      const result = sanitizeServiceDescription(desc);
      expect(result).toContain('<p>Service</p>');
      expect(result).toContain('<img');
    });

    it('sanitizeNotes should use basic text sanitization', () => {
      const notes = 'Important <b>note</b>';
      expect(sanitizeNotes(notes)).toBe('Important <b>note</b>');
    });

    it('sanitizeUserName should use plain text sanitization', () => {
      // DOMPurify removes script tags and their content entirely
      expect(sanitizeUserName('<script>John</script>')).toBe('');
      expect(sanitizeUserName('<b>John</b>')).toBe('John');
      expect(sanitizeUserName('John Doe')).toBe('John Doe');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize multiple fields based on config', () => {
      const input = {
        name: '<script>John</script>',
        bio: '<p>About me</p><script>xss</script>',
        email: 'TEST@EXAMPLE.COM',
        website: 'example.com',
        id: 123,
      };

      const result = sanitizeObject(input, {
        name: 'plain',
        bio: 'rich',
        email: 'email',
        website: 'url',
        id: 'skip',
      });

      // Script tags and content are removed entirely by DOMPurify
      expect(result.name).toBe('');
      expect(result.bio).toContain('<p>About me</p>');
      expect(result.bio).not.toContain('script');
      expect(result.email).toBe('test@example.com');
      expect(result.website).toBe('https://example.com');
      expect(result.id).toBe(123);
    });
  });
});

// ============================================================================
// IP Whitelist/Blacklist Tests
// ============================================================================

describe('IP Whitelist/Blacklist', () => {
  const testIp = '192.168.1.100';

  describe('Whitelist operations', () => {
    it('should add and check whitelist', () => {
      addToWhitelist(testIp);
      expect(isWhitelisted(testIp)).toBe(true);
      expect(getWhitelist()).toContain(testIp);
    });

    it('should remove from whitelist', () => {
      addToWhitelist(testIp);
      removeFromWhitelist(testIp);
      expect(isWhitelisted(testIp)).toBe(false);
    });
  });

  describe('Blacklist operations', () => {
    it('should add and check blacklist', () => {
      addToBlacklist(testIp);
      expect(isBlacklisted(testIp)).toBe(true);
      expect(getBlacklist()).toContain(testIp);
    });

    it('should remove from blacklist', () => {
      addToBlacklist(testIp);
      removeFromBlacklist(testIp);
      expect(isBlacklisted(testIp)).toBe(false);
    });
  });

  describe('Mutual exclusion', () => {
    it('should remove from blacklist when adding to whitelist', () => {
      addToBlacklist(testIp);
      addToWhitelist(testIp);
      expect(isWhitelisted(testIp)).toBe(true);
      expect(isBlacklisted(testIp)).toBe(false);
    });

    it('should remove from whitelist when adding to blacklist', () => {
      addToWhitelist(testIp);
      addToBlacklist(testIp);
      expect(isBlacklisted(testIp)).toBe(true);
      expect(isWhitelisted(testIp)).toBe(false);
    });
  });
});
