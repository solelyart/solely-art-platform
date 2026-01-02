import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const artistsRouter = router({
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
});
