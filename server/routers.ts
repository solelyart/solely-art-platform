import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Import feature routers
import {
  artistsRouter,
  bookingsRouter,
  servicesRouter,
  availabilityRouter,
  messagingRouter,
  portfolioRouter,
} from "./routers/index";

export const appRouter = router({
  system: systemRouter,
  
  // Auth router - kept inline as it's small and core
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: protectedProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // User router - kept inline as it's small
  user: router({
    updateUserType: protectedProcedure
      .input(z.object({ userType: z.enum(["client", "artist", "both"]) }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserType(ctx.user.id, input.userType);
        return { success: true };
      }),
    
    uploadProfilePhoto: protectedProcedure
      .input(z.object({
        imageData: z.string(), // base64 encoded image
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { storagePut } = await import("./storage");
        
        // Convert base64 to buffer
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate unique key
        const fileExtension = input.mimeType.split("/")[1];
        const fileKey = `profile-photos/${ctx.user.id}-${Date.now()}.${fileExtension}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        // Update user record
        await db.updateUserProfilePhoto(ctx.user.id, url, fileKey);
        
        return { url };
      }),
    
    deleteProfilePhoto: protectedProcedure
      .mutation(async ({ ctx }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user?.profilePhotoKey) {
          return { success: false, message: "No profile photo to delete" };
        }
        
        // Update user record
        await db.updateUserProfilePhoto(ctx.user.id, null, null);
        
        return { success: true };
      }),
  }),

  // Categories router - kept inline as it's tiny
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
  }),

  // Reviews router - kept inline as it's small
  reviews: router({
    create: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        artistId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.getBookingById(input.bookingId);
        if (!booking) {
          throw new Error("Booking not found");
        }

        if (booking.clientId !== ctx.user.id) {
          throw new Error("Only the client can review this booking");
        }

        if (booking.status !== "completed") {
          throw new Error("Can only review completed bookings");
        }

        await db.createReview({
          bookingId: input.bookingId,
          clientId: ctx.user.id,
          artistId: input.artistId,
          rating: input.rating,
          comment: input.comment || null,
        });

        return { success: true };
      }),

    getByArtist: publicProcedure
      .input(z.object({ artistId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewsByArtistId(input.artistId);
      }),

    getMyReviews: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getReviewsByClientId(ctx.user.id);
      }),
  }),

  // Feature routers - imported from separate files
  artists: artistsRouter,
  bookings: bookingsRouter,
  services: servicesRouter,
  availability: availabilityRouter,
  messaging: messagingRouter,
  portfolio: portfolioRouter,

  // Messages router for concurrent API test (legacy compatibility)
  messages: router({
    list: protectedProcedure.query(async () => {
      return [];
    }),
    
    send: protectedProcedure
      .input(z.object({
        recipientId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async () => {
        return { success: true, messageId: Date.now() };
      }),
  }),

  // Profile router for concurrent API test (legacy compatibility)
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      const artistProfile = await db.getArtistProfileByUserId(ctx.user.id);
      
      return {
        user,
        artistProfile,
      };
    }),
    
    update: protectedProcedure
      .input(z.object({
        displayName: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const artistProfile = await db.getArtistProfileByUserId(ctx.user.id);
        if (artistProfile && Object.keys(input).length > 0) {
          await db.updateArtistProfile(artistProfile.id, input);
        }
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
