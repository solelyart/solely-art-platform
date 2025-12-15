import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const portfolioRouter = router({
  // Collections
  createCollection: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.getArtistProfileByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
      }
      return await db.createPortfolioCollection({
        artistId: profile.id,
        ...input,
      });
    }),

  getCollections: publicProcedure
    .input(z.object({ artistId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPortfolioCollectionsByArtistId(input.artistId);
    }),

  getMyCollections: protectedProcedure
    .query(async ({ ctx }) => {
      const profile = await db.getArtistProfileByUserId(ctx.user.id);
      if (!profile) return [];
      return await db.getPortfolioCollectionsByArtistId(profile.id);
    }),

  updateCollection: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await db.updatePortfolioCollection(id, updates);
      return { success: true };
    }),

  deleteCollection: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deletePortfolioCollection(input.id);
      return { success: true };
    }),

  reorderCollections: protectedProcedure
    .input(z.object({
      updates: z.array(z.object({
        id: z.number(),
        displayOrder: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      await db.reorderPortfolioCollections(input.updates);
      return { success: true };
    }),

  // Items
  uploadItem: protectedProcedure
    .input(z.object({
      collectionId: z.number(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      imageData: z.string(), // base64 encoded
      mimeType: z.string(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.getArtistProfileByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Artist profile not found" });
      }

      const { storagePut } = await import("../storage");
      
      // Convert base64 to buffer
      const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      // Generate unique keys for full image and thumbnail
      const fileExtension = input.mimeType.split("/")[1];
      const timestamp = Date.now();
      const fileKey = `portfolio/${profile.id}/${timestamp}.${fileExtension}`;
      
      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);
      
      // Create portfolio item
      return await db.createPortfolioItem({
        collectionId: input.collectionId,
        title: input.title,
        description: input.description,
        imageUrl: url,
        thumbnailUrl: url, // Using same URL for now, can add thumbnail generation later
        isFeatured: input.isFeatured,
      });
    }),

  getItems: publicProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPortfolioItemsByCollectionId(input.collectionId);
    }),

  getArtistItems: publicProcedure
    .input(z.object({ artistId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPortfolioItemsByArtistId(input.artistId);
    }),

  getFeaturedItems: publicProcedure
    .input(z.object({ artistId: z.number(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      return await db.getFeaturedPortfolioItems(input.artistId, input.limit);
    }),

  updateItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await db.updatePortfolioItem(id, updates);
      return { success: true };
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deletePortfolioItem(input.id);
      return { success: true };
    }),

  reorderItems: protectedProcedure
    .input(z.object({
      updates: z.array(z.object({
        id: z.number(),
        displayOrder: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      await db.reorderPortfolioItems(input.updates);
      return { success: true };
    }),
});
