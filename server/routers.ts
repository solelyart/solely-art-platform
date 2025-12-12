import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: protectedProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

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
        
        // Note: Old photo remains in S3 for now
        // In production, implement a cleanup job to remove unused files
        
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
        
        // Note: File remains in S3 for now
        // In production, implement a cleanup job to remove unused files
        
        // Update user record
        await db.updateUserProfilePhoto(ctx.user.id, null, null);
        
        return { success: true };
      }),
  }),

  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
  }),

  artists: router({
    create: protectedProcedure
      .input(z.object({
        displayName: z.string().min(1),
        bio: z.string().optional(),
        location: z.string().optional(),
        categories: z.array(z.number()),
        hourlyRate: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update user type to artist if not already
        const user = await db.getUserById(ctx.user.id);
        if (user && user.userType === "client") {
          await db.updateUserType(ctx.user.id, "artist");
        }

        await db.createArtistProfile({
          userId: ctx.user.id,
          displayName: input.displayName,
          bio: input.bio || null,
          location: input.location || null,
          categories: JSON.stringify(input.categories),
          hourlyRate: input.hourlyRate || null,
          portfolioImages: null,
          isAvailable: true,
        });

        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        displayName: z.string().min(1).optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        categories: z.array(z.number()).optional(),
        hourlyRate: z.number().optional(),
        portfolioImages: z.array(z.string()).optional(),
        isAvailable: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        const updates: any = {};
        if (input.displayName !== undefined) updates.displayName = input.displayName;
        if (input.bio !== undefined) updates.bio = input.bio;
        if (input.location !== undefined) updates.location = input.location;
        if (input.categories !== undefined) updates.categories = JSON.stringify(input.categories);
        if (input.hourlyRate !== undefined) updates.hourlyRate = input.hourlyRate;
        if (input.portfolioImages !== undefined) updates.portfolioImages = JSON.stringify(input.portfolioImages);
        if (input.isAvailable !== undefined) updates.isAvailable = input.isAvailable;

        await db.updateArtistProfile(profile.id, updates);
        return { success: true };
      }),

    getMyProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getArtistProfileByUserId(ctx.user.id);
      if (!profile) return null;

      return {
        ...profile,
        categories: JSON.parse(profile.categories || "[]"),
        portfolioImages: JSON.parse(profile.portfolioImages || "[]"),
      };
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getArtistProfileById(input.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist not found" });
        }

        const rating = await db.getArtistAverageRating(input.id);

        return {
          ...profile,
          categories: JSON.parse(profile.categories || "[]"),
          portfolioImages: JSON.parse(profile.portfolioImages || "[]"),
          rating: rating || { average: 0, count: 0 },
        };
      }),

    search: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        location: z.string().optional(),
        searchTerm: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const artists = await db.searchArtists(input);
        
        return artists.map(artist => ({
          ...artist,
          categories: JSON.parse(artist.categories || "[]"),
          portfolioImages: JSON.parse(artist.portfolioImages || "[]"),
        }));
      }),

    list: publicProcedure.query(async () => {
      const artists = await db.getAllArtists();
      
      return artists.map(artist => ({
        ...artist,
        categories: JSON.parse(artist.categories || "[]"),
        portfolioImages: JSON.parse(artist.portfolioImages || "[]"),
      }));
    }),
  }),

  bookings: router({
    create: protectedProcedure
      .input(z.object({
        artistId: z.number(),
        serviceDescription: z.string().min(1),
        requestedDate: z.date(),
        budget: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createBooking({
          clientId: ctx.user.id,
          artistId: input.artistId,
          serviceDescription: input.serviceDescription,
          requestedDate: input.requestedDate,
          budget: input.budget || null,
          notes: input.notes || null,
          status: "pending",
        });

        return { success: true };
      }),

    getMyBookings: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) return [];

      if (user.userType === "artist" || user.userType === "both") {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (profile) {
          return await db.getBookingsByArtistId(profile.id);
        }
      }

      return await db.getBookingsByClientId(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        status: z.enum(["accepted", "declined", "completed", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.getBookingById(input.bookingId);
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        }

        // Verify user has permission to update this booking
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (booking.clientId !== ctx.user.id && (!profile || booking.artistId !== profile.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to update this booking" });
        }

        await db.updateBookingStatus(input.bookingId, input.status);
        return { success: true };
      }),
  }),

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
          throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        }

        if (booking.clientId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only the client can review this booking" });
        }

        if (booking.status !== "completed") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Can only review completed bookings" });
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
  }),

  portfolio: router({
    upload: protectedProcedure
      .input(z.object({
        imageData: z.string(), // base64 encoded image
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        const { storagePut } = await import("./storage");
        
        // Convert base64 to buffer
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate unique key
        const fileExtension = input.mimeType.split("/")[1];
        const fileKey = `portfolio/${profile.id}-${Date.now()}.${fileExtension}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        // Update portfolio images
        const currentImages = JSON.parse(profile.portfolioImages || "[]");
        const updatedImages = [...currentImages, url];
        await db.updateArtistProfile(profile.id, { portfolioImages: JSON.stringify(updatedImages) });
        
        return { success: true, url, images: updatedImages };
      }),

    delete: protectedProcedure
      .input(z.object({
        imageUrl: z.string().url(),
      }))
      .mutation(async ({ input, ctx }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        const currentImages = JSON.parse(profile.portfolioImages || "[]");
        const updatedImages = currentImages.filter((url: string) => url !== input.imageUrl);
        await db.updateArtistProfile(profile.id, { portfolioImages: JSON.stringify(updatedImages) });
        
        // Note: We're not deleting from S3 here to avoid breaking references
        // In production, you might want to implement a cleanup job
        
        return { success: true, images: updatedImages };
      }),
  }),
});

export type AppRouter = typeof appRouter;
