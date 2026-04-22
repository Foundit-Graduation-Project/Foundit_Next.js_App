import axios from "./axios";
import { BroadcastFormData, Broadcast, SendBroadcastResponse } from "@/types/broadcast.types";

const BROADCASTS_BASE_URL = "/admin/broadcasts";

export const broadcastsApi = {
  // Fetch broadcast history
  getBroadcasts: async (): Promise<Broadcast[]> => {
    try {
      const response = await axios.get<{ data: Broadcast[] }>(BROADCASTS_BASE_URL);
      return response.data.data || [];
    } catch (error) {
      console.error("[Broadcasts API] Error fetching broadcasts:", error);
      throw error;
    }
  },

  // Send a broadcast to all users
  sendBroadcast: async (data: BroadcastFormData): Promise<SendBroadcastResponse> => {
    try {
      const response = await axios.post<{ data: SendBroadcastResponse }>(
        BROADCASTS_BASE_URL,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("[Broadcasts API] Error sending broadcast:", error);
      throw error;
    }
  },
};
