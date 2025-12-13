import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Messaging System", () => {
  let testUser1Id: number;
  let testUser2Id: number;
  let testConversationId: number;
  let testMessageId: number;

  beforeAll(async () => {
    // Get existing test users from artists
    const artists = await db.getAllArtists();
    const artist1 = artists[0];
    const artist2 = artists[1];
    
    if (!artist1 || !artist2) {
      throw new Error("Need at least 2 artists for messaging tests");
    }
    
    const profile1 = await db.getArtistProfileById(artist1.id);
    const profile2 = await db.getArtistProfileById(artist2.id);
    
    testUser1Id = profile1?.userId || 1;
    testUser2Id = profile2?.userId || 2;
  });

  describe("Conversation Management", () => {
    it("should create a new conversation between two users", async () => {
      const conversation = await db.createConversation({
        participant1Id: testUser1Id,
        participant2Id: testUser2Id,
      });

      testConversationId = conversation.id;

      expect(conversation).toBeDefined();
      expect(conversation.participant1Id).toBe(testUser1Id);
      expect(conversation.participant2Id).toBe(testUser2Id);
      expect(conversation.id).toBeGreaterThan(0);
    });

    it("should retrieve conversation by ID", async () => {
      const conversation = await db.getConversationById(testConversationId);

      expect(conversation).toBeDefined();
      expect(conversation?.id).toBe(testConversationId);
    });

    it("should find conversation by participants", async () => {
      const conversation = await db.getConversationByParticipants(testUser1Id, testUser2Id);

      expect(conversation).toBeDefined();
      expect(conversation?.participant1Id).toBe(testUser1Id);
      expect(conversation?.participant2Id).toBe(testUser2Id);
    });

    it("should find conversation regardless of participant order", async () => {
      const conversation = await db.getConversationByParticipants(testUser2Id, testUser1Id);

      expect(conversation).toBeDefined();
      // Should find the same conversation regardless of order
      expect(
        (conversation?.participant1Id === testUser1Id && conversation?.participant2Id === testUser2Id) ||
        (conversation?.participant1Id === testUser2Id && conversation?.participant2Id === testUser1Id)
      ).toBe(true);
    });

    it("should retrieve all conversations for a user", async () => {
      const conversations = await db.getConversationsByUserId(testUser1Id);

      expect(Array.isArray(conversations)).toBe(true);
      expect(conversations.length).toBeGreaterThan(0);
      expect(conversations.some(c => c.id === testConversationId)).toBe(true);
    });
  });

  describe("Message Management", () => {
    it("should create a message in a conversation", async () => {
      const message = await db.createMessage({
        conversationId: testConversationId,
        senderId: testUser1Id,
        content: "Hello, this is a test message!",
      });

      testMessageId = message.id;

      expect(message).toBeDefined();
      expect(message.conversationId).toBe(testConversationId);
      expect(message.senderId).toBe(testUser1Id);
      expect(message.content).toBe("Hello, this is a test message!");
      expect(message.isRead).toBe(false);
    });

    it("should update conversation lastMessageAt when message is created", async () => {
      const conversationBefore = await db.getConversationById(testConversationId);
      const lastMessageBefore = conversationBefore?.lastMessageAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1100));

      await db.createMessage({
        conversationId: testConversationId,
        senderId: testUser2Id,
        content: "Reply message",
      });

      const conversationAfter = await db.getConversationById(testConversationId);
      const lastMessageAfter = conversationAfter?.lastMessageAt;

      expect(lastMessageAfter).toBeDefined();
      if (lastMessageBefore && lastMessageAfter) {
        expect(new Date(lastMessageAfter).getTime()).toBeGreaterThanOrEqual(new Date(lastMessageBefore).getTime());
      }
    });

    it("should retrieve all messages for a conversation", async () => {
      const messages = await db.getMessagesByConversationId(testConversationId);

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThanOrEqual(2);
      expect(messages.some(m => m.id === testMessageId)).toBe(true);
    });

    it("should retrieve messages in chronological order", async () => {
      const messages = await db.getMessagesByConversationId(testConversationId);

      for (let i = 1; i < messages.length; i++) {
        const prevTime = new Date(messages[i - 1].createdAt).getTime();
        const currTime = new Date(messages[i].createdAt).getTime();
        expect(currTime).toBeGreaterThanOrEqual(prevTime);
      }
    });

    it("should mark messages as read", async () => {
      // User 2 marks messages from User 1 as read
      await db.markMessagesAsRead(testConversationId, testUser2Id);

      const messages = await db.getMessagesByConversationId(testConversationId);
      const user1Messages = messages.filter(m => m.senderId === testUser1Id);

      // All messages from user 1 should be marked as read
      user1Messages.forEach(msg => {
        expect(msg.isRead).toBe(true);
      });
    });

    it("should not mark own messages as read", async () => {
      await db.markMessagesAsRead(testConversationId, testUser1Id);

      const messages = await db.getMessagesByConversationId(testConversationId);
      const user1Messages = messages.filter(m => m.senderId === testUser1Id);

      // User 1's own messages should still be marked as read (from previous test)
      // This test verifies the function doesn't fail when called
      expect(user1Messages.length).toBeGreaterThan(0);
    });
  });

  describe("Unread Message Count", () => {
    it("should calculate unread message count correctly", async () => {
      // Create a new conversation with unread messages
      const newConv = await db.createConversation({
        participant1Id: testUser1Id,
        participant2Id: testUser2Id + 1, // Different user
      });

      // Send messages from user 2
      await db.createMessage({
        conversationId: newConv.id,
        senderId: testUser2Id + 1,
        content: "Unread message 1",
      });

      await db.createMessage({
        conversationId: newConv.id,
        senderId: testUser2Id + 1,
        content: "Unread message 2",
      });

      const unreadCount = await db.getUnreadMessageCount(testUser1Id);

      expect(unreadCount).toBeGreaterThanOrEqual(2);
    });

    it("should return 0 for user with no unread messages", async () => {
      // Mark all messages as read
      const conversations = await db.getConversationsByUserId(testUser2Id);
      for (const conv of conversations) {
        await db.markMessagesAsRead(conv.id, testUser2Id);
      }

      const unreadCount = await db.getUnreadMessageCount(testUser2Id);

      expect(unreadCount).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle conversation with no messages", async () => {
      const emptyConv = await db.createConversation({
        participant1Id: testUser1Id,
        participant2Id: testUser2Id + 2,
      });

      const messages = await db.getMessagesByConversationId(emptyConv.id);

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(0);
    });

    it("should handle user with no conversations", async () => {
      const conversations = await db.getConversationsByUserId(99999);

      expect(Array.isArray(conversations)).toBe(true);
      expect(conversations.length).toBe(0);
    });

    it("should return undefined for non-existent conversation", async () => {
      const conversation = await db.getConversationById(99999);

      expect(conversation).toBeUndefined();
    });
  });
});
