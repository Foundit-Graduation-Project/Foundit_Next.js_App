import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "../../../types/helpdesk.types";
import {
  fetchConversationsThunk,
  fetchConversationMessagesThunk,
  sendMessageThunk,
  claimTicketThunk,
} from "./helpdeskThunk";

interface HelpdeskState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  hasMoreMessages: boolean;
  onlineUsers: string[];
  typingUsers: Record<string, boolean>;
  error: string | null;
}

const initialState: HelpdeskState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  hasMoreMessages: true,
  onlineUsers: [],
  typingUsers: {},
  error: null,
};

const helpdeskSlice = createSlice({
  name: "helpdesk",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      state.messages = [];
      state.hasMoreMessages = true;
      
      if (action.payload) {
        const convIndex = state.conversations.findIndex(c => c._id === action.payload);
        if (convIndex !== -1) {
          (state.conversations[convIndex] as any).unread = false;
        }
      }
    },
    addSocketMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const conversationObj = (message as any).conversationId || (message as any).conversation;
      const conversationIdStr = typeof conversationObj === "object" ? conversationObj._id : conversationObj;

      if (state.activeConversationId === conversationIdStr) {
        if (!state.messages.find(m => m._id === message._id)) {
          state.messages.push(message);
        }
      }

      const convIndex = state.conversations.findIndex(c => c._id === conversationIdStr);
      if (convIndex !== -1) {
        const conv = state.conversations[convIndex];
        conv.lastMessage = {
          content: message.content,
          createdAt: message.createdAt
        } as any;
        
        state.conversations.splice(convIndex, 1);
        state.conversations.unshift(conv);

        if (state.activeConversationId !== conversationIdStr) {
          (conv as any).unread = true;
        }
      } else if (typeof conversationObj === "object" && conversationObj._id) {
        const newConv = {
          _id: conversationObj._id,
          participants: conversationObj.participants || [],
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt
          },
          updatedAt: message.createdAt,
          unread: true,
          isSupport: (conversationObj as any).isSupport,
          assignedTo: (conversationObj as any).assignedTo,
        };
        state.conversations.unshift(newConv as any);
      }
    },
    updateMessagesSeen: (state, action: PayloadAction<{ conversationId: string; seenBy: string }>) => {
      const { conversationId } = action.payload;
      if (state.activeConversationId === conversationId) {
        state.messages = state.messages.map(m => ({
          ...m,
          seen: true
        }));
      }
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setTypingStatus: (state, action: PayloadAction<{ chatId: string; isTyping: boolean }>) => {
      const { chatId, isTyping } = action.payload;
      state.typingUsers[chatId] = isTyping;
    },
    updateConversationAssignment: (state, action: PayloadAction<{ conversationId: string; assignedTo: any }>) => {
      const { conversationId, assignedTo } = action.payload;
      const conv = state.conversations.find(c => c._id === conversationId);
      if (conv) {
        conv.assignedTo = assignedTo;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversationsThunk.pending, (state) => {
      state.isLoadingConversations = true;
      state.error = null;
    });
    builder.addCase(fetchConversationsThunk.fulfilled, (state, action) => {
      state.isLoadingConversations = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversationsThunk.rejected, (state, action) => {
      state.isLoadingConversations = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchConversationMessagesThunk.pending, (state, action) => {
      const isPagination = action.meta.arg.before;
      if (!isPagination) {
        state.isLoadingMessages = true;
      }
      state.error = null;
    });
    builder.addCase(fetchConversationMessagesThunk.fulfilled, (state, action) => {
      state.isLoadingMessages = false;
      const { messages, before } = action.payload;
      if (messages.length === 0 && !before) {
        state.hasMoreMessages = false;
      }
      if (before) {
        const existingIds = new Set(state.messages.map(m => m._id));
        const newMessages = messages.filter((m: any) => !existingIds.has(m._id));
        state.messages.unshift(...newMessages);
      } else {
        state.messages = messages;
        state.hasMoreMessages = messages.length > 0;
      }
    });

    builder.addCase(sendMessageThunk.pending, (state) => {
      state.isSendingMessage = true;
    });
    builder.addCase(sendMessageThunk.fulfilled, (state) => {
      state.isSendingMessage = false;
    });

    builder.addCase(claimTicketThunk.fulfilled, (state, action) => {
      const updatedConv = action.payload;
      const index = state.conversations.findIndex(c => c._id === updatedConv._id);
      if (index !== -1) {
        state.conversations[index] = updatedConv;
      } else {
        state.conversations.unshift(updatedConv);
      }
    });
  },
});

export const { 
  setActiveConversation, 
  clearError, 
  addSocketMessage, 
  updateMessagesSeen,
  setOnlineUsers,
  setTypingStatus,
  updateConversationAssignment,
} = helpdeskSlice.actions;
export default helpdeskSlice.reducer;
