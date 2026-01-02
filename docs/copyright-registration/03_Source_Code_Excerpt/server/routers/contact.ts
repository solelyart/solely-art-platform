import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { 
  createContactSubmission, 
  getContactSubmissions, 
  updateContactSubmissionStatus,
  markContactEmailSent 
} from "../db";
import { sendContactFormEmail } from "../email";

export const contactRouter = router({
  /**
   * Submit a contact form inquiry
   */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(255),
        email: z.string().email("Invalid email address").max(320),
        category: z.string().min(1, "Category is required").max(100),
        message: z.string().min(10, "Message must be at least 10 characters").max(5000),
      })
    )
    .mutation(async ({ input }) => {
      // Save to database
      const submission = await createContactSubmission({
        name: input.name,
        email: input.email,
        category: input.category,
        message: input.message,
      });

      // Send email notification
      const emailResult = await sendContactFormEmail({
        name: input.name,
        email: input.email,
        category: input.category,
        message: input.message,
      });

      // Mark email as sent if successful
      if (emailResult.success) {
        await markContactEmailSent(submission.id);
      }

      return {
        success: true,
        id: submission.id,
        emailSent: emailResult.success,
      };
    }),

  /**
   * Get all contact submissions (admin only)
   */
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(["new", "read", "replied", "archived"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return await getContactSubmissions(input?.status);
    }),

  /**
   * Update contact submission status (admin only)
   */
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateContactSubmissionStatus(input.id, input.status);
      return { success: true };
    }),
});
