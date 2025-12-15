import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const availabilityRouter = router({
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

  getSettingsByArtist: publicProcedure
    .input(z.object({ artistId: z.number() }))
    .query(async ({ input }) => {
      return await db.getArtistSettings(input.artistId);
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
});
