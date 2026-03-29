import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCommunities = createAsyncThunk(
  "communities/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
