import { createSlice } from "@reduxjs/toolkit";
import { fetchCommunities, toggleStatus, createCommunityAction } from "./communitiesThunk";

const communitiesSlice = createSlice({
  name: "communities",
  initialState: { data: [] as any[], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommunities.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCommunities.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(toggleStatus.fulfilled, (state, action) => {
      const index = state.data.findIndex((item: any) => item._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    });
    builder.addCase(createCommunityAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data.unshift(action.payload);
    });
  },
});

export default communitiesSlice.reducer;