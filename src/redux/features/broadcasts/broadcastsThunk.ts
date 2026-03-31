import { createAsyncThunk } from "@reduxjs/toolkit";
import { broadcastsApi } from "@/lib/api/broadcasts.api";
import { BroadcastFormData, Broadcast, SendBroadcastResponse } from "@/types/broadcast.types";

export const fetchBroadcasts = createAsyncThunk(
  "broadcasts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await broadcastsApi.getBroadcasts();
      return data;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to fetch broadcasts");
    }
  }
);

export const sendBroadcast = createAsyncThunk(
  "broadcasts/send",
  async (broadcastData: BroadcastFormData, { rejectWithValue }) => {
    try {
      const result = await broadcastsApi.sendBroadcast(broadcastData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to send broadcast");
    }
  }
);
