import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";
import { createTestArtist } from "./test-utils";

describe("Portfolio Builder", () => {
  let testArtistId: number;

  beforeAll(async () => {
    const { artist } = await createTestArtist();
    testArtistId = artist.id;
  });

  describe("Portfolio Collections", () => {
    it("should create a portfolio collection", async () => {
      const collection = await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "Portrait Photography",
        description: "Professional portrait work",
        isFeatured: true,
      });

      expect(collection).toBeDefined();
      expect(collection.title).toBe("Portrait Photography");
      expect(collection.isFeatured).toBe(true);
    });

    it("should get collections by artist ID", async () => {
      await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "Landscape Photography",
        description: "Nature and landscape shots",
      });

      const collections = await db.getPortfolioCollectionsByArtistId(testArtistId);
      expect(collections.length).toBeGreaterThanOrEqual(2);
      expect(collections.some((c) => c.title === "Landscape Photography")).toBe(true);
    });

    it("should update a collection", async () => {
      const collection = await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "Original Title",
      });

      await db.updatePortfolioCollection(collection.id, {
        title: "Updated Title",
        isFeatured: true,
      });

      const collections = await db.getPortfolioCollectionsByArtistId(testArtistId);
      const updated = collections.find((c) => c.id === collection.id);
      expect(updated?.title).toBe("Updated Title");
      expect(updated?.isFeatured).toBe(true);
    });

    it("should reorder collections", async () => {
      const col1 = await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "Collection 1",
      });
      const col2 = await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "Collection 2",
      });

      await db.reorderPortfolioCollections([
        { id: col1.id, displayOrder: 5 },
        { id: col2.id, displayOrder: 1 },
      ]);

      const collections = await db.getPortfolioCollectionsByArtistId(testArtistId);
      const reordered1 = collections.find((c) => c.id === col1.id);
      const reordered2 = collections.find((c) => c.id === col2.id);
      
      expect(reordered1?.displayOrder).toBe(5);
      expect(reordered2?.displayOrder).toBe(1);
    });

    it("should delete a collection", async () => {
      const collection = await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "To Be Deleted",
      });

      await db.deletePortfolioCollection(collection.id);

      const collections = await db.getPortfolioCollectionsByArtistId(testArtistId);
      expect(collections.find((c) => c.id === collection.id)).toBeUndefined();
    });
  });

  describe("Portfolio Items", () => {
    let testCollectionId: number;

    beforeAll(async () => {
      const collection = await db.createPortfolioCollection({
        artistId: testArtistId,
        title: "Test Collection for Items",
      });
      testCollectionId = collection.id;
    });

    it("should create a portfolio item", async () => {
      const item = await db.createPortfolioItem({
        collectionId: testCollectionId,
        title: "Beautiful Sunset",
        description: "A stunning sunset photograph",
        imageUrl: "https://example.com/sunset.jpg",
        thumbnailUrl: "https://example.com/sunset-thumb.jpg",
        isFeatured: true,
      });

      expect(item).toBeDefined();
      expect(item.title).toBe("Beautiful Sunset");
      expect(item.isFeatured).toBe(true);
    });

    it("should get items by collection ID", async () => {
      await db.createPortfolioItem({
        collectionId: testCollectionId,
        title: "Mountain View",
        imageUrl: "https://example.com/mountain.jpg",
      });

      const items = await db.getPortfolioItemsByCollectionId(testCollectionId);
      expect(items.length).toBeGreaterThanOrEqual(2);
      expect(items.some((item) => item.title === "Mountain View")).toBe(true);
    });

    it("should get items by artist ID", async () => {
      const items = await db.getPortfolioItemsByArtistId(testArtistId);
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]).toHaveProperty("item");
      expect(items[0]).toHaveProperty("collection");
    });

    it("should get featured items", async () => {
      const featured = await db.getFeaturedPortfolioItems(testArtistId, 5);
      expect(featured.length).toBeGreaterThan(0);
      expect(featured.every((row) => row.item.isFeatured)).toBe(true);
    });

    it("should update a portfolio item", async () => {
      const item = await db.createPortfolioItem({
        collectionId: testCollectionId,
        title: "Original Item",
        imageUrl: "https://example.com/original.jpg",
      });

      await db.updatePortfolioItem(item.id, {
        title: "Updated Item",
        isFeatured: true,
      });

      const items = await db.getPortfolioItemsByCollectionId(testCollectionId);
      const updated = items.find((i) => i.id === item.id);
      expect(updated?.title).toBe("Updated Item");
      expect(updated?.isFeatured).toBe(true);
    });

    it("should reorder items", async () => {
      const item1 = await db.createPortfolioItem({
        collectionId: testCollectionId,
        title: "Item 1",
        imageUrl: "https://example.com/1.jpg",
      });
      const item2 = await db.createPortfolioItem({
        collectionId: testCollectionId,
        title: "Item 2",
        imageUrl: "https://example.com/2.jpg",
      });

      await db.reorderPortfolioItems([
        { id: item1.id, displayOrder: 10 },
        { id: item2.id, displayOrder: 5 },
      ]);

      const items = await db.getPortfolioItemsByCollectionId(testCollectionId);
      const reordered1 = items.find((i) => i.id === item1.id);
      const reordered2 = items.find((i) => i.id === item2.id);
      
      expect(reordered1?.displayOrder).toBe(10);
      expect(reordered2?.displayOrder).toBe(5);
    });

    it("should delete a portfolio item", async () => {
      const item = await db.createPortfolioItem({
        collectionId: testCollectionId,
        title: "To Be Deleted",
        imageUrl: "https://example.com/delete.jpg",
      });

      await db.deletePortfolioItem(item.id);

      const items = await db.getPortfolioItemsByCollectionId(testCollectionId);
      expect(items.find((i) => i.id === item.id)).toBeUndefined();
    });
  });

  describe("Portfolio Display Logic", () => {
    it("should handle empty portfolio gracefully", async () => {
      const { artist: newArtist } = await createTestArtist();
      const collections = await db.getPortfolioCollectionsByArtistId(newArtist.id);
      const items = await db.getPortfolioItemsByArtistId(newArtist.id);
      
      expect(collections).toEqual([]);
      expect(items).toEqual([]);
    });

    it("should filter featured items correctly", async () => {
      const { artist } = await createTestArtist();
      const collection = await db.createPortfolioCollection({
        artistId: artist.id,
        title: "Featured Test",
      });

      await db.createPortfolioItem({
        collectionId: collection.id,
        title: "Featured 1",
        imageUrl: "https://example.com/f1.jpg",
        isFeatured: true,
      });
      await db.createPortfolioItem({
        collectionId: collection.id,
        title: "Not Featured",
        imageUrl: "https://example.com/nf.jpg",
        isFeatured: false,
      });
      await db.createPortfolioItem({
        collectionId: collection.id,
        title: "Featured 2",
        imageUrl: "https://example.com/f2.jpg",
        isFeatured: true,
      });

      const featured = await db.getFeaturedPortfolioItems(artist.id);
      expect(featured.length).toBe(2);
      expect(featured.every((row) => row.item.isFeatured)).toBe(true);
    });

    it("should respect display order in collections", async () => {
      const { artist } = await createTestArtist();
      
      const col1 = await db.createPortfolioCollection({
        artistId: artist.id,
        title: "Collection A",
      });
      const col2 = await db.createPortfolioCollection({
        artistId: artist.id,
        title: "Collection B",
      });
      const col3 = await db.createPortfolioCollection({
        artistId: artist.id,
        title: "Collection C",
      });

      await db.reorderPortfolioCollections([
        { id: col1.id, displayOrder: 2 },
        { id: col2.id, displayOrder: 0 },
        { id: col3.id, displayOrder: 1 },
      ]);

      const collections = await db.getPortfolioCollectionsByArtistId(artist.id);
      expect(collections[0].title).toBe("Collection B");
      expect(collections[1].title).toBe("Collection C");
      expect(collections[2].title).toBe("Collection A");
    });
  });
});
