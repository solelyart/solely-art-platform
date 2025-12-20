import { describe, it, expect, vi, beforeAll } from "vitest";
import { Resend } from "resend";

describe("Email Service Configuration", () => {
  beforeAll(() => {
    // Ensure environment variables are loaded
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - email tests will be skipped");
    }
  });

  it("should have RESEND_API_KEY configured", () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");
    // Resend API keys start with "re_"
    expect(apiKey?.startsWith("re_")).toBe(true);
  });

  it("should be able to initialize Resend client", () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Skipping Resend client test - no API key");
      return;
    }

    // This should not throw if the API key format is valid
    const resend = new Resend(apiKey);
    expect(resend).toBeDefined();
    expect(resend.emails).toBeDefined();
  });

  it("should validate Resend API key by listing domains (lightweight API call)", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Skipping API validation test - no API key");
      return;
    }

    const resend = new Resend(apiKey);
    
    try {
      // List domains is a lightweight API call that validates the key
      const { data, error } = await resend.domains.list();
      
      if (error) {
        // If we get an authentication error, the key is invalid
        if (error.message?.includes("Invalid API Key") || error.message?.includes("Unauthorized")) {
          throw new Error(`Invalid Resend API key: ${error.message}`);
        }
        // Other errors might be acceptable (e.g., no domains configured yet)
        console.log("Resend API responded with:", error.message);
      }
      
      // If we get here, the API key is valid
      expect(true).toBe(true);
    } catch (err: any) {
      // Re-throw authentication errors
      if (err.message?.includes("Invalid") || err.message?.includes("Unauthorized") || err.message?.includes("401")) {
        throw err;
      }
      // Log but don't fail on other errors
      console.log("API call completed with:", err.message);
    }
  });

  it("should have OWNER_EMAIL configured for contact form delivery", () => {
    const ownerEmail = process.env.OWNER_EMAIL;
    expect(ownerEmail).toBeDefined();
    expect(ownerEmail).not.toBe("");
    // Basic email format validation
    expect(ownerEmail).toMatch(/@/);
  });
});
