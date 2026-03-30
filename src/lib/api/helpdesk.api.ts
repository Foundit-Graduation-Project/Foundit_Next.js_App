import api  from "./axios";
import { ENDPOINTS } from "./endpoints";
import {
  Conversation,
  Message,
  CreateConversationPayload,
  SendMessagePayload,
  SupportTicketPayload,
  ChatResponse,
} from "../../types/helpdesk.types";

export const helpdeskApi = {
  getConversations: async () => {
    const response = await api.get<ChatResponse<Conversation[]>>(
      ENDPOINTS.CHAT.CONVERSATIONS
    );
    return response.data;
  },

  createConversation: async (payload: CreateConversationPayload) => {
    const response = await api.post<ChatResponse<Conversation>>(
      ENDPOINTS.CHAT.CONVERSATIONS,
      payload
    );
    return response.data;
  },

  getConversationMessages: async (conversationId: string, before?: string) => {
    const url = before 
      ? `${ENDPOINTS.CHAT.MESSAGES}/${conversationId}?before=${before}`
      : `${ENDPOINTS.CHAT.MESSAGES}/${conversationId}`;
    const response = await api.get<ChatResponse<Message[]>>(url);
    return response.data;
  },

  sendConversationMessage: async (payload: SendMessagePayload) => {
    let response;
    if (payload.attachments && payload.attachments.length > 0) {
      const formData = new FormData();
      formData.append("conversationId", payload.conversationId);
      if (payload.content) {
        formData.append("content", payload.content);
      }
      payload.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      response = await api.post<ChatResponse<Message>>(
        ENDPOINTS.CHAT.MESSAGES,
        formData
      );
    } else {
      response = await api.post<ChatResponse<Message>>(
        ENDPOINTS.CHAT.MESSAGES,
        payload
      );
    }
    return response.data;
  },

  /**
   * Phase 3 Extension: Claim an unassigned support ticket
   */
  claimTicket: async (conversationId: string) => {
    const response = await api.post<ChatResponse<Conversation>>(
      `/support/${conversationId}/claim`
    );
    return response.data;
  },
};
