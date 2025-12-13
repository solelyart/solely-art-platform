import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle } from "lucide-react";

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const { data: conversations, isLoading: conversationsLoading } = trpc.messaging.getMyConversations.useQuery();
  const { data: messages, isLoading: messagesLoading } = trpc.messaging.getMessages.useQuery(
    { conversationId: selectedConversationId! },
    { enabled: !!selectedConversationId }
  );

  const sendMessageMutation = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setMessageInput("");
      // Invalidate to refresh messages
      trpc.useUtils().messaging.getMessages.invalidate();
      trpc.useUtils().messaging.getMyConversations.invalidate();
    },
  });

  const markAsReadMutation = trpc.messaging.markAsRead.useMutation({
    onSuccess: () => {
      trpc.useUtils().messaging.getMyConversations.invalidate();
    },
  });

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    markAsReadMutation.mutate({ conversationId });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content: messageInput.trim(),
    });
  };

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-serif mb-8">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <Card className="p-4 md:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            
            {conversationsLoading ? (
              <div className="text-center text-muted-foreground py-8">Loading...</div>
            ) : !conversations || conversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversationId === conv.id
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {conv.otherUser?.name || "Unknown User"}
                          </p>
                          {conv.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>

          {/* Message Thread */}
          <Card className="p-4 md:col-span-2 flex flex-col">
            {!selectedConversationId ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="pb-4 border-b mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedConversation?.otherUser?.name || "Unknown User"}
                  </h2>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 pr-4 mb-4">
                  {messagesLoading ? (
                    <div className="text-center text-muted-foreground py-8">Loading messages...</div>
                  ) : !messages || messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.sender?.id === selectedConversation?.participant1Id || 
                                     msg.sender?.id === selectedConversation?.participant2Id;
                        const isSentByMe = msg.senderId === selectedConversation?.participant1Id;
                        
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isSentByMe
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
