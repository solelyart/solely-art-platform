import { Resend } from "resend";

// Initialize Resend with API key from environment
// Use a placeholder if not set - actual sending will fail gracefully
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Default sender email (using Resend's onboarding domain for testing)
const FROM_EMAIL = process.env.FROM_EMAIL || "Solely Art <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "delivered@resend.dev";

interface ContactFormData {
  name: string;
  email: string;
  category: string;
  message: string;
}

interface NewsletterSubscription {
  email: string;
  name?: string;
}

/**
 * Send contact form inquiry to the site owner
 */
export async function sendContactFormEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("[Email] Resend API key not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }
  
  try {
    const { name, email, category, message } = data;
    
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      replyTo: email,
      subject: `[Solely Art] New ${category} Inquiry from ${name}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1F1F1F; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; margin: 0;">
              Solely Art
            </h1>
            <p style="color: #6F9E9A; font-size: 12px; margin: 5px 0 0 0;">Curated Connections</p>
          </div>
          
          <div style="background-color: #F3F1ED; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #1F1F1F; font-size: 20px; margin: 0 0 20px 0;">New Contact Form Submission</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #48484A; font-size: 14px; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #1F1F1F; font-size: 14px; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #48484A; font-size: 14px;">Email:</td>
                <td style="padding: 8px 0; color: #1F1F1F; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #6F9E9A; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #48484A; font-size: 14px;">Category:</td>
                <td style="padding: 8px 0; color: #1F1F1F; font-size: 14px;">${category}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #FFFFFF; border: 1px solid #DAD6CF; border-radius: 12px; padding: 24px;">
            <h3 style="color: #1F1F1F; font-size: 16px; margin: 0 0 12px 0;">Message:</h3>
            <p style="color: #48484A; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #DAD6CF;">
            <p style="color: #48484A; font-size: 12px; margin: 0;">
              This email was sent from the Solely Art contact form.
            </p>
            <p style="color: #48484A; font-size: 12px; margin: 5px 0 0 0;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission - Solely Art

Name: ${name}
Email: ${email}
Category: ${category}

Message:
${message}

---
This email was sent from the Solely Art contact form.
Reply directly to this email to respond to ${name}.
      `.trim(),
    });

    if (error) {
      console.error("[Email] Failed to send contact form email:", error);
      return { success: false, error: error.message };
    }

    console.log("[Email] Contact form email sent successfully:", result?.id);
    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending contact form email:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Send welcome email to new newsletter subscriber
 */
export async function sendNewsletterWelcomeEmail(data: NewsletterSubscription): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("[Email] Resend API key not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }
  
  try {
    const { email, name } = data;
    const greeting = name ? `Hi ${name}` : "Hi there";
    
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Welcome to the Solely Art Newsletter!",
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1F1F1F; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; margin: 0;">
              Solely Art
            </h1>
            <p style="color: #6F9E9A; font-size: 12px; margin: 5px 0 0 0;">Curated Connections</p>
          </div>
          
          <div style="background-color: #F3F1ED; border-radius: 12px; padding: 32px; text-align: center;">
            <h2 style="color: #1F1F1F; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; margin: 0 0 16px 0;">
              Welcome to Our Community!
            </h2>
            <p style="color: #48484A; font-size: 16px; line-height: 1.6; margin: 0;">
              ${greeting}, thank you for subscribing to the Solely Art newsletter.
            </p>
          </div>
          
          <div style="padding: 24px 0;">
            <p style="color: #48484A; font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
              You're now part of a distinguished community where exceptional artistry meets discerning clientele.
            </p>
            <p style="color: #48484A; font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
              Here's what you can expect from us:
            </p>
            <ul style="color: #48484A; font-size: 14px; line-height: 1.8; margin: 0 0 16px 0; padding-left: 20px;">
              <li>Featured artist spotlights and interviews</li>
              <li>Exclusive early access to new artists on the platform</li>
              <li>Creative inspiration and industry insights</li>
              <li>Special offers and promotions</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://solelyart.com/browse" 
               style="display: inline-block; background-color: #6F9E9A; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 500;">
              Explore Artists
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #DAD6CF;">
            <p style="color: #48484A; font-size: 12px; margin: 0;">
              © 2025 Solely Art. All Rights Reserved.
            </p>
            <p style="color: #48484A; font-size: 12px; margin: 5px 0 0 0;">
              Solely Art™ is a trademark of Solely Art.
            </p>
          </div>
        </div>
      `,
      text: `
Welcome to the Solely Art Newsletter!

${greeting}, thank you for subscribing to the Solely Art newsletter.

You're now part of a distinguished community where exceptional artistry meets discerning clientele.

Here's what you can expect from us:
- Featured artist spotlights and interviews
- Exclusive early access to new artists on the platform
- Creative inspiration and industry insights
- Special offers and promotions

Visit https://solelyart.com/browse to explore our artists.

---
© 2025 Solely Art. All Rights Reserved.
Solely Art™ is a trademark of Solely Art.
      `.trim(),
    });

    if (error) {
      console.error("[Email] Failed to send newsletter welcome email:", error);
      return { success: false, error: error.message };
    }

    console.log("[Email] Newsletter welcome email sent successfully:", result?.id);
    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending newsletter welcome email:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Notify owner of new newsletter subscription
 */
export async function notifyOwnerOfSubscription(data: NewsletterSubscription): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("[Email] Resend API key not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }
  
  try {
    const { email, name } = data;
    
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      subject: `[Solely Art] New Newsletter Subscriber: ${email}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1F1F1F; font-size: 20px; margin: 0 0 20px 0;">New Newsletter Subscriber</h2>
          <div style="background-color: #F3F1ED; border-radius: 12px; padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #48484A; font-size: 14px; width: 100px;">Email:</td>
                <td style="padding: 8px 0; color: #1F1F1F; font-size: 14px;">${email}</td>
              </tr>
              ${name ? `
              <tr>
                <td style="padding: 8px 0; color: #48484A; font-size: 14px;">Name:</td>
                <td style="padding: 8px 0; color: #1F1F1F; font-size: 14px;">${name}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #48484A; font-size: 14px;">Date:</td>
                <td style="padding: 8px 0; color: #1F1F1F; font-size: 14px;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
      text: `New Newsletter Subscriber\n\nEmail: ${email}${name ? `\nName: ${name}` : ''}\nDate: ${new Date().toLocaleString()}`,
    });

    if (error) {
      console.error("[Email] Failed to notify owner of subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Email] Error notifying owner of subscription:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
