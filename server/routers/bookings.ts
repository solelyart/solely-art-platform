import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import * as notifications from "../notifications";

export const bookingsRouter = router({
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
});
