import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import * as notifications from "./notifications";

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

        // Send notification
        const artist = await db.getArtistProfileById(input.artistId);
        const client = await db.getUserById(ctx.user.id);
        if (artist && client) {
          await notifications.notifyBookingCreated({
            artistName: artist.displayName!,
            clientName: client.name!,
            serviceDescription: input.serviceDescription,
            requestedDate: input.requestedDate,
            budget: input.budget || null,
          });
        }

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

        // Send notification based on status change
        const artist = await db.getArtistProfileById(booking.artistId);
        const client = await db.getUserById(booking.clientId);
        if (artist && client) {
          if (input.status === "accepted") {
            await notifications.notifyBookingAccepted({
              artistName: artist.displayName!,
              clientName: client.name!,
              serviceDescription: booking.serviceDescription!,
              requestedDate: booking.requestedDate,
            });
          } else if (input.status === "declined") {
            await notifications.notifyBookingDeclined({
              artistName: artist.displayName!,
              clientName: client.name!,
              serviceDescription: booking.serviceDescription!,
            });
          } else if (input.status === "cancelled") {
            const cancelledBy = profile && booking.artistId === profile.id ? "artist" : "client";
            await notifications.notifyBookingCancelled({
              artistName: artist.displayName!,
              clientName: client.name!,
              serviceDescription: booking.serviceDescription!,
              cancelledBy,
            });
          } else if (input.status === "completed") {
            await notifications.notifyBookingCompleted({
              artistName: artist.displayName!,
              clientName: client.name!,
              serviceDescription: booking.serviceDescription!,
            });
          }
        }

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

  services: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        durationMinutes: z.number().min(15),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        await db.createService({
          artistId: profile.id,
          name: input.name,
          description: input.description || null,
          price: input.price,
          durationMinutes: input.durationMinutes,
        });

        return { success: true };
      }),

    getByArtist: publicProcedure
      .input(z.object({ artistId: z.number() }))
      .query(async ({ input }) => {
        return await db.getServicesByArtistId(input.artistId);
      }),

    update: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        durationMinutes: z.number().min(15).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const service = await db.getServiceById(input.serviceId);
        if (!service) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Service not found" });
        }

        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile || service.artistId !== profile.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to update this service" });
        }

        await db.updateService(input.serviceId, {
          name: input.name,
          description: input.description,
          price: input.price,
          durationMinutes: input.durationMinutes,
        });

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ serviceId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const service = await db.getServiceById(input.serviceId);
        if (!service) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Service not found" });
        }

        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile || service.artistId !== profile.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to delete this service" });
        }

        await db.deleteService(input.serviceId);
        return { success: true };
      }),
  }),

  availability: router({
    // Availability Windows Management
    createWindow: protectedProcedure
      .input(z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        timezone: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        try {
          await db.createAvailabilityWindow({
            artistId: profile.id,
            dayOfWeek: input.dayOfWeek,
            startTime: input.startTime,
            endTime: input.endTime,
            timezone: input.timezone,
          });

          // Clear cache after creating new availability
          db.clearAvailabilityCache(profile.id);

          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to create availability window",
          });
        }
      }),

    getWindows: protectedProcedure
      .query(async ({ ctx }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        return await db.getAvailabilityWindowsByArtistId(profile.id);
      }),

    updateWindow: protectedProcedure
      .input(z.object({
        windowId: z.number(),
        dayOfWeek: z.number().min(0).max(6).optional(),
        startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
        endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
        timezone: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        try {
          await db.updateAvailabilityWindow(input.windowId, {
            dayOfWeek: input.dayOfWeek,
            startTime: input.startTime,
            endTime: input.endTime,
            timezone: input.timezone,
            isActive: input.isActive,
          });

          // Clear cache after updating availability
          db.clearAvailabilityCache(profile.id);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to update availability window",
          });
        }

        return { success: true };
      }),

    deleteWindow: protectedProcedure
      .input(z.object({ windowId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        await db.deleteAvailabilityWindow(input.windowId);
        return { success: true };
      }),

    // Blackout Dates Management
    createBlackout: protectedProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        await db.createBlackoutDate({
          artistId: profile.id,
          startDate: input.startDate,
          endDate: input.endDate,
          reason: input.reason || null,
        });

        return { success: true };
      }),

    getBlackouts: protectedProcedure
      .query(async ({ ctx }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        return await db.getBlackoutDatesByArtistId(profile.id);
      }),

    deleteBlackout: protectedProcedure
      .input(z.object({ blackoutId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        await db.deleteBlackoutDate(input.blackoutId);
        return { success: true };
      }),

    // Artist Settings Management
    getSettings: protectedProcedure
      .query(async ({ ctx }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        return await db.getArtistSettings(profile.id);
      }),

    updateSettings: protectedProcedure
      .input(z.object({
        bookingBufferMinutes: z.number().min(0).optional(),
        advanceBookingDays: z.number().min(1).max(365).optional(),
        cancellationPolicy: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getArtistProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
        }

        // Check if settings exist
        const existingSettings = await db.getArtistSettings(profile.id);
        
        if (!existingSettings) {
          // Create new settings
          await db.createArtistSettings({
            artistId: profile.id,
            bookingBufferMinutes: input.bookingBufferMinutes,
            advanceBookingDays: input.advanceBookingDays,
            cancellationPolicy: input.cancellationPolicy || null,
          });
        } else {
          // Update existing settings
          await db.updateArtistSettings(profile.id, {
            bookingBufferMinutes: input.bookingBufferMinutes,
            advanceBookingDays: input.advanceBookingDays,
            cancellationPolicy: input.cancellationPolicy,
          });
        }

        return { success: true };
      }),

    // Availability Calculation
    getAvailableSlots: publicProcedure
      .input(z.object({
        artistId: z.number(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        durationMinutes: z.number().min(15),
      }))
      .query(async ({ input }) => {
        return await db.calculateAvailableSlots(
          input.artistId,
          input.startDate,
          input.endDate,
          input.durationMinutes
        );
      }),

    checkSlotAvailability: publicProcedure
      .input(z.object({
        artistId: z.number(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        durationMinutes: z.number().min(15),
      }))
      .query(async ({ input }) => {
        const isAvailable = await db.isSlotAvailable(
          input.artistId,
          input.date,
          input.startTime,
          input.durationMinutes
        );
        return { available: isAvailable };
      }),

    // Slot Lock Management
    createSlotLock: protectedProcedure
      .input(z.object({
        artistId: z.number(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
        durationMinutes: z.number().min(15),
        lockDurationMinutes: z.number().min(5).max(30).default(10),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if slot is available
        const isAvailable = await db.isSlotAvailable(
          input.artistId,
          input.date,
          input.startTime,
          input.durationMinutes
        );

        if (!isAvailable) {
          throw new TRPCError({ code: "CONFLICT", message: "This time slot is no longer available" });
        }

        // Create slot lock
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + input.lockDurationMinutes);

        await db.createSlotLock({
          artistId: input.artistId,
          date: input.date,
          startTime: input.startTime,
          durationMinutes: input.durationMinutes,
          lockedBy: ctx.user.id,
          expiresAt,
        });

        return { success: true, expiresAt };
      }),

    releaseSlotLock: protectedProcedure
      .input(z.object({ lockId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const lock = await db.getSlotLock(input.lockId);
        if (!lock) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Slot lock not found" });
        }

        if (lock.lockedBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to release this lock" });
        }

        await db.deleteSlotLock(input.lockId);
        return { success: true };
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
