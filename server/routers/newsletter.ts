import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { 
  createNewsletterSubscriber, 
  getNewsletterSubscriber,
  unsubscribeNewsletter,
  getActiveSubscribers,
  getSubscriberCount
} from "../db";
import { sendNewsletterWelcomeEmail, notifyOwnerOfSubscription } from "../email";

export const newsletterRouter = router({
  /**
   * Subscribe to the newsletter
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address").max(320),
        name: z.string().max(255).optional(),
        source: z.string().max(50).optional().default("footer"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createNewsletterSubscriber({
        email: input.email,
        name: input.name,
        source: input.source,
      });

      // Check if already subscribed
      if ((result as any).alreadySubscribed) {
        return {
          success: true,
          message: "You're already subscribed to our newsletter!",
          alreadySubscribed: true,
        };
      }

      // Check if reactivated
      if ((result as any).reactivated) {
        // Send welcome email for reactivation
        await sendNewsletterWelcomeEmail({ email: input.email, name: input.name });
        await notifyOwnerOfSubscription({ email: input.email, name: input.name });
        
        return {
          success: true,
          message: "Welcome back! You've been resubscribed to our newsletter.",
          reactivated: true,
        };
      }

      // New subscription - send welcome email
      await sendNewsletterWelcomeEmail({ email: input.email, name: input.name });
      await notifyOwnerOfSubscription({ email: input.email, name: input.name });

      return {
        success: true,
        message: "Thank you for subscribing! Check your email for a welcome message.",
      };
    }),

  /**
   * Unsubscribe from the newsletter
   */
  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const subscriber = await getNewsletterSubscriber(input.email);
      
      if (!subscriber) {
        return {
          success: false,
          message: "Email not found in our subscriber list.",
        };
      }

      if (!subscriber.isActive) {
        return {
          success: true,
          message: "You're already unsubscribed from our newsletter.",
        };
      }

      await unsubscribeNewsletter(input.email);
      
      return {
        success: true,
        message: "You've been successfully unsubscribed from our newsletter.",
      };
    }),

  /**
   * Check subscription status
   */
  checkStatus: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .query(async ({ input }) => {
      const subscriber = await getNewsletterSubscriber(input.email);
      
      return {
        isSubscribed: subscriber?.isActive ?? false,
        subscribedAt: subscriber?.subscribedAt,
      };
    }),

  /**
   * Get subscriber count (for display purposes)
   */
  getCount: publicProcedure.query(async () => {
    const count = await getSubscriberCount();
    return { count };
  }),

  /**
   * Get all active subscribers (admin only)
   */
  listSubscribers: publicProcedure.query(async () => {
    return await getActiveSubscribers();
  }),
});
