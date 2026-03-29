import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTickets = createAsyncThunk(
  "helpdesk/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
