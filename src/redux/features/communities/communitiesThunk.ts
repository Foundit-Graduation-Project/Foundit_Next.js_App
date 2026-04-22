import { createAsyncThunk } from "@reduxjs/toolkit";
import { communitiesApi } from "@/lib/api/communities.api";

export const fetchCommunities = createAsyncThunk(
  "communities/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await communitiesApi.getCommunities();
      return response.data.communities;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "communities/toggleStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await communitiesApi.toggleCommunityStatus(id, status);
      return response.data.community;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createCommunityAction = createAsyncThunk(
  "communities/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await communitiesApi.createCommunity(data);
      return response.data.community;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
