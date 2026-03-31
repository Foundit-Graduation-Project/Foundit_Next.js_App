import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBroadcasts, sendBroadcast } from "./broadcastsThunk";
import { Broadcast, SendBroadcastResponse } from "@/types/broadcast.types";

interface BroadcastsState {
  items: Broadcast[];
  loading: boolean;
  error: string | null;
  sendSuccess: boolean;
  lastSendResult: SendBroadcastResponse | null;
}

const initialState: BroadcastsState = {
  items: [],
  loading: false,
  error: null,
  sendSuccess: false,
  lastSendResult: null,
};

const broadcastsSlice = createSlice({
  name: "broadcasts",
  initialState,
  reducers: {
    setBroadcasts: (state, action: PayloadAction<Broadcast[]>) => {
      state.items = action.payload;
    },
    resetSendSuccess: (state) => {
      state.sendSuccess = false;
      state.lastSendResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Broadcasts
    builder
      .addCase(fetchBroadcasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBroadcasts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBroadcasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send Broadcast
    builder
      .addCase(sendBroadcast.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sendSuccess = false;
      })
      .addCase(sendBroadcast.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSendResult = action.payload;
        state.sendSuccess = true;
      })
      .addCase(sendBroadcast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.sendSuccess = false;
      });
  },
});

export const { setBroadcasts, resetSendSuccess, clearError } = broadcastsSlice.actions;
export default broadcastsSlice.reducer;
