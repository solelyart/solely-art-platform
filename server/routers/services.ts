import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const servicesRouter = router({
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
});
