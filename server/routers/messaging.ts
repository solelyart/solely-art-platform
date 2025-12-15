import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import * as notifications from "../notifications";

export const messagingRouter = router({
  // Get all conversations for current user
  getMyConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await db.getConversationsByUserId(ctx.user.id);
    
    // Enrich with participant info and unread count
    const enriched = await Promise.all(conversations.map(async (conv) => {
      const otherUserId = conv.participant1Id === ctx.user.id ? conv.participant2Id : conv.participant1Id;
      const otherUser = await db.getUserById(otherUserId);
      const messages = await db.getMessagesByConversationId(conv.id);
      const unreadCount = messages.filter(m => m.senderId !== ctx.user.id && !m.isRead).length;
      
      return {
        ...conv,
        otherUser,
        unreadCount,
        lastMessage: messages[messages.length - 1],
      };
    }));
    
    return enriched;
  }),
  
  // Get or create conversation with another user
  getOrCreateConversation: protectedProcedure
    .input(z.object({ otherUserId: z.number(), bookingId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Check if conversation already exists
      let conversation = await db.getConversationByParticipants(ctx.user.id, input.otherUserId);
      
      if (!conversation) {
        // Create new conversation
        conversation = await db.createConversation({
          participant1Id: ctx.user.id,
          participant2Id: input.otherUserId,
          bookingId: input.bookingId,
        });
      }
      
      return conversation;
    }),
  
  // Get messages for a conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify user is participant
      const conversation = await db.getConversationById(input.conversationId);
      if (!conversation || (conversation.participant1Id !== ctx.user.id && conversation.participant2Id !== ctx.user.id)) {
        throw new Error("Unauthorized");
      }
      
      const messages = await db.getMessagesByConversationId(input.conversationId);
      
      // Enrich with sender info
      const enriched = await Promise.all(messages.map(async (msg) => {
        const sender = await db.getUserById(msg.senderId);
        return { ...msg, sender };
      }));
      
      return enriched;
    }),
  
  // Send a message
  sendMessage: protectedProcedure
    .input(z.object({ 
      conversationId: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify user is participant
      const conversation = await db.getConversationById(input.conversationId);
      if (!conversation || (conversation.participant1Id !== ctx.user.id && conversation.participant2Id !== ctx.user.id)) {
        throw new Error("Unauthorized");
      }
      
      const message = await db.createMessage({
        conversationId: input.conversationId,
        senderId: ctx.user.id,
        content: input.content,
      });
      
      // Send notification to other user
      const otherUserId = conversation.participant1Id === ctx.user.id ? conversation.participant2Id : conversation.participant1Id;
      const sender = await db.getUserById(ctx.user.id);
      const recipient = await db.getUserById(otherUserId);
      
      if (sender && recipient) {
        await notifications.notifyNewMessage({
          senderName: sender.name || "Someone",
          recipientName: recipient.name || "User",
          messagePreview: input.content.substring(0, 100) + (input.content.length > 100 ? "..." : ""),
        });
      }
      
      return message;
    }),
  
  // Mark messages as read
  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.markMessagesAsRead(input.conversationId, ctx.user.id);
      return { success: true };
    }),
  
  // Get unread message count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await db.getUnreadMessageCount(ctx.user.id);
    return { count };
  }),
});
