import { createAsyncThunk } from "@reduxjs/toolkit";
import { helpdeskApi } from "../../../lib/api/helpdesk.api";
import {
  CreateConversationPayload,
  SendMessagePayload,
  SupportTicketPayload,
} from "../../../types/helpdesk.types";

export const fetchConversationsThunk = createAsyncThunk(
  "helpdesk/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await helpdeskApi.getConversations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

export const createConversationThunk = createAsyncThunk(
  "helpdesk/createConversation",
  async (payload: CreateConversationPayload, { rejectWithValue }) => {
    try {
      const response = await helpdeskApi.createConversation(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create conversation");
    }
  }
);

export const fetchConversationMessagesThunk = createAsyncThunk(
  "helpdesk/fetchMessages",
  async ({ conversationId, before }: { conversationId: string; before?: string }, { rejectWithValue }) => {
    try {
      const response = await helpdeskApi.getConversationMessages(conversationId, before);
      return { messages: response.data, before };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  "helpdesk/sendMessage",
  async (payload: SendMessagePayload, { rejectWithValue }) => {
    try {
      const response = await helpdeskApi.sendConversationMessage(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

/**
 * Phase 3 support thunk: Claim ticket
 */
export const claimTicketThunk = createAsyncThunk(
  "helpdesk/claimTicket",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await helpdeskApi.claimTicket(conversationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to claim ticket");
    }
  }
);

